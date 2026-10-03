# Universe Civilization: Empire at Wars

> **Galactic Command Interface & 4X Space MMO Simulator**  
> Inspired by classic browser space strategy games (*Game*, *Stargate: Universe Civilization*, *EVE Online*).

---

## 🌌 Overview

**Universe Civilization: Empire at Wars** is an expansive, web-based 4X space strategy game and command center simulation. Players govern an interstellar civilization, manage strategic resources, conduct scientific research, build planet-shattering armadas, dial Stargates, command mothership titans, and battle across a persistent galaxy grid.

---

## ⚡ Core Features & Systems

### 1. Faction Races & Governments
- **5 Iconic Races**:
  - 🛸 **Asgard**: +25% Technology, Teleportation & Advanced Shielding.
  - 🐍 **Goa'uld**: +25% Military Might, Sarcophagus Healing, Jaffa Armadas.
  - 🤖 **Replicator**: +30% Unit Production, Nanite Replication, Rapid Fleet Forging.
  - 🌍 **Tau'ri (Earth)**: +20% Espionage & Covert Recon, Trinium Composite Tech.
  - 🏛️ **Tollan**: +25% Income & Planetary Ion Cannons, Phase-Shifting Tech.
- **Galactic Governments**: Military Junta, Technocracy, Feudal Empire, Republic, and Cybernetic Hive Mind each offering distinct economic and combat modifiers.
- **Multi-Commander Profiles**: Switch between multiple saved commander accounts, customize titles, avatars, and review lifetime battle prestige.

### 2. Economy & Empire Management
- **Resources**: Naquadah, Banked Naquadah, Metal, Crystal, Deuterium, Energy, and Dark Matter.
- **Imperial Bank & Vault**: Secure your wealth against enemy raids; deposit and withdraw liquid Naquadah with race-based interest rates.
- **DEFCON Readiness Levels**: Adjust empire defense posture from DEFCON 4 (Peacetime Economy) to DEFCON 0 (Emergency Martial Law).
- **Automated Cron Daemon**: Background turn engine, production tick scheduler, execution log auditor, and in-game crontab CLI terminal.

### 3. Armory, Training & 90-Class Unit Roster
- **Armory & Depot**: Tier 1 to 10 Weapons, Kinetic Armor, and Energy Shields. Durability degradation and field repair depot.
- **Unit Training**: Untrained recruits, miners, lifers, attack infantry, planetary defense garrisons, covert spies, and super-units.
- **90-Class Unit Roster**: Complete troop and combatant catalog across all racial military doctrines.

### 4. Technology, Laboratories & EVE Blueprint Manufacturing
- **Master Tech Tree**: 4 primary scientific disciplines (Offense, Defense, Covert, Anti-Covert).
- **Research Library**: Energy Systems, Hyperspace Drives, Graviton Physics, and Tachyon Comms.
- **EVE-Style Blueprints**: Material Efficiency (ME) and Time Efficiency (TE) research laboratory to optimize production waste and build cycles.

### 5. Game-Inspired MMORPG Universe & Combat
- **Galaxy Navigation Grid**: Galaxies 1–9, Solar Systems 1–499, and 15 planetary orbital slots per system.
- **Espionage & Sensor Phalanx**: Launch spy drones to gather intel or activate Lunar Sensor Phalanxes to track fleet vectors.
- **Interplanetary & Anti-Ballistic Missile Silos**: Construct and fire strategic nuclear missiles to bypass shields and destroy enemy planetary defenses.
- **Debris Field Recycling**: Deploy recycler fleets to harvest metal and crystal wreckage following massive space battles.
- **Alliance Combat System (ACS)**: Coordinate multi-player fleet attacks and joint planetary defenses.

