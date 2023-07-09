import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { AuthContext } from '../../context/AuthContext'
import { db } from '../../firebase'
import { ChatContext } from '../../context/ChatContext'
import { Text, Flex, Avatar } from '@chakra-ui/react'
import styles from './ChatPanel.module.scss'
import moment from 'moment'
import groupDefaultIcon from '../../img/group.png'

const Chats = () => {
  const [hasSetInitialChat, setHasSetInitialChat] = useState(false)
  const [chats, setChats] = useState([])

  const { currentUser } = useContext(AuthContext)
  const { dispatch, data } = useContext(ChatContext)

  //Pulls all chats a user has had in the past from the db
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) =>
        setChats(doc.data())
      )

      return () => unsub()
    }

    currentUser.uid && getChats()
  }, [currentUser.uid])

  //Handles a click on another chat - changes chat
  const handleSelect = (user) =>
    dispatch({ type: 'CHANGE_USER', payload: user })

  const sortedChats = Object.entries(chats)?.sort(
    ([, { date: lastValue }], [, { date: nextValue }]) => nextValue - lastValue
  )

  //Selects the latest chat and loads upon login
  useEffect(() => {
    if (!sortedChats.length || hasSetInitialChat) return
    const latestChatInformation = sortedChats[0][1]

    handleSelect(
      latestChatInformation?.userInfo
        ? latestChatInformation?.userInfo
        : latestChatInformation?.groupInfo
    )
    setHasSetInitialChat(true)
  }, [sortedChats])

  //Styling and element placement using ChakraUI and CSS
  return (
    <Flex direction="column">
      <Flex alignItems="center" className={styles.chatTitle} padding={3}>
        <i className={`fi fi-rr-messages ${styles.chatTitleIcon}`}></i>
        <Text marginLeft={3} fontSize={25}>
          Chats
        </Text>
      </Flex>
      <Flex
        className={styles.chatsScroller}
        direction="column"
        align={'center'}
      >
        {sortedChats.map((chat) => {
          const [
            userId,
            { userInfo, groupInfo, lastMessage, date, lastMessageSender },
          ] = chat
          const isGroup = !!groupInfo?.displayName
          const infoObject = isGroup ? groupInfo : userInfo

          let datetimeFromNow = ''
          if (date?.seconds)
            datetimeFromNow = moment(date.seconds * 1000).format('DD/MM')

          const chatIsSelected = data?.user?.uid === infoObject.uid

          return (
            <Flex
              key={userId}
              onClick={() => handleSelect(infoObject)}
              padding={3}
              width="100%"
              className={chatIsSelected ? styles.chatSelected : ''}
            >
              <Avatar
                src={isGroup ? groupDefaultIcon : infoObject?.photoURL}
                name={infoObject?.displayName}
                borderWidth={2}
                borderColor={'#4e4e4e'}
              />
              <Flex direction="column" width="inherit" paddingLeft={3}>
                <Flex justify="space-between" width="100%">
                  <Text>
                    {infoObject.displayName}
                    {isGroup}
                    {'  '}
                    {!isGroup && `| ${infoObject.organisation}`}
                  </Text>
                  <Text fontWeight="light">{datetimeFromNow}</Text>
                </Flex>
                <div className={styles.lastMessageContainer}>
                  {lastMessage?.text && (
                    <Flex justifyContent="flex-start">
                      <Text fontWeight="semibold">
                        {isGroup &&
                          lastMessageSender?.text &&
                          `${
                            lastMessageSender?.text === currentUser.displayName
                              ? 'You'
                              : lastMessageSender?.text
                          }:`}
                      </Text>
                      <Text fontWeight="light" className={styles.lastMessage}>
                        &nbsp;
                        {lastMessage?.text}
                      </Text>
                    </Flex>
                  )}
                </div>
              </Flex>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Chats
