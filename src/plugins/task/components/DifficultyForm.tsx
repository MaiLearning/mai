import { Check, Pipette, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ColorPicker, readableOn, SWATCHES } from '@/features/course-modal'
import type { CustomDifficulty } from '../core/types'
import {
  CustomButton,
  FormFooter,
  FormIcon,
  FormInput,
  FormRoot,
  PickerAnchor,
  Popup,
  Swatch,
  SwatchGrid,
} from './DifficultyForm.style'

interface DifficultyFormProps {
  /** Своя сложность для редактирования; без initial — создание. */
  initial?: CustomDifficulty
  onSubmit: (label: string, color: string) => void
  onCancel: () => void
  /** Удаление редактируемой сложности; без него мусорка работает как отмена. */
  onDelete?: () => void
}

/** Форма своей сложности: название + цвет (палитра или ColorPicker). */
export function DifficultyForm({ initial, onSubmit, onCancel, onDelete }: DifficultyFormProps) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [color, setColor] = useState(initial?.color ?? SWATCHES[0])
  const [pickerOpen, setPickerOpen] = useState(false)

  const canSubmit = label.trim().length > 0

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
        <FormIcon
          type="button"
          $danger
          aria-label={initial ? 'Удалить сложность' : 'Отменить'}
          onClick={initial && onDelete ? onDelete : onCancel}
        >
          <Trash2 size={15} />
        </FormIcon>
        <FormIcon
          type="button"
          disabled={!canSubmit}
          aria-label={initial ? 'Сохранить' : 'Создать'}
          onClick={() => onSubmit(label.trim(), color)}
        >
          <Check size={15} />
        </FormIcon>
      </FormFooter>
    </FormRoot>
  )
}
