import type { CodeRunResult } from '@/entities/code-plugin'
import { Empty, Label, Root, Row, Stream, Value } from './RunOutput.style'

interface RunOutputProps {
  /** Результат последнего запуска текущего шага; null — запусков ещё не было. */
  output: CodeRunResult | null
  /** Ошибка запуска (не настроен рантайм, процесс не стартовал и т.п.). */
  error: string | null
}

/** Панель результата запуска: код выхода, длительность, stdout/stderr. */
export function RunOutput({ output, error }: RunOutputProps) {
  if (error) {
    return (
      <Root aria-label="Ошибка запуска">
        <Stream $tone="stderr">{error}</Stream>
      </Root>
    )
  }
  if (!output) return null

  return (
    <Root aria-label="Результат запуска">
      <Row>
        <Label>Код выхода:</Label>
        <Value>{output.exitCode ?? '—'}</Value>
        <Label>Время:</Label>
        <Value>{output.durationMs} мс</Value>
        {output.timedOut && <Value>Превышен таймаут (10 с)</Value>}
      </Row>
      {output.stdout.trim() !== '' && <Stream $tone="stdout">{output.stdout}</Stream>}
      {output.stderr.trim() !== '' && <Stream $tone="stderr">{output.stderr}</Stream>}
      {output.stdout.trim() === '' && output.stderr.trim() === '' && (
        <Empty>Программа ничего не вывела</Empty>
      )}
    </Root>
  )
}
