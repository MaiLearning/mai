import { useMemo } from 'react'
import { ThemeProvider, useTheme } from 'styled-components'
import { Text } from '../../components/foundation/text/text'
import { Alert } from '../../components/primitive/alert/alert'
import { Button } from '../../components/primitive/button/button'
import { monoFonts, resolveFontFamily, sansFonts } from '../fonts/fontVariants'
import type { AppTheme } from '../theme'
import {
  ButtonRow,
  CodeBlock,
  CodeInline,
  GalleryBody,
  GalleryCard,
  GalleryHeader,
  Section,
  SectionLabel,
} from './gallery.style'

const BODY_TEXT =
  'Съешь же ещё этих мягких французских булок, да выпей чаю. The quick brown fox jumps over the lazy dog. 0123456789 — счёт: 1 234,56 руб.'

const CODE_SAMPLE = `const course = await createCourse({
  title: 'Мой курс',
  tags: ['ui', 'fonts'],
})`

const HEADINGS = [
  { as: 'h1', size: 'xl', weight: 'bold' },
  { as: 'h2', size: 'lg', weight: 'semibold' },
  { as: 'h3', size: 'lg', weight: 'medium' },
  { as: 'h4', size: 'md', weight: 'semibold' },
  { as: 'h5', size: 'md', weight: 'medium' },
  { as: 'h6', size: 'md', weight: 'regular' },
] as const

/** Образцы, зависящие от просматриваемого шрифта: типографика, код, компоненты. */
function Samples() {
  return (
    <GalleryBody>
      <Section>
        <SectionLabel>Заголовки</SectionLabel>
        {HEADINGS.map((h) => (
          <Text key={h.as} as={h.as} size={h.size} weight={h.weight}>
            Заголовок {h.as.toUpperCase()}
          </Text>
        ))}
      </Section>
      <Section>
        <SectionLabel>Абзац и подпись</SectionLabel>
        <Text as="p">{BODY_TEXT}</Text>
        <Text size="sm" color="muted">
          Подпись / caption — второстепенный текст
        </Text>
      </Section>
      <Section>
        <SectionLabel>Размеры</SectionLabel>
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Text key={size} size={size}>
            {size} — размер шрифта
          </Text>
        ))}
      </Section>
      <Section>
        <SectionLabel>Насыщенность</SectionLabel>
        {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
          <Text key={weight} weight={weight}>
            {weight} — насыщенность
          </Text>
        ))}
      </Section>
      <Section>
        <SectionLabel>Код</SectionLabel>
        <Text as="p">
          Инлайн-код: <CodeInline>const x = theme.typography.fontFamilyMonospace</CodeInline> внутри
          строки.
        </Text>
        <CodeBlock>{CODE_SAMPLE}</CodeBlock>
      </Section>
      <Section>
        <SectionLabel>Компоненты</SectionLabel>
        <ButtonRow>
          <Button>Сохранить</Button>
          <Button variant="secondary">Вторичная</Button>
          <Button variant="danger">Удалить</Button>
        </ButtonRow>
        <Alert variant="info">Информационное сообщение дизайн-системы</Alert>
      </Section>
    </GalleryBody>
  )
}

export interface FontGalleryProps {
  /** Id sans-варианта из реестра fontVariants ('inter', 'manrope', ...). */
  sansId: string
  /** Id mono-варианта из реестра fontVariants ('jetbrains-mono', ...). */
  monoId: string
  /** Заголовок карточки (в сетке сравнения — имя варианта). */
  title?: string
}

/**
 * Витрина шрифта: перекрывает токены typography.fontFamily /
 * fontFamilyMonospace вложенным провайдером, поэтому показывает ровно тот
 * вид, который получит приложение (все компоненты стилизуются токенами).
 */
export function FontGallery({ sansId, monoId, title }: FontGalleryProps) {
  const base = useTheme() as AppTheme
  const theme = useMemo<AppTheme>(
    () => ({
      ...base,
      typography: {
        ...base.typography,
        fontFamily: resolveFontFamily(sansId, sansFonts),
        fontFamilyMonospace: resolveFontFamily(monoId, monoFonts),
      },
    }),
    [base, sansId, monoId],
  )

  return (
    <ThemeProvider theme={theme}>
      <GalleryCard>
        {title && (
          <GalleryHeader>
            <Text as="h2" size="lg" weight="semibold">
              {title}
            </Text>
          </GalleryHeader>
        )}
        <Samples />
      </GalleryCard>
    </ThemeProvider>
  )
}
