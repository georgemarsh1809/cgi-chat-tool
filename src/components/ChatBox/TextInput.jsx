import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import {
  Flex,
  Input as ChakraInput,
  Input,
  Tooltip,
  Text,
} from '@chakra-ui/react'
import styles from './ChatBox.module.scss'

const TextInput = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)
  const textBox = useRef(null)

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const textIsValid = !!text.length

  const handleInput = (event) => setText(event.target.value)

  //Listens for a press of the 'Enter' key - sends message
  const handleKeyboard = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (event.shiftKey) {
        setText(text + '\n')
        return
      }
      if (textIsValid || img) {
        handleSend()
      }
    }
  }

  //Function to handle the send of a message
  const handleSend = async () => {
    if (!textIsValid && !img) return
    if (img) {
      const storageRef = ref(storage, uuid())

      await uploadBytesResumable(storageRef, img)

      const downloadURL = await getDownloadURL(storageRef)
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURL,
        }),
      })
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      })
    }

    // if group
    if (data.user.users) {
      for (const user of data.user.users) {
        await updateDoc(doc(db, 'userChats', user.uid), {
          [data.chatId + '.lastMessage']: {
            text,
          },
          [data.chatId + '.lastMessageSender']: {
            text: currentUser.displayName,
          },
          [data.chatId + '.date']: serverTimestamp(),
        })
      }
    } else {
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [data.chatId + '.lastMessage']: {
          text,
        },
        [data.chatId + '.date']: serverTimestamp(),
      })

      await updateDoc(doc(db, 'userChats', data.user.uid), {
        [data.chatId + '.lastMessage']: {
          text,
        },
        [data.chatId + '.date']: serverTimestamp(),
      })
    }

    setText('')
    setImg(null)
  }

  //Styling and element placement using ChakraUI and CSS
  return (
    <Flex
      direction="row-reverse"
      className={styles.inputBox}
      alignItems="center"
    >
      <i
        onClick={handleSend}
        className={`fi fi-rr-paper-plane-top ${styles.icon}`}
      ></i>
      <Tooltip label="Not Implemented">
        <i className={`fi fi-rr-clip ${styles.icon}`}></i>
      </Tooltip>
      <Flex direction="column">
        <ChakraInput
          ref={textBox}
          type="file"
          style={{ display: 'none' }}
          id="file"
          onChange={(event) => setImg(event.target.files[0])}
          accept="image/*"
        />
        <label htmlFor="file">
          <i className={`fi fi-rr-graphic-style ${styles.icon}`}></i>
        </label>
      </Flex>
      {img && <Text>{img.name}</Text>}
      <Input
        placeholder="Type your message..."
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyboard}
        size="sm"
      />
    </Flex>
  )
}

export default TextInput
