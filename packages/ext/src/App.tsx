'use client'

import {useEffect, useState} from 'react'
import './App.css'
import {type Frame, getFrame} from 'frames.js'
import TabFrame from './components/TabFrame.tsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'

import {useChromeStorageLocal, useChromeStorageSync} from 'use-chrome-storage'
import {WalletIcon} from 'lucide-react'
import {Profile} from '@/types/Profile.ts'

const App = () => {
    const [tab, setTab] = useState<chrome.tabs.Tab>()
    const [frame, setFrame] = useState<Frame>()
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const [favorites, setFavorites] = useChromeStorageSync<string[]>('bezel.favorites', [])
    const [profile] = useChromeStorageLocal<Profile>('bezel.profile')

    useEffect(() => {
        if (!profile) {
            chrome.runtime.openOptionsPage();
        }
    }, [profile]);

    useEffect(() => {
        const checkForFrame = async () => {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
            if (!tab.id) return
            setTab(tab)
            console.log('checkForFrame: got tab:', tab)

            const injected = await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: () => document.head.outerHTML
            })
            const doc = injected[0]?.result
            if (!doc || !tab.url) {
                console.error('checkForFrame: No document found')
                return
            }

            const frameData = getFrame({
                htmlString: doc,
                url: tab.url
            })
            if (frameData.frame.version) {
                setFrame(frameData.frame)
                console.log('checkForFrame: Found a frame for ', tab.url, frameData.frame)
            }
        }

        checkForFrame()
    }, [])

    async function share() {
        if (!tab) return
        const url = `https://warpcast.com/~/compose?embeds[]=${tab.url}`
        await chrome.tabs.create({url})
    }

    function toggleFavorite() {
        if (!tab?.url) return
        const url = tab.url
        const favorite = favorites.find(url => url === tab?.url)
        if (favorite) {
            const newFavorites = favorites.filter(url => url !== favorite)
            setFavorites(newFavorites)
            return
        }
        const newFavorites = [...favorites, url]
        setFavorites(newFavorites)
    }

    useEffect(() => {
        const favorite = favorites.find(url => url === tab?.url)
        setIsFavorite(favorite !== undefined)
    }, [favorites])

    return profile && (
        frame?.version && tab ? (
            <div className="w-full h-full flex flex-col pb-2">
                <div className="w-full flex items-center">
                    <div className="py-2 px-3 h-fit">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <img src={profile?.pfpUrl} alt="icon"
                                     className="h-8 w-8 rounded-full object-cover"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel><WalletIcon size="14" className="inline"/><span
                                    className="pl-2 pr-1">{profile?.username}</span></DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={() => chrome.runtime.openOptionsPage()}>Dashboard</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex-grow flex justify-end gap-3 py-2 px-3 h-fit">
                        <TooltipProvider>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                    <button onClick={toggleFavorite}
                                            className="flex justify-center items-center px-3 py-1.5 border border-zinc-700
                                            text-xs text-gray-400 font-semibold rounded-full opacity-60 hover:opacity-100">
                                        {isFavorite ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 className="w-4 h-4"
                                                 viewBox="0 0 576 512">
                                                <path
                                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 className="w-4 h-4"
                                                 viewBox="0 0 576 512">
                                                <path
                                                    d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
                                            </svg>
                                        }
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                    <button onClick={share}
                                            className="flex gap-2 justify-center items-center px-3 py-1.5 border border-zinc-700
                                             text-xs text-gray-400 font-semibold rounded-full opacity-60 hover:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round">
                                            <path
                                                d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3"/>
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Share frame
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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