import '../index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Options from './Options.tsx'
import {AuthKitProvider} from '@farcaster/auth-kit'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthKitProvider>
            <Options/>
        </AuthKitProvider>
    </React.StrictMode>
)
