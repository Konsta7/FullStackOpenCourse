const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  console.log("fetching blogs...")
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  console.log("creating blog...")
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  console.log("decoded token: ", decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }
  console.log("finding user")
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({error: 'User id missing or invalid'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  console.log("deleting blog...")
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  console.log("updating blog...")
  const updatedBlog = await Blog.findById(request.params.id)
  updatedBlog.likes = request.body.likes
  updatedBlog.title = request.body.title
  updatedBlog.author = request.body.author
  updatedBlog.url = request.body.url
  await updatedBlog.save()
  response.json(updatedBlog) 
})


module.exports = blogsRouter