import { signOut } from 'firebase/auth'
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { auth } from '../../firebase'
import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import styles from './TopBar.module.scss'
import { ChatContext } from '../../context/ChatContext'

const TopBar = () => {
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  //Handles a click on the logout button
  const handleLogout = () => {
    signOut(auth)
    dispatch({ type: 'CHANGE_USER', payload: {} })
  }

  //Styling and element placement using ChakraUI and CSS
  return (
    <div className={styles.headerContainer}>
      <Flex
        alignItems="center"
        align="center"
        justifyContent="center"
        className={styles.headerSubContainer}
      >
        <Text
          fontSize={28}
          textAlign="center"
          className={styles.text}
          fontWeight="semibold"
        >
          CrisisConnect
        </Text>
      </Flex>
      <Flex
        direction="row-reverse"
        align="center"
        className={styles.headerSubContainer}
      >
        <Button
          onClick={handleLogout}
          marginLeft={7}
          marginRight={5}
          height={8}
          className={styles.logoutButton}
        >
          Logout
        </Button>
        <Text marginLeft={2} className={styles.text}>
          {currentUser.displayName}
        </Text>
        <Avatar
          src={currentUser.photoURL}
          name={currentUser.displayName}
          borderWidth={1}
          size="md"
        />
      </Flex>
    </div>
  )
}

export default TopBar
