import type { Editor } from '@tiptap/core'
import type { InsertDialogKind } from '../components/TheoryToolbar'

/** Применяет результат диалога вставки URL к редактору (link/image/video). */
export function applyInsertDialog(editor: Editor, kind: InsertDialogKind, url: string) {
  if (kind === 'link') {
    const chain = editor.chain().focus()
    if (!url) {
      chain.extendMarkRange('link').unsetLink().run()

      return
    }
    if (editor.state.selection.empty) {
      chain
        .insertContent([
          { type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url } }] },
        ])
        .run()
    } else {
      chain.extendMarkRange('link').setLink({ href: url }).run()
    }

    return
  }

  if (kind === 'image') {
    editor.chain().focus().setImage({ src: url }).run()

    return
  }

  editor.chain().focus().insertEmbed({ url }).run()
}
