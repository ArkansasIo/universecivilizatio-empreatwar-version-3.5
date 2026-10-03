export interface MothershipTheme {
  id: string;
  name: string;
  category: 'Imperial' | 'Alien' | 'High-Tech' | 'Tactical' | 'Ancient' | 'Cybernetic';
  tagline: string;
  accentBadge: string;
  primaryColor: string;
  secondaryColor: string;
  accentGlow: string;
  conduitColor: string;
  cardBg: string;
  borderColor: string;
  hullPatternName: string;
  statBonus: {
    label: string;
    description: string;
    hullBonusPct: number;
    shieldBonusPct: number;
    alphaBonusPct: number;
    turnDiscountPct: number;
    gloryBonusPct: number;
  };
  unlockCostGlory: number;
  unlockCostNaquadah: number;
  unlockedByDefault: boolean;
  flavorText: string;
  visualPreview: {
    shipSilhouetteBg: string;
    shieldAuraClass: string;
    glowStyle: string;
  };
}

export const MOTHERSHIP_THEMES: MothershipTheme[] = [
  {
    id: 'theme_imperial_obsidian',
    name: 'Imperial Obsidian & Sovereign Gold',
    category: 'Imperial',
    tagline: 'Gilded prestige and dense neutronium alloy armor of the Supreme Armada.',
    accentBadge: '👑 IMPERIAL STANDARD',
    primaryColor: '#111111',
    secondaryColor: '#f59e0b',
    accentGlow: '#fbbf24',
    conduitColor: '#f59e0b',
    cardBg: '#18181b',
    borderColor: '#d97706',
    hullPatternName: 'Hex-Woven Neutronium Carbon & Gilded Filigree',
    statBonus: {
      label: '+10% Command Aura & +5% Flagship Alpha Strike',
      description: 'Inspires fleet squadrons with regal prestige and precision targeting.',
      hullBonusPct: 5,
      shieldBonusPct: 5,
      alphaBonusPct: 5,
      turnDiscountPct: 0,
      gloryBonusPct: 15,
    },
    unlockCostGlory: 0,
    unlockCostNaquadah: 0,
    unlockedByDefault: true,
    flavorText: 'Standard ceremonial livery commissioned by the Imperial High Command, forged with polished obsidian plating and pure auric conduits.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
      shieldAuraClass: 'ring-2 ring-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
      glowStyle: 'rgba(245, 158, 11, 0.4)',
    },
  },
  {
    id: 'theme_neon_cyberpunk',
    name: 'Tachyon Synthwave & Neon Cyberpunk',
    category: 'Cybernetic',
    tagline: 'High-voltage ultraviolet conduits and hyper-clocked neural overclock grids.',
    accentBadge: '⚡ TACHYON HYPER-PULSE',
    primaryColor: '#090d16',
    secondaryColor: '#06b6d4',
    accentGlow: '#ec4899',
    conduitColor: '#06b6d4',
    cardBg: '#0f172a',
    borderColor: '#06b6d4',
    hullPatternName: 'Illuminated Circuitry & Phase-Reactive Luminescence',
    statBonus: {
      label: '+12% Subspace Engine Speed & +8% Shield Capacitor Recharge',
      description: 'Supercharges internal plasma conduits with high-frequency tachyon cycles.',
      hullBonusPct: 0,
      shieldBonusPct: 8,
      alphaBonusPct: 6,
      turnDiscountPct: 10,
      gloryBonusPct: 5,
    },
    unlockCostGlory: 120,
    unlockCostNaquadah: 150000,
    unlockedByDefault: false,
    flavorText: 'Sourced from black-market megacorp drydocks. Integrated with pulsating luminescence ribbons that discharge excess tachyon radiation in dazzling neon arcs.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      shieldAuraClass: 'ring-2 ring-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.4)]',
      glowStyle: 'rgba(6, 182, 212, 0.5)',
    },
  },
  {
    id: 'theme_precursor_bio',
    name: 'Precursor Xenotech & Living Chitin',
    category: 'Alien',
    tagline: 'Self-repairing biomechanical hull carapace with bioluminescent emerald nodes.',
    accentBadge: '🧬 PRECURSOR BIO-ARMOR',
    primaryColor: '#052e16',
    secondaryColor: '#10b981',
    accentGlow: '#34d399',
    conduitColor: '#10b981',
    cardBg: '#064e3b',
    borderColor: '#10b981',
    hullPatternName: 'Segmented Xenomorphic Chitin & Bioluminescent Spores',
    statBonus: {
      label: '+15% Max Hull Integrity & +10% Passive Nanite Hull Repair',
      description: 'Organic hull alloys continuously knit together through cellular regenerative matrices.',
      hullBonusPct: 15,
      shieldBonusPct: 5,
      alphaBonusPct: 0,
      turnDiscountPct: 5,
      gloryBonusPct: 10,
    },
    unlockCostGlory: 250,
    unlockCostNaquadah: 320000,
    unlockedByDefault: false,
    flavorText: 'Excavated from ancient Dyson ring archeological digs. The hull breathes, metabolizes cosmic dust, and deflects plasma rounds through organic hardening.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      shieldAuraClass: 'ring-2 ring-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.4)]',
      glowStyle: 'rgba(16, 185, 129, 0.5)',
    },
  },
  {
    id: 'theme_stealth_matte',
    name: 'Vantablack Void Stealth & Crimson Visor',
    category: 'Tactical',
    tagline: '99.9% light-absorbing anti-radar coating with razor-sharp crimson optical sensors.',
    accentBadge: '🕶 VOID PHANTOM',
    primaryColor: '#09090b',
    secondaryColor: '#ef4444',
    accentGlow: '#f87171',
    conduitColor: '#ef4444',
    cardBg: '#18181b',
    borderColor: '#ef4444',
    hullPatternName: 'Anisotropic Carbon-Nanotube Micro-Pores',
    statBonus: {
      label: '+14% First-Strike Critical Hit & +10% Sensor Jamming',
      description: 'Absorbs radar frequencies and thermal signatures, masking mothership presence.',
      hullBonusPct: 0,
      shieldBonusPct: 5,
      alphaBonusPct: 14,
      turnDiscountPct: 5,
      gloryBonusPct: 10,
    },
    unlockCostGlory: 180,
    unlockCostNaquadah: 220000,
    unlockedByDefault: false,
    flavorText: 'Engineered for shadow sector ambushes. Enemy scanning arrays report empty space until the spinal batteries discharge point-blank.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #09090b 0%, #1c1917 100%)',
      shieldAuraClass: 'ring-2 ring-red-600/50 shadow-[0_0_25px_rgba(239,68,68,0.35)]',
      glowStyle: 'rgba(239, 68, 68, 0.45)',
    },
  },
  {
    id: 'theme_solar_paladin',
    name: 'Solar Paladin Ceramic & Aerospace Orange',
    category: 'Imperial',
    tagline: 'High-albedo solar thermal tiles with military-spec telemetry hazard striping.',
    accentBadge: '☀️ SOLAR DEFENDER',
    primaryColor: '#fafafa',
    secondaryColor: '#f97316',
    accentGlow: '#fb923c',
    conduitColor: '#f97316',
    cardBg: '#f4f4f5',
    borderColor: '#ea580c',
    hullPatternName: 'Heat-Resistant Ceramic Hex-Tiles & Aerospace Hazard Striping',
    statBonus: {
      label: '+12% Armor Resistance & +8% Fighter Squadron Lethality',
      description: 'Deflects orbital solar flares and disperses thermal kinetic impacts across ablative ceramic blocks.',
      hullBonusPct: 8,
      shieldBonusPct: 8,
      alphaBonusPct: 6,
      turnDiscountPct: 0,
      gloryBonusPct: 8,
    },
    unlockCostGlory: 140,
    unlockCostNaquadah: 180000,
    unlockedByDefault: false,
    flavorText: 'The pride of the Solar Paladin battlecruisers. Features brilliant stark-white ceramic plating contrasted by high-visibility aerospace orange markings.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      shieldAuraClass: 'ring-2 ring-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.35)]',
      glowStyle: 'rgba(249, 115, 22, 0.4)',
    },
  },
  {
    id: 'theme_asgard_crystal',
    name: 'Asgard Crystalline Hyper-Silver',
    category: 'Ancient',
    tagline: 'Pristine neutronium-silver monolith with ancient hyperdrive blue harmonic resonance.',
    accentBadge: '❄ ASGARD CRYSTALLINE',
    primaryColor: '#0f172a',
    secondaryColor: '#38bdf8',
    accentGlow: '#7dd3fc',
    conduitColor: '#38bdf8',
    cardBg: '#1e293b',
    borderColor: '#38bdf8',
    hullPatternName: 'Monolithic Crystalline Lattice & Subspace Resonance Array',
    statBonus: {
      label: '+15% Deflector Shield Buffer & -20% Hyperjump Deuterium Cost',
      description: 'Harnesses ancient crystal technology to bend subspace vectors and absorb superweapon blasts.',
      hullBonusPct: 6,
      shieldBonusPct: 15,
      alphaBonusPct: 6,
      turnDiscountPct: 15,
      gloryBonusPct: 12,
    },
    unlockCostGlory: 300,
    unlockCostNaquadah: 450000,
    unlockedByDefault: false,
    flavorText: 'Modeled after the ancient O’Neill-class Asgard flagships. Crystalline matrix lattice disperses directed energy beams across sub-dimensional harmonic fields.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
      shieldAuraClass: 'ring-2 ring-sky-400/60 shadow-[0_0_35px_rgba(56,189,248,0.5)]',
      glowStyle: 'rgba(56, 189, 248, 0.5)',
    },
  },
  {
    id: 'theme_chrono_singularity',
    name: 'Chrono-Temporal Golden Singularity',
    category: 'High-Tech',
    tagline: 'Spacetime curvature field generators with swirling amber tachyon singularity halos.',
    accentBadge: '⏳ TEMPORAL SINGULARITY',
    primaryColor: '#1c1917',
    secondaryColor: '#eab308',
    accentGlow: '#fde047',
    conduitColor: '#eab308',
    cardBg: '#292524',
    borderColor: '#ca8a04',
    hullPatternName: 'Event-Horizon Graviton Rings & Tachyon Distortion Shroud',
    statBonus: {
      label: '+20% Doomsday Lance Charge Rate & +10% Exploration Turns Efficiency',
      description: 'Dilates local spacetime around the reactor core to accelerate superweapon recharging.',
      hullBonusPct: 10,
      shieldBonusPct: 10,
      alphaBonusPct: 12,
      turnDiscountPct: 15,
      gloryBonusPct: 20,
    },
    unlockCostGlory: 400,
    unlockCostNaquadah: 650000,
    unlockedByDefault: false,
    flavorText: 'An incomprehensible achievement of temporal engineering. A miniature contained black hole singularity orbits within the ship’s primary reactor cradle.',
    visualPreview: {
      shipSilhouetteBg: 'linear-gradient(135deg, #292524 0%, #451a03 100%)',
      shieldAuraClass: 'ring-2 ring-yellow-400/70 shadow-[0_0_35px_rgba(234,179,8,0.5)]',
      glowStyle: 'rgba(234, 179, 8, 0.55)',
    },
  },
];

