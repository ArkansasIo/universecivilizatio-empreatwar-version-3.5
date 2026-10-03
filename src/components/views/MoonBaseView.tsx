import React, { useState } from 'react';
import { Moon, Shield, Radio, Cpu, ArrowUpRight, CheckCircle2, Zap } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface MoonFacility {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  cost: { metal: number; crystal: number; deuterium: number };
  description: string;
  effect: string;
}

interface MoonBaseViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
}

export const MoonBaseView: React.FC<MoonBaseViewProps> = ({
  resources,
  onUpdateResources,
}) => {
  const [facilities, setFacilities] = useState<MoonFacility[]>([
    {
      id: 'lunar_base',
      name: 'Subterranean Lunar Base',
      level: 2,
      maxLevel: 10,
      cost: { metal: 200000, crystal: 150000, deuterium: 50000 },
      description: 'Provides life support and surface area for lunar installations.',
      effect: '+4 Free Lunar Building Fields per level',
    },
    {
      id: 'sensor_phalanx',
      name: 'Interstellar Sensor Phalanx',
      level: 1,
      maxLevel: 10,
      cost: { metal: 20000, crystal: 40000, deuterium: 20000 },
      description: 'Scans passing enemy fleets across neighboring star systems in real time.',
      effect: 'Detects fleet movements within 5 solar radii',
    },
    {
      id: 'jump_gate',
      name: 'Hyperspace Jump Gate',
      level: 1,
      maxLevel: 5,
      cost: { metal: 1000000, crystal: 2000000, deuterium: 1000000 },
      description: 'Instantaneous fleet teleportation between moon bases without fuel burn.',
      effect: 'Zero-delay fleet transfer',
    },
    {
      id: 'lunar_shield_dome',
      name: 'Heavy Lunar Shield Generator',
      level: 1,
      maxLevel: 3,
      cost: { metal: 500000, crystal: 500000, deuterium: 100000 },
      description: 'Impenetrable energy shield protecting lunar installations from orbital bombardment.',
      effect: '+100,000 Lunar Base Defense Shield HP',
    },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpgrade = (facId: string) => {
    const fac = facilities.find((f) => f.id === facId);
    if (!fac) return;

    if (fac.level >= fac.maxLevel) {
      sound.play('warning');
      setFeedback('Lunar facility is already at maximum level.');
      return;
    }

    if (
      resources.metal < fac.cost.metal ||
      resources.crystal < fac.cost.crystal ||
      resources.deuterium < fac.cost.deuterium
    ) {
      sound.play('warning');
      setFeedback('Insufficient resources to upgrade lunar facility.');
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      metal: resources.metal - fac.cost.metal,
      crystal: resources.crystal - fac.cost.crystal,
      deuterium: resources.deuterium - fac.cost.deuterium,
    });

    setFacilities(
      facilities.map((f) =>
        f.id === facId
          ? {
              ...f,
              level: f.level + 1,
              cost: {
                metal: Math.round(f.cost.metal * 1.5),
                crystal: Math.round(f.cost.crystal * 1.5),
                deuterium: Math.round(f.cost.deuterium * 1.5),
              },
            }
          : f
      )
    );
    setFeedback(`Successfully upgraded ${fac.name} to Level ${fac.level + 1}!`);
  };

  return (
    <div id="moon-base-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          LUNAR ASTROPHYSICS · MOON BASES & SATELLITES
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Moon Bases & Sensor Phalanxes</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
          Manage orbital moon bases, Sensor Phalanxes for fleet tracking, and Hyperspace Jump Gates for instant interstellar fleet deployments.
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

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac) => (
          <div key={fac.id} className="border border-[#dedede] bg-white p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#fafafa] border border-[#dedede] text-[#666666] uppercase flex items-center gap-1.5">
                  <Moon size={12} />
                  Lunar Installation
                </span>
                <span className="font-mono text-xs font-bold text-[#111111]">
                  Lv. {fac.level} / {fac.maxLevel}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#111111]">{fac.name}</h3>
              <p className="text-xs text-[#666666] mt-1 leading-relaxed">{fac.description}</p>
              <div className="mt-3 p-2.5 bg-[#fafafa] border border-[#dedede] text-[11px] font-medium text-blue-700">
                {fac.effect}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#eeeeee]">
              <div className="text-[11px] text-[#777777] space-y-1">
                <div className="flex justify-between">
                  <span>Metal Cost:</span>
                  <strong className="font-mono text-[#111111]">{fac.cost.metal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Crystal Cost:</span>
                  <strong className="font-mono text-[#111111]">{fac.cost.crystal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Deuterium Cost:</span>
                  <strong className="font-mono text-[#111111]">{fac.cost.deuterium.toLocaleString()}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleUpgrade(fac.id)}
                disabled={fac.level >= fac.maxLevel}
                className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight size={14} />
                <span>{fac.level >= fac.maxLevel ? 'Max Level Reached' : `Upgrade Lunar Facility →`}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
