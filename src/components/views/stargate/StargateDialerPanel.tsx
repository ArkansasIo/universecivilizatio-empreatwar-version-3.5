import React, { useState, useEffect } from 'react';
import { Shield, Zap, Sparkles, AlertCircle, RefreshCw, KeyRound, Radio, Volume2 } from 'lucide-react';
import { sound } from '../../../sound';
import { StargateAddress, StargateGlyph, STARGATE_GLYPHS } from '../../../stargateData';
import { PlayerResources } from '../../../types';

interface StargateDialerPanelProps {
  activeGate: StargateAddress;
  activeWormhole: string | null;
  irisClosed: boolean;
  onToggleIris: () => void;
  onEstablishWormhole: (target: StargateAddress) => void;
  onDisconnectWormhole: () => void;
  resources: PlayerResources;
  onUpdateResources?: (res: Partial<PlayerResources>) => void;
}

export const StargateDialerPanel: React.FC<StargateDialerPanelProps> = ({
  activeGate,
  activeWormhole,
  irisClosed,
  onToggleIris,
  onEstablishWormhole,
  onDisconnectWormhole,
  resources,
  onUpdateResources,
}) => {
  const [dialedSequence, setDialedSequence] = useState<string[]>([]);
  const [lockedChevrons, setLockedChevrons] = useState<number>(0);
  const [isDialing, setIsDialing] = useState<boolean>(false);
  const [dialStepText, setDialStepText] = useState<string>('DHD Ready. Select glyphs or auto-dial destination.');
  const [idcCode, setIdcCode] = useState<string>('SG-1-ALPHA-7729');
  const [idbVerified, setIdbVerified] = useState<boolean>(true);
  const [ringRotation, setRingRotation] = useState<number>(0);

  const isCurrentConnected = activeWormhole === activeGate.id;
  const isAnyConnected = activeWormhole !== null;

  // Auto-fill target chevrons when gate changes
  useEffect(() => {
    if (!isDialing && !isCurrentConnected) {
      setDialedSequence([]);
      setLockedChevrons(0);
      setDialStepText(`Target selected: ${activeGate.name} (${activeGate.chevrons.length} chevrons required)`);
    }
  }, [activeGate.id, isDialing, isCurrentConnected]);

  const handleGlyphClick = (glyph: StargateGlyph) => {
    if (isDialing || isAnyConnected) return;

    sound.play('click');
    setRingRotation((prev) => prev + 45);

    if (dialedSequence.length < activeGate.chevrons.length) {
      const next = [...dialedSequence, glyph.symbol];
      setDialedSequence(next);
      setLockedChevrons(next.length);
      setDialStepText(`Chevron ${next.length} encoded: [${glyph.name} - ${glyph.symbol}]`);

      // If full sequence entered, execute dial
      if (next.length === activeGate.chevrons.length) {
        startDialProcess(activeGate, next);
      }
    }
  };

  const handleAutoDial = () => {
    if (isDialing || isAnyConnected) return;
    sound.play('confirm');
    startDialProcess(activeGate, activeGate.chevrons);
  };

  const getChevronTurnCost = (chevronCount: number): number => {
    if (chevronCount >= 9) return 200; // 9th Chevron for far distance galaxies (200 turns)
    if (chevronCount === 8) return 125; // 8th Chevron for different galaxy (125 turns)
    return 1; // 7th Chevron standard dialing (1 turn)
  };

  const startDialProcess = (target: StargateAddress, sequence: string[]) => {
    const requiredTurns = getChevronTurnCost(target.chevrons.length);
    if ((resources.attackTurns || 0) < requiredTurns) {
      sound.play('warning');
      setDialStepText(`Insufficient Attack Turns! Dialing a ${target.chevrons.length}-chevron address requires ${requiredTurns} turns (Current: ${resources.attackTurns || 0}).`);
      return;
    }

    // Deduct turns for dialing
    if (onUpdateResources) {
      onUpdateResources({
        attackTurns: Math.max(0, (resources.attackTurns || 0) - requiredTurns),
      });
    }

    setIsDialing(true);
    setDialedSequence(sequence);
    setLockedChevrons(0);

    const totalChevrons = target.chevrons.length;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setLockedChevrons(current);
      setRingRotation((prev) => prev + 360 / totalChevrons);
      sound.play('stargate_lock');

      if (current < totalChevrons) {
        setDialStepText(`Chevron ${current} locked in place...`);
      } else {
        clearInterval(interval);
        setDialStepText(`Chevron ${totalChevrons} locked! Engaging Kawoosh Event Horizon...`);
        sound.play('stargate_engage');

        setTimeout(() => {
          setIsDialing(false);
          sound.play('success');
          onEstablishWormhole(target);
          setDialStepText(`Wormhole stable! Two-way subspace matter transit active.`);
        }, 1200);
      }
    }, 400);
  };

  const handleClear = () => {
    if (isDialing) return;
    sound.play('click');
    setDialedSequence([]);
    setLockedChevrons(0);
    setDialStepText('DHD sequence cleared. Ready for input.');
  };

  const handleTransmitIDC = () => {
    sound.play('confirm');
    setIdbVerified(true);
    setDialStepText(`IDC signal [${idcCode}] accepted. Iris auto-sync confirmed.`);
  };

  return (
    <div id="stargate-dialer-panel" className="space-y-6">
      {/* Upper Terminal Grid: Ring Visualizer & Status Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual Stargate Ring */}
        <div className="lg:col-span-6 bg-[#0c1017] border border-[#1e293b] p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle cosmic grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Top HUD inside ring */}
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#94a3b8] uppercase mb-4 z-10">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isCurrentConnected ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
              Astria Porta · Model Mark VII
            </span>
            <span className="tracking-widest">
              {isCurrentConnected ? 'WORMHOLE ACTIVE' : isDialing ? 'ENCODING CHEVRONS' : 'RING IDLE'}
            </span>
          </div>

          {/* Stargate SVG Ring Assembly */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2 select-none">
            {/* Outer Static Stargate Frame */}
            <div className="absolute inset-0 rounded-full border-8 border-[#334155] shadow-2xl flex items-center justify-center">
              {/* Outer Bevel Ring */}
              <div className="absolute inset-1 rounded-full border border-[#475569] opacity-80" />
            </div>

            {/* 9 Chevrons around outer circumference */}
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, idx) => {
              const isChevronLocked = lockedChevrons > idx || (isCurrentConnected && idx < activeGate.chevrons.length);
              const angleRad = (deg - 90) * (Math.PI / 180);
              const radius = 136; // px distance from center for chevron
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <div
                  key={deg}
                  id={`chevron-${idx + 1}`}
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${deg}deg)`,
                  }}
                  className={`absolute w-6 h-4 z-20 transition-all duration-300 flex items-center justify-center border ${
                    isChevronLocked
                      ? 'bg-amber-500 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.9)] scale-110'
                      : 'bg-[#1e293b] border-[#475569] text-[#64748b]'
                  }`}
                  title={`Chevron ${idx + 1}`}
                >
                  <span className={`text-[8px] font-bold font-mono ${isChevronLocked ? 'text-white' : 'text-neutral-400'}`}>
                    V
                  </span>
                </div>
              );
            })}

            {/* Inner Rotating Ring with Glyphs */}
            <div
              style={{ transform: `rotate(${ringRotation}deg)` }}
              className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border-4 border-[#1e293b] bg-[#0f172a] transition-transform duration-700 ease-out flex items-center justify-center shadow-inner"
            >
              {/* Ring Glyph markings */}
              <div className="absolute inset-2 rounded-full border border-dashed border-[#334155] opacity-60" />
              <div className="text-[10px] font-mono text-[#475569] uppercase tracking-widest pointer-events-none">
                {isDialing ? 'ENCODING...' : 'ANCIENT GLYPHS'}
              </div>
            </div>

            {/* Event Horizon (Center Puddle / Wormhole or Iris) */}
            <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden flex items-center justify-center z-10 shadow-2xl">
              {irisClosed ? (
                // Titanium Iris Closed Visual
                <div className="w-full h-full bg-[#1e293b] border-2 border-[#475569] flex flex-col items-center justify-center text-center p-2 relative shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
                  {/* Iris metal blades lines */}
                  <div className="absolute w-full h-[1px] bg-[#334155] rotate-45" />
                  <div className="absolute w-full h-[1px] bg-[#334155] -rotate-45" />
                  <div className="absolute w-full h-[1px] bg-[#334155] rotate-90" />
                  <Shield size={24} className="text-amber-400 relative z-10 mb-1" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider relative z-10 font-mono">
                    IRIS CLOSED
                  </span>
                  <span className="text-[8px] text-[#94a3b8] font-mono relative z-10">
                    Trinium Barrier 100%
                  </span>
                </div>
              ) : isCurrentConnected ? (
                // Shimmering Blue Event Horizon (Kawoosh Puddle)
                <div className="w-full h-full bg-[#0284c7] relative flex flex-col items-center justify-center shadow-[inset_0_0_24px_rgba(255,255,255,0.7)] animate-pulse">
                  {/* Vortex wave rings */}
                  <div className="absolute inset-2 rounded-full border border-sky-300 opacity-60 animate-ping" />
                  <div className="absolute inset-6 rounded-full border border-sky-200 opacity-80" />
                  <div className="relative text-center z-10">
                    <Sparkles size={22} className="text-white mx-auto animate-spin" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-mono mt-1">
                      EVENT HORIZON
                    </span>
                    <span className="text-[8px] text-sky-100 font-mono">STABLE WORMHOLE</span>
                  </div>
                </div>
              ) : isDialing ? (
                // Dialing in progress glow
                <div className="w-full h-full bg-[#0f172a] border border-amber-500/40 flex flex-col items-center justify-center text-center p-2">
                  <RefreshCw size={20} className="text-amber-400 animate-spin mb-1" />
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase">
                    LOCKING {lockedChevrons}/{activeGate.chevrons.length}
                  </span>
                </div>
              ) : (
                // Idle Stargate Center
                <div className="w-full h-full bg-[#020617] border border-[#1e293b] flex flex-col items-center justify-center text-center p-2">
                  <div className="text-2xl font-mono text-[#334155]">{activeGate.pointOfOrigin}</div>
                  <span className="text-[9px] text-[#64748b] font-mono uppercase mt-1">DISCONNECTED</span>
                </div>
              )}
            </div>
          </div>

          {/* Lower Control Bar: Iris & Disconnect */}
          <div className="w-full flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#1e293b] z-10">
            <button
              type="button"
              id="toggle-iris-btn"
              onClick={() => {
                sound.play('click');
                onToggleIris();
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors flex items-center gap-1.5 font-mono ${
                irisClosed
                  ? 'bg-amber-600 text-white border-amber-500 hover:bg-amber-700'
                  : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-white hover:border-[#475569]'
              }`}
            >
              <Shield size={13} />
              <span>{irisClosed ? 'Open Iris (Barrier Off)' : 'Close Iris (Barrier Armed)'}</span>
            </button>

            {isCurrentConnected && (
              <button
                type="button"
                id="close-wormhole-btn"
                onClick={() => {
                  sound.play('click');
                  onDisconnectWormhole();
                  setDialStepText('Iris closed. Event horizon collapsed. Stargate offline.');
                }}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors cursor-pointer border border-rose-500 font-mono"
              >
                Disconnect Wormhole ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Telemetry & Active Gate Info */}
        <div className="lg:col-span-6 bg-white border border-[#dedede] p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div>
                <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
                  DIAL-HOME DEVICE TELEMETRY CONSOLE
                </span>
                <h3 className="text-xl font-bold text-[#111111]">{activeGate.name}</h3>
                <span className="text-xs text-[#555555] font-mono">{activeGate.designation}</span>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase font-mono border ${
                  activeGate.securityLevel === 'Safe'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : activeGate.securityLevel === 'Restricted'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {activeGate.securityLevel}
              </span>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed mt-3">{activeGate.description}</p>

            {/* Target Chevron Target Sequence Display */}
            <div className="mt-4 p-3 bg-[#fafafa] border border-[#dedede] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#777777] uppercase font-mono">
                  Required Chevrons ({activeGate.chevrons.length} Coordinates)
                </span>
                <span className="text-[10px] font-mono text-[#555555]">
                  Locked: {lockedChevrons}/{activeGate.chevrons.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {activeGate.chevrons.map((sym, idx) => {
                  const isLocked = lockedChevrons > idx || (isCurrentConnected && idx < activeGate.chevrons.length);
                  return (
                    <span
                      key={idx}
                      className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm border transition-all ${
                        isLocked
                          ? 'bg-[#111111] text-amber-400 border-amber-500 shadow-sm'
                          : 'bg-white text-[#888888] border-[#dedede]'
                      }`}
                      title={`Chevron #${idx + 1}: ${sym}`}
                    >
                      {sym}
                    </span>
                  );
                })}
                <span className="text-[10px] text-[#777777] font-mono ml-1">
                  Origin: <strong>{activeGate.pointOfOrigin}</strong>
                </span>
              </div>
            </div>

            {/* Status Feedback Ticker */}
            <div className="mt-3 p-2.5 bg-[#f0f9ff] border border-sky-200 text-xs font-mono text-sky-900 flex items-center gap-2">
              <Radio size={14} className="text-sky-600 animate-pulse shrink-0" />
              <span className="truncate">{dialStepText}</span>
            </div>
          </div>

          {/* Dialing Quick Action Controls */}
          <div className="pt-3 border-t border-[#eeeeee] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="auto-dial-btn"
                disabled={isDialing || isCurrentConnected}
                onClick={handleAutoDial}
                className="py-2.5 px-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 font-mono"
              >
                <Zap size={14} className="text-amber-400" />
                <span>Auto-Dial ({getChevronTurnCost(activeGate.chevrons.length)} {getChevronTurnCost(activeGate.chevrons.length) === 1 ? 'Turn' : 'Turns'})</span>
              </button>

              <button
                type="button"
                id="clear-dial-btn"
                disabled={isDialing || isCurrentConnected || dialedSequence.length === 0}
                onClick={handleClear}
                className="py-2.5 px-3 bg-white text-[#333333] border border-[#dedede] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer font-mono"
              >
                Clear Chevrons
              </button>
            </div>

            {/* Iris Deactivation Code (GDO) section */}
            <div className="flex items-center justify-between gap-2 p-2 bg-[#fafafa] border border-[#dedede]">
              <div className="flex items-center gap-2">
                <KeyRound size={14} className="text-[#555555]" />
                <span className="text-[10px] font-mono font-bold text-[#555555]">GDO / IDC Code:</span>
                <input
                  type="text"
                  value={idcCode}
                  onChange={(e) => setIdcCode(e.target.value)}
                  className="w-36 text-xs font-mono font-bold text-[#111111] bg-white border border-[#dedede] px-1.5 py-0.5"
                />
              </div>
              <button
                type="button"
                onClick={handleTransmitIDC}
                className="px-2.5 py-1 bg-white border border-[#dedede] text-[10px] font-bold uppercase font-mono hover:border-[#111111] cursor-pointer"
              >
                Transmit IDC
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower DHD (Dial-Home Device) Physical Keyboard */}
      <div className="border border-[#dedede] bg-white p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-mono">
              Dial-Home Device (DHD) Physical Keypad Matrix
            </h4>
            <span className="text-xs text-[#777777]">
              Click glyphs manually or activate central activator dome to trigger wormhole encoding.
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#555555]">
            <span>Dialed: {dialedSequence.length}/{activeGate.chevrons.length}</span>
          </div>
        </div>

        {/* 28 Glyphs Grid with Center Activator Button */}
        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {STARGATE_GLYPHS.map((glyph) => {
            const isSelected = dialedSequence.includes(glyph.symbol);
            return (
              <button
                key={glyph.id}
                type="button"
                id={`glyph-${glyph.id}`}
                disabled={isDialing || isCurrentConnected}
                onClick={() => handleGlyphClick(glyph)}
                className={`p-2 border text-center transition-all cursor-pointer disabled:opacity-40 group ${
                  isSelected
                    ? 'bg-[#111111] text-amber-400 border-amber-500 shadow-sm'
                    : 'bg-[#fafafa] border-[#dedede] hover:border-[#111111] hover:bg-neutral-100'
                }`}
                title={`${glyph.name} (${glyph.phonetic})`}
              >
                <div className="text-xl font-bold font-mono group-hover:scale-110 transition-transform">
                  {glyph.symbol}
                </div>
                <div className="text-[8px] font-mono text-[#777777] truncate mt-0.5">
                  {glyph.phonetic}
                </div>
              </button>
            );
          })}
        </div>

        {/* Big Red Central Activator Dome Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            id="dhd-activator-dome-btn"
            disabled={isDialing || isCurrentConnected}
            onClick={handleAutoDial}
            className="w-full sm:w-80 py-3.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-widest font-mono shadow-md border border-red-500 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Zap size={16} className="text-amber-300" />
            <span>Engage DHD Activator Dome ({getChevronTurnCost(activeGate.chevrons.length)} Turns) →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
