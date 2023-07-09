import React from 'react'
import Users from './Users'
import { Flex } from '@chakra-ui/react'

const UserPanel = () => (
  <Flex direction="column" height="100%">
    <Users />
  </Flex>
)

export default UserPanel
