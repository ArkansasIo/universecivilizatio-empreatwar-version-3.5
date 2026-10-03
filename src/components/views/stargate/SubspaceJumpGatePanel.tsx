import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Zap,
  ArrowRight,
  Shield,
  Gauge,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Wrench,
  Fuel,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  JumpGateRelay,
  JumpGateFleetComposition,
  INITIAL_JUMP_GATE_RELAYS,
} from '../../../stargateData';
import { PlayerResources } from '../../../types';

interface SubspaceJumpGatePanelProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onLogDebrief: (log: string) => void;
}

export const SubspaceJumpGatePanel: React.FC<SubspaceJumpGatePanelProps> = ({
  resources,
  onUpdateResources,
  onLogDebrief,
}) => {
  const [relays, setRelays] = useState<JumpGateRelay[]>(INITIAL_JUMP_GATE_RELAYS);
  const [originGateId, setOriginGateId] = useState<string>(relays[0].id);
  const [destGateId, setDestGateId] = useState<string>(relays[1].id);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Fleet to transit selection
  const [selectedFleet, setSelectedFleet] = useState<JumpGateFleetComposition>({
    lightFighters: 50,
    heavyCruisers: 15,
    battleships: 5,
    battlecruisers: 2,
    deathstars: 0,
    largeCargos: 20,
    recyclers: 10,
  });

  const originRelay = relays.find((r) => r.id === originGateId) || relays[0];
  const destRelay = relays.find((r) => r.id === destGateId) || relays[1];

  // Tick cooldown timers down every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRelays((prev) =>
        prev.map((r) => {
          if (r.cooldownSeconds > 0) {
            const nextCool = r.cooldownSeconds - 1;
            const charge = Math.min(100, Math.floor(((r.maxCooldownSeconds - nextCool) / r.maxCooldownSeconds) * 100));
            return {
              ...r,
              cooldownSeconds: nextCool,
              capacitorCharge: charge,
              status: nextCool === 0 ? 'online' : 'recharging',
            };
          }
          return r;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalShipsSelected =
    selectedFleet.lightFighters +
    selectedFleet.heavyCruisers +
    selectedFleet.battleships +
    selectedFleet.battlecruisers +
    selectedFleet.deathstars +
    selectedFleet.largeCargos +
    selectedFleet.recyclers;

  const handleSelectAllShips = () => {
    sound.play('click');
    setSelectedFleet({ ...originRelay.stationedFleet });
  };

  const handleClearShips = () => {
    sound.play('click');
    setSelectedFleet({
      lightFighters: 0,
      heavyCruisers: 0,
      battleships: 0,
      battlecruisers: 0,
      deathstars: 0,
      largeCargos: 0,
      recyclers: 0,
    });
  };

  const handleShipChange = (key: keyof JumpGateFleetComposition, val: number) => {
    const maxVal = originRelay.stationedFleet[key];
    const clamped = Math.max(0, Math.min(maxVal, val));
    setSelectedFleet((prev) => ({ ...prev, [key]: clamped }));
  };

  const handleExecuteJump = () => {
    if (originGateId === destGateId) {
      sound.play('warning');
      onLogDebrief('Jump Gate Error: Origin and Destination relays cannot be identical!');
      return;
    }

    if (originRelay.status !== 'online' || originRelay.cooldownSeconds > 0) {
      sound.play('warning');
      onLogDebrief(`Jump Gate capacitor is recharging! (${originRelay.cooldownSeconds}s remaining).`);
      return;
    }

    if (destRelay.status !== 'online' || destRelay.cooldownSeconds > 0) {
      sound.play('warning');
      onLogDebrief(`Destination gate [${destRelay.name}] capacitor is recharging! (${destRelay.cooldownSeconds}s remaining).`);
      return;
    }

    if (totalShipsSelected === 0) {
      sound.play('warning');
      onLogDebrief('No vessels assigned to the subspace jump transit!');
      return;
    }

    if (totalShipsSelected > originRelay.maxFleetDisplacement) {
      sound.play('warning');
      onLogDebrief(`Displacement Limit Exceeded! Max transit capacity is ${originRelay.maxFleetDisplacement.toLocaleString()} ships.`);
      return;
    }

    setIsJumping(true);
    sound.play('jump_gate');

    setTimeout(() => {
      setIsJumping(false);

      // Move fleet from origin to destination
      setRelays((prev) =>
        prev.map((r) => {
          if (r.id === originRelay.id) {
            return {
              ...r,
              status: 'recharging',
              cooldownSeconds: r.maxCooldownSeconds,
              capacitorCharge: 0,
              stationedFleet: {
                lightFighters: r.stationedFleet.lightFighters - selectedFleet.lightFighters,
                heavyCruisers: r.stationedFleet.heavyCruisers - selectedFleet.heavyCruisers,
                battleships: r.stationedFleet.battleships - selectedFleet.battleships,
                battlecruisers: r.stationedFleet.battlecruisers - selectedFleet.battlecruisers,
                deathstars: r.stationedFleet.deathstars - selectedFleet.deathstars,
                largeCargos: r.stationedFleet.largeCargos - selectedFleet.largeCargos,
                recyclers: r.stationedFleet.recyclers - selectedFleet.recyclers,
              },
            };
          }
          if (r.id === destRelay.id) {
            return {
              ...r,
              status: 'recharging',
              cooldownSeconds: r.maxCooldownSeconds,
              capacitorCharge: 0,
              stationedFleet: {
                lightFighters: r.stationedFleet.lightFighters + selectedFleet.lightFighters,
                heavyCruisers: r.stationedFleet.heavyCruisers + selectedFleet.heavyCruisers,
                battleships: r.stationedFleet.battleships + selectedFleet.battleships,
                battlecruisers: r.stationedFleet.battlecruisers + selectedFleet.battlecruisers,
                deathstars: r.stationedFleet.deathstars + selectedFleet.deathstars,
                largeCargos: r.stationedFleet.largeCargos + selectedFleet.largeCargos,
                recyclers: r.stationedFleet.recyclers + selectedFleet.recyclers,
              },
            };
          }
          return r;
        })
      );

      sound.play('success');
      onLogDebrief(
        `Subspace Compression Warp Executed! ${totalShipsSelected.toLocaleString()} vessels teleported instantaneously from ${originRelay.name} to ${destRelay.name} with 0 Deuterium burn.`
      );

      // Reset selection
      handleClearShips();
    }, 1200);
  };

  const handleCoolantFlush = (relayId: string) => {
    const costNaq = 50000;
    if (resources.naquadah < costNaq) {
      sound.play('warning');
      onLogDebrief(`Insufficient Naquadah to flush coolant heatsinks! (Requires ${costNaq.toLocaleString()} Naquadah).`);
      return;
    }

    onUpdateResources({ naquadah: resources.naquadah - costNaq });
    sound.play('confirm');

    setRelays((prev) =>
      prev.map((r) =>
        r.id === relayId
          ? {
              ...r,
              cooldownSeconds: 0,
              capacitorCharge: 100,
              status: 'online',
            }
          : r
      )
    );

    onLogDebrief(`Emergency Coolant Injected! Relay capacitor recharged instantly to 100%.`);
  };

  const handleUpgradeRelay = (relayId: string, upgradeType: 'level' | 'coolant' | 'stabilizer') => {
    const costNaq = 100000;
    const costCryst = 60000;

    if (resources.naquadah < costNaq || (resources.crystal ?? 0) < costCryst) {
      sound.play('warning');
      onLogDebrief(`Insufficient resources for upgrade! Requires ${costNaq.toLocaleString()} Naquadah and ${costCryst.toLocaleString()} Crystal.`);
      return;
    }

    onUpdateResources({
      naquadah: resources.naquadah - costNaq,
      crystal: (resources.crystal ?? 0) - costCryst,
    });
    sound.play('research');

    setRelays((prev) =>
      prev.map((r) => {
        if (r.id === relayId) {
          if (upgradeType === 'level') {
            return {
              ...r,
              level: r.level + 1,
              maxFleetDisplacement: r.maxFleetDisplacement + 10000,
            };
          } else if (upgradeType === 'coolant') {
            const newMaxCool = Math.max(30, r.maxCooldownSeconds - 15);
            return {
              ...r,
              quantumCoolantLevel: r.quantumCoolantLevel + 1,
              maxCooldownSeconds: newMaxCool,
            };
          } else {
            return {
              ...r,
              tachyonStabilizerLevel: r.tachyonStabilizerLevel + 1,
            };
          }
        }
        return r;
      })
    );

    onLogDebrief(`Relay upgraded successfully! Upgraded ${upgradeType} on ${relays.find(r => r.id === relayId)?.name}.`);
  };

  return (
    <div id="subspace-jump-gate-panel" className="space-y-6">
      {/* Top Banner Info */}
      <div className="bg-white border border-[#dedede] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
            GAME SUBSPACE RELAY MATRIX · ZERO DEUTERIUM FLEET TELEPORTATION
          </span>
          <h3 className="text-xl font-bold text-[#111111]">Lunar & Starbase Jump Gate Network</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed">
            Instantaneous mass-displacement gateways established across orbital moon bases and starbases.
            Transports entire battle armadas across galactic sectors with <strong>zero travel duration</strong> and{' '}
            <strong>zero deuterium fuel consumption</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 bg-[#fafafa] border border-[#dedede] text-right">
            <span className="text-[9px] text-[#777777] uppercase block font-bold">Active Gate Nodes</span>
            <strong className="text-sm font-bold text-[#111111]">{relays.length} Relays</strong>
          </div>
          <div className="p-3 bg-[#fafafa] border border-[#dedede] text-right">
            <span className="text-[9px] text-[#777777] uppercase block font-bold">Fuel Burn Rate</span>
            <strong className="text-sm font-bold text-emerald-700">0 Deuterium</strong>
          </div>
        </div>
      </div>

      {/* Gate Corridor Selector: Origin vs Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin Gate Card */}
        <div className="bg-white border border-[#dedede] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <span className="text-[10px] font-mono font-bold text-[#777777] uppercase">
              1. ORIGIN JUMP GATE (DEPARTURE)
            </span>
            <span
              className={`px-2 py-0.5 text-[9px] font-bold uppercase font-mono border ${
                originRelay.status === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {originRelay.status === 'online' ? 'Capacitor Ready (100%)' : `Cooling (${originRelay.cooldownSeconds}s)`}
            </span>
          </div>

          <select
            value={originGateId}
            onChange={(e) => {
              sound.play('click');
              setOriginGateId(e.target.value);
            }}
            className="w-full py-2 px-3 bg-[#fafafa] border border-[#dedede] font-bold text-xs font-mono text-[#111111] cursor-pointer"
          >
            {relays.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} - {r.sectorCoordinates} ({r.hubType})
              </option>
            ))}
          </select>

          {/* Capacitor Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#777777]">
              <span>Capacitor Charge</span>
              <span>{originRelay.capacitorCharge}%</span>
            </div>
            <div className="w-full h-2 bg-[#eeeeee] overflow-hidden">
              <div
                style={{ width: `${originRelay.capacitorCharge}%` }}
                className={`h-full transition-all duration-300 ${
                  originRelay.status === 'online' ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>

          {originRelay.cooldownSeconds > 0 && (
            <button
              type="button"
              onClick={() => handleCoolantFlush(originRelay.id)}
              className="w-full py-1.5 bg-[#fafafa] hover:bg-neutral-100 border border-[#dedede] text-[10px] font-bold uppercase font-mono text-[#111111] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap size={12} className="text-amber-500" />
              <span>Flush Coolant Heatsink (50,000 Naquadah)</span>
            </button>
          )}
        </div>

        {/* Destination Gate Card */}
        <div className="bg-white border border-[#dedede] p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
            <span className="text-[10px] font-mono font-bold text-[#777777] uppercase">
              2. DESTINATION JUMP GATE (ARRIVAL)
            </span>
            <span
              className={`px-2 py-0.5 text-[9px] font-bold uppercase font-mono border ${
                destRelay.status === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {destRelay.status === 'online' ? 'Capacitor Ready (100%)' : `Cooling (${destRelay.cooldownSeconds}s)`}
            </span>
          </div>

          <select
            value={destGateId}
            onChange={(e) => {
              sound.play('click');
              setDestGateId(e.target.value);
            }}
            className="w-full py-2 px-3 bg-[#fafafa] border border-[#dedede] font-bold text-xs font-mono text-[#111111] cursor-pointer"
          >
            {relays.map((r) => (
              <option key={r.id} value={r.id} disabled={r.id === originGateId}>
                {r.name} - {r.sectorCoordinates} ({r.hubType})
              </option>
            ))}
          </select>

          {/* Capacitor Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#777777]">
              <span>Capacitor Charge</span>
              <span>{destRelay.capacitorCharge}%</span>
            </div>
            <div className="w-full h-2 bg-[#eeeeee] overflow-hidden">
              <div
                style={{ width: `${destRelay.capacitorCharge}%` }}
                className={`h-full transition-all duration-300 ${
                  destRelay.status === 'online' ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>

          {destRelay.cooldownSeconds > 0 && (
            <button
              type="button"
              onClick={() => handleCoolantFlush(destRelay.id)}
              className="w-full py-1.5 bg-[#fafafa] hover:bg-neutral-100 border border-[#dedede] text-[10px] font-bold uppercase font-mono text-[#111111] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap size={12} className="text-amber-500" />
              <span>Flush Coolant Heatsink (50,000 Naquadah)</span>
            </button>
          )}
        </div>
      </div>

      {/* Fleet Cargo Selector & Jump Action */}
      <div className="bg-white border border-[#dedede] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-mono">
              Stationed Armada Dispatch Matrix
            </h4>
            <span className="text-xs text-[#777777]">
              Select vessels currently docked at {originRelay.name} for instantaneous quantum relocation.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllShips}
              className="px-2.5 py-1 bg-[#fafafa] border border-[#dedede] text-[10px] font-bold uppercase font-mono hover:border-[#111111] cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearShips}
              className="px-2.5 py-1 bg-[#fafafa] border border-[#dedede] text-[10px] font-bold uppercase font-mono hover:border-[#111111] cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Ship Types Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {(
            [
              { key: 'lightFighters', label: 'Light Fighter', max: originRelay.stationedFleet.lightFighters },
              { key: 'heavyCruisers', label: 'Heavy Cruiser', max: originRelay.stationedFleet.heavyCruisers },
              { key: 'battleships', label: 'Battleship', max: originRelay.stationedFleet.battleships },
              { key: 'battlecruisers', label: 'Battlecruiser', max: originRelay.stationedFleet.battlecruisers },
              { key: 'deathstars', label: 'Deathstar / Ripstar', max: originRelay.stationedFleet.deathstars },
              { key: 'largeCargos', label: 'Large Cargo', max: originRelay.stationedFleet.largeCargos },
              { key: 'recyclers', label: 'Recycler', max: originRelay.stationedFleet.recyclers },
            ] as const
          ).map((ship) => (
            <div key={ship.key} className="p-3 bg-[#fafafa] border border-[#dedede] space-y-2">
              <span className="text-[10px] font-bold text-[#777777] uppercase block font-mono truncate">
                {ship.label}
              </span>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#999999]">Avail:</span>
                <strong className="text-[#111111]">{ship.max.toLocaleString()}</strong>
              </div>
              <input
                type="number"
                min={0}
                max={ship.max}
                value={selectedFleet[ship.key]}
                onChange={(e) => handleShipChange(ship.key, parseInt(e.target.value) || 0)}
                className="w-full text-xs font-mono font-bold text-[#111111] bg-white border border-[#dedede] p-1.5 text-center focus:outline-none focus:border-[#111111]"
              />
            </div>
          ))}
        </div>

        {/* Displacement Bar & Execution Button */}
        <div className="pt-3 border-t border-[#eeeeee] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-mono text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[#777777]">Total Ships:</span>
              <strong className="text-base text-[#111111]">{totalShipsSelected.toLocaleString()}</strong>
              <span className="text-[#777777]">/ Max {originRelay.maxFleetDisplacement.toLocaleString()} limit</span>
            </div>
            <span className="text-[10px] text-emerald-700 block">
              Transit Fuel Cost: 0 Deuterium · Flight Time: 00:00:00 (Instantaneous)
            </span>
          </div>

          <button
            type="button"
            id="execute-jump-btn"
            disabled={
              isJumping ||
              totalShipsSelected === 0 ||
              originRelay.status !== 'online' ||
              destRelay.status !== 'online' ||
              originGateId === destGateId
            }
            onClick={handleExecuteJump}
            className="py-3.5 px-6 bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider font-mono transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border border-[#111111]"
          >
            <Rocket size={15} className="text-amber-400" />
            <span>
              {isJumping
                ? 'Compressing Subspace Corridor...'
                : `Engage Subspace Jump (${totalShipsSelected.toLocaleString()} Vessels) →`}
            </span>
          </button>
        </div>
      </div>

      {/* Jump Gate Engineering & Facility Upgrades */}
      <div className="border border-[#dedede] bg-white p-6 space-y-4">
        <div className="border-b border-[#eeeeee] pb-3">
          <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider font-mono">
            Jump Gate Facility Upgrades ({originRelay.name})
          </h4>
          <span className="text-xs text-[#777777]">
            Enhance gate aperture displacement mass, overclock quantum coolant heatsinks, and reinforce tachyon stabilizers.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level Upgrade */}
          <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111] uppercase font-mono">Gate Aperture</span>
                <span className="text-xs font-mono font-bold text-[#555555]">Lvl {originRelay.level}</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                Expands gate event horizon diameter to handle +10,000 ships per instantaneous jump.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpgradeRelay(originRelay.id, 'level')}
              className="w-full py-2 bg-white border border-[#dedede] hover:border-[#111111] text-[10px] font-bold uppercase font-mono text-[#111111] cursor-pointer"
            >
              Upgrade (100k Naq / 60k Cryst)
            </button>
          </div>

          {/* Coolant Upgrade */}
          <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111] uppercase font-mono">Quantum Coolant</span>
                <span className="text-xs font-mono font-bold text-[#555555]">Lvl {originRelay.quantumCoolantLevel}</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                Liquid argon micro-conduits reduce recharge cooldown time by 15 seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpgradeRelay(originRelay.id, 'coolant')}
              className="w-full py-2 bg-white border border-[#dedede] hover:border-[#111111] text-[10px] font-bold uppercase font-mono text-[#111111] cursor-pointer"
            >
              Upgrade (100k Naq / 60k Cryst)
            </button>
          </div>

          {/* Stabilizer Upgrade */}
          <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111] uppercase font-mono">Tachyon Stabilizer</span>
                <span className="text-xs font-mono font-bold text-[#555555]">Lvl {originRelay.tachyonStabilizerLevel}</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                Prevents subspace rift shear and shields capital ships from gravitational stress.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpgradeRelay(originRelay.id, 'stabilizer')}
              className="w-full py-2 bg-white border border-[#dedede] hover:border-[#111111] text-[10px] font-bold uppercase font-mono text-[#111111] cursor-pointer"
            >
              Upgrade (100k Naq / 60k Cryst)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
