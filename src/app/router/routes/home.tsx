import { RouteObject } from 'react-router-dom'
import { HomePage } from '@/pages/home'

export const homeRoute: RouteObject = {
  path: '/home',
  element: <HomePage />,
}
