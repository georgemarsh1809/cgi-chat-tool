import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import PropTypes from 'prop-types'
import { Avatar, Flex, Image, Text } from '@chakra-ui/react'
import styles from './ChatBox.module.scss'
import moment from 'moment'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const Message = ({ message, isGroup }) => {
  const [userInfo, setUserInfo] = useState(null)
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  //Keeps most recent message at the bottom of the chat box
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })

    const getUserInfo = async () => {
      if (!message?.senderId) return
      const userRef = doc(db, 'users', message.senderId)
      const userDoc = await getDoc(userRef)
      const userInfo = userDoc.data()
      setUserInfo(userInfo)
    }

    getUserInfo()
  }, [message])

  //Calculates and formats date/time of message send
  const datetimeFromNow = moment(message.date.seconds * 1000).format(
    'DD/MM | HH:mm'
  )

  const isLoggedInUsersMessage = message.senderId === currentUser.uid

  //Styling and element placement using ChakraUI and CSS
  return (
    <Flex
      className={
        isLoggedInUsersMessage ? styles.messageRight : styles.messageLeft
      }
      ref={ref}
    >
      {message.senderId !== currentUser.uid && (
        <Avatar
          src={data.user.photoURL}
          className={styles.sentImage}
          height={10}
          width={10}
          placeContent={'center'}
          margin={2}
          borderWidth={2}
          borderColor={'gray'}
        />
      )}
      <Flex direction="column">
        {isGroup && !isLoggedInUsersMessage && (
          <Text fontSize="md" marginTop={2}>
            {userInfo?.displayName}
          </Text>
        )}
        <Flex
          direction="column"
          alignItems={isLoggedInUsersMessage ? 'end' : 'start'}
        >
          {message?.text && (
            <Text
              fontWeight={'medium'}
              padding={2}
              marginBottom={1}
              borderRadius={5}
              maxW={600}
              bgColor={isLoggedInUsersMessage ? '#d9d9d9' : '#587B7F'}
              className={
                isLoggedInUsersMessage ? styles.textRight : styles.textLeft
              }
            >
              {message.text}
            </Text>
          )}

          {message.img && (
            <Image src={message.img} className={styles.sentImage} />
          )}
          <Text fontWeight="normal" fontSize="xs" className={styles.date}>
            {datetimeFromNow}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
  isGroup: PropTypes.bool.isRequired,
}

export default Message
