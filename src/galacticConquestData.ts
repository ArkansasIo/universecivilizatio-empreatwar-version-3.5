export interface PlanetGarrison {
  defenseRating: number;
  infantryTroops: number;
  heavyArmorVehicles: number;
  orbitalDefenseBatteries: number;
  shieldGeneratorHp: number;
  commanderTitle: string;
}

export interface PlanetResourceYield {
  naquadahPerHour: number;
  metalPerHour: number;
  crystalPerHour: number;
  deuteriumPerHour: number;
  gloryReward: number;
  plunderNaquadah: number;
  plunderMetal: number;
  plunderCrystal: number;
}

export interface PlanetInfrastructure {
  refineryLevel: number;
  shieldGridLevel: number;
  garrisonCitadelLevel: number;
  orbitalDrydockLevel: number;
  geothermalTapLevel: number;
  stargateNexusLevel: number;
}

export interface ConqueredPlanetRecord {
  id: number;
  conqueredTimestamp: number;
  customName?: string;
  infrastructure: PlanetInfrastructure;
  stationedGarrison: number;
  taxPolicy: 'balanced' | 'extractive' | 'subsidized';
  accumulatedTribute: {
    naquadah: number;
    metal: number;
    crystal: number;
    deuterium: number;
    glory: number;
  };
  lastCollectedAt: number;
}

export interface GalacticPlanet {
  id: number;
  coordinate: string;
  name: string;
  systemName: string;
  galaxyNumber: number;
  systemNumber: number;
  slotNumber: number;
  tier: 1 | 2 | 3 | 4;
  tierLabel: string;
  biome: string;
  biomeIcon: string;
  diameterKm: number;
  temperatureCelsius: number;
  gravityG: number;
  surfaceFields: number;
  rulingFaction: string;
  factionColor: string;
  garrison: PlanetGarrison;
  yield: PlanetResourceYield;
  stargateGlyphs: string[];
  strategicTraits: {
    name: string;
    description: string;
    effectBonus: string;
  }[];
  flavorLore: string;
}

