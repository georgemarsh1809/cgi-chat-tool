import React from 'react'
import { createContext, useContext, useReducer } from 'react'
import { AuthContext } from './AuthContext'
import PropTypes from 'prop-types'

const INITIAL_STATE = {
  chatId: 'null',
  user: {},
}

export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext)

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        // eslint-disable-next-line no-case-declarations
        const isGroup = !!action.payload?.users
        return {
          user: action.payload,
          chatId: isGroup
            ? action.payload.uid
            : currentUser.uid > action.payload.uid
            ? currentUser.uid + action.payload.uid
            : action.payload.uid + currentUser.uid,
        }

      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
