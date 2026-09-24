import styled from 'styled-components'

/** Футер hero: строка статуса + заголовок урока + CTA. */
export const HeroFoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  @container course-card (min-width: 480px) {
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const HeroLastOpened = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const HeroCta = styled.div`
  flex-shrink: 0;
  width: 100%;
  & > button {
    width: 100%;
  }
  @container course-card (min-width: 480px) {
    width: auto;
    & > button {
      width: auto;
    }
  }
`
