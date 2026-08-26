import { devtools } from '@tanstack/devtools-vite'
import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { runtimeDir as nitroRuntimeDir } from 'nitro/meta'
import { nitro } from 'nitro/vite'
import { resolve as resolvePath } from 'node:path'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      preset: 'bun',
      rollupConfig: { external: [/^@sentry\//] },
      hooks: {
        'build:before'(nitro) {
          nitro.options.handlers.push({
            route: '/api/image/**',
            method: 'GET',
            handler: resolvePath(nitroRuntimeDir, 'internal/vite/ssr-renderer'),
          })
        },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
