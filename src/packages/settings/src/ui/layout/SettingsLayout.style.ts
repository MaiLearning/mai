import styled from 'styled-components'

export const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

export const Sidebar = styled.aside`
  flex-shrink: 0;
  width: 240px;
  border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
`

export const Content = styled.main`
  flex: 1;
  min-width: 0;
`
