import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  Globe,
  Radio,
  Search,
  CheckCircle2,
  Atom,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminDebrisField } from '../../../types';

interface AdminDebrisSpatialTabProps {
  debrisFields: AdminDebrisField[];
  onSpawnDebris: (coords: string, metal: number, crystal: number) => void;
  onClearDebris: (debrisId: string) => void;
  onClearAllDebris: () => void;
}

export const AdminDebrisSpatialTab: React.FC<AdminDebrisSpatialTabProps> = ({
  debrisFields,
  onSpawnDebris,
  onClearDebris,
  onClearAllDebris,
}) => {
  const [spawnCoords, setSpawnCoords] = useState('[1:204:6]');
  const [spawnMetal, setSpawnMetal] = useState(25000000);
  const [spawnCrystal, setSpawnCrystal] = useState(15000000);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebris = debrisFields.filter((d) => d.coordinates.includes(searchTerm));

  const totalMetal = debrisFields.reduce((sum, d) => sum + d.metal, 0);
  const totalCrystal = debrisFields.reduce((sum, d) => sum + d.crystal, 0);

  const handleSpawnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnCoords.trim()) return;
    onSpawnDebris(spawnCoords.trim(), Number(spawnMetal), Number(spawnCrystal));
    sound.play('confirm');
  };

  return (
    <div id="admin-debris-spatial-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-400 text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              Galaxy Spatial Cloud Engine
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {debrisFields.length} Orbital Debris Fields
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Debris Fields & Spatial Anomalies</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Spawn harvesting fields with custom metal and crystal volumes across all galaxy
            coordinates, or purge ghost debris fields to free server memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              onClearAllDebris();
            }}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>Purge All Debris Fields</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border border-[#dedede] bg-white">
          <div className="text-xs font-mono text-[#777777] uppercase font-bold">
            Total Floating Metal
          </div>
          <div className="text-xl font-mono font-bold text-[#111111] mt-1">
            {totalMetal.toLocaleString()} units
          </div>
        </div>
        <div className="p-4 border border-[#dedede] bg-white">
          <div className="text-xs font-mono text-[#777777] uppercase font-bold">
            Total Floating Crystal
          </div>
          <div className="text-xl font-mono font-bold text-sky-700 mt-1">
            {totalCrystal.toLocaleString()} units
          </div>
        </div>
        <div className="p-4 border border-[#dedede] bg-white">
          <div className="text-xs font-mono text-[#777777] uppercase font-bold">
            Required Recyclers
          </div>
          <div className="text-xl font-mono font-bold text-emerald-700 mt-1">
            {Math.ceil((totalMetal + totalCrystal) / 20000).toLocaleString()} Ships
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spawn Debris Form (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSpawnSubmit}
            className="border border-[#dedede] bg-white p-5 space-y-4"
          >
            <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
              <Plus size={16} className="text-amber-600" />
              <h4 className="font-bold text-sm font-mono text-[#111111]">
                Spawn Custom Debris Field
              </h4>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Target Coordinates (e.g. [1:204:6])
              </label>
              <input
                type="text"
                value={spawnCoords}
                onChange={(e) => setSpawnCoords(e.target.value)}
                className="w-full p-2 border border-[#cccccc] bg-[#fafafa] text-xs font-mono focus:border-[#111111] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Metal Volume
              </label>
              <input
                type="number"
                value={spawnMetal}
                onChange={(e) => setSpawnMetal(Number(e.target.value))}
                className="w-full p-2 border border-[#cccccc] bg-[#fafafa] text-xs font-mono focus:border-[#111111] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Crystal Volume
              </label>
              <input
                type="number"
                value={spawnCrystal}
                onChange={(e) => setSpawnCrystal(Number(e.target.value))}
                className="w-full p-2 border border-[#cccccc] bg-[#fafafa] text-xs font-mono focus:border-[#111111] outline-hidden"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-mono text-[#888888] uppercase block">
                Quick Size Presets:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSpawnMetal(10000000);
                    setSpawnCrystal(5000000);
                  }}
                  className="px-2 py-1 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-xs font-mono"
                >
                  15M Skirmish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSpawnMetal(50000000);
                    setSpawnCrystal(30000000);
                  }}
                  className="px-2 py-1 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-xs font-mono"
                >
                  80M Titan Clash
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSpawnMetal(200000000);
                    setSpawnCrystal(120000000);
                  }}
                  className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-xs font-mono font-bold"
                >
                  320M Mega War
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#111111] hover:bg-amber-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              <span>Instantiate Debris in Orbit</span>
            </button>
          </form>
        </div>

        {/* Existing Debris List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="border border-[#dedede] bg-white p-3">
            <input
              type="text"
              placeholder="Filter by coordinates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-xs font-mono border border-[#dedede] bg-[#fafafa] focus:border-[#111111] outline-hidden"
            />
          </div>

          <div className="border border-[#dedede] bg-white divide-y divide-[#eeeeee] max-h-[500px] overflow-y-auto">
            {filteredDebris.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#888888] font-mono">
                No active debris fields found.
              </div>
            ) : (
              filteredDebris.map((d) => (
                <div
                  key={d.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#fafafa]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs font-mono px-2 py-0.5 bg-sky-100 text-sky-900 border border-sky-300">
                        {d.coordinates}
                      </span>
                      {d.spawnedByAdmin && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-500 text-[#111111]">
                          ADMIN SPAWN
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#555555] mt-1.5 space-x-3">
                      <span>Metal: <strong>{d.metal.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span className="text-sky-700">
                        Crystal: <strong>{d.crystal.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.play('confirm');
                      onClearDebris(d.id);
                    }}
                    className="px-3 py-1.5 bg-[#f0f0f0] hover:bg-red-600 hover:text-white text-xs font-mono border border-[#cccccc] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={12} />
                    <span>Clear Field</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
