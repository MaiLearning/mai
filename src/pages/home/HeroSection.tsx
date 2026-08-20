import { useTranslation } from '@/app/i18n'
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
  const { t } = useTranslation('home')
  return (
    <Hero>
      <div>
        <Badge variant="accent">
          <HomeIcon name="spark" size={14} />
          {t('hero.badge')}
        </Badge>
        <HeroTitle>
          {t('hero.title')} <span>Mai</span>
        </HeroTitle>
        <HeroText>{t('hero.text')}</HeroText>
        <HeroActions>
          <ActionLink to="/course" $size="lg">
            <HomeIcon name="plus" size={18} />
            {t('hero.createCourse')}
          </ActionLink>
          <ActionLink to="/course" $variant="ghost" $size="lg">
            {t('hero.continueLearning')} <HomeIcon name="arrow" size={18} />
          </ActionLink>
        </HeroActions>
      </div>
      <ContinueCard aria-label={t('hero.continueCard.ariaLabel')}>
        <TopRow>
          <Badge variant="primary">
            <HomeIcon name="flame" size={14} />
            {t('hero.badges.continue')}
          </Badge>
          <Badge variant="neutral">{t('hero.badges.yourCourse')}</Badge>
        </TopRow>
        <Thumb>
          <HomeIcon name="book" size={44} />
        </Thumb>
        <div>
          <CourseName>Understanding Neural Networks</CourseName>
          <Meta>
            <HomeIcon name="book" size={14} />
            {t('hero.progress.lessons')} <span>·</span>
            <HomeIcon name="clock" size={14} />
            {t('hero.progress.timeLeft')}
          </Meta>
        </div>
        <div>
          <ProgressLabel>
            <span>{t('hero.progressLabel.percent')}</span>
            <span>{t('hero.progressLabel.fraction')}</span>
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
          {t('hero.resumeCourse')} <HomeIcon name="arrow" size={16} />
        </ActionLink>
      </ContinueCard>
    </Hero>
  )
}
