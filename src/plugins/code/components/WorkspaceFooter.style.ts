import styled from 'styled-components'

export const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.body};
`

export const FooterStart = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`

export const FooterEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    animation: spin 0.7s linear infinite;
  }
`

export const ActionLabel = styled.span`
  white-space: nowrap;
`

export const Result = styled.span<{ $status: 'passed' | 'failed' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme, $status }) =>
    $status === 'passed' ? theme.colors.success : theme.colors.danger};
`
