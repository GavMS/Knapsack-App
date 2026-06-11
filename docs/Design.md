# Design System: OpenCode Terminal Mono

## 1. Definição do Estilo

- **Nome:** OpenCode Terminal Mono
- **Tipo:** Terminal-Native, Berkeley Mono Only, Warm Dark, Apple HIG Colors, Minimal Radius
- **Keywords:** opencode, terminal, Berkeley Mono, monospace only, warm dark, Apple HIG, minimal radius, underlined links, single button variant, code-first
- **Era:** 2024-2026 Open Source AI Coding
- **Light/Dark:** ✗ Not Recommended / ✓ Full

## 2. Paleta de Cores

- **Primárias:** Escuro Quente #201d1d, Claro Quente #fdfcfc, Cinza Médio #9a9898, Azul Acento #007aff
- **Secundárias:** Vermelho #ff3b30, Verde #30d158, Laranja #ff9f0a, Borda rgba(15,0,0,0.12)

## 3. Efeitos Visuais

Berkeley Mono como ÚNICA fonte — monospace em tudo, sem sans-serif ou serif. Escuro quente (#201d1d) com subtom avermelhado-marrom, não preto puro. Texto off-white quente (#fdfcfc). Radius mínimo 4px — cantos utilitários afiados. Cores semânticas Apple HIG (azul #007aff, vermelho #ff3b30, verde #30d158, laranja #ff9f0a). Bordas transparentes quentes (rgba(15,0,0,0.12)). Links com underline como estilo padrão. Único variante de botão: fundo escuro, texto claro, padding tight (4px 20px). Terminal hero como elemento visual principal.

## 4. AI Prompt Keywords

Design an OpenCode-inspired terminal-native landing page. Berkeley Mono as the ONLY typeface — monospace everywhere. Warm near-black background (#201d1d) with reddish-brown undertone. Warm off-white text (#fdfcfc). Minimal 4px border-radius. Apple HIG semantic colors (blue #007aff, red #ff3b30, green #30d158, orange #ff9f0a). Warm transparent borders (rgba(15,0,0,0.12)). Underlined links as default. Single button variant: dark bg, light text, 4px 20px padding. Terminal hero as primary visual.

## 5. CSS Technical

```css
background:#201d1d;color:#fdfcfc;accent:#007aff;border:1px solid rgba(15,0,0,0.12);border-radius:4px;font-family:'Berkeley Mono',monospace;font-weight:700 headings,500 body,400 text;line-height:1.50
```

## 6. Design System Variables

```css
--bg:#201d1d;--text:#fdfcfc;--muted:#9a9898;--accent:#007aff;--danger:#ff3b30;--success:#30d158;--warning:#ff9f0a;--border:rgba(15,0,0,0.12);--radius:4px
```

## 7. Checklist de Implementação

- ☐ Berkeley Mono única fonte
- ☐ Escuro quente #201d1d
- ☐ Texto off-white #fdfcfc
- ☐ Radius 4px
- ☐ Cores Apple HIG
- ☐ Bordas quentes
- ☐ Links underlined
- ☐ Terminal hero
- ☐ Responsivo

## 8. Visual Theme & Atmosphere

Estilo OpenCode Terminal Mono com Berkeley Mono exclusivo, dark quente e cores Apple HIG. Ideal para agentes de código AI, CLIs e ferramentas open-source. Inspirado no design do OpenCode, que abraça identidade monospace total — tudo é código, tudo fala na mesma voz de terminal.

- Density: 8/10 — Dense
- Variance: 3/10 — Restrained
- Motion: 4/10 — Subtle

## 9. Color Palette & Roles

- **Escuro Quente** (#201d1d) — Dark surface, primary background
- **Claro Quente** (#fdfcfc) — Secondary surface or text color
- **Cinza Médio** (#9a9898) — Secondary text, borders, muted elements
- **Azul Acento** (#007aff) — Accent highlight, links and focus states
- **Vermelho** (#ff3b30) — Error states, destructive actions
- **Verde** (#30d158) — Success states, positive indicators
- **Laranja** (#ff9f0a) — Warm accent, call-to-action secondary
- **Borda** (rgba(15,0,0,0.12)) — Extended palette, decorative use

## 10. Typography Rules

- **Display / Hero:** Berkeley Mono — Weight 700, tight tracking, used for headline impact
- **Body:** Berkeley Mono — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** Berkeley Mono — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** Berkeley Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem

## 11. Component Stylings

- **Primary Button:** Rounded (4px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Rounded (4px) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.

## 12. Layout Principles

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).

## 13. Motion & Interaction

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.

## 14. Anti-Patterns (Banned)

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No decorative gradients — flat color only
- No shadows heavier than 0 2px 8px rgba(0,0,0,0.08)
- No pure white (#FFFFFF) backgrounds — use off-white or dark surfaces
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

## Contexto Histórico

Inspirado no design do OpenCode, que abraça identidade monospace total — tudo é código, tudo fala na mesma voz de terminal.

## Caso de Uso

Agentes de código AI, CLIs, Ferramentas open-source, Editores de terminal
