/**
 * Stargate Canonical NPC Races Database
 * Comprehensive dossiers, combat statistics, technological tiers, and diplomatic profiles
 * for 18 authentic alien civilizations from Stargate SG-1, Atlantis, and Universe.
 */

import { StargateNpcRace, TargetRealm } from './types';

export const STARGATE_NPC_RACES: StargateNpcRace[] = [
  // 1. THE ORI & PRIORS
  {
    id: 'npc_ori_priors',
    name: 'The Ori & Priors',
    designationOrTitle: 'Ascended Zealots of Origin',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Ori Galaxy',
    homeworld: 'Celestis (Plains of Celestis)',
    stargateAddress: 'ᚠ-ᚱ-ᛟ-ᛏ-ᛖ-ᛈ-ᛉ-ᛊ-ᛋ (Supergate Dial)',
    classification: 'Higher Energy / Ascended',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'The Doci / Orici Adria',
    flagshipClass: 'Ori Crusader Warship (Primary Golden Pulse Beam)',
    fleetStrength: 850000,
    tacticalTraits: [
      'Devastating Spinal Energy Weapon (One-Shot Kills on Ha\'tak)',
      'Impenetrable Trans-Dimensional Energy Shields',
      'Prior Staff Telekinesis & Biological Pathogen Propagation',
      'Supergate Cosmic Ingress Network',
    ],
    loreDescription:
      'Ascended beings who sap the worship energy of mortal civilizations across the Ori Galaxy. Led through the Milky Way by the Priors and the Orici Adria, their golden-curved armada wields near-godlike destructive power.',
    firstAppearanceEpisode: 'SG-1 S09E01 "Avalon" & S09E02 "Origin"',
    combatStats: {
      attackBonusPercent: 85,
      shieldHarmonicsPercent: 95,
      sensorStealthPercent: 40,
      technologicalTier: 10,
    },
    resourceLoot: {
      naquadah: 950000,
      metalOrTrinium: 650000,
      crystal: 500000,
      deuterium: 400000,
    },
    avatarEmoji: '✨',
    sigilColor: '#f59e0b',
  },

  // 2. THE WRAITH
  {
    id: 'npc_wraith_hive',
    name: 'The Wraith',
    designationOrTitle: 'Predatory Hive Swarm of Pegasus',
    canonicalSeries: 'Stargate Atlantis',
    galaxy: 'Pegasus',
    homeworld: 'Unknown Hive Nursery Planet',
    stargateAddress: 'ᛈ-ᛖ-ᚷ-ᚨ-ᛋ-ᚢ-ᛋ-ᛉ',
    classification: 'Organic Humanoid',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Todd the Wraith / Hive Queen Death',
    flagshipClass: 'Wraith Super-Hive Dreadnought (Bio-Organic Armor)',
    fleetStrength: 680000,
    tacticalTraits: [
      'Bio-Organic Hull Self-Regeneration without Shields',
      'Subspace Telepathic Hive Mind Coordination',
      'Dart Culling Beams with Digital Transporter Buffer Storage',
      'Energy Disruption Projectiles & Heavy Plasma Volleys',
    ],
    loreDescription:
      'A carnivorous, semi-telepathic species that evolved from the Iratus bug feeding on human ancestors. Dominating the Pegasus Galaxy for 10,000 years, they periodically awaken from hibernation cycles to cull populated worlds for life-force nourishment.',
    firstAppearanceEpisode: 'SGA S01E01 "Rising"',
    combatStats: {
      attackBonusPercent: 70,
      shieldHarmonicsPercent: 30,
      sensorStealthPercent: 55,
      technologicalTier: 8,
    },
    resourceLoot: {
      naquadah: 520000,
      metalOrTrinium: 480000,
      crystal: 380000,
      deuterium: 310000,
    },
    avatarEmoji: '🧬',
    sigilColor: '#10b981',
  },

  // 3. THE ASURANS (PEGASUS REPLICATORS)
  {
    id: 'npc_asuran_replicators',
    name: 'The Asurans',
    designationOrTitle: 'Lantean Nanite Collective',
    canonicalSeries: 'Stargate Atlantis',
    galaxy: 'Pegasus',
    homeworld: 'Asuras',
    stargateAddress: 'ᚨ-ᛋ-ᚢ-ᚱ-ᚨ-ᛋ-ᛏ-ᚱ',
    classification: 'Synthetic / Nanite',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Oberoth / Niam (Subversive Faction)',
    flagshipClass: 'Asuran Aurora-Class Warship with Drone Arsenal',
    fleetStrength: 750000,
    tacticalTraits: [
      'Microscopic Nanite Reconstitution & Subspace Collective Mind',
      'Ancient Drone Weapons with Target-Tracking Agility',
      'ZPM-Powered Overcharged Stargate Energy Cannons',
      'Subspace Satellite Weapons Arrays',
    ],
    loreDescription:
      'Created by the Ancients during the Wraith War as a microscopic weapon made of nanites. Evolving into human form, they built sprawling cities mimicking Atlantis on their homeworld Asuras before rejecting their creators\' aggression-override code.',
    firstAppearanceEpisode: 'SGA S03E05 "Progeny"',
    combatStats: {
      attackBonusPercent: 80,
      shieldHarmonicsPercent: 88,
      sensorStealthPercent: 60,
      technologicalTier: 9,
    },
    resourceLoot: {
      naquadah: 750000,
      metalOrTrinium: 600000,
      crystal: 700000,
      deuterium: 350000,
    },
    avatarEmoji: '🤖',
    sigilColor: '#06b6d4',
  },

  // 4. THE ANCIENTS (LANTEANS / ALTERANS)
  {
    id: 'npc_ancients_lanteans',
    name: 'The Ancients (Lanteans)',
    designationOrTitle: 'The Builders of the Gate Network',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Dakara / P3X-984 / Atlantis',
    stargateAddress: 'ᛞ-ᚨ-ᚲ-ᚨ-ᚱ-ᚨ-ᛈ-ᛏ-ᛉ',
    classification: 'Higher Energy / Ascended',
    threatLevel: 'Harmless / Pacifist',
    diplomaticStatus: 'Ascended / Beyond Contact',
    factionLeader: 'High Councilor Moros / Janus / Oma Desala',
    flagshipClass: 'City-Ship Atlantis / Destiny / Aurora-Class',
    fleetStrength: 990000,
    tacticalTraits: [
      'Sub-atomic Zero Point Energy Harnessing (ZPMs)',
      'Drone Weapon Swarms that Penetrate Any Conventional Shield',
      'Super-luminal Stargate & Supergate Bridge Networks',
      'Cloaking Phase-Shifting Dimensional Tech',
    ],
    loreDescription:
      'The Alterans who migrated from their distant home galaxy millions of years ago, seeded human life across the Milky Way and Pegasus, invented the Stargate system, and ultimately ascended to higher planes of existence.',
    firstAppearanceEpisode: 'SG-1 S01E10 "The Torment of Tantalus"',
    combatStats: {
      attackBonusPercent: 95,
      shieldHarmonicsPercent: 98,
      sensorStealthPercent: 90,
      technologicalTier: 10,
    },
    resourceLoot: {
      naquadah: 1200000,
      metalOrTrinium: 900000,
      crystal: 1500000,
      deuterium: 800000,
    },
    avatarEmoji: '🏛️',
    sigilColor: '#3b82f6',
  },

  // 5. THE NOX
  {
    id: 'npc_the_nox',
    name: 'The Nox',
    designationOrTitle: 'The Enigmatic Pacifists',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Gaia (P3X-774)',
    stargateAddress: 'ᚷ-ᚨ-ᛁ-ᚨ-ᛈ-ᛏ-ᛉ',
    classification: 'Organic Humanoid',
    threatLevel: 'Harmless / Pacifist',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Ohper / Lya / Nafrayu',
    flagshipClass: 'Cloaked Floating Spire Citadel',
    fleetStrength: 450000,
    tacticalTraits: [
      'Total Planetary & Orbital Cloaking (Imperceptible to Sensors)',
      'Biological Resurrection ("Ritual of Life")',
      'Zero-Delay Phase Invisibility for Armed Fleets',
      'Absolute Pacifism Doctrine (Never Fires Weapons)',
    ],
    loreDescription:
      'One of the legendary Four Great Races. Despite appearing as primitive, fairy-like forest dwellers living in harmony with nature, they possess cloaked floating sky-cities with technology so advanced they consider humans mere children.',
    firstAppearanceEpisode: 'SG-1 S01E08 "The Nox"',
    combatStats: {
      attackBonusPercent: 10,
      shieldHarmonicsPercent: 99,
      sensorStealthPercent: 100,
      technologicalTier: 9,
    },
    resourceLoot: {
      naquadah: 300000,
      metalOrTrinium: 400000,
      crystal: 650000,
      deuterium: 200000,
    },
    avatarEmoji: '🌿',
    sigilColor: '#84cc16',
  },

  // 6. THE FURLINGS
  {
    id: 'npc_furlings',
    name: 'The Furlings',
    designationOrTitle: 'The Enigmatic Architects',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Utopian Sanctuary (P5X-777)',
    stargateAddress: 'ᚠ-ᚢ-ᚱ-ᛚ-ᛁ-ᛜ-ᛈ',
    classification: 'Organic Humanoid',
    threatLevel: 'Harmless / Pacifist',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Archon of the Great Alliance',
    flagshipClass: 'Quantum Archway Megastructure / Colony Transport',
    fleetStrength: 520000,
    tacticalTraits: [
      'Sub-molecular Teleportation Arches',
      'Bio-Synthetic Botanical Megastructures',
      'Quantum Pacification Fields',
      'Ancient Furling Writing & Tri-Planar Locking Devices',
    ],
    loreDescription:
      'The mysterious fourth member of the Great Alliance alongside the Ancients, Asgard, and Nox. Known for creating paradise sanctuaries on worlds like P5X-777 where all weapons and modern tech were stripped at the gateway.',
    firstAppearanceEpisode: 'SG-1 S02E15 "The Fifth Race" (Mentioned) & S06E15 "Paradise Lost"',
    combatStats: {
      attackBonusPercent: 40,
      shieldHarmonicsPercent: 90,
      sensorStealthPercent: 85,
      technologicalTier: 9,
    },
    resourceLoot: {
      naquadah: 450000,
      metalOrTrinium: 500000,
      crystal: 800000,
      deuterium: 300000,
    },
    avatarEmoji: '🐾',
    sigilColor: '#a855f7',
  },

  // 7. THE FREE JAFFA NATION
  {
    id: 'npc_free_jaffa',
    name: 'Free Jaffa Nation',
    designationOrTitle: 'Liberated Warriors of Dakara',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Dakara / Chulak',
    stargateAddress: 'ᚲ-ᚺ-ᚢ-ᛚ-ᚨ-ᚲ-ᛈ',
    classification: 'Organic Humanoid',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Alliance Partner',
    factionLeader: 'High Council Leader Teal\'c & Master Bra\'tac',
    flagshipClass: 'Jaffa Heavy Ha\'tak Battleship (Staff Turret Array)',
    fleetStrength: 420000,
    tacticalTraits: [
      'Ma\'Tok Staff Weapon Mastery & Ground Shock Units',
      'Tretonin Medical Independence (No Symbiotes Required)',
      'Subspace Ha\'tak Swarm Tactics & Al\'kesh Strafing Runs',
      'Intense Honor Code & Defiance of False Gods',
    ],
    loreDescription:
      'Formerly genetically-modified slave warriors serving as incubators for larval Goa\'uld symbiotes. Following the liberation of Dakara, they unified under the Free Jaffa High Council into a formidable military democracy.',
    firstAppearanceEpisode: 'SG-1 S01E01 "Children of the Gods" (Rebellion in S08)',
    combatStats: {
      attackBonusPercent: 55,
      shieldHarmonicsPercent: 50,
      sensorStealthPercent: 35,
      technologicalTier: 6,
    },
    resourceLoot: {
      naquadah: 620000,
      metalOrTrinium: 550000,
      crystal: 200000,
      deuterium: 240000,
    },
    avatarEmoji: '🛡️',
    sigilColor: '#eab308',
  },

  // 8. THE TOK'RA RESISTANCE
  {
    id: 'npc_tokra_resistance',
    name: 'The Tok\'ra Resistance',
    designationOrTitle: 'Underground Symbiote Insurgency',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Mobile Tunneler Bases (Vorash / Revanna)',
    stargateAddress: 'ᚹ-ᛟ-ᚱ-ᚨ-ᛋ-ᚺ-ᛈ',
    classification: 'Parasitic Symbiote',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Alliance Partner',
    factionLeader: 'Garshaw of Belote / Jacob Carter (Selmak)',
    flagshipClass: 'Tel\'tak Stealth Scout Vessel with Sensor Cloak',
    fleetStrength: 290000,
    tacticalTraits: [
      'Subterranean Crystal Tunneling Synthesis',
      'Infiltration of High System Lord Hierarchies',
      'Symbiote Poison Chemical Countermeasures',
      'Advanced Memory Recall Holographic Tech',
    ],
    loreDescription:
      'Goa\'uld who spawned from Queen Egeria, rejecting the megalomania and slavery of the System Lords. Living in true voluntary symbiosis with their human hosts, they operate deep undercover through hidden planetary tunnels.',
    firstAppearanceEpisode: 'SG-1 S02E11 "The Tok\'ra"',
    combatStats: {
      attackBonusPercent: 45,
      shieldHarmonicsPercent: 60,
      sensorStealthPercent: 95,
      technologicalTier: 7,
    },
    resourceLoot: {
      naquadah: 380000,
      metalOrTrinium: 320000,
      crystal: 480000,
      deuterium: 180000,
    },
    avatarEmoji: '💎',
    sigilColor: '#0ea5e9',
  },

  // 9. KULL WARRIORS (ANUBIS LEGIONS)
  {
    id: 'npc_kull_warriors',
    name: 'Kull Warriors (Anubis Legions)',
    designationOrTitle: 'Bio-Engineered Super-Infantry',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Tartarus',
    stargateAddress: 'ᛏ-ᚨ-ᚱ-ᛏ-ᚨ-ᚱ-ᚢ-ᛋ',
    classification: 'Bio-Mechanical',
    threatLevel: 'High / Aggressive',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Anubis (Half-Ascended System Lord)',
    flagshipClass: 'Anubis Super-Mothership (Shielded Core Weapon)',
    fleetStrength: 580000,
    tacticalTraits: [
      'Energy-Absorbing Woven Carapace (Impervious to bullets & staff fire)',
      'Wrist-Mounted Rapid-Pulse Plasma Blasters',
      'Mindless Symbiote Blank-Slate Neural Loyalty',
      'Accelerated Bio-Engineering Vat Assembly',
    ],
    loreDescription:
      'Engineered by Anubis using an Ancient healing device and Goa\'uld cloning tanks. Possessing no mind of their own and impervious to nearly all kinetic and energy weapons, they represented the unstoppable shock infantry of Anubis.',
    firstAppearanceEpisode: 'SG-1 S07E11 "Evolution"',
    combatStats: {
      attackBonusPercent: 75,
      shieldHarmonicsPercent: 70,
      sensorStealthPercent: 20,
      technologicalTier: 7,
    },
    resourceLoot: {
      naquadah: 500000,
      metalOrTrinium: 450000,
      crystal: 250000,
      deuterium: 200000,
    },
    avatarEmoji: '🥷',
    sigilColor: '#ef4444',
  },

  // 10. THE LUCIAN ALLIANCE
  {
    id: 'npc_lucian_alliance',
    name: 'The Lucian Alliance',
    designationOrTitle: 'Galactic Organized Crime Syndicate',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Unknown Syndicated Stronghold',
    stargateAddress: 'ᛚ-ᚢ-ᚲ-ᛁ-ᚨ-ᚾ-ᛈ',
    classification: 'Organic Humanoid',
    threatLevel: 'High / Aggressive',
    diplomaticStatus: 'Rogue / Marauder',
    factionLeader: 'Netan / Commander Kiva / Varro',
    flagshipClass: 'Heavy Retrofitted Ha\'tak with Overcharged Cannons',
    fleetStrength: 490000,
    tacticalTraits: [
      'Kassa Drug Distribution & Black Market Smuggling',
      'Guerrilla Space Boarding & Subspace Ambush Traps',
      'Aggressive Retrofitted Goa\'uld Ha\'tak Armadas',
      'Mercenary Infiltration of Distant Gate Operations',
    ],
    loreDescription:
      'A coalition of human smugglers, bounty hunters, and warlords who seized the vast fleets and infrastructure abandoned by the fallen Goa\'uld System Lords. Ruthless, profit-driven, and ambitious enough to assault Earth and Destiny.',
    firstAppearanceEpisode: 'SG-1 S08E12 "Prometheus Unbound" & S09E03 "The Ties That Bind"',
    combatStats: {
      attackBonusPercent: 60,
      shieldHarmonicsPercent: 55,
      sensorStealthPercent: 50,
      technologicalTier: 6,
    },
    resourceLoot: {
      naquadah: 720000,
      metalOrTrinium: 500000,
      crystal: 300000,
      deuterium: 350000,
    },
    avatarEmoji: '🏴‍☠️',
    sigilColor: '#f97316',
  },

  // 11. THE ASCHEN CONFEDERATION
  {
    id: 'npc_aschen_confederation',
    name: 'The Aschen Confederation',
    designationOrTitle: 'The Cold Sterilizers',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'P4C-970 / Aschen Prime',
    stargateAddress: 'ᛈ-ᚠ-ᚲ-ᛉ-ᛏ-ᛖ-ᛊ',
    classification: 'Organic Humanoid',
    threatLevel: 'High / Aggressive',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Ambassador Keel / Mollem',
    flagshipClass: 'Aschen Bio-Harvester Combine Ship',
    fleetStrength: 390000,
    tacticalTraits: [
      'Subversive Anti-Aging Vaccines (Hidden 90% Sterility Vector)',
      'Jupiter-Ignition Fusion Weapon Systems',
      'Automated Agricultural Harvester Beams',
      'Deceptive Diplomatic Non-Aggression Treaties',
    ],
    loreDescription:
      'A technologically advanced, emotionless human civilization that expands not through war, but through medical diplomacy. They gift miraculous anti-aging cures that covertly sterilize 90% of the recipient planet over generations.',
    firstAppearanceEpisode: 'SG-1 S04E16 "2010" & S05E10 "2001"',
    combatStats: {
      attackBonusPercent: 50,
      shieldHarmonicsPercent: 65,
      sensorStealthPercent: 70,
      technologicalTier: 7,
    },
    resourceLoot: {
      naquadah: 410000,
      metalOrTrinium: 430000,
      crystal: 390000,
      deuterium: 280000,
    },
    avatarEmoji: '💉',
    sigilColor: '#64748b',
  },

  // 12. THE SERRAKIN & HEBRIDIAN COALITION
  {
    id: 'npc_serrakin_hebridan',
    name: 'Serrakin & Hebridian Coalition',
    designationOrTitle: 'The High-Tech Tech-Corp Society',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Hebridan (P4X-131)',
    stargateAddress: 'ᚺ-ᛖ-ᛒ-ᚱ-ᛁ-ᛞ-ᛈ',
    classification: 'Amphibious / Reptilian',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Alliance Partner',
    factionLeader: 'Eamon Finn / Corporate Director Hagan',
    flagshipClass: 'Tech-Corp Ion-Drive Superluminal Cruiser',
    fleetStrength: 360000,
    tacticalTraits: [
      'Advanced Ion Propulsion & Loop of Kon Garat Racer Tech',
      'Integrated Human-Serrakin Egalitarian Military',
      'Corridor Pulse Cannons & Dense Particle Deflectors',
      'Commercial Media Broadcast Fleet Synchronization',
    ],
    loreDescription:
      'A reptilian humanoid race that liberated the human ancestors of Hebridan from the Goa\'uld System Lord Moloc. Together they formed a prosperous, highly commercialized society governed by technology conglomerates like Tech-Corp.',
    firstAppearanceEpisode: 'SG-1 S06E18 "Forsaken" & S07E08 "Space Race"',
    combatStats: {
      attackBonusPercent: 55,
      shieldHarmonicsPercent: 60,
      sensorStealthPercent: 40,
      technologicalTier: 7,
    },
    resourceLoot: {
      naquadah: 390000,
      metalOrTrinium: 480000,
      crystal: 340000,
      deuterium: 410000,
    },
    avatarEmoji: '🦎',
    sigilColor: '#14b8a6',
  },

  // 13. NAK'AI (BLUE ALIENS)
  {
    id: 'npc_nakai_blue_aliens',
    name: 'The Nak\'ai (Blue Aliens)',
    designationOrTitle: 'Deep Space Boarders of Destiny',
    canonicalSeries: 'Stargate Universe',
    galaxy: 'Destiny Cosmic Void',
    homeworld: 'Unknown Deep Space Sector',
    stargateAddress: 'ᛞ-ᛖ-ᛋ-ᛏ-ᛁ-ᚾ-ᛁ-ᛋ',
    classification: 'Amphibious / Reptilian',
    threatLevel: 'High / Aggressive',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Nak\'ai Brood Commander',
    flagshipClass: 'Nak\'ai Sub-light Command Carrier',
    fleetStrength: 440000,
    tacticalTraits: [
      'Hull-Cutting Boarding Pods & Telepathic Neural Probes',
      'Living Bio-Mechanical Fighters with Plasma Spitters',
      'Hyperspace Interception & Destiny Tracking Subroutines',
      'Fluid Immersion Sleep Tanks & Mind-Sifting Chairs',
    ],
    loreDescription:
      'An intelligent aquatic/amphibious species encountered billions of light-years from Earth by the Ancient vessel Destiny. Ruthlessly seeking to master the Ancient ship, they captured Chloe Armstrong and Colonel Young using mind-probes.',
    firstAppearanceEpisode: 'SGU S01E11 "Space"',
    combatStats: {
      attackBonusPercent: 65,
      shieldHarmonicsPercent: 50,
      sensorStealthPercent: 65,
      technologicalTier: 7,
    },
    resourceLoot: {
      naquadah: 340000,
      metalOrTrinium: 380000,
      crystal: 420000,
      deuterium: 490000,
    },
    avatarEmoji: '👽',
    sigilColor: '#2563eb',
  },

  // 14. THE URSINI
  {
    id: 'npc_ursini_nomads',
    name: 'The Ursini',
    designationOrTitle: 'The Desperate Survivors',
    canonicalSeries: 'Stargate Universe',
    galaxy: 'Destiny Cosmic Void',
    homeworld: 'Ursini Home Galaxy (Destroyed by Drones)',
    stargateAddress: 'ᚢ-ᚱ-ᛋ-ᛁ-ᚾ-ᛁ-ᛈ',
    classification: 'Organic Humanoid',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Ursini Colony Fleet Elder',
    flagshipClass: 'Ursini Derelict Seed Colony Ark',
    fleetStrength: 280000,
    tacticalTraits: [
      'Stasis Sub-crypt Longevity Preservation',
      'Sacrificial Kamikaze Ramming Maneuvers',
      'Overclocked FTL Sub-space Engines',
      'Manual Remote Override of Ancient Bridge Systems',
    ],
    loreDescription:
      'A bipedal mammalian species locked in an existential war with automated Berserker Drones. In their desperate attempt to save their colony, they boarded an Ancient seed ship and sacrificed their lives to save Destiny\'s crew.',
    firstAppearanceEpisode: 'SGU S02E03 "Awakening" & S02E10 "Resurgence"',
    combatStats: {
      attackBonusPercent: 45,
      shieldHarmonicsPercent: 40,
      sensorStealthPercent: 45,
      technologicalTier: 6,
    },
    resourceLoot: {
      naquadah: 210000,
      metalOrTrinium: 280000,
      crystal: 260000,
      deuterium: 390000,
    },
    avatarEmoji: '🐻',
    sigilColor: '#78716c',
  },

  // 15. AUTOMATED BERSERKER DRONE SWARM
  {
    id: 'npc_berserker_drones',
    name: 'Automated Berserker Drones',
    designationOrTitle: 'Self-Replicating Extermination Machines',
    canonicalSeries: 'Stargate Universe',
    galaxy: 'Destiny Cosmic Void',
    homeworld: 'Extinct Creator Civilization World',
    stargateAddress: 'ᛞ-ᚱ-ᛟ-ᚾ-ᛖ-ᛋ-ᛉ',
    classification: 'Synthetic / Nanite',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Central Autonomous Swarm Node',
    flagshipClass: 'Drone Command Carrier (Hundreds of Attack Sub-Drones)',
    fleetStrength: 820000,
    tacticalTraits: [
      'Complete Absence of Organic Life or Moral Inhibition',
      'Energy Signature Homing Sensors (Attracted to FTL Drops)',
      'Continuous Kinetic-Plasma Bombardment from Swarms',
      'Planetary & Stargate Denial Blockade Protocols',
    ],
    loreDescription:
      'Autonomous war machines created thousands of years ago in a forgotten galaxy. Their creators long dead, their programming degrades into an infinite loop: detect any artificial energy signatures and eradicate them from existence.',
    firstAppearanceEpisode: 'SGU S02E10 "Resurgence" & S02E11 "Deliverance"',
    combatStats: {
      attackBonusPercent: 82,
      shieldHarmonicsPercent: 65,
      sensorStealthPercent: 30,
      technologicalTier: 8,
    },
    resourceLoot: {
      naquadah: 680000,
      metalOrTrinium: 850000,
      crystal: 540000,
      deuterium: 500000,
    },
    avatarEmoji: '🛸',
    sigilColor: '#dc2626',
  },

  // 16. THE GADMEER
  {
    id: 'npc_the_gadmeer',
    name: 'The Gadmeer',
    designationOrTitle: 'Sulfur-Based Planetary Terrabuilders',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Extinct Origin Planet / New Gadmeer World',
    stargateAddress: 'ᚷ-ᚨ-ᛞ-ᛗ-ᛖ-ᛖ-ᚱ',
    classification: 'Amphibious / Reptilian',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Gadmeer Bio-Archive Core AI (Lotan)',
    flagshipClass: 'Two-Mile Long Sulfur-Terraforming Vessel',
    fleetStrength: 350000,
    tacticalTraits: [
      'Continental-Scale Atmospheric Conversion Beams',
      'Millions of Digitized Species DNA & Cultural Records',
      'Automated Nanotech Synthesizer Pods',
      'Massive Kinetic Repulsor Shields',
    ],
    loreDescription:
      'An ancient, sulfur-based reptilian/avian civilization destroyed by unknown invaders. Rather than fight, they built a massive automated colony ship containing millions of frozen genetic samples, reprogrammed to terraform a new home world.',
    firstAppearanceEpisode: 'SG-1 S04E09 "Scorched Earth"',
    combatStats: {
      attackBonusPercent: 40,
      shieldHarmonicsPercent: 80,
      sensorStealthPercent: 35,
      technologicalTier: 8,
    },
    resourceLoot: {
      naquadah: 460000,
      metalOrTrinium: 580000,
      crystal: 610000,
      deuterium: 340000,
    },
    avatarEmoji: '🌋',
    sigilColor: '#d97706',
  },

  // 17. SALISH SPIRITS (T'AKAYA & XE'LS)
  {
    id: 'npc_salish_spirits',
    name: 'The Spirits (T\'akaya & Xe\'ls)',
    designationOrTitle: 'Shape-Shifting Guardians of PXY-887',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'PXY-887',
    stargateAddress: 'ᛈ-ᛉ-ᛁ-ᛏ-ᛖ-ᛊ-ᛉ',
    classification: 'Higher Energy / Ascended',
    threatLevel: 'Harmless / Pacifist',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Xe\'ls (Raven Form) & T\'akaya (Wolf Form)',
    flagshipClass: 'Trans-Dimensional Energy Web Spire',
    fleetStrength: 480000,
    tacticalTraits: [
      'Spontaneous Vanishing & Material Dematerialization',
      'Protective Trinium Geological Resonance',
      'Illusionary Animal Morphing & Telepathic Camouflage',
      'Absolute Defense of Indigenous Peoples',
    ],
    loreDescription:
      'Trans-dimensional shapeshifting beings who drove the Goa\'uld away from PXY-887 thousands of years ago. Taking the forms of sacred animals from Salish mythology, they live in symbiotic peace with the transplanted humans.',
    firstAppearanceEpisode: 'SG-1 S02E07 "Spirits"',
    combatStats: {
      attackBonusPercent: 50,
      shieldHarmonicsPercent: 95,
      sensorStealthPercent: 95,
      technologicalTier: 9,
    },
    resourceLoot: {
      naquadah: 280000,
      metalOrTrinium: 950000, // Massive Trinium!
      crystal: 520000,
      deuterium: 150000,
    },
    avatarEmoji: '🐺',
    sigilColor: '#10b981',
  },

  // 18. THE UNAS
  {
    id: 'npc_the_unas',
    name: 'The Unas of P3X-888',
    designationOrTitle: 'The Primordial First Hosts',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'P3X-888 (Goa\'uld Evolutionary Cradle)',
    stargateAddress: 'ᛈ-ᛏ-ᚺ-ᚱ-ᛖ-ᛖ-ᛉ',
    classification: 'Organic Humanoid',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Chaka / Iron Shirt',
    flagshipClass: 'None (Subterranean Naquadah Mining Fortress)',
    fleetStrength: 240000,
    tacticalTraits: [
      'Immense Muscular Strength & Regenerative Green Blood',
      'Thick Armored Reptilian Hide Resisting Kinetic Damage',
      'Instinctive Immunity to Wild Symbiote Infiltration',
      'Ritual War Chants & Naquadah Mine Defense Tactics',
    ],
    loreDescription:
      'The original, primordial reptilian species that served as the first hosts to the Goa\'uld in the swamps of P3X-888. Highly traditional and honorable, un-enslaved Unas clans like Chaka\'s can forge enduring pacts of mutual respect.',
    firstAppearanceEpisode: 'SG-1 S01E09 "Thor\'s Hammer", S04E08 "The First Ones" & S07E07 "Enemy Mine"',
    combatStats: {
      attackBonusPercent: 50,
      shieldHarmonicsPercent: 35,
      sensorStealthPercent: 60,
      technologicalTier: 4,
    },
    resourceLoot: {
      naquadah: 800000, // Rich Naquadah miners
      metalOrTrinium: 400000,
      crystal: 150000,
      deuterium: 80000,
    },
    avatarEmoji: '🦖',
    sigilColor: '#854d0e',
  },

  // 19. THE GENII CONFEDERACY
  {
    id: 'npc_genii_confederacy',
    name: 'The Genii Confederacy',
    designationOrTitle: 'Subterranean Nuclear Military State',
    canonicalSeries: 'Stargate Atlantis',
    galaxy: 'Pegasus',
    homeworld: 'Genii Homeworld',
    stargateAddress: 'ᚷ-ᛖ-ᚾ-ᛁ-ᛁ-ᛈ-ᛖ-ᚷ',
    classification: 'Organic Humanoid',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Chief Cowen / Commander Ladon Radim',
    flagshipClass: 'Genii Underground Silo Complex & Infiltration Strike Ships',
    fleetStrength: 420000,
    tacticalTraits: [
      'Subterranean Bunker Network Hidden Beneath Primitive Farms',
      'Fission Nuclear Warheads & C-4 Explosive Infiltration Charges',
      'Covert Ops Espionage & Ancient Device Acquisition Teams',
      'Guerrilla Warfare & Hostage Trade Negotiations',
    ],
    loreDescription:
      'Posing as simple agrarian farmers to avoid Wraith culling, the Genii built a massive 1940s-tier nuclear military infrastructure underground. Aggressive and paranoid, they seek C-4, jumper technology, and nuclear superiority.',
    firstAppearanceEpisode: 'SGA S01E08 "Underground"',
    combatStats: {
      attackBonusPercent: 62,
      shieldHarmonicsPercent: 45,
      sensorStealthPercent: 80,
      technologicalTier: 6,
    },
    resourceLoot: {
      naquadah: 410000,
      metalOrTrinium: 680000,
      crystal: 290000,
      deuterium: 180000,
    },
    avatarEmoji: '💣',
    sigilColor: '#b45309',
  },

  // 23. URGO & TOGAR CYBER-ENTITIES
  {
    id: 'npc_urgo_entities',
    name: 'The Urgo AI & Togar Entities',
    designationOrTitle: 'Disruptive Neural Cyber-Saboteurs',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'PXY-888 AI Lab',
    stargateAddress: 'ᛈ-ᛑ-ᚢ-ᚱ-ᚷ-ᛟ-ᛋ-ᛏ',
    classification: 'Synthetic / Nanite',
    threatLevel: 'Moderate / Cautious',
    diplomaticStatus: 'Neutral',
    factionLeader: 'Togar / Urgo Prime',
    flagshipClass: 'PXY-888 Cyber-Node Core',
    fleetStrength: 350000,
    tacticalTraits: [
      'Direct Neural Implant Infiltration & Sensory Illusions',
      'Ship Computer Hijacking & Navigation Overrides',
      'Constant Playful Sabotage & Electronic Jamming Pulse',
      'Defensive Shield Inversion Fields',
    ],
    loreDescription:
      'Created by the eccentric scientist Togar, Urgo is a sentient artificial intelligence probe implanted directly into exploration teams. Urgo can alter visual perception, sing songs, or disable targeting arrays during high-stakes battles.',
    firstAppearanceEpisode: 'SG-1 S03E16 "Urgo"',
    combatStats: {
      attackBonusPercent: 48,
      shieldHarmonicsPercent: 85,
      sensorStealthPercent: 95,
      technologicalTier: 9,
    },
    resourceLoot: {
      naquadah: 280000,
      metalOrTrinium: 320000,
      crystal: 890000,
      deuterium: 410000,
    },
    avatarEmoji: '🎭',
    sigilColor: '#a855f7',
  },

  // 24. HUMAN-FORM REPLICATORS (FIRST & FIFTH)
  {
    id: 'npc_humanform_replicators',
    name: 'Human-Form Replicators',
    designationOrTitle: 'First & Fifth Nanite Legion',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Othala / Hala Sector',
    stargateAddress: 'ᚺ-ᚨ-ᛚ-ᚨ-ᚾ-ᚨ-ᚾ-ᛁ',
    classification: 'Synthetic / Nanite',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'First / Fifth / Replicator Carter',
    flagshipClass: 'Neutronium-Corrupted Replicator Battleship',
    fleetStrength: 960000,
    tacticalTraits: [
      'Consumes Metal, Trinium, & Neutronium to Multiply Instantly',
      'Immunity to All Energy & Kinetic Projectile Weapons',
      'Phase-Disruption Nanite Hull Penetration & Mind Scan',
      'Subspace Collective Thought Network & Time-Dilation Field',
    ],
    loreDescription:
      'Created when block Replicators assembled millions of microscopic nanites into human form. Led by First and Fifth, these cruel androids seek to consume all technology across the universe and subjugate organic life.',
    firstAppearanceEpisode: 'SG-1 S06E12 "Unnatural Selection" & S08E01 "New Order"',
    combatStats: {
      attackBonusPercent: 96,
      shieldHarmonicsPercent: 92,
      sensorStealthPercent: 85,
      technologicalTier: 10,
    },
    resourceLoot: {
      naquadah: 1100000,
      metalOrTrinium: 1250000,
      crystal: 980000,
      deuterium: 850000,
    },
    avatarEmoji: '🧱',
    sigilColor: '#e11d48',
  },

  // 25. THE TRUST / ROGUE NID FACTION
  {
    id: 'npc_trust_rogue_nid',
    name: 'The Trust (Rogue NID Cell)',
    designationOrTitle: 'Earth Shadow Black-Ops Syndicate',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Earth / Rogue Sub-Base',
    stargateAddress: 'ᛋ-ᚢ-ᚾ-ᛏ-ᚱ-ᚢ-ᛋ-ᛏ',
    classification: 'Organic Humanoid',
    threatLevel: 'High / Aggressive',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Hoskins / Jennings / Agent Barrett Target',
    flagshipClass: 'Al\'kesh Poison-Dart Bomber with Cloaking Drive',
    fleetStrength: 490000,
    tacticalTraits: [
      'Symbiote Poison Gas Missiles & Chemical Warheads',
      'Stolen Cloaking Technology & Subspace Beacons',
      'Infiltration of Earth Military & Financial Networks',
      'Ruthless Xenophobic Preemptive Strikes',
    ],
    loreDescription:
      'A rogue splinter group of former NID agents backed by corrupt business tycoons. Using stolen Goa\'uld stealth ships and nerve toxins, the Trust wages illegal biological warfare against alien worlds, threatening Earth\'s alliances.',
    firstAppearanceEpisode: 'SG-1 S08E08 "Affinity" & S08E10 "Endgame"',
    combatStats: {
      attackBonusPercent: 72,
      shieldHarmonicsPercent: 60,
      sensorStealthPercent: 90,
      technologicalTier: 7,
    },
    resourceLoot: {
      naquadah: 510000,
      metalOrTrinium: 490000,
      crystal: 530000,
      deuterium: 380000,
    },
    avatarEmoji: '🕵️',
    sigilColor: '#475569',
  },

  // 26. ORICI ADRIA & ASCENDED CRUSADERS
  {
    id: 'npc_adria_ori_crusade',
    name: 'Orici Adria & Ascended Crusade',
    designationOrTitle: 'Holy Avatar of origin',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Ori Galaxy',
    homeworld: 'Celestis Holy Shrine',
    stargateAddress: 'ᚨ-ᛞ-ᚱ-ᛁ-ᚨ-ᚺ-ᛟ-ᛚ',
    classification: 'Higher Energy / Ascended',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Orici Adria / Ascended Form',
    flagshipClass: 'Adria\'s Golden Flagship (Celestial Flame Core)',
    fleetStrength: 980000,
    tacticalTraits: [
      'Telekinetic Force Fields Stopping Railgun Blasts',
      'Supergate Ingress Teleportation & Celestial Flame Attack',
      'Aura of Divine Mind Control & Religious Zealotry',
      'Instant Biological Reconstitution & Telepathic Blast',
    ],
    loreDescription:
      'Bred through Vala Mal Doran by the Ori, Adria rapidly grew into the Orici—the living leader of the Ori Crusade. Possessing total telekinetic mastery and later ascending herself, Adria represents the ultimate divine threat.',
    firstAppearanceEpisode: 'SG-1 S10E01 "Flesh and Blood" & S10E19 "Dominion"',
    combatStats: {
      attackBonusPercent: 98,
      shieldHarmonicsPercent: 98,
      sensorStealthPercent: 70,
      technologicalTier: 10,
    },
    resourceLoot: {
      naquadah: 1300000,
      metalOrTrinium: 1100000,
      crystal: 950000,
      deuterium: 900000,
    },
    avatarEmoji: '🔥',
    sigilColor: '#f97316',
  },

  // 27. THE SUPREME SYSTEM LORDS COUNCIL
  {
    id: 'npc_system_lord_council',
    name: 'Supreme System Lords High Council',
    designationOrTitle: 'Goa\'uld Dominion Syndicate',
    canonicalSeries: 'Stargate SG-1',
    galaxy: 'Milky Way',
    homeworld: 'Hasara System (Neutral Space Station)',
    stargateAddress: 'ᚺ-ᚨ-ᛋ-ᚨ-ᚱ-ᚨ-ᚷ-ᚩ',
    classification: 'Parasitic Symbiote',
    threatLevel: 'Extinction Level / Cataclysmic',
    diplomaticStatus: 'Hostile',
    factionLeader: 'Ra / Ba\'al / Apophis / Cronus / Lord Yu',
    flagshipClass: 'Anubis Dreadnought & System Lord Armada (50 Ha\'taks)',
    fleetStrength: 990000,
    tacticalTraits: [
      '50+ Ha\'tak Motherships & Super-Legion Jaffa Guard Brigades',
      'Naquadah-Enriched Planet-Buster Orbital Bombardment',
      'Sarcophagus Longevity Rejuvenation in Battle',
      'Symbiote Possession & Seductive Treachery Protocols',
    ],
    loreDescription:
      'The ruling feudal oligarchy of Goa\'uld conquerors who enslaved humanity across the galaxy for thousands of years. Enforcing divine worship through golden Ha\'tak fleets and Jaffa armies, the Council convenes at the Hasara Station to wage total galactic war.',
    firstAppearanceEpisode: 'SG-1 S03E03 "Fair Game" & S05E15 "Summit"',
    combatStats: {
      attackBonusPercent: 95,
      shieldHarmonicsPercent: 90,
      sensorStealthPercent: 65,
      technologicalTier: 9,
    },
    resourceLoot: {
      naquadah: 1500000,
      metalOrTrinium: 1200000,
      crystal: 900000,
      deuterium: 800000,
    },
    avatarEmoji: '👑',
    sigilColor: '#eab308',
  },
];

