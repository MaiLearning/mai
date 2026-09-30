import type { ReactNode } from 'react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider as StyledThemeProvider } from 'styled-components'
import { describe, expect, it } from 'vitest'
import { light } from '../../../base/themes/default/light'
import { Grid } from './grid'

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

describe('Grid', () => {
  it('lays out in columns and inherits the normalized box from Box', () => {
    const { html, css } = render(createElement(Grid, { columns: 2 }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain('display:grid')
    // Нормализация приходит из Box отдельным правилом, а не переписывается в
    // Grid: у корня два сгенерированных класса — блока и грида.
    const generated = (html.match(/class="([^"]+)"/)?.[1] ?? '').split(' ')
    expect(generated.filter((name) => !name.startsWith('sc-'))).toHaveLength(2)
    expect(css).toContain('box-sizing:border-box;margin:0;min-width:0')
  })

  it('turns a column count into equal tracks', () => {
    const { html, css } = render(createElement(Grid, { columns: 3 }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain('grid-template-columns:repeat(3, 1fr)')
  })

  it('passes a hand-written track template through verbatim', () => {
    const { html, css } = render(createElement(Grid, { columns: '1fr auto 1fr auto' }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain('grid-template-columns:1fr auto 1fr auto')
  })

  it('packs columns by the minimum track width', () => {
    const { html, css } = render(createElement(Grid, { min: '420px' }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain(
      'grid-template-columns:repeat(auto-fit, minmax(420px, 1fr))',
    )
  })

  it('packs instead of counting when both columns and min are given', () => {
    const { html, css } = render(createElement(Grid, { columns: 3, min: '420px' }, 'x'))
    const rules = rulesOf(css, rootClass(html))
    expect(rules).toContain('repeat(auto-fit, minmax(420px, 1fr))')
    expect(rules).not.toContain('repeat(3, 1fr)')
  })

  it('drops a track template that would be invalid CSS', () => {
    for (const columns of [0, 2.5, -1]) {
      const { html, css } = render(createElement(Grid, { columns }, 'x'))
      const rules = rulesOf(css, rootClass(html))
      // Объявление уходит целиком, но сетка остаётся: repeat(0, 1fr) иначе
      // молча уронил бы правило, и компонент отдал бы пустую раскладку.
      expect(rules).not.toContain('grid-template-columns')
      expect(rules).toContain('display:grid')
    }
  })

  it('emits no track template when neither columns nor min is given', () => {
    const { html, css } = render(createElement(Grid, null, 'x'))
    expect(rulesOf(css, rootClass(html))).not.toContain('grid-template-columns')
  })

  it('takes the gap from the spacing catalog', () => {
    const { html, css } = render(createElement(Grid, { columns: 2, gap: 'md' }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain(`gap:${light.spacing.md}`)
  })

  it('takes the gap from base steps of the theme', () => {
    const { html, css } = render(createElement(Grid, { columns: 2, gap: 24 }, 'x'))
    expect(rulesOf(css, rootClass(html))).toContain(`gap:${light.utils.space(24)}`)
  })

  it('stretches items in their tracks by default, on both axes', () => {
    const { html, css } = render(createElement(Grid, { columns: 2 }, 'x'))
    const rules = rulesOf(css, rootClass(html))
    // Начальное значение justify-items — legacy, для грида это stretch.
    expect(rules).toContain('align-items:stretch')
    expect(rules).toContain('justify-items:stretch')
  })

  it('aligns items inside their tracks on request', () => {
    const { html, css } = render(
      createElement(Grid, { columns: 2, align: 'center', justify: 'end' }, 'x'),
    )
    const rules = rulesOf(css, rootClass(html))
    expect(rules).toContain('align-items:center')
    expect(rules).toContain('justify-items:end')
  })

  it('renders the requested semantic tag', () => {
    const { html } = render(createElement(Grid, { columns: 2, as: 'section' }, 'x'))
    expect(html).toContain('<section')
  })
})
