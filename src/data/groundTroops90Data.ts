/**
 * 90 Ground Unit Troop Classes, Sub-Classes, Types, Sub-Types, Stats & Sub-Stats Catalog
 * MILITARY BARRACKS & UNIT ENLISTMENT FACILITIES
 * 
 * Features:
 * - 90 Ground Military Units across 4 Strategic Military Divisions:
 *   1. Frontline Strike Soldiers (30 units) - Heavy assault, breach squads, mechanized infantry, shock vanguards
 *   2. Fortress Sentinels (25 units) - Perimeter guardians, shield aegis wall, bunker garrisons, anti-air flak crews
 *   3. Intelligence Operatives (20 units) - Covert infiltrators, signal interceptors, sniper ghosts, bio-recon scouts
 *   4. Counter-Sabotage Agents (15 units) - Anti-terror inquisitors, electronic counter-warfare, sapper sweeps, hazmat specialists
 * 
 * Full hierarchical structure per unit:
 * - class & subClass
 * - classTier (1-99) & subClassTier (1-99)
 * - type & subType
 * - rank & title
 * - stats (attack, defense, health, speed, accuracy, dodge)
 * - subStats (critChance, critMult, armorPenetration, shieldBreakPower, flankingBonus,
 *             moraleDamage, suppressionResistance, supplyConsumption, recruitmentTime,
 *             maintenanceCost, counterattackChance, fortificationBonus, healingReceived,
 *             sightRange, communicationsRange, electronicResistance, psionicResistance)
 * - cost (untrainedUnits, metal, crystal, deuterium, naquadah, credits)
 * - trainingFacility (Barracks Wing & Level requirement)
 */

export type GroundDivision = 'frontline_strike' | 'fortress_sentinel' | 'intelligence_operative' | 'counter_sabotage';

export interface GroundUnitStats {
  attack: number;
  defense: number;
  health: number;
  speed: number;
  accuracy: number; // %
  dodge: number;    // %
}

export interface GroundUnitSubStats {
  criticalHitChance: number;          // % (0-100)
  criticalDamageMultiplier: number;   // e.g. 1.5 = 150%
  armorPenetration: number;           // flat armor reduction
  shieldBreakPower: number;           // bonus damage to energy barriers
  flankingBonus: number;              // % damage on flank
  moraleDamage: number;               // disruption to enemy morale
  suppressionResistance: number;      // % resistance to pin-down fire
  supplyConsumption: number;          // rations per hour
  recruitmentTimeSec: number;         // seconds to train
  maintenanceCostCredits: number;     // upkeep per cycle
  counterattackChance: number;        // %
  fortificationBonus: number;         // % defense bonus in trenches/bunkers
  healingReceived: number;            // multiplier
  sightRangeKm: number;               // sensory sight range
  communicationsRangeKm: number;      // C4I comms link radius
  electronicResistance: number;       // EW jamming resistance
  psionicResistance: number;          // mental disruption resistance
}

export interface GroundUnitCost {
  untrainedUnits: number;
  metal: number;
  crystal: number;
  deuterium: number;
  naquadah: number;
  credits: number;
}

export interface GroundTroop90Unit {
  id: string;
  name: string;
  division: GroundDivision;
  class: string;
  subClass: string;
  classTier: number;    // 1-99
  subClassTier: number; // 1-99
  type: string;         // 'Assault Soldier', 'Fortress Sentinel', 'Ghost Operative', 'Counter-Saboteur'
  subType: string;      // Specific combat specialization
  rank: string;         // Military rank
  title: string;        // Sovereign battlefield accolade
  lore: string;
  stats: GroundUnitStats;
  subStats: GroundUnitSubStats;
  cost: GroundUnitCost;
  barracksFacility: string;
  barracksMinLevel: number;
  unlockedAtPlayerLevel: number;
}

