import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [type, setType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username: userName, password: password})
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
      console.log('wrong credentials')
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      })
      setBlogs(blogs.concat(newBlog))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setType('success')
      setTimeout(() => {
        setNotification(null)
        setType(null)
      }, 5000)
    } catch (exception) {
      console.log('error creating blog')
    }
  }

  const loginForm = () => (
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

  const blogForm = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = () => {
    return (
      <div>
        <form onSubmit={handleCreateBlog}>
          <label>
            title:
            <input
              type="text"
              value={newBlogTitle}
              name="Title"
              onChange={ ({target}) => setNewBlogTitle(target.value) }
            />
            author:
            <input
              type="text"
              value={newBlogAuthor}
              name="Author"
              onChange={ ({target}) => setNewBlogAuthor(target.value) }
            />
            url:
            <input
              type="text"
              value={newBlogUrl}
              name="Url"
              onChange={ ({target}) => setNewBlogUrl(target.value) }
            />
          </label>
          <button type="submit">create</button>
        </form>
        
      </div>
    )
  }

  return (
    <div>
      {notification && <Notification message={notification} type={type} />}
      {!user && loginForm()}
      {user && (
        <div>
        <h2>blogs</h2>
        <p>user {user.name} is logged in</p>
        <button onClick={logout}>logout</button>
        {createBlog()}
        {blogForm()}
        </div>
      )}
    </div>
  )
}

export default App