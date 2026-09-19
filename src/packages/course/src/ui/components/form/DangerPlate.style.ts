import styled from 'styled-components'

export const Plate = styled.section<{ $armed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $armed }) => ($armed ? theme.status.danger.foreground : theme.border.default)};
  background: ${({ theme, $armed }) => ($armed ? theme.status.danger.background : theme.background.body)};
  transition:
    background ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  @media (min-width: 560px) {
    flex-direction: ${({ $armed }) => ($armed ? 'column' : 'row')};
    align-items: ${({ $armed }) => ($armed ? 'stretch' : 'center')};
  }
`

export const PlateText = styled.div`
  flex: 1;

  strong {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
  }

  p {
    margin-top: 3px;
    font-size: 12.5px;
    line-height: 1.5;
    color: ${({ theme }) => theme.text.muted};
  }
`

export const PlateActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  > * {
    flex: 1;
  }

  @media (min-width: 560px) {
    > * {
      flex: initial;
    }
  }
`
