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
    const frameState = useFrame({
        // replace with your frame url
        homeframeUrl: tab.url!,
        // corresponds to the name of the route for POST in step 3
        frameActionProxy: "/frames",
        // corresponds to the name of the route for GET in step 3
        frameGetProxy: "/frames",
        frameContext: fallbackFrameContext,
        // map to your identity if you have one
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
    });

    fetch("/frames", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: tab.url }),
    }).catch(console.error);

    return (
        <FrameUI frameState={frameState} theme={{}} FrameImage={FrameImage} />
    );
}

export default TabFrame;