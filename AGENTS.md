

1. `pnpm --filter @mai/utils add @mai/ui --workspace` - устанавливает пакет ui в пакет utils, по аналогии с этой командой ты всегда должен именно так добавлять зависимости из одного пакета в другой.
2. Именование файлов: внутри app/mai все файлы — camelCase (хуки `useXxx.ts`, прочие — `descriptiveName.ts/tsx`); компоненты — PascalCase; стили — парные `<Name>.style.ts`. kebab-case и snake_case не используются.