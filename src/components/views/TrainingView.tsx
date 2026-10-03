import React, { useState, useEffect } from 'react';
import {
  Users,
  Pickaxe,
  Shield,
  Crosshair,
  Eye,
  ShieldAlert,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Filter,
  Plus,
  Minus,
  Activity,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface TrainingViewProps {
  resources: PlayerResources;
  activeRoute?: string;
  onTrainUnits: (
    type: 'attack' | 'defense' | 'miners' | 'spies' | 'antiSpies' | 'superUnits',
    count: number
  ) => {
    success: boolean;
    message: string;
  };
  onUpgradeProduction: () => { success: boolean; message: string };
  onNavigate?: (route: string) => void;
}

type TrainingFilterCategory = 'all' | 'miners' | 'combat' | 'espionage' | 'super' | 'facilities';

export const TrainingView: React.FC<TrainingViewProps> = ({
  resources,
  activeRoute,
  onTrainUnits,
  onUpgradeProduction,
  onNavigate,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<TrainingFilterCategory>('all');
  const [trainAmounts, setTrainAmounts] = useState<Record<string, number>>({
    attack: 50,
    defense: 50,
    miners: 50,
    spies: 20,
    antiSpies: 20,
    superUnits: 5,
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (activeRoute === 'miners') setSelectedFilter('miners');
    else if (activeRoute === 'super-units') setSelectedFilter('super');
    else if (activeRoute === 'unit-production') setSelectedFilter('facilities');
    else if (activeRoute === 'units') setSelectedFilter('all');
  }, [activeRoute]);

  const upgradeCost = (resources.unitProduction ?? 10) * 5000 + 10000;

  const handleTrain = (type: 'attack' | 'defense' | 'miners' | 'spies' | 'antiSpies' | 'superUnits') => {
    const count = trainAmounts[type] || 1;
    const res = onTrainUnits(type, count);
    if (res.success) {
      sound.play('confirm');
      setFeedback({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleUpgradeProd = () => {
    const res = onUpgradeProduction();
    if (res.success) {
      sound.play('research');
      setFeedback({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const setAmount = (type: string, val: number) => {
    setTrainAmounts((prev) => ({ ...prev, [type]: Math.max(1, val) }));
  };

  const setQuickAmount = (type: string, val: number) => {
    sound.play('click');
    setTrainAmounts((prev) => ({ ...prev, [type]: Math.max(1, val) }));
  };

  const setMaxAmount = (type: string, costPerUnit: number = 1) => {
    sound.play('click');
    const maxAvailable = Math.floor((resources.untrainedUnits ?? 0) / costPerUnit);
    setTrainAmounts((prev) => ({ ...prev, [type]: Math.max(1, maxAvailable) }));
  };

  const adjustAmount = (type: string, delta: number, costPerUnit: number = 1) => {
    sound.play('click');
    const maxAvailable = Math.max(1, Math.floor((resources.untrainedUnits ?? 0) / costPerUnit));
    setTrainAmounts((prev) => {
      const current = prev[type] || 1;
      const next = Math.min(maxAvailable, Math.max(1, current + delta));
      return { ...prev, [type]: next };
    });
  };

  return (
    <div id="training-view" className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#dedede] bg-white p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 font-mono">
              PERSONNEL ACADEMY & WORKFORCE CYBERNETICS · BARRACKS & DRILL GROUNDS
            </div>
            <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
              Workforce Recruitment & Specialized Academy
            </h2>
            <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
              Enlist raw citizen population into frontline combat divisions, orbital defense garrisons, deep-mantle Naquadah miners, or covert espionage operatives.
            </p>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#dedede] font-mono text-right shrink-0">
            <span className="text-[10px] text-[#777777] uppercase block font-semibold">UNTRAINED RECRUITS</span>
            <strong className="text-2xl font-bold text-blue-700">
              {(resources.untrainedUnits ?? 0).toLocaleString()}
            </strong>
            <span className="text-[10px] text-emerald-700 block font-semibold">
              +{resources.unitProduction ?? 10} recruits/turn
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center shadow-2xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 border-l-4'
              : 'bg-rose-50 border-rose-300 text-rose-950 border-l-4'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="font-bold cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Subpage Filters Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border border-[#dedede] bg-white p-2">
        {[
          { id: 'all', label: 'All Divisions', count: (resources.attackUnits ?? 0) + (resources.defenseUnits ?? 0) + (resources.miners ?? 0) },
          { id: 'miners', label: 'Naquadah Miners', count: resources.miners ?? 0 },
          { id: 'combat', label: 'Ground Troops (Atk/Def)', count: (resources.attackUnits ?? 0) + (resources.defenseUnits ?? 0) },
          { id: 'espionage', label: 'Intelligence Corps', count: (resources.spies ?? 0) + (resources.antiSpies ?? 0) },
          { id: 'super', label: 'Super Units', count: resources.superUnits ?? 0 },
          { id: 'facilities', label: 'Cloning Facilities', count: `+${resources.unitProduction ?? 10}/t` },
        ].map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.play('click');
                setSelectedFilter(tab.id as TrainingFilterCategory);
              }}
              className={`px-3 py-1.5 text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-amber-400 shadow-2xs'
                  : 'bg-[#f7f7f7] text-[#555555] hover:bg-[#eeeeee] hover:text-[#111111]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-2xs ${isActive ? 'bg-[#222222] text-amber-300' : 'bg-[#e5e5e5] text-[#666666]'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cloning Facilities Upgrade Banner */}
      {(selectedFilter === 'all' || selectedFilter === 'facilities') && (
        <div className="border border-[#dedede] bg-[#fafafa] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider font-mono">
              POPULATION GROWTH ACCELERATOR
            </span>
            <h3 className="text-lg font-bold text-[#111111] font-mono mt-0.5">
              Generating +{resources.unitProduction ?? 10} Untrained Civilians / Turn
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Expand biodome gestation pods and planetary cloning faculties to yield +2 additional civilians every turn.
            </p>
          </div>

          <button
            type="button"
            id="upgrade-production-btn"
            onClick={handleUpgradeProd}
            disabled={resources.naquadah < upgradeCost}
            className="px-5 py-2.5 bg-[#111111] text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer shrink-0 font-mono shadow-2xs"
          >
            Upgrade Facility ({upgradeCost.toLocaleString()} NQ) →
          </button>
        </div>
      )}

      {/* Training Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            key: 'attack' as const,
            category: 'combat' as const,
            code: 'DIV-01 // ASSAULT',
            name: 'Assault Shock Troops',
            subtitle: 'Orbital Dropship Boarding Infantry',
            icon: Crosshair,
            accentColor: 'text-rose-600',
            borderHover: 'hover:border-rose-400',
            bgIcon: 'bg-rose-50 border-rose-200 text-rose-700',
            badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
            status: 'COMBAT READY',
            activeCount: resources.attackUnits ?? 0,
            costPerUnit: 1,
            costLabel: '1 recruit / troop',
            description: 'Frontline shock assault divisions engineered for high-risk planetary drops, hostile warship boarding operations, and fortress breaches.',
            metrics: [
              { label: 'BOARDING IMPACT', value: '+120% Force Rating', sub: 'Shock Troops' },
              { label: 'TACTICAL DOCTRINE', value: 'Drop Insertion', sub: 'Heavy Infantry' },
            ],
            presets: [25, 100, 500, 2500],
            btnText: 'Enlist Assault Troops',
          },
          {
            key: 'defense' as const,
            category: 'combat' as const,
            code: 'DIV-02 // GARRISON',
            name: 'Planetary Defense Garrison',
            subtitle: 'Hardened Citadel & Shield Guards',
            icon: Shield,
            accentColor: 'text-blue-600',
            borderHover: 'hover:border-blue-400',
            bgIcon: 'bg-blue-50 border-blue-200 text-blue-700',
            badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
            status: 'FORTIFIED',
            activeCount: resources.defenseUnits ?? 0,
            costPerUnit: 1,
            costLabel: '1 recruit / guard',
            description: 'Entrenched defensive sentinels stationed within fortified planetary bunkers, heavy energy shield arrays, and stargate access redoubts.',
            metrics: [
              { label: 'CITADEL RESISTANCE', value: '+150% Bunker Armor', sub: 'Hardened Array' },
              { label: 'TACTICAL DOCTRINE', value: 'Chokepoint Defense', sub: 'Phalanx Shield' },
            ],
            presets: [25, 100, 500, 2500],
            btnText: 'Deploy Garrison Guards',
          },
          {
            key: 'miners' as const,
            category: 'miners' as const,
            code: 'DIV-03 // EXTRACTION',
            name: 'Naquadah Core Miners',
            subtitle: 'Geothermal Magma Drill Operatives',
            icon: Pickaxe,
            accentColor: 'text-amber-600',
            borderHover: 'hover:border-amber-400',
            bgIcon: 'bg-amber-50 border-amber-200 text-amber-700',
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
            status: 'DRILLING ACTIVE',
            activeCount: resources.miners ?? 0,
            costPerUnit: 1,
            costLabel: '1 recruit / miner',
            description: 'Industrial drilling specialists operating seismic magma extraction rigs deep within planetary crusts to extract refined weapon-grade liquid Naquadah.',
            metrics: [
              { label: 'EXTRACTION YIELD', value: '+80 NQ / turn', sub: 'Per drill operative' },
              { label: 'TOTAL WORKFORCE', value: `+${((resources.miners ?? 0) * 80).toLocaleString()} NQ/t`, sub: 'Current economy yield' },
            ],
            presets: [25, 100, 500, 2500],
            btnText: 'Assign Drill Miners',
          },
          {
            key: 'spies' as const,
            category: 'espionage' as const,
            code: 'DIV-04 // INTELLIGENCE',
            name: 'Covert Infiltration Spies',
            subtitle: 'Phase-Cloaked Espionage Syndicate',
            icon: Eye,
            accentColor: 'text-purple-600',
            borderHover: 'hover:border-purple-400',
            bgIcon: 'bg-purple-50 border-purple-200 text-purple-700',
            badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
            status: 'COVERT OPS ACTIVE',
            activeCount: resources.spies ?? 0,
            costPerUnit: 1,
            costLabel: '1 recruit / operative',
            description: 'Subterfuge operatives fitted with phase-shifting cloaks and subspace sniffers to scout enemy fleets, monitor communications, and sabotage rival tech.',
            metrics: [
              { label: 'PHASE CLOAK FIDELITY', value: '96.4% Index', sub: 'Deep infiltration' },
              { label: 'TACTICAL DOCTRINE', value: 'Signal Intercept', sub: 'Covert Sabotage' },
            ],
            presets: [5, 20, 100, 500],
            btnText: 'Deploy Intelligence Agents',
          },
          {
            key: 'antiSpies' as const,
            category: 'espionage' as const,
            code: 'DIV-05 // COUNTER-INTEL',
            name: 'Counter-Intelligence Marshals',
            subtitle: 'Stargate Iris Interception Command',
            icon: ShieldAlert,
            accentColor: 'text-indigo-600',
            borderHover: 'hover:border-indigo-400',
            bgIcon: 'bg-indigo-50 border-indigo-200 text-indigo-700',
            badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
            status: 'SCANNING VORTEX',
            activeCount: resources.antiSpies ?? 0,
            costPerUnit: 1,
            costLabel: '1 recruit / marshal',
            description: 'Homeland security forces and Iris vortex scanners monitoring incoming wormhole worm signatures to detect, expose, and neutralize alien spies.',
            metrics: [
              { label: 'INTERCEPT RATE', value: '98.8% Protocol', sub: 'Iris gate security' },
              { label: 'TACTICAL DOCTRINE', value: 'Counter-Espionage', sub: 'Jamming Sweep' },
            ],
            presets: [5, 20, 100, 500],
            btnText: 'Station Counter-Intel',
          },
          {
            key: 'superUnits' as const,
            category: 'super' as const,
            code: 'DIV-06 // APEX SYNTHESIS',
            name: 'Bio-Engineered Super Units',
            subtitle: 'Kull Hybrid / Asgard Battle Titans',
            icon: Zap,
            accentColor: 'text-amber-500',
            borderHover: 'hover:border-amber-400',
            bgIcon: 'bg-amber-50 border-amber-300 text-amber-600',
            badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
            status: 'APEX GENOME READY',
            activeCount: resources.superUnits ?? 0,
            costPerUnit: 5,
            costLabel: '5 recruits / apex unit',
            description: 'Genetically synthesized biomechanical juggernauts engineered with ancient telepathic nanites and hyper-dense armor plating to dominate combat theaters.',
            metrics: [
              { label: 'FORCE MULTIPLIER', value: '5× Heavy Ratio', sub: 'Consumes 5 recruits' },
              { label: 'TACTICAL DOCTRINE', value: 'Titan Annihilation', sub: 'Hull Breaching Apex' },
            ],
            presets: [1, 5, 25, 100],
            btnText: 'Synthesize Apex Units',
          },
        ].map((division) => {
          if (selectedFilter !== 'all' && selectedFilter !== division.category) {
            return null;
          }

          const targetCount = trainAmounts[division.key] || 1;
          const requiredRecruits = targetCount * division.costPerUnit;
          const canEnlist = (resources.untrainedUnits ?? 0) >= requiredRecruits && targetCount > 0;
          const maxPossible = Math.floor((resources.untrainedUnits ?? 0) / division.costPerUnit);
          const DivIcon = division.icon;

          return (
            <div
              key={division.key}
              className={`border border-[#dedede] ${division.borderHover} bg-white p-5 flex flex-col justify-between transition-all duration-150 shadow-xs hover:shadow-sm group`}
            >
              {/* Card Header & Designation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 border ${division.bgIcon}`}>
                      <DivIcon size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#888888] tracking-widest uppercase block">
                        {division.code}
                      </span>
                      <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wide">
                        {division.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-mono text-[#888888] uppercase block tracking-wider">
                      IN SERVICE
                    </span>
                    <span className="font-mono text-sm font-black text-[#111111]">
                      {division.activeCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Subtitle & Status indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#666666] font-medium">{division.subtitle}</span>
                  <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 border border-[#e5e5e5] bg-[#fafafa] text-[#444444] text-[9px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{division.status}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#555555] leading-relaxed min-h-[38px]">
                  {division.description}
                </p>

                {/* Tactical Specifications / Doctrine Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  {division.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="border border-[#ededed] bg-[#fcfcfc] p-2 flex flex-col justify-between"
                    >
                      <span className="text-[8px] font-bold text-[#777777] uppercase tracking-wider truncate">
                        {m.label}
                      </span>
                      <strong className="text-[11px] font-bold text-[#111111] mt-0.5 truncate">
                        {m.value}
                      </strong>
                      <span className="text-[8px] text-[#999999] truncate">{m.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commissioning Controls */}
              <div className="space-y-3 pt-4 mt-3 border-t border-[#eeeeee]">
                {/* Quick Preset Buttons */}
                <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                  <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider shrink-0">
                    Quick:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    {division.presets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setQuickAmount(division.key, val)}
                        className={`px-2 py-0.5 border text-[10px] font-bold transition-all cursor-pointer ${
                          targetCount === val
                            ? 'bg-[#111111] text-amber-400 border-[#111111]'
                            : 'border-[#dedede] bg-[#f9f9f9] text-[#555555] hover:bg-[#111111] hover:text-white hover:border-[#111111]'
                        }`}
                      >
                        +{val}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setMaxAmount(division.key, division.costPerUnit)}
                      className="px-2 py-0.5 border border-[#111111] bg-[#111111] text-white hover:bg-neutral-800 text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Quantity Stepper & Numerical Input */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Decrease by 1"
                    onClick={() => adjustAmount(division.key, -1, division.costPerUnit)}
                    disabled={targetCount <= 1}
                    className="p-2 border border-[#dedede] bg-[#fafafa] hover:bg-[#eeeeee] disabled:opacity-40 text-[#111111] transition-colors cursor-pointer shrink-0"
                  >
                    <Minus size={13} />
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max={Math.max(1, maxPossible)}
                      value={targetCount}
                      onChange={(e) =>
                        setAmount(division.key, parseInt(e.target.value, 10) || 1)
                      }
                      className="w-full border border-[#cccccc] focus:border-[#111111] px-3 py-1.5 text-xs font-mono font-bold text-center bg-white outline-none"
                    />
                    <span className="absolute right-2 top-2 text-[9px] font-mono text-[#888888] pointer-events-none">
                      UNITS
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Increase by 1"
                    onClick={() => adjustAmount(division.key, 1, division.costPerUnit)}
                    disabled={targetCount >= maxPossible}
                    className="p-2 border border-[#dedede] bg-[#fafafa] hover:bg-[#eeeeee] disabled:opacity-40 text-[#111111] transition-colors cursor-pointer shrink-0"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Cost Calculation Readout */}
                <div className="flex items-center justify-between text-[10px] font-mono px-0.5">
                  <span className="text-[#666666]">
                    Rate: <strong className="text-[#111111]">{division.costLabel}</strong>
                  </span>
                  <span
                    className={
                      canEnlist ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'
                    }
                  >
                    Requires: {requiredRecruits.toLocaleString()} Pop
                  </span>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => handleTrain(division.key)}
                  disabled={!canEnlist}
                  className={`w-full py-2.5 px-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs ${
                    canEnlist
                      ? 'bg-[#111111] hover:bg-neutral-800 text-amber-400 active:scale-[0.99]'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
                  }`}
                >
                  <span>{division.btnText}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
