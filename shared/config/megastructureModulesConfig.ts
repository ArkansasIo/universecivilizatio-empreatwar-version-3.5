/**
 * Megastructure Module Catalog
 * Third detail layer for individual megastructures.
 * Modules are discrete, nameable components that occupy a limited number of
 * slots on a structure. Each module has a primary function, sub-functions,
 * and a percentile/point effect on the structure's production, storage,
 * research, or defense. Dyson spheres unlock an additional exotic catalog.
 * @tag #megastructures #modules #dyson #production #upgrades
 */

// ============================================================================
// TYPES
// ============================================================================

export type MegastructureModuleEffect =
  | 'energy'
  | 'production'
  | 'storage'
  | 'research'
  | 'defense'
  | 'efficiency'
  | 'construction';

export interface MegastructureModuleCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export interface MegastructureModuleDefinition {
  id: string;
  name: string;
  description: string;
  function: string;
  subFunctions: string[];
  effect: MegastructureModuleEffect;
  /** Numeric magnitude of the effect. Percent for energy/production/storage/research/efficiency, rating points for defense. */
  effectValue: number;
  cost: MegastructureModuleCost;
  maxInstances: number;
  unlockLevel: number;
  unlockTier: number;
  category: string;
  icon: string;
  lore: string;
  restrictedTo?: string[];
}

export interface InstalledMegastructureModule {
  id: string;
  instanceId: string;
  installedAt: string;
}

export interface MegastructureModuleView {
  id: string;
  name: string;
  description: string;
  function: string;
  subFunctions: string[];
  effect: MegastructureModuleEffect;
  effectValue: number;
  effectLabel: string;
  cost: MegastructureModuleCost;
  maxInstances: number;
  unlockLevel: number;
  unlockTier: number;
  category: string;
  icon: string;
  lore: string;
  installed: number;
  locked: boolean;
  lockReason: string | null;
}

// ============================================================================
// EFFECT LABELS
// ============================================================================

export const MODULE_EFFECT_LABELS: Record<MegastructureModuleEffect, string> = {
  energy: 'Energy Output',
  production: 'Raw Resource Production',
  storage: 'Resource Storage',
  research: 'Research Speed',
  defense: 'Defense Rating',
  efficiency: 'Operational Efficiency',
  construction: 'Construction Speed',
};

// ============================================================================
// GENERIC CATALOG
// ============================================================================

