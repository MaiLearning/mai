import styled from 'styled-components'

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

export const Sidebar = styled.aside`
  flex-shrink: 0;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};

  @media (min-width: 768px) {
    width: 240px;
    border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    border-bottom: 0;
  }
`

export const Content = styled.main`
  flex: 1;
  width: 100%;
  min-width: 0;
`
