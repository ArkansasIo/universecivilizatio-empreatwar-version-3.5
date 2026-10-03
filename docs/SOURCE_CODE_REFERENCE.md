# Source Code Reference Manual
## Universe Civilization: Empire at War

This document provides a comprehensive file-by-file reference of the entire source code repository, detailing the architecture, purpose, key exports, and relationships between files.

---

## 1. Root Application Files

### `src/main.tsx`
- **Purpose**: Application entry point. Bootstraps the React virtual DOM tree, mounts into `#root` in `index.html`, and imports global stylesheet `src/index.css`.
- **Dependencies**: `react`, `react-dom/client`, `./App`, `./index.css`.
- **Exports**: None (entry execution).

### `src/App.tsx`
- **Purpose**: Root state hub and router for Universe Civilization: Empire at War. Manages global game state, active view routing, modal dialogues, real-time tick timers, user authentication session, and persistence synchronization.
- **Key State Variables**:
  - `activeView`: Current active screen ID (e.g., `'dashboard'`, `'shipyard'`, `'universe'`, etc.).
  - `resources`: Primary player economy object (credits, metal, crystal, deuterium, naquadah, energy, turns, etc.).
  - `colonies`: List of player's claimed planets and outposts with infrastructure levels.
  - `activeColonyId`: Selected colony identifier for planetary actions.
  - `technologies`: Upgraded research levels and active research queue.
  - `ships`: Owned fleet vessels, construction lines, and hangar allocations.
  - `defenses`: Ground-to-orbit defense installations and shield domes.
  - `isMobileMenuOpen`: Toggle boolean for mobile drawer sidebar.
  - `isCollapsed`: Collapsed/rail mode status for sidebar navigation.
- **Key Handlers**:
  - `handleTick()`: Core game turn engine incrementing resources, processing queues, and updating tick counters.
  - `handleSpendTurns()`: Manual turn consumption for instant resource harvest or tactical actions.
  - `handleNavigate(viewId)`: Route switcher that scrolls to top and updates active view state.

### `src/index.css`
- **Purpose**: Global stylesheet using Tailwind CSS `@import "tailwindcss";` directive along with custom CSS utilities for scanlines, sci-fi borders, scrollbar concealment (`no-scrollbar`), and mobile safe-area insets (`env(safe-area-inset-bottom)`).

### `src/sound.ts`
- **Purpose**: Zero-dependency Web Audio API synthesizer for tactile interface feedback without external MP3/WAV asset dependencies.
- **Sound Effects**: `'click'`, `'confirm'`, `'warning'`, `'alarm'`, `'launch'`, `'turn'`, `'success'`, `'laser'`, `'warp'`.
- **Exports**: `sound` singleton instance with `play(soundName)` method.

### `src/firebase.ts`
- **Purpose**: Firebase Client SDK initialization for persistent cloud storage, Firestore documents, and authentication.
- **Exports**: `app`, `db`, `auth`.

### `src/types.ts`
- **Purpose**: Universal TypeScript type definitions, interfaces, and union types across all game systems.
- **Key Types**:
  - `ResourceState`: Mineral, credit, fuel, turn, and energy counts.
  - `Colony`: Planetary infrastructure, coordinates, biosphere, and production stats.
  - `FleetShip`: Ship specifications, hull types, combat stats, and slot fittings.
  - `DefenseInstallation`: Ground battery stats, shield capacities, and armor values.
  - `TechItem`: Tech tree requirements, branches, and research multipliers.
  - `GovernmentType`: 9 government definitions with ideological traits.
  - `Commander`: Officer rankings, attributes, specialties, and passives.

---

## 2. Core Data Files (`src/*.ts` & `src/data/*.ts`)

### `src/gameData.ts`
- Initial starting player state, default resource values, base mining yields, and faction presets.

### `src/ogameData.ts`
- Classic space strategy data structures: mine upgrade multipliers, ship drydock blueprints, defense structures, and research prerequisites.

### `src/unitRoster90.ts`
- Full 90-class naval roster spanning Corvettes, Destroyers, Cruisers, Battlecruisers, Dreadnoughts, Titans, Carriers, and World-Killers with detailed weapon hardpoints.

