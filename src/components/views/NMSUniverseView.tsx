import React, { useState } from 'react';
import { Globe, Compass, Shield, Zap, Search, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { sound } from '../../sound';
import { GENERATE_NMS_SYSTEMS, NMSStarSystem } from '../../nmsUniverseData';
import { PlayerResources } from '../../types';

interface NMSUniverseViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
}

export const NMSUniverseView: React.FC<NMSUniverseViewProps> = ({
  resources,
  onUpdateResources,
}) => {
  const [systems] = useState<NMSStarSystem[]>(() => GENERATE_NMS_SYSTEMS(25));
  const [selectedSystemId, setSelectedSystemId] = useState<string>(systems[0]?.id || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeSystem = systems.find((s) => s.id === selectedSystemId) || systems[0];

  const handlePortalJump = (planetName: string) => {
    sound.play('confirm');
    setFeedback(`Initiating stellar portal jump to ${planetName}! Atmospheric probes deployed.`);
  };

  return (
    <div id="nms-universe-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          PROCEDURAL GALAXY SEED GENERATOR · NO MAN'S SKY ASTROPHYSICS
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">No Man's Sky Procedural Universe</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
          Explore billions of procedurally generated star systems, multi-biome planets, sentinel threat networks, and alien trading economies using algorithmic seed hashes.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-[#fafafa] border border-[#111111] border-l-4 text-xs font-semibold flex justify-between items-center">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Systems & Planet Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 border border-[#dedede] bg-white p-6 space-y-4">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
              Procedural Star Systems ({systems.length})
            </h3>
            <span className="text-xs text-[#777777]">Algorithmic Seed Matrix</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {systems.map((sys) => {
              const isSelected = sys.id === activeSystem?.id;
              return (
                <div
                  key={sys.id}
                  onClick={() => {
                    sound.play('click');
                    setSelectedSystemId(sys.id);
                  }}
                  className={`p-3.5 border cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#fafafa] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className={isSelected ? 'text-white' : 'text-[#777777]'} />
                      <strong className="text-xs font-bold">{sys.systemName}</strong>
                    </div>
                    <div className={`text-[10px] mt-0.5 font-mono ${isSelected ? 'text-neutral-300' : 'text-[#777777]'}`}>
                      Class {sys.spectralClass} · Lifeform: {sys.dominantLifeform}
                    </div>
                  </div>
                  <div className={`text-right font-mono text-xs ${isSelected ? 'text-white' : 'text-[#111111]'}`}>
                    {sys.planets.length} Planets
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected System Planets */}
        {activeSystem && (
          <div className="lg:col-span-8 border border-[#dedede] bg-white p-6 space-y-6">
            <div className="border-b border-[#eeeeee] pb-4">
              <span className="text-[10px] font-mono text-[#777777] uppercase tracking-widest">
                SYSTEM SEED HASH: {activeSystem.galacticCoords}
              </span>
              <h3 className="text-xl font-bold text-[#111111] mt-0.5">{activeSystem.systemName} Star System</h3>
              <p className="text-xs text-[#666666] mt-1">
                Spectral Class: <strong className="font-mono text-[#111111]">{activeSystem.spectralClass}</strong> · Dominant Lifeform: <strong className="font-mono text-[#111111]">{activeSystem.dominantLifeform}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Planetary Bodies ({activeSystem.planets.length})</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSystem.planets.map((pl) => (
                  <div key={pl.planetIndex} className="border border-[#dedede] bg-[#fafafa] p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-[#777777]">Planet {pl.planetIndex} · {pl.seedHash}</span>
                        <h5 className="font-bold text-sm text-[#111111]">{pl.name}</h5>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-white border border-[#dedede] text-[#111111] uppercase">
                        {pl.biome}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#555555] space-y-1">
                      <div>Weather: <strong className="font-mono text-[#111111]">{pl.weather}</strong></div>
                      <div>Sentinels: <strong className="font-mono text-[#111111]">{pl.sentinels}</strong></div>
                      <div>Flora / Fauna: <strong className="font-mono text-[#111111]">{pl.flora} / {pl.fauna}</strong></div>
                      <div>Resources: <strong className="font-mono text-[#111111]">{pl.resources.join(', ')}</strong></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePortalJump(pl.name)}
                      className="w-full py-2 bg-[#111111] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
                    >
                      Deploy Probe / Portal Jump →
                    </button>
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
