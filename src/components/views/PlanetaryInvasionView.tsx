import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Swords,
  Shield,
  Zap,
  Crosshair,
  Compass,
  ArrowRight,
  Sparkles,
  Flame,
  Radio,
  Building,
  Coins,
  Crown,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  RefreshCw,
  Activity,
  Bookmark,
  BookmarkCheck,
  Filter,
  Cpu,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources, PlayerProfile } from '../../types';
import {
  GalacticPlanet,
  ConqueredPlanetRecord,
  generateProceduralPlanet,
  INITIAL_CONQUERED_PLANETS,
  QUICK_JUMP_SECTORS,
  PlanetInfrastructure,
} from '../../galacticConquestData';

interface PlanetaryInvasionViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  profile?: PlayerProfile;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

type ConquestTab = 'browser' | 'combat' | 'sector_blitz' | 'dominion' | 'infrastructure';

export const PlanetaryInvasionView: React.FC<PlanetaryInvasionViewProps> = ({
  resources,
  onUpdateResources,
  profile,
  onUpdateProfile,
}) => {
  // Stored conquered planets (Map of ID -> ConqueredPlanetRecord)
  const [conqueredMap, setConqueredMap] = useState<Record<number, ConqueredPlanetRecord>>(() => {
    try {
      const saved = localStorage.getItem('uc_conquered_planets_999k');
      return saved ? JSON.parse(saved) : INITIAL_CONQUERED_PLANETS;
    } catch {
      return INITIAL_CONQUERED_PLANETS;
    }
  });

  // Stored Bookmarked Planets
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('uc_bookmarked_planets_999k');
      return saved ? JSON.parse(saved) : [1, 10, 2500, 50000];
    } catch {
      return [1, 10, 2500, 50000];
    }
  });

  // Active Selected Planet ID (1 to 999,999)
  const [currentPlanetId, setCurrentPlanetId] = useState<number>(10);
  const [dialInput, setDialInput] = useState<string>('10');
  const [activeTab, setActiveTab] = useState<ConquestTab>('browser');

  const [ogameCoord, setOgameCoord] = useState<{ universe: number; galaxy: number; system: number; slot: number }>({
    universe: 1,
    galaxy: 1,
    system: 1,
    slot: 10,
  });

  // Combat Inputs & Status
  const [deployedTroops, setDeployedTroops] = useState<string>('30000');
  const [tacticalFeedback, setTacticalFeedback] = useState<{
    type: 'success' | 'danger' | 'info';
    title: string;
    details: string;
  } | null>(null);

  // Softened defense multiplier for current planet session (from orbital strikes / infiltration)
  const [defenseDebuffPct, setDefenseDebuffPct] = useState<number>(0);

  // Sector Blitz Automated Conquest State
  const [blitzBatchSize, setBlitzBatchSize] = useState<number>(10);
  const [blitzRunning, setBlitzRunning] = useState<boolean>(false);
  const [blitzLogs, setBlitzLogs] = useState<string[]>([]);

  // Dominion Search & Filter State
  const [dominionSearch, setDominionSearch] = useState<string>('');
  const [dominionTaxFilter, setDominionTaxFilter] = useState<'all' | 'balanced' | 'extractive' | 'subsidized'>('all');

  // Save to localStorage when conqueredMap updates
  useEffect(() => {
    try {
      localStorage.setItem('uc_conquered_planets_999k', JSON.stringify(conqueredMap));
    } catch (e) {
      console.error('Failed to persist conquered planets:', e);
    }
  }, [conqueredMap]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('uc_bookmarked_planets_999k', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to persist bookmarks:', e);
    }
  }, [bookmarks]);

  // Procedurally generate active planet
  const activePlanet: GalacticPlanet = useMemo(() => {
    return generateProceduralPlanet(currentPlanetId);
  }, [currentPlanetId]);

  const isConquered = !!conqueredMap[activePlanet.id];
  const conqueredRecord = conqueredMap[activePlanet.id];
  const isBookmarked = bookmarks.includes(activePlanet.id);

  // Calculate system slots array (15 slots for the current system)
  const systemSlots = useMemo(() => {
    const baseSystemId = Math.floor((currentPlanetId - 1) / 15) * 15 + 1;
    return Array.from({ length: 15 }, (_, i) => {
      const pId = baseSystemId + i;
      const p = generateProceduralPlanet(pId);
      return {
        slotNumber: i + 1,
        planetId: pId,
        planet: p,
        isConquered: !!conqueredMap[pId],
      };
    });
  }, [currentPlanetId, conqueredMap]);

  // Calculate total empire statistics across all conquered worlds
  const empireStats = useMemo(() => {
    const conqueredList = Object.values(conqueredMap);
    let totalNaquadahRate = 0;
    let totalMetalRate = 0;
    let totalCrystalRate = 0;
    let totalDeuteriumRate = 0;
    let totalPendingNaquadah = 0;
    let totalPendingMetal = 0;
    let totalPendingCrystal = 0;
    let totalPendingDeuterium = 0;
    let totalPendingGlory = 0;

    conqueredList.forEach((c) => {
      const p = generateProceduralPlanet(c.id);
      const refineryMultiplier = 1 + (c.infrastructure.refineryLevel || 0) * 0.2;
      const tapMultiplier = 1 + (c.infrastructure.geothermalTapLevel || 0) * 0.15;
      const taxMultiplier = c.taxPolicy === 'extractive' ? 1.3 : c.taxPolicy === 'subsidized' ? 0.7 : 1.0;

      const nq = Math.round(p.yield.naquadahPerHour * refineryMultiplier * taxMultiplier);
      const met = Math.round(p.yield.metalPerHour * tapMultiplier * taxMultiplier);
      const cry = Math.round(p.yield.crystalPerHour * tapMultiplier * taxMultiplier);
      const deut = Math.round(p.yield.deuteriumPerHour * tapMultiplier * taxMultiplier);

      totalNaquadahRate += nq;
      totalMetalRate += met;
      totalCrystalRate += cry;
      totalDeuteriumRate += deut;

      totalPendingNaquadah += c.accumulatedTribute.naquadah;
      totalPendingMetal += c.accumulatedTribute.metal;
      totalPendingCrystal += c.accumulatedTribute.crystal;
      totalPendingDeuterium += c.accumulatedTribute.deuterium;
      totalPendingGlory += c.accumulatedTribute.glory;
    });

    return {
      count: conqueredList.length,
      totalNaquadahRate,
      totalMetalRate,
      totalCrystalRate,
      totalDeuteriumRate,
      totalPendingNaquadah,
      totalPendingMetal,
      totalPendingCrystal,
      totalPendingDeuterium,
      totalPendingGlory,
    };
  }, [conqueredMap]);

  // Jump to specific planet number
  const handleDialPlanet = (targetId: number) => {
    const validId = Math.max(1, Math.min(999999, Math.floor(targetId)));
    setCurrentPlanetId(validId);
    setDialInput(validId.toString());
    setDefenseDebuffPct(0);
    sound.play('click');
  };

  // Dial Stargate input submit
  const handleDialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(dialInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 999999) {
      handleDialPlanet(parsed);
      sound.play('stargate_dial');
    } else {
      sound.play('warning');
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: number) => {
    sound.play('click');
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Ground Assault Operation
  const handleGroundInvasion = () => {
    if (isConquered) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'info',
        title: 'Already Conquered',
        details: `${activePlanet.name} is already under your sovereign imperial dominion!`,
      });
      return;
    }

    const troops = parseInt(deployedTroops, 10);
    if (isNaN(troops) || troops <= 0) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Invalid Force Deployment',
        details: 'Specify a valid count of assault infantry battalions.',
      });
      return;
    }

    if (troops > resources.attackUnits) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Attack Infantry',
        details: `Requested ${troops.toLocaleString()} troops, but your empire only commands ${resources.attackUnits.toLocaleString()} attack units.`,
      });
      return;
    }

    if (resources.attackTurns < 10) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Stargate Turns',
        details: 'Ground planetary invasion requires at least 10 Stargate Attack Turns.',
      });
      return;
    }

    const effectiveDefense = Math.round(activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100));
    const playerInvasionPower = Math.round(troops * 1.85);

    if (playerInvasionPower >= effectiveDefense) {
      const casualtyPct = Math.max(0.04, Math.min(0.25, (effectiveDefense / playerInvasionPower) * 0.15));
      const casualties = Math.max(1, Math.round(troops * casualtyPct));

      sound.play('confirm');

      onUpdateResources({
        attackTurns: Math.max(0, resources.attackTurns - 10),
        attackUnits: Math.max(0, resources.attackUnits - casualties),
        naquadah: resources.naquadah + activePlanet.yield.plunderNaquadah,
        metal: (resources.metal || 0) + activePlanet.yield.plunderMetal,
        crystal: (resources.crystal || 0) + activePlanet.yield.plunderCrystal,
      });

      if (profile && onUpdateProfile) {
        onUpdateProfile({
          glory: (profile.glory || 0) + activePlanet.yield.gloryReward,
        });
      }

      const newRecord: ConqueredPlanetRecord = {
        id: activePlanet.id,
        conqueredTimestamp: Date.now(),
        customName: activePlanet.name,
        infrastructure: {
          refineryLevel: 1,
          shieldGridLevel: 1,
          garrisonCitadelLevel: 1,
          orbitalDrydockLevel: 0,
          geothermalTapLevel: 1,
          stargateNexusLevel: 1,
        },
        stationedGarrison: Math.round(troops * 0.2),
        taxPolicy: 'balanced',
        accumulatedTribute: {
          naquadah: Math.round(activePlanet.yield.naquadahPerHour * 2),
          metal: Math.round(activePlanet.yield.metalPerHour * 2),
          crystal: Math.round(activePlanet.yield.crystalPerHour * 2),
          deuterium: Math.round(activePlanet.yield.deuteriumPerHour * 2),
          glory: 15,
        },
        lastCollectedAt: Date.now(),
      };

      setConqueredMap((prev) => ({ ...prev, [activePlanet.id]: newRecord }));
      setDefenseDebuffPct(0);

      setTacticalFeedback({
        type: 'success',
        title: `VICTORY! ${activePlanet.name} HAS BEEN CONQUERED!`,
        details: `Your ground forces crushed the ${activePlanet.rulingFaction} garrison (${playerInvasionPower.toLocaleString()} vs ${effectiveDefense.toLocaleString()} Defense). Plundered ${activePlanet.yield.plunderNaquadah.toLocaleString()} NQ, ${activePlanet.yield.plunderMetal.toLocaleString()} Metal, ${activePlanet.yield.plunderCrystal.toLocaleString()} Crystal, and +${activePlanet.yield.gloryReward} Glory XP! Suffered ${casualties.toLocaleString()} heroic casualties.`,
      });
    } else {
      const casualties = Math.max(10, Math.round(troops * 0.35));
      sound.play('warning');

      onUpdateResources({
        attackTurns: Math.max(0, resources.attackTurns - 10),
        attackUnits: Math.max(0, resources.attackUnits - casualties),
      });

      setTacticalFeedback({
        type: 'danger',
        title: `INVASION FORCE REPUDIATED AT ${activePlanet.name}`,
        details: `The garrison commanded by ${activePlanet.garrison.commanderTitle} held the defensive line (${playerInvasionPower.toLocaleString()} assault power vs ${effectiveDefense.toLocaleString()} planetary armor). Lost ${casualties.toLocaleString()} assault units in the dropship landing corridor.`,
      });
    }
  };

  // Precision Orbital Bombardment
  const handleOrbitalBombardment = () => {
    if (isConquered) return;
    if (resources.attackTurns < 5) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Turns',
        details: 'Orbital bombardment barrage requires 5 Stargate Attack Turns.',
      });
      return;
    }

    if ((resources.deuterium || 0) < 5000) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Deuterium',
        details: 'Orbital heavy lance plasma barrage requires 5,000 Deuterium fuel.',
      });
      return;
    }

    sound.play('explosion');
    const debuffIncrease = 25;
    const newDebuff = Math.min(75, defenseDebuffPct + debuffIncrease);
    setDefenseDebuffPct(newDebuff);

    onUpdateResources({
      attackTurns: resources.attackTurns - 5,
      deuterium: Math.max(0, (resources.deuterium || 0) - 5000),
    });

    setTacticalFeedback({
      type: 'info',
      title: 'ORBITAL BARRAGE COMPLETE',
      details: `Heavy flagship lances bombarded ${activePlanet.name}'s surface shields. Enemy defensive fortification rating reduced by ${newDebuff}%!`,
    });
  };

  // Covert Infiltration Sabotage
  const handleCovertInfiltration = () => {
    if (isConquered) return;
    if (resources.attackTurns < 4) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Turns',
        details: 'Covert Stargate Infiltration requires 4 Attack Turns.',
      });
      return;
    }
    if (resources.naquadah < 25000) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Naquadah',
        details: 'Black-ops infiltration gear requires 25,000 Naquadah.',
      });
      return;
    }

    sound.play('warp_pulse');
    const debuffIncrease = 30;
    const newDebuff = Math.min(75, defenseDebuffPct + debuffIncrease);
    setDefenseDebuffPct(newDebuff);

    onUpdateResources({
      attackTurns: resources.attackTurns - 4,
      naquadah: resources.naquadah - 25000,
    });

    setTacticalFeedback({
      type: 'info',
      title: 'STARGATE INFILTRATION SUCCESSFUL',
      details: `Spec-ops cloaked operatives dialed ${activePlanet.name}'s Stargate and detonated the planetary shield sub-station! Total defense debuff now at ${newDebuff}%.`,
    });
  };

  // Diplomatic Annexation / Vassal Treaty
  const handleDiplomaticAnnex = () => {
    if (isConquered) return;
    const gloryCost = activePlanet.tier * 50;
    const naquadahCost = activePlanet.yield.plunderNaquadah * 2;

    if ((profile?.glory || 0) < gloryCost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Glory XP',
        details: `Diplomatic annexation of this ${activePlanet.tierLabel} world requires ${gloryCost} Glory XP.`,
      });
      return;
    }

    if (resources.naquadah < naquadahCost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Diplomatic Tribute',
        details: `Treaty gift requires ${naquadahCost.toLocaleString()} Naquadah.`,
      });
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      naquadah: resources.naquadah - naquadahCost,
    });

    if (profile && onUpdateProfile) {
      onUpdateProfile({
        glory: profile.glory - gloryCost,
      });
    }

    const newRecord: ConqueredPlanetRecord = {
      id: activePlanet.id,
      conqueredTimestamp: Date.now(),
      customName: `${activePlanet.name} (Vassal)`,
      infrastructure: {
        refineryLevel: 1,
        shieldGridLevel: 1,
        garrisonCitadelLevel: 1,
        orbitalDrydockLevel: 0,
        geothermalTapLevel: 1,
        stargateNexusLevel: 1,
      },
      stationedGarrison: 25000,
      taxPolicy: 'balanced',
      accumulatedTribute: {
        naquadah: Math.round(activePlanet.yield.naquadahPerHour),
        metal: Math.round(activePlanet.yield.metalPerHour),
        crystal: Math.round(activePlanet.yield.crystalPerHour),
        deuterium: Math.round(activePlanet.yield.deuteriumPerHour),
        glory: 20,
      },
      lastCollectedAt: Date.now(),
    };

    setConqueredMap((prev) => ({ ...prev, [activePlanet.id]: newRecord }));
    setTacticalFeedback({
      type: 'success',
      title: 'DIPLOMATIC ANNEXATION RATIFIED',
      details: `${activePlanet.name} peacefully signed an Imperial Protectorate Treaty and is now a sovereign colony in your dominion!`,
    });
  };

  // Peaceful OGame Colony Ship Expedition
  const handlePeacefulColonyExpedition = () => {
    if (isConquered) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'info',
        title: 'Already Colonized',
        details: `${activePlanet.name} is already an active colony world in your empire!`,
      });
      return;
    }

    const nqCost = 50000;
    const metalCost = 30000;
    const crystalCost = 20000;

    if (resources.naquadah < nqCost || (resources.metal || 0) < metalCost || (resources.crystal || 0) < crystalCost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Colony Expedition Resources',
        details: `Dispatching a Universe Civilization Colony Ship to ${activePlanet.name} requires ${nqCost.toLocaleString()} Naquadah, ${metalCost.toLocaleString()} Metal, and ${crystalCost.toLocaleString()} Crystal.`,
      });
      return;
    }

    if (resources.attackTurns < 2) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Colonization Turns',
        details: 'Dispatching a Universe Civilization Colony Ship requires at least 2 Turns.',
      });
      return;
    }

    sound.play('confirm');

    onUpdateResources({
      attackTurns: Math.max(0, resources.attackTurns - 2),
      naquadah: resources.naquadah - nqCost,
      metal: Math.max(0, (resources.metal || 0) - metalCost),
      crystal: Math.max(0, (resources.crystal || 0) - crystalCost),
    });

    if (profile && onUpdateProfile) {
      onUpdateProfile({
        glory: (profile.glory || 0) + 15,
      });
    }

    const newRecord: ConqueredPlanetRecord = {
      id: activePlanet.id,
      conqueredTimestamp: Date.now(),
      customName: `${activePlanet.name} (Colony)`,
      infrastructure: {
        refineryLevel: 1,
        shieldGridLevel: 1,
        garrisonCitadelLevel: 1,
        orbitalDrydockLevel: 1,
        geothermalTapLevel: 1,
        stargateNexusLevel: 1,
      },
      stationedGarrison: 15000,
      taxPolicy: 'balanced',
      accumulatedTribute: {
        naquadah: Math.round(activePlanet.yield.naquadahPerHour * 2),
        metal: Math.round(activePlanet.yield.metalPerHour * 2),
        crystal: Math.round(activePlanet.yield.crystalPerHour * 2),
        deuterium: Math.round(activePlanet.yield.deuteriumPerHour * 2),
        glory: 10,
      },
      lastCollectedAt: Date.now(),
    };

    setConqueredMap((prev) => ({ ...prev, [activePlanet.id]: newRecord }));

    setTacticalFeedback({
      type: 'success',
      title: `COLONY SHIP LANDED ON ${activePlanet.name}!`,
      details: `Your Universe Civilization Colony Ship established a new sovereign colonial settlement at ${activePlanet.coordinate}. Industrial refineries and defense shields are online!`,
    });
  };

  // Automated Sector Blitz Sweep Execution
  const handleExecuteSectorBlitz = () => {
    if (blitzRunning) return;
    setBlitzRunning(true);
    sound.play('stargate_engage');

    let currentTurnCount = resources.attackTurns;
    let currentTroopCount = resources.attackUnits;
    let totalPlunderedNq = 0;
    let totalPlunderedMet = 0;
    let totalPlunderedCry = 0;
    let totalCasualties = 0;
    let conqueredCount = 0;
    const logs: string[] = [];

    const newRecords: Record<number, ConqueredPlanetRecord> = {};
    const startId = currentPlanetId;

    for (let i = 0; i < blitzBatchSize; i++) {
      const targetId = startId + i;
      if (targetId > 999999) break;

      if (conqueredMap[targetId]) {
        logs.push(`• Planet #${targetId} already under sovereign control. Skipping.`);
        continue;
      }

      if (currentTurnCount < 10) {
        logs.push(`• OUT OF TURNS: Blitz paused at Planet #${targetId} due to turn depletion.`);
        break;
      }

      const planetObj = generateProceduralPlanet(targetId);
      const reqTroops = Math.round(planetObj.garrison.defenseRating / 1.5);

      if (currentTroopCount < reqTroops) {
        logs.push(`• FORCE TOO SMALL: Planet #${targetId} (${planetObj.name}) required ${reqTroops.toLocaleString()} troops, but only ${currentTroopCount.toLocaleString()} available. Blitz halted.`);
        break;
      }

      // Successful Invasion Simulation
      const casualtyCount = Math.round(reqTroops * 0.08);
      currentTurnCount -= 10;
      currentTroopCount -= casualtyCount;
      totalCasualties += casualtyCount;

      totalPlunderedNq += planetObj.yield.plunderNaquadah;
      totalPlunderedMet += planetObj.yield.plunderMetal;
      totalPlunderedCry += planetObj.yield.plunderCrystal;
      conqueredCount++;

      newRecords[targetId] = {
        id: targetId,
        conqueredTimestamp: Date.now(),
        customName: planetObj.name,
        infrastructure: {
          refineryLevel: 1,
          shieldGridLevel: 1,
          garrisonCitadelLevel: 1,
          orbitalDrydockLevel: 0,
          geothermalTapLevel: 1,
          stargateNexusLevel: 1,
        },
        stationedGarrison: 10000,
        taxPolicy: 'balanced',
        accumulatedTribute: {
          naquadah: Math.round(planetObj.yield.naquadahPerHour * 2),
          metal: Math.round(planetObj.yield.metalPerHour * 2),
          crystal: Math.round(planetObj.yield.crystalPerHour * 2),
          deuterium: Math.round(planetObj.yield.deuteriumPerHour * 2),
          glory: 15,
        },
        lastCollectedAt: Date.now(),
      };

      logs.push(`✔ CONQUERED Planet #${targetId} (${planetObj.name})! Plundered +${planetObj.yield.plunderNaquadah.toLocaleString()} NQ.`);
    }

    if (conqueredCount > 0) {
      sound.play('success');
      setConqueredMap((prev) => ({ ...prev, ...newRecords }));

      onUpdateResources({
        attackTurns: currentTurnCount,
        attackUnits: currentTroopCount,
        naquadah: resources.naquadah + totalPlunderedNq,
        metal: (resources.metal || 0) + totalPlunderedMet,
        crystal: (resources.crystal || 0) + totalPlunderedCry,
      });

      if (profile && onUpdateProfile) {
        onUpdateProfile({
          glory: (profile.glory || 0) + conqueredCount * 25,
        });
      }
    } else {
      sound.play('warning');
    }

    setBlitzLogs(logs);
    setBlitzRunning(false);
  };

  // Collect All Imperial Tribute
  const handleCollectAllTribute = () => {
    if (
      empireStats.totalPendingNaquadah === 0 &&
      empireStats.totalPendingMetal === 0 &&
      empireStats.totalPendingCrystal === 0
    ) {
      sound.play('warning');
      return;
    }

    sound.play('trade');
    onUpdateResources({
      naquadah: resources.naquadah + empireStats.totalPendingNaquadah,
      metal: (resources.metal || 0) + empireStats.totalPendingMetal,
      crystal: (resources.crystal || 0) + empireStats.totalPendingCrystal,
      deuterium: (resources.deuterium || 0) + empireStats.totalPendingDeuterium,
    });

    if (profile && onUpdateProfile && empireStats.totalPendingGlory > 0) {
      onUpdateProfile({
        glory: (profile.glory || 0) + empireStats.totalPendingGlory,
      });
    }

    setConqueredMap((prev) => {
      const updated: Record<number, ConqueredPlanetRecord> = {};
      Object.keys(prev).forEach((key) => {
        const numKey = Number(key);
        updated[numKey] = {
          ...prev[numKey],
          accumulatedTribute: {
            naquadah: 0,
            metal: 0,
            crystal: 0,
            deuterium: 0,
            glory: 0,
          },
          lastCollectedAt: Date.now(),
        };
      });
      return updated;
    });

    setTacticalFeedback({
      type: 'success',
      title: 'IMPERIAL TRIBUTE COLLECTED',
      details: `Collected +${empireStats.totalPendingNaquadah.toLocaleString()} NQ, +${empireStats.totalPendingMetal.toLocaleString()} Metal, +${empireStats.totalPendingCrystal.toLocaleString()} Crystal, and +${empireStats.totalPendingGlory} Glory XP from ${empireStats.count} conquered worlds!`,
    });
  };

  // Upgrade Infrastructure Building on Conquered Planet
  const handleUpgradeInfrastructure = (
    buildingKey: keyof PlanetInfrastructure,
    cost: number
  ) => {
    if (!conqueredRecord) return;
    if (resources.naquadah < cost) {
      sound.play('warning');
      setTacticalFeedback({
        type: 'danger',
        title: 'Insufficient Funds',
        details: `Upgrade requires ${cost.toLocaleString()} Naquadah.`,
      });
      return;
    }

    sound.play('research');
    onUpdateResources({ naquadah: resources.naquadah - cost });

    const currentLvl = conqueredRecord.infrastructure[buildingKey] || 0;
    setConqueredMap((prev) => ({
      ...prev,
      [activePlanet.id]: {
        ...prev[activePlanet.id],
        infrastructure: {
          ...prev[activePlanet.id].infrastructure,
          [buildingKey]: currentLvl + 1,
        },
      },
    }));

    setTacticalFeedback({
      type: 'success',
      title: 'INFRASTRUCTURE UPGRADED',
      details: `Successfully upgraded ${buildingKey} to Level ${currentLvl + 1} on ${activePlanet.name}.`,
    });
  };

  // Change Tax Policy
  const handleChangeTax = (policy: 'balanced' | 'extractive' | 'subsidized') => {
    if (!conqueredRecord) return;
    sound.play('click');
    setConqueredMap((prev) => ({
      ...prev,
      [activePlanet.id]: {
        ...prev[activePlanet.id],
        taxPolicy: policy,
      },
    }));
  };

  // Filter conquered worlds for Dominion tab
  const filteredConqueredWorlds = useMemo(() => {
    const list = Object.values(conqueredMap).map((c) => ({
      record: c,
      planet: generateProceduralPlanet(c.id),
    }));

    return list.filter((item) => {
      const matchesTax = dominionTaxFilter === 'all' || item.record.taxPolicy === dominionTaxFilter;
      const searchLower = dominionSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        item.planet.name.toLowerCase().includes(searchLower) ||
        item.planet.coordinate.toLowerCase().includes(searchLower) ||
        item.planet.biome.toLowerCase().includes(searchLower);
      return matchesTax && matchesSearch;
    });
  }, [conqueredMap, dominionTaxFilter, dominionSearch]);

  return (
    <div id="planetary-conquest-system-view" className="space-y-6">
      {/* Top Banner & Empire Statistics Bar */}
      <div className="border border-[#dedede] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4 mb-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[2px] uppercase mb-1 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              1 TO 999,999 PROCEDURAL PLANETARY CONQUEST UNIVERSE
            </div>
            <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
              Galactic Empire & Planetary Conquest Nexus
            </h1>
            <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed">
              Explore, dial, and conquer across all <strong>999,999 procedural celestial worlds</strong>.
              Launch precision orbital strikes, coordinate ground dropship invasions, construct planetary
              deflector grids, and collect continuous imperial tribute from your conquered dominions.
            </p>
          </div>

          {/* Quick Collect Tribute Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-[#888888] uppercase block font-semibold">
                Dominion Vault Yield
              </span>
              <span className="font-mono text-sm font-bold text-amber-600">
                +{empireStats.totalPendingNaquadah.toLocaleString()} NQ
              </span>
            </div>
            <button
              onClick={handleCollectAllTribute}
              disabled={empireStats.totalPendingNaquadah === 0}
              className="px-4 py-2.5 bg-[#111111] text-white hover:bg-amber-600 disabled:opacity-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              Collect All Tribute ({empireStats.count} Worlds)
            </button>
          </div>
        </div>

        {/* 4-Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Conquered Worlds
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-[#111111]">
                {empireStats.count.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#999999]">/ 999,999 Worlds</span>
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Naquadah Tribute Rate
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-amber-600">
                +{empireStats.totalNaquadahRate.toLocaleString()}/hr
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Metal & Crystal Tribute
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-blue-600">
                +{(empireStats.totalMetalRate + empireStats.totalCrystalRate).toLocaleString()}/hr
              </span>
              <Layers className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          <div className="p-3 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-1">
              Empire Attack Forces
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-emerald-600">
                {resources.attackUnits.toLocaleString()} Troops
              </span>
              <span className="text-[10px] text-[#666666]">{resources.attackTurns} Turns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#dedede] pb-2">
        <button
          onClick={() => { sound.play('click'); setActiveTab('browser'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'browser'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Compass className="w-4 h-4" />
          1. Stargate Dial & Orbital Browser (1-999,999)
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('combat'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'combat'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Swords className="w-4 h-4" />
          2. Ground Assault & Combat Station
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('sector_blitz'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'sector_blitz'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          3. Automated Sector Blitz (Mass Conquest)
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('dominion'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'dominion'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Crown className="w-4 h-4" />
          4. Imperial Dominion Registry ({empireStats.count})
        </button>

        <button
          onClick={() => { sound.play('click'); setActiveTab('infrastructure'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'infrastructure'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#555555] hover:bg-[#eeeeee] border border-[#dedede]'
          }`}
        >
          <Building className="w-4 h-4" />
          5. Planetary Infrastructure & Garrisons
        </button>
      </div>

      {/* Feedback Banner */}
      {tacticalFeedback && (
        <div
          className={`p-4 border text-xs flex items-start justify-between gap-3 shadow-sm ${
            tacticalFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 border-l-4'
              : tacticalFeedback.type === 'danger'
              ? 'bg-rose-50 border-rose-400 text-rose-950 border-l-4'
              : 'bg-blue-50 border-blue-400 text-blue-950 border-l-4'
          }`}
        >
          <div>
            <div className="font-bold uppercase tracking-wider mb-0.5">
              {tacticalFeedback.title}
            </div>
            <p className="leading-relaxed">{tacticalFeedback.details}</p>
          </div>
          <button
            onClick={() => setTacticalFeedback(null)}
            className="p-1 hover:bg-black/10 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===================== TAB 1: STARGATE DIAL & PLANETARY BROWSER ===================== */}
      {activeTab === 'browser' && (
        <div className="space-y-6">
          {/* Universe Civilization Coordinate Selector Grid */}
          <div className="p-4 bg-[#f6f8fa] border border-[#dedede] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#111]">
              <Globe className="w-4 h-4 text-cyan-600" />
              <span>Universe Civilization: Empire at War Coordinates Jump</span>
              <span className="text-[10px] text-[#777] font-normal">[Universe : Galaxy : System : Slot]</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono">
              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-[#ccc]">
                <span className="text-[10px] text-[#777] font-bold">UNI:</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={ogameCoord.universe}
                  onChange={(e) => {
                    const u = Math.max(1, Math.min(30, parseInt(e.target.value) || 1));
                    setOgameCoord((prev) => ({ ...prev, universe: u }));
                  }}
                  className="w-8 text-xs font-bold text-center border-none focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-[#ccc]">
                <span className="text-[10px] text-[#777] font-bold">GAL:</span>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={ogameCoord.galaxy}
                  onChange={(e) => {
                    const g = Math.max(1, Math.min(90, parseInt(e.target.value) || 1));
                    setOgameCoord((prev) => ({ ...prev, galaxy: g }));
                  }}
                  className="w-10 text-xs font-bold text-center border-none focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-[#ccc]">
                <span className="text-[10px] text-[#777] font-bold">SYS:</span>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={ogameCoord.system}
                  onChange={(e) => {
                    const s = Math.max(1, Math.min(999, parseInt(e.target.value) || 1));
                    setOgameCoord((prev) => ({ ...prev, system: s }));
                  }}
                  className="w-12 text-xs font-bold text-center border-none focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 bg-white px-2 py-1 border border-[#ccc]">
                <span className="text-[10px] text-[#777] font-bold">SLOT:</span>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={ogameCoord.slot}
                  onChange={(e) => {
                    const sl = Math.max(1, Math.min(15, parseInt(e.target.value) || 1));
                    setOgameCoord((prev) => ({ ...prev, slot: sl }));
                  }}
                  className="w-8 text-xs font-bold text-center border-none focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  const computedId = ((ogameCoord.system - 1) * 90 + (ogameCoord.galaxy - 1)) % 999999 + 1;
                  handleDialPlanet(computedId);
                }}
                className="px-3 py-1.5 bg-cyan-700 text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-cyan-800 cursor-pointer"
              >
                Jump Coordinate
              </button>
            </div>
          </div>

          {/* Stargate Dialing Bar */}
          <div className="border border-[#dedede] bg-white p-5">
            <div className="text-[10px] font-bold text-[#777777] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-600" />
              Subspace Stargate Coordinates Console (Input Planet # 1 to 999,999)
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDialPlanet(currentPlanetId - 1)}
                  disabled={currentPlanetId <= 1}
                  className="p-2 border border-[#dedede] hover:bg-[#f0f0f0] disabled:opacity-40 cursor-pointer"
                  title="Previous Planet"
                >
                  <ChevronLeft className="w-5 h-5 text-[#333333]" />
                </button>
                <button
                  onClick={() => handleDialPlanet(currentPlanetId + 1)}
                  disabled={currentPlanetId >= 999999}
                  className="p-2 border border-[#dedede] hover:bg-[#f0f0f0] disabled:opacity-40 cursor-pointer"
                  title="Next Planet"
                >
                  <ChevronRight className="w-5 h-5 text-[#333333]" />
                </button>
              </div>

              <form onSubmit={handleDialSubmit} className="flex-1 flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#888888]">
                    PLANET #
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={999999}
                    value={dialInput}
                    onChange={(e) => setDialInput(e.target.value)}
                    className="w-full pl-24 pr-4 py-2 border border-[#dedede] text-sm font-mono font-bold text-[#111111] focus:outline-none focus:border-[#111111]"
                    placeholder="Enter 1 - 999999"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] cursor-pointer"
                >
                  Dial Coordinate
                </button>
              </form>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const rnd = Math.floor(Math.random() * 999999) + 1;
                    handleDialPlanet(rnd);
                    sound.play('stargate_dial');
                  }}
                  className="px-3 py-2 bg-[#fafafa] border border-[#dedede] hover:bg-[#eee] text-xs font-bold text-[#333] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Random Scout
                </button>

                <button
                  onClick={() => handleToggleBookmark(activePlanet.id)}
                  className={`p-2 border border-[#dedede] text-xs font-bold cursor-pointer ${
                    isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-white text-[#555]'
                  }`}
                  title={isBookmarked ? 'Bookmarked' : 'Bookmark Planet'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Jumps Row */}
            <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] text-[#777777] font-bold uppercase mr-2">Sector Jumps:</span>
              {QUICK_JUMP_SECTORS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleDialPlanet(sec.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono border transition-colors cursor-pointer ${
                    currentPlanetId === sec.id
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#fcfcfc] text-[#555555] border-[#e2e2e2] hover:bg-[#f0f0f0]'
                  }`}
                >
                  #{sec.id.toLocaleString()} {sec.label.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* System Visual 15-Slot Matrix Grid */}
          <div className="border border-[#dedede] bg-white p-5">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3 mb-4 text-xs">
              <div className="font-bold uppercase tracking-wider text-[#111] flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>System Matrix: 15 Orbital Slots in Sector</span>
              </div>
              <span className="font-mono text-[#777]">
                Galaxy #{activePlanet.galaxyNumber} · System #{activePlanet.systemNumber}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-2 text-xs">
              {systemSlots.map((slot) => (
                <button
                  key={slot.planetId}
                  onClick={() => handleDialPlanet(slot.planetId)}
                  className={`p-2.5 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    slot.planetId === activePlanet.id
                      ? 'border-[#111111] bg-amber-50 ring-2 ring-[#111111]/20'
                      : slot.isConquered
                      ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50'
                      : 'border-[#e0e0e0] bg-[#fafafa] hover:bg-[#f0f0f0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[10px] text-[#777]">
                      SLOT {slot.slotNumber}
                    </span>
                    <span className="text-base">{slot.planet.biomeIcon}</span>
                  </div>

                  <div className="my-1.5">
                    <div className="font-bold text-[11px] text-[#111] truncate">
                      {slot.planet.name}
                    </div>
                    <div className="text-[9px] text-[#666] font-mono">
                      #{slot.planetId.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono border-t border-black/5 pt-1 mt-1">
                    <span className={slot.isConquered ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {slot.isConquered ? 'CONQUERED' : 'HOSTILE'}
                    </span>
                    <span className="text-rose-600 font-semibold">
                      {(slot.planet.garrison.defenseRating / 1000).toFixed(1)}k Def
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Planet Tactical Inspection Card */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-[#eeeeee] pb-6 mb-6">
              {/* Left Column: Visual & Header */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none border-2 border-[#111111] bg-gradient-to-br from-[#18181b] via-[#09090b] to-[#1e1b4b] flex flex-col items-center justify-center text-center p-2 shrink-0 shadow-md relative overflow-hidden">
                  <span className="text-3xl sm:text-4xl mb-1">{activePlanet.biomeIcon}</span>
                  <span className="text-[9px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                    {activePlanet.coordinate}
                  </span>
                  {isConquered && (
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-bold px-1 py-0.5">
                      CONQUERED
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold">
                      PLANET #{activePlanet.id.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      {activePlanet.tierLabel}
                    </span>
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: activePlanet.factionColor }}
                    >
                      {activePlanet.rulingFaction}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                    {activePlanet.name}
                  </h2>
                  <p className="text-xs text-[#666666] leading-relaxed max-w-xl">
                    {activePlanet.flavorLore}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
                {!isConquered ? (
                  <>
                    <button
                      onClick={handlePeacefulColonyExpedition}
                      className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      title="Establish a peaceful Universe Civilization Colony World using 50k NQ, 30k Metal, 20k Crystal & 2 Turns"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      🚀 Dispatch Colony Ship
                    </button>

                    <button
                      onClick={() => { sound.play('click'); setActiveTab('combat'); }}
                      className="px-4 py-2.5 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Swords className="w-4 h-4" />
                      Launch Invasion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { sound.play('click'); setActiveTab('infrastructure'); }}
                    className="px-5 py-3 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Building className="w-4 h-4" />
                    Manage Infrastructure
                  </button>
                )}
              </div>
            </div>

            {/* Planet Attributes & Garrison Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Planetary Biome & Environment
                </h3>
                <div className="flex justify-between text-[#555]">
                  <span>Classification:</span>
                  <b className="text-[#111]">{activePlanet.biome}</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Core Diameter:</span>
                  <b className="font-mono text-[#111]">{activePlanet.diameterKm.toLocaleString()} km</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Surface Temperature:</span>
                  <b className="font-mono text-[#111]">{activePlanet.temperatureCelsius}°C</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Surface Gravity:</span>
                  <b className="font-mono text-[#111]">{activePlanet.gravityG} G</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Building Grid Fields:</span>
                  <b className="font-mono text-[#111]">{activePlanet.surfaceFields} Fields</b>
                </div>
              </div>

              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  Garrison & Fortifications
                </h3>
                <div className="flex justify-between text-[#555]">
                  <span>Commander:</span>
                  <b className="text-[#111]">{activePlanet.garrison.commanderTitle}</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Defense Rating:</span>
                  <b className="font-mono text-rose-600 font-bold">
                    {Math.round(activePlanet.garrison.defenseRating * (1 - defenseDebuffPct / 100)).toLocaleString()} pts
                    {defenseDebuffPct > 0 && ` (-${defenseDebuffPct}%)`}
                  </b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Infantry Garrison:</span>
                  <b className="font-mono text-[#111]">{activePlanet.garrison.infantryTroops.toLocaleString()} troops</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Heavy Armor Tanks:</span>
                  <b className="font-mono text-[#111]">{activePlanet.garrison.heavyArmorVehicles.toLocaleString()} tanks</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Orbital Batteries:</span>
                  <b className="font-mono text-[#111]">{activePlanet.garrison.orbitalDefenseBatteries} cannons</b>
                </div>
              </div>

              <div className="p-4 bg-[#fafafa] border border-[#eeeeee] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#e5e5e5] pb-2 mb-2 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  Resource Extraction & Plunder
                </h3>
                <div className="flex justify-between text-[#555]">
                  <span>Naquadah Yield:</span>
                  <b className="font-mono text-amber-600">+{activePlanet.yield.naquadahPerHour.toLocaleString()}/hr</b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Metal & Crystal:</span>
                  <b className="font-mono text-[#111]">
                    +{activePlanet.yield.metalPerHour.toLocaleString()} / +{activePlanet.yield.crystalPerHour.toLocaleString()}/hr
                  </b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Plunder Potential:</span>
                  <b className="font-mono text-amber-700 font-bold">
                    {activePlanet.yield.plunderNaquadah.toLocaleString()} NQ
                  </b>
                </div>
                <div className="flex justify-between text-[#555]">
                  <span>Glory XP Reward:</span>
                  <b className="font-mono text-emerald-600">+{activePlanet.yield.gloryReward} XP</b>
                </div>
              </div>
            </div>

            {/* Strategic Traits */}
            <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
              <span className="text-[10px] font-bold text-[#777] uppercase tracking-wider block mb-2">
                Strategic Geological & Precursor Anomaly Traits:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {activePlanet.strategicTraits.map((trait, idx) => (
                  <div key={idx} className="p-3 bg-[#fcfcfc] border border-[#e5e5e5] flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#111]">{trait.name}</div>
                      <p className="text-[11px] text-[#666] mt-0.5">{trait.description}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono whitespace-nowrap shrink-0">
                      {trait.effectBonus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: COMBAT OPERATIONS & TACTICAL SUITE ===================== */}
      {activeTab === 'combat' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eee] pb-4 mb-6">
              <div>
                <div className="text-[9px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" />
                  Tactical Operations Suite
                </div>
                <h2 className="text-xl font-bold text-[#111111]">
                  Planetary Invasion Force Dispatch
                </h2>
              </div>
              <span className="px-3 py-1 bg-[#111111] text-white text-xs font-mono font-bold">
                TARGET: {activePlanet.name} [{activePlanet.coordinate}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Ground Dropship Assault */}
              <div className="p-5 border border-[#e0e0e0] bg-[#fafafa] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111] mb-2">
                    <Swords className="w-4 h-4 text-rose-600" />
                    <span>1. Ground Dropship Assault</span>
                  </div>
                  <p className="text-xs text-[#666] leading-relaxed">
                    Deploy active infantry units to breach planetary armor and dismantle defense garrisons.
                  </p>

                  <div className="mt-4 space-y-2 text-xs">
                    <label className="block text-[10px] font-bold uppercase text-[#555]">
                      Deploy Battalion Size (Available: {resources.attackUnits.toLocaleString()})
                    </label>
                    <input
                      type="number"
                      value={deployedTroops}
                      onChange={(e) => setDeployedTroops(e.target.value)}
                      className="w-full p-2 border border-[#ccc] font-mono text-xs font-bold text-[#111] bg-white"
                    />
                    <div className="text-[10px] text-[#777] flex justify-between font-mono">
                      <span>Invasion Cost: 10 Turns</span>
                      <span>Assault Power: ~{Math.round((parseInt(deployedTroops) || 0) * 1.85).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGroundInvasion}
                  disabled={isConquered}
                  className="w-full py-2.5 bg-[#dc2626] hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {isConquered ? 'Already Conquered' : 'Execute Ground Invasion'}
                </button>
              </div>

              {/* Option 2: Precision Orbital Bombardment */}
              <div className="p-5 border border-[#e0e0e0] bg-[#fafafa] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111] mb-2">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>2. Heavy Orbital Plasma Barrage</span>
                  </div>
                  <p className="text-xs text-[#666] leading-relaxed">
                    Fire heavy flagship plasma lances to weaken planetary shield grids before sending infantry.
                  </p>

                  <div className="mt-4 p-3 bg-white border border-[#eee] space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#666]">Turn Cost:</span>
                      <b className="text-[#111]">5 Turns</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">Deuterium Cost:</span>
                      <b className="text-[#111]">5,000 Deut</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">Shield Weakening:</span>
                      <b className="text-amber-600">-25% Defense Rating</b>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOrbitalBombardment}
                  disabled={isConquered || defenseDebuffPct >= 75}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  Fire Plasma Barrage (-25%)
                </button>
              </div>

              {/* Option 3: Diplomatic Annexation */}
              <div className="p-5 border border-[#e0e0e0] bg-[#fafafa] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111] mb-2">
                    <Crown className="w-4 h-4 text-blue-600" />
                    <span>3. Diplomatic Annexation Treaty</span>
                  </div>
                  <p className="text-xs text-[#666] leading-relaxed">
                    Annex world peacefully using Imperial Glory XP and Naquadah tribute gifts. Zero casualties.
                  </p>

                  <div className="mt-4 p-3 bg-white border border-[#eee] space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#666]">Glory Required:</span>
                      <b className="text-blue-600">{activePlanet.tier * 50} Glory XP</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">Tribute Gift:</span>
                      <b className="text-amber-600">{(activePlanet.yield.plunderNaquadah * 2).toLocaleString()} NQ</b>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDiplomaticAnnex}
                  disabled={isConquered}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  Ratify Protectorate Treaty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: AUTOMATED SECTOR BLITZ ===================== */}
      {activeTab === 'sector_blitz' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eee] pb-4 mb-6">
              <div>
                <div className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Automated Sector Conquest Engine
                </div>
                <h2 className="text-xl font-bold text-[#111111]">
                  Multi-World Automated Sector Blitz
                </h2>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold">
                BATCH SIZE: {blitzBatchSize} WORLDS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#fafafa] border border-[#dedede] space-y-3 text-xs md:col-span-1">
                <h3 className="font-bold text-[#111] uppercase tracking-wider border-b border-[#eee] pb-2">
                  Blitz Parameters
                </h3>

                <div>
                  <label className="block text-[10px] text-[#666] font-bold uppercase mb-1">
                    Start Planet ID:
                  </label>
                  <input
                    type="number"
                    value={currentPlanetId}
                    onChange={(e) => setCurrentPlanetId(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-[#ccc] font-mono font-bold text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#666] font-bold uppercase mb-1">
                    Batch Size (Planets to Conquer):
                  </label>
                  <div className="flex items-center gap-2">
                    {[5, 10, 25].map((size) => (
                      <button
                        key={size}
                        onClick={() => setBlitzBatchSize(size)}
                        className={`flex-1 py-1.5 font-mono text-xs font-bold border ${
                          blitzBatchSize === size
                            ? 'bg-[#111] text-white border-[#111]'
                            : 'bg-white text-[#333] border-[#ccc]'
                        }`}
                      >
                        {size} Worlds
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#eee] space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#666]">Available Troops:</span>
                    <b className="text-emerald-700">{resources.attackUnits.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Available Turns:</span>
                    <b className="text-[#111]">{resources.attackTurns} Turns</b>
                  </div>
                </div>

                <button
                  onClick={handleExecuteSectorBlitz}
                  disabled={blitzRunning || resources.attackTurns < 10 || resources.attackUnits < 5000}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap className="w-4 h-4 text-amber-200" />
                  Execute Sector Blitz
                </button>
              </div>

              {/* Blitz Output Log Window */}
              <div className="p-4 bg-[#111111] text-emerald-400 font-mono text-xs border border-[#333] md:col-span-2 h-72 overflow-y-auto space-y-1">
                <div className="text-[10px] text-[#888888] border-b border-[#333] pb-1 mb-2 font-bold uppercase">
                  AUTOMATED BLITZ EXECUTION CONSOLE LOG
                </div>
                {blitzLogs.length === 0 ? (
                  <div className="text-[#666666] italic py-8 text-center">
                    Click 'Execute Sector Blitz' to launch automated conquest across target sector range...
                  </div>
                ) : (
                  blitzLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: IMPERIAL DOMINION REGISTRY ===================== */}
      {activeTab === 'dominion' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eee] pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#111111]">
                  Imperial Dominion Registry ({empireStats.count} Conquered Worlds)
                </h2>
                <p className="text-xs text-[#666] mt-0.5">
                  View and manage all active colonies, vassal protectorates, and tribute vaults.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888]" />
                  <input
                    type="text"
                    value={dominionSearch}
                    onChange={(e) => setDominionSearch(e.target.value)}
                    placeholder="Search world name..."
                    className="pl-8 pr-3 py-1.5 border border-[#ccc] text-xs font-bold text-[#111] bg-white"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#f5f5f5] p-1 border border-[#ccc] text-xs font-bold">
                  {(['all', 'balanced', 'extractive', 'subsidized'] as const).map((policy) => (
                    <button
                      key={policy}
                      onClick={() => setDominionTaxFilter(policy)}
                      className={`px-2 py-1 uppercase text-[10px] cursor-pointer ${
                        dominionTaxFilter === policy ? 'bg-[#111] text-white' : 'text-[#666] hover:text-[#111]'
                      }`}
                    >
                      {policy}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conquered Worlds Table */}
            {filteredConqueredWorlds.length === 0 ? (
              <div className="p-8 text-center bg-[#fafafa] border border-[#eee] text-xs text-[#777]">
                No conquered worlds matching search filter. Dial Stargate coordinates to conquer new worlds!
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#eee]">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#f5f5f5] text-[#555] uppercase text-[10px] font-bold tracking-wider border-b border-[#eee]">
                    <tr>
                      <th className="p-3">World & ID</th>
                      <th className="p-3">Coordinate</th>
                      <th className="p-3">Biome</th>
                      <th className="p-3">Tax Policy</th>
                      <th className="p-3 text-right">Tribute Rate</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee]">
                    {filteredConqueredWorlds.map(({ record, planet }) => (
                      <tr key={record.id} className="hover:bg-[#fafafa]">
                        <td className="p-3 font-bold text-[#111]">
                          <div className="flex items-center gap-2">
                            <span>{planet.biomeIcon}</span>
                            <div>
                              <div>{record.customName || planet.name}</div>
                              <span className="text-[10px] font-mono text-[#888] font-normal">
                                Planet #{planet.id.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-[#444]">{planet.coordinate}</td>
                        <td className="p-3 text-[#666]">{planet.biome}</td>
                        <td className="p-3">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 bg-[#eee] text-[#333]">
                            {record.taxPolicy}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-amber-600">
                          +{planet.yield.naquadahPerHour.toLocaleString()}/hr
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDialPlanet(planet.id)}
                            className="px-2.5 py-1 bg-[#111] text-white text-[10px] uppercase font-bold hover:bg-[#333] cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: PLANETARY INFRASTRUCTURE ===================== */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#eee] pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#111111]">
                  Infrastructure & Tax Governance
                </h2>
                <p className="text-xs text-[#666] mt-0.5">
                  Active Planet: <strong>{activePlanet.name}</strong> [{activePlanet.coordinate}]
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold">
                {isConquered ? 'SOVEREIGN COLONY' : 'UNCONQUERED WORLD'}
              </span>
            </div>

            {!isConquered ? (
              <div className="p-8 text-center bg-[#fafafa] border border-[#eee] text-xs text-[#777] space-y-3">
                <p>This world has not been conquered yet. Conquer this world first to construct infrastructure!</p>
                <button
                  onClick={() => setActiveTab('combat')}
                  className="px-4 py-2 bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Go To Combat Operations
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tax Directive Controls */}
                <div className="p-4 bg-[#fafafa] border border-[#eee] text-xs space-y-2">
                  <span className="font-bold uppercase text-[#111] block">
                    Select Colonial Tax Policy Directive:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {(['balanced', 'extractive', 'subsidized'] as const).map((pol) => (
                      <button
                        key={pol}
                        onClick={() => handleChangeTax(pol)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                          conqueredRecord?.taxPolicy === pol
                            ? 'bg-[#111] text-white border-[#111]'
                            : 'bg-white text-[#555] border-[#ccc] hover:bg-[#eee]'
                        }`}
                      >
                        {pol} {pol === 'extractive' ? '(+30% Tribute)' : pol === 'subsidized' ? '(-30% Maint)' : '(Standard)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Building Upgrades Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  {[
                    { key: 'refineryLevel' as const, name: 'Naquadah Industrial Refinery', desc: '+20% Naquadah Tribute Rate' },
                    { key: 'shieldGridLevel' as const, name: 'Planetary Shield Grid', desc: '+25% Defensive Armor HP' },
                    { key: 'geothermalTapLevel' as const, name: 'Geothermal Ore Tap', desc: '+15% Metal & Crystal Extraction' },
                    { key: 'stargateNexusLevel' as const, name: 'Stargate Terminal Nexus', desc: '+10% Glory XP Yield' },
                    { key: 'garrisonCitadelLevel' as const, name: 'Garrison Citadel Bunkers', desc: '+15% Stationed Garrison Capacity' },
                    { key: 'orbitalDrydockLevel' as const, name: 'Orbital Fleet Drydock', desc: '+10% Shipyard Construction Speed' },
                  ].map((b) => {
                    const currentLevel = conqueredRecord?.infrastructure[b.key] || 0;
                    const upgradeCost = Math.round(15000 * Math.pow(1.4, currentLevel));

                    return (
                      <div key={b.key} className="p-4 bg-[#fafafa] border border-[#eee] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between font-bold text-[#111]">
                            <span>{b.name}</span>
                            <span className="font-mono text-amber-600">Lvl {currentLevel}</span>
                          </div>
                          <p className="text-[11px] text-[#666] mt-1">{b.desc}</p>
                        </div>

                        <div className="pt-2 border-t border-[#eee] flex items-center justify-between font-mono text-[11px]">
                          <span className="text-[#666]">Cost: {upgradeCost.toLocaleString()} NQ</span>
                          <button
                            onClick={() => handleUpgradeInfrastructure(b.key, upgradeCost)}
                            className="px-2.5 py-1 bg-[#111] hover:bg-[#333] text-white text-[10px] uppercase font-bold cursor-pointer"
                          >
                            Upgrade
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
