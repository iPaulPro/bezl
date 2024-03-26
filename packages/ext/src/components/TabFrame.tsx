import React, {ImgHTMLAttributes} from 'react'
import {useFrame} from 'frames.js/render/use-frame'
import {fallbackFrameContext, FarcasterSigner, FrameUI} from 'frames.js/render'
import {signFrameAction} from 'frames.js/render/farcaster'
import {useChromeStorageLocal} from 'use-chrome-storage'

type FrameComponentProps = {
    url: string
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

const TabFrame: React.FC<FrameComponentProps> = ({ url }) => {
    const [signer] = useChromeStorageLocal<FarcasterSigner>('bezl.signer')

    const frameState = useFrame({
        homeframeUrl: url,
        frameActionProxy: "https://localhost:3000/frames",
        frameGetProxy: "https://localhost:3000/frames",
        frameContext: fallbackFrameContext,
        signerState: {
            signer: signer,
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
            return '0x00';
        },
        onMint: (args) => {
            console.log('onMint: args', args);
        }
    });

    return (
        <div className="w-full frame-container">
            <FrameUI frameState={frameState} theme={{
                bg: 'transparent',
            }} FrameImage={FrameImage} />
        </div>
    );
}

export default TabFrame;