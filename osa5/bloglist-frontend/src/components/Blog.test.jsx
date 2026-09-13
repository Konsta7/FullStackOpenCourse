import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import CreateBlog from './CreateBlog'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

test('renders only certain content', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5
  }
  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Test Blog')

  expect(titleElement).toBeDefined()
})

test('renders url and likes when show button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5
  }
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const authorElement = screen.getByText('Test Author', { exact: false })
  const urlElement = screen.getByText('http://test.com',  { exact: false })
  const likesElement = screen.getByText('likes 5', { exact: false })

  expect(authorElement).toBeDefined()
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} onLike={mockHandler} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('testing that the creating blog form works', async () => {
  const user = userEvent.setup()
  const setBlogs = vi.fn()
  const setNotification = vi.fn()
  const setType = vi.fn()

  blogService.create.mockResolvedValue({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 0
  })

  render(
    <CreateBlog
      blogs={[]}
      setBlogs={setBlogs}
      setNotification={setNotification}
      setType={setType}
    />
  )

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'Test Blog')
  await user.type(inputs[1], 'Test Author')
  await user.type(inputs[2], 'http://test.com')

  const createButton = screen.getByText('create')
  await user.click(createButton)
  expect(blogService.create).toHaveBeenCalledTimes(1)
  expect(blogService.create).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com'
    })
  )
})