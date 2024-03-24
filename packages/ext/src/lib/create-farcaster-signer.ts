import * as ed from "@noble/ed25519";
import { mnemonicToAccount } from "viem/accounts";
import {SIGNED_KEY_REQUEST_TYPE, SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN} from '@farcaster/core'
import {FarcasterSigner} from 'frames.js/render'

export const createFarcasterSigner = async (): Promise<FarcasterSigner> => {
    const privateKeyBytes = ed.utils.randomPrivateKey();
    const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes);

    const keypairString = {
        publicKey: "0x" + Buffer.from(publicKeyBytes).toString("hex"),
        privateKey: "0x" + Buffer.from(privateKeyBytes).toString("hex"),
    };
    const appFid = import.meta.env.VITE_FARCASTER_DEVELOPER_FID!;
    const account = mnemonicToAccount(
        import.meta.env.VITE_FARCASTER_DEVELOPER_MNEMONIC!
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day
    const requestFid = parseInt(appFid);
    const signature = await account.signTypedData({
        domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
        types: {
            SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
        },
        primaryType: "SignedKeyRequest",
        message: {
            requestFid: BigInt(appFid),
            key: keypairString.publicKey as `0x`,
            deadline: BigInt(deadline),
        },
    });
    const authData = {
        signature: signature,
        requestFid: requestFid,
        deadline: deadline,
        requestSigner: account.address,
    }
    const {
        result: { signedKeyRequest },
    } = (await (
        await fetch(`https://api.warpcast.com/v2/signed-key-requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                key: keypairString.publicKey,
                signature,
                requestFid,
                deadline,
            }),
        })
    ).json()) as {
        result: { signedKeyRequest: { token: string; deeplinkUrl: string } };
    };
    const signer: FarcasterSigner = {
        ...authData,
        fid: requestFid,
        publicKey: keypairString.publicKey,
        deadline: deadline,
        token: signedKeyRequest.token,
        signerApprovalUrl: signedKeyRequest.deeplinkUrl,
        privateKey: keypairString.privateKey,
        status: "approved",
    };
    return signer;
};