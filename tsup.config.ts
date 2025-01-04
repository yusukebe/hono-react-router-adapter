import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/vite-plugin.ts',
    'src/dev.ts',
    'src/handlers/cloudflare-pages.ts',
    'src/handlers/cloudflare-workers.ts',
    'src/handlers/node/index.ts',
    'src/remix.ts',
  ],
  external: [
    '../server',
    'virtual:react-router/server-build',
    'hono',
    '@react-router/cloudflare',
    'vite',
    '@react-router/node',
  ],
  format: 'esm',
  splitting: false,
  dts: true,
})
