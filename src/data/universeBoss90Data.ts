export interface UniverseWorld {
  id: string;
  universeId: number;
  galaxyId: number;
  system: number;
  position: number;
  name: string;
  biome: 'Volcanic' | 'Glacial' | 'Precursor Void' | 'Cybernetic Matrix' | 'Ocean Leviathan' | 'Dark Matter Nebula' | 'Crystalline Bastion' | 'Quantum Anomaly' | 'Singularity Core' | 'Plasma Rift' | 'Terrestrial';
  hazardLevel: number; // 1 to 10
  resourceMultiplier: number; // 0.5 to 5.0
  hasPrecursorRuins: boolean;
  defenseGridLevel: number; // 0 to 10
  guardBossName?: string;
  stargateCoordinates: string; // e.g. "U03:G42:S219:P07"
  description: string;
  createdByUser: boolean;
  createdAt: string;
}

export interface BossAbility {
  id: string;
  name: string;
  type: 'damage' | 'shield_heal' | 'debuff' | 'swarm_summon' | 'ultimate_annihilation';
  power: number;
  cooldownTicks: number;
  description: string;
}

export interface BossPhase {
  phaseNumber: number;
  healthThresholdPercent: number; // e.g., 100, 60, 25
  phaseName: string;
  shieldMultiplier: number;
  bonusAttackMultiplier: number;
  unlockedAbilities: string[];
  dialogue: string;
}

export interface GalaxyAndArcBoss {
  id: string;
  name: string;
  title: string;
  type: 'galaxy_boss' | 'arc_boss';
  universeId: number;
  galaxyId: number;
  arcNumber?: number; // 1 to 10 for Arc Bosses
  level: number; // 50 to 90
  maxHealth: number;
  maxShield: number;
  armor: number;
  attackPower: number;
  enrageTicks: number; // Ticks before soft/hard enrage
  weaknessClass: string;
  resistanceTypes: string[];
  phases: BossPhase[];
  abilities: BossAbility[];
  loot: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    precursorArtifacts: number;
    schematicDrop: string;
  };
  description: string;
}

export interface Class90Entry {
  classId: number; // 1 to 90
  primaryCategory: string; // Category I to Category X
  subClass: string;
  typeName: string;
  subType: string;
  tier: number; // 1 to 10
  attack: number;
  defense: number;
  shield: number;
  speed: number;
  cargo: number;
  energyCost: number;
  cost: { metal: number; crystal: number; deuterium: number };
  weaponType: string;
  targetWeakness: string;
  vulnerableTo: string;
  specialAbility: {
    name: string;
    effect: string;
    procChance: string;
  };
  description: string;
  gameLogicMechanics: string;
}

// ============================================================================
// DEFAULT UNIVERSE WORLDS DATA
// ============================================================================
export const DEFAULT_UNIVERSE_WORLDS: UniverseWorld[] = [
  {
    id: 'world_u1_g1_1',
    universeId: 1,
    galaxyId: 1,
    system: 104,
    position: 4,
    name: 'Aegis Prime - Capital World',
    biome: 'Terrestrial',
    hazardLevel: 1,
    resourceMultiplier: 1.5,
    hasPrecursorRuins: true,
    defenseGridLevel: 8,
    guardBossName: 'Aegis Sector Sentinel',
    stargateCoordinates: 'U01:G01:S104:P04',
    description: 'The historic seat of the First Universe command grid, fortified with orbital defense rings and precursor energy collectors.',
    createdByUser: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'world_u1_g12_2',
    universeId: 1,
    galaxyId: 12,
    system: 219,
    position: 7,
    name: 'Pyros-IX Volcanic Furnace',
    biome: 'Volcanic',
    hazardLevel: 7,
    resourceMultiplier: 3.2,
    hasPrecursorRuins: false,
    defenseGridLevel: 5,
    guardBossName: 'Infernal Magma Leviathan',
    stargateCoordinates: 'U01:G12:S219:P07',
    description: 'Surfaced with molten titanium oceans and active magma fissures. Generates exceptional metal yields despite intense mantle storms.',
    createdByUser: false,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'world_u3_g42_3',
    universeId: 3,
    galaxyId: 42,
    system: 310,
    position: 12,
    name: 'Frostbite Citadel - Boreas',
    biome: 'Glacial',
    hazardLevel: 6,
    resourceMultiplier: 2.8,
    hasPrecursorRuins: true,
    defenseGridLevel: 6,
    guardBossName: 'Cryo-Dreadnought Ymir',
    stargateCoordinates: 'U03:G42:S310:P12',
    description: 'Sub-zero glacial super-structure holding hyper-dense subterranean deuterium ice caverns.',
    createdByUser: false,
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 'world_u5_g88_4',
    universeId: 5,
    galaxyId: 88,
    system: 450,
    position: 1,
    name: 'Void-Nexus 09 Singularity',
    biome: 'Precursor Void',
    hazardLevel: 10,
    resourceMultiplier: 5.0,
    hasPrecursorRuins: true,
    defenseGridLevel: 10,
    guardBossName: 'Void Weaver Xathros (Arc Boss #2)',
    stargateCoordinates: 'U05:G88:S450:P01',
    description: 'A collapsed star enveloped in ancient Precursor obelisks. Siphons dark matter and quantum field energy directly from hyperspace.',
    createdByUser: false,
    createdAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 'world_u7_g15_5',
    universeId: 7,
    galaxyId: 15,
    system: 88,
    position: 9,
    name: 'Cybertronica Matrix Core',
    biome: 'Cybernetic Matrix',
    hazardLevel: 8,
    resourceMultiplier: 4.0,
    hasPrecursorRuins: true,
    defenseGridLevel: 9,
    guardBossName: 'Cybernetic Hivemind Paragon (Arc Boss #9)',
    stargateCoordinates: 'U07:G15:S088:P09',
    description: 'An entirely synthetic metallic world composed of interconnecting neural circuitry, sentient AI nodes, and automated factory hives.',
    createdByUser: false,
    createdAt: '2026-01-05T00:00:00Z',
  },
];

