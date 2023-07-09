import React from 'react'
import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import './style.scss'

import { AuthContext } from './context/AuthContext'
import PropTypes from 'prop-types'

const App = () => {
  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) =>
    !currentUser ? <Navigate to="/login" /> : children

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
