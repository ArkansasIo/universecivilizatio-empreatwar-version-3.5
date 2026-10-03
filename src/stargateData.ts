export interface StargateAddress {
  id: string;
  name: string;
  designation: string;
  galaxy: 'Milky Way' | 'Pegasus' | 'Ida' | 'Universe';
  chevrons: string[]; // 7, 8, or 9 symbols
  pointOfOrigin: string;
  status: 'offline' | 'dialing' | 'connected' | 'locked' | 'incoming';
  connectedTo?: string;
  securityLevel: 'Safe' | 'Restricted' | 'Hostile' | 'Hazardous' | 'Classified';
  classification:
    | 'Homeworld Bastion'
    | 'Ancient Temple Ruin'
    | 'Military Stronghold'
    | 'Nanite Citadel'
    | 'Destiny Seed Vessel'
    | 'Superweapon Sanctuary';
  powerReqMw: number;
  distanceLy: number;
  description: string;
  loreDetails: string;
  malpTelemetry: {
    atmosphere: string;
    radiation: 'Negligible' | 'Low' | 'Moderate' | 'High' | 'Deadly';
    gravity: string;
    lifeSigns: string;
    threatRating: 'None' | "Goa'uld Jaffa Patrols" | 'Wraith Drone Swarm' | 'Replicator Nanites' | 'Ancient Automated Drones';
    resourcesAvailable: string;
  };
  lootEstimates: {
    naquadah: number;
    crystal: number;
    darkMatter?: number;
    rareArtifact?: string;
  };
}

export interface StargateGlyph {
  id: string;
  symbol: string;
  name: string;
  phonetic: string;
  constellation: string;
}

export interface SGTeamUnit {
  id: string;
  code: string;
  name: string;
  specialization:
    | 'Archaeology & Ancient Tech'
    | 'Heavy Marine Assault'
    | 'Naquadah Mining & Engineering'
    | 'Covert Infiltration & Sabotage';
  leader: string;
  successBonus: string;
  turnCost: number;
  perkDescription: string;
  missionsCount: number;
}

export interface JumpGateFleetComposition {
  lightFighters: number;
  heavyCruisers: number;
  battleships: number;
  battlecruisers: number;
  deathstars: number;
  largeCargos: number;
  recyclers: number;
}

export interface JumpGateRelay {
  id: string;
  name: string;
  hubType: 'Lunar Orbital' | 'Phalanx Bastion' | 'Deep Space Starbase' | 'Asteroid Perimeter' | 'Planetary Ring';
  sectorCoordinates: string;
  level: number;
  maxFleetDisplacement: number; // max ships per transit
  capacitorCharge: number; // 0-100%
  cooldownSeconds: number;
  maxCooldownSeconds: number;
  quantumCoolantLevel: number; // level 1-5
  tachyonStabilizerLevel: number; // level 1-5
  status: 'online' | 'recharging' | 'overheating';
  stationedFleet: JumpGateFleetComposition;
}

export interface AncientControlCrystal {
  id: string;
  name: string;
  rarity: 'Ancient Rare' | 'Lantean Relic' | 'Zero Point Core';
  effect: string;
  installed: boolean;
  socket: 'dhd_core' | 'jump_capacitor' | 'shield_harmonics';
  boostValue: string;
}

export interface SupergateSingularity {
  id: string;
  name: string;
  segmentsAssembled: number; // max 90
  microSingularityMass: number; // micro-solar units
  status: 'dormant' | 'charging' | 'singularity_active';
  crossGalaxyEnergy: number;
  darkMatterHarvestRate: number;
}

