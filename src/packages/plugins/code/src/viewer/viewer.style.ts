import styled, { css } from 'styled-components'

// ─────────────────────────  Корневая зона  ─────────────────────────

/** Корень вьюера урока кода — занимает всё доступное пространство. */
export const Viewer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  background: ${({ theme }) => theme.background.body};
  color: ${({ theme }) => theme.text.primary};
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
  color: ${({ theme }) => theme.text.muted};
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
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
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
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  color: ${({ theme }) => theme.text.muted};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.border.strong};
    color: ${({ theme }) => theme.text.primary};
  }

  ${({ $state, theme }) =>
    $state === 'current' &&
    css`
      border-color: ${theme.border.accent};
      background: ${theme.background.accentSubtle};
      color: ${theme.text.accent};
      box-shadow: 0 0 0 3px ${theme.background.accentSubtle};
    `}

  ${({ $state, theme }) =>
    $state === 'passed' &&
    css`
      border-color: ${theme.status.success.foreground};
      background: ${theme.status.success.background};
      color: ${theme.status.success.foreground};
    `}

  ${({ $state, theme }) =>
    $state === 'failed' &&
    css`
      border-color: ${theme.status.danger.foreground};
      background: ${theme.status.danger.background};
      color: ${theme.status.danger.foreground};
    `}
`

/** Спец-квадратик в конце степ-полосы: создание нового шага (edit-режим). */
export const StepAdd = styled(Step).attrs({ $state: 'idle' as const })`
  border-style: dashed;
  background: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.border.accent};
    color: ${({ theme }) => theme.text.accent};
    background: ${({ theme }) => theme.background.accentSubtle};
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
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.3;
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.border.default};
  color: ${({ theme }) => theme.text.muted};
  background: ${({ theme }) => theme.background.surface};
`

export const KindBadge = styled(Badge)`
  color: ${({ theme }) => theme.text.accent};
  background: ${({ theme }) => theme.background.accentSubtle};
  border-color: transparent;
`

export const ModeToggle = styled.div`
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
`

export const ModeButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};
  background: ${({ theme, $active }) => ($active ? theme.background.accent : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.text.onPrimary : theme.text.muted)};

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.text.onPrimary : theme.text.primary)};
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
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.border.strong};
    background: ${({ theme }) => theme.background.elevated};
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
  color: ${({ theme }) => theme.text.muted};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.status.danger.foreground};
    border-color: ${({ theme }) => theme.status.danger.foreground};
    background: ${({ theme }) => theme.status.danger.background};
  }
`
