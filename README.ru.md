# Mai

[English](README.md) | [Русский](README.ru.md)

> Платформа для самостоятельного обучения: вы решаете, что учить, а Mai
> превращает это в структурированный курс, который вы создаёте, организуете
> и реально завершаете — в своём темпе, по своим правилам и со своими материалами

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Скриншоты

<p align="center">
  <a href=".github/assets/home.png"><img src=".github/assets/home.png" width="49%" alt="Главная"></a>
  <a href=".github/assets/courses.png"><img src=".github/assets/courses.png" width="49%" alt="Курсы"></a>
</p>

<p align="center">
  <img src=".github/assets/course-editor.png" width="72%" alt="Редактор курса">
</p>

<p align="center">
  <a href=".github/assets/task-editor-choice.png"><img src=".github/assets/task-editor-choice.png" width="49%" alt="Редактор задач — один ответ"></a>
  <a href=".github/assets/task-editor-multi-choice.png"><img src=".github/assets/task-editor-multi-choice.png" width="49%" alt="Редактор задач — несколько ответов"></a>
  <a href=".github/assets/task-passing-true-false.png"><img src=".github/assets/task-passing-true-false.png" width="49%" alt="Прохождение — да/нет"></a>
  <a href=".github/assets/task-passing-matching.png"><img src=".github/assets/task-passing-matching.png" width="49%" alt="Прохождение — сопоставление"></a>
</p>

## Технологии

Tauri v2 · Rust · React + TypeScript · SQLite · Jotai · TipTap

## Начало работы

Требования: [Rust](https://rustup.rs), Node.js 20+, [Yarn](https://yarnpkg.com).
На Linux дополнительно нужны [системные зависимости Tauri](https://v2.tauri.app/start/prerequisites/).

```bash
git clone https://github.com/MaiLearning/mai.git
cd mai
yarn install
yarn tauri dev
```

## Сборка и тесты

```bash
yarn build          # production-сборка фронтенда (tsc + vite)
yarn tauri build    # бандл приложения
yarn test           # Vitest
cargo clippy        # запуск из src-tauri/
```

## Документация

Внутренняя документация (архитектура, сущности, контракт плагинов) — на русском:

- `src/entities/ENTITIES.md` — доменные сущности и поток данных
- `src/plugins/PLUGINS.md` — контракт внутренних плагинов

## Лицензия

Распространяется по лицензии [MIT](LICENSE).