// ---------------------------------------------------------------------------
// FACTORY CREATION HELPER
// ---------------------------------------------------------------------------
function createGroundUnit(
  id: string,
  name: string,
  division: GroundDivision,
  className: string,
  subClassName: string,
  classTier: number,
  subClassTier: number,
  type: string,
  subType: string,
  rank: string,
  title: string,
  lore: string,
  stats: GroundUnitStats,
  subStats: Partial<GroundUnitSubStats>,
  cost: GroundUnitCost,
  facility: string,
  facilityLvl: number,
  playerLvl: number
): GroundTroop90Unit {
  const defaultSubStats: GroundUnitSubStats = {
    criticalHitChance: 5 + Math.floor(classTier / 10),
    criticalDamageMultiplier: 1.5 + (classTier * 0.01),
    armorPenetration: 10 + classTier * 2,
    shieldBreakPower: 5 + classTier * 3,
    flankingBonus: 15,
    moraleDamage: 5 + Math.floor(classTier / 5),
    suppressionResistance: 20 + classTier,
    supplyConsumption: 1 + Math.floor(classTier / 20),
    recruitmentTimeSec: 10 + classTier * 2,
    maintenanceCostCredits: 5 + classTier * 2,
    counterattackChance: 10 + Math.floor(classTier / 8),
    fortificationBonus: division === 'fortress_sentinel' ? 45 : 15,
    healingReceived: 1.0,
    sightRangeKm: 5 + Math.floor(classTier / 10),
    communicationsRangeKm: 15 + classTier,
    electronicResistance: 10 + classTier,
    psionicResistance: 10 + classTier,
  };

  return {
    id,
    name,
    division,
    class: className,
    subClass: subClassName,
    classTier: Math.min(99, Math.max(1, classTier)),
    subClassTier: Math.min(99, Math.max(1, subClassTier)),
    type,
    subType,
    rank,
    title,
    lore,
    stats,
    subStats: { ...defaultSubStats, ...subStats },
    cost,
    barracksFacility: facility,
    barracksMinLevel: facilityLvl,
    unlockedAtPlayerLevel: playerLvl,
  };
}

