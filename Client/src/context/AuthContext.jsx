import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '/src/utils/axios' 

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null) 
  const [isLoadingAuth, setIsLoadingAuth] = useState(true) 
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password })
      const { user, token } = response.data
      if (user && user._id && token) {
        const authData = { user: { _id: user._id, email: user.email, username: user.username }, token }
        setAuth(authData) 
        localStorage.setItem('auth', JSON.stringify(authData)) 
        return true 
      }
      return false 
    } catch (error) {
      setAuth(null) 
      localStorage.removeItem('auth') 
      throw error 
    }
  }
  const signup = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password })
      const { user, token } = response.data
      if (user && user._id && token) {
        const authData = { user: { _id: user._id, email: user.email, username: user.username }, token }
        setAuth(authData) 
        localStorage.setItem('auth', JSON.stringify(authData)) 
        return true 
      }
      return false 
    } catch (error) {
      setAuth(null) 
      localStorage.removeItem('auth') 
      throw error 
    }
  }

  const logout = () => {
    setAuth(null) 
    localStorage.removeItem('auth') 
  }

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth)
        if (parsedAuth && parsedAuth.user && parsedAuth.user._id && parsedAuth.token) {
          setAuth(parsedAuth)
        } else {
          localStorage.removeItem('auth') 
          setAuth(null) 
        }
      } catch {
        localStorage.removeItem('auth') 
        setAuth(null) 
      }
    } 
    setIsLoadingAuth(false)
  }, []) 

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, signup, logout, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
