import styled from 'styled-components'
import type { CourseCoverSize } from './CourseCover'

export interface CoverRootProps {
  $from: string
  $to: string
  $ink: string
  $size: CourseCoverSize
}

/** Обложка карточки: градиент из двух цветов курса. */
export const CoverRoot = styled.div<CoverRootProps>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: ${({ $size }) => ($size === 'lg' ? '220px' : '160px')};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ $ink }) => $ink};
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: ${({ $size }) => ($size === 'lg' ? '272px' : '160px')};
  }
`

/** Нижняя вуаль под оверлей hero — текст поверх градиента читается. */
export const CoverShade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(9, 11, 16, 0.85),
    rgba(9, 11, 16, 0.15) 55%,
    transparent
  );
`

export const CoverTags = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: calc(100% - 44px);
`

/** Чип тега поверх градиента: прямоугольник с бордером и блюром. */
export const CoverTag = styled.span<{ $ink: string }>`
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
  color: ${({ $ink }) => $ink};
  font-size: 11px;
  font-weight: 500;
`

/** Кнопка редактирования курса в углу обложки. */
export const CoverEditButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  backdrop-filter: blur(6px);
  transition:
    background 0.16s ease,
    transform 0.12s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.36);
  }
  &:active {
    transform: scale(0.94);
  }
  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`

/** Оверлей hero: подпись + название курса поверх обложки. */
export const CoverOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: ${({ theme }) => theme.spacing.md};
  color: #ffffff;
`

export const CoverEyebrow = styled.p`
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`

export const CoverTitle = styled.h2`
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 30px;
  }
`