// ===========================================================================
// SECTION 1: FRONTLINE STRIKE SOLDIERS (Units 1-30)
// ===========================================================================
export const FRONTLINE_STRIKE_SOLDIERS: GroundTroop90Unit[] = [
  createGroundUnit(
    'fl_strike_01', 'Conscript Rifleman Cadre', 'frontline_strike',
    'Kinetic Infantry', 'Light Caliber Squad', 4, 6,
    'Strike Soldier', 'Line Rifleman', 'Private', 'Initiate of the Trench',
    'Basic kinetic line riflemen armed with 7.62mm magnetic assault rifles, deployed in mass assault spearheads.',
    { attack: 18, defense: 14, health: 100, speed: 12, accuracy: 78, dodge: 12 },
    { criticalHitChance: 6, criticalDamageMultiplier: 1.5, armorPenetration: 12 },
    { untrainedUnits: 10, metal: 350, crystal: 120, deuterium: 20, naquadah: 40, credits: 80 },
    'Infantry Barracks Alpha', 1, 1
  ),
  createGroundUnit(
    'fl_strike_02', 'Magnetic Slug Shocktrooper', 'frontline_strike',
    'Kinetic Infantry', 'High-Velocity Breach', 12, 14,
    'Strike Soldier', 'Breach Pointman', 'Corporal', 'Shield Breaker',
    'Equipped with pressurized magnetic-impulse shotguns specifically engineered to breach fortified airlocks.',
    { attack: 28, defense: 20, health: 140, speed: 14, accuracy: 82, dodge: 14 },
    { criticalHitChance: 9, criticalDamageMultiplier: 1.6, armorPenetration: 24, shieldBreakPower: 20 },
    { untrainedUnits: 12, metal: 550, crystal: 200, deuterium: 40, naquadah: 80, credits: 140 },
    'Infantry Barracks Alpha', 1, 2
  ),
  createGroundUnit(
    'fl_strike_03', 'Trench Demolition Grenadier', 'frontline_strike',
    'Assault Ordnance', 'Thermite Sapper', 18, 20,
    'Strike Soldier', 'Sapper Demolitionist', 'Sergeant', 'Ash Maker',
    'Carries saturation concussion canisters and thermite breach spikes to liquidate entrenched bunkers.',
    { attack: 42, defense: 18, health: 160, speed: 11, accuracy: 79, dodge: 10 },
    { criticalHitChance: 12, criticalDamageMultiplier: 1.75, armorPenetration: 45, moraleDamage: 25 },
    { untrainedUnits: 15, metal: 800, crystal: 320, deuterium: 80, naquadah: 150, credits: 220 },
    'Infantry Barracks Alpha', 2, 4
  ),
  createGroundUnit(
    'fl_strike_04', 'Plasma Carbine Vanguard', 'frontline_strike',
    'Energy Infantry', 'Superheated Ion Core', 25, 28,
    'Strike Soldier', 'Plasma Vanguard', 'Staff Sergeant', 'Thermal Cleaver',
    'Armed with twin-feed plasma carbines discharging 4,000°C bolts capable of liquefying plasteel plating.',
    { attack: 58, defense: 32, health: 210, speed: 15, accuracy: 85, dodge: 16 },
    { criticalHitChance: 14, criticalDamageMultiplier: 1.8, shieldBreakPower: 55, armorPenetration: 40 },
    { untrainedUnits: 18, metal: 1200, crystal: 600, deuterium: 180, naquadah: 280, credits: 360 },
    'Energy Weapons Proving Grounds', 2, 6
  ),
  createGroundUnit(
    'fl_strike_05', 'Heavy Rotary Gauss Gunner', 'frontline_strike',
    'Heavy Weapons', 'Hyper-Cyclic Railgun', 32, 35,
    'Strike Soldier', 'Support Gunner', 'Master Sergeant', 'Lead Storm',
    'Operates a motorized 6-barrel micro-railgun with a cyclic fire rate of 6,000 depleted-uranium rounds/min.',
    { attack: 76, defense: 48, health: 280, speed: 9, accuracy: 76, dodge: 8 },
    { criticalHitChance: 11, criticalDamageMultiplier: 1.65, armorPenetration: 60, suppressionResistance: 70 },
    { untrainedUnits: 20, metal: 1800, crystal: 850, deuterium: 250, naquadah: 450, credits: 500 },
    'Heavy Ordnance Foundry', 3, 9
  ),
  createGroundUnit(
    'fl_strike_06', 'Jaffa Ma\'Tok Assault Praetorian', 'frontline_strike',
    'Alien Martial Corps', 'Staff Weapon Doctrine', 38, 42,
    'Strike Soldier', 'Energy Lancer', 'First Prime Aspirant', 'Sun of Apophis',
    'Disciplined heavy warriors executing synchronized liquid-plasma salvos from ceremonial yet lethal staff weapons.',
    { attack: 92, defense: 62, health: 340, speed: 13, accuracy: 84, dodge: 15 },
    { criticalHitChance: 16, criticalDamageMultiplier: 1.85, armorPenetration: 50, moraleDamage: 30 },
    { untrainedUnits: 25, metal: 2400, crystal: 1200, deuterium: 350, naquadah: 750, credits: 700 },
    'Alien Doctrine Pavilion', 3, 12
  ),
  createGroundUnit(
    'fl_strike_07', 'Hydraulic Exoskeleton Breacher', 'frontline_strike',
    'Mechanized Infantry', 'Powered Exosuit', 45, 48,
    'Strike Soldier', 'Exo-Breacher', 'Lieutenant', 'Iron Wall Breaker',
    'Rigged in hydraulic pneumatic exoskeletons that amplify physical strength by 800% to crush blast doors.',
    { attack: 115, defense: 95, health: 450, speed: 12, accuracy: 86, dodge: 12 },
    { criticalHitChance: 18, criticalDamageMultiplier: 1.9, armorPenetration: 85, fortificationBonus: 35 },
    { untrainedUnits: 30, metal: 3600, crystal: 1800, deuterium: 500, naquadah: 1100, credits: 1000 },
    'Mechanized Armor Depots', 4, 15
  ),
  createGroundUnit(
    'fl_strike_08', 'Zero-G Orbital Drop Commando', 'frontline_strike',
    'Airborne Spaceborne', 'Atmospheric Drop Pod', 52, 55,
    'Strike Soldier', 'Orbital Paratrooper', 'Captain', 'Meteor Strike',
    'Inserted from low planetary orbit via stealth entry capsules directly into hot combat extraction points.',
    { attack: 140, defense: 105, health: 520, speed: 18, accuracy: 91, dodge: 22 },
    { criticalHitChance: 22, criticalDamageMultiplier: 2.1, flankingBonus: 45, ambushBonus: 60 } as any,
    { untrainedUnits: 35, metal: 5000, crystal: 2600, deuterium: 900, naquadah: 1600, credits: 1600 },
    'Orbital Drop Complex', 4, 18
  ),
  createGroundUnit(
    'fl_strike_09', 'Heavy Flame Purifier', 'frontline_strike',
    'Hazard Ordnance', 'Napalm Phosphorus', 28, 30,
    'Strike Soldier', 'Cleansing Sapper', 'Sergeant 1st Class', 'Inferno Bringer',
    'Equipped with pressurized white-phosphorus jets that sanitize subterranean burrows and hive tunnels.',
    { attack: 68, defense: 38, health: 230, speed: 11, accuracy: 80, dodge: 10 },
    { criticalHitChance: 10, criticalDamageMultiplier: 1.7, moraleDamage: 40, fortificationBonus: -20 },
    { untrainedUnits: 18, metal: 1300, crystal: 550, deuterium: 300, naquadah: 320, credits: 400 },
    'Infantry Barracks Alpha', 2, 7
  ),
  createGroundUnit(
    'fl_strike_10', 'High-Flux Fusion Lancer', 'frontline_strike',
    'Energy Infantry', 'Miniature Tokamak Core', 60, 62,
    'Strike Soldier', 'Fusion Lancer', 'Major', 'Star Core',
    'Channels a micro-fusion bottle into a coherent directed stream that shears battle tanks in half.',
    { attack: 185, defense: 120, health: 600, speed: 14, accuracy: 90, dodge: 16 },
    { criticalHitChance: 24, criticalDamageMultiplier: 2.2, armorPenetration: 120, shieldBreakPower: 90 },
    { untrainedUnits: 40, metal: 7200, crystal: 4000, deuterium: 1400, naquadah: 2400, credits: 2400 },
    'Energy Weapons Proving Grounds', 5, 22
  ),
  // Additional Frontline Units (11 to 30)
  ...Array.from({ length: 20 }, (_, idx) => {
    const tier = 62 + Math.floor(idx * 1.8);
    const subTier = tier + 1;
    const names = [
      'Bipedal Assault Walker Strider', 'Nanite Bio-Infused Shock Vanguard', 'Anti-Materiel Hyper-Rail Marksman',
      'Kull Super-Soldier Infiltrator', 'Heavy Mortar Cluster Bombardier', 'Ion Disruptor Trench Sweeper',
      'Tactical Combat Medic Field Surgeon', 'Slipstream Jump-Pack Skirmisher', 'Quantum Phase Line Breaker',
      'Sub-Orbital Hover Tank Driver', 'Antimatter Charge Breaching Specialist', 'Singularity Cleaver Berserker',
      'Solar Ray Heavy Dragoon', 'Cybernetic Augmented Myrmidon', 'Heavy Naquadah Plasma Cannoneer',
      'Aegis Breaker Stormtrooper', 'Vortex Bomb Sapper Pioneer', 'Chrono-Shifted Rapid Assault Vanguard',
      'Precursor Genetic Legionnaire', 'Apex Grand Warmaster of the Vanguard'
    ];
    return createGroundUnit(
      `fl_strike_${idx + 11}`, names[idx], 'frontline_strike',
      idx % 2 === 0 ? 'Assault Mechanized Division' : 'Advanced Transhuman Infantry',
      `Shock Doctrine Tier-${Math.floor(tier / 10)}`,
      tier, subTier,
      'Strike Soldier',
      `Frontline Specialist Cl-${idx + 1}`,
      tier > 85 ? 'Lord High Marshal' : tier > 75 ? 'Colonel' : 'Commandant',
      tier > 85 ? 'Sovereign Warmaster' : 'Vanguard Champion',
      `Elite frontline strike force specialized in breakthrough operations and direct close-quarters annihilation.`,
      {
        attack: 210 + idx * 24,
        defense: 130 + idx * 16,
        health: 650 + idx * 45,
        speed: 14 + (idx % 4),
        accuracy: 88 + Math.min(10, Math.floor(idx / 2)),
        dodge: 16 + (idx % 6),
      },
      {
        criticalHitChance: 22 + Math.floor(idx * 0.8),
        criticalDamageMultiplier: 2.1 + (idx * 0.04),
        armorPenetration: 120 + idx * 8,
        shieldBreakPower: 95 + idx * 7,
      },
      {
        untrainedUnits: 45 + idx * 4,
        metal: 9000 + idx * 1500,
        crystal: 5000 + idx * 800,
        deuterium: 2000 + idx * 400,
        naquadah: 3000 + idx * 600,
        credits: 3000 + idx * 500,
      },
      'War College Command Hub', 5, 25 + idx * 2
    );
  })
];

