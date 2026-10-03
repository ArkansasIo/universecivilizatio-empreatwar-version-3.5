import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Eye,
  Crosshair,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Sparkles,
  Sliders,
  DollarSign,
  Users,
  Compass,
  Award,
  Terminal,
  Activity,
  Flame,
  Star,
  Info,
} from 'lucide-react';
import {
  GroundTroop90Unit,
  GroundDivision,
  GROUND_TROOPS_90_CATALOG,
  FRONTLINE_STRIKE_SOLDIERS,
  FORTRESS_SENTINELS,
  INTELLIGENCE_OPERATIVES,
  COUNTER_SABOTAGE_AGENTS,
  INITIAL_BARRACKS_FACILITIES,
  BarracksFacilityState,
} from '../../data/groundTroops90Data';
import { PlayerResources } from '../../types';
import { sound } from '../../sound';

interface MilitaryBarracksEnlistmentViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onNavigate?: (route: string) => void;
}

export const MilitaryBarracksEnlistmentView: React.FC<MilitaryBarracksEnlistmentViewProps> = ({
  resources,
  onUpdateResources,
  onNavigate,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<GroundDivision | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [enlistQuantities, setEnlistQuantities] = useState<Record<string, number>>({});
  const [activeTroopRoster, setActiveTroopRoster] = useState<Record<string, number>>({
    fl_strike_01: 450, // Conscript Riflemen
    fl_strike_02: 120, // Magnetic Slug Shocktroopers
    ft_sentinel_01: 300, // Citadel Blast-Wall Sentries
    ft_sentinel_02: 80,  // Bunker Heavy Ballistic Turreteers
    in_operative_01: 60, // Street Informants
    in_operative_03: 25, // Optical Cloaking Snipers
    cs_agent_01: 75,     // Perimeter Tripwire Patrol Sappers
    cs_agent_02: 30,     // Hazmat Bio-Neutralization Cleansers
  });
  const [facilities, setFacilities] = useState<Record<string, BarracksFacilityState>>(INITIAL_BARRACKS_FACILITIES);
  const [selectedUnitDetail, setSelectedUnitDetail] = useState<GroundTroop90Unit>(GROUND_TROOPS_90_CATALOG[0]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Compute Active Army Metrics across the 90 catalog
  let totalTroops = 0;
  let totalAssaultPower = 0;
  let totalFortressDefense = 0;
  let totalReconIntel = 0;
  let totalCounterSabotageRating = 0;

  GROUND_TROOPS_90_CATALOG.forEach((unit) => {
    const count = activeTroopRoster[unit.id] || 0;
    if (count > 0) {
      totalTroops += count;
      totalAssaultPower += unit.stats.attack * count;
      totalFortressDefense += unit.stats.defense * count;
      if (unit.division === 'intelligence_operative') {
        totalReconIntel += unit.subStats.sightRangeKm * count + unit.stats.accuracy * count;
      }
      if (unit.division === 'counter_sabotage') {
        totalCounterSabotageRating += unit.subStats.electronicResistance * count + unit.stats.defense * count;
      }
    }
  });

  const availableUntrained = resources.untrainedUnits || 0;

  // Filter Units
  const filteredUnits = GROUND_TROOPS_90_CATALOG.filter((unit) => {
    if (selectedDivision !== 'all' && unit.division !== selectedDivision) return false;

    if (selectedTierFilter !== 'all') {
      const min = parseInt(selectedTierFilter.split('-')[0], 10);
      const max = parseInt(selectedTierFilter.split('-')[1], 10);
      if (unit.classTier < min || unit.classTier > max) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = unit.name.toLowerCase().includes(q);
      const matchClass = unit.class.toLowerCase().includes(q);
      const matchType = unit.type.toLowerCase().includes(q);
      const matchSub = unit.subType.toLowerCase().includes(q);
      const matchRank = unit.rank.toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchType && !matchSub && !matchRank) return false;
    }
    return true;
  });

  // Handle Unit Enlistment
  const handleEnlist = (unit: GroundTroop90Unit) => {
    const qty = enlistQuantities[unit.id] || 1;
    if (qty <= 0) return;

    const facility = facilities[unit.barracksFacility];
    const discount = facility ? facility.enlistmentDiscountPct / 100 : 0;

    const totalUntrainedNeeded = unit.cost.untrainedUnits * qty;
    const totalMetal = Math.round(unit.cost.metal * qty * (1 - discount));
    const totalCrystal = Math.round(unit.cost.crystal * qty * (1 - discount));
    const totalDeut = Math.round(unit.cost.deuterium * qty * (1 - discount));
    const totalNaq = Math.round(unit.cost.naquadah * qty * (1 - discount));
    const totalCredits = Math.round(unit.cost.credits * qty * (1 - discount));

    if (availableUntrained < totalUntrainedNeeded) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient unassigned recruits. Requires ${totalUntrainedNeeded.toLocaleString()} recruits, available: ${availableUntrained.toLocaleString()}.`,
      });
      return;
    }

    if (
      (resources.metal || 0) < totalMetal ||
      (resources.crystal || 0) < totalCrystal ||
      (resources.deuterium || 0) < totalDeut ||
      (resources.naquadah || 0) < totalNaq ||
      (resources.credits || 0) < totalCredits
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient resources to train ${qty} × ${unit.name}.`,
      });
      return;
    }

    onUpdateResources({
      untrainedUnits: availableUntrained - totalUntrainedNeeded,
      metal: Math.max(0, (resources.metal || 0) - totalMetal),
      crystal: Math.max(0, (resources.crystal || 0) - totalCrystal),
      deuterium: Math.max(0, (resources.deuterium || 0) - totalDeut),
      naquadah: Math.max(0, (resources.naquadah || 0) - totalNaq),
      credits: Math.max(0, (resources.credits || 0) - totalCredits),
    });

    setActiveTroopRoster((prev) => ({
      ...prev,
      [unit.id]: (prev[unit.id] || 0) + qty,
    }));

    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Enlisted & equipped ${qty.toLocaleString()} × ${unit.name} (${unit.rank}) into active planetary deployment!`,
    });
  };

  // Upgrade Facility
  const handleUpgradeFacility = (facilityName: string) => {
    const fac = facilities[facilityName];
    if (!fac) return;

    const upgradeMetal = fac.level * 8000;
    const upgradeCrystal = fac.level * 4500;
    const upgradeNaq = fac.level * 1500;
    const upgradeCredits = fac.level * 2000;

    if (
      (resources.metal || 0) < upgradeMetal ||
      (resources.crystal || 0) < upgradeCrystal ||
      (resources.naquadah || 0) < upgradeNaq ||
      (resources.credits || 0) < upgradeCredits
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient supplies to expand ${fac.name} (Requires ${upgradeMetal.toLocaleString()} Metal, ${upgradeCrystal.toLocaleString()} Crystal, ${upgradeNaq.toLocaleString()} Naq).`,
      });
      return;
    }

    onUpdateResources({
      metal: Math.max(0, (resources.metal || 0) - upgradeMetal),
      crystal: Math.max(0, (resources.crystal || 0) - upgradeCrystal),
      naquadah: Math.max(0, (resources.naquadah || 0) - upgradeNaq),
      credits: Math.max(0, (resources.credits || 0) - upgradeCredits),
    });

    setFacilities((prev) => ({
      ...prev,
      [facilityName]: {
        ...fac,
        level: fac.level + 1,
        trainingMultiplier: fac.trainingMultiplier + 0.1,
        enlistmentDiscountPct: Math.min(25, fac.enlistmentDiscountPct + 3),
        maxQueueCapacity: fac.maxQueueCapacity + 150,
      },
    }));

    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `${fac.name} upgraded to Level ${fac.level + 1}! Training velocity increased and equipment discount elevated.`,
    });
  };

  return (
    <div id="military-barracks-view" className="space-y-6">
      {/* 1. Header & Overview Banner */}
      <div className="border border-[#111111] bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-amber-50 text-amber-900 font-bold uppercase">
                MILITARY BARRACKS & ENLISTMENT FACILITIES
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono border border-emerald-600 bg-emerald-50 text-emerald-800 font-bold">
                90 GROUND UNIT CLASSES ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#111111] tracking-tight mt-1">
              Ground Forces & Unit Enlistment Facilities
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
              Recruit frontline strike soldiers, fortress sentinels, intelligence operatives, and counter-sabotage agents across
              90 dedicated classes, tiers (1–99), types & sub-types with advanced stats and sub-stats systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase block">Unassigned Recruits</span>
              <b className="text-sm text-indigo-700 font-bold">{availableUntrained.toLocaleString()}</b>
            </div>
            <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase block">Active Ground Troops</span>
              <b className="text-sm text-[#111111] font-bold">{totalTroops.toLocaleString()}</b>
            </div>
            <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase block">Assault Strike Power</span>
              <b className="text-sm text-red-700 font-bold">+{totalAssaultPower.toLocaleString()}</b>
            </div>
            <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase block">Fortress Bulwark</span>
              <b className="text-sm text-blue-700 font-bold">+{totalFortressDefense.toLocaleString()}</b>
            </div>
          </div>
        </div>

        {/* 4 Strategic Military Divisions Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#e2e8f0]">
          <button
            onClick={() => {
              sound.play('click');
              setSelectedDivision('frontline_strike');
            }}
            className={`p-3 border text-left cursor-pointer transition-all ${
              selectedDivision === 'frontline_strike'
                ? 'border-[#111111] bg-[#111111] text-white shadow-[2px_2px_0px_#666666]'
                : 'border-[#e2e8f0] bg-[#f8fafc] text-[#111111] hover:border-[#111111]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Swords size={14} className="text-red-500" /> 1. Frontline Strike
              </span>
              <span className="text-[10px] font-mono font-bold">30 Classes</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">Breach infantries, powered exosuits, plasma lancers, shock vanguards.</p>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setSelectedDivision('fortress_sentinel');
            }}
            className={`p-3 border text-left cursor-pointer transition-all ${
              selectedDivision === 'fortress_sentinel'
                ? 'border-[#111111] bg-[#111111] text-white shadow-[2px_2px_0px_#666666]'
                : 'border-[#e2e8f0] bg-[#f8fafc] text-[#111111] hover:border-[#111111]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Shield size={14} className="text-blue-500" /> 2. Fortress Sentinels
              </span>
              <span className="text-[10px] font-mono font-bold">25 Classes</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">Blast-wall sentries, flak AA batteries, planetary shield tuners.</p>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setSelectedDivision('intelligence_operative');
            }}
            className={`p-3 border text-left cursor-pointer transition-all ${
              selectedDivision === 'intelligence_operative'
                ? 'border-[#111111] bg-[#111111] text-white shadow-[2px_2px_0px_#666666]'
                : 'border-[#e2e8f0] bg-[#f8fafc] text-[#111111] hover:border-[#111111]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Eye size={14} className="text-purple-500" /> 3. Intelligence Operatives
              </span>
              <span className="text-[10px] font-mono font-bold">20 Classes</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">Cloaking sniper ghosts, subspace wiretappers, recon scouts.</p>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setSelectedDivision('counter_sabotage');
            }}
            className={`p-3 border text-left cursor-pointer transition-all ${
              selectedDivision === 'counter_sabotage'
                ? 'border-[#111111] bg-[#111111] text-white shadow-[2px_2px_0px_#666666]'
                : 'border-[#e2e8f0] bg-[#f8fafc] text-[#111111] hover:border-[#111111]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" /> 4. Counter-Sabotage
              </span>
              <span className="text-[10px] font-mono font-bold">15 Classes</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">Perimeter tripwire sappers, hazmat cleansers, ECM frequency sweepers.</p>
          </button>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div
            className={`mt-4 p-3 text-xs font-mono flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-[10px] uppercase font-bold cursor-pointer hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 2. Barracks Training Facilities Status */}
      <div className="border border-[#111111] bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
            <Cpu size={14} /> ACTIVE BARRACKS & PROVING GROUND WINGS
          </h4>
          <span className="text-[10px] font-mono text-[#64748b]">Expand facilities to boost training velocity & reduce costs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(facilities).map(([facName, fac]) => (
            <div key={facName} className="p-3 border border-[#cbd5e1] bg-[#f8fafc] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111] truncate">{fac.name}</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#111111] text-white">
                  Lvl {fac.level}
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#64748b] space-y-0.5">
                <div>• Training Speed: +{Math.round((fac.trainingMultiplier - 1) * 100)}%</div>
                <div>• Supply Discount: -{fac.enlistmentDiscountPct}%</div>
                <div>• Barracks Capacity: {fac.maxQueueCapacity.toLocaleString()} troops</div>
              </div>
              <button
                onClick={() => handleUpgradeFacility(facName)}
                className="w-full py-1 text-[10px] font-mono font-bold bg-white hover:bg-neutral-100 border border-[#111111] cursor-pointer transition-colors"
              >
                Expand Facility (+1 Level)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Filters & Unit Catalog Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Units Browser */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Tier Filter Controls */}
          <div className="border border-[#111111] bg-white p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search size={14} className="text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search by class, sub-class, rank, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-mono p-1 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setSelectedDivision('all')}
                className={`px-2 py-1 border text-[11px] font-bold ${
                  selectedDivision === 'all' ? 'bg-[#111111] text-white' : 'bg-white hover:bg-neutral-100'
                }`}
              >
                All 90
              </button>

              <select
                value={selectedTierFilter}
                onChange={(e) => setSelectedTierFilter(e.target.value)}
                className="p-1 border border-[#cbd5e1] text-[11px] bg-white cursor-pointer font-mono"
              >
                <option value="all">Tiers: 1–99 (All)</option>
                <option value="1-15">Tiers 1–15 (Standard)</option>
                <option value="16-40">Tiers 16–40 (Advanced)</option>
                <option value="41-70">Tiers 41–70 (Elite)</option>
                <option value="71-99">Tiers 71–99 (Legendary)</option>
              </select>
            </div>
          </div>

          {/* Unit Cards List */}
          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredUnits.map((unit) => {
              const count = activeTroopRoster[unit.id] || 0;
              const isSelected = selectedUnitDetail.id === unit.id;
              const qty = enlistQuantities[unit.id] || 1;

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitDetail(unit)}
                  className={`p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#111111] bg-white ring-2 ring-[#111111] shadow-xs'
                      : 'border-[#dedede] bg-[#fbfbfb] hover:border-[#111111] hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#111111] text-white uppercase">
                          Tier {unit.classTier}
                        </span>
                        <span className="text-[10px] font-mono text-[#64748b]">{unit.class} · {unit.subClass}</span>
                        {count > 0 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {count.toLocaleString()} Active
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#111111]">{unit.name}</h4>
                      <div className="text-[11px] font-mono text-[#64748b]">
                        Rank: <span className="font-bold text-[#111111]">{unit.rank}</span> ({unit.title}) · Type: {unit.type} ({unit.subType})
                      </div>
                    </div>

                    {/* Stats Snapshot */}
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div className="text-center px-2 py-1 bg-red-50 border border-red-200">
                        <span className="text-[9px] text-red-700 uppercase block font-bold">ATK</span>
                        <b className="text-red-950 font-black">{unit.stats.attack}</b>
                      </div>
                      <div className="text-center px-2 py-1 bg-blue-50 border border-blue-200">
                        <span className="text-[9px] text-blue-700 uppercase block font-bold">DEF</span>
                        <b className="text-blue-950 font-black">{unit.stats.defense}</b>
                      </div>
                      <div className="text-center px-2 py-1 bg-emerald-50 border border-emerald-200">
                        <span className="text-[9px] text-emerald-700 uppercase block font-bold">HP</span>
                        <b className="text-emerald-950 font-black">{unit.stats.health}</b>
                      </div>
                      <div className="text-center px-2 py-1 bg-neutral-100 border border-[#dedede]">
                        <span className="text-[9px] text-[#64748b] uppercase block font-bold">SPD</span>
                        <b className="text-[#111111] font-black">{unit.stats.speed}</b>
                      </div>
                    </div>
                  </div>

                  {/* Enlistment Row */}
                  <div className="mt-3 pt-2 border-t border-[#eeeeee] flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[10px] font-mono text-[#64748b]">
                      Cost: {unit.cost.untrainedUnits} Conscripts · {unit.cost.metal.toLocaleString()} M · {unit.cost.crystal.toLocaleString()} C · {unit.cost.naquadah.toLocaleString()} Naq
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={qty}
                        onChange={(e) => setEnlistQuantities({ ...enlistQuantities, [unit.id]: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-14 p-1 text-xs font-mono border border-[#cbd5e1] text-center"
                      />
                      <button
                        onClick={() => handleEnlist(unit)}
                        className="px-3 py-1 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer"
                      >
                        Enlist Squad
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Stats & Sub-Stats Inspector */}
        <div className="border border-[#111111] bg-white p-5 space-y-4">
          <div className="border-b border-[#e2e8f0] pb-3">
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#111111] text-white uppercase">
              Class Tier {selectedUnitDetail.classTier} / 99 · Sub-Class Tier {selectedUnitDetail.subClassTier}
            </span>
            <h3 className="text-lg font-black text-[#111111] mt-1">{selectedUnitDetail.name}</h3>
            <p className="text-xs font-mono text-[#64748b]">
              Rank: {selectedUnitDetail.rank} · Title: "{selectedUnitDetail.title}"
            </p>
          </div>

          {/* Lore narrative */}
          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#475569] leading-relaxed">
            {selectedUnitDetail.lore}
          </div>

          {/* 6 Primary Combat Stats */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1">
              <Activity size={13} /> PRIMARY COMBAT ATTRIBUTES
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2 border border-[#dedede] bg-white text-center">
                <span className="text-[9px] text-[#64748b] block">ATTACK</span>
                <b className="text-sm text-red-700">{selectedUnitDetail.stats.attack}</b>
              </div>
              <div className="p-2 border border-[#dedede] bg-white text-center">
                <span className="text-[9px] text-[#64748b] block">DEFENSE</span>
                <b className="text-sm text-blue-700">{selectedUnitDetail.stats.defense}</b>
              </div>
              <div className="p-2 border border-[#dedede] bg-white text-center">
                <span className="text-[9px] text-[#64748b] block">HEALTH</span>
                <b className="text-sm text-emerald-700">{selectedUnitDetail.stats.health}</b>
              </div>
              <div className="p-2 border border-[#dedede] bg-white text-center">
                <span className="text-[9px] text-[#64748b] block">SPEED</span>
                <b className="text-sm text-[#111111]">{selectedUnitDetail.stats.speed} km/h</b>
              </div>
              <div className="p-2 border border-[#dedede] bg-white text-center">
                <span className="text-[9px] text-[#64748b] block">ACCURACY</span>
                <b className="text-sm text-amber-700">{selectedUnitDetail.stats.accuracy}%</b>
              </div>
              <div className="p-2 border border-[#dedede] bg-white text-center">
                <span className="text-[9px] text-[#64748b] block">DODGE</span>
                <b className="text-sm text-purple-700">{selectedUnitDetail.stats.dodge}%</b>
              </div>
            </div>
          </div>

          {/* 12 Secondary Derived Sub-Stats */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1">
              <Sliders size={13} /> DERIVED SUB-STATS & COMBAT RATINGS
            </h4>
            <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Critical Hit Chance:</span>
                <b className="text-[#111111]">{selectedUnitDetail.subStats.criticalHitChance}% (×{selectedUnitDetail.subStats.criticalDamageMultiplier.toFixed(1)})</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Armor Penetration:</span>
                <b className="text-[#111111]">+{selectedUnitDetail.subStats.armorPenetration} Flat</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Shield Break Power:</span>
                <b className="text-[#111111]">+{selectedUnitDetail.subStats.shieldBreakPower} Energy Barrier</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Fortification Bonus:</span>
                <b className="text-blue-700">+{selectedUnitDetail.subStats.fortificationBonus}% in Bunkers</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Suppression Resistance:</span>
                <b className="text-[#111111]">{selectedUnitDetail.subStats.suppressionResistance}%</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Sight / Comms Radius:</span>
                <b className="text-[#111111]">{selectedUnitDetail.subStats.sightRangeKm} km / {selectedUnitDetail.subStats.communicationsRangeKm} km</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Electronic Jamming Res:</span>
                <b className="text-purple-700">{selectedUnitDetail.subStats.electronicResistance}%</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Psionic Disruption Res:</span>
                <b className="text-indigo-700">{selectedUnitDetail.subStats.psionicResistance}%</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Hourly Supply Upkeep:</span>
                <b className="text-amber-700">{selectedUnitDetail.subStats.supplyConsumption} Rations/hr</b>
              </div>
            </div>
          </div>

          {/* Training Facility Prerequisite */}
          <div className="p-3 bg-amber-50 border border-amber-300 text-xs font-mono space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1">
              <Info size={14} /> Training Wing Requirement:
            </div>
            <div className="text-amber-800">
              {selectedUnitDetail.barracksFacility} (Level {selectedUnitDetail.barracksMinLevel}+ Required)
            </div>
            <div className="text-[11px] text-amber-700">
              Unlocked at Imperial Commander Level {selectedUnitDetail.unlockedAtPlayerLevel}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
