/**
 * Megastructure Subsystem Catalog
 * Detail / sub-detail layer for individual megastructures.
 * Each megastructure type exposes a catalog of installable subsystems;
 * each subsystem has its own level progression, costs, bonus math, and
 * sub-functions (secondary effects). Dyson spheres carry a full custom
 * catalog; all other types fall back to class-specific generic systems.
 * @tag #megastructures #subsystems #dyson #production #upgrades
 */

// ============================================================================
// TYPES
// ============================================================================

export type MegastructureSubsystemEffect =
  | 'energy'
  | 'metal'
  | 'crystal'
  | 'deuterium'
  | 'research'
  | 'defense'
  | 'efficiency'
  | 'capacity'
  | 'storage';

export interface MegastructureSubsystemCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export interface MegastructureSubsystemDefinition {
  id: string;
  name: string;
  description: string;
  function: string;
  subFunctions: string[];
  effect: MegastructureSubsystemEffect;
  category: string;
  maxLevel: number;
  baseCost: MegastructureSubsystemCost;
  costGrowth: number;
  baseBonus: number;
  bonusGrowth: number;
  bonusUnit: string;
  icon: string;
  lore: string;
}

export interface MegastructureSubsystemContribution {
  energy: number;
  metal: number;
  crystal: number;
  deuterium: number;
  research: number;
  defense: number;
  efficiency: number;
  capacity: number;
  storage: number;
}

export interface SubsystemStructureContext {
  level: number;
  tier: number;
  efficiency: number;
  power: number;
}

// ============================================================================
// BASE PRODUCTION SCALES (per effect, at subsystem level 1, zero structure bonus)
// ============================================================================

export const SUBSYSTEM_BASE_RATES: Record<MegastructureSubsystemEffect, number> = {
  energy: 1200,
  metal: 800,
  crystal: 600,
  deuterium: 400,
  research: 5,
  defense: 5000,
  efficiency: 1.5,
  capacity: 25000,
  storage: 500000,
};

export const SUBSYSTEM_EFFECT_LABELS: Record<MegastructureSubsystemEffect, string> = {
  energy: 'Energy Output',
  metal: 'Metal Production',
  crystal: 'Crystal Production',
  deuterium: 'Deuterium Production',
  research: 'Research Speed',
  defense: 'Defense Rating',
  efficiency: 'Operational Efficiency',
  capacity: 'Population Capacity',
  storage: 'Resource Storage',
};

// ============================================================================
// DYSON SPHERE CATALOG
// ============================================================================

