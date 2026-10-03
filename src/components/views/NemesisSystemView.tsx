import React, { useState } from 'react';
import {
  Skull,
  Shield,
  Zap,
  Target,
  Swords,
  Crown,
  Eye,
  AlertTriangle,
  Award,
  Sparkles,
  Flame,
  History,
  TrendingUp,
  DollarSign,
  UserCheck,
  UserX,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Crosshair,
  Feather,
  Radio,
  Users,
  Compass,
  ChevronRight,
  Activity,
  RefreshCw,
  Trophy,
  Bomb,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import {
  NemesisRival,
  NemesisTrait,
  PlayerResources,
  PlayerProfile,
  VendettaMission,
  PowerStruggleEvent,
} from '../../types';
import { sound } from '../../sound';
import {
  INITIAL_NEMESIS_HIERARCHY,
  INITIAL_VENDETTA_MISSIONS,
  INITIAL_POWER_STRUGGLES,
  generateRandomNemesis,
  NEMESIS_WEAKNESSES_POOL,
  NEMESIS_STRENGTHS_POOL,
} from '../../data/nemesisData';

interface NemesisSystemViewProps {
  resources: PlayerResources;
  onUpdateResources: (updates: Partial<PlayerResources>) => void;
  profile: PlayerProfile;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

export function NemesisSystemView({
  resources,
  onUpdateResources,
  profile,
  onUpdateProfile,
  onNavigate,
}: NemesisSystemViewProps) {
  // Persistence state
  const loadNemesis = (): NemesisRival[] => {
    try {
      const saved = localStorage.getItem('uc_state_nemesis_hierarchy');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_NEMESIS_HIERARCHY;
    } catch {
      return INITIAL_NEMESIS_HIERARCHY;
    }
  };

  const loadVendettas = (): VendettaMission[] => {
    try {
      const saved = localStorage.getItem('uc_state_vendetta_missions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_VENDETTA_MISSIONS;
    } catch {
      return INITIAL_VENDETTA_MISSIONS;
    }
  };

  const loadPowerStruggles = (): PowerStruggleEvent[] => {
    try {
      const saved = localStorage.getItem('uc_state_power_struggles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_POWER_STRUGGLES;
    } catch {
      return INITIAL_POWER_STRUGGLES;
    }
  };

  const [rivals, setRivals] = useState<NemesisRival[]>(loadNemesis);
  const [vendettas, setVendettas] = useState<VendettaMission[]>(loadVendettas);
  const [powerStruggles, setPowerStruggles] = useState<PowerStruggleEvent[]>(loadPowerStruggles);
  const [selectedRivalId, setSelectedRivalId] = useState<string>('nemesis-1');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'power_struggles' | 'vendettas' | 'vassals' | 'black_ops' | 'grudges'>('hierarchy');

  // Tactical Fleet Duel & Combat Modal State
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [battleRival, setBattleRival] = useState<NemesisRival | null>(null);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [battleRound, setBattleRound] = useState<number>(1);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [battleFinished, setBattleFinished] = useState<boolean>(false);
  const [battleOutcome, setBattleOutcome] = useState<'victory' | 'defeat' | 'fled' | null>(null);
  const [vassalReinforcementCalled, setVassalReinforcementCalled] = useState<boolean>(false);

  // Intervention Modal State for Power Struggles
  const [activeIntervention, setActiveIntervention] = useState<PowerStruggleEvent | null>(null);

  // Global Notification Banner
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const saveRivals = (updated: NemesisRival[]) => {
    setRivals(updated);
    try {
      localStorage.setItem('uc_state_nemesis_hierarchy', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const saveVendettas = (updated: VendettaMission[]) => {
    setVendettas(updated);
    try {
      localStorage.setItem('uc_state_vendetta_missions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const savePowerStruggles = (updated: PowerStruggleEvent[]) => {
    setPowerStruggles(updated);
    try {
      localStorage.setItem('uc_state_power_struggles', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  // Find ranks
  const selectedRival = rivals.find((r) => r.id === selectedRivalId) || rivals[0];
  const overlord = rivals.find((r) => r.rankTier === 'overlord');
  const warlords = rivals.filter((r) => r.rankTier === 'warlord');
  const captains = rivals.filter((r) => r.rankTier === 'captain');
  const enforcers = rivals.filter((r) => r.rankTier === 'enforcer');
  const vassals = rivals.filter((r) => r.vassalOfPlayer);

  // -------------------------------------------------------------
  // DYNAMIC HIERARCHY SHAKEUP & SUCCESSION PROMOTION
  // -------------------------------------------------------------
  const handlePromoteHierarchy = (defeatedId: string) => {
    const updated = [...rivals];
    const defIndex = updated.findIndex((r) => r.id === defeatedId);
    if (defIndex === -1) return;

    const defRival = updated[defIndex];
    let lowerTier: 'warlord' | 'captain' | 'enforcer' | null = null;
    if (defRival.rankTier === 'overlord') lowerTier = 'warlord';
    else if (defRival.rankTier === 'warlord') lowerTier = 'captain';
    else if (defRival.rankTier === 'captain') lowerTier = 'enforcer';

    // Check for an ambitious subordinate who can seize the throne/post
    const promoter = updated.find(
      (r) => lowerTier && r.rankTier === lowerTier && r.id !== defeatedId && !r.vassalOfPlayer
    );

    if (promoter) {
      const oldRank = promoter.rankTier;
      promoter.rankTier = defRival.rankTier;
      promoter.hierarchyPosition = defRival.hierarchyPosition;
      promoter.level += 6;
      promoter.power = Math.floor(promoter.power * 1.35);
      promoter.history.unshift({
        id: `mem-${Date.now()}`,
        timestamp: new Date().toLocaleDateString(),
        eventType: 'promoted',
        text: `Seized vacant rank of ${defRival.rankTier.toUpperCase()} following the fall of ${defRival.name}!`,
        powerImpact: 2500,
      });

      // Spawn a fresh new recruit to fill the vacated bottom rank
      const freshRecruit = generateRandomNemesis(12, 'enforcer', promoter.id);
      updated.push(freshRecruit);
      triggerAlert(`🔥 Hierarchy Shakeup! ${promoter.name} seized command as ${defRival.rankTier.toUpperCase()}! A new enforcer (${freshRecruit.name}) joined the lower ranks!`);
    } else {
      // Generate immediate dynamic challenger replacement
      const replacement = generateRandomNemesis(defRival.hierarchyPosition, defRival.rankTier);
      updated[defIndex] = replacement;
      triggerAlert(`⚡ New Warlord Emerges! ${replacement.name} seized command as the new ${defRival.rankTier.toUpperCase()}!`);
    }

    saveRivals(updated);
  };

  // -------------------------------------------------------------
  // ACTION: Bribe / Demand Vassalage
  // -------------------------------------------------------------
  const handleForceVassalage = (rival: NemesisRival) => {
    sound.play('click');
    if (rival.vassalOfPlayer) {
      triggerAlert(`${rival.name} is already sworn to your armada!`);
      return;
    }

    const costNaquadah = rival.power * 120;
    if (resources.naquadah < costNaquadah) {
      sound.play('warning');
      triggerAlert(`Insufficient Naquadah! Subjugating ${rival.name} requires ${costNaquadah.toLocaleString()} NQ.`);
      return;
    }

    onUpdateResources({ naquadah: resources.naquadah - costNaquadah });

    const updated = rivals.map((r) => {
      if (r.id === rival.id) {
        return {
          ...r,
          vassalOfPlayer: true,
          vassalRole: 'raider' as const,
          vassalTributeAccumulated: { naquadah: 150000, metal: 75000, darkMatter: 25 },
          history: [
            {
              id: `mem-${Date.now()}`,
              timestamp: new Date().toLocaleDateString(),
              eventType: 'tribute' as const,
              text: `Swore blood oath of fealty to Commander ${profile.username}. Assigned as Fleet Raider.`,
              powerImpact: -1000,
            },
            ...r.history,
          ],
        };
      }
      return r;
    });

    sound.play('confirm');
    saveRivals(updated);
    triggerAlert(`🤝 Vassalage Secured! ${rival.name} has bent the knee and pledged their warfleet to you!`);
  };

  // -------------------------------------------------------------
  // ACTION: Subspace Espionage Operations
  // -------------------------------------------------------------
  const handleInfiltrateSpy = (rival: NemesisRival) => {
    sound.play('click');
    const spyCost = 120000;
    if (resources.naquadah < spyCost) {
      sound.play('warning');
      triggerAlert(`Requires 120,000 Naquadah for deep subspace reconnaissance.`);
      return;
    }

    onUpdateResources({ naquadah: resources.naquadah - spyCost });

    const unrevealedWeakness = NEMESIS_WEAKNESSES_POOL.find(
      (w) => !rival.weaknesses.some((rw) => rw.id === w.id)
    );

    const updated = rivals.map((r) => {
      if (r.id === rival.id) {
        const newWeaknesses = unrevealedWeakness
          ? [...r.weaknesses, unrevealedWeakness]
          : r.weaknesses;
        return {
          ...r,
          weaknesses: newWeaknesses,
          history: [
            {
              id: `mem-${Date.now()}`,
              timestamp: new Date().toLocaleDateString(),
              eventType: 'spied' as const,
              text: `Deep subspace operatives bypassed flagship firewalls and exposed internal system vulnerabilities.`,
              powerImpact: -500,
            },
            ...r.history,
          ],
        };
      }
      return r;
    });

    sound.play('confirm');
    saveRivals(updated);
    triggerAlert(
      unrevealedWeakness
        ? `🕵️ Espionage Success! Exposed critical flaw: [${unrevealedWeakness.name}] on ${rival.name}!`
        : `🕵️ Espionage Success! All tactical telemetry and sector logs confirmed for ${rival.name}!`
    );
  };

  const handlePlantSabotage = (rival: NemesisRival) => {
    sound.play('click');
    const sabotageCost = 250000;
    if (resources.naquadah < sabotageCost || resources.energy < 20) {
      sound.play('warning');
      triggerAlert(`Requires 250,000 Naquadah and 20 Grid Energy to plant covert plasma charges.`);
      return;
    }

    onUpdateResources({
      naquadah: resources.naquadah - sabotageCost,
      energy: resources.energy - 20,
    });

    const updated = rivals.map((r) => {
      if (r.id === rival.id) {
        return {
          ...r,
          sabotaged: true,
          power: Math.max(1000, Math.floor(r.power * 0.85)),
          history: [
            {
              id: `mem-${Date.now()}`,
              timestamp: new Date().toLocaleDateString(),
              eventType: 'shamed' as const,
              text: `Sabotage operatives infiltrated the reactor bay, detonating plasma dampeners (-15% Power).`,
              powerImpact: -1500,
            },
            ...r.history,
          ],
        };
      }
      return r;
    });

    sound.play('explosion');
    saveRivals(updated);
    triggerAlert(`💥 Sabotage Successful! ${rival.name}'s flagship primary conduits were crippled!`);
  };

  const handlePlantBeacon = (rival: NemesisRival) => {
    sound.play('click');
    const beaconCost = 80000;
    if (resources.naquadah < beaconCost) {
      sound.play('warning');
      triggerAlert(`Requires 80,000 Naquadah to launch a subspace telemetry tracker.`);
      return;
    }

    onUpdateResources({ naquadah: resources.naquadah - beaconCost });

    const updated = rivals.map((r) => {
      if (r.id === rival.id) {
        return {
          ...r,
          beaconPlanted: true,
        };
      }
      return r;
    });

    sound.play('ping');
    saveRivals(updated);
    triggerAlert(`📡 Subspace Tracking Beacon Attached! Real-time orbital coordinates locked on ${rival.name}.`);
  };

  // -------------------------------------------------------------
  // VASSAL MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const handleAssignVassalRole = (
    rivalId: string,
    role: 'bodyguard' | 'infiltrator' | 'raider' | 'tribute_collector'
  ) => {
    sound.play('click');
    const updated = rivals.map((r) => {
      if (r.id === rivalId) {
        return {
          ...r,
          vassalRole: role,
        };
      }
      return r;
    });
    saveRivals(updated);
    triggerAlert(`🎖️ Vassal Role Updated: Commander reassigned to [${role.toUpperCase().replace('_', ' ')}]!`);
  };

  const handleCollectAllVassalTribute = () => {
    sound.play('click');
    let totalNq = 0;
    let totalMetal = 0;
    let totalDarkMatter = 0;

    const updated = rivals.map((r) => {
      if (r.vassalOfPlayer && r.vassalTributeAccumulated) {
        totalNq += r.vassalTributeAccumulated.naquadah || 0;
        totalMetal += r.vassalTributeAccumulated.metal || 0;
        totalDarkMatter += r.vassalTributeAccumulated.darkMatter || 0;
        return {
          ...r,
          vassalTributeAccumulated: { naquadah: 0, metal: 0, darkMatter: 0 },
        };
      }
      return r;
    });

    if (totalNq === 0 && totalMetal === 0 && totalDarkMatter === 0) {
      sound.play('warning');
      triggerAlert(`No accumulated tribute to collect right now. Vassals generate tribute each cycle.`);
      return;
    }

    sound.play('trade');
    onUpdateResources({
      naquadah: resources.naquadah + totalNq,
      metal: resources.metal + totalMetal,
      darkMatter: (resources.darkMatter || 0) + totalDarkMatter,
    });

    saveRivals(updated);
    triggerAlert(
      `💰 Tribute Harvested! +${totalNq.toLocaleString()} Naquadah, +${totalMetal.toLocaleString()} Metal, +${totalDarkMatter} Dark Matter!`
    );
  };

  // -------------------------------------------------------------
  // CYCLE GALAXY TURN / POWER STRUGGLES
  // -------------------------------------------------------------
  const handleAdvanceGalaxyTurn = () => {
    sound.play('warp_pulse');

    // 1. Advance power struggles
    let updatedStruggles = powerStruggles.map((ps) => ({
      ...ps,
      roundsRemaining: ps.roundsRemaining - 1,
    }));

    // Auto-resolve expired struggles
    const completedStruggles = updatedStruggles.filter((ps) => ps.roundsRemaining <= 0);
    updatedStruggles = updatedStruggles.filter((ps) => ps.roundsRemaining > 0);

    let updatedRivals = [...rivals];

    completedStruggles.forEach((ps) => {
      const att = updatedRivals.find((r) => r.id === ps.attackerId);
      const def = updatedRivals.find((r) => r.id === ps.defenderId);

      if (att && def) {
        // Attacker won power struggle
        att.power += 1500;
        att.level += 2;
        att.history.unshift({
          id: `mem-${Date.now()}`,
          timestamp: new Date().toLocaleDateString(),
          eventType: 'promoted',
          text: `Won Power Struggle [${ps.title}] against ${def.name}! Seized sector spoils.`,
          powerImpact: 1500,
        });

        def.power = Math.max(1000, def.power - 1000);
        def.history.unshift({
          id: `mem-${Date.now()}`,
          timestamp: new Date().toLocaleDateString(),
          eventType: 'demoted',
          text: `Defeated in Power Struggle [${ps.title}] by ${att.name}. Fleet suffered severe damage.`,
          powerImpact: -1000,
        });
      }
    });

    // 2. Generate new power struggle if under 3
    if (updatedStruggles.length < 3 && updatedRivals.length >= 2) {
      const randAtt = updatedRivals[Math.floor(Math.random() * updatedRivals.length)];
      const randDef = updatedRivals.find((r) => r.id !== randAtt.id && r.rankTier !== randAtt.rankTier) || updatedRivals[0];
      const newPs: PowerStruggleEvent = {
        id: `ps-${Date.now()}`,
        type: Math.random() > 0.5 ? 'duel' : 'mutiny',
        title: `${randAtt.name} Incursion`,
        description: `${randAtt.name} deployed strike forces to challenge ${randDef.name} for territorial dominance.`,
        attackerId: randAtt.id,
        defenderId: randDef.id,
        location: randAtt.sectorTerritory || 'Deep Void',
        roundsRemaining: 3,
        reward: {
          naquadah: 1000000 + Math.floor(Math.random() * 500000),
          metal: 500000 + Math.floor(Math.random() * 250000),
          glory: 300,
          darkMatter: 100,
        },
      };
      updatedStruggles.push(newPs);
    }

    // 3. Accumulate vassal tributes & increase grudge of defeated enemies
    updatedRivals = updatedRivals.map((r) => {
      if (r.vassalOfPlayer) {
        const rate = r.vassalRole === 'raider' ? 2 : 1;
        const current = r.vassalTributeAccumulated || { naquadah: 0, metal: 0, darkMatter: 0 };
        return {
          ...r,
          vassalTributeAccumulated: {
            naquadah: current.naquadah + r.power * 25 * rate,
            metal: current.metal + r.power * 12 * rate,
            darkMatter: current.darkMatter + (r.vassalRole === 'raider' ? 5 : 2),
          },
        };
      } else {
        // slight grudge rise
        return {
          ...r,
          grudgeLevel: Math.min(100, (r.grudgeLevel || 10) + 2),
        };
      }
    });

    saveRivals(updatedRivals);
    savePowerStruggles(updatedStruggles);
    triggerAlert(`🌌 Galaxy Cycle Advanced! Power struggle timers progressed, and vassal armadas gathered new resources.`);
  };

  // -------------------------------------------------------------
  // POWER STRUGGLE INTERVENTION
  // -------------------------------------------------------------
  const handleInterveneInStruggle = (struggle: PowerStruggleEvent, targetSide: 'attacker' | 'defender' | 'both') => {
    sound.play('combat');
    const att = rivals.find((r) => r.id === struggle.attackerId);
    const def = rivals.find((r) => r.id === struggle.defenderId);

    if (targetSide === 'both' && att) {
      handleStartBattle(att);
    } else if (targetSide === 'attacker' && att) {
      handleStartBattle(att);
    } else if (targetSide === 'defender' && def) {
      handleStartBattle(def);
    }

    // Remove from power struggles after intervention
    const updated = powerStruggles.filter((ps) => ps.id !== struggle.id);
    savePowerStruggles(updated);
    setActiveIntervention(null);
  };

  // -------------------------------------------------------------
  // ACTION: Tactical Fleet Combat Simulation
  // -------------------------------------------------------------
  const handleStartBattle = (rival: NemesisRival) => {
    sound.play('combat');
    setBattleRival(rival);
    setPlayerHp(100);
    setRivalHp(rival.sabotaged ? 70 : rival.health);
    setBattleRound(1);
    setVassalReinforcementCalled(false);
    setBattleLog([
      `⚔️ ENGAGING RIVAL WARLORD: ${rival.name} [${rival.rankTier.toUpperCase()}]`,
      `📍 Battlefield: ${rival.sectorTerritory || 'Contested Space'}`,
      `🚀 Flagship Detected: ${rival.shipClass || 'Capital Dreadnought'}`,
      `📢 ${rival.name}: "${rival.taunts.greeting}"`,
      rival.sabotaged
        ? `💥 Covert Sabotage Active! Flagship begins combat with -30% Hull Integrity!`
        : `🛡️ Enemy shields at maximum modulation. Select tactical commands below.`,
    ]);
    setBattleFinished(false);
    setBattleOutcome(null);
    setInBattle(true);
  };

  const handleExecuteBattleTurn = (
    move:
      | 'all_out'
      | 'target_weakness'
      | 'shield_overcharge'
      | 'orbital_strike'
      | 'boarding_party'
      | 'call_vassal'
      | 'retreat'
  ) => {
    if (!battleRival || battleFinished) return;

    sound.play('click');
    const nextRound = battleRound + 1;

    if (move === 'retreat') {
      sound.play('warning');
      setBattleFinished(true);
      setBattleOutcome('fled');
      setBattleLog((prev) => [
        ...prev,
        `🚀 Emergency Hyperspace Jump Disengaged! Your fleet retreated from combat.`,
        `📢 ${battleRival.name}: "${battleRival.taunts.retreat}"`,
      ]);

      const updatedRivals = rivals.map((r) => {
        if (r.id === battleRival.id) {
          return {
            ...r,
            power: r.power + 600,
            grudgeLevel: Math.min(100, (r.grudgeLevel || 10) + 15),
            history: [
              {
                id: `mem-${Date.now()}`,
                timestamp: new Date().toLocaleDateString(),
                eventType: 'player_victory' as const,
                text: `Forced Commander ${profile.username} to flee from ${battleRival.sectorTerritory || 'battle'}.`,
                powerImpact: 600,
              },
              ...r.history,
            ],
          };
        }
        return r;
      });
      saveRivals(updatedRivals);
      return;
    }

    let pDamage = Math.floor(Math.random() * 22 + 18);
    let rDamageToPlayer = Math.floor((battleRival.power / 750) * (Math.random() * 15 + 10));
    const turnLog: string[] = [];

    // Bodyguard modifier
    const activeBodyguards = rivals.filter(
      (r) => battleRival.bodyguardIds?.includes(r.id) && !r.vassalOfPlayer
    );
    if (activeBodyguards.length > 0) {
      rDamageToPlayer += activeBodyguards.length * 4;
      turnLog.push(`🛡️ ${activeBodyguards.length} Sworn Bodyguard escort ships supported ${battleRival.name}'s defensive screen!`);
    }

    // Move execution
    if (move === 'all_out') {
      pDamage = Math.floor(pDamage * 1.55);
      rDamageToPlayer = Math.floor(rDamageToPlayer * 1.25);
      turnLog.push(`💥 Round ${battleRound}: Heavy All-Out Plasma Salvo! (-${pDamage}% Enemy Hull)`);
    } else if (move === 'target_weakness') {
      const hasWeakness = battleRival.weaknesses.length > 0;
      if (hasWeakness) {
        const weak = battleRival.weaknesses[0];
        pDamage = Math.floor(pDamage * 2.3);
        turnLog.push(`🎯 Round ${battleRound}: Exploited Vulnerability [${weak.name}]! Critical breach! (-${pDamage}% Enemy Hull)`);
      } else {
        pDamage = Math.floor(pDamage * 1.15);
        turnLog.push(`🎯 Round ${battleRound}: Targeted command tower conduits. (-${pDamage}% Enemy Hull)`);
      }
    } else if (move === 'shield_overcharge') {
      pDamage = Math.floor(pDamage * 0.7);
      rDamageToPlayer = Math.floor(rDamageToPlayer * 0.35);
      turnLog.push(`🛡️ Round ${battleRound}: Deflector Grid Overcharged! Incoming damage heavily deflected. (-${pDamage}% Enemy Hull)`);
    } else if (move === 'orbital_strike') {
      if (resources.energy >= 40) {
        onUpdateResources({ energy: resources.energy - 40 });
        pDamage = Math.floor(pDamage * 2.8);
        sound.play('explosion');
        turnLog.push(`⚡ Round ${battleRound}: Orbital Ion Cannon Super-Salvo Fired! Total devastation! (-${pDamage}% Enemy Hull)`);
      } else {
        turnLog.push(`⚠️ Insufficient Grid Energy! Orbital beam failed to focus!`);
      }
    } else if (move === 'boarding_party') {
      pDamage = Math.floor(pDamage * 1.2);
      rDamageToPlayer = Math.floor(rDamageToPlayer * 0.8);
      const looted = Math.floor(battleRival.power * 50);
      onUpdateResources({ naquadah: resources.naquadah + looted });
      turnLog.push(`🪓 Round ${battleRound}: Boarding Gunners captured enemy bridge! Siphoned +${looted.toLocaleString()} Naquadah! (-${pDamage}% Enemy Hull)`);
    } else if (move === 'call_vassal') {
      const vassalHelper = vassals[0];
      if (vassalHelper && !vassalReinforcementCalled) {
        setVassalReinforcementCalled(true);
        pDamage = Math.floor(pDamage * 2.0);
        rDamageToPlayer = Math.floor(rDamageToPlayer * 0.5);
        sound.play('warp_pulse');
        turnLog.push(`🛸 Round ${battleRound}: Vassal Warlord [${vassalHelper.name}] hyperjumped in and flanked ${battleRival.name}! (-${pDamage}% Enemy Hull)`);
      } else {
        turnLog.push(`⚠️ No additional vassal warships available for warp intervention this round.`);
      }
    }

    // Rival traits
    if (battleRival.strengths.some((s) => s.id === 's-plasma-shield')) {
      pDamage = Math.floor(pDamage * 0.7);
      turnLog.push(`🛡️ ${battleRival.name}'s Overcharged Plasma Shield absorbed 30% of energy strikes!`);
    }
    if (battleRival.strengths.some((s) => s.id === 's-cybernetic-regen') && rivalHp < 50) {
      turnLog.push(`🤖 ${battleRival.name}'s Nanite Regeneration rebuilt +8% Hull!`);
    }

    turnLog.push(`⚔️ ${battleRival.name}'s dreadnought batteries returned heavy fire! (-${rDamageToPlayer}% Fleet HP)`);

    const newRivalHp = Math.max(0, rivalHp - pDamage);
    const newPlayerHp = Math.max(0, playerHp - rDamageToPlayer);

    setRivalHp(newRivalHp);
    setPlayerHp(newPlayerHp);
    setBattleRound(nextRound);
    setBattleLog((prev) => [...prev, ...turnLog]);

    if (newRivalHp <= 0) {
      sound.play('success');
      setBattleFinished(true);
      setBattleOutcome('victory');

      setBattleLog((prev) => [
        ...prev,
        `🎉 VICTORY! ${battleRival.name}'s flagship has been disabled!`,
        `📢 ${battleRival.name}: "${battleRival.taunts.death}"`,
        `👑 Choose the warlord's fate below: EXECUTE, SUBJUGATE (Vassal), or SHAME & DISGRACE!`,
      ]);
    } else if (newPlayerHp <= 0) {
      sound.play('warning');
      setBattleFinished(true);
      setBattleOutcome('defeat');

      setBattleLog((prev) => [
        ...prev,
        `☠️ CRITICAL FLEET CASUALTY! Your command vessel was overwhelmed by ${battleRival.name}.`,
        `📢 ${battleRival.name}: "${battleRival.taunts.defeatPlayer}"`,
      ]);

      // Level up rival and increase grudge
      const updatedRivals = rivals.map((r) => {
        if (r.id === battleRival.id) {
          return {
            ...r,
            level: r.level + 3,
            power: Math.floor(r.power * 1.25),
            killsOnPlayer: r.killsOnPlayer + 1,
            grudgeLevel: Math.min(100, (r.grudgeLevel || 10) + 20),
            history: [
              {
                id: `mem-${Date.now()}`,
                timestamp: new Date().toLocaleDateString(),
                eventType: 'player_defeat' as const,
                text: `Defeated Commander ${profile.username} and advanced to Level ${r.level + 3}!`,
                powerImpact: 1500,
              },
              ...r.history,
            ],
          };
        }
        return r;
      });
      saveRivals(updatedRivals);
    }
  };

  // -------------------------------------------------------------
  // POST-BATTLE FATE CHOICES
  // -------------------------------------------------------------
  const handleResolveFate = (choice: 'execute' | 'vassalize' | 'shame') => {
    if (!battleRival) return;

    if (choice === 'execute') {
      sound.play('explosion');
      const rewardNq = battleRival.bounty.rewardNaquadah || 1000000;
      const rewardMetal = battleRival.bounty.rewardMetal || 500000;
      const rewardGlory = battleRival.bounty.rewardGlory || 300;
      const rewardDM = battleRival.bounty.rewardDarkMatter || 100;

      onUpdateResources({
        naquadah: resources.naquadah + rewardNq,
        metal: resources.metal + rewardMetal,
        darkMatter: (resources.darkMatter || 0) + rewardDM,
      });

      if (onUpdateProfile) {
        onUpdateProfile({ glory: profile.glory + rewardGlory });
      }

      // Complete associated vendettas
      const updatedVendettas = vendettas.map((v) =>
        v.nemesisId === battleRival.id ? { ...v, status: 'completed' as const } : v
      );
      saveVendettas(updatedVendettas);

      // Trigger hierarchy succession
      handlePromoteHierarchy(battleRival.id);
      triggerAlert(
        `💀 Flagship Executed! Collected Bounty: +${rewardNq.toLocaleString()} NQ, +${rewardMetal.toLocaleString()} Metal, +${rewardGlory} Glory!`
      );
    } else if (choice === 'vassalize') {
      sound.play('confirm');
      const updatedRivals = rivals.map((r) => {
        if (r.id === battleRival.id) {
          return {
            ...r,
            vassalOfPlayer: true,
            vassalRole: 'raider' as const,
            vassalTributeAccumulated: { naquadah: 200000, metal: 100000, darkMatter: 30 },
            history: [
              {
                id: `mem-${Date.now()}`,
                timestamp: new Date().toLocaleDateString(),
                eventType: 'tribute' as const,
                text: `Surrendered unconditionally in tactical combat. Sworn as fleet vassal.`,
                powerImpact: -1500,
              },
              ...r.history,
            ],
          };
        }
        return r;
      });
      saveRivals(updatedRivals);
      triggerAlert(`👑 Fealty Accepted! ${battleRival.name} is now your subordinate vassal warlord!`);
    } else if (choice === 'shame') {
      sound.play('warning');
      const isDeranged = Math.random() > 0.4;
      const updatedRivals = rivals.map((r) => {
        if (r.id === battleRival.id) {
          const newLevel = Math.max(5, r.level - 5);
          const newPower = Math.max(1000, Math.floor(r.power * 0.75));
          const newScars = [...r.cyberneticsScars, 'Humiliation Brand'];
          return {
            ...r,
            level: newLevel,
            power: newPower,
            deranged: isDeranged ? true : r.deranged,
            grudgeLevel: 100,
            cyberneticsScars: newScars,
            history: [
              {
                id: `mem-${Date.now()}`,
                timestamp: new Date().toLocaleDateString(),
                eventType: 'shamed' as const,
                text: isDeranged
                  ? `Shamed and disgraced by Commander ${profile.username}! Driven insane with manic blood vengeance!`
                  : `Disgraced and demoted to Level ${newLevel}! Holds burning hatred for the Commander.`,
                powerImpact: -2000,
              },
              ...r.history,
            ],
          };
        }
        return r;
      });
      saveRivals(updatedRivals);
      triggerAlert(
        isDeranged
          ? `🎭 Shamed into Madness! ${battleRival.name} became DERANGED and will stop at nothing for revenge!`
          : `🎭 Shamed! ${battleRival.name}'s rank and power was cut by 25%, sparking max grudge!`
      );
    }

    setInBattle(false);
  };

  // Reset entire hierarchy if desired
  const handleResetHierarchy = () => {
    if (window.confirm('Reset the entire Nemesis Hierarchy and regenerate all 12 warlord positions?')) {
      sound.play('warning');
      saveRivals(INITIAL_NEMESIS_HIERARCHY);
      saveVendettas(INITIAL_VENDETTA_MISSIONS);
      savePowerStruggles(INITIAL_POWER_STRUGGLES);
      triggerAlert(`🔄 Nemesis Hierarchy reset to default balance.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER COMMAND DECK */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3.5 bg-red-950/80 border border-red-500/50 rounded-xl text-red-400 shadow-lg shadow-red-950/50">
                <Skull className="w-8 h-8 animate-pulse text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white tracking-wide">
                    Nemesis System & Rival Warlord Hierarchy
                  </h1>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-mono font-bold tracking-wider">
                    v3.5 REDESIGNED
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                  Dynamic procedural AI rivals that remember battles, command sworn bodyguards, stage sector power struggles, form vendettas, and bend the knee to your armada.
                </p>
              </div>
            </div>
          </div>

          {/* Quick HUD Metrics & Global Operations */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-center px-2.5 border-r border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Throne</span>
                <span className="text-xs font-bold text-red-400 flex items-center justify-center gap-1 mt-0.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  {overlord?.name.split(' ')[0] || 'Vacant'}
                </span>
              </div>
              <div className="text-center px-2.5 border-r border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Vassals</span>
                <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{vassals.length}</span>
              </div>
              <div className="text-center px-2.5 border-r border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Struggles</span>
                <span className="text-sm font-bold text-amber-400 font-mono mt-0.5">{powerStruggles.length}</span>
              </div>
              <div className="text-center px-2.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Bounties</span>
                <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                  {vendettas.filter((v) => v.status === 'active').length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAdvanceGalaxyTurn}
                className="px-3.5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition-all active:scale-95"
                title="Advance power struggles and harvest vassal fealty"
              >
                <Activity className="w-3.5 h-3.5" />
                Advance Galaxy Turn
              </button>

              <button
                onClick={handleCollectAllVassalTribute}
                className="px-3.5 py-2.5 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-500/40 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-200" />
                Collect Tributes
              </button>

              <button
                onClick={handleResetHierarchy}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700"
                title="Reset hierarchy"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Notification Banner */}
        {alertMessage && (
          <div className="mt-4 p-3 bg-red-950/90 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-fade-in font-medium shadow-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
            <span>{alertMessage}</span>
          </div>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('hierarchy');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'hierarchy'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          WARLORD HIERARCHY TREE
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('power_struggles');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'power_struggles'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Swords className="w-4 h-4 text-red-400" />
          POWER STRUGGLES & INCURSIONS ({powerStruggles.length})
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('vendettas');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'vendettas'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Target className="w-4 h-4 text-cyan-400" />
          VENDETTAS & BOUNTIES ({vendettas.filter((v) => v.status === 'active').length})
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('vassals');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'vassals'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          SUBJUGATED VASSAL FLEET ({vassals.length})
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('black_ops');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'black_ops'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Bomb className="w-4 h-4 text-purple-400" />
          ESPIONAGE & BLACK OPS
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('grudges');
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'grudges'
              ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-slate-300" />
          GRUDGE ARCHIVE
        </button>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: WARLORD HIERARCHY TREE & INTERACTIVE TACTICAL DOSSIER  */}
      {/* ============================================================= */}
      {activeTab === 'hierarchy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* HIERARCHY TREE (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* TIER I: SUPREME OVERLORD */}
            {overlord && (
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Tier I: Supreme Overlord
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Territory: {overlord.sectorTerritory}</span>
                </div>

                <div
                  onClick={() => {
                    sound.play('click');
                    setSelectedRivalId(overlord.id);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    selectedRivalId === overlord.id
                      ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-red-500 shadow-2xl shadow-red-950/60 ring-2 ring-red-500/50'
                      : 'bg-slate-900/90 border-slate-800 hover:border-red-500/50 hover:bg-slate-800/80 shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl p-3 bg-slate-950 rounded-xl border border-red-500/40 shadow-inner flex items-center justify-center">
                        {overlord.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white">{overlord.name}</h3>
                          {overlord.vassalOfPlayer && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                              VASSAL
                            </span>
                          )}
                          {overlord.deranged && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                              DERANGED
                            </span>
                          )}
                          {overlord.sabotaged && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                              SABOTAGED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-red-400 font-semibold">{overlord.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{overlord.shipClass}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-mono">Level {overlord.level}</span>
                      <span className="text-sm font-black text-red-400 font-mono">
                        {overlord.power.toLocaleString()} PWR
                      </span>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-slate-500">
                        <span>Grudge:</span>
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${overlord.grudgeLevel || 50}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TIER II: FLEET WARLORDS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Tier II: Fleet Warlords (Sector Commanders)
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{warlords.length} Commanders</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {warlords.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedRivalId(w.id);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedRivalId === w.id
                        ? 'bg-amber-950/60 border-amber-500 shadow-xl ring-2 ring-amber-500/40'
                        : 'bg-slate-900 border-slate-800 hover:border-amber-500/40 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1 bg-slate-950 rounded-lg border border-slate-800">{w.avatar}</span>
                      <div className="truncate flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{w.name}</h4>
                          {w.vassalOfPlayer && (
                            <span className="text-[9px] text-emerald-400 font-bold">VASSAL</span>
                          )}
                        </div>
                        <span className="text-[11px] text-amber-400 font-mono block">Lvl {w.level} • {w.power.toLocaleString()} PWR</span>
                        <span className="text-[10px] text-slate-500 truncate block">{w.sectorTerritory}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER III: SYSTEM CAPTAINS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Tier III: System Captains (Bastion Keepers)
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{captains.length} Captains</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {captains.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedRivalId(c.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedRivalId === c.id
                        ? 'bg-blue-950/60 border-blue-500 shadow-lg ring-2 ring-blue-500/40'
                        : 'bg-slate-900 border-slate-800 hover:border-blue-500/40 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1 bg-slate-950 rounded-lg border border-slate-800">{c.avatar}</span>
                      <div className="truncate flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                        <span className="text-[10px] text-blue-400 font-mono block">{c.power.toLocaleString()} PWR</span>
                        <span className="text-[9px] text-slate-500 truncate block">Lvl {c.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIER IV: ENFORCERS & ASPIRANTS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Tier IV: Enforcers & Raider Aspirants
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{enforcers.length} Enforcers</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {enforcers.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedRivalId(e.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedRivalId === e.id
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-lg ring-2 ring-emerald-500/40'
                        : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg p-1 bg-slate-950 rounded-lg border border-slate-800">{e.avatar}</span>
                      <div className="truncate flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{e.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-mono block">{e.power.toLocaleString()} PWR</span>
                        <span className="text-[9px] text-slate-500 truncate block">Lvl {e.level}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SELECTED RIVAL TACTICAL DOSSIER (5 COLS) */}
          <div className="lg:col-span-5">
            {selectedRival ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 sticky top-4 shadow-2xl">
                {/* Profile Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="text-5xl p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner flex items-center justify-center">
                      {selectedRival.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                          {selectedRival.rankTier}
                        </span>
                        {selectedRival.vassalOfPlayer && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            SWORN VASSAL
                          </span>
                        )}
                        {selectedRival.deranged && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
                            DERANGED
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-white mt-1">{selectedRival.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{selectedRival.title}</p>
                      <p className="text-xs text-slate-500">{selectedRival.race} • {selectedRival.sectorTerritory}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Level {selectedRival.level}</span>
                    <span className="text-base font-black text-red-400 font-mono">
                      {selectedRival.power.toLocaleString()} PWR
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">
                      K/D: {selectedRival.killsOnPlayer}/{selectedRival.deathsToPlayer}
                    </span>
                  </div>
                </div>

                {/* Flagship & Fleet Composition */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Flagship Class:</span>
                    <span className="text-white font-mono font-bold">{selectedRival.shipClass}</span>
                  </div>
                  {selectedRival.fleetComposition && (
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-900 text-center text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px]">Escorts</span>
                        <span className="text-amber-400 font-mono font-bold">{selectedRival.fleetComposition.escorts}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Fighters</span>
                        <span className="text-cyan-400 font-mono font-bold">{selectedRival.fleetComposition.fighters}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Grudge Heat</span>
                        <span className="text-red-400 font-mono font-bold">{selectedRival.grudgeLevel || 30}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice Taunt Quote */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs italic text-slate-300 flex items-start gap-2">
                  <Feather className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400 not-italic block mb-0.5">Intercepted Voice Broadcast:</span>
                    "{selectedRival.taunts.greeting}"
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" /> Strengths & Buffs
                    </span>
                    <div className="space-y-1">
                      {selectedRival.strengths.map((s) => (
                        <div
                          key={s.id}
                          className="p-2 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-200"
                        >
                          <span className="font-bold text-red-400">{s.name}:</span> {s.effect}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5" /> Known Weaknesses
                    </span>
                    {selectedRival.weaknesses.length > 0 ? (
                      <div className="space-y-1">
                        {selectedRival.weaknesses.map((w) => (
                          <div
                            key={w.id}
                            className="p-2 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-xs text-emerald-200"
                          >
                            <span className="font-bold text-emerald-400">{w.name}:</span> {w.effect}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic p-2 bg-slate-950 rounded-lg border border-slate-800">
                        No weaknesses currently exposed. Launch espionage reconnaissance to reveal.
                      </p>
                    )}
                  </div>
                </div>

                {/* Scars & Cybernetics */}
                {selectedRival.cyberneticsScars.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      Battle Scars & Cybernetic Modifications
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedRival.cyberneticsScars.map((sc, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 bg-purple-950/60 text-purple-300 border border-purple-800 rounded-full font-medium"
                        >
                          ⚡ {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => handleStartBattle(selectedRival)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Swords className="w-4 h-4" />
                    Engage Tactical Fleet Duel
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleInfiltrateSpy(selectedRival)}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      Infiltrate (120k NQ)
                    </button>

                    <button
                      onClick={() => handlePlantSabotage(selectedRival)}
                      disabled={selectedRival.sabotaged}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all border active:scale-95 ${
                        selectedRival.sabotaged
                          ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Bomb className="w-3.5 h-3.5 text-amber-400" />
                      {selectedRival.sabotaged ? 'Sabotaged' : 'Plant Sabotage'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleForceVassalage(selectedRival)}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Subjugate Vassal
                    </button>

                    <button
                      onClick={() => handlePlantBeacon(selectedRival)}
                      disabled={selectedRival.beaconPlanted}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all border active:scale-95 ${
                        selectedRival.beaconPlanted
                          ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      {selectedRival.beaconPlanted ? 'Beacon Active' : 'Plant Beacon'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                Select a commander from the hierarchy chart to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: POWER STRUGGLES & SECTOR INCURSIONS                    */}
      {/* ============================================================= */}
      {activeTab === 'power_struggles' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-500" />
                Live Power Struggles & Galactic Feuds
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rival warlords clash for hierarchy ranks, execute mutinies, or launch trade corridor raids. Intervene directly to dictate the outcome!
              </p>
            </div>
            <button
              onClick={handleAdvanceGalaxyTurn}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Activity className="w-4 h-4" />
              Advance Galaxy Turn
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {powerStruggles.map((ps) => {
              const att = rivals.find((r) => r.id === ps.attackerId);
              const def = rivals.find((r) => r.id === ps.defenderId);

              return (
                <div
                  key={ps.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                        {ps.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-amber-400 font-mono font-bold">
                        {ps.roundsRemaining} {ps.roundsRemaining === 1 ? 'Turn' : 'Turns'} Left
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{ps.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{ps.description}</p>
                    <p className="text-[11px] text-slate-500 font-mono">📍 {ps.location}</p>

                    {/* Combatant display */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      {att && (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{att.avatar}</span>
                          <div>
                            <span className="font-bold text-white block">{att.name}</span>
                            <span className="text-[10px] text-red-400 font-mono">{att.power.toLocaleString()} PWR</span>
                          </div>
                        </div>
                      )}

                      <span className="text-red-500 font-bold px-2">VS</span>

                      {def ? (
                        <div className="flex items-center gap-2 text-right">
                          <div>
                            <span className="font-bold text-white block">{def.name}</span>
                            <span className="text-[10px] text-amber-400 font-mono">{def.power.toLocaleString()} PWR</span>
                          </div>
                          <span className="text-2xl">{def.avatar}</span>
                        </div>
                      ) : (
                        <div className="text-right text-[10px] text-slate-500 italic">Sector Defense Garrison</div>
                      )}
                    </div>

                    {/* Reward preview */}
                    <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 grid grid-cols-3 gap-1 text-center text-[10px]">
                      <div>
                        <span className="text-slate-500 block">NQ</span>
                        <span className="text-amber-400 font-mono font-bold">+{ps.reward.naquadah.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Glory</span>
                        <span className="text-purple-400 font-mono font-bold">+{ps.reward.glory}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">DM</span>
                        <span className="text-cyan-400 font-mono font-bold">+{ps.reward.darkMatter}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleInterveneInStruggle(ps, 'attacker')}
                      className="py-2 px-3 bg-red-600/90 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      Strike Attacker
                    </button>

                    <button
                      onClick={() => handleInterveneInStruggle(ps, 'defender')}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1 active:scale-95"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Strike Defender
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: VENDETTAS & BOUNTIES                                   */}
      {/* ============================================================= */}
      {activeTab === 'vendettas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendettas.map((v) => {
              const rival = rivals.find((r) => r.id === v.nemesisId);
              return (
                <div
                  key={v.id}
                  className={`p-5 rounded-2xl border space-y-4 shadow-xl ${
                    v.status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-900/50'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                        {v.type.toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">{v.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{v.description}</p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        v.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {v.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Target Details */}
                  {rival && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-slate-900 rounded-lg">{rival.avatar}</span>
                        <div>
                          <span className="font-bold text-white block">{rival.name}</span>
                          <span className="text-[10px] text-slate-400">{rival.title} • Lvl {rival.level}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-red-400">{rival.power.toLocaleString()} PWR</span>
                    </div>
                  )}

                  {/* Reward Grid */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Naquadah</span>
                      <span className="font-mono font-bold text-amber-400">
                        +{v.reward.naquadah.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Metal</span>
                      <span className="font-mono font-bold text-slate-300">
                        +{v.reward.metal.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Glory</span>
                      <span className="font-mono font-bold text-purple-400">+{v.reward.glory}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Dark Matter</span>
                      <span className="font-mono font-bold text-cyan-400">+{v.reward.darkMatter}</span>
                    </div>
                  </div>

                  {v.status === 'active' && rival && (
                    <button
                      onClick={() => handleStartBattle(rival)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Crosshair className="w-4 h-4" />
                      Execute Vendetta Strike against {rival.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: SUBJUGATED VASSAL FLEET DECK                           */}
      {/* ============================================================= */}
      {activeTab === 'vassals' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Sworn Vassal Armada Command
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Subjugated warlords loyal to your imperial mandate. Assign them as personal escorts, sector raiders, or deep cover infiltrators.
              </p>
            </div>
            <button
              onClick={handleCollectAllVassalTribute}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
            >
              <DollarSign className="w-4 h-4" />
              Collect All Accumulated Tribute
            </button>
          </div>

          {vassals.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <UserX className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-white">No Sworn Vassals in Your Fleet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Defeat rival warlords in tactical combat and choose "SUBJUGATE / BEND KNEE", or spend Naquadah on the hierarchy tree to buy their allegiance.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vassals.map((v) => {
                const tribute = v.vassalTributeAccumulated || { naquadah: 0, metal: 0, darkMatter: 0 };
                return (
                  <div
                    key={v.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">{v.avatar}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{v.name}</h4>
                          <span className="text-xs text-emerald-400 font-mono">Lvl {v.level} • {v.power.toLocaleString()} PWR</span>
                          <span className="text-[10px] text-slate-400 block">{v.shipClass}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                        {v.vassalRole ? v.vassalRole.toUpperCase().replace('_', ' ') : 'RAIDER'}
                      </span>
                    </div>

                    {/* Accumulated fealty tribute */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                        Accumulated Fealty Spoils
                      </span>
                      <div className="grid grid-cols-3 gap-1 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">NQ</span>
                          <span className="text-amber-400 font-mono font-bold">+{tribute.naquadah.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Metal</span>
                          <span className="text-slate-300 font-mono font-bold">+{tribute.metal.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">DM</span>
                          <span className="text-cyan-400 font-mono font-bold">+{tribute.darkMatter}</span>
                        </div>
                      </div>
                    </div>

                    {/* Role assignment choices */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Assign Armada Mission:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleAssignVassalRole(v.id, 'bodyguard')}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                            v.vassalRole === 'bodyguard'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          🛡️ Flagship Escort
                        </button>
                        <button
                          onClick={() => handleAssignVassalRole(v.id, 'raider')}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                            v.vassalRole === 'raider'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          ⚔️ Sector Raider
                        </button>
                        <button
                          onClick={() => handleAssignVassalRole(v.id, 'infiltrator')}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                            v.vassalRole === 'infiltrator'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          🕵️ Infiltrate Throne
                        </button>
                        <button
                          onClick={() => handleAssignVassalRole(v.id, 'tribute_collector')}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                            v.vassalRole === 'tribute_collector'
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          💰 Tax Collector
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 5: ESPIONAGE & BLACK OPS NETWORK                          */}
      {/* ============================================================= */}
      {activeTab === 'black_ops' && (
        <div className="space-y-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bomb className="w-5 h-5 text-purple-400" />
                Subspace Black Ops & Infiltration Operations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dispatch covert operative teams to sabotage rival warships, attach subspace tracking beacons, or uncover classified weaknesses.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Available Naquadah: <span className="text-amber-400 font-bold">{resources.naquadah.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rivals
              .filter((r) => !r.vassalOfPlayer)
              .map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">{r.avatar}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{r.name}</h4>
                        <span className="text-xs text-slate-400">{r.title}</span>
                        <span className="text-[10px] text-red-400 font-mono block">Lvl {r.level} • {r.power.toLocaleString()} PWR</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded-full">
                      {r.rankTier.toUpperCase()}
                    </span>
                  </div>

                  {/* Status indicators */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full border ${r.sabotaged ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                      {r.sabotaged ? '💥 Sabotaged' : 'Unsabotaged'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border ${r.beaconPlanted ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
                      {r.beaconPlanted ? '📡 Tracking Beacon Active' : 'No Tracker'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                      {r.weaknesses.length} Weaknesses Exposed
                    </span>
                  </div>

                  {/* Action grid */}
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleInfiltrateSpy(r)}
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all border border-slate-700 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      Espionage (120k NQ)
                    </button>

                    <button
                      onClick={() => handlePlantSabotage(r)}
                      disabled={r.sabotaged}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all border active:scale-95 ${
                        r.sabotaged
                          ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Bomb className="w-3.5 h-3.5 text-amber-400" />
                      Sabotage (250k NQ)
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 6: GALACTIC GRUDGE ARCHIVE & MEMORY LOGS                  */}
      {/* ============================================================= */}
      {activeTab === 'grudges' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-red-400" />
              Galactic Nemesis Memory & Rivalry Logs
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-Time Event Chronology</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
            {rivals
              .flatMap((r) => r.history.map((m) => ({ ...m, rivalName: r.name, avatar: r.avatar, rankTier: r.rankTier })))
              .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
              .map((mem) => (
                <div
                  key={mem.id}
                  className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">{mem.avatar}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{mem.rivalName}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                          {mem.rankTier}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">({mem.eventType})</span>
                      </div>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{mem.text}</p>
                    </div>
                  </div>

                  <span className="text-slate-500 font-mono shrink-0 ml-4 text-[11px]">{mem.timestamp}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TACTICAL DUEL & FLEET COMBAT MODAL SIMULATOR                  */}
      {/* ============================================================= */}
      {inBattle && battleRival && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Combat Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl p-2.5 bg-slate-950 rounded-2xl border border-red-500/40 shadow-inner">
                  {battleRival.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">Tactical Fleet Duel vs {battleRival.name}</h3>
                    <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full font-bold uppercase">
                      {battleRival.rankTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {battleRival.shipClass} • {battleRival.sectorTerritory}
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                Engagement Round <span className="text-amber-400 text-base font-bold">{battleRound}</span>
              </div>
            </div>

            {/* Visual Health & Shield Telemetry Meters */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 relative z-10">
              {/* Player Fleet Gauge */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-blue-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Player Fleet Integrity
                  </span>
                  <span className="text-white font-mono">{playerHp}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${playerHp}%` }}
                  />
                </div>
              </div>

              {/* Rival Fleet Gauge */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-red-400 flex items-center gap-1">
                    <Skull className="w-3.5 h-3.5" /> {battleRival.name} Flagship
                  </span>
                  <span className="text-white font-mono">{rivalHp}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${rivalHp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Combat Telemetry Console Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-52 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300 shadow-inner relative z-10">
              {battleLog.map((log, i) => (
                <div key={i} className="py-0.5 border-b border-slate-900/60 leading-relaxed">
                  {log}
                </div>
              ))}
            </div>

            {/* Dynamic Tactical Choices or Post-Battle Resolution */}
            <div className="relative z-10">
              {!battleFinished ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleExecuteBattleTurn('all_out')}
                    className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all active:scale-95 shadow-lg shadow-red-950/40"
                  >
                    <Swords className="w-4 h-4" />
                    Heavy Salvo
                  </button>

                  <button
                    onClick={() => handleExecuteBattleTurn('target_weakness')}
                    className="p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all active:scale-95 shadow-lg shadow-amber-950/40"
                  >
                    <Target className="w-4 h-4" />
                    Target Weakness
                  </button>

                  <button
                    onClick={() => handleExecuteBattleTurn('shield_overcharge')}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all active:scale-95 shadow-lg shadow-blue-950/40"
                  >
                    <Shield className="w-4 h-4" />
                    Overcharge Shields
                  </button>

                  <button
                    onClick={() => handleExecuteBattleTurn('orbital_strike')}
                    className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all active:scale-95 shadow-lg shadow-purple-950/40"
                  >
                    <Zap className="w-4 h-4" />
                    Ion Orbital Strike (40 E)
                  </button>

                  <button
                    onClick={() => handleExecuteBattleTurn('boarding_party')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border border-slate-700 active:scale-95"
                  >
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                    Boarding Strike
                  </button>

                  <button
                    onClick={() => handleExecuteBattleTurn('call_vassal')}
                    disabled={vassals.length === 0 || vassalReinforcementCalled}
                    className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border active:scale-95 ${
                      vassals.length > 0 && !vassalReinforcementCalled
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    Call Vassal Strike
                  </button>

                  <button
                    onClick={() => handleExecuteBattleTurn('retreat')}
                    className="col-span-2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    Tactical Hyperspace Retreat
                  </button>
                </div>
              ) : battleOutcome === 'victory' ? (
                <div className="space-y-3">
                  <div className="text-center font-bold text-sm text-emerald-400">
                    ENEMY FLAGSHIP DISABLED • DECIDE THE WARLORD'S FATE
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleResolveFate('execute')}
                      className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex flex-col items-center gap-1 transition-all shadow-lg active:scale-95"
                    >
                      <Skull className="w-4 h-4" />
                      EXECUTE & PLUNDER
                      <span className="text-[10px] font-normal opacity-80">Claim full bounty & kill</span>
                    </button>

                    <button
                      onClick={() => handleResolveFate('vassalize')}
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex flex-col items-center gap-1 transition-all shadow-lg active:scale-95"
                    >
                      <Crown className="w-4 h-4" />
                      BEND KNEE (VASSAL)
                      <span className="text-[10px] font-normal opacity-80">Enlist into vassal armada</span>
                    </button>

                    <button
                      onClick={() => handleResolveFate('shame')}
                      className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex flex-col items-center gap-1 transition-all shadow-lg active:scale-95"
                    >
                      <Feather className="w-4 h-4" />
                      SHAME & DISGRACE
                      <span className="text-[10px] font-normal opacity-80">-5 Level & max grudge</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setInBattle(false)}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all border border-slate-700 active:scale-95"
                >
                  Close Combat Engagement
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
