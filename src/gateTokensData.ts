/**
 * Gate Tokens System Data & Logic
 * Allows players to acquire, synthesize, and spend consumable tokens
 * for accessing Dimensional Anomalies, PvE Raids, and Deep Space Explorations.
 */

export type GateTokenType = 'alpha' | 'delta' | 'omega';

export interface GateTokenDefinition {
  id: GateTokenType;
  name: string;
  code: string;
  tier: 'Standard' | 'Exotic' | 'Apex';
  symbol: string;
  themeColor: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  description: string;
  usageDomain: string;
  baseExchangeCreditCost: number;
}

export const GATE_TOKENS_CATALOG: Record<GateTokenType, GateTokenDefinition> = {
  alpha: {
    id: 'alpha',
    name: 'Alpha Exploration Token',
    code: 'AGT-EXP-01',
    tier: 'Standard',
    symbol: 'ᐰ',
    themeColor: 'emerald',
    badgeBg: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    description: 'Stabilizes low-energy Stargate transit corridors for deep space charting, automated MALP probes, and lost colony archeology.',
    usageDomain: 'Off-world exploration missions & sector reconnaissance.',
    baseExchangeCreditCost: 45000,
  },
  delta: {
    id: 'delta',
    name: 'Delta Dimensional Token',
    code: 'DDT-ANOM-02',
    tier: 'Exotic',
    symbol: '𐎡',
    themeColor: 'cyan',
    badgeBg: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-300',
    description: 'Charged with tachyons and Zero Point harmonics. Shields exploratory vessels against space-time shear inside quantum fractures.',
    usageDomain: 'Dimensional anomalies, parallel reality rifts, and tachyon sinkholes.',
    baseExchangeCreditCost: 85000,
  },
  omega: {
    id: 'omega',
    name: 'Omega Raid Beacon',
    code: 'ORB-RAID-03',
    tier: 'Apex',
    symbol: 'Ω',
    themeColor: 'purple',
    badgeBg: 'bg-purple-500/15',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-300',
    description: 'Overcharges the 8th & 9th chevrons with massive sub-space displacement, punching through planetary shields to execute strike raids.',
    usageDomain: 'Goa\'uld System Lord citadels, Ori Supergate armadas, and Replicator hives.',
    baseExchangeCreditCost: 175000,
  },
};

export interface DimensionalAnomaly {
  id: string;
  name: string;
  designation: string;
  dimensionName: string;
  category: 'Quantum Rift' | 'Tachyon Singularity' | 'Temporal Mirror' | 'Void Pocket' | 'Subspace Tesseract';
  stabilityPct: number;
  dangerRating: 'Moderate' | 'Severe' | 'Extreme' | 'Cataclysmic';
  tokenCost: {
    type: GateTokenType;
    amount: number;
  };
  energyCostMw: number;
  durationSeconds: number;
  coordinates: string;
  description: string;
  scientificTelemetry: string;
  lootEstimates: {
    naquadah: number;
    crystal: number;
    darkMatter: number;
    credits: number;
    glory: number;
    relicChancePct: number;
    possibleArtifact: string;
  };
}

