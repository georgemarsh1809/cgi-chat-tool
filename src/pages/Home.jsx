import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import styles from './home.module.scss'

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default Home
