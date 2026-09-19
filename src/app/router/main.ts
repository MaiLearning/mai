import { createBrowserRouter } from 'react-router-dom'
import { courseRoute } from './routes/course'
import { homeRoute } from './routes/home'
import { rootRoute } from './routes/root'

export const AppRouter = createBrowserRouter([rootRoute, homeRoute, courseRoute])