// Deterministic PRNG using Murmur-inspired 32-bit hash
function getDeterministicHash(seed: number, offset: number = 0): number {
  let h = (seed + offset * 0x9e3779b9) ^ (seed >>> 16);
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const GALAXY_NAMES = [
  'Milky Way Core',
  'Pegasus Cluster',
  'Ida Prime Void',
  'Oribis Spiral',
  'Destiny Corridor',
  'Andromeda Reach',
  'Triangulum Sector',
  'Centaurus Halo',
  'Cygnus Rift',
  'Eridanus Void',
  'Vanguard Nebula',
  'Omega Arm',
];

const PLANET_PREFIXES = [
  'Kepler', 'Gliese', 'Trappist', 'HD-', 'WASP-', 'Ross', 'LHS', 'TOI', 'K2-', 'Proxima',
  'Dakara', 'Chulak', 'Delmak', 'Tollana', 'Othala', 'P3X-', 'P4C-', 'P9Y-', 'M4C-', 'P8X-',
  'Kronos', 'Valhalla', 'Elysium', 'Acheron', 'Hyperion', 'Tartarus', 'Solaria', 'Aegis',
  'Obsidian', 'Tachyon', 'Dyson', 'Singularity', 'Nova', 'Aethel', 'Caelum', 'Vespera',
];

const PLANET_ROOTS = [
  'Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus', 'Octavius', 'Novan',
  'Sanctuary', 'Bastion', 'Citadel', 'Crucible', 'Forge', 'Outpost', 'Haven', 'Terminus', 'Dominion',
  'Apex', 'Vanguard', 'Genesis', 'Omega', 'Matrix', 'Nexus', 'Colossus', 'Monolith', 'Abyss',
];

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

const BIOMES = [
  { name: 'Temperate Continental Earth-like', icon: '🌍', minTemp: -10, maxTemp: 38, gravityMin: 0.9, gravityMax: 1.15 },
  { name: 'Oceanic Archipelago Paradise', icon: '🌊', minTemp: 10, maxTemp: 45, gravityMin: 0.85, gravityMax: 1.05 },
  { name: 'Volcanic Magma Caldera', icon: '🌋', minTemp: 180, maxTemp: 520, gravityMin: 1.1, gravityMax: 1.4 },
  { name: 'Arid Dune Sea & Salt Flats', icon: '🏜️', minTemp: 25, maxTemp: 95, gravityMin: 0.8, gravityMax: 1.1 },
  { name: 'Glacial Cryo-Frozen Tundra', icon: '❄️', minTemp: -190, maxTemp: -60, gravityMin: 0.75, gravityMax: 1.0 },
  { name: 'Cybernetic Ecumenopolis City-World', icon: '🏙️', minTemp: 5, maxTemp: 32, gravityMin: 1.0, gravityMax: 1.2 },
  { name: 'Gas Giant Orbital Moon', icon: '🪐', minTemp: -130, maxTemp: 15, gravityMin: 0.65, gravityMax: 0.95 },
  { name: 'Crystalline Shard Monolith World', icon: '💎', minTemp: -40, maxTemp: 60, gravityMin: 0.9, gravityMax: 1.25 },
  { name: 'Toxic Smog & Corrosive Swamp', icon: '🧪', minTemp: 40, maxTemp: 120, gravityMin: 0.95, gravityMax: 1.3 },
  { name: 'Precursor Dyson Ring Fragment', icon: '✨', minTemp: 18, maxTemp: 26, gravityMin: 1.0, gravityMax: 1.0 },
  { name: 'Dark Matter Void Anchor', icon: '🔮', minTemp: -240, maxTemp: -180, gravityMin: 1.5, gravityMax: 2.2 },
  { name: 'Radioactive Cobalt Badlands', icon: '☢️', minTemp: 30, maxTemp: 110, gravityMin: 1.05, gravityMax: 1.35 },
];

const FACTIONS = [
  { name: 'Goa\'uld System Lord Empire', color: '#f59e0b' },
  { name: 'Lucian Alliance Smuggler Fleet', color: '#ef4444' },
  { name: 'Replicator Self-Replicating Hive', color: '#8b5cf6' },
  { name: 'Ori Fundamentalist Crusade', color: '#ec4899' },
  { name: 'Ancient Automated Sentry Network', color: '#06b6d4' },
  { name: 'Wraith Sector Feeding Fleet', color: '#10b981' },
  { name: 'Asgard Automated Custodian World', color: '#38bdf8' },
  { name: 'Independent Colonial Militia', color: '#6b7280' },
];

const STARGATE_GLYPHS = [
  'Crater', 'Virgo', 'Boötes', 'Centaurus', 'Libra', 'Serpens', 'Norma', 'Scorpius',
  'Corona Australis', 'Scutum', 'Sagittarius', 'Aquila', 'Microscopium', 'Capricornus',
  'Southern Cross', 'Equuleus', 'Aquarius', 'Pegasus', 'Sculptor', 'Pisces', 'Andromeda',
  'Triangulum', 'Aries', 'Perseus', 'Cetus', 'Taurus', 'Auriga', 'Eridanus', 'Orion',
  'Canis Major', 'Gemini', 'Monoceros', 'Canis Minor', 'Hydra', 'Lynx', 'Cancer',
  'Sextans', 'Leo Minor', 'Leo', 'Point of Origin',
];

const STRATEGIC_TRAITS = [
  { name: 'Subterranean Naquadah Lodes', description: 'Massive unrefined naquadah veins detected under deep crustal plates.', effectBonus: '+35% Naquadah Tribute' },
  { name: 'Precursor Technological Relic', description: 'Contains functional ancient stargate data nodes and research vaults.', effectBonus: '+25% Glory XP & +15% Tech' },
  { name: 'Hyper-Dense Heavy Metal Core', description: 'Tidally compressed nickel-iron core providing limitless construction alloy.', effectBonus: '+40% Metal Tribute' },
  { name: 'Cryogenic Deuterium Geysers', description: 'Deep glacial geysers ejecting ultra-dense deuterium isotopes into orbit.', effectBonus: '+50% Deuterium Tribute' },
  { name: 'High Gravity World (+1.6G)', description: 'Crushing gravitational field severely hampers unarmored enemy dropships.', effectBonus: '+30% Base Defense' },
  { name: 'Orbital EMP Plasma Grid', description: 'Precursor atmospheric ionization grid that discharges lightning into landing craft.', effectBonus: '+25% Orbital Deflector Rating' },
  { name: 'Rich Crystalline Silicate Beds', description: 'Vast surface quartz and optical prism beds suitable for laser technology.', effectBonus: '+35% Crystal Tribute' },
  { name: 'Subsurface Ocean Aquifers', description: 'Immense subterranean freshwater hydrosphere supporting massive colonial populations.', effectBonus: '+50 Max Colonial Fields' },
];

/**
 * Deterministically generates any planet from ID 1 to 999,999.
 * Fast, stateless, and 100% reproducible for persistent multiplayer/conquest.
 * Maps across 90 Galaxies per universe, 999 Systems, and 15 Orbital Slots.
 */
export function generateProceduralPlanet(planetId: number, universeId: number = 1): GalacticPlanet {
  const safeId = Math.max(1, Math.min(999999, Math.floor(planetId || 1)));
  const safeUniverse = Math.max(1, Math.min(30, Math.floor(universeId || 1)));

  // Coordinate math: Galaxy 1-90, System 1-999, Slot 1-15
  const galaxyNum = ((safeId - 1) % 90) + 1;
  const systemNum = (Math.floor((safeId - 1) / 90) % 999) + 1;
  const slotNum = ((safeId - 1) % 15) + 1;
  const coordinate = `[U${safeUniverse}:G${galaxyNum}:S${systemNum}:P${slotNum}]`;

  // Deterministic random generator seeds
  const seed = safeUniverse * 10000000 + safeId;
  const r1 = getDeterministicHash(seed, 1);
  const r2 = getDeterministicHash(seed, 2);
  const r3 = getDeterministicHash(seed, 3);
  const r4 = getDeterministicHash(seed, 4);
  const r5 = getDeterministicHash(seed, 5);
  const r6 = getDeterministicHash(seed, 6);
  const r7 = getDeterministicHash(seed, 7);
  const r8 = getDeterministicHash(seed, 8);

  // Tier determination
  let tier: 1 | 2 | 3 | 4 = 1;
  let tierLabel = 'Tier I · Core Frontier';
  if (safeId > 500000) {
    tier = 4;
    tierLabel = 'Tier IV · Precursor Singularity Void';
  } else if (safeId > 100000) {
    tier = 3;
    tierLabel = 'Tier III · Deep Spiral Arm';
  } else if (safeId > 10000) {
    tier = 2;
    tierLabel = 'Tier II · Mid-Rim Dominion';
  }

  // Name Generation
  const prefix = PLANET_PREFIXES[Math.floor(r1 * PLANET_PREFIXES.length)];
  const root = PLANET_ROOTS[Math.floor(r2 * PLANET_ROOTS.length)];
  const roman = ROMAN_NUMERALS[slotNum - 1];
  const galaxyName = GALAXY_NAMES[(galaxyNum - 1) % GALAXY_NAMES.length];
  const systemName = `${prefix}-${systemNum}`;
  const name = safeId === 1 ? 'Earth / Tau\'ri Alpha-01' : `${prefix} ${root} ${roman}`;

  // Biome Selection
  const biomeObj = BIOMES[Math.floor(r3 * BIOMES.length)];
  const diameterKm = Math.round(4500 + r4 * 120000);
  const tempRange = biomeObj.maxTemp - biomeObj.minTemp;
  const temperatureCelsius = Math.round(biomeObj.minTemp + r5 * tempRange);
  const gravityG = Number((biomeObj.gravityMin + r6 * (biomeObj.gravityMax - biomeObj.gravityMin)).toFixed(2));
  const surfaceFields = Math.round(80 + r7 * 280 + tier * 25);

  // Faction
  const factionObj = safeId === 1
    ? { name: 'Tau\'ri Home Command', color: '#10b981' }
    : FACTIONS[Math.floor(r8 * FACTIONS.length)];

  // Scale defense and garrison by Tier and deterministic seed
  const tierMultiplier = tier === 1 ? 1 : tier === 2 ? 3.5 : tier === 3 ? 12 : 35;
  const baseDef = 12000 + Math.round(r1 * 25000);
  const defenseRating = Math.round(baseDef * tierMultiplier);
  const infantryTroops = Math.round((15000 + r2 * 35000) * tierMultiplier);
  const heavyArmorVehicles = Math.round((250 + r3 * 800) * tierMultiplier);
  const orbitalDefenseBatteries = Math.round((12 + r4 * 35) * tierMultiplier);
  const shieldGeneratorHp = Math.round(defenseRating * 1.4);

  const commanderTitles = [
    'System Lord High Guard', 'First Prime of Chulak', 'Ori Prior Inquisitor',
    'Lucian Syndicate Warlord', 'Ancient Defense Custodian', 'Replicator Core Sub-Node',
    'Wraith Hive Commander', 'Free Jaffa High Marshal',
  ];
  const commanderTitle = commanderTitles[Math.floor(r5 * commanderTitles.length)];

  // Yield calculation
  const naquadahPerHour = Math.round((1800 + r6 * 4500) * tierMultiplier);
  const metalPerHour = Math.round((2500 + r7 * 6000) * tierMultiplier);
  const crystalPerHour = Math.round((1200 + r8 * 3000) * tierMultiplier);
  const deuteriumPerHour = Math.round((800 + r1 * 2200) * tierMultiplier);
  const gloryReward = Math.round((25 + r2 * 45) * tier);
  const plunderNaquadah = Math.round(naquadahPerHour * 24);
  const plunderMetal = Math.round(metalPerHour * 24);
  const plunderCrystal = Math.round(crystalPerHour * 24);

  // Stargate 7-Glyph sequence
  const glyphs: string[] = [];
  for (let i = 0; i < 6; i++) {
    const gIdx = Math.floor(getDeterministicHash(safeId, 20 + i) * (STARGATE_GLYPHS.length - 1));
    glyphs.push(STARGATE_GLYPHS[gIdx]);
  }
  glyphs.push('Point of Origin');

  // Traits (Pick 2 unique)
  const trait1Idx = Math.floor(r3 * STRATEGIC_TRAITS.length);
  let trait2Idx = Math.floor(r4 * STRATEGIC_TRAITS.length);
  if (trait2Idx === trait1Idx) trait2Idx = (trait1Idx + 1) % STRATEGIC_TRAITS.length;
  const strategicTraits = [STRATEGIC_TRAITS[trait1Idx], STRATEGIC_TRAITS[trait2Idx]];

  const flavorLore = `Planet #${safeId.toLocaleString()} in the ${galaxyName}, designated ${name} ${coordinate}. Orbiting a high-mass spectroscopic star, this ${biomeObj.name.toLowerCase()} world features ${surfaceFields} available building grids and is fortified under the authority of ${factionObj.name}.`;

  return {
    id: safeId,
    coordinate,
    name,
    systemName,
    galaxyNumber: galaxyNum,
    systemNumber: systemNum,
    slotNumber: slotNum,
    tier,
    tierLabel,
    biome: biomeObj.name,
    biomeIcon: biomeObj.icon,
    diameterKm,
    temperatureCelsius,
    gravityG,
    surfaceFields,
    rulingFaction: factionObj.name,
    factionColor: factionObj.color,
    garrison: {
      defenseRating,
      infantryTroops,
      heavyArmorVehicles,
      orbitalDefenseBatteries,
      shieldGeneratorHp,
      commanderTitle,
    },
    yield: {
      naquadahPerHour,
      metalPerHour,
      crystalPerHour,
      deuteriumPerHour,
      gloryReward,
      plunderNaquadah,
      plunderMetal,
      plunderCrystal,
    },
    stargateGlyphs: glyphs,
    strategicTraits,
    flavorLore,
  };
}

export const INITIAL_CONQUERED_PLANETS: Record<number, ConqueredPlanetRecord> = {
  1: {
    id: 1,
    conqueredTimestamp: Date.now() - 86400000 * 30,
    customName: 'Earth / Tau\'ri Alpha-01 (Capital)',
    infrastructure: {
      refineryLevel: 5,
      shieldGridLevel: 5,
      garrisonCitadelLevel: 5,
      orbitalDrydockLevel: 4,
      geothermalTapLevel: 4,
      stargateNexusLevel: 5,
    },
    stationedGarrison: 150000,
    taxPolicy: 'balanced',
    accumulatedTribute: {
      naquadah: 125000,
      metal: 200000,
      crystal: 110000,
      deuterium: 65000,
      glory: 80,
    },
    lastCollectedAt: Date.now() - 3600000 * 4,
  },
};

export const QUICK_JUMP_SECTORS = [
  { id: 1, label: 'Capital World #1 (Earth / Tau\'ri Core)', category: 'Core' },
  { id: 10, label: 'Chulak Stronghold #10 (Jaffa Bastion)', category: 'Core' },
  { id: 500, label: 'Delmak Fortress #500 (Apophis Forge)', category: 'Core' },
  { id: 2500, label: 'Dakara Temple #2,500 (Ancient Superweapon)', category: 'Mid-Rim' },
  { id: 10000, label: 'Tollana Reborn #10,000 (Ion Cannons)', category: 'Mid-Rim' },
  { id: 50000, label: 'Pegasus Outpost #50,000 (Atlantis Gate)', category: 'Deep Spiral' },
  { id: 150000, label: 'Othala Core #150,000 (Asgard Tech Vault)', category: 'Deep Spiral' },
  { id: 500000, label: 'Destiny Rim #500,000 (Cosmic Microwave Rim)', category: 'Singularity Void' },
  { id: 999999, label: 'The Omega Singularity #999,999 (Universe Limit)', category: 'Singularity Void' },
];
