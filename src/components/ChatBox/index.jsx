import React from 'react'
import Chat from './Chat'
import Messages from './Messages'
import TextInput from './TextInput'
import styles from './ChatBox.module.scss'

const ChatBox = () => (
  <div className={styles.chatContainer}>
    <Chat />
    <Messages />
    <TextInput />
  </div>
)

export default ChatBox
