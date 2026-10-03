export type WorkforceBranch =
  | 'frontline'
  | 'orbital_defense'
  | 'naquadah_mining'
  | 'espionage'
  | 'civilian_production'
  | 'government'
  | 'untrained';

export interface WorkforceStats {
  attack: number;
  defense: number;
  miningYield: number; // Naquadah / turn per 100 units
  productionYield: number; // Metal+Crystal / turn per 100 units
  foodYield: number; // Food / turn per 100 units
  waterYield: number; // Water / turn per 100 units
  creditsTaxYield: number; // Credits / turn per 100 units
  foodUpkeep: number; // Food consumed / turn per 100 units
  waterUpkeep: number; // Water consumed / turn per 100 units
  creditsUpkeep: number; // Credits consumed / turn per 100 units
  espionagePower: number;
  counterIntel: number;
  governanceEfficiency: number;
}

export interface WorkforceCost {
  untrainedUnits: number;
  naquadah: number;
  metal: number;
  crystal: number;
  credits: number;
  trainingTurns: number;
}

export interface WorkforceUnit {
  id: string;
  name: string;
  branch: WorkforceBranch;
  jobClass: string;
  jobSubclass: string;
  unitType: string;
  unitSubtype: string;
  rankTitle: string;
  tier: number; // 1 to 5
  lore: string;
  stats: WorkforceStats;
  cost: WorkforceCost;
  requiredAcademyWing: string;
  requiredAcademyLevel: number;
}

export interface AcademyWing {
  id: string;
  name: string;
  branchTarget: WorkforceBranch;
  iconName: string;
  description: string;
  level: number;
  maxLevel: number;
  trainingSpeedBonusPct: number;
  costDiscountPct: number;
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    naquadah: number;
    credits: number;
  };
}

// =========================================================================
// EXPERIENCE & PROMOTION SYSTEM (PERSISTENT ACROSS RECRUIT GENERATIONS)
// =========================================================================

export interface PromotionRank {
  tier: number; // 0 to 5
  name: string;
  romanNumeral: string;
  title: string;
  xpRequired: number;
  attackMult: number; // e.g. 1.0, 1.08, 1.18, 1.30, 1.45, 1.65
  defenseMult: number;
  yieldMult: number;
  upkeepDiscountPct: number; // 0, 5, 10, 15, 20, 28
  specialPerk: string;
  badgeColor: string;
  glowColor: string;
}

