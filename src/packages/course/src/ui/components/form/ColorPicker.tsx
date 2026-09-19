import { useTranslation } from '@mai/i18n'
import { useEffect, useRef, useState } from 'react'
import { type Hsv, hexToHsv, hsvToHex, normalizeHex } from '../../utils/color'
import {
  CurrentBubble,
  CurrentHex,
  CurrentRow,
  HueSlider,
  Marker,
  Root,
  Square,
} from './ColorPicker.style'

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
  const { t } = useTranslation('course')
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
