import { Navigate, RouteObject } from 'react-router-dom'
import { CourseSettings, SectionOutlet } from '@/features/settings'
import { SettingsPage } from '@/pages/settings'

export const settingsRoute: RouteObject = {
  path: '/settings',
  element: <SettingsPage />,
  children: [
    { index: true, element: <Navigate to="general" replace /> },
    // Параметрические настройки курса — статический префикс важнее :sectionId
    { path: 'course/:courseId', element: <CourseSettings /> },
    { path: ':sectionId', element: <SectionOutlet /> },
  ],
}
