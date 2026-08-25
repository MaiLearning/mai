import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { type Hsv, hexToHsv, hsvToHex, normalizeHex } from './utils/color'

/** Высота SV-квадрата в px. */
const SQUARE_HEIGHT = 148

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

/** Строка с текущим цветом: образец + hex. */
const CurrentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const CurrentBubble = styled.span<{ $color: string }>`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 7px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.14);
`
const CurrentHex = styled.code`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`

/**
 * Saturation-Value квадрат: базовый цвет по hue, поверх — осветление по X
 * и затемнение по Y.
 */
const Square = styled.div<{ $hue: number }>`
  position: relative;
  height: ${SQUARE_HEIGHT}px;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: crosshair;
  touch-action: none;
  background:
    linear-gradient(to top, #000, rgba(0, 0, 0, 0)),
    linear-gradient(to right, #fff, rgba(255, 255, 255, 0)),
    hsl(${({ $hue }) => $hue}, 100%, 50%);
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.18);
`

/** Маркер выбранной точки (круглый, поверх квадрата/слайдера). */
const Marker = styled.span<{ $x: number; $y?: number; $color: string }>`
  position: absolute;
  left: ${({ $x }) => `${$x * 100}%`};
  top: ${({ $y }) => ($y === undefined ? '50%' : `${$y * 100}%`)};
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: ${({ $color }) => $color};
  border: 2px solid #fff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`

/** Горизонтальный hue-слайдер с радужным градиентом. */
const HueSlider = styled.div`
  position: relative;
  height: 14px;
  border-radius: ${({ theme }) => theme.radii.pill};
  cursor: pointer;
  touch-action: none;
  background: linear-gradient(
    to right,
    #f00,
    #ff0,
    #0f0,
    #0ff,
    #00f,
    #f0f,
    #f00
  );
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.18);
`

export interface ColorPickerProps {
  /** Текущий цвет слота (hex). */
  color: string
  /** Колбэк при изменении цвета (hex). */
  onChange: (hex: string) => void
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/** Доля указателя внутри элемента по X/Y (0–1, с clamp по границам). */
function pointerRatio(
  event: React.PointerEvent<HTMLDivElement>,
  element: HTMLElement | null,
): { x: number; y: number } | null {
  if (!element) return null

  const rect = element.getBoundingClientRect()

  return {
    x: clamp01((event.clientX - rect.left) / rect.width),
    y: clamp01((event.clientY - rect.top) / rect.height),
  }
}

/**
 * In-app пикер цвета: SV-квадрат + hue-слайдер вместо системного диалога.
 * Управление — pointer events с setPointerCapture, внешних зависимостей нет.
 */
export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const { t } = useTranslation('courseModal')
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(color))
  const squareRef = useRef<HTMLDivElement | null>(null)
  const hueRef = useRef<HTMLDivElement | null>(null)

  // Синхронизация при внешнем изменении цвета (пресет, палитра, HEX-ввод).
  // Если значение уже совпадает с текущим HSV (наш собственный emit) — не трогаем.
  useEffect(() => {
    setHsv((prev) => (hsvToHex(prev) === normalizeHex(color) ? prev : hexToHsv(color)))
  }, [color])

  /** Пересчёт saturation/value из позиции на SV-квадрате. */
  const applySquare = (event: React.PointerEvent<HTMLDivElement>) => {
    const ratio = pointerRatio(event, squareRef.current)
    if (!ratio) return

    const next: Hsv = { ...hsv, s: ratio.x, v: 1 - ratio.y }
    setHsv(next)
    onChange(hsvToHex(next))
  }

  /** Пересчёт hue из позиции на слайдере. */
  const applyHue = (event: React.PointerEvent<HTMLDivElement>) => {
    const ratio = pointerRatio(event, hueRef.current)
    if (!ratio) return

    const next: Hsv = { ...hsv, h: Math.round(ratio.x * 360) }
    setHsv(next)
    onChange(hsvToHex(next))
  }

  return (
    <Root>
      <CurrentRow>
        <CurrentBubble $color={hsvToHex(hsv)} aria-hidden="true" />
        <CurrentHex>{normalizeHex(color)}</CurrentHex>
      </CurrentRow>

      <Square
        ref={squareRef}
        $hue={hsv.h}
        role="slider"
        aria-label={t('colorPicker.saturation')}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(hsv.s * 100)}
        tabIndex={-1}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          applySquare(event)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            applySquare(event)
          }
        }}
      >
        <Marker $x={hsv.s} $y={1 - hsv.v} $color={hsvToHex(hsv)} />
      </Square>

      <HueSlider
        ref={hueRef}
        role="slider"
        aria-label={t('colorPicker.hue')}
        aria-valuemax={360}
        aria-valuemin={0}
        aria-valuenow={Math.round(hsv.h)}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          applyHue(event)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            applyHue(event)
          }
        }}
      >
        <Marker $x={hsv.h / 360} $color={`hsl(${hsv.h}, 100%, 50%)`} />
      </HueSlider>
    </Root>
  )
}