// -------------------------------------------------------------
// The 39 Ancient Glyphs (Milky Way & Pegasus)
// -------------------------------------------------------------
export const STARGATE_GLYPHS: StargateGlyph[] = [
  { id: 'glyph-origin', symbol: 'ᐰ', name: 'Tau\'ri Point of Origin', phonetic: 'At', constellation: 'Sol / Earth' },
  { id: 'glyph-crater', symbol: '𐎠', name: 'Crater', phonetic: 'Al', constellation: 'Crater' },
  { id: 'glyph-virgo', symbol: '♍', name: 'Virgo', phonetic: 'Dan', constellation: 'Virgo' },
  { id: 'glyph-bootes', symbol: '𐎡', name: 'Bootes', phonetic: 'Boh', constellation: 'Bootes' },
  { id: 'glyph-centaurus', symbol: '𐎢', name: 'Centaurus', phonetic: 'Cen', constellation: 'Centaurus' },
  { id: 'glyph-libra', symbol: '♎', name: 'Libra', phonetic: 'Lib', constellation: 'Libra' },
  { id: 'glyph-serpens', symbol: '𐎣', name: 'Serpens Caput', phonetic: 'Ser', constellation: 'Serpens' },
  { id: 'glyph-norma', symbol: '𐎤', name: 'Norma', phonetic: 'Nor', constellation: 'Norma' },
  { id: 'glyph-scorpius', symbol: '♏', name: 'Scorpius', phonetic: 'Sco', constellation: 'Scorpius' },
  { id: 'glyph-corona', symbol: '𐎥', name: 'Corona Australis', phonetic: 'Cor', constellation: 'Corona Australis' },
  { id: 'glyph-scutum', symbol: '𐎦', name: 'Scutum', phonetic: 'Scu', constellation: 'Scutum' },
  { id: 'glyph-sagittarius', symbol: '♐', name: 'Sagittarius', phonetic: 'Sag', constellation: 'Sagittarius' },
  { id: 'glyph-aquila', symbol: '𐎧', name: 'Aquila', phonetic: 'Aqu', constellation: 'Aquila' },
  { id: 'glyph-microscopium', symbol: '𐎨', name: 'Microscopium', phonetic: 'Mic', constellation: 'Microscopium' },
  { id: 'glyph-capricornus', symbol: '♑', name: 'Capricornus', phonetic: 'Cap', constellation: 'Capricornus' },
  { id: 'glyph-piscis', symbol: '𐎩', name: 'Piscis Austrinus', phonetic: 'Pis', constellation: 'Piscis Austrinus' },
  { id: 'glyph-pegasus', symbol: '𐎪', name: 'Pegasus Constellation', phonetic: 'Peg', constellation: 'Pegasus' },
  { id: 'glyph-sculptor', symbol: '𐎫', name: 'Sculptor', phonetic: 'Scu', constellation: 'Sculptor' },
  { id: 'glyph-pisces', symbol: '♓', name: 'Pisces Twin Stars', phonetic: 'Tah', constellation: 'Pisces' },
  { id: 'glyph-andromeda', symbol: '𐎬', name: 'Andromeda', phonetic: 'And', constellation: 'Andromeda' },
  { id: 'glyph-triangulum', symbol: '△', name: 'Triangulum', phonetic: 'Tri', constellation: 'Triangulum' },
  { id: 'glyph-aries', symbol: '♈', name: 'Aries', phonetic: 'Ari', constellation: 'Aries' },
  { id: 'glyph-perseus', symbol: '𐎭', name: 'Perseus', phonetic: 'Per', constellation: 'Perseus' },
  { id: 'glyph-taurus', symbol: '♉', name: 'Taurus', phonetic: 'Tau', constellation: 'Taurus' },
  { id: 'glyph-gemini', symbol: '♊', name: 'Gemini', phonetic: 'Gem', constellation: 'Gemini' },
  { id: 'glyph-canis-minor', symbol: '𐎮', name: 'Canis Minor', phonetic: 'Cmi', constellation: 'Canis Minor' },
  { id: 'glyph-monoceros', symbol: '𐎯', name: 'Monoceros', phonetic: 'Mon', constellation: 'Monoceros' },
  { id: 'glyph-orion', symbol: '𐎰', name: 'Orion Hunter', phonetic: 'Ori', constellation: 'Orion' },
];

