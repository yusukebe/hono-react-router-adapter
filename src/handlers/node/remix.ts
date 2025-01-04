import type { Context } from 'hono'
import type { AppLoadContext } from 'react-router'

export type GetLoadContext = (args: {
  request: Request
}) => AppLoadContext | Promise<AppLoadContext>

export const createGetLoadContextArgs = (c: Context) => {
  return {
    context: {},
    request: c.req.raw,
  }
}