### `src/mothershipData.ts`
- Capital Mothership customization models, 6 hull chassis tiers, 12 modular subsystems, bridge officer posts, and livery themes.

### `src/multiverseData.ts`
- Topographic database of 30 distinct Multiverse Universes, physical constants, cosmic modifiers, and 90 galaxies per universe (2,700 total galaxies).

### `src/nmsUniverseData.ts`
- Procedural generation algorithms for infinite star systems, spectral star classifications (O, B, A, F, G, K, M), orbital distances, and anomaly types.

### `src/stargateData.ts`
- 7-chevron coordinate dialing system, Stargate network addresses, dialing computer logic, and wormhole stability calculators.

### `src/stargateRelicsData.ts`
- Ancient Precursor artifacts, ZPMs, repository knowledge crystals, and active relic socket systems.

### `src/stargateNpcRacesData.ts`
- 27 alien civilizations including Asgard, Goa'uld, Replicators, Ancients, Tollan, Wraith, and Ori with unique trade contracts and diplomatic dialogues.

### `src/commander72Data.ts` & `src/commanderData.ts`
- 72 recruit-able galactic commanders with gacha tier rarities, attribute multipliers, and skill trees.

### `src/blueprintSystemsData.ts`
- EVE-style blueprint manufacturing data with Material Efficiency (ME) and Time Efficiency (TE) research tables.

### `src/storeBattlePassData.ts`
- In-game store catalog, seasonal Battle Pass tiers, cosmetic rewards, and galactic credit exchange.

### `src/cronData.ts`
- Server background cron jobs, automated billing ticks, DEFCON escalation schedules, and maintenance cycles.

### `src/dailyMissionsData.ts`
- Daily, weekly, and chapter-based campaign milestones rewarding commander exp, turns, and resources.

### `src/accountProfilesData.ts`
- Player profile archetypes, insignia emblems, account statistics, and prestige records.

### `src/data/developmentCreditsData.ts`
- Development team accreditation, creator info (Stephen), architectural acknowledgments, and milestone release history.

### `src/data/aicData.ts`
- Automated Industry Computer logic rules, logistics pipeline automation, and resource threshold routers.

### `src/data/nemesisData.ts`
- Procedural Nemesis Warlords system, hierarchy ranks, grudge tracking, and tactical counter-measures.

### `src/data/stargateSystemLordsData.ts`
- Goa'uld System Lords PvE boss encounters, Mothership flagships, and conquest loot tables.

### `src/data/universeBoss90Data.ts`
- 90 galaxy boss encounters across the cosmic realities with special raid mechanics.

---

## 3. Structural UI Components (`src/components/`)

### `src/components/Sidebar.tsx`
- Primary navigation sidebar featuring:
  - **Collapsible Rail Mode**: Switches between 260px expanded view and 64px icon-only rail.
  - **Accordion Sub-Menus**: Categorized sections (Overview, Resources, Facilities, Research, Shipyard, Defenses, Fleet, Galaxy, Empire, Merchant, Alliance, Intelligence, Officers, Shop, Admin).
  - **Mobile Drawer**: Off-screen sliding drawer with backdrop overlay for iPhone and tablet screens.
  - **Flyout Navigation**: Hover/click sub-menu menus in rail mode with smart viewport positioning.

### `src/components/Topbar.tsx`
- Persistent header interface containing:
  - Active colony selector dropdown with coordinates `[U:G:S:P]`, field capacity, and instant colony jump.
  - Multi-resource status ribbon with horizontal scroll support for credits, metal, crystal, deuterium, food, water, population, and energy.
  - Real-time server clock and turn engine ticker.
  - Turn spending quick action buttons (+1, +10, +50, +All).
  - Quick action shortcuts (Audio toggle, Mobile nav trigger, Save State manager).

### `src/components/Footer.tsx`
- Persistent bottom footer containing:
  - Real-time status indicators (DEFCON level, game version `v3.5.0`, server ping).
  - Legal credits, system status, and direct button trigger to open the Development Team Credits modal.
  - Mobile bottom navigation bar for high-frequency access on phone screens.

