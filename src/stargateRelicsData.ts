export interface StargateRelic {
  id: string;
  name: string;
  seriesProvenance: 'Original Movie' | 'SG-1' | 'Atlantis' | 'Universe' | 'The Ark of Truth';
  category: 'weapon' | 'energy' | 'defense' | 'science' | 'transcendent';
  rarity: 'Uncommon' | 'Rare' | 'Epic' | 'Lantean Ancient' | 'Ascended Divine';
  icon: string;
  description: string;
  lore: string;
  passiveBonuses: {
    attackBonusPct?: number;
    defenseBonusPct?: number;
    energyProductionPct?: number;
    researchSpeedPct?: number;
    warpSpeedPct?: number;
    happinessBonusPct?: number;
    naquadahHourlyBonus?: number;
    darkMatterBonus?: number;
  };
  activeAbility?: {
    name: string;
    description: string;
    cooldownHours: number;
    effectType: 'energy_surge' | 'time_acceleration' | 'hazard_purge' | 'happiness_buff' | 'phase_cloak' | 'dimensional_salvage';
  };
  dropLocation: string;
  equippedSlot?: 'offense' | 'energy' | 'defense' | 'science' | 'planetary' | 'transcendent' | null;
  quantityOwned: number;
}

export const INITIAL_STARGATE_RELICS: StargateRelic[] = [
  // 1. WEAPON & OFFENSE ARTIFACTS
  {
    id: 'relic_eye_of_ra',
    name: 'The Eye of Ra',
    seriesProvenance: 'Original Movie',
    category: 'weapon',
    rarity: 'Lantean Ancient',
    icon: '👁️',
    description: 'A glowing solar crystal lens retrieved from Ra\'s pyramid vault on Abydos.',
    lore: 'One of the six legendary Eyes of the Gods. When focused through a crystal array, it unleashes destructive plasma beams capable of incinerating entire armadas.',
    passiveBonuses: {
      attackBonusPct: 25,
      naquadahHourlyBonus: 10000,
    },
    dropLocation: 'Abydos System (P3X-888) / Ra System Lord Raids',
    equippedSlot: 'offense',
    quantityOwned: 1,
  },
  {
    id: 'relic_anubis_crystal_matrix',
    name: 'Anubis Superweapon Matrix',
    seriesProvenance: 'SG-1',
    category: 'weapon',
    rarity: 'Lantean Ancient',
    icon: '🔮',
    description: 'An evil fusion core channeling the power of all six Eyes of the Gods.',
    lore: 'Constructed by the half-ascended Goa\'uld Anubis aboard his flag dreadnought. Its focal lens can destroy stargates and vaporize planetary crusts.',
    passiveBonuses: {
      attackBonusPct: 35,
      defenseBonusPct: 10,
    },
    dropLocation: 'Anubis Mothership Defeat / Langara Orbit',
    equippedSlot: null,
    quantityOwned: 0,
  },
  {
    id: 'relic_sangreal_grail',
    name: 'The Sangreal (Merlin\'s Holy Grail)',
    seriesProvenance: 'SG-1',
    category: 'weapon',
    rarity: 'Ascended Divine',
    icon: '🏆',
    description: 'An ancient energy displacement weapon engineered by the Ascended Ancient Merlin.',
    lore: 'Emits a unique phase-cancellation energy frequency across higher dimensions designed specifically to neutralize Ascended Ori beings.',
    passiveBonuses: {
      attackBonusPct: 50,
      researchSpeedPct: 20,
    },
    dropLocation: 'Camelot Vault / P9G-844 Quest',
    equippedSlot: null,
    quantityOwned: 0,
  },
  {
    id: 'relic_kara_kesh',
    name: 'Goa\'uld Kara kesh (Ribbon Device)',
    seriesProvenance: 'SG-1',
    category: 'weapon',
    rarity: 'Rare',
    icon: '✋',
    description: 'A ornate golden hand device worn by System Lords and First Primes.',
    lore: 'Uses neural interface crystal amplifiers to hurl telekinetic shockwaves and project pain fields that disorient opposing infantry.',
    passiveBonuses: {
      attackBonusPct: 15,
    },
    dropLocation: 'System Lord Raids / Chulak Conquest',
    equippedSlot: null,
    quantityOwned: 1,
  },
  {
    id: 'relic_wraith_stunner',
    name: 'Wraith Queen Stunner & Bio-Key',
    seriesProvenance: 'Atlantis',
    category: 'weapon',
    rarity: 'Epic',
    icon: '🔫',
    description: 'Bio-organic energy weapon used to paralyze prey and interface with Hive ships.',
    lore: 'Fires high-frequency neuro-disruptor waves that incapacitate crew members instantly without damaging vessel infrastructure.',
    passiveBonuses: {
      attackBonusPct: 20,
    },
    dropLocation: 'Pegasus Galaxy Hive Ship Assaults',
    equippedSlot: null,
    quantityOwned: 0,
  },

  // 2. ENERGY & POWER RELICS
  {
    id: 'relic_zero_point_module',
    name: 'Zero-Point Module (ZPM / Potentia)',
    seriesProvenance: 'Atlantis',
    category: 'energy',
    rarity: 'Ascended Divine',
    icon: '🔋',
    description: 'A luminous Lantean power core tapping zero-point energy from a contained sub-space region.',
    lore: 'The ultimate energy source created by the Ancients. Powers the Atlantis city shields, intergalactic stargate wormholes, and Ancient dreadnoughts.',
    passiveBonuses: {
      energyProductionPct: 50,
      naquadahHourlyBonus: 25000,
    },
    activeAbility: {
      name: 'ZPM Subspace Surge',
      description: 'Overcharges energy conduits to instantly grant +100,000 Energy Units and +50,000 Naquadah.',
      cooldownHours: 4,
      effectType: 'energy_surge',
    },
    dropLocation: 'Atlantis Sub-Level Vaults / Protaris Ancient Ruins',
    equippedSlot: 'energy',
    quantityOwned: 1,
  },
  {
    id: 'relic_atanik_armband',
    name: 'Atanik Cybernetic Armband',
    seriesProvenance: 'SG-1',
    category: 'energy',
    rarity: 'Epic',
    icon: '🦾',
    description: 'An ancient bio-technological sleeve that enhances human physical physiology tenfold.',
    lore: 'Discovered by SG-1 in an extinct alien outpost. Injects viral bio-chemics that grant superhuman speed, reflexes, and energy shield fields.',
    passiveBonuses: {
      warpSpeedPct: 30,
      attackBonusPct: 15,
    },
    dropLocation: 'Tok\'ra Research Vaults / P3X-595',
    equippedSlot: null,
    quantityOwned: 0,
  },
  {
    id: 'relic_neutrino_generator',
    name: 'Asgard Neutrino-Ion Generator',
    seriesProvenance: 'SG-1',
    category: 'energy',
    rarity: 'Lantean Ancient',
    icon: '⚡',
    description: 'An advanced clean energy reactor engineered by Supreme Commander Thor.',
    lore: 'Extracts neutrino particles from stellar background radiation to feed energy directly into ship hyperdrives and heavy ion batteries.',
    passiveBonuses: {
      energyProductionPct: 35,
      naquadahHourlyBonus: 15000,
    },
    dropLocation: 'Othala Asgard World Ruins',
    equippedSlot: null,
    quantityOwned: 1,
  },

  // 3. DEFENSE & SHIELD RELICS
  {
    id: 'relic_dakara_superweapon',
    name: 'Dakara Molecular Wave Array',
    seriesProvenance: 'SG-1',
    category: 'defense',
    rarity: 'Ascended Divine',
    icon: '🌊',
    description: 'An Ancient temple matrix on Dakara capable of altering matter on a subatomic level.',
    lore: 'Built millions of years ago by the Ancients to seed life after the plague. Later calibrated by Carter and Ba\'al to disintegrate all Replicator blocks galaxy-wide.',
    passiveBonuses: {
      defenseBonusPct: 40,
      happinessBonusPct: 20,
    },
    activeAbility: {
      name: 'Dakara Disintegration Wave',
      description: 'Fires a molecular frequency wave through the gate network to purge planetary hazards and quell civil unrest.',
      cooldownHours: 8,
      effectType: 'hazard_purge',
    },
    dropLocation: 'Dakara Temple Sanctuary / Jaffa High Council Sanctum',
    equippedSlot: 'defense',
    quantityOwned: 1,
  },
  {
    id: 'relic_tollan_phase_shift',
    name: 'Tollan Phase-Shift Pocket Module',
    seriesProvenance: 'SG-1',
    category: 'defense',
    rarity: 'Lantean Ancient',
    icon: '🛡️',
    description: 'A compact hand device that displaces user matter into out-of-phase dimensions.',
    lore: 'Developed by the technologically hyper-advanced Tollan race. Allows personnel and starships to walk or fly straight through solid matter and blast doors.',
    passiveBonuses: {
      defenseBonusPct: 35,
    },
    activeAbility: {
      name: 'Tollan Phase Cloak',
      description: 'Phase-shifts fleet vessels to render them immune to all damage for 1 combat turn.',
      cooldownHours: 24,
      effectType: 'phase_cloak',
    },
    dropLocation: 'Tollana Ruined Capital',
    equippedSlot: null,
    quantityOwned: 0,
  },
  {
    id: 'relic_nox_healing_crystal',
    name: 'Nox Luminous Healing Crystal',
    seriesProvenance: 'SG-1',
    category: 'defense',
    rarity: 'Lantean Ancient',
    icon: '💎',
    description: 'An iridescent living crystal crafted by the peaceful Nox elder Lya.',
    lore: 'Channels the natural lifeforce energy of Gaia. Capable of resurrecting fallen commanders and knitting together shattered warship hulls instantly.',
    passiveBonuses: {
      defenseBonusPct: 25,
      happinessBonusPct: 15,
    },
    dropLocation: 'Gaia Forest World (P3X-774)',
    equippedSlot: null,
    quantityOwned: 1,
  },
  {
    id: 'relic_lantean_drone_crystal',
    name: 'Lantean Drone Control Crystal Matrix',
    seriesProvenance: 'Atlantis',
    category: 'defense',
    rarity: 'Epic',
    icon: '💥',
    description: 'A golden octagonal control crystal interfacing with Ancient Drone weaponry.',
    lore: 'Directs swarms of organic guided squid-like plasma drones that ignore conventional shield barriers and drill directly into enemy reactor cores.',
    passiveBonuses: {
      defenseBonusPct: 30,
      attackBonusPct: 15,
    },
    dropLocation: 'Antarctica Ancient Outpost / Atlantis Chair Room',
    equippedSlot: null,
    quantityOwned: 1,
  },

  // 4. SCIENCE & UTILITY ARTIFACTS
  {
    id: 'relic_ark_of_truth',
    name: 'The Ark of Truth',
    seriesProvenance: 'The Ark of Truth',
    category: 'science',
    rarity: 'Ascended Divine',
    icon: '📜',
    description: 'An ancient golden chest created by the Ancient scholar Amelius millions of years ago.',
    lore: 'Projects a blinding ray of absolute truth directly into the mind of anyone who looks upon it, breaking brainwashing, cult indoctrination, and religious tyranny.',
    passiveBonuses: {
      happinessBonusPct: 35,
      researchSpeedPct: 25,
    },
    activeAbility: {
      name: 'Ark of Truth Revelation',
      description: 'Emits a wave of absolute truth across all colonized worlds, boosting population happiness & loyalty to 100%.',
      cooldownHours: 12,
      effectType: 'happiness_buff',
    },
    dropLocation: 'Celestis City of the Gods Vault',
    equippedSlot: 'science',
    quantityOwned: 1,
  },
  {
    id: 'relic_asgard_computer_core',
    name: 'Asgard Legacy Computer Core',
    seriesProvenance: 'SG-1',
    category: 'science',
    rarity: 'Ascended Divine',
    icon: '🖥️',
    description: 'The final gift of the Asgard: A complete database of all Asgard knowledge, culture, and science.',
    lore: 'Installed on the USS George Hammond and Odyssey before Othala\'s destruction. Contains plasma beam weapon schematics, matrix synthesisers, and time dilation tech.',
    passiveBonuses: {
      researchSpeedPct: 35,
      attackBonusPct: 20,
    },
    activeAbility: {
      name: 'Asgard Time Dilation Surge',
      description: 'Uses localized temporal fields to instantly accelerate all active research & building queues by 2 hours.',
      cooldownHours: 6,
      effectType: 'time_acceleration',
    },
    dropLocation: 'Orilla Asgard Legacy Terminal',
    equippedSlot: null,
    quantityOwned: 1,
  },
  {
    id: 'relic_quantum_mirror',
    name: 'The Quantum Mirror',
    seriesProvenance: 'SG-1',
    category: 'science',
    rarity: 'Lantean Ancient',
    icon: '🪞',
    description: 'A heavy metallic mirror artifact uncovered in the P3R-233 research bunker.',
    lore: 'Allows personnel to step across multi-dimensional reality barriers into alternate timelines. Provides rare blueprint schematics and technology from parallel universes.',
    passiveBonuses: {
      researchSpeedPct: 25,
      darkMatterBonus: 50,
    },
    activeAbility: {
      name: 'Parallel Universe Salvage',
      description: 'Reaches across parallel dimensions to salvage an extra rare expedition reward cache.',
      cooldownHours: 12,
      effectType: 'dimensional_salvage',
    },
    dropLocation: 'P3R-233 Bunker Site',
    equippedSlot: null,
    quantityOwned: 1,
  },
  {
    id: 'relic_destiny_master_glyph',
    name: 'Destiny Master Bridge Control Glyph',
    seriesProvenance: 'Universe',
    category: 'science',
    rarity: 'Lantean Ancient',
    icon: '🌌',
    description: 'A smooth obsidian stone carved with Ancient navigational astro-glyphs.',
    lore: 'Interfaced directly with the navigation helm of the Ancient exploratory vessel Destiny, unlocking automated solar refueling and deep space wormhole calculation.',
    passiveBonuses: {
      warpSpeedPct: 35,
      researchSpeedPct: 15,
    },
    dropLocation: 'Destiny Bridge Control Console / FTL Core',
    equippedSlot: null,
    quantityOwned: 0,
  },
  {
    id: 'relic_crystal_skull',
    name: 'Crystal Skull of Akador',
    seriesProvenance: 'SG-1',
    category: 'science',
    rarity: 'Rare',
    icon: '💀',
    description: 'A carved quartz skull radiating subtle telepathic sub-space vibrations.',
    lore: 'Discovered in Mayan ruins by Dr. Nicholas Ballard. Teleports users into misty multi-dimensional chambers inhabited by giant telepathic beings.',
    passiveBonuses: {
      researchSpeedPct: 15,
    },
    dropLocation: 'PX3-989 Telepathic Sanctum',
    equippedSlot: null,
    quantityOwned: 1,
  },
  {
    id: 'relic_dakara_transmuter_shard',
    name: 'Dakara Transmuter Fragment',
    seriesProvenance: 'SG-1',
    category: 'transcendent',
    rarity: 'Epic',
    icon: '✨',
    description: 'A sparkling crystal catalyst used in the Ancient Transmutation Forge.',
    lore: 'Used by Ancient alchemists to fuse lesser technological artifacts into empowered Ascended Relics.',
    passiveBonuses: {
      naquadahHourlyBonus: 5000,
    },
    dropLocation: 'Stargate Expeditions & System Lord Defeats',
    equippedSlot: null,
    quantityOwned: 4,
  },
];
