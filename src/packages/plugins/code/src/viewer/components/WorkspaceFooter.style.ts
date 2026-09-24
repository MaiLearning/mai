import styled from 'styled-components'

export const Footer = styled.footer`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 32px;
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
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
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  transition: all ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('accent', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
  color: ${({ theme }) => theme.contrastText.accent};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.durations.fast};

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
    $status === 'passed'
      ? theme.utils.getText('success', 'primary')
      : theme.utils.getText('danger', 'primary')};
`
