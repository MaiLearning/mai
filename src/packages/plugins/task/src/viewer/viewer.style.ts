import { readableOn } from '@mai/course'
import { themedScrollbar } from '@mai/theme'
import styled, { css } from 'styled-components'

// ─────────────────────────  Корневая зона  ─────────────────────────

/** Корень вьюера задач — занимает всё доступное пространство; источник container query для футера. */
export const Viewer = styled.section`
  container: task-viewer / inline-size;
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

/** Скролл-зона задач. */
export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 40px 32px;

  ${themedScrollbar}
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
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
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
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: transparent;
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
    $state === 'correct' &&
    css`
      border-color: ${theme.utils.getBorder('success', 'default')};
      background: ${theme.utils.getBackground('success', 'surface')};
      color: ${theme.utils.getText('success', 'primary')};
    `}

  ${({ $state, theme }) =>
    $state === 'incorrect' &&
    css`
      border-color: ${theme.utils.getBorder('danger', 'default')};
      background: ${theme.utils.getBackground('danger', 'surface')};
      color: ${theme.utils.getText('danger', 'primary')};
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
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  }
`

export const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const TaskNo = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
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
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};

  ${({ $tone, theme }) =>
    $tone === 'easy' &&
    css`
      color: ${theme.utils.getText('success', 'primary')};
      background: ${theme.utils.getBackground('success', 'surface')};
      border-color: transparent;
    `}
  ${({ $tone, theme }) =>
    $tone === 'medium' &&
    css`
      color: ${theme.utils.getText('accent', 'primary')};
      background: ${theme.utils.getBackground('accent', 'surface')};
      border-color: transparent;
    `}
  ${({ $tone, theme }) =>
    $tone === 'hard' &&
    css`
      color: ${theme.utils.getText('danger', 'primary')};
      background: ${theme.utils.getBackground('danger', 'surface')};
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
// Стили футера — в components/WorkspaceFooter.style.ts.

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

/** Кнопка удаления задачи в шапке: компактный ghost-вариант с danger-откликом. */
export const DeleteTaskButton = styled(GhostButton)`
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
