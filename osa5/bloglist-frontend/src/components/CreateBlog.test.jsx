import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'
import { expect, vi } from 'vitest'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

test('form calls callback with correct data when blog is created', async () => {
  const mockSetBlogs = vi.fn()
  const mockSetNotification = vi.fn()
  const mockSetType = vi.fn()
  const blogs = [
    {
      title: 'Existing Blog',
      author: 'Existing Author',
      url: 'http://existing.com',
      likes: 3,
      id: '1'
    }
  ]
  
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'http://new.com',
    likes: 0,
    id: '2'
  }

  blogService.create.mockResolvedValue(newBlog)

  render(
    <CreateBlog
      blogs={blogs}
      setBlogs={mockSetBlogs}
      setNotification={mockSetNotification}
      setType={mockSetType}
    />
  )

  const user = userEvent.setup()

  const inputs = screen.getAllByRole('textbox')
  
  await user.type(inputs[0], 'New Blog')
  await user.type(inputs[1], 'New Author')
  await user.type(inputs[2], 'http://new.com')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(mockSetBlogs).toHaveBeenCalledWith([...blogs, newBlog])
})