### `src/components/HudMetrics.tsx`
- Floating strategic metric pills displaying empire output per hour, research efficiency, and defense readiness.

### `src/components/LiveSystemRouteBar.tsx`
- Breadcrumb navigation ribbon displaying current active system path and parent category hierarchy.

---

## 4. Modal Components (`src/components/modals/`)

### `src/components/modals/PatchNotesModal.tsx`
- Interactive release changelog modal displaying version highlights, master feature additions, and patch details.

### `src/components/modals/SaveStateManagerModal.tsx`
- LocalStorage import/export engine allowing players to download JSON backup save files or restore previous campaign states.

### `src/components/modals/AdminLoginModal.tsx`
- Secure administrative authentication dialog granting access to game master commands and sandbox cheat tools.

---

## 5. Primary View Components (`src/components/views/`)

| View Component | Route ID | Description |
| :--- | :--- | :--- |
| `DashboardView.tsx` | `dashboard` | Empire overview, planetary astrometry, resource rates, and quick action hub. |
| `ResourcesView.tsx` | `resources` | Resource vault reserves, silo capacity gauges, and production breakdowns. |
| `IncomeView.tsx` | `income` | Mining facility yields, geothermal multipliers, and solar output metrics. |
| `MasterUpgradesView.tsx` | `master-upgrades` | Facilities overview: Robotics factories, Shipyards, and Nanite facilities. |
| `TechTreeView.tsx` | `tech-tree` | Master technology matrix with interactive prerequisite node connections. |
| `ResearchLibraryView.tsx` | `tech-library` | Research lab queues and active scientific research pipelines. |
| `ShipyardView.tsx` | `shipyard` | Naval drydock construction queues and fleet assembly lines. |
| `DefenseView.tsx` | `defenses` | Ground-to-orbit defense matrix, laser emplacements, and shield domes. |
| `ShipFittingView.tsx` | `ship-fitting` | EVE-style high/med/low slot customizer with CPU and Powergrid limits. |
| `PlanetsView.tsx` | `planet-list` | Colonial world directory, building field allocations, and biosphere management. |
| `PlanetaryInvasionView.tsx` | `planetary-invasion` | 1-999,999 procedural worlds conquest, colony ships, and orbital lance strikes. |
| `UniverseView.tsx` | `universe` | 30 Multiverse realities, 2,700 galaxies, and dimensional jump gate navigation. |
| `StargateNetworkView.tsx` | `stargate-network` | 7-chevron coordinate dialing computer and active wormhole transit. |
| `CombatView.tsx` | `targets` / `attack-log` | Fleet dispatch, tactical target selection, and combat round simulation. |
| `MothershipView.tsx` | `ship` / `modules` | Titan flagship customization, subsystem hardpoints, and livery studio. |
| `GovernmentSystemView.tsx` | `government-system` | 9 sovereign government systems, ideological balance, and imperial decrees. |
| `CommanderSystemView.tsx` | `officer-recruit` | 72 galactic commanders, recruitment gacha, and operational assignments. |
| `DevelopmentCreditsView.tsx` | `development-credits` | Official development team credits, creator accreditation, and inspirations. |
| `CodexDocumentationView.tsx` | `codex-doc` | In-game GDD manual, mathematical formulas, and system specifications. |
| `AdminControlPanelView.tsx` | `admin-panel` | Game Master console, resource grants, universe speed multipliers, and debug tools. |

---

## 6. Utilities & Configuration (`src/utils/` & `src/config/`)

- `src/utils/upgradeCalculations.ts`: Exponential cost scaling algorithms: $Cost = Base \times Growth^{Level-1}$.
- `src/utils/colonyCalculations.ts`: Planetary temperature, max building field sizing, and solar satellite efficiency.
- `src/config/appConfig.ts`: Application global metadata, default server speeds, and API endpoints.
- `src/config/themeConfig.ts`: Color palettes and theme mode presets (Default, Emerald, Cyberpunk, Obsidian).
- `src/config/adminAuthConfig.ts`: Admin credentials and permission level definitions.
