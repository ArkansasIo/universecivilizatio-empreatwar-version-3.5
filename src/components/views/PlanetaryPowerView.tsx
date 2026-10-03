import React, { useState } from 'react';
import { Zap, Sun, Flame, Cpu, Shield, Globe, ArrowUpRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { sound } from '../../sound';
import { PlanetColony, PlayerResources } from '../../types';
import { PLANETARY_CLASSES_42 } from '../../planetarySystemData';

interface PlanetaryPowerViewProps {
  planets: PlanetColony[];
  resources: PlayerResources;
  onUpgradePlanet: (planetId: string) => void;
  onNavigate: (route: string) => void;
}

export const PlanetaryPowerView: React.FC<PlanetaryPowerViewProps> = ({
  planets,
  resources,
  onUpgradePlanet,
  onNavigate,
}) => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>(planets[0]?.id || '');

  const activePlanet = planets.find((p) => p.id === selectedPlanetId) || planets[0];

  // Calculate total empire power statistics
  const totalPowerGenerated = planets.reduce((acc, p) => acc + (p.level * 4500) + 12000, 0);
  const totalPowerConsumed = planets.reduce((acc, p) => acc + (p.level * 2100) + 5400, 0);
  const netPowerGrid = totalPowerGenerated - totalPowerConsumed;

  return (
    <div id="planetary-power-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          ASTROPHYSICAL POWER MATRIX · 42 PLANETARY & MOON CLASSES
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Planetary & Moon Power Grid Systems</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
          Monitor and optimize energy generation across all 42 planetary and moon classifications. Balance solar flux capture, geothermal magma tapping, and fusion reactors to prevent grid brownouts.
        </p>
      </div>

      {/* Empire Power Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Total Power Generation</span>
          <div className="flex items-center gap-2 mt-1">
            <Zap size={20} className="text-amber-500" />
            <strong className="text-xl font-mono text-[#111111]">+{totalPowerGenerated.toLocaleString()} MW</strong>
          </div>
        </div>
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Total Power Consumption</span>
          <div className="flex items-center gap-2 mt-1">
            <Cpu size={20} className="text-rose-600" />
            <strong className="text-xl font-mono text-[#111111]">-{totalPowerConsumed.toLocaleString()} MW</strong>
          </div>
        </div>
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block">Net Empire Power Grid</span>
          <div className="flex items-center gap-2 mt-1">
            <Shield size={20} className={netPowerGrid >= 0 ? 'text-emerald-600' : 'text-rose-600'} />
            <strong className={`text-xl font-mono ${netPowerGrid >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {netPowerGrid >= 0 ? `+${netPowerGrid.toLocaleString()}` : netPowerGrid.toLocaleString()} MW
            </strong>
          </div>
        </div>
      </div>

      {/* Planet Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 border border-[#dedede] bg-white p-6 space-y-4">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
              Colonial Worlds ({planets.length})
            </h3>
            <span className="text-xs text-[#777777]">Select a world to inspect its 42-class subsystem parameters.</span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {planets.map((pl) => {
              const isSelected = pl.id === activePlanet?.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => {
                    sound.play('click');
                    setSelectedPlanetId(pl.id);
                  }}
                  className={`p-3.5 border cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#fafafa] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe size={15} className={isSelected ? 'text-white' : 'text-[#777777]'} />
                      <strong className="text-xs font-bold">{pl.name}</strong>
                    </div>
                    <div className={`text-[10px] mt-0.5 font-mono ${isSelected ? 'text-neutral-300' : 'text-[#777777]'}`}>
                      Coord: {pl.coordinate} · Biome: {pl.biome}
                    </div>
                  </div>
                  <div className={`text-right font-mono text-xs ${isSelected ? 'text-white' : 'text-[#111111]'}`}>
                    Lv. {pl.level}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Planet Detailed Power Breakdown */}
        {activePlanet && (
          <div className="lg:col-span-7 border border-[#dedede] bg-white p-6 space-y-6">
            <div className="border-b border-[#eeeeee] pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest">
                  PLANETARY POWER & ASTROPHYSICS PROFILE
                </span>
                <h3 className="text-xl font-bold text-[#111111] mt-0.5">{activePlanet.name}</h3>
                <span className="text-xs font-mono text-[#555555]">
                  Coordinate: {activePlanet.coordinate} · Biome Class: {activePlanet.biome}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.play('confirm');
                  onUpgradePlanet(activePlanet.id);
                }}
                className="px-4 py-2 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowUpRight size={14} />
                <span>Upgrade Colony Grid →</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#fafafa] p-3 border border-[#dedede]">
                <span className="text-[#777777] block text-[10px] uppercase font-bold">Colony Level</span>
                <strong className="text-base font-mono text-[#111111] block mt-1">Lv. {activePlanet.level}</strong>
              </div>
              <div className="bg-[#fafafa] p-3 border border-[#dedede]">
                <span className="text-[#777777] block text-[10px] uppercase font-bold">Income Yield Bonus</span>
                <strong className="text-base font-mono text-emerald-700 block mt-1">+{activePlanet.incomeBonus.toLocaleString()}</strong>
              </div>
              <div className="bg-[#fafafa] p-3 border border-[#dedede]">
                <span className="text-[#777777] block text-[10px] uppercase font-bold">Defense Matrix</span>
                <strong className="text-base font-mono text-blue-700 block mt-1">+{activePlanet.defenseBonus.toLocaleString()}</strong>
              </div>
            </div>

            {/* 42-Class Sub-Parameters */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} />
                <span>Sub-Class & Astrophysical Properties</span>
              </h4>

              <div className="border border-[#dedede] bg-[#fafafa] p-4 space-y-3 text-xs">
                {PLANETARY_CLASSES_42.map((cat) => (
                  <div key={cat.classId} className="border-b border-[#eeeeee] pb-2 last:border-b-0">
                    <span className="font-bold text-[#111111] block text-[11px]">{cat.className}</span>
                    <div className="text-[11px] text-[#666666] mt-0.5 grid grid-cols-2 gap-2">
                      <div>Category Code: <strong className="font-mono text-[#111111]">{cat.categoryCode}</strong></div>
                      <div>Sub-types: <strong className="font-mono text-[#111111]">{cat.subClasses.length} Variants</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