export interface MothershipChassisClass {
  id: string;
  name: string;
  tier: number;
  hullType: 'dreadnought' | 'fortress' | 'titan' | 'carrier' | 'world_breaker' | 'sovereign';
  hullHp: number;
  shieldHp: number;
  powergridMw: number;
  commandPoints: number;
  hangarCapacity: number;
  alphaStrike: number;
  warpFactor: number;
  unlockRequirement: string;
  costNaquadah: number;
  costDeuterium: number;
  description: string;
  badge: string;
  specialAbility: string;
}

export interface BridgeOfficer {
  id: string;
  station: string;
  name: string;
  title: string;
  rank: string;
  level: number;
  maxLevel: number;
  avatar: string;
  specialty: string;
  primaryStat: string;
  bonusSummary: string;
  promotionCostCp: number;
}

export interface HangarWing {
  id: string;
  name: string;
  role: 'interceptor' | 'bomber' | 'torpedo' | 'drone';
  count: number;
  maxCount: number;
  hullPerUnit: number;
  dpsPerUnit: number;
  restockCostMetal: number;
  restockCostCrystal: number;
  restockCostDeut: number;
  description: string;
  doctrine: 'balanced' | 'aggressive' | 'defensive' | 'salvage';
}

export interface DeepSpaceSector {
  id: string;
  name: string;
  coordinate: string;
  hazardLevel: 'low' | 'moderate' | 'high' | 'catastrophic' | 'extreme';
  type: string;
  description: string;
  fuelCostTurns: number;
  potentialRewards: string[];
  anomaliesDetected: number;
}