export const DYSON_SUBSYSTEMS: MegastructureSubsystemDefinition[] = [
  {
    id: 'photon-collector-array',
    name: 'Photon Collector Array',
    description: 'Sealed photovoltaic lattice panels that swallow stellar output and convert it into grid-ready energy.',
    function: 'Primary stellar energy capture into the imperial power grid.',
    subFunctions: [
      'Absorbs full-spectrum stellar radiation',
      'Converts raw flux into grid-ready energy',
      'Steers excess output into capacitor banks',
      'Self-cleaning nanite film maintains peak reflectivity',
    ],
    effect: 'energy',
    category: 'Power Generation',
    maxLevel: 40,
    baseCost: { metal: 480000, crystal: 520000, deuterium: 160000, energy: 0 },
    costGrowth: 1.42,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: '/hr',
    icon: 'solar',
    lore: '"The first array never dimmed. It just demanded more of the star." — Dyson Ring Construction Manifesto',
  },
  {
    id: 'radiative-shell',
    name: 'Radiative Shielding Shell',
    description: 'Thermally vented inner hull plating that prevents structural meltdown while the sphere runs at full capture.',
    function: 'Dissipates waste heat and raises operational efficiency.',
    subFunctions: [
      'Vents excess heat into deep space',
      'Recycles waste heat into secondary power loops',
      'Protects sensitive optics from stellar wind',
      'Prevents runaway thermal cascade failure',
    ],
    effect: 'efficiency',
    category: 'Structural',
    maxLevel: 30,
    baseCost: { metal: 620000, crystal: 340000, deuterium: 220000, energy: 0 },
    costGrowth: 1.38,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: '% efficiency',
    icon: 'shield',
    lore: 'The shell is not armor. It is the price of touching a star without burning.',
  },
  {
    id: 'orbital-swarm-layer',
    name: 'Orbital Swarm Layer',
    description: 'Thousands of cooperative collector satellites holding a loose inner ring, harvesting flux before it ever reaches the shell.',
    function: 'Layered stellar collection that multiplies total energy capture.',
    subFunctions: [
      'Swarms beam energy to shell relays',
      'Act as sacrificial shields against micro-debris',
      'Adaptive re-tasking during stellar flare events',
      'Expand outward as additional layers complete',
    ],
    effect: 'energy',
    category: 'Power Generation',
    maxLevel: 50,
    baseCost: { metal: 380000, crystal: 690000, deuterium: 140000, energy: 0 },
    costGrowth: 1.45,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: '/hr',
    icon: 'orbit',
    lore: 'One collector is a satellite. A million collectors are a second sun being tamed.',
  },
  {
    id: 'capacitor-banks',
    name: 'Capacitor Bank Array',
    description: 'Gigawatt-scale energy reservoirs that smooth demand spikes and buffer the empire against solar variance.',
    function: 'Expands stored energy and total resource storage.',
    subFunctions: [
      'Buffers grid demand spikes',
      'Powers long-range relay jumps',
      'Sells stored energy on interstellar markets',
      'Backs up critical life support reserves',
    ],
    effect: 'storage',
    category: 'Storage',
    maxLevel: 35,
    baseCost: { metal: 520000, crystal: 480000, deuterium: 180000, energy: 0 },
    costGrowth: 1.4,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: ' storage',
    icon: 'zap',
    lore: 'Energy you can bank is energy you own twice.',
  },
  {
    id: 'photonic-relay-grid',
    name: 'Photonic Relay Grid',
    description: 'Laser-relay lattice that shuttles captured energy to planets, fleets, and research arrays across the system.',
    function: 'Distributes captured energy and accelerates research throughput.',
    subFunctions: [
      'Beam energy to orbiting planets',
      'Feed research stations with surplus flux',
      'Rebroadcast command signals through the shell',
      'Prioritize critical nodes during grid contention',
    ],
    effect: 'research',
    category: 'Distribution',
    maxLevel: 25,
    baseCost: { metal: 440000, crystal: 560000, deuterium: 200000, energy: 0 },
    costGrowth: 1.44,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: '% research',
    icon: 'radio',
    lore: 'Light that moves information and power both moves empires.',
  },
  {
    id: 'mass-elevator',
    name: 'Stellar Mass Elevator',
    description: 'Gravity-tethered transport stalks that lift refined mass up from the inner system and haul construction material down.',
    function: 'Boosts metal and crystal production through stellar material harvesting.',
    subFunctions: [
      'Siphons stellar plasma into metal refineries',
      'Catches stellar wind particulates as crystal feedstock',
      'Lowers raw material for shell expansion',
      'Ejects refuse mass into slingshot orbits',
    ],
    effect: 'metal',
    category: 'Harvesting',
    maxLevel: 30,
    baseCost: { metal: 780000, crystal: 300000, deuterium: 260000, energy: 0 },
    costGrowth: 1.47,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: '/hr',
    icon: 'anchor',
    lore: 'The star feeds the machine that feeds the star.',
  },
  {
    id: 'control-node-network',
    name: 'Control Node Network',
    description: 'Distributed command lattice that coordinates every panel, relay, and capacitor with sub-second latency.',
    function: 'Improves efficiency and tightens defensive response times.',
    subFunctions: [
      'Automates panel tracking and alignment',
      'Reroutes power around damaged segments',
      'Detects intruder approach vectors',
      'Orchestrates flare-response shutdown protocols',
    ],
    effect: 'defense',
    category: 'Command',
    maxLevel: 20,
    baseCost: { metal: 560000, crystal: 640000, deuterium: 240000, energy: 0 },
    costGrowth: 1.46,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: ' rating',
    icon: 'cpu',
    lore: 'A trillion decisions per second is how a star is governed.',
  },
  {
    id: 'intercept-grid',
    name: 'Intercept Defense Grid',
    description: 'Point-defense emitters threaded through the shell that crack down on anything reckless enough to approach.',
    function: 'Provides defense rating and orbital denial for the sphere.',
    subFunctions: [
      'Engages incoming ships and missiles',
      'Shields critical relay nodes from salvo fire',
      'Caps boarding attempts via denial fields',
      'Coordinates with system defense networks',
    ],
    effect: 'defense',
    category: 'Defense',
    maxLevel: 30,
    baseCost: { metal: 900000, crystal: 420000, deuterium: 320000, energy: 0 },
    costGrowth: 1.49,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: ' rating',
    icon: 'crosshair',
    lore: 'Nothing reaches the heart of the machine uninvited.',
  },
];

