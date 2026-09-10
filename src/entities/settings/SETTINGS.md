# Settings — руководство сущности

## Что делает

Глобальные настройки приложения: тема оформления (`theme`) и язык
интерфейса (`language`). Сущность — единый источник правды (SSOT):
хранит значения, валидирует их схемой и раздаёт через Jotai-атомы.
Слои приложения (тема, i18n) применяют значения к себе сами —
сущность ничего не знает о ThemeProvider и i18next.

## Контракт

```
AppSettings { theme: SettingsTheme, language: SettingsLanguage }
SettingsTheme    = 'system' | 'light' | 'dark'      // SETTINGS_THEME_OPTIONS — расширяемый
SettingsLanguage = 'ru' | 'en'                      // SETTINGS_LANGUAGE_OPTIONS
UpdateSettingsInput = { theme?, language? }         // частичный патч
DEFAULT_SETTINGS = { theme: 'system', language: 'ru' }
```

Zod-схемы (`core/schema.ts`) — источник истины; типы выведены через `z.infer`.

## Как пользоваться

```tsx
import { useAtomValue, useSetAtom } from 'jotai'
import { DEFAULT_SETTINGS, loadSettingsAtom, settingsAtom, updateSettingsAtom } from '@/entities/settings'

// чтение (fallback — пока настройки не загружены)
const saved = useAtomValue(settingsAtom)
const theme = saved?.theme ?? DEFAULT_SETTINGS.theme

// загрузка при старте приложения (см. app/runner/task/init_settings.ts)
const loadSettings = useSetAtom(loadSettingsAtom)
await loadSettings()

// частичное обновление: сервис сливает патч с текущим значением и валидирует
const updateSettings = useSetAtom(updateSettingsAtom)
const next = await updateSettings({ theme: 'dark' })
```

Вне React (runner-таски) — через `getDefaultStore()` из jotai:
`store.set(loadSettingsAtom)`, `store.get(settingsAtom)`.

## Хранение

Backend-команд настроек пока нет. Обе ветки `api/` обслуживаются общим
in-memory хранилищем (`api/memory.ts`): fake-ветка — по флагу
`isFakeDataEnabled`, «реальная» — invoke-заглушка (`settings_get` /
`settings_update`) с warn-логом. Следствие: настройки живут в рамках
сессии; язык дополнительно переживает перезапуск через boot-кэш
`localStorage['mai.lang']` (side `app/i18n`).

При появлении backend-команд меняется только тело invoke-заглушек —
контракт сущности не трогается.

## Настройки плагинов

Отдельная ветка сущности — значения настроек плагинов: карта
`pluginSettings: Record<pluginId, Record<ключ, unknown>>` в
fake-хранилище (`utils/fake-entities-storage/state.ts`). Типы значений
знает только сам плагин — хранилище агностично.

- `api/plugin.ts` — fake-ветка + invoke-заглушки
  (`plugin_settings_get`/`plugin_settings_update`, warn-лог); при
  появлении backend-команд меняется только тело заглушек.
- `services/plugin.ts` — `fetchPluginSettings` / `updatePluginSettings`
  (валидация pluginId и карты, полная замена).
- `store/plugin.ts` — кэш `pluginSettingsAtom` + `loadPluginSettingsAtom`
  + `updatePluginSettingAtom` (оптимистичная запись одного ключа,
  при ошибке — откат и проброс).
- Единый API для секций настроек — хук `usePluginSettings(pluginId)`
  (`features/settings/use-plugin-settings.ts`): `{ settings, ready,
  setSetting }`; ошибки сохранения ловит и уведомляет сам.

## Как расширять

- **Новое поле** — добавить в `SettingsSchema` (и `UpdateSettingsInputSchema`),
  указать значение в `DEFAULT_SETTINGS`, применить в соответствующем
  слое-потребителе (апплаере).
- **Новая тема** — добавить значение в `SETTINGS_THEME_OPTIONS` и
  реализацию в registry `app/theme` (`theme.ts`).
- **Новый язык** — добавить в `SETTINGS_LANGUAGE_OPTIONS` и в
  `SUPPORTED_LANGUAGES` (`app/i18n/config.ts`), плюс ресурсы локалей.

## Где применяется

| Поле | Апплаер |
|------|---------|
| `theme` | `app/theme/provider.tsx` (реактивно из `settingsAtom`), мутация — `updateSettingsAtom` |
| `language` | `app/i18n/hooks.ts` (`i18next.changeLanguage` + boot-кэш), стартовая синхронизация — таска `init-settings` |
