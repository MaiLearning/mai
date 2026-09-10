import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { SettingsSection } from '../core/types'
import { useSettingsSections } from '../registry'
import {
  Dropdown,
  Empty,
  FieldHit,
  Input,
  Root,
  SearchIcon,
  SectionHit,
  SectionIcon,
  SectionLabel,
} from './SettingsSearch.style'

interface SearchHit {
  section: SettingsSection
  /** Совпавшие поля; пусто, если совпала сама секция. */
  fieldHits: { id: string; label: string }[]
}

/** Топбар с поисковиком: матч по названиям разделов и полей настроек. */
export function SettingsSearch() {
  const { t } = useTranslation('settings')
  const sections = useSettingsSections()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    return sections
      .map((section) => {
        const sectionMatch = (section.label ?? '').toLowerCase().includes(q)
        const fieldHits = (section.fields ?? [])
          .filter((field) => {
            const label = (field.label ?? '').toLowerCase()

            return (
              label.includes(q) || (field.keywords ?? []).some((k) => k.toLowerCase().includes(q))
            )
          })
          .map((field) => ({ id: field.id, label: field.label ?? field.id }))

        return { section, sectionMatch, fieldHits: sectionMatch ? [] : fieldHits }
      })
      .filter((hit) => hit.sectionMatch || hit.fieldHits.length > 0)
      .map(({ section, fieldHits }) => ({ section, fieldHits }))
  }, [query, sections])

  const open = (section: SettingsSection) => {
    navigate(section.path ?? `/settings/${section.id}`)
    setQuery('')
  }

  const showDropdown = query.trim().length > 0

  return (
    <Root>
      <SearchIcon size={15} strokeWidth={1.5} />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setQuery('')
        }}
        placeholder={t('settings.search.placeholder')}
        aria-label={t('settings.search.placeholder')}
      />
      {showDropdown && (
        <Dropdown role="listbox">
          {hits.length === 0 && <Empty>{t('settings.search.empty')}</Empty>}
          {hits.map(({ section, fieldHits }) => (
            <SectionHit key={section.id}>
              <SectionLabel type="button" onClick={() => open(section)}>
                <SectionIcon as={section.icon} size={14} strokeWidth={1.5} />
                {section.label}
              </SectionLabel>
              {fieldHits.map((field) => (
                <FieldHit key={field.id} type="button" onClick={() => open(section)}>
                  {field.label}
                </FieldHit>
              ))}
            </SectionHit>
          ))}
        </Dropdown>
      )}
    </Root>
  )
}
