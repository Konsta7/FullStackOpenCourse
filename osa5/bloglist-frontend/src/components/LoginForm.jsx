import React from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ setNotification, setType, setUser }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {


    event.preventDefault()
    try {
      const user = await loginService.login({ username: userName, password: password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      setNotification('wrong credentials')
      setType('error')
      setTimeout(() => {
        setNotification(null)
        setType(null)
      }, 5000)
      console.log("Wrong credentialsssss", exception)
    }
  }

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="standard"
          value={userName}
          onChange={({ target }) => setUserName(target.value)}
        />
        <br/>
        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br/>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm


