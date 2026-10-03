# Universe Civilization: Empire at Wars — Master Game Design Document (GDD)

> **Document Classification**: Lead Architect & Game Design Specification  
> **Status**: Living Master Specification (v3.2.0)  
> **Genre**: Sci-Fi 4X Space Strategy / MMO Command Center Simulation / Persistent Browser RPG  
> **Target Platform**: Desktop & Mobile Responsive Web (Vite + React + TypeScript + Tailwind CSS)

---

## 1. Executive Summary & Vision

### 1.1 High Concept
**Universe Civilization: Empire at Wars** is an expansive, web-based 4X space strategy game and command center simulator. Drawing mechanical inspiration from classic space MMOs (*OGame*, *Stargate: Universe Civilization*, *EVE Online*, *Master of Orion*), players assume the mantle of an Interstellar Commander to expand a planetary empire, harvest strategic elements, research exotic technologies, construct fleets and planetary defense grids, dial 7-symbol Stargate networks, command titan-class Flagships, and wage tactical interstellar warfare.

### 1.2 Core Pillars
1. **Strategic Economic Depth & Meaningful Trade-offs**: Resource management balancing liquid Naquadah, Vault deposits, Metal, Crystal, Deuterium, Energy, and compounding **Colony Maintenance Costs** per planet tier that prevents reckless, unchecked over-expansion.
2. **Deep Sci-Fi Lore & Faction Identity**: 5 iconic playable races (*Asgard, Goa'uld, Replicator, Tau'ri, Tollan*) and 5 governmental structures offering distinct mechanical advantages and distinct tech/military aesthetics.
3. **Multi-Layered Tactical Warfare**: Ground troop doctrines (Untrained, Miners, Lifers, Assault Infantry, Garrisons, Covert Spies, Super-Units), space armadas (Corvettes to Deathstars), ballistic missile silos, planetary ion defenses, and debris field salvage recyclers.
4. **Flagship Command Center & Stargates**: Fully customizable Titan motherships with 8-subsystem power grids, hardpoint weapons fitting, live carrier strike sorties, Doomsday Lances, and interactive 7-symbol Stargate DHD dialing with protective iris shielding.
5. **Real-time Engine & Turn Progression**: Autonomous 30-minute turn cycles, real-time background cron daemon, interactive crontab management, and instant turn consumption for active players.

---

## 2. Factions, Races & Governments

### 2.1 Playable Races

| Race | Core Racial Specialization | Passive Multiplier | Faction Archetype & Lore |
|---|---|---|---|
| **Asgard** | Teleportation & Advanced Shielding | +25% Technology / Science | Ancient, highly advanced race with supreme energy shields, Ion Pulse arrays, and low research cooldowns. |
| **Goa'uld** | Military Aggression & Sarcophagus | +25% Military Power | Parasitic galactic conquerors utilizing slave-labor mining, aggressive raiding bonuses, and devastating planetary bombardment. |
| **Replicator** | Nanite Swarm Forging | +30% Unit Production Speed | Self-replicating biomechanical swarms capable of rapid fleet construction and automated battlefield debris recycling. |
| **Tau'ri (Earth)** | Covert Recon & Trinium Engineering | +20% Espionage & Stealth | Human ingenuity, adaptable military doctrines, deep-space battlecruisers (BC-304), and high covert defense. |
| **Tollan** | High-Yield Synthesis & Ion Cannons | +25% Natural Income | Isolationist, high-tech society boasting unmatched planetary Ion Defense Grids and trade efficiency. |

### 2.2 Galactic Government Systems

Commanders can align their civilization under one of 5 galactic political doctrines:

```
                  ┌──────────────────────────────┐
                  │    GALACTIC GOVERNMENTS      │
                  └──────────────┬───────────────┘
         ┌──────────────┬────────┼────────┬──────────────┐
         ▼              ▼        ▼        ▼              ▼
   ┌───────────┐  ┌───────────┐ ┌────────┐ ┌───────────┐ ┌───────────┐
   │ MILITARY  │  │TECHNOCRACY│ │ FEUDAL │ │ REPUBLIC  │ │CYBERNETIC │
   │   JUNTA   │  │           │ │ EMPIRE │ │           │ │ HIVE MIND │
   └─────┬─────┘  └─────┬─────┘ └───┬────┘ └─────┬─────┘ └─────┬─────┘
   +15% Attack     +20% Tech     +15% Mine  +20% Trade    +25% Auto
   -10% Pop Grow   -5% Defense   +10% Prod  -10% Speed    Zero Corrupt
```

