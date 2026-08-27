import { ArrowLeftRight, Check, Pipette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { ColorPicker } from './ColorPicker'
import { GRADIENT_PRESETS, SWATCHES } from './constants'
import { isValidHex, normalizeHex, readableOn } from './utils/color'

export interface CourseGradient {
  /** Первый цвет карточки курса (hex). */
  from: string
  /** Второй цвет карточки курса (hex). */
  to: string
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.body};
`
const SubLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 8px;
`
const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`
const Preset = styled.button<{ $from: string; $to: string; $active: boolean }>`
  width: 46px;
  height: 26px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(120deg, ${({ $from }) => $from}, ${({ $to }) => $to});
  border: 2px solid transparent;
  cursor: pointer;
  outline-offset: 2px;
  transition:
    transform ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      box-shadow: 0 0 0 2px ${theme.colors.surface}, 0 0 0 4px ${theme.colors.primary};
    `}
`
const SlotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const Slot = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  ${({ $active, theme }) =>
    $active &&
    css`
      box-shadow: 0 0 0 3px ${theme.colors.primarySurface};
    `}
`
const Bubble = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 9px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.12);
`
const SlotText = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  code {
    font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
  }
`
const Swap = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 6px;
`
const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border: none;
  padding: 0;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.14);
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.08);
  }

  svg {
    position: absolute;
    inset: 0;
    margin: auto;
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
  }
`
const HexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const HexInput = styled.input`
  flex: 1;
  height: 38px;
  min-width: 0;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 13px;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySurface};
  }
`
const PickerAnchor = styled.div`
  position: relative;
  display: inline-flex;
`
const CustomButton = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px dashed
    ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.borderStrong)};
  /* Без явного фона рисуется дефолтный светлый buttonface браузера */
  background: transparent;
  color: ${({ theme, $open }) => ($open ? theme.colors.primary : theme.colors.textMuted)};
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/** Попап с пикером: раскрывается вверх от кнопки «Свой цвет». */
const Popup = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  z-index: 20;
  width: 248px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export interface ColorPairPickerProps {
  value: CourseGradient
  onChange: (next: CourseGradient) => void
}

/** Выбор пары цветов: пресеты, два слота с переключением, палитра и HEX-ввод. */
export function ColorPairPicker({ value, onChange }: ColorPairPickerProps) {
  const { t } = useTranslation('courseModal')
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
