import React from 'react'
import NavBar from './NavBar'
import Search from './Search'
import Chats from './Chats'
import styles from './sidebar.module.scss'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <NavBar />
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar
