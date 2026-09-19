import { Extension } from '@tiptap/core'
import Suggestion, { type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion'
import { getCourseResources, type WikiResourceItem } from './course-resources'
import { wikiPopup } from './wiki-popup'

/** Максимум пунктов в меню автокомплита. */
const SUGGEST_LIMIT = 8

async function suggestItems({ query }: { query: string }): Promise<WikiResourceItem[]> {
  const needle = query.trim().toLowerCase()
  const items = await getCourseResources()
  const filtered = needle ? items.filter((item) => item.name.toLowerCase().includes(needle)) : items

  return filtered.slice(0, SUGGEST_LIMIT)
}

function render(): {
  onStart: (props: SuggestionProps<WikiResourceItem>) => void
  onUpdate: (props: SuggestionProps<WikiResourceItem>) => void
  onExit: () => void
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
} {
  return {
    onStart: (props) => wikiPopup.start(props),
    onUpdate: (props) => wikiPopup.update(props),
    onExit: () => wikiPopup.exit(),
    onKeyDown: (props) => wikiPopup.handleKeyDown(props),
  }
}

/**
 * WikiSuggest — автокомплит wiki-ссылок: ввод `[[` открывает меню ресурсов
 * текущего курса (lib/wiki-popup рендерит, viewer рисует меню).
 */
export const WikiSuggest = Extension.create({
  name: 'wikiSuggest',

  addProseMirrorPlugins() {
    return [
      Suggestion<WikiResourceItem>({
        editor: this.editor,
        char: '[[',
        allowSpaces: true,
        items: suggestItems,
        command: ({ editor, range, props }) =>
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertWikiLink({ resourceId: props.resourceId, label: props.name })
            .insertContent(' ')
            .run(),
        render: () => render(),
      }),
    ]
  },
})
