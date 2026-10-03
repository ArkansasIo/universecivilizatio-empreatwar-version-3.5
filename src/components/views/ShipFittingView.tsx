import React, { useState } from 'react';
import { Shield, Zap, Crosshair, Wrench, RefreshCw, Cpu, Layers, Disc, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources } from '../../types';

interface ShipFittingViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
}

interface ArmorResistanceProfile {
  type: 'Kinetic' | 'Thermal' | 'Explosive' | 'Corrosive' | 'Graviton' | 'Neutron';
  baseResist: number;
  bonusResist: number;
  description: string;
  color: string;
}

interface FittingModule {
  id: string;
  name: string;
  slot: 'high' | 'med' | 'low' | 'rig';
  tier: number;
  cpu: number;
  powergrid: number;
  capDrain: number;
  dpsBonus?: number;
  shieldBonus?: number;
  armorBonus?: number;
  speedBonus?: number;
  resistBonus?: { type: string; value: number };
  description: string;
  costMetal: number;
  costCrystal: number;
  costDeuterium: number;
}

const SHIP_HULLS = [
  { id: 'frigate_interceptor', name: 'Cerberus Fast Interceptor', tier: 1, baseHp: 4500, baseShield: 3000, baseArmor: 2500, cpuCapacity: 180, powergridCapacity: 65, highSlots: 3, medSlots: 3, lowSlots: 2, rigSlots: 2, speed: 420 },
  { id: 'destroyer_assault', name: 'Vindicator Heavy Destroyer', tier: 3, baseHp: 12000, baseShield: 8500, baseArmor: 9000, cpuCapacity: 340, powergridCapacity: 140, highSlots: 5, medSlots: 4, lowSlots: 3, rigSlots: 2, speed: 310 },
  { id: 'cruiser_strike', name: 'Hyperion Battlecruiser', tier: 5, baseHp: 28000, baseShield: 22000, baseArmor: 24000, cpuCapacity: 580, powergridCapacity: 320, highSlots: 6, medSlots: 5, lowSlots: 5, rigSlots: 3, speed: 220 },
  { id: 'battleship_dread', name: 'Apocalypse Command Battleship', tier: 8, baseHp: 75000, baseShield: 65000, baseArmor: 80000, cpuCapacity: 920, powergridCapacity: 750, highSlots: 8, medSlots: 6, lowSlots: 7, rigSlots: 3, speed: 140 },
  { id: 'titan_colossus', name: 'Ragnarok Stellar Titan Flagship', tier: 12, baseHp: 320000, baseShield: 280000, baseArmor: 350000, cpuCapacity: 2400, powergridCapacity: 2200, highSlots: 10, medSlots: 8, lowSlots: 8, rigSlots: 4, speed: 75 },
];

