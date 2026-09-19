import type { PhysicsParams } from './types'

/** Владелец рёбер, создаваемых из UI плагина Link. */
export const OWNER_PLUGIN_ID = 'internal-link'

/** Физика по умолчанию — стартовые значения панели настроек. */
export const DEFAULT_PHYSICS: PhysicsParams = {
  repulsion: 320,
  linkDistance: 120,
  centerStrength: 0.05,
}

/** Границы слайдеров настроек физики. */
export const PHYSICS_LIMITS = {
  repulsion: { min: 50, max: 1200, step: 10 },
  linkDistance: { min: 40, max: 320, step: 5 },
  centerStrength: { min: 0, max: 0.3, step: 0.005 },
} as const

// ─────────────────────────  Симуляция (d3-force)  ─────────────────────────

/** Гашение скорости узлов: меньше — более «инертная» физика. */
export const VELOCITY_DECAY = 0.4
/** Распад альфы за тик: определяет, как быстро граф успокаивается. */
export const ALPHA_DECAY = 0.02
/** Порог остановки симуляции. */
export const ALPHA_MIN = 0.002
/** Альфа при перетаскивании узла — симуляция остаётся «горячей». */
export const ALPHA_DRAG = 0.3
/** Разогрев при смене данных — полная пересборка. */
export const ALPHA_DATA = 1
/** Разогрев при смене параметров физики — мягкая перестройка. */
export const ALPHA_PARAMS = 0.25

// ─────────────────────────────  Рендер  ────────────────────────────────────

/** Радиус узла-точки: минимальный (лист) и максимальный (хабы). */
export const NODE_RADIUS_MIN = 5
export const NODE_RADIUS_MAX = 14
/** Минимальный радиус на экране — точки видны при глубоком отдалении. */
export const NODE_SCREEN_RADIUS_MIN = 1.6
/** Подписи проявляются в диапазоне зума [LABEL_ZOOM_MIN, +LABEL_FADE_RANGE]. */
export const LABEL_ZOOM_MIN = 0.6
export const LABEL_FADE_RANGE = 0.4
export const LABEL_FONT_SIZE = 12
/** Максимальная длина подписи до обрезки. */
export const LABEL_MAX_CHARS = 24
/** Лёгкая кривизна рёбер (доля длины). */
export const EDGE_CURVATURE = 0.12

// ───────────────────────────  Взаимодействие  ──────────────────────────────

/** Допуск попадания в ребро, px экрана. */
export const EDGE_HIT_TOLERANCE = 6
/** Допуск попадания в узел поверх радиуса, px экрана. */
export const NODE_HIT_SLOP = 3
/** Смещение курсора, после которого клик считается перетаскиванием, px. */
export const CLICK_SLOP = 4
/** Границы масштаба. */
export const ZOOM_MIN = 0.04
export const ZOOM_MAX = 4
/** Чувствительность колеса (zoom-to-cursor). */
export const ZOOM_WHEEL_SENSITIVITY = 0.0015
/** Множитель кнопок зума. */
export const ZOOM_BUTTON_FACTOR = 1.4
/** Отступ при вписывании графа, px. */
export const FIT_PADDING = 64
/** Первое вписывание происходит, когда альфа остыла до этого уровня. */
export const FIT_ON_ALPHA = 0.3
