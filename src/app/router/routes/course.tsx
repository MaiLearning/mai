import { RouteObject } from 'react-router-dom'
import { CourseOverview, CourseShell, ResourcePage } from '@/pages/course'

export const courseRoute: RouteObject = {
  path: '/course/:courseId',
  element: <CourseShell />,
  children: [
    { index: true, element: <CourseOverview /> },
    { path: 'resource/:resourceId', element: <ResourcePage /> },
  ],
}
