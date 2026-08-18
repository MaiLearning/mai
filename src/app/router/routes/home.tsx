import { RouteObject } from 'react-router-dom'
import { HomePage } from '@/pages'

export const homeRoute: RouteObject = {
  path: '/home',
  element: <HomePage />,
}