export interface DeepSpaceAnomalyEvent {
  id: string;
  title: string;
  sectorName: string;
  briefing: string;
  hazard: string;
  options: {
    label: string;
    description: string;
    requirement?: string;
    outcomeType: 'resource' | 'technology' | 'artifact' | 'damage';
    successChance: number;
    rewards: {
      naquadah?: number;
      metal?: number;
      crystal?: number;
      deuterium?: number;
      glory?: number;
      turns?: number;
      text: string;
    };
  }[];
}

export const MOTHERSHIP_CHASSIS_CLASSES: MothershipChassisClass[] = [
  {
    id: 'chassis_vanguard',
    name: 'Vanguard-Class Dreadnought',
    tier: 1,
    hullType: 'dreadnought',
    hullHp: 185000,
    shieldHp: 95000,
    powergridMw: 14500,
    commandPoints: 120,
    hangarCapacity: 24,
    alphaStrike: 18500,
    warpFactor: 7.2,
    unlockRequirement: 'Standard Imperial Commission',
    costNaquadah: 50000,
    costDeuterium: 15000,
    description: 'The proven spearhead of the colonial fleet, featuring quad heavy railguns, reinforced neutronium prow, and modular escort docks.',
    badge: '⚓ CLASS-I VANGUARD',
    specialAbility: 'Overcharged Railgun Barrage: +15% Alpha Strike on turn 1',
  },
  {
    id: 'chassis_leviathan',
    name: 'Leviathan-Class Star Fortress',
    tier: 2,
    hullType: 'fortress',
    hullHp: 340000,
    shieldHp: 210000,
    powergridMw: 26000,
    commandPoints: 180,
    hangarCapacity: 48,
    alphaStrike: 32000,
    warpFactor: 6.8,
    unlockRequirement: 'Shipyard Level 8 + Research Heavy Armor 6',
    costNaquadah: 180000,
    costDeuterium: 45000,
    description: 'A mobile planetary fortress bristling with dual spinal plasma projectors and multi-layered deflector bulkheads that withstand orbital bombardment.',
    badge: '🛡 CLASS-II LEVIATHAN',
    specialAbility: 'Fortress Aegis: Converts 20% incoming damage into shield capacitor charge',
  },
  {
    id: 'chassis_chronos',
    name: 'Chronos-Class Subspace Titan',
    tier: 3,
    hullType: 'titan',
    hullHp: 580000,
    shieldHp: 390000,
    powergridMw: 44000,
    commandPoints: 260,
    hangarCapacity: 72,
    alphaStrike: 56000,
    warpFactor: 9.4,
    unlockRequirement: 'Hyperspace Tech 8 + 500 Glory Points',
    costNaquadah: 380000,
    costDeuterium: 95000,
    description: 'Equipped with a miniature tachyon fold singularity drive that folds spacetime for instantaneous fleet maneuvers and rapid superweapon recharging.',
    badge: '⚡ CLASS-III CHRONOS',
    specialAbility: 'Tachyon Warp Drift: Reduces all hyperjump fuel and turn costs by 35%',
  },
  {
    id: 'chassis_eclipse',
    name: 'Eclipse-Class Doomsday Carrier',
    tier: 4,
    hullType: 'carrier',
    hullHp: 890000,
    shieldHp: 620000,
    powergridMw: 68000,
    commandPoints: 350,
    hangarCapacity: 144,
    alphaStrike: 88000,
    warpFactor: 8.6,
    unlockRequirement: 'Mothership Modules Total Lv 25 + Glory 1,200',
    costNaquadah: 750000,
    costDeuterium: 210000,
    description: 'Massive fleet carrier capable of deploying entire strike wings of bombers and interceptors while charging its spinal Eclipse Graviton Lance.',
    badge: '🌌 CLASS-IV ECLIPSE',
    specialAbility: 'Eclipse Swarm Sortie: Deploys 4 wings simultaneously with 100% critical rate',
  },
  {
    id: 'chassis_ragnarok',
    name: 'Ragnarok-Class World-Breaker',
    tier: 5,
    hullType: 'world_breaker',
    hullHp: 1450000,
    shieldHp: 1100000,
    powergridMw: 115000,
    commandPoints: 500,
    hangarCapacity: 216,
    alphaStrike: 154000,
    warpFactor: 8.2,
    unlockRequirement: 'Imperial Rank 8 + Super-Weapons Arsenal',
    costNaquadah: 1500000,
    costDeuterium: 480000,
    description: 'Planetary siege titan capable of shattering orbital moons and neutralizing entire defense networks with a single apocalyptic volley.',
    badge: '☄ CLASS-V RAGNAROK',
    specialAbility: 'World Shatterer: Planetary bombardment ignores 75% planetary shields',
  },
  {
    id: 'chassis_sovereign',
    name: 'Apex-Class Precursor Sovereign',
    tier: 6,
    hullType: 'sovereign',
    hullHp: 2600000,
    shieldHp: 2100000,
    powergridMw: 240000,
    commandPoints: 800,
    hangarCapacity: 360,
    alphaStrike: 290000,
    warpFactor: 12.0,
    unlockRequirement: 'Ascension Chamber Cleared + 2,500 Glory Points',
    costNaquadah: 3500000,
    costDeuterium: 1200000,
    description: 'Ancient alien biomechanical dreadnought utilizing zero-point dark matter manipulation, Phase-Inversion armor, and sentient AI neural matrices.',
    badge: '👑 CLASS-VI APEX SOVEREIGN',
    specialAbility: 'Zero-Point Singularity: Regenerates 5% Hull & Shields each combat round',
  },
];

export const INITIAL_BRIDGE_OFFICERS: BridgeOfficer[] = [
  {
    id: 'off_admiral',
    station: 'Fleet Command',
    name: 'Fleet Admiral Marcus Vance',
    title: 'Supreme Armada Commander',
    rank: 'Grand Admiral (Rank 5)',
    level: 4,
    maxLevel: 10,
    avatar: '👨‍✈️',
    specialty: 'Fleet Command & Strategic Formations',
    primaryStat: 'Command Aura +24%',
    bonusSummary: '+20% Fleet Attack Volley & +150 Fleet Command Points',
    promotionCostCp: 85,
  },
  {
    id: 'off_tactical',
    station: 'Weapons & Tactical',
    name: 'Lt. Commander Sarah Blake',
    title: 'Master of Fire & Ordnance',
    rank: 'Gunnery Specialist (Rank 4)',
    level: 3,
    maxLevel: 10,
    avatar: '👩‍✈️',
    specialty: 'Spinal Superweapons & Critical Targeting',
    primaryStat: 'Weapon Alpha +18%',
    bonusSummary: '+25% Doomsday Lance Damage & +12% Critical Strike Chance',
    promotionCostCp: 65,
  },
  {
    id: 'off_engineer',
    station: 'Chief Engineering',
    name: 'Chief Engineer T\'Kalon',
    title: 'Singularity Reactor Warden',
    rank: 'Chief Warrant Officer (Rank 4)',
    level: 4,
    maxLevel: 10,
    avatar: '🧑‍🔧',
    specialty: 'Zero-Point Power & Nanite Field Repair',
    primaryStat: 'Capacitor Output +28%',
    bonusSummary: '+30% Shield Recharge Rate & Automatic 500 HP/s In-Battle Nanite Repair',
    promotionCostCp: 75,
  },
  {
    id: 'off_helm',
    station: 'Astrogation & Helm',
    name: 'Navigation Officer Dax Miller',
    title: 'Subspace Drift Navigator',
    rank: 'Senior Astrogator (Rank 3)',
    level: 3,
    maxLevel: 10,
    avatar: '🧑‍🚀',
    specialty: 'Tachyon Slipstream Navigation',
    primaryStat: 'Warp Speed +22%',
    bonusSummary: '-20% Deuterium Consumption on Fleet Hyperspace Jumps',
    promotionCostCp: 55,
  },
  {
    id: 'off_science',
    station: 'Science & Recon',
    name: 'Dr. Evelyn Cross',
    title: 'Precursor Xenologist & Chief Scientist',
    rank: 'Director of Xenotech (Rank 4)',
    level: 4,
    maxLevel: 10,
    avatar: '👩‍🔬',
    specialty: 'Deep Space Anomalies & Artifact Extraction',
    primaryStat: 'Recon Scanners +35%',
    bonusSummary: '+45% Resource & Artifact Drops from Deep Space Exploration',
    promotionCostCp: 70,
  },
  {
    id: 'off_hangar',
    station: 'Flight Operations',
    name: 'Wing Commander Jax Thorne',
    title: 'Master of Strike Craft',
    rank: 'Air Wing Marshal (Rank 3)',
    level: 3,
    maxLevel: 10,
    avatar: '🦅',
    specialty: 'Fighter Wing Tactics & Drone Swarms',
    primaryStat: 'Sortie Velocity +20%',
    bonusSummary: '+25% Fighter/Bomber Lethality & Instant Hangar Turnaround',
    promotionCostCp: 60,
  },
];

export const INITIAL_HANGAR_WINGS: HangarWing[] = [
  {
    id: 'wing_valkyrie',
    name: 'Valkyrie Mk-IV Space Interceptors',
    role: 'interceptor',
    count: 36,
    maxCount: 60,
    hullPerUnit: 1200,
    dpsPerUnit: 180,
    restockCostMetal: 12000,
    restockCostCrystal: 8000,
    restockCostDeut: 3000,
    description: 'High-agility atmospheric & vacuum fighters armed with dual particle cannons and active missile interceptors.',
    doctrine: 'balanced',
  },
  {
    id: 'wing_shadow_bombers',
    name: 'Shadow Void Heavy Plasma Bombers',
    role: 'bomber',
    count: 24,
    maxCount: 40,
    hullPerUnit: 3400,
    dpsPerUnit: 480,
    restockCostMetal: 24000,
    restockCostCrystal: 18000,
    restockCostDeut: 8500,
    description: 'Heavily armored stealth bombers designed to deliver proton torpedoes into capital ship exhaust ports and planetary silos.',
    doctrine: 'aggressive',
  },
  {
    id: 'wing_torpedo_skiffs',
    name: 'Ghost Phase Torpedo Gunships',
    role: 'torpedo',
    count: 18,
    maxCount: 30,
    hullPerUnit: 2800,
    dpsPerUnit: 360,
    restockCostMetal: 18000,
    restockCostCrystal: 14000,
    restockCostDeut: 6000,
    description: 'Phase-cloaked gunships carrying sub-atomic disruption torpedoes that bypass shields to strike directly at hull armor.',
    doctrine: 'aggressive',
  },
  {
    id: 'wing_salvage_drones',
    name: 'Titan Nanite Siphon Drones',
    role: 'drone',
    count: 48,
    maxCount: 80,
    hullPerUnit: 800,
    dpsPerUnit: 60,
    restockCostMetal: 8000,
    restockCostCrystal: 5000,
    restockCostDeut: 2000,
    description: 'Automated drone swarm that consumes post-battle debris fields, converts matter into resources, and repairs escort ships.',
    doctrine: 'salvage',
  },
];

