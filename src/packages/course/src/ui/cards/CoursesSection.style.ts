import styled from 'styled-components'
import type { CourseStatus } from '../../core'
import { MainContainer } from './shared.style'

export const CoursesSection = styled(MainContainer)`
  padding: 48px 20px 72px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 64px 32px 96px;
  }
`

export const SectionHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  h2 {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
  }
  p {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.text.muted};
  }
`

export const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

// ------------------------------------------------------------------
// Карточка курса: градиентная обложка с тегами + контент с футером
// ------------------------------------------------------------------

export const CourseCard = styled.article`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

/** Обложка карточки: градиент из двух цветов курса. */
export const CardCover = styled.div<{ $from: string; $to: string; $ink: string }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 110px;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ $ink }) => $ink};
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
`

export const CoverTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: calc(100% - 44px);
`

/** Чип тега поверх градиента; фон зависит от контрастного цвета текста. */
export const CoverTag = styled.span<{ $ink: string }>`
  padding: 3px 9px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $ink }) =>
    $ink === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(22, 20, 40, 0.14)'};
  font-size: 11.5px;
  font-weight: 600;
`

/** Кнопка редактирования курса в углу обложки. */
export const CoverEditButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  backdrop-filter: blur(6px);
  transition:
    background 0.16s ease,
    transform 0.12s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.36);
  }
  &:active {
    transform: scale(0.94);
  }
  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`

export const CardBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing.md};

  /* Фиксированная высота в 2 строки — чтобы все ряды сетки были одной высоты */
  h3 {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.3;
    min-height: calc(2 * 1.3em);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

/** Описание курса — не больше двух строк; блок всегда высотой в 2 строки. */
export const CardDescription = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  min-height: calc(2 * 1.5em);
  color: ${({ theme }) => theme.text.muted};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/** Строка мета: статус-бейдж + счётчик уроков. Прижата к низу карточки,
 * чтобы у всех карточек ряда статус и уроки были на одном уровне. */
export const CardMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.text.muted};
`

export const StatusBadge = styled.span<{ $status: CourseStatus }>`
  padding: 3px 9px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 11.5px;
  font-weight: 600;
  ${({ theme, $status }) => {
    if ($status === 'completed')
      return `
        background: ${theme.status.success.background};
        color: ${theme.status.success.foreground};
      `
    if ($status === 'in_progress')
      return `
        background: ${theme.status.warning.background};
        color: ${theme.status.warning.foreground};
      `

    return `
      background: ${theme.background.accentSubtle};
      color: ${theme.text.muted};
    `
  }}
`

/** Футер карточки: процент завершения, ссылка «Открыть» и прогресс-трек. */
export const CardFoot = styled.div`
  display: grid;
  gap: 8px;
  padding-top: 10px;
  color: ${({ theme }) => theme.text.muted};
  font-size: 12px;
  font-weight: 600;
  .row {
    display: flex;
    justify-content: space-between;
  }
`

/** Трек прогресса карточки (в новой теме нет ProgressTrack — живёт здесь). */
export const ProgressTrack = styled.div`
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.body};
  overflow: hidden;
`

export const ProgressFill = styled.span<{ $percent: number }>`
  display: block;
  height: 100%;
  width: ${({ $percent }) => `${Math.min(100, Math.max(0, $percent))}%`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.background.accent};
  transition: width ${({ theme }) => theme.durations.normal};
`

export const CreateCard = styled.button`
  cursor: pointer;
  font-family: inherit;
  min-height: 220px;
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 32px;
  border: 2px dashed ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  text-align: center;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background 0.16s ease;
  strong {
    color: ${({ theme }) => theme.text.primary};
    font-size: 16px;
  }
  span {
    max-width: 28ch;
    font-size: 13.5px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.border.accent};
    color: ${({ theme }) => theme.text.accent};
    background: ${({ theme }) => theme.background.accentSubtle}55;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`

export const CreateIcon = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.accentSubtle};
  color: ${({ theme }) => theme.text.accent};
`
