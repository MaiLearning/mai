import styled from 'styled-components'

/** Контейнер canvas-холста с оверлеем управления. */
export const CanvasWrap = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};

  & > canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
    cursor: default;
  }
`

/** Правая колонка оверлея: кнопки управления + раскрывающаяся панель. */
export const OverlayRail = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.sm};
`

/** Колонка кнопок управления. */
export const ControlsBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`
