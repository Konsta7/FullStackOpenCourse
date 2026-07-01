const assert = require('node:assert')
const mongoose = require('mongoose')
const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
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

after(async () => {
  await mongoose.connection.close()
})