// ===========================================================================
// SECTION 2: FORTRESS SENTINELS (Units 31-55) - 25 Units
// ===========================================================================
export const FORTRESS_SENTINELS: GroundTroop90Unit[] = [
  createGroundUnit(
    'ft_sentinel_01', 'Citadel Blast-Wall Sentry', 'fortress_sentinel',
    'Static Defense', 'Perimeter Watch', 5, 8,
    'Fortress Sentinel', 'Wall Watchman', 'Garrison Sentry', 'Bulwark Guard',
    'Maintains ceaseless watch over bastion outer curtains, armed with heavy reinforced tower shields and carbines.',
    { attack: 12, defense: 35, health: 180, speed: 8, accuracy: 80, dodge: 6 },
    { fortificationBonus: 60, counterattackChance: 15 },
    { untrainedUnits: 10, metal: 500, crystal: 180, deuterium: 20, naquadah: 40, credits: 90 },
    'Fortress Citadel Grounds', 1, 1
  ),
  createGroundUnit(
    'ft_sentinel_02', 'Bunker Heavy Ballistic Turreteer', 'fortress_sentinel',
    'Emplaced Weapons', 'Hardened Bunker Gun', 14, 16,
    'Fortress Sentinel', 'Bunker Emplacement Gunner', 'Corporal', 'Pillbox Warden',
    'Operates hardened twin heavy autocannons encased in subterranean reinforced ferro-concrete cupolas.',
    { attack: 28, defense: 65, health: 260, speed: 6, accuracy: 83, dodge: 4 },
    { fortificationBonus: 75, armorPenetration: 30, suppressionResistance: 60 },
    { untrainedUnits: 12, metal: 950, crystal: 350, deuterium: 50, naquadah: 100, credits: 160 },
    'Fortress Citadel Grounds', 1, 3
  ),
  createGroundUnit(
    'ft_sentinel_03', 'Quad-Flak Anti-Air Interceptor', 'fortress_sentinel',
    'Air Defense Grid', 'Kinetic Flak Barrage', 22, 25,
    'Fortress Sentinel', 'Flak Gunner', 'Sergeant', 'Sky Sweeper',
    'Fires high-cyclic airburst fragmentation shells creating an impenetrable defensive umbrella against dive bombers.',
    { attack: 36, defense: 85, health: 320, speed: 7, accuracy: 85, dodge: 5 },
    { fortificationBonus: 50, shieldBreakPower: 40, sightRangeKm: 25 },
    { untrainedUnits: 15, metal: 1400, crystal: 600, deuterium: 120, naquadah: 200, credits: 280 },
    'Anti-Air Defense Range', 2, 5
  ),
  createGroundUnit(
    'ft_sentinel_04', 'Planetary Shield Generator Tuner', 'fortress_sentinel',
    'Forcefield Engineering', 'Aegis Harmonic Array', 32, 36,
    'Fortress Sentinel', 'Shield Field Specialist', 'Staff Sergeant', 'Dome Guardian',
    'Maintains continuous harmonic alignment of megawatt shield emitters covering civilian habitations.',
    { attack: 10, defense: 140, health: 420, speed: 7, accuracy: 78, dodge: 8 },
    { fortificationBonus: 90, electronicResistance: 65, psionicResistance: 40 },
    { untrainedUnits: 20, metal: 2400, crystal: 1500, deuterium: 400, naquadah: 550, credits: 550 },
    'Aegis Shield Proving Ground', 3, 8
  ),
  createGroundUnit(
    'ft_sentinel_05', 'Ceramic Heavy Aegis Paladin', 'fortress_sentinel',
    'Heavy Plate Inf', 'Composite Tower Shield', 40, 44,
    'Fortress Sentinel', 'Aegis Shieldbearer', 'Master Sergeant', 'Indomitable Wall',
    'Advances with 400kg composite ablative tower shields locking into interconnected barrier walls.',
    { attack: 45, defense: 180, health: 580, speed: 7, accuracy: 82, dodge: 5 },
    { fortificationBonus: 85, counterattackChance: 25, suppressionResistance: 80 },
    { untrainedUnits: 25, metal: 3800, crystal: 2000, deuterium: 500, naquadah: 900, credits: 850 },
    'Fortress Citadel Grounds', 3, 11
  ),
  // Additional Fortress Sentinels (6 to 25)
  ...Array.from({ length: 20 }, (_, idx) => {
    const tier = 46 + Math.floor(idx * 2.5);
    const subTier = tier + 2;
    const names = [
      'Surface-to-Orbit Ion Missileer', 'Orbital Railgun Battery Operator', 'Tachyon Grid Sensor Sentinel',
      'Subterranean Blast Door Custodian', 'Graviton Anchor Field Sentry', 'Pulse Laser Point-Defense Gunner',
      'Seismic Tremor Ward Specialist', 'Magma Moat Thermal Controller', 'Hardened Bunker Decoy Coordinator',
      'Nano-Self-Repairing Bastion Sapper', 'Dark Matter Void Barrier Architect', 'Automated Defense Turret Overseer',
      'Aegis Fortress Citadel Castellan', 'Ion Disruption Trench Guardian', 'Planetary Gate Ring Protector',
      'Hyperspace Interdiction Shield Warden', 'Sub-Crustal Fortress Commandant', 'Stargate Iris Lockdown Sentinel',
      'Ancient Precursor Drone Bunker Ward', 'Grand Castellan of the Imperial Redoubt'
    ];
    return createGroundUnit(
      `ft_sentinel_${idx + 6}`, names[idx], 'fortress_sentinel',
      'Fortified Bulwark Command', `Bastion Defense Tier-${Math.floor(tier / 10)}`,
      tier, subTier,
      'Fortress Sentinel',
      `Garrison Specialist Cl-${idx + 6}`,
      tier > 80 ? 'Grand Castellan' : tier > 65 ? 'Fortress Commander' : 'Bastion Captain',
      tier > 80 ? 'Shield of the Empire' : 'Castellan Guard',
      `Heavy fortress defender dedicated to turning cities, Stargates, and military complexes into unbreachable citadels.`,
      {
        attack: 55 + idx * 12,
        defense: 210 + idx * 25,
        health: 650 + idx * 60,
        speed: 6 + (idx % 3),
        accuracy: 84 + (idx % 6),
        dodge: 5 + (idx % 4),
      },
      {
        fortificationBonus: 80 + Math.min(30, idx * 2),
        counterattackChance: 20 + Math.floor(idx * 0.8),
        suppressionResistance: 80 + idx,
        shieldBreakPower: 40 + idx * 3,
      },
      {
        untrainedUnits: 30 + idx * 3,
        metal: 5000 + idx * 1200,
        crystal: 3000 + idx * 700,
        deuterium: 800 + idx * 250,
        naquadah: 1500 + idx * 450,
        credits: 1200 + idx * 350,
      },
      'Fortress Citadel Grounds', 4, 14 + idx * 2
    );
  })
];

