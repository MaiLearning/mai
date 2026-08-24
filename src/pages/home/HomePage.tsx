import { CoursesSection } from './CoursesSection'
import { HeroSection } from './HeroSection'
import { HomeFooter } from './HomeFooter'
import { HomeHeader } from './HomeHeader'
import { HowItWorks } from './HowItWorks'
import { useCourses } from './useCourses'

export function HomePage() {
  const { courses, lessonCounts, loading, error, reload } = useCourses()
  return (
    <>
      <HomeHeader courses={courses} />
      <main>
        <HeroSection courses={courses} lessonCounts={lessonCounts} />
        <HowItWorks />
        <CoursesSection
          courses={courses}
          lessonCounts={lessonCounts}
          loading={loading}
          error={error}
          reload={reload}
        />
      </main>
      <HomeFooter />
    </>
  )
}
