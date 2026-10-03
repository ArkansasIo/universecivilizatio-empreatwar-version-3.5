import React, { useState } from 'react';
import {
  Globe,
  Moon,
  Sparkles,
  Layers,
  Zap,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminPlanetEntry } from '../../../types';

interface AdminPlanetsTabProps {
  planets: AdminPlanetEntry[];
  onUpdatePlanet: (planetId: string, updates: Partial<AdminPlanetEntry>) => void;
  onSpawnMoon: (planetId: string, moonName: string, diameter: number) => void;
  onTerraformPlanet: (planetId: string, extraFields: number) => void;
}

export const AdminPlanetsTab: React.FC<AdminPlanetsTabProps> = ({
  planets,
  onUpdatePlanet,
  onSpawnMoon,
  onTerraformPlanet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<AdminPlanetEntry | null>(planets[0] || null);
  const [moonDiameter, setMoonDiameter] = useState(8920);
  const [moonName, setMoonName] = useState('Titan Spire Moon');
  const [showMoonModal, setShowMoonModal] = useState(false);

  const filteredPlanets = planets.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.coordinates.includes(searchTerm)
  );

  const handleSpawnMoonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanet) return;
    onSpawnMoon(selectedPlanet.id, moonName.trim() || 'Command Moon', moonDiameter);
    sound.play('confirm');
    setShowMoonModal(false);
    setSelectedPlanet({
      ...selectedPlanet,
      hasMoon: true,
      moonName: moonName.trim() || 'Command Moon',
      moonDiameterKm: moonDiameter,
      lunarBaseLevel: 10,
      phalanxLevel: 12,
      jumpGateLevel: 1,
    });
  };

  const handleTerraform = (fields: number) => {
    if (!selectedPlanet) return;
    onTerraformPlanet(selectedPlanet.id, fields);
    sound.play('confirm');
    setSelectedPlanet({
      ...selectedPlanet,
      maxFields: selectedPlanet.maxFields + fields,
    });
  };

  return (
    <div id="admin-planets-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-500 text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              XNova Planetary Spatial Matrix
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {planets.length} Registered Planetary Colonies
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Planetary & Lunar Base Manager</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Terraform extra building fields, instantiate Sensor Phalanxes and Subspace Jump Gates,
            and spawn custom moons across all galaxy coordinates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Planet Registry (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="border border-[#dedede] bg-white p-3">
            <input
              type="text"
              placeholder="Search planet name, owner, or coords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-xs font-mono border border-[#dedede] bg-[#fafafa] focus:border-[#111111] outline-hidden"
            />
          </div>

          <div className="border border-[#dedede] bg-white max-h-[580px] overflow-y-auto divide-y divide-[#eeeeee]">
            {filteredPlanets.map((p) => {
              const isSelected = selectedPlanet?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    sound.play('click');
                    setSelectedPlanet(p);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'hover:bg-[#f8f8f8] text-[#222222]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs font-mono">{p.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                          isSelected
                            ? 'bg-sky-400 text-[#111111]'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {p.coordinates}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono opacity-75 mt-1 flex items-center gap-2">
                      <span>Owner: {p.ownerName}</span>
                      <span>•</span>
                      <span>
                        {p.usedFields}/{p.maxFields} Fields
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-1.5">
                    {p.hasMoon && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-purple-900 text-purple-200">
                        <Moon size={10} />
                        <span>Moon</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Planet Details & Terraformer (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPlanet ? (
            <div className="border border-[#dedede] bg-white p-5 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#eeeeee] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-sky-600" />
                    <h4 className="text-xl font-bold font-mono text-[#111111]">
                      {selectedPlanet.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-sky-600 text-white text-xs font-mono font-bold">
                      {selectedPlanet.coordinates}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#777777] mt-0.5">
                    Commander: <strong className="text-[#111111]">{selectedPlanet.ownerName}</strong>{' '}
                    • Class: {selectedPlanet.planetClass}
                  </div>
                </div>

                {!selectedPlanet.hasMoon ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('click');
                      setShowMoonModal(true);
                    }}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Moon size={13} />
                    <span>Instant Spawn Moon</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 text-xs font-mono font-bold flex items-center gap-1">
                    <Moon size={13} />
                    <span>Moon Online: {selectedPlanet.moonName}</span>
                  </span>
                )}
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fafafa] p-3.5 border border-[#eeeeee]">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Diameter</div>
                  <div className="text-xs font-mono font-bold text-[#111111]">
                    {selectedPlanet.diameterKm.toLocaleString()} km
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Building Fields</div>
                  <div className="text-xs font-mono font-bold text-emerald-700">
                    {selectedPlanet.usedFields} / {selectedPlanet.maxFields}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Temperature</div>
                  <div className="text-xs font-mono font-bold text-amber-700">
                    {selectedPlanet.tempMin}°C to {selectedPlanet.tempMax}°C
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Mining Yield</div>
                  <div className="text-xs font-mono font-bold text-indigo-700">
                    +{(selectedPlanet.metalRate / 1000).toFixed(0)}k/h Met
                  </div>
                </div>
              </div>

              {/* Terraforming Controls */}
              <div className="space-y-3 p-4 border border-[#dedede] bg-emerald-50/20">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-700" />
                  <h5 className="text-xs font-mono font-bold text-emerald-900 uppercase">
                    Planetary Terraformer & Field Expander
                  </h5>
                </div>
                <p className="text-xs text-[#555555]">
                  Bypasses natural tectonic limits. Instantly injects additional building slots for
                  high-tier mega factories, fusion generators, and missile silos.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleTerraform(25)}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-mono font-bold border border-emerald-300 transition-colors cursor-pointer"
                  >
                    +25 Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTerraform(50)}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-mono font-bold border border-emerald-300 transition-colors cursor-pointer"
                  >
                    +50 Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTerraform(100)}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    +100 Mega Terraforming
                  </button>
                </div>
              </div>

              {/* Moon Facilities (If exists) */}
              {selectedPlanet.hasMoon && (
                <div className="space-y-3 p-4 border border-purple-200 bg-purple-50/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon size={16} className="text-purple-700" />
                      <h5 className="text-xs font-mono font-bold text-purple-900 uppercase">
                        Lunar Facilities & Tactical Arrays
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono text-purple-700">
                      Diameter: {selectedPlanet.moonDiameterKm?.toLocaleString()} km
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2.5 bg-white border border-purple-200 text-center">
                      <div className="text-[10px] font-mono text-[#777777]">Lunar Base</div>
                      <div className="text-base font-mono font-bold text-purple-900">
                        Level {selectedPlanet.lunarBaseLevel || 10}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white border border-purple-200 text-center">
                      <div className="text-[10px] font-mono text-[#777777]">Sensor Phalanx</div>
                      <div className="text-base font-mono font-bold text-purple-900">
                        Level {selectedPlanet.phalanxLevel || 12}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white border border-purple-200 text-center">
                      <div className="text-[10px] font-mono text-[#777777]">Jump Gate</div>
                      <div className="text-base font-mono font-bold text-purple-900">
                        Level {selectedPlanet.jumpGateLevel || 1}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-[#dedede] bg-white p-12 text-center text-xs text-[#888888] font-mono">
              Select a planet from the registry to inspect and manage.
            </div>
          )}
        </div>
      </div>

      {/* Moon Spawner Modal */}
      {showMoonModal && selectedPlanet && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#111111] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <Moon size={18} className="text-purple-700" />
                <h4 className="font-bold text-sm font-mono text-[#111111]">
                  Instant Moon Generator
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowMoonModal(false)}
                className="text-[#888888] hover:text-[#111111] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSpawnMoonSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                  Target Planet
                </label>
                <div className="p-2 bg-[#fafafa] border border-[#dddddd] text-xs font-mono text-[#222222]">
                  {selectedPlanet.name} ({selectedPlanet.coordinates})
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                  Moon Name
                </label>
                <input
                  type="text"
                  value={moonName}
                  onChange={(e) => setMoonName(e.target.value)}
                  className="w-full p-2 border border-[#cccccc] text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                  Diameter (km) — Standard max is 8,920 km (100% moon destruction resilience)
                </label>
                <input
                  type="number"
                  value={moonDiameter}
                  min={1000}
                  max={9999}
                  onChange={(e) => setMoonDiameter(Number(e.target.value))}
                  className="w-full p-2 border border-[#cccccc] text-xs font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 text-[11px] font-mono text-purple-900">
                ⚡ Auto-installs Lunar Base Lv 10, Sensor Phalanx Lv 12, and Subspace Jump Gate Lv 1.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMoonModal(false)}
                  className="px-4 py-2 border border-[#cccccc] text-xs font-mono hover:bg-[#f0f0f0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Spawn Lunar Citadel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
