import {
  BankVaultUpgradeState,
  ResourceStorageUpgrades,
  MasterUpgradesState,
  ImperialUpgradeDefinition,
  PlayerResources,
} from '../types';

export const DEFAULT_BANK_VAULT_STATE: BankVaultUpgradeState = {
  vaultLevel: 2,
  titaniumReinforcementLevel: 2,
  quantumEncryptionLevel: 1,
  subspaceShuntLevel: 1,
  stargateTerminalLevel: 1,
  compoundInterestLevel: 1,
  autoSweepEnabled: true,
  autoSweepThreshold: 100000,
  reinvestRatePercent: 100,
  activeLoan: null,
  totalInterestEarned: 14500,
  totalSweepsExecuted: 4,
  transactions: [
    {
      id: 'tx-init-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'deposit',
      amount: 50000,
      note: 'Initial Planetary Vault Seed Deposit',
      resultingBalance: 50000,
    },
    {
      id: 'tx-init-2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'interest',
      amount: 3500,
      note: 'Turn 14 Compounding Interest Yield (7%)',
      resultingBalance: 53500,
    },
  ],
};

export const DEFAULT_RESOURCE_STORAGE_STATE: ResourceStorageUpgrades = {
  metalSiloLevel: 2,
  crystalVaultLevel: 2,
  deuteriumTankLevel: 2,
  energyCapacitorLevel: 2,
  foodGranaryLevel: 2,
  waterCisternLevel: 2,
  darkMatterStasisLevel: 1,
  autoCompressOverflow: true,
  compressionTier: 1,
};

export const DEFAULT_MASTER_UPGRADES_STATE: MasterUpgradesState = {
  bank: DEFAULT_BANK_VAULT_STATE,
  storage: DEFAULT_RESOURCE_STORAGE_STATE,
  roboticAssemblyLevel: 2,
  naniteFabricatorLevel: 1,
  deepMantleCoreLevel: 2,
  atmosphericTerraformerLevel: 1,
  planetaryShieldOverchargeLevel: 2,
  pointDefenseRadarLevel: 2,
  orbitalDefenseStationLevel: 1,
  antiBombardmentBunkerLevel: 2,
  subspaceHyperlaneLevel: 2,
  autoResourceBalancerLevel: 1,
  quantumSmugglingBafflerLevel: 1,
  synchrotronColliderLevel: 2,
  neuralTrainingOverclockerLevel: 2,
  exoticMateriaTransmuterLevel: 1,
  workerAugmentationLevel: 2,
  automatedMiningDronesLevel: 2,
  hydrologicalPurityGridLevel: 2,
};

// ==========================================
// BANK CALCULATIONS
// ==========================================

export function calculateBankCapacity(
  bankState: BankVaultUpgradeState,
  naturalIncome: number
): number {
  const baseFromIncome = Math.max(350000, naturalIncome * 72);
  const tierMultiplier = 1 + bankState.vaultLevel * 0.45;
  const titaniumBonus = bankState.titaniumReinforcementLevel * 500000;
  const stargateMultiplier = 1 + bankState.stargateTerminalLevel * 0.15;
  return Math.round((baseFromIncome * tierMultiplier + titaniumBonus) * stargateMultiplier);
}

export function calculateBankInterestRate(
  bankState: BankVaultUpgradeState,
  raceModifier: number = 1.0
): number {
  // Calibrated turn interest rate: Base 0.8% + 0.15% per vault tier + 0.10% per quantum encryption level + 0.08% per compound tier (max 3.5% / turn)
  const baseRate =
    0.008 +
    bankState.vaultLevel * 0.0015 +
    bankState.quantumEncryptionLevel * 0.001 +
    bankState.compoundInterestLevel * 0.0008;
  return Math.min(0.035, baseRate * raceModifier);
}

export function calculateMaxLoanAvailable(
  bankState: BankVaultUpgradeState,
  bankedNaquadah: number,
  naturalIncome: number
): number {
  const creditFactor = 1 + bankState.stargateTerminalLevel * 0.25;
  const capacityCeiling = calculateBankCapacity(bankState, naturalIncome);
  const collateralValue = Math.max(50000, bankedNaquadah * 0.65);
  const incomeProjection = naturalIncome * 24;
  return Math.min(capacityCeiling * 0.8, Math.round((collateralValue + incomeProjection) * creditFactor));
}

export function calculatePlunderProtectionPercent(bankState: BankVaultUpgradeState): number {
  // Base 100% of banked naquadah is safe. Subspace shunt adds protection to 20-60% of unbanked liquid reserves.
  const liquidShieldPct = Math.min(60, bankState.subspaceShuntLevel * 12);
  return liquidShieldPct;
}

// ==========================================
// STORAGE CAPACITY & PRODUCTION BONUSES
// ==========================================

export function getBaseResourceCapacity(resourceType: string): number {
  switch (resourceType) {
    case 'metal':
      return 200000;
    case 'crystal':
      return 150000;
    case 'deuterium':
      return 100000;
    case 'energy':
      return 1000;
    case 'food':
      return 250000;
    case 'water':
      return 300000;
    case 'darkMatter':
      return 1000;
    default:
      return 100000;
  }
}

export function calculateMaxStorageCapacity(
  resourceType: 'metal' | 'crystal' | 'deuterium' | 'energy' | 'food' | 'water' | 'darkMatter',
  storage: ResourceStorageUpgrades
): number {
  let level = 1;
  switch (resourceType) {
    case 'metal':
      level = storage.metalSiloLevel;
      break;
    case 'crystal':
      level = storage.crystalVaultLevel;
      break;
    case 'deuterium':
      level = storage.deuteriumTankLevel;
      break;
    case 'energy':
      level = storage.energyCapacitorLevel;
      break;
    case 'food':
      level = storage.foodGranaryLevel;
      break;
    case 'water':
      level = storage.waterCisternLevel;
      break;
    case 'darkMatter':
      level = storage.darkMatterStasisLevel;
      break;
  }

  const base = getBaseResourceCapacity(resourceType);
  if (resourceType === 'energy') {
    return Math.round(base * Math.pow(1.65, level - 1) + (level - 1) * 250);
  }
  if (resourceType === 'darkMatter') {
    return Math.round(base * Math.pow(1.8, level - 1) + (level - 1) * 500);
  }
  return Math.round(base * Math.pow(1.85, level - 1) + (level - 1) * 100000);
}

export function calculateStorageEfficiencyBonus(
  resourceType: 'metal' | 'crystal' | 'deuterium' | 'energy' | 'food' | 'water' | 'darkMatter',
  storage: ResourceStorageUpgrades
): number {
  let level = 1;
  switch (resourceType) {
    case 'metal':
      level = storage.metalSiloLevel;
      break;
    case 'crystal':
      level = storage.crystalVaultLevel;
      break;
    case 'deuterium':
      level = storage.deuteriumTankLevel;
      break;
    case 'energy':
      level = storage.energyCapacitorLevel;
      break;
    case 'food':
      level = storage.foodGranaryLevel;
      break;
    case 'water':
      level = storage.waterCisternLevel;
      break;
    case 'darkMatter':
      level = storage.darkMatterStasisLevel;
      break;
  }
  // Each storage level provides +3.5% production or retention efficiency
  return (level - 1) * 3.5;
}

