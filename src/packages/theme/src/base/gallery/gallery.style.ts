import styled from 'styled-components'

/** Карточка одного варианта шрифта (рамка, фон, отступы). */
export const GalleryCard = styled.div`
  min-width: 0;
  padding: ${(p) => p.theme.spacing.lg};
  background: ${(p) => p.theme.background.surface};
  border: 1px solid ${(p) => p.theme.border.default};
  border-radius: ${(p) => p.theme.radius.lg};
`

/** Шапка карточки: заголовок варианта + разделитель. */
export const GalleryHeader = styled.div`
  padding-bottom: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.lg};
  border-bottom: 1px solid ${(p) => p.theme.border.default};
`

/** Содержимое карточки: вертикальный набор секций. */
export const GalleryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.lg};
`

/** Секция образцов: метка + образцы. */
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`

/**
 * Метка секции. Намеренно без токена font-family: метки рендерятся
 * системным шрифтом и не меняются вместе с просматриваемым вариантом —
 * так образцы проще сравнивать.
 */
export const SectionLabel = styled.span`
  font-size: ${(p) => p.theme.typography.sizes.xs};
  font-weight: ${(p) => p.theme.typography.weights.semibold};
  color: ${(p) => p.theme.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

/** Строка с кнопками. */
export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`

/** Инлайн-код внутри строки текста. */
export const CodeInline = styled.code`
  font-family: ${(p) => p.theme.typography.fontFamilyMonospace};
  font-size: ${(p) => p.theme.typography.sizes.sm};
  padding: 0.1em 0.4em;
  background: ${(p) => p.theme.background.body};
  border: 1px solid ${(p) => p.theme.border.default};
  border-radius: ${(p) => p.theme.radius.sm};
`

/** Блок кода. */
export const CodeBlock = styled.pre`
  margin: 0;
  padding: ${(p) => p.theme.spacing.md};
  font-family: ${(p) => p.theme.typography.fontFamilyMonospace};
  font-size: ${(p) => p.theme.typography.sizes.sm};
  line-height: ${(p) => p.theme.typography.lineHeights.normal};
  background: ${(p) => p.theme.background.body};
  border: 1px solid ${(p) => p.theme.border.default};
  border-radius: ${(p) => p.theme.radius.md};
  overflow: auto;
`

/** Сетка сравнения: все варианты рядом, карточки не растягиваются по высоте. */
export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  align-items: start;
  gap: ${(p) => p.theme.spacing.lg};
`