// -------------------------------------------------------------
// Expanded Stargate Addresses Across 4 Galaxies
// -------------------------------------------------------------
export const STARGATE_NETWORK: StargateAddress[] = [
  {
    id: 'sg_earth',
    name: "Earth / SGC Alpha Site (Tau'ri)",
    designation: 'P2X-3YZ · Cheyenne Mountain Complex',
    galaxy: 'Milky Way',
    chevrons: ['ᐰ', '𐎠', '♍', '𐎡', '𐎢', '♎', 'ᐰ'],
    pointOfOrigin: 'ᐰ',
    status: 'connected',
    connectedTo: 'sg_atlantis',
    securityLevel: 'Safe',
    classification: 'Homeworld Bastion',
    powerReqMw: 120,
    distanceLy: 0,
    description: 'Primary Stargate Command deep inside Cheyenne Mountain Level 28. Fitted with heavy titanium-trinium iris and automated iris deactivation transponders.',
    loreDetails: 'The cradle of human resistance against the Goa\'uld System Lords. Features dedicated dialer computers, MALP deployment ramps, and emergency naquadah power buffers.',
    malpTelemetry: {
      atmosphere: 'Standard Nitrogen-Oxygen (1.00 atm)',
      radiation: 'Negligible',
      gravity: '1.00 G',
      lifeSigns: 'Overwhelming friendly military & scientific garrison',
      threatRating: 'None',
      resourcesAvailable: 'Refined Titanium, High-Grade Trinium, SGC Supply Hub',
    },
    lootEstimates: {
      naquadah: 20000,
      crystal: 12000,
      rareArtifact: 'SGC GDO Transmitter Chip',
    },
  },
  {
    id: 'sg_atlantis',
    name: 'Atlantis City-Ship (Lantea)',
    designation: 'Pegasus Hub · Ocean Spire',
    galaxy: 'Pegasus',
    chevrons: ['𐎪', '𐎫', '♓', '𐎬', '△', '♈', '𐎭', 'ᐰ'],
    pointOfOrigin: '𐎪',
    status: 'connected',
    connectedTo: 'sg_earth',
    securityLevel: 'Safe',
    classification: 'Ancient Temple Ruin',
    powerReqMw: 850,
    distanceLy: 3000000,
    description: 'Magnificent Ancient city-ship floating upon the azure oceans of planet Lantea. Protected by a crystalline energy shield and powered by ZPM conduits.',
    loreDetails: 'Constructed millions of years ago by the Ancients (Lanteans) before fleeing the Wraith. Houses the central Stargate gantry room with digital DHD consoles and drone weapon chairs.',
    malpTelemetry: {
      atmosphere: 'Pristine Oceanic Air (1.02 atm)',
      radiation: 'Negligible',
      gravity: '1.04 G',
      lifeSigns: 'Friendly expeditionary garrison & Ancient holographic archives',
      threatRating: 'None',
      resourcesAvailable: 'ZPM Depleted Cores, Lantean Control Crystals, Sub-space Nanites',
    },
    lootEstimates: {
      naquadah: 55000,
      crystal: 38000,
      darkMatter: 250,
      rareArtifact: 'Potentia Zero-Point Depleted Core',
    },
  },
  {
    id: 'sg_dakara',
    name: 'Dakara / Ancient Weapon Temple',
    designation: 'P5C-353 · Holy World of Jaffa',
    galaxy: 'Milky Way',
    chevrons: ['𐎦', '♐', '𐎧', '𐎨', '♑', '𐎩', 'ᐰ'],
    pointOfOrigin: '𐎦',
    status: 'offline',
    securityLevel: 'Restricted',
    classification: 'Superweapon Sanctuary',
    powerReqMw: 340,
    distanceLy: 18400,
    description: 'Holy site of the Free Jaffa Nation where Anubis constructed the temple housing the Ancient molecular disintegration superweapon.',
    loreDetails: 'The site where the Replicator scourge was wiped out across the galaxy by dialing every Stargate simultaneously with the weapon wave.',
    malpTelemetry: {
      atmosphere: 'Arid Mountain Air (0.92 atm)',
      radiation: 'Low',
      gravity: '0.98 G',
      lifeSigns: 'Free Jaffa High Council honor guards & monk guardians',
      threatRating: 'None',
      resourcesAvailable: 'Massive Pure Naquadah Monoliths, Ancient Dialing Relay Rings',
    },
    lootEstimates: {
      naquadah: 68000,
      crystal: 24000,
      darkMatter: 180,
      rareArtifact: 'Dakara Molecular Wave Fragment',
    },
  },
  {
    id: 'sg_chulak',
    name: 'Chulak / Jaffa Stronghold',
    designation: 'P3X-435 · Forest Citadel',
    galaxy: 'Milky Way',
    chevrons: ['𐎠', '𐎡', '𐎢', '♎', '𐎣', '𐎤', 'ᐰ'],
    pointOfOrigin: '𐎠',
    status: 'offline',
    securityLevel: 'Safe',
    classification: 'Homeworld Bastion',
    powerReqMw: 160,
    distanceLy: 8200,
    description: 'Lush forested cradle world of the Jaffa warriors, formerly ruled by Apophis. Now a vital center for the Free Jaffa military coalition.',
    loreDetails: 'Teal\'c\'s homeworld where Jaffa larvae symbionts were cultivated. Ancient stone architecture surrounded by dense conifer canopies.',
    malpTelemetry: {
      atmosphere: 'Temperate Forest Air (1.00 atm)',
      radiation: 'Negligible',
      gravity: '1.00 G',
      lifeSigns: 'Friendly Jaffa warrior regiments & staff weapon drills',
      threatRating: 'None',
      resourcesAvailable: 'Staff Weapon Energy Cells, Heavy Liquid Naquadah',
    },
    lootEstimates: {
      naquadah: 32000,
      crystal: 16000,
      rareArtifact: 'Master Bra\'tac Honor Dagger',
    },
  },
  {
    id: 'sg_tollana',
    name: 'Tollana / Curia Planetary Grid',
    designation: 'P4X-377 · Advanced World',
    galaxy: 'Milky Way',
    chevrons: ['♎', '𐎣', '𐎤', '♏', '𐎥', '𐎦', 'ᐰ'],
    pointOfOrigin: '♎',
    status: 'offline',
    securityLevel: 'Safe',
    classification: 'Homeworld Bastion',
    powerReqMw: 290,
    distanceLy: 14500,
    description: 'High-tech world colonized by the Tollan with custom-built white Stargate, ion defense cannons, and matter-disruptor phasing technology.',
    loreDetails: 'The Tollan built their own functional Stargate from scratch using advanced metallurgy without Ancient machinery.',
    malpTelemetry: {
      atmosphere: 'Filtered Urban Air (1.00 atm)',
      radiation: 'Negligible',
      gravity: '0.99 G',
      lifeSigns: 'Automated defense drones & scientific archives',
      threatRating: 'None',
      resourcesAvailable: 'Trinium Alloy Plates, Phase-Shift Crystal Matrices',
    },
    lootEstimates: {
      naquadah: 42000,
      crystal: 48000,
      darkMatter: 120,
      rareArtifact: 'Tollan Phase-Shift Pocket Module',
    },
  },
  {
    id: 'sg_delmak',
    name: 'Delmak / Sokar\'s Volcanic Hell',
    designation: 'P2A-018 · Netherworld Core',
    galaxy: 'Milky Way',
    chevrons: ['♏', '𐎥', '𐎦', '♐', '𐎧', '𐎨', 'ᐰ'],
    pointOfOrigin: '♏',
    status: 'offline',
    securityLevel: 'Hostile',
    classification: 'Military Stronghold',
    powerReqMw: 410,
    distanceLy: 29000,
    description: 'Hellish volcanic planet with super-heated magma oceans, orbital prison moon Netu, and heavily armed subterranean Goa\'uld arsenals.',
    loreDetails: 'The dreaded throne world of Sokar, later usurped by Apophis. Subsurface vaults house prototypes for stealth-cloaked Ha\'tak warships.',
    malpTelemetry: {
      atmosphere: 'Sulfurous Volcanic Gases (1.45 atm) - Filter Required',
      radiation: 'Moderate',
      gravity: '1.25 G',
      lifeSigns: 'Sokar zealot legions & serpentine terror beasts',
      threatRating: "Goa'uld Jaffa Patrols",
      resourcesAvailable: 'High-Thermal Geothermal Plasma, Molten Naquadah Slag',
    },
    lootEstimates: {
      naquadah: 82000,
      crystal: 21000,
      rareArtifact: 'Sokar Shadow Death Mask',
    },
  },
  {
    id: 'sg_tartarus',
    name: 'Tartarus / Kull Super-Soldier Base',
    designation: 'P3X-584 · Black Fortress',
    galaxy: 'Milky Way',
    chevrons: ['♑', '𐎩', '𐎪', '𐎫', '♓', '𐎬', 'ᐰ'],
    pointOfOrigin: '♑',
    status: 'offline',
    securityLevel: 'Hazardous',
    classification: 'Military Stronghold',
    powerReqMw: 520,
    distanceLy: 38000,
    description: 'Anubis\' heavily fortified stronghold protected by an impenetrable energy forcefield covering the Stargate and housing thousands of Kull synthetic warriors.',
    loreDetails: 'Genetic incubation chambers where Anubis reanimated mindless drone shock troopers impervious to standard energy and kinetic weapons.',
    malpTelemetry: {
      atmosphere: 'Dry Barren Cavern Air (0.85 atm)',
      radiation: 'Moderate',
      gravity: '1.10 G',
      lifeSigns: 'Dormant Kull synthetic biomechanical pods',
      threatRating: "Goa'uld Jaffa Patrols",
      resourcesAvailable: 'Kull Energy Absorbing Fiber, Anubis Genetic Serum',
    },
    lootEstimates: {
      naquadah: 95000,
      crystal: 34000,
      darkMatter: 310,
      rareArtifact: 'Kull Warrior Regenerative Plating',
    },
  },
  {
    id: 'sg_asuras',
    name: 'Asuras / Replicator Homeworld',
    designation: 'M7G-677 · Nanite Metropolis',
    galaxy: 'Pegasus',
    chevrons: ['△', '♈', '𐎭', '♉', '♊', '𐎮', '𐎯', 'ᐰ'],
    pointOfOrigin: '△',
    status: 'offline',
    securityLevel: 'Hazardous',
    classification: 'Nanite Citadel',
    powerReqMw: 920,
    distanceLy: 3200000,
    description: 'Gargantuan crystalline planet entirely covered in nanite metropolis structures, built by human-form Replicators created by the Lanteans.',
    loreDetails: 'The Asuran Replicators possessed entire fleets of Aurora-class battleships and city-ships with infinite self-replication capabilities.',
    malpTelemetry: {
      atmosphere: 'Synthetic Sterile Atmosphere (1.00 atm)',
      radiation: 'Negligible',
      gravity: '1.00 G',
      lifeSigns: 'Billions of human-form nanite consensus units',
      threatRating: 'Replicator Nanites',
      resourcesAvailable: 'Pure Molecular Neutronium, Cohesive Nanite Blocks',
    },
    lootEstimates: {
      naquadah: 110000,
      crystal: 90000,
      darkMatter: 650,
      rareArtifact: 'Asuran Base Code Nanite Core',
    },
  },
  {
    id: 'sg_wraith_hive',
    name: 'M7R-227 / Wraith Nursery Hive',
    designation: 'Wraith Feeding Sector Zeta',
    galaxy: 'Pegasus',
    chevrons: ['♈', '𐎭', '♉', '♊', '𐎮', '𐎯', '𐎰', 'ᐰ'],
    pointOfOrigin: '♈',
    status: 'offline',
    securityLevel: 'Hostile',
    classification: 'Military Stronghold',
    powerReqMw: 780,
    distanceLy: 3150000,
    description: 'Swamp world shrouded in thick psychic mist where a supermassive Wraith hive ship has rooted itself into the planetary crust to harvest organic matter.',
    loreDetails: 'Cloning chambers powered by stolen ZPMs, guarded by thousands of faceless drone warriors and telepathic Wraith Queens.',
    malpTelemetry: {
      atmosphere: 'Dense Organic Mists (1.15 atm)',
      radiation: 'Low',
      gravity: '1.08 G',
      lifeSigns: 'Thousands of dormant bio-telepathic life signatures',
      threatRating: 'Wraith Drone Swarm',
      resourcesAvailable: 'Organic Hull Chitin, Stolen ZPM Power Capacitors',
    },
    lootEstimates: {
      naquadah: 76000,
      crystal: 45000,
      darkMatter: 280,
      rareArtifact: 'Wraith Queen Stunner Rifle & Bio-Key',
    },
  },
  {
    id: 'sg_othala',
    name: 'Othala / Hall of Thor',
    designation: 'Ida Core · Asgard Sovereign World',
    galaxy: 'Ida',
    chevrons: ['𐎠', '♍', '𐎡', '𐎢', '♎', '𐎣', '𐎤', 'ᐰ'],
    pointOfOrigin: '𐎠',
    status: 'offline',
    securityLevel: 'Safe',
    classification: 'Homeworld Bastion',
    powerReqMw: 1200,
    distanceLy: 4000000,
    description: 'Homeworld of the Asgard High Council. Features neutrino-ion generators, time dilation vaults, and holographic archives of the Great Alliance.',
    loreDetails: 'Requires an eight-chevron dial sequence with boosted power from a Naquadah booster generator or Asgard hyper-core.',
    malpTelemetry: {
      atmosphere: 'Nitrogen-Argon Balanced (0.95 atm)',
      radiation: 'Negligible',
      gravity: '0.90 G',
      lifeSigns: 'Asgard Council Clones & Automated O\'Neill Battleships',
      threatRating: 'None',
      resourcesAvailable: 'Neutrino-Ion Generator Relics, Asgard Computer Crystals',
    },
    lootEstimates: {
      naquadah: 130000,
      crystal: 115000,
      darkMatter: 800,
      rareArtifact: 'Asgard Holographic Datapad of Thor',
    },
  },
  {
    id: 'sg_destiny',
    name: 'Ancient Vessel Destiny',
    designation: 'Automated Deep Space Explorer',
    galaxy: 'Universe',
    chevrons: ['ᐰ', '𐎠', '♍', '𐎡', '𐎢', '♎', '𐎣', '𐎤', 'ᐰ'],
    pointOfOrigin: 'ᐰ',
    status: 'offline',
    securityLevel: 'Classified',
    classification: 'Destiny Seed Vessel',
    powerReqMw: 2500,
    distanceLy: 8500000000,
    description: 'Legendary automated ship launched by the Ancients tens of millions of years ago to investigate cosmic microwave background radiation at the edge of the universe.',
    loreDetails: 'Requires a 9-chevron code utilizing immense raw geothermal or solar power directly tapped from a planetary naquadria core.',
    malpTelemetry: {
      atmosphere: 'Thin Pressurized Compartments (0.80 atm)',
      radiation: 'High',
      gravity: '0.85 G',
      lifeSigns: 'Automated neural interface chair & repair robots',
      threatRating: 'Ancient Automated Drones',
      resourcesAvailable: 'Cosmic Microwave Telemetry, Destiny FTL Fuel Slurry',
    },
    lootEstimates: {
      naquadah: 250000,
      crystal: 180000,
      darkMatter: 1500,
      rareArtifact: 'Destiny Master Bridge Command Code',
    },
  },
  {
    id: 'sg_novus',
    name: 'Novus / Iron Citadel of Man',
    designation: 'Colonial Descendant Hub',
    galaxy: 'Universe',
    chevrons: ['𐎯', '𐎰', '𐎠', '♍', '𐎡', '𐎢', '♎', 'ᐰ'],
    pointOfOrigin: '𐎯',
    status: 'offline',
    securityLevel: 'Safe',
    classification: 'Homeworld Bastion',
    powerReqMw: 1800,
    distanceLy: 8200000000,
    description: 'World founded by alternate Destiny crew sent back through time. Built massive geothermal cities and deep space archives of Earth-Destiny civilization.',
    loreDetails: 'Features colossal archive bunkers preserving 2,000 years of scientific advancement prior to tectonic cataclysm.',
    malpTelemetry: {
      atmosphere: 'Dense Ash-Filtered Atmosphere (1.10 atm)',
      radiation: 'Moderate',
      gravity: '1.02 G',
      lifeSigns: 'Novus Historical Archive AI Mainframe',
      threatRating: 'None',
      resourcesAvailable: 'Novus Subterranean Archive Cores, Geothermal Cells',
    },
    lootEstimates: {
      naquadah: 160000,
      crystal: 120000,
      darkMatter: 950,
      rareArtifact: 'Novus Historical Library Archive Crystal',
    },
  },
];

