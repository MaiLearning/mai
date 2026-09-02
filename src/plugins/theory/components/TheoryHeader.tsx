import { warn } from '@tauri-apps/plugin-log'
import { ChevronRight, Clock3, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { fetchCourseById } from '@/entities/course/services'
import type { Resource } from '@/entities/resource'
import type { StructureNode } from '@/entities/structure'
import { fetchStructure } from '@/entities/structure/services'
import {
  Breadcrumbs,
  Crumb,
  Header,
  HeaderColumn,
  HeaderTop,
  MetaDot,
  MetaItem,
  MetaRow,
  TitleTextarea,
} from './TheoryHeader.style'

export interface TheoryHeaderProps {
  courseId: string
  /** Ресурс (для имени и breadcrumbs). Может отсутствовать при прямом рендере. */
  resource?: Resource
  /** Текущее значение названия (управляется родителем). */
  title: string
  onTitleChange: (value: string) => void
  /** Коммит названия (blur / Enter) — сохранение на backend. */
  onTitleCommit: () => void
  /** Количество слов в документе — для оценки времени чтения. */
  words: number
  /** Время последнего изменения контента (unix ms). */
  updatedAt: number | null
}

interface CrumbEntry {
  label: string
  current?: boolean
}

const WORDS_PER_MINUTE = 200

/**
 * Шапка viewer-а: breadcrumbs (курс → папки → ресурс), редактируемое название
 * и мета-строка (чтение/черновик).
 */
export function TheoryHeader({
  courseId,
  resource,
  title,
  onTitleChange,
  onTitleCommit,
  words,
  updatedAt,
}: TheoryHeaderProps) {
  const { t, i18n } = useTranslation('theory')
  const [crumbs, setCrumbs] = useState<CrumbEntry[]>([])
  const titleRef = useRef<HTMLTextAreaElement>(null)

  // Высота поля названия подстраивается под содержимое (перенос длинных названий).
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title])

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
        <HeaderColumn>
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

          <TitleTextarea
            ref={titleRef}
            rows={1}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleCommit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
            aria-label={t('title_label')}
            placeholder={t('title_placeholder')}
          />

          <MetaRow>
            <MetaItem>
              <Clock3 size={13} /> {t('meta_reading', { minutes })}
            </MetaItem>
            <MetaDot />
            <MetaItem>
              <Users size={13} />
              {changedAt
                ? t('meta_draft_changed', { date: dateFormat.format(changedAt) })
                : t('meta_draft')}
            </MetaItem>
          </MetaRow>
        </HeaderColumn>
      </HeaderTop>
    </Header>
  )
}
