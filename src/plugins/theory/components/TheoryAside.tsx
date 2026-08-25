import { Paperclip } from 'lucide-react'
import { useTranslation } from '@/app/i18n'
import { ProgressFill, ProgressTrack } from '@/app/theme/components/Progress'
import type { OutlineEntry } from '../lib/outline'
import {
  Aside,
  AsideBlock,
  AsideTitle,
  Attachment,
  AttachmentList,
  AttachmentMeta,
  OutlineItem,
  OutlineList,
  ProgressCard,
  ProgressLabel,
  Tag,
  TagRow,
} from '../styles/aside.style'

export interface TheoryAsideProps {
  entries: OutlineEntry[]
  activeIndex: number
  onSelect: (index: number) => void
}

/** Статичные данные-заглушки (бэкенда для материалов/тегов пока нет). */
const ATTACHMENTS = [
  { name: 'cheatsheet.pdf', meta: 'PDF · 240 КБ' },
  { name: 'scheme.svg', meta: 'SVG · 18 КБ' },
  { name: 'examples.xlsx', meta: 'XLSX · 96 КБ' },
]

const TAGS = ['теория', 'конспект', 'базовый']

/**
 * Боковая панель: интерактивная структура документа (outline из заголовков),
 * декоративные блоки «Готовность», «Материалы» и «Теги» — заглушки макета.
 */
export function TheoryAside({ entries, activeIndex, onSelect }: TheoryAsideProps) {
  const { t } = useTranslation('theory')

  return (
    <Aside aria-label={t('aside_label')}>
      <AsideBlock>
        <AsideTitle>{t('aside_outline')}</AsideTitle>
        <OutlineList>
          {entries.length === 0 && (
            <OutlineItem $level={2}>
              <button type="button" disabled>
                <span>{t('aside_outline_empty')}</span>
              </button>
            </OutlineItem>
          )}
          {entries.map((entry, index) => (
            <OutlineItem
              key={`${entry.pos}-${index}`}
              $level={entry.level}
              $active={index === activeIndex}
            >
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <span>{entry.text || t('aside_outline_empty_item')}</span>
              </button>
            </OutlineItem>
          ))}
        </OutlineList>
      </AsideBlock>

      <AsideBlock>
        <AsideTitle>{t('aside_progress')}</AsideTitle>
        <ProgressCard>
          <ProgressLabel>
            <b>{t('progress_percent', { percent: 68 })}</b>
            <span>{t('progress_state')}</span>
          </ProgressLabel>
          {/* Заглушка прогресса из макета: реальной метрики готовности пока нет. */}
          <ProgressTrack>
            <ProgressFill $percent={68} />
          </ProgressTrack>
          <ProgressLabel>
            <span>{t('progress_hint')}</span>
          </ProgressLabel>
        </ProgressCard>
      </AsideBlock>

      <AsideBlock>
        <AsideTitle>{t('aside_attachments')}</AsideTitle>
        <AttachmentList>
          {ATTACHMENTS.map((file) => (
            <Attachment key={file.name} title={t('attachments_stub')}>
              <Paperclip size={14} />
              <AttachmentMeta>
                <b>{file.name}</b>
                <small>{file.meta}</small>
              </AttachmentMeta>
            </Attachment>
          ))}
        </AttachmentList>
      </AsideBlock>

      <AsideBlock>
        <AsideTitle>{t('aside_tags')}</AsideTitle>
        <TagRow>
          {TAGS.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagRow>
      </AsideBlock>
    </Aside>
  )
}
