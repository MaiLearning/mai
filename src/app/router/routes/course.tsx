import { RouteObject } from 'react-router-dom'
import { CoursePage } from '@/layouts'
import { CourseInfo, ResourcePage } from '@/pages'

export const courseRoute: RouteObject = {
  path: '/course/:courseId',
  element: <CoursePage />,
  children: [
    { index: true, element: <CourseInfo /> },
    { path: 'resource/:resourceId', element: <ResourcePage /> },
  ],
}
