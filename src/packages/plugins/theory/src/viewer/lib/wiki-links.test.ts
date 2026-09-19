import type { JSONContent } from '@tiptap/react'
import { describe, expect, it } from 'vitest'
import { extractWikiMentions, planEdgeSync } from './wiki-links'

function wikiLink(resourceId: string, label = ''): JSONContent {
  return { type: 'wikiLink', attrs: { resourceId, label } }
}

function paragraph(...content: JSONContent[]): JSONContent {
  return { type: 'paragraph', content }
}

function doc(...nodes: JSONContent[]): JSONContent {
  return { type: 'doc', content: nodes }
}

describe('extractWikiMentions', () => {
  it('собирает упоминания из вложенных узлов', () => {
    const document = doc(paragraph({ type: 'text', text: 'см. ' }, wikiLink('r1', 'Материал')), {
      type: 'callout',
      content: [paragraph(wikiLink('r2')), paragraph(wikiLink('r3', 'Третий'))],
    })

    expect(extractWikiMentions(document)).toEqual([
      { resourceId: 'r1', label: 'Материал' },
      { resourceId: 'r2', label: '' },
      { resourceId: 'r3', label: 'Третий' },
    ])
  })

  it('дедуплицирует по цели, сохраняя первую подпись', () => {
    const document = doc(paragraph(wikiLink('r1', 'Первая')), paragraph(wikiLink('r1', 'Вторая')))

    expect(extractWikiMentions(document)).toEqual([{ resourceId: 'r1', label: 'Первая' }])
  })

  it('игнорирует узлы без resourceId', () => {
    const document = doc(paragraph(wikiLink(''), { type: 'text', text: 'текст' }))

    expect(extractWikiMentions(document)).toEqual([])
  })

  it('возвращает пустой список для документа без wiki-ссылок', () => {
    expect(extractWikiMentions(doc(paragraph({ type: 'text', text: 'просто текст' })))).toEqual([])
  })
})

describe('planEdgeSync', () => {
  it('находит новые упоминания и осиротевшие рёбра', () => {
    const plan = planEdgeSync(['r1', 'r2'], ['r2', 'r3'])

    expect(plan).toEqual({ toCreate: ['r3'], toDelete: ['r1'] })
  })

  it('ничего не планирует при совпадении', () => {
    expect(planEdgeSync(['r1'], ['r1'])).toEqual({ toCreate: [], toDelete: [] })
  })

  it('дедуплицирует дубликаты упоминаний', () => {
    const plan = planEdgeSync([], ['r1', 'r1', 'r2'])

    expect(plan).toEqual({ toCreate: ['r1', 'r2'], toDelete: [] })
  })
})