export const DIMENSIONAL_ANOMALIES: DimensionalAnomaly[] = [
  {
    id: 'anom_quantum_slipstream',
    name: 'Quantum Slipstream Singularity',
    designation: 'QSS-Sector-09',
    dimensionName: 'Sub-Quantum Layer 4',
    category: 'Quantum Rift',
    stabilityPct: 68,
    dangerRating: 'Severe',
    tokenCost: { type: 'delta', amount: 1 },
    energyCostMw: 180,
    durationSeconds: 4,
    coordinates: '[8:920:3] Subspace Horizon',
    description: 'A collapsed micro-wormhole leaking hyper-dense tachyon streams and chroniton particulate across parallel dimensions.',
    scientificTelemetry: 'Gravimetric shear spikes detected at 14.8 Tera-Gauss. MALP telemetry confirms unrefined ZPM crystalline shards embedded in accretion disk.',
    lootEstimates: {
      naquadah: 95000,
      crystal: 65000,
      darkMatter: 140,
      credits: 120000,
      glory: 45,
      relicChancePct: 35,
      possibleArtifact: 'Quantum Slipstream Core Shard',
    },
  },
  {
    id: 'anom_mirror_fracture',
    name: 'Parallel Mirror Reality Fracture',
    designation: 'PMR-Alpha-81',
    dimensionName: 'Tau\'ri Mirror Universe #17',
    category: 'Temporal Mirror',
    stabilityPct: 82,
    dangerRating: 'Moderate',
    tokenCost: { type: 'delta', amount: 1 },
    energyCostMw: 120,
    durationSeconds: 3,
    coordinates: '[1:004:1] Quantum Boundary',
    description: 'A direct bridge to a parallel Earth where Ancient knowledge was synthesized with early 21st-century starship engineering.',
    scientificTelemetry: 'Mirror DHD resonance frequency matches Tau\'ri Iris protocols. Sensor signatures indicate abandoned orbital weapons platforms with intact crystal matrices.',
    lootEstimates: {
      naquadah: 110000,
      crystal: 80000,
      darkMatter: 95,
      credits: 160000,
      glory: 60,
      relicChancePct: 40,
      possibleArtifact: 'Alternate Earth Hyperdrive Blueprint',
    },
  },
  {
    id: 'anom_ascended_nexus',
    name: 'Ascended Void Sanctuary Nexus',
    designation: 'AVS-Core-00',
    dimensionName: 'Higher Energy Plane of Existence',
    category: 'Void Pocket',
    stabilityPct: 44,
    dangerRating: 'Extreme',
    tokenCost: { type: 'delta', amount: 2 },
    energyCostMw: 320,
    durationSeconds: 6,
    coordinates: '[0:000:0] Ascended Null-Zone',
    description: 'A radiant energy sanctuary left behind by Alteran Ascended beings before the Great Plague of the Milky Way.',
    scientificTelemetry: 'Pure zero-point vacuum energy saturation. Any ship crossing without a Delta Dimensional harmonic shield risks molecular transmutation.',
    lootEstimates: {
      naquadah: 240000,
      crystal: 180000,
      darkMatter: 350,
      credits: 300000,
      glory: 150,
      relicChancePct: 75,
      possibleArtifact: 'Ascended Enlightenment Crystalline Matrix',
    },
  },
  {
    id: 'anom_subspace_tesseract',
    name: 'Subspace 4D Tesseract Pocket',
    designation: 'S4D-Sector-42',
    dimensionName: '4th Dimensional Calabi-Yau Manifold',
    category: 'Subspace Tesseract',
    stabilityPct: 55,
    dangerRating: 'Severe',
    tokenCost: { type: 'delta', amount: 2 },
    energyCostMw: 250,
    durationSeconds: 5,
    coordinates: '[4:712:9] Tesseract Folding',
    description: 'A folded 4-dimensional hyper-pocket compressing millions of cubic kilometers of raw asteroid ore into a single point.',
    scientificTelemetry: 'Compressed mineral strata contain hyper-dense Trinium, Neutronium and liquid Deuterium veins in perpetual folding loops.',
    lootEstimates: {
      naquadah: 180000,
      crystal: 140000,
      darkMatter: 220,
      credits: 220000,
      glory: 85,
      relicChancePct: 50,
      possibleArtifact: 'Subspace Compression Capacitor',
    },
  },
  {
    id: 'anom_event_horizon_rift',
    name: 'Black Hole Event Horizon Accretion Rift',
    designation: 'EHR-Singularity-66',
    dimensionName: 'P3X-451 Relativistic Distortion Zone',
    category: 'Tachyon Singularity',
    stabilityPct: 31,
    dangerRating: 'Cataclysmic',
    tokenCost: { type: 'delta', amount: 3 },
    energyCostMw: 450,
    durationSeconds: 8,
    coordinates: '[9:999:9] Gravitational Singularity',
    description: 'The infamous Stargate connected to a collapsing binary star undergoing micro-black hole formation. Time dilation approaches infinity.',
    scientificTelemetry: 'Extreme relativistic red-shift. Exotic matter and cosmic strings leaking through the wormhole can be siphoned with stabilized particle scoops.',
    lootEstimates: {
      naquadah: 380000,
      crystal: 290000,
      darkMatter: 650,
      credits: 500000,
      glory: 240,
      relicChancePct: 90,
      possibleArtifact: 'Micro-Singularity Containment Sphere',
    },
  },
];

