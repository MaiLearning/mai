#!/usr/bin/env node
// Форматирование проекта или переданных путей (см. .opencode/instructions/code.md).
//
// Использование:
//   yarn format                 — весь проект (biome + prettier по стилям + eslint)
//   yarn format <пути...>       — только переданные файлы/директории
//   yarn format --check [пути]  — только проверка, без записи (аналог format:check)
//
// Цепочка и семантика совпадают со старыми скриптами: biome check → prettier
// (только *.style.ts / *.styles.ts) → eslint (--fix в режиме записи).
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const argv = process.argv.slice(2)
const check = argv.includes('--check')
const paths = argv.filter((a) => a !== '--check')
const targets = paths.length > 0 ? paths : ['.']

const binDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', '.bin')
const bin = (name) => path.join(binDir, process.platform === 'win32' ? `${name}.cmd` : name)

const run = (name, args) => {
  const res = spawnSync(bin(name), args, { stdio: 'inherit' })
  if (res.error) {
    console.error(`format: не удалось запустить ${name}: ${res.error.message}`)
    process.exit(1)
  }
  if (res.status !== 0) process.exit(res.status ?? 1)
}

// Biome — формат и organize-imports (linter в biome.json выключен).
run('biome', check ? ['check', ...targets] : ['check', '--write', ...targets])

// Prettier — только файлы стилей. Без путей — глоб по src; с путями — директория
// даёт scoped-глоб, style-файл — напрямую, обычный файл — пропуск (prettier его
// не обрабатывает, его закрывают biome и eslint). Несуществующий путь пропускаем:
// ошибку по нему выдаст biome ещё до prettier.
const STYLE_FILE = /\.(style|styles)\.ts$/
const styleTargets = []
if (paths.length === 0) {
  styleTargets.push('src/**/*.{style,styles}.ts')
} else {
  for (const p of paths) {
    let st = null
    try {
      st = fs.statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      styleTargets.push(`${p.replace(/\/+$/, '')}/**/*.{style,styles}.ts`)
    } else if (STYLE_FILE.test(p)) {
      styleTargets.push(p)
    }
  }
}
if (styleTargets.length > 0) {
  run('prettier', [
    check ? '--check' : '--write',
    '--no-error-on-unmatched-pattern',
    ...styleTargets,
  ])
}

// ESLint — линт; в режиме записи — с --fix.
run('eslint', check ? [...targets] : [...targets, '--fix'])
