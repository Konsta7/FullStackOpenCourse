import React from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'


const CreateBlog = ({ blogs, setBlogs, setNotification, setType }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
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
      setType('success')
      setTimeout(() => {
        setNotification(null)
        setType(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <form onSubmit={handleCreateBlog}>
        <label>
          title:
          <input
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={ ({ target }) => setNewBlogTitle(target.value) }
          />
          author:
          <input
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={ ({ target }) => setNewBlogAuthor(target.value) }
          />
          url:
          <input
            type="text"
            value={newBlogUrl}
            name="Url"
            onChange={ ({ target }) => setNewBlogUrl(target.value) }
          />
        </label>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlog
