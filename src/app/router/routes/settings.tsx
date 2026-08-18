import { RouteObject, Navigate } from 'react-router-dom'
import { SettingsPage } from '@/pages/settings'
import {
  GlobalSettings,
  ProfileSettings,
  CourseSettings,
  PluginSettings,
} from '@/pages/settings'

export const settingsRoute: RouteObject = {
  path: '/settings',
  element: <SettingsPage />,
  children: [
    { index: true, element: <Navigate to="app" replace /> },
    { path: 'app', element: <GlobalSettings /> },
    { path: 'profile', element: <ProfileSettings /> },
    { path: 'course/:courseId', element: <CourseSettings /> },
    { path: 'plugin/:pluginId', element: <PluginSettings /> },
  ],
}
