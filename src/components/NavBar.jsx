import { signOut } from 'firebase/auth'
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { auth } from '../firebase'
import styles from './navBar.module.scss'

const NavBar = () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <div className={styles.navbar}>
      <span className={styles.logo}>CGI Chat</span>
      <div className={styles.user}>
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default NavBar
