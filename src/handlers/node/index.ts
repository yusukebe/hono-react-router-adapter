import { Hono } from 'hono'
import type { AppLoadContext } from 'react-router'
import { remix } from './middleware'
import type { GetLoadContext } from './remix'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultGetLoadContext = ({ context }: any): AppLoadContext => {
  return {
    ...context,
  }
}

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
    return remix({
      build: serverBuild,
      mode: 'production',
      getLoadContext: options?.getLoadContext ?? defaultGetLoadContext,
    })(c, next)
  })

  return app
}

export default handler
