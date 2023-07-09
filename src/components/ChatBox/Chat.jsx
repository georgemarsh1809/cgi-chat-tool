import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { Avatar, Flex, Text, Tooltip } from '@chakra-ui/react'
import styles from './ChatBox.module.scss'
import groupDefaultIcon from '../../img/group.png'

const Chat = () => {
  //Pulls all necessary data for logged in user
  const {
    data: { user },
  } = useContext(ChatContext)

  const isGroup = !!user?.users

  //Styling and element placement using ChakraUI and CSS
  return (
    <>
      <Flex
        padding={2}
        bgColor={'#d9d9d9'}
        justifyContent="space-between"
        borderBottom={'1px'}
      >
        <Flex alignItems="center">
          <Avatar
            src={isGroup ? groupDefaultIcon : user?.photoURL}
            name={user?.displayName}
            marginLeft={2}
            borderColor={'#4e4e4e'}
            borderWidth={2}
          />
          <Text fontSize={20} paddingLeft={3} fontWeight="bold">
            {user?.displayName}
          </Text>
          <Text fontSize={20} fontWeight="medium" paddingLeft={1}>
            {user?.organisation && '| '}
            {user?.organisation}
          </Text>
        </Flex>

        <Flex alignItems="center">
          <Flex direction="row-reverse">
            <Tooltip label="Not Implemented">
              <i className={`fi fi-rr-menu-dots ${styles.icon}`}></i>
            </Tooltip>
            <Tooltip label="Not Implemented">
              <i className={`fi fi-rr-video-camera-alt ${styles.icon}`}></i>
            </Tooltip>
            <Tooltip label="Not Implemented">
              <i className={`fi fi-rr-phone-flip ${styles.icon}`}></i>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default Chat