export interface StargateRaidTarget {
  id: string;
  name: string;
  title: string;
  faction: 'Goa\'uld System Lords' | 'Ori Vanguard' | 'Asuran Replicators' | 'Wraith Hive' | 'Lucian Alliance';
  threatTier: 'Tier I Assault Raid' | 'Tier II Epic Raid' | 'Tier III Mythic Supergate Raid';
  tokenCost: {
    type: GateTokenType;
    amount: number;
  };
  requiredFleetPower: number;
  bossHp: number;
  bossMaxHp: number;
  bossShield: number;
  bossDefenseBonus: string;
  tacticalVulnerability: string;
  flavorLore: string;
  phaseMechanics: string[];
  grandLoot: {
    naquadah: number;
    crystal: number;
    deuterium: number;
    credits: number;
    darkMatter: number;
    gloryPoints: number;
    bonusUnits: number;
    exclusiveRelic: string;
  };
}

export const STARGATE_RAIDS: StargateRaidTarget[] = [
  {
    id: 'raid_tartarus_anubis',
    name: 'Tartarus Superweapon Citadel',
    title: 'Anubis Kull Warrior Cloning Facility',
    faction: 'Goa\'uld System Lords',
    threatTier: 'Tier I Assault Raid',
    tokenCost: { type: 'omega', amount: 1 },
    requiredFleetPower: 35000,
    bossHp: 850000,
    bossMaxHp: 850000,
    bossShield: 350000,
    bossDefenseBonus: 'Kull Organic Armor Plating (+30% Energy Resistance)',
    tacticalVulnerability: 'Trinium Penetrator Darts target unshielded thermal exhaust duct.',
    flavorLore: 'Anubis operates his secret bio-synthetic army forge on Tartarus beneath a permanent energy shield. Only an Omega Raid Beacon overcharge can punch a temporary strike window.',
    phaseMechanics: [
      'Phase 1: Orbital Jaffa Defense Fleet perimeter breach.',
      'Phase 2: Thermal cooling reactor core meltdown sequence.',
      'Phase 3: Confrontation with Kull Master Synthesizer.',
    ],
    grandLoot: {
      naquadah: 320000,
      crystal: 210000,
      deuterium: 95000,
      credits: 400000,
      darkMatter: 250,
      gloryPoints: 120,
      bonusUnits: 150,
      exclusiveRelic: 'Kull Warrior Bio-Armor Synthesis Blueprint',
    },
  },
  {
    id: 'raid_ori_supergate_vanguard',
    name: 'Ori Supergate Vanguard Armada',
    title: 'Prior Crusader Flagship Battlefleet',
    faction: 'Ori Vanguard',
    threatTier: 'Tier III Mythic Supergate Raid',
    tokenCost: { type: 'omega', amount: 2 },
    requiredFleetPower: 95000,
    bossHp: 2400000,
    bossMaxHp: 2400000,
    bossShield: 1200000,
    bossDefenseBonus: 'Origin Holy Beam Disrupters & White-Light Shields (+50% Defense)',
    tacticalVulnerability: 'Asgard Plasma Beam Cannons cycle through phase harmonic frequencies.',
    flavorLore: 'Three massive Ori Crusader warships have emerged from the Kallana Supergate to demand imperial conversion. Defeating their fleet halts their galactic crusade.',
    phaseMechanics: [
      'Phase 1: Supergate Event Horizon Disruption & Fighter Interception.',
      'Phase 2: Depleting impenetrable white-light primary shield harmonics.',
      'Phase 3: Direct hull bombardment of the Prior Command Bridge.',
    ],
    grandLoot: {
      naquadah: 950000,
      crystal: 680000,
      deuterium: 340000,
      credits: 1200000,
      darkMatter: 850,
      gloryPoints: 450,
      bonusUnits: 450,
      exclusiveRelic: 'Ori Supergate Power Conduit Segment',
    },
  },
  {
    id: 'raid_asuran_nanite_spire',
    name: 'Asuran Nanite Core Spire',
    title: 'Pegasus Replicator Central Nexus',
    faction: 'Asuran Replicators',
    threatTier: 'Tier II Epic Raid',
    tokenCost: { type: 'omega', amount: 1 },
    requiredFleetPower: 60000,
    bossHp: 1450000,
    bossMaxHp: 1450000,
    bossShield: 650000,
    bossDefenseBonus: 'Sub-molecular Self-Repair & Nano-Disruption (+40% Armor Regeneration)',
    tacticalVulnerability: 'Anti-Replicator Disruption Wave beamed through the Stargate space gate.',
    flavorLore: 'The Asuran city-ship on Asuras has begun mass fabrication of Aurora-class battleships. A pinpoint Omega beacon insertion can deploy the disruptor array directly into the central databank.',
    phaseMechanics: [
      'Phase 1: Nanite drone swarm suppression and drone defense grid takedown.',
      'Phase 2: Splicing into the core base code with Alteran administrative keys.',
      'Phase 3: Siphoning the 3 pristine ZPMs before self-destruct triggers.',
    ],
    grandLoot: {
      naquadah: 550000,
      crystal: 480000,
      deuterium: 180000,
      credits: 750000,
      darkMatter: 500,
      gloryPoints: 260,
      bonusUnits: 280,
      exclusiveRelic: 'Pristine Lantean Zero Point Module (ZPM)',
    },
  },
  {
    id: 'raid_wraith_superhive',
    name: 'Wraith Super-Hive Dreadnought',
    title: 'ZPM-Powered Organic Behemoth',
    faction: 'Wraith Hive',
    threatTier: 'Tier II Epic Raid',
    tokenCost: { type: 'omega', amount: 1 },
    requiredFleetPower: 70000,
    bossHp: 1750000,
    bossMaxHp: 1750000,
    bossShield: 200000,
    bossDefenseBonus: 'Multi-Kilometer Thick Bio-Hull Regeneration (absorbs kinetic volleys)',
    tacticalVulnerability: 'Internal nuclear detonation inside the sub-light propulsion chamber.',
    flavorLore: 'A rogue Wraith Queen upgraded her Hive Ship with captured Zero Point Modules, rendering the organic armor nearly impervious to conventional weapons.',
    phaseMechanics: [
      'Phase 1: Dart kamikaze cloud dogfighting and flak battery saturation.',
      'Phase 2: Darting through organic hangar bays with F-302 strike bombers.',
      'Phase 3: Detonating Naquadria warheads inside the Queen throne chamber.',
    ],
    grandLoot: {
      naquadah: 620000,
      crystal: 420000,
      deuterium: 240000,
      credits: 820000,
      darkMatter: 420,
      gloryPoints: 310,
      bonusUnits: 320,
      exclusiveRelic: 'Wraith Bio-Regenerative Armor Fragment',
    },
  },
  {
    id: 'raid_system_lord_baal',
    name: 'Ba\'al Imperial Cloned Flagship Fleet',
    title: 'Last Supreme System Lord Fortress',
    faction: 'Goa\'uld System Lords',
    threatTier: 'Tier I Assault Raid',
    tokenCost: { type: 'omega', amount: 1 },
    requiredFleetPower: 45000,
    bossHp: 980000,
    bossMaxHp: 980000,
    bossShield: 400000,
    bossDefenseBonus: 'Decoy Hologram Projectors & Cloned Commands (+25% Evasion)',
    tacticalVulnerability: 'Cross-analyzing subspace communications to isolate the true flagship.',
    flavorLore: 'Ba\'al has established a decentralized shadow empire using multiple clones and cloaked Ha\'tak motherships. Striking his flagship yields vast Naquadah tributes and secret technology vaults.',
    phaseMechanics: [
      'Phase 1: Scanning through 6 decoy motherships with tachyon sensors.',
      'Phase 2: Boarding party insertion into the private Stargate chamber.',
      'Phase 3: Securing Ba\'al\'s private treasury and time-dialing calculations.',
    ],
    grandLoot: {
      naquadah: 410000,
      crystal: 310000,
      deuterium: 130000,
      credits: 600000,
      darkMatter: 290,
      gloryPoints: 180,
      bonusUnits: 210,
      exclusiveRelic: 'Ba\'al Subspace Time Dilation Device',
    },
  },
];

