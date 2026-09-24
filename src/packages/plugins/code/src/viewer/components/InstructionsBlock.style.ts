import styled from 'styled-components'

/** Блок инструкции текущего шага. */
export const Instructions = styled.section`
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  padding: 14px 16px;
`

export const InstructionsTitle = styled.h2`
  margin: 0 0 8px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

export const InstructionsText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

export const InstructionsEmpty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`
