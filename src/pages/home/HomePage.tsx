import type { Course } from '@mai/course'
import { CoursesSection, CreateCourseModal, EditCourseModal } from '@mai/course'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeShell } from './ui/homeShell/HomeShell'
import { useCourses } from './useCourses'

export function HomePage() {
  const { courses, lessonCounts, continueCourse, loading, error, reload } = useCourses()
  const navigate = useNavigate()
  const [createOpened, setCreateOpened] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  return (
    // TODO: мок пользователя — заменить реальными данными, когда появится модель
    <HomeShell userInitials="АК">
      <CoursesSection
        courses={courses}
        lessonCounts={lessonCounts}
        continueCourse={continueCourse}
        loading={loading}
        error={error}
        reload={reload}
        onCreateCourse={() => setCreateOpened(true)}
        onEditCourse={setEditingCourse}
        onOpenCourse={(course) => navigate(`/course/${course.id}`)}
        onManageCourses={() => {}}
      />
      <CreateCourseModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        onCreated={(course) => {
          reload()
          navigate(`/course/${course.id}`)
        }}
      />
      <EditCourseModal
        opened={editingCourse !== null}
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSaved={reload}
        onDeleted={reload}
      />
    </HomeShell>
  )
}
