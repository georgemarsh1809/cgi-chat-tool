import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { db } from '../../firebase'
import Message from './Message'
import { Box } from '@chakra-ui/react'
import styles from './ChatBox.module.scss'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    if (!data.chatId) return

    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => unsub()
  }, [data.chatId])

  return (
    <Box padding={5} className={styles.messageScroller}>
      {messages.map((message) => (
        <Message
          message={message}
          key={message.id}
          isGroup={!!data?.user?.users}
        />
      ))}
    </Box>
  )
}

export default Messages
