'use client'

import {useEffect, useState} from 'react'
import './App.css'
import {type Frame, getFrame} from 'frames.js'
import TabFrame from './components/TabFrame.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


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

    async function share() {
        if (!tab) return;
        const url = `https://warpcast.com/~/compose?embeds[]=${tab.url}`
        await chrome.tabs.create({url})
    }

    return (
        frame?.version && tab ? (
            <div className="w-full h-full flex flex-col py-1">
                <div className="w-full flex items-center">
                    <div className="py-2 px-3 h-fit">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <img src="https://cdn.stamp.fyi/avatar/paulburke.lens" alt="icon"
                                     className="h-8 w-8 rounded-full object-cover"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>paulburke.eth</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Change profiles</DropdownMenuItem>
                                <DropdownMenuItem>Favorites</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex-grow flex justify-end gap-3 py-2 px-3 h-fit">
                        <button className="flex gap-2 justify-center items-center px-3 py-1.5 border border-zinc-800
                     text-xs text-gray-400 font-semibold rounded-full opacity-60 hover:opacity-100">
                            Add to favorites
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon
                                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </button>
                        <button onClick={share}
                            className="flex gap-2 justify-center items-center px-3 py-1.5 border border-zinc-800
                     text-xs text-gray-400 font-semibold rounded-full opacity-60 hover:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <TabFrame tab={tab}/>
            </div>
        ) : (
            <div className="bg-red-500 h-16 w-16"></div>
        )
    )
}

export default App