const MODULE_CATALOG: FittingModule[] = [
  // High Slots (Weapons)
  { id: 'h_tachyon_lance', name: 'Tachyon Beam Lance IX', slot: 'high', tier: 4, cpu: 75, powergrid: 95, capDrain: 18, dpsBonus: 340, description: 'Long-range coherent energy beam dealing severe Thermal & Neutron damage.', costMetal: 45000, costCrystal: 32000, costDeuterium: 15000 },
  { id: 'h_gauss_cannon', name: 'Heavy Gauss Rail Cannon', slot: 'high', tier: 3, cpu: 45, powergrid: 80, capDrain: 5, dpsBonus: 280, description: 'High-velocity kinetic accelerator piercing dense bulkheads.', costMetal: 50000, costCrystal: 20000, costDeuterium: 8000 },
  { id: 'h_plasma_battery', name: 'Superheated Plasma Battery', slot: 'high', tier: 3, cpu: 60, powergrid: 70, capDrain: 14, dpsBonus: 310, description: 'Fires magnetic plasma orbs delivering explosive & thermal devastation.', costMetal: 38000, costCrystal: 42000, costDeuterium: 18000 },
  { id: 'h_torpedo_launcher', name: 'Antimatter Torpedo Bay', slot: 'high', tier: 4, cpu: 68, powergrid: 60, capDrain: 8, dpsBonus: 380, description: 'Massive blast payload with high explosive and gravimetric radius.', costMetal: 60000, costCrystal: 25000, costDeuterium: 24000 },
  { id: 'h_ion_disruptor', name: 'Ion Pulse Disruptor Beam', slot: 'high', tier: 2, cpu: 55, powergrid: 45, capDrain: 12, dpsBonus: 190, description: 'Overloads target shields and drains enemy capacitor reserves.', costMetal: 28000, costCrystal: 35000, costDeuterium: 12000 },

  // Medium Slots (Shields & Propulsion)
  { id: 'm_large_shield_extender', name: 'Multispectral Shield Matrix Tier IV', slot: 'med', tier: 3, cpu: 52, powergrid: 65, capDrain: 0, shieldBonus: 9500, description: 'Extends raw shield capacity and passive buffer pool.', costMetal: 32000, costCrystal: 48000, costDeuterium: 10000 },
  { id: 'm_shield_booster', name: 'Capacitive Shield Booster Unit', slot: 'med', tier: 4, cpu: 64, powergrid: 85, capDrain: 25, shieldBonus: 5000, description: 'Active pulse booster rapidly restoring shield HP every cycle.', costMetal: 35000, costCrystal: 55000, costDeuterium: 20000 },
  { id: 'm_microwarpdrive', name: '500MN Quad-Core Microwarpdrive', slot: 'med', tier: 3, cpu: 45, powergrid: 110, capDrain: 30, speedBonus: 180, description: 'Sub-light acceleration unit increasing tactical sub-warp velocity.', costMetal: 40000, costCrystal: 30000, costDeuterium: 15000 },
  { id: 'm_target_painter', name: 'Holographic Target Illuminator', slot: 'med', tier: 2, cpu: 38, powergrid: 25, capDrain: 10, dpsBonus: 65, description: 'Increases target signature radius allowing weapons to deal maximum alpha.', costMetal: 15000, costCrystal: 28000, costDeuterium: 8000 },
  { id: 'm_adaptive_invuln', name: 'Adaptive Deflection Screen', slot: 'med', tier: 3, cpu: 44, powergrid: 40, capDrain: 15, resistBonus: { type: 'All', value: 18 }, description: 'Dynamically shifts deflector field harmonic frequency across all spectra.', costMetal: 25000, costCrystal: 45000, costDeuterium: 18000 },

  // Low Slots (Armor & Engineering)
  { id: 'l_tungsten_plates', name: '1600mm Crystalline Tungsten Armor', slot: 'low', tier: 3, cpu: 22, powergrid: 85, capDrain: 0, armorBonus: 14000, description: 'Heavy reinforced plating providing massive passive armor buffer.', costMetal: 65000, costCrystal: 12000, costDeuterium: 5000 },
  { id: 'l_reactive_armor', name: 'Reactive Nanite Plating Matrix', slot: 'low', tier: 4, cpu: 30, powergrid: 50, capDrain: 8, armorBonus: 8000, resistBonus: { type: 'Kinetic', value: 25 }, description: 'Self-repairing nanite layer reacting to kinetic and explosive shells.', costMetal: 50000, costCrystal: 38000, costDeuterium: 15000 },
  { id: 'l_heat_sink', name: 'Superconducting Magnetic Heat Sink', slot: 'low', tier: 3, cpu: 28, powergrid: 35, capDrain: 0, dpsBonus: 110, description: 'Dissipates weapon heat allowing faster energy weapon cycle rate.', costMetal: 28000, costCrystal: 40000, costDeuterium: 10000 },
  { id: 'l_damage_control', name: 'Damage Control Unit T-IV', slot: 'low', tier: 4, cpu: 35, powergrid: 20, capDrain: 5, resistBonus: { type: 'All', value: 15 }, description: 'Reinforces structural bulkheads and all 6 armor resistance layers.', costMetal: 30000, costCrystal: 35000, costDeuterium: 12000 },
  { id: 'l_power_diagnostic', name: 'Power Diagnostic Auxiliary System', slot: 'low', tier: 2, cpu: 15, powergrid: -45, capDrain: 0, description: 'Injects additional MW into the main reactor powergrid bus.', costMetal: 20000, costCrystal: 25000, costDeuterium: 8000 },

  // Rigs
  { id: 'r_cdfe', name: 'Core Defense Field Extender Rig', slot: 'rig', tier: 3, cpu: 0, powergrid: 0, capDrain: 0, shieldBonus: 8000, description: 'Integrated hull modification amplifying deflector coherence.', costMetal: 40000, costCrystal: 45000, costDeuterium: 20000 },
  { id: 'r_trimark', name: 'Trimark Armor Pump Subsystem', slot: 'rig', tier: 3, cpu: 0, powergrid: 0, capDrain: 0, armorBonus: 11000, description: 'Micro-hydraulic reinforcement struts augmenting armor mass.', costMetal: 55000, costCrystal: 25000, costDeuterium: 15000 },
  { id: 'r_burst_aerator', name: 'Energy Weapon Burst Aerator Rig', slot: 'rig', tier: 3, cpu: 0, powergrid: 0, capDrain: 0, dpsBonus: 140, description: 'Enhances energy capacitor discharge velocity to weapon hardpoints.', costMetal: 30000, costCrystal: 50000, costDeuterium: 22000 },
];

