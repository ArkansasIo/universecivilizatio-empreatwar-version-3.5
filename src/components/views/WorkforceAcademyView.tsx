import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Shield,
  Swords,
  Pickaxe,
  Eye,
  Factory,
  Landmark,
  Crosshair,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Sliders,
  DollarSign,
  Droplet,
  Wheat,
  Star,
  Crown,
  Bookmark,
} from 'lucide-react';
import {
  WorkforceBranch,
  WorkforceUnit,
  WorkforceAcademyState,
  WORKFORCE_90_UNITS,
  INITIAL_ACADEMY_WINGS,
  calculateWorkforceTotals,
  AcademyWing,
  PROMOTION_RANKS,
  UNIT_DOCTRINES,
  PromotionRank,
  UnitDoctrine,
  UnitExperienceData,
  getUnitRank,
  getNextRank,
  canPromoteUnit,
  promoteUnitRank,
  createDefaultUnitExperience,
} from '../../data/workforceAcademyData';
import { PlayerResources } from '../../types';
import { sound } from '../../sound';

interface WorkforceAcademyViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  academyState: WorkforceAcademyState;
  onUpdateAcademyState: (updater: (prev: WorkforceAcademyState) => WorkforceAcademyState) => void;
  onNavigate?: (route: string) => void;
  initialTab?: 'enlistment' | 'roster' | 'wings' | 'drills' | 'veterancy';
}

