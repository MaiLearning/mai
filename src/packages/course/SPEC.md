# SPEC: порт UI `@mai/course` из `app/_mai`

## Задача
Перенести вью-слой курсов (форма, модалки, карточки, секция) из
`app/_mai/src/**` в пакет `app/mai/src/packages/course` («@mai/course»), адаптировав
все токены темы под контракт `@mai/theme` и подключив i18n через `@mai/i18n`.
Писать код, tsc-чистый; в конце прогнать `tsc` и `pnpm vitest run`.

## Структура назначения
```
packages/course/src/
  core/    (уже есть — НЕ трогать)
  api/     (уже есть — НЕ трогать)
  services/(уже есть — НЕ трогать)
  ui/
    components/     (FIELD: Field, FormFeedback, Input/Select/Textarea, FieldLabel...
                     PICKERS: StatusPicker, TagInput, ColorPicker, PairColorPicker
                     DANGER: DangerPlate
                     PREVIEW: CoursePreviewHeader
                     CARDS: CourseCard, CourseGrid, CreateCard, CoursesSection* )
    modals/         (CreateCourseModal, EditCourseModal, CreateCourseModal/EditCourseModal styles)
    styles.ts       (общие style-blocи, при необходимости)
  locale/ru.json / locale/en.json
  index.ts          (корневой реэкспорт)
```

## Токены темы — маппинг (САМОЕ ВАЖНОЕ)
Источник (`_mai`) → назначение (`@mai/theme`). Все ключи темы адаптируются:
- `theme.colors.*` сохраняются по имени: body, surface, surface, textMuted, text, border,
  borderStrong, primary, primarySurface, success, successSurface, warning, warningSurface,
  danger, dangerSurface, surfaceElevated, focus, textMuted.
  ПРИМЕЧАНИЕ: `dangerSurface`, `successSurface`, `warningSurface`, `surfaceElevated`, `focus`
  уже есть в контракте AppTheme.
- `theme.typography.fontFamily` → `theme.typography.fontFamily`
- `theme.typography.fontFamilyMonospace` → `theme.typography.fontFamilyMonospace`
- `theme.spacing.*` → `theme.spacing.*` (xs/sm/md/lg/xl)
- `theme.radii.sm` → `theme.radius.sm`, `theme.radii.md` → `theme.radius.md`,
  `theme.radii.lg` → `theme.radius.lg`, `theme.radii.pill` → `theme.radius.full`
- `theme.transitions.fast` → `theme.durations.fast` (в переходах: `transition: color ${theme.durations.fast}`)
- `theme.shadows.md` → `theme.shadows.md`, `.sm`, `.lg`
- `theme.zIndex.modal` → `theme.zIndex.modal`
- `theme.breakpoints.md` → media-запросы не через токен, а инлайн-литералы из base (см. ниже)
- `theme.radii.*` в Media (course-preview + cards) не используются.

Токены, которых НЕТ в @mai/theme и их замена:
- `theme.colors.borderStrong` — есть (borderStrong)
- `theme.colors.surface` — есть (surface)
- `theme.colors.body` — есть (body)
- НЕ используй `theme.colors.textMuted` если его нет — есть.
  (Все ключи выше подтверждены в src/packages/theme/src/base/themes/theme.ts)

Фонт: подтверждённый контракт (theme.ts):
```
typography: { fontFamily, fontFamilyMonospace, sizes{xs,sm,md,lg,xl}, weights{regular,medium,semibold,bold}, lineHeights{tight,normal,relaxed} }
spacing: { xs,sm,md,lg,xl }
radius: { sm, md, lg, full }
shadows: { sm, md, lg }
zIndex: { popover, toast, modal }
durations: { fast, normal, slow }
breakpoints: { sm, md, lg, xl }  (в px строками)
```

## Breakpoints
Использовать напрямую из контракта, но в styled-компонентах запись:
```ts
@media (min-width: ${({ theme }) => theme.breakpoints.md}) { ... }
```
Если стиль тянет статичную строку — ок захардкодить '768px' с комментарием.

## i18n
- namespace: `course` (единый ns). Ключи брать из `_mai/src/features/course-modal/locales/{ru,en}/courseModal.json`
  (+ `home.json` coursesSection-часть, и courseModal-часть) — слить в один словарь.
