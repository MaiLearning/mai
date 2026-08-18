import { Badge, ProgressFill, ProgressTrack } from '@/app/theme/components'
import { HomeIcon } from './HomeIcon'
import {
  ActionLink,
  ContinueCard,
  CourseName,
  Hero,
  HeroActions,
  HeroText,
  HeroTitle,
  Meta,
  ProgressLabel,
  Thumb,
  TopRow,
} from './home.styles'

export function HeroSection() {
  return (
    <Hero>
      <div>
        <Badge variant="accent">
          <HomeIcon name="spark" size={14} />
          Learn anything, your way
        </Badge>
        <HeroTitle>
          You decide what to learn. <span>Mai</span> shapes it into a course.
        </HeroTitle>
        <HeroText>
          Mai isn't a catalog of someone else's classes. Describe what you want to understand, and
          it becomes a structured course you build, organize, and actually finish — at your own
          pace.
        </HeroText>
        <HeroActions>
          <ActionLink to="/course" $size="lg">
            <HomeIcon name="plus" size={18} />
            Create a course
          </ActionLink>
          <ActionLink to="/course" $variant="ghost" $size="lg">
            Continue learning <HomeIcon name="arrow" size={18} />
          </ActionLink>
        </HeroActions>
      </div>
      <ContinueCard aria-label="Continue where you left off">
        <TopRow>
          <Badge variant="primary">
            <HomeIcon name="flame" size={14} />
            Continue learning
          </Badge>
          <Badge variant="neutral">Your course</Badge>
        </TopRow>
        <Thumb>
          <HomeIcon name="book" size={44} />
        </Thumb>
        <div>
          <CourseName>Understanding Neural Networks</CourseName>
          <Meta>
            <HomeIcon name="book" size={14} />
            13 lessons <span>·</span>
            <HomeIcon name="clock" size={14} />
            ~3h left
          </Meta>
        </div>
        <div>
          <ProgressLabel>
            <span>46% complete</span>
            <span>6/13</span>
          </ProgressLabel>
          <ProgressTrack
            role="progressbar"
            aria-valuenow={46}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <ProgressFill $percent={46} />
          </ProgressTrack>
        </div>
        <ActionLink to="/course">
          Resume course <HomeIcon name="arrow" size={16} />
        </ActionLink>
      </ContinueCard>
    </Hero>
  )
}
