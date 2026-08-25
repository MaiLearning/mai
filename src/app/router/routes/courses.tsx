import { RouteObject } from 'react-router-dom'
import { CoursesPage } from '@/pages'

export const coursesRoute: RouteObject = {
  path: '/courses',
  element: <CoursesPage />,
}
