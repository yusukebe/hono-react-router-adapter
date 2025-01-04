import { reactRouter } from '@react-router/dev/vite'
import serverAdapter from 'hono-react-router-adapter/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getLoadContext } from './load-context'

export default defineConfig({
  plugins: [
    reactRouter(),
    serverAdapter({
      getLoadContext,
      entry: './server/index.ts',
    }),
    tsconfigPaths(),
  ],
})