// -------------------------------------------------------------
// SG Expeditionary Teams
// -------------------------------------------------------------
export const SG_TEAMS: SGTeamUnit[] = [
  {
    id: 'team-sg1',
    code: 'SG-1',
    name: 'Flagship Tactical & Archaeological Unit',
    specialization: 'Archaeology & Ancient Tech',
    leader: 'Col. Samantha Carter & Dr. Daniel Jackson',
    successBonus: '+45% Rare Artifact Drop & +25% Crystal Yield',
    turnCost: 1,
    perkDescription: 'Expert knowledge of Ancient dialect, Goa\'uld technology, and Asgard physics guarantees deciphering of locked ruins and zero trap detonation.',
    missionsCount: 142,
  },
  {
    id: 'team-sg3',
    code: 'SG-3',
    name: 'US Marine Heavy Combat Corps',
    specialization: 'Heavy Marine Assault',
    leader: 'Major Castleman',
    successBonus: '+60% Combat Win Rate against Hostile Garrisons & +40% Naquadah Seized',
    turnCost: 1,
    perkDescription: 'Equipped with heavy machine guns, C-4 shaped charges, and portable railgun turrets to neutralize enemy Jaffa and Wraith swarms.',
    missionsCount: 98,
  },
  {
    id: 'team-sg11',
    code: 'SG-11',
    name: 'Planetary Engineering & Extraction Corps',
    specialization: 'Naquadah Mining & Engineering',
    leader: 'Dr. David Edwards',
    successBonus: '+100% Raw Naquadah & Mineral Extraction Yield',
    turnCost: 1,
    perkDescription: 'Deploys sonic excavators and heavy transport MALP sleds directly through the event horizon to harvest rich veins of ore.',
    missionsCount: 76,
  },
  {
    id: 'team-sg22',
    code: 'SG-22',
    name: 'Covert SpecOps & Infiltration Recon',
    specialization: 'Covert Infiltration & Sabotage',
    leader: 'Lt. Col. Reynolds',
    successBonus: '100% Safe Evacuation Rate & Zero Casualties Guarantee',
    turnCost: 1,
    perkDescription: 'Utilizes Sodan stealth cloaking devices and miniature sensor bugs to slip past hostile forcefields without detection.',
    missionsCount: 64,
  },
];

