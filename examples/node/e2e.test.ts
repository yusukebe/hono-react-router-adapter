import { expect, test } from '@playwright/test'

test('Should return 200 response - /', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  const headers = response?.headers() ?? {}
  expect(headers['x-powered-by']).toBe('React Router and Hono')

  const contentH1 = await page.textContent('h1')
  expect(contentH1).toBe('React Router and Hono')

  const contentH2 = await page.textContent('h2')
  expect(contentH2).toMatch(/URL is http:\/\/localhost:\d+/)

  const contentH3 = await page.textContent('h3')
  expect(contentH3).toBe('Extra is stuff')
})

test('Should return 200 response - /api', async ({ page }) => {
  const response = await page.goto('/api')
  expect(response?.status()).toBe(200)
  expect(await response?.json()).toEqual({ message: 'Hello' })
})
