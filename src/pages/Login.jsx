import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
} from '@chakra-ui/react'
import styles from './login.module.scss'
import { Link as ReactRouterLink } from 'react-router-dom'
import * as REGEX from '../constants/regex'

const Login = () => {
  const navigate = useNavigate()

  //Added in states to hold field values, along with other state such as 'has the user already attempted login'
  const [email, setEmail] = useState('')
  const [emailHasBeenTyped, setEmailHasBeenTyped] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordHasBeenTyped, setPasswordHasBeenTyped] = useState(false)
  const [hasHadFailedLoginAttempt, setHasHadFailedLoginAttempt] =
    useState(false)

  //Function to handle the login flow once sign in is pressed - the sign in button only becomes available once both fields are valid
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setHasHadFailedLoginAttempt(true)
      return
    }

    navigate('/')
  }

  //Ensure both email and password are valid before login.
  const emailIsValid = !!String(email).toLowerCase().match(REGEX.EMAIL)

  const passwordIsValid = password.length > 0

  //Styling and element placement using ChakraUI and CSS
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={styles.login}
    >
      <Text
        className={styles.logintitle}
        fontSize={50}
        fontWeight="semibold"
        padding={5}
      >
        CrisisConnect
      </Text>
      <Text fontSize={25}>Login</Text>

      <FormControl
        width={500}
        direction="column"
        alignContent="center"
        justifyContent="center"
      >
        <FormLabel marginTop={5}>Email Address</FormLabel>
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

        <FormLabel marginTop={5}>Password</FormLabel>
        <Input
          type="password"
          width={500}
          placeholder="Password"
          isInvalid={!passwordIsValid && passwordHasBeenTyped}
          border="1px"
          borderColor="black"
          onChange={(event) => {
            setPassword(event.target.value)
            if (!passwordHasBeenTyped) setPasswordHasBeenTyped(true)
          }}
        />

        <Button
          className={styles.loginButton}
          onClick={handleLogin}
          isDisabled={!emailIsValid || !passwordIsValid}
          marginTop={10}
          alignContent="center"
          variant={'solid'}
          width={500}
          border="1px"
          borderColor="black"
          background={'#8F3442'}
        >
          Sign In
        </Button>

        {hasHadFailedLoginAttempt && (
          <Text margin={4} fontWeight={'semibold'} align={'center'}>
            Username or password is incorrect, please try again.
          </Text>
        )}

        <Text marginTop={2}>
          You don&apos;t have an account?{' '}
          <Link to="/register" as={ReactRouterLink}>
            Register
          </Link>
        </Text>
      </FormControl>
    </Flex>
  )
}

export default Login
