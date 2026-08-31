import styled from 'styled-components'
import type { CheckStatus } from '../core/types'

// ─────────────────────────  Раскладка  ─────────────────────────

/**
 * Футер воркспейса: высокий, группы прижаты к низу — запас под тултипы.
 * На узком вьюере (container query) — компактный, подписи сворачиваются в иконки.
 */
export const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  min-height: 104px;
  padding: 8px 28px 18px;
  background: ${({ theme }) => theme.colors.body};

  @container task-viewer (max-width: 479px) {
    min-height: 64px;
    padding: 4px 16px 6px;
  }
`

/** Левая группа: навигация назад, автосохранение, результат проверки. */
export const FooterStart = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.btn};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.btnHover};
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

  @container task-viewer (max-width: 479px) {
    width: 44px;
    padding: 0;
  }
`

/** Подпись действия: на узком вьюере скрывается, кнопка сжимается до иконки. */
export const ActionLabel = styled.span`
  @container task-viewer (max-width: 479px) {
    display: none;
  }
`

// ─────────────────────────  Результат  ─────────────────────────

/** Статус проверки: иконка + подпись, цвет по результату. */
export const Result = styled.span<{ $status: Exclude<CheckStatus, 'idle'> }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme, $status }) =>
    $status === 'correct' ? theme.colors.success : theme.colors.danger};
`

/** Подпись результата: на узком вьюере скрывается, остаётся иконка. */
export const ResultLabel = styled.span`
  @container task-viewer (max-width: 479px) {
    display: none;
  }
`
