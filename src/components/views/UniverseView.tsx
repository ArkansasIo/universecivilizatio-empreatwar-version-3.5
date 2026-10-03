import React, { useState, useEffect } from 'react';
import {
  Compass,
  Globe,
  Shield,
  Zap,
  Crosshair,
  Sparkles,
  Navigation,
  AlertTriangle,
  Eye,
  Rocket,
  ArrowRight,
  Layers,
  Radio,
  Share2,
  Atom,
  Search,
  CheckCircle2,
  Bookmark,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Flame,
  Award,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources, PlanetColony } from '../../types';
import {
  MULTIVERSE_UNIVERSES,
  MultiverseUniverse,
  UniverseGalaxy,
  getUniverseData,
  getGalaxiesForUniverse,
  parseMultiverseCoordinate,
} from '../../multiverseData';

interface UniverseViewProps {
  resources: PlayerResources;
  planets: PlanetColony[];
  onColonizePlanet: (coordinate: string, biome: string, name: string) => { success: boolean; message: string };
  onNavigate: (route: string) => void;
  onUpdateResources?: (res: Partial<PlayerResources>) => void;
}

interface SolarSystemBody {
  position: number;
  name: string;
  biome: 'Terrestrial' | 'Desert' | 'Ice' | 'Volcanic' | 'Ocean' | 'Gas Giant' | 'Jungle' | 'Tomb World' | 'Metallic' | 'Crystalline';
  temperature: string;
  sizeKm: number;
  fields: number;
  hasMoon: boolean;
  owner?: string;
  isColonized: boolean;
  globalPlanetId: number;
  stargateCoordinate: string;
}

