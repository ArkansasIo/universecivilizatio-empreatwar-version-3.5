import { EmpireHistoryEvent } from '../types';

export const INITIAL_EMPIRE_HISTORY_EVENTS: EmpireHistoryEvent[] = [
  {
    id: 'hist-001',
    timestamp: '2026-09-23T12:00:00Z',
    stardate: 'SD-2026.09-A01',
    title: 'Systems Root Master Authorization & Universe Kernel Genesis',
    category: 'admin_directive',
    significance: 'epoch_defining',
    rulerName: 'SystemsRoot_Admin',
    rulerRole: 'Super Admin',
    coordinates: '[1:1:1]',
    description:
      'The Sovereign Systems Root account (SystemsRoot_Admin) authorized primary AES-256 kernel encryption, initializing Universe Alpha-1 (Stargate Nexus). Core database tables, security access roles, and 1 to 999,999 planetary conquest vectors were established.',
    impacts: [
      { label: 'Security Clearance', value: 'Level 5 Super Admin' },
      { label: 'Sector Registry', value: '999,999 Worlds Mapped' },
      { label: 'System Kernel', value: 'AES-256 Sovereign Matrix' },
    ],
    tags: ['Root Systems', 'Kernel Genesis', 'Admin Auth'],
  },
  {
    id: 'hist-002',
    timestamp: '2026-09-22T18:30:00Z',
    stardate: 'SD-2026.09-A02',
    title: 'Enactment of Imperial Decree: Infinite Expansion Protocol',
    category: 'imperial_decree',
    significance: 'epoch_defining',
    rulerName: 'SupremeAdmin_Archon',
    rulerRole: 'Crown Archon',
    description:
      'Supreme Admin Archon issued the Crown Decree of Infinite Expansion. Standard turn accumulation cap expanded to 259,200 turns (Monthly Uncapped Mode), allowing continuous automated resource collection and sector blitz operations.',
    impacts: [
      { label: 'Turn Cap', value: '259,200 Monthly Cap' },
      { label: 'Resource Growth', value: '+100% Passive Rate' },
      { label: 'Decree Status', value: 'Active Crown Edict' },
    ],
    tags: ['Imperial Decree', 'Crown Edict', 'Turn Cap'],
  },
  {
    id: 'hist-003',
    timestamp: '2026-09-21T14:15:00Z',
    stardate: 'SD-2026.09-A03',
    title: 'Breakthrough: Zero Point Module (ZPM) Energy Harnessing',
    category: 'tech_breakthrough',
    significance: 'major',
    rulerName: 'Commander_O_Neill',
    rulerRole: 'High Fleet General',
    coordinates: '[1:204:6]',
    description:
      'SGC Chief Technicians unlocked the secrets of Subspace Energy Extraction via Zero Point Modules. Micro-singularities stabilized within Naquadah-alloy casings, supplying 1,000,000 MW clean power directly to orbital defense grids and shield generators.',
    impacts: [
      { label: 'Power Grid Yield', value: '+300% MW Output' },
      { label: 'Shield Deflector', value: '+150% Overcharge Capacity' },
      { label: 'Research Tier', value: 'ZPM Technology Level X' },
    ],
    tags: ['Tech Breakthrough', 'ZPM Power', 'Subspace'],
  },
  {
    id: 'hist-004',
    timestamp: '2026-09-20T09:40:00Z',
    stardate: 'SD-2026.09-A04',
    title: 'Establishment of Earth Capital SGC Prime',
    category: 'colony_establishment',
    significance: 'epoch_defining',
    rulerName: 'Commander_O_Neill',
    rulerRole: 'High Fleet General',
    coordinates: '[1:204:6]',
    description:
      'Colonial Flagship landed on Earth (Class M Continental World), establishing SGC Prime Headquarters. Underground Cheyenne Mountain Stargate Complex commissioned with Iris Defense Shielding and deep Naquadah refineries.',
    impacts: [
      { label: 'Home World', value: 'Class M Continental Terra' },
      { label: 'Max Fields', value: '240 Planetary Fields' },
      { label: 'Phalanx Level', value: 'Level 10 Subspace Phalanx' },
    ],
    tags: ['Colony Establishment', 'Capital World', 'SGC Prime'],
  },
  {
    id: 'hist-005',
    timestamp: '2026-09-18T16:20:00Z',
    stardate: 'SD-2026.09-A05',
    title: 'Victory at P3X-888: Replicator Hive Fleet Repulsion',
    category: 'galactic_battle',
    significance: 'major',
    rulerName: 'SupremeThor_Asgard',
    rulerRole: 'Asgard High Council',
    coordinates: '[3:88:9]',
    description:
      'A combined Tauri-Asgard task force intercepted a Replicator Swarm Flagship armada in Sector 3. Joint disruptor weaponry destroyed 1,200 Replicator dreadnoughts, generating an 85M Metal orbital debris field.',
    impacts: [
      { label: 'Enemy Ships Destroyed', value: '1,200 Swarm Dreadnoughts' },
      { label: 'Debris Field Spawned', value: '85M Metal / 64M Crystal' },
      { label: 'Tactical Outcome', value: 'Decisive Sovereign Victory' },
    ],
    tags: ['Galactic Battle', 'Asgard Joint Fleet', 'Debris Field'],
  },
  {
    id: 'hist-006',
    timestamp: '2026-09-15T11:10:00Z',
    stardate: 'SD-2026.09-A06',
    title: 'Colonial Expansion: Alpha Site Outpost Groundbreaking',
    category: 'colony_establishment',
    significance: 'routine',
    rulerName: 'Commander_O_Neill',
    rulerRole: 'High Fleet General',
    coordinates: '[1:204:8]',
    description:
      'Colony Fleet landed on Alpha Site Outpost (Class P Glacial Boreal World). Sub-zero Deuterium extraction pumps installed in frozen methane lakes to supply fleet fuel for inter-galaxy ops.',
    impacts: [
      { label: 'Planet Class', value: 'Class P Glacial Boreal' },
      { label: 'Deuterium Yield', value: '+34,000 / Turn' },
      { label: 'Max Fields', value: '210 Fields' },
    ],
    tags: ['Colony Establishment', 'Alpha Site', 'Deuterium Mining'],
  },
  {
    id: 'hist-007',
    timestamp: '2026-09-12T08:00:00Z',
    stardate: 'SD-2026.09-A07',
    title: 'Mastery of Asgard Plasma Beam Directed Energy Weaponry',
    category: 'tech_breakthrough',
    significance: 'major',
    rulerName: 'SupremeThor_Asgard',
    rulerRole: 'Asgard High Council',
    coordinates: '[2:450:1]',
    description:
      'Asgard High Council shared plasma beam focusing tech with Taurus shipyards. Beam weapons penetrate shields directly with 100% energy transfer, neutralising enemy shield deflectors in battle.',
    impacts: [
      { label: 'Capital Firepower', value: '+200% Plasma Piercing' },
      { label: 'Shield Bypass', value: '40% Direct Hull Damage' },
      { label: 'Weapon Tech', value: 'Asgard Beam Level 15' },
    ],
    tags: ['Tech Breakthrough', 'Asgard Plasma', 'Shipyard Tech'],
  },
  {
    id: 'hist-008',
    timestamp: '2026-09-08T20:45:00Z',
    stardate: 'SD-2026.09-A08',
    title: 'Enactment of Imperial Decree: Scientific Golden Age',
    category: 'imperial_decree',
    significance: 'major',
    rulerName: 'Tollan_Curator_Narim',
    rulerRole: 'Curator Moderator',
    description:
      'Curator Support Directorate passed the Scientific Golden Age Edict. Laboratory research speed quadrupled across all planetary campuses, reducing research queue completion times.',
    impacts: [
      { label: 'Research Speed', value: '4.0x Acceleration' },
      { label: 'Lab Efficiency', value: '+100% Output' },
      { label: 'Cost Discount', value: '-25% Crystal Cost' },
    ],
    tags: ['Imperial Decree', 'Research Acceleration', 'Golden Age'],
  },
  {
    id: 'hist-009',
    timestamp: '2026-09-01T00:00:00Z',
    stardate: 'SD-2026.09-A09',
    title: 'Ascension Protocol & Cosmic Leaderboard Season Start',
    category: 'ascension_milestone',
    significance: 'epoch_defining',
    rulerName: 'SystemsRoot_Admin',
    rulerRole: 'Super Admin',
    description:
      'Universe Alpha-1 Season 2026 opened with 90 Galaxies and 1,000 Alliance Fleets. Ascension perks enabled, granting top-ranking commanders immortal glory multipliers upon completing planetary conquest goals.',
    impacts: [
      { label: 'Season League', value: 'Alpha-1 Sovereign Season' },
      { label: 'Rank Multiplier', value: '1.5x Glory Earnings' },
      { label: 'Ascension Status', value: 'Active Realm' },
    ],
    tags: ['Ascension Milestone', 'Season Reset', 'Glory League'],
  },
];

export const STORAGE_KEY_CUSTOM_HISTORY_EVENTS = 'uc_custom_empire_history_events';

export function getCustomHistoryEvents(): EmpireHistoryEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_HISTORY_EVENTS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function getAllEmpireHistoryEvents(): EmpireHistoryEvent[] {
  return [...getCustomHistoryEvents(), ...INITIAL_EMPIRE_HISTORY_EVENTS];
}

export function saveCustomHistoryEvent(event: EmpireHistoryEvent): void {
  if (typeof window === 'undefined') return;
  const current = getCustomHistoryEvents();
  const updated = [event, ...current.filter((e) => e.id !== event.id)];
  localStorage.setItem(STORAGE_KEY_CUSTOM_HISTORY_EVENTS, JSON.stringify(updated));
}

export function deleteCustomHistoryEvent(eventId: string): void {
  if (typeof window === 'undefined') return;
  const current = getCustomHistoryEvents();
  const updated = current.filter((e) => e.id !== eventId);
  localStorage.setItem(STORAGE_KEY_CUSTOM_HISTORY_EVENTS, JSON.stringify(updated));
}
