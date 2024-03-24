import React, {ImgHTMLAttributes} from 'react'
import {useFrame} from 'frames.js/render/use-frame'
import {fallbackFrameContext, FrameUI} from 'frames.js/render'
import {mockFarcasterSigner, signFrameAction} from 'frames.js/render/farcaster'

type FrameComponentProps = {
    tab: chrome.tabs.Tab;
};

function FrameImage(
    props: ImgHTMLAttributes<HTMLImageElement> & { src: string }
) {
    return (
        <img
            {...props}
            alt={props.alt ?? ""}
            sizes="100vw"
            height={0}
            width={0}
        />
    );
}

const TabFrame: React.FC<FrameComponentProps> = ({ tab }) => {
    // const onTransaction: OnTransactionFunc = useCallback(
    //     async ({ transactionData }) => {
    //         const { params, chainId, method } = transactionData;
    //         if (!chainId.startsWith("eip155:")) {
    //             alert(`debugger: Unrecognized chainId ${chainId}`);
    //             return null;
    //         }
    //
    //         console.log('onTransaction: transactionData params', params, 'chainId', chainId, 'method', method);
            //     if (!account.address) {
            //         openConnectModal?.();
            //         return null;
            //     }
            //
            //     const requestedChainId = parseInt(chainId.split("eip155:")[1]!);
            //
            //     if (currentChainId !== requestedChainId) {
            //         console.log("switching chain");
            //         await switchChain(config, {
            //             chainId: requestedChainId,
            //         });
            //     }
            //
            //     try {
            //         // Send the transaction
            //         console.log("sending tx");
            //         const transactionId = await sendTransaction(config, {
            //             to: params.to,
            //             data: params.data,
            //             value: BigInt(params.value),
            //         });
            //         return transactionId;
            //     } catch (error) {
            //         console.error(error);
            //         return null;
            //     }
        // },
        // [account.address, currentChainId, config, openConnectModal]
    // );

    console.log('TabFrame: tab.url', tab.url);
    const frameState = useFrame({
        homeframeUrl: tab.url!,
        frameActionProxy: "https://localhost:3000/frames",
        frameGetProxy: "https://localhost:3000/frames",
        frameContext: fallbackFrameContext,
        signerState: {
            // TODO: replace with your signer
            signer: mockFarcasterSigner,
            hasSigner: true,
            onSignerlessFramePress: () => {
                // Implement me
                alert("A frame button was pressed without a signer.");
            },
            signFrameAction: signFrameAction,
        },
        onTransaction: async (args) => {
            const { params, chainId, method } = args.transactionData;
            console.log('onTransaction: transactionData params', params, 'chainId', chainId, 'method', method);
            return '0x00'
        },
        onMint: (args) => {
            console.log('onMint: args', args);
        },
        dangerousSkipSigning: true
    });

    return (
        <div className="w-full">
            <FrameUI frameState={frameState} theme={{}} FrameImage={FrameImage} />
        </div>
    );
}

export default TabFrame;