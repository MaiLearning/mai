import styled, { css } from 'styled-components'

// ─────────────────────────  Корневая зона  ─────────────────────────

/** Корень вьюера урока кода — занимает всё доступное пространство. */
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

/**
 * Скролл-зона основного содержимого. `data-lenis-prevent` — ReactLenis root
 * перехватывает wheel на window, вложенный скролл должен крутиться нативно.
 */
export const Body = styled.div.attrs({ className: 'app-scroll', 'data-lenis-prevent': 'true' })`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 28px 32px;
`

export const BodyInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 860px;
  min-height: 0;
`

// ─────────────────────────  Header  ─────────────────────────

export const Header = styled.header`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 32px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const StepStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const Step = styled.button<{ $state: 'idle' | 'current' | 'passed' | 'failed' }>`
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
    $state === 'passed' &&
    css`
      border-color: ${theme.colors.success};
      background: ${theme.colors.successSurface};
      color: ${theme.colors.success};
    `}

  ${({ $state, theme }) =>
    $state === 'failed' &&
    css`
      border-color: ${theme.colors.danger};
      background: ${theme.colors.dangerSurface};
      color: ${theme.colors.danger};
    `}
`

/** Спец-квадратик в конце степ-полосы: создание нового шага (edit-режим). */
export const StepAdd = styled(Step).attrs({ $state: 'idle' as const })`
  border-style: dashed;
  background: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }
`

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

export const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;
`

export const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`

export const Badge = styled.span`
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

// ─────────────────────────  Кнопки  ─────────────────────────

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

/** Кнопка удаления шага в шапке: компактный ghost-вариант с danger-откликом. */
export const DeleteStepButton = styled(GhostButton)`
  height: 30px;
  width: 30px;
  padding: 0;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSurface};
  }
`
