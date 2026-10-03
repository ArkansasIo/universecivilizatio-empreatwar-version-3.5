import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Radio,
  CheckCircle2,
  Atom,
  Flame,
  Award,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  SupergateSingularity,
  INITIAL_SUPERGATE,
  AncientControlCrystal,
  ANCIENT_CRYSTALS,
} from '../../../stargateData';
import { PlayerResources } from '../../../types';

interface SupergateCrystalsPanelProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onLogDebrief: (log: string) => void;
}

export const SupergateCrystalsPanel: React.FC<SupergateCrystalsPanelProps> = ({
  resources,
  onUpdateResources,
  onLogDebrief,
}) => {
  const [supergate, setSupergate] = useState<SupergateSingularity>(INITIAL_SUPERGATE);
  const [crystals, setCrystals] = useState<AncientControlCrystal[]>(ANCIENT_CRYSTALS);
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);

  const handleHarvestDarkMatter = () => {
    setIsHarvesting(true);
    sound.play('confirm');

    setTimeout(() => {
      setIsHarvesting(false);
      const dmGained = supergate.darkMatterHarvestRate * 4;
      onUpdateResources({
        darkMatter: (resources.darkMatter ?? 0) + dmGained,
      });
      sound.play('success');
      onLogDebrief(
        `Singularity Siphon Executed: Harvested ${dmGained} Dark Matter particles from the Ori Supergate micro-black hole event horizon!`
      );
    }, 1200);
  };

  const handleToggleCrystal = (crystalId: string) => {
    sound.play('click');
    setCrystals((prev) =>
      prev.map((c) => {
        if (c.id === crystalId) {
          const nextState = !c.installed;
          onLogDebrief(
            nextState
              ? `Installed [${c.name}] into Ancient control socket: Effect [${c.effect}] active!`
              : `De-socketed [${c.name}]. System returned to baseline harmonics.`
          );
          return { ...c, installed: nextState };
        }
        return c;
      })
    );
  };

  return (
    <div id="supergate-crystals-panel" className="space-y-6">
      {/* Upper: Ori Supergate & Micro-Black Hole Singularity */}
      <div className="bg-[#0b101b] border border-[#1e293b] p-6 text-white space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-[#1e293b] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                ORI SUPERGATE SINGULARITY NEXUS · 400M DIAMETER
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{supergate.name}</h3>
            <p className="text-xs text-[#94a3b8] mt-0.5 leading-relaxed max-w-2xl font-mono">
              Megastructure consisting of 90 linked supergate blocks anchored around a collapsed micro-black hole.
              Taps into quantum vacuum singularities to establish intergalactic bridges capable of passing planetary-scale fleets.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-[#0f172a] border border-[#334155] text-right">
              <span className="text-[9px] text-[#94a3b8] uppercase block font-bold">Segments Assembled</span>
              <strong className="text-base text-white">{supergate.segmentsAssembled}/90 Blocks</strong>
            </div>
            <div className="p-3 bg-[#0f172a] border border-[#334155] text-right">
              <span className="text-[9px] text-[#94a3b8] uppercase block font-bold">Singularity Mass</span>
              <strong className="text-base text-purple-400">{supergate.microSingularityMass} M☉</strong>
            </div>
          </div>
        </div>

        {/* Singularity Gauge & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          <div className="md:col-span-8 bg-[#0f172a] border border-[#1e293b] p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-[#94a3b8]">
              <span>Micro-Black Hole Containment Graviton Field</span>
              <span className="text-emerald-400 font-bold">STABLE (99.8%)</span>
            </div>
            <div className="w-full h-2.5 bg-[#1e293b] overflow-hidden">
              <div className="w-[99.8%] h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-[11px]">
              <div>
                <span className="text-[9px] text-[#64748b] uppercase block">Hawking Emission</span>
                <span className="text-white font-bold">14.8 TeV/s</span>
              </div>
              <div>
                <span className="text-[9px] text-[#64748b] uppercase block">Event Horizon Swirl</span>
                <span className="text-purple-300 font-bold">94.2% Light Speed</span>
              </div>
              <div>
                <span className="text-[9px] text-[#64748b] uppercase block">Cross-Galaxy Reach</span>
                <span className="text-sky-300 font-bold">Milky Way ↔ Pegasus ↔ Ida</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-center space-y-2">
            <button
              type="button"
              id="harvest-dark-matter-btn"
              disabled={isHarvesting}
              onClick={handleHarvestDarkMatter}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider font-mono transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border border-purple-600 shadow-md"
            >
              <Atom size={15} />
              <span>{isHarvesting ? 'Siphoning Particles...' : 'Siphon Dark Matter Particles'}</span>
            </button>
            <span className="text-[10px] text-[#94a3b8] font-mono text-center block">
              Yield: +{supergate.darkMatterHarvestRate * 4} Dark Matter per siphon
            </span>
          </div>
        </div>
      </div>

      {/* Lower: Ancient Control Crystals Socketing Matrix */}
      <div className="bg-white border border-[#dedede] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-mono">
              Ancient Control Crystals Socketing Matrix
            </h4>
            <span className="text-xs text-[#777777]">
              Insert rare Lantean and Ancient crystals into DHD consoles and Jump Gate capacitors to unlock system overclocks.
            </span>
          </div>
          <span className="text-xs font-mono text-[#555555]">
            Active Sockets: <strong>{crystals.filter((c) => c.installed).length}/{crystals.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crystals.map((crystal) => {
            return (
              <div
                key={crystal.id}
                id={`crystal-card-${crystal.id}`}
                className={`p-4 border transition-all flex flex-col justify-between space-y-3 ${
                  crystal.installed
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-[#fafafa] text-[#333333] border-[#dedede]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles
                          size={14}
                          className={crystal.installed ? 'text-amber-400' : 'text-[#777777]'}
                        />
                        <strong className="text-xs font-bold font-mono">{crystal.name}</strong>
                      </div>
                      <span
                        className={`text-[10px] font-mono block mt-0.5 ${
                          crystal.installed ? 'text-neutral-300' : 'text-[#777777]'
                        }`}
                      >
                        Rarity: {crystal.rarity} · Socket: {crystal.socket.toUpperCase()}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase font-mono border ${
                        crystal.installed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-white text-[#777777] border-[#dedede]'
                      }`}
                    >
                      {crystal.boostValue}
                    </span>
                  </div>

                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      crystal.installed ? 'text-neutral-300' : 'text-[#666666]'
                    }`}
                  >
                    {crystal.effect}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#333333]/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold">
                    Status: {crystal.installed ? 'SOCKETED & ACTIVE' : 'UNPLUGGED'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleCrystal(crystal.id)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase font-mono border cursor-pointer transition-colors ${
                      crystal.installed
                        ? 'bg-rose-600 text-white border-rose-500 hover:bg-rose-700'
                        : 'bg-[#111111] text-white border-[#111111] hover:bg-[#333333]'
                    }`}
                  >
                    {crystal.installed ? 'Unplug Crystal' : 'Socket Crystal'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recovered Ancient Relics & Artifacts Display */}
      <div className="bg-white border border-[#dedede] p-6 space-y-3">
        <div className="border-b border-[#eeeeee] pb-2">
          <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-mono">
            Recovered Galactic Reliquary & Off-World Artifacts
          </h4>
          <span className="text-xs text-[#777777]">
            Rare historical technologies seized by SG expeditionary units during deep space Stargate missions.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: 'Dakara Molecular Wave Fragment',
              origin: 'Dakara Temple',
              effect: 'Unlocks simultaneous multi-gate broadcast resonance.',
            },
            {
              title: "Asgard Holographic Datapad of Thor",
              origin: 'Othala Core',
              effect: 'Contains complete blueprints for Asgard plasma beam weapons.',
            },
            {
              title: 'Destiny Master Bridge Command Code',
              origin: 'Ancient Vessel Destiny',
              effect: 'Taps directly into cosmic background radiation telemetry.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-[#fafafa] border border-[#dedede] space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase block font-mono">
                {item.origin}
              </span>
              <strong className="text-xs text-[#111111] block font-mono">{item.title}</strong>
              <p className="text-[11px] text-[#666666] leading-relaxed">{item.effect}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
