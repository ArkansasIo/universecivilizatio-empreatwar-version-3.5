export interface NMSPlanetSeed {
  planetIndex: number;
  name: string;
  seedHash: string;
  biome: string;
  weather: string;
  sentinels: 'Passive' | 'Standard' | 'Aggressive' | 'Corrupted';
  flora: string;
  fauna: string;
  resources: string[];
  economy: string;
  conflictLevel: 'Low' | 'Medium' | 'High' | 'Lawless';
}

export interface NMSStarSystem {
  id: string;
  systemName: string;
  galacticCoords: string;
  spectralClass: 'F' | 'G' | 'K' | 'M' | 'E' | 'X';
  dominantLifeform: 'Gek' | 'Vy\'keen' | 'Korvax' | 'Abandoned';
  planets: NMSPlanetSeed[];
}

// Generate 25 procedural NMS star systems
const STAR_NAMES = ['Euclid-Alpha', 'Hesperius-Prime', 'Calypso-Major', 'Eissentam-Delta', 'Budullangr-IX', 'Hilbert-Reach', 'Calypso-Void', 'Odyalut-Gamma', 'Sudestor-Beta', 'Wissincer-Omega'];
const BIOMES = ['Lush Verdurous', 'Scorched Basalt', 'Frozen Glacial', 'Toxic Spore', 'Radioactive Crystal', 'Barren Dust', 'Infested Exotic'];
const WEATHERS = ['Superheated Rain', 'Gentle Breezes', 'Perpetual Blizzards', 'Acidic Storms', 'Gamma Dust Storms', 'Calm Atmospheric'];
const FAUNA = ['Bipedal Predators', 'Docile Herbivores', 'Silicate Mechanics', 'Abyssal Swarm', 'Bioluminescent Pods', 'None'];
const ECONOMIES = ['Advanced Materials', 'Mining Outpost', 'Scientific Research', 'High-Tech Manufacturing', 'Mercenary Enclave'];
const LIFEFORMS = ['Gek', 'Vy\'keen', 'Korvax', 'Abandoned'] as const;
const CLASSES = ['F', 'G', 'K', 'M', 'E', 'X'] as const;

export const GENERATE_NMS_SYSTEMS = (count: number = 30): NMSStarSystem[] => {
  return Array.from({ length: count }, (_, sysIdx) => {
    const sysName = `${STAR_NAMES[sysIdx % STAR_NAMES.length]}-${100 + sysIdx * 7}`;
    const coordHash = `${(sysIdx * 41) % 9999}:${(sysIdx * 89) % 999}:${(sysIdx * 17) % 99}`;
    const planetCount = 2 + (sysIdx % 4); // 2 to 5 planets
    const lifeform = LIFEFORMS[sysIdx % LIFEFORMS.length];
    const specClass = CLASSES[sysIdx % CLASSES.length];

    const planets: NMSPlanetSeed[] = Array.from({ length: planetCount }, (_, pIdx) => {
      const pHash = `0x${((sysIdx + 1) * (pIdx + 1) * 314159).toString(16).toUpperCase()}`;
      return {
        planetIndex: pIdx + 1,
        name: `${sysName} Prime-${pIdx + 1}`,
        seedHash: pHash,
        biome: BIOMES[(sysIdx + pIdx) % BIOMES.length],
        weather: WEATHERS[(sysIdx * 3 + pIdx) % WEATHERS.length],
        sentinels: ['Passive', 'Standard', 'Aggressive', 'Corrupted'][(sysIdx + pIdx) % 4] as any,
        flora: ['Abundant Redwood', 'Bioluminescent Fungi', 'Crystal Spores', 'Cactus Scrub', 'Sub-Zero Lichen'][pIdx % 5],
        fauna: FAUNA[(sysIdx + pIdx) % FAUNA.length],
        resources: ['Activated Indium', 'Pyrite', 'Uranium', 'Mordite', 'Copper', 'Cadmium'].slice(0, 2 + (pIdx % 3)),
        economy: ECONOMIES[(sysIdx + pIdx) % ECONOMIES.length],
        conflictLevel: ['Low', 'Medium', 'High', 'Lawless'][(sysIdx * 2 + pIdx) % 4] as any,
      };
    });

    return {
      id: `nms_sys_${sysIdx + 1}`,
      systemName: sysName,
      galacticCoords: coordHash,
      spectralClass: specClass,
      dominantLifeform: lifeform,
      planets,
    };
  });
};
