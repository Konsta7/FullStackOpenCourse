import React from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = ({ setNotification, setType, setUser }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {


    event.preventDefault()
    try {
      const user = await loginService.login({ username: userName, password: password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong credentials')
      setType('error')
      setTimeout(() => {
        setNotification(null)
        setType(null)
      }, 5000)
      console.log(exception)
    }
  }

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={userName}
              name="Username"
              onChange={({ target }) => setUserName(target.value)}
            />
          </label>
          <label>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
