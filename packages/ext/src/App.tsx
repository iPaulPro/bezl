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
            <div className="w-full h-full flex flex-col pb-1">
                <div className="w-full flex justify-end gap-3 py-2 px-3">
                    <button className="flex gap-2 justify-center items-center px-3 py-1.5 border border-gray-400
                     text-xs text-gray-400 font-semibold rounded-full opacity-60 hover:opacity-100">
                        Add to favorites
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                    <button className="flex gap-2 justify-center items-center px-3 py-1.5 border border-gray-400
                     text-xs text-gray-400 font-semibold rounded-full opacity-60 hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3"/>
                        </svg>
                    </button>
                </div>
                <TabFrame tab={tab}/>
            </div>
        ) : (
            <div className="bg-red-500 h-16 w-16"></div>
        )
    )
}

export default App