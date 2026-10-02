import { Button } from '@mai/theme'
import styled from 'styled-components'

/** Контейнер canvas-холста с оверлеем управления. */
export const CanvasWrap = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};

  & > canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
    cursor: default;
  }
`

/**
 * Правая колонка оверлея: кнопки управления + раскрывающаяся панель.
 *
 * `align-items: flex-end`, а не `stretch`: рейл абсолютный, его ширина
 * задаётся самым широким ребёнком (панель настроек), и при `stretch` плитка
 * кнопок растягивалась под её ширину. `max-height` ограничивает колонку
 * вьюпортом — сама панель скроллится, плитка кнопок остаётся на месте.
 */
export const OverlayRail = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: calc(100% - 2 * ${({ theme }) => theme.spacing.md});
  overflow: hidden;
`

/** Колонка кнопок управления. */
export const ControlsBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex-shrink: 0;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

/** Квадратная кнопка-иконка оверлея на базе Button. */
export const ControlButton = styled(Button).attrs({ variant: 'ghost', size: 'sm' } as const)`
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
`
