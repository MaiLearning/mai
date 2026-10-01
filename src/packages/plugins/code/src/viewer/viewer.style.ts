import { themedScrollbar } from '@mai/theme'
import styled, { css } from 'styled-components'

// ─────────────────────────  Корневая зона  ─────────────────────────

/** Корень вьюера урока кода — занимает всё доступное пространство. */
export const Viewer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

/** Скролл-зона основного содержимого. */
export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 28px 32px;

  ${themedScrollbar}
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
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  ${({ $state, theme }) =>
    $state === 'current' &&
    css`
      border-color: ${theme.utils.getBorder('accent', 'default')};
      background: ${theme.utils.getBackground('accent', 'surface')};
      color: ${theme.utils.getText('accent', 'primary')};
      box-shadow: 0 0 0 3px ${theme.utils.getBackground('accent', 'surface')};
    `}

  ${({ $state, theme }) =>
    $state === 'passed' &&
    css`
      border-color: ${theme.utils.getBorder('success', 'default')};
      background: ${theme.utils.getBackground('success', 'surface')};
      color: ${theme.utils.getText('success', 'primary')};
    `}

  ${({ $state, theme }) =>
    $state === 'failed' &&
    css`
      border-color: ${theme.utils.getBorder('danger', 'default')};
      background: ${theme.utils.getBackground('danger', 'surface')};
      color: ${theme.utils.getText('danger', 'primary')};
    `}
`

/** Спец-квадратик в конце степ-полосы: создание нового шага (edit-режим). */
export const StepAdd = styled(Step).attrs({ $state: 'idle' as const })`
  border-style: dashed;
  background: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
`

export const KindBadge = styled(Badge)`
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  border-color: transparent;
`

export const ModeToggle = styled.div`
  display: inline-flex;
  padding: 4px;
  gap: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
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
  background: ${({ theme, $active }) => ($active ? theme.utils.getSolid('accent', 'base') : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.contrastText.accent : theme.utils.getText('neutral', 'muted'))};

  &:hover {
    color: ${({ theme, $active }) => ($active ? theme.contrastText.accent : theme.utils.getText('neutral', 'primary'))};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.utils.getText('danger', 'primary')};
    border-color: ${({ theme }) => theme.utils.getBorder('danger', 'default')};
    background: ${({ theme }) => theme.utils.getBackground('danger', 'surface')};
  }
`
