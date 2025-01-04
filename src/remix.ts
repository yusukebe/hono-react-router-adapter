import type { Context } from 'hono'
import type { AppLoadContext } from 'react-router'

type GetLoadContextArgs = {
  request: Request
  context: {
    // Relaxing the type definition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudflare: any
    hono: {
      context: Context
    }
  }
}

export type GetLoadContext = (args: GetLoadContextArgs) => AppLoadContext | Promise<AppLoadContext>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultGetLoadContext = ({ context }: any): AppLoadContext => {
  return {
    ...context,
  }
}

export const createGetLoadContextArgs = (c: Context): GetLoadContextArgs => {
  return {
    context: {
      cloudflare: {
        env: c.env,
        cf: c.req.raw.cf,
        ctx: c.executionCtx,
        // @ts-expect-error globalThis.caches is not typed
        caches: globalThis.caches ? caches : undefined,
      },
      hono: {
        context: c,
      },
    },
    request: c.req.raw,
  }
}
