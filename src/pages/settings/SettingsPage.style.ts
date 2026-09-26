import { Link } from 'react-router-dom'
import styled from 'styled-components'

/** Корень страницы настроек: фон и вертикальная раскладка на всю высоту. */
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
`

export const CloseLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  text-decoration: none;
  transition:
    color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast},
    transform ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`
