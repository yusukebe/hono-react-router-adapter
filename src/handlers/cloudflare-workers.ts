import { Hono } from 'hono'
import { reactRouter } from '../middleware'
import { defaultGetLoadContext } from '../react-router'
import type { GetLoadContext } from '../react-router'

type Options = {
  getLoadContext: GetLoadContext
}

// Relaxing the type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = (serverBuild: any, userApp?: Hono<any, any, any>, options?: Options) => {
  const app = new Hono()

  if (userApp) {
    app.route('/', userApp)
  }

  app.use(async (c, next) => {
    return reactRouter({
      build: serverBuild,
      mode: 'production',
      getLoadContext: options?.getLoadContext ?? defaultGetLoadContext,
    })(c, next)
  })
  return app
}

export default handler