const BIOME_DESCRIPTIONS: Record<string, { desc: string; temp: string; color: string; bonuses: string }> = {
  Terrestrial: { desc: 'Temperate world with robust atmospheric pressure and fertile crust.', temp: '+15°C', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300', bonuses: '+15% Metal Yield, Balanced Orbits' },
  Desert: { desc: 'Arid mineral-rich crust with high abundance of heavy silicates.', temp: '+65°C', color: 'bg-amber-500/10 text-amber-700 border-amber-300', bonuses: '+30% Crystal Yield, Solar Intensity Boost' },
  Ice: { desc: 'Frozen glacial sphere containing massive underground deuterium reserves.', temp: '-140°C', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-300', bonuses: '+45% Deuterium Synthesis, Low Heat Dissipation' },
  Volcanic: { desc: 'Extreme magmatic mantle ideal for heavy armor and metallurgy works.', temp: '+320°C', color: 'bg-rose-500/10 text-rose-700 border-rose-300', bonuses: '+50% Metal Extraction, Volley Power +10%' },
  Ocean: { desc: 'Deep liquid hydrosphere with high deuterium concentrations.', temp: '+22°C', color: 'bg-blue-500/10 text-blue-700 border-blue-300', bonuses: '+40% Deuterium Yield, Shield Harmonic Purity' },
  'Gas Giant': { desc: 'Massive atmospheric leviathan with pressurized plasma clouds.', temp: '-50°C', color: 'bg-purple-500/10 text-purple-700 border-purple-300', bonuses: '+100% Energy Generation from Solar Collectors' },
  Jungle: { desc: 'Dense tropical canopy teeming with biological biomass and rapid resource recycling.', temp: '+30°C', color: 'bg-green-500/10 text-green-700 border-green-300', bonuses: '+20% Population Growth, Biomass Refinement' },
  'Tomb World': { desc: 'Ancient irradiated wasteland containing dormant precursor artifacts.', temp: '-10°C', color: 'bg-zinc-500/10 text-zinc-700 border-zinc-300', bonuses: '+35% Tech Research Speed, Salvage Yields' },
  Metallic: { desc: 'Solid iron-nickel core planetoid with high structural density.', temp: '+80°C', color: 'bg-orange-500/10 text-orange-700 border-orange-300', bonuses: '+60% Metal Output, Hull Armor Durability +15%' },
  Crystalline: { desc: 'Glittering quartz crust refracting energy beams across the sector.', temp: '+10°C', color: 'bg-indigo-500/10 text-indigo-700 border-indigo-300', bonuses: '+50% Crystal Extract, Quantum Sensor Range' },
};

export const UniverseView: React.FC<UniverseViewProps> = ({
  resources,
  planets,
  onColonizePlanet,
  onNavigate,
  onUpdateResources,
}) => {
  // Current Active Universe (1 to 30) and Active Galaxy (1 to 90)
  const [currentUniverseId, setCurrentUniverseId] = useState<number>(() => {
    const saved = localStorage.getItem('uc_player_current_universe');
    return saved ? Math.max(1, Math.min(30, parseInt(saved, 10))) : 1;
  });

  const [currentGalaxyId, setCurrentGalaxyId] = useState<number>(() => {
    const saved = localStorage.getItem('uc_player_current_galaxy');
    return saved ? Math.max(1, Math.min(90, parseInt(saved, 10))) : 1;
  });

  const [selectedSystem, setSelectedSystem] = useState<number>(104);
  const [activeTab, setActiveTab] = useState<'system' | 'galaxies' | 'multiverse' | 'supergate'>('system');
  const [galaxySearch, setGalaxySearch] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Save locations
  useEffect(() => {
    localStorage.setItem('uc_player_current_universe', currentUniverseId.toString());
  }, [currentUniverseId]);

  useEffect(() => {
    localStorage.setItem('uc_player_current_galaxy', currentGalaxyId.toString());
  }, [currentGalaxyId]);

  const activeUniverse: MultiverseUniverse = getUniverseData(currentUniverseId);
  const galaxiesInUniverse: UniverseGalaxy[] = getGalaxiesForUniverse(currentUniverseId);
  const activeGalaxy = galaxiesInUniverse.find((g) => g.galaxyNumber === currentGalaxyId) || galaxiesInUniverse[0];

  // Deterministic System Solar Bodies
  const generateSystemBodies = (uId: number, gId: number, sId: number): SolarSystemBody[] => {
    const biomes: SolarSystemBody['biome'][] = [
      'Terrestrial', 'Desert', 'Ice', 'Volcanic', 'Ocean', 'Gas Giant', 'Jungle', 'Tomb World', 'Metallic', 'Crystalline',
    ];
    const names = ['Prime', 'Secundus', 'Tertius', 'Majoris', 'Minoris', 'Apex', 'Core', 'Vanguard', 'Horizon', 'Outpost', 'Haven', 'Nexus', 'Echo', 'Throne', 'Sanctuary'];

    return Array.from({ length: 15 }, (_, i) => {
      const pos = i + 1;
      const seed = uId * 1000000 + gId * 10000 + sId * 100 + pos;
      const biome = biomes[(seed * 7) % biomes.length];
      
      const coordString = `${gId}:${sId}:${pos}`;
      const multiCoordString = `[U${uId}:G${gId}:S${sId}:P${pos}]`;
      const isPlayerColony = planets.some((p) => p.coordinate === coordString || p.coordinate === multiCoordString);
      const hasEnemy = !isPlayerColony && (pos % 3 === 0 || pos === 5 || pos === 12);
      
      const parsed = parseMultiverseCoordinate(uId, gId, sId, pos);

      return {
        position: pos,
        name: `World [U${uId}:G${gId}:S${sId}:P${pos}] · ${names[i]}`,
        biome,
        temperature: BIOME_DESCRIPTIONS[biome]?.temp || '+20°C',
        sizeKm: 7500 + ((seed * 17) % 18000),
        fields: 110 + ((seed * 11) % 160),
        hasMoon: pos % 3 === 0,
        owner: isPlayerColony
          ? 'Commander (You)'
          : hasEnemy
          ? ['Zergon Hegemony', 'Syndicate Remnant', 'Void Nomads', 'Ori Inquisitor Armada', 'Lucian Cartel', 'Asgard Automatons'][(seed * 3) % 6]
          : undefined,
        isColonized: isPlayerColony,
        globalPlanetId: parsed.globalPlanetId,
        stargateCoordinate: multiCoordString,
      };
    });
  };

  const currentBodies = generateSystemBodies(currentUniverseId, currentGalaxyId, selectedSystem);

  // Inter-Universal Dimensional Travel handler
  const handleUniversalJump = (targetUniverseId: number) => {
    if (targetUniverseId === currentUniverseId) {
      setFeedback({ type: 'info', text: `Already stationed in ${activeUniverse.name}.` });
      return;
    }

    const targetUniv = getUniverseData(targetUniverseId);
    const deutCost = targetUniv.travelDeuteriumCost;
    const turnsCost = targetUniv.travelTurnsCost;

    if (resources.deuterium < deutCost) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient Deuterium! Dimensional Supergate jump to Universe ${targetUniverseId} requires ${deutCost.toLocaleString()} Deuterium (You have: ${resources.deuterium.toLocaleString()}).`,
      });
      return;
    }

    if (resources.attackTurns < turnsCost) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient Dimensional Warp Turns! Travel requires ${turnsCost} Turns (You have: ${resources.attackTurns}).`,
      });
      return;
    }

    // Perform Jump
    setIsJumping(true);
    sound.play('warp_pulse');

    if (onUpdateResources) {
      onUpdateResources({
        deuterium: Math.max(0, resources.deuterium - deutCost),
        attackTurns: Math.max(0, resources.attackTurns - turnsCost),
      });
    }

    setTimeout(() => {
      setCurrentUniverseId(targetUniverseId);
      setCurrentGalaxyId(1);
      setSelectedSystem(104);
      setIsJumping(false);
      sound.play('success');
      setFeedback({
        type: 'success',
        text: `🚀 DIMENSIONAL SUPERGATE TRANSIT COMPLETE: Welcome to ${targetUniv.name}! Cosmic Modifier [${targetUniv.cosmicModifier.label}] is now active across all 90 galaxies.`,
      });
    }, 800);
  };

  // Inter-Galactic Warp Travel handler
  const handleGalacticWarp = (targetGalaxyId: number) => {
    if (targetGalaxyId === currentGalaxyId) return;
    sound.play('warp_pulse');
    setCurrentGalaxyId(targetGalaxyId);
    setSelectedSystem(1);
    setFeedback({
      type: 'success',
      text: `Hyperspace drive locked. Arrived at Galaxy ${targetGalaxyId}: ${galaxiesInUniverse[targetGalaxyId - 1]?.name || ''}.`,
    });
  };

  const handleColonize = (body: SolarSystemBody) => {
    const coord = `${currentGalaxyId}:${selectedSystem}:${body.position}`;
    if (resources.deuterium < 10000 || resources.crystal < 15000) {
      sound.play('warning');
      setFeedback({ type: 'error', text: 'Colonization requires 10,000 Deuterium and 15,000 Crystal.' });
      return;
    }

    const res = onColonizePlanet(coord, body.biome, `Colony U${currentUniverseId}-G${currentGalaxyId}-S${selectedSystem}-P${body.position}`);
    if (res.success) {
      sound.play('success');
      setFeedback({ type: 'success', text: `Successfully established planetary colony at [${body.stargateCoordinate}]!` });
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const filteredGalaxies = galaxiesInUniverse.filter(
    (g) =>
      g.name.toLowerCase().includes(galaxySearch.toLowerCase()) ||
      g.galaxyNumber.toString() === galaxySearch.trim() ||
      g.primaryResourceAbundance.toLowerCase().includes(galaxySearch.toLowerCase())
  );

  return (
    <div id="universe-view" className="space-y-6">
      {/* Top Banner & Active Multiverse Realm HUD */}
      <div className="border border-[#dedede] bg-white p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                MULTIVERSE CONQUEST ARCHITECTURE · 30 UNIVERSES × 90 GALAXIES
              </span>
              <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold">
                {activeUniverse.dimensionCode}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
              <span>{activeUniverse.name}</span>
            </h2>
            <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
              {activeUniverse.tagline} Currently anchored in <strong>{activeGalaxy.name}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.play('click');
                setActiveTab('supergate');
              }}
              className="px-4 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Radio size={14} className="text-cyan-400 animate-pulse" />
              <span>Inter-Universal Supergate (30 Universes)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.play('click');
                onNavigate('planetary-invasion');
              }}
              className="px-3.5 py-2.5 border border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-[#fafafa] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Crosshair size={14} />
              <span>1-999,999 Conquest</span>
            </button>
          </div>
        </div>

        {/* Active Universe Cosmic Stat Multiplier Ribbon */}
        <div className="mt-4 pt-4 border-t border-[#eeeeee] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Cosmic Law / Modifier</span>
            <span className="font-bold text-emerald-800 text-xs block mt-0.5">
              {activeUniverse.cosmicModifier.label}
            </span>
          </div>
          <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Resonance Frequency</span>
            <span className="font-bold font-mono text-[#111111] text-xs block mt-0.5">
              {activeUniverse.dimensionalFrequency}
            </span>
          </div>
          <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Dominant Hegemony</span>
            <span className="font-bold text-[#111111] text-xs block mt-0.5 truncate">
              {activeUniverse.dominantFaction}
            </span>
          </div>
          <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
            <span className="text-[10px] font-bold text-[#777777] uppercase block">Universe Scope</span>
            <span className="font-bold text-[#111111] text-xs block mt-0.5 font-mono">
              90 Galaxies · 89,910 Star Systems
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center ${
            feedback.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : feedback.type === 'error'
              ? 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
              : 'bg-[#f0f9ff] border-[#0284c7] text-[#0284c7] border-l-4'
          }`}
        >
          <span className="leading-relaxed">{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold cursor-pointer ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-[#dedede] bg-white">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('system');
          }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'system'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Globe size={14} />
          <span>Star System & 15 Orbits</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('galaxies');
          }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'galaxies'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Layers size={14} />
          <span>All 90 Galaxies Matrix</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('supergate');
          }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'supergate'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Radio size={14} />
          <span>30 Universes Supergate</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE SYSTEM & 15 ORBITAL POSITIONS */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Astrometry Jump Selector (Galaxies 1-90 & Systems 1-999) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#fafafa] border border-[#dedede] p-6">
            <div className="md:col-span-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                  <span>Galaxy Selector (1 - 90)</span>
                  <span className="text-[10px] text-[#777777] font-normal">Active: Galaxy {currentGalaxyId}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('galaxies')}
                  className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  View All 90 Galaxies →
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[1, 5, 10, 20, 30, 45, 60, 75, 90].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGalacticWarp(g)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold border transition-colors cursor-pointer shrink-0 ${
                      currentGalaxyId === g
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-[#dedede] hover:border-[#111111]'
                    }`}
                  >
                    G{g.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <select
                  value={currentGalaxyId}
                  onChange={(e) => handleGalacticWarp(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {galaxiesInUniverse.map((g) => (
                    <option key={g.galaxyNumber} value={g.galaxyNumber}>
                      {g.name} ({g.galaxyType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col gap-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                Solar System (1 - 999)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(Math.max(1, Math.min(999, parseInt(e.target.value, 10) || 1)))}
                  className="px-3 py-2 bg-white border border-[#dedede] font-mono text-xs text-[#111111] focus:outline-none focus:border-[#111111] w-28"
                />
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    setSelectedSystem((s) => (s > 1 ? s - 1 : 999));
                  }}
                  className="px-3 py-2 bg-white border border-[#dedede] text-[#111111] text-xs font-bold hover:border-[#111111] cursor-pointer"
                  title="Previous System"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    setSelectedSystem((s) => (s < 999 ? s + 1 : 1));
                  }}
                  className="px-3 py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Next System →</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    setSelectedSystem(Math.floor(Math.random() * 999) + 1);
                  }}
                  className="px-3 py-2 bg-white border border-[#dedede] text-[#111111] text-xs font-bold hover:border-[#111111] cursor-pointer"
                  title="Random System"
                >
                  🎲 Random
                </button>
              </div>
              <div className="text-[10px] text-[#777777] font-mono">
                Active Coordinate: [U{currentUniverseId}:G{currentGalaxyId}:S{selectedSystem}:1-15]
              </div>
            </div>
          </div>

          {/* System Orbits Table (Positions 1 - 15) */}
          <div className="border border-[#dedede] bg-white overflow-hidden">
            <div className="px-6 py-4 bg-[#fafafa] border-b border-[#dedede] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                  Solar System Planetary Body Orbits (15 Orbital Slots)
                </span>
                <h3 className="text-base font-bold text-[#111111]">
                  Universe {currentUniverseId} · Galaxy {currentGalaxyId} · System {selectedSystem}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 bg-[#111111] text-white font-bold">
                  15 Planetary Orbits Online
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#dedede]">
              {currentBodies.map((body) => {
                const biomeInfo = BIOME_DESCRIPTIONS[body.biome] || BIOME_DESCRIPTIONS['Terrestrial'];

                return (
                  <div
                    key={body.position}
                    className="p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-[#fafafa]/60 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 border border-[#111111] flex flex-col items-center justify-center font-mono font-bold bg-white shrink-0">
                        <span className="text-[9px] text-[#777777]">SLOT</span>
                        <span className="text-sm text-[#111111]">#{body.position}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#111111]">{body.name}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${biomeInfo.color}`}>
                            {body.biome}
                          </span>
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-neutral-300 text-[10px] font-mono font-bold">
                            Planet ID #{body.globalPlanetId.toLocaleString()}
                          </span>
                          {body.hasMoon && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                              🌙 Orbiting Moon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#666666] mt-1 leading-relaxed max-w-2xl">
                          {biomeInfo.desc}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-[#555555] flex-wrap">
                          <span>Temp: <strong className="text-[#111111]">{body.temperature}</strong></span>
                          <span>Diameter: <strong className="text-[#111111]">{body.sizeKm.toLocaleString()} km</strong></span>
                          <span>Max Fields: <strong className="text-[#111111]">{body.fields}</strong></span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">
                          Bonus: {biomeInfo.bonuses}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          sound.play('click');
                          onNavigate('planetary-invasion');
                        }}
                        className="px-3 py-1.5 border border-[#111111] bg-white text-[#111111] text-xs font-bold hover:bg-[#111111] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        title="Open in 1-999,999 Planetary Conquest"
                      >
                        <Crosshair size={12} />
                        <span>Conquest Hub</span>
                      </button>

                      {body.isColonized ? (
                        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
                          ✓ Player Colony
                        </span>
                      ) : body.owner ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              sound.play('click');
                              onNavigate('spy');
                            }}
                            className="px-2.5 py-1.5 border border-[#dedede] bg-white text-[#111111] text-xs font-bold hover:border-[#111111] cursor-pointer"
                          >
                            Spy
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              sound.play('click');
                              onNavigate('targets');
                            }}
                            className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] cursor-pointer"
                          >
                            Attack ({body.owner})
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleColonize(body)}
                          className="px-3.5 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Rocket size={12} />
                          <span>Colonize (10k Deut / 15k Cryst)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL 90 GALAXIES IN ACTIVE UNIVERSE */}
      {activeTab === 'galaxies' && (
        <div className="space-y-6">
          <div className="bg-[#fafafa] border border-[#dedede] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                90 GALAXIES ROSTER · {activeUniverse.name}
              </span>
              <h3 className="text-xl font-bold text-[#111111]">
                Galactic Spiral Arms & Star Clusters (1 to 90)
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Each galaxy spans 999 Star Systems and 14,985 Planetary Orbits. Select any galaxy to engage hyperspace warp engines.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
                <input
                  type="text"
                  placeholder="Search 90 galaxies..."
                  value={galaxySearch}
                  onChange={(e) => setGalaxySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#dedede] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGalaxies.map((g) => {
              const isCurrent = g.galaxyNumber === currentGalaxyId;
              return (
                <div
                  key={g.galaxyNumber}
                  className={`p-5 border transition-all ${
                    isCurrent
                      ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                      : 'bg-white border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold border ${
                        isCurrent
                          ? 'bg-white/10 text-white border-white/20'
                          : 'bg-[#fafafa] text-[#111111] border-[#dedede]'
                      }`}
                    >
                      GALAXY #{g.galaxyNumber.toString().padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${
                        isCurrent ? 'text-neutral-300' : 'text-[#777777]'
                      }`}
                    >
                      {g.galaxyType}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm mt-2">{g.name}</h4>
                  
                  <div className={`mt-3 space-y-1 text-xs font-mono ${isCurrent ? 'text-neutral-300' : 'text-[#666666]'}`}>
                    <div className="flex justify-between">
                      <span>Stellar Density:</span>
                      <strong>{g.stellarDensity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Vein:</span>
                      <strong className={isCurrent ? 'text-cyan-300' : 'text-cyan-700'}>{g.primaryResourceAbundance}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Subspace Subnet:</span>
                      <strong>{g.stargateSubnetwork}</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-current/20 flex items-center justify-between">
                    <span className="text-[10px] font-mono">999 Systems</span>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active Location
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleGalacticWarp(g.galaxyNumber);
                          setActiveTab('system');
                        }}
                        className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Warp Fleet →</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: 30 MULTIVERSE UNIVERSES & INTER-UNIVERSAL SUPERGATE TRAVEL */}
      {activeTab === 'supergate' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
                INTER-UNIVERSAL SUPERGATE TRANSIT CONSOLE
              </span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-mono font-bold">
                30 Universes Linked
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#111111]">
              Multiverse Dimensional Jump Gate
            </h3>
            <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
              Travel freely across all 30 distinct Universes in the Multiverse. Each Universe governs <strong>90 unique Galaxies</strong> with distinct physical cosmic laws, resource extraction multipliers, and ruling factions.
            </p>

            <div className="mt-4 p-4 bg-[#fafafa] border border-[#dedede] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center font-bold font-mono text-sm">
                  U{currentUniverseId}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#777777] uppercase block">Current Anchored Reality</span>
                  <span className="font-bold text-sm text-[#111111]">{activeUniverse.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase">Your Deuterium:</span>
                  <strong className="text-cyan-700">{resources.deuterium.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-[#777777] block text-[10px] uppercase">Your Attack Turns:</span>
                  <strong className="text-[#111111]">{resources.attackTurns}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 30 Universes Catalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MULTIVERSE_UNIVERSES.map((univ) => {
              const isCurrent = univ.id === currentUniverseId;
              return (
                <div
                  key={univ.id}
                  className={`border p-6 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-[#111111] bg-[#fafafa] ring-2 ring-[#111111]/10'
                      : 'border-[#dedede] bg-white hover:border-[#111111]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold">
                        {univ.dimensionCode}
                      </span>
                      <span className="text-[10px] font-mono text-[#777777]">
                        {univ.dimensionalFrequency}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-[#111111] mt-2.5">
                      {univ.name}
                    </h4>
                    <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                      {univ.tagline}
                    </p>

                    {/* Cosmic Modifier Banner */}
                    <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-xs">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                        Cosmic Law Modifier:
                      </span>
                      <strong className="text-emerald-900 font-semibold text-xs block mt-0.5">
                        {univ.cosmicModifier.label}
                      </strong>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        {univ.cosmicModifier.description}
                      </p>
                    </div>

                    <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                      <div className="flex justify-between">
                        <span>Total Galaxies:</span>
                        <strong className="text-[#111111]">90 Galaxies</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Ruling Hegemony:</span>
                        <strong className="text-[#111111] truncate max-w-[170px]">{univ.dominantFaction}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#dedede] flex items-center justify-between">
                    <div className="text-[11px] font-mono text-[#777777]">
                      <span>Cost: </span>
                      <strong className="text-cyan-700">{univ.travelDeuteriumCost.toLocaleString()} Deut</strong>
                      <span> + </span>
                      <strong className="text-[#111111]">{univ.travelTurnsCost} Turns</strong>
                    </div>

                    {isCurrent ? (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active Reality
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isJumping}
                        onClick={() => handleUniversalJump(univ.id)}
                        className="px-3.5 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      >
                        <Radio size={12} className="text-cyan-400" />
                        <span>Travel Here</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
