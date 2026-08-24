import { Link } from 'react-router-dom'
import styled from 'styled-components'

/** Контейнер страницы: центрирование и боковые отступы. */
export const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 32px;
  }
`

/** Ссылка-кнопка в стиле actions главной страницы. */
export const ActionLink = styled(Link)<{
  $variant?: 'primary' | 'ghost' | 'soft'
  $size?: 'md' | 'lg'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 600;
  white-space: nowrap;
  font-size: ${({ $size }) => ($size === 'lg' ? '16px' : '14px')};
  padding: ${({ $size }) => ($size === 'lg' ? '14px 26px' : '10px 18px')};
  transition:
    transform 0.12s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;
  background: ${({ theme, $variant }) =>
    $variant === 'ghost'
      ? 'transparent'
      : $variant === 'soft'
        ? theme.colors.primarySurface
        : theme.colors.primary};
  color: ${({ theme, $variant }) =>
    $variant === 'ghost'
      ? theme.colors.text
      : $variant === 'soft'
        ? theme.colors.primary
        : theme.colors.textOnPrimary};
  border-color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.border : 'transparent')};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === 'ghost'
        ? theme.colors.surface
        : $variant === 'soft'
          ? theme.colors.primarySurface
          : theme.colors.primaryHover};
  }
  &:active {
    transform: translateY(1px);
  }
`
