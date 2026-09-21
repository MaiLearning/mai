import { Card } from '@mai/theme'
import styled from 'styled-components'
import type { CourseStatus } from '../../core'

/** Контейнер секции: центрирование и боковые отступы. */
export const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
`

/**
 * Корень карточки курса. Объявлен контейнером: внутренние блоки карточки
 * (обложка, футер hero) адаптируются по её ширине, а не по вьюпорту.
 */
export const CourseCardRoot = styled(Card)`
  container-type: inline-size;
  container-name: course-card;
`

/**
 * Кнопка-действие в стиле ссылок главной страницы.
 * В пакете нет роутера: навигацию выполняет потребитель через onClick.
 */
export const SectionLink = styled.button<{
  $variant?: 'primary' | 'ghost' | 'soft'
  $size?: 'md' | 'lg'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.full};
  font-weight: 600;
  white-space: nowrap;
  font-size: ${({ $size }) => ($size === 'lg' ? '16px' : '14px')};
  padding: ${({ $size }) => ($size === 'lg' ? '14px 26px' : '10px 18px')};
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};
  background: ${({ theme, $variant }) =>
    $variant === 'ghost'
      ? 'transparent'
      : $variant === 'soft'
        ? theme.background.accentSubtle
        : theme.background.accent};
  color: ${({ theme, $variant }) =>
    $variant === 'ghost'
      ? theme.text.primary
      : $variant === 'soft'
        ? theme.text.accent
        : theme.text.onPrimary};
  border-color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.border.default : 'transparent')};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === 'ghost'
        ? theme.background.hover
        : $variant === 'soft'
          ? theme.background.selected
          : theme.background.accentHover};
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`

/**
 * Бейдж статуса курса. Маппинг под референс: черновик — amber,
 * в процессе — violet, завершён — emerald.
 */
export const StatusBadge = styled.span<{ $status: CourseStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 11px;
  font-weight: 500;
  ${({ theme, $status }) => {
    if ($status === 'completed')
      return `
        border: 1px solid ${theme.status.success.foreground}33;
        background: ${theme.status.success.background};
        color: ${theme.status.success.foreground};
      `
    if ($status === 'in_progress')
      return `
        border: 1px solid ${theme.text.accent}33;
        background: ${theme.background.accentSubtle};
        color: ${theme.text.accent};
      `

    return `
      border: 1px solid ${theme.status.warning.foreground}33;
      background: ${theme.status.warning.background};
      color: ${theme.status.warning.foreground};
    `
  }}
`
