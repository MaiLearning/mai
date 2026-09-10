import styled from 'styled-components'

export const Select = styled.select`
  width: 220px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.focus};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.focus};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
