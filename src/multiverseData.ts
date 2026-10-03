export interface MultiverseUniverse {
  id: number;
  name: string;
  tagline: string;
  dimensionCode: string;
  dimensionalFrequency: string;
  cosmicModifier: {
    label: string;
    description: string;
    bonusType: 'naquadah' | 'metal' | 'crystal' | 'deuterium' | 'glory' | 'shield' | 'attack' | 'speed';
    bonusPct: number;
  };
  totalGalaxies: number; // Exactly 90
  dominantFaction: string;
  factionColor: string;
  travelDeuteriumCost: number;
  travelTurnsCost: number;
  atmosphereTheme: string;
  lore: string;
}

export interface UniverseGalaxy {
  galaxyNumber: number; // 1 to 90
  name: string;
  systemCount: number; // 999 systems
  galaxyType: 'Spiral' | 'Elliptical' | 'Barred Spiral' | 'Ring Cluster' | 'Irregular Rift' | 'Dwarf Nebula';
  stellarDensity: string;
  primaryResourceAbundance: 'Naquadah' | 'Heavy Metal' | 'Silicate Crystal' | 'Cryo Deuterium' | 'Dark Matter';
  hyperspaceSafetyRating: string;
  stargateSubnetwork: string;
}

// Deterministic PRNG
function getMultiverseHash(seed: number, offset: number = 0): number {
  let h = (seed + offset * 0x9e3779b9) ^ (seed >>> 16);
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const UNIVERSE_TITLES: { name: string; tagline: string; modifier: MultiverseUniverse['cosmicModifier']; faction: string; color: string; lore: string }[] = [
  {
    name: 'Universe 01: Prime Milky Way & Avalon Core',
    tagline: 'The original baseline reality of the Tau\'ri, Ancients, and Stargate network.',
    modifier: { label: '+15% Stargate Turn Efficiency & +10% Glory XP', description: 'Optimal subspace resonance across all 90 Milky Way & Pegasus galaxies.', bonusType: 'glory', bonusPct: 15 },
    faction: 'Tau\'ri & Free Jaffa Alliance',
    color: '#10b981',
    lore: 'The foundational universe where the Alteran Ancients first constructed the Astria Porta network and the Tau\'ri began their cosmic ascendance.',
  },
  {
    name: 'Universe 02: Antimatter Inversion Continuum',
    tagline: 'A mirror dimension where entropy flows inversely through high-energy plasma.',
    modifier: { label: '+40% Cryo-Deuterium Isotope Synthesis', description: 'Antimatter quantum fields catalyze nuclear fusion reactors at hyper-density.', bonusType: 'deuterium', bonusPct: 40 },
    faction: 'Antimatter Syndicate Vanguard',
    color: '#06b6d4',
    lore: 'In this parallel continuum, stars burn with intense blue-violet positrons, making deuterium and exotic propulsion fuels abundant.',
  },
  {
    name: 'Universe 03: Quantum Singularity & Phase-Shift',
    tagline: 'Superpositioned timeline where matter exists in multiple eigenstates simultaneously.',
    modifier: { label: '+30% Research Speed & +20% Shield Buffer', description: 'Quantum tunneling shields deflect incoming particle barrages with zero delay.', bonusType: 'shield', bonusPct: 20 },
    faction: 'Ascended Science Directorate',
    color: '#8b5cf6',
    lore: 'A reality reshaped by precursor temporal experiments. Navigating this realm requires quantum Phase-Lock drives.',
  },
  {
    name: 'Universe 04: Asgard High-Crystal Dimension',
    tagline: 'Crystal-resonant universe forged in the deep Ida void of Asgard engineering.',
    modifier: { label: '+35% Silicate Crystal Extraction & Optical Tech', description: 'Surface crusts of all 90 galaxies are rich with pure hyper-drive crystals.', bonusType: 'crystal', bonusPct: 35 },
    faction: 'Asgard Automated Custodian Order',
    color: '#38bdf8',
    lore: 'Populated by dormant Asgard archive monoliths and automated high-yield crystalline refineries across all 90 constituent galaxies.',
  },
  {
    name: 'Universe 05: Ori Fundamentalist Crucible',
    tagline: 'High-energy divine realm saturated with transcendent Origin radiation.',
    modifier: { label: '+25% Flagship Alpha Strike DPS & Glory XP', description: 'Spiritual crusade energies overcharge beam weapon capacitors.', bonusType: 'attack', bonusPct: 25 },
    faction: 'Ori Prior Inquisitor Armada',
    color: '#ec4899',
    lore: 'A universe under the eternal gaze of transcendent beings. The skies glow with auroral fire and golden battle fleets.',
  },
  {
    name: 'Universe 06: Heavy Metal & Neutronium Core',
    tagline: 'High-gravity universe of collapsed supernovas and dense titanium crusts.',
    modifier: { label: '+45% Titanium & Heavy Metal Mining Yield', description: 'Dense celestial cores provide limitless armor alloys for shipyard drydocks.', bonusType: 'metal', bonusPct: 45 },
    faction: 'Titan Metallurgical Consortium',
    color: '#f97316',
    lore: 'Formed from a hyper-dense cosmic inflation event, every planet in this universe possesses an iron-nickel mantle of staggering density.',
  },
  {
    name: 'Universe 07: Replicator Micro-Swarm Nexus',
    tagline: 'A self-replicating nanite realm where mechanical logic has consumed stars.',
    modifier: { label: '+30% Shipyard Construction & Nanite Repair', description: 'Microscopic construction bots accelerate colony building grids by 30%.', bonusType: 'speed', bonusPct: 30 },
    faction: 'Replicator Hive Overmind',
    color: '#a855f7',
    lore: 'An eerie mechanical wonderland where billions of nanite swarms construct Dyson swarms and mechanical planetary shells in real-time.',
  },
  {
    name: 'Universe 08: Deep Void Precursor Expanse',
    tagline: 'Ancient cosmos containing dormant Alteran superstructures and Dyson rings.',
    modifier: { label: '+35% Naquadah Lode Purity & Superweapon Output', description: 'Unrefined naquadah veins pulse with pure stargate conduit power.', bonusType: 'naquadah', bonusPct: 35 },
    faction: 'Ancient Custodian Sentinels',
    color: '#eab308',
    lore: 'Filled with colossal ringworlds, stellar engines, and automated defense sentinels guarding billions of years of forgotten technology.',
  },
  {
    name: 'Universe 09: Tachyon Warp Surge Expanse',
    tagline: 'High-velocity subspace continuum allowing ultra-luminal fleet maneuvers.',
    modifier: { label: '-25% Hyperspace Jump Turns & Fleet Transit Time', description: 'Subspace drag is virtually zero throughout all 90 galaxies.', bonusType: 'speed', bonusPct: 25 },
    faction: 'Tachyon Corsair Hegemony',
    color: '#14b8a6',
    lore: 'Space itself behaves like a superfluid, enabling battlecruisers and transport fleets to cross entire galaxies in mere seconds.',
  },
  {
    name: 'Universe 10: The Sovereign Dominion Imperium',
    tagline: 'A heavily fortified galactic empire spanning 90 militarized galaxies.',
    modifier: { label: '+20% Imperial Colony Tribute Rate', description: 'Rigorous imperial tax logistics maximize planetary tribute revenues.', bonusType: 'naquadah', bonusPct: 20 },
    faction: 'Supreme High Command',
    color: '#dc2626',
    lore: 'An iron-fisted reality where military discipline and industrial standardization have turned 90 galaxies into an unstoppable war machine.',
  },
  {
    name: 'Universe 11: Celestial Aurora & Solar Wind Realm',
    tagline: 'A universe illuminated by hyper-radiant O-type stars and stellar nebulae.',
    modifier: { label: '+35% Solar Power & +25% Planetary Shielding', description: 'Radiant stellar photons continuously recharge planetary deflector grids.', bonusType: 'shield', bonusPct: 25 },
    faction: 'Solar Templar Concordat',
    color: '#fbbf24',
    lore: 'Nebulae in this universe span entire spiral arms, filling space with breathtaking luminous clouds of ionized hydrogen and gold dust.',
  },
  {
    name: 'Universe 12: Chrono-Temporal Echo Reality',
    tagline: 'A dimension where past, present, and future bleed together in temporal rifts.',
    modifier: { label: '+25% Extra Attack Turns Generated Per Cycle', description: 'Temporal flux eddies periodically rewind fleet action chronometers.', bonusType: 'speed', bonusPct: 25 },
    faction: 'Time-Weaver Directorate',
    color: '#6366f1',
    lore: 'Wreckage from future battles floats alongside ancient ruins, offering visionary tacticians glimpses of battles yet to be fought.',
  },
  {
    name: 'Universe 13: Volcanic Hellforge Armadas',
    tagline: 'Infernal reality of molten planetoids and magma-forged dreadnoughts.',
    modifier: { label: '+40% Volley Armor Penetration & Metal Harvest', description: 'Magma crusts yield superheated alloys impervious to laser fire.', bonusType: 'metal', bonusPct: 40 },
    faction: 'Hellforge Battle Clans',
    color: '#ef4444',
    lore: 'Nearly every world in these 90 galaxies possesses an active molten mantle, creating an ideal crucible for high-yield ordnance factories.',
  },
  {
    name: 'Universe 14: Abyssal Oceanic Hydrospheres',
    tagline: 'Tranquil aquatic universe dominated by water-worlds and deuterium geysers.',
    modifier: { label: '+45% Pure Water Extraction & Deuterium Synthesis', description: 'Deep ocean trenches conceal immense cold fusion energy pockets.', bonusType: 'deuterium', bonusPct: 45 },
    faction: 'Nautilus Hydrosphere Union',
    color: '#0284c7',
    lore: 'Endless sapphire oceans cover 95% of planetary surfaces, home to bioluminescent megafauna and submerged precursor research vaults.',
  },
  {
    name: 'Universe 15: Dark Energy Singularity Web',
    tagline: 'A mysterious realm where dark matter strands knit 90 galaxies into a web.',
    modifier: { label: '+30% Stealth Cloaking & Sensor Jamming', description: 'Dark matter distortion masks fleet signatures from enemy scans.', bonusType: 'attack', bonusPct: 30 },
    faction: 'Shadow Void Phantoms',
    color: '#475569',
    lore: 'Cosmic web filaments connect every planetary system, allowing covert black-ops fleets to slip undetected behind enemy lines.',
  },
  {
    name: 'Universe 16: Crystalline Prism Matrix',
    tagline: 'A blinding cosmos where optical prisms focus laser beams across systems.',
    modifier: { label: '+40% Energy Weapon Damage & Crystal Extract', description: 'Prismatic refraction fields amplify orbital laser lances.', bonusType: 'crystal', bonusPct: 40 },
    faction: 'Prism Lattice Archons',
    color: '#818cf8',
    lore: 'Giant monolithic crystal pillars sprout from planetary crusts, channeling stellar light into concentrated planetary energy shields.',
  },
  {
    name: 'Universe 17: Cybernetic Ecumenopolis Megacity',
    tagline: 'All 90 galaxies transformed into interconnected city-worlds and server grids.',
    modifier: { label: '+35% Population Capacity & Tax Revenue', description: 'Massive multi-level arcologies house trillions of skilled engineers.', bonusType: 'naquadah', bonusPct: 35 },
    faction: 'Megacorp Cyber-Executive Board',
    color: '#0ea5e9',
    lore: 'Steel and neon stretch from pole to pole across thousands of planets, powered by orbital fusion spires and neural commerce networks.',
  },
  {
    name: 'Universe 18: Eldritch Nebula Graveyard',
    tagline: 'A haunted universe littered with the hulks of million-year-old cosmic wars.',
    modifier: { label: '+50% Battlefield Debris Salvage & Glory XP', description: 'Ancient battle wreckage yields priceless precursor artifacts.', bonusType: 'glory', bonusPct: 50 },
    faction: 'Scavenger Guild Armada',
    color: '#9333ea',
    lore: 'Centuries of interstellar conflict have filled orbital space with derelict dreadnoughts waiting for enterprising commanders to salvage.',
  },
  {
    name: 'Universe 19: Glacial Cryo-Stasis Expanse',
    tagline: 'Absolute zero universe where entropy is suspended in perpetual cryo-frost.',
    modifier: { label: '+35% Weapon Capacitor Cooldown & Deuterium', description: 'Cryogenic ambient temperatures prevent laser heat overload.', bonusType: 'deuterium', bonusPct: 35 },
    faction: 'Frost-Born Cryo-Guardians',
    color: '#7dd3fc',
    lore: 'Glaciers hundreds of kilometers deep lock away ancient alien archives, preserved in perfect stasis since the beginning of time.',
  },
  {
    name: 'Universe 20: Golden Dyson Super-Cluster',
    tagline: 'A civilization that built Dyson swarms around all 90,000 constituent stars.',
    modifier: { label: '+40% Solar Energy & Planetary Grid Output', description: 'Dyson megastructures beam limitless microwave power to colonies.', bonusType: 'naquadah', bonusPct: 40 },
    faction: 'Architects of the Spheres',
    color: '#eab308',
    lore: 'A breathtaking testament to supreme engineering where virtually no starlight is wasted, bathing entire galaxies in golden power arrays.',
  },
  {
    name: 'Universe 21: Radio-Isotope Badlands & Cobalt Suns',
    tagline: 'A hostile irradiated universe where only hardened armor survives.',
    modifier: { label: '+30% Armor Hardening & Radiation Resistance', description: 'Cobalt-alloy plating absorbs 30% more kinetic impact energy.', bonusType: 'metal', bonusPct: 30 },
    faction: 'Cobalt Warlord Syndicates',
    color: '#84cc16',
    lore: 'Fierce radioactive pulsars illuminate rocky wastelands where mercenary clans clash over hyper-dense cobalt and radioactive mineral lodes.',
  },
  {
    name: 'Universe 22: Biological Living Chitin Biosphere',
    tagline: 'A cosmos where planets are living bio-organisms and ships are grown.',
    modifier: { label: '+25% Passive Nanite Hull Regeneration', description: 'Bio-cellular armor heals hull breaches automatically during combat.', bonusType: 'shield', bonusPct: 25 },
    faction: 'Bio-Colony Spore Mind',
    color: '#22c55e',
    lore: 'Planetary crusts pulse with heartbeat rhythms, and massive spaceborne leviathans migrate gracefully between star systems.',
  },
  {
    name: 'Universe 23: Pure Graviton Resonance Sphere',
    tagline: 'A gravity-warped dimension of micro-black holes and graviton sails.',
    modifier: { label: '+35% Flagship Mass Acceleration & Alpha Strike', description: 'Graviton catapults launch kinetic slugs at 0.99c velocities.', bonusType: 'attack', bonusPct: 35 },
    faction: 'Graviton Engineers Guild',
    color: '#64748b',
    lore: 'Gravity itself has been harnessed as a construction tool, allowing planetary cores to be shaped into flawless spherical fortresses.',
  },
  {
    name: 'Universe 24: Hyper-Dimensional Subspace Rift',
    tagline: 'A universe fractured by subspace corridors connecting distant galaxies.',
    modifier: { label: '+30% Stargate Jump Range & Zero Fuel Penalty', description: 'Subspace rifts act as natural hyper-highways across all 90 galaxies.', bonusType: 'speed', bonusPct: 30 },
    faction: 'Rift Walker Explorers',
    color: '#a855f7',
    lore: 'Space folds effortlessly here; dialing a 7-glyph address opens instant wormholes to galaxies millions of light-years away.',
  },
  {
    name: 'Universe 25: Hyperion Bastion of the Ancients',
    tagline: 'The pristine fortress reality where the Ancients never suffered the plague.',
    modifier: { label: '+40% Precursor Tech Yield & +30% Glory XP', description: 'Fully functional Atlantis-class spires occupy every core world.', bonusType: 'glory', bonusPct: 40 },
    faction: 'High Council of Atlantis',
    color: '#0284c7',
    lore: 'Graceful flying city-ships glide across azure skies, dispensing wisdom and unstoppable drone weapon swarms to allied commanders.',
  },
  {
    name: 'Universe 26: The Lucian Anarchy & Black Market Rim',
    tagline: 'A lawless smuggler haven where fortunes are made in illicit trade.',
    modifier: { label: '+50% Black Market Trade Profits & Plunder', description: 'Smuggler outposts pay premium rates for plundered galactic goods.', bonusType: 'naquadah', bonusPct: 50 },
    faction: 'Lucian Cartel Syndicate',
    color: '#ef4444',
    lore: 'No central government holds sway across these 90 galaxies; warlords, pirate armadas, and smugglers govern through wealth and firepower.',
  },
  {
    name: 'Universe 27: Zero-Point Vacuum Energy Continuum',
    tagline: 'A dimension tapping directly into the infinite energy of the vacuum.',
    modifier: { label: '+50% ZPM Super-Capacitor Charge Rate', description: 'ZPM power modules operate at 200% efficiency across all systems.', bonusType: 'shield', bonusPct: 50 },
    faction: 'ZPM Reactor Architects',
    color: '#38bdf8',
    lore: 'Tapping into subspace pocket dimensions, planetary shield generators here can withstand weeks of sustained orbital barrage.',
  },
  {
    name: 'Universe 28: Dread Void of the Wraith Feeding Grounds',
    tagline: 'A dark, brooding expanse where bioships hunt through the mist.',
    modifier: { label: '+30% Fighter Wing Lethality & Organic Hull HP', description: 'Wraith dart swarms strike with blinding regenerative ferocity.', bonusType: 'attack', bonusPct: 30 },
    faction: 'Wraith Supreme Hive Queen',
    color: '#15803d',
    lore: 'Hiveships thousands of meters long cruise through the void, shrouded in organic sensor-blocking clouds and deadly escort wings.',
  },
  {
    name: 'Universe 29: Singularity Horizon of the Black Sun',
    tagline: 'A cosmos orbiting a supermassive cosmic black hole at its heart.',
    modifier: { label: '+40% Gravitational Cannon Power & Dark Ore', description: 'Tidal forces generate exotic heavy elements found nowhere else.', bonusType: 'metal', bonusPct: 40 },
    faction: 'Singularity Cult Fleet',
    color: '#1e1b4b',
    lore: 'Gravitational lensing bends starlight into brilliant rings of gold and purple around an inescapable central black hole.',
  },
  {
    name: 'Universe 30: The Omega Transcendence Core',
    tagline: 'The ultimate apex dimension: The crown of the 30-universe multiverse.',
    modifier: { label: '+50% Across ALL Imperial Resource Yields & Glory', description: 'Cosmic mastery grants supreme bonuses across all 90 galaxies.', bonusType: 'glory', bonusPct: 50 },
    faction: 'Transcendent Multiverse Ascended',
    color: '#f59e0b',
    lore: 'The harmonic nexus where all 30 universes converge. Only the most formidable galactic commanders can establish permanent dominion here.',
  },
];

// Generate exactly 30 Multiverse Universes
export const MULTIVERSE_UNIVERSES: MultiverseUniverse[] = UNIVERSE_TITLES.map((u, idx) => {
  const uId = idx + 1;
  const freq = (142.8 + uId * 24.3).toFixed(1);
  return {
    id: uId,
    name: u.name,
    tagline: u.tagline,
    dimensionCode: `DIM-Ω${uId.toString().padStart(2, '0')}`,
    dimensionalFrequency: `${freq} THz`,
    cosmicModifier: u.modifier,
    totalGalaxies: 90, // Exactly 90 galaxies per universe
    dominantFaction: u.faction,
    factionColor: u.color,
    travelDeuteriumCost: 2500 + uId * 250,
    travelTurnsCost: 3,
    atmosphereTheme: ['amber', 'cyan', 'emerald', 'purple', 'rose', 'indigo', 'sky', 'slate'][uId % 8],
    lore: u.lore,
  };
});

const GALAXY_PREFIXES = [
  'Milky Way', 'Pegasus', 'Ida', 'Oribis', 'Andromeda', 'Triangulum', 'Cygnus', 'Centaurus',
  'Eridanus', 'Vanguard', 'Omega', 'Destiny', 'Hydra', 'Perseus', 'Virgo', 'Boötes', 'Sagittarius',
  'Aquila', 'Corona', 'Scorpius', 'Draco', 'Ursa', 'Cassiopeia', 'Orion', 'Taurus', 'Centauri',
  'Lyra', 'Aries', 'Vespera', 'Aethel',
];

const GALAXY_SUFFIXES = [
  'Prime Core', 'Majoris Arm', 'Minoris Reach', 'Sector Expanse', 'Spiral Nebula', 'Void Halo',
  'Sanctuary Rift', 'Bastion Cluster', 'Crucible Arm', 'Deep Web', 'Ascension Zone', 'Terminus Halo',
];

const GALAXY_TYPES: UniverseGalaxy['galaxyType'][] = [
  'Spiral', 'Elliptical', 'Barred Spiral', 'Ring Cluster', 'Irregular Rift', 'Dwarf Nebula',
];

const RESOURCE_ABUNDANCES: UniverseGalaxy['primaryResourceAbundance'][] = [
  'Naquadah', 'Heavy Metal', 'Silicate Crystal', 'Cryo Deuterium', 'Dark Matter',
];

/**
 * Generates the 90 galaxies for a specific universe (1 to 30) deterministically.
 */
export function getGalaxiesForUniverse(universeId: number): UniverseGalaxy[] {
  const safeU = Math.max(1, Math.min(30, Math.floor(universeId || 1)));

  return Array.from({ length: 90 }, (_, idx) => {
    const gNum = idx + 1; // 1 to 90
    const seed = safeU * 1000 + gNum;
    const r1 = getMultiverseHash(seed, 1);
    const r2 = getMultiverseHash(seed, 2);
    const r3 = getMultiverseHash(seed, 3);
    const r4 = getMultiverseHash(seed, 4);

    const prefix = GALAXY_PREFIXES[Math.floor(r1 * GALAXY_PREFIXES.length)];
    const suffix = GALAXY_SUFFIXES[Math.floor(r2 * GALAXY_SUFFIXES.length)];
    const gType = GALAXY_TYPES[Math.floor(r3 * GALAXY_TYPES.length)];
    const res = RESOURCE_ABUNDANCES[Math.floor(r4 * RESOURCE_ABUNDANCES.length)];

    const name = gNum === 1 && safeU === 1
      ? 'Galaxy 01: Milky Way Prime Core'
      : `Galaxy ${gNum.toString().padStart(2, '0')}: ${prefix} ${suffix}`;

    return {
      galaxyNumber: gNum,
      name,
      systemCount: 999, // 999 systems per galaxy
      galaxyType: gType,
      stellarDensity: `${Math.round(45 + r1 * 50)} billion stars`,
      primaryResourceAbundance: res,
      hyperspaceSafetyRating: ['Class-A (Stable)', 'Class-B (Moderate)', 'Class-C (Turbulent)', 'Class-S (Hyper-Flow)'][Math.floor(r2 * 4)],
      stargateSubnetwork: `SG-NET-${safeU.toString().padStart(2, '0')}.${gNum.toString().padStart(2, '0')}`,
    };
  });
}

/**
 * Retrieve Universe specification by ID (1 to 30)
 */
export function getUniverseData(universeId: number): MultiverseUniverse {
  const safeId = Math.max(1, Math.min(30, Math.floor(universeId || 1)));
  return MULTIVERSE_UNIVERSES[safeId - 1];
}

/**
 * Coordinate Decoder / Encoder
 * Format: [Universe:Galaxy:System:Slot]
 * Example: [1:1:104:5] -> Universe 1, Galaxy 1, System 104, Planet 5
 */
export interface MultiverseCoordinate {
  universe: number; // 1 to 30
  galaxy: number;   // 1 to 90
  system: number;   // 1 to 999
  slot: number;     // 1 to 15
  formatted: string; // [U:G:S:P]
  globalPlanetId: number; // 1 to 999,999 within current universe
}

export function parseMultiverseCoordinate(
  universeId: number,
  galaxyId: number,
  systemId: number,
  slotId: number
): MultiverseCoordinate {
  const u = Math.max(1, Math.min(30, Math.floor(universeId || 1)));
  const g = Math.max(1, Math.min(90, Math.floor(galaxyId || 1)));
  const s = Math.max(1, Math.min(999, Math.floor(systemId || 1)));
  const p = Math.max(1, Math.min(15, Math.floor(slotId || 1)));

  // Calculate planetary index within universe (1 to 999,999)
  const globalPlanetId = ((g - 1) * 999 * 15) % 999999 + ((s - 1) * 15) + p;
  const safeGlobalId = Math.max(1, Math.min(999999, globalPlanetId));

  return {
    universe: u,
    galaxy: g,
    system: s,
    slot: p,
    formatted: `[U${u}:G${g}:S${s}:P${p}]`,
    globalPlanetId: safeGlobalId,
  };
}
