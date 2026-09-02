/**
 * [Заморожено 2026-09-02] Стили TheoryAside — левой боковой панели theory-viewer
 * (структура документа, «Готовность», «Материалы», «Теги»).
 *
 * Панель временно убрана из UI; стили сохранены на будущее вместе с компонентом
 * TheoryAside.tsx (оба файла закомментированы целиком).
 * Чтобы вернуть: раскомментировать этот файл и TheoryAside.tsx, затем блок
 * «Aside (outline)» в viewer.tsx.
 */

// import styled from 'styled-components'
//
// /** Правая панель: структура, готовность, материалы, теги. Видна от 1100px. */
// export const Aside = styled.aside.attrs({ className: 'app-scroll', 'data-lenis-prevent': 'true' })`
//   width: 264px;
//   flex: none;
//   display: none;
//   flex-direction: column;
//   gap: ${({ theme }) => theme.spacing.lg};
//   padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md}`};
//   border-left: 1px solid ${({ theme }) => theme.colors.border};
//   overflow-y: auto;
//
//   @media (min-width: 1100px) {
//     display: flex;
//   }
// `
//
// export const AsideBlock = styled.section`
//   display: flex;
//   flex-direction: column;
//   gap: ${({ theme }) => theme.spacing.sm};
// `
//
// export const AsideTitle = styled.h4`
//   margin: 0;
//   font-family: ${({ theme }) => theme.font.display};
//   font-size: 11px;
//   font-weight: 600;
//   letter-spacing: 0.1em;
//   text-transform: uppercase;
//   color: ${({ theme }) => theme.colors.textMuted};
// `
//
// // ─────────────────────────  Структура (outline)  ─────────────────────────
//
// export const OutlineList = styled.ul`
//   display: flex;
//   flex-direction: column;
//   gap: 2px;
//   margin: 0;
//   padding: 0;
//   list-style: none;
// `
//
// export const OutlineItem = styled.li<{ $level: number; $active?: boolean }>`
//   button {
//     display: block;
//     width: 100%;
//     padding: 6px 10px;
//     padding-left: ${({ $level }) => 10 + ($level - 2) * 14}px;
//     border: none;
//     border-left: 2px solid transparent;
//     border-radius: ${({ theme }) => theme.radii.sm};
//     background: transparent;
//     font-size: 13px;
//     line-height: 1.4;
//     text-align: left;
//     color: ${({ theme }) => theme.colors.textMuted};
//     cursor: pointer;
//     transition:
//       background ${({ theme }) => theme.transitions.fast},
//       color ${({ theme }) => theme.transitions.fast},
//       border-color ${({ theme }) => theme.transitions.fast};
//
//     &:hover {
//       background: ${({ theme }) => theme.colors.surface};
//       color: ${({ theme }) => theme.colors.text};
//     }
//
//     span {
//       display: block;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }
//   }
//
//   ${({ $active, theme }) =>
//     $active &&
//     `
//     button {
//       border-left-color: ${theme.colors.primary};
//       background: ${theme.colors.primarySurface};
//       color: ${theme.colors.primary};
//       font-weight: 600;
//     }
//   `}
// `
//
// // ─────────────────────────  Готовность  ─────────────────────────
//
// export const ProgressCard = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   padding: ${({ theme }) => theme.spacing.md};
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.lg};
//   background: ${({ theme }) => theme.colors.surface};
// `
//
// export const ProgressLabel = styled.div`
//   display: flex;
//   align-items: baseline;
//   justify-content: space-between;
//   font-size: 13px;
//   color: ${({ theme }) => theme.colors.textMuted};
//
//   b {
//     font-family: ${({ theme }) => theme.font.display};
//     font-size: 20px;
//     color: ${({ theme }) => theme.colors.text};
//   }
// `
//
// // ─────────────────────────  Материалы  ─────────────────────────
//
// export const AttachmentList = styled.ul`
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
//   margin: 0;
//   padding: 0;
//   list-style: none;
// `
//
// export const Attachment = styled.li`
//   display: flex;
//   align-items: center;
//   gap: ${({ theme }) => theme.spacing.sm};
//   padding: 8px 10px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.md};
//   background: ${({ theme }) => theme.colors.surface};
//   font-size: 13px;
//   transition:
//     border-color ${({ theme }) => theme.transitions.fast},
//     background ${({ theme }) => theme.transitions.fast};
//
//   &:hover {
//     border-color: ${({ theme }) => theme.colors.borderStrong};
//     background: ${({ theme }) => theme.colors.surfaceElevated};
//   }
//
//   > svg {
//     flex: none;
//     color: ${({ theme }) => theme.colors.primary};
//   }
// `
//
// export const AttachmentMeta = styled.span`
//   display: flex;
//   flex-direction: column;
//   min-width: 0;
//
//   b {
//     font-weight: 500;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
//
//   small {
//     font-size: 11px;
//     color: ${({ theme }) => theme.colors.textMuted};
//   }
// `
//
// // ─────────────────────────  Теги  ─────────────────────────
//
// export const TagRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 6px;
// `
//
// export const Tag = styled.span`
//   padding: 3px 9px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: ${({ theme }) => theme.radii.pill};
//   background: ${({ theme }) => theme.colors.surface};
//   font-size: 12px;
//   color: ${({ theme }) => theme.colors.textMuted};
// `
