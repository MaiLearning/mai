import { useState } from 'react'
import type { Course } from '@/entities/course'
import { CoursesSection } from './CoursesSection'
import { HeroSection } from './HeroSection'
import { HomeFooter } from './HomeFooter'
import { HomeHeader } from './HomeHeader'
import { HowItWorks } from './HowItWorks'
import { CreateCourseModal } from './modal/CreateCourseModal'
import { EditCourseModal } from './modal/EditCourseModal'
import { useCourses } from './useCourses'

export function HomePage() {
  const { courses, lessonCounts, continueCourse, loading, error, reload } = useCourses()
  const [createOpened, setCreateOpened] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  return (
    <>
      <HomeHeader continueCourse={continueCourse} onCreateCourse={() => setCreateOpened(true)} />
      <main>
        <HeroSection
          continueCourse={continueCourse}
          lessonCounts={lessonCounts}
          onCreateCourse={() => setCreateOpened(true)}
        />
        <HowItWorks />
        <CoursesSection
          courses={courses}
          lessonCounts={lessonCounts}
          loading={loading}
          error={error}
          reload={reload}
          onCreateCourse={() => setCreateOpened(true)}
          onEditCourse={setEditingCourse}
        />
      </main>
      <HomeFooter />
      <CreateCourseModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={reload}
      />
      <EditCourseModal
        opened={editingCourse !== null}
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSaved={reload}
        onDeleted={reload}
      />
    </>
  )
}