// ===========================================================================
// SECTION 3: INTELLIGENCE OPERATIVES (Units 56-75) - 20 Units
// ===========================================================================
export const INTELLIGENCE_OPERATIVES: GroundTroop90Unit[] = [
  createGroundUnit(
    'in_operative_01', 'Street Informant Scout', 'intelligence_operative',
    'Reconnaissance', 'Underground Asset', 6, 8,
    'Ghost Operative', 'Field Informant', 'Scout Agent', 'Whisperer',
    'Infiltrates border starports, pirate taverns, and black markets gathering preliminary threat intelligence.',
    { attack: 14, defense: 8, health: 90, speed: 18, accuracy: 82, dodge: 24 },
    { sightRangeKm: 15, electronicResistance: 25, criticalHitChance: 12 },
    { untrainedUnits: 8, metal: 200, crystal: 300, deuterium: 50, naquadah: 50, credits: 150 },
    'Shadow Espionage Den', 1, 1
  ),
  createGroundUnit(
    'in_operative_02', 'Subspace Wiretapper Tech', 'intelligence_operative',
    'Signal Intercept', 'Frequency Cryptography', 15, 18,
    'Ghost Operative', 'Signals Cryptanalyst', 'Corporal Agent', 'Ear of the Void',
    'Intercepts hyper-dimensional radio bursts and decodes encrypted military distress frequencies in real time.',
    { attack: 12, defense: 14, health: 120, speed: 14, accuracy: 80, dodge: 18 },
    { communicationsRangeKm: 50, electronicResistance: 45, sightRangeKm: 25 },
    { untrainedUnits: 10, metal: 450, crystal: 650, deuterium: 120, naquadah: 100, credits: 260 },
    'Shadow Espionage Den', 1, 3
  ),
  createGroundUnit(
    'in_operative_03', 'Optical Cloaking Sniper Ghost', 'intelligence_operative',
    'Covert Assassination', 'Adaptive Camouflage', 26, 30,
    'Ghost Operative', 'Sniper Assassin', 'Special Agent', 'Silent Phantom',
    'Bends ambient light with photonic cloaks, delivering hyper-dense sabot rounds from 4 kilometers away.',
    { attack: 85, defense: 18, health: 160, speed: 17, accuracy: 96, dodge: 28 },
    { criticalHitChance: 35, criticalDamageMultiplier: 2.8, sightRangeKm: 40 },
    { untrainedUnits: 12, metal: 900, crystal: 1400, deuterium: 300, naquadah: 350, credits: 600 },
    'Covert Reconnaissance Annex', 2, 6
  ),
  createGroundUnit(
    'in_operative_04', 'Bio-Chemical Recon Scout', 'intelligence_operative',
    'Bio-Recon', 'Atmospheric Toxin Sampling', 34, 38,
    'Ghost Operative', 'Pathogen Surveyor', 'Lieutenant Agent', 'Toxin Seeker',
    'Navigates alien planetary ecosystems collecting genetic virulence samples and locating indigenous hazards.',
    { attack: 35, defense: 28, health: 220, speed: 16, accuracy: 88, dodge: 22 },
    { healingReceived: 1.5, sightRangeKm: 30, electronicResistance: 40 },
    { untrainedUnits: 15, metal: 1200, crystal: 1600, deuterium: 450, naquadah: 450, credits: 750 },
    'Covert Reconnaissance Annex', 2, 9
  ),
  // Additional Intelligence Operatives (5 to 20)
  ...Array.from({ length: 16 }, (_, idx) => {
    const tier = 42 + Math.floor(idx * 3.5);
    const subTier = tier + 2;
    const names = [
      'Quantum Decryption Specialist', 'Stargate Dialing Recon Scout', 'Sub-Dermal Micro-Transponder Infiltrator',
      'Psionic Telepathic Interrogator', 'Nanite Bug Swarm Controller', 'Synthetic Identity Sleeper Agent',
      'High-Orbit Stealth Drone Pilot', 'Deep-Cover Faction Diplomat Spy', 'Covert Sabotage Black-Ops Commando',
      'Electronic Warfare Jamming Spook', 'Precursor Glyph Cryptographer', 'Zero-Point Sensor Spy Master',
      'Holographic Doppelganger Illusionist', 'Sub-Space Beacon Disrupter', 'Shadow Directorate Field Director',
      'Grand Inquisitor of the Imperial Spire'
    ];
    return createGroundUnit(
      `in_operative_${idx + 5}`, names[idx], 'intelligence_operative',
      'Shadow Directorate Corps', `Covert Division Tier-${Math.floor(tier / 10)}`,
      tier, subTier,
      'Ghost Operative',
      `Cipher Agent Cl-${idx + 5}`,
      tier > 80 ? 'Grand Inquisitor' : tier > 65 ? 'Director' : 'Special Agent in Charge',
      tier > 80 ? 'Eye of the Sovereign' : 'Shadow Ghost',
      `Master of espionage, deception, assassination, and covert electronic reconnaissance behind enemy lines.`,
      {
        attack: 75 + idx * 16,
        defense: 35 + idx * 8,
        health: 260 + idx * 30,
        speed: 18 + (idx % 5),
        accuracy: 92 + (idx % 6),
        dodge: 25 + (idx % 8),
      },
      {
        criticalHitChance: 25 + idx,
        criticalDamageMultiplier: 2.2 + (idx * 0.05),
        flankingBonus: 50 + idx * 2,
        electronicResistance: 50 + idx * 2,
        psionicResistance: 40 + idx * 2,
      },
      {
        untrainedUnits: 18 + idx * 2,
        metal: 2500 + idx * 800,
        crystal: 3500 + idx * 1100,
        deuterium: 1000 + idx * 350,
        naquadah: 1200 + idx * 400,
        credits: 2000 + idx * 600,
      },
      'Shadow Espionage Den', 4, 15 + idx * 2
    );
  })
];

