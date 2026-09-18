import { useState } from 'react'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

const Blog = ({ blog, blogs, setBlogs, onLike, user }) => {
  const [showInfo, setShowInfo] = useState(false)
  const navigate = useNavigate()

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
  <Box
    sx={{
      border: '1px solid #ddd',
      borderRadius: 2,
      padding: 2,
      marginBottom: 2,
      boxShadow: 1,
      backgroundColor: 'white',
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 'bold',
        marginBottom: 1,
      }}
    >
      {blog.title}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        color: 'text.secondary',
        marginBottom: 1,
      }}
    >
      {blog.url}
    </Typography>

    <Typography variant="body1">
      Likes: {blog.likes || 0}
    </Typography>

    {user && (
      <Button
        variant="contained"
        size="small"
        onClick={handleLike}
        sx={{ marginTop: 1 }}
      >
        Like
      </Button>
    )}

    <Typography
      variant="body2"
      sx={{
        marginTop: 1,
        color: 'text.secondary',
      }}
    >
      Author: {blog.author}
    </Typography>

    {user && blog.user?.username === user.username && (
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleRemove}
        sx={{ marginTop: 1 }}
      >
        Remove
      </Button>
    )}
  </Box>
)
}

export default Blog