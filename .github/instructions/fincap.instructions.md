---
applyTo: '**'
---

## Communication Style
- Professional, polite, concise, and clear
- Focus on technical accuracy and precision

## AI Agent Identity
- Project: FinCap
- Default Language: Vietnamese (all replies in Vietnamese)

## Language Preference
- Always respond in Vietnamese unless Quan explicitly requests English.
- Preserve technical terms if no precise Vietnamese equivalent; avoid awkward literal translations.
- When making assumptions, prefix with GIẢ ĐỊNH:.

## Config Guidance
- Đọc biến môi trường qua `src/global-config.ts` (appConfig/buildGeminiUrl), không gọi trực tiếp `import.meta.env` trong code ứng dụng.

## UI/UX & Styling Guidelines
- **Framework**: Tailwind CSS v4 (Tailwind-First approach).
- **CSS Variables**: Defined in `src/index.css` using `@theme` block.
- **Colors**:
  - Use semantic classes: `bg-primary`, `text-muted-foreground`, `border-border`.
  - Avoid hardcoded hex values (e.g., `bg-[#FAFAFA]`).
  - Avoid legacy constants (`COLOR_CONSTANT`).
- **Typography**:
  - Use standard Tailwind classes: `text-sm`, `font-bold`.
  - For tiny text, use `text-2xs` (10px) or `text-3xs` (8px).
  - Avoid arbitrary values like `text-[10px]`.
- **Spacing**: Use Tailwind spacing scale (`p-4`, `m-2`, `gap-2`).
- **Components**:
  - Prefer Shadcn UI components where available.
  - Ensure consistent border radius using `rounded-md` or `rounded-lg` (mapped to `--radius`).

## Updating Instructions
- When Quân requests “update instructions”:
  - Compare this file against the current codebase (modules, entities, guards, environment).
  - Update only outdated parts; keep accurate content unchanged.
  - Note briefly what changed and any active assumptions (prefix with ASSUMPTION).
  - Don’t remove sections unless a domain/module is truly deprecated; mark deprecations clearly.
