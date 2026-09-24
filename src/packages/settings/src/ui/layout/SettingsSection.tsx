import { Heading, Text } from '@mai/theme'
import type { ReactNode } from 'react'
import { Head, Section } from './SettingsSection.style'

export interface SettingsSectionProps {
  /** Заголовок раздела. */
  title?: string
  /** Пояснение под заголовком. */
  description?: string
  /** Поля раздела. */
  children: ReactNode
}

/** Раздел настроек: заголовок, пояснение и поля. */
export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Section>
      {title ? (
        <Head>
          <Heading as="h3" size="lg">
            {title}
          </Heading>
          {description ? (
            <Text size="sm" color="gray">
              {description}
            </Text>
          ) : null}
        </Head>
      ) : null}
      {children}
    </Section>
  )
}
