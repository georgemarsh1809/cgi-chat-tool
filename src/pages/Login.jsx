import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import styles from './form.module.scss'

const Login = () => {
  const [err, setErr] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const [{ value: email }, { value: password }] = event.target

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
      console.log('Logged in')
    } catch (error) {
      setErr(true)
      console.error(error)
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <span className={styles.logo}>CGI Chat Tool</span>
        <span className={styles.title}>Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign In</button>
          {err && <span>Something went wrong...</span>}
        </form>
        {/* need to escape special characters, for big apps u have a full solution to write your copy and store localisation (changing the text for language requested by the browser) */}
        {/* `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;` */}
        <p>
          You don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
