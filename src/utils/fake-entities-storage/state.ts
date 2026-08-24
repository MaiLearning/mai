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
      topic: 'Frontend',
      colorFrom: '#6a54ff',
      colorTo: '#9d7bff',
      status: 'in_progress',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'course-japanese',
      name: 'Японский: базовые иероглифы',
      description: 'Первые 100 кандзи с примерами и практикой.',
      topic: 'Языки',
      colorFrom: '#1eae6f',
      colorTo: '#4ade80',
      status: 'draft',
      createdAt: now - 86_400_000,
      updatedAt: now - 86_400_000,
    },
    {
      id: 'course-music-theory',
      name: 'Теория музыки с нуля',
      description: 'Ноты, интервалы, аккорды — основы для музыканта.',
      topic: 'Музыка',
      colorFrom: '#f5a524',
      colorTo: '#fbbf24',
      status: 'completed',
      createdAt: now - 7 * 86_400_000,
      updatedAt: now - 2 * 86_400_000,
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