export const DEEP_SPACE_SECTORS: DeepSpaceSector[] = [
  {
    id: 'sec_graveyard',
    name: 'Sector Zero: Graveyard of Titans',
    coordinate: '0:00:1:0',
    hazardLevel: 'moderate',
    type: 'Derelict Ship Cemetery',
    description: 'A silent cosmic battleground strewn with wreckage from centuries of ancient interstellar wars. High probability of rare components and salvageable Naquadah.',
    fuelCostTurns: 1,
    potentialRewards: ['Ancient Dreadnought Blueprints', '45,000 - 120,000 Naquadah', 'Super-Weapon Cores'],
    anomaliesDetected: 3,
  },
  {
    id: 'sec_pulsar',
    name: 'Sector Chronos: Pulsar Storm Hazard Zone',
    coordinate: '3:88:9:4',
    hazardLevel: 'high',
    type: 'Pulsar Neutron Cloud',
    description: 'High-energy gamma radiation pulses threaten sub-shield electronics. Vessels equipped with Phase Deflectors can harvest raw Dark Matter and Deuterium isotopes.',
    fuelCostTurns: 1,
    potentialRewards: ['Dark Matter Concentrates', '60,000 Deuterium', 'Advanced Shield Algorithms'],
    anomaliesDetected: 4,
  },
  {
    id: 'sec_precursor',
    name: 'Sector Eos: Ancient Precursor Vault',
    coordinate: '7:14:2:8',
    hazardLevel: 'catastrophic',
    type: 'Megastructure Dyson Ring Remnant',
    description: 'A ruined alien planetary ring circling a dormant red dwarf star. Sentient defense automated sentinels guard precursor data cores and ascension relics.',
    fuelCostTurns: 2,
    potentialRewards: ['Precursor Ascension Artefacts', '150,000 Naquadah', '150 Glory XP'],
    anomaliesDetected: 5,
  },
  {
    id: 'sec_leviathan',
    name: 'Sector Abyssal: Void Leviathan Spawning Nest',
    coordinate: '9:99:9:9',
    hazardLevel: 'extreme',
    type: 'Cosmic Bio-Anomaly',
    description: 'Immense spacefaring biological titans congregate around a dark matter hydrothermal vent. Extremely perilous, but organic hull alloys can be harvested.',
    fuelCostTurns: 2,
    potentialRewards: ['Living Bio-Armor Weaves', '250,000 Resources', 'Titan Trophy'],
    anomaliesDetected: 2,
  },
];

export const DEEP_SPACE_ANOMALIES: DeepSpaceAnomalyEvent[] = [
  {
    id: 'anom_derelict_titan',
    title: 'Derelict Ancient Flagship Discovered',
    sectorName: 'Sector Zero: Graveyard of Titans',
    briefing: 'Sensors detect a monolithic precursor dreadnought drifting dead in space. Internal energy conduits are cold, but high-density neutronium storage vaults appear intact.',
    hazard: 'Automated Defense Turrets & Structural Collapses',
    options: [
      {
        label: 'Deploy Boarding Shuttles with Tactical Security',
        description: 'Send armed marine detachments to secure the central bridge and download database records.',
        requirement: 'Tactical Officer Level 2+',
        outcomeType: 'resource',
        successChance: 0.85,
        rewards: {
          naquadah: 85000,
          metal: 120000,
          glory: 45,
          text: 'Marines successfully disabled security bots and extracted 85,000 Naquadah, 120,000 Metal, and tactical battle logs!',
        },
      },
      {
        label: 'Extract Zero-Point Core with Engineering Drones',
        description: 'Focus salvage laser arrays on the reactor cradle to harvest raw unrefined dark matter.',
        requirement: 'Chief Engineer Level 3+',
        outcomeType: 'technology',
        successChance: 0.9,
        rewards: {
          deuterium: 65000,
          crystal: 95000,
          glory: 35,
          text: 'Engineering team harvested intact zero-point fuel rods, yielding 65,000 Deuterium and 95,000 Crystal!',
        },
      },
      {
        label: 'Tachyon Structural Scan & Record Scientific Telemetry',
        description: 'Perform complete sensor deep scans to advance imperial research matrices.',
        outcomeType: 'technology',
        successChance: 1.0,
        rewards: {
          glory: 60,
          turns: 2,
          text: 'Science team decoded ancient hyperjump logs, gaining 60 Glory XP and +2 Exploration Turns!',
        },
      },
    ],
  },
  {
    id: 'anom_dark_matter_rift',
    title: 'Spatial Subspace Singularity Rift',
    sectorName: 'Sector Chronos: Pulsar Storm Hazard Zone',
    briefing: 'A violent tear in the fabric of hyperspace is ejecting unstable tachyon particles and crystal condensates. Extreme gravitational shear detected.',
    hazard: 'Capacitor Overload & Temporal Distortion',
    options: [
      {
        label: 'Deploy Phase Deflector Shroud to Siphon Exotic Crystals',
        description: 'Harmonize flagship shields with the singularity frequency to harvest condensing matter.',
        outcomeType: 'resource',
        successChance: 0.8,
        rewards: {
          crystal: 140000,
          deuterium: 75000,
          naquadah: 50000,
          text: 'Shield collectors captured massive crystalline deposits! Yield: 140k Crystal & 75k Deuterium.',
        },
      },
      {
        label: 'Launch Tachyon Probe to Map Gravitational Currents',
        description: 'Calibrate the astrogation computer with real-time singularity navigation data.',
        outcomeType: 'technology',
        successChance: 0.95,
        rewards: {
          turns: 4,
          glory: 50,
          text: 'Probe telemetry optimized fleet hyperjump routes! Gained +4 Attack/Exploration Turns and 50 Glory.',
        },
      },
    ],
  },
  {
    id: 'anom_precursor_sentinel',
    title: 'Precursor Orbital Defense Sentry Active',
    sectorName: 'Sector Eos: Ancient Precursor Vault',
    briefing: 'A colossal crystalline sentinel awakens as your mothership approaches the Dyson Ring. Its targeting arrays lock onto your flagship!',
    hazard: 'High Energy Particle Lance',
    options: [
      {
        label: 'Overcharge Spinal Batteries & Open Fire',
        description: 'Target the sentry power core with maximum Alpha Strike firepower.',
        outcomeType: 'resource',
        successChance: 0.75,
        rewards: {
          naquadah: 180000,
          metal: 200000,
          glory: 120,
          text: 'Sentry destroyed in a blaze of plasma! Salvaged 180k Naquadah, 200k Metal, and 120 Glory XP!',
        },
      },
      {
        label: 'Transmit Ancient Diplomatic Cipher Code',
        description: 'Attempt to bypass combat protocols using decoded Stargate glyph frequencies.',
        outcomeType: 'artifact',
        successChance: 0.85,
        rewards: {
          naquadah: 110000,
          glory: 90,
          turns: 3,
          text: 'Cipher accepted! Sentinel stood down, granting access to the Precursor Data Core (+110k Naquadah, 90 Glory, +3 Turns)!',
        },
      },
    ],
  },
];