export function calculateStorageUpgradeCost(
  resourceType: 'metal' | 'crystal' | 'deuterium' | 'energy' | 'food' | 'water' | 'darkMatter',
  currentLevel: number
): { metal: number; crystal: number; deuterium: number; naquadah: number; energy: number } {
  const growth = Math.pow(1.75, currentLevel);
  switch (resourceType) {
    case 'metal':
      return {
        metal: Math.round(15000 * growth),
        crystal: Math.round(8000 * growth),
        deuterium: Math.round(2000 * growth),
        naquadah: Math.round(10000 * growth),
        energy: Math.round(15 * currentLevel),
      };
    case 'crystal':
      return {
        metal: Math.round(12000 * growth),
        crystal: Math.round(16000 * growth),
        deuterium: Math.round(4000 * growth),
        naquadah: Math.round(12000 * growth),
        energy: Math.round(20 * currentLevel),
      };
    case 'deuterium':
      return {
        metal: Math.round(18000 * growth),
        crystal: Math.round(14000 * growth),
        deuterium: Math.round(10000 * growth),
        naquadah: Math.round(15000 * growth),
        energy: Math.round(25 * currentLevel),
      };
    case 'energy':
      return {
        metal: Math.round(20000 * growth),
        crystal: Math.round(25000 * growth),
        deuterium: Math.round(12000 * growth),
        naquadah: Math.round(18000 * growth),
        energy: 0,
      };
    case 'food':
      return {
        metal: Math.round(10000 * growth),
        crystal: Math.round(6000 * growth),
        deuterium: Math.round(1500 * growth),
        naquadah: Math.round(8000 * growth),
        energy: Math.round(10 * currentLevel),
      };
    case 'water':
      return {
        metal: Math.round(11000 * growth),
        crystal: Math.round(7000 * growth),
        deuterium: Math.round(2000 * growth),
        naquadah: Math.round(9000 * growth),
        energy: Math.round(12 * currentLevel),
      };
    case 'darkMatter':
      return {
        metal: Math.round(50000 * growth),
        crystal: Math.round(65000 * growth),
        deuterium: Math.round(40000 * growth),
        naquadah: Math.round(60000 * growth),
        energy: Math.round(100 * currentLevel),
      };
  }
}

// ==========================================
// MASTER IMPERIAL UPGRADE DEFINITIONS
// ==========================================

