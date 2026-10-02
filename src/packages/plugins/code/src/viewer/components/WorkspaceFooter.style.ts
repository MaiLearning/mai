import { Loader2 } from 'lucide-react'
import styled from 'styled-components'
import type { StepStatus } from '../core/types'
import { FOOTER_HEIGHT, FOOTER_Z } from '../viewer.style'

// ─────────────────────────  Раскладка  ─────────────────────────

/**
 * Футер воркспейса урока кода: плавает поверх содержимого, сквозь
 * прозрачный фон видно блок урока. Высота задана кнопками и отступом —
 * резервировать место под подсказки не нужно: `Tooltip` темы нативный
 * (`title`) и рисуется браузером поверх всего. На узком вьюере
 * (container query) подписи сворачиваются в иконки.
 *
 * `box-sizing: border-box` обязателен: глобального сброса border-box в
 * приложении нет, и в content-box полоса стала бы 92px вместо
 * `FOOTER_HEIGHT` (44px кнопка + 24px отступ) — тогда резерв
 * `padding-bottom` в `LessonBlock` не совпадает с футером.
 *
 * `pointer-events: none` на самом футере: невидимые участки не должны
 * перехватывать клики по уроку под ними (выделение текста, drag, ссылки) —
 * их ловят только группы с кнопками.
 */
export const Footer = styled.footer`
  box-sizing: border-box;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${FOOTER_Z};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: ${FOOTER_HEIGHT};
  padding: 12px 32px;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  @container code-viewer (max-width: 479px) {
    padding: 8px 16px;
  }
`

/** Левая группа: навигация назад, автосохранение, результат проверки. */
export const FooterStart = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`

/** Правая группа: действие и навигация вперёд. */
export const FooterEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

// ─────────────────────────  Кнопки  ─────────────────────────

/** Кнопочная пластина: заливка btn, бордер, плавающая тень. */
const Plate = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
  color: ${({ theme }) => theme.contrastText.accent};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.utils.getSolid('accent', 'hover')};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

/** Иконная навигационная кнопка: квадрат 44×44. */
export const NavButton = styled(Plate)`
  width: 44px;
`

/** Действие («Проверить» / «Пройти заново»): пластина с подписью. */
export const ActionButton = styled(Plate)`
  gap: 8px;
  padding: 0 14px;
  font-size: 0.875rem;
  font-weight: 600;

  @container code-viewer (max-width: 479px) {
    width: 44px;
    padding: 0;
  }
`

/** Подпись действия: на узком вьюере скрывается, кнопка сжимается до иконки. */
export const ActionLabel = styled.span`
  @container code-viewer (max-width: 479px) {
    display: none;
  }
`

/** Спиннер запуска: та же анимация, что у графики темы. */
export const Spin = styled(Loader2)`
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

// ─────────────────────────  Результат  ─────────────────────────

/** Статус проверки: иконка + подпись, цвет по результату. */
export const Result = styled.span<{ $status: Exclude<StepStatus, 'idle'> }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme, $status }) =>
    $status === 'passed'
      ? theme.utils.getText('success', 'primary')
      : theme.utils.getText('danger', 'primary')};
`

/** Подпись результата: на узком вьюере скрывается, остаётся иконка. */
export const ResultLabel = styled.span`
  @container code-viewer (max-width: 479px) {
    display: none;
  }
`
