import styled from 'styled-components'

export const ProgressTrack = styled.div`
  height: 8px;
  width: 100%;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  overflow: hidden;
`

export const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: inherit;
  transition: width 0.4s ease;
`
