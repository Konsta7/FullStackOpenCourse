import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      console.log('wrong credentials')
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
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = (blogObject) => {
    return (
      <div>
        <form>
          <label>
            title:
            <input
              type="text"
              value={blogObject.title}
              name="Title"
              onChange={({ target }) => setBlogs({ ...blogObject, title: target.value })}
              /* TODO kato mitä tähän ja ylemmälle riville tulee. 5.3 uuden blogin luominen */
            />
            author:
            <input
              type="text"
              value={blogObject.author}
              name="Author"
            />
            url:
            <input
              type="text"
              value={blogObject.url}
              name="Url"
            />
          </label>
        </form>
      </div>
    )
  }

  return (
    <div>
    
      {!user && loginForm()}
      {user && (
        <div>
        <p>user {user.name} is logged in</p>
        <button onClick={logout}>logout</button>
        {blogForm()}
        {createBlog()}
        </div>
      )}
    </div>
  )
}

export default App