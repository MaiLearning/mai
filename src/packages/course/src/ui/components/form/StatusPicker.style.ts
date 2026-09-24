import styled, { css } from 'styled-components'

export const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;

  @media (min-width: 560px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const Option = styled.button<{ $active: boolean; $tone: string; $surface: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 11px 14px;
  text-align: left;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }

  ${({ $active, $tone, $surface }) =>
    $active &&
    css`
      background: ${$surface};
      border-color: ${$tone};
      box-shadow: inset 0 0 0 1px ${$tone};

      &:hover {
        border-color: ${$tone};
      }
    `}
`

export const Head = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ $color }) => $color};

  svg {
    color: currentColor;
  }
`

export const Hint = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`
