import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { AuthContextProvider } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'))

// context providers are wrapped around the app component to provide the context (state of the auth, chat) to all the components in the app
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <ChakraProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChakraProvider>
    </ChatContextProvider>
  </AuthContextProvider>
)
