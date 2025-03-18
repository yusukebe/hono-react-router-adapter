import devServer, { defaultOptions } from '@hono/vite-dev-server'
import type { Hono } from 'hono'
import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { GetLoadContext } from './react-router'

interface Adapter {
  env?: Record<string, unknown> | Promise<Record<string, unknown>>
  onServerClose?: () => Promise<void>
  executionContext?: {
    waitUntil(promise: Promise<unknown>): void
    passThroughOnException(): void
  }
}

interface Options {
  entry: string
  adapter?: () => Adapter | Promise<Adapter>
  getLoadContext?: GetLoadContext
  exclude?: (string | RegExp)[]
}

export default (options: Options): Plugin => {
  return devServer({
    adapter: options?.adapter,
    entry: options.entry,
    exclude: options?.exclude ?? [
      ...defaultOptions.exclude,
      '/assets/**',
      '/src/app/**',
      // matches for vite's import assets suffixes
      /\?(?:inline|url|no-inline|raw|import(?:&(?:inline|url|no-inline|raw)?)?)$/,
    ],
    injectClientScript: false,
    loadModule: async (server, entry) => {
      const appModule = await server.ssrLoadModule(entry)
      const app = appModule['default'] as Hono

      if (!app) {
        throw new Error(`Failed to find the module from ${entry}`)
      }

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const dir = __dirname

      const tsPath = path.resolve(dir, 'dev.ts')
      const jsPath = path.resolve(dir, 'dev.js')

      let devPath

      if (fs.existsSync(tsPath)) {
        devPath = tsPath
      } else if (fs.existsSync(jsPath)) {
        devPath = jsPath
      } else {
        throw new Error('Neither dev.ts nor dev.js found')
      }

      const devModule = await server.ssrLoadModule(devPath)
      return devModule['default'](app, {
        getLoadContext: options.getLoadContext,
      })
    },
  })
}