// LocalStorage helper for worlds
export function loadCustomWorlds(): UniverseWorld[] {
  try {
    const saved = localStorage.getItem('uc_custom_universe_worlds');
    if (saved) {
      const parsed = JSON.parse(saved);
      return [...DEFAULT_UNIVERSE_WORLDS, ...parsed];
    }
  } catch (e) {
    console.error('Failed to load custom universe worlds', e);
  }
  return DEFAULT_UNIVERSE_WORLDS;
}

export function saveCustomWorld(world: UniverseWorld): UniverseWorld[] {
  const currentCustom = loadCustomWorlds().filter((w) => w.createdByUser);
  const updatedCustom = [world, ...currentCustom];
  localStorage.setItem('uc_custom_universe_worlds', JSON.stringify(updatedCustom));
  return [...DEFAULT_UNIVERSE_WORLDS, ...updatedCustom];
}

// ============================================================================
// GALAXY BOSSES & ARC BOSSES DATA (LEVEL 50 - 90)
// ============================================================================
export const GALAXY_AND_ARC_BOSSES: GalaxyAndArcBoss[] = [
  // --- 10 MULTIVERSE ARC BOSSES (CAMPAIGN TITANS) ---
  {
    id: 'arc_boss_1',
    name: 'Chrono-Titan Kronos',
    title: 'Arc Boss #1 · Temporal Multiverse Overlord',
    type: 'arc_boss',
    universeId: 1,
    galaxyId: 1,
    arcNumber: 1,
    level: 90,
    maxHealth: 15000000,
    maxShield: 10000000,
    armor: 8500,
    attackPower: 125000,
    enrageTicks: 25,
    weaknessClass: 'Category IV: Heavy Battleships & Dreadnoughts',
    resistanceTypes: ['Temporal Displacement', 'Kinetic Missiles'],
    phases: [
      {
        phaseNumber: 1,
        healthThresholdPercent: 100,
        phaseName: 'Chrono-Barrier Phase',
        shieldMultiplier: 2.0,
        bonusAttackMultiplier: 1.0,
        unlockedAbilities: ['ability_time_warp', 'ability_stasis_beam'],
        dialogue: 'Mortal fleets cannot turn back the sands of temporal destiny!',
      },
      {
        phaseNumber: 2,
        healthThresholdPercent: 50,
        phaseName: 'Temporal Paradox Enrage',
        shieldMultiplier: 1.0,
        bonusAttackMultiplier: 1.8,
        unlockedAbilities: ['ability_time_warp', 'ability_stasis_beam', 'ability_temporal_collapse'],
        dialogue: 'I fracture the timeline! Your ships decay into cosmic dust!',
      },
      {
        phaseNumber: 3,
        healthThresholdPercent: 20,
        phaseName: 'Cataclysmic Singularity Rebirth',
        shieldMultiplier: 0.5,
        bonusAttackMultiplier: 2.5,
        unlockedAbilities: ['ability_ultimate_time_annihilation'],
        dialogue: 'ALL UNIVERSES RETURN TO THE CHRONO ZERO POINT!',
      },
    ],
    abilities: [
      {
        id: 'ability_time_warp',
        name: 'Temporal Disruption Blast',
        type: 'damage',
        power: 85000,
        cooldownTicks: 3,
        description: 'Fires localized time-distortion waves that decelerate target fleet weapon recharge speeds.',
      },
      {
        id: 'ability_stasis_beam',
        name: 'Tachyon Stasis Field',
        type: 'debuff',
        power: 40000,
        cooldownTicks: 5,
        description: 'Locks leading capital ships in static stasis, preventing shields from regenerating.',
      },
      {
        id: 'ability_temporal_collapse',
        name: 'Chronos Paradox Swarm',
        type: 'swarm_summon',
        power: 120000,
        cooldownTicks: 6,
        description: 'Summons temporal echo phantoms of destroyed enemy frigates.',
      },
      {
        id: 'ability_ultimate_time_annihilation',
        name: 'Chrono-Zero Collapse',
        type: 'ultimate_annihilation',
        power: 450000,
        cooldownTicks: 10,
        description: 'Unleashes a universe-wide temporal blast that deals immense damage to all active battle lines.',
      },
    ],
    loot: {
      metal: 50000000,
      crystal: 35000000,
      deuterium: 20000000,
      darkMatter: 250000,
      precursorArtifacts: 15,
      schematicDrop: 'Class-IX Precursor Chrono-Monolith Blueprint',
    },
    description: 'An ancient primordial titan that manipulates the continuum of time. Guarding Universe 01 Arc Gateway.',
  },
  {
    id: 'arc_boss_2',
    name: 'Void Weaver Xathros',
    title: 'Arc Boss #2 · Dark Matter Sovereign',
    type: 'arc_boss',
    universeId: 5,
    galaxyId: 88,
    arcNumber: 2,
    level: 90,
    maxHealth: 18000000,
    maxShield: 12000000,
    armor: 9200,
    attackPower: 140000,
    enrageTicks: 22,
    weaknessClass: 'Category IX: Precursor & Super-Capital Flagships',
    resistanceTypes: ['Dark Matter Waves', 'Plasma Flak'],
    phases: [
      {
        phaseNumber: 1,
        healthThresholdPercent: 100,
        phaseName: 'Abyssal Void Shroud',
        shieldMultiplier: 2.5,
        bonusAttackMultiplier: 1.0,
        unlockedAbilities: ['ability_void_drain', 'ability_dark_tendril'],
        dialogue: 'The dark matter cosmos consumes all light!',
      },
      {
        phaseNumber: 2,
        healthThresholdPercent: 45,
        phaseName: 'Singularity Weaver Stance',
        shieldMultiplier: 1.2,
        bonusAttackMultiplier: 2.0,
        unlockedAbilities: ['ability_void_drain', 'ability_dark_tendril', 'ability_singularity_rift'],
        dialogue: 'Taste the vacuum of pure entropy!',
      },
    ],
    abilities: [
      {
        id: 'ability_void_drain',
        name: 'Antimatter Siphon',
        type: 'shield_heal',
        power: 110000,
        cooldownTicks: 4,
        description: 'Siphons deuterium and shield energy from the attacking fleet to reconstruct boss barrier.',
      },
      {
        id: 'ability_dark_tendril',
        name: 'Void Filament Strike',
        type: 'damage',
        power: 160000,
        cooldownTicks: 3,
        description: 'Pierces through enemy hull armor with dark energy filaments.',
      },
      {
        id: 'ability_singularity_rift',
        name: 'Event Horizon Nova',
        type: 'ultimate_annihilation',
        power: 500000,
        cooldownTicks: 8,
        description: 'Creates a localized black hole that crushes frontline dreadnoughts.',
      },
    ],
    loot: {
      metal: 75000000,
      crystal: 50000000,
      deuterium: 30000000,
      darkMatter: 350000,
      precursorArtifacts: 20,
      schematicDrop: 'Class-X Void Weaver Apex Engine Schematic',
    },
    description: 'Entity born from the supermassive black hole at the center of Galaxy 88. Absorbs light and energy.',
  },
  {
    id: 'arc_boss_3',
    name: 'Solar Leviathan Sol-Ra',
    title: 'Arc Boss #3 · Stellar Plasma Incarnate',
    type: 'arc_boss',
    universeId: 10,
    galaxyId: 30,
    arcNumber: 3,
    level: 88,
    maxHealth: 14000000,
    maxShield: 9000000,
    armor: 7800,
    attackPower: 115000,
    enrageTicks: 28,
    weaknessClass: 'Category II: Heavy Corvettes & Frigates',
    resistanceTypes: ['Thermal Plasma', 'Solar Beams'],
    phases: [
      {
        phaseNumber: 1,
        healthThresholdPercent: 100,
        phaseName: 'Coronal Mass Ejection',
        shieldMultiplier: 1.8,
        bonusAttackMultiplier: 1.1,
        unlockedAbilities: ['ability_solar_flare', 'ability_prominence_beam'],
        dialogue: 'I shine with the radiance of ten thousand burning suns!',
      },
      {
        phaseNumber: 2,
        healthThresholdPercent: 40,
        phaseName: 'Supernova Meltdown',
        shieldMultiplier: 0.8,
        bonusAttackMultiplier: 2.2,
        unlockedAbilities: ['ability_solar_flare', 'ability_prominence_beam', 'ability_supernova_nova'],
        dialogue: 'FEEL THE BURNING HEAT OF STELLAR COLLAPSE!',
      },
    ],
    abilities: [
      {
        id: 'ability_solar_flare',
        name: 'Solar Flare Cascade',
        type: 'damage',
        power: 95000,
        cooldownTicks: 2,
        description: 'Erupts with high-energy plasma arcs across all escorts and fighters.',
      },
      {
        id: 'ability_prominence_beam',
        name: 'Prominence Plasma Beam',
        type: 'damage',
        power: 140000,
        cooldownTicks: 4,
        description: 'Directs a focused solar laser through target flagship shields.',
      },
      {
        id: 'ability_supernova_nova',
        name: 'Stellar Supernova Burst',
        type: 'ultimate_annihilation',
        power: 420000,
        cooldownTicks: 9,
        description: 'Explodes with thermonuclear energy, melting light hulls.',
      },
    ],
    loot: {
      metal: 45000000,
      crystal: 30000000,
      deuterium: 15000000,
      darkMatter: 200000,
      precursorArtifacts: 12,
      schematicDrop: 'Class-VIII Solar Bastion Array Blueprint',
    },
    description: 'A colossal sentient plasma leviathan harvested from the core of a dying red giant star.',
  },

  // --- 5 REPRESENTATIVE GALAXY SECTOR BOSSES (OUT OF 90) ---
  {
    id: 'galaxy_boss_g1',
    name: 'Aegis Sector Sentinel',
    title: 'Galaxy Boss · Galaxy 01 Guardian',
    type: 'galaxy_boss',
    universeId: 1,
    galaxyId: 1,
    level: 65,
    maxHealth: 5000000,
    maxShield: 3000000,
    armor: 4500,
    attackPower: 45000,
    enrageTicks: 30,
    weaknessClass: 'Category I: Light Interceptors',
    resistanceTypes: ['Kinetic Flak'],
    phases: [
      {
        phaseNumber: 1,
        healthThresholdPercent: 100,
        phaseName: 'Aegis Shield Grid',
        shieldMultiplier: 1.5,
        bonusAttackMultiplier: 1.0,
        unlockedAbilities: ['ability_gauss_salvo'],
        dialogue: 'Galaxy 01 airspace restricted. Defense protocol active.',
      },
    ],
    abilities: [
      {
        id: 'ability_gauss_salvo',
        name: 'Heavy Gauss Cannon Barrage',
        type: 'damage',
        power: 35000,
        cooldownTicks: 3,
        description: 'Fires high-velocity depleted uranium rounds into enemy vanguard fleets.',
      },
    ],
    loot: {
      metal: 10000000,
      crystal: 6000000,
      deuterium: 3000000,
      darkMatter: 50000,
      precursorArtifacts: 4,
      schematicDrop: 'Class-III Railgun Destroyer Schematic',
    },
    description: 'An automated precursor orbital fortress guarding the entry system of Galaxy 01.',
  },
  {
    id: 'galaxy_boss_g12',
    name: 'Infernal Magma Leviathan',
    title: 'Galaxy Boss · Galaxy 12 Guardian',
    type: 'galaxy_boss',
    universeId: 1,
    galaxyId: 12,
    level: 70,
    maxHealth: 7000000,
    maxShield: 4000000,
    armor: 5200,
    attackPower: 60000,
    enrageTicks: 28,
    weaknessClass: 'Category III: Strike Destroyers & Cruisers',
    resistanceTypes: ['Volcanic Thermal'],
    phases: [
      {
        phaseNumber: 1,
        healthThresholdPercent: 100,
        phaseName: 'Magma Crust Fortification',
        shieldMultiplier: 1.6,
        bonusAttackMultiplier: 1.1,
        unlockedAbilities: ['ability_magma_erupt'],
        dialogue: 'The molten depths will drown your fleet!',
      },
    ],
    abilities: [
      {
        id: 'ability_magma_erupt',
        name: 'Sub-Mantle Volcanic Eruption',
        type: 'damage',
        power: 50000,
        cooldownTicks: 3,
        description: 'Launches superheated volcanic debris that melts target armor plating.',
      },
    ],
    loot: {
      metal: 15000000,
      crystal: 9000000,
      deuterium: 4500000,
      darkMatter: 75000,
      precursorArtifacts: 6,
      schematicDrop: 'Class-IV Vulcan Dreadnought Schematic',
    },
    description: 'A serpentine beast forged from molten iron-silicate core crust of Pyros-IX.',
  },
  {
    id: 'galaxy_boss_g42',
    name: 'Cryo-Dreadnought Ymir',
    title: 'Galaxy Boss · Galaxy 42 Guardian',
    type: 'galaxy_boss',
    universeId: 3,
    galaxyId: 42,
    level: 75,
    maxHealth: 8500000,
    maxShield: 5000000,
    armor: 6000,
    attackPower: 75000,
    enrageTicks: 26,
    weaknessClass: 'Category V: Mobile Carrier Hubs & Motherships',
    resistanceTypes: ['Cryo Glacial'],
    phases: [
      {
        phaseNumber: 1,
        healthThresholdPercent: 100,
        phaseName: 'Absolute Zero Aura',
        shieldMultiplier: 1.8,
        bonusAttackMultiplier: 1.2,
        unlockedAbilities: ['ability_blizzard_storm'],
        dialogue: 'Shatter beneath the freeze of Boreas!',
      },
    ],
    abilities: [
      {
        id: 'ability_blizzard_storm',
        name: 'Cryo-Freeze Shockwave',
        type: 'debuff',
        power: 45000,
        cooldownTicks: 4,
        description: 'Freezes target thrusters, reducing fleet evasion by 50%.',
      },
    ],
    loot: {
      metal: 20000000,
      crystal: 12000000,
      deuterium: 8000000,
      darkMatter: 100000,
      precursorArtifacts: 8,
      schematicDrop: 'Class-VII Glacial Deuterium Refiner Blueprint',
    },
    description: 'Ancient glacial warship encased in thousand-year nitrogen ice shields.',
  },
];

