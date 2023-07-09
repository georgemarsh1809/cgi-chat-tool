import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'
import { v4 as uuid } from 'uuid'
import styles from './UserPanel.module.scss'

const CreateGroup = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  //Objects to hold state of various situations regarding the 'Create Group' button and modal
  const [groupName, setGroupName] = useState('')
  const [groupNameHasBeenTyped, setGroupNameHasBeenTyped] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchUsers, setSearchUsers] = useState([])
  const [searchText, setSearchText] = useState([])

  const groupNameIsValid = !!groupName.length
  const selectedUsersIsValid = !!selectedUsers.length

  //Live search of users in the modal that refreshes upon new key press
  useEffect(() => {
    const updateSearch = async () => {
      const searchQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', searchText),
        where('displayName', '<=', searchText + '\uf8ff')
      )

      const searchResults = await getDocs(searchQuery)
      const searchUsers = []
      searchResults.forEach((doc) => {
        searchUsers.push(doc.data())
      })
      setSearchUsers(searchUsers)
    }
    updateSearch()
  }, [searchText])

  //Creates a new chat in the db for every user in the group
  const handleCreateGroup = async () => {
    const chatId = uuid()

    await setDoc(doc(db, 'chats', chatId), {
      messages: [],
    })

    for (const selectedUser of selectedUsers) {
      await updateDoc(doc(db, 'userChats', selectedUser.uid), {
        [chatId + '.groupInfo']: {
          uid: chatId,
          displayName: groupName,
          users: selectedUsers,
        },
        [chatId + '.date']: serverTimestamp(),
      })
    }
    onClose()
  }

  //Styling and element placement using ChakraUI and CSS
  return (
    <>
      <Flex
        className={styles.createGroupButtonContainer}
        onClick={onOpen}
        justifyContent="center"
        align="center"
      >
        <i className={`fi fi-rr-users-medical ${styles.createGroupIcon}`}></i>
        <Flex>
          <Text alignSelf="center">Create Group</Text>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className={styles.createGroupModal}>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Group Name"
              onChange={(event) => {
                setGroupNameHasBeenTyped(true)
                setGroupName(event.target.value)
              }}
              isInvalid={!groupNameIsValid && groupNameHasBeenTyped}
              marginBottom={3}
            />

            <FormLabel marginTop={5}>Selected Users</FormLabel>
            {selectedUsers.map((user) => (
              <Text key={user.displayName}>{user.displayName}</Text>
            ))}
            {!selectedUsers.length && <Text>No Users Selected</Text>}

            <FormLabel marginTop={3}>Search Users</FormLabel>
            <Input
              type="text"
              placeholder="Search Users"
              onChange={(event) => setSearchText(event.target.value)}
            />

            {searchUsers.map((user) => {
              const indexOfSelectedUser = selectedUsers.indexOf(user)
              const userAlreadySelected = indexOfSelectedUser !== -1

              return (
                <div key={user.displayName}>
                  <Text>{user.displayName}</Text>
                  <Button
                    onClick={() => {
                      if (userAlreadySelected) {
                        setSelectedUsers(
                          selectedUsers.filter(
                            (_, index) => index !== indexOfSelectedUser
                          )
                        )
                      } else {
                        setSelectedUsers([...selectedUsers, user])
                      }
                    }}
                  >
                    {userAlreadySelected ? 'Remove' : 'Add'}
                  </Button>
                </div>
              )
            })}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={!groupNameIsValid || !selectedUsersIsValid}
              onClick={handleCreateGroup}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateGroup
