/**
 * Fabricator Systems: Masterworking & Tempering Engine
 * 
 * Provides end-game structure and blueprint customization:
 * 1. Tempering Forge:
 *    - 5 Tempering Manual Categories with 20 distinct affix recipes
 *    - Roll randomized stats with a 25% chance of rolling "Greater Temper" (+35% to +50% bonus)
 *    - Durability system (5 rolls per blueprint), with Naquadah Restoration Scroll option
 *    - Up to 2 Tempered Affixes per structure (Primary & Secondary)
 * 
 * 2. Masterworking Foundry:
 *    - 12 Progressive Masterworking Ranks
 *    - Each rank provides +5% additive enhancement to all base and tempered statistics
 *    - Milestone Critical Strikes at Rank 4, Rank 8, and Rank 12:
 *      * Rank 4: +25% Critical Strike to one random stat/affix (Tier 1 Cyan Crit)
 *      * Rank 8: +25% Critical Strike to one random stat/affix (Tier 2 Amber Double-Crit)
 *      * Rank 12: +25% Critical Strike to one random stat/affix (Tier 3 Legendary Crimson Triple-Crit)
 *    - Catalyst progression: Obducite Nanites (1-4), Ingolith Crystals (5-8), Neathiron Cores (9-12)
 *    - Masterwork Reset: Allows commanders to re-forge crits for optimal builds
 */

export type TemperCategory =
  | 'Weaponry & Planetary Defense'
  | 'Resource Catalysis & Smelting'
  | 'Energy Grid & Zero-Point'
  | 'Structural Logistics & Compression'
  | 'Civic Empire & Science';

export interface TemperingRecipe {
  id: string;
  name: string;
  category: TemperCategory;
  description: string;
  icon: string;
  applicableSubCategories: string[];
  possibleAffixes: {
    name: string;
    description: string;
    statKey: string;
    minRoll: number;
    maxRoll: number;
    greaterMinRoll: number;
    greaterMaxRoll: number;
    unit: string;
  }[];
}

export interface TemperedAffix {
  recipeId: string;
  affixName: string;
  description: string;
  statKey: string;
  value: number;
  unit: string;
  isGreater: boolean;
  critHits: number; // Count of masterwork crits that struck this affix (0, 1, 2, 3)
}

export interface MasterworkCritRecord {
  rank: 4 | 8 | 12;
  targetName: string;
  statKey: string;
  bonusPct: number; // usually +25%
}

export interface StructureFabricatorEnhancement {
  blueprintId: string;
  blueprintName: string;
  category: string;
  temperDurability: number;
  maxTemperDurability: number;
  temperedAffixes: TemperedAffix[];
  masterworkRank: number; // 0 to 12
  masterworkCrits: MasterworkCritRecord[];
  totalPowerRating: number;
  timesReset: number;
  updatedAt: string;
}

export interface MasterworkCatalystCost {
  rank: number;
  metal: number;
  crystal: number;
  deuterium: number;
  naquadah: number;
  credits: number;
  catalystName: 'Obducite Nanites' | 'Ingolith Crystals' | 'Neathiron Cores';
  catalystAmount: number;
}

// =========================================================================
// 1. TEMPERING MANUALS & RECIPES
// =========================================================================

export const TEMPERING_RECIPES: TemperingRecipe[] = [
  // 1. Weaponry & Planetary Defense
  {
    id: 'temper_weap_plasma',
    name: 'Super-Heated Plasma Injectors',
    category: 'Weaponry & Planetary Defense',
    description: 'Infuses defensive batteries and planetary silos with super-critical magnetic plasma coils.',
    icon: '🔥',
    applicableSubCategories: ['Planetary Defense', 'Orbital Defense', 'Tactical & Shielding', 'Surface Defense'],
    possibleAffixes: [
      {
        name: 'Plasma Discharge Velocity',
        description: 'Accelerates plasma projectile speed and initial salvo cadence.',
        statKey: 'defenseRating',
        minRoll: 15,
        maxRoll: 30,
        greaterMinRoll: 38,
        greaterMaxRoll: 50,
        unit: '%',
      },
      {
        name: 'Kinetic Ablative Coating',
        description: 'Hardens perimeter armor bulkheads against incoming relativistic fire.',
        statKey: 'defenseRating',
        minRoll: 18,
        maxRoll: 35,
        greaterMinRoll: 42,
        greaterMaxRoll: 55,
        unit: '%',
      },
      {
        name: 'Turret Targeting Telemetry',
        description: 'Autonomous AI tracking lock for planetary missile and railgun systems.',
        statKey: 'targetingAccuracy',
        minRoll: 12,
        maxRoll: 25,
        greaterMinRoll: 32,
        greaterMaxRoll: 45,
        unit: '%',
      },
    ],
  },
  {
    id: 'temper_weap_shields',
    name: 'Polarized Shield Modulation',
    category: 'Weaponry & Planetary Defense',
    description: 'Configures multi-layered subspace shielding with self-harmonic wave frequency damping.',
    icon: '🛡️',
    applicableSubCategories: ['Planetary Defense', 'Tactical & Shielding', 'Orbital Defense'],
    possibleAffixes: [
      {
        name: 'Shield Harmonic Deflection',
        description: 'Deflects incoming energy beams and ion discharges before hull impact.',
        statKey: 'defenseRating',
        minRoll: 20,
        maxRoll: 38,
        greaterMinRoll: 45,
        greaterMaxRoll: 60,
        unit: '%',
      },
      {
        name: 'Subspace Bubble Overcharge',
        description: 'Expands the outer radius of planetary dome shields.',
        statKey: 'shieldCapacity',
        minRoll: 15,
        maxRoll: 32,
        greaterMinRoll: 40,
        greaterMaxRoll: 52,
        unit: '%',
      },
    ],
  },

  // 2. Resource Catalysis & Smelting
  {
    id: 'temper_res_deepcore',
    name: 'Tectonic Cavitation Bores',
    category: 'Resource Catalysis & Smelting',
    description: 'Drills ultrasonic resonant bores directly into mantle magma veins to maximize ore flow.',
    icon: '⛏️',
    applicableSubCategories: ['Metal Extraction', 'Crystal Synthesis', 'Deuterium Harvesting', 'Naquadah Refining'],
    possibleAffixes: [
      {
        name: 'Deep-Mantle Titanium Slag Yield',
        description: 'Superheats bedrock to liquify dense titanium veins.',
        statKey: 'productionBonusPct',
        minRoll: 14,
        maxRoll: 30,
        greaterMinRoll: 36,
        greaterMaxRoll: 50,
        unit: '%',
      },
      {
        name: 'Ore Smelting Thermal Efficiency',
        description: 'Recovers purified mineral concentrates with zero oxidation.',
        statKey: 'productionBonusPct',
        minRoll: 12,
        maxRoll: 28,
        greaterMinRoll: 35,
        greaterMaxRoll: 48,
        unit: '%',
      },
      {
        name: 'Excavation Drill Life Extension',
        description: 'Diamond-hardened nanite drill bits eliminate routine operational downtime.',
        statKey: 'productionBonusPct',
        minRoll: 10,
        maxRoll: 25,
        greaterMinRoll: 30,
        greaterMaxRoll: 42,
        unit: '%',
      },
    ],
  },
  {
    id: 'temper_res_naquadah',
    name: 'Naquadah Resonance Catalysts',
    category: 'Resource Catalysis & Smelting',
    description: 'Excites heavy isotope crystalline matrices using low-frequency tachyon pulses.',
    icon: '💎',
    applicableSubCategories: ['Naquadah Refining', 'Crystal Synthesis', 'Advanced Materials'],
    possibleAffixes: [
      {
        name: 'Isotope Super-Enrichment Rate',
        description: 'Boosts refined weapons-grade Naquadah output per turn cycle.',
        statKey: 'productionBonusPct',
        minRoll: 15,
        maxRoll: 35,
        greaterMinRoll: 40,
        greaterMaxRoll: 55,
        unit: '%',
      },
      {
        name: 'Crystalline Lattice Stability',
        description: 'Prevents explosive isotope decay under high-pressure synthesis.',
        statKey: 'productionBonusPct',
        minRoll: 10,
        maxRoll: 26,
        greaterMinRoll: 34,
        greaterMaxRoll: 45,
        unit: '%',
      },
    ],
  },

  // 3. Energy Grid & Zero-Point
  {
    id: 'temper_energy_tokamak',
    name: 'Tokamak Magnetic Confinement',
    category: 'Energy Grid & Zero-Point',
    description: 'Stabilizes billion-degree deuterium fusion arcs using superconducting magnetic rings.',
    icon: '⚡',
    applicableSubCategories: ['Fusion Power', 'Solar Energy', 'Zero-Point Energy', 'Antimatter'],
    possibleAffixes: [
      {
        name: 'Thermonuclear Core Output',
        description: 'Increases net gigawatt power generation delivered into the planetary grid.',
        statKey: 'energyOutput',
        minRoll: 18,
        maxRoll: 36,
        greaterMinRoll: 42,
        greaterMaxRoll: 60,
        unit: '%',
      },
      {
        name: 'Zero-Point Flux Tapping',
        description: 'Extracts vacuum fluctuation micro-currents to supply auxiliary systems.',
        statKey: 'energyOutput',
        minRoll: 15,
        maxRoll: 32,
        greaterMinRoll: 38,
        greaterMaxRoll: 52,
        unit: '%',
      },
      {
        name: 'Superconductor Transmission Bus',
        description: 'Eliminates resistive line loss across continental power distribution grids.',
        statKey: 'energyOutput',
        minRoll: 12,
        maxRoll: 25,
        greaterMinRoll: 30,
        greaterMaxRoll: 44,
        unit: '%',
      },
    ],
  },

  // 4. Structural Logistics & Compression
  {
    id: 'temper_logistics_spatial',
    name: 'Micro-Spatial Field Folding',
    category: 'Structural Logistics & Compression',
    description: 'Compresses physical matter and facility architecture into pocket dimensional folds.',
    icon: '📦',
    applicableSubCategories: ['Raw Resource Storage', 'Strategic Vaults', 'Logistics Hubs', 'Shipyard & Orbital'],
    possibleAffixes: [
      {
        name: 'Dimensional Storage Density',
        description: 'Quadruples effective cargo and bunker warehouse volume.',
        statKey: 'storageCapacity',
        minRoll: 25,
        maxRoll: 50,
        greaterMinRoll: 60,
        greaterMaxRoll: 85,
        unit: '%',
      },
      {
        name: 'Nanite Self-Assembly Acceleration',
        description: 'Pre-fabricates foundation modules to drastically compress turn build times.',
        statKey: 'buildVelocity',
        minRoll: 15,
        maxRoll: 35,
        greaterMinRoll: 45,
        greaterMaxRoll: 65,
        unit: '%',
      },
      {
        name: 'Structural Footprint Optimization',
        description: 'Minimizes surface land displacement for dense industrial clusters.',
        statKey: 'fieldSavings',
        minRoll: 10,
        maxRoll: 25,
        greaterMinRoll: 30,
        greaterMaxRoll: 45,
        unit: '%',
      },
    ],
  },

  // 5. Civic Empire & Science
  {
    id: 'temper_civic_archives',
    name: 'Precursor Neural Interlinks',
    category: 'Civic Empire & Science',
    description: 'Links research laboratories and planetary universities directly into Tollan / Ancient databanks.',
    icon: '🏛️',
    applicableSubCategories: ['Theoretical Physics', 'Applied Engineering', 'Xeno-Biology', 'Administration'],
    possibleAffixes: [
      {
        name: 'Quantum Databank Bandwidth',
        description: 'Speeds up technology breakthrough computation and experimental modeling.',
        statKey: 'researchOutput',
        minRoll: 16,
        maxRoll: 34,
        greaterMinRoll: 42,
        greaterMaxRoll: 58,
        unit: '%',
      },
      {
        name: 'Biosphere Atmospheric Scrubbing',
        description: 'Purifies colonial biomes, accelerating workforce health and population growth.',
        statKey: 'populationGrowth',
        minRoll: 14,
        maxRoll: 30,
        greaterMinRoll: 38,
        greaterMaxRoll: 50,
        unit: '%',
      },
      {
        name: 'Imperial Conclave Administrative Flow',
        description: 'Eliminates colonial tariff friction, generating bonus galactic treasury credits.',
        statKey: 'taxRevenue',
        minRoll: 12,
        maxRoll: 26,
        greaterMinRoll: 34,
        greaterMaxRoll: 46,
        unit: '%',
      },
    ],
  },
];