export const IMPERIAL_UPGRADES_CATALOG: ImperialUpgradeDefinition[] = [
  // --- BANK & FINANCIAL CITADEL ---
  {
    id: 'upg-bank-vault-core',
    key: 'vaultLevel',
    name: 'Sub-Surface Imperial Vault Citadel',
    category: 'banking',
    description: 'Ultra-deep reinforced bedrock fortress protected by heavy neutronium blast gates for vast financial reserves.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 45000, crystal: 30000, deuterium: 10000, naquadah: 25000 },
    costGrowth: 1.65,
    icon: '🏛️',
    currentBenefit: '+90% Protected Storage Capacity',
    nextBenefit: '+135% Protected Storage Capacity & +1.5% Interest',
    multiplierPerLevel: 45,
    unit: '% Capacity',
    tier: 1,
  },
  {
    id: 'upg-bank-titanium-hull',
    key: 'titaniumReinforcementLevel',
    name: 'Sub-Crust Titanium Expansion Silos',
    category: 'banking',
    description: 'Excavated cavernous pressure chambers lined with trinium and titanium alloys for storing physical Naquadah bullion.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 60000, crystal: 25000, deuterium: 8000, naquadah: 35000 },
    costGrowth: 1.6,
    icon: '🛡️',
    currentBenefit: '+1,000,000 Flat NQ Capacity',
    nextBenefit: '+1,500,000 Flat NQ Capacity',
    multiplierPerLevel: 500000,
    unit: 'NQ Flat Cap',
    tier: 1,
  },
  {
    id: 'upg-bank-quantum-encryption',
    key: 'quantumEncryptionLevel',
    name: 'Quantum-Encrypted Ledger Lattice',
    category: 'banking',
    description: 'Entangled quantum state registers ensuring uncrackable financial security and high-frequency liquidity dividends.',
    level: 1,
    maxLevel: 20,
    baseCost: { metal: 30000, crystal: 55000, deuterium: 20000, naquadah: 40000 },
    costGrowth: 1.75,
    icon: '🔐',
    currentBenefit: '+1.0% Compounding Interest Yield per Turn',
    nextBenefit: '+2.0% Compounding Interest Yield per Turn',
    multiplierPerLevel: 1.0,
    unit: '% Interest',
    tier: 2,
  },
  {
    id: 'upg-bank-subspace-shunt',
    key: 'subspaceShuntLevel',
    name: 'Subspace Shunting & Decoy Vaults',
    category: 'banking',
    description: 'Phases surplus unbanked liquid Naquadah into subspace dimensions during enemy orbital bombardments and raids.',
    level: 1,
    maxLevel: 15,
    baseCost: { metal: 40000, crystal: 60000, deuterium: 35000, naquadah: 50000 },
    costGrowth: 1.8,
    icon: '🌌',
    currentBenefit: '+12% Liquid Reserves Raid Shielding',
    nextBenefit: '+24% Liquid Reserves Raid Shielding',
    multiplierPerLevel: 12,
    unit: '% Raid Shield',
    tier: 2,
  },
  {
    id: 'upg-bank-stargate-network',
    key: 'stargateTerminalLevel',
    name: 'Stargate Interstellar Banking Terminals',
    category: 'banking',
    description: 'Instantaneous planetary cross-wire routing via wormhole event horizons with zero transaction tariffs.',
    level: 1,
    maxLevel: 10,
    baseCost: { metal: 50000, crystal: 75000, deuterium: 45000, naquadah: 65000 },
    costGrowth: 1.85,
    icon: '🌀',
    currentBenefit: '+15% Global Cap Multiplier & +25% Max Loan Line',
    nextBenefit: '+30% Global Cap Multiplier & +50% Max Loan Line',
    multiplierPerLevel: 15,
    unit: '% Global Mult',
    tier: 3,
  },

  // --- UNIVERSAL RESOURCE STORAGE FACILITIES ---
  {
    id: 'upg-storage-metal-silo',
    key: 'metalSiloLevel',
    name: 'Heavy Metal Ore Silo & Smelting Depot',
    category: 'storage',
    description: 'Automated blast furnaces and magnetic storage silos expanding structural metal storage and ore throughput.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 15000, crystal: 8000, deuterium: 2000, naquadah: 10000 },
    costGrowth: 1.75,
    icon: '🏗️',
    currentBenefit: '370,000 Metal Cap · +3.5% Mine Efficiency',
    nextBenefit: '685,000 Metal Cap · +7.0% Mine Efficiency',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 1,
  },
  {
    id: 'upg-storage-crystal-vault',
    key: 'crystalVaultLevel',
    name: 'Crystal Matrix Vault & Laser Refractor',
    category: 'storage',
    description: 'Resonance-free vacuum chambers preserving brittle energetic crystalline lattice structures without degradation.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 12000, crystal: 16000, deuterium: 4000, naquadah: 12000 },
    costGrowth: 1.75,
    icon: '💎',
    currentBenefit: '277,500 Crystal Cap · +3.5% Synth Efficiency',
    nextBenefit: '513,000 Crystal Cap · +7.0% Synth Efficiency',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 1,
  },
  {
    id: 'upg-storage-deuterium-tank',
    key: 'deuteriumTankLevel',
    name: 'Deuterium Cryo-Spheres & Magnetic Bottles',
    category: 'storage',
    description: 'Supercooled zero-boil-off cryo vessels storing heavy hydrogen isotopes for fleet propulsion and fusion reactors.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 18000, crystal: 14000, deuterium: 10000, naquadah: 15000 },
    costGrowth: 1.75,
    icon: '🧪',
    currentBenefit: '185,000 Deut Cap · -2% Fleet Fuel Use',
    nextBenefit: '342,000 Deut Cap · -4% Fleet Fuel Use',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 1,
  },
  {
    id: 'upg-storage-energy-capacitor',
    key: 'energyCapacitorLevel',
    name: 'Supercapacitor Battery Banks & Antimatter Cells',
    category: 'storage',
    description: 'High-density toroidal capacitor rings capable of discharging massive megawatt surges to planetary defense grids.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 20000, crystal: 25000, deuterium: 12000, naquadah: 18000 },
    costGrowth: 1.75,
    icon: '⚡',
    currentBenefit: '1,900 Energy Max MW · +4% Grid Stability',
    nextBenefit: '3,380 Energy Max MW · +8% Grid Stability',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 1,
  },
  {
    id: 'upg-storage-food-granary',
    key: 'foodGranaryLevel',
    name: 'Automated Hydroponic Silos & Stasis Granaries',
    category: 'storage',
    description: 'Climate-controlled nutrient storage units protecting agricultural reserves against blight and seasonal shortages.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 10000, crystal: 6000, deuterium: 1500, naquadah: 8000 },
    costGrowth: 1.7,
    icon: '🌾',
    currentBenefit: '462,500 Food Cap · 0% Spoilage',
    nextBenefit: '855,000 Food Cap · +5% Citizen Growth',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 1,
  },
  {
    id: 'upg-storage-water-cistern',
    key: 'waterCisternLevel',
    name: 'Deep Aquifer Cisterns & Geothermal Reservoirs',
    category: 'storage',
    description: 'Pressurized subterranean water holding tanks safeguarding purified potable water against drought and radiation.',
    level: 2,
    maxLevel: 30,
    baseCost: { metal: 11000, crystal: 7000, deuterium: 2000, naquadah: 9000 },
    costGrowth: 1.7,
    icon: '💧',
    currentBenefit: '555,000 Water Cap · -10% Drought Risk',
    nextBenefit: '1,027,000 Water Cap · -20% Drought Risk',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 1,
  },
  {
    id: 'upg-storage-dark-matter',
    key: 'darkMatterStasisLevel',
    name: 'Dark Matter Tachyon Stasis Chamber',
    category: 'storage',
    description: 'Gravitational singularity traps containing exotic non-baryonic matter for dimensional jump drives.',
    level: 1,
    maxLevel: 20,
    baseCost: { metal: 50000, crystal: 65000, deuterium: 40000, naquadah: 60000 },
    costGrowth: 1.9,
    icon: '🔮',
    currentBenefit: '1,000 Dark Matter Cap · +1 DM/turn dividend',
    nextBenefit: '2,300 Dark Matter Cap · +2 DM/turn dividend',
    multiplierPerLevel: 1,
    unit: 'Tier',
    tier: 3,
  },

  // --- INDUSTRIAL & PLANETARY FACILITIES ---
  {
    id: 'upg-ind-robotic-assembly',
    key: 'roboticAssemblyLevel',
    name: 'Robotic Mega-Gantry Assembly Lines',
    category: 'industrial',
    description: 'Heavy hydraulic crawler cranes and autonomous welding swarms accelerating all planetary building projects.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 35000, crystal: 20000, deuterium: 8000, naquadah: 18000 },
    costGrowth: 1.6,
    icon: '🤖',
    currentBenefit: '+16% Global Facility Construction Speed',
    nextBenefit: '+24% Global Facility Construction Speed',
    multiplierPerLevel: 8,
    unit: '% Speed',
    tier: 1,
  },
  {
    id: 'upg-ind-nanite-fabricator',
    key: 'naniteFabricatorLevel',
    name: 'Nanite Matter-Assembler Swarms',
    category: 'industrial',
    description: 'Self-replicating molecular assemblers that print starship hulls, fortifications, and components at near-light speed.',
    level: 1,
    maxLevel: 15,
    baseCost: { metal: 80000, crystal: 120000, deuterium: 60000, naquadah: 90000 },
    costGrowth: 2.0,
    icon: '🧬',
    currentBenefit: '-25% Construction & Ship Production Time',
    nextBenefit: '-50% Construction & Ship Production Time',
    multiplierPerLevel: 25,
    unit: '% Reduction',
    tier: 3,
  },
  {
    id: 'upg-ind-deep-mantle',
    key: 'deepMantleCoreLevel',
    name: 'Deep Mantle Geothermal Core Taps',
    category: 'industrial',
    description: 'Tectonic laser shafts tapping superheated planetary magma chambers for continuous clean megawatts and mineral ores.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 40000, crystal: 25000, deuterium: 12000, naquadah: 20000 },
    costGrowth: 1.65,
    icon: '🌋',
    currentBenefit: '+160 MW Base Energy & +8% Base Metal Extraction',
    nextBenefit: '+240 MW Base Energy & +12% Base Metal Extraction',
    multiplierPerLevel: 80,
    unit: 'MW Energy',
    tier: 1,
  },
  {
    id: 'upg-ind-terraformer',
    key: 'atmosphericTerraformerLevel',
    name: 'Atmospheric Terraforming Geo-Arrays',
    category: 'industrial',
    description: 'Atmospheric scrubbers, weather stabilizers, and orbital mirrors transforming barren crust into fertile colonizable territory.',
    level: 1,
    maxLevel: 20,
    baseCost: { metal: 65000, crystal: 80000, deuterium: 45000, naquadah: 50000 },
    costGrowth: 1.8,
    icon: '🌐',
    currentBenefit: '+15 Max Planet Field Slots per Colony',
    nextBenefit: '+30 Max Planet Field Slots per Colony',
    multiplierPerLevel: 15,
    unit: 'Fields',
    tier: 2,
  },

  // --- PLANETARY DEFENSE & SHIELD AMPLIFIERS ---
  {
    id: 'upg-def-shield-overcharge',
    key: 'planetaryShieldOverchargeLevel',
    name: 'Planetary Shield Capacitor Overchargers',
    category: 'defenses',
    description: 'Tachyon harmonic emitters amplifying orbital bubble shields to deflect direct antimatter kinetic bombardment.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 45000, crystal: 60000, deuterium: 25000, naquadah: 30000 },
    costGrowth: 1.7,
    icon: '🛡️',
    currentBenefit: '+20% Planetary Shield Durability & Regeneration',
    nextBenefit: '+30% Planetary Shield Durability & Regeneration',
    multiplierPerLevel: 10,
    unit: '% Durability',
    tier: 2,
  },
  {
    id: 'upg-def-radar-grid',
    key: 'pointDefenseRadarLevel',
    name: 'Point-Defense Phased Radar Networks',
    category: 'defenses',
    description: 'Sub-millisecond tracking telemetry computers synchronizing railgun turrets and missile interceptors against incoming swarms.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 30000, crystal: 45000, deuterium: 15000, naquadah: 20000 },
    costGrowth: 1.65,
    icon: '📡',
    currentBenefit: '+15% Defense Turret Interception & Accuracy',
    nextBenefit: '+22.5% Defense Turret Interception & Accuracy',
    multiplierPerLevel: 7.5,
    unit: '% Accuracy',
    tier: 1,
  },
  {
    id: 'upg-def-orbital-station',
    key: 'orbitalDefenseStationLevel',
    name: 'Heavy Orbital Defense Citadel Platforms',
    category: 'defenses',
    description: 'Armed orbital battle stations mounting spinal Gauss cannons and heavy plasma batteries to deter planetary invasion fleets.',
    level: 1,
    maxLevel: 15,
    baseCost: { metal: 90000, crystal: 75000, deuterium: 40000, naquadah: 55000 },
    costGrowth: 1.85,
    icon: '🛰️',
    currentBenefit: '+15,000 Garrison Defense Rating per Colony',
    nextBenefit: '+30,000 Garrison Defense Rating per Colony',
    multiplierPerLevel: 15000,
    unit: 'Defense Rating',
    tier: 3,
  },
  {
    id: 'upg-def-anti-bombardment',
    key: 'antiBombardmentBunkerLevel',
    name: 'Subterranean Bunker Redoubts',
    category: 'defenses',
    description: 'Deep-hardened military command bunkers shielding military garrisons and civilian workers from orbital kinetic strikes.',
    level: 2,
    maxLevel: 20,
    baseCost: { metal: 50000, crystal: 20000, deuterium: 5000, naquadah: 25000 },
    costGrowth: 1.6,
    icon: '🧱',
    currentBenefit: '-20% Population & Unit Casualties during Raids',
    nextBenefit: '-30% Population & Unit Casualties during Raids',
    multiplierPerLevel: 10,
    unit: '% Casualty Red.',
    tier: 1,
  },

  // --- LOGISTICS, TRANSPORTERS & HYPERLANES ---
  {
    id: 'upg-log-hyperlane',
    key: 'subspaceHyperlaneLevel',
    name: 'Subspace Freight Hyperlane Beacons',
    category: 'logistics',
    description: 'Tuned tachyon relay corridors that slingshot cargo freighters and combat strike wings across star sectors in record time.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 40000, crystal: 50000, deuterium: 30000, naquadah: 35000 },
    costGrowth: 1.7,
    icon: '🚀',
    currentBenefit: '-16% Fleet & Expedition Travel Duration',
    nextBenefit: '-24% Fleet & Expedition Travel Duration',
    multiplierPerLevel: 8,
    unit: '% Speed',
    tier: 2,
  },
  {
    id: 'upg-log-auto-balancer',
    key: 'autoResourceBalancerLevel',
    name: 'Automated Interstellar Resource Conduits',
    category: 'logistics',
    description: 'Autonomous freighter schedules continuously balancing surpluses of food, water, metal, and deuterium to struggling outposts.',
    level: 1,
    maxLevel: 15,
    baseCost: { metal: 35000, crystal: 40000, deuterium: 20000, naquadah: 30000 },
    costGrowth: 1.75,
    icon: '📦',
    currentBenefit: 'Automates Cross-Planet Deficit Rebalancing (-15% Colonial Plunge Risk)',
    nextBenefit: 'Enhanced Freight Priority Routing (-30% Colonial Plunge Risk)',
    multiplierPerLevel: 15,
    unit: '% Relief',
    tier: 2,
  },
  {
    id: 'upg-log-smuggling-baffler',
    key: 'quantumSmugglingBafflerLevel',
    name: 'Quantum Sensor Bafflers & Stealth Hull Coating',
    category: 'logistics',
    description: 'Absorptive cloaking metamaterials masking commercial trade convoys from pirate scanners and enemy covert operations.',
    level: 1,
    maxLevel: 15,
    baseCost: { metal: 25000, crystal: 45000, deuterium: 25000, naquadah: 28000 },
    costGrowth: 1.7,
    icon: '🕶️',
    currentBenefit: '+15% Covert Evasion for All Trade Convoys',
    nextBenefit: '+30% Covert Evasion for All Trade Convoys',
    multiplierPerLevel: 15,
    unit: '% Stealth',
    tier: 1,
  },

  // --- SCIENCE & QUANTUM LAB ACCELERATORS ---
  {
    id: 'upg-sci-synchrotron',
    key: 'synchrotronColliderLevel',
    name: 'Synchrotron Particle Supercolliders',
    category: 'science',
    description: 'Gigawatt-scale particle rings smashing hyper-dense bosons to uncover advanced physics principles and tech breakthroughs.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 45000, crystal: 70000, deuterium: 50000, naquadah: 40000 },
    costGrowth: 1.75,
    icon: '🔬',
    currentBenefit: '+18% Imperial Research Speed & Blueprint ME Boost',
    nextBenefit: '+27% Imperial Research Speed & Blueprint ME Boost',
    multiplierPerLevel: 9,
    unit: '% Research Speed',
    tier: 2,
  },
  {
    id: 'upg-sci-neural-overclocker',
    key: 'neuralTrainingOverclockerLevel',
    name: 'Neural Academy Cybernetic Overclockers',
    category: 'science',
    description: 'Direct cortical memory injectors allowing recruits to master heavy weaponry, espionage tactics, and starship piloting instantly.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 30000, crystal: 40000, deuterium: 20000, naquadah: 35000 },
    costGrowth: 1.65,
    icon: '🧠',
    currentBenefit: '+20% Military & Spy Training Speed',
    nextBenefit: '+30% Military & Spy Training Speed',
    multiplierPerLevel: 10,
    unit: '% Training Speed',
    tier: 1,
  },
  {
    id: 'upg-sci-exotic-transmuter',
    key: 'exoticMateriaTransmuterLevel',
    name: 'Exotic Materia Sub-Atomic Transmuter',
    category: 'science',
    description: 'Molecular restructuring chambers converting abundant base metals into rare crystals and stabilized deuterium isotopes.',
    level: 1,
    maxLevel: 15,
    baseCost: { metal: 75000, crystal: 90000, deuterium: 60000, naquadah: 80000 },
    costGrowth: 1.95,
    icon: '⚗️',
    currentBenefit: '+10% Universal Resource Market Trade Conversion Rates',
    nextBenefit: '+20% Universal Resource Market Trade Conversion Rates',
    multiplierPerLevel: 10,
    unit: '% Trade Yield',
    tier: 3,
  },

  // --- WORKFORCE AUTOMATION & CITIZEN CYBERNETICS ---
  {
    id: 'upg-work-augmentation',
    key: 'workerAugmentationLevel',
    name: 'Exoskeleton Worker Augmentation Suites',
    category: 'workforce',
    description: 'Pneumatic power exosuits distributed across mining sites and hydroponic domes doubling physical labor output.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 28000, crystal: 18000, deuterium: 6000, naquadah: 20000 },
    costGrowth: 1.6,
    icon: '🦾',
    currentBenefit: '+14% Miner & Lifer Income Generation',
    nextBenefit: '+21% Miner & Lifer Income Generation',
    multiplierPerLevel: 7,
    unit: '% Productivity',
    tier: 1,
  },
  {
    id: 'upg-work-mining-drones',
    key: 'automatedMiningDronesLevel',
    name: 'Autonomous Sub-Surface Mining Drones',
    category: 'workforce',
    description: 'Swarm-coordinated AI drilling bots operating deep in toxic subterranean fissures without human supervision.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 32000, crystal: 22000, deuterium: 8000, naquadah: 24000 },
    costGrowth: 1.65,
    icon: '🛸',
    currentBenefit: '+12% Metal & Crystal Mine Extraction Yield',
    nextBenefit: '+18% Metal & Crystal Mine Extraction Yield',
    multiplierPerLevel: 6,
    unit: '% Mine Yield',
    tier: 1,
  },
  {
    id: 'upg-work-purity-grid',
    key: 'hydrologicalPurityGridLevel',
    name: 'Planetary Hydrological & Life Support Grids',
    category: 'workforce',
    description: 'Nano-membrane water filtration and atmospheric recycling ensuring clean potable hydration for all colonies.',
    level: 2,
    maxLevel: 25,
    baseCost: { metal: 25000, crystal: 20000, deuterium: 7000, naquadah: 18000 },
    costGrowth: 1.6,
    icon: '🚰',
    currentBenefit: '+15% Aquifer Purity & +10% Citizen Happiness Index',
    nextBenefit: '+22.5% Aquifer Purity & +15% Citizen Happiness Index',
    multiplierPerLevel: 7.5,
    unit: '% Purity',
    tier: 1,
  },
];

export function calculateUpgradeCost(
  upgrade: ImperialUpgradeDefinition,
  targetLevel: number
): { metal: number; crystal: number; deuterium: number; naquadah: number; energy: number; credits: number } {
  const multiplier = Math.pow(upgrade.costGrowth, targetLevel - 1);
  return {
    metal: Math.round(upgrade.baseCost.metal * multiplier),
    crystal: Math.round(upgrade.baseCost.crystal * multiplier),
    deuterium: Math.round(upgrade.baseCost.deuterium * multiplier),
    naquadah: Math.round(upgrade.baseCost.naquadah * multiplier),
    energy: Math.round((upgrade.baseCost.energy || 0) * targetLevel),
    credits: Math.round((upgrade.baseCost.credits || 0) * targetLevel),
  };
}
