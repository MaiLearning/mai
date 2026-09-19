# KV — руководство пакета

> Универсальное key-value хранилище. Store нет — только services `get`/`set`;
> публичная поверхность — `core` + `services`, `api/` внутренний.

## Что делает

Хранит произвольные значения по строковым ключам (настройки, последний
открытый курс и т.п.). Правила ключа зеркалят валидацию бэкенда:
только `[a-zA-Z0-9._:/-]`, длина 1..256 (`MAX_KEY_LENGTH`).
`KvEntry {key, value: unknown, createdAt, updatedAt}` — camelCase, как отдаёт serde.

## Как пользоваться

```typescript
import { getKvValue, setKvValue } from '@mai/kv'

const lastId = await getKvValue<string>('course.last_opened_id').catch(() => null)
await setKvValue('course.last_opened_id', courseId).catch(() => undefined)
```

Отсутствующий ключ — не ошибка: `getKvValue` возвращает `null`.
Значение приходит из БД без схемы — типизация на вызывающей стороне
(`getKvValue<T>`). Ошибка чтения/записи не должна ломать основной сценарий —
гасите её через `.catch` на месте вызова.

## Как расширять

Новые операции — по паре `api/*.ts` (чистый `invoke`) + `services/*.ts`
(валидация входа через `KvKeySchema`, результата — через схему записи).
Публичный экспорт — только через `services/index.ts` и `core/index.ts`.
