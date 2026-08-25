import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { courseRoute, coursesRoute, homeRoute, rootRoute, settingsRoute } from './routes'

const routes: RouteObject[] = [rootRoute, homeRoute, courseRoute, settingsRoute, coursesRoute]

export const AppRouter = createBrowserRouter(routes)