// ============================================================================
// FLAGSHIP HARDPOINTS, WEAPONS FITTING & CARRIER SORTIES
// ============================================================================

export type HardpointSlotType = 'spinal' | 'dorsal' | 'point_defense' | 'auxiliary';

export interface FlagshipWeaponItem {
  id: string;
  name: string;
  slotType: HardpointSlotType;
  tier: number;
  icon: string;
  damageType: 'Energy' | 'Kinetic' | 'Tachyon' | 'Antimatter' | 'Nanite';
  dps: number;
  alphaStrike: number;
  shieldBonusPct: number;
  armorPenetrationPct: number;
  powerDrawMW: number;
  upgradeCost: {
    credits: number;
    metal: number;
    crystal: number;
    deuterium: number;
    naquadah: number;
  };
  description: string;
}

export interface FlagshipHardpointSlot {
  slotId: string;
  slotName: string;
  slotType: HardpointSlotType;
  equippedWeaponId: string | null;
  level: number;
  powerAllocatedPct: number;
}

export interface CarrierSortieMission {
  id: string;
  name: string;
  targetSector: string;
  threatLevel: 'low' | 'medium' | 'high' | 'deadly';
  requiredWingRole: 'interceptor' | 'bomber' | 'torpedo' | 'drone' | 'any';
  minCraftCount: number;
  durationSec: number;
  rewards: {
    credits: number;
    naquadah: number;
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter?: number;
    glory: number;
  };
  description: string;
  flavor: string;
}

export interface FlagshipMilestoneAchievement {
  id: string;
  title: string;
  description: string;
  tier: number;
  progressCurrent: number;
  progressTarget: number;
  unit: string;
  isUnlocked: boolean;
  rewardGlory: number;
  rewardCredits: number;
  rewardBonusText: string;
}

