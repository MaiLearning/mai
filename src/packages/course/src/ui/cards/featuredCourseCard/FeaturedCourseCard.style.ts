import styled from 'styled-components'

/** Футер hero: строка статуса + заголовок урока + CTA. */
export const HeroFoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

export const HeroInfo = styled.div`
  min-width: 0;
  display: grid;
  gap: 8px;
`

/** Строка продолжения: «В процессе • Урок n из n» accent-цветом. */
export const HeroStatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text.muted};
`

export const HeroInProgress = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.accent};
`

export const HeroTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text.primary};
`

export const HeroLastOpened = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.muted};
`

export const HeroCta = styled.div`
  flex-shrink: 0;
  width: 100%;
  & > button {
    width: 100%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: auto;
    & > button {
      width: auto;
    }
  }
`
