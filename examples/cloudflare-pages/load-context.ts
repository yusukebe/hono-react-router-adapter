import type { Context } from 'hono'
import type { AppLoadContext } from 'react-router'
import type { PlatformProxy } from 'wrangler'

type Env = {
  Bindings: {
    MY_VAR: string
  }
  Variables: {
    MY_VAR_IN_VARIABLES: string
  }
}

type Cloudflare = Omit<PlatformProxy<Env['Bindings']>, 'dispose'>

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: Cloudflare
    extra: string
    hono: {
      context: Context<Env>
    }
  }
}

type GetLoadContext = (args: {
  request: Request
  context: {
    cloudflare: Cloudflare
    hono: { context: Context<Env> }
  }
}) => AppLoadContext

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
  return {
    ...context,
    extra: 'stuff',
  }
}
