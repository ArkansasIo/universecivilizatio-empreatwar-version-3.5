# Changelog

All notable changes to **Universe Civilization: Empire at War** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.5.0] - 2026-09-23

### Overhaul: Universe Civilization Rebranding & Mobile Navigation Architecture

#### Added
- **Collapsible Navigation Rail Mode**: Implemented dual-state navigation sidebar supporting both 260px expanded view and 64px compact icon-rail view with flyout sub-menus.
- **Custom Domain Configuration**: Added `CNAME` and `public/CNAME` configured for `universecivilization-empireatwar.com`.
- **Dedicated Markdown Documentation Suite**: Added comprehensive source code architecture manuals across `/docs/`:
  - `SOURCE_CODE_REFERENCE.md`: Master catalog of all source code files, exports, and roles.
  - `COMPONENTS_ARCHITECTURE.md`: Complete guide to React components, layout hierarchy, navigation, and modal systems.
  - `DATA_MODELS_REFERENCE.md`: Type definitions, data fixtures, balance formulas, and universe topologies.
  - `STATE_MANAGEMENT_AND_ENGINE.md`: Turn engine, cron dispatchers, Web Audio API sound subsystem, and local/Firebase persistence.

#### Changed
- **Total Universe Civilization Rebranding**:
  - Replaced legacy "OGame" references across all user-facing components, views, modals, and codex entries with **Universe Civilization: Empire at War**.
  - Updated Sidebar header branding with "UC" gold insignia, "UNIVERSE CIVILIZATION" typography, and "Empire at War" subtitle.
  - Updated title screen hero banner to *"NEXT-GEN BROWSER MMORPG & UNIVERSE CIVILIZATION STRATEGY"*.
  - Renamed Defense View specifications to `EMPIRE DEFENSE SPEC §22`.
  - Rebranded 1-999,999 Galaxy Stargate Dial & Colony Conquest Hub.
  - Updated Strategic Codex Chapter 3 to *"Universe Civilization: Empire at War Mechanics"*.
- **Mobile Responsive Engine (iPhone 15, iPad, and Web)**:
  - Configured `viewport-fit=cover` and maximum viewport constraints for iOS mobile Safari.
  - Mobile slide-over navigation drawer with backdrop overlay for phones and portrait tablets.
  - Horizontally swipeable resource ribbon in Topbar preventing vertical wrap on small displays.
  - Flexible multi-column layouts using adaptive Tailwind grid breakpoints (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`).
  - Mobile bottom navigation bar for high-priority views (Overview, Fleet, Colonies, Research, Shipyard).
- **Navigation Cleanup**:
  - Relocated Development Team Credits out of the primary strategic sidebar navigation into the persistent global Footer and Topbar status button.

---

## [3.4.0] - 2026-08-15

### Added
- **1-999,999 Procedural Planetary Exploration Engine**:
  - Deterministic PRNG seed hashing supporting 999,999 unique celestial bodies.
  - Procedural atmosphere generation, hazard ratings, and surface anomaly generation.
  - Stargate 7-chevron coordinate address calculation for instant planetary wormhole transit.
- **Planetary Conquest & Colonization Pipeline**:
  - Peaceful colony ship deployment with real-time turn expenditure and mineral requisitions.
  - Hostile orbital bombardment, ground dropship deployment, and territorial annexation.
  - Sovereign planetary tax directives, resource siphon conduits, and 1-click tribute collection.

---

## [3.3.0] - 2026-07-01

### Added
- **Titan Mothership Nexus & Hull Livery Studio**:
  - 6-tier capital chassis progression (Light Frigate to Singularity Dreadnought).
  - 12 modular subsystem slots (spinal lance hardpoints, hyper-shields, fighter flight decks, jump drives).
  - 7 aesthetic hull livery skins with custom animated conduit energy pulses.
  - Interactive Mothership 3D schematic inspection canvas.
  - Bridge Officer recruitment and operational command assignment.

---

## [3.2.0] - 2026-05-20

### Added
- **9 Sovereign Government Systems & Decrees**:
  - Military Junta, Technocracy, Megacorporation, Holy Theocracy, Feudal Monarchy, Cybernetic Hivemind, Direct Democracy, Pirate Syndicate, and Galactic Empire.
  - Dedicated ideological bonuses, economic production multipliers, and unique imperial edicts.
  - Philosophical balance meters adjusting empire stability, corruption, and happiness.

---

## [3.1.0] - 2026-04-10

### Added
- **72 Legendary Galactic Commanders**:
  - Multi-tier commander recruitment gacha with pity guarantees and banner rotations.
  - Dedicated role specializations: Fleet Admirals, Industrial Mining Overseers, Quantum Researchers, and Covert Operatives.
  - Unique tactical passive auras and combat skill trees.

---

## [3.0.0] - 2026-03-01

### Added
- **30 Multiverse Universes & 2,700 Galaxies**:
  - Inter-universal transit via dimensional Supergates.
  - 30 distinct cosmic dimensions with customized physics rules, hyperspace constants, and resource yields.
  - 90 galaxies per universe, yielding 2,700 unique galaxies with coordinate tracking `[U:G:S:P]`.

---

## [2.5.0] - 2026-01-15

### Added
- **Modular Ship Fitting & 6-Layer Armor Architecture**:
  - EVE-inspired High, Medium, Low, and Rig slot customizer.
  - Dynamic CPU and Powergrid calculation with overload constraints.
  - 6-type armor resistance calculation matrix: Kinetic, Thermal, Explosive, Corrosive, Graviton, and Neutron damage absorption.
- **Industrial Blueprint Research**:
  - Material Efficiency (ME) and Time Efficiency (TE) research levels.

---

## [2.0.0] - 2025-11-10

### Added
- **Real-Time Turn Engine & Automated Industry (AIC)**:
  - 6 turns per minute automatic tick engine with manual turn expenditure options.
  - AIC autonomous mining, automated trade routing, and planetary infrastructure building queues.
  - Colony management system supporting multi-world empire expansion.

---

## [1.0.0] - 2025-08-01

### Added
- **Initial Core Foundation**:
  - Space strategy simulation loop: metal, crystal, deuterium, naquadah, energy, and credits economy.
  - Tech tree with prerequisites and exponential research level costs.
  - Orbital shipyard with fleet construction queues and tactical combat resolver.
  - Planetary defenses: rocket launchers, light/heavy lasers, gauss cannons, ion cannons, plasma turrets, and shield domes.
  - Audio sound manager with Web Audio API sound synthesis.
