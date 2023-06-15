import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { AuthContext } from '../context/AuthContext'
import { db } from '../firebase'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
  const [chats, setChats] = useState([])

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) =>
        setChats(doc.data())
      )

      return () => unsub()
    }

    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleSelect = (user) =>
    dispatch({ type: 'CHANGE_USER', payload: user })

  const sortedChats = Object.entries(chats)?.sort(
    ([, { date: lastValue }], [, { date: nextValue }]) => nextValue - lastValue
  )

  return (
    <div className="chats">
      {sortedChats.map((chat) => {
        const [userId, { userInfo, lastMessage }] = chat

        const { photoURL, displayName } = userInfo

        return (
          <div
            className="userChat"
            key={userId}
            onClick={() => handleSelect(userInfo)}
          >
            <img src={photoURL} />
            <div className="userChatInfo">
              <span>{displayName}</span>
              <p>{lastMessage?.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Chats
