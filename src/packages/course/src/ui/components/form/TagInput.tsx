import { useTranslation } from '@mai/i18n'
import { Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { MAX_TAG_LENGTH } from '../../../core'
import { BareInput, Shell, Suggestion, Suggestions, Tag, TagRemove } from './TagInput.style'

export interface TagInputProps {
  id?: string
  value: string[]
  /** Подсказки для быстрого добавления (уже отфильтрованные от добавленных). */
  suggestions?: string[]
  onChange: (next: string[]) => void
}

/** Ввод тегов: чипы с удалением + поле ввода (Enter или запятая — добавить). */
export function TagInput({ id, value, suggestions = [], onChange }: TagInputProps) {
  const { t } = useTranslation('course')
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/^#/, '')
    if (!tag) return
    if ([...tag].length > MAX_TAG_LENGTH) {
      setDraft('')

      return
    }
    const exists = value.some((item) => item.toLowerCase() === tag.toLowerCase())
    if (!exists) onChange([...value, tag])
    setDraft('')
  }
  const removeTag = (tag: string) => onChange(value.filter((item) => item !== tag))
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(draft)

      return
    }
    if (event.key === 'Backspace' && draft.length === 0 && value.length > 0) {
      event.preventDefault()
      removeTag(value[value.length - 1])
    }
  }
  const available = suggestions.filter(
    (tag) => !value.some((item) => item.toLowerCase() === tag.toLowerCase()),
  )

  return (
    <>
      <Shell $focused={focused} onMouseDown={() => inputRef.current?.focus()}>
        {value.map((tag) => (
          <Tag key={tag}>
            {tag}
            <TagRemove
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={t('fields.removeTag', { tag })}
            >
              <X size={13} aria-hidden="true" />
            </TagRemove>
          </Tag>
        ))}
        <BareInput
          id={id}
          ref={inputRef}
          value={draft}
          maxLength={MAX_TAG_LENGTH}
          placeholder={
            value.length ? t('fields.tagsPlaceholderExisting') : t('fields.tagsPlaceholderEmpty')
          }
          spellCheck={false}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setFocused(false)
            addTag(draft)
          }}
          onFocus={() => setFocused(true)}
        />
      </Shell>

      {available.length > 0 ? (
        <Suggestions>
          {available.map((tag) => (
            <Suggestion key={tag} type="button" onClick={() => addTag(tag)}>
              <Plus size={12} aria-hidden="true" />
              {tag}
            </Suggestion>
          ))}
        </Suggestions>
      ) : null}
    </>
  )
}
