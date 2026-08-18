import { RouteObject, Navigate } from 'react-router-dom'

export const rootRoute: RouteObject = {
  path: '/',
  element: <Navigate to="/home" replace />,
}
