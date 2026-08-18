import { v4 as uuid } from 'uuid'
import type { Course } from '../../entities/course/core/model'
import type { Directory } from '../../entities/directory/core/model'
import type { Resource, ResourceType } from '../../entities/resource/core/model'
import type { StructureNodeFlat } from '../../entities/structure/core/model'

const now = Date.now()
const courseId = 'course-react-basics'
const theoryId = 'node-react-theory'
const practiceId = 'node-react-practice'

export const fakeState: {
  courses: Course[]
  directories: Directory[]
  resources: Resource[]
  resourceTypes: ResourceType[]
  nodes: StructureNodeFlat[]
} = {
  courses: [
    {
      id: courseId,
      name: 'Основы React',
      description: 'Практический курс по React и современному frontend.',
      createdAt: now,
      updatedAt: now,
    },
  ],
  directories: [
    { id: theoryId, courseId, name: 'Теория', createdAt: now, updatedAt: now },
    { id: practiceId, courseId, name: 'Практика', createdAt: now, updatedAt: now },
  ],
  resources: [
    {
      id: 'resource-components',
      courseId,
      typeKey: 'theory',
      name: 'Компоненты и props',
      metadata: {},
      files: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resource-hooks',
      courseId,
      typeKey: 'theory',
      name: 'Хуки',
      metadata: {},
      files: [],
      createdAt: now,
      updatedAt: now,
    },
  ],
  resourceTypes: [
    {
      key: 'theory',
      name: 'Теория',
      description: 'Теоретический материал',
      pluginId: null,
      supportedExtensions: [],
      createdAt: now,
      updatedAt: now,
    },
  ],
  nodes: [
    {
      id: theoryId,
      courseId,
      parentId: null,
      position: 0,
      isDirectory: true,
      resource: null,
      directoryId: theoryId,
      name: 'Теория',
    },
    {
      id: 'node-components',
      courseId,
      parentId: theoryId,
      position: 0,
      isDirectory: false,
      resource: {
        id: 'resource-components',
        courseId,
        typeKey: 'theory',
        name: 'Компоненты и props',
        metadata: {},
        files: [],
        createdAt: now,
        updatedAt: now,
      },
      directoryId: null,
      name: 'Компоненты и props',
    },
    {
      id: 'node-hooks',
      courseId,
      parentId: theoryId,
      position: 1,
      isDirectory: false,
      resource: {
        id: 'resource-hooks',
        courseId,
        typeKey: 'theory',
        name: 'Хуки',
        metadata: {},
        files: [],
        createdAt: now,
        updatedAt: now,
      },
      directoryId: null,
      name: 'Хуки',
    },
    {
      id: practiceId,
      courseId,
      parentId: null,
      position: 1,
      isDirectory: true,
      resource: null,
      directoryId: practiceId,
      name: 'Практика',
    },
  ],
}

export function fakeId(): string {
  return uuid()
}
export function fakeNow(): number {
  return Date.now()
}
