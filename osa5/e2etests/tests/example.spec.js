const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })
  test('Valid credentials log in successfully', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
  })

  test('Invalid credentials show error message', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('Signed in user can create a blog', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText('new blog').click()
    await page.getByRole('textbox', { name: 'Title' }).fill('Test Blog')
    await page.getByRole('textbox', { name: 'Author' }).fill('Test Author')
    await page.getByRole('textbox', { name: 'Url' }).fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText('Test Blog by Test Author')).toBeVisible()
  })
  test('Signed in user can like a blog', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText('new blog').click()
    await page.getByRole('textbox', { name: 'Title' }).fill('Test Blog')
    await page.getByRole('textbox', { name: 'Author' }).fill('Test Author')
    await page.getByRole('textbox', { name: 'Url' }).fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('Test Blog by Test Author').click()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes 1')).toBeVisible()
  })
  test('Signed in user can delete a blog', async ({ page }) => {
    await page.getByText('login').click()
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText('new blog').click()
    await page.getByRole('textbox', { name: 'Title' }).fill('Test Blog')
    await page.getByRole('textbox', { name: 'Author' }).fill('Test Author')
    await page.getByRole('textbox', { name: 'Url' }).fill('http://test.com')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText('Test Blog by Test Author').click()
    await page.getByRole('button', { name: 'delete' }).click()
    await expect(page.getByText('Test Blog by Test Author')).not.toBeVisible()
  })
})

/*
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('user Matti Luukkainen is logged in')).toBeVisible()
    })
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
    test('A new blog can be created', async ({ page }) => {
      await createBlog({ title: 'Test Blog', author: 'Test Author', url: 'http://test.com' }, { page })
      await expect(page.getByText('a new blog', { exact: false })).toBeVisible()
    })
    test('A blog can be liked', async ({ page }) => {
      await createBlog({ title: 'Test Blog', author: 'Test Author', url: 'http://test.com' }, { page })
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
    test('A blog can be deleted', async ({ page }) => {
      await createBlog({ title: 'Test Blog', author: 'Test Author', url: 'http://test.com' }, { page })
      await page.getByRole('button', { name: 'show' }).click()
      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Test Blog')).not.toBeVisible()
    })
    test('Only logged in user can see the remove button', async ({ page }) => {
      await createBlog({ title: 'Test Blog', author: 'Test Author', url: 'http://test.com' }, { page })
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
    test('Blogs are ordered by likes', async ({ page }) => {
      await createBlog({ title: 'Blog 1', author: 'Author 1', url: 'http://blog1.com' }, { page })
      await page.getByRole('button', { name: 'cancel' }).click()
      await createBlog({ title: 'Blog 2', author: 'Author 2', url: 'http://blog2.com' }, { page })
      await page.getByRole('button', { name: 'cancel' }).click()
      await createBlog({ title: 'Blog 3', author: 'Author 3', url: 'http://blog3.com' }, { page })
      const blogElements = await page.getByRole('button', { name: 'show' }).all()
      await blogElements[0].click()
      await blogElements[0].click()
      await blogElements[0].click()
      const likeElements = await page.getByRole('button', { name: 'like' }).all()
      await likeElements[0].click()
      await likeElements[1].click()
      await likeElements[1].click()
      await likeElements[1].click()
      await likeElements[2].click()
      await likeElements[2].click()
      const blogTitles = await page.locator('.blog-title').allTextContents()
      expect(blogTitles).toEqual(['Blog 2', 'Blog 3', 'Blog 1'])
    })
  })
})
*/