import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { courseRoute, homeRoute, rootRoute, settingsRoute } from './routes'

const routes: RouteObject[] = [rootRoute, homeRoute, courseRoute, settingsRoute]

export const AppRouter = createBrowserRouter(routes)