export const WorkforceAcademyView: React.FC<WorkforceAcademyViewProps> = ({
  resources,
  onUpdateResources,
  academyState,
  onUpdateAcademyState,
  onNavigate,
  initialTab = 'enlistment',
}) => {
  const [activeTab, setActiveTab] = useState<'enlistment' | 'roster' | 'wings' | 'drills' | 'veterancy'>(initialTab);
  const [selectedBranch, setSelectedBranch] = useState<WorkforceBranch | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedVeterancyRank, setSelectedVeterancyRank] = useState<number | 'all'>('all');
  const [onlyReadyForPromotion, setOnlyReadyForPromotion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [enlistQuantities, setEnlistQuantities] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const unitExpMap = academyState.unitExperience || createDefaultUnitExperience();
  const totals = calculateWorkforceTotals(academyState.unitCounts, unitExpMap);

  // Available untrained pool from resources or state
  const availableUntrained = resources.untrainedUnits || 0;

  // Filtered unit list
  const filteredUnits = WORKFORCE_90_UNITS.filter((unit) => {
    if (selectedBranch !== 'all' && unit.branch !== selectedBranch) return false;
    if (selectedTier !== 'all' && unit.tier !== selectedTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = unit.name.toLowerCase().includes(q);
      const matchClass = unit.jobClass.toLowerCase().includes(q);
      const matchRank = unit.rankTitle.toLowerCase().includes(q);
      const matchType = unit.unitType.toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchRank && !matchType) return false;
    }
    return true;
  });

  // Filtered unit list for Experience & Promotion tab
  const filteredVeterancyUnits = WORKFORCE_90_UNITS.filter((unit) => {
    if (selectedBranch !== 'all' && unit.branch !== selectedBranch) return false;
    const exp = unitExpMap[unit.id];
    const currentRankTier = exp ? exp.currentRank : 0;
    if (selectedVeterancyRank !== 'all' && currentRankTier !== selectedVeterancyRank) return false;
    if (onlyReadyForPromotion && !canPromoteUnit(exp)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = unit.name.toLowerCase().includes(q);
      const matchClass = unit.jobClass.toLowerCase().includes(q);
      const matchRank = unit.rankTitle.toLowerCase().includes(q);
      const matchType = unit.unitType.toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchRank && !matchType) return false;
    }
    return true;
  });

  // Calculate wing discount & speed
  const getWingStats = (wingId: string) => {
    const level = academyState.wingLevels[wingId] || 1;
    const wingDef = INITIAL_ACADEMY_WINGS.find((w) => w.id === wingId);
    const speedBonus = (wingDef?.trainingSpeedBonusPct || 10) * level;
    const discountPct = Math.min(50, (wingDef?.costDiscountPct || 5) * (level - 1));
    return { level, speedBonus, discountPct };
  };

  // Enlist units handler
  const handleEnlist = (unit: WorkforceUnit, count: number) => {
    if (count <= 0) return;

    const { discountPct } = getWingStats(unit.requiredAcademyWing);
    const discountMultiplier = Math.max(0.5, 1 - discountPct / 100);

    const neededUntrained = unit.cost.untrainedUnits * count;
    const neededMetal = Math.round(unit.cost.metal * count * discountMultiplier);
    const neededCrystal = Math.round(unit.cost.crystal * count * discountMultiplier);
    const neededNaquadah = Math.round(unit.cost.naquadah * count * discountMultiplier);
    const neededCredits = Math.round(unit.cost.credits * count * discountMultiplier);

    // Validate resource balances
    if (availableUntrained < neededUntrained) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient untrained citizens/conscripts! Required: ${neededUntrained.toLocaleString()}, Available: ${availableUntrained.toLocaleString()}`,
      });
      return;
    }
    if ((resources.metal || 0) < neededMetal) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Insufficient Metal! Required: ${neededMetal.toLocaleString()}` });
      return;
    }
    if ((resources.crystal || 0) < neededCrystal) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Insufficient Crystal! Required: ${neededCrystal.toLocaleString()}` });
      return;
    }
    if ((resources.naquadah || 0) < neededNaquadah) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Insufficient Naquadah! Required: ${neededNaquadah.toLocaleString()}` });
      return;
    }
    if ((resources.credits || 0) < neededCredits) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Insufficient Galactic Credits! Required: ${neededCredits.toLocaleString()}` });
      return;
    }

    // Deduct resources
    onUpdateResources({
      untrainedUnits: Math.max(0, availableUntrained - neededUntrained),
      metal: Math.max(0, (resources.metal || 0) - neededMetal),
      crystal: Math.max(0, (resources.crystal || 0) - neededCrystal),
      naquadah: Math.max(0, (resources.naquadah || 0) - neededNaquadah),
      credits: Math.max(0, (resources.credits || 0) - neededCredits),
    });

    // Add trained units
    onUpdateAcademyState((prev) => ({
      ...prev,
      unitCounts: {
        ...prev.unitCounts,
        [unit.id]: (prev.unitCounts[unit.id] || 0) + count,
      },
    }));

    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Successfully graduated ${count.toLocaleString()} × ${unit.name} (${unit.rankTitle}) into Imperial Service!`,
    });

    // Reset input
    setEnlistQuantities((prev) => ({ ...prev, [unit.id]: 0 }));
  };

  // Demobilize units back to untrained pool
  const handleDemobilize = (unit: WorkforceUnit, count: number) => {
    const current = academyState.unitCounts[unit.id] || 0;
    if (current < count || count <= 0) return;

    const returnedUntrained = unit.cost.untrainedUnits * count;

    onUpdateResources({
      untrainedUnits: availableUntrained + returnedUntrained,
    });

    onUpdateAcademyState((prev) => ({
      ...prev,
      unitCounts: {
        ...prev.unitCounts,
        [unit.id]: Math.max(0, (prev.unitCounts[unit.id] || 0) - count),
      },
    }));

    sound.play('click');
    setFeedback({
      type: 'success',
      text: `Demobilized ${count.toLocaleString()} × ${unit.name}. ${returnedUntrained.toLocaleString()} citizens returned to unassigned reserve.`,
    });
  };

  // Upgrade Academy Wing
  const handleUpgradeWing = (wing: AcademyWing) => {
    const currentLevel = academyState.wingLevels[wing.id] || 1;
    if (currentLevel >= wing.maxLevel) return;

    const costMultiplier = Math.pow(1.65, currentLevel);
    const costMetal = Math.round(wing.baseCost.metal * costMultiplier);
    const costCrystal = Math.round(wing.baseCost.crystal * costMultiplier);
    const costDeut = Math.round(wing.baseCost.deuterium * costMultiplier);
    const costNaq = Math.round(wing.baseCost.naquadah * costMultiplier);
    const costCredits = Math.round(wing.baseCost.credits * costMultiplier);

    if (
      (resources.metal || 0) < costMetal ||
      (resources.crystal || 0) < costCrystal ||
      (resources.deuterium || 0) < costDeut ||
      (resources.naquadah || 0) < costNaq ||
      (resources.credits || 0) < costCredits
    ) {
      sound.play('warning');
      setFeedback({ type: 'error', text: 'Insufficient resources to expand Academy wing facility.' });
      return;
    }

    onUpdateResources({
      metal: Math.max(0, (resources.metal || 0) - costMetal),
      crystal: Math.max(0, (resources.crystal || 0) - costCrystal),
      deuterium: Math.max(0, (resources.deuterium || 0) - costDeut),
      naquadah: Math.max(0, (resources.naquadah || 0) - costNaq),
      credits: Math.max(0, (resources.credits || 0) - costCredits),
    });

    onUpdateAcademyState((prev) => ({
      ...prev,
      wingLevels: {
        ...prev.wingLevels,
        [wing.id]: currentLevel + 1,
      },
    }));

    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `${wing.name} expanded to Level ${currentLevel + 1}! Training velocity increased and tuition discounts unlocked.`,
    });
  };

  // Run Academy Drill Simulation
  const handleRunDrill = () => {
    sound.play('confirm');
    const gainedScore = Math.floor(Math.random() * 250) + 150;
    const newScore = academyState.academyDrillScore + gainedScore;

    let newRank = 'Cadet Aspirant';
    if (newScore > 5000) newRank = 'Imperial Warmaster';
    else if (newScore > 3500) newRank = 'Grand Legatus';
    else if (newScore > 2500) newRank = 'Centurion 1st Class';
    else if (newScore > 1500) newRank = 'Centurion 2nd Class';
    else if (newScore > 800) newRank = 'Staff Decurion';

    onUpdateAcademyState((prev) => ({
      ...prev,
      academyDrillScore: newScore,
      academyDrillRank: newRank,
    }));

    // Grant bonus untrained recruits from high public morale
    const bonusRecruits = 50 + Math.floor(Math.random() * 40);
    onUpdateResources({
      untrainedUnits: availableUntrained + bonusRecruits,
    });

    setFeedback({
      type: 'success',
      text: `Drill simulation complete! +${gainedScore} Academy Readiness Score earned. ${bonusRecruits} motivated recruits enlisted in civilian reserve! Current Rank: ${newRank}.`,
    });
  };

  // Promotion & Experience Handlers
  const handlePromoteUnit = (unit: WorkforceUnit) => {
    const exp = unitExpMap[unit.id];
    if (!exp) return;
    if (!canPromoteUnit(exp)) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Cannot promote ${unit.name}. Insufficient Combat XP to meet rank advancement threshold.`,
      });
      return;
    }

    const nextRank = getNextRank(exp.currentRank);
    const updatedExp = promoteUnitRank(exp);

    onUpdateAcademyState((prev) => ({
      ...prev,
      unitExperience: {
        ...(prev.unitExperience || createDefaultUnitExperience()),
        [unit.id]: updatedExp,
      },
    }));

    sound.play('success');
    setFeedback({
      type: 'success',
      text: `Cadre Promoted! ${unit.name} ascended to ${nextRank?.romanNumeral} (${nextRank?.name})! Permanent generational stat bonus: +${Math.round(((nextRank?.attackMult || 1) - 1) * 100)}% ATK, +${Math.round(((nextRank?.defenseMult || 1) - 1) * 100)}% DEF, -${nextRank?.upkeepDiscountPct}% Upkeep.`,
    });
  };

  const handlePromoteAll = () => {
    let promotedCount = 0;
    const newExpMap = { ...unitExpMap };

    WORKFORCE_90_UNITS.forEach((unit) => {
      const exp = newExpMap[unit.id];
      if (exp && canPromoteUnit(exp)) {
        newExpMap[unit.id] = promoteUnitRank(exp);
        promotedCount++;
      }
    });

    if (promotedCount === 0) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: 'No unit cadres currently meet the threshold for rank promotion.',
      });
      return;
    }

    onUpdateAcademyState((prev) => ({
      ...prev,
      unitExperience: newExpMap,
    }));

    sound.play('success');
    setFeedback({
      type: 'success',
      text: `Imperial Promotion Decreed! Promoted ${promotedCount} unit cadres to higher rank tiers. All current & future recruits inherit upgraded combat modifiers!`,
    });
  };

  const handleSetDoctrine = (unitId: string, doctrineId: string) => {
    sound.play('click');
    onUpdateAcademyState((prev) => {
      const currExpMap = { ...(prev.unitExperience || createDefaultUnitExperience()) };
      const exp = currExpMap[unitId] || {
        unitId,
        xp: 0,
        currentRank: 0,
        highestRankReached: 0,
        totalCombatBattles: 0,
        totalMissionsCompleted: 0,
      };
      currExpMap[unitId] = {
        ...exp,
        activeDoctrineId: doctrineId,
      };
      return {
        ...prev,
        unitExperience: currExpMap,
      };
    });
  };

  const handleConductFieldDrill = (unit: WorkforceUnit) => {
    const costMetal = 800;
    const costCrystal = 500;
    const costNaq = 150;
    const costCredits = 300;

    if (
      (resources.metal || 0) < costMetal ||
      (resources.crystal || 0) < costCrystal ||
      (resources.naquadah || 0) < costNaq ||
      (resources.credits || 0) < costCredits
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: 'Insufficient supplies for field exercises (Requires 800 Metal, 500 Crystal, 150 Naquadah, 300 Credits).',
      });
      return;
    }

    onUpdateResources({
      metal: Math.max(0, (resources.metal || 0) - costMetal),
      crystal: Math.max(0, (resources.crystal || 0) - costCrystal),
      naquadah: Math.max(0, (resources.naquadah || 0) - costNaq),
      credits: Math.max(0, (resources.credits || 0) - costCredits),
    });

    onUpdateAcademyState((prev) => {
      const currExpMap = { ...(prev.unitExperience || createDefaultUnitExperience()) };
      const exp = currExpMap[unit.id] || {
        unitId: unit.id,
        xp: 0,
        currentRank: 0,
        highestRankReached: 0,
        totalCombatBattles: 0,
        totalMissionsCompleted: 0,
        activeDoctrineId: 'balanced_standard',
      };
      currExpMap[unit.id] = {
        ...exp,
        xp: exp.xp + 45,
        totalCombatBattles: exp.totalCombatBattles + 1,
      };
      return {
        ...prev,
        unitExperience: currExpMap,
      };
    });

    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Field exercises complete for ${unit.name}! +45 Combat XP gained towards next rank ascension.`,
    });
  };

  const handleConductImperialWarGames = () => {
    const costMetal = 20000;
    const costCrystal = 12000;
    const costDeut = 4000;
    const costNaq = 2500;
    const costCredits = 6000;

    if (
      (resources.metal || 0) < costMetal ||
      (resources.crystal || 0) < costCrystal ||
      (resources.deuterium || 0) < costDeut ||
      (resources.naquadah || 0) < costNaq ||
      (resources.credits || 0) < costCredits
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: 'Insufficient planetary stockpile for Live-Fire Imperial War Games (Requires 20k Metal, 12k Crystal, 4k Deut, 2.5k Naq, 6k Credits).',
      });
      return;
    }

    onUpdateResources({
      metal: Math.max(0, (resources.metal || 0) - costMetal),
      crystal: Math.max(0, (resources.crystal || 0) - costCrystal),
      deuterium: Math.max(0, (resources.deuterium || 0) - costDeut),
      naquadah: Math.max(0, (resources.naquadah || 0) - costNaq),
      credits: Math.max(0, (resources.credits || 0) - costCredits),
    });

    let affectedCount = 0;
    onUpdateAcademyState((prev) => {
      const currExpMap = { ...(prev.unitExperience || createDefaultUnitExperience()) };
      WORKFORCE_90_UNITS.forEach((u) => {
        if ((prev.unitCounts[u.id] || 0) > 0) {
          const exp = currExpMap[u.id] || {
            unitId: u.id,
            xp: 0,
            currentRank: 0,
            highestRankReached: 0,
            totalCombatBattles: 0,
            totalMissionsCompleted: 0,
            activeDoctrineId: 'balanced_standard',
          };
          currExpMap[u.id] = {
            ...exp,
            xp: exp.xp + 150,
            totalCombatBattles: exp.totalCombatBattles + 3,
          };
          affectedCount++;
        }
      });
      return {
        ...prev,
        unitExperience: currExpMap,
        totalCombatSimulationsRun: (prev.totalCombatSimulationsRun || 0) + 1,
      };
    });

    sound.play('combat');
    setFeedback({
      type: 'success',
      text: `Live-Fire Imperial War Games conducted across orbital and terrestrial proving grounds! +150 Combat XP granted to ${affectedCount} active unit cadres!`,
    });
  };

  return (
    <div id="workforce-academy-view" className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="border border-[#dedede] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 flex items-center gap-1.5 font-mono">
              <GraduationCap size={14} className="text-amber-500" />
              <span>DOMINION WORKFORCE ENLISTMENT & SPECIALIZED ACADEMY · 90-ROLE ROSTER</span>
            </div>
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              Workforce Recruitment & Specialized Academy
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
              Enlist raw citizen population into frontline combat divisions, orbital defense garrisons, deep-mantle
              Naquadah miners, or covert espionage operatives. Advance the 6 Imperial Academy Wings to accelerate training velocity
              and reduce equipment requisitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 bg-neutral-50 border border-[#dedede] font-mono text-xs">
              <span className="text-[10px] text-[#888888] uppercase block">Unassigned Recruits</span>
              <b className="text-base text-indigo-700 font-extrabold">{availableUntrained.toLocaleString()}</b>
            </div>
            <div className="px-3 py-2 bg-neutral-50 border border-[#dedede] font-mono text-xs">
              <span className="text-[10px] text-[#888888] uppercase block">Active Personnel</span>
              <b className="text-base text-[#111111] font-extrabold">{totals.totalPersonnel.toLocaleString()}</b>
            </div>
            <div className="px-3 py-2 bg-neutral-50 border border-[#dedede] font-mono text-xs">
              <span className="text-[10px] text-[#888888] uppercase block">Drill Readiness</span>
              <b className="text-base text-amber-600 font-extrabold">{academyState.academyDrillRank}</b>
            </div>
          </div>
        </div>

        {/* Live Macro Metrics Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-4 pt-4 border-t border-[#eeeeee] font-mono text-xs">
          <div className="p-2 bg-red-50/70 border border-red-200">
            <span className="text-[9px] uppercase font-bold text-red-800 block flex items-center gap-1">
              <Swords size={11} /> Frontline Attack
            </span>
            <b className="text-sm text-red-950 font-black">+{totals.totalAttack.toLocaleString()}</b>
          </div>
          <div className="p-2 bg-blue-50/70 border border-blue-200">
            <span className="text-[9px] uppercase font-bold text-blue-800 block flex items-center gap-1">
              <Shield size={11} /> Orbital Defense
            </span>
            <b className="text-sm text-blue-950 font-black">+{totals.totalDefense.toLocaleString()}</b>
          </div>
          <div className="p-2 bg-amber-50/70 border border-amber-200">
            <span className="text-[9px] uppercase font-bold text-amber-800 block flex items-center gap-1">
              <Pickaxe size={11} /> Naquadah Extraction
            </span>
            <b className="text-sm text-amber-950 font-black">+{totals.totalMiningYield.toLocaleString()}/t</b>
          </div>
          <div className="p-2 bg-emerald-50/70 border border-emerald-200">
            <span className="text-[9px] uppercase font-bold text-emerald-800 block flex items-center gap-1">
              <Wheat size={11} /> Food Yield
            </span>
            <b className="text-sm text-emerald-950 font-black">+{totals.totalFoodYield.toLocaleString()}/t</b>
          </div>
          <div className="p-2 bg-cyan-50/70 border border-cyan-200">
            <span className="text-[9px] uppercase font-bold text-cyan-800 block flex items-center gap-1">
              <Droplet size={11} /> Water Yield
            </span>
            <b className="text-sm text-cyan-950 font-black">+{totals.totalWaterYield.toLocaleString()}/t</b>
          </div>
          <div className="p-2 bg-purple-50/70 border border-purple-200">
            <span className="text-[9px] uppercase font-bold text-purple-800 block flex items-center gap-1">
              <Eye size={11} /> Covert Intel
            </span>
            <b className="text-sm text-purple-950 font-black">{totals.totalEspionage.toLocaleString()} pts</b>
          </div>
          <div className="p-2 bg-yellow-50/70 border border-yellow-200">
            <span className="text-[9px] uppercase font-bold text-yellow-800 block flex items-center gap-1">
              <DollarSign size={11} /> Tax Revenues
            </span>
            <b className="text-sm text-yellow-950 font-black">+{totals.totalCreditsTax.toLocaleString()}/t</b>
          </div>
        </div>

        {/* Feedback Alert */}
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
              type="button"
              onClick={() => setFeedback(null)}
              className="text-[10px] uppercase font-bold cursor-pointer hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-[#eeeeee]">
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('enlistment');
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'enlistment'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-neutral-100 text-[#555555] hover:bg-neutral-200 border border-[#dedede]'
            }`}
          >
            <Crosshair size={14} className={activeTab === 'enlistment' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>01. Enlistment & Academy Specialization</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('roster');
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-neutral-100 text-[#555555] hover:bg-neutral-200 border border-[#dedede]'
            }`}
          >
            <Users size={14} className={activeTab === 'roster' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>02. Imperial Workforce Roster (90 Roles)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('wings');
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'wings'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-neutral-100 text-[#555555] hover:bg-neutral-200 border border-[#dedede]'
            }`}
          >
            <GraduationCap size={14} className={activeTab === 'wings' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>03. Specialized Academy Wings ({INITIAL_ACADEMY_WINGS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('drills');
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'drills'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-neutral-100 text-[#555555] hover:bg-neutral-200 border border-[#dedede]'
            }`}
          >
            <Award size={14} className={activeTab === 'drills' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>04. Drills, Readiness & Auto-Draft</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveTab('veterancy');
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'veterancy'
                ? 'bg-[#111111] text-amber-400 border border-amber-500/50 shadow-xs'
                : 'bg-neutral-100 text-[#555555] hover:bg-neutral-200 border border-[#dedede]'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'veterancy' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>05. Experience, Promotion & Doctrines</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ENLISTMENT & SPECIALIZATION INTERFACE */}
      {activeTab === 'enlistment' && (
        <div className="space-y-6">
          {/* Quick Enlistment Filter Bar */}
          <div className="border border-[#dedede] bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-[#888888] font-bold text-[10px] uppercase mr-1">Specialization Branch:</span>
              {(
                [
                  { id: 'all', label: 'All Branches' },
                  { id: 'frontline', label: 'Combat Divisions' },
                  { id: 'orbital_defense', label: 'Orbital Garrisons' },
                  { id: 'naquadah_mining', label: 'Naquadah Miners' },
                  { id: 'espionage', label: 'Espionage Operatives' },
                  { id: 'civilian_production', label: 'Civilian Life-Support' },
                  { id: 'government', label: 'Imperial Chancellery' },
                  { id: 'untrained', label: 'Raw Conscripts' },
                ] as Array<{ id: WorkforceBranch | 'all'; label: string }>
              ).map((br) => (
                <button
                  key={br.id}
                  type="button"
                  onClick={() => setSelectedBranch(br.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer border ${
                    selectedBranch === br.id
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#555555] border-[#dedede] hover:bg-neutral-100'
                  }`}
                >
                  {br.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-[#999999]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter 90 roles..."
                  className="pl-8 pr-3 py-1.5 border border-[#cccccc] text-xs font-mono focus:border-[#111111] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Unit Enlistment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => {
              const currentEnlisted = academyState.unitCounts[unit.id] || 0;
              const { level: wingLvl, discountPct } = getWingStats(unit.requiredAcademyWing);
              const discountMultiplier = Math.max(0.5, 1 - discountPct / 100);
              const isLocked = wingLvl < unit.requiredAcademyLevel;

              const qty = enlistQuantities[unit.id] || 1;

              const totalUntrainedCost = unit.cost.untrainedUnits * qty;
              const totalMetalCost = Math.round(unit.cost.metal * qty * discountMultiplier);
              const totalCrystalCost = Math.round(unit.cost.crystal * qty * discountMultiplier);
              const totalNaqCost = Math.round(unit.cost.naquadah * qty * discountMultiplier);
              const totalCreditsCost = Math.round(unit.cost.credits * qty * discountMultiplier);

              const canAfford =
                !isLocked &&
                availableUntrained >= totalUntrainedCost &&
                (resources.metal || 0) >= totalMetalCost &&
                (resources.crystal || 0) >= totalCrystalCost &&
                (resources.naquadah || 0) >= totalNaqCost &&
                (resources.credits || 0) >= totalCreditsCost;

              return (
                <div
                  key={unit.id}
                  className={`border p-4 bg-white shadow-2xs flex flex-col justify-between transition-all ${
                    isLocked ? 'border-dashed border-[#cccccc] opacity-75' : 'border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {(() => {
                          const exp = unitExpMap[unit.id];
                          const rankInfo = getUnitRank(exp);
                          const doctrine = UNIT_DOCTRINES.find((d) => d.id === exp?.activeDoctrineId) || UNIT_DOCTRINES[0];
                          return (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-neutral-100 border border-[#dedede] text-[#666666]">
                                TIER {unit.tier}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                                  unit.branch === 'frontline'
                                    ? 'bg-red-100 text-red-800'
                                    : unit.branch === 'orbital_defense'
                                    ? 'bg-blue-100 text-blue-800'
                                    : unit.branch === 'naquadah_mining'
                                    ? 'bg-amber-100 text-amber-800'
                                    : unit.branch === 'espionage'
                                    ? 'bg-purple-100 text-purple-800'
                                    : unit.branch === 'civilian_production'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {unit.jobClass}
                              </span>
                              <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase border ${rankInfo.badgeColor}`}>
                                {rankInfo.romanNumeral} {rankInfo.name}
                              </span>
                              {exp && exp.currentRank >= 2 && (
                                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-neutral-900 border border-neutral-700 text-neutral-300">
                                  {doctrine.badge}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                        <h4 className="text-base font-extrabold text-[#111111] mt-1">{unit.name}</h4>
                        <div className="text-[11px] font-mono text-[#777777]">
                          Rank: <strong className="text-[#333333]">{unit.rankTitle}</strong> · Subtype:{' '}
                          {unit.unitSubtype}
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[10px] text-[#888888] uppercase block">Enlisted</span>
                        <b className="text-base font-black text-[#111111]">{currentEnlisted.toLocaleString()}</b>
                      </div>
                    </div>

                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-2">{unit.lore}</p>

                    {/* Stats Pill Matrix */}
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] bg-neutral-50 p-2 border border-[#eeeeee]">
                      {unit.stats.attack > 0 && (
                        <div>
                          <span className="text-[#888888] block">ATK</span>
                          <b className="text-red-700">+{unit.stats.attack}</b>
                        </div>
                      )}
                      {unit.stats.defense > 0 && (
                        <div>
                          <span className="text-[#888888] block">DEF</span>
                          <b className="text-blue-700">+{unit.stats.defense}</b>
                        </div>
                      )}
                      {unit.stats.miningYield > 0 && (
                        <div>
                          <span className="text-[#888888] block">NAQ YLD</span>
                          <b className="text-amber-700">+{unit.stats.miningYield}/100</b>
                        </div>
                      )}
                      {unit.stats.productionYield > 0 && (
                        <div>
                          <span className="text-[#888888] block">IND YLD</span>
                          <b className="text-[#222222]">+{unit.stats.productionYield}/100</b>
                        </div>
                      )}
                      {unit.stats.foodYield > 0 && (
                        <div>
                          <span className="text-[#888888] block">FOOD</span>
                          <b className="text-emerald-700">+{unit.stats.foodYield}/100</b>
                        </div>
                      )}
                      {unit.stats.waterYield > 0 && (
                        <div>
                          <span className="text-[#888888] block">WATER</span>
                          <b className="text-cyan-700">+{unit.stats.waterYield}/100</b>
                        </div>
                      )}
                      {unit.stats.creditsTaxYield > 0 && (
                        <div>
                          <span className="text-[#888888] block">TAX GC</span>
                          <b className="text-yellow-700">+{unit.stats.creditsTaxYield}/100</b>
                        </div>
                      )}
                      {unit.stats.espionagePower > 0 && (
                        <div>
                          <span className="text-[#888888] block">COVERT</span>
                          <b className="text-purple-700">+{unit.stats.espionagePower}</b>
                        </div>
                      )}
                      <div>
                        <span className="text-[#888888] block">UPKEEP</span>
                        <span className="text-[#666666]">
                          {unit.stats.foodUpkeep}F / {unit.stats.waterUpkeep}W / {unit.stats.creditsUpkeep}GC
                        </span>
                      </div>
                    </div>

                    {/* Requirements / Lock Status */}
                    {isLocked && (
                      <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[11px] flex items-center gap-1.5">
                        <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                        <span>Requires {unit.requiredAcademyWing} Level {unit.requiredAcademyLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Enlist Controls */}
                  <div className="pt-3 border-t border-[#eeeeee] mt-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#666666]">
                      <span>Requisition Cost ({qty}x):</span>
                      <span className="font-bold text-[#111111]">
                        {totalUntrainedCost} Recruits · {totalMetalCost}M · {totalNaqCost}NQ · {totalCreditsCost}GC
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Quantity Preset Buttons */}
                      <button
                        type="button"
                        onClick={() => setEnlistQuantities((prev) => ({ ...prev, [unit.id]: 1 }))}
                        className={`px-2 py-1 text-[10px] font-mono font-bold cursor-pointer border ${
                          qty === 1 ? 'bg-[#111111] text-white' : 'bg-neutral-100 text-[#444444]'
                        }`}
                      >
                        1
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnlistQuantities((prev) => ({ ...prev, [unit.id]: 10 }))}
                        className={`px-2 py-1 text-[10px] font-mono font-bold cursor-pointer border ${
                          qty === 10 ? 'bg-[#111111] text-white' : 'bg-neutral-100 text-[#444444]'
                        }`}
                      >
                        10
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnlistQuantities((prev) => ({ ...prev, [unit.id]: 50 }))}
                        className={`px-2 py-1 text-[10px] font-mono font-bold cursor-pointer border ${
                          qty === 50 ? 'bg-[#111111] text-white' : 'bg-neutral-100 text-[#444444]'
                        }`}
                      >
                        50
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnlistQuantities((prev) => ({ ...prev, [unit.id]: 100 }))}
                        className={`px-2 py-1 text-[10px] font-mono font-bold cursor-pointer border ${
                          qty === 100 ? 'bg-[#111111] text-white' : 'bg-neutral-100 text-[#444444]'
                        }`}
                      >
                        100
                      </button>

                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleEnlist(unit, qty)}
                        className={`flex-1 py-1.5 px-3 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-[#111111] hover:bg-[#333333] text-white'
                            : 'bg-neutral-200 text-[#888888] cursor-not-allowed'
                        }`}
                      >
                        <GraduationCap size={13} className={canAfford ? 'text-amber-400' : 'text-[#888888]'} />
                        <span>Enlist ({qty})</span>
                      </button>

                      {currentEnlisted > 0 && (
                        <button
                          type="button"
                          onClick={() => handleDemobilize(unit, Math.min(qty, currentEnlisted))}
                          title="Demobilize and return citizens to untrained pool"
                          className="px-2 py-1.5 border border-[#cccccc] hover:bg-neutral-100 text-[#555555] text-[10px] font-mono font-bold uppercase cursor-pointer"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPLETE 90-ROLE ROSTER MATRIX */}
      {activeTab === 'roster' && (
        <div className="border border-[#dedede] bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eeeeee] pb-4">
            <div>
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-amber-500" />
                <span>Imperial Workforce Registry · Complete 90 Job Specializations</span>
              </h3>
              <p className="text-xs text-[#777777] mt-0.5">
                Comprehensive directory of every civilian, industrial, military, and black-ops role in the Dominion.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#888888]">
                Displaying <strong>{filteredUnits.length}</strong> of 90 Roles
              </span>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-[#dedede]">
              <thead className="bg-[#fafafa] border-b border-[#dedede] text-[10px] text-[#666666] uppercase">
                <tr>
                  <th className="p-2.5">ID / Tier</th>
                  <th className="p-2.5">Role Name & Rank</th>
                  <th className="p-2.5">Branch / Job Class</th>
                  <th className="p-2.5">Unit Subtype</th>
                  <th className="p-2.5 text-right">Combat (ATK/DEF)</th>
                  <th className="p-2.5 text-right">Yields (/100)</th>
                  <th className="p-2.5 text-right">Upkeep</th>
                  <th className="p-2.5 text-right">Active Count</th>
                  <th className="p-2.5 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeee]">
                {filteredUnits.map((u) => {
                  const count = academyState.unitCounts[u.id] || 0;
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-2.5 font-bold text-[#888888]">
                        <span>{u.id}</span>
                        <span className="block text-[9px] text-[#aaaaaa]">T{u.tier}</span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-sm font-bold text-[#111111]">{u.name}</strong>
                          {(() => {
                            const exp = unitExpMap[u.id];
                            const rnk = getUnitRank(exp);
                            const doc = UNIT_DOCTRINES.find((d) => d.id === exp?.activeDoctrineId) || UNIT_DOCTRINES[0];
                            return (
                              <div className="inline-flex items-center gap-1">
                                <span className={`px-1 py-0.2 text-[8px] font-mono font-bold uppercase rounded-2xs border ${rnk.badgeColor}`}>
                                  {rnk.romanNumeral} {rnk.name}
                                </span>
                                {exp && exp.currentRank >= 2 && (
                                  <span className="px-1 py-0.2 text-[8px] font-mono font-bold uppercase bg-neutral-900 border border-neutral-700 text-neutral-300 rounded-2xs">
                                    {doc.badge}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <span className="text-[10px] text-[#666666] block">{u.rankTitle}</span>
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-2xs ${
                            u.branch === 'frontline'
                              ? 'bg-red-50 text-red-700'
                              : u.branch === 'orbital_defense'
                              ? 'bg-blue-50 text-blue-700'
                              : u.branch === 'naquadah_mining'
                              ? 'bg-amber-50 text-amber-700'
                              : u.branch === 'espionage'
                              ? 'bg-purple-50 text-purple-700'
                              : u.branch === 'civilian_production'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {u.jobClass}
                        </span>
                        <div className="text-[10px] text-[#888888] mt-0.5">{u.jobSubclass}</div>
                      </td>
                      <td className="p-2.5 text-[#555555]">
                        <div>{u.unitType}</div>
                        <div className="text-[10px] text-[#888888]">{u.unitSubtype}</div>
                      </td>
                      <td className="p-2.5 text-right">
                        <span className="text-red-700 font-bold">{u.stats.attack}</span> /{' '}
                        <span className="text-blue-700 font-bold">{u.stats.defense}</span>
                      </td>
                      <td className="p-2.5 text-right text-[11px]">
                        {u.stats.miningYield > 0 && (
                          <span className="text-amber-700 block">+{u.stats.miningYield} NQ</span>
                        )}
                        {u.stats.foodYield > 0 && (
                          <span className="text-emerald-700 block">+{u.stats.foodYield} Food</span>
                        )}
                        {u.stats.waterYield > 0 && (
                          <span className="text-cyan-700 block">+{u.stats.waterYield} H2O</span>
                        )}
                        {u.stats.creditsTaxYield > 0 && (
                          <span className="text-yellow-700 block">+{u.stats.creditsTaxYield} GC</span>
                        )}
                        {u.stats.productionYield > 0 && (
                          <span className="text-[#333333] block">+{u.stats.productionYield} Ind</span>
                        )}
                        {u.stats.espionagePower > 0 && (
                          <span className="text-purple-700 block">+{u.stats.espionagePower} Cov</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right text-[10px] text-[#666666]">
                        {u.stats.foodUpkeep}F · {u.stats.waterUpkeep}W · {u.stats.creditsUpkeep}GC
                      </td>
                      <td className="p-2.5 text-right font-black text-sm text-[#111111]">
                        {count.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('enlistment');
                            setSelectedBranch(u.branch);
                            setSearchQuery(u.name);
                          }}
                          className="px-2 py-1 bg-neutral-100 hover:bg-[#111111] hover:text-white border border-[#dedede] text-[10px] uppercase font-bold transition-colors cursor-pointer"
                        >
                          Enlist
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SPECIALIZED ACADEMY WINGS */}
      {activeTab === 'wings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_ACADEMY_WINGS.map((wing) => {
            const currentLevel = academyState.wingLevels[wing.id] || 1;
            const costMultiplier = Math.pow(1.65, currentLevel);
            const costMetal = Math.round(wing.baseCost.metal * costMultiplier);
            const costCrystal = Math.round(wing.baseCost.crystal * costMultiplier);
            const costDeut = Math.round(wing.baseCost.deuterium * costMultiplier);
            const costNaq = Math.round(wing.baseCost.naquadah * costMultiplier);
            const costCredits = Math.round(wing.baseCost.credits * costMultiplier);

            const isMax = currentLevel >= wing.maxLevel;
            const canAfford =
              !isMax &&
              (resources.metal || 0) >= costMetal &&
              (resources.crystal || 0) >= costCrystal &&
              (resources.deuterium || 0) >= costDeut &&
              (resources.naquadah || 0) >= costNaq &&
              (resources.credits || 0) >= costCredits;

            return (
              <div
                key={wing.id}
                className="border border-[#dedede] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#111111] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 border border-[#dedede] text-[#666666] font-bold uppercase">
                      FACILITY WING 0{INITIAL_ACADEMY_WINGS.indexOf(wing) + 1}
                    </span>
                    <span className="text-sm font-mono font-black text-[#111111]">
                      LEVEL {currentLevel} / {wing.maxLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#111111]">{wing.name}</h3>
                  <p className="text-xs text-[#555555] leading-relaxed">{wing.description}</p>

                  {/* Level Bonuses */}
                  <div className="p-3 bg-neutral-50 border border-[#eeeeee] font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777]">Training Speed Velocity:</span>
                      <b className="text-emerald-700">+{wing.trainingSpeedBonusPct * currentLevel}%</b>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777]">Tuition & Requisition Discount:</span>
                      <b className="text-amber-700">-{Math.min(50, wing.costDiscountPct * (currentLevel - 1))}%</b>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777]">Max Tier Unlocked:</span>
                      <b className="text-[#111111]">Tier {Math.min(5, currentLevel)}</b>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#eeeeee] space-y-3">
                  {!isMax ? (
                    <>
                      <div className="text-[11px] font-mono text-[#666666] space-y-0.5">
                        <div className="font-bold text-[#111111]">Expansion Requisites (Lvl {currentLevel + 1}):</div>
                        <div>
                          {costMetal.toLocaleString()} Metal · {costCrystal.toLocaleString()} Crystal ·{' '}
                          {costNaq.toLocaleString()} Naquadah · {costCredits.toLocaleString()} GC
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleUpgradeWing(wing)}
                        className={`w-full py-2.5 px-4 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          canAfford
                            ? 'bg-[#111111] hover:bg-[#333333] text-white shadow-2xs'
                            : 'bg-neutral-200 text-[#888888] cursor-not-allowed'
                        }`}
                      >
                        <TrendingUp size={14} className={canAfford ? 'text-amber-400' : 'text-[#888888]'} />
                        <span>Expand Facility to Level {currentLevel + 1}</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs font-bold text-center">
                      FACILITY AT MAXIMUM CAPACITY (LEVEL 10)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: DRILLS, READINESS & AUTO-DRAFT POLICY */}
      {activeTab === 'drills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness Drills Box */}
          <div className="border border-[#dedede] bg-white p-6 shadow-xs space-y-5">
            <div className="border-b border-[#eeeeee] pb-4">
              <span className="text-[10px] font-mono text-amber-600 font-bold uppercase">
                DOMINION CADET PROVING GROUNDS
              </span>
              <h3 className="text-lg font-black text-[#111111] mt-0.5">
                Academy Readiness Drills & Live War Games
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Conduct war simulations and live geological exercises to elevate military readiness and inspire raw
                citizens to enlist.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-neutral-50 border border-[#eeeeee]">
                <span className="text-[10px] text-[#888888] uppercase block">Cumulative Drill Score</span>
                <b className="text-lg text-[#111111]">{academyState.academyDrillScore.toLocaleString()}</b>
              </div>
              <div className="p-3 bg-neutral-50 border border-[#eeeeee]">
                <span className="text-[10px] text-[#888888] uppercase block">Honorary Academy Rank</span>
                <b className="text-lg text-amber-600">{academyState.academyDrillRank}</b>
              </div>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Drill exercises test logistical pipelines and fleet coordination under simulated orbital siege conditions.
              Each simulation run awards readiness score points and rallies patriotic civilian volunteers.
            </p>

            <button
              type="button"
              onClick={handleRunDrill}
              className="w-full py-3 bg-[#111111] hover:bg-[#333333] text-white text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Award size={15} className="text-amber-400" />
              <span>Commence Live Proving Grounds Exercise</span>
            </button>
          </div>

          {/* Auto-Draft Policy Configuration */}
          <div className="border border-[#dedede] bg-white p-6 shadow-xs space-y-5">
            <div className="border-b border-[#eeeeee] pb-4">
              <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">
                IMPERIAL RECRUITMENT DECREES
              </span>
              <h3 className="text-lg font-black text-[#111111] mt-0.5">
                Automated Conscription & Quota Routing
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Configure auto-assignment policies for incoming civilian population growth across turns.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#444444] font-bold">Auto-Conscription Rate:</span>
                  <b className="text-[#111111] text-sm">{academyState.autoDraftRate}% of Turn Growth</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={academyState.autoDraftRate}
                  onChange={(e) =>
                    onUpdateAcademyState((prev) => ({
                      ...prev,
                      autoDraftRate: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-[#111111] cursor-pointer"
                />
                <span className="text-[10px] text-[#888888] block mt-1">
                  Adjust from 0% (All growth remains civilian) up to 50% (Heavy emergency conscription).
                </span>
              </div>

              <div>
                <label className="text-[#444444] font-bold block mb-1.5">Primary Target Academy Wing:</label>
                <select
                  value={academyState.autoDraftTargetBranch}
                  onChange={(e) =>
                    onUpdateAcademyState((prev) => ({
                      ...prev,
                      autoDraftTargetBranch: e.target.value as WorkforceBranch,
                    }))
                  }
                  className="w-full p-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-[#111111] focus:outline-hidden cursor-pointer"
                >
                  <option value="frontline">Imperial War College (Frontline Combat)</option>
                  <option value="orbital_defense">Citadel Proving Grounds (Orbital Defense)</option>
                  <option value="naquadah_mining">Deep-Mantle Institute (Naquadah Mining)</option>
                  <option value="espionage">Shadow Black Site (Covert Espionage)</option>
                  <option value="civilian_production">Colonial Polytech (Life-Support & Industry)</option>
                  <option value="government">Imperial Chancellery (Administration & Law)</option>
                </select>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs leading-relaxed">
                <strong>Policy Summary:</strong> During each galactic tick, {academyState.autoDraftRate}% of newly
                arrived colonists will immediately be drafted and routed into the{' '}
                <strong>{academyState.autoDraftTargetBranch}</strong> academy preparatory wing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPERIENCE, PROMOTION & DOCTRINE MATRIX */}
      {activeTab === 'veterancy' && (
        <div className="space-y-6">
          {/* Imperial Veterancy Command Deck Banner */}
          <div className="border border-[#dedede] bg-white p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 flex items-center gap-1.5 font-mono">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>IMPERIAL VETERANCY, PROMOTION & DOCTRINE ARCHITECTURE · PERSISTENT CADRE HERITAGE</span>
                </div>
                <h3 className="text-xl font-black text-[#111111] tracking-tight">
                  Unit Experience, Rank Advancement & Doctrine Matrix
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
                  Every unit type accumulates combat and operational XP through turn progression, fleet battles, expeditions, and live-fire war games. Unlocked rank tiers and customized combat doctrines persist across all current and future recruit generations permanently.
                </p>
              </div>

              {/* Action Buttons: Live War Games & Promote All */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleConductImperialWarGames}
                  className="px-4 py-2.5 bg-red-900 hover:bg-red-800 text-white font-mono font-bold text-xs uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer border border-red-700"
                >
                  <Flame size={14} className="text-amber-400" />
                  <span>Live-Fire War Games (+150 XP All Deployed)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePromoteAll}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer border border-amber-600"
                >
                  <Award size={14} className="text-black" />
                  <span>Promote All Eligible Cadres</span>
                </button>
              </div>
            </div>

            {/* Veterancy KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#eeeeee] font-mono text-xs">
              <div className="p-3 bg-neutral-900 border border-neutral-800 text-white">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-400" /> Total Empire Combat XP
                </span>
                <b className="text-lg text-amber-300 font-black">
                  {Object.values(unitExpMap).reduce((sum, e) => sum + (e.xp || 0), 0).toLocaleString()} XP
                </b>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 text-white">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                  <Award size={12} className="text-emerald-400" /> Promoted Cadres (Rank I+)
                </span>
                <b className="text-lg text-emerald-400 font-black">
                  {Object.values(unitExpMap).filter((e) => (e.currentRank || 0) >= 1).length} / 90
                </b>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 text-white">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                  <Shield size={12} className="text-cyan-400" /> Elite Veterans (Rank III+)
                </span>
                <b className="text-lg text-cyan-400 font-black">
                  {Object.values(unitExpMap).filter((e) => (e.currentRank || 0) >= 3).length} / 90
                </b>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 text-white">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                  <Flame size={12} className="text-rose-400" /> War Games Conducted
                </span>
                <b className="text-lg text-rose-400 font-black">
                  {academyState.totalCombatSimulationsRun || 0} Simulations
                </b>
              </div>
            </div>

            {/* War Games Supply Cost Bar */}
            <div className="mt-3 p-2.5 bg-neutral-50 border border-[#e5e5e5] text-[11px] font-mono flex flex-wrap items-center justify-between text-[#666666]">
              <span className="font-bold text-[#333333]">Live-Fire War Games Requisition Cost:</span>
              <span>20,000 Metal · 12,000 Crystal · 4,000 Deut · 2,500 Naquadah · 6,000 Credits</span>
            </div>
          </div>

          {/* Filter and Search Bar for Veterancy */}
          <div className="border border-[#dedede] bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-[#888888] font-bold text-[10px] uppercase mr-1">Branch:</span>
              {(
                [
                  { id: 'all', label: 'All (90)' },
                  { id: 'frontline', label: 'Frontline' },
                  { id: 'orbital_defense', label: 'Defense' },
                  { id: 'naquadah_mining', label: 'Mining' },
                  { id: 'espionage', label: 'Espionage' },
                  { id: 'civilian_production', label: 'Industry' },
                  { id: 'government', label: 'Gov' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedBranch(tab.id)}
                  className={`px-2.5 py-1 text-xs cursor-pointer font-bold transition-all ${
                    selectedBranch === tab.id
                      ? 'bg-[#111111] text-white'
                      : 'bg-neutral-100 text-[#666666] hover:bg-neutral-200 border border-[#dedede]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <span className="text-[#888888] font-bold text-[10px] uppercase ml-3 mr-1">Rank Tier:</span>
              {(
                [
                  { id: 'all', label: 'All Ranks' },
                  { id: 0, label: 'RNK-0' },
                  { id: 1, label: 'RNK-I' },
                  { id: 2, label: 'RNK-II' },
                  { id: 3, label: 'RNK-III' },
                  { id: 4, label: 'RNK-IV' },
                  { id: 5, label: 'RNK-V' },
                ] as const
              ).map((rt) => (
                <button
                  key={String(rt.id)}
                  type="button"
                  onClick={() => setSelectedVeterancyRank(rt.id)}
                  className={`px-2.5 py-1 text-xs cursor-pointer font-bold transition-all ${
                    selectedVeterancyRank === rt.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-100 text-[#666666] hover:bg-neutral-200 border border-[#dedede]'
                  }`}
                >
                  {rt.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setOnlyReadyForPromotion((prev) => !prev)}
                className={`ml-2 px-2.5 py-1 text-xs cursor-pointer font-bold transition-all border ${
                  onlyReadyForPromotion
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-neutral-100 text-[#666666] border-[#dedede] hover:bg-neutral-200'
                }`}
              >
                ⭐ Ready to Promote ({WORKFORCE_90_UNITS.filter((u) => canPromoteUnit(unitExpMap[u.id])).length})
              </button>
            </div>

            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search unit by name or class..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono border border-[#cccccc] bg-white focus:border-[#111111] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Unit Experience & Promotion Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredVeterancyUnits.map((unit) => {
              const exp = unitExpMap[unit.id] || {
                unitId: unit.id,
                xp: 0,
                currentRank: 0,
                highestRankReached: 0,
                totalCombatBattles: 0,
                totalMissionsCompleted: 0,
                activeDoctrineId: 'balanced_standard',
              };

              const rankInfo = getUnitRank(exp);
              const nextRank = getNextRank(exp.currentRank);
              const isEligible = canPromoteUnit(exp);
              const currentEnlisted = academyState.unitCounts[unit.id] || 0;
              const doctrine = UNIT_DOCTRINES.find((d) => d.id === exp.activeDoctrineId) || UNIT_DOCTRINES[0];

              // XP Calculation
              const currentXP = exp.xp;
              const nextTargetXP = nextRank ? nextRank.xpRequired : exp.xp || 3500;
              const prevTargetXP = PROMOTION_RANKS[exp.currentRank]?.xpRequired || 0;
              const xpProgress = nextRank
                ? Math.min(100, Math.max(0, Math.round(((currentXP - prevTargetXP) / Math.max(1, nextTargetXP - prevTargetXP)) * 100)))
                : 100;

              return (
                <div
                  key={unit.id}
                  className={`border bg-white shadow-2xs flex flex-col justify-between transition-all ${
                    isEligible
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  <div className="p-4 space-y-3">
                    {/* Header: Class, Branch & Enlistment Count */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-neutral-100 border border-[#dedede] text-[#666666]">
                            TIER {unit.tier}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                              unit.branch === 'frontline'
                                ? 'bg-red-100 text-red-800'
                                : unit.branch === 'orbital_defense'
                                ? 'bg-blue-100 text-blue-800'
                                : unit.branch === 'naquadah_mining'
                                ? 'bg-amber-100 text-amber-800'
                                : unit.branch === 'espionage'
                                ? 'bg-purple-100 text-purple-800'
                                : unit.branch === 'civilian_production'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {unit.jobClass}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#111111] mt-1">{unit.name}</h4>
                        <div className="text-[11px] font-mono text-[#777777]">
                          Role: <strong className="text-[#333333]">{unit.rankTitle}</strong>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[10px] text-[#888888] uppercase block">Active Troops</span>
                        <b className="text-base font-black text-[#111111]">{currentEnlisted.toLocaleString()}</b>
                      </div>
                    </div>

                    {/* Rank Badge & Generational Heritage Tag */}
                    <div className="p-2.5 bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm border ${rankInfo.badgeColor}`}>
                          {rankInfo.romanNumeral}
                        </span>
                        <div>
                          <b className="text-white text-xs block">{rankInfo.name}</b>
                          <span className="text-[9px] text-neutral-400">
                            {rankInfo.title}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-neutral-400 block uppercase">Generational Heritage</span>
                        <span className="text-[10px] text-amber-400 font-bold">
                          Highest: RNK-{exp.highestRankReached}
                        </span>
                      </div>
                    </div>

                    {/* Experience Progress Gauge */}
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#666666] font-bold flex items-center gap-1">
                          <Sparkles size={11} className="text-amber-500" />
                          Combat Experience:
                        </span>
                        <b className="text-[#111111]">
                          {currentXP.toLocaleString()}{' '}
                          <span className="text-[#888888] font-normal">
                            / {nextRank ? nextRank.xpRequired.toLocaleString() : 'MAX'} XP
                          </span>
                        </b>
                      </div>

                      <div className="w-full bg-neutral-200 h-2 rounded-xs overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isEligible
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-indigo-600'
                          }`}
                          style={{ width: `${xpProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#888888]">
                        <span>Battles: {exp.totalCombatBattles || 0}</span>
                        <span>Missions: {exp.totalMissionsCompleted || 0}</span>
                        <span>{xpProgress}% to Next Rank</span>
                      </div>
                    </div>

                    {/* Active Stat Modifiers (Passed to All Recruits) */}
                    <div className="p-2.5 bg-neutral-50 border border-[#e5e5e5] text-xs font-mono space-y-1">
                      <div className="text-[10px] font-bold text-[#555555] uppercase flex items-center justify-between border-b border-[#e5e5e5] pb-1">
                        <span>Generational Modifiers</span>
                        <span className="text-emerald-700">● Active on All Recruits</span>
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-[11px] pt-1 text-center">
                        <div className="p-1 bg-white border border-[#dedede]">
                          <span className="text-[9px] text-[#888888] block">ATK</span>
                          <b className="text-red-700">+{Math.round(((rankInfo.attackMult * (1 + doctrine.attackMod / 100)) - 1) * 100)}%</b>
                        </div>
                        <div className="p-1 bg-white border border-[#dedede]">
                          <span className="text-[9px] text-[#888888] block">DEF</span>
                          <b className="text-blue-700">+{Math.round(((rankInfo.defenseMult * (1 + doctrine.defenseMod / 100)) - 1) * 100)}%</b>
                        </div>
                        <div className="p-1 bg-white border border-[#dedede]">
                          <span className="text-[9px] text-[#888888] block">YIELD</span>
                          <b className="text-amber-700">+{Math.round(((rankInfo.yieldMult * (1 + doctrine.yieldMod / 100)) - 1) * 100)}%</b>
                        </div>
                        <div className="p-1 bg-white border border-[#dedede]">
                          <span className="text-[9px] text-[#888888] block">UPKEEP</span>
                          <b className="text-emerald-700">-{rankInfo.upkeepDiscountPct}%</b>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#666666] pt-1">
                        <strong>Cadre Perk:</strong> {rankInfo.specialPerk}
                      </div>
                    </div>

                    {/* Combat Doctrine Selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-[#555555] uppercase block">
                        Combat Doctrine Stance:
                      </label>
                      <select
                        value={exp.activeDoctrineId || 'balanced_standard'}
                        onChange={(e) => handleSetDoctrine(unit.id, e.target.value)}
                        className="w-full p-1.5 border border-[#cccccc] bg-white text-xs font-mono focus:border-[#111111] focus:outline-hidden cursor-pointer"
                      >
                        {UNIT_DOCTRINES.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.badge} - {doc.name} (ATK: {doc.attackMod >= 0 ? `+${doc.attackMod}` : doc.attackMod}%, DEF: {doc.defenseMod >= 0 ? `+${doc.defenseMod}` : doc.defenseMod}%, Yield: +{doc.yieldMod}%)
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] font-mono text-[#888888] block">
                        {doctrine.description}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions: Field Drill & Rank Promotion */}
                  <div className="p-3 bg-neutral-50 border-t border-[#dedede] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleConductFieldDrill(unit)}
                      className="flex-1 py-2 px-2 bg-neutral-200 hover:bg-neutral-300 text-[#111111] text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#cccccc]"
                      title="Run tactical field exercises: Costs 800 Metal, 500 Crystal, 150 Naq, 300 Credits"
                    >
                      <Zap size={12} />
                      <span>Drill (+45 XP)</span>
                    </button>

                    {isEligible ? (
                      <button
                        type="button"
                        onClick={() => handlePromoteUnit(unit)}
                        className="flex-2 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-black uppercase transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer border border-amber-600 animate-pulse"
                      >
                        <Award size={14} className="text-black" />
                        <span>Promote to {nextRank?.romanNumeral}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-2 py-2 px-3 bg-neutral-100 text-[#999999] text-xs font-mono font-bold uppercase border border-[#e5e5e5] cursor-not-allowed text-center"
                      >
                        {nextRank
                          ? `${(nextRank.xpRequired - currentXP).toLocaleString()} XP to Next Rank`
                          : 'Max Rank Paragon'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