// =========================================================================
// 2. MASTERWORKING RANKS & CATALYST MATRIX (1 to 12)
// =========================================================================

export const MASTERWORK_RANKS: MasterworkCatalystCost[] = [
  { rank: 1, metal: 25000, crystal: 18000, deuterium: 6000, naquadah: 200, credits: 50000, catalystName: 'Obducite Nanites', catalystAmount: 20 },
  { rank: 2, metal: 45000, crystal: 32000, deuterium: 12000, naquadah: 400, credits: 90000, catalystName: 'Obducite Nanites', catalystAmount: 35 },
  { rank: 3, metal: 80000, crystal: 55000, deuterium: 22000, naquadah: 750, credits: 160000, catalystName: 'Obducite Nanites', catalystAmount: 50 },
  { rank: 4, metal: 140000, crystal: 95000, deuterium: 40000, naquadah: 1500, credits: 280000, catalystName: 'Obducite Nanites', catalystAmount: 80 }, // MILESTONE CRIT #1

  { rank: 5, metal: 240000, crystal: 160000, deuterium: 70000, naquadah: 2800, credits: 480000, catalystName: 'Ingolith Crystals', catalystAmount: 30 },
  { rank: 6, metal: 380000, crystal: 250000, deuterium: 110000, naquadah: 4500, credits: 760000, catalystName: 'Ingolith Crystals', catalystAmount: 50 },
  { rank: 7, metal: 580000, crystal: 380000, deuterium: 170000, naquadah: 7000, credits: 1150000, catalystName: 'Ingolith Crystals', catalystAmount: 75 },
  { rank: 8, metal: 880000, crystal: 580000, deuterium: 260000, naquadah: 11000, credits: 1750000, catalystName: 'Ingolith Crystals', catalystAmount: 110 }, // MILESTONE CRIT #2

  { rank: 9, metal: 1350000, crystal: 880000, deuterium: 400000, naquadah: 17000, credits: 2700000, catalystName: 'Neathiron Cores', catalystAmount: 40 },
  { rank: 10, metal: 2000000, crystal: 1300000, deuterium: 600000, naquadah: 26000, credits: 4000000, catalystName: 'Neathiron Cores', catalystAmount: 65 },
  { rank: 11, metal: 3000000, crystal: 1950000, deuterium: 900000, naquadah: 40000, credits: 6000000, catalystName: 'Neathiron Cores', catalystAmount: 100 },
  { rank: 12, metal: 4500000, crystal: 2900000, deuterium: 1350000, naquadah: 65000, credits: 9000000, catalystName: 'Neathiron Cores', catalystAmount: 150 }, // APEX CRIT #3
];

