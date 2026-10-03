export interface Unit90Definition {
  id: string;
  name: string;
  category: string;
  subClass: string;
  tier: number;
  attack: number;
  defense: number;
  shield: number;
  speed: number;
  cargo: number;
  cost: { metal: number; crystal: number; deuterium: number };
  description: string;
}

export const UNITS_90_ROSTER: Unit90Definition[] = [
  // Category 1: Light Interceptors (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `interceptor_${i + 1}`,
    name: `Interceptor Mk-${i + 1} ${['Viper', 'Dart', 'Sting', 'Hornet', 'Wasp', 'Falcon', 'Hawk', 'Kestrel', 'Sparrow', 'Swift'][i]}`,
    category: 'Light Interceptor',
    subClass: `Class-I Fighter Subtype ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 80 + i * 25,
    defense: 40 + i * 15,
    shield: 20 + i * 10,
    speed: 15000 + i * 1200,
    cargo: 50 + i * 10,
    cost: { metal: 3000 + i * 800, crystal: 1500 + i * 400, deuterium: 500 + i * 200 },
    description: `High-speed atmospheric and space interceptor optimized for rapid dogfights and border skirmishes.`
  })),

  // Category 2: Heavy Corvettes & Frigates (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `frigate_${i + 1}`,
    name: `Frigate Class-${i + 1} ${['Gladiator', 'Sentinel', 'Vanguard', 'Paladin', 'Templar', 'Crusader', 'Defender', 'Centurion', 'Guardian', 'Protector'][i]}`,
    category: 'Heavy Frigate',
    subClass: `Class-II Escort Subtype ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 250 + i * 60,
    defense: 300 + i * 80,
    shield: 150 + i * 40,
    speed: 9000 + i * 800,
    cargo: 400 + i * 100,
    cost: { metal: 12000 + i * 2500, crystal: 6000 + i * 1200, deuterium: 2000 + i * 500 },
    description: `Armored escort frigate equipped with heavy railguns and point-defense turrets.`
  })),

  // Category 3: Destroyers & Strike Cruisers (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `destroyer_${i + 1}`,
    name: `Destroyer V-${i + 1} ${['Manticore', 'Chimera', 'Hydra', 'Kraken', 'Leviathan', 'Gorgon', 'Typhon', 'Behemoth', 'Cerberus', 'Wyvern'][i]}`,
    category: 'Destroyer',
    subClass: `Class-III Capital Hunter ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 750 + i * 150,
    defense: 900 + i * 200,
    shield: 500 + i * 120,
    speed: 6000 + i * 500,
    cargo: 1200 + i * 300,
    cost: { metal: 35000 + i * 7000, crystal: 18000 + i * 3500, deuterium: 8000 + i * 1800 },
    description: `Capital ship hunter designed to crack enemy fleet formations with heavy torpedo batteries.`
  })),

  // Category 4: Battleships & Dreadnoughts (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `battleship_${i + 1}`,
    name: `Dreadnought Mark-${i + 1} ${['Imperator', 'Sovereign', 'Dominator', 'Conqueror', 'Vanquisher', 'Punisher', 'Obliterator', 'Eradicator', 'Annihilator', 'Supreme'][i]}`,
    category: 'Battleship',
    subClass: `Class-IV Flagship ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 2200 + i * 450,
    defense: 3000 + i * 600,
    shield: 1800 + i * 350,
    speed: 4000 + i * 300,
    cargo: 4000 + i * 1000,
    cost: { metal: 110000 + i * 22000, crystal: 55000 + i * 11000, deuterium: 25000 + i * 5000 },
    description: `Imposing stellar dreadnought serving as the absolute core of fleet dominance.`
  })),

  // Category 5: Carriers & Drone Ships (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `carrier_${i + 1}`,
    name: `Carrier Hub-${i + 1} ${['Daedalus', 'Prometheus', 'Odyssey', 'Ascension', 'Horizon', 'Eternity', 'Genesis', 'Nemesis', 'Colossus', 'Titan-Carrier'][i]}`,
    category: 'Carrier',
    subClass: `Class-V Mobile Hangar ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 1200 + i * 300,
    defense: 4500 + i * 900,
    shield: 2500 + i * 500,
    speed: 3500 + i * 250,
    cargo: 15000 + i * 3500,
    cost: { metal: 150000 + i * 30000, crystal: 80000 + i * 16000, deuterium: 40000 + i * 8000 },
    description: `Massive mobile carrier hosting swarms of combat drones and fighter wings.`
  })),

  // Category 6: Stealth & Recon Vessels (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `stealth_${i + 1}`,
    name: `Phantomshell-${i + 1} ${['Shadow', 'Spectre', 'Wraith', 'Phantom', 'Ghost', 'Mirage', 'Eclipse', 'Void-Stalker', 'Shade', 'Banshee'][i]}`,
    category: 'Stealth Recon',
    subClass: `Class-VI Covert Ops ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 400 + i * 100,
    defense: 200 + i * 50,
    shield: 300 + i * 80,
    speed: 22000 + i * 1800,
    cargo: 200 + i * 50,
    cost: { metal: 20000 + i * 4000, crystal: 15000 + i * 3000, deuterium: 12000 + i * 2500 },
    description: `Cloaked reconnaissance vessel capable of slipping past enemy sensor nets undetected.`
  })),

  // Category 7: Industrial Miners & Haulers (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `hauler_${i + 1}`,
    name: `Asteroid Hauler-${i + 1} ${['Prospector', 'Miner', 'Ore-Master', 'Bulk-Carrier', 'Cargo-Titan', 'Sovereign-Hauler', 'Resource-Gorgon', 'Titan-Mule', 'Deep-Drill', 'Abyssal-Freighter'][i]}`,
    category: 'Industrial Hauler',
    subClass: `Class-VII Economic Transport ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 50 + i * 10,
    defense: 1000 + i * 250,
    shield: 400 + i * 100,
    speed: 3000 + i * 200,
    cargo: 50000 + i * 15000,
    cost: { metal: 15000 + i * 3000, crystal: 10000 + i * 2000, deuterium: 5000 + i * 1000 },
    description: `Heavy industrial cargo freighter optimized for moving millions of tons of ore and crystal.`
  })),

  // Category 8: Planetary Defense Satellites (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `satellite_${i + 1}`,
    name: `Orbital Defense Sat-${i + 1} ${['Argus', 'Cyclops', 'Panoptes', 'Sentinel-Orb', 'Beam-Sat', 'Plasma-Orb', 'Ion-Relay', 'Gorgon-Eye', 'Aegis-Grid', 'Solar-Bastion'][i]}`,
    category: 'Defense Satellite',
    subClass: `Class-VIII Stationary Defense ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 300 + i * 90,
    defense: 500 + i * 120,
    shield: 600 + i * 150,
    speed: 0,
    cargo: 0,
    cost: { metal: 5000 + i * 1200, crystal: 4000 + i * 1000, deuterium: 1000 + i * 300 },
    description: `Stationary orbital platform providing localized anti-ship fire and energy grid reinforcement.`
  })),

  // Category 9: Precursor & Super-Capital Flagships (10 units)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `precursor_${i + 1}`,
    name: `Precursor Monolith-${i + 1} ${['Ancients-Wrath', 'Singularity', 'Event-Horizon', 'Cosmic-Titan', 'Omega', 'Genesis-Engine', ' Eternity-Vessel', 'Void-Master', 'Celestial-Core', 'Architect'][i]}`,
    category: 'Super-Capital',
    subClass: `Class-IX God-Tier Flagship ${i + 1}`,
    tier: Math.floor(i / 2) + 1,
    attack: 10000 + i * 2500,
    defense: 15000 + i * 3500,
    shield: 12000 + i * 3000,
    speed: 2500 + i * 200,
    cargo: 100000 + i * 25000,
    cost: { metal: 500000 + i * 100000, crystal: 400000 + i * 80000, deuterium: 300000 + i * 60000 },
    description: `Unfathomable ancient starship engineered with precursor tech and god-tier firepower.`
  })),
];
