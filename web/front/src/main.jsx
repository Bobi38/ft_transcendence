import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '../tool/AuthContext.jsx'
import { FriendProvider } from '../tool/FriendContext.jsx'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <FriendProvider>
            <App />
        </FriendProvider>
    </AuthProvider>
)