### 6. Hyperspace, Stargates & Mothership Titans
- **Mothership Command**: Command legendary capital flagships (*O'Neill-Class Asgard Titan*, *Anubis Mothership*, *Earth BC-304 Daedalus*, *Tollan Phased Dreadnought*).
- **Tactical Abilities**: Subspace Bombardment, Shield Overcharge, Micro-Jump, and Fleet Auras.
- **Stargate Network & Iris Controls**: Dial 7-symbol gate addresses across the Milky Way and Pegasus networks with titanium-trinium iris protection.

### 7. In-Game Store & Battle Pass
- **Imperial Store**: Officer contracts (Commander, Admiral, Geologist, Engineer), instant production boosters, and relic caches.
- **Seasonal Battle Pass**: Free and Dark Matter VIP tracks with 30 reward tiers, daily drills, and seasonal combat objectives.

### 8. Stellar Planetary & Lunar Encyclopedia
- **Classes A through Z**: Comprehensive astrophysical catalog of all 26 planetary classifications (Class M Terrestrial, Class A Primordial, Class Z Antimatter Void, etc.).
- **Lunar Classification Archetypes**: Origin types, gravity, tidal heating, and phalanx bonuses.
- **9-Tier Planetary Size Scale**: Volumetric tiers (Tier 1 Dwarf Asteroid to Tier 9 Supermassive World-Forge) dictating building slots and defense caps.
- **Interstellar Phenomena**: Black holes, pulsars, dyson swarms, and ancient supergates.

---

## 🛠️ Tech Stack

- **Frontend**: React 18+ (Hooks, Functional Architecture)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Iconography**: Lucide React
- **Audio Engine**: Web Audio API Sound Synthesizer (`src/sound.ts`)
- **Bundler & Tooling**: Vite 8+

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start local development server on port 3000
npm run dev
```

### Production Build & Linting

```bash
# Validate TypeScript syntax & types
npm run lint

# Compile production bundle
npm run build
```

---

## 📁 Architecture & File Layout

```text
├── CNAME                          # Custom domain routing (universecivilization-empireatwar.com)
├── CHANGELOG.md                  # Comprehensive version change history
├── DOCUMENTATION.md               # Detailed game manual & systems reference
├── docs/
│   ├── SOURCE_CODE_REFERENCE.md   # File-by-file code reference catalog
│   ├── COMPONENTS_ARCHITECTURE.md # Component layout, mobile & modal architecture
│   ├── DATA_MODELS_REFERENCE.md   # Schemas, formulas & data structures
│   ├── STATE_MANAGEMENT_AND_ENGINE.md # Real-time tick engine & persistence
│   ├── COMBAT_ENGINE.md           # Tactical combat resolution formulas
│   ├── ECONOMY_SPEC.md            # Resource economics & rate balancing
│   ├── GDD.md                     # Master game design document
│   ├── MOTHERSHIP_SYSTEM.md       # Titan mothership & fitting specs
│   ├── STARGATE_NETWORK.md        # 7-chevron coordinate dialing manual
│   └── UML_DIAGRAMS.md            # Structural & procedural UML architecture
├── src/
│   ├── main.tsx                   # React root mount
│   ├── App.tsx                    # Main state machine, router & game loop
│   ├── index.css                  # Global Tailwind CSS styles
│   ├── types.ts                   # Core TypeScript types and interfaces
│   ├── sound.ts                   # Audio synthesizer manager
│   ├── accountProfilesData.ts     # Multi-commander slots & career stats
│   ├── storeBattlePassData.ts     # Store catalog & battle pass tiers
│   ├── mmorpgOgameData.ts         # Galaxy slots, servers, ACS & missile silo
│   ├── hyperspaceData.ts          # Hyperspace drives, titans & abilities
│   ├── stellarEncyclopediaData.ts # Planets A-Z, moons & size scales 1-9
│   └── components/
│       ├── Header.tsx             # Header navigation bar
│       ├── Topbar.tsx             # Top resource & turn ticker
│       ├── Sidebar.tsx            # Full-featured 13-category command drawer
│       ├── Footer.tsx             # Status bar & system info
│       └── views/
│           ├── OverviewView.tsx           # Imperial dashboard & quick actions
│           ├── ArmoryView.tsx             # Weapons, armors & repair depot
│           ├── CombatView.tsx             # Fleet combat simulator & raid log
│           ├── TurnSystemView.tsx         # Turn processor & production calculator
│           ├── PlanetaryInvasionView.tsx  # Ground warfare & sector bombardment
│           ├── CronSystemView.tsx         # Automated cron scheduler & terminal
│           ├── StargateNetworkView.tsx    # Stargate DHD dialer & iris defense
│           ├── StoreBattlePassView.tsx    # Store & seasonal battle pass
│           ├── AccountProfilesView.tsx    # Multi-commander slot management
│           ├── MMORPGOgameView.tsx        # Galaxy map, ACS & missile silos
│           ├── HyperspaceView.tsx         # Titan flagships & hyperspace jumps
│           └── StellarEncyclopediaView.tsx# Planetary classes A-Z & size 1-9
```

---

## 📜 License & Acknowledgments

Universe Civilization: Empire at Wars is created as an educational game simulator inspired by the lore and mechanics of classic browser MMOs, *Stargate SG-1 / Atlantis*, *Game*, and *EVE Online*.
