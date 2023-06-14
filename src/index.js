import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { AuthContextProvider } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'

const root = ReactDOM.createRoot(document.getElementById('root'))

// context providers are wrapped around the app component to provide the context (state of the auth, chat) to all the components in the app
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
)
