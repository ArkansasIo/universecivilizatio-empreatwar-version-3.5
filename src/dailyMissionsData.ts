// ============================================================================
// DAILY MISSIONS & DYNAMIC ACTIVITY REWARDS ENGINE
// ============================================================================

export type DailyMissionCategory =
  | 'Mining'
  | 'Fleet'
  | 'Research'
  | 'Defense'
  | 'Covert'
  | 'Logistics'
  | 'Exploration';

export interface DailyMissionRewards {
  metal: number;
  crystal: number;
  deuterium: number;
  naquadah: number;
  darkMatter?: number;
  glory: number; // Minor glory points
}

export interface DailyMission {
  id: string;
  category: DailyMissionCategory;
  title: string;
  directive: string;
  icon: string;
  target: number;
  progress: number;
  unit: string;
  activityPoints: number;
  baseRewards: DailyMissionRewards;
  isCompleted: boolean;
  isClaimed: boolean;
  actionRoute: string;
  actionLabel: string;
}

export interface ActivityMilestoneChest {
  id: string;
  pointsRequired: number;
  name: string;
  icon: string;
  rewards: DailyMissionRewards;
  claimed: boolean;
}

export interface DailyActivityState {
  lastResetDate: string; // YYYY-MM-DD
  activityPoints: number;
  streakDays: number;
  claimedChestIds: string[];
  missions: DailyMission[];
}

export const STORAGE_KEY_DAILY_ACTIVITY = 'uc_daily_missions_activity_v1';

export const ACTIVITY_TIERS = [
  { tier: 0, name: 'Dormant Garrison', minPoints: 0, multiplier: 1.0, badge: 'bg-neutral-600 text-white', bonusLabel: '+0%' },
  { tier: 1, name: 'Active Sector Guard', minPoints: 25, multiplier: 1.20, badge: 'bg-blue-600 text-white', bonusLabel: '+20% Dynamic Bonus' },
  { tier: 2, name: 'Fleet Veteran', minPoints: 50, multiplier: 1.45, badge: 'bg-purple-600 text-white', bonusLabel: '+45% Dynamic Bonus' },
  { tier: 3, name: 'Sovereign Vanguard', minPoints: 75, multiplier: 1.70, badge: 'bg-amber-600 text-white', bonusLabel: '+70% Dynamic Bonus' },
  { tier: 4, name: 'Apex Imperial Hegemon', minPoints: 100, multiplier: 2.10, badge: 'bg-emerald-600 text-white', bonusLabel: '+110% Dynamic Bonus (MAX)' },
];

export const INITIAL_MILESTONE_CHESTS: ActivityMilestoneChest[] = [
  {
    id: 'chest_25',
    pointsRequired: 25,
    name: 'Bronze Garrison Cache',
    icon: '📦',
    rewards: {
      metal: 65000,
      crystal: 35000,
      deuterium: 15000,
      naquadah: 10000,
      glory: 40,
    },
    claimed: false,
  },
  {
    id: 'chest_50',
    pointsRequired: 50,
    name: 'Silver Vanguard Depot',
    icon: '🎁',
    rewards: {
      metal: 150000,
      crystal: 85000,
      deuterium: 40000,
      naquadah: 30000,
      darkMatter: 25,
      glory: 85,
    },
    claimed: false,
  },
  {
    id: 'chest_75',
    pointsRequired: 75,
    name: 'Gold Archon Reliquary',
    icon: '👑',
    rewards: {
      metal: 320000,
      crystal: 180000,
      deuterium: 90000,
      naquadah: 65000,
      darkMatter: 75,
      glory: 160,
    },
    claimed: false,
  },
  {
    id: 'chest_100',
    pointsRequired: 100,
    name: 'Apex Sovereign Treasury',
    icon: '💎',
    rewards: {
      metal: 650000,
      crystal: 380000,
      deuterium: 200000,
      naquadah: 125000,
      darkMatter: 180,
      glory: 320,
    },
    claimed: false,
  },
];

