import { createMiddleware } from 'hono/factory'
import type { ServerBuild } from 'react-router'
import { createRequestHandler } from 'react-router'
import { createGetLoadContextArgs } from './react-router'
import type { GetLoadContext } from './react-router'

interface ReactRouterMiddlewareOptions {
  build: ServerBuild
  mode?: 'development' | 'production'
  getLoadContext: GetLoadContext
}

export const reactRouter = ({ mode, build, getLoadContext }: ReactRouterMiddlewareOptions) => {
  return createMiddleware(async (c) => {
    const requestHandler = createRequestHandler(build, mode)
    const args = createGetLoadContextArgs(c)

    const loadContext = getLoadContext(args)
    return await requestHandler(
      c.req.raw,
      loadContext instanceof Promise ? await loadContext : loadContext
    )
  })
}

/**
 * A string of directives for the Cache-Control header.
 * See the [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) docs for more information.
 */

type CacheControl = string

interface StaticAssetsOptions {
  cache?: CacheControl
}

export function staticAssets(options: StaticAssetsOptions = {}) {
  return createMiddleware(async (c, next) => {
    const binding = c.env?.ASSETS as Fetcher | undefined

    if (!binding) {
      throw new ReferenceError('The binding ASSETS is not set.')
    }

    let response: Response

    c.req.raw.headers.delete('if-none-match')

    try {
      response = await binding.fetch(c.req.url, c.req.raw.clone())

      // If the request failed, we just call the next middleware
      if (response.status >= 400) {
        return await next()
      }

      response = new Response(response.body, response)

      // If cache options are configured, we set the cache-control header
      if (options.cache) {
        response.headers.set('cache-control', options.cache)
      }

      return response
    } catch {
      return await next()
    }
  })
}
