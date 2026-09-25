import { RouteObject } from 'react-router-dom'
import { SettingsPage } from '@/pages/settings'

export const settingsRoute: RouteObject = {
  path: '/settings',
  element: <SettingsPage />,
}
