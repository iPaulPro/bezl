import {useChromeStorageLocal} from 'use-chrome-storage'
import {Profile} from '@/types/Profile.ts'
import Login from '@/options/Login.tsx'

const Options = () => {
    // const [favorites, setValue] = useChromeStorageLocal<string>('bezel.favorites', '')
    const [profile] = useChromeStorageLocal<Profile>('bezel.profile')
    return profile ? (
        <div>
            <p>
                Hello, {profile.displayName}! Your FID is {profile.fid}.
            </p>
            <p>
                Your custody address is: <pre>{profile.custody}</pre>
            </p>
        </div>
    ) : (
        <Login/>
    )
}

export default Options;