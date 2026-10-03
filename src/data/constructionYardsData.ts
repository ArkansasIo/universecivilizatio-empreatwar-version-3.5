/**
 * Construction Yards & Planetary / Moon Buildable Fields System Data
 * 
 * Manages:
 * - Planetary & Moon buildable fields (used / max / remaining)
 * - Construction Yards on each world (level 1-10, build speed multiplier, max tier capability)
 * - Field expansion actions (Terraforming & Lunar Bores)
 * - Queue processing integration
 */

export interface ConstructionYardWorld {
  id: string;
  name: string;
  type: 'planet' | 'moon';
  parentPlanetName?: string;
  coordinate: string;
  biome: string;
  yardLevel: number; // 1-10
  yardName: string;
  buildSpeedMultiplier: number; // e.g. 1.0 = 100%, 1.75 = 175%
  maxBlueprintTierSupported: number; // 1 to 5
  fieldsUsed: number;
  fieldsMax: number;
  activeFabricationsCount: number;
  structuresBuiltCount: number;
}

export const INITIAL_CONSTRUCTION_YARDS: ConstructionYardWorld[] = [
  {
    id: 'yard-p1-earth',
    name: 'Earth (Sol III)',
    type: 'planet',
    coordinate: '1:1:1',
    biome: 'Terran Continental',
    yardLevel: 4,
    yardName: 'Cheyenne Orbital Drydocks & Assembly Works',
    buildSpeedMultiplier: 1.8,
    maxBlueprintTierSupported: 4,
    fieldsUsed: 142,
    fieldsMax: 240,
    activeFabricationsCount: 1,
    structuresBuiltCount: 38,
  },
  {
    id: 'yard-m1-luna',
    name: 'Luna (Sol III Moon)',
    type: 'moon',
    parentPlanetName: 'Earth (Sol III)',
    coordinate: '1:1:1 M',
    biome: 'Regolith Lunar Basin',
    yardLevel: 3,
    yardName: 'Artemis Surface Fabricator Gantry',
    buildSpeedMultiplier: 1.5,
    maxBlueprintTierSupported: 3,
    fieldsUsed: 48,
    fieldsMax: 90,
    activeFabricationsCount: 0,
    structuresBuiltCount: 12,
  },
  {
    id: 'yard-p2-chulak',
    name: 'Chulak Prime',
    type: 'planet',
    coordinate: '1:2:4',
    biome: 'Temperate Forest & Highlands',
    yardLevel: 3,
    yardName: 'Jaffa Liberation Forge Complex',
    buildSpeedMultiplier: 1.5,
    maxBlueprintTierSupported: 3,
    fieldsUsed: 98,
    fieldsMax: 210,
    activeFabricationsCount: 1,
    structuresBuiltCount: 24,
  },
  {
    id: 'yard-p3-tollana',
    name: 'New Tollana',
    type: 'planet',
    coordinate: '1:3:7',
    biome: 'Hyper-Advanced Urban Plateaus',
    yardLevel: 5,
    yardName: 'Curia Molecular Sintering Matrix',
    buildSpeedMultiplier: 2.2,
    maxBlueprintTierSupported: 5,
    fieldsUsed: 165,
    fieldsMax: 260,
    activeFabricationsCount: 2,
    structuresBuiltCount: 45,
  },
  {
    id: 'yard-p4-dakara',
    name: 'Dakara Sanctuary',
    type: 'planet',
    coordinate: '2:4:9',
    biome: 'Arid Sandstone & Ancient Monoliths',
    yardLevel: 2,
    yardName: 'Ancient Obelisk Reclamation Yard',
    buildSpeedMultiplier: 1.25,
    maxBlueprintTierSupported: 2,
    fieldsUsed: 64,
    fieldsMax: 180,
    activeFabricationsCount: 0,
    structuresBuiltCount: 16,
  },
  {
    id: 'yard-m2-abydos-moon',
    name: 'Abydos Minor (Moon)',
    type: 'moon',
    parentPlanetName: 'Abydos Prime',
    coordinate: '1:4:1 M',
    biome: 'Silicate Desert Sands',
    yardLevel: 2,
    yardName: 'Pyramid Foundation Fabricator',
    buildSpeedMultiplier: 1.25,
    maxBlueprintTierSupported: 2,
    fieldsUsed: 32,
    fieldsMax: 70,
    activeFabricationsCount: 0,
    structuresBuiltCount: 8,
  },
];
