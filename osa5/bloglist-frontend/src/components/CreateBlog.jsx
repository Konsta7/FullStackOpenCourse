import React from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'


const CreateBlog = ({ blogs, setBlogs, setNotification, setType }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const navigate = useNavigate()
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogLikes, setNewBlogLikes] = useState(0)


  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
        likes: newBlogLikes
      })
      setBlogs(blogs.concat(newBlog))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setNewBlogLikes(0)
      setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      console.log("Blog created successfully")
      setType('success')
      navigate('/')
      setTimeout(() => {
        setNotification(null)
        setType(null)
      }, 5000)
    } catch (exception) {
      console.log("Ei creatatttuuuuuu", exception)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <TextField
          label="Title"
          variant="outlined"
          value={newBlogTitle}
          onChange={({ target }) => setNewBlogTitle(target.value)}
          sx={{ mb: 2 }}
        />
        <br/>
        <TextField
          label="Author"
          variant="outlined"
          value={newBlogAuthor}
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          sx={{ mb: 2 }}
        />
        <br/>
        <TextField
          label="Url"
          variant="outlined"
          value={newBlogUrl}
          onChange={({ target }) => setNewBlogUrl(target.value)}
        />
        <br/>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default CreateBlog
