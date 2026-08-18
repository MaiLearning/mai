import { Navigate, RouteObject } from 'react-router-dom'

export const rootRoute: RouteObject = {
  path: '/',
  element: <Navigate to="/home" replace />,
}
