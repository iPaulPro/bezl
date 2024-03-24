import '../index.css'
import '../App.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Options from './Options.tsx'
import {AuthKitProvider} from '@farcaster/auth-kit'
import { init } from "@airstack/airstack-react";

init(import.meta.env.VITE_AIRSTACK_API_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthKitProvider>
            <Options/>
        </AuthKitProvider>
    </React.StrictMode>
)
