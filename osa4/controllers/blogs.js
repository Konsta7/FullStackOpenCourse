const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  console.log("fetching blogs...")
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  console.log("creating blog...")
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

module.exports = blogsRouter