// -------------------------------------------------------------
// Subspace Jump Gate Relay Network (Game Fleets)
// -------------------------------------------------------------
export const INITIAL_JUMP_GATE_RELAYS: JumpGateRelay[] = [
  {
    id: 'relay-lunar-alpha',
    name: 'Lunar Alpha Jump Gate [Earth Moon]',
    hubType: 'Lunar Orbital',
    sectorCoordinates: '[1:234:4]',
    level: 4,
    maxFleetDisplacement: 25000,
    capacitorCharge: 100,
    cooldownSeconds: 0,
    maxCooldownSeconds: 90,
    quantumCoolantLevel: 4,
    tachyonStabilizerLevel: 3,
    status: 'online',
    stationedFleet: {
      lightFighters: 450,
      heavyCruisers: 85,
      battleships: 32,
      battlecruisers: 14,
      deathstars: 1,
      largeCargos: 180,
      recyclers: 75,
    },
  },
  {
    id: 'relay-phalanx-beta',
    name: 'Phalanx Beta Relay [Mars Orbital Moon]',
    hubType: 'Phalanx Bastion',
    sectorCoordinates: '[2:112:8]',
    level: 3,
    maxFleetDisplacement: 18000,
    capacitorCharge: 82,
    cooldownSeconds: 35,
    maxCooldownSeconds: 120,
    quantumCoolantLevel: 3,
    tachyonStabilizerLevel: 2,
    status: 'recharging',
    stationedFleet: {
      lightFighters: 220,
      heavyCruisers: 40,
      battleships: 12,
      battlecruisers: 6,
      deathstars: 0,
      largeCargos: 95,
      recyclers: 30,
    },
  },
  {
    id: 'relay-orion-deep',
    name: 'Orion Deep Terminal [Sector 3 Starbase]',
    hubType: 'Deep Space Starbase',
    sectorCoordinates: '[3:400:15]',
    level: 5,
    maxFleetDisplacement: 40000,
    capacitorCharge: 100,
    cooldownSeconds: 0,
    maxCooldownSeconds: 60,
    quantumCoolantLevel: 5,
    tachyonStabilizerLevel: 5,
    status: 'online',
    stationedFleet: {
      lightFighters: 800,
      heavyCruisers: 150,
      battleships: 65,
      battlecruisers: 28,
      deathstars: 3,
      largeCargos: 320,
      recyclers: 120,
    },
  },
  {
    id: 'relay-pegasus-sanctuary',
    name: 'Pegasus Sanctuary Hub [Colony Moon Theta]',
    hubType: 'Planetary Ring',
    sectorCoordinates: '[5:50:3]',
    level: 2,
    maxFleetDisplacement: 12000,
    capacitorCharge: 100,
    cooldownSeconds: 0,
    maxCooldownSeconds: 150,
    quantumCoolantLevel: 2,
    tachyonStabilizerLevel: 2,
    status: 'online',
    stationedFleet: {
      lightFighters: 110,
      heavyCruisers: 18,
      battleships: 5,
      battlecruisers: 2,
      deathstars: 0,
      largeCargos: 60,
      recyclers: 15,
    },
  },
];