export interface GateExplorationMission {
  id: string;
  name: string;
  targetGalaxy: 'Milky Way' | 'Pegasus' | 'Ida' | 'Uncharted Universe';
  sectorCoordinates: string;
  dangerLevel: 'Low' | 'Medium' | 'High';
  tokenCost: {
    type: GateTokenType;
    amount: number;
  };
  durationSeconds: number;
  description: string;
  primaryDiscovery: string;
  lootEstimates: {
    naquadah: number;
    crystal: number;
    deuterium: number;
    credits: number;
    conscripts: number;
    glory: number;
  };
}

export const GATE_EXPLORATION_MISSIONS: GateExplorationMission[] = [
  {
    id: 'exp_destiny_seed_path',
    name: 'Destiny Seed Ship Automated Trail',
    targetGalaxy: 'Uncharted Universe',
    sectorCoordinates: '[Universe:Edge:Seed-9]',
    dangerLevel: 'Medium',
    tokenCost: { type: 'alpha', amount: 1 },
    durationSeconds: 3,
    description: 'Follow the million-year-old course plotted by Ancient automated Seed Ships that deposited first-generation Stargates across distant galaxies.',
    primaryDiscovery: 'First-Gen Stargate telemetry, cosmic background radiation telemetry, and pristine raw minerals.',
    lootEstimates: {
      naquadah: 75000,
      crystal: 55000,
      deuterium: 35000,
      credits: 90000,
      conscripts: 40,
      glory: 35,
    },
  },
  {
    id: 'exp_midway_station',
    name: 'Midway Intergalactic Bridge Recon',
    targetGalaxy: 'Pegasus',
    sectorCoordinates: '[Midway:Void:Bridge-17]',
    dangerLevel: 'Low',
    tokenCost: { type: 'alpha', amount: 1 },
    durationSeconds: 2,
    description: 'Scout the 34-stargate relay chain suspended in the intergalactic void between the Milky Way and Pegasus galaxies.',
    primaryDiscovery: 'Macro command code caches, macro-gate telemetry, and deep-void salvage.',
    lootEstimates: {
      naquadah: 50000,
      crystal: 40000,
      deuterium: 25000,
      credits: 70000,
      conscripts: 25,
      glory: 25,
    },
  },
  {
    id: 'exp_asgard_othala_ruins',
    name: 'Othala Asgard Core Ruins',
    targetGalaxy: 'Ida',
    sectorCoordinates: '[Ida:Othala:Core-01]',
    dangerLevel: 'High',
    tokenCost: { type: 'alpha', amount: 2 },
    durationSeconds: 4,
    description: 'Deploy SG excavation teams to the devastated Asgard homeworld in the Ida galaxy to salvage intact ion drive blueprints and neutronium alloy.',
    primaryDiscovery: 'Asgard neural archive fragments, neutrino-ion generator schematics, and pure refined Trinium.',
    lootEstimates: {
      naquadah: 140000,
      crystal: 110000,
      deuterium: 80000,
      credits: 180000,
      conscripts: 80,
      glory: 75,
    },
  },
  {
    id: 'exp_furling_preserve',
    name: 'Furling Crystalline Sanctuary',
    targetGalaxy: 'Milky Way',
    sectorCoordinates: '[MW:Sanctuary:Paradise-04]',
    dangerLevel: 'Low',
    tokenCost: { type: 'alpha', amount: 2 },
    durationSeconds: 3,
    description: 'Seek out the legendary peaceful biosphere dimension designed by the enigmatic Furling race for peaceful coexistence.',
    primaryDiscovery: 'Harmonic plant extract, psychological restoration fields, and crystalline life-support tech.',
    lootEstimates: {
      naquadah: 110000,
      crystal: 95000,
      deuterium: 45000,
      credits: 150000,
      conscripts: 60,
      glory: 60,
    },
  },
];

