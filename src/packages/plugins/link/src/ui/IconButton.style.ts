import styled from 'styled-components'

export const Root = styled.button`
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: inherit;

  &:hover {
    background: ${({ theme }) => theme.background.accentSubtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
  }
`
