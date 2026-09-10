/**
 * Заглушка virtual:mai-config для Storybook: виртуальный модуль
 * генерируется vite-плагином mai-config (vite.config.ts), который в
 * сторибуке не подключён. В браузерном окружении (без Tauri) backend
 * недоступен, поэтому fakeData: true — настройки и сущности работают
 * через in-memory ветку api без invoke-заглушек.
 */
const config = {
  mode: 'development',
  plugins: ['internal'],
  logging: 'debug',
  fakeData: true,
}

export default config
