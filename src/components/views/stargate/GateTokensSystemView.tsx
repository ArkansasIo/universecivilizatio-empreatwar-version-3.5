import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  ChevronRight,
  Crosshair,
  Compass,
  ArrowUpRight,
  History,
  Coins,
  Cpu,
  RefreshCw,
  Gift,
  Layers,
  Skull,
  Atom,
} from 'lucide-react';
import { sound } from '../../../sound';
import { PlayerResources, PlayerProfile } from '../../../types';
import {
  GATE_TOKENS_CATALOG,
  GateTokenType,
  DIMENSIONAL_ANOMALIES,
  DimensionalAnomaly,
  STARGATE_RAIDS,
  StargateRaidTarget,
  GATE_EXPLORATION_MISSIONS,
  GateExplorationMission,
  TOKEN_SYNTHESIS_RECIPES,
  TokenSynthesisRecipe,
} from '../../../gateTokensData';

interface GateTokensSystemViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  profile?: PlayerProfile;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

type TabType = 'anomalies' | 'raids' | 'explorations' | 'synthesizer' | 'history';

interface ActiveOperation {
  id: string;
  title: string;
  type: 'anomaly' | 'raid' | 'exploration';
  progress: number;
  totalDurationMs: number;
  remainingMs: number;
  phaseText: string;
  rewardPayload: any;
}

interface OperationHistoryLog {
  id: string;
  timestamp: string;
  title: string;
  type: 'anomaly' | 'raid' | 'exploration' | 'synthesis' | 'requisition';
  tokensUsedOrGained: string;
  outcomeText: string;
  spoilsSummary: string;
}

