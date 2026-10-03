# Quantum Singularity Theme

> **id:** `quantum_singularity`
> **name:** Quantum Singularity
> **category:** `cyberpunk`
> **rarity:** `legendary`
> **unlock:** Reach SS-rank on any entity type OR reach empire tier 60
> **source:** `shared/config/themes/quantumSingularityTheme.ts`
> **status:** COMPLETE

---

## Overview

The **Quantum Singularity** theme visualizes an empire that has bent the
fundamental laws of the universe. A collapsing accretion vortex of electric
cyan, violet, and magenta quantum energy swirls around a near-black indigo
void. Dense streams of quantum particles, a rotating event-horizon background,
and glitchy synthwave audio complete the identity — the ultimate prestige skin
for empires that have transcended conventional physics.

It is the **10th theme** registered in `THEME_REGISTRY` and the second
`legendary`-rarity theme, sitting alongside **Stellar Gold**.

---

## Design Language

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Primary | `#00E0FF` quantum cyan | Signature quantum-energy color |
| Secondary | `#7A3CFF` deep violet | Event-horizon glow |
| Accent | `#FF3DFF` magenta | Waveform interference highlights |
| Background | `#030012` near-black indigo | Depth of space beyond the singularity |
| Surfaces | `#14003A` / `#1E005A` | Layered violet panels |
| Typography | Rajdhani / Exo 2 / Audiowide | Shared sci-fi family used by the game |
| Background style | `vortex` + `rotate` | Spinning accretion disk |
| Star density | `very_dense` | Quantum particle sea |

---

## Full Configuration

### colors

| Token | Value |
|-------|-------|
| primary | `#00E0FF` |
| secondary | `#7A3CFF` |
| accent | `#FF3DFF` |
| background | `#030012` |
| backgroundAlt | `#0A0026` |
| surface | `#14003A` |
| surfaceAlt | `#1E005A` |
| text | `#E8F6FF` |
| textSecondary | `#8FA8FF` |
| textMuted | `#4A3A8A` |
| border | `#2A0A5A` |
| borderLight | `#3A1A7A` |
| success | `#00FF9D` |
| warning | `#FFD740` |
| error | `#FF3D6E` |
| info | `#00E0FF` |

### gradients

- **background:** `linear-gradient(180deg, #030012 0%, #0A0026 50%, #030012 100%)`
- **backgroundAlt:** `linear-gradient(180deg, #0A0026 0%, #14003A 100%)`
- **header:** `linear-gradient(90deg, #030012 0%, #14003A 50%, #030012 100%)`
- **footer:** `linear-gradient(90deg, #0A0026 0%, #14003A 50%, #0A0026 100%)`
- **card:** `linear-gradient(135deg, #14003A 0%, #1E005A 100%)`
- **button:** `linear-gradient(135deg, #00E0FF 0%, #7A3CFF 100%)`
- **buttonHover:** `linear-gradient(135deg, #2AE6FF 0%, #8A4CFF 100%)`
- **accent:** `linear-gradient(90deg, #00E0FF 0%, #FF3DFF 100%)`
- **glow:** `radial-gradient(circle, rgba(0,224,255,0.35) 0%, transparent 70%)`

### effects

| Token | Value |
|-------|-------|
| particleColor | `#00E0FF` |
| particleCount | `220` |
| glowColor | `#7A3CFF` |
| glowIntensity | `0.6` |
| shadowColor | `rgba(0,224,255,0.35)` |
| shadowBlur | `24px` |
| ambientLight | `#0A0026` |
| starDensity | `very_dense` |
| nebulaColor | `#7A3CFF` |
| nebulaOpacity | `0.3` |

### shape

- borderRadius: `6px`
- backdropBlur: `10px`
- transitions: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### background

- backgroundStyle: `vortex`
- backgroundAnimation: `rotate`

### audio guide

- **musicTheme:** `Quantum Drift - Glitchy synthwave pads, digital arpeggios, deep sub-bass pulses`
- **soundscape:** `Data streams flowing, singularity hum, occasional digital chimes`

### S-rank color overrides

| Rank | Color |
|------|-------|
| S | `#00E0FF` |
| SS | `#9D4DFF` |
| SSS | `#FF3DFF` |

### CSS variables

```css
--theme-primary: #00E0FF;
--theme-secondary: #7A3CFF;
--theme-accent: #FF3DFF;
--theme-bg: #030012;
--theme-surface: #14003A;
--theme-text: #E8F6FF;
--theme-border: #2A0A5A;
--theme-glow: rgba(0,224,255,0.35);
--theme-star-color: #8FA8FF;
--theme-nebula: #7A3CFF;
```

---

## Integration Points

The theme is registered in `shared/config/themeSystemConfig.ts`:

1. **`ThemeId` union** — `'quantum_singularity'` added as the 10th id.
2. **`THEME_REGISTRY`** — `quantum_singularity: QUANTUM_SINGULARITY_THEME`.
3. **`isThemeUnlockedBySRank`** — available at `SS` rank and above; at `SSS`
   it is included automatically via `ALL_THEMES`.
4. **Title screen** — `mapColorToBorderClass` maps `#00E0FF` → `border-t-cyan-400`
   so the spinner inherits the theme color.

Because all consumers resolve themes through `getThemeById` / `ALL_THEMES`,
no other code changes are required — the theme appears automatically in every
theme-driven surface (`getTitleScreenConfigForTheme`, `getCSSConfigForTheme`,
`generateThemeCSS`, `getThemeCSSVariables`).

---

## Unlock Design

| Gate | Value |
|------|-------|
| Minimum rank | SS on any entity type |
| Alternate path | Empire tier 60 |
| S-tier fallback | Not available before SS |

The theme is intentionally prestige-gated to mirror **Stellar Gold** but is
slightly more accessible (SS instead of SSS) so mid-core veterans chasing a
cyberpunk look have a legendary tier of their own.

---

## QA Checklist

- [x] `ThemeId` union includes `'quantum_singularity'`
- [x] Definition registered in `THEME_REGISTRY`
- [x] `isThemeUnlockedBySRank` includes the theme for `SS` and `SSS`
- [x] `mapColorToBorderClass` covers the primary color `#00E0FF`
- [x] All required `ThemeDefinition` fields present (type-check enforced)
- [x] No collisions with the existing 9 theme ids or hex palettes