// ===========================================================================
// SECTION 4: COUNTER-SABOTAGE AGENTS (Units 76-90) - 15 Units
// ===========================================================================
export const COUNTER_SABOTAGE_AGENTS: GroundTroop90Unit[] = [
  createGroundUnit(
    'cs_agent_01', 'Perimeter Tripwire Patrol Sapper', 'counter_sabotage',
    'Counter-Infiltration', 'Mine & Wire Detection', 8, 10,
    'Counter-Saboteur', 'Perimeter Sapper', 'Inspector', 'Wire Sweeper',
    'Discovers and defuses hidden explosive charges planted by guerilla saboteurs around fuel and power hubs.',
    { attack: 22, defense: 28, health: 160, speed: 12, accuracy: 84, dodge: 14 },
    { fortificationBonus: 30, electronicResistance: 30 },
    { untrainedUnits: 10, metal: 400, crystal: 300, deuterium: 50, naquadah: 60, credits: 180 },
    'Internal Security Complex', 1, 1
  ),
  createGroundUnit(
    'cs_agent_02', 'Hazmat Bio-Neutralization Cleanser', 'counter_sabotage',
    'Chemical Defense', 'Hazmat Decontamination', 18, 22,
    'Counter-Saboteur', 'Decon Tech', 'Senior Inspector', 'Neutralizer',
    'Purges weaponized chemical clouds, radiological leaks, and biological viral agents released by saboteurs.',
    { attack: 28, defense: 42, health: 220, speed: 11, accuracy: 82, dodge: 12 },
    { healingReceived: 1.6, electronicResistance: 40, suppressionResistance: 50 },
    { untrainedUnits: 12, metal: 750, crystal: 550, deuterium: 150, naquadah: 140, credits: 320 },
    'Internal Security Complex', 1, 3
  ),
  createGroundUnit(
    'cs_agent_03', 'Electronic Countermeasure (ECM) Sweeper', 'counter_sabotage',
    'Cyber Defense', 'Frequency Jamming Denial', 28, 32,
    'Counter-Saboteur', 'Signal Jammer Tech', 'Chief Inspector', 'Static Warden',
    'Neutralizes remote detonation frequencies and disables enemy surveillance relays with microwave bursts.',
    { attack: 36, defense: 54, health: 290, speed: 13, accuracy: 86, dodge: 15 },
    { electronicResistance: 85, communicationsRangeKm: 35, shieldBreakPower: 30 },
    { untrainedUnits: 15, metal: 1300, crystal: 1100, deuterium: 300, naquadah: 280, credits: 500 },
    'Cyber Security Directorate', 2, 7
  ),
  createGroundUnit(
    'cs_agent_04', 'Counter-Sniper Spotter Team', 'counter_sabotage',
    'Ballistic Trajectory', 'Acoustic Triangulation', 36, 40,
    'Counter-Saboteur', 'Acoustic Spotter', 'Sub-Warden', 'Phantom Hunter',
    'Triangulates supersonic muzzle flashes in urban corridors, eliminating enemy marksmen within seconds.',
    { attack: 68, defense: 45, health: 310, speed: 15, accuracy: 94, dodge: 20 },
    { criticalHitChance: 25, sightRangeKm: 35, counterattackChance: 35 },
    { untrainedUnits: 16, metal: 1800, crystal: 1400, deuterium: 400, naquadah: 450, credits: 700 },
    'Internal Security Complex', 2, 10
  ),
  createGroundUnit(
    'cs_agent_05', 'Automated Sentry Ward Sapper', 'counter_sabotage',
    'Robotic Security', 'Deployable Auto-Guns', 45, 48,
    'Counter-Saboteur', 'Sentry Deployer', 'Warden', 'Steel Guard',
    'Deploys autonomous spider sentry turrets across sensitive military choke points and Stargate ramps.',
    { attack: 85, defense: 75, health: 420, speed: 12, accuracy: 88, dodge: 14 },
    { fortificationBonus: 50, counterattackChance: 30, electronicResistance: 60 },
    { untrainedUnits: 20, metal: 2800, crystal: 2100, deuterium: 600, naquadah: 800, credits: 1100 },
    'Automated Defense Works', 3, 14
  ),
  // Additional Counter-Sabotage Units (6 to 15)
  ...Array.from({ length: 10 }, (_, idx) => {
    const tier = 52 + Math.floor(idx * 4.5);
    const subTier = tier + 2;
    const names = [
      'Antimatter Mine Disposal Technician', 'Hostage Rescue Rapid Response Breacher', 'Cybernetic Infiltration Inquisitor',
      'Thermal Imaging Ambush Ward', 'Stargate DHD Security Cryptographer', 'Anti-Terror Assault Shock Officer',
      'Shield Overload Dampening Specialist', 'Bio-Toxin Antidote Aerosol Chemist', 'Nanite Siphon Counter-Agent',
      'High Chancellor of Imperial Counter-Intelligence'
    ];
    return createGroundUnit(
      `cs_agent_${idx + 6}`, names[idx], 'counter_sabotage',
      'Internal Security Bureau', `Counter-Sabotage Tier-${Math.floor(tier / 10)}`,
      tier, subTier,
      'Counter-Saboteur',
      `Security Specialist Cl-${idx + 6}`,
      tier > 80 ? 'High Inquisitor' : tier > 65 ? 'Security Director' : 'Chief Warden',
      tier > 80 ? 'Guardian of State Stability' : 'Iron Ward',
      `Frontline counter-saboteur securing critical reactors, command nodes, Stargates, and ammunition caches.`,
      {
        attack: 95 + idx * 18,
        defense: 85 + idx * 16,
        health: 460 + idx * 40,
        speed: 14 + (idx % 4),
        accuracy: 90 + (idx % 6),
        dodge: 18 + (idx % 6),
      },
      {
        electronicResistance: 70 + idx * 2,
        suppressionResistance: 70 + idx * 2,
        counterattackChance: 30 + idx,
        fortificationBonus: 40 + idx * 2,
      },
      {
        untrainedUnits: 22 + idx * 3,
        metal: 4000 + idx * 1200,
        crystal: 3200 + idx * 900,
        deuterium: 900 + idx * 300,
        naquadah: 1400 + idx * 450,
        credits: 1800 + idx * 500,
      },
      'Internal Security Complex', 4, 18 + idx * 2
    );
  })
];