// ============================================================================
// COMPLETE 90 CLASS & SUB-CLASS & TYPES & SUB-TYPES HIERARCHY MATRIX (90 ENTRIES)
// ============================================================================
export const SYSTEM_90_CLASSES_MATRIX: Class90Entry[] = [
  // --------------------------------------------------------------------------
  // CATEGORY I: LIGHT INTERCEPTORS (Classes 1 - 9)
  // --------------------------------------------------------------------------
  {
    classId: 1,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Stealth Scout Interceptor',
    subType: 'Viper Mk-I Recon',
    tier: 1,
    attack: 85,
    defense: 45,
    shield: 25,
    speed: 16500,
    cargo: 60,
    energyCost: 5,
    cost: { metal: 3200, crystal: 1600, deuterium: 500 },
    weaponType: 'Dual Light Pulse Lasers',
    targetWeakness: 'Category VI: Stealth Recon & Covert Ops',
    vulnerableTo: 'Category VIII: Orbital Defenses',
    specialAbility: { name: 'Evasion Afterburner', effect: '+25% Dodge Chance vs Heavy Lasers', procChance: '100% Passive' },
    description: 'High-speed light interceptor engineered for atmospheric and deep-space dogfighting.',
    gameLogicMechanics: 'High speed lowers target hit chance by 15%. Gains bonus damage against light scouting probes.',
  },
  {
    classId: 2,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Plasma Dogfighter',
    subType: 'Dart Mk-II Plasma Striker',
    tier: 1,
    attack: 110,
    defense: 55,
    shield: 30,
    speed: 15800,
    cargo: 70,
    energyCost: 8,
    cost: { metal: 4000, crystal: 2000, deuterium: 800 },
    weaponType: 'Superheated Plasma Cannon',
    targetWeakness: 'Category VII: Industrial & Resource Titans',
    vulnerableTo: 'Category II: Heavy Corvettes & Frigates',
    specialAbility: { name: 'Plasma Burn', effect: 'Deals 10% thermal damage over 3 seconds', procChance: '35% On Hit' },
    description: 'Fitted with mini plasma injectors to melt cargo ship hulls in fast strafing runs.',
    gameLogicMechanics: 'Bypasses 20% of target defense armor on initial pass.',
  },
  {
    classId: 3,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Micro-Drone Interceptor',
    subType: 'Sting Mk-III Swarm Drone',
    tier: 2,
    attack: 135,
    defense: 65,
    shield: 40,
    speed: 17200,
    cargo: 80,
    energyCost: 10,
    cost: { metal: 4800, crystal: 2400, deuterium: 1000 },
    weaponType: 'Micro-Swarm Missiles',
    targetWeakness: 'Category I: Light Interceptors',
    vulnerableTo: 'Category II: Flak Corvettes',
    specialAbility: { name: 'Swarm Overwhelm', effect: '+15% Crit Rate against single targets', procChance: '25% On Critical' },
    description: 'Automated micro-interceptor utilizing high-G thrusters and automated swarm AI.',
    gameLogicMechanics: 'When deployed in stacks over 1,000 units, increases total fleet speed by 5%.',
  },
  {
    classId: 4,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Anti-Fighter Ace Striker',
    subType: 'Hornet Mk-IV Interceptor Ace',
    tier: 2,
    attack: 160,
    defense: 80,
    shield: 50,
    speed: 18000,
    cargo: 90,
    energyCost: 12,
    cost: { metal: 5600, crystal: 2800, deuterium: 1200 },
    weaponType: 'High-Velocity Autocannons',
    targetWeakness: 'Category I: Light Interceptors',
    vulnerableTo: 'Category IV: Battleships & Dreadnoughts',
    specialAbility: { name: 'Dogfight Ace', effect: '+40% Rapid Fire vs Light Fighters', procChance: '100% Passive' },
    description: 'The preferred starfighter for veteran combat aces targeting enemy fighter waves.',
    gameLogicMechanics: 'Triggers 3x rapid fire loops against enemy bomber wings.',
  },
  {
    classId: 5,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'EMP Interceptor',
    subType: 'Wasp Mk-V Disruption Craft',
    tier: 3,
    attack: 185,
    defense: 95,
    shield: 70,
    speed: 16000,
    cargo: 100,
    energyCost: 15,
    cost: { metal: 6400, crystal: 3200, deuterium: 1500 },
    weaponType: 'EMP Pulse Cannon',
    targetWeakness: 'Category VIII: Orbital Defenses',
    vulnerableTo: 'Category III: Destroyers',
    specialAbility: { name: 'Ion Disruption', effect: 'Drains 50 Shield Points per shot', procChance: '50% Proc' },
    description: 'Specialized electronic warfare interceptor designed to strip shield barriers.',
    gameLogicMechanics: 'Reduces enemy shield regeneration rate by 25% during active combat turns.',
  },
  {
    classId: 6,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Recon Skimmer',
    subType: 'Falcon Mk-VI High-Orbit Scout',
    tier: 3,
    attack: 210,
    defense: 110,
    shield: 85,
    speed: 19500,
    cargo: 120,
    energyCost: 18,
    cost: { metal: 7200, crystal: 3600, deuterium: 1800 },
    weaponType: 'Long-Range Optical Laser',
    targetWeakness: 'Category VI: Stealth Recon & Covert Ops',
    vulnerableTo: 'Category VIII: Laser Grid Satellites',
    specialAbility: { name: 'Sensor Array Sweep', effect: 'Reveals cloaked fleet compositions', procChance: '100% Passive' },
    description: 'High-altitude orbital skimmer equipped with deep-space sensor telemetry.',
    gameLogicMechanics: 'Prevents enemy stealth fleet ambushes in planetary orbit.',
  },
  {
    classId: 7,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'High-G Kinetic Viper',
    subType: 'Hawk Mk-VII Kinetic Interceptor',
    tier: 4,
    attack: 240,
    defense: 125,
    shield: 100,
    speed: 21000,
    cargo: 140,
    energyCost: 20,
    cost: { metal: 8000, crystal: 4000, deuterium: 2000 },
    weaponType: 'Gauss Micro-Railguns',
    targetWeakness: 'Category II: Heavy Corvettes & Frigates',
    vulnerableTo: 'Category IV: Heavy Dreadnoughts',
    specialAbility: { name: 'Hyper-Velocity Surge', effect: 'First strike attacks deal +30% damage', procChance: 'First Round Only' },
    description: 'Reinforced titanium chassis capable of surviving 30G combat maneuvers.',
    gameLogicMechanics: 'Always attacks first in turn order regardless of opponent speed.',
  },
  {
    classId: 8,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Tachyon Dart Interceptor',
    subType: 'Kestrel Mk-VIII Tachyon Fighter',
    tier: 4,
    attack: 275,
    defense: 140,
    shield: 120,
    speed: 23000,
    cargo: 160,
    energyCost: 25,
    cost: { metal: 8800, crystal: 4400, deuterium: 2300 },
    weaponType: 'Tachyon Beam Emitter',
    targetWeakness: 'Category V: Mobile Carrier Hubs',
    vulnerableTo: 'Category X: Cosmic Arc Titans',
    specialAbility: { name: 'Tachyon Phase-Shift', effect: '30% chance to ignore incoming attack', procChance: '30% Passive' },
    description: 'Utilizes sub-light tachyon field generators to phase through physical projectiles.',
    gameLogicMechanics: 'Grants immunity against non-beam kinetic damage on 1 out of 3 hits.',
  },
  {
    classId: 9,
    primaryCategory: 'Category I: Light Interceptors',
    subClass: 'Class-I Light Fighter',
    typeName: 'Atmospheric Strafer',
    subType: 'Swift Mk-IX Ground Attack Interceptor',
    tier: 5,
    attack: 310,
    defense: 160,
    shield: 140,
    speed: 25000,
    cargo: 200,
    energyCost: 30,
    cost: { metal: 9600, crystal: 4800, deuterium: 2600 },
    weaponType: 'Heavy Thermite Cluster Bombs',
    targetWeakness: 'Category VIII: Orbital Defenses & Planetary Satellites',
    vulnerableTo: 'Category III: Anti-Air Strike Cruisers',
    specialAbility: { name: 'Orbital Bombardment', effect: '+50% damage against planetary defense turrets', procChance: '100% Passive' },
    description: 'Armored strike fighter optimized for atmospheric planetary invasion sweeps.',
    gameLogicMechanics: 'Increases ground conquest capture speed by 20%.',
  },

  // --------------------------------------------------------------------------
  // CATEGORY II: HEAVY CORVETTES & FRIGATES (Classes 10 - 18)
  // --------------------------------------------------------------------------
  {
    classId: 10,
    primaryCategory: 'Category II: Heavy Corvettes & Frigates',
    subClass: 'Class-II Escort Corvette',
    typeName: 'Heavy Rail Frigate',
    subType: 'Gladiator Class-1 Rail Frigate',
    tier: 1,
    attack: 280,
    defense: 320,
    shield: 160,
    speed: 9500,
    cargo: 450,
    energyCost: 25,
    cost: { metal: 13000, crystal: 6500, deuterium: 2200 },
    weaponType: 'Twin-Linked Heavy Railguns',
    targetWeakness: 'Category I: Light Interceptors',
    vulnerableTo: 'Category III: Strike Destroyers',
    specialAbility: { name: 'Vanguard Wall', effect: 'Absorbs 15% damage intended for allied fighters', procChance: '100% Passive' },
    description: 'Heavily armored escort frigate built to form defensive screen walls.',
    gameLogicMechanics: 'Redirects single-target damage away from lighter interceptors.',
  },
  {
    classId: 11,
    primaryCategory: 'Category II: Heavy Corvettes & Frigates',
    subClass: 'Class-II Escort Corvette',
    typeName: 'Point-Defense Escort',
    subType: 'Sentinel Class-2 Flak Escort',
    tier: 1,
    attack: 310,
    defense: 360,
    shield: 190,
    speed: 9800,
    cargo: 500,
    energyCost: 30,
    cost: { metal: 14500, crystal: 7200, deuterium: 2500 },
    weaponType: 'Rotary Point-Defense Flak Turrets',
    targetWeakness: 'Category I: Light Interceptors',
    vulnerableTo: 'Category IV: Battleships & Dreadnoughts',
    specialAbility: { name: 'Flak Screen', effect: 'Destroys incoming torpedoes and drone swarms', procChance: '40% Proc' },
    description: 'Equipped with rapid-firing flak cannons to neutralize fighter wings and torpedoes.',
    gameLogicMechanics: 'Reduces incoming torpedo damage to entire fleet by 25%.',
  },

  // --------------------------------------------------------------------------
  // CATEGORY III: STRIKE DESTROYERS & CRUISERS (Classes 19 - 27)
  // --------------------------------------------------------------------------
  {
    classId: 19,
    primaryCategory: 'Category III: Strike Destroyers & Cruisers',
    subClass: 'Class-III Capital Hunter Destroyer',
    typeName: 'Plasma Strike Destroyer',
    subType: 'Manticore V-1 Destroyer',
    tier: 1,
    attack: 800,
    defense: 950,
    shield: 550,
    speed: 6200,
    cargo: 1300,
    energyCost: 60,
    cost: { metal: 38000, crystal: 19000, deuterium: 8500 },
    weaponType: 'Heavy Antimatter Torpedoes',
    targetWeakness: 'Category IV: Battleships & Dreadnoughts',
    vulnerableTo: 'Category I: Swarm Interceptors',
    specialAbility: { name: 'Armor Piercer', effect: '+50% damage against capital ship armor', procChance: '100% Passive' },
    description: 'Designed specifically to break dreadnought formations with heavy torpedo salvoes.',
    gameLogicMechanics: 'Has 4x rapid fire multiplier against Class-IV Battleships.',
  },

  // --------------------------------------------------------------------------
  // CATEGORY IV: HEAVY BATTLESHIPS & DREADNOUGHTS (Classes 28 - 36)
  // --------------------------------------------------------------------------
  {
    classId: 28,
    primaryCategory: 'Category IV: Heavy Battleships & Dreadnoughts',
    subClass: 'Class-IV Flagship Dreadnought',
    typeName: 'Siege Battleship',
    subType: 'Imperator Mark-1 Flagship',
    tier: 1,
    attack: 2350,
    defense: 3200,
    shield: 1900,
    speed: 4200,
    cargo: 4500,
    energyCost: 150,
    cost: { metal: 120000, crystal: 60000, deuterium: 28000 },
    weaponType: 'Quad Orbital Beam Array',
    targetWeakness: 'Category VIII: Orbital Defenses & Satellites',
    vulnerableTo: 'Category III: Strike Destroyers',
    specialAbility: { name: 'Imperator Aura', effect: '+10% attack power to all allied ships in fleet', procChance: '100% Aura' },
    description: 'Massive capital warship serving as the command nexus for planetary sieges.',
    gameLogicMechanics: 'Increases total fleet firepower by 10% while remaining alive.',
  },

  // --------------------------------------------------------------------------
  // CATEGORY IX & X: SUPER-CAPITALS & COSMIC ARC BOSS TITANS (Classes 81 - 90)
  // --------------------------------------------------------------------------
  {
    classId: 81,
    primaryCategory: 'Category IX: Precursor & Super-Capital Flagships',
    subClass: 'Class-IX Precursor Titan',
    typeName: 'Ancient Precursor Monolith',
    subType: 'Ancients-Wrath Monolith-1',
    tier: 5,
    attack: 11500,
    defense: 16500,
    shield: 13500,
    speed: 2800,
    cargo: 110000,
    energyCost: 500,
    cost: { metal: 550000, crystal: 420000, deuterium: 320000 },
    weaponType: 'Singularity Disruption Cannon',
    targetWeakness: 'Category X: Cosmic Arc & Galaxy Boss Titans',
    vulnerableTo: 'Category III: Torpedo Swarms',
    specialAbility: { name: 'Precursor Aegis', effect: 'Generates 5,000 shield points per round', procChance: '100% Turn Start' },
    description: 'Unfathomable ancient war vessel constructed from zero-point energy cells.',
    gameLogicMechanics: 'Deals 2x bonus damage against Galaxy Bosses and Arc Bosses in Raid Battles.',
  },
  {
    classId: 90,
    primaryCategory: 'Category X: Cosmic Arc & Galaxy Boss Titans',
    subClass: 'Class-X Multiverse Arc Overlord',
    typeName: 'Cosmic Creator Apex Titan',
    subType: 'Eternity-X Arc Destroyer',
    tier: 10,
    attack: 50000,
    defense: 75000,
    shield: 60000,
    speed: 1200,
    cargo: 1000000,
    energyCost: 2500,
    cost: { metal: 2500000, crystal: 1800000, deuterium: 1200000 },
    weaponType: 'Multiverse Annihilation Cannon',
    targetWeakness: 'All Lower Class Units',
    vulnerableTo: 'Chrono-Titan Temporal Paradox',
    specialAbility: { name: 'Cosmic Reality Erasure', effect: 'Instantly vaporizes target enemy fleet stack', procChance: '15% Round Start' },
    description: 'The supreme pinnacle of 90-Class technology. Controls the fundamental constants of the cosmos.',
    gameLogicMechanics: 'Ultimate apex unit capable of soloing entire sector defense fleets.',
  },
];

// Helper to get full 90-class roster (ensuring all 90 classIds are unique from 1 to 90)
export function getComplete90ClassesMatrix(): Class90Entry[] {
  const existingMap = new Map<number, Class90Entry>();
  SYSTEM_90_CLASSES_MATRIX.forEach((entry) => {
    existingMap.set(entry.classId, entry);
  });

  const categories = [
    'Category I: Light Interceptors',
    'Category II: Heavy Corvettes & Frigates',
    'Category III: Strike Destroyers & Cruisers',
    'Category IV: Heavy Battleships & Dreadnoughts',
    'Category V: Mobile Carrier Hubs & Motherships',
    'Category VI: Stealth Recon & Covert Ops',
    'Category VII: Industrial & Resource Titans',
    'Category VIII: Orbital Defenses & Satellites',
    'Category IX: Precursor & Super-Capital Flagships',
    'Category X: Cosmic Arc & Galaxy Boss Titans',
  ];

  const fullList: Class90Entry[] = [];

  for (let i = 1; i <= 90; i++) {
    if (existingMap.has(i)) {
      fullList.push(existingMap.get(i)!);
    } else {
      const catIndex = Math.floor((i - 1) / 9) % 10;
      const catName = categories[catIndex];
      const subNum = ((i - 1) % 9) + 1;

      fullList.push({
        classId: i,
        primaryCategory: catName,
        subClass: `Class-${catIndex + 1} Sub-Type ${subNum}`,
        typeName: `${catName.replace(/Category [IVX]+:\s*/, '')} Class-${i}`,
        subType: `Sub-Type ${i} Variant-${subNum}`,
        tier: Math.floor((i - 1) / 9) + 1,
        attack: 100 + i * 250,
        defense: 150 + i * 300,
        shield: 80 + i * 200,
        speed: Math.max(1000, 25000 - i * 200),
        cargo: 1000 + i * 2500,
        energyCost: 10 + i * 15,
        cost: {
          metal: 5000 + i * 8000,
          crystal: 3000 + i * 5000,
          deuterium: 1500 + i * 3000,
        },
        weaponType: i % 2 === 0 ? 'Plasma Disruption Beam' : 'Heavy Gauss Railcannon',
        targetWeakness: categories[(catIndex + 3) % 10],
        vulnerableTo: categories[(catIndex + 7) % 10],
        specialAbility: {
          name: `Sub-System Burst #${i}`,
          effect: `Increases fleet efficiency by ${(i % 25) + 5}%`,
          procChance: '20% On Action',
        },
        description: `Class #${i} starship variant optimized for specialized combat, logistics, or sector control.`,
        gameLogicMechanics: `Class #${i} combat modifier applies +${(i % 15) + 5}% efficiency in Universe ${((i - 1) % 30) + 1}.`,
      });
    }
  }

  return fullList;
}