---

## 3. Economy, Resources & Colony Maintenance System

### 3.1 Resource Matrix

| Resource | Symbol | Primary Acquisition Method | Core Utilization |
|---|---|---|---|
| **Naquadah** | 💠 NQ | Natural turn income, mines, combat plunder | Troop training, weapons procurement, Stargate activation |
| **Banked Naquadah** | 🏦 BNQ | Deposits into Imperial Vault | 100% raid-protected reserve with racial compound interest |
| **Metal** | 🔩 MET | Metal Mines, Debris Recyclers | Hull construction, heavy plating, planetary facilities |
| **Crystal** | 💎 CRY | Crystal Mines, Planetary Synthesizers | Optic matrices, shield emitters, research lab computers |
| **Deuterium** | 💧 DEU | Deuterium Synthesizers, Deep-Space Gas | Sublight fuel, hyperspace warp jumps, Tokamak reactors |
| **Energy** | ⚡ ENG | Solar Plants, Fusion Reactors, Satellites | Powering active infrastructure, planetary shields |
| **Dark Matter** | 🌌 DM | Expeditions, Battle Pass, Galactic Store | Officer recruitment, instant boosts, VIP upgrades |

### 3.2 Natural Income Formulation & Colony Maintenance Model

Natural income is distributed every turn tick according to the authoritative economic formula:

$$\text{Gross Natural Income} = (U \times 20) + ((M + L) \times 80) + \sum_{p \in P} \text{Tribute}(p)$$

$$\text{Total Colonial Maintenance} = \sum_{p \in P} \text{Maintenance}(p, |P|)$$

$$\text{Net Natural Base} = \max\Big(0, \text{Gross Natural Income} - \text{Total Colonial Maintenance}\Big)$$

$$\text{Final Turn Income} = \text{Net Natural Base} \times \text{RaceMultiplier} \times \text{DEFCONMultiplier}$$

Where:
- $U$: Untrained civilian population
- $M$: Industrial Miners
- $L$: Conscripted Lifers
- $P$: Set of all colonized planetary holdings
- $|P|$: Total number of colonized worlds

#### Individual Planetary Maintenance Formula:
$$\text{Maintenance}(p, |P|) = \max\Big(1200, \text{Round}\Big(\big[\text{Level} \times 2500 + \text{Level}^{1.45} \times 850\big] \times H \times S \times D \times T\Big)\Big)$$

Where:
- $H$: Homeworld status multiplier ($0.75$ for Capital, $1.00$ for Colonies)
- $S$: Multi-world logistical strain $= 1.0 + \max(0, (|P| - 2) \times 0.08)$
- $D$: Specialization Directive modifier:
  - Mining Colony: $-10\%$ ($0.90$)
  - Free Trade Commercial: $-15\%$ ($0.85$)
  - Heavy Industrial: $+10\%$ ($1.10$)
  - Advanced Research: $+15\%$ ($1.15$)
  - Fortress Bastion: $+20\%$ ($1.20$)
- $T$: Tax Policy modifier:
  - Extractive Directives: $-15\%$ ($0.85$)
  - Balanced Taxation: $0\%$ ($1.00$)
  - Welfare Subsidies: $+25\%$ ($1.25$)

#### Four Pillars of Colonial Maintenance Overhead:
1. **Civil Administration (35%)**: Municipal courts, colonial registries, public services.
2. **Interstellar Logistics (25%)**: Deep-space supply freighters and hyperlane corridor patrols.
3. **Life Support Sustenance (20%)**: Atmospheric dome seal maintenance, hydroponics, water cycling.
4. **Garrison Security (20%)**: Orbital shield grid energization and planetary defense cadres.

---

## 4. Military Doctrines & 90-Class Unit Roster

### 4.1 Unit Hierarchy