- i18n доступ через `@/app/i18n`? НЕТ: пакет использует `@mai/i18n`:
  ```ts
  import { useTranslation, initI18n } from '@mai/i18n'
  ```
  В пакете НЕ вызывать `initI18n` на уровне компонентов — инициализация в приложении-потребителе.
  Компоненты используют `useTranslation('course')`.
  Для статичных строк (placeholder из t) — просто t(...).

## ВАЖНО (адаптации, НЕ копировать как есть)
1. `notifySuccess/notifyError` (toast) → заменить на TODO-комментарий:
   `// TODO(course): уведомление `createCourse.success` — подключить через @mai/notifications`
   Колбэки: `onCreated`, `onSaved`, `onDeleted` — компонент принимает их как props и вызывает
   после успеха (не крутит navigate).
2. `useNavigate` → НЕ использовать. Навигацию наружу отдаёт родитель через `onCreated/onSaved`.
3. Модалки используют `Modal` из `@mai/theme` (см. ниже его API).
4. Иконки — `lucide-react` (уже в deps пакета).
5. styled-components + styled.d.ts типизация уже настроена (@mai/theme).

## Modal @mai/theme — API
```ts
import { Modal } from '@mai/theme'
<Modal opened onClose={...} title={t('...')} labelledBy dismissible>
  {/* body */}
</Modal>
```
Пропсы Modal: opened(bool), onClose(), title?, labelledBy?, dismissible?.
Внутри body используем styled-компоненты (Row, Field и т.д.). Кнопки — из @mai/theme Button
(варианты: primary/secondary/ghost/danger, size sm/md). Spinner — @mai/theme Spinner.

## Стили
Каждый компонент — файл `X.tsx` + при необходимости `X.style.ts` c styled-блоками.
Использовать парные файлы стилей где у источника был `.styles.ts`.

## Файлы для порта (путь источника → назначение)
### Форма
- `src/features/course-modal/Field.tsx` → `ui/components/form/Field.tsx` (Field, FieldLabel и т.д.)
- `src/features/course-modal/FormFeedback.tsx` → `ui/components/FormFeedback.tsx`
- `src/features/course-modal/TagInput.tsx` → `ui/components/form/TagInput.tsx`
- `src/features/course-modal/StatusPicker.tsx` → `ui/components/form/StatusPicker.tsx`
- `src/features/course-modal/ColorPicker.tsx` (есть) → `ui/components/form/ColorPicker.tsx`
- `src/features/course-modal/ColorPairPicker.tsx` → `ui/components/form/ColorPairPicker.tsx`
- `src/features/course-modal/constants.ts` → `ui/components/form/constants.ts`
- `src/features/course-modal/utils/color.ts` → `ui/utils/color.ts`
- `src/features/course-modal/DangerPlate.tsx` → `ui/components/DangerPlate.tsx`
- `src/features/course-modal/CoursePreviewHeader.tsx` → `ui/components/preview/CoursePreviewHeader.tsx`
- `useCourseForm` (хук формы) → `ui/components/form/useCourseForm.ts` (если в источнике — принять логику, i18n через ns course)

### Модалки
- `src/pages/home/modal/CreateCourseModal.tsx` → `ui/modals/CreateCourseModal.tsx`
- `src/pages/home/modal/EditCourseModal.tsx` → `ui/modals/EditCourseModal.tsx`

### Карточки и секция
- `src/features/courses-section/CourseCard.tsx` → `ui/cards/CourseCard.tsx` (название уточнить по источнику)
- `src/features/courses-section/CoursesSection.tsx` → `ui/cards/CoursesSection.tsx`
- `src/features/courses-section/CourseGrid.tsx` / `CreateCard.tsx` → по факту источника
- styles: `CoursesSection.styles.ts`, `shared.styles.ts` → парные style-файлы

### Локали
- слить `courseModal.json` (ru/en) + `coursesSection` из `home.json` → `locale/{ru,en}.json` (ns `course`)

### Корневой index
- `index.ts` экспортирует core+ui (все компоненты/хуки/утилиты).

## Проверка
После каждого файла — всё в конце одним прогоном:
```
cd app/mai && pnpm install
pnpm -C src/packages/course exec tsc --noEmit   # или через корневой tsc
cd /home/anton/Project/Mai/app/mai && pnpm vitest run
```
tsc должен быть чист. Тесты core не должны сломаться (ui не должны их затрагивать).
