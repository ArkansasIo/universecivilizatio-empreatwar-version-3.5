import React, { useState } from 'react';
import { Shield, Cpu, Zap, ArrowUpRight, Anchor, Globe, Radio, Plus, CheckCircle2 } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface SpaceStationModule {
  id: string;
  name: string;
  category: 'defense' | 'commerce' | 'shipyard' | 'research' | 'energy';
  level: number;
  maxLevel: number;
  cost: { metal: number; crystal: number; deuterium: number };
  description: string;
  bonusEffect: string;
}

interface SpaceStationViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
}

export const SpaceStationView: React.FC<SpaceStationViewProps> = ({
  resources,
  onUpdateResources,
}) => {
  const [modules, setModules] = useState<SpaceStationModule[]>([
    {
      id: 'citadel_core',
      name: 'Citadel Command Core',
      category: 'defense',
      level: 1,
      maxLevel: 10,
      cost: { metal: 150000, crystal: 100000, deuterium: 50000 },
      description: 'Central command spine of the orbital starbase.',
      bonusEffect: '+10% Starbase Defense & +5,000 Storage Capacity',
    },
    {
      id: 'ion_cannon_array',
      name: 'Orbital Ion Battery Array',
      category: 'defense',
      level: 2,
      maxLevel: 15,
      cost: { metal: 80000, crystal: 50000, deuterium: 20000 },
      description: 'Heavy plasma and ion cannons for planetary sector defense.',
      bonusEffect: '+25,000 Orbital Defense Power',
    },
    {
      id: 'galactic_trade_port',
      name: 'Interstellar Trade Exchange',
      category: 'commerce',
      level: 1,
      maxLevel: 8,
      cost: { metal: 100000, crystal: 120000, deuterium: 40000 },
      description: 'Automated docking bays for merchant fleets and resource trade.',
      bonusEffect: '+15% Market Revenue & Tax Income',
    },
    {
      id: 'quantum_lab',
      name: 'Deep-Space Research Spire',
      category: 'research',
      level: 2,
      maxLevel: 12,
      cost: { metal: 90000, crystal: 150000, deuterium: 60000 },
      description: 'Orbital laboratory shielded from atmospheric interference.',
      bonusEffect: '+20% Research Speed',
    },
    {
      id: 'fusion_harvester',
      name: 'Solar-Plasma Collector Ring',
      category: 'energy',
      level: 3,
      maxLevel: 20,
      cost: { metal: 60000, crystal: 40000, deuterium: 30000 },
      description: 'Captures raw solar wind and deuterium isotopes.',
      bonusEffect: '+12,000 MW Energy Generation',
    },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpgrade = (modId: string) => {
    const mod = modules.find((m) => m.id === modId);
    if (!mod) return;

    if (mod.level >= mod.maxLevel) {
      sound.play('warning');
      setFeedback('Module is already at maximum upgrade level.');
      return;
    }

    if (
      resources.metal < mod.cost.metal ||
      resources.crystal < mod.cost.crystal ||
      resources.deuterium < mod.cost.deuterium
    ) {
      sound.play('warning');
      setFeedback('Insufficient resources to upgrade starbase module.');
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      metal: resources.metal - mod.cost.metal,
      crystal: resources.crystal - mod.cost.crystal,
      deuterium: resources.deuterium - mod.cost.deuterium,
    });

    setModules(
      modules.map((m) =>
        m.id === modId
          ? {
              ...m,
              level: m.level + 1,
              cost: {
                metal: Math.round(m.cost.metal * 1.4),
                crystal: Math.round(m.cost.crystal * 1.4),
                deuterium: Math.round(m.cost.deuterium * 1.4),
              },
            }
          : m
      )
    );
    setFeedback(`Successfully upgraded ${mod.name} to Level ${mod.level + 1}!`);
  };

  return (
    <div id="space-station-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          ORBITAL INFRASTRUCTURE · STARBASE & SPACE STATION COMMAND
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Orbital Starbases & Space Stations</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
          Construct and upgrade permanent orbital starbase citadels, heavy ion defense rings, trade exchanges, and quantum research spires above your colonized worlds.
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

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="border border-[#dedede] bg-white p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#fafafa] border border-[#dedede] text-[#666666] uppercase">
                  {mod.category}
                </span>
                <span className="font-mono text-xs font-bold text-[#111111]">
                  Lv. {mod.level} / {mod.maxLevel}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#111111]">{mod.name}</h3>
              <p className="text-xs text-[#666666] mt-1 leading-relaxed">{mod.description}</p>
              <div className="mt-3 p-2.5 bg-[#fafafa] border border-[#dedede] text-[11px] font-medium text-emerald-700">
                {mod.bonusEffect}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#eeeeee]">
              <div className="text-[11px] text-[#777777] space-y-1">
                <div className="flex justify-between">
                  <span>Metal Cost:</span>
                  <strong className="font-mono text-[#111111]">{mod.cost.metal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Crystal Cost:</span>
                  <strong className="font-mono text-[#111111]">{mod.cost.crystal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Deuterium Cost:</span>
                  <strong className="font-mono text-[#111111]">{mod.cost.deuterium.toLocaleString()}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleUpgrade(mod.id)}
                disabled={mod.level >= mod.maxLevel}
                className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight size={14} />
                <span>{mod.level >= mod.maxLevel ? 'Max Level Reached' : `Upgrade Module →`}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
