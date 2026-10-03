export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  division: string;
  avatar: string;
  bio: string;
  contributions: string[];
  favoriteShip?: string;
  socialBadge?: string;
}

export interface CreditCategory {
  id: string;
  categoryName: string;
  description: string;
  icon: string;
  members: TeamMember[];
}

export interface DevelopmentMilestone {
  version: string;
  date: string;
  codename: string;
  highlights: string[];
}

export const DEVELOPMENT_TEAM_CREDITS: CreditCategory[] = [
  {
    id: 'leadership',
    categoryName: 'Project Leadership & Lead Architecture',
    description: 'The visionary guiding the overall universe design, mathematical core, and interstellar systems.',
    icon: '👑',
    members: [
      {
        id: 'stephen',
        name: 'Stephen',
        role: 'Lead Architect & Game Director',
        title: 'Supreme Commander & Principal Systems Engineer',
        division: 'Core Leadership & Architecture',
        avatar: '🚀',
        bio: 'Visionary architect and lead creator of Universe Civilization: Empire at Wars. Conceptualized and engineered the full-stack real-time engine, 9-Government constitution framework, Stargate dialing matrix, and 90-class tactical armada roster.',
        contributions: [
          'Full-Stack Architecture & Engine Design',
          '9 Government Systems & Edict Mechanics',
          '30 Universes & 90 Galaxies Celestial Atlas',
          'Stargate Dialing & Subspace Jump Gate Physics',
          'Real-Time Turn Engine & AIC Industrial Pipeline',
          'Universe Civilization & Tactical Fleet Balance Models',
        ],
        favoriteShip: 'Ancient Aurora-Class Battleship / Prometheus Mk-III',
        socialBadge: 'Lead Developer · Creator',
      },
    ],
  },
  {
    id: 'systems',
    categoryName: 'Systems Engineering & Core Gameplay',
    description: 'The engineering specialists responsible for mathematical simulation, warfare mechanics, and algorithmic balance.',
    icon: '⚙️',
    members: [
      {
        id: 'systems-combat',
        name: 'Armada Combat Engineering Unit',
        role: 'Combat & Tactical Simulation',
        title: 'Weapons & Defense Algorithms',
        division: 'Military Systems Division',
        avatar: '⚔️',
        bio: 'Spearheaded the 90-class armada simulation, Rapid Fire mechanics, 6-Type Armor Resistance matrix, and modular ship fitting system.',
        contributions: [
          'Hull, Shield, and Armor Damage Distribution',
          'Nemesis Warlord System & Bounty Calculations',
          '1-999,999 Planetary Conquest Warfare Logic',
          'Iris Planetary Defense Shields & Interceptors',
        ],
        favoriteShip: 'Asgard O\'Neill-Class Battlecruiser',
      },
      {
        id: 'systems-econ',
        name: 'Interstellar Economics & Trade Core',
        role: 'Macro-Economy & Resource Simulation',
        title: 'Treasury & Industrial Algorithms',
        division: 'Economic Operations',
        avatar: '💎',
        bio: 'Designed the mathematical formulas for exponential mine extraction, Imperial Bank compound interest, AIC automated logistics, and dynamic daily activity rewards.',
        contributions: [
          'Dynamic Yield Scaling (Metal, Crystal, Deuterium, Naquadah)',
          'Imperial Bank Compound Vault Algorithms',
          'Storage Silo Compression & Overflow Safeguards',
          'Food, Water & Planetary Life Support Matrices',
        ],
        favoriteShip: 'Hephaestus Mega-Refinery Barge',
      },
      {
        id: 'systems-stargate',
        name: 'Ancient Stargate Relays Engineering',
        role: 'Subspace & FTL Network Engineering',
        title: 'Hyperdrive & Wormhole Logic',
        division: 'Cosmic Transit Division',
        avatar: '🌀',
        bio: 'Engineered the authentic 7-chevron, 8-chevron, and 9-chevron Stargate dialing algorithms, Ori Supergate segment logic, and FTL Slipstream drives.',
        contributions: [
          '28 Ancient Glyph Dialing Interface',
          'DHD Master Crystal Harmonic Boosts',
          'Zero-Fuel Subspace Jump Gate Relays',
          'Slipstream & Tachyon FTL Mechanics',
        ],
        favoriteShip: 'Ancient Destiny Exploration Vessel',
      },
    ],
  },
  {
    id: 'art-ui',
    categoryName: 'Design, UI/UX & Tactical Terminal',
    description: 'Crafting the clean, high-density sci-fi aesthetic, monochromatic typography, and responsive tactical dashboards.',
    icon: '🎨',
    members: [
      {
        id: 'tactical-ui',
        name: 'Command Terminal Design Guild',
        role: 'Lead UI/UX & Aesthetic Direction',
        title: 'Interface Ergonomics & Sci-Fi Visuals',
        division: 'Tactical Interface Bureau',
        avatar: '🖥️',
        bio: 'Forged the utilitarian, high-contrast command terminal interface inspired by authentic military displays, telemetry monitors, and classic 4X space interfaces.',
        contributions: [
          'High-Density Monochromatic Tactical Dashboards',
          'Real-Time Resource Multi-Bar & Telemetry Tooltips',
          'Interactive Star Charts & Procedural Galaxy Maps',
          'Mobile-Responsive Commander Navigation Hub',
        ],
        favoriteShip: 'Tollan Ion Cannon Dreadnought',
      },
      {
        id: 'audio-fx',
        name: 'Subspace Audio & Sound Synthesizer',
        role: 'Acoustic & Sound Effects Engineering',
        title: 'Audio Synthesizer Lead',
        division: 'Acoustics Lab',
        avatar: '🔊',
        bio: 'Constructed the custom zero-dependency Web Audio API synthesizer generating tactile UI click pulses, wormhole kawoosh tones, and combat warning klaxons.',
        contributions: [
          'Dynamic Procedural Audio Synthesis via Web Audio API',
          'Stargate Dialing & Kawoosh Resonance Effects',
          'Armada Plasma & Gauss Cannon Blast Syntheses',
          'Warning Chimes & Confirmation Sound Design',
        ],
        favoriteShip: 'Goa\'uld Ha\'tak Mothership',
      },
    ],
  },
  {
    id: 'lore-narrative',
    categoryName: 'Lore, Story Campaigns & Worldbuilding',
    description: 'Weaving epic narrative arcs, Stargate canon integration, alien dossiers, and tactical codex archives.',
    icon: '📜',
    members: [
      {
        id: 'lore-master',
        name: 'Stargate Archives & Galactic Historians',
        role: 'Lead Lore & Narrative Designer',
        title: 'Grand Chronicler of the 90 Galaxies',
        division: 'Imperial Lore Bureau',
        avatar: '🌌',
        bio: 'Curated the deep narrative campaigns, 27 alien civilization dossiers, System Lord profiles, and rich historical logs across the Milky Way, Pegasus, and Ida galaxies.',
        contributions: [
          '27 Canonical Stargate Alien Races Dossiers',
          'Epic Galactic Campaign Missions & Directives',
          'Commander 72 Talent Lore & Backstories',
          'In-Game Strategy Codex & Grand Documentation',
        ],
        favoriteShip: 'Replicator Spider-Core Hive Ship',
      },
    ],
  },
  {
    id: 'qa-community',
    categoryName: 'Quality Assurance, Testing & Vanguard Fleet',
    description: 'The tireless commanders who stress-test combat simulations, verify database integrity, and hone balance.',
    icon: '🛡️',
    members: [
      {
        id: 'qa-vanguard',
        name: 'Imperial Vanguard Testing Fleet',
        role: 'Lead Testing & Balance Verification',
        title: 'Elite Quality Assurance Squadron',
        division: 'Flight Test Wing',
        avatar: '🎯',
        bio: 'Conducted rigorous automated tests, balance passes, edge-case validations, and end-to-end simulation audits across 88+ features.',
        contributions: [
          '88-Point Automated Test Suite Verification',
          'Exploit & Duplication Safeguard Audits',
          'Fleet Upkeep & Mathematical Sanity Checks',
          'Multi-Account Profile Synchronization Testing',
        ],
        favoriteShip: 'Tau\'ri Daedalus-Class Battlecruiser',
      },
    ],
  },
];

