import type { ReactNode } from 'react'
import { Heading, type HeadingLevel } from '../../foundation/heading/heading'
import { Text } from '../../foundation/text/text'
import { Aside, Header, Main, Top } from './pageHeader.style'

export interface PageHeaderProps {
  /** Хлебные крошки над заголовком. */
  breadcrumbs?: ReactNode
  /** Заголовок раздела. */
  title: ReactNode
  /** Пояснение под заголовком. */
  description?: ReactNode
  /** Правый верхний слот: поиск, действия. */
  actions?: ReactNode
  /** Семантический уровень заголовка. */
  titleAs?: HeadingLevel
  className?: string
}

/**
 * PageHeader — шапка раздела страницы: хлебные крошки, заголовок, описание и
 * правый слот действий. Задаёт вертикальный ритм и разделитель до контента;
 * содержимое слотов собирает потребитель.
 *
 * @example
 * <PageHeader
 *   title="Общие"
 *   description="Внешний вид и язык интерфейса."
 *   breadcrumbs={<Breadcrumbs items={[...]} />}
 *   actions={<SearchInput />}
 * />
 */
export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  titleAs = 'h2',
  className,
}: PageHeaderProps) {
  return (
    <Header className={className}>
      <Top>
        <Main>
          {breadcrumbs}
          <Heading as={titleAs} size="xl">
            {title}
          </Heading>
          {description ? (
            <Text size="sm" color="muted">
              {description}
            </Text>
          ) : null}
        </Main>
        {actions ? <Aside>{actions}</Aside> : null}
      </Top>
    </Header>
  )
}
