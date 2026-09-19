import styled from 'styled-components'

/** Высота SV-квадрата в px. */
export const SQUARE_HEIGHT = 148

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

/** Строка с текущим цветом: образец + hex. */
export const CurrentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const CurrentBubble = styled.span<{ $color: string }>`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 7px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.14);
`

export const CurrentHex = styled.code`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11.5px;
  color: ${({ theme }) => theme.text.muted};
  text-transform: uppercase;
`

/**
 * Saturation-Value квадрат: базовый цвет по hue, поверх — осветление по X
 * и затемнение по Y.
 */
export const Square = styled.div<{ $hue: number }>`
  position: relative;
  height: ${SQUARE_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: crosshair;
  touch-action: none;
  background:
    linear-gradient(to top, #000, rgba(0, 0, 0, 0)),
    linear-gradient(to right, #fff, rgba(255, 255, 255, 0)), hsl(${({ $hue }) => $hue}, 100%, 50%);
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.18);
`

/** Маркер выбранной точки (круглый, поверх квадрата/слайдера). */
export const Marker = styled.span<{ $x: number; $y?: number; $color: string }>`
  position: absolute;
  left: ${({ $x }) => `${$x * 100}%`};
  top: ${({ $y }) => ($y === undefined ? '50%' : `${$y * 100}%`)};
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  border: 2px solid #fff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`

/** Горизонтальный hue-слайдер с радужным градиентом. */
export const HueSlider = styled.div`
  position: relative;
  height: 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;
  touch-action: none;
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.18);
`