export const GENERIC_MODULES: MegastructureModuleDefinition[] = [
  {
    id: 'power-core',
    name: 'Reactor Power Core',
    description: 'Self-contained antimatter-to-grid core that amplifies the structure’s total energy output.',
    function: 'Increases total energy production.',
    subFunctions: [
      'Converts fuel stockpiles into grid energy',
      'Smooths output variance from primary collectors',
      'Powers module sockets during maintenance cycles',
      'Backs up critical life support reserves',
    ],
    effect: 'energy',
    effectValue: 12,
    cost: { metal: 350000, crystal: 290000, deuterium: 180000, energy: 120000 },
    maxInstances: 3,
    unlockLevel: 5,
    unlockTier: 1,
    category: 'Power',
    icon: 'zap',
    lore: 'A core that hums in one language only: more.',
  },
  {
    id: 'fabrication-unit',
    name: 'Stellar Fabrication Unit',
    description: 'Nanite assembly lines that refine raw stellar matter into metal, crystal, and deuterium.',
    function: 'Increases all raw resource production.',
    subFunctions: [
      'Refines captured stellar matter',
      'Prefabricates structural segments for expansion',
      'Recycles maintenance waste into raw stock',
      'Churns out replacement components for damaged subsystems',
    ],
    effect: 'production',
    effectValue: 15,
    cost: { metal: 420000, crystal: 330000, deuterium: 150000, energy: 90000 },
    maxInstances: 4,
    unlockLevel: 8,
    unlockTier: 1,
    category: 'Manufacturing',
    icon: 'factory',
    lore: 'Where stellar radiation becomes a paycheck.',
  },
  {
    id: 'cargo-hub',
    name: 'Deep Storage Cargo Hub',
    description: 'Pressurized warehouse banks that massively expand the structure’s resource capacity.',
    function: 'Increases all resource storage caps.',
    subFunctions: [
      'Holds refined stock for trade fleets',
      'Crates raw materials for interstellar shipment',
      'Keeps reserve energy in dense fuel cells',
      'Quarantines hazardous stellar byproducts',
    ],
    effect: 'storage',
    effectValue: 20,
    cost: { metal: 510000, crystal: 260000, deuterium: 120000, energy: 60000 },
    maxInstances: 4,
    unlockLevel: 4,
    unlockTier: 1,
    category: 'Logistics',
    icon: 'box',
    lore: 'You cannot rule a star with an empty hold.',
  },
  {
    id: 'research-lab',
    name: 'Flux Research Laboratory',
    description: 'Orbital lab cluster that studies captured stellar phenomena and accelerates all research.',
    function: 'Increases research speed empire-wide.',
    subFunctions: [
      'Analyzes stellar spectrum anomalies',
      'Prototypes new collector geometries',
      'War-games relay network topologies',
      'Publishes findings to Imperial research networks',
    ],
    effect: 'research',
    effectValue: 10,
    cost: { metal: 280000, crystal: 470000, deuterium: 210000, energy: 150000 },
    maxInstances: 3,
    unlockLevel: 6,
    unlockTier: 1,
    category: 'Research',
    icon: 'flask',
    lore: 'Every star hides a question. This lab asks it out loud.',
  },
  {
    id: 'defense-grid',
    name: 'Point Defense Grid',
    description: 'Directed-energy turrets and interceptor batteries woven into the structure’s hull.',
    function: 'Raises the structure’s defensive rating.',
    subFunctions: [
      'Intercepts inbound ordnance',
      'Targets micro-debris before hull impact',
      'Suppresses raider boarding attempts',
      'Extends cover fire to allied craft',
    ],
    effect: 'defense',
    effectValue: 25,
    cost: { metal: 460000, crystal: 210000, deuterium: 190000, energy: 130000 },
    maxInstances: 5,
    unlockLevel: 10,
    unlockTier: 2,
    category: 'Defense',
    icon: 'swords',
    lore: 'The star itself is the biggest gun. Everything else is polite conversation.',
  },
  {
    id: 'command-center',
    name: 'Command Coordination Center',
    description: 'Advanced AI-directed control cluster that sharpens every subsystem’s operational efficiency.',
    function: 'Increases operational efficiency.',
    subFunctions: [
      'Re-prioritizes subsystem workloads',
      'Predicts maintenance failures before they happen',
      'Coordinates collector swarm behavior',
      'Tightens power routing to reduce waste',
    ],
    effect: 'efficiency',
    effectValue: 8,
    cost: { metal: 390000, crystal: 350000, deuterium: 160000, energy: 140000 },
    maxInstances: 2,
    unlockLevel: 12,
    unlockTier: 2,
    category: 'Control',
    icon: 'cpu',
    lore: 'Good management turns a loud star into a quiet empire.',
  },
  {
    id: 'prefab-shipyard',
    name: 'Prefab Construction Shipyard',
    description: 'Automated yard that assembles segments in advance, cutting construction time for future levels.',
    function: 'Reduces future construction/upgrade time.',
    subFunctions: [
      'Pre-cuts structural rings',
      'Stocks reactor casings for fast installation',
      'Trains construction crews on simulated scaffolds',
      'Queues parallel build tasks for later expansion',
    ],
    effect: 'construction',
    effectValue: 10,
    cost: { metal: 480000, crystal: 300000, deuterium: 170000, energy: 110000 },
    maxInstances: 2,
    unlockLevel: 15,
    unlockTier: 3,
    category: 'Construction',
    icon: 'wrench',
    lore: 'Every hour saved now is an hour spent conquering later.',
  },
];

// ============================================================================
// DYSON-SPECIFIC CATALOG
// ============================================================================

