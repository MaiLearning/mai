import { error as logError } from '@tauri-apps/plugin-log'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import type { CodeLanguage } from '@/entities/code-plugin'
import { runCodeAtom } from '@/entities/code-plugin'
import { getKvValue, setKvValue } from '@/entities/kv'
import type { RuntimesConfig } from '@/plugins/code'
import { EMPTY_RUNTIMES, parseRuntimesConfig, RUNTIMES_KEY } from '@/plugins/code'
import { notifyError, notifySuccess } from '@/utils/notifications'
import {
  Field,
  FieldHead,
  FieldLabel,
  Hint,
  PathInput,
  PathRow,
  ProbeButton,
  Root,
} from './CodeRuntimesForm.style'

/** Пробный сниппет для проверки настроенного рантайма. */
const PROBE: Record<CodeLanguage, string> = {
  python: 'print("ok")',
  javascript: 'console.log("ok")',
}

const LANGUAGES: { id: CodeLanguage; label: string }[] = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
]

/**
 * Пути до интерпретаторов Code-плагина: хранятся в app_kv под ключом
 * `code-plugin/runtimes`; проверка запускает пробный сниппет на бэкенде.
 */
export function CodeRuntimesForm() {
  const [config, setConfig] = useState<RuntimesConfig>(EMPTY_RUNTIMES)
  const [probing, setProbing] = useState<CodeLanguage | null>(null)
  const runCode = useSetAtom(runCodeAtom)

  useEffect(() => {
    let cancelled = false
    getKvValue(RUNTIMES_KEY)
      .then((raw) => {
        if (!cancelled) setConfig(parseRuntimesConfig(raw))
      })
      .catch((e) => {
        logError(
          `Не удалось загрузить рантаймы Code-плагина: ${e instanceof Error ? e.message : String(e)}`,
        )
      })

    return () => {
      cancelled = true
    }
  }, [])

  /** Коммит пути (blur / Enter): пустая строка = рантайм не настроен. */
  const setPath = (language: CodeLanguage, raw: string) => {
    const path = raw.trim() === '' ? null : raw.trim()
    const next = { ...config, [language]: path }
    setConfig(next)
    setKvValue(RUNTIMES_KEY, next).catch((e) => {
      logError(
        `Не удалось сохранить рантайм ${language}: ${e instanceof Error ? e.message : String(e)}`,
      )
      notifyError('Не удалось сохранить путь')
    })
  }

  /** Пробный запуск: убеждается, что путь рабочий, а не просто существует. */
  const probe = async (language: CodeLanguage) => {
    setProbing(language)
    try {
      const result = await runCode({ language, code: PROBE[language] })
      notifySuccess(
        `${language === 'python' ? 'Python' : 'JavaScript'} работает`,
        `Пробный запуск выполнен за ${result.durationMs} мс`,
      )
    } catch (e) {
      notifyError('Пробный запуск не удался', e instanceof Error ? e.message : String(e))
    } finally {
      setProbing(null)
    }
  }

  return (
    <Root>
      {LANGUAGES.map(({ id, label }) => (
        <Field key={id}>
          <FieldHead>
            <FieldLabel>{label}</FieldLabel>
            <ProbeButton type="button" disabled={probing !== null} onClick={() => void probe(id)}>
              {probing === id ? 'Запуск…' : 'Проверить'}
            </ProbeButton>
          </FieldHead>
          <PathRow>
            <PathInput
              key={`${id}-${config[id] ?? 'unset'}`}
              defaultValue={config[id] ?? ''}
              placeholder={`/путь/к/${id === 'python' ? 'python3' : 'node'}`}
              aria-label={`Путь до ${label}`}
              onBlur={(e) => setPath(id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
              }}
            />
          </PathRow>
        </Field>
      ))}
      <Hint>
        Путь до исполняемого файла интерпретатора на этой машине. Без настроенного пути уроки на
        соответствующем языке запустить нельзя.
      </Hint>
    </Root>
  )
}
