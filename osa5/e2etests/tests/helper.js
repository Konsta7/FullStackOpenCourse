const createBlog = async ({ title, author, url }, { page }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill(title)
  await textboxes[1].fill(author)
  await textboxes[2].fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

export { createBlog }