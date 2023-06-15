import React, { useContext } from 'react'
import Cam from '../img/cam.png'
import Add from '../img/add.png'
import More from '../img/more.png'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext'
import styles from './chat.module.scss'

const Chat = () => {
  const {
    data: { user },
  } = useContext(ChatContext)

  return (
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
        <span style={{ fontSize: 20 }}>{user?.displayName}</span>
        <div className={styles.chatIcons}>
          {/*  alt text for screen readers */}
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