export const SPECIAL_INSPIRATIONS_THANKS = [
  {
    title: 'OGame & Universe Civilization Genesis',
    description: 'Pioneering the timeless browser space MMO genre, planetary colony management, debris fields, and fleet coordination.',
  },
  {
    title: 'Stargate SG-1, Atlantis & Universe (MGM / Brad Wright & Robert C. Cooper)',
    description: 'For creating one of the most brilliant and enduring sci-fi universes, legendary gate networks, and awe-inspiring Ancient technology.',
  },
  {
    title: 'EVE Online (CCP Games)',
    description: 'For inspiring deep industrial blueprint manufacturing (ME/TE), high-stakes mineral economics, and modular fitting systems.',
  },
  {
    title: 'No Man\'s Sky (Hello Games)',
    description: 'For the romantic spirit of endless procedural star system exploration, planetary hazard survival, and cosmic wonder.',
  },
  {
    title: 'Our Dedicated Galactic Player Community',
    description: 'To every commander who has dialed a gate, colonized a barren rock, defended their homeworld, and built an empire among the stars.',
  },
];

export const DEVELOPMENT_TECH_STACK = [
  { tech: 'React 19 & TypeScript', detail: 'Strict typed component architecture & high performance rendering' },
  { tech: 'Vite & ESBuild', detail: 'Lightning-fast compilation, HMR and bundling' },
  { tech: 'Tailwind CSS', detail: 'Utility-first tactical monochromatic layout engine' },
  { tech: 'Web Audio API', detail: 'Zero-latency procedural sound synthesizer for UI & combat feedback' },
  { tech: 'Firebase Firestore & Auth', detail: 'Persistent cloud state synchronization & seamless Google SSO' },
  { tech: 'Lucide Icons', detail: 'Crisp, high-density vector iconography for tactical interfaces' },
];

