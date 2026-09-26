import { ChevronRightIcon } from '@mai/icons'
import { Fragment, type ReactNode } from 'react'
import {
  BreadcrumbsRoot,
  CrumbButton,
  CrumbLink,
  CrumbText,
  Ellipsis,
  Separator,
} from './breadcrumbs.style'

export interface BreadcrumbItem {
  /** Подпись крошки. */
  label: string
  /** Адрес перехода. */
  href?: string
  /** Обработчик перехода (если адреса нет). */
  onClick?: () => void
  /** Текущий (последний) элемент: не ссылка, выделен и получает aria-current. */
  current?: boolean
}

export interface BreadcrumbsProps {
  /** Цепочка крошек от старшего предка к текущему элементу. */
  items: readonly BreadcrumbItem[]
  /** Разделитель между крошками. По умолчанию — шеврон. */
  separator?: ReactNode
  /**
   * Максимум видимых элементов. Если цепочка длиннее, середина сворачивается
   * в многоточие: первый элемент + последние `maxItems - 2`. Меньше 3 — без свёртки.
   */
  maxItems?: number
  /** Доступное имя навигации. */
  ariaLabel?: string
  className?: string
}

type Entry = BreadcrumbItem | { ellipsis: true }

const DEFAULT_SEPARATOR = <ChevronRightIcon size={12} strokeWidth={2} aria-hidden="true" />

/** Сворачивает середину длинной цепочки в многоточие. */
function collapse(items: readonly BreadcrumbItem[], maxItems?: number): Entry[] {
  if (maxItems === undefined || maxItems < 3 || items.length <= maxItems) {
    return [...items]
  }

  const tail = maxItems - 2

  return [items[0], { ellipsis: true }, ...items.slice(items.length - tail)]
}

/**
 * Breadcrumbs — навигационная цепочка пути. Композиция ссылок (`Link`),
 * текстовых крошек и разделителей: показывает, где пользователь находится
 * и как вернуться к предкам. Текущий элемент помечается `aria-current`.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Курс', href: '/course/1' }, { label: 'Общие', current: true }]} />
 */
export function Breadcrumbs({
  items,
  separator = DEFAULT_SEPARATOR,
  maxItems,
  ariaLabel,
  className,
}: BreadcrumbsProps) {
  const entries = collapse(items, maxItems)
  const lastIndex = entries.length - 1

  return (
    <BreadcrumbsRoot className={className} aria-label={ariaLabel}>
      {entries.map((entry, index) => {
        const key = 'ellipsis' in entry ? 'ellipsis' : `${entry.label}-${index}`
        const content =
          'ellipsis' in entry ? (
            <Ellipsis aria-hidden="true">…</Ellipsis>
          ) : (
            <Crumb item={entry} isLast={index === lastIndex} />
          )

        return (
          <Fragment key={key}>
            {index > 0 ? <Separator aria-hidden="true">{separator}</Separator> : null}
            {content}
          </Fragment>
        )
      })}
    </BreadcrumbsRoot>
  )
}

/** Отдельная крошка: ссылка, кнопка или текст. */
function Crumb({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) {
  const current = item.current ?? (isLast && !item.href && !item.onClick)

  if (item.href) {
    return (
      <CrumbLink href={item.href} aria-current={current ? 'page' : undefined}>
        {item.label}
      </CrumbLink>
    )
  }

  if (item.onClick) {
    return (
      <CrumbButton type="button" onClick={item.onClick} aria-current={current ? 'page' : undefined}>
        {item.label}
      </CrumbButton>
    )
  }

  return (
    <CrumbText $current={current} aria-current={current ? 'page' : undefined}>
      {item.label}
    </CrumbText>
  )
}
