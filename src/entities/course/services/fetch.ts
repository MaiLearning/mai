import { z } from 'zod'
import { fetchAllCourses as invokeFetchAll, fetchCourseById as invokeFetchById } from '../api/fetch'
import type { Course } from '../core/model'
import { CourseSchema } from '../core/schema'

export async function fetchAllCourses(): Promise<Course[]> {
  const data = await invokeFetchAll()
  return z.array(CourseSchema).parse(data)
}

export async function fetchCourseById(id: string): Promise<Course> {
  const data = await invokeFetchById(id)
  return CourseSchema.parse(data)
}
