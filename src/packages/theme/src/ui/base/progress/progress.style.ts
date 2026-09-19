import styled from 'styled-components'

export const ProgressTrack = styled.div`
  position: relative;
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.background.disabled};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`

export interface ProgressFillStyledProps {
  $percent: number
}

export const ProgressFill = styled.div<ProgressFillStyledProps>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.background.accent};
  border-radius: inherit;
  transition: width ${({ theme }) => theme.durations.normal} ease;
`