export const PROMOTION_RANKS: PromotionRank[] = [
  {
    tier: 0,
    name: 'Trainee Cadre',
    romanNumeral: 'RNK-0',
    title: 'Raw Conscript Recruit',
    xpRequired: 0,
    attackMult: 1.0,
    defenseMult: 1.0,
    yieldMult: 1.0,
    upkeepDiscountPct: 0,
    specialPerk: 'Standard Imperial Baseline',
    badgeColor: 'border-neutral-500 text-neutral-400 bg-neutral-900',
    glowColor: 'rgba(120, 120, 120, 0.2)',
  },
  {
    tier: 1,
    name: 'Imperial Regular',
    romanNumeral: 'RNK-I',
    title: 'Disciplined Regular',
    xpRequired: 100,
    attackMult: 1.08,
    defenseMult: 1.08,
    yieldMult: 1.06,
    upkeepDiscountPct: 5,
    specialPerk: 'Formation Drills: +8% Combat Efficiency, -5% Upkeep',
    badgeColor: 'border-emerald-500 text-emerald-400 bg-emerald-950/80',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  {
    tier: 2,
    name: 'Hardened Veteran',
    romanNumeral: 'RNK-II',
    title: 'Combat Veteran',
    xpRequired: 300,
    attackMult: 1.18,
    defenseMult: 1.18,
    yieldMult: 1.14,
    upkeepDiscountPct: 10,
    specialPerk: 'Battlefield Tenacity: Unlocks Selectable Combat Doctrine',
    badgeColor: 'border-cyan-500 text-cyan-300 bg-cyan-950/80',
    glowColor: 'rgba(6, 182, 212, 0.25)',
  },
  {
    tier: 3,
    name: 'Elite Specialist',
    romanNumeral: 'RNK-III',
    title: 'Cadre Specialist',
    xpRequired: 750,
    attackMult: 1.30,
    defenseMult: 1.30,
    yieldMult: 1.22,
    upkeepDiscountPct: 15,
    specialPerk: 'Tactical Mastery: +30% Combat Power, -15% Upkeep across all generations',
    badgeColor: 'border-indigo-500 text-indigo-300 bg-indigo-950/80',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
  {
    tier: 4,
    name: 'Master Vanguard',
    romanNumeral: 'RNK-IV',
    title: 'Imperial Master',
    xpRequired: 1600,
    attackMult: 1.45,
    defenseMult: 1.45,
    yieldMult: 1.32,
    upkeepDiscountPct: 20,
    specialPerk: 'Zero-Point Overclocking: +45% Stats & Enhanced Generational Heritage',
    badgeColor: 'border-amber-500 text-amber-300 bg-amber-950/80',
    glowColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    tier: 5,
    name: 'Legendary Paragon',
    romanNumeral: 'RNK-V',
    title: 'Sovereign Paragon',
    xpRequired: 3500,
    attackMult: 1.65,
    defenseMult: 1.65,
    yieldMult: 1.45,
    upkeepDiscountPct: 28,
    specialPerk: 'Paragon Transcendence: +65% Power, +45% Yields, -28% Upkeep permanently',
    badgeColor: 'border-rose-500 text-rose-300 bg-rose-950/80',
    glowColor: 'rgba(244, 63, 94, 0.4)',
  },
];

export interface UnitDoctrine {
  id: string;
  name: string;
  description: string;
  attackMod: number; // percentage
  defenseMod: number;
  yieldMod: number;
  upkeepMod: number;
  espionageMod: number;
  badge: string;
  accentColor: string;
}

export const UNIT_DOCTRINES: UnitDoctrine[] = [
  {
    id: 'balanced_standard',
    name: 'Standard Protocol',
    description: 'Disciplined balanced doctrine without asymmetric trade-offs.',
    attackMod: 0,
    defenseMod: 0,
    yieldMod: 0,
    upkeepMod: 0,
    espionageMod: 0,
    badge: '⚖️ Standard',
    accentColor: 'text-neutral-300',
  },
  {
    id: 'aggressive_assault',
    name: 'Aggressive Assault',
    description: 'Overclocked weapon capacitors favoring relentless offensive shock.',
    attackMod: 15,
    defenseMod: -5,
    yieldMod: 0,
    upkeepMod: 5,
    espionageMod: 0,
    badge: '⚔️ Assault',
    accentColor: 'text-red-400',
  },
  {
    id: 'hardened_bulwark',
    name: 'Fortified Bulwark',
    description: 'Reinforced ballistic shields and turtle posture minimizing casualties.',
    attackMod: -5,
    defenseMod: 20,
    yieldMod: 0,
    upkeepMod: 0,
    espionageMod: 0,
    badge: '🛡️ Bulwark',
    accentColor: 'text-cyan-400',
  },
  {
    id: 'industrial_overdrive',
    name: 'Industrial Overdrive',
    description: 'Forced-shift extraction quotas amplifying resource yields.',
    attackMod: -5,
    defenseMod: -5,
    yieldMod: 25,
    upkeepMod: 8,
    espionageMod: 0,
    badge: '⛏️ Overdrive',
    accentColor: 'text-amber-400',
  },
  {
    id: 'ghost_protocol',
    name: 'Ghost Infiltration',
    description: 'Active optical cloaking and subspace sensor spoofing for black ops.',
    attackMod: 0,
    defenseMod: 0,
    yieldMod: 0,
    upkeepMod: 0,
    espionageMod: 30,
    badge: '👁️ Cloaked',
    accentColor: 'text-purple-400',
  },
  {
    id: 'logistics_optimization',
    name: 'Logistics Optimization',
    description: 'Streamlined nutrient rations and hyper-efficient fuel reclamation.',
    attackMod: -2,
    defenseMod: -2,
    yieldMod: 0,
    upkeepMod: -25,
    espionageMod: 0,
    badge: '📦 Lean Ops',
    accentColor: 'text-emerald-400',
  },
];

export interface UnitExperienceData {
  unitId: string;
  xp: number;
  currentRank: number; // 0 to 5
  highestRankReached: number; // persistent across all recruit generations
  totalCombatBattles: number;
  totalMissionsCompleted: number;
  activeDoctrineId?: string; // selected doctrine specialization
  promotedAt?: string;
}

export interface WorkforceAcademyState {
  unitCounts: Record<string, number>; // unitId -> count
  wingLevels: Record<string, number>; // wingId -> level (1-10)
  autoDraftRate: number; // % of recruits auto-assigned per cycle (0-100)
  autoDraftTargetBranch: WorkforceBranch;
  academyDrillScore: number;
  academyDrillRank: string;
  unitExperience?: Record<string, UnitExperienceData>; // unitId -> XP, rank, doctrine
  totalCombatSimulationsRun?: number;
}

export const INITIAL_ACADEMY_WINGS: AcademyWing[] = [
  {
    id: 'war_college',
    name: 'Imperial War College',
    branchTarget: 'frontline',
    iconName: 'Swords',
    description: 'Trains heavy infantry shock divisions, powered armor legions, and zero-G drop marines.',
    level: 2,
    maxLevel: 10,
    trainingSpeedBonusPct: 15,
    costDiscountPct: 8,
    baseCost: { metal: 25000, crystal: 15000, deuterium: 5000, naquadah: 2000, credits: 10000 },
  },
  {
    id: 'defense_proving',
    name: 'Citadel Proving Grounds',
    branchTarget: 'orbital_defense',
    iconName: 'Shield',
    description: 'Drills planetary shield technicians, flak battery crews, and fortress aegis sentinels.',
    level: 2,
    maxLevel: 10,
    trainingSpeedBonusPct: 12,
    costDiscountPct: 6,
    baseCost: { metal: 28000, crystal: 14000, deuterium: 6000, naquadah: 2500, credits: 12000 },
  },
  {
    id: 'geological_institute',
    name: 'Deep-Mantle Institute of Metallurgy',
    branchTarget: 'naquadah_mining',
    iconName: 'Pickaxe',
    description: 'Prepares borehole extractors, tectonic stabilizers, and liquid naquadah refiners.',
    level: 3,
    maxLevel: 10,
    trainingSpeedBonusPct: 20,
    costDiscountPct: 10,
    baseCost: { metal: 20000, crystal: 20000, deuterium: 4000, naquadah: 4000, credits: 15000 },
  },
  {
    id: 'shadow_division',
    name: 'Shadow Intelligence Black Site',
    branchTarget: 'espionage',
    iconName: 'Eye',
    description: 'Specializes covert spies, counter-intel agents, cyberwarfare phreaks, and infiltrators.',
    level: 2,
    maxLevel: 10,
    trainingSpeedBonusPct: 10,
    costDiscountPct: 5,
    baseCost: { metal: 15000, crystal: 25000, deuterium: 8000, naquadah: 5000, credits: 25000 },
  },
  {
    id: 'polytech_guild',
    name: 'Colonial Polytech & Agronomy Guild',
    branchTarget: 'civilian_production',
    iconName: 'Factory',
    description: 'Educates biosphere agronomists, aquifer hydrologists, and nanite forge engineers.',
    level: 3,
    maxLevel: 10,
    trainingSpeedBonusPct: 25,
    costDiscountPct: 12,
    baseCost: { metal: 18000, crystal: 18000, deuterium: 3000, naquadah: 1500, credits: 8000 },
  },
  {
    id: 'imperial_chancellery',
    name: 'High Chancellery Administrative Academy',
    branchTarget: 'government',
    iconName: 'Landmark',
    description: 'Forms colonial tax magistrates, trade arbiters, high inquisitors, and logistics ministers.',
    level: 2,
    maxLevel: 10,
    trainingSpeedBonusPct: 15,
    costDiscountPct: 8,
    baseCost: { metal: 22000, crystal: 16000, deuterium: 5000, naquadah: 3000, credits: 30000 },
  },
];

// Helper to construct units with detailed stats and 90 distinct classes
function createUnit(
  id: string,
  name: string,
  branch: WorkforceBranch,
  jobClass: string,
  jobSubclass: string,
  unitType: string,
  unitSubtype: string,
  rankTitle: string,
  tier: number,
  lore: string,
  stats: Partial<WorkforceStats>,
  cost: Partial<WorkforceCost>,
  wingId: string,
  wingLvl: number
): WorkforceUnit {
  return {
    id,
    name,
    branch,
    jobClass,
    jobSubclass,
    unitType,
    unitSubtype,
    rankTitle,
    tier,
    lore,
    stats: {
      attack: stats.attack || 0,
      defense: stats.defense || 0,
      miningYield: stats.miningYield || 0,
      productionYield: stats.productionYield || 0,
      foodYield: stats.foodYield || 0,
      waterYield: stats.waterYield || 0,
      creditsTaxYield: stats.creditsTaxYield || 0,
      foodUpkeep: stats.foodUpkeep ?? 2,
      waterUpkeep: stats.waterUpkeep ?? 2,
      creditsUpkeep: stats.creditsUpkeep ?? 1,
      espionagePower: stats.espionagePower || 0,
      counterIntel: stats.counterIntel || 0,
      governanceEfficiency: stats.governanceEfficiency || 0,
    },
    cost: {
      untrainedUnits: cost.untrainedUnits ?? 10,
      naquadah: cost.naquadah ?? 100,
      metal: cost.metal ?? 500,
      crystal: cost.crystal ?? 300,
      credits: cost.credits ?? 250,
      trainingTurns: cost.trainingTurns ?? 1,
    },
    requiredAcademyWing: wingId,
    requiredAcademyLevel: wingLvl,
  };
}

// 90 COMPLETE UNITS LIST
export const WORKFORCE_90_UNITS: WorkforceUnit[] = [
  // ==========================================
  // SECTION 1: FRONTLINE COMBAT DIVISIONS (18 Units)
  // ==========================================
  createUnit(
    'fl_01', 'Line Infantry Guardsman', 'frontline',
    'Infantry Corp', 'Light Kinetic Division', 'Assault Trooper', 'Standard Rifleman',
    'Conscript Private', 1,
    'Standard issue magnetic-slug rifle troopers forming the bulk of planetary expeditionary forces.',
    { attack: 15, defense: 12, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 1 },
    { untrainedUnits: 10, metal: 400, crystal: 150, naquadah: 50, credits: 100 },
    'war_college', 1
  ),
  createUnit(
    'fl_02', 'Trench Grenadier Specialist', 'frontline',
    'Infantry Corp', 'Demolitions Division', 'Breach Grenadier', 'Concussive Sapper',
    'Corporal', 1,
    'Trained in thermal explosive breach charges and trench-clearing saturation barrages.',
    { attack: 24, defense: 10, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 2 },
    { untrainedUnits: 10, metal: 600, crystal: 200, naquadah: 80, credits: 150 },
    'war_college', 1
  ),
  createUnit(
    'fl_03', 'Plasma Carbine Vanguard', 'frontline',
    'Energy Corps', 'Ion Shock Division', 'Plasma Trooper', 'High-Flux Vanguard',
    'Sergeant', 2,
    'Equipped with superheated plasma carbines capable of melting dense composite fortifications.',
    { attack: 38, defense: 22, foodUpkeep: 3, waterUpkeep: 2, creditsUpkeep: 3 },
    { untrainedUnits: 15, metal: 900, crystal: 450, naquadah: 180, credits: 250 },
    'war_college', 2
  ),
  createUnit(
    'fl_04', 'Heavy Gauss Fireteam Gunner', 'frontline',
    'Support Corps', 'Sustained Fire Division', 'Heavy Gunner', 'Belt-Fed Gauss Operator',
    'Master Sergeant', 2,
    'Fielding twin micro-rotary railguns that lay down suppressing fields across planetary warzones.',
    { attack: 45, defense: 30, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 4 },
    { untrainedUnits: 20, metal: 1400, crystal: 600, naquadah: 250, credits: 350 },
    'war_college', 2
  ),
  createUnit(
    'fl_05', 'Jaffa Staff Weapon Praetorian', 'frontline',
    'Honor Guard', 'Ma\'Tok Strike Division', 'Energy Lancer', 'Solar Plasma Retainer',
    'First Prime Aspirant', 3,
    'Elite warriors disciplined in ancient Goa\'uld staff combat and close-quarters shock assaults.',
    { attack: 65, defense: 45, foodUpkeep: 4, waterUpkeep: 3, creditsUpkeep: 5 },
    { untrainedUnits: 25, metal: 2000, crystal: 900, naquadah: 500, credits: 600 },
    'war_college', 3
  ),
  createUnit(
    'fl_06', 'Powered Exoskeleton Breacher', 'frontline',
    'Mechanized Corps', 'Heavy Armor Division', 'Exo-Trooper', 'Hydraulic Siege Breaker',
    'Lieutenant', 3,
    'Hydraulically amplified armored suits that resist heavy ordnance and pulverize defensive bunkers.',
    { attack: 85, defense: 75, foodUpkeep: 5, waterUpkeep: 4, creditsUpkeep: 8 },
    { untrainedUnits: 30, metal: 3200, crystal: 1400, naquadah: 800, credits: 900 },
    'war_college', 3
  ),
  createUnit(
    'fl_07', 'Zero-G Orbital Drop Marine', 'frontline',
    'Spaceborne Corps', 'Orbital Insertion Division', 'Drop Marine', 'Atmospheric Re-entry Raider',
    'Captain', 4,
    'Special forces deployed from vacuum drop-pods directly behind contested enemy lines.',
    { attack: 110, defense: 80, foodUpkeep: 5, waterUpkeep: 5, creditsUpkeep: 12 },
    { untrainedUnits: 35, metal: 4500, crystal: 2200, naquadah: 1200, credits: 1400 },
    'war_college', 4
  ),
  createUnit(
    'fl_08', 'Dreadnought Boarding Commando', 'frontline',
    'Spaceborne Corps', 'Vessel Infiltration Division', 'Boarding Specialist', 'Hull Cutter Marine',
    'Major', 4,
    'Equipped with magnetic boots, plasma torches, and vacuum seals to seize enemy capital starships.',
    { attack: 135, defense: 95, foodUpkeep: 6, waterUpkeep: 5, creditsUpkeep: 16 },
    { untrainedUnits: 40, metal: 6000, crystal: 3000, naquadah: 1800, credits: 2000 },
    'war_college', 4
  ),
  createUnit(
    'fl_09', 'Titan Mechanized Walker Pilot', 'frontline',
    'Mechanized Corps', 'Bipedal Walker Division', 'Walker Pilot', 'Twin-Auto-Cannon Strider',
    'Colonel', 5,
    'Pilots of towering 12-meter assault mechs carrying dual rotary cannons and cluster rockets.',
    { attack: 220, defense: 180, foodUpkeep: 8, waterUpkeep: 6, creditsUpkeep: 25 },
    { untrainedUnits: 50, metal: 10000, crystal: 5000, naquadah: 3500, credits: 4000 },
    'war_college', 5
  ),
  createUnit(
    'fl_10', 'Nanite Bio-Infused Shocktrooper', 'frontline',
    'Cybernetic Corps', 'Transhuman Assault Division', 'Nanite Soldier', 'Self-Repairing Cybertrooper',
    'Brigadier General', 5,
    'Transhuman soldiers with self-knitting cellular matrices that instantly recover from fatal trauma.',
    { attack: 280, defense: 240, foodUpkeep: 6, waterUpkeep: 6, creditsUpkeep: 35 },
    { untrainedUnits: 60, metal: 14000, crystal: 8000, naquadah: 5000, credits: 6000 },
    'war_college', 5
  ),
  createUnit(
    'fl_11', 'Scout Sniper Marksman', 'frontline',
    'Recon Corps', 'Long-Range Ballistics Division', 'Sharpshooter', 'Anti-Materiel Sniper',
    'Corporal', 1,
    'Pinpoint marksmen armed with high-velocity hyper-dense tungsten rail rifles.',
    { attack: 32, defense: 8, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 2 },
    { untrainedUnits: 10, metal: 500, crystal: 300, naquadah: 100, credits: 180 },
    'war_college', 1
  ),
  createUnit(
    'fl_12', 'Flamer Chemical Purifier', 'frontline',
    'Hazard Corps', 'Bio-Thermal Cleansing Division', 'Purifier', 'Phosphor Gel Specialist',
    'Sergeant', 2,
    'Deploys pressurized white phosphorus and napalm canisters against subterranean swarms.',
    { attack: 42, defense: 18, foodUpkeep: 3, waterUpkeep: 2, creditsUpkeep: 3 },
    { untrainedUnits: 15, metal: 850, crystal: 400, naquadah: 150, credits: 220 },
    'war_college', 2
  ),
  createUnit(
    'fl_13', 'Combat Medic Field Surgeon', 'frontline',
    'Medical Corps', 'Triage & Recovery Division', 'Field Medic', 'Stimpack Trauma Specialist',
    'Lieutenant', 2,
    'Administers synthetic coagulation sprays and rapid-revival stimpacks under live enemy artillery.',
    { attack: 10, defense: 35, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 3 },
    { untrainedUnits: 15, metal: 700, crystal: 800, naquadah: 200, credits: 300 },
    'war_college', 2
  ),
  createUnit(
    'fl_14', 'Combat Engineer Sapper', 'frontline',
    'Engineering Corps', 'Fortification Breakdown Division', 'Field Sapper', 'Minefield Breaker',
    'Staff Sergeant', 3,
    'Rapidly builds frontline anti-tank hurdles, trenches, and bridgeheads across hostile terrain.',
    { attack: 30, defense: 60, foodUpkeep: 4, waterUpkeep: 3, creditsUpkeep: 4 },
    { untrainedUnits: 20, metal: 1800, crystal: 900, naquadah: 300, credits: 450 },
    'war_college', 3
  ),
  createUnit(
    'fl_15', 'Sub-Orbital Hover Tank Driver', 'frontline',
    'Armor Corps', 'Repulsor Lift Division', 'Tanker', 'Heavy Repulsor Tank Commander',
    'Captain', 4,
    'Operates hover tanks that glide over molten lava fields and minefields at 180 km/h.',
    { attack: 160, defense: 140, foodUpkeep: 6, waterUpkeep: 4, creditsUpkeep: 18 },
    { untrainedUnits: 40, metal: 7500, crystal: 4000, naquadah: 2400, credits: 2800 },
    'war_college', 4
  ),
  createUnit(
    'fl_16', 'Kull Warrior Bio-Synthetic Infiltrator', 'frontline',
    'Bio-Synthetic Corps', 'Goa\'uld Genetic Division', 'Living Weapon', 'Anubis Reanimated Super-Soldier',
    'Champion', 5,
    'Engineered from lifeless tissue infused with naquadah isotopes, nearly invulnerable to conventional energy.',
    { attack: 350, defense: 320, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 45 },
    { untrainedUnits: 75, metal: 20000, crystal: 12000, naquadah: 8000, credits: 9000 },
    'war_college', 5
  ),
  createUnit(
    'fl_17', 'Solar Flare Heavy Artillery Battery Crew', 'frontline',
    'Artillery Corps', 'Planetary Siege Division', 'Bombardier', 'Macro-Shell Cannoneer',
    'Major', 4,
    'Operates mega-caliber artillery pieces capable of bombarding enemy continents from orbit.',
    { attack: 180, defense: 60, foodUpkeep: 5, waterUpkeep: 4, creditsUpkeep: 15 },
    { untrainedUnits: 40, metal: 8000, crystal: 3500, naquadah: 2000, credits: 2500 },
    'war_college', 4
  ),
  createUnit(
    'fl_18', 'Apex Fleet Shock Marshal', 'frontline',
    'Command Corps', 'Supreme Planetary Command', 'Warmaster', 'Grand Field Marshal',
    'Lord High Commander', 5,
    'Legendary tacticians whose strategic presence coordinates entire planetary divisions seamlessly.',
    { attack: 400, defense: 380, foodUpkeep: 10, waterUpkeep: 8, creditsUpkeep: 60 },
    { untrainedUnits: 100, metal: 30000, crystal: 20000, naquadah: 12000, credits: 15000 },
    'war_college', 5
  ),

  // ==========================================
  // SECTION 2: ORBITAL DEFENSE GARRISONS (12 Units)
  // ==========================================
  createUnit(
    'od_01', 'Citadel Wall Sentinel', 'orbital_defense',
    'Garrison Corps', 'Perimeter Watch Division', 'Wall Guard', 'Tower Watchman',
    'Garrison Guard', 1,
    'Stationed along bastion blast-walls to detect and engage perimeter intrusions.',
    { attack: 8, defense: 28, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 1 },
    { untrainedUnits: 10, metal: 500, crystal: 200, naquadah: 40, credits: 100 },
    'defense_proving', 1
  ),
  createUnit(
    'od_02', 'Flak Battery Anti-Air Gunner', 'orbital_defense',
    'Anti-Air Corps', 'Kinetic Intercept Division', 'AA Gunner', 'Quad-Flak Operator',
    'Flak Officer', 1,
    'Directs high-cyclic quad-cannons filling upper atmospheric corridors with dense shrapnel.',
    { attack: 22, defense: 38, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 2 },
    { untrainedUnits: 12, metal: 800, crystal: 350, naquadah: 80, credits: 160 },
    'defense_proving', 1
  ),
  createUnit(
    'od_03', 'Surface-to-Orbit Ion Missileer', 'orbital_defense',
    'Missile Corps', 'Suborbital Interception Division', 'Missileer', 'Ion Warhead Tech',
    'Battery Chief', 2,
    'Calibrates thermonuclear and ion-disruption missiles that strike invading starships in low orbit.',
    { attack: 40, defense: 60, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 4 },
    { untrainedUnits: 18, metal: 1600, crystal: 800, naquadah: 300, credits: 350 },
    'defense_proving', 2
  ),
  createUnit(
    'od_04', 'Planetary Shield Generator Technician', 'orbital_defense',
    'Energy Barrier Corps', 'Aegis Field Division', 'Shield Tech', 'Harmonic Shield Tuner',
    'Master Specialist', 2,
    'Maintains the massive energy conduits powering global planetary dome shields.',
    { attack: 5, defense: 95, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 5 },
    { untrainedUnits: 20, metal: 2200, crystal: 1400, naquadah: 500, credits: 500 },
    'defense_proving', 2
  ),
  createUnit(
    'od_05', 'Orbital Defense Platform Controller', 'orbital_defense',
    'Orbital Grid Corps', 'Satellite Bastion Division', 'Station Controller', 'Orbital Gun Turret Officer',
    'Platform Commander', 3,
    'Directs modular orbital weapon platforms linked around the planet\'s geostationary ring.',
    { attack: 65, defense: 120, foodUpkeep: 4, waterUpkeep: 4, creditsUpkeep: 8 },
    { untrainedUnits: 25, metal: 3500, crystal: 2000, naquadah: 900, credits: 800 },
    'defense_proving', 3
  ),
  createUnit(
    'od_06', 'Plasma Cannon Bastion Operator', 'orbital_defense',
    'Heavy Ordnance Corps', 'Super-Heavy Plasma Division', 'Cannon Gunner', 'Mega-Watt Thermal Blaster',
    'Master Bombardier', 3,
    'Operates planetary-based super-heavy plasma cannons capable of piercing battlecruiser shields.',
    { attack: 95, defense: 140, foodUpkeep: 4, waterUpkeep: 4, creditsUpkeep: 10 },
    { untrainedUnits: 30, metal: 4800, crystal: 2600, naquadah: 1300, credits: 1100 },
    'defense_proving', 3
  ),
  createUnit(
    'od_07', 'Tachyon Grid Sensor Array Analyst', 'orbital_defense',
    'Sensory Defense Corps', 'Tachyon Radar Division', 'Sensor Analyst', 'Subspace Intercept Operator',
    'Surveillance Officer', 4,
    'Monitors hyperspace anomalies to provide 45-minute early warnings for incoming naval strikes.',
    { attack: 15, defense: 180, counterIntel: 25, foodUpkeep: 4, waterUpkeep: 4, creditsUpkeep: 12 },
    { untrainedUnits: 35, metal: 5500, crystal: 4500, naquadah: 1800, credits: 1600 },
    'defense_proving', 4
  ),
  createUnit(
    'od_08', 'Lunar Orbital Aegis Overseer', 'orbital_defense',
    'Lunar Defense Corps', 'Moon Bastion Division', 'Lunar Commander', 'Craterside Railgun Overseer',
    'Lunar Governor', 4,
    'Coordinates lunar defense outposts, relaying synchronized defensive fire toward hostile fleet vectors.',
    { attack: 120, defense: 220, foodUpkeep: 5, waterUpkeep: 5, creditsUpkeep: 18 },
    { untrainedUnits: 45, metal: 7800, crystal: 5200, naquadah: 2800, credits: 2400 },
    'defense_proving', 4
  ),
  createUnit(
    'od_09', 'Dark Matter Void Barrier Architect', 'orbital_defense',
    'Quantum Defense Corps', 'Singularity Barrier Division', 'Barrier Physicist', 'Gravitational Deflector',
    'High Inquisitor of Defense', 5,
    'Generates microscopic gravitational wells that bend and swallow incoming orbital bombardment.',
    { attack: 30, defense: 380, foodUpkeep: 6, waterUpkeep: 6, creditsUpkeep: 30 },
    { untrainedUnits: 55, metal: 12000, crystal: 9000, naquadah: 5500, credits: 5000 },
    'defense_proving', 5
  ),
  createUnit(
    'od_10', 'Citadel Iron Curtain Commandant', 'orbital_defense',
    'High Command', 'Planetary Fortress Command', 'Castellan', 'Supreme Fortress Commandant',
    'Grand Castellan', 5,
    'Commands the ultimate subterranean citadel network, rendering the world an impenetrable fortress.',
    { attack: 160, defense: 520, foodUpkeep: 8, waterUpkeep: 8, creditsUpkeep: 45 },
    { untrainedUnits: 80, metal: 20000, crystal: 15000, naquadah: 9000, credits: 9000 },
    'defense_proving', 5
  ),
  createUnit(
    'od_11', 'Automated Drone Swarm Coordinator', 'orbital_defense',
    'Robotic Defense Corps', 'Autonomous Drone Division', 'Swarm Handler', 'AI Drone Grid Specialist',
    'Lieutenant Technician', 2,
    'Directs thousands of autonomous flak and interceptor drones over urban population centers.',
    { attack: 35, defense: 75, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 4 },
    { untrainedUnits: 15, metal: 1500, crystal: 900, naquadah: 250, credits: 300 },
    'defense_proving', 2
  ),
  createUnit(
    'od_12', 'Point-Defense Laser Battery Specialist', 'orbital_defense',
    'Directed Energy Corps', 'Laser Intercept Division', 'Laser Tech', 'High-Frequency Beam Gunner',
    'Warrant Officer', 3,
    'Fires continuous multi-kilowatt infrared lasers that vaporize incoming torpedoes and missiles.',
    { attack: 50, defense: 105, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 6 },
    { untrainedUnits: 22, metal: 2800, crystal: 1800, naquadah: 650, credits: 650 },
    'defense_proving', 3
  ),

  // ==========================================
  // SECTION 3: DEEP-MANTLE NAQUADAH MINING GUILDS (12 Units)
  // ==========================================
  createUnit(
    'nm_01', 'Borehole Drilling Apprentice', 'naquadah_mining',
    'Mining Guild', 'Surface Borehole Division', 'Driller', 'Rotary Bit Apprentice',
    'Apprentice Miner', 1,
    'Assists in establishing shallow shaft boreholes into mineral-rich crustal veins.',
    { miningYield: 15, productionYield: 25, defense: 4, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 1 },
    { untrainedUnits: 10, metal: 300, crystal: 200, naquadah: 20, credits: 80 },
    'geological_institute', 1
  ),
  createUnit(
    'nm_02', 'Seismic Sonar Geologist', 'naquadah_mining',
    'Survey Corps', 'Acoustic Prospecting Division', 'Geologist', 'Acoustic Resonance Surveyor',
    'Prospector', 1,
    'Scans deep bedrock acoustic frequencies to pinpoint enriched liquid naquadah pockets.',
    { miningYield: 25, productionYield: 15, defense: 5, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 2 },
    { untrainedUnits: 12, metal: 450, crystal: 400, naquadah: 50, credits: 120 },
    'geological_institute', 1
  ),
  createUnit(
    'nm_03', 'Mantle Shaft Rig Operator', 'naquadah_mining',
    'Drilling Corps', 'High-Pressure Bore Division', 'Rig Operator', 'Pneumatic Mantle Extractor',
    'Journeyman Miner', 2,
    'Operates pneumatic drills descending 20 kilometers down into the planetary lithosphere.',
    { miningYield: 45, productionYield: 40, defense: 8, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 3 },
    { untrainedUnits: 15, metal: 900, crystal: 600, naquadah: 150, credits: 220 },
    'geological_institute', 2
  ),
  createUnit(
    'nm_04', 'Thermal Magma Diver', 'naquadah_mining',
    'Hazard Extraction Corps', 'Molten Convection Division', 'Magma Diver', 'Ceramic Armor Diver',
    'Thermal Specialist', 2,
    'Descends into active magma chambers wearing pressurized heat-dissipating ablative suits.',
    { miningYield: 70, productionYield: 30, defense: 12, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 4 },
    { untrainedUnits: 18, metal: 1400, crystal: 800, naquadah: 280, credits: 350 },
    'geological_institute', 2
  ),
  createUnit(
    'nm_05', 'Liquid Naquadah Centrifuge Chemist', 'naquadah_mining',
    'Refinery Guild', 'Isotope Centrifuge Division', 'Refinery Chemist', 'Liquid Isotope Enricher',
    'Master Alchemist', 3,
    'Refines heavy raw naquadah ore into weapons-grade and reactor-grade hyper-dense fluid.',
    { miningYield: 110, productionYield: 60, defense: 10, foodUpkeep: 4, waterUpkeep: 3, creditsUpkeep: 6 },
    { untrainedUnits: 25, metal: 2400, crystal: 1800, naquadah: 600, credits: 600 },
    'geological_institute', 3
  ),
  createUnit(
    'nm_06', 'Tectonic Fault Stabilizer Engineer', 'naquadah_mining',
    'Geological Safety Corps', 'Seismic Dampening Division', 'Fault Engineer', 'Graviton Anchor Operator',
    'Chief Geomechanic', 3,
    'Places subterranean graviton anchors along continental faults to prevent mining-induced quakes.',
    { miningYield: 140, productionYield: 90, defense: 20, foodUpkeep: 4, waterUpkeep: 4, creditsUpkeep: 8 },
    { untrainedUnits: 30, metal: 3500, crystal: 2400, naquadah: 950, credits: 850 },
    'geological_institute', 3
  ),
  createUnit(
    'nm_07', 'Plasma Core Smelter Foreman', 'naquadah_mining',
    'Smelter Guild', 'Arc Furnace Division', 'Foreman', 'Continuous Casting Supervisor',
    'Smelter Master', 4,
    'Supervises massive gigawatt arc-smelters that forge crystallized alloy sheets for starship hulls.',
    { miningYield: 200, productionYield: 150, defense: 25, foodUpkeep: 5, waterUpkeep: 4, creditsUpkeep: 12 },
    { untrainedUnits: 40, metal: 5500, crystal: 3600, naquadah: 1600, credits: 1400 },
    'geological_institute', 4
  ),
  createUnit(
    'nm_08', 'Asteroid Core Harvester Captain', 'naquadah_mining',
    'Deep Space Mining Corps', 'Asteroid Belt Division', 'Harvester Captain', 'Tugboat Grappler',
    'Belter Commander', 4,
    'Grapples 100-million-ton nickel-iron and naquadah asteroids, hauling them into planetary orbit.',
    { miningYield: 270, productionYield: 220, defense: 40, foodUpkeep: 5, waterUpkeep: 5, creditsUpkeep: 18 },
    { untrainedUnits: 50, metal: 8000, crystal: 5500, naquadah: 2500, credits: 2200 },
    'geological_institute', 4
  ),
  createUnit(
    'nm_09', 'Sub-Mantle Quantum Siphon Master', 'naquadah_mining',
    'Quantum Extraction Guild', 'Sub-Crustal Singularity Division', 'Quantum Extractor', 'Subspace Siphon Physicist',
    'Arch-Technocrat', 5,
    'Uses micro-singularities to vacuum pure naquadah isotopes directly out of the planet\'s molten outer core.',
    { miningYield: 420, productionYield: 320, defense: 50, foodUpkeep: 6, waterUpkeep: 6, creditsUpkeep: 28 },
    { untrainedUnits: 65, metal: 13000, crystal: 9000, naquadah: 4500, credits: 4000 },
    'geological_institute', 5
  ),
  createUnit(
    'nm_10', 'Guildmaster of the Inner Core', 'naquadah_mining',
    'Supreme Mining Council', 'Core Extraction Chancellery', 'Guildmaster', 'Supreme Geothermal Overlord',
    'Grand Mining Praetor', 5,
    'The absolute authority on imperial extractive geology, governing billion-ton yields across all colonies.',
    { miningYield: 650, productionYield: 480, defense: 75, foodUpkeep: 8, waterUpkeep: 7, creditsUpkeep: 45 },
    { untrainedUnits: 85, metal: 22000, crystal: 16000, naquadah: 8000, credits: 8000 },
    'geological_institute', 5
  ),
  createUnit(
    'nm_11', 'Automated Ore Carrier Drone Fleet Operator', 'naquadah_mining',
    'Logistics Mining Guild', 'Sub-Surface Transport Division', 'Drone Fleet Op', 'Maglev Ore Dispatcher',
    'Logistics Controller', 2,
    'Controls underground maglev conveyor networks ferrying millions of tons of raw ore hourly.',
    { miningYield: 60, productionYield: 50, defense: 10, foodUpkeep: 3, waterUpkeep: 2, creditsUpkeep: 3 },
    { untrainedUnits: 15, metal: 1100, crystal: 700, naquadah: 200, credits: 280 },
    'geological_institute', 2
  ),
  createUnit(
    'nm_12', 'Radioactive Waste Purifier', 'naquadah_mining',
    'Hazard Remediation Guild', 'Rad-Shielding & Reclamation Division', 'Waste Purifier', 'Isotope Neutralizer',
    'Health & Safety Inspector', 3,
    'Neutralizes hazardous sub-atomic radiation leaks, keeping miners alive in lethal depth zones.',
    { miningYield: 90, productionYield: 75, defense: 15, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 5 },
    { untrainedUnits: 20, metal: 1900, crystal: 1300, naquadah: 400, credits: 480 },
    'geological_institute', 3
  ),

  // ==========================================
  // SECTION 4: COVERT ESPIONAGE & INTELLIGENCE OPERATIVES (12 Units)
  // ==========================================
  createUnit(
    'es_01', 'Street Informant Scout', 'espionage',
    'Underworld Network', 'Urban Recon Division', 'Informant', 'Street Hawker Scout',
    'Cell Informer', 1,
    'Blends into port spacebars and black markets, listening for whispers of foreign fleets.',
    { espionagePower: 12, counterIntel: 8, foodUpkeep: 1, waterUpkeep: 1, creditsUpkeep: 2 },
    { untrainedUnits: 5, metal: 200, crystal: 300, naquadah: 40, credits: 150 },
    'shadow_division', 1
  ),
  createUnit(
    'es_02', 'Subspace Wiretapper', 'espionage',
    'Signals Intelligence', 'Subspace Interception Division', 'Wiretapper', 'Encryption Sniffer',
    'Signal Analyst', 1,
    'Hooks clandestine relay taps onto commercial hyper-wave relays to harvest empire telemetry.',
    { espionagePower: 22, counterIntel: 18, foodUpkeep: 1, waterUpkeep: 1, creditsUpkeep: 3 },
    { untrainedUnits: 8, metal: 350, crystal: 600, naquadah: 90, credits: 250 },
    'shadow_division', 1
  ),
  createUnit(
    'es_03', 'Counter-Intelligence Inquisitor', 'espionage',
    'Internal Security', 'Sedition Neutralization Division', 'Inquisitor', 'Polygraph Stalker',
    'Security Officer', 2,
    'Rooting out enemy sleeper agents and saboteurs hidden in domestic command bunkers.',
    { espionagePower: 15, counterIntel: 45, defense: 25, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 5 },
    { untrainedUnits: 12, metal: 700, crystal: 1000, naquadah: 200, credits: 400 },
    'shadow_division', 2
  ),
  createUnit(
    'es_04', 'Cyberwarfare Grid Hacker', 'espionage',
    'Cyber Operations', 'Quantum Decryption Division', 'Hacker', 'Mainframe Phreak',
    'Netrunner Chief', 2,
    'Breaches foreign military planetary grids to scramble missile targeting and falsify logs.',
    { espionagePower: 45, counterIntel: 35, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 6 },
    { untrainedUnits: 15, metal: 900, crystal: 1600, naquadah: 350, credits: 600 },
    'shadow_division', 2
  ),
  createUnit(
    'es_05', 'Chameleon Cloaked Infiltrator', 'espionage',
    'Covert Recon', 'Optical Camouflage Division', 'Infiltrator', 'Therm-Optic Ghost',
    'Shadow Agent', 3,
    'Utilizes active light-bending refraction suits to enter high-security starship yards unseen.',
    { espionagePower: 70, counterIntel: 40, attack: 35, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 10 },
    { untrainedUnits: 20, metal: 1600, crystal: 2400, naquadah: 700, credits: 1000 },
    'shadow_division', 3
  ),
  createUnit(
    'es_06', 'Industrial Saboteur Chemist', 'espionage',
    'Black Ops Division', 'Chemical Demolition Division', 'Saboteur', 'Corrosive Nano-Injector',
    'Field Operative', 3,
    'Injects synthetic flesh-eating and metal-decaying catalysts into enemy naquadah silos.',
    { espionagePower: 95, counterIntel: 30, attack: 45, foodUpkeep: 3, waterUpkeep: 2, creditsUpkeep: 14 },
    { untrainedUnits: 25, metal: 2200, crystal: 3200, naquadah: 1100, credits: 1500 },
    'shadow_division', 3
  ),
  createUnit(
    'es_07', 'Telepathic Interrogator', 'espionage',
    'Psionic Bureau', 'Mind Fracture Division', 'Mindbender', 'Neural Tap Examiner',
    'Special Investigator', 4,
    'Extracts naval codes, jump gate coordinates, and fleet destinations straight from enemy synapses.',
    { espionagePower: 140, counterIntel: 80, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 20 },
    { untrainedUnits: 30, metal: 3200, crystal: 5500, naquadah: 1800, credits: 2400 },
    'shadow_division', 4
  ),
  createUnit(
    'es_08', 'Deep Cover Embassy Sleeper', 'espionage',
    'Diplomatic Corps', 'High Society Infiltration Division', 'Diplomat-Spy', 'Attaché Provocateur',
    'Ambassadorial Envoy', 4,
    'Lives for decades embedded in rival ruling courts, whispering poisonous disinformation.',
    { espionagePower: 180, counterIntel: 110, governanceEfficiency: 20, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 25 },
    { untrainedUnits: 35, metal: 4000, crystal: 6800, naquadah: 2500, credits: 3500 },
    'shadow_division', 4
  ),
  createUnit(
    'es_09', 'Ghost Division Quantum Ghost', 'espionage',
    'Ghost Directorate', 'Dimensional Phase Division', 'Quantum Operative', 'Phase-Shift Assassin',
    'Ghost Leader', 5,
    'Can briefly shift out of reality into adjacent sub-dimensions to bypass any physical barrier.',
    { espionagePower: 280, counterIntel: 160, attack: 120, foodUpkeep: 4, waterUpkeep: 4, creditsUpkeep: 40 },
    { untrainedUnits: 50, metal: 8000, crystal: 12000, naquadah: 5000, credits: 6500 },
    'shadow_division', 5
  ),
  createUnit(
    'es_10', 'Grand Spymaster of the Dark Council', 'espionage',
    'Supreme Shadow Directorate', 'Executive Black Site', 'Grand Spymaster', 'Shadow Sovereign',
    'The Invisible Hand', 5,
    'Controls an invisible constellation of billions of operatives across the entire galactic rim.',
    { espionagePower: 450, counterIntel: 300, attack: 150, defense: 100, foodUpkeep: 6, waterUpkeep: 6, creditsUpkeep: 65 },
    { untrainedUnits: 75, metal: 15000, crystal: 22000, naquadah: 9000, credits: 12000 },
    'shadow_division', 5
  ),
  createUnit(
    'es_11', 'Bribe Broker Syndicate Courier', 'espionage',
    'Bribery & Extortion', 'Financial Compromise Division', 'Broker', 'Offshore Ledger Courier',
    'Syndicate Liaison', 2,
    'Facilitates million-credit payoffs and black-ops funding through untraceable shell accounts.',
    { espionagePower: 38, counterIntel: 20, creditsTaxYield: 15, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 5 },
    { untrainedUnits: 12, metal: 500, crystal: 1200, naquadah: 250, credits: 800 },
    'shadow_division', 2
  ),
  createUnit(
    'es_12', 'Decoy Drone & False Radar Specialist', 'espionage',
    'Deception Tactics', 'Phantom Fleet Division', 'Phantom Tech', 'Holographic Echo Specialist',
    'Deception Officer', 3,
    'Fills enemy long-range sensor scanners with phantom armada signatures to draw away defenders.',
    { espionagePower: 80, counterIntel: 60, defense: 30, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 8 },
    { untrainedUnits: 18, metal: 1800, crystal: 2600, naquadah: 600, credits: 900 },
    'shadow_division', 3
  ),

  // ==========================================
  // SECTION 5: CIVILIAN LIFE-SUPPORT, PRODUCTION & LOGISTICS (18 Units)
  // ==========================================
  createUnit(
    'cp_01', 'Hydroponic Crop Harvester', 'civilian_production',
    'Agronomy Guild', 'Vertical Farming Division', 'Farm Tech', 'Algae & Grain Tender',
    'Farmer', 1,
    'Tends thousands of automated vertical farming towers that nourish planetary metropolitan belts.',
    { foodYield: 50, waterUpkeep: 1, foodUpkeep: 1, creditsTaxYield: 2 },
    { untrainedUnits: 10, metal: 200, crystal: 150, naquadah: 10, credits: 60 },
    'polytech_guild', 1
  ),
  createUnit(
    'cp_02', 'Deep Aquifer Desalination Worker', 'civilian_production',
    'Hydrology Guild', 'Desalination Division', 'Aquifer Tech', 'Reverse-Osmosis Operator',
    'Waterman', 1,
    'Processes toxic planetary oceans into millions of liters of pristine potable water.',
    { waterYield: 60, foodUpkeep: 1, waterUpkeep: 1, creditsTaxYield: 2 },
    { untrainedUnits: 10, metal: 250, crystal: 150, naquadah: 10, credits: 60 },
    'polytech_guild', 1
  ),
  createUnit(
    'cp_03', 'Atmospheric Moisture Condenser Specialist', 'civilian_production',
    'Hydrology Guild', 'Atmospheric Extraction Division', 'Moisture Tech', 'Cloud Siphon Mechanic',
    'Hydrologist', 2,
    'Extracts humidity directly from clouds over arid or desert colony worlds.',
    { waterYield: 110, foodUpkeep: 2, waterUpkeep: 1, creditsTaxYield: 4 },
    { untrainedUnits: 15, metal: 500, crystal: 350, naquadah: 50, credits: 120 },
    'polytech_guild', 2
  ),
  createUnit(
    'cp_04', 'Bio-Synthetic Protein Synthesizer', 'civilian_production',
    'Food Science Guild', 'Cultured Nutrition Division', 'Protein Chemist', 'Vat-Meat Fermenter',
    'Nutritionist', 2,
    'Creates calorie-dense, nutritious synthetic protein bricks that feed soldiers on campaigns.',
    { foodYield: 95, foodUpkeep: 1, waterUpkeep: 2, creditsTaxYield: 5 },
    { untrainedUnits: 15, metal: 600, crystal: 450, naquadah: 70, credits: 150 },
    'polytech_guild', 2
  ),
  createUnit(
    'cp_05', 'Nanite Metal Foundry Machinist', 'civilian_production',
    'Manufacturing Guild', 'Heavy Castings Division', 'Foundryman', 'Molten Slag Caster',
    'Journeyman Smith', 2,
    'Forges reinforced bulkheads and armor plates from raw excavated ore deposits.',
    { productionYield: 80, foodUpkeep: 2, waterUpkeep: 2, creditsTaxYield: 6 },
    { untrainedUnits: 18, metal: 800, crystal: 500, naquadah: 100, credits: 180 },
    'polytech_guild', 2
  ),
  createUnit(
    'cp_06', 'High-Flux Crystal Refiner', 'civilian_production',
    'Crystallography Guild', 'Resonance Lattice Division', 'Crystal Cutter', 'Laser Polisher',
    'Optics Engineer', 2,
    'Polishes raw quartz and silicon lattices into precision computational crystals.',
    { productionYield: 95, foodUpkeep: 2, waterUpkeep: 2, creditsTaxYield: 7 },
    { untrainedUnits: 18, metal: 600, crystal: 800, naquadah: 120, credits: 200 },
    'polytech_guild', 2
  ),
  createUnit(
    'cp_07', 'Terraforming Biosphere Climatician', 'civilian_production',
    'Geo-Engineering Guild', 'Planetary Weather Division', 'Climatician', 'Ozone Injector',
    'Planetary Modeler', 3,
    'Controls weather satellites to bring rainstorms to parched crops and suppress acid storms.',
    { foodYield: 160, waterYield: 140, foodUpkeep: 3, waterUpkeep: 2, creditsTaxYield: 10 },
    { untrainedUnits: 25, metal: 1800, crystal: 1400, naquadah: 400, credits: 450 },
    'polytech_guild', 3
  ),
  createUnit(
    'cp_08', 'Industrial Assembly Line Roboticist', 'civilian_production',
    'Robotics Guild', 'Automated Production Division', 'Roboticist', 'Gantry Calibrator',
    'Robotics Lead', 3,
    'Maintains high-speed assembly robotics that churn out consumer goods and weapons parts.',
    { productionYield: 180, foodUpkeep: 2, waterUpkeep: 2, creditsTaxYield: 14 },
    { untrainedUnits: 25, metal: 2000, crystal: 1600, naquadah: 500, credits: 550 },
    'polytech_guild', 3
  ),
  createUnit(
    'cp_09', 'Fusion Reactor Core Engineer', 'civilian_production',
    'Energy Guild', 'Tokamak Containment Division', 'Reactor Tech', 'Magnetic Bottle Master',
    'Chief Energy Officer', 3,
    'Manages deuterium fusion dynamos providing gigawatts of power to planetary industries.',
    { productionYield: 150, miningYield: 30, foodUpkeep: 3, waterUpkeep: 3, creditsTaxYield: 15 },
    { untrainedUnits: 30, metal: 2800, crystal: 2200, naquadah: 700, credits: 700 },
    'polytech_guild', 3
  ),
  createUnit(
    'cp_10', 'Atmospheric Dome Architect', 'civilian_production',
    'Architecture Guild', 'Megastructure Division', 'Dome Architect', 'Structural Geodesic Engineer',
    'Master Builder', 4,
    'Designs mile-wide transparent geodesic domes sheltering millions on barren lunar surfaces.',
    { foodYield: 240, waterYield: 200, defense: 50, foodUpkeep: 4, waterUpkeep: 4, creditsTaxYield: 22 },
    { untrainedUnits: 40, metal: 4500, crystal: 3500, naquadah: 1200, credits: 1200 },
    'polytech_guild', 4
  ),
  createUnit(
    'cp_11', 'Orbital Cryo-Logistics Supercargo', 'civilian_production',
    'Merchant Guild', 'Interstellar Freight Division', 'Supercargo', 'Zero-G Container Rigger',
    'Port Superintendent', 4,
    'Oversees millions of metric tons of grain, fresh water, and metal shifted between planets.',
    { foodYield: 180, waterYield: 180, productionYield: 200, creditsTaxYield: 30 },
    { untrainedUnits: 45, metal: 5500, crystal: 4000, naquadah: 1600, credits: 1800 },
    'polytech_guild', 4
  ),
  createUnit(
    'cp_12', 'Genetically Modified Gene-Seed Agronomist', 'civilian_production',
    'Bio-Engineering Guild', 'Synthetic Genomes Division', 'Gene Botanist', 'Rapid-Cycle Crop Modder',
    'Arch-Botanist', 5,
    'Bioengineers super-crops that mature in 72 hours under artificial ultraviolet suns.',
    { foodYield: 450, waterUpkeep: 3, foodUpkeep: 2, creditsTaxYield: 40 },
    { untrainedUnits: 60, metal: 9000, crystal: 8000, naquadah: 3500, credits: 4000 },
    'polytech_guild', 5
  ),
  createUnit(
    'cp_13', 'Sub-Zero Cryo-Aquifer Melter', 'civilian_production',
    'Cryo-Hydrology Guild', 'Glacial Harvest Division', 'Thermal Melter', 'Sub-Glacial Bore Master',
    'Glacier Marshall', 5,
    'Melts miles of ancient pristine polar ice sheets, piping continental rivers to drought zones.',
    { waterYield: 520, foodUpkeep: 3, waterUpkeep: 2, creditsTaxYield: 40 },
    { untrainedUnits: 60, metal: 9500, crystal: 7500, naquadah: 3800, credits: 4200 },
    'polytech_guild', 5
  ),
  createUnit(
    'cp_14', 'Nanite Matter Replicator Architect', 'civilian_production',
    'Nanotechnology Guild', 'Universal Synthesis Division', 'Matter Synth Tech', 'Molecular Assembler Lead',
    'Grand Artificer', 5,
    'Programs molecular nanite swarms that turn raw planetary dust into completed alloy parts.',
    { productionYield: 550, foodYield: 200, waterYield: 200, creditsTaxYield: 65 },
    { untrainedUnits: 80, metal: 18000, crystal: 15000, naquadah: 7000, credits: 8500 },
    'polytech_guild', 5
  ),
  createUnit(
    'cp_15', 'Waste Reclamation Biologist', 'civilian_production',
    'Sanitation Guild', 'Closed-Loop Ecology Division', 'Biorecycler', 'Microbe Culture Tender',
    'Ecology Officer', 1,
    'Recycles 99.8% of organic waste and graywater back into pure nutrient mediums.',
    { waterYield: 40, foodYield: 30, foodUpkeep: 1, waterUpkeep: 1, creditsTaxYield: 2 },
    { untrainedUnits: 8, metal: 180, crystal: 120, naquadah: 15, credits: 50 },
    'polytech_guild', 1
  ),
  createUnit(
    'cp_16', 'Geothermal Steam Plant Mechanic', 'civilian_production',
    'Power Guild', 'Geothermal Turbine Division', 'Turbine Mechanic', 'Steam Pressure Rigger',
    'Station Engineer', 2,
    'Harnesses volcanic steam vents to drive ultra-high-pressure clean power dynamos.',
    { productionYield: 70, foodUpkeep: 2, waterUpkeep: 2, creditsTaxYield: 5 },
    { untrainedUnits: 12, metal: 650, crystal: 400, naquadah: 80, credits: 140 },
    'polytech_guild', 2
  ),
  createUnit(
    'cp_17', 'Deep Space Comm Relay Operator', 'civilian_production',
    'Communications Guild', 'Hyperspace Transmitter Division', 'Comm Tech', 'Hyper-Wave Switchboarder',
    'Communications Officer', 3,
    'Coordinates interstellar trade orders, cargo manifests, and fleet supply movements.',
    { creditsTaxYield: 20, productionYield: 40, foodUpkeep: 2, waterUpkeep: 2 },
    { untrainedUnits: 20, metal: 1200, crystal: 1500, naquadah: 300, credits: 400 },
    'polytech_guild', 3
  ),
  createUnit(
    'cp_18', 'Planetary Urban Planner', 'civilian_production',
    'Civil Administration', 'Megacity Infrastructure Division', 'Urban Planner', 'Transit Grid Architect',
    'Metropolitan Director', 4,
    'Eliminates logistics bottlenecks across 50-million-citizen planetary arcologies.',
    { creditsTaxYield: 45, productionYield: 120, governanceEfficiency: 15, foodUpkeep: 3, waterUpkeep: 3 },
    { untrainedUnits: 35, metal: 3500, crystal: 3000, naquadah: 800, credits: 1100 },
    'polytech_guild', 4
  ),

  // ==========================================
  // SECTION 6: IMPERIAL GOVERNANCE, LAW & CHANCELLERY (10 Units)
  // ==========================================
  createUnit(
    'gv_01', 'Colonial Census Registrar', 'government',
    'Civil Registry', 'Population Statistics Division', 'Registrar', 'Birth & Labor Recorder',
    'Clerk First Class', 1,
    'Catalogs every birth, skill, and draft status across colonial hab-blocks.',
    { creditsTaxYield: 10, governanceEfficiency: 5, foodUpkeep: 1, waterUpkeep: 1, creditsUpkeep: 1 },
    { untrainedUnits: 5, metal: 150, crystal: 250, naquadah: 20, credits: 150 },
    'imperial_chancellery', 1
  ),
  createUnit(
    'gv_02', 'Imperial Tax Auditor', 'government',
    'Treasury Department', 'Revenue Collection Division', 'Tax Auditor', 'Customs Tariff Examiner',
    'Revenue Collector', 1,
    'Enforces the Emperor\'s taxes on starship trade cargo, preventing black-market smuggling.',
    { creditsTaxYield: 25, governanceEfficiency: 8, foodUpkeep: 2, waterUpkeep: 1, creditsUpkeep: 2 },
    { untrainedUnits: 8, metal: 250, crystal: 400, naquadah: 50, credits: 300 },
    'imperial_chancellery', 1
  ),
  createUnit(
    'gv_03', 'Colonial Magistrate Judge', 'government',
    'Judiciary Chancellery', 'Imperial Law Division', 'Magistrate', 'Circuit Court Judge',
    'Honorable Magistrate', 2,
    'Maintains public order and settles corporate disputes with swift, indisputable imperial decrees.',
    { creditsTaxYield: 40, governanceEfficiency: 15, counterIntel: 10, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 4 },
    { untrainedUnits: 12, metal: 600, crystal: 800, naquadah: 150, credits: 600 },
    'imperial_chancellery', 2
  ),
  createUnit(
    'gv_04', 'Planetary Propaganda Minister', 'government',
    'Information Ministry', 'Public Morale Division', 'Propagandist', 'Broadcast Director',
    'Minister of Truth', 2,
    'Broadcasts inspirational news of imperial fleet triumphs to maintain high public morale.',
    { creditsTaxYield: 30, governanceEfficiency: 20, defense: 10, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 5 },
    { untrainedUnits: 15, metal: 800, crystal: 1100, naquadah: 200, credits: 800 },
    'imperial_chancellery', 2
  ),
  createUnit(
    'gv_05', 'High Inquisitor of Imperial Loyalty', 'government',
    'Loyalty Enforcement', 'Anti-Treason Directorate', 'Inquisitor', 'Purge Commissioner',
    'Grand Inquisitor', 3,
    'Identifies and executes governors harboring treacherous or rebellious sentiments.',
    { counterIntel: 60, governanceEfficiency: 35, attack: 20, foodUpkeep: 3, waterUpkeep: 2, creditsUpkeep: 10 },
    { untrainedUnits: 20, metal: 1400, crystal: 1800, naquadah: 500, credits: 1400 },
    'imperial_chancellery', 3
  ),
  createUnit(
    'gv_06', 'Interstellar Trade Envoy', 'government',
    'Diplomatic Corps', 'Commercial Treaties Division', 'Trade Envoy', 'Tariff Negotiator',
    'Minister Plenipotentiary', 3,
    'Negotiates favorable trade routes, raw metal exchanges, and zero-tariff shipping lanes.',
    { creditsTaxYield: 80, governanceEfficiency: 25, foodUpkeep: 3, waterUpkeep: 3, creditsUpkeep: 12 },
    { untrainedUnits: 22, metal: 1800, crystal: 2400, naquadah: 700, credits: 1800 },
    'imperial_chancellery', 3
  ),
  createUnit(
    'gv_07', 'Colonial Planetary Governor', 'government',
    'Colonial Chancellery', 'Executive Planetary Administration', 'Governor', 'Viceroy of the Sector',
    'Lord Governor', 4,
    'Oversees economic production, resource distribution, and garrison defense on an entire world.',
    { creditsTaxYield: 150, governanceEfficiency: 60, defense: 40, foodUpkeep: 4, waterUpkeep: 4, creditsUpkeep: 20 },
    { untrainedUnits: 30, metal: 3500, crystal: 4500, naquadah: 1500, credits: 3500 },
    'imperial_chancellery', 4
  ),
  createUnit(
    'gv_08', 'AI Governance Core Overseer', 'government',
    'Cybernetic Bureaucracy', 'Automated Administration Division', 'AI Overseer', 'Algorithm Architect',
    'Chief Systems Chancellor', 4,
    'Supervises sentient bureaucratic supercomputers optimizing resource pipelines flawlessly.',
    { creditsTaxYield: 220, governanceEfficiency: 90, productionYield: 80, foodUpkeep: 2, waterUpkeep: 2, creditsUpkeep: 28 },
    { untrainedUnits: 35, metal: 5000, crystal: 7000, naquadah: 2500, credits: 5000 },
    'imperial_chancellery', 4
  ),
  createUnit(
    'gv_09', 'Grand Vizier of the Imperial Court', 'government',
    'Supreme Council', 'Imperial Chancellery', 'Vizier', 'Imperial Seal Bearer',
    'Lord High Chancellor', 5,
    'Second only to the Emperor, drafting decrees that redirect star systems\' entire GDP.',
    { creditsTaxYield: 450, governanceEfficiency: 160, counterIntel: 80, foodUpkeep: 5, waterUpkeep: 5, creditsUpkeep: 45 },
    { untrainedUnits: 50, metal: 12000, crystal: 16000, naquadah: 6000, credits: 12000 },
    'imperial_chancellery', 5
  ),
  createUnit(
    'gv_10', 'Imperial Throne Archon Praetor', 'government',
    'Apex Chancellery', 'Crown Executive Command', 'Archon', 'Viceroy of the Galactic Core',
    'Archon Praetor', 5,
    'Represents the divine will of the Emperor, wielding supreme executive command across all domains.',
    { creditsTaxYield: 750, governanceEfficiency: 250, attack: 100, defense: 100, foodUpkeep: 8, waterUpkeep: 8, creditsUpkeep: 70 },
    { untrainedUnits: 80, metal: 25000, crystal: 30000, naquadah: 12000, credits: 25000 },
    'imperial_chancellery', 5
  ),

  // ==========================================
  // SECTION 7: RAW CITIZEN & UNTRAINED CONSCIPT TIERS (8 Units)
  // ==========================================
  createUnit(
    'ut_01', 'Raw Citizen Enlistee', 'untrained',
    'Civilian Reserve', 'Unassigned Citizenry', 'Raw Recruit', 'Volunteer Civilian',
    'Citizen', 1,
    'Civilian willing to enlist and receive specialized training at any Academy wing.',
    { foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 50, crystal: 20, naquadah: 0, credits: 20 },
    'war_college', 1
  ),
  createUnit(
    'ut_02', 'Imperial Draft Conscript', 'untrained',
    'Draft Directorate', 'Compulsory Conscription Division', 'Conscript', 'Drafted Citizen',
    'Recruit', 1,
    'Mobilized from planetary industrial sectors into raw training pools for immediate assignment.',
    { defense: 2, foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 80, crystal: 30, naquadah: 5, credits: 30 },
    'war_college', 1
  ),
  createUnit(
    'ut_03', 'Colonial Frontier Pioneer', 'untrained',
    'Colonization Board', 'Frontier Exploration Division', 'Pioneer', 'Homestead Settler',
    'Settler', 1,
    'Hardened survivalists ready to specialize in agro-farms or orbital defense garrisons.',
    { foodYield: 10, waterYield: 10, defense: 3, foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 100, crystal: 50, naquadah: 10, credits: 40 },
    'polytech_guild', 1
  ),
  createUnit(
    'ut_04', 'Academy Cadet Aspirant', 'untrained',
    'Cadet Corps', 'Preparatory Military School', 'Cadet', 'Junior Officer Candidate',
    'Cadet 3rd Class', 1,
    'High-aptitude youth receiving foundational doctrine before choosing a specialized branch.',
    { defense: 4, foodUpkeep: 1, waterUpkeep: 1, creditsUpkeep: 1 },
    { untrainedUnits: 1, metal: 120, crystal: 80, naquadah: 15, credits: 60 },
    'war_college', 1
  ),
  createUnit(
    'ut_05', 'Indentured Factory Laborer', 'untrained',
    'Labor Guild', 'Penal & Debt Reclamation Division', 'Laborer', 'Heavy Hauler',
    'Laborer', 1,
    'Working off imperial debts by doing grueling physical gruntwork in mines and foundries.',
    { productionYield: 15, foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 60, crystal: 30, naquadah: 5, credits: 15 },
    'geological_institute', 1
  ),
  createUnit(
    'ut_06', 'Civilian Defense Militia Volunteer', 'untrained',
    'Home Guard', 'Emergency Defense Division', 'Militiaman', 'Armed Civilian Volunteer',
    'Volunteer', 1,
    'Armed with standard hunting rifles to protect local settlements against pirate raids.',
    { attack: 5, defense: 8, foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 150, crystal: 60, naquadah: 10, credits: 50 },
    'defense_proving', 1
  ),
  createUnit(
    'ut_07', 'Technical Apprentice Intern', 'untrained',
    'Polytech Academy', 'Vocational Training Division', 'Apprentice', 'Workshop Intern',
    'Intern', 1,
    'Students learning robotics, metallurgy, and water filtration under senior guild engineers.',
    { productionYield: 10, creditsTaxYield: 2, foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 140, crystal: 100, naquadah: 15, credits: 70 },
    'polytech_guild', 1
  ),
  createUnit(
    'ut_08', 'Auxiliary Support Reservist', 'untrained',
    'Reserve Corps', 'Logistics Reserve Division', 'Reservist', 'Support Team Auxiliary',
    'Reservist Private', 1,
    'Off-duty soldiers and retired veterans who can be activated during planetary emergencies.',
    { defense: 10, attack: 4, foodUpkeep: 1, waterUpkeep: 1 },
    { untrainedUnits: 1, metal: 180, crystal: 90, naquadah: 20, credits: 80 },
    'war_college', 1
  ),
];

// Default Experience & Progression Generator
export function createDefaultUnitExperience(): Record<string, UnitExperienceData> {
  const result: Record<string, UnitExperienceData> = {};

  WORKFORCE_90_UNITS.forEach((unit, idx) => {
    // Give initial deployed units reasonable starting XP
    let startingXP = 0;
    let startingRank = 0;
    let activeDoctrineId = 'balanced_standard';

    if (unit.id === 'fl_01') {
      startingXP = 160;
      startingRank = 1;
      activeDoctrineId = 'aggressive_assault';
    } else if (unit.id === 'fl_02') {
      startingXP = 380;
      startingRank = 2;
      activeDoctrineId = 'aggressive_assault';
    } else if (unit.id === 'od_01') {
      startingXP = 210;
      startingRank = 1;
      activeDoctrineId = 'hardened_bulwark';
    } else if (unit.id === 'od_02') {
      startingXP = 340;
      startingRank = 2;
      activeDoctrineId = 'hardened_bulwark';
    } else if (unit.id === 'nm_01') {
      startingXP = 320;
      startingRank = 2;
      activeDoctrineId = 'industrial_overdrive';
    } else if (unit.id === 'nm_02') {
      startingXP = 140;
      startingRank = 1;
      activeDoctrineId = 'industrial_overdrive';
    } else if (unit.id === 'es_01') {
      startingXP = 180;
      startingRank = 1;
      activeDoctrineId = 'ghost_protocol';
    } else if (unit.id === 'cp_01' || unit.id === 'cp_02') {
      startingXP = 90;
      startingRank = 0;
      activeDoctrineId = 'logistics_optimization';
    } else {
      // Proportional baseline based on index
      startingXP = Math.floor((idx % 7) * 20);
      startingRank = 0;
    }

    result[unit.id] = {
      unitId: unit.id,
      xp: startingXP,
      currentRank: startingRank,
      highestRankReached: startingRank,
      totalCombatBattles: startingRank > 0 ? startingRank * 8 : 0,
      totalMissionsCompleted: startingRank > 0 ? startingRank * 5 : 0,
      activeDoctrineId,
      promotedAt: startingRank > 0 ? 'Imperial Charter Formation' : undefined,
    };
  });

  return result;
}

// Helpers for Promotion & Veterancy
export function getUnitRank(expData?: UnitExperienceData): PromotionRank {
  if (!expData) return PROMOTION_RANKS[0];
  const rankIdx = Math.min(PROMOTION_RANKS.length - 1, Math.max(0, expData.currentRank || 0));
  return PROMOTION_RANKS[rankIdx] || PROMOTION_RANKS[0];
}

export function getNextRank(currentRank: number): PromotionRank | null {
  if (currentRank >= PROMOTION_RANKS.length - 1) return null;
  return PROMOTION_RANKS[currentRank + 1] || null;
}

export function canPromoteUnit(expData?: UnitExperienceData): boolean {
  if (!expData) return false;
  const next = getNextRank(expData.currentRank);
  if (!next) return false;
  return expData.xp >= next.xpRequired;
}

export function promoteUnitRank(expData: UnitExperienceData): UnitExperienceData {
  const next = getNextRank(expData.currentRank);
  if (!next || expData.xp < next.xpRequired) return expData;
  const newRank = next.tier;
  return {
    ...expData,
    currentRank: newRank,
    highestRankReached: Math.max(expData.highestRankReached, newRank),
    promotedAt: new Date().toLocaleDateString(),
  };
}

// Initial State helper
export const DEFAULT_WORKFORCE_ACADEMY_STATE: WorkforceAcademyState = {
  unitCounts: {
    // Starting workforce distribution
    fl_01: 500, // Line Infantry
    fl_02: 120, // Trench Grenadiers
    od_01: 450, // Citadel Sentinels
    od_02: 80,  // Flak Battery Gunners
    nm_01: 850, // Borehole Miners
    nm_02: 150, // Seismic Geologists
    es_01: 65,  // Informants
    es_02: 30,  // Wiretappers
    cp_01: 2400, // Crop Harvesters
    cp_02: 1800, // Desalination Workers
    cp_05: 650,  // Metal Foundrymen
    cp_06: 420,  // Crystal Refiners
    gv_01: 200,  // Census Registrars
    gv_02: 110,  // Tax Auditors
    ut_01: 1600, // Raw Citizen Enlistees
    ut_02: 900,  // Conscripts
  },
  wingLevels: {
    war_college: 2,
    defense_proving: 2,
    geological_institute: 3,
    shadow_division: 2,
    polytech_guild: 3,
    imperial_chancellery: 2,
  },
  autoDraftRate: 10,
  autoDraftTargetBranch: 'frontline',
  academyDrillScore: 2840,
  academyDrillRank: 'Centurion 2nd Class',
  unitExperience: createDefaultUnitExperience(),
  totalCombatSimulationsRun: 4,
};

// Summary metrics calculation helper with Persistent Veterancy & Doctrine multipliers
export function calculateWorkforceTotals(
  unitCounts: Record<string, number>,
  unitExperience?: Record<string, UnitExperienceData>
) {
  let totalPersonnel = 0;
  let totalAttack = 0;
  let totalDefense = 0;
  let totalMiningYield = 0;
  let totalProductionYield = 0;
  let totalFoodYield = 0;
  let totalWaterYield = 0;
  let totalCreditsTax = 0;
  let totalFoodUpkeep = 0;
  let totalWaterUpkeep = 0;
  let totalCreditsUpkeep = 0;
  let totalEspionage = 0;
  let totalCounterIntel = 0;
  let totalGovernance = 0;

  const branchCounts: Record<WorkforceBranch, number> = {
    frontline: 0,
    orbital_defense: 0,
    naquadah_mining: 0,
    espionage: 0,
    civilian_production: 0,
    government: 0,
    untrained: 0,
  };

  WORKFORCE_90_UNITS.forEach((unit) => {
    const count = unitCounts[unit.id] || 0;
    if (count <= 0) return;

    totalPersonnel += count;
    branchCounts[unit.branch] += count;

    // Retrieve persistent veterancy rank & doctrine specialization for this unit
    const exp = unitExperience?.[unit.id];
    const rankTier = exp ? exp.currentRank : 0;
    const rankInfo = PROMOTION_RANKS[Math.min(PROMOTION_RANKS.length - 1, Math.max(0, rankTier))] || PROMOTION_RANKS[0];
    const doctrine = UNIT_DOCTRINES.find((d) => d.id === exp?.activeDoctrineId) || UNIT_DOCTRINES[0];

    // Compute multiplicative modifiers
    const attackMult = rankInfo.attackMult * (1 + (doctrine.attackMod / 100));
    const defenseMult = rankInfo.defenseMult * (1 + (doctrine.defenseMod / 100));
    const yieldMult = rankInfo.yieldMult * (1 + (doctrine.yieldMod / 100));
    const upkeepDiscount = (rankInfo.upkeepDiscountPct || 0) / 100;
    const upkeepMult = Math.max(0.15, (1 - upkeepDiscount) * (1 + (doctrine.upkeepMod / 100)));
    const espionageMult = 1 + (doctrine.espionageMod / 100);

    // Direct proportional scaling with persistent rank multipliers
    totalAttack += (unit.stats.attack * count * attackMult);
    totalDefense += (unit.stats.defense * count * defenseMult);
    totalMiningYield += (unit.stats.miningYield * count * yieldMult) / 100;
    totalProductionYield += (unit.stats.productionYield * count * yieldMult) / 100;
    totalFoodYield += (unit.stats.foodYield * count * yieldMult) / 100;
    totalWaterYield += (unit.stats.waterYield * count * yieldMult) / 100;
    totalCreditsTax += (unit.stats.creditsTaxYield * count * yieldMult) / 100;
    totalFoodUpkeep += (unit.stats.foodUpkeep * count * upkeepMult) / 100;
    totalWaterUpkeep += (unit.stats.waterUpkeep * count * upkeepMult) / 100;
    totalCreditsUpkeep += (unit.stats.creditsUpkeep * count * upkeepMult) / 100;
    totalEspionage += (unit.stats.espionagePower * count * espionageMult);
    totalCounterIntel += (unit.stats.counterIntel * count * espionageMult);
    totalGovernance += (unit.stats.governanceEfficiency * count * yieldMult);
  });

  return {
    totalPersonnel,
    branchCounts,
    totalAttack: Math.round(totalAttack),
    totalDefense: Math.round(totalDefense),
    totalMiningYield: Math.round(totalMiningYield),
    totalProductionYield: Math.round(totalProductionYield),
    totalFoodYield: Math.round(totalFoodYield),
    totalWaterYield: Math.round(totalWaterYield),
    totalCreditsTax: Math.round(totalCreditsTax),
    totalFoodUpkeep: Math.round(totalFoodUpkeep),
    totalWaterUpkeep: Math.round(totalWaterUpkeep),
    totalCreditsUpkeep: Math.round(totalCreditsUpkeep),
    totalEspionage: Math.round(totalEspionage),
    totalCounterIntel: Math.round(totalCounterIntel),
    totalGovernance: Math.round(totalGovernance),
  };
}