// =========================================================================
// 3. SEED ENHANCEMENTS FOR INITIAL FABRICATED STRUCTURES
// =========================================================================

export const INITIAL_FABRICATOR_ENHANCEMENTS: Record<string, StructureFabricatorEnhancement> = {
  bp_mine_deepcore: {
    blueprintId: 'bp_mine_deepcore',
    blueprintName: 'Deep-Core Titanium Extractor',
    category: 'Resource Extraction',
    temperDurability: 5,
    maxTemperDurability: 5,
    temperedAffixes: [
      {
        recipeId: 'temper_res_deepcore',
        affixName: 'Deep-Mantle Titanium Slag Yield',
        description: 'Superheats bedrock to liquify dense titanium veins.',
        statKey: 'productionBonusPct',
        value: 28,
        unit: '%',
        isGreater: false,
        critHits: 1, // hit at rank 4
      },
      {
        recipeId: 'temper_logistics_spatial',
        affixName: 'Nanite Self-Assembly Acceleration',
        description: 'Pre-fabricates foundation modules to drastically compress turn build times.',
        statKey: 'buildVelocity',
        value: 48,
        unit: '%',
        isGreater: true,
        critHits: 0,
      },
    ],
    masterworkRank: 4,
    masterworkCrits: [
      {
        rank: 4,
        targetName: 'Deep-Mantle Titanium Slag Yield',
        statKey: 'productionBonusPct',
        bonusPct: 25,
      },
    ],
    totalPowerRating: 1480,
    timesReset: 0,
    updatedAt: 'Cycle 104.2',
  },
  bp_power_fusion_tokamak: {
    blueprintId: 'bp_power_fusion_tokamak',
    blueprintName: 'Deuterium Tokamak Fusion Core',
    category: 'Energy Grid & Zero-Point',
    temperDurability: 4,
    maxTemperDurability: 5,
    temperedAffixes: [
      {
        recipeId: 'temper_energy_tokamak',
        affixName: 'Thermonuclear Core Output',
        description: 'Increases net gigawatt power generation delivered into the planetary grid.',
        statKey: 'energyOutput',
        value: 32,
        unit: '%',
        isGreater: false,
        critHits: 0,
      },
    ],
    masterworkRank: 2,
    masterworkCrits: [],
    totalPowerRating: 980,
    timesReset: 0,
    updatedAt: 'Cycle 104.3',
  },
  bp_defense_ion_turret: {
    blueprintId: 'bp_defense_ion_turret',
    blueprintName: 'Orbital Ion Cannon Turret Battery',
    category: 'Military & Defense',
    temperDurability: 5,
    maxTemperDurability: 5,
    temperedAffixes: [
      {
        recipeId: 'temper_weap_plasma',
        affixName: 'Plasma Discharge Velocity',
        description: 'Accelerates plasma projectile speed and initial salvo cadence.',
        statKey: 'defenseRating',
        value: 44,
        unit: '%',
        isGreater: true,
        critHits: 2, // hit at rank 4 and rank 8
      },
      {
        recipeId: 'temper_weap_shields',
        affixName: 'Shield Harmonic Deflection',
        description: 'Deflects incoming energy beams and ion discharges before hull impact.',
        statKey: 'defenseRating',
        value: 28,
        unit: '%',
        isGreater: false,
        critHits: 0,
      },
    ],
    masterworkRank: 8,
    masterworkCrits: [
      {
        rank: 4,
        targetName: 'Plasma Discharge Velocity',
        statKey: 'defenseRating',
        bonusPct: 25,
      },
      {
        rank: 8,
        targetName: 'Plasma Discharge Velocity',
        statKey: 'defenseRating',
        bonusPct: 25,
      },
    ],
    totalPowerRating: 2850,
    timesReset: 0,
    updatedAt: 'Cycle 104.4',
  },
};

