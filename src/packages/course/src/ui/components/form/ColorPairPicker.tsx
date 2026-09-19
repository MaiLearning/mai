import { useTranslation } from '@mai/i18n'
import { ArrowLeftRight, Check, Pipette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { isValidHex, normalizeHex, readableOn } from '../../utils/color'
import {
  Bubble,
  CustomButton,
  HexInput,
  HexRow,
  PickerAnchor,
  Popup,
  Preset,
  PresetRow,
  Root,
  Slot,
  SlotRow,
  SlotText,
  SubLabel,
  Swap,
  Swatch,
  SwatchGrid,
} from './ColorPairPicker.style'
import { ColorPicker } from './ColorPicker'
import { GRADIENT_PRESETS, SWATCHES } from './constants'

export interface CourseGradient {
  /** Первый цвет карточки курса (hex). */
  from: string
  /** Второй цвет карточки курса (hex). */
  to: string
}

export interface ColorPairPickerProps {
  value: CourseGradient
  onChange: (next: CourseGradient) => void
}

/** Выбор пары цветов: пресеты, два слота с переключением, палитра и HEX-ввод. */
export function ColorPairPicker({ value, onChange }: ColorPairPickerProps) {
  const { t } = useTranslation('course')
  const slotLabel: Record<keyof CourseGradient, string> = {
    from: t('colorPicker.fromLabel'),
    to: t('colorPicker.toLabel'),
  }
  const [slot, setSlot] = useState<keyof CourseGradient>('from')
  const [hexDraft, setHexDraft] = useState(value[slot])
  const [pickerOpen, setPickerOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => setHexDraft(value[slot]), [slot, value])

  // Закрытие пикера: клик вне панели и Escape.
  // Escape ловим в capture-фазе: Modal перехватывает всплытие клавиши
  // (onKeyDown + stopPropagation на панели модалки), поэтому bubble-листенер
  // на document при реальном вводе не получает событие. Capture доходит всегда.
  useEffect(() => {
    if (!pickerOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        setPickerOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setPickerOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [pickerOpen])

  const setColor = (color: string) => onChange({ ...value, [slot]: normalizeHex(color) })
  const commitHex = (raw: string) => {
    if (isValidHex(raw)) setColor(raw)
    else setHexDraft(value[slot])
  }

  return (
    <Root>
      <div>
        <SubLabel>{t('colorPicker.presetsLabel')}</SubLabel>
        <PresetRow>
          {GRADIENT_PRESETS.map((preset) => (
            <Preset
              key={preset.name}
              type="button"
              $from={preset.from}
              $to={preset.to}
              $active={value.from === preset.from && value.to === preset.to}
              onClick={() => onChange({ from: preset.from, to: preset.to })}
              aria-label={t('colorPicker.presetsAria', { name: preset.name })}
            />
          ))}
        </PresetRow>
      </div>

      <div>
        <SubLabel>{t('colorPicker.slotsLabel')}</SubLabel>
        <SlotRow>
          {(['from', 'to'] as const).map((key) => (
            <Slot
              key={key}
              type="button"
              $active={slot === key}
              aria-pressed={slot === key}
              onClick={() => setSlot(key)}
            >
              <Bubble $color={value[key]} aria-hidden="true" />
              <SlotText>
                <strong>{slotLabel[key]}</strong>
                <code>{value[key]}</code>
              </SlotText>
            </Slot>
          ))}
          <Swap
            type="button"
            onClick={() => onChange({ from: value.to, to: value.from })}
            aria-label={t('colorPicker.swap')}
          >
            <ArrowLeftRight size={15} aria-hidden="true" />
          </Swap>
        </SlotRow>
      </div>

      <div>
        <SubLabel>
          {t('colorPicker.paletteLabel', { slot: slotLabel[slot].toLowerCase() })}
        </SubLabel>
        <SwatchGrid>
          {SWATCHES.map((color) => {
            const selected = value[slot] === color

            return (
              <Swatch
                key={color}
                type="button"
                $color={color}
                $selected={selected}
                onClick={() => setColor(color)}
                aria-label={`${slotLabel[slot]}: ${color}`}
                aria-pressed={selected}
              >
                <Check size={13} color={readableOn(color)} strokeWidth={3} aria-hidden="true" />
              </Swatch>
            )
          })}
        </SwatchGrid>
      </div>

      <HexRow>
        <HexInput
          value={hexDraft}
          spellCheck={false}
          aria-label={t('colorPicker.hexAria', { slot: slotLabel[slot] })}
          onChange={(event) => setHexDraft(event.target.value)}
          onBlur={(event) => commitHex(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitHex(hexDraft)
            }
          }}
        />
        <PickerAnchor ref={anchorRef}>
          <CustomButton
            type="button"
            $open={pickerOpen}
            aria-expanded={pickerOpen}
            aria-haspopup="dialog"
            onClick={() => setPickerOpen((open) => !open)}
          >
            <Pipette size={14} aria-hidden="true" />
            {t('colorPicker.custom')}
          </CustomButton>
          {pickerOpen && (
            <Popup role="dialog" aria-label={t('colorPicker.panelAria')}>
              <ColorPicker color={value[slot]} onChange={setColor} />
            </Popup>
          )}
        </PickerAnchor>
      </HexRow>
    </Root>
  )
}