export const FLAGSHIP_WEAPON_CATALOG: FlagshipWeaponItem[] = [
  // 1. SPINAL MOUNT SUPERWEAPONS
  {
    id: 'wpn_chrono_lance',
    name: 'Chrono-Tachyon Spinal Lance',
    slotType: 'spinal',
    tier: 4,
    icon: '⚡',
    damageType: 'Tachyon',
    dps: 18500,
    alphaStrike: 120000,
    shieldBonusPct: 35,
    armorPenetrationPct: 85,
    powerDrawMW: 450,
    upgradeCost: { credits: 150000, metal: 120000, crystal: 90000, deuterium: 60000, naquadah: 25000 },
    description: 'Pierces through space-time to project a concentrated relativistic particle beam that ignores deflector shields.',
  },
  {
    id: 'wpn_singularity_devastator',
    name: 'Zero-Point Singularity Devastator',
    slotType: 'spinal',
    tier: 5,
    icon: '🌀',
    damageType: 'Antimatter',
    dps: 26000,
    alphaStrike: 180000,
    shieldBonusPct: 50,
    armorPenetrationPct: 95,
    powerDrawMW: 650,
    upgradeCost: { credits: 280000, metal: 220000, crystal: 180000, deuterium: 110000, naquadah: 50000 },
    description: 'Generates a microscopic black hole directly inside the core of the targeted hostile capital ship.',
  },
  {
    id: 'wpn_antimatter_accelerator',
    name: 'Sub-Atomic Antimatter Cannon',
    slotType: 'spinal',
    tier: 3,
    icon: '💥',
    damageType: 'Antimatter',
    dps: 14000,
    alphaStrike: 90000,
    shieldBonusPct: 20,
    armorPenetrationPct: 70,
    powerDrawMW: 320,
    upgradeCost: { credits: 90000, metal: 75000, crystal: 55000, deuterium: 35000, naquadah: 15000 },
    description: 'Fires magnetically stabilized antimatter canisters capable of vaporizing enemy dreadnought armor plates.',
  },

  // 2. DORSAL HEAVY BATTERIES
  {
    id: 'wpn_heavy_ion_turret',
    name: 'Twin Heavy Ion Disruptor Battery',
    slotType: 'dorsal',
    tier: 3,
    icon: '💠',
    damageType: 'Energy',
    dps: 6800,
    alphaStrike: 32000,
    shieldBonusPct: 80,
    armorPenetrationPct: 30,
    powerDrawMW: 180,
    upgradeCost: { credits: 45000, metal: 40000, crystal: 30000, deuterium: 15000, naquadah: 8000 },
    description: 'High-frequency ion pulses that rapidly overload and strip hostile defensive barrier screens.',
  },
  {
    id: 'wpn_plasma_accelerator',
    name: 'Superheated Plasma Accelerator',
    slotType: 'dorsal',
    tier: 3,
    icon: '🔥',
    damageType: 'Energy',
    dps: 8200,
    alphaStrike: 45000,
    shieldBonusPct: 25,
    armorPenetrationPct: 75,
    powerDrawMW: 210,
    upgradeCost: { credits: 60000, metal: 50000, crystal: 38000, deuterium: 20000, naquadah: 10000 },
    description: 'Launches magnetically confined stellar plasma bursts that melt heavy composite hull plating on impact.',
  },
  {
    id: 'wpn_proton_torpedo_silo',
    name: 'Heavy Proton Torpedo Silos',
    slotType: 'dorsal',
    tier: 4,
    icon: '🚀',
    damageType: 'Kinetic',
    dps: 9500,
    alphaStrike: 58000,
    shieldBonusPct: 15,
    armorPenetrationPct: 90,
    powerDrawMW: 140,
    upgradeCost: { credits: 85000, metal: 70000, crystal: 45000, deuterium: 28000, naquadah: 12000 },
    description: 'Rapid-launch salvo system deploying guided thermonuclear warheads with shaped plasma penetrator cones.',
  },

  // 3. POINT DEFENSE GRIDS
  {
    id: 'wpn_nanite_flak',
    name: 'Vulcan Nanite Flak Array',
    slotType: 'point_defense',
    tier: 2,
    icon: '🛡️',
    damageType: 'Kinetic',
    dps: 3400,
    alphaStrike: 12000,
    shieldBonusPct: 10,
    armorPenetrationPct: 40,
    powerDrawMW: 80,
    upgradeCost: { credits: 25000, metal: 20000, crystal: 15000, deuterium: 5000, naquadah: 3000 },
    description: 'High-rate-of-fire kinetic shredder shells that create an impenetrable barrier against enemy missile swarms.',
  },
  {
    id: 'wpn_phase_laser_pdc',
    name: 'Phased Pulse Laser PDCs',
    slotType: 'point_defense',
    tier: 3,
    icon: '✨',
    damageType: 'Energy',
    dps: 4800,
    alphaStrike: 18000,
    shieldBonusPct: 45,
    armorPenetrationPct: 50,
    powerDrawMW: 110,
    upgradeCost: { credits: 40000, metal: 32000, crystal: 24000, deuterium: 10000, naquadah: 5000 },
    description: 'Precision targeting lasers designed to vaporize incoming torpedoes and hostile fighter squadrons in seconds.',
  },
  {
    id: 'wpn_emp_scatter_mesh',
    name: 'High-Frequency EMP Shock Mesh',
    slotType: 'point_defense',
    tier: 4,
    icon: '🌐',
    damageType: 'Tachyon',
    dps: 6200,
    alphaStrike: 24000,
    shieldBonusPct: 70,
    armorPenetrationPct: 20,
    powerDrawMW: 160,
    upgradeCost: { credits: 65000, metal: 48000, crystal: 36000, deuterium: 18000, naquadah: 9000 },
    description: 'Discharges localized electro-magnetic pulses that fry the guidance avionics of all nearby strike craft.',
  },

  // 4. AUXILIARY RACKS & INTERNAL SYSTEMS
  {
    id: 'wpn_nanite_auto_weaver',
    name: 'Nanite Hull Auto-Weaver Racks',
    slotType: 'auxiliary',
    tier: 3,
    icon: '🧬',
    damageType: 'Nanite',
    dps: 1500,
    alphaStrike: 0,
    shieldBonusPct: 20,
    armorPenetrationPct: 0,
    powerDrawMW: 95,
    upgradeCost: { credits: 35000, metal: 30000, crystal: 25000, deuterium: 12000, naquadah: 6000 },
    description: 'Continuous nanite cellular deployment restores 1,500 Hull Integrity every second during combat.',
  },
  {
    id: 'wpn_zero_point_capacitor',
    name: 'Zero-Point Auxiliary Capacitors',
    slotType: 'auxiliary',
    tier: 4,
    icon: '🔋',
    damageType: 'Energy',
    dps: 0,
    alphaStrike: 0,
    shieldBonusPct: 50,
    armorPenetrationPct: 0,
    powerDrawMW: -250, // Generates extra MW
    upgradeCost: { credits: 75000, metal: 55000, crystal: 45000, deuterium: 25000, naquadah: 10000 },
    description: 'Feeds clean vacuum-fluctuation power directly into mothership weapons grids, boosting total output.',
  },
];

