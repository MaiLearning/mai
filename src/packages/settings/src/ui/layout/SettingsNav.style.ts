import styled, { css } from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const NavItem = styled.button<{ $active: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $disabled }) =>
    $disabled
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'disabledAlpha')
      : 'transparent'};
  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.utils.withState(theme.utils.getText('neutral', 'primary'), 'disabledAlpha')
      : theme.utils.getText('neutral', 'primary')};
  font: inherit;
  text-align: left;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.utils.getBackground('accent', 'surface')};
      color: ${theme.utils.getText('accent', 'primary')};

      &:hover:not(:disabled) {
        background: ${theme.utils.getBackground('accent', 'surface')};
      }
    `}
`

export const Children = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.xl};
`

export const Icon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`
