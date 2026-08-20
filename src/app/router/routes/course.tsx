import { RouteObject } from 'react-router-dom'
import { CoursePage } from '@/layouts'
import { CoursePage as CourseView, ResourcePage } from '@/pages'

export const courseRoute: RouteObject = {
  path: '/course/:courseId',
  element: <CoursePage />,
  children: [
    { index: true, element: <CourseView /> },
    { path: 'resource/:resourceId', element: <ResourcePage /> },
  ],
}
