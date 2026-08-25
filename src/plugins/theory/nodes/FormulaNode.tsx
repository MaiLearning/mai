import { mergeAttributes, Node } from '@tiptap/core'

/**
 * FormulaNode — блочная формула.
 *
 * Хранит LaTeX-подобный текст как plain text внутри блока.
 * Визуал — пунктирная рамка с моноширинным шрифтом (см. content.style.ts,
 * селектор `[data-formula]`). Рендеринг математике не выполняется сознательно:
 * узел служит текстовым представлением формулы без внешних зависимостей.
 */
export const FormulaNode = Node.create({
  name: 'formula',
  group: 'block',
  content: 'text*',
  code: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-formula]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-formula': '', class: 'th-formula' }), 0]
  },

  addCommands() {
    return {
      insertFormula:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    }
  },
})