export const GateTokensSystemView: React.FC<GateTokensSystemViewProps> = ({
  resources,
  onUpdateResources,
  profile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('anomalies');
  const [activeOperation, setActiveOperation] = useState<ActiveOperation | null>(null);
  const [lastRequisitionClaim, setLastRequisitionClaim] = useState<number>(() => {
    const saved = localStorage.getItem('uc_last_token_requisition');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [feedback, setFeedback] = useState<string | null>(
    'Gate Tokens System online. Consumable Alpha, Delta, and Omega transit keys ready for dimensional operations.'
  );

  // Dynamic Raid Boss State for active engagements
  const [raidBosses, setRaidBosses] = useState<Record<string, { currentHp: number; currentShield: number; defeated: boolean }>>(() => {
    const init: Record<string, { currentHp: number; currentShield: number; defeated: boolean }> = {};
    STARGATE_RAIDS.forEach((r) => {
      init[r.id] = { currentHp: r.bossHp, currentShield: r.bossShield, defeated: false };
    });
    return init;
  });

  const [historyLogs, setHistoryLogs] = useState<OperationHistoryLog[]>(() => {
    return [
      {
        id: 'hist-init-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString(),
        title: 'Quantum Slipstream Telemetry Sync',
        type: 'anomaly',
        tokensUsedOrGained: '-1 Delta Token',
        outcomeText: 'Stabilized event horizon anomaly. Extracted 95k Naquadah and Tachyon Shards.',
        spoilsSummary: '+95,000 Naquadah, +140 Dark Matter, +45 Glory',
      },
      {
        id: 'hist-init-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString(),
        title: 'SGC Shift Requisition Drop',
        type: 'requisition',
        tokensUsedOrGained: '+5 Alpha, +3 Delta, +1 Omega',
        outcomeText: 'Received standard military gate token allowance from Stargate Command.',
        spoilsSummary: 'Inventory replenishments distributed.',
      },
    ];
  });

  const alphaCount = resources.gateTokens ?? 25;
  const deltaCount = resources.dimensionalTokens ?? 12;
  const omegaCount = resources.raidTokens ?? 6;

  // Check requisition cooldown (allow once per 20 minutes for testing/gameplay ease)
  const REQUISITION_COOLDOWN_MS = 20 * 60 * 1000;
  const timeSinceClaim = Date.now() - lastRequisitionClaim;
  const canClaimRequisition = timeSinceClaim >= REQUISITION_COOLDOWN_MS;
  const cooldownRemainingSec = Math.max(0, Math.ceil((REQUISITION_COOLDOWN_MS - timeSinceClaim) / 1000));

  const resourcesRef = useRef(resources);
  resourcesRef.current = resources;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const activeOpRef = useRef<ActiveOperation | null>(null);
  activeOpRef.current = activeOperation;

  const completeOperation = (op: ActiveOperation) => {
    const p = op.rewardPayload;
    if (!p) return;

    const currentRes = resourcesRef.current;
    const currentProf = profileRef.current;

    // Apply resources
    const resourceDelta: Partial<PlayerResources> = {};
    if (p.naquadah) resourceDelta.naquadah = (currentRes.naquadah ?? 0) + p.naquadah;
    if (p.crystal) resourceDelta.crystal = (currentRes.crystal ?? 0) + p.crystal;
    if (p.deuterium) resourceDelta.deuterium = (currentRes.deuterium ?? 0) + p.deuterium;
    if (p.credits) resourceDelta.credits = (currentRes.credits ?? 0) + p.credits;
    if (p.darkMatter) resourceDelta.darkMatter = (currentRes.darkMatter ?? 0) + p.darkMatter;
    if (p.conscripts) resourceDelta.untrainedUnits = (currentRes.untrainedUnits ?? 0) + p.conscripts;

    onUpdateResources(resourceDelta);

    if (p.glory && currentProf && onUpdateProfile) {
      onUpdateProfile({ glory: (currentProf.glory ?? 0) + p.glory });
    }

    const logEntry: OperationHistoryLog = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      title: op.title,
      type: op.type,
      tokensUsedOrGained: p.tokensUsedSummary || 'Tokens Consumed',
      outcomeText: p.victoryText || 'Mission succeeded with maximum extraction efficiency.',
      spoilsSummary: p.summaryText || 'Spoils added to sovereign reserves.',
    };

    setHistoryLogs((prev) => [logEntry, ...prev.slice(0, 19)]);
    setFeedback(`Success! ${op.title} completed! Spoils of war secured: ${p.summaryText}`);
  };

  const completeOpRef = useRef(completeOperation);
  completeOpRef.current = completeOperation;

  // Active operation ticker
  useEffect(() => {
    if (!activeOperation) return;

    const interval = setInterval(() => {
      const current = activeOpRef.current;
      if (!current) {
        clearInterval(interval);
        return;
      }

      const newRemaining = Math.max(0, current.remainingMs - 200);
      const progress = Math.min(100, Math.round(((current.totalDurationMs - newRemaining) / current.totalDurationMs) * 100));

      if (newRemaining <= 0) {
        clearInterval(interval);
        setActiveOperation(null);
        sound.play('success');
        completeOpRef.current(current);
        return;
      }

      let phase = current.phaseText;
      if (progress < 30) {
        phase = 'Wormhole dialed. Quantum beacon stabilizing event horizon...';
      } else if (progress < 70) {
        phase = 'MALP telemetry confirmed. Strike wings & science teams engaged in target zone...';
      } else if (progress < 99) {
        phase = 'Extracting primary relics and returning through Stargate iris...';
      }

      setActiveOperation({
        ...current,
        remainingMs: newRemaining,
        progress,
        phaseText: phase,
      });
    }, 200);

    return () => clearInterval(interval);
  }, [activeOperation?.id]);

  // 1. Claim Daily / Shift Requisition
  const handleClaimRequisition = () => {
    if (!canClaimRequisition) return;
    sound.play('confirm');

    const newAlpha = alphaCount + 5;
    const newDelta = deltaCount + 3;
    const newOmega = omegaCount + 1;

    onUpdateResources({
      gateTokens: newAlpha,
      dimensionalTokens: newDelta,
      raidTokens: newOmega,
    });

    const now = Date.now();
    setLastRequisitionClaim(now);
    localStorage.setItem('uc_last_token_requisition', String(now));

    const log: OperationHistoryLog = {
      id: `hist-req-${now}`,
      timestamp: new Date().toLocaleTimeString(),
      title: 'Stargate Command Token Requisition Allowance',
      type: 'requisition',
      tokensUsedOrGained: '+5 Alpha, +3 Delta, +1 Omega',
      outcomeText: 'Quartermaster dispatched standard military gate tokens to fleet inventory.',
      spoilsSummary: '+5 Alpha Tokens, +3 Delta Tokens, +1 Omega Beacon',
    };
    setHistoryLogs((prev) => [log, ...prev]);
    setFeedback('Requisition granted: Received +5 Alpha Tokens, +3 Delta Tokens, and +1 Omega Raid Beacon!');
  };

  // 2. Breach Dimensional Anomaly
  const handleBreachAnomaly = (anomaly: DimensionalAnomaly) => {
    if (activeOperation) {
      setFeedback('A gate operation is already in progress. Wait for event horizon clearance.');
      return;
    }

    if (deltaCount < anomaly.tokenCost.amount) {
      sound.play('warning');
      setFeedback(`Insufficient Delta Dimensional Tokens! Requires ${anomaly.tokenCost.amount}x Delta Tokens. Synthesize more in the Foundry.`);
      return;
    }

    // Deduct consumable tokens
    sound.play('stargate_lock');
    onUpdateResources({
      dimensionalTokens: deltaCount - anomaly.tokenCost.amount,
    });

    const durationMs = anomaly.durationSeconds * 1000;
    const loot = anomaly.lootEstimates;

    setActiveOperation({
      id: anomaly.id,
      title: anomaly.name,
      type: 'anomaly',
      progress: 0,
      totalDurationMs: durationMs,
      remainingMs: durationMs,
      phaseText: `Breaching ${anomaly.dimensionName} via 8-chevron coordinate lock...`,
      rewardPayload: {
        naquadah: loot.naquadah,
        crystal: loot.crystal,
        darkMatter: loot.darkMatter,
        credits: loot.credits,
        glory: loot.glory,
        tokensUsedSummary: `-${anomaly.tokenCost.amount} Delta Token(s)`,
        victoryText: `Anomalous boundary pierced! Scientific telemetry recovered: ${loot.possibleArtifact}`,
        summaryText: `+${loot.naquadah.toLocaleString()} Naq, +${loot.crystal.toLocaleString()} Crystal, +${loot.darkMatter} Dark Matter, +${loot.credits.toLocaleString()} GC, +${loot.glory} Glory`,
      },
    });

    setFeedback(`Wormhole established to ${anomaly.name}! Consumed ${anomaly.tokenCost.amount}x Delta Token(s). Extracting data...`);
  };

  // 3. Initiate Stargate Raid
  const handleInitiateRaid = (raid: StargateRaidTarget) => {
    if (activeOperation) {
      setFeedback('A gate operation is already in progress. Wait for event horizon clearance.');
      return;
    }

    if (omegaCount < raid.tokenCost.amount) {
      sound.play('warning');
      setFeedback(`Insufficient Omega Raid Beacons! Requires ${raid.tokenCost.amount}x Omega Beacons. Forge them in the Token Synthesizer.`);
      return;
    }

    sound.play('combat');
    // Deduct consumable tokens
    onUpdateResources({
      raidTokens: omegaCount - raid.tokenCost.amount,
    });

    // Simulate multi-volley boss raid
    const currentBoss = raidBosses[raid.id] || { currentHp: raid.bossHp, currentShield: raid.bossShield, defeated: false };
    const durationMs = 6000; // 6 seconds

    setActiveOperation({
      id: raid.id,
      title: `${raid.name} - Fleet Assault`,
      type: 'raid',
      progress: 0,
      totalDurationMs: durationMs,
      remainingMs: durationMs,
      phaseText: `Engaging ${raid.title}. Plasma fire directed at ${raid.tacticalVulnerability}...`,
      rewardPayload: {
        naquadah: raid.grandLoot.naquadah,
        crystal: raid.grandLoot.crystal,
        deuterium: raid.grandLoot.deuterium,
        credits: raid.grandLoot.credits,
        darkMatter: raid.grandLoot.darkMatter,
        glory: raid.grandLoot.gloryPoints,
        conscripts: raid.grandLoot.bonusUnits,
        tokensUsedSummary: `-${raid.tokenCost.amount} Omega Beacon(s)`,
        victoryText: `Raid Victory Achieved! ${raid.title} defeated. Relic secured: ${raid.grandLoot.exclusiveRelic}`,
        summaryText: `+${raid.grandLoot.naquadah.toLocaleString()} Naq, +${raid.grandLoot.crystal.toLocaleString()} Crystal, +${raid.grandLoot.credits.toLocaleString()} GC, +${raid.grandLoot.darkMatter} Dark Matter, +${raid.grandLoot.gloryPoints} Glory, +${raid.grandLoot.bonusUnits} Recruits`,
      },
    });

    // Mark boss defeated
    setRaidBosses((prev) => ({
      ...prev,
      [raid.id]: { currentHp: 0, currentShield: 0, defeated: true },
    }));

    setFeedback(`Omega Beacon deployed! Armadas breaching ${raid.name}. Consumed ${raid.tokenCost.amount}x Omega Beacon(s).`);
  };

  // 4. Launch Deep Exploration
  const handleLaunchExploration = (mission: GateExplorationMission) => {
    if (activeOperation) {
      setFeedback('A gate operation is already in progress. Wait for event horizon clearance.');
      return;
    }

    if (alphaCount < mission.tokenCost.amount) {
      sound.play('warning');
      setFeedback(`Insufficient Alpha Exploration Tokens! Requires ${mission.tokenCost.amount}x Alpha Tokens. Claim daily drop or synthesize.`);
      return;
    }

    sound.play('stargate_engage');
    onUpdateResources({
      gateTokens: alphaCount - mission.tokenCost.amount,
    });

    const durationMs = mission.durationSeconds * 1000;
    const loot = mission.lootEstimates;

    setActiveOperation({
      id: mission.id,
      title: mission.name,
      type: 'exploration',
      progress: 0,
      totalDurationMs: durationMs,
      remainingMs: durationMs,
      phaseText: `SG Team passing through event horizon toward ${mission.sectorCoordinates}...`,
      rewardPayload: {
        naquadah: loot.naquadah,
        crystal: loot.crystal,
        deuterium: loot.deuterium,
        credits: loot.credits,
        conscripts: loot.conscripts,
        glory: loot.glory,
        tokensUsedSummary: `-${mission.tokenCost.amount} Alpha Token(s)`,
        victoryText: `Survey teams completed field analysis: ${mission.primaryDiscovery}`,
        summaryText: `+${loot.naquadah.toLocaleString()} Naq, +${loot.crystal.toLocaleString()} Crystal, +${loot.deuterium.toLocaleString()} Deut, +${loot.credits.toLocaleString()} GC, +${loot.glory} Glory, +${loot.conscripts} Conscripts`,
      },
    });

    setFeedback(`SG Team deployed to ${mission.name}! Consumed ${mission.tokenCost.amount}x Alpha Token(s).`);
  };

  // 5. Synthesize Tokens via Foundry
  const handleSynthesizeToken = (recipe: TokenSynthesisRecipe) => {
    const c = recipe.costs;

    if ((resources.naquadah ?? 0) < c.naquadah) {
      sound.play('warning');
      setFeedback(`Synthesis halted: Insufficient Naquadah! Requires ${c.naquadah.toLocaleString()} Naquadah.`);
      return;
    }
    if ((resources.crystal ?? 0) < c.crystal) {
      sound.play('warning');
      setFeedback(`Synthesis halted: Insufficient Crystal! Requires ${c.crystal.toLocaleString()} Crystal.`);
      return;
    }
    if ((resources.deuterium ?? 0) < c.deuterium) {
      sound.play('warning');
      setFeedback(`Synthesis halted: Insufficient Deuterium! Requires ${c.deuterium.toLocaleString()} Deuterium.`);
      return;
    }
    if ((resources.credits ?? 0) < c.credits) {
      sound.play('warning');
      setFeedback(`Synthesis halted: Insufficient Credits! Requires ${c.credits.toLocaleString()} GC.`);
      return;
    }
    if (c.darkMatter && (resources.darkMatter ?? 0) < c.darkMatter) {
      sound.play('warning');
      setFeedback(`Synthesis halted: Insufficient Dark Matter! Requires ${c.darkMatter} Dark Matter.`);
      return;
    }

    sound.play('confirm');

    // Deduct materials
    const updates: Partial<PlayerResources> = {
      naquadah: (resources.naquadah ?? 0) - c.naquadah,
      crystal: (resources.crystal ?? 0) - c.crystal,
      deuterium: (resources.deuterium ?? 0) - c.deuterium,
      credits: (resources.credits ?? 0) - c.credits,
    };
    if (c.darkMatter) {
      updates.darkMatter = (resources.darkMatter ?? 0) - c.darkMatter;
    }

    // Add synthesized token
    if (recipe.targetToken === 'alpha') {
      updates.gateTokens = alphaCount + recipe.outputAmount;
    } else if (recipe.targetToken === 'delta') {
      updates.dimensionalTokens = deltaCount + recipe.outputAmount;
    } else if (recipe.targetToken === 'omega') {
      updates.raidTokens = omegaCount + recipe.outputAmount;
    }

    onUpdateResources(updates);

    const log: OperationHistoryLog = {
      id: `hist-synth-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      title: `Fabricated ${recipe.tokenName}`,
      type: 'synthesis',
      tokensUsedOrGained: `+${recipe.outputAmount} ${recipe.tokenName}`,
      outcomeText: recipe.description,
      spoilsSummary: `-${c.naquadah.toLocaleString()} Naq, -${c.crystal.toLocaleString()} Cryst, -${c.credits.toLocaleString()} GC`,
    };
    setHistoryLogs((prev) => [log, ...prev]);
    setFeedback(`Fabrication complete! Synthesized +${recipe.outputAmount}x ${recipe.tokenName}.`);
  };

  // 6. Direct Credit Buy for Tokens
  const handleBuyWithCredits = (type: GateTokenType) => {
    const def = GATE_TOKENS_CATALOG[type];
    const cost = def.baseExchangeCreditCost;

    if ((resources.credits ?? 0) < cost) {
      sound.play('warning');
      setFeedback(`Insufficient Galactic Credits! Need ${cost.toLocaleString()} GC for 1x ${def.name}.`);
      return;
    }

    sound.play('trade');
    const updates: Partial<PlayerResources> = {
      credits: (resources.credits ?? 0) - cost,
    };

    if (type === 'alpha') updates.gateTokens = alphaCount + 1;
    if (type === 'delta') updates.dimensionalTokens = deltaCount + 1;
    if (type === 'omega') updates.raidTokens = omegaCount + 1;

    onUpdateResources(updates);

    setFeedback(`Acquired 1x ${def.name} via Galactic Guild Exchange for ${cost.toLocaleString()} GC.`);
  };

  return (
    <div id="gate-tokens-system-view" className="space-y-6">
      {/* 1. TOP STRATEGIC HERO HEADER */}
      <div className="border border-[#dedede] bg-white p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-amber-700 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>STABILITY MATRIX & CONSUMABLE ACCESS TOKENS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
              <span>Gate Tokens & Dimensional Systems</span>
              <span className="text-xs px-2.5 py-0.5 font-mono uppercase font-bold border border-cyan-400 bg-cyan-50 text-cyan-900">
                v3.5 SGC Protocol
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Consumable transit tokens calibrate Stargate chevron harmonics. Spend <strong className="text-emerald-700">Alpha Tokens</strong> on deep void expeditions, <strong className="text-cyan-700">Delta Tokens</strong> to breach dimensional anomalies, and <strong className="text-purple-700">Omega Beacons</strong> to lead fleet raids against System Lord fortresses.
            </p>
          </div>

          {/* TOKEN BALANCE VAULT TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono shrink-0">
            {/* Alpha Tokens */}
            <div className="p-3.5 bg-gradient-to-b from-emerald-50/90 to-white border border-emerald-300 ring-1 ring-emerald-500/20 flex flex-col justify-between min-w-[150px]">
              <div className="flex items-center justify-between text-[10px] text-emerald-950 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-xs bg-emerald-600 text-white flex items-center justify-center text-[10px]">ᐰ</span>
                  <span>Alpha Tokens</span>
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">EXP</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-950 tracking-tight">{alphaCount}</span>
                <button
                  onClick={() => handleBuyWithCredits('alpha')}
                  title="Buy 1x Alpha Token for 45,000 GC"
                  className="text-[9px] px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white uppercase font-bold transition-colors cursor-pointer"
                >
                  +45k GC
                </button>
              </div>
              <span className="text-[8.5px] text-emerald-800/80 mt-1">Deep Void Recon & Surveying</span>
            </div>

            {/* Delta Tokens */}
            <div className="p-3.5 bg-gradient-to-b from-cyan-50/90 to-white border border-cyan-300 ring-1 ring-cyan-500/20 flex flex-col justify-between min-w-[150px]">
              <div className="flex items-center justify-between text-[10px] text-cyan-950 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-xs bg-cyan-600 text-white flex items-center justify-center text-[10px]">𐎡</span>
                  <span>Delta Tokens</span>
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-cyan-100 border border-cyan-300 text-cyan-800 font-bold">ANOM</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-cyan-950 tracking-tight">{deltaCount}</span>
                <button
                  onClick={() => handleBuyWithCredits('delta')}
                  title="Buy 1x Delta Token for 85,000 GC"
                  className="text-[9px] px-2 py-0.5 bg-cyan-700 hover:bg-cyan-800 text-white uppercase font-bold transition-colors cursor-pointer"
                >
                  +85k GC
                </button>
              </div>
              <span className="text-[8.5px] text-cyan-800/80 mt-1">Dimensional & Quantum Rifts</span>
            </div>

            {/* Omega Tokens */}
            <div className="p-3.5 bg-gradient-to-b from-purple-50/90 to-white border border-purple-300 ring-1 ring-purple-500/20 flex flex-col justify-between min-w-[150px]">
              <div className="flex items-center justify-between text-[10px] text-purple-950 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-xs bg-purple-700 text-white flex items-center justify-center text-[10px]">Ω</span>
                  <span>Omega Beacons</span>
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-purple-100 border border-purple-300 text-purple-800 font-bold">RAID</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-purple-950 tracking-tight">{omegaCount}</span>
                <button
                  onClick={() => handleBuyWithCredits('omega')}
                  title="Buy 1x Omega Beacon for 175,000 GC"
                  className="text-[9px] px-2 py-0.5 bg-purple-700 hover:bg-purple-800 text-white uppercase font-bold transition-colors cursor-pointer"
                >
                  +175k GC
                </button>
              </div>
              <span className="text-[8.5px] text-purple-800/80 mt-1">System Lord & Supergate Raids</span>
            </div>
          </div>
        </div>

        {/* Quick Action Requisition Strip */}
        <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-600">
            <Gift className="w-4 h-4 text-amber-600" />
            <span>SGC Requisition Allowance:</span>
            <strong className="text-neutral-900">+5 Alpha, +3 Delta, +1 Omega free per operational shift.</strong>
          </div>
          <button
            onClick={handleClaimRequisition}
            disabled={!canClaimRequisition}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              canClaimRequisition
                ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 ring-1 ring-amber-400'
                : 'bg-neutral-100 text-neutral-400 border border-neutral-300 cursor-not-allowed'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{canClaimRequisition ? 'Claim Free Token Allowance' : `Cooldown Active (${cooldownRemainingSec}s)`}</span>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE OPERATION STATUS MONITOR (IF ENGAGED) */}
      {activeOperation && (
        <div className="p-5 bg-[#111111] text-white border-2 border-cyan-400 shadow-xl space-y-3 font-mono animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs uppercase font-black tracking-widest text-cyan-300">
                TRANSIT ACTIVE: {activeOperation.title}
              </span>
            </div>
            <div className="text-xs text-neutral-300">
              ETA: <strong className="text-cyan-300 font-bold">{Math.ceil(activeOperation.remainingMs / 1000)}s</strong>
            </div>
          </div>

          <div className="w-full h-2.5 bg-neutral-800 rounded-2xs overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 transition-all duration-200"
              style={{ width: `${activeOperation.progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{activeOperation.phaseText}</span>
            </span>
            <span className="font-bold text-cyan-300">{activeOperation.progress}% Transited</span>
          </div>
        </div>
      )}

      {/* 3. FEEDBACK NOTIFICATION BANNER */}
      {feedback && !activeOperation && (
        <div className="p-3.5 bg-white border border-[#111111] border-l-4 text-xs font-mono font-medium flex justify-between items-center shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900">
            <Radio size={14} className="text-cyan-600 shrink-0 animate-pulse" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs text-neutral-500 hover:text-neutral-900 font-bold cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-[#dedede] pb-3">
        {[
          { id: 'anomalies', label: '1. Dimensional Anomalies', icon: Atom, count: `${deltaCount} Delta` },
          { id: 'raids', label: '2. Stargate Boss Raids', icon: Skull, count: `${omegaCount} Omega` },
          { id: 'explorations', label: '3. Deep Void Explorations', icon: Compass, count: `${alphaCount} Alpha` },
          { id: 'synthesizer', label: '4. Token Synthesizer Foundry', icon: Cpu, count: 'Forge' },
          { id: 'history', label: '5. Mission & Extraction Logs', icon: History, count: `${historyLogs.length}` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.play('click');
                setActiveTab(tab.id as TabType);
              }}
              className={`py-2 px-3.5 text-xs font-bold uppercase tracking-wider font-mono border transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-white text-neutral-600 border-[#dedede] hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber-400' : 'text-neutral-500'} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-2xs border ${
                isActive ? 'bg-neutral-800 text-amber-300 border-neutral-700' : 'bg-neutral-100 text-neutral-600 border-neutral-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DIMENSIONAL ANOMALIES (DELTA TOKEN CONSUMPTION)                    */}
      {/* ========================================================================= */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-cyan-950 via-slate-950 to-neutral-950 text-white border border-cyan-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                SPACE-TIME DISTORTIONS & QUANTUM MIRRORS
              </span>
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2 mt-0.5">
                <span>Active Dimensional Anomalies</span>
                <span className="text-xs px-2 py-0.2 bg-cyan-900/60 border border-cyan-400 text-cyan-200">
                  {DIMENSIONAL_ANOMALIES.length} Rifts Detected
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Breaching dimensional anomalies requires consuming <strong>Delta Dimensional Tokens</strong> to maintain ship molecular coherence against hyper-dimensional shear.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-2 bg-slate-900 border border-cyan-500/40 text-right">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Delta Tokens Available</span>
                <strong className="text-lg text-cyan-300 font-bold">{deltaCount} 𐎡</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DIMENSIONAL_ANOMALIES.map((anomaly) => {
              const hasTokens = deltaCount >= anomaly.tokenCost.amount;

              return (
                <div
                  key={anomaly.id}
                  className="p-5 bg-white border border-[#dedede] hover:border-cyan-600 hover:shadow-md transition-all space-y-3 font-mono flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-cyan-100 text-cyan-800 border border-cyan-300 uppercase">
                            {anomaly.category}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 border border-rose-300 uppercase">
                            Danger: {anomaly.dangerRating}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-neutral-900 mt-1 group-hover:text-cyan-700 transition-colors">
                          {anomaly.name}
                        </h4>
                        <div className="text-[10px] text-neutral-500">
                          {anomaly.dimensionName} · <code className="text-cyan-700">{anomaly.coordinates}</code>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-neutral-500 uppercase block">Stability</span>
                        <strong className={`text-sm font-bold ${
                          anomaly.stabilityPct < 40 ? 'text-rose-600' : anomaly.stabilityPct < 70 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {anomaly.stabilityPct}%
                        </strong>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {anomaly.description}
                    </p>

                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 text-[10.5px] text-neutral-700 space-y-1">
                      <div className="font-bold text-cyan-900 flex items-center gap-1.5">
                        <Radio size={11} className="text-cyan-600" />
                        <span>MALP Scientific Telemetry:</span>
                      </div>
                      <p className="text-[10px] text-neutral-600">{anomaly.scientificTelemetry}</p>
                    </div>

                    {/* Loot Estimates */}
                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1 border-t border-neutral-100">
                      <div>
                        <span className="text-neutral-500 block">Naquadah:</span>
                        <strong className="text-neutral-900">+{anomaly.lootEstimates.naquadah.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Dark Matter:</span>
                        <strong className="text-purple-700">+{anomaly.lootEstimates.darkMatter} DM</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Relic Probability:</span>
                        <strong className="text-emerald-700">{anomaly.lootEstimates.relicChancePct}% Chance</strong>
                      </div>
                    </div>
                  </div>

                  {/* Operational Action Footer */}
                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
                    <div className="text-xs text-neutral-700 font-bold flex items-center gap-1.5">
                      <span>Cost:</span>
                      <span className="px-2 py-0.5 bg-cyan-100 border border-cyan-400 text-cyan-950 font-bold text-xs">
                        {anomaly.tokenCost.amount}x Delta Token 𐎡
                      </span>
                    </div>

                    <button
                      onClick={() => handleBreachAnomaly(anomaly)}
                      disabled={!hasTokens || !!activeOperation}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        hasTokens && !activeOperation
                          ? 'bg-cyan-700 hover:bg-cyan-600 text-white ring-1 ring-cyan-500'
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      <Atom className="w-3.5 h-3.5" />
                      <span>{hasTokens ? 'Stabilize & Breach' : 'Need Delta Tokens'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STARGATE BOSS RAIDS (OMEGA BEACON CONSUMPTION)                      */}
      {/* ========================================================================= */}
      {activeTab === 'raids' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-950 via-slate-950 to-neutral-950 text-white border border-purple-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                INTERSTELLAR BOSS CITADELS & SUPERGATE ARMADAS
              </span>
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2 mt-0.5">
                <span>Stargate Fleet Raid Encounters</span>
                <span className="text-xs px-2 py-0.2 bg-purple-900/60 border border-purple-400 text-purple-200">
                  {STARGATE_RAIDS.length} Raids Active
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Breaching heavily fortified hostile worlds requires activating an <strong>Omega Raid Beacon</strong>. Beacons overload shield arrays, allowing assault fleets to deploy directly onto target flags.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-2 bg-slate-900 border border-purple-500/40 text-right">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Omega Beacons Available</span>
                <strong className="text-lg text-purple-300 font-bold">{omegaCount} Ω</strong>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {STARGATE_RAIDS.map((raid) => {
              const state = raidBosses[raid.id] || { currentHp: raid.bossHp, currentShield: raid.bossShield, defeated: false };
              const hasTokens = omegaCount >= raid.tokenCost.amount;

              return (
                <div
                  key={raid.id}
                  className={`p-5 bg-white border transition-all space-y-4 font-mono ${
                    state.defeated ? 'border-emerald-500/60 bg-emerald-50/20' : 'border-[#dedede] hover:border-purple-600'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 uppercase">
                          {raid.threatTier}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-neutral-300 uppercase">
                          Faction: {raid.faction}
                        </span>
                        {state.defeated && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-600 text-white uppercase flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            Vanquished
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-black text-neutral-900 mt-1">
                        {raid.name}
                      </h4>
                      <p className="text-xs text-neutral-600">{raid.title}</p>
                    </div>

                    {/* Boss Health & Shield Bar */}
                    <div className="w-full lg:w-72 space-y-1.5">
                      <div className="flex justify-between text-xs text-neutral-700">
                        <span>Boss Integrity:</span>
                        <span className="font-bold">
                          {state.defeated ? '0' : state.currentHp.toLocaleString()} / {raid.bossMaxHp.toLocaleString()} HP
                        </span>
                      </div>
                      <div className="w-full h-3 bg-neutral-200 rounded-2xs overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-500 ${
                            state.defeated
                              ? 'bg-neutral-400 w-0'
                              : 'bg-gradient-to-r from-rose-600 to-amber-500'
                          }`}
                          style={{ width: `${state.defeated ? 0 : Math.round((state.currentHp / raid.bossMaxHp) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[9.5px] text-neutral-500 flex justify-between">
                        <span>Shields: {state.defeated ? 'Collapsed' : `${raid.bossShield.toLocaleString()} MW`}</span>
                        <span className="text-rose-700 font-bold">{raid.bossDefenseBonus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <p className="text-neutral-600 leading-relaxed text-[11.5px]">{raid.flavorLore}</p>
                      <div className="p-2.5 bg-neutral-50 border border-neutral-200 text-[10px] text-neutral-700">
                        <strong className="text-purple-900 block mb-0.5">🎯 Tactical Vulnerability:</strong>
                        <span>{raid.tacticalVulnerability}</span>
                      </div>
                    </div>

                    {/* Grand Raid Spoils & Mechanics */}
                    <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-2 text-[10.5px]">
                      <div className="font-bold text-neutral-900 uppercase flex items-center justify-between">
                        <span>Grand Raid Payout:</span>
                        <span className="text-amber-700 font-bold">+{raid.grandLoot.gloryPoints} Glory Points</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-neutral-600">
                        <div>Naquadah: <strong className="text-neutral-900">+{raid.grandLoot.naquadah.toLocaleString()}</strong></div>
                        <div>Crystal: <strong className="text-neutral-900">+{raid.grandLoot.crystal.toLocaleString()}</strong></div>
                        <div>Deuterium: <strong className="text-neutral-900">+{raid.grandLoot.deuterium.toLocaleString()}</strong></div>
                        <div>Credits: <strong className="text-neutral-900">+{raid.grandLoot.credits.toLocaleString()} GC</strong></div>
                      </div>
                      <div className="text-purple-800 font-bold pt-1 border-t border-neutral-200 flex items-center gap-1">
                        <Award size={12} />
                        <span>Exclusive Relic: {raid.grandLoot.exclusiveRelic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Launch Bar */}
                  <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-700 font-bold">
                      <span>Raid Token Cost:</span>
                      <span className="px-2 py-0.5 bg-purple-100 border border-purple-400 text-purple-950 font-bold">
                        {raid.tokenCost.amount}x Omega Raid Beacon Ω
                      </span>
                    </div>

                    <button
                      onClick={() => handleInitiateRaid(raid)}
                      disabled={!hasTokens || !!activeOperation}
                      className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        hasTokens && !activeOperation
                          ? 'bg-purple-700 hover:bg-purple-600 text-white ring-1 ring-purple-500'
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>{hasTokens ? 'Launch Fleet Raid Volley' : 'Need Omega Beacons'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEEP VOID EXPLORATIONS (ALPHA TOKEN CONSUMPTION)                    */}
      {/* ========================================================================= */}
      {activeTab === 'explorations' && (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-950 to-neutral-950 text-white border border-emerald-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                OFF-WORLD EXPLORATIONS & ANCIENT RUINS
              </span>
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2 mt-0.5">
                <span>Stargate SG Team Deep Explorations</span>
                <span className="text-xs px-2 py-0.2 bg-emerald-900/60 border border-emerald-400 text-emerald-200">
                  {GATE_EXPLORATION_MISSIONS.length} Sectors Charted
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Consuming <strong>Alpha Exploration Tokens</strong> locks in long-range wormhole transits without expending liquid deuterium or depleting fleet attack turns.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3 py-2 bg-slate-900 border border-emerald-500/40 text-right">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Alpha Tokens Available</span>
                <strong className="text-lg text-emerald-300 font-bold">{alphaCount} ᐰ</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GATE_EXPLORATION_MISSIONS.map((mission) => {
              const hasTokens = alphaCount >= mission.tokenCost.amount;

              return (
                <div
                  key={mission.id}
                  className="p-5 bg-white border border-[#dedede] hover:border-emerald-600 hover:shadow-md transition-all space-y-3 font-mono flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-900 border border-emerald-300 uppercase">
                            Galaxy: {mission.targetGalaxy}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-neutral-100 text-neutral-700 border border-neutral-300 uppercase">
                            Risk: {mission.dangerLevel}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-neutral-900 mt-1">
                          {mission.name}
                        </h4>
                        <div className="text-[10px] text-neutral-500">
                          Destination: <code className="text-emerald-700">{mission.sectorCoordinates}</code>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-neutral-500 block">ETA</span>
                        <strong className="text-xs font-bold text-neutral-800">{mission.durationSeconds}s Transit</strong>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {mission.description}
                    </p>

                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 text-[10px] text-neutral-700">
                      <strong className="text-emerald-900 block mb-0.5">🔍 Primary Discovery Objective:</strong>
                      <span>{mission.primaryDiscovery}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                      <div>
                        <span className="text-neutral-500 block">Naquadah:</span>
                        <strong className="text-neutral-900">+{mission.lootEstimates.naquadah.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Credits:</span>
                        <strong className="text-neutral-900">+{mission.lootEstimates.credits.toLocaleString()} GC</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Conscripts:</span>
                        <strong className="text-indigo-700">+{mission.lootEstimates.conscripts} Recruits</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
                    <div className="text-xs text-neutral-700 font-bold flex items-center gap-1.5">
                      <span>Cost:</span>
                      <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold text-xs">
                        {mission.tokenCost.amount}x Alpha Token ᐰ
                      </span>
                    </div>

                    <button
                      onClick={() => handleLaunchExploration(mission)}
                      disabled={!hasTokens || !!activeOperation}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        hasTokens && !activeOperation
                          ? 'bg-emerald-700 hover:bg-emerald-600 text-white ring-1 ring-emerald-500'
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{hasTokens ? 'Deploy SG Team' : 'Need Alpha Tokens'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TOKEN SYNTHESIZER & ACQUISITION FOUNDRY                             */}
      {/* ========================================================================= */}
      {activeTab === 'synthesizer' && (
        <div className="space-y-6 font-mono">
          <div className="p-4 bg-white border border-[#dedede] space-y-2">
            <h3 className="text-base font-black text-neutral-900 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Stargate Matrix Synthesizer & Token Foundry</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Consumable tokens can be forged directly using stockpiles of raw Naquadah, Crystalline arrays, Deuterium feed, and Dark Matter. Alternatively, acquire tokens directly through the Galactic Guild trade broker using liquid credits.
            </p>
          </div>

          {/* Fabrication Recipes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {TOKEN_SYNTHESIS_RECIPES.map((recipe) => {
              const def = GATE_TOKENS_CATALOG[recipe.targetToken];
              const c = recipe.costs;
              const canAfford =
                (resources.naquadah ?? 0) >= c.naquadah &&
                (resources.crystal ?? 0) >= c.crystal &&
                (resources.deuterium ?? 0) >= c.deuterium &&
                (resources.credits ?? 0) >= c.credits &&
                (!c.darkMatter || (resources.darkMatter ?? 0) >= c.darkMatter);

              return (
                <div
                  key={recipe.targetToken}
                  className="p-5 bg-white border border-[#dedede] hover:border-neutral-900 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-xs flex items-center justify-center font-bold text-xs ${def.badgeBg} ${def.textColor}`}>
                          {def.symbol}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{def.name}</h4>
                          <span className="text-[10px] text-neutral-500">{def.code}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-neutral-800">Yield: +{recipe.outputAmount}</span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {recipe.description}
                    </p>

                    <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
                      <span className="text-[10px] font-bold text-neutral-700 uppercase block">Required Materials:</span>
                      <div className="flex justify-between text-neutral-600">
                        <span>Naquadah:</span>
                        <strong className={(resources.naquadah ?? 0) >= c.naquadah ? 'text-neutral-900' : 'text-rose-600'}>
                          {c.naquadah.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Crystal Silicon:</span>
                        <strong className={(resources.crystal ?? 0) >= c.crystal ? 'text-neutral-900' : 'text-rose-600'}>
                          {c.crystal.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Deuterium Fuel:</span>
                        <strong className={(resources.deuterium ?? 0) >= c.deuterium ? 'text-neutral-900' : 'text-rose-600'}>
                          {c.deuterium.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Galactic Credits:</span>
                        <strong className={(resources.credits ?? 0) >= c.credits ? 'text-neutral-900' : 'text-rose-600'}>
                          {c.credits.toLocaleString()} GC
                        </strong>
                      </div>
                      {c.darkMatter && (
                        <div className="flex justify-between text-purple-700">
                          <span>Dark Matter:</span>
                          <strong className={(resources.darkMatter ?? 0) >= c.darkMatter ? 'text-purple-900' : 'text-rose-600'}>
                            {c.darkMatter} DM
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSynthesizeToken(recipe)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      canAfford
                        ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                        : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{canAfford ? `Synthesize (+${recipe.outputAmount})` : 'Insufficient Materials'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Direct Guild Exchange Desk */}
          <div className="p-5 border border-amber-300 bg-amber-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-amber-950 uppercase flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-700" />
                  <span>Galactic Guild Direct Credit Exchange</span>
                </h4>
                <p className="text-xs text-amber-900/80">
                  Instant token requisition for commanders with abundant liquid credit reserves.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-800 uppercase block font-bold">Liquid Treasury</span>
                <strong className="text-base text-amber-950 font-bold font-mono">
                  {(resources.credits ?? 0).toLocaleString()} GC
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleBuyWithCredits('alpha')}
                className="p-3 bg-white border border-amber-300 hover:border-amber-600 hover:shadow-xs text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-neutral-900 flex justify-between">
                  <span>1x Alpha Token ᐰ</span>
                  <span className="text-amber-700 font-bold">45,000 GC</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Single-click purchase</div>
              </button>

              <button
                onClick={() => handleBuyWithCredits('delta')}
                className="p-3 bg-white border border-amber-300 hover:border-amber-600 hover:shadow-xs text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-neutral-900 flex justify-between">
                  <span>1x Delta Token 𐎡</span>
                  <span className="text-amber-700 font-bold">85,000 GC</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Single-click purchase</div>
              </button>

              <button
                onClick={() => handleBuyWithCredits('omega')}
                className="p-3 bg-white border border-amber-300 hover:border-amber-600 hover:shadow-xs text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-neutral-900 flex justify-between">
                  <span>1x Omega Beacon Ω</span>
                  <span className="text-amber-700 font-bold">175,000 GC</span>
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Single-click purchase</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MISSION & EXTRACTION AUDIT LOGS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4 font-mono">
          <div className="p-4 bg-white border border-[#dedede] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase flex items-center gap-2">
                <History className="w-4 h-4 text-neutral-600" />
                <span>Gate Tokens Mission & Anomaly Audit Logs</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Detailed real-time record of all tokens consumed, rifts breached, raids executed, and spoils acquired.
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-bold">{historyLogs.length} Records Tracked</span>
          </div>

          <div className="divide-y divide-neutral-200 border border-[#dedede] bg-white">
            {historyLogs.map((log) => (
              <div key={log.id} className="p-4 space-y-1 hover:bg-neutral-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 font-bold uppercase border ${
                      log.type === 'anomaly'
                        ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                        : log.type === 'raid'
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : log.type === 'exploration'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : log.type === 'synthesis'
                        ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {log.type}
                    </span>
                    <strong className="text-xs text-neutral-900 font-bold">{log.title}</strong>
                  </div>
                  <span className="text-[10px] text-neutral-400">{log.timestamp}</span>
                </div>

                <div className="text-xs text-neutral-600 leading-relaxed">
                  {log.outcomeText}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px]">
                  <span className="text-rose-700 font-bold">{log.tokensUsedOrGained}</span>
                  <span className="text-emerald-700 font-bold">{log.spoilsSummary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
