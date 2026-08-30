import { Check, Pipette } from 'lucide-react'
import { useState } from 'react'
import { ColorPicker, readableOn, SWATCHES } from '@/features/course-modal'
import type { CustomDifficulty } from '../core/types'
import {
  Actions,
  CancelButton,
  CustomButton,
  FormFooter,
  FormInput,
  FormRoot,
  PickerAnchor,
  Popup,
  SaveButton,
  Swatch,
  SwatchGrid,
} from './DifficultyForm.style'

interface DifficultyFormProps {
  /** Своя сложность для редактирования; без initial — создание. */
  initial?: CustomDifficulty
  onSubmit: (label: string, color: string) => void
  onCancel: () => void
}

/** Форма своей сложности: название + цвет (палитра или ColorPicker). */
export function DifficultyForm({ initial, onSubmit, onCancel }: DifficultyFormProps) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [color, setColor] = useState(initial?.color ?? SWATCHES[0])
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <FormRoot>
      <FormInput
        value={label}
        placeholder="Название сложности"
        autoFocus
        spellCheck={false}
        onChange={(e) => setLabel(e.target.value)}
      />
      <SwatchGrid>
        {SWATCHES.map((swatch) => (
          <Swatch
            key={swatch}
            type="button"
            $color={swatch}
            $selected={color === swatch}
            aria-label={`Цвет ${swatch}`}
            onClick={() => setColor(swatch)}
          >
            {color === swatch && (
              <Check size={11} color={readableOn(swatch)} strokeWidth={3} aria-hidden="true" />
            )}
          </Swatch>
        ))}
      </SwatchGrid>
      <FormFooter>
        <PickerAnchor>
          <CustomButton
            type="button"
            $open={pickerOpen}
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((open) => !open)}
          >
            <Pipette size={13} aria-hidden="true" />
            Свой цвет
          </CustomButton>
          {pickerOpen && (
            <Popup role="dialog" aria-label="Выбор цвета">
              <ColorPicker color={color} onChange={setColor} />
            </Popup>
          )}
        </PickerAnchor>
        <Actions>
          <CancelButton type="button" onClick={onCancel}>
            Отмена
          </CancelButton>
          <SaveButton
            type="button"
            disabled={label.trim().length === 0}
            onClick={() => onSubmit(label.trim(), color)}
          >
            <Check size={13} aria-hidden="true" />
            {initial ? 'Сохранить' : 'Создать'}
          </SaveButton>
        </Actions>
      </FormFooter>
    </FormRoot>
  )
}