export const INITIAL_FLAGSHIP_HARDPOINTS: FlagshipHardpointSlot[] = [
  { slotId: 'hp_spinal_1', slotName: 'Spinal Superweapon Mount Alpha', slotType: 'spinal', equippedWeaponId: 'wpn_chrono_lance', level: 1, powerAllocatedPct: 100 },
  { slotId: 'hp_spinal_2', slotName: 'Spinal Superweapon Mount Beta', slotType: 'spinal', equippedWeaponId: 'wpn_antimatter_accelerator', level: 1, powerAllocatedPct: 100 },
  { slotId: 'hp_dorsal_1', slotName: 'Dorsal Heavy Turret Port', slotType: 'dorsal', equippedWeaponId: 'wpn_heavy_ion_turret', level: 2, powerAllocatedPct: 100 },
  { slotId: 'hp_dorsal_2', slotName: 'Dorsal Heavy Turret Starboard', slotType: 'dorsal', equippedWeaponId: 'wpn_plasma_accelerator', level: 2, powerAllocatedPct: 100 },
  { slotId: 'hp_pdc_1', slotName: 'Point-Defense Flak Grid Forward', slotType: 'point_defense', equippedWeaponId: 'wpn_nanite_flak', level: 1, powerAllocatedPct: 100 },
  { slotId: 'hp_pdc_2', slotName: 'Point-Defense Laser Grid Aft', slotType: 'point_defense', equippedWeaponId: 'wpn_phase_laser_pdc', level: 1, powerAllocatedPct: 100 },
  { slotId: 'hp_aux_1', slotName: 'Internal Auxiliary Rack 1', slotType: 'auxiliary', equippedWeaponId: 'wpn_nanite_auto_weaver', level: 1, powerAllocatedPct: 100 },
  { slotId: 'hp_aux_2', slotName: 'Internal Auxiliary Rack 2', slotType: 'auxiliary', equippedWeaponId: 'wpn_zero_point_capacitor', level: 1, powerAllocatedPct: 100 },
];

export const INITIAL_SORTIE_MISSIONS: CarrierSortieMission[] = [
  {
    id: 'sortie_asteroid_raiders',
    name: 'Operation Asteroid Sweep: Pirate Outpost',
    targetSector: 'Kavala Belt (Asteroid Sector 4)',
    threatLevel: 'low',
    requiredWingRole: 'interceptor',
    minCraftCount: 12,
    durationSec: 15,
    rewards: { credits: 25000, naquadah: 35000, metal: 50000, crystal: 30000, deuterium: 10000, glory: 25 },
    description: 'Dispatch interceptors to eliminate rogue pirate scouts hiding in the asteroid dense cluster.',
    flavor: 'Sensors track 6 hostile gunboats attempting to ambush our deep space freighter routes.',
  },
  {
    id: 'sortie_dreadnought_strike',
    name: 'Operation Decapitation: Warlord Dreadnought Core',
    targetSector: 'Vindicator Ridge (Sector 8:44)',
    threatLevel: 'high',
    requiredWingRole: 'bomber',
    minCraftCount: 16,
    durationSec: 30,
    rewards: { credits: 80000, naquadah: 110000, metal: 140000, crystal: 95000, deuterium: 45000, darkMatter: 50, glory: 75 },
    description: 'Deploy Heavy Plasma Bombers to punch through orbital shield arrays and disable the enemy flagship.',
    flavor: 'A rogue Orion Syndicate dreadnought is establishing a forward staging base. Annihilate their reactor core!',
  },
  {
    id: 'sortie_precursor_salvage',
    name: 'Operation Ghost Drift: Precursor Vault Extraction',
    targetSector: 'Ancient Dyson Debris Ring (Sector 0:01)',
    threatLevel: 'medium',
    requiredWingRole: 'drone',
    minCraftCount: 24,
    durationSec: 20,
    rewards: { credits: 45000, naquadah: 65000, metal: 90000, crystal: 70000, deuterium: 35000, glory: 40 },
    description: 'Send autonomous nanite salvage drones into the irradiated core of a shattered precursor orbital station.',
    flavor: 'Valuable hyper-alloys and pristine zero-point crystal canisters await extraction.',
  },
  {
    id: 'sortie_abyssal_strike',
    name: 'Operation Void Hunt: Stellar Leviathan Assault',
    targetSector: 'Abyssal Chasm (Sector 9:99)',
    threatLevel: 'deadly',
    requiredWingRole: 'torpedo',
    minCraftCount: 18,
    durationSec: 45,
    rewards: { credits: 150000, naquadah: 220000, metal: 280000, crystal: 190000, deuterium: 90000, darkMatter: 120, glory: 150 },
    description: 'Deploy Phase Torpedo Gunships to neutralize a cosmic space-dwelling bio-leviathan attacking shipping lanes.',
    flavor: 'Bio-carapace analysis reveals dense reserves of organic living chitin and pure Dark Matter condensates.',
  },
];

export const FLAGSHIP_MILESTONES: FlagshipMilestoneAchievement[] = [
  {
    id: 'ms_battles_10',
    title: 'Fleet Vanguard Veteran',
    description: 'Survive 10 major fleet battles with your flagship.',
    tier: 1,
    progressCurrent: 6,
    progressTarget: 10,
    unit: 'Battles',
    isUnlocked: false,
    rewardGlory: 100,
    rewardCredits: 50000,
    rewardBonusText: '+5% Flagship Hull HP across all loadouts',
  },
  {
    id: 'ms_sectors_5',
    title: 'Void Cartographer',
    description: 'Explore 5 unique deep space anomaly sectors.',
    tier: 1,
    progressCurrent: 3,
    progressTarget: 5,
    unit: 'Sectors',
    isUnlocked: false,
    rewardGlory: 120,
    rewardCredits: 60000,
    rewardBonusText: '-1 Exploration Turn fuel consumption discount',
  },
  {
    id: 'ms_lance_overcharge',
    title: 'Doomsday Cataclysm',
    description: 'Fire the Spinal Doomsday Lance 5 times at 100% full capacitor charge.',
    tier: 2,
    progressCurrent: 2,
    progressTarget: 5,
    unit: 'Discharges',
    isUnlocked: false,
    rewardGlory: 200,
    rewardCredits: 120000,
    rewardBonusText: '+20% Doomsday Lance Critical Alpha Strike Damage',
  },
  {
    id: 'ms_hangar_wings_100',
    title: 'Carrier Strike Fleet Master',
    description: 'Deploy and maintain 100+ active fighter & bomber craft in the mothership hangar.',
    tier: 2,
    progressCurrent: 126,
    progressTarget: 100,
    unit: 'Craft',
    isUnlocked: true,
    rewardGlory: 150,
    rewardCredits: 80000,
    rewardBonusText: '+15% Strike Craft DPS & Instant Hangar Turnaround',
  },
];

