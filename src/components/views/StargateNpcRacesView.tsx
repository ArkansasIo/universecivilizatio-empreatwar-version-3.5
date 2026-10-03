import React, { useState } from 'react';
import {
  Shield,
  Swords,
  Search,
  Filter,
  Eye,
  Radio,
  RadioTower,
  Sparkles,
  Award,
  Globe,
  Compass,
  AlertTriangle,
  Info,
  ChevronRight,
  Database,
  ExternalLink,
  CheckCircle2,
  X,
  Target,
} from 'lucide-react';
import {
  STARGATE_NPC_RACES,
  getNpcRacesByGalaxy,
  getNpcRacesByThreat,
  getNpcRacesBySeries,
} from '../../stargateNpcRacesData';
import { StargateNpcRace, PlayerProfile, PlayerResources } from '../../types';
import { sound } from '../../sound';

interface StargateNpcRacesViewProps {
  playerProfile: PlayerProfile;
  resources: PlayerResources;
  onNavigate?: (routeId: string) => void;
}

export const StargateNpcRacesView: React.FC<StargateNpcRacesViewProps> = ({
  playerProfile,
  resources,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGalaxy, setSelectedGalaxy] = useState<string>('ALL');
  const [selectedThreat, setSelectedThreat] = useState<string>('ALL');
  const [selectedSeries, setSelectedSeries] = useState<string>('ALL');
  const [selectedRace, setSelectedRace] = useState<StargateNpcRace | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [simulatingCombatId, setSimulatingCombatId] = useState<string | null>(null);

  // Filter logic
  const filteredRaces = STARGATE_NPC_RACES.filter((race) => {
    const matchesSearch =
      race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.factionLeader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.homeworld.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.flagshipClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.canonicalSeries.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGalaxy = selectedGalaxy === 'ALL' || race.galaxy === selectedGalaxy;
    const matchesThreat = selectedThreat === 'ALL' || race.threatLevel === selectedThreat;
    const matchesSeries = selectedSeries === 'ALL' || race.canonicalSeries === selectedSeries;

    return matchesSearch && matchesGalaxy && matchesThreat && matchesSeries;
  });

  const galaxies = ['ALL', 'Milky Way', 'Pegasus', 'Ori Galaxy', 'Destiny Cosmic Void'];
  const threatLevels = [
    'ALL',
    'Harmless / Pacifist',
    'Moderate / Cautious',
    'High / Aggressive',
    'Extinction Level / Cataclysmic',
  ];
  const seriesList = ['ALL', 'Stargate SG-1', 'Stargate Atlantis', 'Stargate Universe'];

  const handleSimulateScan = (race: StargateNpcRace) => {
    sound.play('ping');
    setSimulatingCombatId(race.id);
    setActionFeedback(`Subspace sensor array pinging ${race.homeworld}... Calculating defense frequency.`);
    setTimeout(() => {
      setSimulatingCombatId(null);
      sound.play('confirm');
      setActionFeedback(
        `Sensor reconnaissance confirmed! ${race.name} flagship: ${race.flagshipClass} (Tech Tier ${race.combatStats.technologicalTier}/10). Estimated Fleet Strength: ${race.fleetStrength.toLocaleString()} Power Units.`
      );
    }, 1200);
  };

  const handleDispatchDiplomat = (race: StargateNpcRace) => {
    sound.play('click');
    if (race.diplomaticStatus === 'Hostile' || race.threatLevel === 'Extinction Level / Cataclysmic') {
      sound.play('warning');
      setActionFeedback(
        `DIPLOMATIC ALERT: ${race.name} rejected transmission! Faction leader ${race.factionLeader} maintains active hostilities against the Tau'ri coalition.`
      );
    } else if (race.diplomaticStatus === 'Ascended / Beyond Contact') {
      sound.play('ping');
      setActionFeedback(
        `ASCENSION SHIELD: ${race.name} exist on a higher plane of consciousness and do not intervene directly in mortal affairs.`
      );
    } else {
      sound.play('success');
      setActionFeedback(
        `Diplomatic envoy dispatched to ${race.homeworld}! SGC envoys opened formal non-aggression protocols with ${race.factionLeader}.`
      );
    }
  };

  const getThreatBadgeClass = (threat: string) => {
    switch (threat) {
      case 'Extinction Level / Cataclysmic':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High / Aggressive':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Moderate / Cautious':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getDiplomaticBadgeClass = (status: string) => {
    switch (status) {
      case 'Hostile':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Alliance Partner':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rogue / Marauder':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Ascended / Beyond Contact':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div id="stargate-npc-races-view" className="space-y-6">
      {/* 1. TOP HEADER & SGC BANNER */}
      <div className="border border-[#dedede] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌌</span>
              <h1 className="text-xl font-black text-[#111111] uppercase tracking-wider">
                Stargate Command: 18 Sovereign Alien NPC Races
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200">
                SGC Level-4 Dossier
              </span>
            </div>
            <p className="text-xs text-[#666666] max-w-3xl">
              Official catalog of 18 canonical non-player civilizations from <strong className="text-neutral-800">Stargate SG-1</strong>,{' '}
              <strong className="text-neutral-800">Stargate Atlantis</strong>, and <strong className="text-neutral-800">Stargate Universe</strong>.
              Review diplomatic postures, stargate coordinate sequences, technological tiers, and planetary homeworlds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigate && (
              <button
                type="button"
                id="btn-goto-targets"
                onClick={() => {
                  sound.play('click');
                  onNavigate('targets');
                }}
                className="px-3.5 py-2 border border-[#dedede] bg-white hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-neutral-800 shadow-sm"
              >
                <Target size={14} />
                <span>Duel NPC Targets</span>
              </button>
            )}
            {onNavigate && (
              <button
                type="button"
                id="btn-goto-stargate"
                onClick={() => {
                  sound.play('click');
                  onNavigate('stargate-network');
                }}
                className="px-3.5 py-2 border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
              >
                <Radio size={14} />
                <span>Dial Stargate Network</span>
              </button>
            )}
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#eeeeee]">
          <div className="bg-neutral-50 border border-neutral-200 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Total Alien Races</span>
            <span className="text-lg font-black text-neutral-900">18 Canon Races</span>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Cataclysmic Threats</span>
            <span className="text-lg font-black text-red-600">4 Apex Threats</span>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Galaxies Cataloged</span>
            <span className="text-lg font-black text-blue-600">4 Deep Galaxies</span>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Max Tech Tier (Tier 10)</span>
            <span className="text-lg font-black text-amber-600">Ori & Ancients</span>
          </div>
        </div>

        {/* FEEDBACK PROMPT */}
        {actionFeedback && (
          <div className="mt-4 p-3 border border-blue-200 bg-blue-50/70 text-xs font-medium text-blue-900 flex items-start gap-2 animate-fadeIn">
            <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{actionFeedback}</div>
            <button
              type="button"
              onClick={() => setActionFeedback(null)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 2. FILTER CONTROLS & SEARCH */}
      <div className="border border-[#dedede] bg-white p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by race, leader (e.g. Todd, Bra'tac), homeworld, flagship, or series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-blue-500 text-neutral-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold">
              <Filter size={14} />
              <span>Galaxy:</span>
            </div>
            <select
              value={selectedGalaxy}
              onChange={(e) => {
                setSelectedGalaxy(e.target.value);
                sound.play('click');
              }}
              className="px-2.5 py-1.5 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {galaxies.map((g) => (
                <option key={g} value={g}>
                  {g === 'ALL' ? 'All Galaxies' : g}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold ml-2">
              <span>Threat:</span>
            </div>
            <select
              value={selectedThreat}
              onChange={(e) => {
                setSelectedThreat(e.target.value);
                sound.play('click');
              }}
              className="px-2.5 py-1.5 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {threatLevels.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Threats' : t}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold ml-2">
              <span>Series:</span>
            </div>
            <select
              value={selectedSeries}
              onChange={(e) => {
                setSelectedSeries(e.target.value);
                sound.play('click');
              }}
              className="px-2.5 py-1.5 border border-neutral-300 text-xs bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {seriesList.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All TV Series' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-neutral-500 flex items-center justify-between">
          <span>
            Showing <strong className="text-neutral-800">{filteredRaces.length}</strong> of 18 Stargate Alien Civilizations
          </span>
          {(selectedGalaxy !== 'ALL' || selectedThreat !== 'ALL' || selectedSeries !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedGalaxy('ALL');
                setSelectedThreat('ALL');
                setSelectedSeries('ALL');
                setSearchQuery('');
                sound.play('click');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. 18 RACES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRaces.map((race) => {
          const isSimulating = simulatingCombatId === race.id;
          return (
            <div
              key={race.id}
              id={`race-card-${race.id}`}
              className="border border-[#dedede] bg-white flex flex-col justify-between hover:border-neutral-400 transition-shadow hover:shadow-md"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-[#eeeeee] space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 bg-neutral-100 rounded-sm border border-neutral-200 leading-none">
                      {race.avatarEmoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-[#111111] leading-tight flex items-center gap-1.5">
                        {race.name}
                      </h3>
                      <p className="text-[11px] text-[#666666] leading-tight">{race.designationOrTitle}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-neutral-200 bg-neutral-50 text-neutral-600 whitespace-nowrap">
                    {race.canonicalSeries}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                    <Globe size={10} />
                    {race.galaxy}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getThreatBadgeClass(
                      race.threatLevel
                    )}`}
                  >
                    {race.threatLevel}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getDiplomaticBadgeClass(
                      race.diplomaticStatus
                    )}`}
                  >
                    {race.diplomaticStatus}
                  </span>
                </div>
              </div>

              {/* Card Body & Specs */}
              <div className="p-4 space-y-3 text-xs flex-1">
                {/* Homeworld & Stargate Coordinate */}
                <div className="space-y-1 bg-neutral-50 p-2.5 border border-neutral-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-semibold flex items-center gap-1">
                      <Compass size={11} /> Homeworld:
                    </span>
                    <span className="font-bold text-neutral-800">{race.homeworld}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-semibold flex items-center gap-1">
                      <RadioTower size={11} /> Gate Address:
                    </span>
                    <span className="font-mono font-bold text-blue-700 tracking-wider text-[10px]">
                      {race.stargateAddress}
                    </span>
                  </div>
                </div>

                {/* Flagship & Leader */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Leader</span>
                    <span className="font-semibold text-neutral-900 truncate block" title={race.factionLeader}>
                      {race.factionLeader}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Technological Tier</span>
                    <span className="font-bold text-amber-700">
                      Tier {race.combatStats.technologicalTier} / 10
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold">Flagship Class</span>
                  <span className="font-medium text-neutral-800 text-[11px] block truncate" title={race.flagshipClass}>
                    {race.flagshipClass}
                  </span>
                </div>

                {/* Tactical Stats Mini Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-600 font-semibold">
                    <span>Attack Bonus: +{race.combatStats.attackBonusPercent}%</span>
                    <span>Shield Harmonics: {race.combatStats.shieldHarmonicsPercent}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${Math.min(100, race.combatStats.shieldHarmonicsPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Lore Excerpt */}
                <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  {race.loreDescription}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 border-t border-[#eeeeee] bg-neutral-50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id={`btn-dossier-${race.id}`}
                  onClick={() => {
                    sound.play('click');
                    setSelectedRace(race);
                  }}
                  className="px-2.5 py-1.5 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-2xs flex-1 justify-center"
                >
                  <Eye size={12} />
                  <span>Dossier</span>
                </button>

                <button
                  type="button"
                  id={`btn-scan-${race.id}`}
                  disabled={isSimulating}
                  onClick={() => handleSimulateScan(race)}
                  className="px-2.5 py-1.5 border border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-2xs flex-1 justify-center"
                >
                  <Radio size={12} className={isSimulating ? 'animate-spin' : ''} />
                  <span>{isSimulating ? 'Scanning...' : 'Scan'}</span>
                </button>

                <button
                  type="button"
                  id={`btn-diplomat-${race.id}`}
                  onClick={() => handleDispatchDiplomat(race)}
                  className="px-2.5 py-1.5 border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-2xs flex-1 justify-center"
                >
                  <Shield size={12} />
                  <span>Pact</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. DOSSIER DETAILS MODAL / DRAWER */}
      {selectedRace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            id="race-dossier-modal"
            className="border border-neutral-300 bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-neutral-100 border border-neutral-200">
                  {selectedRace.avatarEmoji}
                </span>
                <div>
                  <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wider">
                    {selectedRace.name}
                  </h2>
                  <p className="text-xs text-neutral-600 font-medium">
                    {selectedRace.designationOrTitle} • Canonical {selectedRace.canonicalSeries}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRace(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              {/* Classification & Origin */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-50 p-3 border border-neutral-200">
                <div>
                  <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Galaxy</span>
                  <span className="font-bold text-neutral-900">{selectedRace.galaxy}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Classification</span>
                  <span className="font-bold text-neutral-900">{selectedRace.classification}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Threat Level</span>
                  <span className="font-bold text-red-600">{selectedRace.threatLevel}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Diplomacy</span>
                  <span className="font-bold text-blue-700">{selectedRace.diplomaticStatus}</span>
                </div>
              </div>

              {/* Full Lore Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
                  SGC Intelligence Background
                </h4>
                <p className="text-neutral-700 leading-relaxed bg-neutral-50/50 p-3 border border-neutral-200">
                  {selectedRace.loreDescription}
                </p>
                <p className="text-[11px] text-neutral-500 italic">
                  Debut Reference: {selectedRace.firstAppearanceEpisode}
                </p>
              </div>

              {/* Coordinates & Gate Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-neutral-200 p-3 space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold">Homeworld / Sector</span>
                  <p className="font-bold text-neutral-900">{selectedRace.homeworld}</p>
                </div>
                <div className="border border-neutral-200 p-3 space-y-1">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold">Stargate Dialing Glyphs</span>
                  <p className="font-mono font-bold text-blue-700 text-sm tracking-widest">
                    {selectedRace.stargateAddress}
                  </p>
                </div>
              </div>

              {/* Flagship & Tactical Traits */}
              <div className="border border-neutral-200 p-3 space-y-2">
                <h4 className="font-bold text-neutral-900 uppercase text-[11px] tracking-wider">
                  Military Fleet Specifications & Traits
                </h4>
                <p className="font-semibold text-neutral-800">
                  Primary Flagship: <span className="font-normal text-neutral-600">{selectedRace.flagshipClass}</span>
                </p>
                <p className="font-semibold text-neutral-800">
                  Estimated Fleet Strength: <span className="font-mono text-blue-700">{selectedRace.fleetStrength.toLocaleString()}</span>
                </p>

                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Identified Tactical Doctrines:</span>
                  <ul className="list-disc list-inside space-y-1 text-neutral-700">
                    {selectedRace.tacticalTraits.map((trait, idx) => (
                      <li key={idx} className="leading-snug">{trait}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Estimated Resource Plunder if Defeated */}
              <div className="border border-amber-200 bg-amber-50/50 p-3 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase text-[11px] tracking-wider">
                  <Database size={13} />
                  <span>Estimated Galactic Vault Plunder Yield</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-800">
                  <div className="bg-white p-2 border border-amber-200">
                    <span className="text-[10px] text-neutral-500 block">Naquadah</span>
                    <span className="font-bold font-mono text-amber-700">
                      +{selectedRace.resourceLoot.naquadah.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-2 border border-amber-200">
                    <span className="text-[10px] text-neutral-500 block">Metal / Trinium</span>
                    <span className="font-bold font-mono text-neutral-800">
                      +{selectedRace.resourceLoot.metalOrTrinium.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-2 border border-amber-200">
                    <span className="text-[10px] text-neutral-500 block">Control Crystals</span>
                    <span className="font-bold font-mono text-blue-700">
                      +{selectedRace.resourceLoot.crystal.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white p-2 border border-amber-200">
                    <span className="text-[10px] text-neutral-500 block">Deuterium</span>
                    <span className="font-bold font-mono text-emerald-700">
                      +{selectedRace.resourceLoot.deuterium.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setSelectedRace(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 font-bold uppercase tracking-wider text-xs hover:bg-neutral-100"
              >
                Close Dossier
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    setSelectedRace(null);
                    onNavigate('targets');
                  }}
                  className="px-4 py-2 border border-red-600 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Swords size={14} />
                  <span>Assault via SGC Targets</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