```
                      ┌────────────────────────────┐
                      │    MILITARY UNIT ROSTER    │
                      └─────────────┬──────────────┘
         ┌──────────────┬───────────┼───────────┬──────────────┐
         ▼              ▼           ▼           ▼              ▼
   ┌───────────┐  ┌───────────┐┌───────────┐┌───────────┐┌───────────┐
   │ UNTRAINED │  │ WORKFORCE ││  ASSAULT  ││ DEFENSE   ││  COVERT   │
   │  RECRUITS │  │MINER/LIFER││ INFANTRY  ││ GARRISONS ││ INFILTRATE│
   └───────────┘  └───────────┘└───────────┘└───────────┘└───────────┘
```

### 4.2 Armory, Weapon Tiers & Durability System
- **10 Tiers of Armaments**: Ranging from Kinetic Railguns to Tachyon Singularity Disruptors.
- **Dynamic Weapon Degradation**: Durability decays dynamically across battle rounds.
- **Repair Logistics Depot**: Players spend Naquadah and Metal to restore degraded weapon durability back to 100%.

---

## 5. Technology, Research & EVE Blueprint Manufacturing

### 5.1 Scientific Disciplines
1. **Offense Tech**: Increases kinetic penetration, plasma temperature, and weapon DPS.
2. **Defense Tech**: Hardens hull alloy composites and enhances regenerative deflector shields.
3. **Covert Espionage Tech**: Enhances sensor stealth, counter-probe detection, and intel accuracy.
4. **Anti-Covert Tech**: Scrambles enemy probe telemetry and detects cloaked strike craft.

### 5.2 EVE Online-Style Blueprint Manufacturing
- **Material Efficiency (ME Research)**: Reduces metal/crystal waste by up to 10% per tier.
- **Time Efficiency (TE Research)**: Accelerates manufacturing cycles by up to 20% per tier.

---

## 6. Galaxy Cartography & Solar Grid

- **9 Galactic Sectors**: Each with distinct deep-space phenomena and pirate frequencies.
- **499 Solar Systems per Galaxy**: Structured with solar star types, asteroid belts, and jump corridors.
- **15 Orbital Slots per System**:
  - Slots 1–3: Inner Volcanic & Hot Worlds (High Solar Energy)
  - Slots 4–12: Habitable Zone & Terrestrial Worlds (High Metal/Crystal)
  - Slots 13–15: Outer Cryo & Gas Giants (High Deuterium Yields)

---

## 7. Flagship Command Center & Subsystems

```
                       ┌─────────────────────────┐
                       │    TITAN FLAGSHIP HUD   │
                       └────────────┬────────────┘
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ 8-SUBSYSTEM   │           │ 8-HARDPOINT   │           │ CARRIER WINGS │
│ POWER CORE    │           │ WEAPON RACKS  │           │ & SORTIE OPS  │
└───────────────┘           └───────────────┘           └───────────────┘
```

### 7.1 Subsystems Power Distribution
Commanders dynamically allocate Megawatt (MW) power across:
1. **Bridge Command Deck** (Sensor accuracy & combat tactics)
2. **Tokamak Antimatter Reactor** (Energy generation cap)
3. **Spinal Particle Lance** (Doomsday superweapon discharge)
4. **Phase Deflector Grid** (Damage absorption & phase shift)
5. **Carrier Flight Bays** (Fighter deploy speed & recovery)
6. **Nanite Hull Carapace** (Passive hull regeneration)
7. **Tachyon Sensor Array** (Long-range warp telemetry)
8. **Auxiliary Capacitors** (Instant ability recharge)

---

## 8. Stargate DHD Network & Iris Controls

- **7-Symbol Addressing Protocol**: Dial glyph sequences corresponding to planetary coordinates.
- **Wormhole Event Horizon**: Active 38-minute subspace wormhole connection.
- **Titanium-Trinium Iris Shield**: Deployable mechanical iris to pulverize incoming hostile matter before materialization.

---

## 9. Future Roadmap & Expansion Vectors
- **Phase 4**: Real-time multiplayer WebSocket fleet synchronization.
- **Phase 5**: Interstellar Alliance Federation wars and territory control nodes.
- **Phase 6**: Fully procedural planetary terrain exploration with ground vehicle rovers.
