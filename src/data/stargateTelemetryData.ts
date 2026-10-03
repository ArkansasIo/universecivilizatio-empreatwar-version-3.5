/**
 * STARGATE SUBSPACE DIALING NETWORK & RING TRANSPORTERS
 * GATE ROOM TELEMETRY & 1,000 PROCEDURAL DISPATCH EVENTS
 * 
 * Features:
 * - 7-chevron standard dialing across Milky Way & Pegasus (Cost: 1 Attack Turn)
 * - 8-chevron intergalactic dialing to distant galaxies (Cost: 125 Attack Turns)
 * - 9-chevron ultra-deep cosmic dialing to Destiny & boundary worlds (Cost: 200 Attack Turns)
 * - Ring Transporter planetary transit system (Matter-stream rings)
 * - 1,000 distinct procedural Gate Room Telemetry Dispatches & Events
 * - White Background Theme styling throughout all telemetry consoles
 */

export interface StargateDialChevronRule {
  chevronCount: 7 | 8 | 9;
  name: string;
  turnCost: number;
  powerDemandMw: number;
  targetScope: string;
  energySource: string;
  description: string;
}

export const STARGATE_CHEVRON_RULES: Record<number, StargateDialChevronRule> = {
  7: {
    chevronCount: 7,
    name: '7-Chevron Standard Address (Milky Way & Pegasus Intra-Cluster)',
    turnCost: 1,
    powerDemandMw: 120,
    targetScope: 'Standard Intra-Galactic Gate Network',
    energySource: 'Standard Naquadah Generator Buffer',
    description: 'Six spatial coordinates establishing a three-dimensional line intersection plus one point of origin symbol.',
  },
  8: {
    chevronCount: 8,
    name: '8-Chevron Intergalactic Relay (Pegasus, Ida & Andromeda Clusters)',
    turnCost: 125,
    powerDemandMw: 1250,
    targetScope: 'Intergalactic Cluster Coordinates',
    energySource: 'Zero Point Module (ZPM) or Naquadah Boosted Core',
    description: 'Seven coordinates with distance/galaxy scale vector prefix + point of origin. Requires 125 Turns to generate the massive subspace conduit.',
  },
  9: {
    chevronCount: 9,
    name: '9-Chevron Deep Cosmic Bridge (Ancient Vessel Destiny & Far Edge)',
    turnCost: 200,
    powerDemandMw: 4500,
    targetScope: 'Edge of Observable Universe (Destiny Seed Network)',
    energySource: 'Planetary Naquadria Geothermal Core / Solar Tap',
    description: 'Eight-glyph algorithmic code + point of origin connecting to mobile seed vessels billions of light-years away. Requires 200 Turns to puncture trans-galactic subspace.',
  },
};

export interface RingTransporterSite {
  id: string;
  name: string;
  sector: string;
  locationType: 'Subterranean Bunker' | 'Orbital Mothership' | 'Pyramid Temple' | 'Oceanic Spire' | 'Command Room';
  elevationKm: number;
  crystalIntegrityPct: number;
  ringSensorsActive: boolean;
  transitCostCredits: number;
  description: string;
}