export const DYSON_MODULES: MegastructureModuleDefinition[] = [
  {
    id: 'flare-shunt',
    name: 'Flare Shunt Conduit',
    description: 'Emergency conduit that captures solar flare bursts and redirects them into raw energy reservoirs.',
    function: 'Massively increases energy output from stellar events.',
    subFunctions: [
      'Harvests flare peak output',
      'Safely dumps excess into capacitor banks',
      'Repairs the shell between flare events',
      'Feeds orbital refineries during surges',
    ],
    effect: 'energy',
    effectValue: 25,
    cost: { metal: 720000, crystal: 610000, deuterium: 280000, energy: 200000 },
    maxInstances: 2,
    unlockLevel: 20,
    unlockTier: 3,
    category: 'Dyson Exotic',
    icon: 'flame',
    lore: 'A star’s tantrum, made useful.',
  },
  {
    id: 'laser-relay-master',
    name: 'Laser Relay Master Node',
    description: 'Ultra-precise relay node that amplifies photonic grid throughput and research bandwidth.',
    function: 'Boosts research speed and energy distribution.',
    subFunctions: [
      'Amplifies photonic grid throughput',
      'Multiplexes research beam-links',
      'Rebroadcasts commands across the shell',
      'Maintains network timing to microsecond precision',
    ],
    effect: 'research',
    effectValue: 15,
    cost: { metal: 540000, crystal: 780000, deuterium: 240000, energy: 190000 },
    maxInstances: 2,
    unlockLevel: 18,
    unlockTier: 3,
    category: 'Dyson Exotic',
    icon: 'radio',
    lore: 'Signal so clean it makes physicists weep.',
  },
  {
    id: 'stellar-catalyst',
    name: 'Stellar Matter Catalyst',
    description: 'Exotic catalyst chambers that transmute stellar plasma directly into refined resources.',
    function: 'Increases all raw resource production dramatically.',
    subFunctions: [
      'Transmutes plasma into refined stock',
      'Runs at fraction of reactor cost',
      'Feeds the fabrication unit continuously',
      'Stabilizes output during convection cycles',
    ],
    effect: 'production',
    effectValue: 20,
    cost: { metal: 680000, crystal: 650000, deuterium: 320000, energy: 210000 },
    maxInstances: 2,
    unlockLevel: 22,
    unlockTier: 4,
    category: 'Dyson Exotic',
    icon: 'gem',
    lore: 'Alchemy, at the scale of a sun.',
  },
  {
    id: 'void-coolant-loop',
    name: 'Void Coolant Loop',
    description: 'Cryo-channel network that bleeds waste heat into quantum sinks, raising overall efficiency.',
    function: 'Increases operational efficiency and extends subsystem lifetimes.',
    subFunctions: [
      'Bleeds waste heat into quantum sinks',
      'Extends subsystem service intervals',
      'Cools collector optics near the shell',
      'Prevents thermal throttling at peak output',
    ],
    effect: 'efficiency',
    effectValue: 12,
    cost: { metal: 580000, crystal: 700000, deuterium: 260000, energy: 170000 },
    maxInstances: 3,
    unlockLevel: 25,
    unlockTier: 4,
    category: 'Dyson Exotic',
    icon: 'snow',
    lore: 'Cold enough to hold a star’s breath.',
  },
];

// ============================================================================
// CATALOG RESOLUTION
// ============================================================================

export function getModuleCatalogForStructure(
  structureType: string,
  structureClass?: string | null,
): MegastructureModuleDefinition[] {
  const normalizedType = (structureType || '').toLowerCase();
  if (normalizedType === 'dyson-sphere' || normalizedType === 'dyson' || normalizedType === 'dyson_sphere') {
    return [...GENERIC_MODULES, ...DYSON_MODULES];
  }
  const classKey = (structureClass || structureType || '').toLowerCase();
  if (classKey === 'exotic') {
    return [...GENERIC_MODULES, ...DYSON_MODULES];
  }
  return GENERIC_MODULES;
}

export function getModuleDefinition(moduleId: string): MegastructureModuleDefinition | null {
  return GENERIC_MODULES.find((module) => module.id === moduleId) || null;
}

export function getAllModuleDefinitions(): MegastructureModuleDefinition[] {
  return [...GENERIC_MODULES, ...DYSON_MODULES];
}

/**
 * Module socket count for a structure.
 * Base 2 sockets, +1 every 10 levels, +1 at tier 3, capped at 8.
 */
export function getModuleSlotsForStructure(level: number, tier: number = 1): number {
  const safeLevel = Math.max(1, Math.floor(level || 1));
  const safeTier = Math.max(1, Math.floor(tier || 1));
  const levelSlots = 2 + Math.floor(safeLevel / 10);
  const tierBonus = safeTier >= 3 ? 1 : 0;
  return Math.min(8, levelSlots + tierBonus);
}

// ============================================================================
// SHORTHAND
// ============================================================================

export const MODULE_COST_LABELS: Array<keyof MegastructureModuleCost> = [
  'metal',
  'crystal',
  'deuterium',
  'energy',
];
