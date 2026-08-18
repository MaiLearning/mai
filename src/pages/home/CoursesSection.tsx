import { Badge, ProgressFill, ProgressTrack } from '@/app/theme/components'
import { HomeIcon } from './HomeIcon'
import { courses } from './home.data'
import {
  ActionLink,
  CardArt,
  CardBody,
  CardFoot,
  CardMeta,
  CourseCard,
  CourseGrid,
  CreateCard,
  CreateIcon,
  CoursesSection as Section,
  SectionHead,
} from './home.styles'

export function CoursesSection() {
  return (
    <Section>
      <SectionHead>
        <div>
          <h2>My courses</h2>
          <p>Everything you've built for yourself, in one place.</p>
        </div>
        <ActionLink to="/course" $variant="soft">
          <HomeIcon name="plus" size={16} />
          New course
        </ActionLink>
      </SectionHead>
      <CourseGrid>
        {courses.map(([title, topic, from, to, lessons, percent, status, variant]) => (
          <CourseCard key={title}>
            <CardArt $from={from} $to={to}>
              <HomeIcon name="book" size={34} />
            </CardArt>
            <CardBody>
              <Badge variant={variant}>{status}</Badge>
              <h3>{title}</h3>
              <CardMeta>
                <span>{topic}</span>
                <span>·</span>
                <span>{lessons} lessons</span>
              </CardMeta>
              <CardFoot>
                <div className="row">
                  <span>{percent}% complete</span>
                  <ActionLink to="/course">
                    Open <HomeIcon name="arrow" size={13} />
                  </ActionLink>
                </div>
                <ProgressTrack>
                  <ProgressFill $percent={percent} />
                </ProgressTrack>
              </CardFoot>
            </CardBody>
          </CourseCard>
        ))}
        <CreateCard to="/course">
          <CreateIcon>
            <HomeIcon name="plus" size={24} />
          </CreateIcon>
          <strong>Create a new course</strong>
          <span>Start from a topic, a goal, or a document you want to master.</span>
        </CreateCard>
      </CourseGrid>
    </Section>
  )
}
