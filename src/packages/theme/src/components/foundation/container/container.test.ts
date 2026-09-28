import type { ReactNode } from 'react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider as StyledThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'
import { light } from '../../../base/themes/default/light'
import { Container } from './container'

/** Рендерит компонент под темой и отдаёт разметку вместе с собранным CSS. */
function render(node: ReactNode) {
  const sheet = new ServerStyleSheet()
  const html = renderToStaticMarkup(
    sheet.collectStyles(createElement(StyledThemeProvider, { theme: light }, node)),
  )
  return { html, css: sheet.getStyleTags() }
}

/** Правила одного сгенерированного класса, без идентификаторов. */
function rulesOf(css: string, className: string) {
  return css
    .split('}')
    .filter((rule) => rule.includes(`.${className}`))
    .join('}')
}

/** Имя класса корневого элемента разметки. */
function rootClass(html: string) {
  return /class="[^"]*?\s(\S+)"/.exec(html)?.[1] ?? ''
}

describe('Container', () => {
  it('takes the width ceiling from the theme scale by default', () => {
    const { html, css } = render(createElement(Container, null, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain(
      `max-width:${light.layout.containerWidths.wide}`,
    )
  })

  it('takes the width ceiling from the requested scale step', () => {
    const { html, css } = render(createElement(Container, { size: 'narrow' }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain(
      `max-width:${light.layout.containerWidths.narrow}`,
    )
  })

  it('drops the ceiling when fluid', () => {
    const { html, css } = render(createElement(Container, { size: 'narrow', fluid: true }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain('max-width:none')
  })

  it('centers horizontally and declares itself a query container', () => {
    const { html, css } = render(createElement(Container, null, 'x'))
    const rules = rulesOf(css, rootClass(html))
    expect(rules).toContain('margin-inline:auto')
    expect(rules).toContain('container-type:inline-size')
    expect(rules).toContain('container-name:container')
  })

  it('keeps the two layers apart: only the inner one carries gutters', () => {
    const { html, css } = render(createElement(Container, null, 'x'))
    const layers = html.match(/class="[^"]+"/g) ?? []
    expect(layers).toHaveLength(2)
    // Потолок и центрирование — внешний слой, отступы — внутренний.
    expect(rulesOf(css, rootClass(html))).not.toContain('padding-inline')
    expect(css).toContain('padding-inline')
  })

  it('grows gutters with the container width, in base steps', () => {
    const { css } = render(createElement(Container, null, 'x'))
    // Поля заданы шагами (8/12/24), а не именами каталога: 24 шага — это
    // 3rem, и в каталоге имён такого значения нет.
    expect(css).toContain(`padding-inline:${light.utils.space(8)}`)
    expect(css).toContain('@container (min-width: 35rem)')
    expect(css).toContain(`padding-inline:${light.utils.space(12)}`)
    expect(css).toContain('@container (min-width: 64rem)')
    expect(css).toContain(`padding-inline:${light.utils.space(24)}`)
  })

  it('keeps the top gutter out of the named catalog, which ends at 2rem', () => {
    const { css } = render(createElement(Container, null, 'x'))
    expect(light.utils.space(24)).toBe('3rem')
    expect(css).toContain('padding-inline:3rem')
    expect(css).not.toContain(`padding-inline:${light.spacing.xl}`)
  })
})
