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
import { AppBar, Toolbar, Button, Box } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [type, setType] = useState(null)
  const style = { color: 'white', textDecoration: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }


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
      <AppBar position="static">
        <Toolbar>
          <h2>Blog App</h2>
          <Box sx={{ marginLeft: 'auto' }}>
            <Button color="inherit" style={style}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              blogs
            </Link></Button>
            <Button color="inherit" style={style}>
              <Link to="/create" style={{ color: 'inherit', textDecoration: 'none' }}>
                new blog
              </Link>
            </Button>
            {user ? (
              <Button color="inherit" onClick={logout} style={style}>logout</Button>
            ) : (
              <Button color="inherit" style={style}>
                <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                  login
                </Link>
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {notification && <Notification message={notification} type={type} />}
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