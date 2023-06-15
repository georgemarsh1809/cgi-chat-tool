import React, { useContext, useState } from 'react'
import {
  collection,
  getDocs,
  setDoc,
  query,
  serverTimestamp,
  updateDoc,
  where,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import styles from './search.module.scss'
import chatsStyles from './chats.module.scss'

const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(null)

  const { currentUser } = useContext(AuthContext)

  const handleSearch = async () => {
    // OK, some redundant logic here, but i think you might want to change so will leave for now
    // search query looks for an exact match of the username
    // so there will only every be one result
    // therefore, no need to loop through the results
    const searchQuery = query(
      collection(db, 'users'),
      where('displayName', '==', username)
    )

    try {
      const searchResults = await getDocs(searchQuery)
      searchResults.forEach((doc) => {
        setUser(doc.data())
      })
    } catch (error) {
      console.error(error)
      setErr(true)
    }
  }

  const handleSelect = async () => {
    //check whether group exists - if not, create
    const compoundChatIdentifier =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid

    const selectedChat = await getDoc(doc(db, 'chats', compoundChatIdentifier))

    if (!selectedChat.exists()) {
      //create chat in chats collection
      await setDoc(doc(db, 'chats', compoundChatIdentifier), {
        messages: [],
      })

      const updateUsersChats = (user, otherUser) =>
        updateDoc(doc(db, 'userChats', user.uid), {
          [compoundChatIdentifier + '.userInfo']: {
            uid: otherUser.uid,
            displayName: otherUser.displayName,
            photoURL: otherUser.photoURL,
          },
          [compoundChatIdentifier + '.date']: serverTimestamp(),
        })

      await updateUsersChats(currentUser, user)
      await updateUsersChats(user, currentUser)
    }

    setUser(null)
    setUsername('')
  }

  return (
    <div className={styles.search}>
      <div className={styles.searchForm}>
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={(event) => {
            event.code === 'Enter' && handleSearch()
          }}
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className={chatsStyles.userChat} onClick={handleSelect}>
          <img src={user.photoURL} />
          <div className={chatsStyles.userChatInfo}>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