export interface TokenSynthesisRecipe {
  targetToken: GateTokenType;
  tokenName: string;
  outputAmount: number;
  costs: {
    naquadah: number;
    crystal: number;
    deuterium: number;
    credits: number;
    darkMatter?: number;
    energy: number;
  };
  description: string;
}

export const TOKEN_SYNTHESIS_RECIPES: TokenSynthesisRecipe[] = [
  {
    targetToken: 'alpha',
    tokenName: 'Alpha Exploration Token',
    outputAmount: 1,
    costs: {
      naquadah: 25000,
      crystal: 15000,
      deuterium: 8000,
      credits: 30000,
      energy: 15,
    },
    description: 'Synthesizes an Alpha Exploration transit token using Naquadah and crystalline telemetry arrays.',
  },
  {
    targetToken: 'delta',
    tokenName: 'Delta Dimensional Token',
    outputAmount: 1,
    costs: {
      naquadah: 50000,
      crystal: 35000,
      deuterium: 20000,
      credits: 65000,
      darkMatter: 40,
      energy: 35,
    },
    description: 'Forges a Delta Dimensional Key by compressing Dark Matter and tachyon energy into a quartz matrix.',
  },
  {
    targetToken: 'omega',
    tokenName: 'Omega Raid Beacon',
    outputAmount: 1,
    costs: {
      naquadah: 90000,
      crystal: 60000,
      deuterium: 40000,
      credits: 125000,
      darkMatter: 100,
      energy: 60,
    },
    description: 'Constructs an Omega Raid Beacon capable of overpowering enemy planetary shields and summoning strike armadas.',
  },
];
