import { useTranslation } from '@/app/i18n'
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
  const { t } = useTranslation('home')
  return (
    <Section>
      <SectionHead>
        <div>
          <h2>{t('coursesSection.title')}</h2>
          <p>{t('coursesSection.subtitle')}</p>
        </div>
        <ActionLink to="/course" $variant="soft">
          <HomeIcon name="plus" size={16} />
          {t('coursesSection.newCourse')}
        </ActionLink>
      </SectionHead>
      <CourseGrid>
        {courses.map(([title, topic, from, to, lessons, percent, status, variant]) => (
          <CourseCard key={title}>
            <CardArt $from={from} $to={to}>
              <HomeIcon name="book" size={34} />
            </CardArt>
            <CardBody>
              <Badge variant={variant}>{t('coursesSection.cards.status', { status })}</Badge>
              <h3>{title}</h3>
              <CardMeta>
                <span>{topic}</span>
                <span>·</span>
                <span>{t('coursesSection.cards.lessons', { count: lessons })}</span>
              </CardMeta>
              <CardFoot>
                <div className="row">
                  <span>{t('coursesSection.cards.percentComplete', { percent })}</span>
                  <ActionLink to="/course">
                    {t('coursesSection.cards.open')} <HomeIcon name="arrow" size={13} />
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
          <strong>{t('coursesSection.createCard.title')}</strong>
          <span>{t('coursesSection.createCard.subtitle')}</span>
        </CreateCard>
      </CourseGrid>
    </Section>
  )
}
