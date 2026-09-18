import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import CreateBlog from './components/CreateBlog'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import BlogList from './components/BlogList'
import BlogPage from './components/BlogPage'

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



  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }



  return (
    /*
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
    */
    <Router>
      <div>
        <Link to="/">blogs</Link> 
        <Link to="/create">new blog</Link>
        {user ? <button onClick={logout}>logout</button> : <Link to="/login">login</Link> }
      </div>
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} setBlogs={setBlogs} user={user} />} />
        <Route path="/login" element={<LoginForm setNotification={setNotification} setType={setType} setUser={setUser} />} />
        <Route path="/blogs/:id" element={<BlogPage blogs={blogs} setBlogs={setBlogs} user={user} />} />
        <Route path="/create" element={<CreateBlog blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} setType={setType} />} />
      </Routes>
    </Router>
  )
}

export default App