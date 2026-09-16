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
