import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '../tool/AuthContext.jsx'
import { FriendProvider } from '../tool/FriendContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <FriendProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID_CLIENT}>
                <App />
            </GoogleOAuthProvider>
        </FriendProvider>
    </AuthProvider>
)