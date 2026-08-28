/**
 * Заглушка virtual:mai-config для Vitest: виртуальный модуль генерируется
 * vite-плагином mai-config (vite.config.ts), который в тестовом раннере
 * не подключён. Значения соответствуют config/development.conf.
 */
const config = {
  mode: 'development',
  plugins: ['internal'],
  logging: 'debug',
  fakeData: false,
}

export default config
