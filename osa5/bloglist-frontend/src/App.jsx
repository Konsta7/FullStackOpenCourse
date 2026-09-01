import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
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


  const blogForm = () => (
    <div>
      {blogs.sort((a, b) => (b.likes- a.likes)).map(blog =>
        <div key={blog.id}>
          <Blog blog={blog} blogs={blogs} setBlogs={setBlogs} />
        </div>
      )}
    </div>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  return (
    <div>
      {notification && <Notification message={notification} type={type} />}
      {!user && (
        <Togglable buttonLabel="login">
          <LoginForm setNotification={setNotification} setType={setType} setUser={setUser} />
        </Togglable>
      )}
      <div>
        <h2>blogs</h2>
        {user && (
          <div>
            <p>user {user.name} is logged in</p>
            <button onClick={logout}>logout</button>
          </div>
        )}
        <Togglable buttonLabel="create new blog">
          <CreateBlog blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} setType={setType} />
        </Togglable>
        {blogForm()}
      </div>
    </div>
  )
}

export default App