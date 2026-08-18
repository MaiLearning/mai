import { CoursesSection } from './CoursesSection'
import { HeroSection } from './HeroSection'
import { HomeFooter } from './HomeFooter'
import { HomeHeader } from './HomeHeader'
import { HowItWorks } from './HowItWorks'

export function HomePage() {
  return (
    <>
      <HomeHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <CoursesSection />
      </main>
      <HomeFooter />
    </>
  )
}
