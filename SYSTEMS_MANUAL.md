# Universe Civilization: Empire at Wars — Comprehensive Systems & Operations Manual

> **Document Version**: 3.2.0  
> **Classification**: Imperial Starfleet Command Protocol  
> **Intended Audience**: Game Designers, System Engineers, and Players

---

## 1. Faction Races & Imperial Doctrines

Each commander chooses an allegiance during empire creation. Factions provide passive economic and tactical modifiers:

| Race | Core Racial Bonus | Economic Trait | Military Specialization |
|---|---|---|---|
| **Asgard** | +25% Science / Tech | High energy efficiency, reduced research cooldowns | High-capacity energy shielding, Ion Pulse weapons |
| **Goa'uld** | +25% Military Power | Sarcophagus life extension, high slave-miner output | High troop offensive damage, aggressive raiding bonuses |
| **Replicator** | +30% Unit Production | Nanite recycling of combat debris | Fast troop assembly, relentless swarm attacks |
| **Tau'ri (Earth)** | +20% Covert Espionage | Efficient naquadah refining, balanced budget | Advanced covert stealth, Trinium composite armor |
| **Tollan** | +25% Income Generation | Phase-matter synthesis, peaceful trade | Ion Cannons, planetary defense supremacy |

### Galactic Governments
Governments modify empire output dynamically:
- **Military Junta**: +15% Attack power, -10% civilian growth.
- **Technocracy**: +20% Research speed, -5% defense power.
- **Feudal Empire**: +15% Mining yields, +10% unit production.
- **Republic**: +20% Trade revenue, -10% fleet speed.
- **Cybernetic Hive Mind**: +25% Automation speed, zero corruption.

---

## 2. Resource Economics & Vault Security

### Primary Resources
- **Naquadah**: The primary currency and power mineral used for unit training, weapons, and construction.
- **Metal**: Fundamental construction material for hulls, structural plating, and fortifications.
- **Crystal**: Refined optic matrix required for sensor arrays, research lab circuits, and energy weapons.
- **Deuterium**: Heavy isotope utilized for sublight propulsion, hyperspace jumps, and fusion reactors.
- **Energy**: Produced by Solar Arrays and Fusion Generators to power active buildings and planetary shields.
- **Dark Matter**: Premium exotic substance used to recruit galactic officers, purchase instant boosters, and unlock VIP Battle Pass rewards.

### Imperial Bank & Vault
- Liquid Naquadah held on planets can be plundered in combat raids.
- Depositing Naquadah into the Bank Vault guarantees 100% security against enemy looters.
- Withdrawal and deposit transactions are processed without tax fees.

### DEFCON Alert Scale
- **DEFCON 4 (Peace)**: Maximum civilian industrial output, reduced military readiness.
- **DEFCON 3 (Heightened Vigilance)**: Balanced military and industrial posture.
- **DEFCON 2 (War Footing)**: +15% Defense grid efficiency, alert interceptor patrols.
- **DEFCON 1 (Imminent Incursion)**: Emergency planetary shields engaged, interceptors scrambled.
- **DEFCON 0 (Total War / Martial Law)**: Full combat mobilization, shields overcharged.

---

## 3. Planetary Colony Management & Maintenance Trade-off

### 3.1 Colony Tiers & Upgrades
- Worlds begin at Tier 1 and can be expanded up to Tier 10+.
- Each tier increases Gross Colonial Tribute (+6,500 Naquadah / turn) and Planetary Defense (+12,000 pts).
- However, higher tiers compound logistical upkeep, requiring careful workforce balancing.

### 3.2 Four Pillars of Upkeep
1. **Civil Administration (35%)**: Municipal registries, infrastructure maintenance, public service budgets.
2. **Interstellar Logistics (25%)**: Deep-space freighters, warp corridor security, supply chain maintenance.
3. **Life Support Sustenance (20%)**: Atmospheric scrubbers, biodome pressurization, water cycling systems.
4. **Garrison Security (20%)**: Planetary surface garrisons, orbital shield energizers, automated defense turrets.

### 3.3 Specialization Directives
- **Mining Colony**: -10% Maintenance Cost (local ore availability offsets transport costs).
- **Commercial Free Trade**: -15% Maintenance Cost (private enterprise offsets public expenditures).
- **Industrial Center**: +10% Maintenance Cost (heavy machinery replacement and energy loads).
- **Scientific Research**: +15% Maintenance Cost (supercomputing grids and exotic particle containment).
- **Fortress Bastion**: +20% Maintenance Cost (military stationing and heavy shield energization).