export const INITIAL_RING_TRANSPORTERS: RingTransporterSite[] = [
  {
    id: 'ring_sgc_gateroom',
    name: 'Cheyenne Mountain Gate Room Platform',
    sector: 'Earth SGC Level 28',
    locationType: 'Subterranean Bunker',
    elevationKm: -0.65,
    crystalIntegrityPct: 100,
    ringSensorsActive: true,
    transitCostCredits: 100,
    description: 'Standard 5-ring matter stream platform connecting the embarkation room to surface silos and control rooms.',
  },
  {
    id: 'ring_hatak_mothership',
    name: 'Captured Ha\'tak Flagship Bridge Platform',
    sector: 'Low Earth Orbit (350 km)',
    locationType: 'Orbital Mothership',
    elevationKm: 350.0,
    crystalIntegrityPct: 98,
    ringSensorsActive: true,
    transitCostCredits: 450,
    description: 'Ornate gold-engraved Goa\'uld transport rings mounted in the central pel\'tak bridge chamber.',
  },
  {
    id: 'ring_pyramid_temple',
    name: 'Abydos Great Pyramid Capstone Chamber',
    sector: 'Abydos Desert Plateaus',
    locationType: 'Pyramid Temple',
    elevationKm: 0.15,
    crystalIntegrityPct: 92,
    ringSensorsActive: true,
    transitCostCredits: 300,
    description: 'Ancient crystalline ring pedestal aligning directly with landing Ha\'tak pyramidal motherships.',
  },
  {
    id: 'ring_atlantis_gantry',
    name: 'Lantean Ocean Spire Ring Node',
    sector: 'Atlantis Main Tower',
    locationType: 'Oceanic Spire',
    elevationKm: 0.85,
    crystalIntegrityPct: 100,
    ringSensorsActive: true,
    transitCostCredits: 500,
    description: 'Precision Lantean matter-displacement rings bridging the control gantry with underwater jumper bays.',
  },
  {
    id: 'ring_destiny_hydroponics',
    name: 'Destiny Forward Observation Dome',
    sector: 'Ancient Seed Vessel Hull',
    locationType: 'Command Room',
    elevationKm: 0.05,
    crystalIntegrityPct: 84,
    ringSensorsActive: true,
    transitCostCredits: 750,
    description: 'Weathered mechanical rings facilitating rapid movement between Destiny\'s decaying dome sections.',
  },
];

export interface GateRoomTelemetryDispatch {
  id: number;
  code: string;
  category: 'WORMHOLE_ANOMALY' | 'MALP_PROBE' | 'SG_RECON_REPORT' | 'SECURITY_BREACH' | 'RESOURCE_SURGE' | 'ANCIENT_RELIC' | 'ALIEN_DIPLOMACY';
  severity: 'ROUTINE' | 'ELEVATED' | 'CRITICAL' | 'OMEGA';
  galaxy: 'Milky Way' | 'Pegasus' | 'Ida' | 'Universe' | 'Unknown Subspace';
  sourceGate: string;
  headline: string;
  telemetryLog: string;
  rewardNaquadah: number;
  rewardCrystal: number;
  rewardDarkMatter: number;
  threatDetails?: string;
}

// ---------------------------------------------------------------------------
// 1,000 PROCEDURAL TELEMETRY DISPATCHES GENERATOR
// ---------------------------------------------------------------------------
const DISPATCH_SUBJECTS = [
  'Subspace Event Horizon Distortion', 'MALP Bio-Sensor Reading', 'Jaffa Patrol Interception',
  'Wraith Culling Drone Spike', 'Ancient Database Fragment', 'Naquadah Vein Infiltration',
  'Trinium Refinery Distress', 'Iris Kinetic Impact Vaporization', 'Stargate Dialing Feedback Loop',
  'Solar Flare Coronal Mass Ejection', 'Tok\'ra Covert Operative Contact', 'Asgard Holographic Beacon',
  'Replicator Nanite Swarm Signatures', 'Destiny FTL Pulse Telemetry', 'Zero-Point Conduit Discharge',
  'Supergate Gravitational Singularity Pulse', 'Kull Warrior Bio-Sensor Track', 'Tollan Phase-Shift Device Echo',
  'Nox Illusory Concealment Wave', 'Ori Prior Religious Broadcast', 'Puddle Jumper Submerged Recon',
  'Unscheduled Off-World Activation', 'Emergency Iris Lockdown Engaged', 'Radiation Flare Dissipation',
  'Ancient Ascension Energy Residue', 'Symbiote Extraction Protocol', 'Ring Transporter Sensor Alignment'
];

