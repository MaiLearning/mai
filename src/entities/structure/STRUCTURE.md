# STRUCTURE — руководство сущности

> Руководство «для чайников»: что делает сущность, как ею пользоваться
> (примеры кода), как расширять.

## Что делает

Сущность хранит **дерево содержимого курса**: папки и ресурсы,
сгруппированные по `parentId` и упорядоченные по `position`.

Состояние живёт в `store/` и построено вокруг иммутабельного дерева:

- `structureTreeAtom` — **SSOT**: иммутабельный `Tree` (модуль `tree/`)
  с O(1)-индексами `ItemMap`/`ChildrenMap`/`ParentsMap`. Любая мутация
  возвращает новый экземпляр — старый остаётся неизменным (это база
  для undo/redo).
- `structureFlatByIdAtom` — полные payload-узлы, как их вернул backend.
  Дерево владеет только `name`/`parentId`/`position` (и производным
  `isFolder`); остальные поля (`courseId`, `resource`, `directoryId`)
  сохраняются здесь, чтобы плоская проекция не теряла данные.
- `structureNodesAtom` — **точка чтения для потребителей**: производная
  плоская проекция `StructureNodeFlat[]` (обход вглубину).
- `canUndoAtom` / `canRedoAtom` — реактивные флаги истории.

Изменения идут через **History-машину** (Command Pattern):

- `store/actions.ts` — реализации `StructureAction` (Move, Rename,
  Remove, Create): `do/undo` чисто применяются к `Tree`,
  `sendDo/sendUndo` синхронизируют с backend через entity-сервисы
  (structure; создание папки — directory).
- `store/history.ts` — цепочка действий в атомах + операции
  `execute/revert/commitUndo/commitRedo/clear`.

Семантика мутаций:

| Операция | Порядок | При ошибке backend |
|---|---|---|
| move / rename / remove | **optimistic**: do → sendDo | `revert` — откат дерева и удаление действия из истории |
| create (папка/ресурс) | **backend-first**: сервис → do | дерево не меняется |
| undo / redo | **backend-first**: sendUndo/sendDo → commit | дерево не трогается, ошибка пробрасывается |

Ограничения (унаследованы): undo удаления восстанавливает только сам
узел, без детей (backend не поддерживает restore). Переименование любых
узлов (директорий и ресурсов) идёт через `renameNode` (structure-сервис);
backend сам ветвится по типу узла — IPC `rename_node`,
HTTP `PATCH /structures/node/{id}`.

## Как пользоваться

Читать (реактивно, из компонента/хука):

```typescript
import { useAtomValue } from 'jotai'
import { structure } from '@/entities'

const nodes = useAtomValue(structure.structureNodesAtom) // StructureNodeFlat[]
const canUndo = useAtomValue(structure.canUndoAtom)
```

Загрузить и мутировать (action-атомы, ошибки пробрасываются — ловит
вызывающий код):

```typescript
import { useSetAtom } from 'jotai'
import { structure } from '@/entities'

const load = useSetAtom(structure.loadStructureAtom)
const createFolder = useSetAtom(structure.createDirectoryAtom)
const move = useSetAtom(structure.moveNodeAtom)
const rename = useSetAtom(structure.renameNodeAtom)
const remove = useSetAtom(structure.deleteNodeAtom)
const undo = useSetAtom(structure.undoStructureAtom)

await load(courseId) // заполняет дерево, чистит историю
await createFolder({ courseId, name: 'Новая папка', parentId: null }) // → StructureNodeFlat
await move({ nodeId, newParentId: folderId, position: 1 })
await rename({ nodeId, name: 'Новое имя' })
await remove(nodeId)
await undo()
```

Референсный потребитель — фича `features/sidebar`
(`hooks/useStructure.ts`, `hooks/useStructureActions.ts`): чтение +
конвертация в визуальную модель `CourseNode[]` и обёртки операций
с тостами.

Тесты стор-логики: `store/structure-store.test.ts` (загрузка,
optimistic/откаты, undo/redo, инвариант конвертации).

## Как расширять

**Новая операция над деревом** (например, «дублировать узел»):

1. Если backend-контракта ещё нет — добавь его в `api/` + `services/`
   (валидация через Zod) и в backend (`src-tauri`, общий сервисный слой).
2. Если операция должна участвовать в undo/redo — создай класс
   `XxxAction implements StructureAction` в `store/actions.ts`
   (чистые `do/undo` над `Tree` + `sendDo/sendUndo` в сервисы).
3. Добавь action-атом в `store/`:
   - optimistic-операция: `executeAction(get, set, action)` →
     `await action.sendDo()` → в `catch`: `revertAction(get, set)` + `throw`;
   - backend-first: сначала сервис, затем `executeAction`.
4. Реэкспортируй атом из `store/index.ts`.
5. Дополни `store/structure-store.test.ts` (happy path + откат при
   ошибке backend).

**Новый источник чтения** (например, счётчики): используй
`structureNodesAtom` или `get(structureTreeAtom)` внутри производного
атома `store/`. Напрямую `structureTreeAtom` в компонентах не читай —
это внутреннее состояние, публичный контракт — плоская проекция.
