import React from 'react'
import styles from './home.module.scss'
import { Grid, GridItem } from '@chakra-ui/react'
import TopBar from '../components/TopBar/TopBar'
import ChatBox from '../components/ChatBox'
import ChatPanel from '../components/ChatPanel/index'
import UserPanel from '../components/UserPanel'

const Home = () => {
  //Defines initial layout of home screen
  return (
    <>
      <Grid
        className={styles['layout-grid']}
        templateAreas={`
"header header header"
"chatPanel chatbox userPanel"`}
        gridTemplateRows={'70px calc(100% - 70px)'}
        gridTemplateColumns={'20% 1fr 20%'}
        gridGap="0"
        h="100vh"
        gap="1"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem bg="#A33C3C" area={'header'}>
          <TopBar />
        </GridItem>
        <GridItem bg="#CFCFCF" area={'chatPanel'}>
          <ChatPanel />
        </GridItem>
        <GridItem bg="#ECE9E9" area={'chatbox'}>
          <ChatBox />
        </GridItem>
        <GridItem bg="#587B7F" area={'userPanel'}>
          <UserPanel />
        </GridItem>
      </Grid>
    </>
  )
}

export default Home
