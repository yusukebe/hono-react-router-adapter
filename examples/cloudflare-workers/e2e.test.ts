import { expect, test } from '@playwright/test'

test('Should return 200 response - /', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  const headers = response?.headers() ?? {}
  expect(headers['x-powered-by']).toBe('React Router and Hono')

  const contentH1 = await page.textContent('h1')
  expect(contentH1).toBe('React Router and Hono')

  const contentH2 = await page.textContent('h2')
  expect(contentH2).toBe('Var is My Value')

  const contentH3 = await page.textContent('h3')
  expect(contentH3).toBe('cf,ctx,caches are available')

  const contentH4 = await page.textContent('h4')
  expect(contentH4).toBe('Extra is stuff')

  const contentH5 = await page.textContent('h5')
  expect(contentH5).toBe('Var in Variables is My variable set in c.set')

  const contentH6 = await page.textContent('h6')
  expect(contentH6).toBe('waitUntil is defined')
})

test('Should return 200 response - /api', async ({ page }) => {
  const response = await page.goto('/api')
  expect(response?.status()).toBe(200)
  expect(await response?.json()).toEqual({ message: 'Hello', var: 'My Value' })
})
