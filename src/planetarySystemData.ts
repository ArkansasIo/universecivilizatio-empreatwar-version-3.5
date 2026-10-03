export interface PlanetSubClassDef {
  id: string;
  name: string;
  code: string;
  temperatureMin: number;
  temperatureMax: number;
  gravity: number; // G
  baseDiameterKm: number;
  maxFields: number;
  metalBonus: number; // %
  crystalBonus: number; // %
  deuteriumBonus: number; // %
  powerEfficiency: number; // %
  description: string;
}

export interface PlanetClassCategory {
  classId: string;
  className: string;
  categoryCode: string;
  description: string;
  subClasses: PlanetSubClassDef[];
}

export const PLANETARY_CLASSES_42: PlanetClassCategory[] = [
  {
  classId: 'terrestrial',
  className: 'Class I: Terrestrial & Continental Worlds',
  categoryCode: 'TER',
  description: 'Earth-like silicate worlds with nitrogen-oxygen atmospheres and temperate river basins.',
  subClasses: [
    { id: 'ter-01', name: 'Standard Continental', code: 'TER-A1', temperatureMin: -10, temperatureMax: 40, gravity: 1.0, baseDiameterKm: 12742, maxFields: 165, metalBonus: 0, crystalBonus: 0, deuteriumBonus: 0, powerEfficiency: 100, description: 'Standard temperate world ideal for humanoid settlement.' },
    { id: 'ter-02', name: 'Archipelago Ocean World', code: 'TER-A2', temperatureMin: 10, temperatureMax: 55, gravity: 0.92, baseDiameterKm: 13200, maxFields: 180, metalBonus: -10, crystalBonus: +15, deuteriumBonus: +20, powerEfficiency: 95, description: 'Over 85% liquid hydrosphere with scattered volcanic archipelagos.' },
    { id: 'ter-03', name: 'Boreal Taiga Planet', code: 'TER-B1', temperatureMin: -45, temperatureMax: 15, gravity: 1.05, baseDiameterKm: 12100, maxFields: 150, metalBonus: +10, crystalBonus: -5, deuteriumBonus: +10, powerEfficiency: 90, description: 'Dense pine forests and immense permafrost mineral reserves.' },
    { id: 'ter-04', name: 'Savanna Arid World', code: 'TER-B2', temperatureMin: 15, temperatureMax: 65, gravity: 0.98, baseDiameterKm: 11900, maxFields: 140, metalBonus: +15, crystalBonus: +10, deuteriumBonus: -15, powerEfficiency: 110, description: 'Vast amber grasslands and rich surface crustal iron deposits.' },
    { id: 'ter-05', name: 'Alpine High-Plateau World', code: 'TER-C1', temperatureMin: -30, temperatureMax: 25, gravity: 1.12, baseDiameterKm: 11500, maxFields: 130, metalBonus: +25, crystalBonus: +5, deuteriumBonus: 0, powerEfficiency: 105, description: 'Rugged towering mountain chains rich in heavy rare earths.' },
    { id: 'ter-06', name: 'Subterranean Hive Planet', code: 'TER-C2', temperatureMin: -5, temperatureMax: 35, gravity: 1.18, baseDiameterKm: 12800, maxFields: 190, metalBonus: +30, crystalBonus: +20, deuteriumBonus: -10, powerEfficiency: 100, description: 'Honeycombed crustal caverns with high industrial density.' },
    { id: 'ter-07', name: 'Verdant Megapolis World', code: 'TER-D1', temperatureMin: 5, temperatureMax: 35, gravity: 1.0, baseDiameterKm: 14000, maxFields: 210, metalBonus: +10, crystalBonus: +10, deuteriumBonus: 0, powerEfficiency: 120, description: 'Ecumenopolis-grade industrial hub with advanced arcologies.' },
  ],
},
{
  classId: 'desert',
  className: 'Class II: Arid & Desert Worlds',
  categoryCode: 'DES',
  description: 'Hot, dry worlds swept by perpetual solar winds and endless dune seas.',
  subClasses: [
    { id: 'des-01', name: 'Silica Dune Desert', code: 'DES-A1', temperatureMin: 30, temperatureMax: 95, gravity: 0.88, baseDiameterKm: 10800, maxFields: 125, metalBonus: +15, crystalBonus: +25, deuteriumBonus: -25, powerEfficiency: 135, description: 'Endless crystalline sand dunes with intense solar radiation.' },
    { id: 'des-02', name: 'Salt Flat Arid Plateau', code: 'DES-A2', temperatureMin: 20, temperatureMax: 85, gravity: 0.95, baseDiameterKm: 11200, maxFields: 135, metalBonus: +20, crystalBonus: +20, deuteriumBonus: -20, powerEfficiency: 130, description: 'Crustal evaporite plains rich in lithium and sodium salts.' },
    { id: 'des-03', name: 'Badlands Red Canyons', code: 'DES-B1', temperatureMin: 25, temperatureMax: 105, gravity: 1.02, baseDiameterKm: 10500, maxFields: 120, metalBonus: +35, crystalBonus: +10, deuteriumBonus: -30, powerEfficiency: 140, description: 'Deep iron-oxide canyons exposed by ancient solar stripping.' },
    { id: 'des-04', name: 'Basaltic Volcanic Desert', code: 'DES-B2', temperatureMin: 40, temperatureMax: 130, gravity: 1.1, baseDiameterKm: 11800, maxFields: 145, metalBonus: +40, crystalBonus: +15, deuteriumBonus: -10, powerEfficiency: 145, description: 'Dark basalt flows interspersed with active thermal vents.' },
    { id: 'des-05', name: 'Gravel Reg Wasteland', code: 'DES-C1', temperatureMin: 15, temperatureMax: 80, gravity: 0.9, baseDiameterKm: 9900, maxFields: 110, metalBonus: +10, crystalBonus: +5, deuteriumBonus: -35, powerEfficiency: 125, description: 'Pebble-strewn rocky plains with minimal atmospheric interference.' },
    { id: 'des-06', name: 'Eolian Erg World', code: 'DES-C2', temperatureMin: 35, temperatureMax: 115, gravity: 0.85, baseDiameterKm: 10200, maxFields: 115, metalBonus: +12, crystalBonus: +30, deuteriumBonus: -25, powerEfficiency: 150, description: 'Shifting wind-sculpted silica dunes with high thermal energy.' },
    { id: 'des-07', name: 'Oasis Trench Planet', code: 'DES-D1', temperatureMin: 10, temperatureMax: 60, gravity: 1.0, baseDiameterKm: 12000, maxFields: 160, metalBonus: +5, crystalBonus: +20, deuteriumBonus: +10, powerEfficiency: 120, description: 'Deep subterranean aquifer systems beneath hyper-arid surface.' },
  ],
},
{
  classId: 'ice_frozen',
  className: 'Class III: Glacial & Cryo-Frozen Worlds',
  categoryCode: 'ICE',
  description: 'Distant sub-zero realms encapsulated in kilometers of nitrogen and water ice.',
  subClasses: [
    { id: 'ice-01', name: 'Nitrogen Glacial World', code: 'ICE-A1', temperatureMin: -190, temperatureMax: -110, gravity: 0.82, baseDiameterKm: 9500, maxFields: 100, metalBonus: -10, crystalBonus: -20, deuteriumBonus: +40, powerEfficiency: 60, description: 'Sub-zero temperatures with vast glacial flows of nitrogen ice.' },
    { id: 'ice-02', name: 'Subsurface Ocean Cryo-Moon', code: 'ICE-A2', temperatureMin: -150, temperatureMax: -80, gravity: 0.78, baseDiameterKm: 10200, maxFields: 115, metalBonus: -5, crystalBonus: +10, deuteriumBonus: +50, powerEfficiency: 70, description: 'Crustal ice shell concealing a warm radioactive liquid ocean.' },
    { id: 'ice-03', name: 'Methane Clathrate Realm', code: 'ICE-B1', temperatureMin: -170, temperatureMax: -95, gravity: 0.85, baseDiameterKm: 9800, maxFields: 105, metalBonus: 0, crystalBonus: 0, deuteriumBonus: +60, powerEfficiency: 65, description: 'Abundant hydrocarbon ice deposits and heavy deuterium reserves.' },
    { id: 'ice-04', name: 'Cryovolcanic Ice Giant', code: 'ICE-B2', temperatureMin: -160, temperatureMax: -70, gravity: 1.25, baseDiameterKm: 15000, maxFields: 190, metalBonus: +20, crystalBonus: +15, deuteriumBonus: +45, powerEfficiency: 75, description: 'Massive cold world featuring liquid ammonia and water geysers.' },
    { id: 'ice-05', name: 'Snowball Silicate Core', code: 'ICE-C1', temperatureMin: -130, temperatureMax: -50, gravity: 0.95, baseDiameterKm: 11000, maxFields: 130, metalBonus: +15, crystalBonus: +10, deuteriumBonus: +30, powerEfficiency: 80, description: 'Fully frozen silicate crust with high density iron core.' },
    { id: 'ice-06', name: 'Cometary Dust Glacial', code: 'ICE-C2', temperatureMin: -180, temperatureMax: -100, gravity: 0.65, baseDiameterKm: 8500, maxFields: 90, metalBonus: -15, crystalBonus: -10, deuteriumBonus: +55, powerEfficiency: 55, description: 'Primitive captured cometary body with extreme volatile concentration.' },
    { id: 'ice-07', name: 'Glacial Abyss Trench World', code: 'ICE-D1', temperatureMin: -140, temperatureMax: -60, gravity: 1.05, baseDiameterKm: 12500, maxFields: 165, metalBonus: +25, crystalBonus: +20, deuteriumBonus: +35, powerEfficiency: 85, description: 'Deep tectonic ice rifts heated by geothermal friction.' },
  ],
},
{
  classId: 'volcanic_magma',
  className: 'Class IV: Volcanic & Magma Worlds',
  categoryCode: 'VOL',
  description: 'Geologically hyper-active worlds bathed in rivers of molten lava and sulfur smoke.',
  subClasses: [
    { id: 'vol-01', name: 'Magma Ocean World', code: 'VOL-A1', temperatureMin: 200, temperatureMax: 650, gravity: 1.15, baseDiameterKm: 11000, maxFields: 140, metalBonus: +50, crystalBonus: +40, deuteriumBonus: +10, powerEfficiency: 180, description: 'Molten silicate surface crust with immense geothermal energy.' },
    { id: 'vol-02', name: 'Sulfur Volcanic Caldera', code: 'VOL-A2', temperatureMin: 150, temperatureMax: 480, gravity: 0.9, baseDiameterKm: 10400, maxFields: 120, metalBonus: +35, crystalBonus: +50, deuteriumBonus: 0, powerEfficiency: 160, description: 'Sulfur dioxide plumes and extensive volcanic highlands.' },
    { id: 'vol-03', name: 'Tectonic Rift Planet', code: 'VOL-B1', temperatureMin: 120, temperatureMax: 400, gravity: 1.2, baseDiameterKm: 12200, maxFields: 170, metalBonus: +60, crystalBonus: +30, deuteriumBonus: +15, powerEfficiency: 170, description: 'Crust torn apart by titanic tidal forces with rich deep core ores.' },
    { id: 'vol-04', name: 'Basaltic Super-Io', code: 'VOL-B2', temperatureMin: 180, temperatureMax: 550, gravity: 0.98, baseDiameterKm: 9900, maxFields: 110, metalBonus: +45, crystalBonus: +35, deuteriumBonus: +5, powerEfficiency: 190, description: 'Continuous tidal friction driving 400km high volcanic eruptions.' },
    { id: 'vol-05', name: 'Pyroclastic Ash World', code: 'VOL-C1', temperatureMin: 100, temperatureMax: 350, gravity: 1.05, baseDiameterKm: 11500, maxFields: 150, metalBonus: +40, crystalBonus: +20, deuteriumBonus: +20, powerEfficiency: 150, description: 'Thick abrasive ash clouds covering dense metallic mineral basins.' },
    { id: 'vol-06', name: 'Iron-Core Magma Globe', code: 'VOL-C2', temperatureMin: 250, temperatureMax: 720, gravity: 1.35, baseDiameterKm: 11800, maxFields: 160, metalBonus: +75, crystalBonus: +25, deuteriumBonus: 0, powerEfficiency: 200, description: 'Exposed planetary core generating extreme magnetic and thermal output.' },
    { id: 'vol-07', name: 'Hydrothermal Vent Magma', code: 'VOL-D1', temperatureMin: 140, temperatureMax: 450, gravity: 1.08, baseDiameterKm: 12800, maxFields: 175, metalBonus: +55, crystalBonus: +45, deuteriumBonus: +25, powerEfficiency: 165, description: 'Sub-crustal superheated water mingling with molten magma chambers.' },
  ],
},
{
  classId: 'gas_giant',
  className: 'Class V: Gas Giants & Sub-Giants',
  categoryCode: 'GAS',
  description: 'Colossal hydrogen-helium planetary giants with floating cloud-city industrial platforms.',
  subClasses: [
    { id: 'gas-01', name: 'Hydrogen-Helium Giant', code: 'GAS-A1', temperatureMin: -140, temperatureMax: -30, gravity: 2.5, baseDiameterKm: 142000, maxFields: 350, metalBonus: -50, crystalBonus: -50, deuteriumBonus: +200, powerEfficiency: 80, description: 'Enormous gas giant with virtually limitless atmospheric Deuterium.' },
    { id: 'gas-02', name: 'Super-Jovian Hot Giant', code: 'GAS-A2', temperatureMin: 400, temperatureMax: 1400, gravity: 3.1, baseDiameterKm: 180000, maxFields: 400, metalBonus: -40, crystalBonus: -30, deuteriumBonus: +250, powerEfficiency: 220, description: 'Close-orbit giant with supersonic winds and metallic hydrogen mantle.' },
    { id: 'gas-03', name: 'Ice Giant Sub-Neptune', code: 'GAS-B1', temperatureMin: -180, temperatureMax: -90, gravity: 1.8, baseDiameterKm: 49000, maxFields: 250, metalBonus: -20, crystalBonus: 0, deuteriumBonus: +150, powerEfficiency: 90, description: 'Rich water, ammonia, and methane mantle with dense atmospheric pressure.' },
    { id: 'gas-04', name: 'Helium-3 Rich Sub-Giant', code: 'GAS-B2', temperatureMin: -110, temperatureMax: -20, gravity: 2.1, baseDiameterKm: 95000, maxFields: 300, metalBonus: -45, crystalBonus: -40, deuteriumBonus: +300, powerEfficiency: 100, description: 'Anomalous isotopic concentration ideal for advanced fusion reactors.' },
    { id: 'gas-05', name: 'Ringed Chronos Giant', code: 'GAS-C1', temperatureMin: -130, temperatureMax: -40, gravity: 2.3, baseDiameterKm: 120000, maxFields: 320, metalBonus: -30, crystalBonus: +50, deuteriumBonus: +180, powerEfficiency: 95, description: 'Encircled by billions of pristine ice and silicate boulder rings.' },
    { id: 'gas-06', name: 'Brown Dwarf Failed Star', code: 'GAS-C2', temperatureMin: 500, temperatureMax: 1800, gravity: 4.5, baseDiameterKm: 85000, maxFields: 280, metalBonus: 0, crystalBonus: +20, deuteriumBonus: +400, powerEfficiency: 300, description: 'Sub-stellar object sustaining deuterium and lithium thermonuclear fusion.' },
    { id: 'gas-07', name: 'Storm-Torn Jovian Titan', code: 'GAS-D1', temperatureMin: -90, temperatureMax: 10, gravity: 2.8, baseDiameterKm: 155000, maxFields: 380, metalBonus: -50, crystalBonus: -20, deuteriumBonus: +280, powerEfficiency: 140, description: 'Perpetual megastorms generating gigawatt atmospheric lightning grids.' },
  ],
},
{
  classId: 'exotic_moon',
  className: 'Class VI: Exotic Moons & Asteroids',
  categoryCode: 'MOON',
  description: 'Natural or artificial small bodies orbiting larger primaries with unique orbital resonance.',
  subClasses: [
    { id: 'mon-01', name: 'Captured Asteroid Moon', code: 'MON-A1', temperatureMin: -100, temperatureMax: 80, gravity: 0.35, baseDiameterKm: 450, maxFields: 75, metalBonus: +30, crystalBonus: +40, deuteriumBonus: -10, powerEfficiency: 110, description: 'High metal and ore concentration captured in close planetary orbit.' },
    { id: 'mon-02', name: 'Tidally Locked Silicate Moon', code: 'MON-A2', temperatureMin: -120, temperatureMax: 110, gravity: 0.42, baseDiameterKm: 1200, maxFields: 95, metalBonus: +40, crystalBonus: +30, deuteriumBonus: 0, powerEfficiency: 120, description: 'Permanent light side and dark side with extreme thermal differential.' },
    { id: 'mon-03', name: 'Artificial Dyson Satellites', code: 'MON-B1', temperatureMin: -50, temperatureMax: 50, gravity: 0.1, baseDiameterKm: 100, maxFields: 120, metalBonus: +50, crystalBonus: +60, deuteriumBonus: +50, powerEfficiency: 400, description: 'Precursor orbital platform constructed from refined megastructure alloys.' },
    { id: 'mon-04', name: 'Crystalline Resonance Moon', code: 'MON-B2', temperatureMin: -60, temperatureMax: 40, gravity: 0.5, baseDiameterKm: 2100, maxFields: 110, metalBonus: +10, crystalBonus: +90, deuteriumBonus: +10, powerEfficiency: 130, description: 'Resonant quartz lattice crust amplifying energy grid outputs.' },
    { id: 'mon-05', name: 'Metallic Core Fragment', code: 'MON-C1', temperatureMin: -40, temperatureMax: 120, gravity: 0.58, baseDiameterKm: 1800, maxFields: 100, metalBonus: +90, crystalBonus: 0, deuteriumBonus: -20, powerEfficiency: 125, description: 'Differentiated iron-nickel asteroid core with pure metallic ore.' },
    { id: 'mon-06', name: 'Radioactive Isotope Moon', code: 'MON-C2', temperatureMin: 20, temperatureMax: 150, gravity: 0.48, baseDiameterKm: 1500, maxFields: 90, metalBonus: +20, crystalBonus: +20, deuteriumBonus: +80, powerEfficiency: 250, description: 'Heavy actinide deposits emitting natural thermal and electrical power.' },
    { id: 'mon-07', name: 'Sub-Space Beacon Monolith', code: 'MON-D1', temperatureMin: -20, temperatureMax: 20, gravity: 0.2, baseDiameterKm: 300, maxFields: 150, metalBonus: +50, crystalBonus: +100, deuteriumBonus: +100, powerEfficiency: 500, description: 'Ancient precursor monolith broadcasting subspace intelligence.' },
  ],
},
];