// =========================================================================
// 4. STAT CALCULATION ENGINE
// =========================================================================

export interface EnhancedBlueprintStats {
  masterworkRank: number;
  overallMultiplier: number; // e.g. 1 + (rank * 0.05)
  effectiveStats: Record<string, number>;
  statBreakdowns: {
    label: string;
    baseValue: number;
    temperedBonus: number;
    masterworkBonus: number;
    totalValue: number;
    unit: string;
  }[];
  totalPowerRating: number;
}

/**
 * Calculates effective stats including base, tempered rolls, and masterwork crits
 */
export function calculateEnhancedStructureStats(
  baseStats: Record<string, number | undefined>,
  enhancement?: StructureFabricatorEnhancement
): EnhancedBlueprintStats {
  if (!enhancement) {
    const raw: Record<string, number> = {};
    const breakdowns: EnhancedBlueprintStats['statBreakdowns'] = [];
    Object.entries(baseStats).forEach(([key, val]) => {
      if (typeof val === 'number') {
        raw[key] = val;
        breakdowns.push({
          label: formatStatLabel(key),
          baseValue: val,
          temperedBonus: 0,
          masterworkBonus: 0,
          totalValue: val,
          unit: getStatUnit(key),
        });
      }
    });
    return {
      masterworkRank: 0,
      overallMultiplier: 1.0,
      effectiveStats: raw,
      statBreakdowns: breakdowns,
      totalPowerRating: 500,
    };
  }

  const rank = enhancement.masterworkRank || 0;
  // Each rank adds 5%
  const rankMultiplier = 1 + rank * 0.05;

  const effectiveStats: Record<string, number> = {};
  const breakdowns: EnhancedBlueprintStats['statBreakdowns'] = [];

  // Track all stat keys from both base and tempered
  const allKeys = new Set<string>([
    ...Object.keys(baseStats).filter((k) => typeof baseStats[k] === 'number'),
    ...enhancement.temperedAffixes.map((a) => a.statKey),
  ]);

  let totalPower = 500 + rank * 250;

  allKeys.forEach((key) => {
    const baseVal = (baseStats[key] as number) || 0;
    
    // Sum all tempered affixes for this statKey
    const matchingAffixes = enhancement.temperedAffixes.filter((a) => a.statKey === key);
    let temperedAdditivePct = 0;
    
    matchingAffixes.forEach((affix) => {
      // Calculate crit multiplier on this specific affix
      const affixCritBoost = 1 + affix.critHits * 0.25;
      temperedAdditivePct += affix.value * affixCritBoost;
      totalPower += affix.value * 15 * (affix.isGreater ? 1.5 : 1.0) * affixCritBoost;
    });

    // Check if any crits hit the base stat directly
    const baseCritRecord = enhancement.masterworkCrits.filter(
      (c) => c.statKey === key && !matchingAffixes.some((a) => a.affixName === c.targetName)
    );
    const baseCritMultiplier = 1 + baseCritRecord.length * 0.25;

    // Final value = (Base * baseCritMultiplier + TemperedAdditive) * rankMultiplier
    let calculated = 0;
    if (baseVal > 0) {
      const baseWithCrits = baseVal * baseCritMultiplier;
      const temperedScaled = baseWithCrits * (temperedAdditivePct / 100);
      const subtotal = baseWithCrits + temperedScaled;
      calculated = Math.round(subtotal * rankMultiplier);
      
      const temperedBonusVal = Math.round(temperedScaled);
      const masterworkBonusVal = Math.max(0, calculated - baseVal - temperedBonusVal);

      breakdowns.push({
        label: formatStatLabel(key),
        baseValue: baseVal,
        temperedBonus: temperedBonusVal,
        masterworkBonus: masterworkBonusVal,
        totalValue: calculated,
        unit: getStatUnit(key),
      });
    } else {
      // Direct percentage affix without base (e.g. build velocity, storage compression)
      calculated = Math.round(temperedAdditivePct * rankMultiplier);
      breakdowns.push({
        label: formatStatLabel(key),
        baseValue: 0,
        temperedBonus: Math.round(temperedAdditivePct),
        masterworkBonus: Math.max(0, calculated - Math.round(temperedAdditivePct)),
        totalValue: calculated,
        unit: '%',
      });
    }

    effectiveStats[key] = calculated;
  });

  return {
    masterworkRank: rank,
    overallMultiplier: Number(rankMultiplier.toFixed(2)),
    effectiveStats,
    statBreakdowns: breakdowns,
    totalPowerRating: Math.round(totalPower),
  };
}

