import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import type { Extension } from '@uiw/react-codemirror'
import CodeMirror from '@uiw/react-codemirror'
import type { CodeLanguage } from '../../entity'
import { padToLines, stripTrailingEmpty } from '../lib/padLines'
import { EditorWrap } from './CodeEditor.style'

interface CodeEditorProps {
  language: CodeLanguage
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  ariaLabel: string
}

/** Расширение подсветки CodeMirror по языку урока (исчерпывающая карта — новый язык требует записи здесь). */
const LANGUAGE_EXTENSIONS: Record<CodeLanguage, Extension> = {
  python: python(),
  javascript: javascript(),
  rust: rust(),
}

/**
 * Поле кода на CodeMirror: подсветка по языку урока, тема приложения.
 * Пустое поле показывает минимум строк (MIN_EDITOR_LINES) с честной нумерацией:
 * паддинг — только на отображение, наружу уходит код без концевых пустых строк.
 */
export function CodeEditor({
  language,
  value,
  onChange,
  readOnly = false,
  ariaLabel,
}: CodeEditorProps) {
  const extensions = [LANGUAGE_EXTENSIONS[language]]

  return (
    <EditorWrap aria-label={ariaLabel}>
      <CodeMirror
        value={padToLines(value)}
        onChange={(next) => onChange(stripTrailingEmpty(next))}
        extensions={extensions}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          autocompletion: false,
          highlightActiveLine: !readOnly,
          bracketMatching: true,
          closeBrackets: !readOnly,
        }}
      />
    </EditorWrap>
  )
}
