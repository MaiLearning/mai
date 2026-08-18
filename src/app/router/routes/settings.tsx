import { Navigate, RouteObject } from 'react-router-dom'
import {
  CourseSettings,
  GlobalSettings,
  PluginSettings,
  ProfileSettings,
  SettingsPage,
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
