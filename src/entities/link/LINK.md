# Link — сущность ссылок

Направленные рёбра: источник (`sourceType` + `sourceId` — ресурс или курс)
→ цель `target` (`{kind:'resource', courseId, resourceId}` |
`{kind:'course', courseId}` | `{kind:'uri', uri}`). Владелец — плагин
(`ownerPluginId`), только он изменяет и удаляет ссылку. `targetStatus`
(`'ok' | 'broken'`) выставляет backend при валидации цели.

Wire-контракт (camelCase, таймстампы в мс) — источник истины
`core/schema.ts`:

```
Link { id, sourceType, sourceId, target, ownerPluginId,
       title: string|null (≤200), description: string|null (≤2000),
       createdAt, updatedAt, targetStatus }
```

Пример в компоненте:

```tsx
const linksByCourse = useAtomValue(linksByCourseAtom)
const loadCourseLinks = useSetAtom(loadCourseLinksAtom)
const createLink = useSetAtom(createLinkAtom)

useEffect(() => void loadCourseLinks(courseId), [courseId])
await createLink({
  courseId,
  input: { sourceType: 'course', sourceId: courseId,
    target: { kind: 'resource', courseId, resourceId }, ownerPluginId: 'internal-link' },
})
```

Атомы: `linksByCourseAtom` (Record<courseId, Link[]>),
`loadCourseLinksAtom(courseId)`, `createLinkAtom({courseId, input})`,
`updateLinkAtom(input)`, `deleteLinkAtom({id, ownerPluginId})`.
Внешние изменения (HTTP-агенты) применяет sync — `applyLinkChangeAtom`.
