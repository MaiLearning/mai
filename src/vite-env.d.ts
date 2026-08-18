/// <reference types="vite/client" />

interface MaiConfigModule {
  mode: 'development' | 'production' | 'release'
  plugins: string[]
  logging: string
}

declare module 'virtual:mai-config' {
  const config: MaiConfigModule
  export default config
}
