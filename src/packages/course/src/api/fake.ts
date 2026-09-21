import { fakeId, fakeNow, fakeState } from '@mai/fakeData'
import type { Course, CreateCourseInput, TagStat, UpdateCourseInput } from '../core/model'

function findCourse(id: string): Course {
  const course = fakeState.courses.find((c) => c.id === id)
  if (!course) throw new Error(`Курс не найден: ${id}`)

  return course
}

export function fakeFetchAllCourses(): Promise<Course[]> {
  return Promise.resolve([...fakeState.courses])
}

export function fakeFetchCourseById(id: string): Promise<Course> {
  return Promise.resolve(findCourse(id))
}

export function fakeFetchTags(): Promise<TagStat[]> {
  const counts = new Map<string, number>()

  for (const course of fakeState.courses) {
    for (const tag of course.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return Promise.resolve([...counts.entries()].map(([name, count]) => ({ name, count })))
}

export function fakeSendCreateCourse(input: CreateCourseInput): Promise<Course> {
  const now = fakeNow()
  const course: Course = {
    id: fakeId(),
    name: input.name,
    description: input.description,
    tags: input.tags ?? [],
    colorFrom: input.colorFrom ?? null,
    colorTo: input.colorTo ?? null,
    status: input.status ?? 'draft',
    createdAt: now,
    updatedAt: now,
  }

  fakeState.courses.unshift(course)

  return Promise.resolve({ ...course })
}

export function fakeSendUpdateCourse(input: UpdateCourseInput): Promise<Course> {
  const course = findCourse(input.id)

  Object.assign(course, {
    name: input.name,
    description: input.description,
    tags: input.tags,
    colorFrom: input.colorFrom,
    colorTo: input.colorTo,
    status: input.status,
    updatedAt: fakeNow(),
  })

  return Promise.resolve({ ...course })
}

export function fakeSendDeleteCourse(id: string): Promise<void> {
  const index = fakeState.courses.findIndex((c) => c.id === id)
  if (index === -1) throw new Error(`Курс не найден: ${id}`)

  fakeState.courses.splice(index, 1)

  return Promise.resolve()
}
