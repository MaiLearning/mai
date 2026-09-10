import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import type { CodeLanguage } from '@/entities/code-plugin'
import { EditorWrap } from './CodeEditor.style'

interface CodeEditorProps {
  language: CodeLanguage
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  ariaLabel: string
}

/** Поле кода на CodeMirror: подсветка по языку урока, тема приложения. */
export function CodeEditor({
  language,
  value,
  onChange,
  readOnly = false,
  ariaLabel,
}: CodeEditorProps) {
  const extensions = [language === 'python' ? python() : javascript()]

  return (
    <EditorWrap aria-label={ariaLabel}>
      <CodeMirror
        value={value}
        onChange={onChange}
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
