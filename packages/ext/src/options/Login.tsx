import '@farcaster/auth-kit/styles.css'
import {SignInButton, useProfile} from '@farcaster/auth-kit'
import {useChromeStorageLocal} from 'use-chrome-storage'
import {Profile} from '@/types/Profile.ts'
import {useEffect} from 'react'

const Login = () => {
    const profile = useProfile()
    const {
        isAuthenticated
    } = profile
    const [savedProfile, setProfile] = useChromeStorageLocal<Profile>('bezel.profile')

    useEffect(() => {
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
        }
    }, [isAuthenticated, profile])

    return (
        <main style={{fontFamily: 'Inter, "Inter Placeholder", sans-serif'}}>
            <div style={{position: 'fixed', top: '12px', right: '12px'}}>
                <SignInButton/>
            </div>
            <div style={{paddingTop: '33vh', textAlign: 'center'}}>
                <p>
                    Click the &quot;Sign in with Farcaster&quot; button above, then scan the QR code
                    to sign in.
                </p>
            </div>
        </main>
    )
}

export default Login