// ===========================================================================
// COMBINED 90 GROUND TROOP UNITS CATALOG
// ===========================================================================
export const GROUND_TROOPS_90_CATALOG: GroundTroop90Unit[] = [
  ...FRONTLINE_STRIKE_SOLDIERS,    // 30
  ...FORTRESS_SENTINELS,           // 25
  ...INTELLIGENCE_OPERATIVES,      // 20
  ...COUNTER_SABOTAGE_AGENTS,      // 15
];

export interface BarracksFacilityState {
  level: number;
  name: string;
  trainingMultiplier: number;
  enlistmentDiscountPct: number;
  maxQueueCapacity: number;
}

export const INITIAL_BARRACKS_FACILITIES: Record<string, BarracksFacilityState> = {
  'Infantry Barracks Alpha': {
    level: 3,
    name: 'Infantry Barracks Alpha',
    trainingMultiplier: 1.25,
    enlistmentDiscountPct: 10,
    maxQueueCapacity: 500,
  },
  'Fortress Citadel Grounds': {
    level: 2,
    name: 'Fortress Citadel Grounds',
    trainingMultiplier: 1.15,
    enlistmentDiscountPct: 5,
    maxQueueCapacity: 350,
  },
  'Shadow Espionage Den': {
    level: 2,
    name: 'Shadow Espionage Den',
    trainingMultiplier: 1.10,
    enlistmentDiscountPct: 5,
    maxQueueCapacity: 200,
  },
  'Internal Security Complex': {
    level: 2,
    name: 'Internal Security Complex',
    trainingMultiplier: 1.15,
    enlistmentDiscountPct: 5,
    maxQueueCapacity: 250,
  },
};
