import {
  Avatar,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'
import styles from './UserPanel.module.scss'
import { ChatContext } from '../../context/ChatContext'
import CreateGroup from './CreateGroup'

const Users = () => {
  const { currentUser } = useContext(AuthContext)
  const [recentChats, setRecentChats] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const { dispatch } = useContext(ChatContext)

  useEffect(() => {
    const getChats = async () => {
      if (!currentUser?.uid) return
      // get latest chats
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        const chats = doc.data()
        const sortedChats = Object.entries(chats)?.sort(
          ([, { date: lastValue }], [, { date: nextValue }]) =>
            nextValue - lastValue
        )
        setRecentChats(sortedChats.slice(0, 2))
      })
      return () => unsub()
    }

    getChats()
  }, [currentUser?.uid])

  useEffect(() => {
    if (!currentUser?.uid) return

    //Live search of users in the user search bar that refreshes upon new key press
    const getUsers = async () => {
      const usersQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff')
      )

      const searchResults = await getDocs(usersQuery)
      const searchUsers = []
      searchResults.forEach((doc) => {
        searchUsers.push(doc.data())
      })

      //Sorting the results
      const sortedSearchUsers = searchUsers.sort((a, b) => {
        const nameA = a.displayName.toUpperCase()
        const nameB = b.displayName.toUpperCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })

      const sortedSearchUsersWithoutCurrentUser = sortedSearchUsers.filter(
        (user) => user.uid !== currentUser.uid
      )

      //Returns a scrollable list of search-matched users, leaving out the username of the current user logged in
      setAllUsers(sortedSearchUsersWithoutCurrentUser)
    }

    getUsers()
  }, [currentUser?.uid, searchTerm])

  const handleSelect = async (user) => {
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
            ...(otherUser?.organisation
              ? { organisation: otherUser.organisation }
              : {}),
            ...(otherUser?.photoURL ? { photoURL: otherUser.photoURL } : {}),
          },
          [compoundChatIdentifier + '.date']: serverTimestamp(),
        })
      await updateUsersChats(currentUser, user)
      await updateUsersChats(user, currentUser)
    }

    dispatch({ type: 'CHANGE_USER', payload: user })
  }

  //Styling and element placement using ChakraUI and CSS
  return (
    <Flex direction="column" alignItems="center" height="100%">
      <InputGroup justifyContent={'center'} alignItems={'center'}>
        <InputLeftElement pointerEvents="none" marginTop={4} marginLeft={6}>
          <i className={`fi fi-rr-search ${styles.searchButtonIcon}`}></i>
        </InputLeftElement>
        <Input
          type="text"
          placeholder="     Find a user"
          _placeholder={{ color: '414141' }}
          margin={3}
          bg="#d9d9d9"
          // width={300}
          height={12}
          onChange={(event) => setSearchTerm(event.target.value)}
          value={searchTerm}
          borderRadius={70}
        />
      </InputGroup>
      <Text
        fontSize="lg"
        fontWeight={'medium'}
        color={'#d9d9d9'}
        marginTop={2}
        marginBottom={1}
        align={'center'}
      >
        Recent
      </Text>
      <Divider width={'80%'} alignSelf={'center'} marginBottom={3} />
      {recentChats.map((chat) => {
        const [userId, { userInfo, groupInfo }] = chat
        const isGroup = !!groupInfo?.users
        const infoObject = isGroup ? groupInfo : userInfo
        return (
          <Flex
            key={userId}
            margin={2}
            bg={'#d9d9d9'}
            padding={2}
            borderRadius={'1rem'}
            width={'90%'}
            align={'center'}
            onClick={() =>
              dispatch({ type: 'CHANGE_USER', payload: infoObject })
            }
          >
            <Avatar
              src={infoObject?.photoURL}
              name={infoObject?.displayName}
              size="md"
              borderWidth={2}
              borderColor={'#5F7A7E'}
            />

            <Text className={styles.userCardText}>
              {infoObject.displayName}
            </Text>
          </Flex>
        )
      })}
      <Text
        fontSize="lg"
        fontWeight={'medium'}
        color={'#d9d9d9'}
        marginTop={3}
        marginBottom={2}
        align={'center'}
      >
        All Users
      </Text>
      <Divider width={'80%'} alignSelf={'center'} marginBottom={3} />
      <Flex className={styles.usersScroller} direction="column" align="center">
        {allUsers.map((user) => {
          return (
            <Flex
              key={user.uid}
              margin={2}
              bg={'#d9d9d9'}
              padding={2}
              borderRadius={'1rem'}
              width="90%"
              marginLeft={4}
              align={'center'}
              onClick={() => handleSelect(user)}
            >
              <Avatar
                src={user?.photoURL}
                name={user?.displayName}
                size="md"
                marginLeft={2}
                borderWidth={2}
                borderColor={'#5F7A7E'}
              />
              <Text
                className={styles.userCardText}
                marginLeft={2}
                marginRight={1}
              >
                {user.displayName}
              </Text>
              {user?.organisation && (
                <Text fontWeight={'semibold'}>
                  {' | '}
                  {user.organisation}
                </Text>
              )}
            </Flex>
          )
        })}
      </Flex>

      <CreateGroup />
    </Flex>
  )
}

export default Users
