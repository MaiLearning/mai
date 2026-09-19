import styled, { css } from 'styled-components'

export interface CardRootProps {
  $interactive: boolean
}

/**
 * Корневой контейнер карточки: поверхность, граница, скругление и тень.
 * Интерактивная карточка приподнимается при наведении.
 */
export const CardRoot = styled.div<CardRootProps>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease;

  ${({ $interactive, theme }) =>
    $interactive &&
    css`
      &:hover {
        transform: translateY(-2px);
        border-color: ${theme.border.strong};
        box-shadow: ${theme.shadows.md};
      }
    `}
`
