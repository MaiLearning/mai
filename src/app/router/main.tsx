import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { rootRoute, homeRoute, courseRoute, settingsRoute } from './routes'

const routes: RouteObject[] = [rootRoute, homeRoute, courseRoute, settingsRoute]

export const AppRouter = createBrowserRouter(routes)