export const DEFAULT_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'daily_mine_harvest',
    category: 'Mining',
    title: 'Deep Core Extraction Quota',
    directive: 'Calibrate seismic bore drills across imperial mining colonies to maximize primary ore extraction.',
    icon: '⛏️',
    target: 150000,
    progress: 95000,
    unit: 'ore mined',
    activityPoints: 20,
    baseRewards: {
      metal: 85000,
      crystal: 45000,
      deuterium: 20000,
      naquadah: 15000,
      glory: 35,
    },
    isCompleted: false,
    isClaimed: false,
    actionRoute: 'mining',
    actionLabel: 'Colony Mines',
  },
  {
    id: 'daily_covert_scout',
    category: 'Covert',
    title: 'Subspace Reconnaissance Array',
    directive: 'Deploy sensor telemetry probes to map adjacent galactic sectors and uncover rival fortifications.',
    icon: '📡',
    target: 3,
    progress: 3,
    unit: 'scout probes',
    activityPoints: 20,
    baseRewards: {
      metal: 50000,
      crystal: 60000,
      deuterium: 35000,
      naquadah: 18000,
      darkMatter: 15,
      glory: 45,
    },
    isCompleted: true,
    isClaimed: false,
    actionRoute: 'spy',
    actionLabel: 'Intel Bureau',
  },
  {
    id: 'daily_fleet_exercise',
    category: 'Fleet',
    title: 'Orbital Fleet Readiness Drill',
    directive: 'Run live plasma barrage simulations and formation maneuvers with active capital warships.',
    icon: '🚀',
    target: 10,
    progress: 6,
    unit: 'drills completed',
    activityPoints: 25,
    baseRewards: {
      metal: 120000,
      crystal: 65000,
      deuterium: 40000,
      naquadah: 25000,
      glory: 55,
    },
    isCompleted: false,
    isClaimed: false,
    actionRoute: 'shipyard',
    actionLabel: 'Orbital Shipyard',
  },
  {
    id: 'daily_science_analysis',
    category: 'Research',
    title: 'Quantum Resonance Calibration',
    directive: 'Direct astrophysics laboratories to analyze tachyon particle streams for advanced hyperdrive formulas.',
    icon: '🧪',
    target: 1,
    progress: 1,
    unit: 'cycle completed',
    activityPoints: 20,
    baseRewards: {
      metal: 60000,
      crystal: 75000,
      deuterium: 50000,
      naquadah: 20000,
      glory: 50,
    },
    isCompleted: true,
    isClaimed: false,
    actionRoute: 'tech-tree',
    actionLabel: 'Research Labs',
  },
  {
    id: 'daily_bank_logistics',
    category: 'Logistics',
    title: 'Imperial Vault Deposit',
    directive: 'Secure surplus Naquadah into the subterranean central bank to accrue interest and fund sovereignty.',
    icon: '🏦',
    target: 50000,
    progress: 50000,
    unit: 'Naquadah banked',
    activityPoints: 25,
    baseRewards: {
      metal: 75000,
      crystal: 40000,
      deuterium: 20000,
      naquadah: 35000,
      glory: 40,
    },
    isCompleted: true,
    isClaimed: false,
    actionRoute: 'bank',
    actionLabel: 'Imperial Bank',
  },
  {
    id: 'daily_defense_perimeter',
    category: 'Defense',
    title: 'Planetary Iris Deflector Grid',
    directive: 'Inspect surface Gauss cannons and ion shield generators against potential pirate incursions.',
    icon: '🛡️',
    target: 5,
    progress: 2,
    unit: 'turrets tested',
    activityPoints: 20,
    baseRewards: {
      metal: 90000,
      crystal: 50000,
      deuterium: 15000,
      naquadah: 20000,
      glory: 45,
    },
    isCompleted: false,
    isClaimed: false,
    actionRoute: 'defense',
    actionLabel: 'Defense Matrix',
  },
];

export function getTodayKey(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function calculateDynamicReward(
  baseValue: number,
  activityMultiplier: number,
  streakDays: number,
  rankLevel: number = 1
): { total: number; bonus: number; multiplierPercent: number } {
  // Base multiplier from activity tier (e.g. 1.0 to 2.1)
  // Streak bonus: +4% per consecutive active day up to +28%
  const streakBonusPercent = Math.min(28, (streakDays || 1) * 4);
  // Rank bonus: +2% per rank level up to +20%
  const rankBonusPercent = Math.min(20, (rankLevel || 1) * 2);

  const totalMultiplier = activityMultiplier + (streakBonusPercent + rankBonusPercent) / 100;
  const total = Math.round(baseValue * totalMultiplier);
  const bonus = Math.max(0, total - baseValue);
  const multiplierPercent = Math.round((totalMultiplier - 1) * 100);

  return { total, bonus, multiplierPercent };
}
