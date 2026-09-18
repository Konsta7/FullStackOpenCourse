import { useState } from 'react'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, blogs, setBlogs, onLike, user }) => {
  const [showInfo, setShowInfo] = useState(false)
  const navigate = useNavigate()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async (event) => {
    event.preventDefault()
    if (onLike) {
      onLike(blog)
      return
    }

    const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
    if (setBlogs && blogs) {
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    }
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        navigate('/')
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div style={blogStyle}>
      <span className="blog-title">{blog.title}</span>
        <div>
          {blog.url} <br />
          likes {blog.likes || 0} {user && (<button onClick={handleLike}>like</button>)}
          <br />
          {blog.author} <br />
          {user && blog.user?.username === user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
    </div>
  )
}

export default Blog