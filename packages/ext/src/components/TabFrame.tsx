import React, {ImgHTMLAttributes} from 'react'
import {useFrame} from 'frames.js/render/use-frame'
import {fallbackFrameContext, FrameUI} from 'frames.js/render'
import {mockFarcasterSigner, signFrameAction} from 'frames.js/render/farcaster'

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
    const frameState = useFrame({
        homeframeUrl: url,
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
            return '0x00';
        },
        onMint: (args) => {
            console.log('onMint: args', args);
        },
        dangerousSkipSigning: true
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