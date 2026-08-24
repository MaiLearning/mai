import { Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@/app/i18n'
import { MAX_TAG_LENGTH } from '@/entities/course'

const Shell = styled.div<{ $focused: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 46px;
  padding: 6px 8px;
  background: ${({ theme }) => theme.colors.body};
  border: 1px solid
    ${({ theme, $focused }) => ($focused ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme, $focused }) =>
    $focused ? `0 0 0 3px ${theme.colors.primarySurface}` : 'none'};
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};
  cursor: text;
`
const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 6px 0 11px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`
const TagRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.65;
  transition:
    opacity ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.colors.surface};
  }
`
const BareInput = styled.input`
  flex: 1;
  min-width: 120px;
  height: 32px;
  padding: 0 4px;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14.5px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.75;
  }
`
const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`
const Suggestion = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px 0 8px;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    border-style: solid;
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`

export interface TagInputProps {
  id?: string
  value: string[]
  /** Подсказки для быстрого добавления (уже отфильтрованные от добавленных). */
  suggestions?: string[]
  onChange: (next: string[]) => void
}

/** Ввод тегов: чипы с удалением + поле ввода (Enter или запятая — добавить). */
export function TagInput({ id, value, suggestions = [], onChange }: TagInputProps) {
  const { t } = useTranslation('courseModal')
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
