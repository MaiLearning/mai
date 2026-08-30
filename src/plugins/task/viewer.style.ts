import styled, { css } from 'styled-components'
import { readableOn } from '@/features/course-modal'
import type { CheckStatus } from './core/types'

// ─────────────────────────  Корневая зона  ─────────────────────────

/** Корень вьюера задач — занимает всё доступное пространство. */
export const Viewer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  background: ${({ theme }) => theme.colors.body};
  color: ${({ theme }) => theme.colors.text};
`

/** Центрированная зона загрузки / пустого состояния. */
export const SpinnerWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
`

export const EmptyText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 40px 32px;
`

export const BodyInner = styled.div`
  width: 100%;
  max-width: 720px;
`

// ─────────────────────────  Header  ─────────────────────────

export const Header = styled.header`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 32px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const StepStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const Step = styled.button<{ $state: 'idle' | 'current' | 'correct' | 'incorrect' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ $state, theme }) =>
    $state === 'current' &&
    css`
      border-color: ${theme.colors.primary};
      background: ${theme.colors.primarySurface};
      color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primarySurface};
    `}

  ${({ $state, theme }) =>
    $state === 'correct' &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
      color: ${theme.colors.success};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
      color: ${theme.colors.danger};
    `}
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

/** Спец-квадратик в конце степ-полосы: создание новой задачи. */
export const StepAdd = styled(Step).attrs({ $state: 'idle' as const })`
  border-style: dashed;
  background: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }
`

export const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const TaskNo = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

export const Badge = styled.span<{
  $tone?: 'default' | 'easy' | 'medium' | 'hard'
  $color?: string
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};

  ${({ $tone, theme }) =>
    $tone === 'easy' &&
    css`
      color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
      border-color: transparent;
    `}
  ${({ $tone, theme }) =>
    $tone === 'medium' &&
    css`
      color: ${theme.colors.accent};
      background: ${theme.colors.accentSurface};
      border-color: transparent;
    `}
  ${({ $tone, theme }) =>
    $tone === 'hard' &&
    css`
      color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
      border-color: transparent;
    `}

  /* Своя сложность: цвет автора, текст — контрастный. Перекрывает тон. */
  ${({ $color }) =>
    $color &&
    css`
      color: ${readableOn($color)};
      background: ${$color};
      border-color: transparent;
    `}
`

export const KindBadge = styled(Badge)`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySurface};
  border-color: transparent;
`

export const ModeToggle = styled.div`
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const ModeButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.textOnPrimary : theme.colors.textMuted)};

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.colors.textOnPrimary : theme.colors.text)};
  }
`

// ─────────────────────────  Footer  ─────────────────────────

export const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const FooterSide = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Result = styled.span<{ $status: CheckStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme, $status }) =>
    $status === 'correct'
      ? theme.colors.success
      : $status === 'incorrect'
        ? theme.colors.danger
        : theme.colors.textMuted};
`

export const IconButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySurface : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: 0.9375rem;
  font-weight: 600;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.surfaceElevated};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