const DISPATCH_LOCATIONS = [
  'P3X-984', 'P4X-639', 'M35-117', 'P2A-018', 'P3X-584', 'M7G-677', 'M7R-227', 'Othala Core',
  'Destiny Deck 4', 'Dakara Weapon Complex', 'Chulak Mountain Redoubt', 'Delmak Netherworld',
  'Lantea Ocean Basin', 'Abydos Dune Temple', 'Tartarus Genetic Hive', 'Langara Kelownan Border',
  'Alaris Colony Node', 'Heliopolis Alliance Citadel', 'Proclarush Taonas Ruin', 'Vis Uban Ancient Spire'
];

const DISPATCH_ACTIONS = [
  'MALP deployed through the event horizon; atmospheric readings stable with high ambient naquadah particles.',
  'Off-world team established secure perimeter; awaiting transport rings alignment.',
  'Unscheduled incoming wormhole with authentic GDO transmission code SG-1-ALPHA confirmed.',
  'Sensor phalanx detected hostile kinetic impacts against the titanium-trinium iris; intruder disintegrated.',
  'High-density crystal lattice discovered inside ancient subterranean vault; mining teams dispatched.',
  'Solar flare during dialing sequence induced temporal micro-wormhole displacement; recalibrating gate clock.',
  'Zero-point conduit tapped into planetary grid, registering massive surge in shield integrity.',
  'Wraith dart sensor transponders detected in low orbit; stealth cloaking cloak active on MALP probe.',
  'Free Jaffa council representatives arrived through the gate for bilateral defense negotiations.',
  'Ancient communication terminal synchronized with Destiny command bridge millions of light-years away.',
  'Tachyon radiation burst neutralized by primary naquadah buffer circuits; telemetry nominal.',
  'Ring transporter matter stream completed transfer of 40 tons of raw trinium ore to surface silos.'
];

function generate1000Dispatches(): GateRoomTelemetryDispatch[] {
  const dispatches: GateRoomTelemetryDispatch[] = [];
  const categories: GateRoomTelemetryDispatch['category'][] = [
    'WORMHOLE_ANOMALY', 'MALP_PROBE', 'SG_RECON_REPORT', 'SECURITY_BREACH',
    'RESOURCE_SURGE', 'ANCIENT_RELIC', 'ALIEN_DIPLOMACY'
  ];
  const severities: GateRoomTelemetryDispatch['severity'][] = ['ROUTINE', 'ELEVATED', 'CRITICAL', 'OMEGA'];
  const galaxies: GateRoomTelemetryDispatch['galaxy'][] = ['Milky Way', 'Pegasus', 'Ida', 'Universe', 'Unknown Subspace'];

  for (let i = 1; i <= 1000; i++) {
    const subject = DISPATCH_SUBJECTS[i % DISPATCH_SUBJECTS.length];
    const location = DISPATCH_LOCATIONS[(i * 7) % DISPATCH_LOCATIONS.length];
    const action = DISPATCH_ACTIONS[(i * 13) % DISPATCH_ACTIONS.length];
    const category = categories[i % categories.length];
    const severity = severities[(i + Math.floor(i / 250)) % severities.length];
    const galaxy = galaxies[(i + Math.floor(i / 200)) % galaxies.length];

    const codeNum = String(i).padStart(4, '0');
    const naq = 5000 + ((i * 37) % 45000);
    const cryst = 3000 + ((i * 23) % 30000);
    const dm = (i % 5 === 0) ? 10 + (i % 80) : 0;

    dispatches.push({
      id: i,
      code: `SGC-DISPATCH-${codeNum}`,
      category,
      severity,
      galaxy,
      sourceGate: location,
      headline: `${subject} detected at ${location} [${galaxy}]`,
      telemetryLog: `Telemetry Report #${codeNum}: ${action} Signal frequency calibrated at ${(1420.4 + (i * 0.17) % 50).toFixed(2)} MHz.`,
      rewardNaquadah: naq,
      rewardCrystal: cryst,
      rewardDarkMatter: dm,
      threatDetails: severity === 'OMEGA' || severity === 'CRITICAL' ? 'High threat vector active; maintain armed garrison.' : undefined,
    });
  }

  return dispatches;
}

export const GATE_ROOM_1000_DISPATCHES: GateRoomTelemetryDispatch[] = generate1000Dispatches();
