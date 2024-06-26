import '@farcaster/auth-kit/styles.css'
import {SignInButton, useProfile} from '@farcaster/auth-kit'
import {useChromeStorageLocal} from 'use-chrome-storage'
import {Profile} from '@/types/Profile.ts'
import {useMemo} from 'react'
import {createFarcasterSigner} from '@/lib/create-farcaster-signer';
import {FarcasterSigner} from 'frames.js/render'

const Login = () => {
    const profile = useProfile()
    const {
        isAuthenticated
    } = profile
    const [, setProfile] = useChromeStorageLocal<Profile>('bezl.profile')
    const [, setSigner] = useChromeStorageLocal<FarcasterSigner>('bezl.signer')

    useMemo(() => {
        console.log('isAuthenticated:', isAuthenticated, 'profile:', profile)
        if (isAuthenticated) {
            setProfile({
                fid: profile.profile.fid,
                pfpUrl: profile.profile.pfpUrl,
                username: profile.profile.username,
                displayName: profile.profile.displayName,
                bio: profile.profile.bio,
                custody: profile.profile.custody,
                verifications: profile.profile.verifications
            })

            createFarcasterSigner()
                .then(signer => {
                    console.log('createFarcasterSigner: signer:', signer)
                    setSigner(signer);
                })
                .catch(console.error);
        }

    }, [isAuthenticated])

    return (
        <main className="w-full flex flex-col gap-6 place-items-center">
            <img src={chrome.runtime.getURL("images/icon-512.png")} className="w-20" />
            <SignInButton/>
        </main>
    )
}

export default Login