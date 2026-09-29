import { describe, expect, it } from 'vitest'
import {
  CodeContentDataSchema,
  CodeLanguageSchema,
  CodeLessonContentSchema,
  CodeRunResultSchema,
  CodeStepSchema,
  MAX_CODE_LENGTH,
  MAX_INSTRUCTIONS_LENGTH,
  MAX_TITLE_LENGTH,
  RunCodeInputSchema,
  UpdateCodeContentInputSchema,
} from './schema'

const step = {
  id: 's1',
  title: 'Первый шаг',
  instructions: 'Напечатай hello',
  starterCode: 'print()',
  expectedOutput: 'hello',
}

describe('code content schema', () => {
  it('парсит пустой контент backend-дефолта {} в python и пустые коллекции', () => {
    const parsed = CodeLessonContentSchema.parse({})

    expect(parsed).toEqual({ language: 'python', steps: [], code: {}, results: {} })
  })

  it('валидирует полный контент урока', () => {
    const content = {
      language: 'javascript',
      steps: [step],
      code: { s1: 'console.log("hello")' },
      results: { s1: 'passed' },
    }

    expect(CodeLessonContentSchema.parse(content)).toEqual(content)
  })

  it('валидирует шаг урока со всеми полями', () => {
    expect(CodeStepSchema.parse(step)).toEqual(step)
  })

  it('требует обязательные поля шага (instructions и код не имеют дефолтов)', () => {
    expect(() => CodeStepSchema.parse({ ...step, instructions: undefined })).toThrow()
    expect(() => CodeStepSchema.parse({ ...step, starterCode: undefined })).toThrow()
    expect(() => CodeStepSchema.parse({ ...step, expectedOutput: undefined })).toThrow()
  })

  it('допускает пустой заголовок шага (отображается с фолбэком «Шаг N»)', () => {
    expect(CodeStepSchema.parse({ ...step, title: '' })).toEqual({ ...step, title: '' })
  })

  it('отвергает шаг с заголовком длиннее границы', () => {
    expect(() =>
      CodeStepSchema.parse({ ...step, title: 'x'.repeat(MAX_TITLE_LENGTH + 1) }),
    ).toThrow()
  })

  it('допускает пустую инструкцию и отвергает превышение границы', () => {
    expect(() => CodeStepSchema.parse({ ...step, instructions: '' })).not.toThrow()
    expect(() =>
      CodeStepSchema.parse({ ...step, instructions: 'x'.repeat(MAX_INSTRUCTIONS_LENGTH + 1) }),
    ).toThrow()
  })

  it('отвергает превышение границы кода', () => {
    expect(() =>
      CodeStepSchema.parse({ ...step, starterCode: 'x'.repeat(MAX_CODE_LENGTH + 1) }),
    ).toThrow()
  })

  it('валидирует снапшот ресурса', () => {
    const data = {
      resourceId: 'r1',
      content: { language: 'python', steps: [step], code: {}, results: {} },
      createdAt: 1,
      updatedAt: 2,
    }

    expect(CodeContentDataSchema.parse(data)).toEqual(data)
  })

  it.each([['python'], ['javascript'], ['rust']] as const)('валидирует язык %s', (language) => {
    expect(CodeLanguageSchema.parse(language)).toBe(language)
  })

  it('отвергает неизвестный язык', () => {
    expect(() => CodeLessonContentSchema.parse({ language: 'ruby' })).toThrow()
  })

  it('отвергает чужой результат шага', () => {
    expect(() => CodeLessonContentSchema.parse({ results: { s1: 'skipped' } })).toThrow()
  })
})

describe('code run result schema', () => {
  it('валидирует успешный запуск', () => {
    const result = { stdout: 'hello\n', stderr: '', exitCode: 0, timedOut: false, durationMs: 12 }

    expect(CodeRunResultSchema.parse(result)).toEqual(result)
  })

  it('валидирует запуск с null-кодом завершения', () => {
    const result = { stdout: '', stderr: 'boom', exitCode: null, timedOut: true, durationMs: 5000 }

    expect(CodeRunResultSchema.parse(result)).toEqual(result)
  })

  it('отвергает boolean-код завершения', () => {
    expect(() =>
      CodeRunResultSchema.parse({
        stdout: '',
        stderr: '',
        exitCode: false,
        timedOut: false,
        durationMs: 1,
      }),
    ).toThrow()
  })
})

describe('командные входные схемы', () => {
  it('UpdateCodeContentInputSchema требует ресурс и валидный контент', () => {
    const input = { resourceId: 'r1', content: { language: 'python', steps: [step] } }

    // неполный контент разворачивается дефолтами (code/results — пустые словари)
    expect(UpdateCodeContentInputSchema.parse(input)).toEqual({
      resourceId: 'r1',
      content: { language: 'python', steps: [step], code: {}, results: {} },
    })
    expect(() =>
      UpdateCodeContentInputSchema.parse({ resourceId: 'r1', content: { language: 'ruby' } }),
    ).toThrow()
  })

  it('RunCodeInputSchema валидирует язык и код', () => {
    expect(RunCodeInputSchema.parse({ language: 'python', code: 'print(1)' })).toEqual({
      language: 'python',
      code: 'print(1)',
    })
    expect(RunCodeInputSchema.parse({ language: 'rust', code: 'fn main() {}' })).toEqual({
      language: 'rust',
      code: 'fn main() {}',
    })
    expect(() =>
      RunCodeInputSchema.parse({ language: 'python', code: 'x'.repeat(MAX_CODE_LENGTH + 1) }),
    ).toThrow()
    expect(() => RunCodeInputSchema.parse({ language: 'ruby', code: 'puts 1' })).toThrow()
  })
})
