import styled from 'styled-components'
import { Link } from '../../primitive/link/link'

/** Корень крошек: навигационная цепочка с общим приглушённым цветом. */
export const BreadcrumbsRoot = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

/** Текстовая крошка без ссылки (нераскрываемый предок или текущий элемент). */
export const CrumbText = styled.span<{ $current?: boolean }>`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme, $current }) =>
    $current ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  font-weight: ${({ theme, $current }) =>
    $current ? theme.typography.weights.semibold : theme.typography.weights.regular};
`

/** Крошка-ссылка: акцентный цвет и подчёркивание при наведении. */
export const CrumbLink = styled(Link)`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

/** Крошка-действие (без href): кнопка выглядит как ссылка. */
export const CrumbButton = styled.button`
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font: inherit;
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`

/** Разделитель между крошками (шеврон или произвольный узел). */
export const Separator = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

/** Многоточие свёрнутой середины цепочки. */
export const Ellipsis = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
`
