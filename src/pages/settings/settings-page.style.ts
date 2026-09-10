import styled from 'styled-components'

/** Шелл страницы настроек: сайдбар слева, справа топбар + main. */
export const Shell = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.body};
`

export const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl}
    ${({ theme }) => theme.spacing.xl} calc(${({ theme }) => theme.spacing.xl} + 8px);
`
