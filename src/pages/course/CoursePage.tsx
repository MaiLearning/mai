import { Menu } from 'lucide-react'
import { useState } from 'react'
import { CourseContent } from './CourseContent'
import { CourseSidebar } from './CourseSidebar'
import { course, flattenLessons } from './course.data'
import { Main, MenuButton, MobileBar, Shell } from './course.styles'

export function CoursePage() {
  const lessons = flattenLessons(course)
  const [activeId, setActiveId] = useState(
    () => lessons.find((lesson) => lesson.status === 'current')?.id ?? lessons[0].id,
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const index = lessons.findIndex((lesson) => lesson.id === activeId)
  const select = (id: string) => {
    setActiveId(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <Shell>
      <CourseSidebar
        course={course}
        activeId={activeId}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={select}
      />
      <Main>
        <MobileBar>
          <MenuButton onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
            Содержание
          </MenuButton>
          <span>{lessons[index].title}</span>
        </MobileBar>
        <CourseContent
          lesson={lessons[index]}
          hasNext={index < lessons.length - 1}
          onNext={() => index < lessons.length - 1 && select(lessons[index + 1].id)}
        />
      </Main>
    </Shell>
  )
}
