import React, { useState, useEffect } from 'react';
import {
  Target,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Gift,
  Zap,
  ChevronRight,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Shield,
  Layers,
  Award,
  Crown,
  Lock,
  ArrowUpRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { sound } from '../../../sound';
import { PlayerProfile, PlayerResources } from '../../../types';
import {
  DailyMission,
  DailyMissionCategory,
  ActivityMilestoneChest,
  DailyActivityState,
  ACTIVITY_TIERS,
  INITIAL_MILESTONE_CHESTS,
  DEFAULT_DAILY_MISSIONS,
  STORAGE_KEY_DAILY_ACTIVITY,
  getTodayKey,
  calculateDynamicReward,
} from '../../../dailyMissionsData';

interface DailyMissionsPanelProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
  onNavigate: (route: string) => void;
}

export const DailyMissionsPanel: React.FC<DailyMissionsPanelProps> = ({
  profile,
  resources,
  onUpdateResources,
  onUpdateProfile,
  onNavigate,
}) => {
  // Load or initialize daily state
  const [activityState, setActivityState] = useState<DailyActivityState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAILY_ACTIVITY);
      const today = getTodayKey();
      if (saved) {
        const parsed: DailyActivityState = JSON.parse(saved);
        if (parsed.lastResetDate === today) {
          return parsed;
        } else {
          // New day rollover
          return {
            lastResetDate: today,
            activityPoints: 0,
            streakDays: Math.min(14, (parsed.streakDays || 1) + 1),
            claimedChestIds: [],
            missions: DEFAULT_DAILY_MISSIONS.map((m) => ({
              ...m,
              progress: 0,
              isCompleted: false,
              isClaimed: false,
            })),
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      lastResetDate: getTodayKey(),
      activityPoints: 35,
      streakDays: 4,
      claimedChestIds: [],
      missions: DEFAULT_DAILY_MISSIONS,
    };
  });

  const [milestones, setMilestones] = useState<ActivityMilestoneChest[]>(() => {
    return INITIAL_MILESTONE_CHESTS.map((chest) => ({
      ...chest,
      claimed: activityState.claimedChestIds.includes(chest.id),
    }));
  });

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [claimToast, setClaimToast] = useState<{ message: string; submessage?: string } | null>(null);

  // Time until midnight UTC
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save changes
  const saveState = (newState: DailyActivityState) => {
    setActivityState(newState);
    localStorage.setItem(STORAGE_KEY_DAILY_ACTIVITY, JSON.stringify(newState));
  };

  // Determine current activity tier
  const currentTier =
    [...ACTIVITY_TIERS]
      .reverse()
      .find((t) => activityState.activityPoints >= t.minPoints) || ACTIVITY_TIERS[0];

  const nextTier = ACTIVITY_TIERS.find((t) => t.minPoints > activityState.activityPoints);

  // Claim Mission Reward with Dynamic Multiplier
  const handleClaimMission = (mission: DailyMission) => {
    if (!mission.isCompleted || mission.isClaimed) return;

    sound.play('success');

    // Calculate dynamic payouts
    const metalCalc = calculateDynamicReward(mission.baseRewards.metal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const crystalCalc = calculateDynamicReward(mission.baseRewards.crystal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const deutCalc = calculateDynamicReward(mission.baseRewards.deuterium, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const naqCalc = calculateDynamicReward(mission.baseRewards.naquadah, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const dmCalc = mission.baseRewards.darkMatter ? calculateDynamicReward(mission.baseRewards.darkMatter, currentTier.multiplier, activityState.streakDays, profile.rankLevel) : null;
    const gloryCalc = calculateDynamicReward(mission.baseRewards.glory, currentTier.multiplier, activityState.streakDays, profile.rankLevel);

    // Apply resource updates
    onUpdateResources({
      metal: resources.metal + metalCalc.total,
      crystal: resources.crystal + crystalCalc.total,
      deuterium: resources.deuterium + deutCalc.total,
      naquadah: resources.naquadah + naqCalc.total,
      ...(dmCalc ? { darkMatter: (resources.darkMatter ?? 0) + dmCalc.total } : {}),
    });

    // Apply minor glory points to profile
    onUpdateProfile({
      glory: profile.glory + gloryCalc.total,
    });

    // Award activity points
    const newAP = activityState.activityPoints + mission.activityPoints;
    const updatedMissions = activityState.missions.map((m) => {
      if (m.id === mission.id) {
        return { ...m, isClaimed: true };
      }
      return m;
    });

    saveState({
      ...activityState,
      activityPoints: newAP,
      missions: updatedMissions,
    });

    setClaimToast({
      message: `Mission Claimed! +${gloryCalc.total} Glory Points & Dynamic Resources`,
      submessage: `Includes +${metalCalc.bonus.toLocaleString()} bonus Metal from ${currentTier.name} (+${metalCalc.multiplierPercent}% Activity Surge)`,
    });
    setTimeout(() => setClaimToast(null), 4500);
  };

  // Simulate progress step for testing
  const handleAdvanceTask = (mission: DailyMission) => {
    sound.play('confirm');
    const step = Math.max(1, Math.ceil(mission.target / 4));
    const newProgress = Math.min(mission.target, mission.progress + step);
    const isCompleted = newProgress >= mission.target;

    const updatedMissions = activityState.missions.map((m) => {
      if (m.id === mission.id) {
        return {
          ...m,
          progress: newProgress,
          isCompleted,
        };
      }
      return m;
    });

    saveState({
      ...activityState,
      missions: updatedMissions,
    });
  };

  // Claim Milestone Chest
  const handleClaimChest = (chest: ActivityMilestoneChest) => {
    if (activityState.activityPoints < chest.pointsRequired || chest.claimed) return;

    sound.play('success');

    const metalCalc = calculateDynamicReward(chest.rewards.metal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const crystalCalc = calculateDynamicReward(chest.rewards.crystal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const deutCalc = calculateDynamicReward(chest.rewards.deuterium, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const naqCalc = calculateDynamicReward(chest.rewards.naquadah, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
    const dmCalc = chest.rewards.darkMatter ? calculateDynamicReward(chest.rewards.darkMatter, currentTier.multiplier, activityState.streakDays, profile.rankLevel) : null;
    const gloryCalc = calculateDynamicReward(chest.rewards.glory, currentTier.multiplier, activityState.streakDays, profile.rankLevel);

    onUpdateResources({
      metal: resources.metal + metalCalc.total,
      crystal: resources.crystal + crystalCalc.total,
      deuterium: resources.deuterium + deutCalc.total,
      naquadah: resources.naquadah + naqCalc.total,
      ...(dmCalc ? { darkMatter: (resources.darkMatter ?? 0) + dmCalc.total } : {}),
    });

    onUpdateProfile({
      glory: profile.glory + gloryCalc.total,
    });

    const newClaimedIds = [...activityState.claimedChestIds, chest.id];
    saveState({
      ...activityState,
      claimedChestIds: newClaimedIds,
    });

    setMilestones((prev) =>
      prev.map((c) => (c.id === chest.id ? { ...c, claimed: true } : c))
    );

    setClaimToast({
      message: `${chest.name} Unlocked! +${gloryCalc.total} Glory Points & Massive Resources`,
      submessage: `Dynamic activity multiplier credited +${metalCalc.multiplierPercent}% bonus yield!`,
    });
    setTimeout(() => setClaimToast(null), 4500);
  };

  // Reset daily cycle (for testing / manual refresh)
  const handleResetCycle = () => {
    sound.play('confirm');
    const newState: DailyActivityState = {
      lastResetDate: getTodayKey(),
      activityPoints: 0,
      streakDays: activityState.streakDays + 1,
      claimedChestIds: [],
      missions: DEFAULT_DAILY_MISSIONS.map((m) => ({
        ...m,
        progress: 0,
        isCompleted: false,
        isClaimed: false,
      })),
    };
    saveState(newState);
    setMilestones(INITIAL_MILESTONE_CHESTS.map((c) => ({ ...c, claimed: false })));
  };

  const filteredMissions = activityState.missions.filter((m) => {
    if (categoryFilter === 'ALL') return true;
    return m.category.toUpperCase() === categoryFilter.toUpperCase();
  });

  const completedCount = activityState.missions.filter((m) => m.isCompleted).length;
  const claimedCount = activityState.missions.filter((m) => m.isClaimed).length;

  return (
    <div id="daily-missions-panel" className="space-y-6 font-mono">
      {/* Toast notification */}
      {claimToast && (
        <div className="p-4 bg-emerald-900 text-white border-2 border-emerald-400 shadow-lg flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-xs uppercase tracking-wide text-emerald-200 font-extrabold">
                {claimToast.message}
              </strong>
              {claimToast.submessage && (
                <span className="text-[11px] text-emerald-300 block mt-0.5">
                  {claimToast.submessage}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setClaimToast(null)}
            className="text-xs text-emerald-300 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner & Dynamic Activity Tier Engine */}
      <div className="border-2 border-[#111111] bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#111111] text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Target size={12} />
                SOVEREIGN DAILY MISSIONS & ACTIVITY SYSTEM
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${currentTier.badge}`}>
                {currentTier.name} ({currentTier.bonusLabel})
              </span>
              <span className="text-[11px] text-[#666666] flex items-center gap-1 font-bold">
                <Flame size={12} className="text-amber-500 fill-amber-500" />
                Streak: Day {activityState.streakDays}
              </span>
            </div>

            <h2 className="text-xl font-black text-[#111111] tracking-tight uppercase">
              Dynamic Activity Rewards & Glory Directives
            </h2>
            <p className="text-xs text-[#555555] max-w-2xl leading-relaxed">
              Complete daily sector assignments to elevate your Daily Activity Tier. As your activity level surges, all resource bounties and minor glory points scale dynamically up to +110% bonus yield.
            </p>
          </div>

          {/* Quick Metrics & Reset Countdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-neutral-50 border border-[#dedede] text-right min-w-[130px]">
              <span className="text-[10px] text-[#777777] uppercase block">Daily Activity</span>
              <div className="text-base font-extrabold text-[#111111]">
                {activityState.activityPoints} <span className="text-xs text-[#888888]">/ 100 AP</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 border border-[#dedede] text-right min-w-[130px]">
              <span className="text-[10px] text-[#777777] uppercase block">Cycle Reset In</span>
              <div className="text-xs font-bold text-amber-700 flex items-center justify-end gap-1">
                <Clock size={12} />
                <span>{timeLeft || '23h 59m'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetCycle}
              title="Force Daily Cycle Reset for testing"
              className="p-3 border border-[#dedede] bg-white hover:bg-neutral-100 text-[#111111] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Cycle</span>
            </button>
          </div>
        </div>

        {/* Activity Level Progress Gauge & Milestone Chests */}
        <div className="mt-6 pt-6 border-t border-[#eee] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111111] uppercase tracking-wide">
                Daily Activity Gauge:
              </span>
              <span className="font-bold text-amber-600">
                {activityState.activityPoints} Activity Points
              </span>
              {nextTier && (
                <span className="text-[11px] text-[#777777]">
                  ({nextTier.minPoints - activityState.activityPoints} AP to {nextTier.name})
                </span>
              )}
            </div>

            <div className="text-[11px] text-[#666666]">
              Dynamic Scaling: <strong className="text-emerald-700 font-bold">{Math.round((currentTier.multiplier - 1) * 100 + (activityState.streakDays * 4) + (profile.rankLevel * 2))}% Total Bonus Yield</strong>
            </div>
          </div>

          {/* Progress Bar with Milestone Markers */}
          <div className="relative w-full bg-neutral-100 h-3 border border-[#dedede]">
            <div
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activityState.activityPoints / 100) * 100)}%` }}
            />
          </div>

          {/* Milestone Chests Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {milestones.map((chest) => {
              const isUnlocked = activityState.activityPoints >= chest.pointsRequired;
              const isClaimed = chest.claimed;
              const dynamicMetal = calculateDynamicReward(chest.rewards.metal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
              const dynamicGlory = calculateDynamicReward(chest.rewards.glory, currentTier.multiplier, activityState.streakDays, profile.rankLevel);

              return (
                <div
                  key={chest.id}
                  className={`p-3 border-2 transition-all flex flex-col justify-between space-y-2 ${
                    isClaimed
                      ? 'border-[#dedede] bg-neutral-50 opacity-80'
                      : isUnlocked
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-[#dedede] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{chest.icon}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-neutral-200 text-[#111111]">
                      {chest.pointsRequired} AP
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#111111] truncate">{chest.name}</h4>
                    <div className="text-[10px] text-[#666666] space-y-0.5 mt-1">
                      <div>+{dynamicMetal.total.toLocaleString()} Metal</div>
                      <div className="text-amber-600 font-bold">+{dynamicGlory.total} Minor Glory Pts</div>
                      {chest.rewards.darkMatter && (
                        <div className="text-purple-600 font-bold">+{chest.rewards.darkMatter} Dark Matter</div>
                      )}
                    </div>
                  </div>

                  <div>
                    {isClaimed ? (
                      <span className="w-full py-1.5 bg-neutral-200 text-[#666666] text-[10px] font-bold uppercase flex items-center justify-center gap-1">
                        <Check size={12} /> Claimed
                      </span>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleClaimChest(chest)}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold uppercase flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Gift size={12} /> Claim Cache
                      </button>
                    ) : (
                      <span className="w-full py-1.5 bg-neutral-100 text-[#888888] text-[10px] font-bold uppercase flex items-center justify-center gap-1">
                        <Lock size={12} /> Needs {chest.pointsRequired} AP
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dedede] pb-3">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-[#888888] mr-2">Directive Sector:</span>
          {['ALL', 'MINING', 'FLEET', 'RESEARCH', 'DEFENSE', 'COVERT', 'LOGISTICS'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.play('click');
                setCategoryFilter(cat);
              }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                categoryFilter === cat
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#dedede] bg-white text-[#666666] hover:text-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#666666] flex items-center gap-3">
          <span>
            Directives Completed: <strong>{completedCount} / {activityState.missions.length}</strong>
          </span>
          <span>
            Claimed: <strong>{claimedCount} / {activityState.missions.length}</strong>
          </span>
        </div>
      </div>

      {/* Missions Directives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isReadyToClaim = mission.isCompleted && !mission.isClaimed;
          const dynamicMetal = calculateDynamicReward(mission.baseRewards.metal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
          const dynamicCrystal = calculateDynamicReward(mission.baseRewards.crystal, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
          const dynamicDeut = calculateDynamicReward(mission.baseRewards.deuterium, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
          const dynamicNaq = calculateDynamicReward(mission.baseRewards.naquadah, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
          const dynamicGlory = calculateDynamicReward(mission.baseRewards.glory, currentTier.multiplier, activityState.streakDays, profile.rankLevel);
          const progressPercent = Math.min(100, Math.round((mission.progress / mission.target) * 100));

          return (
            <div
              key={mission.id}
              className={`p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                mission.isClaimed
                  ? 'border-[#dedede] bg-neutral-50/70 opacity-80'
                  : isReadyToClaim
                  ? 'border-emerald-600 bg-white shadow-md ring-1 ring-emerald-500/20'
                  : 'border-[#dedede] bg-white hover:border-neutral-400'
              }`}
            >
              {/* Top Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-neutral-100 border border-[#dedede]">
                      {mission.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-neutral-200 text-[#111111]">
                          {mission.category}
                        </span>
                        <span className="text-[10px] font-bold text-amber-600">
                          +{mission.activityPoints} AP
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[#111111] tracking-tight mt-0.5">
                        {mission.title}
                      </h3>
                    </div>
                  </div>

                  {mission.isClaimed ? (
                    <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 flex items-center gap-1">
                      <Check size={10} /> Completed
                    </span>
                  ) : mission.isCompleted ? (
                    <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-100 border border-emerald-400 px-2 py-0.5 animate-pulse">
                      Ready to Claim
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase text-[#777777] bg-neutral-100 px-2 py-0.5">
                      In Progress
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#555555] leading-relaxed">
                  {mission.directive}
                </p>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#666666]">
                      Target: {mission.progress.toLocaleString()} / {mission.target.toLocaleString()} {mission.unit}
                    </span>
                    <span className="font-bold text-[#111111]">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 border border-[#dedede]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        mission.isCompleted ? 'bg-emerald-500' : 'bg-neutral-800'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Rewards Box */}
              <div className="p-3 bg-neutral-50 border border-[#dedede] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#777777] flex items-center gap-1">
                    <Award size={12} className="text-amber-500" />
                    Dynamic Bounties (+{dynamicMetal.multiplierPercent}% Activity Boost)
                  </span>
                  <span className="text-[10px] font-black text-amber-600 flex items-center gap-1">
                    <Trophy size={11} /> +{dynamicGlory.total} Glory Pts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-[#eee]">
                  <div className="text-neutral-800">
                    Metal: <strong>+{dynamicMetal.total.toLocaleString()}</strong>
                  </div>
                  <div className="text-cyan-800">
                    Crystal: <strong>+{dynamicCrystal.total.toLocaleString()}</strong>
                  </div>
                  <div className="text-emerald-800">
                    Deut: <strong>+{dynamicDeut.total.toLocaleString()}</strong>
                  </div>
                  <div className="text-amber-800">
                    Naquadah: <strong>+{dynamicNaq.total.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {mission.isClaimed ? (
                  <div className="w-full py-2 bg-neutral-100 text-[#777777] text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Directive Finalized</span>
                  </div>
                ) : isReadyToClaim ? (
                  <button
                    type="button"
                    onClick={() => handleClaimMission(mission)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Gift size={14} />
                    <span>Claim Dynamic Bounties (+{dynamicGlory.total} Glory)</span>
                  </button>
                ) : (
                  <div className="w-full grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdvanceTask(mission)}
                      className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] border border-[#dedede] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                      title="Perform or simulate field task"
                    >
                      <Zap size={12} className="text-amber-500" />
                      <span>Advance Task</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.play('click');
                        onNavigate(mission.actionRoute);
                      }}
                      className="py-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{mission.actionLabel}</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