export const ShipFittingView: React.FC<ShipFittingViewProps> = ({ resources, onUpdateResources }) => {
  const [selectedHullId, setSelectedHullId] = useState<string>('cruiser_strike');
  const [activeTab, setActiveTab] = useState<'fitting' | 'armor6' | 'simulation'>('fitting');
  
  // Equipped slots: array of module ids
  const [highFittings, setHighFittings] = useState<(string | null)[]>([
    'h_tachyon_lance', 'h_gauss_cannon', 'h_plasma_battery', null, null, null
  ]);
  const [medFittings, setMedFittings] = useState<(string | null)[]>([
    'm_large_shield_extender', 'm_microwarpdrive', 'm_adaptive_invuln', null, null
  ]);
  const [lowFittings, setLowFittings] = useState<(string | null)[]>([
    'l_tungsten_plates', 'l_reactive_armor', 'l_heat_sink', 'l_damage_control', null
  ]);
  const [rigFittings, setRigFittings] = useState<(string | null)[]>([
    'r_cdfe', 'r_trimark', null
  ]);

  const [simResults, setSimResults] = useState<string | null>(null);

  const hull = SHIP_HULLS.find((h) => h.id === selectedHullId) || SHIP_HULLS[2];

  // Helper to retrieve module by id
  const getMod = (id: string | null) => MODULE_CATALOG.find((m) => m.id === id);

  // Compute total CPU & Powergrid
  const equippedHigh = highFittings.slice(0, hull.highSlots).map(getMod).filter(Boolean) as FittingModule[];
  const equippedMed = medFittings.slice(0, hull.medSlots).map(getMod).filter(Boolean) as FittingModule[];
  const equippedLow = lowFittings.slice(0, hull.lowSlots).map(getMod).filter(Boolean) as FittingModule[];
  const equippedRig = rigFittings.slice(0, hull.rigSlots).map(getMod).filter(Boolean) as FittingModule[];

  const allEquipped = [...equippedHigh, ...equippedMed, ...equippedLow, ...equippedRig];

  const totalCpuUsed = allEquipped.reduce((sum, m) => sum + m.cpu, 0);
  const totalPowergridUsed = allEquipped.reduce((sum, m) => sum + m.powergrid, 0);
  const totalDps = 120 + allEquipped.reduce((sum, m) => sum + (m.dpsBonus || 0), 0);
  const totalShield = hull.baseShield + allEquipped.reduce((sum, m) => sum + (m.shieldBonus || 0), 0);
  const totalArmor = hull.baseArmor + allEquipped.reduce((sum, m) => sum + (m.armorBonus || 0), 0);
  const totalSpeed = hull.speed + allEquipped.reduce((sum, m) => sum + (m.speedBonus || 0), 0);

  // Six-Type Armor Resistances (Feature 11)
  const armorProfiles: ArmorResistanceProfile[] = [
    { type: 'Kinetic', baseResist: 45, bonusResist: (allEquipped.some(m => m.id === 'l_reactive_armor') ? 25 : 0) + (allEquipped.some(m => m.id === 'l_damage_control') ? 15 : 0), description: 'Mitigates mass-driver rounds, railguns, and kinetic projectile artillery.', color: '#3b82f6' },
    { type: 'Thermal', baseResist: 40, bonusResist: (allEquipped.some(m => m.id === 'm_adaptive_invuln') ? 18 : 0) + (allEquipped.some(m => m.id === 'l_damage_control') ? 15 : 0), description: 'Deflects coherent laser beams, particle lances, and plasma arcs.', color: '#f97316' },
    { type: 'Explosive', baseResist: 35, bonusResist: (allEquipped.some(m => m.id === 'l_tungsten_plates') ? 20 : 0) + (allEquipped.some(m => m.id === 'l_damage_control') ? 15 : 0), description: 'Absorbs concussion waves from high-yield antimatter torpedoes and missiles.', color: '#ef4444' },
    { type: 'Corrosive', baseResist: 30, bonusResist: (allEquipped.some(m => m.id === 'l_damage_control') ? 15 : 0), description: 'Protects bulkheads against acidic bio-weapons and nanite decay swarms.', color: '#10b981' },
    { type: 'Graviton', baseResist: 25, bonusResist: (allEquipped.some(m => m.id === 'm_adaptive_invuln') ? 18 : 0) + (allEquipped.some(m => m.id === 'l_damage_control') ? 15 : 0), description: 'Counteracts localized space-time shear and singularity cannons.', color: '#8b5cf6' },
    { type: 'Neutron', baseResist: 30, bonusResist: (allEquipped.some(m => m.id === 'l_tungsten_plates') ? 15 : 0) + (allEquipped.some(m => m.id === 'l_damage_control') ? 15 : 0), description: 'Dense atomic lattice shielding against sub-atomic radiation sweeps.', color: '#06b6d4' },
  ];

  const avgResist = armorProfiles.reduce((sum, p) => sum + Math.min(85, p.baseResist + p.bonusResist), 0) / armorProfiles.length;
  const effectiveHitPoints = Math.round((hull.baseHp + totalShield + totalArmor) / (1 - avgResist / 100));

  const handleInstallModule = (slotType: 'high' | 'med' | 'low' | 'rig', slotIndex: number, moduleId: string) => {
    sound.play('confirm');
    if (slotType === 'high') {
      const copy = [...highFittings];
      copy[slotIndex] = moduleId;
      setHighFittings(copy);
    } else if (slotType === 'med') {
      const copy = [...medFittings];
      copy[slotIndex] = moduleId;
      setMedFittings(copy);
    } else if (slotType === 'low') {
      const copy = [...lowFittings];
      copy[slotIndex] = moduleId;
      setLowFittings(copy);
    } else if (slotType === 'rig') {
      const copy = [...rigFittings];
      copy[slotIndex] = moduleId;
      setRigFittings(copy);
    }
  };

  const handleRemoveModule = (slotType: 'high' | 'med' | 'low' | 'rig', slotIndex: number) => {
    sound.play('click');
    if (slotType === 'high') {
      const copy = [...highFittings];
      copy[slotIndex] = null;
      setHighFittings(copy);
    } else if (slotType === 'med') {
      const copy = [...medFittings];
      copy[slotIndex] = null;
      setMedFittings(copy);
    } else if (slotType === 'low') {
      const copy = [...lowFittings];
      copy[slotIndex] = null;
      setLowFittings(copy);
    } else if (slotType === 'rig') {
      const copy = [...rigFittings];
      copy[slotIndex] = null;
      setRigFittings(copy);
    }
  };

  const handleRunCombatSimulation = () => {
    sound.play('combat');
    const incomingDps = 850;
    const combatDuration = Math.round(effectiveHitPoints / incomingDps);
    const totalAlpha = totalDps * 5;
    setSimResults(
      `COMBAT SIMULATION RESULT:\nTarget: Orion Pirate Cruiser (65,000 EHP, 550 DPS)\nYour Ship: ${hull.name}\nCalculated DPS: ${totalDps} | Alpha Strike: ${totalAlpha}\nTime to Destroy Target: ${Math.round(65000 / totalDps)} seconds\nTime to Critical Hull Failure: ${combatDuration} seconds\nStatus: VICTORY EXPECTED (Surviving Armor: ${Math.max(15, Math.round(100 - (65000 / totalDps / combatDuration) * 100))}%)`
    );
  };

  return (
    <div className="space-y-6" id="ship-fitting-root">
      {/* Header */}
      <div className="p-6 bg-white border border-[#dedede] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#777777] uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 text-[#111111]" />
            <span>FEATURES 10, 11 & 12 · MODULAR SHIP FITTING & 6-TYPE ARMOR MATRIX</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Ship Fitting & Armor Laboratory</h1>
          <p className="text-xs text-[#555555] mt-1">
            Configure hardpoint modules across High, Medium, Low, and Rig slots with real-time CPU, Powergrid, and Six-Type Armor resistance calculations.
          </p>
        </div>

        {/* Hull Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#333333] uppercase">Active Chassis:</label>
          <select
            value={selectedHullId}
            onChange={(e) => {
              sound.play('click');
              setSelectedHullId(e.target.value);
            }}
            className="px-3 py-2 border border-[#111111] bg-[#fafafa] font-bold text-xs text-[#111111] cursor-pointer"
          >
            {SHIP_HULLS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} (Tier {h.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#dedede] bg-white px-4 pt-2 gap-2">
        <button
          onClick={() => { sound.play('click'); setActiveTab('fitting'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer ${
            activeTab === 'fitting' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Modular Fitting Hardpoints
        </button>
        <button
          onClick={() => { sound.play('click'); setActiveTab('armor6'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer ${
            activeTab === 'armor6' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Six-Type Armor Defenses (Feature 11)
        </button>
        <button
          onClick={() => { sound.play('click'); setActiveTab('simulation'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer ${
            activeTab === 'simulation' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Tactical DPS & Combat Simulator
        </button>
      </div>

      {/* Main Telemetry Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white border border-[#dedede]">
          <div className="text-[10px] font-mono text-[#777777] uppercase flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-blue-600" /> CPU Allocation
          </div>
          <div className="text-base font-bold text-[#111111] mt-1">
            {totalCpuUsed} / {hull.cpuCapacity} <span className="text-xs font-normal text-[#666]">TF</span>
          </div>
          <div className="w-full bg-[#eee] h-1.5 mt-2">
            <div
              className={`h-full ${totalCpuUsed > hull.cpuCapacity ? 'bg-red-600' : 'bg-blue-600'}`}
              style={{ width: `${Math.min(100, (totalCpuUsed / hull.cpuCapacity) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#dedede]">
          <div className="text-[10px] font-mono text-[#777777] uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Powergrid Bus
          </div>
          <div className="text-base font-bold text-[#111111] mt-1">
            {totalPowergridUsed} / {hull.powergridCapacity} <span className="text-xs font-normal text-[#666]">MW</span>
          </div>
          <div className="w-full bg-[#eee] h-1.5 mt-2">
            <div
              className={`h-full ${totalPowergridUsed > hull.powergridCapacity ? 'bg-red-600' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, (totalPowergridUsed / hull.powergridCapacity) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#dedede]">
          <div className="text-[10px] font-mono text-[#777777] uppercase flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5 text-red-600" /> Firepower (DPS)
          </div>
          <div className="text-base font-bold text-[#111111] mt-1">
            {totalDps.toLocaleString()} <span className="text-xs font-normal text-[#666]">DPS</span>
          </div>
          <div className="text-[11px] text-[#777] mt-1 font-mono">Alpha: {(totalDps * 5).toLocaleString()}</div>
        </div>

        <div className="p-3.5 bg-white border border-[#dedede]">
          <div className="text-[10px] font-mono text-[#777777] uppercase flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> Effective HP (EHP)
          </div>
          <div className="text-base font-bold text-[#111111] mt-1">
            {effectiveHitPoints.toLocaleString()} <span className="text-xs font-normal text-[#666]">EHP</span>
          </div>
          <div className="text-[11px] text-[#777] mt-1 font-mono">Avg Resist: {Math.round(avgResist)}%</div>
        </div>

        <div className="p-3.5 bg-white border border-[#dedede]">
          <div className="text-[10px] font-mono text-[#777777] uppercase flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" /> Shield / Armor
          </div>
          <div className="text-xs font-bold text-[#111111] mt-1">
            S: {totalShield.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-[#111111]">
            A: {totalArmor.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5 bg-white border border-[#dedede]">
          <div className="text-[10px] font-mono text-[#777777] uppercase flex items-center gap-1">
            <Disc className="w-3.5 h-3.5 text-teal-600" /> Velocity
          </div>
          <div className="text-base font-bold text-[#111111] mt-1">
            {totalSpeed} <span className="text-xs font-normal text-[#666]">m/s</span>
          </div>
          <div className="text-[11px] text-[#777] mt-1 font-mono">Agility: 3.2s align</div>
        </div>
      </div>

      {/* Tab: Fitting Hardpoints */}
      {activeTab === 'fitting' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Slots on Ship */}
          <div className="lg:col-span-2 space-y-6">
            {/* High Slots */}
            <div className="p-5 bg-white border border-[#dedede]">
              <div className="flex items-center justify-between border-b border-[#eee] pb-2 mb-3">
                <span className="text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full" /> High Slots (Weapons & Hardpoints) — {hull.highSlots} Slots
                </span>
              </div>
              <div className="space-y-2">
                {Array.from({ length: hull.highSlots }).map((_, idx) => {
                  const mod = getMod(highFittings[idx]);
                  return (
                    <div key={`high-${idx}`} className="p-2.5 border border-[#eee] bg-[#fafafa] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#888] w-5">#{idx + 1}</span>
                        {mod ? (
                          <div>
                            <strong className="text-xs text-[#111111] block">{mod.name}</strong>
                            <span className="text-[10px] text-[#666] font-mono">
                              +{mod.dpsBonus} DPS · CPU: {mod.cpu} · PG: {mod.powergrid}MW
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#aaa] italic">Empty High Slot</span>
                        )}
                      </div>
                      {mod ? (
                        <button
                          onClick={() => handleRemoveModule('high', idx)}
                          className="px-2 py-1 text-[10px] font-mono text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                        >
                          STRIP
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#aaa]">Select Module Below</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Medium Slots */}
            <div className="p-5 bg-white border border-[#dedede]">
              <div className="flex items-center justify-between border-b border-[#eee] pb-2 mb-3">
                <span className="text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" /> Medium Slots (Shields & Propulsion) — {hull.medSlots} Slots
                </span>
              </div>
              <div className="space-y-2">
                {Array.from({ length: hull.medSlots }).map((_, idx) => {
                  const mod = getMod(medFittings[idx]);
                  return (
                    <div key={`med-${idx}`} className="p-2.5 border border-[#eee] bg-[#fafafa] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#888] w-5">#{idx + 1}</span>
                        {mod ? (
                          <div>
                            <strong className="text-xs text-[#111111] block">{mod.name}</strong>
                            <span className="text-[10px] text-[#666] font-mono">
                              {mod.shieldBonus ? `+${mod.shieldBonus} Shield` : mod.speedBonus ? `+${mod.speedBonus} m/s` : 'Resist Screen'} · CPU: {mod.cpu}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#aaa] italic">Empty Medium Slot</span>
                        )}
                      </div>
                      {mod ? (
                        <button
                          onClick={() => handleRemoveModule('med', idx)}
                          className="px-2 py-1 text-[10px] font-mono text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                        >
                          STRIP
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#aaa]">Select Module Below</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Slots */}
            <div className="p-5 bg-white border border-[#dedede]">
              <div className="flex items-center justify-between border-b border-[#eee] pb-2 mb-3">
                <span className="text-xs font-bold uppercase text-[#111111] flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-600 rounded-full" /> Low Slots (Armor Plates & Damage Controls) — {hull.lowSlots} Slots
                </span>
              </div>
              <div className="space-y-2">
                {Array.from({ length: hull.lowSlots }).map((_, idx) => {
                  const mod = getMod(lowFittings[idx]);
                  return (
                    <div key={`low-${idx}`} className="p-2.5 border border-[#eee] bg-[#fafafa] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#888] w-5">#{idx + 1}</span>
                        {mod ? (
                          <div>
                            <strong className="text-xs text-[#111111] block">{mod.name}</strong>
                            <span className="text-[10px] text-[#666] font-mono">
                              {mod.armorBonus ? `+${mod.armorBonus} Armor` : mod.dpsBonus ? `+${mod.dpsBonus} DPS` : 'Resist Unit'} · PG: {mod.powergrid}MW
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#aaa] italic">Empty Low Slot</span>
                        )}
                      </div>
                      {mod ? (
                        <button
                          onClick={() => handleRemoveModule('low', idx)}
                          className="px-2 py-1 text-[10px] font-mono text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                        >
                          STRIP
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#aaa]">Select Module Below</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Module Warehouse Catalog */}
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#dedede]">
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">Module Warehouse Catalog</h3>
              <p className="text-[11px] text-[#666] mb-3">Click on any module to install it into the first available empty slot.</p>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {MODULE_CATALOG.map((mod) => (
                  <div key={mod.id} className="p-3 border border-[#dedede] bg-[#fafafa] hover:border-[#111111] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#111111]">{mod.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 uppercase bg-[#eee] text-[#333]">
                        {mod.slot}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#555] mb-2">{mod.description}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#777] border-t border-[#eee] pt-1.5">
                      <span>CPU: {mod.cpu} · PG: {mod.powergrid}MW</span>
                      <button
                        onClick={() => {
                          const slot = mod.slot;
                          if (slot === 'high') {
                            const emptyIdx = highFittings.findIndex((x) => x === null);
                            if (emptyIdx !== -1 && emptyIdx < hull.highSlots) handleInstallModule('high', emptyIdx, mod.id);
                          } else if (slot === 'med') {
                            const emptyIdx = medFittings.findIndex((x) => x === null);
                            if (emptyIdx !== -1 && emptyIdx < hull.medSlots) handleInstallModule('med', emptyIdx, mod.id);
                          } else if (slot === 'low') {
                            const emptyIdx = lowFittings.findIndex((x) => x === null);
                            if (emptyIdx !== -1 && emptyIdx < hull.lowSlots) handleInstallModule('low', emptyIdx, mod.id);
                          } else if (slot === 'rig') {
                            const emptyIdx = rigFittings.findIndex((x) => x === null);
                            if (emptyIdx !== -1 && emptyIdx < hull.rigSlots) handleInstallModule('rig', emptyIdx, mod.id);
                          }
                        }}
                        className="px-2 py-0.5 bg-[#111111] text-white hover:bg-[#333] cursor-pointer"
                      >
                        FIT MODULE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Six-Type Armor Defenses */}
      {activeTab === 'armor6' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-[#dedede]">
            <h2 className="text-lg font-bold text-[#111111] mb-2">Six-Type Armor Resistance Breakdown (Feature 11)</h2>
            <p className="text-xs text-[#666] mb-6">
              Every ship class features a layered six-spectrum defensive composite. Effective damage is calculated against the specific damage type delivered by the opposing weapon system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {armorProfiles.map((p) => {
                const total = Math.min(85, p.baseResist + p.bonusResist);
                return (
                  <div key={p.type} className="p-4 border border-[#dedede] bg-[#fafafa]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm font-bold text-[#111111]">{p.type} Armor Layer</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-[#111111]">{total}% Resist</span>
                    </div>
                    <div className="w-full bg-[#eee] h-2 mb-3">
                      <div
                        className="h-full"
                        style={{ width: `${total}%`, backgroundColor: p.color }}
                      />
                    </div>
                    <p className="text-xs text-[#555] mb-2">{p.description}</p>
                    <div className="text-[10px] font-mono text-[#777] border-t border-[#eee] pt-2 flex justify-between">
                      <span>Base Lattice: {p.baseResist}%</span>
                      <span>Module Boost: +{p.bonusResist}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tactical Simulation */}
      {activeTab === 'simulation' && (
        <div className="p-6 bg-white border border-[#dedede] space-y-4">
          <h2 className="text-lg font-bold text-[#111111]">Tactical DPS & Combat Simulator</h2>
          <p className="text-xs text-[#666]">
            Simulate 1v1 multi-round engagements against enemy armada templates using your active fitting parameters.
          </p>

          <button
            onClick={handleRunCombatSimulation}
            className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-emerald-400" /> Run Tactical Battle Simulation
          </button>

          {simResults && (
            <div className="p-4 bg-[#111111] text-emerald-400 font-mono text-xs border border-emerald-500 whitespace-pre-wrap">
              {simResults}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
