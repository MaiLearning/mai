import { ChevronRight, Clock3, Eye, FileText, Save, Sparkles, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Badge } from '@/app/theme/components/Badge'
import { Button } from '@/app/theme/components/Button'
import { fetchCourseById } from '@/entities/course/services'
import type { Resource } from '@/entities/resource'
import type { StructureNode } from '@/entities/structure'
import { fetchStructure } from '@/entities/structure/services'
import { warn } from '@/utils/logger'
import {
  Breadcrumbs,
  Crumb,
  Dot,
  Header,
  HeaderActions,
  HeaderTop,
  MetaDot,
  MetaItem,
  MetaRow,
  TitleInput,
  TitleRow,
} from '../styles/layout.style'

export interface TheoryHeaderProps {
  courseId: string
  /** Ресурс (для имени и типа). Может отсутствовать при прямом рендере. */
  resource?: Resource
  /** Текущее значение названия (управляется родителем). */
  title: string
  onTitleChange: (value: string) => void
  /** Коммит названия (blur / Enter) — сохранение на backend. */
  onTitleCommit: () => void
  preview: boolean
  onTogglePreview: () => void
  onSave: () => void
  dirty: boolean
  saving: boolean
  words: number
  chars: number
  /** Время последнего изменения контента (unix ms). */
  updatedAt: number | null
}

interface CrumbEntry {
  label: string
  current?: boolean
}

const WORDS_PER_MINUTE = 200

/**
 * Шапка viewer-а: breadcrumbs (курс → папки → ресурс), редактируемое название,
 * бейдж типа, мета-строка (чтение/слова/черновик) и действия.
 */
export function TheoryHeader({
  courseId,
  resource,
  title,
  onTitleChange,
  onTitleCommit,
  preview,
  onTogglePreview,
  onSave,
  dirty,
  saving,
  words,
  chars,
  updatedAt,
}: TheoryHeaderProps) {
  const { t, i18n } = useTranslation('theory')
  const [crumbs, setCrumbs] = useState<CrumbEntry[]>([])

  // Breadcrumbs строим из курса и цепочки папок структуры; ошибка не критична.
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [course, nodes] = await Promise.all([
          fetchCourseById(courseId),
          fetchStructure(courseId),
        ])
        if (cancelled) return

        const chain: CrumbEntry[] = [{ label: course.name }]
        const node = resource ? nodes.find((n) => n.resource?.id === resource.id) : null
        if (node) {
          const byId = new Map<string, StructureNode>(
            nodes.map((n) => [n.id, n] as [string, StructureNode]),
          )
          const dirs: string[] = []
          let cursor = node.parentId ? byId.get(node.parentId) : undefined
          while (cursor) {
            dirs.unshift(cursor.name)
            cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined
          }
          for (const dir of dirs) chain.push({ label: dir })
          chain.push({ label: node.resource?.name ?? node.name, current: true })
        } else {
          chain.push({ label: resource?.name ?? title, current: true })
        }

        setCrumbs(chain)
      } catch (e) {
        warn(
          `plugins/theory: load breadcrumbs failed: ${e instanceof Error ? e.message : String(e)}`,
        )
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [courseId, resource, title])

  const numberFormat = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n])
  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [i18n],
  )

  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
  const changedAt = updatedAt ?? resource?.updatedAt ?? null

  return (
    <Header>
      <HeaderTop>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {crumbs.length > 0 && (
            <Breadcrumbs aria-label={t('breadcrumbs_label')}>
              {crumbs.map((crumb, index) => (
                <Crumb key={`${crumb.label}-${index}`} $current={crumb.current}>
                  {crumb.label}
                  {!crumb.current && <ChevronRight size={12} />}
                </Crumb>
              ))}
            </Breadcrumbs>
          )}

          <TitleRow>
            <TitleInput
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={onTitleCommit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
              aria-label={t('title_label')}
              placeholder={t('title_placeholder')}
            />
            {resource?.typeKey && (
              <Badge variant="primary">
                <Dot /> {t('badge_theory')}
              </Badge>
            )}
          </TitleRow>

          <MetaRow>
            <MetaItem>
              <Clock3 size={13} /> {t('meta_reading', { minutes })}
            </MetaItem>
            <MetaDot />
            <MetaItem>
              <FileText size={13} />{' '}
              {t('meta_words', {
                words: numberFormat.format(words),
                chars: numberFormat.format(chars),
              })}
            </MetaItem>
            <MetaDot />
            <MetaItem>
              <Users size={13} />
              {changedAt
                ? t('meta_draft_changed', { date: dateFormat.format(changedAt) })
                : t('meta_draft')}
            </MetaItem>
          </MetaRow>
        </div>

        <HeaderActions>
          <Button type="button" variant="ghost" onClick={onTogglePreview}>
            <Eye size={15} /> {preview ? t('action_edit') : t('action_preview')}
          </Button>
          <Button type="button" variant="ghost" disabled title={t('assistant_soon')}>
            <Sparkles size={15} /> {t('action_assistant')}
          </Button>
          <Button type="button" variant="primary" disabled={!dirty || saving} onClick={onSave}>
            <Save size={15} /> {t('action_save')}
          </Button>
        </HeaderActions>
      </HeaderTop>
    </Header>
  )
}
