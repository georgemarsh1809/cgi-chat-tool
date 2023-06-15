import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'
import Message from './Message'
import styles from './messages.module.scss'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => unsub()
  }, [data.chatId])

  return (
    <div className={styles.messages}>
      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  )
}

export default Messages
