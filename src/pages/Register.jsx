import React from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as REGEX from '../constants/regex'
import styles from './register.module.scss'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false)

  //Added in states to hold field values
  const [displayName, setDisplayName] = useState('')
  const [displayNameHasBeenTyped, setDisplayNameHasBeenTyped] = useState(false)
  const [email, setEmail] = useState('')
  const [emailHasBeenTyped, setEmailHasBeenTyped] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordHasBeenTyped, setPasswordHasBeenTyped] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [organisation, setOrganisation] = useState('CGI')

  const navigate = useNavigate()

  //Function to handle the registration of a new user
  const handleRegister = async (event) => {
    setLoading(true)
    event.preventDefault()

    let newUser
    try {
      newUser = await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setEmailAlreadyInUse(true)
      setLoading(false)
    }

    let avatarUrl
    if (avatar) {
      const date = new Date().getTime()
      const storageRef = ref(storage, `${displayName + date}`)
      await uploadBytesResumable(storageRef, avatar)
      avatarUrl = await getDownloadURL(storageRef)
    }

    await updateProfile(newUser.user, {
      displayName,
      ...(avatarUrl ? { photoURL: avatarUrl } : {}),
    })

    await setDoc(doc(db, 'users', newUser.user.uid), {
      uid: newUser.user.uid,
      displayName,
      email,
      organisation,
      ...(avatarUrl ? { photoURL: avatarUrl } : {}),
    })

    await setDoc(doc(db, 'userChats', newUser.user.uid), {})
    setLoading(false)
    navigate('/')
  }

  //Ensure both display name and email are valid. EMAIL follows the regular expression defined in the 'constants' folder
  const emailIsValid = !!String(email).toLowerCase().match(REGEX.EMAIL)
  const displayNameIsValid = displayName.length > 0

  //Create password complexity
  const passwordHasUpperCase = /[A-Z]/.test(password)
  const passwordHasLowerCase = /[a-z]/.test(password)
  const passwordHasNumbers = /\d/.test(password)
  const passwordHasNonalphas = /\W/.test(password)

  const passwordIsValid =
    password.length >= 8 &&
    passwordHasNumbers &&
    passwordHasUpperCase &&
    passwordHasLowerCase &&
    passwordHasNonalphas

  //Styling and element placement using ChakraUI and CSS
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={styles.register}
    >
      <Text fontSize={50} fontWeight="semibold" padding={5}>
        CrisisConnect
      </Text>
      <Text fontSize={25}>Register</Text>
      <FormControl
        width={500}
        direction="column"
        alignContent="center"
        justifyContent="center"
      >
        <FormLabel marginTop={5}>Display Name*</FormLabel>
        <Input
          type="text"
          placeholder="Display Name"
          isInvalid={!displayNameIsValid && displayNameHasBeenTyped}
          border="1px"
          borderColor="black"
          onChange={(event) => {
            setDisplayName(event.target.value)
            if (!displayNameHasBeenTyped) setDisplayNameHasBeenTyped(true)
          }}
        />

        <FormLabel marginTop={5}>Email address*</FormLabel>
        {emailAlreadyInUse && <Text fontSize="sm">Email already in use</Text>}
        <Input
          type="email"
          placeholder="Email Address"
          isInvalid={!emailIsValid && emailHasBeenTyped}
          border="1px"
          borderColor="black"
          onChange={(event) => {
            setEmail(event.target.value)
            if (!emailHasBeenTyped) setEmailHasBeenTyped(true)
          }}
        />

        <FormLabel marginTop={5}>Organisation*</FormLabel>
        <Select
          onChange={(event) => setOrganisation(event.target.value)}
          defaultValue="CGI"
          border="1px"
          borderColor="black"
        >
          <option value="CGI">CGI</option>
          <option value="GCI">GCI</option>
          <option value="NPS">NPS</option>
          <option value="Courtel">Courtel</option>
          <option value="CPS">CPS</option>
        </Select>

        <FormLabel marginTop={5}>Password*</FormLabel>
        <Text fontSize="sm" fontStyle={'italic'} marginBottom={2}>
          Must include an uppercase character, a lowercase character, a number,
          and a special character
        </Text>
        <Input
          type="password"
          placeholder="Password"
          isInvalid={!passwordIsValid && passwordHasBeenTyped}
          border="1px"
          borderColor="black"
          onChange={(event) => {
            setPassword(event.target.value)
            if (!passwordHasBeenTyped) setPasswordHasBeenTyped(true)
          }}
        />

        <FormLabel marginTop={5}>User Avatar (Optional)</FormLabel>
        <label htmlFor="avatar">
          {/* <img src={Add} alt=""></img> */}
          <span>Add an avatar</span>
        </label>
        <Input
          type="file"
          id="avatar"
          onChange={(event) => setAvatar(event.target.files[0])}
          accept="image/*"
          multiple={false}
          border="1px"
          borderColor="black"
        />

        <Button
          onClick={handleRegister}
          isDisabled={loading || !emailIsValid || !passwordIsValid}
          isLoading={loading}
          marginTop={5}
          variant={'solid'}
          width={500}
          border="1px"
          borderColor="black"
          background={'#8F3442'}
          color={'#efefef'}
        >
          Register
        </Button>

        <Text marginTop={2}>
          Already have an account?{' '}
          <Link to="/login" as={ReactRouterLink}>
            Login
          </Link>
        </Text>
      </FormControl>
    </Flex>
  )
}

export default Register