export function formatStatLabel(key: string): string {
  switch (key) {
    case 'productionBonusPct':
      return 'Yield & Refining Efficiency';
    case 'defenseRating':
      return 'Planetary Defense Rating';
    case 'energyOutput':
      return 'Power Grid Generation';
    case 'storageCapacity':
      return 'Warehouse Storage Vaults';
    case 'buildVelocity':
      return 'Construction Cycle Acceleration';
    case 'researchOutput':
      return 'Scientific Archive Bandwidth';
    case 'populationGrowth':
      return 'Colonial Habitability Growth';
    case 'fieldSavings':
      return 'Surface Spatial Footprint Reduction';
    case 'taxRevenue':
      return 'Sovereign Treasury Revenue';
    case 'shieldCapacity':
      return 'Subspace Bubble Defense Envelope';
    default:
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
}

export function getStatUnit(key: string): string {
  if (key === 'defenseRating' || key === 'storageCapacity') return ' Pts';
  if (key === 'energyOutput') return ' GW';
  return '%';
}

/**
 * Rolls a randomized tempered affix from a chosen recipe
 */
export function rollTemperedAffix(recipe: TemperingRecipe): TemperedAffix {
  // Select random affix pool entry
  const affixDef = recipe.possibleAffixes[Math.floor(Math.random() * recipe.possibleAffixes.length)];
  
  // 25% chance of rolling a Greater Temper
  const isGreater = Math.random() < 0.25;

  const min = isGreater ? affixDef.greaterMinRoll : affixDef.minRoll;
  const max = isGreater ? affixDef.greaterMaxRoll : affixDef.maxRoll;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    recipeId: recipe.id,
    affixName: affixDef.name,
    description: affixDef.description,
    statKey: affixDef.statKey,
    value,
    unit: affixDef.unit,
    isGreater,
    critHits: 0,
  };
}
