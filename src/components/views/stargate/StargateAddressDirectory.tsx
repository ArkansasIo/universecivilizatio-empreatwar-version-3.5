import React, { useState } from 'react';
import {
  Globe,
  Radio,
  Shield,
  Zap,
  Sparkles,
  Search,
  Crosshair,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  StargateAddress,
  SGTeamUnit,
  SG_TEAMS,
} from '../../../stargateData';
import { PlayerResources } from '../../../types';

interface StargateAddressDirectoryProps {
  gates: StargateAddress[];
  selectedGateId: string;
  onSelectGate: (gate: StargateAddress) => void;
  activeWormhole: string | null;
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onLogDebrief: (log: string) => void;
  onIncrementStargateCount?: () => void;
}

export const StargateAddressDirectory: React.FC<StargateAddressDirectoryProps> = ({
  gates,
  selectedGateId,
  onSelectGate,
  activeWormhole,
  resources,
  onUpdateResources,
  onLogDebrief,
  onIncrementStargateCount,
}) => {
  const [galaxyFilter, setGalaxyFilter] = useState<'All' | 'Milky Way' | 'Pegasus' | 'Ida' | 'Universe'>('All');
  const [securityFilter, setSecurityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team-sg1');
  const [teams, setTeams] = useState<SGTeamUnit[]>(SG_TEAMS);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const selectedGate = gates.find((g) => g.id === selectedGateId) || gates[0];
  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];

  const filteredGates = gates.filter((gate) => {
    if (galaxyFilter !== 'All' && gate.galaxy !== galaxyFilter) return false;
    if (securityFilter !== 'All' && gate.securityLevel !== securityFilter) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        gate.name.toLowerCase().includes(term) ||
        gate.designation.toLowerCase().includes(term) ||
        gate.galaxy.toLowerCase().includes(term) ||
        gate.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const isCurrentWormhole = activeWormhole === selectedGate.id;

  const handleDeploySGTeam = () => {
    if (!activeWormhole) {
      sound.play('warning');
      onLogDebrief('Cannot deploy off-world: Stargate event horizon is not established! Dial a gate first.');
      return;
    }

    if (resources.attackTurns < selectedTeam.turnCost) {
      sound.play('warning');
      onLogDebrief(`Insufficient Attack Turns! Dispatching ${selectedTeam.code} requires ${selectedTeam.turnCost} Attack Turn.`);
      return;
    }

    const connectedGate = gates.find((g) => g.id === activeWormhole) || selectedGate;
    setIsDeploying(true);
    sound.play('confirm');

    setTimeout(() => {
      setIsDeploying(false);
      // Calculate loot
      let naqMult = 1.0;
      let crystMult = 1.0;
      let darkMatterBonus = 0;

      if (selectedTeam.code === 'SG-11') {
        naqMult = 2.0; // +100% mining
      } else if (selectedTeam.code === 'SG-1') {
        crystMult = 1.5;
        darkMatterBonus = 50;
      } else if (selectedTeam.code === 'SG-3') {
        naqMult = 1.4;
      }

      const lootNaq = Math.floor(connectedGate.lootEstimates.naquadah * naqMult * (0.8 + Math.random() * 0.4));
      const lootCryst = Math.floor(connectedGate.lootEstimates.crystal * crystMult * (0.8 + Math.random() * 0.4));
      const lootDm = (connectedGate.lootEstimates.darkMatter ?? 0) + darkMatterBonus;

      onUpdateResources({
        attackTurns: resources.attackTurns - selectedTeam.turnCost,
        naquadah: resources.naquadah + lootNaq,
        crystal: (resources.crystal ?? 0) + lootCryst,
        darkMatter: (resources.darkMatter ?? 0) + lootDm,
      });

      // Update team mission count
      setTeams((prev) =>
        prev.map((t) => (t.id === selectedTeam.id ? { ...t, missionsCount: t.missionsCount + 1 } : t))
      );

      if (onIncrementStargateCount) {
        onIncrementStargateCount();
      }

      // Award Stargate Relic Fragment / Shard
      if (connectedGate.lootEstimates.rareArtifact) {
        try {
          const savedRelics = localStorage.getItem('uc_stargate_relics_vault');
          if (savedRelics) {
            const parsed = JSON.parse(savedRelics);
            const updated = parsed.map((r: any) =>
              r.id === 'relic_dakara_transmuter_shard'
                ? { ...r, quantityOwned: (r.quantityOwned || 0) + 1 }
                : r
            );
            localStorage.setItem('uc_stargate_relics_vault', JSON.stringify(updated));
          }
        } catch (e) {
          console.error('Failed to update Stargate relic vault', e);
        }
      }

      sound.play('success');
      const artifactMsg = connectedGate.lootEstimates.rareArtifact
        ? ` Secured Stargate Artifact Fragment: [${connectedGate.lootEstimates.rareArtifact}] & +1 Dakara Transmuter Fragment!`
        : '';
      onLogDebrief(
        `Mission Accomplished: ${selectedTeam.code} (${selectedTeam.leader}) returned through the gate from ${connectedGate.name}! Recovered ${lootNaq.toLocaleString()} Naquadah, ${lootCryst.toLocaleString()} Crystal, and ${lootDm} Dark Matter.${artifactMsg}`
      );
    }, 1500);
  };

  return (
    <div id="stargate-address-directory" className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#dedede] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Galaxy Tabs */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {(['All', 'Milky Way', 'Pegasus', 'Ida', 'Universe'] as const).map((gal) => (
            <button
              key={gal}
              type="button"
              onClick={() => {
                sound.play('click');
                setGalaxyFilter(gal);
              }}
              className={`px-3 py-1.5 border font-bold uppercase transition-colors cursor-pointer ${
                galaxyFilter === gal
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#fafafa] text-[#555555] border-[#dedede] hover:border-[#111111]'
              }`}
            >
              {gal === 'All' ? 'All Galaxies' : gal}
            </button>
          ))}
        </div>

        {/* Search input and Security Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#777777]" />
            <input
              type="text"
              placeholder="Search planet / DHD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#fafafa] border border-[#dedede] text-xs font-mono text-[#111111] w-48 sm:w-56 focus:outline-none focus:border-[#111111]"
            />
          </div>

          <select
            value={securityFilter}
            onChange={(e) => setSecurityFilter(e.target.value)}
            className="py-1.5 px-2 bg-[#fafafa] border border-[#dedede] text-xs font-mono text-[#555555] cursor-pointer"
          >
            <option value="All">All Security</option>
            <option value="Safe">Safe</option>
            <option value="Restricted">Restricted</option>
            <option value="Hostile">Hostile</option>
            <option value="Hazardous">Hazardous</option>
            <option value="Classified">Classified</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Gate Directory List & MALP / Dossier Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Address Roster Cards */}
        <div className="lg:col-span-6 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredGates.map((gate) => {
            const isSelected = gate.id === selectedGate.id;
            const isConnected = activeWormhole === gate.id;

            return (
              <div
                key={gate.id}
                id={`gate-card-${gate.id}`}
                onClick={() => {
                  sound.play('click');
                  onSelectGate(gate);
                }}
                className={`p-4 border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                    : 'bg-white border-[#dedede] hover:border-[#111111]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe size={15} className={isSelected ? 'text-amber-400' : 'text-[#555555]'} />
                      <strong className="text-sm font-bold">{gate.name}</strong>
                    </div>
                    <span
                      className={`text-[10px] font-mono mt-0.5 block ${
                        isSelected ? 'text-neutral-300' : 'text-[#777777]'
                      }`}
                    >
                      {gate.designation} · {gate.galaxy} ({gate.distanceLy.toLocaleString()} ly)
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1 font-mono">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${
                        gate.securityLevel === 'Safe'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : gate.securityLevel === 'Restricted'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      {gate.securityLevel}
                    </span>

                    {isConnected && (
                      <span className="text-[10px] font-bold text-sky-400 animate-pulse">
                        ● WORMHOLE ACTIVE
                      </span>
                    )}

                    <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                      gate.chevrons.length === 9
                        ? 'border-purple-300 bg-purple-50 text-purple-800'
                        : gate.chevrons.length === 8
                        ? 'border-blue-300 bg-blue-50 text-blue-800'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    }`}>
                      {gate.chevrons.length}-Chevron ({gate.chevrons.length === 9 ? '200 Turns' : gate.chevrons.length === 8 ? '125 Turns' : '1 Turn'})
                    </span>
                  </div>
                </div>

                {/* Chevron glyph mini preview */}
                <div className="flex items-center gap-1 mt-2.5">
                  {gate.chevrons.map((sym, idx) => (
                    <span
                      key={idx}
                      className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold border ${
                        isSelected
                          ? 'bg-[#1e293b] text-amber-300 border-[#334155]'
                          : 'bg-[#fafafa] text-[#555555] border-[#dedede]'
                      }`}
                    >
                      {sym}
                    </span>
                  ))}
                  <span
                    className={`text-[9px] font-mono ml-2 ${
                      isSelected ? 'text-neutral-400' : 'text-[#777777]'
                    }`}
                  >
                    Origin: {gate.pointOfOrigin}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Gate Intelligence Dossier & SG Team Deploy */}
        <div className="lg:col-span-6 space-y-4">
          {/* MALP Telemetry Readout */}
          <div className="bg-white border border-[#dedede] p-6 space-y-4">
            <div className="border-b border-[#eeeeee] pb-3 flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
                  MALP RECONNAISSANCE PROBE TELEMETRY
                </span>
                <h3 className="text-xl font-bold text-[#111111]">{selectedGate.name}</h3>
                <span className="text-xs font-mono text-[#555555]">{selectedGate.classification}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-[10px] text-[#777777] block uppercase font-bold">Power Draw</span>
                <span className="font-bold text-[#111111] flex items-center gap-1 justify-end">
                  <Zap size={13} className="text-amber-500" />
                  {selectedGate.powerReqMw} MW
                </span>
              </div>
            </div>

            {/* Environmental & Threat Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
                <span className="text-[9px] text-[#777777] uppercase block font-bold">Atmosphere</span>
                <strong className="text-[#111111] block mt-0.5">{selectedGate.malpTelemetry.atmosphere}</strong>
              </div>
              <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
                <span className="text-[9px] text-[#777777] uppercase block font-bold">Radiation / Gravity</span>
                <strong className="text-[#111111] block mt-0.5">
                  {selectedGate.malpTelemetry.radiation} · {selectedGate.malpTelemetry.gravity}
                </strong>
              </div>
              <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
                <span className="text-[9px] text-[#777777] uppercase block font-bold">Life Signs</span>
                <strong className="text-[#111111] block mt-0.5">{selectedGate.malpTelemetry.lifeSigns}</strong>
              </div>
              <div className="p-2.5 bg-[#fafafa] border border-[#dedede]">
                <span className="text-[9px] text-[#777777] uppercase block font-bold">Tactical Threat</span>
                <strong
                  className={`block mt-0.5 ${
                    selectedGate.malpTelemetry.threatRating === 'None'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {selectedGate.malpTelemetry.threatRating}
                </strong>
              </div>
            </div>

            {/* Geological & Artifact Resources */}
            <div className="p-3 bg-[#fafafa] border border-[#dedede] space-y-1.5 text-xs font-mono">
              <span className="text-[10px] text-[#777777] uppercase block font-bold">
                Exploitable Veins & Artifact Telemetry
              </span>
              <p className="text-[#333333]">{selectedGate.malpTelemetry.resourcesAvailable}</p>
              <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-bold text-[#111111]">
                <span>Naquadah: ~{selectedGate.lootEstimates.naquadah.toLocaleString()}</span>
                <span>Crystal: ~{selectedGate.lootEstimates.crystal.toLocaleString()}</span>
                {selectedGate.lootEstimates.darkMatter && (
                  <span className="text-purple-700">Dark Matter: ~{selectedGate.lootEstimates.darkMatter}</span>
                )}
                {selectedGate.lootEstimates.rareArtifact && (
                  <span className="text-amber-700">Relic: {selectedGate.lootEstimates.rareArtifact}</span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed italic border-l-2 border-[#111111] pl-3 py-1">
              "{selectedGate.loreDetails}"
            </p>
          </div>

          {/* SG Team Deployment Operation */}
          <div className="bg-white border border-[#dedede] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div>
                <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
                  SGC EXPEDITIONARY FORCE PROTOCOL
                </span>
                <h4 className="text-base font-bold text-[#111111]">Deploy Off-World SG Recon Team</h4>
              </div>
              <span className="text-xs font-mono text-[#555555]">
                Available Turns: <strong>{resources.attackTurns}</strong>
              </span>
            </div>

            {/* Team Selector Pills */}
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team) => {
                const isTeamSelected = team.id === selectedTeam.id;
                return (
                  <div
                    key={team.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedTeamId(team.id);
                    }}
                    className={`p-2.5 border cursor-pointer transition-colors ${
                      isTeamSelected
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-[#fafafa] border-[#dedede] hover:border-[#111111]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold font-mono">{team.code}</strong>
                      <span className="text-[9px] font-mono opacity-80">{team.missionsCount} Tours</span>
                    </div>
                    <span
                      className={`text-[9px] block truncate mt-0.5 ${
                        isTeamSelected ? 'text-neutral-300' : 'text-[#777777]'
                      }`}
                    >
                      {team.specialization}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Team Dossier Box */}
            <div className="p-3 bg-[#fafafa] border border-[#dedede] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between font-bold text-[#111111]">
                <span>Leader: {selectedTeam.leader}</span>
                <span className="text-emerald-700">{selectedTeam.successBonus}</span>
              </div>
              <p className="text-[11px] text-[#666666] leading-relaxed">{selectedTeam.perkDescription}</p>
            </div>

            {/* Dispatch Action Button */}
            <button
              type="button"
              id="deploy-sg-team-btn"
              disabled={isDeploying || !isCurrentWormhole || resources.attackTurns < selectedTeam.turnCost}
              onClick={handleDeploySGTeam}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider font-mono transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border border-emerald-600"
            >
              <Sparkles size={15} />
              <span>
                {isDeploying
                  ? 'Transiting Event Horizon...'
                  : !isCurrentWormhole
                  ? `Dial ${selectedGate.name} to Deploy`
                  : `Dispatch ${selectedTeam.code} through Wormhole (1 Turn)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
