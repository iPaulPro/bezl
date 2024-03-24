import {useChromeStorageLocal} from 'use-chrome-storage'
import {Profile} from '@/types/Profile.ts'
import Login from '@/options/Login.tsx'
import Dashboard from '@/options/Dashboard.tsx'

const Options = () => {
    const [profile] = useChromeStorageLocal<Profile>('bezel.profile')
    return profile ? (
        <Dashboard/>
    ) : (
        <Login/>
    )
}

export default Options;