// -------------------------------------------------------------
// Ancient Control Crystals
// -------------------------------------------------------------
export const ANCIENT_CRYSTALS: AncientControlCrystal[] = [
  {
    id: 'cryst-dhd-master',
    name: 'Master DHD Polaron Interface Crystal',
    rarity: 'Lantean Relic',
    effect: 'Fast-tracks chevron locking by 60% and reduces Naquadah dialing cost to zero.',
    installed: true,
    socket: 'dhd_core',
    boostValue: '-60% Dial Time',
  },
  {
    id: 'cryst-zpm-fragment',
    name: 'Potentia Zero Point Capacitor Shard',
    rarity: 'Zero Point Core',
    effect: 'Unlocks 8th & 9th Chevron intergalactic dialing to Pegasus, Ida, and Destiny.',
    installed: true,
    socket: 'dhd_core',
    boostValue: '+9th Chevron Unlocked',
  },
  {
    id: 'cryst-tachyon-flux',
    name: 'Tachyon Flux Compression Prism',
    rarity: 'Ancient Rare',
    effect: 'Cuts Subspace Jump Gate capacitor cooldown in half across all orbital relays.',
    installed: true,
    socket: 'jump_capacitor',
    boostValue: '-50% Jump Cooldown',
  },
  {
    id: 'cryst-harmonics',
    name: 'Trinium Harmonic Phase Inverter',
    rarity: 'Ancient Rare',
    effect: 'Reinforces the Stargate mechanical iris against particle beam weapon attacks.',
    installed: false,
    socket: 'shield_harmonics',
    boostValue: '+100% Iris Absorption',
  },
];

// -------------------------------------------------------------
// Supergate Singularity
// -------------------------------------------------------------
export const INITIAL_SUPERGATE: SupergateSingularity = {
  id: 'supergate-ori-prime',
  name: 'Kallana Ori Supergate [Singularity Anchor]',
  segmentsAssembled: 90,
  microSingularityMass: 1.4, // solar masses
  status: 'singularity_active',
  crossGalaxyEnergy: 100000,
  darkMatterHarvestRate: 45, // per turn
};
