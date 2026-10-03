import React, { useState } from 'react';
import {
  Rocket,
  Radio,
  RotateCcw,
  Zap,
  Shield,
  Crosshair,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminFleetMission, AdminMissionType } from '../../../types';

interface AdminFleetsTabProps {
  fleetMissions: AdminFleetMission[];
  onRecallMission: (missionId: string) => void;
  onTeleportMission: (missionId: string) => void;
}

export const AdminFleetsTab: React.FC<AdminFleetsTabProps> = ({
  fleetMissions,
  onRecallMission,
  onTeleportMission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<AdminFleetMission | null>(
    fleetMissions[0] || null
  );

  const filteredMissions = fleetMissions.filter((m) => {
    const matchesSearch =
      m.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.targetPlayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.originCoords.includes(searchTerm) ||
      m.targetCoords.includes(searchTerm);

    const matchesType = typeFilter === 'all' || m.missionType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getMissionBadge = (type: AdminMissionType) => {
    switch (type) {
      case 'attack':
      case 'acs_attack':
        return (
          <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Crosshair size={10} />
            <span>Attack Mission</span>
          </span>
        );
      case 'transport':
      case 'deploy':
        return (
          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Rocket size={10} />
            <span>Logistics Cargo</span>
          </span>
        );
      case 'espionage':
        return (
          <span className="px-2 py-0.5 bg-amber-500 text-[#111111] text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Radio size={10} />
            <span>Espionage Probe</span>
          </span>
        );
      case 'expedition':
        return (
          <span className="px-2 py-0.5 bg-sky-600 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Sparkles size={10} />
            <span>Deep Expedition</span>
          </span>
        );
      case 'recycle':
        return (
          <span className="px-2 py-0.5 bg-zinc-700 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <RotateCcw size={10} />
            <span>Debris Recycler</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-zinc-600 text-white text-[10px] font-mono font-bold uppercase">
            {type}
          </span>
        );
    }
  };

  return (
    <div id="admin-fleets-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-mono font-extrabold uppercase">
              OGFleet Hyperspace Radar
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {fleetMissions.length} Active Fleets in Subspace
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Fleet Radar & Mission Dispatcher</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Track all in-flight combat sorties, spy probes, transport freighters, and deep space
            expeditions across the galaxy with instant warp teleportation and emergency recall
            capabilities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Flight Radar Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="border border-[#dedede] bg-white p-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-3 text-[#888888]" />
              <input
                type="text"
                placeholder="Search commander, target, coords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-mono border border-[#dedede] bg-[#fafafa] focus:border-[#111111] outline-hidden"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 text-xs font-mono border border-[#dedede] bg-[#fafafa]"
            >
              <option value="all">All Missions</option>
              <option value="attack">Attacks</option>
              <option value="transport">Transports</option>
              <option value="espionage">Espionage</option>
              <option value="expedition">Expeditions</option>
              <option value="recycle">Recycle</option>
            </select>
          </div>

          <div className="border border-[#dedede] bg-white max-h-[600px] overflow-y-auto divide-y divide-[#eeeeee]">
            {filteredMissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#888888] font-mono">
                No active fleets flying in subspace.
              </div>
            ) : (
              filteredMissions.map((m) => {
                const isSelected = selectedMission?.id === m.id;
                const totalShips = Object.values(m.fleetComposition).reduce((a, b) => a + b, 0);
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedMission(m);
                    }}
                    className={`p-4 cursor-pointer transition-colors space-y-2 ${
                      isSelected
                        ? 'bg-[#111111] text-white'
                        : 'hover:bg-[#f8f8f8] text-[#222222]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMissionBadge(m.missionType)}
                        <span className="font-bold text-xs font-mono">{m.ownerName}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80 uppercase font-bold">
                        Status: {m.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span
                        className={`font-bold ${
                          isSelected ? 'text-sky-300' : 'text-sky-700'
                        }`}
                      >
                        {m.originCoords}
                      </span>
                      <ArrowRight size={14} className="opacity-60" />
                      <span
                        className={`font-bold ${
                          isSelected ? 'text-amber-300' : 'text-amber-700'
                        }`}
                      >
                        {m.targetCoords} ({m.targetPlayerName})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono opacity-75 pt-1 border-t border-white/10">
                      <span>Fleet: {totalShips.toLocaleString()} Vessels</span>
                      <span>
                        Arrival: {new Date(m.arrivalTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Mission Control & Warp Interceptor (5 cols) */}
        <div className="lg:col-span-5">
          {selectedMission ? (
            <div className="border border-[#dedede] bg-white p-5 space-y-6">
              <div className="pb-4 border-b border-[#eeeeee]">
                <div className="flex items-center gap-2">
                  <Rocket size={18} className="text-red-600" />
                  <h4 className="text-lg font-bold font-mono text-[#111111]">
                    Mission #{selectedMission.id}
                  </h4>
                </div>
                <div className="text-xs font-mono text-[#777777] mt-0.5">
                  Commander: <strong className="text-[#111111]">{selectedMission.ownerName}</strong>
                </div>
              </div>

              {/* Coordinates Box */}
              <div className="p-3 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#777777]">Launch Point:</span>
                  <span className="font-bold text-sky-700">{selectedMission.originCoords}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#777777]">Destination:</span>
                  <span className="font-bold text-amber-700">
                    {selectedMission.targetCoords} ({selectedMission.targetPlayerName})
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#777777]">Arrival Timestamp:</span>
                  <span className="font-bold text-[#111111]">
                    {new Date(selectedMission.arrivalTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Fleet Composition */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#444444] uppercase tracking-wider block">
                  Vessels in Battlegroup
                </label>
                <div className="p-3 bg-[#fdfdfd] border border-[#dedede] divide-y divide-[#eeeeee] max-h-40 overflow-y-auto">
                  {Object.entries(selectedMission.fleetComposition).map(([ship, count]) => (
                    <div
                      key={ship}
                      className="py-1.5 flex justify-between text-xs font-mono"
                    >
                      <span className="capitalize text-[#444444]">
                        {ship.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-[#111111]">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cargo Bay */}
              {(selectedMission.cargo.metal > 0 ||
                selectedMission.cargo.crystal > 0 ||
                selectedMission.cargo.deuterium > 0) && (
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-[#444444] uppercase tracking-wider block">
                    Cargo Bay Manifest
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] text-[#888888]">Metal</div>
                      <div className="font-bold text-[#111111]">
                        {selectedMission.cargo.metal.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] text-[#888888]">Crystal</div>
                      <div className="font-bold text-sky-700">
                        {selectedMission.cargo.crystal.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] text-[#888888]">Deuterium</div>
                      <div className="font-bold text-emerald-700">
                        {selectedMission.cargo.deuterium.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Operator Flight Commands */}
              <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
                <label className="text-xs font-mono font-bold text-[#444444] uppercase tracking-wider block">
                  Flight Operator Interventions
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('confirm');
                      onTeleportMission(selectedMission.id);
                    }}
                    className="p-2.5 bg-[#111111] hover:bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap size={14} className="text-amber-400" />
                    <span>Instant Warp Arrival</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.play('confirm');
                      onRecallMission(selectedMission.id);
                    }}
                    className="p-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Force Emergency Recall</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-[#dedede] bg-white p-12 text-center text-xs text-[#888888] font-mono">
              Select an active flight from the radar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