---

## 4. Military Hierarchy & 90-Class Unit Roster

Troops are classified into distinct strategic branches:
1. **Untrained Recruits**: Raw civilian population awaiting assignment.
2. **Miners**: Subterranean extractors generating steady Naquadah revenue per turn.
3. **Lifers**: Conscripted laborers maintaining infrastructure and factories.
4. **Attack Infantry & Strike Troops**: Ground and boarding forces used in offensive operations.
5. **Defense Garrisons**: Entrenched defensive units protecting planetary assets.
6. **Covert Infiltrators & Anti-Spies**: Operatives carrying out reconnaissance and counter-espionage.
7. **Super Units**: Elite biomechanical cyber-warriors and heavy assault avatars with high combat multipliers.

---

## 5. Armory, Weapon Tiers & Repair Logistics

### Weapon Classes & Tiers
- **Kinetic Weaponry**: Railguns, Gauss Cannons, Mass Drivers (Tier 1–10).
- **Energy & Plasma Systems**: Plasma Emitters, Particle Disruptors, Ion Cannons (Tier 1–10).
- **Armor Plating**: Reinforced Titanium, Trinium Weave, Neutronium Composite (Tier 1–10).
- **Deflector Shields**: Monolithic Forcefields, Phase Shields, Hyper-Spatial Barriers (Tier 1–10).

### Durability & Field Repairs
- Every weapon equipped suffers degradation during combat engagements.
- When durability falls below 30%, weapon combat efficiency is degraded by 50%.
- The **Depot & Repair Facility** allows commanders to restore durability back to 100% using raw Naquadah and Metal reserves.

---

## 6. Technology Matrix & EVE Blueprint Manufacturing

### Research Disciplines
- **Offense Technology**: Increases global fleet firepower and troop kinetic penetration.
- **Defense Technology**: Hardens hull alloy composites and enhances regenerative deflector shields.
- **Covert Espionage Tech**: Enhances sensor stealth, counter-probe detection, and intel accuracy.
- **Anti-Covert Tech**: Scrambles enemy probe telemetry and detects cloaked strike craft.

### Blueprint Research Laboratory
- **Material Efficiency (ME)**: Up to Level 10 research reducing raw material consumption for ship construction.
- **Time Efficiency (TE)**: Up to Level 10 research accelerating shipyard construction cycles.

---

## 7. Universe Navigation & OGame-Style Fleet Missions

### Galaxy Map Structure
- 9 Galaxies, each containing 499 Solar Systems, with 15 planetary positions per system.
- Flight distance, fuel consumption (Deuterium), and arrival flight times are computed strictly based on coordinate math:

$$\text{Flight Time} = \text{BaseTime} \times \sqrt{\frac{\text{Distance}}{\text{EngineSpeed}}}$$

### Mission Types
1. **Attack**: Assault enemy colonies to destroy defense fleets and plunder resources.
2. **Transport**: Transfer cargo (Metal, Crystal, Deuterium, Naquadah) between owned worlds.
3. **Deployment**: Relocate fleets permanently to a forward base.
4. **Espionage**: Send reconnaissance probes to gather intelligence on defense structures and resource caches.
5. **Harvest / Recycle**: Collect debris fields generated from orbital space fleet destructions.
6. **Colonization**: Deploy a Colony Ship to an uninhibited planetary coordinate to found a new imperial world.
7. **Expedition**: Launch deep-space exploratory wings into the dark void to uncover lost relics or dark matter.

---

## 8. Titan Flagship Command Center

### Subsystems & Hardpoint Loadout
- 8 Subsystems powering the Flagship core: Command Bridge, Antimatter Tokamak, Particle Lance, Phase Deflectors, Carrier Bays, Nanite Carapace, Tachyon Sensors, and Aux Capacitors.
- 8 Customizable Hardpoint weapon mounts with dynamic DPS and alpha strike ratings.
- Real-time Carrier Strike Wings with timed deployment tickers and bounty reward claims.

---

## 9. Stargate Dialing & Subspace Wormhole Network

- Stargates allow instant matter transmission between any two connected planetary gate addresses.
- 39 Unique Glyphs based on celestial constellations.
- Subspace wormholes remain open for 38 minutes maximum before event horizon collapse.
- Titanium-Trinium Iris can be engaged to destroy any hostile inbound incursions.
