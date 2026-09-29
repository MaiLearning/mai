import { definePluginSettings } from '@mai/settings'
import { z } from 'zod'

/**
 * Настройки плагина code: пути до рантаймов на машине пользователя
 * (интерпретаторы Python/JavaScript, компилятор Rust). Ключи полей —
 * зеркало бэкенда (`plugins/code/service/service.rs`),
 * пустая строка = рантайм не настроен.
 */
export const codeSettingsDefinition = definePluginSettings({
  nameKey: 'settings.name',
  descriptionKey: 'settings.description',
  i18nNamespace: 'code',
  schema: z.object({
    pythonPath: z.string().max(1000).default('').meta({
      title: 'settings.pythonPath.label',
      description: 'settings.pythonPath.hint',
    }),
    javascriptPath: z.string().max(1000).default('').meta({
      title: 'settings.javascriptPath.label',
      description: 'settings.javascriptPath.hint',
    }),
    rustcPath: z.string().max(1000).default('').meta({
      title: 'settings.rustcPath.label',
      description: 'settings.rustcPath.hint',
    }),
  }),
})
