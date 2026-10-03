# Universe Civilization: Empire at Wars — API, State & Data Architecture Specification

> **Document Version**: 3.2.0  
> **Schema Type**: TypeScript Interface & Data Storage Contracts

---

## 1. LocalStorage Persistence Contracts

All game state is stored locally within the user's browser, enabling instant offline persistence and session continuity.

| Storage Key | Type / Interface | Description |
|---|---|---|
| `uc_active_profile` | `PlayerProfile` | Current commander persona, race, government, scores, DEFCON |
| `uc_player_resources` | `PlayerResources` | Currencies (Naquadah, Vault, Metal, Crystal, Deuterium, Energy, Dark Matter) |
| `uc_planets` | `PlanetColony[]` | All colonized worlds, tier levels, maintenance, hazards, life support |
| `uc_active_selected_planet_id` | `string` | ID of the currently focused planetary colony |
| `uc_mothership_titan` | `MothershipTitan` | Flagship specs, power allocation, weapons fitting, sorties |
| `uc_stargate_nodes` | `StargateNetworkNode[]` | Stargates across all colonies, iris state, dialed addresses |
| `uc_crontab_config` | `CronJobConfig[]` | Background cron scheduler rules and execution timers |
| `uc_battle_pass_state` | `BattlePassState` | Free & VIP progression tier, daily quest claims, XP |

---

## 2. Core Domain Data Contracts

### 2.1 Player Profile & Resources

```typescript
export interface PlayerProfile {
  id: string;
  name: string;
  race: 'asgard' | 'goauld' | 'replicator' | 'tauri' | 'tollan';
  government: 'junta' | 'technocracy' | 'feudal' | 'republic' | 'hive';
  rank: number;
  defconLevel: 0 | 1 | 2 | 3 | 4;
  overallScore: number;
  militaryScore: number;
  economyScore: number;
  researchScore: number;
  createdTimestamp: number;
}

export interface PlayerResources {
  naquadah: number;
  bankedNaquadah: number;
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  darkMatter: number;
  untrainedUnits: number;
  miners: number;
  lifers: number;
  attackTurns: number;
}
```

### 2.2 Planetary Colony Schema

```typescript
export interface PlanetColony {
  id: string;
  name: string;
  coordinate: string; // e.g. "[1:240:8]"
  biome: 'Terrestrial' | 'Desert' | 'Volcanic' | 'Oceanic' | 'Cryo-Glacial' | 'Plasma Gas';
  level: number;
  incomeBonus: number;
  defenseBonus: number;
  maintenanceCost?: number;
  moonName?: string;
  jumpGateLevel: number;
  isHomeworld?: boolean;
  specialization?: 'mining' | 'industrial' | 'research' | 'fortress' | 'trade';
  taxPolicy?: 'subsidized' | 'balanced' | 'extractive';
  fieldsUsed?: number;
  fieldsMax?: number;
  lifeSupport?: PlanetaryLifeSupport;
  hazards?: PlanetaryHazard[];
}
```

### 2.3 Colony Maintenance & Fiscal Analysis

```typescript
export interface ColonyMaintenanceBreakdown {
  baseCost: number;
  levelMultiplier: number;
  homeworldDiscount: number;
  logisticalStrain: number;
  specializationModifier: number;
  taxPolicyModifier: number;
  totalMaintenanceCost: number;
  grossIncome: number;
  netIncome: number;
  profitMarginPercent: number;
  isDeficit: boolean;
  breakdownCategories: {
    administration: number; // 35%
    logistics: number;      // 25%
    lifeSupport: number;    // 20%
    security: number;       // 20%
  };
}

export interface EmpireColonialSummary {
  totalColonies: number;
  totalColonyLevels: number;
  totalGrossIncome: number;
  totalMaintenanceCost: number;
  netColonialIncome: number;
  averageMaintenancePerLevel: number;
  expansionEfficiencyRating: 'Optimal' | 'Sustainable' | 'Strained' | 'Over-Extended';
  expansionEfficiencyPercent: number;
  expansionRecommendation: string;
}
```

---

## 3. Web Audio Synthesis Triggers (`src/sound.ts`)

The game features an internal Web Audio API sound synthesizer producing procedural retro-futuristic sound effects without external MP3 dependencies:

| Sound Key | Frequency / Waveform Profile | Trigger Event |
|---|---|---|
| `click` | 800Hz Triangle Short Pulse | Standard UI button clicks |
| `confirm` | 440Hz -> 880Hz Sine Ascending | Successful upgrade, purchase, or training |
| `warning` | 220Hz Sawtooth Dual Pulse | Insufficient resources or invalid action |
| `coin` | 1200Hz -> 1800Hz Sine Chime | Turn income collection or bank deposit |
| `combat` | 100Hz Noise Burst + Square Wave | Combat engagement start |
| `turn` | Harmonic major chord triad | Manual or cron turn step execution |
| `gate_chevron` | 520Hz Resonant Metallic Clank | Stargate chevron lock |
| `gate_kawoosh` | Low-frequency white noise woosh | Subspace wormhole event horizon open |
| `iris_close` | Mechanical servo sweep | Titanium Iris closure |