export const DEVELOPMENT_HISTORY_LOG: DevelopmentMilestone[] = [
  {
    version: 'v2.5.0 (Latest)',
    date: 'September 2026',
    codename: 'Galactic Sovereign',
    highlights: [
      '9 Canonical Government Systems & Executive Edicts Engine',
      'Daily Directives & Scaled Dynamic Activity Points Matrix',
      'Automated Industry Complex (AIC) & Logistics Chain',
      'Development Team Credits & Creator Accolades Hub',
    ],
  },
  {
    version: 'v2.4.0',
    date: 'August 2026',
    codename: 'Ancient Ascendancy',
    highlights: [
      '27 Stargate NPC Civilizations & Alien Boss Raids',
      'Subspace Jump Gate Relay Network & Zero-Fuel Transits',
      '72 Commanders Gacha System & High Officer Synergies',
      '6-Type Armor Resistance & Modular Ship Fitting Lab',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'June 2026',
    codename: 'Universal Expansion',
    highlights: [
      '30 Universes & 90 Galaxies Exploration Map',
      '90-Class Military Unit Roster spanning 5 strategic tiers',
      'EVE-style Blueprint Manufacturing (ME & TE Optimization)',
      'Dyson Megastructures & Stellar Orbital Phalanxes',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'January 2026',
    codename: 'First Chevron Locked',
    highlights: [
      'Core Universe Civilization browser strategy loop & resource harvesting',
      'Authentic Stargate 7-chevron coordinate dialing',
      '5 Playable races: Tau\'ri, Asgard, Goa\'uld, Replicator, Tollan',
      'Tactical combat resolver & Imperial Bank vault',
    ],
  },
];
