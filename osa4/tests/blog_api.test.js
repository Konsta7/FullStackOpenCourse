const assert = require('node:assert')
const mongoose = require('mongoose')
const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)

const initialBlogs = [
    {
    title: 'You Don’t Know JS Yet',
    author: 'Kyle Simpson',
    url: 'https://github.com/getify/You-Dont-Know-JS',
    likes: 15,
    },

    {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
    likes: 23,
    }
]

const initialUsers = [
   {
    username: 'testuser',
    name: 'Test User',
    passwordHash: bcrypt.hashSync('testpassword', 10)
   },

   {
    username: 'anotheruser',
    name: 'Another User',
    passwordHash: bcrypt.hashSync('anotherpassword', 10)
   }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  await User.deleteMany({})
  let userObject = new User(initialUsers[0])
  await userObject.save()
  userObject = new User(initialUsers[1])
  await userObject.save()
})



test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('all blogs have an id property', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body[0].id)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    }

    await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    
    assert.strictEqual((await api.get('/api/blogs')).body.length, initialBlogs.length + 1)
})

test('deleting a blog works', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
})

test('updating a blog works', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const updatedBlog = {
        author: blogToUpdate.author,
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        likes: 16
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body[0].likes, updatedBlog.likes)
})

test('all users are returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, initialUsers.length)
})

test('adding a new user works', async () => {
    const usersAtStart = await api.get('/api/users')
    const newUser = {
      username: 'Pertti21',
      name: 'Pertti Pouta',
      password: 'testpassword'
    }

    await api.post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1)
})



after(async () => {
  await mongoose.connection.close()
})