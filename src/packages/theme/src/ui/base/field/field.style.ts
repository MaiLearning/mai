import { styled } from 'styled-components'

export const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

export const LabelText = styled.label<{ $disabled?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

  color: ${({ theme, $disabled }) =>
    $disabled
      ? theme.utils.getText('neutral', 'muted')
      : theme.utils.getText('neutral', 'primary')};

  span {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    margin-left: 3px;
  }
`

export const Counter = styled.span<{ $over: boolean; $disabled?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $over }) =>
    $over ? theme.utils.getText('danger', 'primary') : theme.utils.getText('neutral', 'muted')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

export const Message = styled.p<{ $disabled?: boolean }>`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`

export const Hint = styled(Message)``

export const ErrorText = styled(Message)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.utils.getText('danger', 'primary')};
`
