import { ArrowRight, CheckCircle2, Clock, FileText, ListChecks, PenLine, Play } from 'lucide-react'
import { Button } from '@/app/theme/components/Button'
import type { CourseNode, LessonType } from './course.data'
import {
  Article,
  Badge,
  Callout,
  Kicker,
  Lead,
  Media,
  NavBar,
  PlayCircle,
  Prose,
  Title,
} from './course.styles'

const labels: Record<LessonType, string> = {
  video: 'Видео-урок',
  reading: 'Чтение',
  exercise: 'Практика',
  quiz: 'Проверка знаний',
}
const icons: Record<LessonType, typeof Play> = {
  video: Play,
  reading: FileText,
  exercise: PenLine,
  quiz: ListChecks,
}

export function CourseContent({
  lesson,
  hasNext,
  onNext,
}: {
  lesson: CourseNode
  hasNext: boolean
  onNext: () => void
}) {
  const type = lesson.type as LessonType
  const Icon = icons[type]
  return (
    <Article>
      <Kicker>
        <Badge $tone="primary">
          <Icon size={14} />
          {labels[type]}
        </Badge>
        <Badge>
          <Clock size={13} />
          {lesson.duration}
        </Badge>
        {lesson.status === 'done' && (
          <Badge $tone="success">
            <CheckCircle2 size={14} />
            Завершено
          </Badge>
        )}
      </Kicker>
      <Title>{lesson.title}</Title>
      <Lead>
        Сфокусированный практический разбор. Изучи материал, а затем примени его в следующем шаге.
      </Lead>
      <Media $type={type} aria-label={`${labels[type]}: ${lesson.title}`}>
        {type === 'video' ? (
          <PlayCircle>
            <Play size={30} fill="white" />
          </PlayCircle>
        ) : (
          <Icon size={48} strokeWidth={1.4} />
        )}
      </Media>
      <Prose>
        <p>
          Каждая идея этого урока опирается на предыдущую. Начнем с ментальной модели, а затем
          разберем конкретный пример, который можно адаптировать под свой проект.
        </p>
        <h2>Что ты изучишь</h2>
        <ul>
          <li>Главную идею и подходящий момент для ее применения</li>
          <li>
            Минимальный рабочий пример с <code>props</code> и состоянием
          </li>
          <li>Типичные ошибки и способы их избежать</li>
        </ul>
        <Callout>
          Совет: держи рядом черновик и переписывай примеры самостоятельно вместо механического
          копирования.
        </Callout>
        <p>
          Когда будешь готов, отметь урок завершенным и продолжай. Прогресс отображается в
          содержании курса.
        </p>
      </Prose>
      <NavBar>
        <Button variant="ghost">Отметить завершенным</Button>
        <Button onClick={onNext} disabled={!hasNext}>
          {hasNext ? 'Следующий урок' : 'Курс завершен'} <ArrowRight size={16} />
        </Button>
      </NavBar>
    </Article>
  )
}