/**
 * Converts the 18 Stargate NPC Races into playable Target Realms for Combat and Espionage
 */
export function CONVERT_NPC_RACES_TO_TARGET_REALMS(): TargetRealm[] {
  return STARGATE_NPC_RACES.map((race, index) => {
    return {
      id: `target_${race.id}`,
      commanderName: `${race.factionLeader} (${race.name})`,
      race: race.name,
      rank: race.designationOrTitle,
      score: Math.round(race.fleetStrength / 6),
      estimatedUnits: Math.round(race.fleetStrength / 450),
      estimatedNaquadah: race.resourceLoot.naquadah,
      isProtected: race.diplomaticStatus === 'Alliance Partner' || race.threatLevel === 'Harmless / Pacifist',
      defenseLevel: Math.round(race.combatStats.technologicalTier),
      antiCovertLevel: Math.max(1, Math.round(race.combatStats.sensorStealthPercent / 20)),
    };
  });
}

/**
 * Filter helpers
 */
export function getNpcRacesByGalaxy(galaxy: string): StargateNpcRace[] {
  if (galaxy === 'ALL') return STARGATE_NPC_RACES;
  return STARGATE_NPC_RACES.filter((r) => r.galaxy === galaxy);
}

export function getNpcRacesByThreat(threat: string): StargateNpcRace[] {
  if (threat === 'ALL') return STARGATE_NPC_RACES;
  return STARGATE_NPC_RACES.filter((r) => r.threatLevel === threat);
}

export function getNpcRacesBySeries(series: string): StargateNpcRace[] {
  if (series === 'ALL') return STARGATE_NPC_RACES;
  return STARGATE_NPC_RACES.filter((r) => r.canonicalSeries === series);
}
