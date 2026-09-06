# THEORY-PLUGIN — руководство сущности

> Руководство «для чайников»: что делает сущность, как ею пользоваться
> (примеры кода), как расширять.

## Что делает

Сущность `theory-plugin` хранит **контент теоретических материалов** — JSON-документ
TipTap, по одной записи на ресурс (`resourceId` — ключ). Ресурсы с `typeKey: "theory"`
открываются во viewer плагина `src/plugins/theory` (WYSIWYG-редактор в духе Obsidian:
материал всегда редактируемый, отдельного режима просмотра нет).

Контракт записи (Zod, `core/schema.ts`):

```ts
{ resourceId: string, content: Record<string, unknown>, createdAt: number, updatedAt: number }
```

`content` — произвольный JSON (проверка формы документа — `isTipTapDoc` на фронте).

## Как пользоваться

Транспорт — Tauri IPC (`backend: src-tauri/src/plugins/theory`), сервисы валидируют
Zod-схемами в обе стороны:

```ts
import { fetchTheoryContent, saveTheoryContent } from '@/entities/theory-plugin/services'

const record = await fetchTheoryContent(resourceId) // → TheoryContent | throw
await saveTheoryContent({ resourceId, content })    // → TheoryContent (свежие updatedAt)
```

Fake-ветки нет (в отличие от других сущностей): при `fakeData` контент всё равно
ходит в backend. Viewer автосохраняет с дебаунсом (500 мс) — `useTheoryAutosave`:
статусы `idle/saving/saved/error`, `saved` гаснет через 2 с, `Ctrl+S` — ручной flush,
ошибка возвращает контент в очередь (Retry в статусбаре). До загрузки контента
редактор read-only (нельзя набрать текст, который перезатрётся).

## Как расширять

**Кастомные ноды** — `src/plugins/theory/nodes/`: TipTap-нода + React node view
(в пример — `CalloutNode`); команды декларируются в одном месте
(`nodes/theory-commands.ts`, namespace `theory`). Стили — парный `*.style.ts`.

**Wiki-ссылки `[[...]]`** (`lib/wiki-*`, `nodes/WikiLinkNode`): упоминание другого
ресурса курса = инлайн-нода `wikiLink {resourceId, label}`. Автокомплит по `[[` —
`@tiptap/suggestion` (меню рендерит viewer через `lib/wiki-popup`). После каждого
автосейва `lib/wiki-links.ts` приводит рёбра Link в соответствие упоминаниям:
`callGateway('internal-link', 'create'/'delete', caller='internal-theory')`,
дедуп — одно ребро на пару источник→цель. Статусы целей (`broken`) гидрируются
через `listBySource` при открытии. Удалён ресурс-источник → чистит sweep Link;
удалён упомянутый ресурс → чип показывается broken.

**Контент-плагины редактора** (расширения TipTap) — добавляются в массив
`extensions` в `lib/useTheoryEditor.ts`. Инлайн-ссылки — Link-марка StarterKit
(`openOnClick: false`, открытие — Ctrl+Click / кнопки диалога).
