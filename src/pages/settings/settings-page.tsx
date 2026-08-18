import { Outlet } from 'react-router-dom'

export function SettingsPage() {
  return (
    <div>
      <h1>Настройки</h1>
      <Outlet />
    </div>
  )
}
