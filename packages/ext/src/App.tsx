import {useEffect, useState} from 'react'
import './App.css'
import {type Frame, getFrame} from 'frames.js'
import TabFrame from './components/TabFrame.tsx';

const App = () => {
    const [tab, setTab] = useState<chrome.tabs.Tab>();
    const [frame, setFrame] = useState<Frame>();

    useEffect(() => {
        const checkForFrame = async () => {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tab.id) return;
            setTab(tab);
            console.log('checkForFrame: got tab:', tab);

            const injected = await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: () => document.head.outerHTML
            });
            const doc = injected[0]?.result;
            if (!doc || !tab.url) {
                console.error('checkForFrame: No document found');
                return;
            }

            const frameData = getFrame({
                htmlString: doc,
                url: tab.url
            });
            if (frameData.frame.version) {
                setFrame(frameData.frame);
                console.log('checkForFrame: Found a frame for ', tab.url, frameData.frame);
            }
        };

        checkForFrame();
    }, []);

    return (
        frame?.version && tab ? (
            <TabFrame tab={tab} />
        ) : (
            <div className="bg-red-500 h-16 w-16"></div>
        )
    )
}

export default App