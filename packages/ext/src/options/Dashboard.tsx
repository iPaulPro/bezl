'use client'

import {useChromeStorageLocal, useChromeStorageSync} from 'use-chrome-storage'
import {Card} from '@/components/ui/card'
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area'
import {useEffect, useState} from 'react'
import TabFrame from '@/components/TabFrame.tsx'
import {Profile} from '@/types/Profile.ts'

const Dashboard = () => {
    const [favorites, setFavorites] = useChromeStorageSync<string[]>('bezel.favorites', [])
    const [trending, setTrending] = useState<string[]>([])
    const [forYou, setForYou] = useState<string[]>([])
    const [profile] = useChromeStorageLocal<Profile>('bezel.profile')

    useEffect(() => {
        fetch('https://graph.cast.k3l.io/frames/global/rankings?details=false&agg=sumsquare&weights=L1C10R5&offset=0&limit=10')
            .then(response => response.json())
            .then(data => setTrending(data.result.map(r => r.url)))
    }, [])

    useEffect(() => {
        if (!profile) return;
        fetch(  'https://graph.cast.k3l.io/frames/personalized/rankings/fids?agg=sumsquare&weights=L1C10R5&k=2&limit=10', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([profile.fid])
        })
            .then(response => response.json())
            .then(data => setForYou(data.result.map(r => r.url)))
    }, [profile])

    function toggleFavorite(url: string) {
        if (url) return
        const favorite = favorites.find(f => f === url)
        if (favorite) {
            const newFavorites = favorites.filter(url => url !== favorite)
            setFavorites(newFavorites)
            return
        }
        const newFavorites = [...favorites, url]
        setFavorites(newFavorites)
    }

    return (
        <div className="w-full min-h-screen pb-8">
            <div className="p-8 flex justify-center">
                <img src={chrome.runtime.getURL('images/icon-128.png')} className="w-6"/>
            </div>
            <div className="container max-w-5xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-semibold tracking-tight">🔥 Trending Frames</h2>
                    <p className="text-base opacity-80">The top Frames on Farcaster</p>
                    <ScrollArea className="w-full whitespace-nowrap pt-4">
                        <ul className="flex w-max gap-6">
                            {trending.map((frame) => (
                                <li key={frame} className="relative">
                                    <Card onClick={() => chrome.tabs.create({url: frame})}
                                          className="w-[300px] rounded-[0.75rem] overflow-hidden cursor-pointer">
                                        <TabFrame url={frame}/>
                                    </Card>
                                    <button onClick={() => toggleFavorite(frame)}
                                            className="absolute right-4 top-4 bg-none">
                                        {favorites.some(f => f === frame) ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 className="w-5 h-5"
                                                 viewBox="0 0 576 512">
                                                <path
                                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 className="w-5 h-5"
                                                 viewBox="0 0 576 512">
                                                <path
                                                    d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
                                            </svg>
                                        }
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6">
                            <ScrollBar orientation="horizontal"/>
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-semibold tracking-tight">✨ For You</h2>
                    <p className="text-base opacity-80">Suggestions based on your personalized social graph</p>
                    <ScrollArea className="w-full whitespace-nowrap pt-4">
                        <ul className="flex w-max gap-6">
                            {forYou.map((frame) => (
                                <li key={frame} className="relative">
                                    <Card onClick={() => chrome.tabs.create({url: frame})}
                                          className="w-[300px] rounded-[0.75rem] overflow-hidden cursor-pointer">
                                        <TabFrame url={frame}/>
                                    </Card>
                                    <button onClick={() => toggleFavorite(frame)}
                                            className="absolute right-4 top-4 bg-none">
                                        {favorites.some(f => f === frame) ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 className="w-5 h-5"
                                                 viewBox="0 0 576 512">
                                                <path
                                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                 className="w-5 h-5"
                                                 viewBox="0 0 576 512">
                                                <path
                                                    d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
                                            </svg>
                                        }
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6">
                            <ScrollBar orientation="horizontal"/>
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-semibold tracking-tight">⭐️ Favorite Frames</h2>
                    <p className="text-base opacity-80">View and manage your favorite Frames here</p>
                    <ScrollArea className="w-full h-200px pt-4">
                        <ul className="flex w-max gap-6">
                            {favorites.map((favorite) => (
                                <li key={favorite}>
                                    <Card onClick={() => chrome.tabs.create({url: favorite})}
                                          className="w-[300px] rounded-[0.75rem] overflow-hidden  cursor-pointer">
                                        <TabFrame url={favorite}/>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            </div>

        </div>
    )
}

export default Dashboard