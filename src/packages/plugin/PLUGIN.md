# PLUGIN — руководство пакета

> Руководство «для чайников»: что делает пакет, как им пользоваться
> (примеры кода), как расширять.

## Что делает

Пакет `@mai/plugin` — вся система плагинов на уровне приложения.
Внутри три связанные области:

- **entity «plugins»** (`core/`, `api/`, `services/`, `store/`) — записи
  плагинов из БД: wire-контракт, invoke-обёртки, use-cases и Jotai-состояние.
  `pluginsAtom` хранит список из backend; `applyPluginChangeAtom` принимает
  внешние изменения (`entity://changed`, origin `http`).
- **runtime** (`runtime/`) — плагины, зарегистрированные в рантайме:
  `RuntimePlugin` (id, name, `typeKeys`, `viewers`), реестр `PluginStore`
  (синглтон `pluginStore`), атом `runtimePluginsAtom` и `loadPlugins()`.
- **gateway** (`gateway/`) — вызов методов плагина (`callGateway`) и
  дискавери манифестов (`fetchGatewayManifests`).
- **viewer** (`viewer/`) — просмотр ресурса: `Viewer` грузит структуру
  курса и выбирает режим, `TypePicker` назначает тип, `PluginViewer`
  рендерит ресурс подходящим viewer-компонентом плагина.

Поток: backend → `loadPlugins()` → `pluginStore` (`runtimePluginsAtom`) →
`PluginViewer` ищет включённый плагин по `pluginId` или по `data.typeKey`
и рендерит `plugin.viewers[typeKey]`.

## Как пользоваться

Чтение состояния плагинов (реактивно):

```tsx
import { useAtomValue } from 'jotai'
import { pluginsAtom, runtimePluginsAtom } from '@mai/plugin'

const records = useAtomValue(pluginsAtom) // записи из БД
const runtime = useAtomValue(runtimePluginsAtom) // рантайм-реестр
```

Загрузка при старте приложения (композиционный слой):

```ts
import { loadPlugins } from '@mai/plugin'

await loadPlugins()
```

### Настройки плагина

`setInternalPluginSettings(map)` атомарно регистрирует definition'ы по
`pluginId`. Definition описывается Zod-схемой и не содержит React-компонентов
или собственного migration-механизма: UI настроек генерируется автоматически
(`settingsFieldSpecs` → `SettingsFieldRenderer` в `@mai/settings`).

```ts
import { definePluginSettings } from '@mai/settings'
import { setInternalPluginSettings } from '@mai/plugin'
import { z } from 'zod'

const theorySettingsDefinition = definePluginSettings({
  nameKey: 'settings.name', // заголовок пункта настроек
  i18nNamespace: 'theory', // namespace переводов плагина
  schema: z.object({
    autosaveDelay: z
      .enum(['500', '1000', '2000'])
      .default('500')
      .meta({
        title: 'settings.autosaveDelay.label',
        description: 'settings.autosaveDelay.hint',
      }),
  }),
})

setInternalPluginSettings({ 'internal-theory': theorySettingsDefinition })
```

Переводы полей ищутся в `i18nNamespace` по конвенции, `meta` не обязательна:

- подпись — `title` из JSON Schema, иначе `<поле>.label`;
- пояснение — `description`, иначе `<поле>.hint` (нет перевода — пояснения нет);
- варианты выбора (`z.enum` / массив enum) — `<поле>.options.<значение>`.

Ключи отсчитываются от `i18nNamespace` определения. В примере выше они заданы
явно через `meta`, потому что плагин группирует строки настроек в объекте
`settings` внутри своего namespace.

Типы полей ограничены реестром схем бэкенда (`services/settings/schemas`):
`toggle`, `single_selection`, `multi_selection`, `text_input`, `url_input`,
`date_input`. Неподдерживаемое поле показывается ошибкой схемы, а не падением
страницы.

`usePluginSettings(pluginId)` загружает значения из домена `plugin`, применяет
defaults через Zod и возвращает `values`, `setValue`, `saveValues` и `reset`.

```ts
const settings = usePluginSettings('internal-theory')
const delay = settings?.values.autosaveDelay
```

Значения живут в общем сторе `@mai/settings` по ключу `plugin:<pluginId>`:
страница настроек и другие потребители (например viewer плагина) видят одно
состояние. `setValue` меняет одно значение и сохраняет его после паузы
автосохранения, `saveValues` пишет полный набор немедленно, `reset` удаляет
документ пункта. На бэкенд в домене `plugin` уходит полный self-describing
документ.

Просмотр ресурса:

```tsx
import { Viewer, PluginViewer, Bounded } from '@mai/plugin'

// полный экран просмотра ресурса
;<Bounded>
  <Viewer resourceId={resourceId} courseId={courseId} />
</Bounded>

// только рендер через плагин, когда данные ресурса уже есть
;<PluginViewer resourceId={resourceId} courseId={courseId} data={resource} />
```

Gateway-вызов метода плагина (ответ валидируется схемой потребителя):

```ts
import { z } from 'zod'
import { callGateway } from '@mai/plugin'

const SnapshotSchema = z.object({ resourceId: z.string(), total: z.number() })
const snapshot = await callGateway(SnapshotSchema, 'internal-task', 'snapshot', {
  resourceId,
})
```

Локали подключаются в `initI18n` единым namespace `plugin`:

```ts
import { pluginI18NResources } from '@mai/plugin'

initI18n({ resources: { plugin: pluginI18NResources } })
```

## Как расширять

### Добавить viewer для типа ресурса

Viewer'ы internal-плагинов не входят в пакет: их регистрирует
композиционный слой приложения (или отдельные пакеты плагинов), чтобы
`@mai/plugin` не зависел от контентных плагинов.

1. Создайте компонент, реализующий `PluginRenderProps`
   (`resourceId`, `courseId`, `data?`, `onReady?`).
2. Зарегистрируйте его под `typeKey` ресурса:

```ts
import { registerInternalViewer } from '@mai/plugin'

registerInternalViewer('theory', TheoryViewer)
```

Регистрацию нужно выполнить **до** `loadPlugins()`: тогда при загрузке
включённого internal-плагина `typeKey` из backend сопоставится с viewer'ом
и попадёт в `RuntimePlugin.viewers`. Если для типа плагина viewer не
зарегистрирован, `loadPlugins()` пишет `warn`.

`setInternalViewers(map)` заменяет реестр целиком, `getInternalViewer(key)`
читает отдельный viewer.

### Добавить метод gateway

Метод объявляется на стороне плагина/backend; на фронте достаточно вызвать
`callGateway` со схемой ответа. Ошибки backend приходят как
`GatewayCallError` с кодом (`pluginNotFound`, `methodNotFound`, `badArgs`,
`notFound`, `forbidden`, `handlerError`).
