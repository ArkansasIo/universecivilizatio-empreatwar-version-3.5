import React, { useState } from 'react';
import {
  RotateCw,
  Clock,
  Zap,
  Shield,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Play,
  FastForward,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface TurnSystemViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onProcessTurn: (multiplier?: number) => void;
  onUpdateAllSystems?: () => void;
}

export const TurnSystemView: React.FC<TurnSystemViewProps> = ({
  resources,
  onUpdateResources,
  onProcessTurn,
  onUpdateAllSystems,
}) => {
  const [turnCap, setTurnCap] = useState<number>(5000);
  const [turnsPerMinute, setTurnsPerMinute] = useState<number>(6);
  const [autoRegenEnabled, setAutoRegenEnabled] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [lastExecutedMultiplier, setLastExecutedMultiplier] = useState<number>(1);

  const handleExecuteTurns = (count: number) => {
    sound.play('confirm');
    setLastExecutedMultiplier(count);
    onProcessTurn(count);
    setFeedback(`Executed ${count} Galactic Turn${count > 1 ? 's' : ''}! Colonial yields, mines, and population recalculated.`);
  };

  const handleBuyTurns = (amount: number, costNaquadah: number) => {
    if (resources.naquadah < costNaquadah) {
      sound.play('warning');
      setFeedback('Insufficient liquid Naquadah to purchase additional turns.');
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      naquadah: resources.naquadah - costNaquadah,
      attackTurns: Math.min(turnCap, (resources.attackTurns ?? 0) + amount),
    });
    setFeedback(`Successfully purchased ${amount.toLocaleString()} attack turns for ${costNaquadah.toLocaleString()} NQ!`);
  };

  const handleBoostRegen = () => {
    if ((resources.crystal ?? 0) < 20000) {
      sound.play('warning');
      setFeedback('Insufficient Crystal (20,000) to upgrade Subspace Turn Accelerator.');
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      crystal: (resources.crystal ?? 0) - 20000,
    });
    setTurnsPerMinute(turnsPerMinute + 2);
    setFeedback(`Subspace Turn Accelerator upgraded! Turn generation now +${turnsPerMinute + 2} turns/min.`);
  };

  return (
    <div id="turn-system-view" className="space-y-6">
      {/* Intro Banner */}
      <div className="border border-[#dedede] bg-white p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 font-mono">
              TEMPORAL CHRONOS ENGINE · 6 TURNS/MIN PASSIVE FLOW & HIGH-FREQUENCY BULK CYCLES
            </div>
            <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
              Galactic Turn Engine & Chronometer Matrix
            </h2>
            <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
              Every turn drives interstellar mining yields, energy flow, life support consumption, population growth, and fleet warp progression across all colonized worlds.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
            <div className="p-2.5 bg-[#fafafa] border border-[#dedede] rounded-xs text-right">
              <span className="text-[10px] text-[#888888] uppercase block font-semibold">TURNS IN RESERVE</span>
              <strong className="text-xl font-bold text-[#111111] font-mono">
                {resources.attackTurns.toLocaleString()}
                <span className="text-xs font-normal text-[#888888]"> / {turnCap.toLocaleString()}</span>
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Systems Update & Matrix Controller */}
      <div className="border-2 border-emerald-600/60 bg-gradient-to-br from-emerald-950/5 via-white to-teal-950/5 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-[#e2e8f0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[10px] font-extrabold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEMS SYNCHRONIZER ONLINE
              </span>
              <span className="text-[10px] font-mono text-[#666666]">ALL 8 SUBSYSTEMS NOMINAL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight font-mono">
              Universal Systems Pulse & Macro Engine
            </h3>
            <p className="text-xs text-[#555555] mt-1 max-w-2xl leading-relaxed">
              Initiate a coordinated pulse across all imperial infrastructure: recalculate mining output, advance research lab breakthroughs, cycle shipyard drydocks, recharge planetary defense shields, and compound bank vault interest.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="turn-view-update-all-systems-btn"
              onClick={() => {
                sound.play('confirm');
                if (onUpdateAllSystems) {
                  onUpdateAllSystems();
                } else {
                  handleExecuteTurns(1);
                }
                setFeedback('⚡ Universal Systems Pulse Completed! Mines, Factories, Shipyards, R&D Labs, Defenses & Bank Vault synchronized.');
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 hover:from-emerald-500 hover:to-teal-600 text-white font-mono text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 border border-emerald-400"
            >
              <RotateCw size={15} className="text-emerald-200" />
              <span>UPDATE ALL SYSTEMS (ONE-CLICK PULSE)</span>
            </button>
          </div>
        </div>

        {/* 8 Live Subsystem Health Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-5 font-mono text-center">
          {[
            { name: 'Planetary Mines', status: 'ACTIVE', color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { name: 'Nanite Foundries', status: 'RUNNING', color: 'text-orange-700 bg-orange-50 border-orange-200' },
            { name: 'Orbital Shipyard', status: 'FABRICATING', color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { name: 'Quantum R&D', status: 'DISCOVERING', color: 'text-purple-700 bg-purple-50 border-purple-200' },
            { name: 'Defense Grids', status: 'ARMED', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { name: 'Stargate Relays', status: 'CALIBRATED', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
            { name: 'Bank Citadel', status: 'SECURED', color: 'text-lime-700 bg-lime-50 border-lime-200' },
            { name: 'Strike Academy', status: 'DRILLING', color: 'text-rose-700 bg-rose-50 border-rose-200' },
          ].map((sys) => (
            <div key={sys.name} className={`p-2 rounded-xs border ${sys.color}`}>
              <span className="text-[9px] font-bold block uppercase tracking-wider truncate">{sys.name}</span>
              <span className="text-[10px] font-black block mt-0.5">{sys.status}</span>
            </div>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-950 flex justify-between items-center shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-800 hover:text-black font-bold cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Turn Overview Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block font-mono">Current Attack Turns</span>
          <strong className="text-2xl font-mono text-[#111111] block mt-1">
            {resources.attackTurns.toLocaleString()}
          </strong>
          <span className="text-[10px] text-[#777777] block mt-1 font-mono">Cap: {turnCap.toLocaleString()} turns</span>
        </div>

        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block font-mono">Passive Regen Speed</span>
          <div className="flex items-center gap-2 mt-1">
            <Zap size={18} className="text-amber-500" />
            <strong className="text-xl font-mono text-[#111111] font-bold">{turnsPerMinute} Turns / min</strong>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1 font-mono">+{(turnsPerMinute * 60).toLocaleString()} Turns / hour</span>
        </div>

        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block font-mono">Cron Job Pipeline</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${autoRegenEnabled ? 'bg-emerald-600 animate-pulse' : 'bg-neutral-400'}`} />
            <strong className="text-base font-mono text-[#111111]">
              {autoRegenEnabled ? 'Synchronized (60s Tick)' : 'Paused'}
            </strong>
          </div>
          <span className="text-[10px] text-[#777777] block mt-1 font-mono">Global Empire Cron Authoritative</span>
        </div>

        <div className="border border-[#dedede] bg-white p-4">
          <span className="text-[10px] font-bold text-[#777777] uppercase block font-mono">Instant Chrono Pulse</span>
          <button
            type="button"
            onClick={() => handleExecuteTurns(1)}
            className="w-full mt-1.5 py-2 px-3 bg-[#111111] text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs font-mono"
          >
            <RotateCw size={12} className="animate-spin text-amber-400" />
            <span>Process 1 Turn</span>
          </button>
        </div>
      </div>

      {/* High-Frequency Bulk Turn Accelerator Matrix */}
      <div className="border border-[#dedede] bg-white p-6 space-y-4">
        <div className="border-b border-[#eeeeee] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2">
              <FastForward size={16} className="text-amber-500" />
              <span>Bulk Chrono Multiplier Deck</span>
            </h3>
            <span className="text-xs text-[#777777]">
              Instantly advance the empire multiple turns in a single atomic transaction without waiting.
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-2xs">
            LAST PROCESSED: {lastExecutedMultiplier} TURN{lastExecutedMultiplier > 1 ? 'S' : ''}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { turns: 1, label: '1 Turn', desc: 'Standard Step', bg: 'hover:border-[#111111]' },
            { turns: 5, label: '5 Turns', desc: 'Tactical Skirmish', bg: 'hover:border-amber-500' },
            { turns: 10, label: '10 Turns', desc: 'Hour Yield', bg: 'hover:border-amber-600' },
            { turns: 25, label: '25 Turns', desc: 'Quarter Day', bg: 'hover:border-emerald-600' },
            { turns: 50, label: '50 Turns', desc: 'Half Solar Day', bg: 'hover:border-cyan-600' },
            { turns: 100, label: '100 Turns', desc: 'Full Orbit Epoch', bg: 'hover:border-indigo-600' },
          ].map((item) => (
            <button
              key={item.turns}
              type="button"
              onClick={() => handleExecuteTurns(item.turns)}
              className={`p-3.5 border border-[#e0e0e0] bg-[#fafafa] hover:bg-white text-left transition-all cursor-pointer group shadow-2xs ${item.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#888888] font-bold">x{item.turns}</span>
                <Play size={10} className="text-[#999999] group-hover:text-[#111111] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <strong className="block text-base font-bold text-[#111111] mt-1 font-mono">
                +{item.turns} {item.turns === 1 ? 'Turn' : 'Turns'}
              </strong>
              <small className="block text-[10px] text-[#777777] mt-0.5">{item.desc}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Turn Packages & Subspace Accelerators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchase Turns */}
        <div className="border border-[#dedede] bg-white p-6 space-y-4">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider font-mono">
              Acquire Strategic Turn Reserves
            </h3>
            <span className="text-xs text-[#777777]">
              Exchange liquid Naquadah reserves for emergency tactical operation turns.
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#fafafa] border border-[#dedede]">
              <div>
                <strong className="text-xs font-bold text-[#111111] block font-mono">+100 Attack Turns</strong>
                <span className="text-[10px] text-[#777777] font-mono">Cost: 50,000 Naquadah</span>
              </div>
              <button
                type="button"
                onClick={() => handleBuyTurns(100, 50000)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer rounded-xs"
              >
                Purchase →
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#fafafa] border border-[#dedede]">
              <div>
                <strong className="text-xs font-bold text-[#111111] block font-mono">+500 Attack Turns</strong>
                <span className="text-[10px] text-[#777777] font-mono">Cost: 220,000 Naquadah</span>
              </div>
              <button
                type="button"
                onClick={() => handleBuyTurns(500, 220000)}
                className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer rounded-xs"
              >
                Purchase →
              </button>
            </div>
          </div>
        </div>

        {/* Subspace Turn Accelerator */}
        <div className="border border-[#dedede] bg-white p-6 space-y-4">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider font-mono">
              Subspace Chronometer Accelerator
            </h3>
            <span className="text-xs text-[#777777]">
              Upgrade turn regeneration rate permanently per minute.
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#555555]">
            <p className="leading-relaxed">
              By warping local subspace spacetime curvature around orbital stations, your empire's atomic clocks regenerate attack turns faster than standard galactic units.
            </p>
            <div className="p-3 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#111111] block font-mono">Current Regen: {turnsPerMinute} turns/min</span>
                <span className="text-[10px] text-[#777777] font-mono">Upgrade Cost: 20,000 Crystal Silicate</span>
              </div>
              <button
                type="button"
                onClick={handleBoostRegen}
                className="px-4 py-2.5 bg-[#111111] text-amber-400 font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer rounded-xs shadow-2xs font-mono"
              >
                Upgrade Regen →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
