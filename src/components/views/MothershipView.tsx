import React, { useState, useEffect } from 'react';
import {
  Compass,
  Shield,
  Zap,
  Crosshair,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Flame,
  Radio,
  Sparkles,
  Sliders,
  ChevronRight,
  Award,
  AlertTriangle,
  RotateCcw,
  Target,
  Wrench,
  Gauge,
  Layers,
  Rocket,
  Crown,
  Info,
  Play,
  Anchor,
  HelpCircle,
  Palette,
  Lock,
  Unlock,
  Eye,
  SlidersHorizontal,
  Check,
  Activity,
  Radar,
  Swords,
  RefreshCw,
  ZapOff,
  Coins,
  RadioTower,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { sound } from '../../sound';
import { MothershipModule, PlayerProfile, PlayerResources } from '../../types';
import {
  MOTHERSHIP_CHASSIS_CLASSES,
  INITIAL_BRIDGE_OFFICERS,
  INITIAL_HANGAR_WINGS,
  DEEP_SPACE_SECTORS,
  DEEP_SPACE_ANOMALIES,
  MOTHERSHIP_THEMES,
  FLAGSHIP_WEAPON_CATALOG,
  INITIAL_FLAGSHIP_HARDPOINTS,
  INITIAL_SORTIE_MISSIONS,
  FLAGSHIP_MILESTONES,
  MothershipChassisClass,
  BridgeOfficer,
  HangarWing,
  DeepSpaceSector,
  DeepSpaceAnomalyEvent,
  MothershipTheme,
  FlagshipWeaponItem,
  FlagshipHardpointSlot,
  CarrierSortieMission,
  FlagshipMilestoneAchievement,
} from '../../mothershipData';

interface MothershipViewProps {
  resources: PlayerResources;
  modules: MothershipModule[];
  profile?: PlayerProfile;
  activeRoute?: string;
  onUpgradeModule: (key: string) => { success: boolean; message: string };
  onExploreSector: () => { success: boolean; message: string; reward?: number };
  onUpdateResources?: (res: Partial<PlayerResources>) => void;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

interface ActiveSortieState {
  missionId: string;
  startedAt: number;
  durationSec: number;
  remainingSec: number;
}

export const MothershipView: React.FC<MothershipViewProps> = ({
  resources,
  modules,
  profile,
  activeRoute,
  onUpgradeModule,
  onExploreSector,
  onUpdateResources,
  onUpdateProfile,
  onNavigate,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hardpoints' | 'modules' | 'hangar' | 'officers' | 'exploration' | 'superweapon' | 'themes'
  >(() => {
    if (activeRoute === 'modules') return 'modules';
    if (activeRoute === 'exploration') return 'exploration';
    return 'overview';
  });

  // Chassis / Ship Identity
  const [selectedChassisId, setSelectedChassisId] = useState<string>('chassis_vanguard');
  const [shipName, setShipName] = useState<string>('UCSF PROMETHEUS · CAPITAL-I');
  const [callSign, setCallSign] = useState<string>('ALPHA-01');
  const [activeAura, setActiveAura] = useState<string>('shield_harmonizer');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [tempShipName, setTempShipName] = useState<string>(shipName);

  // Flagship Level & XP
  const [flagshipXp, setFlagshipXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_xp');
      return saved ? parseInt(saved, 10) : 4850;
    } catch {
      return 4850;
    }
  });
  const flagshipLevel = Math.min(50, Math.floor(flagshipXp / 1000) + 1);
  const currentLevelXp = flagshipXp % 1000;
  const targetLevelXp = 1000;

  // Theme & Hull Livery State
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem('uc_mothership_active_theme') || 'theme_imperial_obsidian';
    } catch {
      return 'theme_imperial_obsidian';
    }
  });

  const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_unlocked_themes');
      return saved ? JSON.parse(saved) : ['theme_imperial_obsidian'];
    } catch {
      return ['theme_imperial_obsidian'];
    }
  });

  const [themeFilter, setThemeFilter] = useState<'all' | 'Imperial' | 'Alien' | 'High-Tech' | 'Tactical' | 'Ancient' | 'Cybernetic'>('all');
  const [conduitPulseIntensity, setConduitPulseIntensity] = useState<'high' | 'medium' | 'minimal'>('high');

  // Hardpoints State
  const [hardpoints, setHardpoints] = useState<FlagshipHardpointSlot[]>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_hardpoints');
      return saved ? JSON.parse(saved) : INITIAL_FLAGSHIP_HARDPOINTS;
    } catch {
      return INITIAL_FLAGSHIP_HARDPOINTS;
    }
  });
  const [selectedHardpointId, setSelectedHardpointId] = useState<string>('hp_spinal_1');

  // Officers State
  const [officers, setOfficers] = useState<BridgeOfficer[]>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_officers');
      return saved ? JSON.parse(saved) : INITIAL_BRIDGE_OFFICERS;
    } catch {
      return INITIAL_BRIDGE_OFFICERS;
    }
  });

  // Hangar Wings State
  const [hangarWings, setHangarWings] = useState<HangarWing[]>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_wings');
      return saved ? JSON.parse(saved) : INITIAL_HANGAR_WINGS;
    } catch {
      return INITIAL_HANGAR_WINGS;
    }
  });

  // Sorties State
  const [activeSorties, setActiveSorties] = useState<ActiveSortieState[]>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_active_sorties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Milestones State
  const [milestones, setMilestones] = useState<FlagshipMilestoneAchievement[]>(() => {
    try {
      const saved = localStorage.getItem('uc_mothership_milestones');
      return saved ? JSON.parse(saved) : FLAGSHIP_MILESTONES;
    } catch {
      return FLAGSHIP_MILESTONES;
    }
  });

  // Superweapon & Reactor State
  const [lanceChargePct, setLanceChargePct] = useState<number>(75);
  const [isChargingLance, setIsChargingLance] = useState<boolean>(false);
  const [overclockActive, setOverclockActive] = useState<boolean>(false);
  const [overclockHeat, setOverclockHeat] = useState<number>(25);

  // Active Selected Subsystem Node in Overview HUD
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('bridge');

  // Instant Abilities Cooldown Timers
  const [abilityCooldowns, setAbilityCooldowns] = useState<Record<string, number>>({});

  // Exploration Narrative Event State
  const [activeAnomaly, setActiveAnomaly] = useState<DeepSpaceAnomalyEvent | null>(null);
  const [eventOutcome, setEventOutcome] = useState<{ title: string; text: string; success: boolean } | null>(null);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Save states helper
  const saveHardpoints = (updated: FlagshipHardpointSlot[]) => {
    setHardpoints(updated);
    try {
      localStorage.setItem('uc_mothership_hardpoints', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const saveOfficers = (updated: BridgeOfficer[]) => {
    setOfficers(updated);
    try {
      localStorage.setItem('uc_mothership_officers', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const saveHangarWings = (updated: HangarWing[]) => {
    setHangarWings(updated);
    try {
      localStorage.setItem('uc_mothership_wings', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const saveThemes = (activeId: string, unlockedList: string[]) => {
    setActiveThemeId(activeId);
    setUnlockedThemeIds(unlockedList);
    try {
      localStorage.setItem('uc_mothership_active_theme', activeId);
      localStorage.setItem('uc_mothership_unlocked_themes', JSON.stringify(unlockedList));
    } catch {
      // ignore
    }
  };

  const saveMilestones = (updated: FlagshipMilestoneAchievement[]) => {
    setMilestones(updated);
    try {
      localStorage.setItem('uc_mothership_milestones', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const addFlagshipXp = (amount: number) => {
    setFlagshipXp((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem('uc_mothership_xp', next.toString());
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Sorties live timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSorties((prev) => {
        if (prev.length === 0) return prev;
        const now = Date.now();
        const updated = prev.map((s) => {
          const elapsedSec = Math.floor((now - s.startedAt) / 1000);
          const remaining = Math.max(0, s.durationSec - elapsedSec);
          return { ...s, remainingSec: remaining };
        });
        try {
          localStorage.setItem('uc_mothership_active_sorties', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      // Cool ability timers
      setAbilityCooldowns((prev) => {
        const next: Record<string, number> = {};
        let changed = false;
        Object.keys(prev).forEach((k) => {
          if (prev[k] > 0) {
            next[k] = prev[k] - 1;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentChassis = MOTHERSHIP_CHASSIS_CLASSES.find((c) => c.id === selectedChassisId) || MOTHERSHIP_CHASSIS_CLASSES[0];
  const activeTheme = MOTHERSHIP_THEMES.find((t) => t.id === activeThemeId) || MOTHERSHIP_THEMES[0];

  // Calculated Hardpoint Firepower
  const hardpointDps = hardpoints.reduce((sum, hp) => {
    const wpn = FLAGSHIP_WEAPON_CATALOG.find((w) => w.id === hp.equippedWeaponId);
    if (!wpn) return sum;
    const powerMult = hp.powerAllocatedPct / 100;
    const levelMult = 1 + (hp.level - 1) * 0.25;
    return sum + Math.round(wpn.dps * powerMult * levelMult);
  }, 0);

  const hardpointAlpha = hardpoints.reduce((sum, hp) => {
    const wpn = FLAGSHIP_WEAPON_CATALOG.find((w) => w.id === hp.equippedWeaponId);
    if (!wpn) return sum;
    const powerMult = hp.powerAllocatedPct / 100;
    const levelMult = 1 + (hp.level - 1) * 0.25;
    return sum + Math.round(wpn.alphaStrike * powerMult * levelMult);
  }, 0);

  // Calculated Aggregate Stats (including Theme Multipliers & Hardpoints)
  const totalModuleLevels = modules.reduce((acc, m) => acc + m.level, 0);
  const baseHull = currentChassis.hullHp + totalModuleLevels * 12000;
  const baseShield = currentChassis.shieldHp + totalModuleLevels * 8500;
  const baseAlpha = currentChassis.alphaStrike + totalModuleLevels * 1800 + hardpointAlpha;

  const effectiveHull = Math.round(baseHull * (1 + (activeTheme.statBonus.hullBonusPct || 0) / 100));
  const effectiveShield = Math.round(baseShield * (1 + (activeTheme.statBonus.shieldBonusPct || 0) / 100));
  const effectiveAlpha = Math.round(baseAlpha * (1 + (activeTheme.statBonus.alphaBonusPct || 0) / 100));
  const totalFighterCount = hangarWings.reduce((acc, w) => acc + w.count, 0);

  // ============================================================================
  // HANDLERS: FLAGSHIP TACTICAL ABILITIES
  // ============================================================================

  const handleUseAbility = (abilityId: string) => {
    if ((abilityCooldowns[abilityId] || 0) > 0) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Ability is on recharge cooldown (${abilityCooldowns[abilityId]}s remaining).` });
      return;
    }

    if (abilityId === 'shield_overcharge') {
      sound.play('confirm');
      setAbilityCooldowns((prev) => ({ ...prev, shield_overcharge: 45 }));
      addFlagshipXp(50);
      setFeedback({
        type: 'success',
        text: 'EMERGENCY SHIELD OVERCHARGE ACTIVATED! Deflector barriers supercharged +40% capacity.',
      });
    } else if (abilityId === 'nanite_repair') {
      if ((resources.credits ?? 500000) < 10000) {
        sound.play('warning');
        setFeedback({ type: 'error', text: 'Need 10,000 Galactic Credits (GC) to synthesize cellular repair nanites!' });
        return;
      }
      if (onUpdateResources) {
        onUpdateResources({ credits: (resources.credits ?? 500000) - 10000 });
      }
      sound.play('research');
      setAbilityCooldowns((prev) => ({ ...prev, nanite_repair: 60 }));
      addFlagshipXp(75);
      setFeedback({
        type: 'success',
        text: 'NANITE CELLULAR REPAIR ENGAGED! Regenerating 25,000 Hull HP across all armor bulkheads.',
      });
    } else if (abilityId === 'tachyon_sweep') {
      const yieldNaq = 35000 + Math.floor(Math.random() * 25000);
      const yieldDeut = 20000 + Math.floor(Math.random() * 15000);
      if (onUpdateResources) {
        onUpdateResources({
          naquadah: resources.naquadah + yieldNaq,
          deuterium: (resources.deuterium ?? 0) + yieldDeut,
        });
      }
      sound.play('trade');
      setAbilityCooldowns((prev) => ({ ...prev, tachyon_sweep: 90 }));
      addFlagshipXp(120);
      setFeedback({
        type: 'success',
        text: `TACHYON SENSOR SWEEP COMPLETE: Harvested +${yieldNaq.toLocaleString()} Naquadah and +${yieldDeut.toLocaleString()} Deuterium from spatial ripples!`,
      });
    } else if (abilityId === 'vanguard_rally') {
      sound.play('confirm');
      setAbilityCooldowns((prev) => ({ ...prev, vanguard_rally: 75 }));
      addFlagshipXp(100);
      setFeedback({
        type: 'success',
        text: 'VANGUARD FLEET RALLY HORN SOUNDED! All escort ships inspired with +35% Attack & Critical strike power.',
      });
    } else if (abilityId === 'lance_precharge') {
      setLanceChargePct((prev) => Math.min(100, prev + 25));
      sound.play('research');
      setAbilityCooldowns((prev) => ({ ...prev, lance_precharge: 30 }));
      addFlagshipXp(40);
      setFeedback({
        type: 'success',
        text: 'DOOMSDAY PRE-CHARGE ROUTINE ENGAGED: Injected +25% instantaneous capacitor energy into spinal lance.',
      });
    }
  };

  // ============================================================================
  // HANDLERS: HARDPOINTS & WEAPONS FITTING
  // ============================================================================

  const handleEquipWeapon = (slotId: string, weaponId: string) => {
    const updated = hardpoints.map((hp) => (hp.slotId === slotId ? { ...hp, equippedWeaponId: weaponId } : hp));
    saveHardpoints(updated);
    sound.play('confirm');
    const wpn = FLAGSHIP_WEAPON_CATALOG.find((w) => w.id === weaponId);
    setFeedback({
      type: 'success',
      text: `Installed ${wpn?.name || 'Weapon'} onto hardpoint ${slotId.toUpperCase()}!`,
    });
  };

  const handleUpgradeHardpoint = (slotId: string) => {
    const hp = hardpoints.find((h) => h.slotId === slotId);
    if (!hp) return;
    const wpn = FLAGSHIP_WEAPON_CATALOG.find((w) => w.id === hp.equippedWeaponId);
    const cost = wpn?.upgradeCost || { credits: 30000, metal: 25000, crystal: 15000, deuterium: 10000, naquadah: 5000 };

    const mult = hp.level;
    const costCredits = cost.credits * mult;
    const costMetal = cost.metal * mult;
    const costCrystal = cost.crystal * mult;
    const costDeut = cost.deuterium * mult;
    const costNaq = cost.naquadah * mult;

    if (
      (resources.credits ?? 500000) < costCredits ||
      resources.metal < costMetal ||
      resources.crystal < costCrystal ||
      (resources.deuterium ?? 0) < costDeut ||
      resources.naquadah < costNaq
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient resources to upgrade hardpoint! Need ${costCredits.toLocaleString()} GC, ${costMetal.toLocaleString()} Metal, ${costNaq.toLocaleString()} Naquadah.`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        credits: (resources.credits ?? 500000) - costCredits,
        metal: resources.metal - costMetal,
        crystal: resources.crystal - costCrystal,
        deuterium: (resources.deuterium ?? 0) - costDeut,
        naquadah: resources.naquadah - costNaq,
      });
    }

    const updated = hardpoints.map((h) => (h.slotId === slotId ? { ...h, level: h.level + 1 } : h));
    saveHardpoints(updated);
    addFlagshipXp(150);
    sound.play('research');
    setFeedback({
      type: 'success',
      text: `Hardpoint ${hp.slotName} upgraded to Level ${hp.level + 1}! Firepower multiplied.`,
    });
  };

  const handleSetHardpointPower = (slotId: string, powerPct: number) => {
    const updated = hardpoints.map((hp) => (hp.slotId === slotId ? { ...hp, powerAllocatedPct: powerPct } : hp));
    saveHardpoints(updated);
  };

  // ============================================================================
  // HANDLERS: CARRIER SORTIES
  // ============================================================================

  const handleLaunchSortie = (mission: CarrierSortieMission) => {
    // Check craft requirement
    if (mission.requiredWingRole !== 'any') {
      const wing = hangarWings.find((w) => w.role === mission.requiredWingRole);
      if (!wing || wing.count < mission.minCraftCount) {
        sound.play('warning');
        setFeedback({
          type: 'error',
          text: `Sortie requires at least ${mission.minCraftCount}x ${mission.requiredWingRole.toUpperCase()} craft in hangar!`,
        });
        return;
      }
    }

    // Check if already active
    if (activeSorties.some((s) => s.missionId === mission.id)) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `${mission.name} is already deployed and underway!` });
      return;
    }

    const newSortie: ActiveSortieState = {
      missionId: mission.id,
      startedAt: Date.now(),
      durationSec: mission.durationSec,
      remainingSec: mission.durationSec,
    };

    const updated = [...activeSorties, newSortie];
    setActiveSorties(updated);
    try {
      localStorage.setItem('uc_mothership_active_sorties', JSON.stringify(updated));
    } catch {
      // ignore
    }

    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Carrier Strike Wing launched for ${mission.name}! ETA: ${mission.durationSec}s.`,
    });
  };

  const handleClaimSortieRewards = (mission: CarrierSortieMission) => {
    const sortie = activeSorties.find((s) => s.missionId === mission.id);
    if (!sortie || sortie.remainingSec > 0) return;

    if (onUpdateResources) {
      onUpdateResources({
        credits: (resources.credits ?? 500000) + mission.rewards.credits,
        naquadah: resources.naquadah + mission.rewards.naquadah,
        metal: resources.metal + mission.rewards.metal,
        crystal: resources.crystal + mission.rewards.crystal,
        deuterium: (resources.deuterium ?? 0) + mission.rewards.deuterium,
        superUnits: mission.rewards.darkMatter ? resources.superUnits + 1 : resources.superUnits,
      });
    }

    if (mission.rewards.glory && onUpdateProfile && profile) {
      onUpdateProfile({ glory: profile.glory + mission.rewards.glory });
    }

    addFlagshipXp(200);

    const updated = activeSorties.filter((s) => s.missionId !== mission.id);
    setActiveSorties(updated);
    try {
      localStorage.setItem('uc_mothership_active_sorties', JSON.stringify(updated));
    } catch {
      // ignore
    }

    sound.play('trade');
    setFeedback({
      type: 'success',
      text: `SORTIE SUCCESS: ${mission.name} complete! Claimed +${mission.rewards.credits.toLocaleString()} GC, +${mission.rewards.naquadah.toLocaleString()} Naquadah, +${mission.rewards.glory} Glory XP!`,
    });
  };

  // ============================================================================
  // HANDLERS: MILESTONES & CLAIMING
  // ============================================================================

  const handleClaimMilestone = (milestoneId: string) => {
    const ms = milestones.find((m) => m.id === milestoneId);
    if (!ms || !ms.isUnlocked) return;

    if (onUpdateResources) {
      onUpdateResources({
        credits: (resources.credits ?? 500000) + ms.rewardCredits,
      });
    }
    if (ms.rewardGlory && onUpdateProfile && profile) {
      onUpdateProfile({ glory: profile.glory + ms.rewardGlory });
    }

    addFlagshipXp(300);

    const updated = milestones.map((m) =>
      m.id === milestoneId ? { ...m, progressCurrent: m.progressTarget, progressTarget: m.progressTarget * 2, isUnlocked: false } : m
    );
    saveMilestones(updated);

    sound.play('trade');
    setFeedback({
      type: 'success',
      text: `Claimed Milestone: ${ms.title}! +${ms.rewardCredits.toLocaleString()} GC, +${ms.rewardGlory} Glory XP.`,
    });
  };

  // ============================================================================
  // HANDLERS: THEMES & CUSTOMIZATION
  // ============================================================================

  const handleUnlockTheme = (theme: MothershipTheme) => {
    if (unlockedThemeIds.includes(theme.id)) return;

    const currentGlory = profile?.glory ?? 0;
    if (currentGlory < theme.unlockCostGlory || resources.naquadah < theme.unlockCostNaquadah) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Unlocking ${theme.name} requires ${theme.unlockCostGlory} Glory XP and ${theme.unlockCostNaquadah.toLocaleString()} Naquadah.`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        naquadah: resources.naquadah - theme.unlockCostNaquadah,
      });
    }

    if (onUpdateProfile && profile) {
      onUpdateProfile({
        glory: currentGlory - theme.unlockCostGlory,
      });
    }

    const newUnlocked = [...unlockedThemeIds, theme.id];
    saveThemes(theme.id, newUnlocked);
    addFlagshipXp(250);
    sound.play('research');
    setFeedback({
      type: 'success',
      text: `🎨 Unlocked & Applied new Mothership Theme: "${theme.name}"! Hull plating & energy conduits re-calibrated.`,
    });
  };

  const handleEquipTheme = (theme: MothershipTheme) => {
    if (!unlockedThemeIds.includes(theme.id)) return;
    saveThemes(theme.id, unlockedThemeIds);
    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Mothership Livery set to "${theme.name}". Active bonus: ${theme.statBonus.label}`,
    });
  };

  // Upgrade Module Handler
  const handleUpgrade = (key: string) => {
    const res = onUpgradeModule(key);
    if (res.success) {
      addFlagshipXp(100);
      sound.play('research');
      setFeedback({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Refit Chassis Class
  const handleRefitChassis = (chassis: MothershipChassisClass) => {
    if (chassis.id === selectedChassisId) return;

    if (resources.naquadah < chassis.costNaquadah || (resources.deuterium ?? 0) < chassis.costDeuterium) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Refit requires ${chassis.costNaquadah.toLocaleString()} Naquadah and ${chassis.costDeuterium.toLocaleString()} Deuterium.`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        naquadah: resources.naquadah - chassis.costNaquadah,
        deuterium: (resources.deuterium ?? 0) - chassis.costDeuterium,
      });
    }

    setSelectedChassisId(chassis.id);
    addFlagshipXp(500);
    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Mothership successfully upgraded to ${chassis.name}! Structural Hull & Core Power reconfigured.`,
    });
  };

  // Promote Bridge Officer
  const handlePromoteOfficer = (officerId: string) => {
    const off = officers.find((o) => o.id === officerId);
    if (!off) return;

    if (off.level >= off.maxLevel) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `${off.name} has already reached maximum Master Rank.` });
      return;
    }

    const gloryCost = off.level * 40;
    const currentGlory = profile?.glory ?? 0;
    if (currentGlory < gloryCost) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Officer promotion requires ${gloryCost} Glory XP (You have ${currentGlory}).` });
      return;
    }

    if (onUpdateProfile) {
      onUpdateProfile({ glory: currentGlory - gloryCost });
    }

    const updated = officers.map((o) =>
      o.id === officerId
        ? {
            ...o,
            level: o.level + 1,
            rank: `${o.title} (Rank ${o.level + 1})`,
          }
        : o
    );
    saveOfficers(updated);
    addFlagshipXp(120);
    sound.play('research');
    setFeedback({
      type: 'success',
      text: `Promoted ${off.name} to Rank ${off.level + 1}! Tactical station efficacy increased.`,
    });
  };

  // Restock Hangar Wing
  const handleRestockWing = (wingId: string) => {
    const wing = hangarWings.find((w) => w.id === wingId);
    if (!wing) return;

    if (wing.count >= wing.maxCount) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `${wing.name} hangar is already at maximum capacity (${wing.maxCount}/${wing.maxCount}).` });
      return;
    }

    if (
      (resources.metal ?? 0) < wing.restockCostMetal ||
      (resources.crystal ?? 0) < wing.restockCostCrystal ||
      (resources.deuterium ?? 0) < wing.restockCostDeut
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Restocking squadron requires ${wing.restockCostMetal.toLocaleString()} Metal, ${wing.restockCostCrystal.toLocaleString()} Crystal, and ${wing.restockCostDeut.toLocaleString()} Deuterium.`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        metal: (resources.metal ?? 0) - wing.restockCostMetal,
        crystal: (resources.crystal ?? 0) - wing.restockCostCrystal,
        deuterium: (resources.deuterium ?? 0) - wing.restockCostDeut,
      });
    }

    const updated = hangarWings.map((w) =>
      w.id === wingId ? { ...w, count: Math.min(w.maxCount, w.count + 12) } : w
    );
    saveHangarWings(updated);
    sound.play('confirm');
    setFeedback({
      type: 'success',
      text: `Fabricated and deployed 12 new craft to ${wing.name}!`,
    });
  };

  // Launch Deep Space Recon
  const handleExploreSector = (sector?: DeepSpaceSector) => {
    const cost = sector ? sector.fuelCostTurns : 1;
    if (resources.attackTurns < cost) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Sector recon requires ${cost} Attack / Exploration Turn(s).`,
      });
      return;
    }

    const randomAnomaly = DEEP_SPACE_ANOMALIES[Math.floor(Math.random() * DEEP_SPACE_ANOMALIES.length)];
    setActiveAnomaly(randomAnomaly);
    setEventOutcome(null);

    if (onUpdateResources) {
      onUpdateResources({ attackTurns: resources.attackTurns - cost });
    }

    addFlagshipXp(80);
    sound.play('research');
  };

  // Resolve Anomaly Option
  const handleResolveAnomalyOption = (option: DeepSpaceAnomalyEvent['options'][0]) => {
    const isSuccess = Math.random() <= option.successChance;

    if (isSuccess) {
      sound.play('trade');
      const rew = option.rewards;
      if (onUpdateResources) {
        onUpdateResources({
          naquadah: resources.naquadah + (rew.naquadah ?? 0),
          metal: (resources.metal ?? 0) + (rew.metal ?? 0),
          crystal: (resources.crystal ?? 0) + (rew.crystal ?? 0),
          deuterium: (resources.deuterium ?? 0) + (rew.deuterium ?? 0),
          attackTurns: resources.attackTurns + (rew.turns ?? 0),
        });
      }
      if (rew.glory && onUpdateProfile && profile) {
        onUpdateProfile({ glory: profile.glory + rew.glory });
      }

      addFlagshipXp(150);

      setEventOutcome({
        title: 'Mission Success: Anomaly Secured!',
        text: rew.text,
        success: true,
      });
    } else {
      sound.play('warning');
      setEventOutcome({
        title: 'Mission Complication: Hazard Encountered',
        text: 'Automated counter-measures intercepted our probes. Flagship deflector shields absorbed the shockwave with minor sensor static.',
        success: false,
      });
    }
  };

  // Fire Doomsday Lance
  const handleFireDoomsday = () => {
    if (lanceChargePct < 100) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Doomsday Lance capacitor is at ${lanceChargePct}%. Needs 100% full charge.` });
      return;
    }

    if (resources.attackTurns < 2) {
      sound.play('warning');
      setFeedback({ type: 'error', text: 'Firing Doomsday Lance requires 2 Attack Turns.' });
      return;
    }

    const tacticalLoot = 145000 + Math.round(Math.random() * 85000);
    if (onUpdateResources) {
      onUpdateResources({
        attackTurns: resources.attackTurns - 2,
        naquadah: resources.naquadah + tacticalLoot,
        superUnits: resources.superUnits + 2,
      });
    }

    setLanceChargePct(0);
    addFlagshipXp(400);
    sound.play('combat');
    setFeedback({
      type: 'success',
      text: `DOOMSDAY LANCE DISCHARGED! Orbital target vaporized with 1,250,000 Terawatt beam. Salvaged ${tacticalLoot.toLocaleString()} Naquadah & 2 Heavy Super-Weapon Cores!`,
    });
  };

  // Charge Lance
  const handleChargeLance = () => {
    if ((resources.deuterium ?? 0) < 15000) {
      sound.play('warning');
      setFeedback({ type: 'error', text: 'Charging capacitor requires 15,000 Deuterium reactor fuel.' });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({ deuterium: (resources.deuterium ?? 0) - 15000 });
    }

    setLanceChargePct((prev) => Math.min(100, prev + 35));
    sound.play('confirm');
    setFeedback({ type: 'success', text: 'Injected Deuterium catalyst: Doomsday Lance capacitor charged +35%!' });
  };

  // Singularity Overclock Mode
  const handleToggleOverclock = () => {
    if (!overclockActive) {
      if (overclockHeat > 60) {
        sound.play('warning');
        setFeedback({ type: 'error', text: 'Reactor core is overheating! Vent plasma coolant before re-engaging overclock.' });
        return;
      }
      setOverclockActive(true);
      setOverclockHeat((prev) => prev + 35);
      sound.play('confirm');
      setFeedback({
        type: 'success',
        text: 'ZERO-POINT SINGULARITY OVERCLOCKED! Fleet sublight speeds & shield regen boosted by 40%!',
      });
    } else {
      setOverclockActive(false);
      sound.play('click');
      setFeedback({ type: 'success', text: 'Singularity Overclock disengaged. Cooling conduits normalized.' });
    }
  };

  return (
    <div id="mothership-view" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="border border-[#dedede] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 flex items-center gap-1.5 font-mono">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>SUPREME MOTHERSHIP COMMAND · FLAGSHIP NEXUS & TITAN DOCK</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold">
                RANK {flagshipLevel} FLAGSHIP
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempShipName}
                    onChange={(e) => setTempShipName(e.target.value)}
                    className="px-2 py-1 text-lg font-bold border border-[#111111] bg-white"
                  />
                  <button
                    onClick={() => {
                      setShipName(tempShipName);
                      setIsRenaming(false);
                      sound.play('confirm');
                    }}
                    className="px-3 py-1 bg-[#111111] text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#111111]">{shipName}</h1>
                  <button
                    onClick={() => {
                      setTempShipName(shipName);
                      setIsRenaming(true);
                    }}
                    className="text-[10px] font-mono text-[#777] hover:text-[#111] underline cursor-pointer"
                  >
                    [Rename]
                  </button>
                </div>
              )}
              <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                {currentChassis.badge}
              </span>
            </div>

            {/* Level & XP Gauge */}
            <div className="flex items-center gap-3 mt-2 text-xs font-mono">
              <span className="text-[#666] font-bold">XP Progress:</span>
              <div className="w-48 bg-neutral-100 border border-[#dedede] h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${(currentLevelXp / targetLevelXp) * 100}%` }}
                />
              </div>
              <span className="text-[#111] font-bold">
                {currentLevelXp} / {targetLevelXp} XP (Total: {flagshipXp.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-3 bg-[#fafafa] border border-[#eee] p-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-[#777] block uppercase">Hull Integrity</span>
              <strong className="text-[#111] text-sm">{effectiveHull.toLocaleString()} HP</strong>
            </div>
            <div className="w-[1px] h-8 bg-[#dedede]" />
            <div>
              <span className="text-[10px] text-[#777] block uppercase">Deflector Shields</span>
              <strong className="text-cyan-700 text-sm">{effectiveShield.toLocaleString()} SH</strong>
            </div>
            <div className="w-[1px] h-8 bg-[#dedede]" />
            <div>
              <span className="text-[10px] text-[#777] block uppercase">Alpha Firepower</span>
              <strong className="text-rose-700 text-sm">{effectiveAlpha.toLocaleString()} DPS</strong>
            </div>
            <div className="w-[1px] h-8 bg-[#dedede]" />
            <button
              onClick={() => {
                sound.play('click');
                setActiveTab('themes');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border text-left cursor-pointer transition-all hover:shadow-xs"
              style={{
                backgroundColor: activeTheme.primaryColor === '#111111' ? '#18181b' : activeTheme.primaryColor,
                borderColor: activeTheme.borderColor,
                color: activeTheme.secondaryColor,
              }}
              title="Click to customize Flagship Theme & Livery Studio"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: activeTheme.accentGlow }} />
              <div>
                <span className="text-[9px] text-[#aaa] block uppercase leading-none">Hull Livery</span>
                <span className="text-[11px] font-bold leading-none">{activeTheme.name.split('&')[0]}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center ${
            feedback.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dedede] bg-white px-2 pt-2 overflow-x-auto">
        {[
          { id: 'overview', label: '1. Flagship Overview & HUD', icon: Anchor },
          { id: 'hardpoints', label: '2. Modular Hardpoints & Weapons', icon: Swords },
          { id: 'modules', label: '3. Core Modules (12 Systems)', icon: Cpu },
          { id: 'hangar', label: '4. Carrier Wings & Sorties', icon: Rocket },
          { id: 'officers', label: '5. Bridge Officers Academy', icon: Award },
          { id: 'exploration', label: '6. Deep Space Void Recon', icon: Compass },
          { id: 'superweapon', label: '7. Doomsday Lance & Core', icon: Flame },
          { id: 'themes', label: '8. Hull Livery & Visuals', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.play('click');
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
                  : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-[#f9f9f9]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & SCHEMATIC HUD */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top: Interactive Subsystem Blueprint Canvas */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#eee] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777] uppercase font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  <span>REAL-TIME FLAGSHIP SUB-SYSTEM DIAGNOSTICS & TELEMETRY</span>
                </span>
                <h2 className="text-lg font-bold text-[#111]">Interactive Flagship Schematic Core</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#666]">Reactor State:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-300">
                  ONLINE · 99.8% STABILITY
                </span>
              </div>
            </div>

            {/* Subsystem Schematic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                {
                  id: 'schematic_bridge',
                  name: 'Bridge Command Deck',
                  status: 'Nominal',
                  efficiency: '100%',
                  icon: Crown,
                  details: 'Autonomous fleet AI routing and command relays.',
                },
                {
                  id: 'schematic_warp_core',
                  name: 'Tokamak Antimatter Core',
                  status: 'Nominal',
                  efficiency: '98.5%',
                  icon: Zap,
                  details: 'Zero-point plasma generator feeding main spinal batteries.',
                },
                {
                  id: 'schematic_spinal_weapon',
                  name: 'Spinal Particle Lance',
                  status: lanceChargePct === 100 ? 'Charged' : 'Charging',
                  efficiency: `${lanceChargePct}%`,
                  icon: Flame,
                  details: 'Relativistic tachyon beam emitter for capital targets.',
                },
                {
                  id: 'schematic_shields',
                  name: 'Phase Deflector Grid',
                  status: 'Active',
                  efficiency: '100%',
                  icon: Shield,
                  details: 'Multilayer force barrier deflecting incoming torpedoes.',
                },
                {
                  id: 'schematic_hangar',
                  name: 'Carrier Flight Bays',
                  status: `${totalFighterCount} Craft`,
                  efficiency: 'Active',
                  icon: Rocket,
                  details: '4 automated catapult launch tubes for fighter wings.',
                },
                {
                  id: 'schematic_nanite_hull',
                  name: 'Nanite Hull Carapace',
                  status: 'Repairing',
                  efficiency: '100%',
                  icon: Sparkles,
                  details: 'Autonomous cellular matrix knitting micro-fractures.',
                },
                {
                  id: 'targeting',
                  name: 'Tachyon Sensor Array',
                  status: 'Scanning',
                  efficiency: 'Lock-On',
                  icon: Radar,
                  details: 'Subspace telemetry sweep covering 500 AU radius.',
                },
                {
                  id: 'aux_capacitors',
                  name: 'Auxiliary Siphon Batteries',
                  status: 'Charged',
                  efficiency: '100%',
                  icon: Gauge,
                  details: 'Superconducting capacitor banks storing 1.2M MWh.',
                },
              ].map((sub) => {
                const Icon = sub.icon;
                const isSelected = selectedSubsystem === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedSubsystem(sub.id);
                    }}
                    className={`p-3 border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#111] bg-[#fafafa] shadow-xs'
                        : 'border-[#eee] bg-white hover:border-[#ccc]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#111]">
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{sub.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-100 text-[#444] font-bold">
                        {sub.efficiency}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666] leading-tight">{sub.details}</p>
                  </button>
                );
              })}
            </div>

            {/* Tactical Abilities Quick-Bar */}
            <div className="border-t border-[#eee] pt-4">
              <span className="text-xs font-bold text-[#111] uppercase tracking-wider block font-mono mb-3">
                Flagship Instant Tactical Abilities (One-Click Operations):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {[
                  {
                    id: 'shield_overcharge',
                    name: 'Shield Overcharge',
                    desc: '+40% Immediate Shield Barrier',
                    cost: 'Free (45s CD)',
                    icon: ShieldAlert,
                  },
                  {
                    id: 'nanite_repair',
                    name: 'Nanite Hull Repair',
                    desc: 'Regen 25,000 Hull Integrity',
                    cost: '10,000 GC',
                    icon: Sparkles,
                  },
                  {
                    id: 'tachyon_sweep',
                    name: 'Tachyon Cosmic Sweep',
                    desc: 'Harvest +35k Naquadah & Deut',
                    cost: 'Free (90s CD)',
                    icon: Radar,
                  },
                  {
                    id: 'vanguard_rally',
                    name: 'Vanguard Fleet Rally',
                    desc: '+35% Fleet Attack Aura',
                    cost: 'Free (75s CD)',
                    icon: Swords,
                  },
                  {
                    id: 'lance_precharge',
                    name: 'Lance Pre-Charge',
                    desc: '+25% Doomsday Capacitor',
                    cost: 'Free (30s CD)',
                    icon: Flame,
                  },
                ].map((ab) => {
                  const Icon = ab.icon;
                  const cd = abilityCooldowns[ab.id] || 0;
                  return (
                    <button
                      key={ab.id}
                      onClick={() => handleUseAbility(ab.id)}
                      disabled={cd > 0}
                      className={`p-3 border text-left font-mono transition-all cursor-pointer ${
                        cd > 0
                          ? 'border-[#eee] bg-neutral-50 text-neutral-400 cursor-not-allowed'
                          : 'border-[#111] bg-white hover:bg-[#111] hover:text-white group shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                        <Icon className={`w-3.5 h-3.5 ${cd > 0 ? 'text-neutral-400' : 'text-amber-600 group-hover:text-amber-400'}`} />
                        <span>{ab.name}</span>
                      </div>
                      <div className="text-[10px] text-[#666] group-hover:text-neutral-200 mb-1 leading-tight">
                        {ab.desc}
                      </div>
                      <div className="text-[9px] font-bold text-emerald-700 group-hover:text-emerald-300">
                        {cd > 0 ? `Recharging (${cd}s)` : ab.cost}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Auras and Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Command Auras & Fleet Doctrines */}
            <div className="lg:col-span-6 border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Active Fleet Command Aura</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'aura_shield_harmonizer', value: 'shield_harmonizer', label: 'Phase Shield Harmonizer', desc: '+15% Fleet Shield Buffer & Recharge' },
                  { id: 'aura_tachyon_link', value: 'tachyon_link', label: 'Tachyon Targeting Matrix', desc: '+20% Escort Ship Accuracy & Crits' },
                  { id: 'aura_nanite_repair', value: 'nanite_repair', label: 'Nanite Hull Dispersion Field', desc: 'Automatic 10% Post-Battle Repair' },
                  { id: 'aura_slipstream', value: 'slipstream', label: 'Subspace Slipstream Beacon', desc: '-25% Travel Turns & Hyperjump Costs' },
                  { id: 'aura_annihilation', value: 'annihilation', label: 'Annihilation Critical Salvo', desc: '+25% Flagship Alpha Critical Strike Damage' },
                ].map((aura) => (
                  <button
                    key={aura.id}
                    onClick={() => {
                      sound.play('click');
                      setActiveAura(aura.value);
                      setFeedback({ type: 'success', text: `Flagship Command Aura set to ${aura.label}.` });
                    }}
                    className={`p-3 text-left border text-xs font-mono transition-colors cursor-pointer ${
                      activeAura === aura.value
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-[#dedede] bg-white text-[#444] hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="font-bold">{aura.label}</div>
                    <div className={`text-[10px] mt-0.5 ${activeAura === aura.id ? 'text-[#bbb]' : 'text-[#777]'}`}>
                      {aura.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Flagship Milestones & Achievements */}
            <div className="lg:col-span-6 border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Flagship Milestones & Honours</span>
                </h3>
              </div>
              <div className="space-y-2.5">
                {milestones.map((ms) => {
                  const pct = Math.min(100, Math.round((ms.progressCurrent / ms.progressTarget) * 100));
                  return (
                    <div key={ms.id} className="p-3 border border-[#eee] bg-[#fafafa] space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111]">{ms.title}</span>
                        {ms.isUnlocked ? (
                          <button
                            onClick={() => handleClaimMilestone(ms.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                          >
                            CLAIM +{ms.rewardCredits.toLocaleString()} GC
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#777]">
                            {ms.progressCurrent} / {ms.progressTarget} {ms.unit} ({pct}%)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#666]">{ms.description}</p>
                      <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-[10px] text-indigo-700 font-semibold">{ms.rewardBonusText}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MODULAR HARDPOINTS & WEAPONS FITTING */}
      {/* ========================================================================= */}
      {activeTab === 'hardpoints' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eee] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777] uppercase font-mono">
                  WEAPONS BAY & TURRET MOUNTS
                </span>
                <h2 className="text-xl font-bold text-[#111]">Flagship Modular Hardpoints Configuration</h2>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="p-2 bg-neutral-50 border border-[#dedede]">
                  <span className="text-[10px] text-[#777] block">Hardpoint Firepower</span>
                  <strong className="text-rose-700 text-sm">+{hardpointDps.toLocaleString()} DPS</strong>
                </div>
                <div className="p-2 bg-neutral-50 border border-[#dedede]">
                  <span className="text-[10px] text-[#777] block">Alpha Strike Boost</span>
                  <strong className="text-purple-700 text-sm">+{hardpointAlpha.toLocaleString()} DMG</strong>
                </div>
              </div>
            </div>

            {/* Hardpoint Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {hardpoints.map((hp) => {
                const wpn = FLAGSHIP_WEAPON_CATALOG.find((w) => w.id === hp.equippedWeaponId);
                const isSelected = selectedHardpointId === hp.slotId;
                return (
                  <div
                    key={hp.slotId}
                    onClick={() => setSelectedHardpointId(hp.slotId)}
                    className={`p-4 border text-xs font-mono transition-all cursor-pointer ${
                      isSelected ? 'border-[#111] bg-[#fafafa] shadow-sm ring-1 ring-[#111]' : 'border-[#dedede] bg-white hover:border-[#aaa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-[#777]">{hp.slotType}</span>
                      <span className="px-2 py-0.5 bg-[#111] text-white text-[10px] font-bold">
                        LVL {hp.level}
                      </span>
                    </div>
                    <div className="font-bold text-[#111] text-sm mb-1">{hp.slotName}</div>
                    {wpn ? (
                      <div className="space-y-1 mt-2 p-2.5 bg-white border border-[#eee]">
                        <div className="flex items-center gap-1.5 font-bold text-blue-700">
                          <span>{wpn.icon}</span>
                          <span>{wpn.name}</span>
                        </div>
                        <div className="text-[10px] text-[#555]">
                          DPS: <strong className="text-[#111]">{(wpn.dps * (1 + (hp.level - 1) * 0.25)).toLocaleString()}</strong> · Type: {wpn.damageType}
                        </div>
                        <div className="text-[10px] text-[#555]">
                          Power: <strong>{wpn.powerDrawMW} MW</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-neutral-100 border border-dashed border-[#ccc] text-center text-[#777]">
                        Empty Hardpoint
                      </div>
                    )}

                    {/* Quick Upgrade Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgradeHardpoint(hp.slotId);
                      }}
                      className="w-full mt-3 py-1.5 bg-[#111] hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Upgrade Level ({hp.level + 1})
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Weapon Catalog to Equip into Selected Hardpoint */}
            {selectedHardpointId && (
              <div className="border-t border-[#eee] pt-4">
                <h3 className="text-sm font-bold text-[#111] uppercase tracking-wider font-mono mb-3">
                  Available Armory Weapon Modules for Hardpoint [
                  {hardpoints.find((h) => h.slotId === selectedHardpointId)?.slotName}]:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FLAGSHIP_WEAPON_CATALOG.filter(
                    (w) => w.slotType === hardpoints.find((h) => h.slotId === selectedHardpointId)?.slotType
                  ).map((weapon) => {
                    const isEquipped = hardpoints.find((h) => h.slotId === selectedHardpointId)?.equippedWeaponId === weapon.id;
                    return (
                      <div key={weapon.id} className="p-4 border border-[#dedede] bg-white space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#111] flex items-center gap-1.5">
                            <span>{weapon.icon}</span>
                            <span>{weapon.name}</span>
                          </span>
                          <span className="px-2 py-0.5 bg-neutral-100 text-[#333] font-bold text-[10px]">
                            Tier {weapon.tier}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666] leading-tight">{weapon.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#fafafa] p-2 border border-[#eee]">
                          <div>DPS: <strong>{weapon.dps.toLocaleString()}</strong></div>
                          <div>Alpha: <strong>{weapon.alphaStrike.toLocaleString()}</strong></div>
                          <div>Type: <strong>{weapon.damageType}</strong></div>
                          <div>Power: <strong>{weapon.powerDrawMW} MW</strong></div>
                        </div>
                        <button
                          onClick={() => handleEquipWeapon(selectedHardpointId, weapon.id)}
                          disabled={isEquipped}
                          className={`w-full py-2 font-bold text-xs cursor-pointer transition-colors ${
                            isEquipped
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-[#111] hover:bg-blue-600 text-white'
                          }`}
                        >
                          {isEquipped ? '✓ Installed on Hardpoint' : 'Install Weapon'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MODULAR ENGINEERING (12 Systems) & CHASSIS DRYDOCK */}
      {/* ========================================================================= */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Chassis Refit Drydock */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider font-mono">
              Mothership Chassis Drydock & Dreadnought Hull Refits:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOTHERSHIP_CHASSIS_CLASSES.map((chassis) => {
                const isCurrent = chassis.id === selectedChassisId;
                return (
                  <div
                    key={chassis.id}
                    className={`p-4 border text-xs font-mono space-y-2 transition-all ${
                      isCurrent
                        ? 'border-[#111111] bg-[#fafafa] ring-1 ring-[#111111]'
                        : 'border-[#dedede] bg-white hover:border-[#999999]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#111]">{chassis.name}</span>
                      <span className="px-1.5 py-0.5 bg-[#111] text-white text-[9px] font-bold">
                        {chassis.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666] leading-tight">{chassis.description}</p>
                    <div className="space-y-1 text-[10px] text-[#444] bg-white p-2 border border-[#eee]">
                      <div>Hull: <strong>{chassis.hullHp.toLocaleString()} HP</strong></div>
                      <div>Shield: <strong>{chassis.shieldHp.toLocaleString()} SH</strong></div>
                      <div>Alpha Strike: <strong>{chassis.alphaStrike.toLocaleString()}</strong></div>
                      <div>Warp: <strong>Factor {chassis.warpFactor}</strong></div>
                    </div>
                    <button
                      onClick={() => handleRefitChassis(chassis)}
                      disabled={isCurrent}
                      className={`w-full py-2 font-bold text-xs cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                          : 'bg-[#111111] text-white hover:bg-emerald-600'
                      }`}
                    >
                      {isCurrent ? 'Current Chassis' : `Refit (${chassis.costNaquadah.toLocaleString()} NQ)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 12 Modular Systems Grid */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider font-mono">
              Modular Engineering Upgrades (12 Flagship Subsystems):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((m) => {
                const cost = m.baseCost * m.level;
                return (
                  <div key={m.key} className="p-4 border border-[#dedede] bg-[#fafafa] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[#111]">{m.name}</strong>
                      <span className="px-2 py-0.5 bg-[#111] text-white font-bold text-[10px]">
                        Lvl {m.level}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{m.benefit}</div>
                    <div className="text-[10px] text-[#777] bg-white p-1.5 border border-[#eee]">
                      Cost: {cost.toLocaleString()} Metal & Crystal
                    </div>
                    <button
                      onClick={() => handleUpgrade(m.key)}
                      className="w-full py-2 bg-[#111] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Upgrade System (+1 Lvl)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CARRIER WINGS & SORTIES */}
      {/* ========================================================================= */}
      {activeTab === 'hangar' && (
        <div className="space-y-6">
          {/* Active Carrier Wings */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#777] uppercase font-mono">
                  CARRIER FLIGHT OPERATIONS
                </span>
                <h2 className="text-xl font-bold text-[#111]">Active Fighter & Bomber Squadrons</h2>
              </div>
              <div className="text-xs font-mono font-bold text-blue-700">
                Total Flight Capacity: {totalFighterCount} / 210 Craft
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hangarWings.map((wing) => {
                const pct = Math.round((wing.count / wing.maxCount) * 100);
                return (
                  <div key={wing.id} className="p-4 border border-[#dedede] bg-[#fafafa] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[#111]">{wing.name}</strong>
                      <span className="text-[10px] font-bold text-[#555] uppercase">{wing.role}</span>
                    </div>
                    <p className="text-[11px] text-[#666]">{wing.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>Squadron Readiness:</span>
                        <strong>{wing.count} / {wing.maxCount} ({pct}%)</strong>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-[10px] text-[#555]">
                      DPS/Unit: <strong>{wing.dpsPerUnit}</strong> · Hull/Unit: <strong>{wing.hullPerUnit}</strong>
                    </div>
                    <button
                      onClick={() => handleRestockWing(wing.id)}
                      disabled={wing.count >= wing.maxCount}
                      className={`w-full py-2 font-bold text-xs cursor-pointer transition-colors ${
                        wing.count >= wing.maxCount
                          ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                          : 'bg-[#111] text-white hover:bg-emerald-600'
                      }`}
                    >
                      {wing.count >= wing.maxCount ? 'Full Squadron' : 'Fabricate +12 Craft'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sortie Mission Board */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider font-mono">
              Carrier Sortie Operations & Deep Space Strikes:
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {INITIAL_SORTIE_MISSIONS.map((mission) => {
                const active = activeSorties.find((s) => s.missionId === mission.id);
                const isReadyToClaim = active && active.remainingSec === 0;
                return (
                  <div key={mission.id} className="p-4 border border-[#dedede] bg-white space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-sm text-[#111]">{mission.name}</strong>
                        <span className="text-[10px] text-[#777] block">{mission.targetSector}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        mission.threatLevel === 'low' ? 'bg-emerald-100 text-emerald-800' :
                        mission.threatLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                        mission.threatLevel === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {mission.threatLevel} threat
                      </span>
                    </div>

                    <p className="text-[11px] text-[#666]">{mission.description}</p>

                    <div className="p-2.5 bg-[#fafafa] border border-[#eee] space-y-1 text-[10px]">
                      <div className="text-[#333]">
                        Rewards: +{mission.rewards.credits.toLocaleString()} GC · +{mission.rewards.naquadah.toLocaleString()} NQ · +{mission.rewards.glory} Glory XP
                      </div>
                      <div className="text-[#777]">
                        Required Wing: <strong className="uppercase">{mission.requiredWingRole}</strong> (Min {mission.minCraftCount} craft) · Duration: {mission.durationSec}s
                      </div>
                    </div>

                    {isReadyToClaim ? (
                      <button
                        onClick={() => handleClaimSortieRewards(mission)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm animate-pulse"
                      >
                        ✓ Sortie Complete! Claim Mission Bounty
                      </button>
                    ) : active ? (
                      <div className="w-full py-2.5 bg-neutral-100 border border-[#ddd] text-center text-xs text-[#555] font-bold">
                        Strike Squadron Engaged in Combat ({active.remainingSec}s remaining)...
                      </div>
                    ) : (
                      <button
                        onClick={() => handleLaunchSortie(mission)}
                        className="w-full py-2.5 bg-[#111] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Launch Carrier Sortie Squadron
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BRIDGE OFFICERS */}
      {/* ========================================================================= */}
      {activeTab === 'officers' && (
        <div className="border border-[#dedede] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eee] pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#777] uppercase font-mono">
                FLAGSHIP SENIOR STAFF
              </span>
              <h2 className="text-xl font-bold text-[#111]">Bridge Officers & Command Specializations</h2>
            </div>
            <div className="text-xs font-mono font-bold text-indigo-700">
              Available Glory XP: {(profile?.glory ?? 0).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officers.map((off) => (
              <div key={off.id} className="p-4 border border-[#dedede] bg-[#fafafa] space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{off.avatar}</span>
                  <div>
                    <strong className="text-sm text-[#111] block">{off.name}</strong>
                    <span className="text-[10px] text-[#777]">{off.station} · {off.rank}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#555]">{off.specialty}</p>
                <div className="text-[10px] text-indigo-700 font-bold bg-white p-2 border border-[#eee]">
                  {off.bonusSummary}
                </div>
                <button
                  onClick={() => handlePromoteOfficer(off.id)}
                  disabled={off.level >= off.maxLevel}
                  className={`w-full py-2 font-bold text-xs cursor-pointer transition-colors ${
                    off.level >= off.maxLevel
                      ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#111] hover:bg-indigo-600 text-white'
                  }`}
                >
                  {off.level >= off.maxLevel ? 'Max Rank Reached' : `Promote (${off.level * 40} Glory XP)`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DEEP SPACE VOID RECON */}
      {/* ========================================================================= */}
      {activeTab === 'exploration' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#777] uppercase font-mono">
                  DEEP SPACE ASTROGATION
                </span>
                <h2 className="text-xl font-bold text-[#111]">Sector Void Reconnaissance</h2>
              </div>
              <div className="text-xs font-mono font-bold text-amber-700">
                Exploration / Attack Turns: {resources.attackTurns}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEEP_SPACE_SECTORS.map((sec) => (
                <div key={sec.id} className="p-4 border border-[#dedede] bg-[#fafafa] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-[#111]">{sec.name}</strong>
                    <span className="text-[10px] px-2 py-0.5 bg-neutral-200 font-bold">
                      [{sec.coordinate}]
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666]">{sec.description}</p>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    Potential Rewards: {sec.potentialRewards.join(' · ')}
                  </div>
                  <button
                    onClick={() => handleExploreSector(sec)}
                    className="w-full py-2 bg-[#111] hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Launch Deep Space Recon Probe ({sec.fuelCostTurns} Turn)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Modal */}
          {activeAnomaly && (
            <div className="border border-[#111] bg-white p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#eee] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase font-mono">
                    DEEP SPACE ANOMALY CONTACT
                  </span>
                  <h3 className="text-lg font-bold text-[#111]">{activeAnomaly.title}</h3>
                </div>
                <button
                  onClick={() => setActiveAnomaly(null)}
                  className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-[#555] leading-relaxed">{activeAnomaly.briefing}</p>

              {eventOutcome ? (
                <div className={`p-4 border text-xs font-mono ${
                  eventOutcome.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <strong className="block text-sm mb-1">{eventOutcome.title}</strong>
                  <p>{eventOutcome.text}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#111] uppercase font-mono block">
                    Select Tactical Intervention Course:
                  </span>
                  {activeAnomaly.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleResolveAnomalyOption(opt)}
                      className="w-full p-3 border border-[#dedede] bg-[#fafafa] hover:border-[#111] text-left text-xs font-mono transition-colors cursor-pointer"
                    >
                      <strong className="block text-[#111] mb-0.5">{opt.label}</strong>
                      <span className="text-[11px] text-[#666]">{opt.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: DOOMSDAY SUPERWEAPON & OVERDRIVE */}
      {/* ========================================================================= */}
      {activeTab === 'superweapon' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#777] uppercase font-mono">
                  STRATEGIC SUPERWEAPON BATTERY
                </span>
                <h2 className="text-xl font-bold text-[#111]">Spinal Chrono-Tachyon Doomsday Lance</h2>
              </div>
              <div className="text-xs font-mono font-bold text-rose-700">
                Capacitor: {lanceChargePct}% / 100%
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-neutral-200 h-4 overflow-hidden border border-[#ccc]">
                <div
                  className="bg-rose-600 h-full transition-all duration-500"
                  style={{ width: `${lanceChargePct}%` }}
                />
              </div>
              <p className="text-xs text-[#666]">
                The spinal lance channels antimatter cascades to annihilate planetary fortifications and orbital armadas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleChargeLance}
                disabled={lanceChargePct >= 100}
                className={`px-4 py-2.5 font-bold text-xs font-mono cursor-pointer ${
                  lanceChargePct >= 100
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : 'bg-[#111] hover:bg-blue-600 text-white'
                }`}
              >
                Inject Deuterium Fuel (+35% Charge · 15,000 Deut)
              </button>

              <button
                onClick={handleFireDoomsday}
                disabled={lanceChargePct < 100}
                className={`px-6 py-2.5 font-bold text-xs font-mono cursor-pointer shadow-md ${
                  lanceChargePct < 100
                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                }`}
              >
                ⚡ DISCHARGE DOOMSDAY LANCE (2 Turns)
              </button>
            </div>
          </div>

          {/* Singularity Reactor Overclock */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111] uppercase tracking-wider font-mono">
              Tokamak Zero-Point Reactor Overclock Controls:
            </h3>
            <div className="p-4 bg-[#fafafa] border border-[#eee] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="font-bold text-sm text-[#111] block mb-1">
                  Core Thermal Load: {overclockHeat}°C
                </span>
                <span className="text-[#666]">
                  Overclocking accelerates sublight travel speeds and shield recharge rates by 40%.
                </span>
              </div>
              <button
                onClick={handleToggleOverclock}
                className={`px-4 py-2 font-bold text-xs cursor-pointer ${
                  overclockActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-[#111] hover:bg-amber-600 text-white'
                }`}
              >
                {overclockActive ? 'Disengage Overclock' : 'Engage Overclock Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: HULL LIVERY & THEMES */}
      {/* ========================================================================= */}
      {activeTab === 'themes' && (
        <div className="border border-[#dedede] bg-white p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eee] pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#777] uppercase font-mono">
                LIVERY STUDIO & VISUAL SKINS
              </span>
              <h2 className="text-xl font-bold text-[#111]">Mothership Themes & Carapace Patterns</h2>
            </div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {(['all', 'Imperial', 'Alien', 'High-Tech', 'Tactical', 'Ancient', 'Cybernetic'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setThemeFilter(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase border cursor-pointer ${
                    themeFilter === cat
                      ? 'bg-[#111] text-white border-[#111]'
                      : 'bg-[#fafafa] text-[#666] border-[#dedede] hover:border-[#111]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOTHERSHIP_THEMES.filter((t) => themeFilter === 'all' || t.category === themeFilter).map((theme) => {
              const isUnlocked = unlockedThemeIds.includes(theme.id);
              const isActive = activeThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  className={`p-4 border text-xs font-mono space-y-3 transition-all ${
                    isActive
                      ? 'border-[#111] bg-[#fafafa] ring-2 ring-[#111]'
                      : 'border-[#dedede] bg-white hover:border-[#aaa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-[#111]">{theme.name}</strong>
                    <span className="text-[9px] px-1.5 py-0.5 bg-neutral-100 font-bold uppercase">
                      {theme.accentBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666]">{theme.tagline}</p>
                  <div className="p-2 bg-neutral-50 border border-[#eee] text-[10px] text-emerald-800 font-semibold">
                    {theme.statBonus.label}
                  </div>
                  {isUnlocked ? (
                    <button
                      onClick={() => handleEquipTheme(theme)}
                      disabled={isActive}
                      className={`w-full py-2 font-bold text-xs cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-neutral-200 text-neutral-600 cursor-default'
                          : 'bg-[#111] hover:bg-emerald-600 text-white'
                      }`}
                    >
                      {isActive ? '✓ Active Livery' : 'Equip Livery'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlockTheme(theme)}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Unlock ({theme.unlockCostGlory} Glory · {theme.unlockCostNaquadah.toLocaleString()} NQ)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