// ============================================================================
// GENERIC CLASS CATALOGS (fallback for non-Dyson megastructures)
// ============================================================================

function classCatalog(
  category: string,
  systems: Array<{
    id: string;
    name: string;
    function: string;
    subFunctions: string[];
    effect: MegastructureSubsystemEffect;
    icon: string;
    lore: string;
    maxLevel: number;
    costGrowth: number;
  }>,
): MegastructureSubsystemDefinition[] {
  return systems.map((system, index) => ({
    id: system.id,
    name: system.name,
    description: system.function,
    function: system.function,
    subFunctions: system.subFunctions,
    effect: system.effect,
    category,
    maxLevel: system.maxLevel,
    baseCost: {
      metal: 240000 + index * 40000,
      crystal: 200000 + index * 40000,
      deuterium: 100000 + index * 20000,
      energy: 0,
    },
    costGrowth: system.costGrowth,
    baseBonus: 1,
    bonusGrowth: 1,
    bonusUnit: '/hr',
    icon: system.icon,
    lore: system.lore,
  }));
}

const CLASS_SUBSYSTEM_CATALOGS: Record<string, MegastructureSubsystemDefinition[]> = {
  infrastructure: classCatalog('Infrastructure', [
    { id: 'habitat-bays', name: 'Habitat Bays', function: 'Expands habitation capacity across the structure.', subFunctions: ['Pressurized living decks', 'Atmospheric recycling loops', 'Gravity ring stabilization'], effect: 'capacity', icon: 'home', lore: 'Even megastructures need neighborhoods.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'power-coupling', name: 'Power Coupling Banks', function: 'Amplifies energy output and grid stability.', subFunctions: ['Peak output smoothing', 'Emergency reserve switching', 'Cross-structure load sharing'], effect: 'energy', icon: 'zap', lore: 'Power that flows is power that wins.', maxLevel: 35, costGrowth: 1.44 },
    { id: 'transit-docks', name: 'Transit Dock Complex', function: 'Accelerates logistics throughput and resource flow.', subFunctions: ['Cargo routing optimization', 'Priority fleet launches', 'Automated dock scheduling'], effect: 'crystal', icon: 'anchor', lore: 'Distance is a tax on empires.', maxLevel: 30, costGrowth: 1.4 },
  ]),
  production: classCatalog('Production', [
    { id: 'fabrication-lines', name: 'Fabrication Lines', function: 'Boosts industrial output for the whole empire.', subFunctions: ['Alloy extrusion lines', 'Nano-assembly bays', 'Precision tooling cells'], effect: 'metal', icon: 'factory', lore: 'Build the machines that build the fleet.', maxLevel: 40, costGrowth: 1.45 },
    { id: 'matter-catalyst', name: 'Matter Catalyst Vats', function: 'Accelerates crystal growth and exotic refinement.', subFunctions: ['Crystal lattice seeding', 'Deuterium distillation', 'Exotic slurry stabilization'], effect: 'crystal', icon: 'flask', lore: 'Chemistry, at planetary scale.', maxLevel: 35, costGrowth: 1.47 },
    { id: 'cargo-ports', name: 'Cargo Port Matrix', function: 'Expands storage and loading throughput.', subFunctions: ['Deep storage silos', 'Automated loader cranes', 'Hazard segregation bays'], effect: 'storage', icon: 'box', lore: 'A port is where wealth changes hands.', maxLevel: 30, costGrowth: 1.4 },
  ]),
  research: classCatalog('Research', [
    { id: 'lab-bays', name: 'Laboratory Bays', function: 'Raises research speed and discovery potential.', subFunctions: ['Simulation chambers', 'Particle collider rings', 'Biotech incubation vaults'], effect: 'research', icon: 'flask', lore: 'Discovery is the true megastructure.', maxLevel: 40, costGrowth: 1.46 },
    { id: 'computation-cores', name: 'Computation Cores', function: 'Adds exascale processing for analysis and logistics.', subFunctions: ['Quantum co-processors', 'Predictive simulation banks', 'Archive compression stacks'], effect: 'efficiency', icon: 'cpu', lore: 'Think faster than the enemy fights.', maxLevel: 35, costGrowth: 1.48 },
    { id: 'data-relays', name: 'Data Relay Spires', function: 'Broadcasts findings and speeds cross-empire research.', subFunctions: ['Interstellar data beaming', 'Collaborative research linking', 'Encrypted transmission tunnels'], effect: 'research', icon: 'radio', lore: 'Share the light of knowledge.', maxLevel: 30, costGrowth: 1.42 },
  ]),
  defense: classCatalog('Defense', [
    { id: 'shield-projectors', name: 'Shield Projector Bays', function: 'Hardens the structure against siege and impact.', subFunctions: ['Hull reinforcement fields', 'Kinetic deflection screens', 'Regenerative armor plating'], effect: 'defense', icon: 'shield', lore: 'A wall the size of a world.', maxLevel: 40, costGrowth: 1.45 },
    { id: 'point-defense', name: 'Point Defense Grid', function: 'Tracks and engages incoming threats at range.', subFunctions: ['Interception turret network', 'Anti-missile screening', 'Target priority AI'], effect: 'defense', icon: 'crosshair', lore: 'Catch them before they arrive.', maxLevel: 35, costGrowth: 1.47 },
    { id: 'sensor-banks', name: 'Sensor Bank Array', function: 'Extends detection range and threat awareness.', subFunctions: ['Deep-field scanning', 'Stealth penetration sweeps', 'Long-range early warning'], effect: 'efficiency', icon: 'scan', lore: 'See first, survive always.', maxLevel: 30, costGrowth: 1.43 },
  ]),
  mobility: classCatalog('Mobility', [
    { id: 'warp-focus', name: 'Warp Focus Rings', function: 'Amplifies jump range and fleet transit speeds.', subFunctions: ['Jump lane calibration', 'Fleet convoy coordination', 'Emergency micro-jumps'], effect: 'energy', icon: 'orbit', lore: 'The stars are a highway.', maxLevel: 40, costGrowth: 1.46 },
    { id: 'starlift-towers', name: 'Starlift Towers', function: 'Pulls stellar mass for fuel and construction.', subFunctions: ['Plasma scooping', 'Deuterium fractionation', 'Mass slingshot launch'], effect: 'deuterium', icon: 'anchor', lore: 'Drink the sun, move the fleet.', maxLevel: 35, costGrowth: 1.44 },
    { id: 'navigation-grid', name: 'Navigation Grid', function: 'Refines route plotting and collision avoidance.', subFunctions: ['Gravitational mapping', 'Drift prediction', 'Automated pilot assist'], effect: 'efficiency', icon: 'compass', lore: 'The map is older than the empire.', maxLevel: 30, costGrowth: 1.4 },
  ]),
  superweapon: classCatalog('Superweapon', [
    { id: 'capacitor-rings', name: 'Capacitor Rings', function: 'Charges and stores weapon firepower.', subFunctions: ['Rapid fire cycling', 'Overcharge protocols', 'Voltage stabilization'], effect: 'energy', icon: 'zap', lore: 'Patience is a weapon.', maxLevel: 40, costGrowth: 1.49 },
    { id: 'targeting-matrix', name: 'Targeting Matrix', function: 'Improves weapon accuracy and critical threat.', subFunctions: ['Predictive targeting', 'Weak-point scanning', 'Coordinated salvo timing'], effect: 'defense', icon: 'crosshair', lore: 'One shot, placed perfectly.', maxLevel: 35, costGrowth: 1.47 },
    { id: 'reactor-cells', name: 'Reactor Cell Banks', function: 'Boosts sustained combat output.', subFunctions: ['Reactor redundancy', 'Coolant loop optimization', 'Emergency power surge'], effect: 'metal', icon: 'flask', lore: 'Power the end of worlds.', maxLevel: 30, costGrowth: 1.45 },
  ]),
  exotic: classCatalog('Exotic', [
    { id: 'reality-anchors', name: 'Reality Anchors', function: 'Stabilizes dimensional rifts around the structure.', subFunctions: ['Containment field projection', 'Rift drift dampening', 'Phase-lock synchronization'], effect: 'efficiency', icon: 'shield', lore: 'Hold the universe in place.', maxLevel: 40, costGrowth: 1.48 },
    { id: 'rift-stabilizers', name: 'Rift Stabilizers', function: 'Opens controlled transits through folded space.', subFunctions: ['Micro-wormhole opening', 'Cargo phase transit', 'Explosive rift denial'], effect: 'research', icon: 'orbit', lore: 'Space is a suggestion.', maxLevel: 35, costGrowth: 1.5 },
    { id: 'flux-shunts', name: 'Flux Shunt Arrays', function: 'Siphons ambient exotic energy for empire use.', subFunctions: ['Zero-point extraction', 'Entropy harvesting', 'Exotic charge storage'], effect: 'energy', icon: 'sparkles', lore: 'Everything is power, if you ask correctly.', maxLevel: 30, costGrowth: 1.46 },
  ]),
  civilization: classCatalog('Civilization', [
    { id: 'population-arcologies', name: 'Population Arcology Bays', function: 'Houses billions inside self-contained cities.', subFunctions: ['Atmosphere domes', 'Food synthesis towers', 'Transport arcologies'], effect: 'capacity', icon: 'users', lore: 'A city is a civilization in miniature.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'cultural-broadcast', name: 'Cultural Broadcast Spires', function: 'Projects influence and unifies the empire.', subFunctions: ['Propaganda networks', 'Heritage archives', 'Diplomatic signal relay'], effect: 'efficiency', icon: 'radio', lore: 'Ideas cross light-years too.', maxLevel: 35, costGrowth: 1.4 },
    { id: 'governance-nodes', name: 'Governance Nodes', function: 'Automates administration and resource allocation.', subFunctions: ['Resource arbitration', 'Policy execution engines', 'Census and logistics AI'], effect: 'efficiency', icon: 'cpu', lore: 'Rule by algorithm, rule forever.', maxLevel: 30, costGrowth: 1.43 },
  ]),
  economic: classCatalog('Economic', [
    { id: 'trade-bays', name: 'Trade Bay Complex', function: 'Boosts market throughput and commerce volume.', subFunctions: ['Exchange floor automation', 'Fleet docking for traders', 'Tariff processing cores'], effect: 'metal', icon: 'coins', lore: 'Even empires trade.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'exchange-rates', name: 'Exchange Rate Stabilizers', function: 'Improves resource conversion efficiency.', subFunctions: ['Currency liquidity pools', 'Resource futures hedging', 'Cross-market arbitrage'], effect: 'deuterium', icon: 'handshake', lore: 'Stable markets, stable empires.', maxLevel: 35, costGrowth: 1.44 },
    { id: 'vault-segments', name: 'Vault Segments', function: 'Safeguards reserves and expands storage.', subFunctions: ['Gravimetric safe vaults', 'Encrypted transaction ledgers', 'Emergency war chest reserves'], effect: 'storage', icon: 'box', lore: 'Wealth that cannot be stolen is real wealth.', maxLevel: 30, costGrowth: 1.4 },
  ]),
  communication: classCatalog('Communication', [
    { id: 'broadcast-spires', name: 'Broadcast Spires', function: 'Projects command signals across the star system.', subFunctions: ['Fleet command broadcast', 'Civilian info network', 'Emergency beacon coverage'], effect: 'efficiency', icon: 'radio', lore: 'The commander always speaks.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'relay-satellites', name: 'Relay Satellite Net', function: 'Expands signal reach and resilience.', subFunctions: ['Mesh redundancy', 'Signal boost chains', 'Jamming resistance'], effect: 'research', icon: 'orbit', lore: 'Let no message be lost.', maxLevel: 35, costGrowth: 1.4 },
    { id: 'encryption-cores', name: 'Encryption Cores', function: 'Protects command traffic from interception.', subFunctions: ['Quantum key distribution', 'Traffic analysis masking', 'Counter-espionage filtering'], effect: 'defense', icon: 'shield', lore: 'Secrets are weapons.', maxLevel: 30, costGrowth: 1.44 },
  ]),
  exploration: classCatalog('Exploration', [
    { id: 'survey-array', name: 'Deep Survey Array', function: 'Maps unknown sectors and anomaly fields.', subFunctions: ['Wormhole census', 'Resource field mapping', 'Anomaly risk assessment'], effect: 'research', icon: 'scan', lore: 'The frontier is a ledger.', maxLevel: 40, costGrowth: 1.44 },
    { id: 'probe-bays', name: 'Probe Launch Bays', function: 'Deploys autonomous survey probes.', subFunctions: ['Long-range probe missions', 'Automated sample return', 'Signal relay chain'], effect: 'crystal', icon: 'rocket', lore: 'Send a thousand eyes.', maxLevel: 35, costGrowth: 1.42 },
  ]),
  colonization: classCatalog('Colonization', [
    { id: 'settlement-complex', name: 'Settlement Complex', function: 'Prepares and supports new colony ventures.', subFunctions: ['Colony ship loading', 'Prefab settlement assembly', 'Survey crew staging'], effect: 'capacity', icon: 'globe', lore: 'The frontier waits for builders.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'relay-network', name: 'Settlement Relay Network', function: 'Keeps colonies linked to the empire.', subFunctions: ['Colony resupply routing', 'Emergency evac beacons', 'Resource return convoys'], effect: 'metal', icon: 'radio', lore: 'No colony is an island.', maxLevel: 35, costGrowth: 1.4 },
  ]),
  diplomatic: classCatalog('Diplomatic', [
    { id: 'diplomatic-station', name: 'Diplomatic Station', function: 'Hosts negotiations and alliance summits.', subFunctions: ['Treaty signing halls', 'Ambassador residences', 'Secure summit chambers'], effect: 'efficiency', icon: 'handshake', lore: 'Peace is engineered too.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'peace-beacon', name: 'Peace Beacon', function: 'Projects deterrence through visible power.', subFunctions: ['Ceremonial defense shows', 'Non-aggression signaling', 'Influence projection arrays'], effect: 'defense', icon: 'shield', lore: 'Show strength, invite peace.', maxLevel: 35, costGrowth: 1.44 },
  ]),
  surveillance: classCatalog('Surveillance', [
    { id: 'sensor-array', name: 'Sensor Array Spines', function: 'Watches deep space for threats and secrets.', subFunctions: ['Fleet tracking', 'Espionage detection', 'Stealth vessel scanning'], effect: 'defense', icon: 'scan', lore: 'Knowledge precedes victory.', maxLevel: 40, costGrowth: 1.46 },
    { id: 'analysis-cores', name: 'Analysis Cores', function: 'Processes surveillance into intelligence.', subFunctions: ['Pattern recognition', 'Predictive threat modeling', 'Counter-intelligence checks'], effect: 'research', icon: 'cpu', lore: 'Data is ammunition.', maxLevel: 35, costGrowth: 1.44 },
  ]),
  terraforming: classCatalog('Terraforming', [
    { id: 'terraform-engine', name: 'Terraform Engines', function: 'Reshapes hostile worlds into habitable colonies.', subFunctions: ['Atmosphere generation', 'Hydrosphere seeding', 'Climate stabilization nets'], effect: 'capacity', icon: 'leaf', lore: 'Every world can be made home.', maxLevel: 40, costGrowth: 1.44 },
    { id: 'biome-architect', name: 'Biome Architect Bays', function: 'Designs and deploys custom biospheres.', subFunctions: ['Genetic seed banks', 'Ecosystem simulation', 'Containment field gardens'], effect: 'crystal', icon: 'sprout', lore: 'Life is the final crop.', maxLevel: 35, costGrowth: 1.42 },
  ]),
  ecological: classCatalog('Ecological', [
    { id: 'biome-reconstructor', name: 'Biome Reconstructor', function: 'Restores and preserves planetary biospheres.', subFunctions: ['Species reintroduction', 'Pollution scrubbing', 'Habitat corridor mapping'], effect: 'efficiency', icon: 'sprout', lore: 'Heal the worlds you use.', maxLevel: 40, costGrowth: 1.42 },
    { id: 'waste-recycler', name: 'Waste Recycler Arrays', function: 'Converts industrial waste into resources.', subFunctions: ['Slag reclamation', 'Atmosphere scrubbers', 'Closed-loop material cycles'], effect: 'metal', icon: 'leaf', lore: 'Nothing is wasted by the wise.', maxLevel: 35, costGrowth: 1.4 },
  ]),
  temporal: classCatalog('Temporal', [
    { id: 'temporal-observatory', name: 'Temporal Observatory', function: 'Studies causality loops and time distortion.', subFunctions: ['Chronal lens focusing', 'Predictive event modeling', 'Time-dilation shielding'], effect: 'research', icon: 'clock', lore: 'Time is a resource too.', maxLevel: 40, costGrowth: 1.48 },
    { id: 'chronal-stabilizer', name: 'Chronal Stabilizer', function: 'Hardens the structure against temporal attacks.', subFunctions: ['Timeline anchoring', 'Paradox dampening', 'Temporal cloak detection'], effect: 'efficiency', icon: 'shield', lore: 'What is not erased, endures.', maxLevel: 35, costGrowth: 1.46 },
  ]),
  'dimensional-forge': classCatalog('Dimensional Forge', [
    { id: 'forge-nexus', name: 'Forge Nexus Core', function: 'Forges matter from dimensional spillover.', subFunctions: ['Reality seam tapping', 'Exotic alloy synthesis', 'Dimensional cargo routing'], effect: 'crystal', icon: 'hexagon', lore: 'Build with borrowed dimensions.', maxLevel: 40, costGrowth: 1.5 },
    { id: 'rift-vault', name: 'Rift Vault', function: 'Stores matter and energy in folded space.', subFunctions: ['Pocket dimension storage', 'Secure dimensional transit', 'Emergency rift evacuation'], effect: 'storage', icon: 'box', lore: 'Store where thieves cannot reach.', maxLevel: 35, costGrowth: 1.48 },
  ]),
};

// ============================================================================
// CATALOG LOOKUP
// ============================================================================

export function getSubsystemCatalogForStructure(
  structureType: string,
  structureClass: string,
): MegastructureSubsystemDefinition[] {
  if (structureType === 'dyson-sphere') return DYSON_SUBSYSTEMS;
  return CLASS_SUBSYSTEM_CATALOGS[structureClass] || CLASS_SUBSYSTEM_CATALOGS.infrastructure;
}

const ALL_SUBSYSTEMS: MegastructureSubsystemDefinition[] = [
  ...DYSON_SUBSYSTEMS,
  ...Object.values(CLASS_SUBSYSTEM_CATALOGS).flat(),
];

export function getSubsystemDefinition(subsystemId: string): MegastructureSubsystemDefinition | undefined {
  return ALL_SUBSYSTEMS.find((definition) => definition.id === subsystemId);
}

export function getSubsystemMaxLevel(definition: MegastructureSubsystemDefinition): number {
  return definition.maxLevel;
}

// ============================================================================
// MATH
// ============================================================================

export function calculateSubsystemUpgradeCost(
  definition: MegastructureSubsystemDefinition,
  currentLevel: number,
): MegastructureSubsystemCost {
  const level = Math.max(0, Math.floor(currentLevel || 0));
  const growth = Math.pow(definition.costGrowth, level);
  return {
    metal: Math.floor(definition.baseCost.metal * growth),
    crystal: Math.floor(definition.baseCost.crystal * growth),
    deuterium: Math.floor(definition.baseCost.deuterium * growth),
    energy: Math.floor(definition.baseCost.energy * growth),
  };
}

export function calculateSubsystemBonus(
  definition: MegastructureSubsystemDefinition,
  level: number,
): number {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  if (safeLevel === 0) return 0;
  return definition.baseBonus + definition.bonusGrowth * (safeLevel - 1);
}

export function computeSubsystemContribution(
  definition: MegastructureSubsystemDefinition,
  level: number,
  context?: SubsystemStructureContext,
): MegastructureSubsystemContribution {
  const empty: MegastructureSubsystemContribution = {
    energy: 0,
    metal: 0,
    crystal: 0,
    deuterium: 0,
    research: 0,
    defense: 0,
    efficiency: 0,
    capacity: 0,
    storage: 0,
  };

  const safeLevel = Math.max(0, Math.floor(level || 0));
  if (safeLevel === 0) return empty;

  const structureFactor = context ? 1 + Math.max(0, context.level - 1) * 0.05 + Math.max(0, context.tier - 1) * 0.25 : 1;
  const efficiencyFactor = context ? 0.5 + (context.efficiency / 200) : 1;
  const rate = SUBSYSTEM_BASE_RATES[definition.effect];
  const value = Math.round(rate * safeLevel * structureFactor * efficiencyFactor);

  empty[definition.effect] = value;
  return empty;
}

export function sumSubsystemContributions(
  contributions: MegastructureSubsystemContribution[],
): MegastructureSubsystemContribution {
  return contributions.reduce<MegastructureSubsystemContribution>(
    (acc, contribution) => {
      acc.energy += contribution.energy;
      acc.metal += contribution.metal;
      acc.crystal += contribution.crystal;
      acc.deuterium += contribution.deuterium;
      acc.research += contribution.research;
      acc.defense += contribution.defense;
      acc.efficiency += contribution.efficiency;
      acc.capacity += contribution.capacity;
      acc.storage += contribution.storage;
      return acc;
    },
    { energy: 0, metal: 0, crystal: 0, deuterium: 0, research: 0, defense: 0, efficiency: 0, capacity: 0, storage: 0 },
  );
}

export function formatSubsystemContribution(
  definition: MegastructureSubsystemDefinition,
  contribution: number,
): string {
  const unit = definition.bonusUnit;
  return `${contribution.toLocaleString()}${unit === '% research' || unit === '% efficiency' ? '%' : unit}`;
}
