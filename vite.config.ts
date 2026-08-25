import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const host = process.env.TAURI_DEV_HOST
const virtualModuleId = 'virtual:mai-config'
const resolvedVirtualModuleId = `\0${virtualModuleId}`

function maiConfigPlugin(mode: string): Plugin {
  return {
    name: 'mai-config',
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : undefined
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return undefined

      const configPath = path.resolve(__dirname, 'config', `${mode}.conf`)
      const values = Object.fromEntries(
        fs
          .readFileSync(configPath, 'utf8')
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('#'))
          .map((line) => {
            const separator = line.indexOf('=')
            if (separator < 1) {
              throw new Error(`Некорректная строка в ${configPath}: ${line}`)
            }

            return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
          }),
      )

      return `export default ${JSON.stringify({
        mode,
        plugins: values.plugins ? values.plugins.split(',').map((item) => item.trim()) : [],
        logging: values.logging ?? 'info',
        fakeData: values.fake_data === 'true' && mode === 'development',
      })}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [maiConfigPlugin(mode), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
}))
