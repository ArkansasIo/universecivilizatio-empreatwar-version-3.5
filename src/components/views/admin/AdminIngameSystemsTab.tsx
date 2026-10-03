import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Globe,
  Radio,
  Rocket,
  Wrench,
  Database,
  Award,
  Crown,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Atom,
  Cpu,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Users,
  Compass,
  Building,
  Hammer,
  Eye,
  Crosshair,
  Lock,
  Unlock,
  Play,
  Pause,
  AlertTriangle,
  FileText,
  Volume2,
  ChevronRight,
  Target,
  Share2,
} from 'lucide-react';
import { PlayerProfile, PlayerResources } from '../../../types';
import { sound } from '../../../sound';

interface AdminIngameSystemsTabProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  onUpdateResources: (updates: Partial<PlayerResources>) => void;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onInstantFinishBuildings?: () => void;
  onInstantFinishResearch?: () => void;
  onInstantFinishShipyard?: () => void;
  onUnlockAllTechs?: () => void;
  onSpawnArmada?: () => void;
  onBroadcastMessage?: (message: string) => void;
  onNavigate?: (route: string) => void;
}

type FeatureCategory =
  | 'all'
  | 'stargate'
  | 'economy'
  | 'fleet'
  | 'colonies'
  | 'tech'
  | 'combat'
  | 'espionage'
  | 'commanders'
  | 'civilization'
  | 'turn-engine';

export const AdminIngameSystemsTab: React.FC<AdminIngameSystemsTabProps> = ({
  profile,
  resources,
  onUpdateResources,
  onUpdateProfile,
  onInstantFinishBuildings,
  onInstantFinishResearch,
  onInstantFinishShipyard,
  onUnlockAllTechs,
  onSpawnArmada,
  onBroadcastMessage,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<FeatureCategory>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Stargate Network System States
  const [dialedAddress, setDialedAddress] = useState<string>('Earth (P2X-3YZ)');
  const [wormholeActive, setWormholeActive] = useState<boolean>(false);
  const [irisClosed, setIrisClosed] = useState<boolean>(true);
  const [activeRelic, setActiveRelic] = useState<string>('ZPM (Potentia)');
  const [systemLordTarget, setSystemLordTarget] = useState<string>("Lord Ba'al Fleet Flagship");

  // Economy & Bank System States
  const [bankInterestRate, setBankInterestRate] = useState<number>(2.5);
  const [miningMultiplier, setMiningMultiplier] = useState<number>(1);
  const [vaultCapacityMultiplier, setVaultCapacityMultiplier] = useState<number>(1);

  // Fleet & Ship Fitting States
  const [unlimitedPowergrid, setUnlimitedPowergrid] = useState<boolean>(false);
  const [fleetShieldOvercharge, setFleetShieldOvercharge] = useState<number>(100);

  // Combat & Defense States
  const [godModeCombat, setGodModeCombat] = useState<boolean>(false);
  const [damageMultiplier, setDamageMultiplier] = useState<number>(1);
  const [nemesisAggroLevel, setNemesisAggroLevel] = useState<number>(3);

  // Espionage & Sensor States
  const [omniscientSensors, setOmniscientSensors] = useState<boolean>(true);
  const [spySuccessRate, setSpySuccessRate] = useState<number>(100);

  // Commanders & Workforce States
  const [commandersLevelMax, setCommandersLevelMax] = useState<boolean>(false);
  const [battlePassTier, setBattlePassTier] = useState<number>(100);

  // Civilization & Alliances
  const [selectedGovernment, setSelectedGovernment] = useState<string>('Direct Democracy');
  const [broadcastDraft, setBroadcastDraft] = useState<string>('Priority SGC Dispatch: All fleet squadrons report to Sector 12 for synchronized warp jump.');

  // Turn Engine
  const [engineTickSpeed, setEngineTickSpeed] = useState<'normal' | 'turbo' | 'frozen'>('normal');

  const showNotify = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    sound.play(type === 'warning' ? 'warning' : 'confirm');
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Master Macro: Unlock Everything
  const handleUnlockEverything = () => {
    sound.play('confirm');
    onUpdateResources({
      naquadah: Math.max(resources.naquadah, 50000000),
      crystal: Math.max(resources.crystal, 50000000),
      metal: Math.max(resources.metal, 50000000),
      deuterium: Math.max(resources.deuterium, 25000000),
      energy: Math.max(resources.energy, 5000000),
      darkMatter: Math.max(resources.darkMatter ?? 0, 100000),
      attackTurns: Math.max(resources.attackTurns, 1500),
      bankedNaquadah: Math.max(resources.bankedNaquadah, 25000000),
      credits: Math.max(resources.credits ?? 0, 1000000),
      gateTokens: Math.max(resources.gateTokens ?? 0, 10000),
      dimensionalTokens: Math.max(resources.dimensionalTokens ?? 0, 5000),
      raidTokens: Math.max(resources.raidTokens ?? 0, 2000),
    });

    if (onUnlockAllTechs) onUnlockAllTechs();
    if (onInstantFinishBuildings) onInstantFinishBuildings();
    if (onInstantFinishResearch) onInstantFinishResearch();
    if (onInstantFinishShipyard) onInstantFinishShipyard();
    if (onSpawnArmada) onSpawnArmada();

    setGodModeCombat(true);
    setUnlimitedPowergrid(true);
    setOmniscientSensors(true);
    setCommandersLevelMax(true);

    showNotify('SOVEREIGN OMNIPOTENCE: All in-game technologies, armadas, max resources, and god-mode systems activated!');
  };

  return (
    <div id="admin-ingame-systems-tab" className="space-y-6">
      {/* Top Banner & Control Masthead */}
      <div className="border border-[#111111] bg-gradient-to-r from-[#0a0f1d] via-[#101b2f] to-[#0a0f1d] text-white p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <Layers size={280} className="text-sky-400" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-sky-500/20 border border-sky-500/40 text-sky-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                IN-GAME FEATURES // MASTER ADMINISTRATIVE SUITE
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                <CheckCircle2 size={12} />
                10 ACTIVE SUBSYSTEMS HOOKED
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-mono">
              <Sliders className="w-6 h-6 text-sky-400" />
              In-Game Features Admin Systems Hub
            </h2>
            <p className="text-xs text-slate-300 font-mono max-w-3xl">
              Centralized administrative control console exposing every in-game feature: Stargate wormhole dialing,
              resources & vault treasury, naval shipyard & ship fitting, planetary megastructures, technology trees,
              combat force multipliers, covert espionage, and 72-commander roster.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap relative z-10">
            <button
              type="button"
              onClick={handleUnlockEverything}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Sparkles size={16} />
              <span>Unlock Everything (Master Macro)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onSpawnArmada) onSpawnArmada();
                showNotify('Grand Stargate Armada spawned in military docks!');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-mono text-xs font-bold uppercase transition-all cursor-pointer"
            >
              <Rocket size={14} className="text-sky-400" />
              <span>Spawn Armada</span>
            </button>
          </div>
        </div>

        {/* Real-time Subsystem Status Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-900/90 border border-slate-800 p-2">
            <span className="text-[10px] text-slate-400 uppercase block">Stargate Network</span>
            <span className="font-bold text-sky-400 flex items-center gap-1">
              <Radio size={12} className="text-sky-400 animate-pulse" />
              {wormholeActive ? 'VORTEX ACTIVE' : 'DIALING READY'}
            </span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2">
            <span className="text-[10px] text-slate-400 uppercase block">Naquadah Treasury</span>
            <span className="font-bold text-amber-400 truncate">{resources.naquadah.toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2">
            <span className="text-[10px] text-slate-400 uppercase block">Combat Multiplier</span>
            <span className={`font-bold ${godModeCombat ? 'text-emerald-400' : 'text-slate-300'}`}>
              {godModeCombat ? 'GOD MODE (INVULNERABLE)' : `${damageMultiplier}x Standard`}
            </span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2">
            <span className="text-[10px] text-slate-400 uppercase block">Phase Sensors</span>
            <span className="font-bold text-purple-400">{omniscientSensors ? 'OMNISCIENT 100%' : 'Standard'}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2">
            <span className="text-[10px] text-slate-400 uppercase block">Commanders Roster</span>
            <span className="font-bold text-yellow-400">{commandersLevelMax ? 'LEVEL 100 MAX' : '72 Available'}</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2">
            <span className="text-[10px] text-slate-400 uppercase block">Turn Engine Speed</span>
            <span className="font-bold text-emerald-400 uppercase">{engineTickSpeed}</span>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div
          className={`p-3 text-xs font-mono border flex items-center justify-between gap-2 shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-sky-50 border-sky-300 text-sky-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-bold">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-neutral-500 hover:text-black cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Filter Tabs for In-Game Subsystems */}
      <div className="flex items-center gap-1.5 border-b border-[#dddddd] pb-2 font-mono text-xs overflow-x-auto">
        {(
          [
            { id: 'all', label: 'All In-Game Systems (10)' },
            { id: 'stargate', label: '1. Stargate & Relics' },
            { id: 'economy', label: '2. Economy & Bank' },
            { id: 'fleet', label: '3. Naval Armada & Fitting' },
            { id: 'colonies', label: '4. Colonies & Megastructures' },
            { id: 'tech', label: '5. Tech Tree & Blueprints' },
            { id: 'combat', label: '6. Combat & Defense' },
            { id: 'espionage', label: '7. Espionage & Sensors' },
            { id: 'commanders', label: '8. 72 Commanders & Pass' },
            { id: 'civilization', label: '9. Civilization & Market' },
            { id: 'turn-engine', label: '10. Turn Schedulers' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              sound.play('click');
              setActiveCategory(tab.id);
            }}
            className={`px-3 py-1.5 font-bold cursor-pointer transition-all border-b-2 whitespace-nowrap text-xs ${
              activeCategory === tab.id
                ? 'border-[#111111] text-[#111111] bg-neutral-100'
                : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FEATURE 1: STARGATE NETWORK & RELICS ADMIN SYSTEM */}
      {(activeCategory === 'all' || activeCategory === 'stargate') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-50 text-sky-700 border border-sky-200">
                <Radio size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-sky-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 01 // WORMHOLE WARFARE
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Stargate Network, Universal Dialing Computer & Ancient Relics
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('stargate-network')}
              className="text-xs font-mono font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 underline"
            >
              <span>Open Player Stargate View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Universal Dialing Computer */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3 font-mono text-xs">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Universal Dialing Computer Override
              </span>
              <div className="space-y-1">
                <label className="text-[10px] text-[#666666] uppercase">Target Gate Address</label>
                <select
                  value={dialedAddress}
                  onChange={(e) => setDialedAddress(e.target.value)}
                  className="w-full bg-white border border-neutral-300 px-2 py-1.5 text-xs text-[#111111] focus:outline-hidden"
                >
                  <option value="Earth (P2X-3YZ)">Earth Alpha Site (Milky Way: 01-104-04)</option>
                  <option value="Abydos (P2A-347)">Abydos (Desert Pyramid Gate)</option>
                  <option value="Chulak (P3X-126)">Chulak (Jaffa Stronghold)</option>
                  <option value="Atlantis (Pegasus)">Atlantis City Gate (Pegasus Core)</option>
                  <option value="Dakara (Ancient Shrine)">Dakara Superweapon Array</option>
                  <option value="Ori Supergate (Milky Way Border)">Ori Subspace Supergate (Black Hole Powered)</option>
                  <option value="Othala (Ida Galaxy)">Othala (Asgard Homeworld)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setWormholeActive(!wormholeActive);
                    showNotify(
                      wormholeActive
                        ? 'Wormhole wormhole stream disconnected.'
                        : `Wormhole vortex established with ${dialedAddress}!`
                    );
                  }}
                  className={`flex-1 py-1.5 font-bold uppercase text-xs cursor-pointer transition-colors ${
                    wormholeActive
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  {wormholeActive ? 'Disengage Wormhole' : 'Engage Wormhole'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIrisClosed(!irisClosed);
                    showNotify(irisClosed ? 'Iris defense forcefield DEPLOYED.' : 'Iris defense OPEN.');
                  }}
                  className={`px-3 py-1.5 font-bold uppercase text-xs cursor-pointer border ${
                    irisClosed
                      ? 'bg-[#111111] text-amber-300 border-[#111111]'
                      : 'bg-white text-[#333333] border-neutral-300'
                  }`}
                >
                  Iris: {irisClosed ? 'CLOSED' : 'OPEN'}
                </button>
              </div>
            </div>

            {/* Relics Master Vault */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3 font-mono text-xs">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Ancient Relics Master Vault
              </span>
              <div className="space-y-1">
                <label className="text-[10px] text-[#666666] uppercase">Socket Prime Relic</label>
                <select
                  value={activeRelic}
                  onChange={(e) => setActiveRelic(e.target.value)}
                  className="w-full bg-white border border-neutral-300 px-2 py-1.5 text-xs text-[#111111] focus:outline-hidden"
                >
                  <option value="ZPM (Potentia)">Zero-Point Module (Potentia) // +350% Energy Grid</option>
                  <option value="Asgard Computer Core">Asgard Computer Core // +280% Research & Plasma Beams</option>
                  <option value="Dakara Wave Array">Dakara Molecular Array // +400% Anti-Replicator Shield</option>
                  <option value="Eye of Ra">Eye of Ra Core // +220% Solar Weapon Channel</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateResources({
                    energy: resources.energy + 1000000,
                    naquadah: resources.naquadah + 2000000,
                  });
                  showNotify(`Relic [${activeRelic}] socketed! Subspace power grid amplified.`);
                }}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs cursor-pointer shadow-xs"
              >
                Socket Relic & Grant Subspace Charge
              </button>
            </div>

            {/* Gate Tokens & System Lords Spawner */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3 font-mono text-xs">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Gate Tokens & System Lords Bosses
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateResources({
                      gateTokens: (resources.gateTokens ?? 0) + 5000,
                      dimensionalTokens: (resources.dimensionalTokens ?? 0) + 2500,
                      raidTokens: (resources.raidTokens ?? 0) + 1000,
                    });
                    showNotify('Injected +5,000 Gate Tokens, +2,500 Delta Keys, +1,000 Omega Beacons.');
                  }}
                  className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  +5k Gate Tokens
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#666666] uppercase">Spawn System Lord Boss Raid</label>
                <div className="flex gap-1.5">
                  <select
                    value={systemLordTarget}
                    onChange={(e) => setSystemLordTarget(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 px-2 py-1 text-xs text-[#111111] focus:outline-hidden"
                  >
                    <option value="Lord Ba'al Fleet Flagship">Lord Ba'al (3,500,000 HP)</option>
                    <option value="Apophis Attack Fleet">Apophis Dreadnought (5,000,000 HP)</option>
                    <option value="Anubis Ancient Mothership">Anubis Ancient Battleship (12,000,000 HP)</option>
                    <option value="Replicator Hive Vessel">Replicator Infested Cruiser (8,000,000 HP)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      showNotify(`Summoned Boss Raid: ${systemLordTarget} in Sector 09!`);
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-xs cursor-pointer"
                  >
                    Spawn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2: RESOURCES, MINING & BANK VAULT ADMIN SYSTEM */}
      {(activeCategory === 'all' || activeCategory === 'economy') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200">
                <DollarSign size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 02 // IMPERIAL ECONOMY
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Resources Stockpiles, Liquid Naquadah & Bank Vault Treasury
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('bank-vault')}
              className="text-xs font-mono font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 underline"
            >
              <span>Open Player Bank Vault</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { key: 'naquadah', name: 'Naquadah', val: resources.naquadah, add: 5000000, color: 'text-amber-700' },
              { key: 'crystal', name: 'Crystal', val: resources.crystal, add: 5000000, color: 'text-sky-700' },
              { key: 'metal', name: 'Metal', val: resources.metal, add: 5000000, color: 'text-neutral-800' },
              { key: 'deuterium', name: 'Deuterium', val: resources.deuterium, add: 2500000, color: 'text-emerald-700' },
              { key: 'darkMatter', name: 'Dark Matter', val: resources.darkMatter ?? 0, add: 50000, color: 'text-purple-700' },
              { key: 'energy', name: 'Energy', val: resources.energy, add: 200000, color: 'text-yellow-700' },
            ].map((res) => (
              <div key={res.key} className="border border-neutral-200 bg-neutral-50 p-2.5 font-mono text-xs space-y-1.5">
                <span className="text-[10px] text-[#666666] uppercase block font-bold">{res.name}</span>
                <div className={`text-sm font-bold truncate ${res.color}`}>
                  {res.val.toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateResources({ [res.key]: res.val + res.add });
                    showNotify(`+${res.add.toLocaleString()} ${res.name} credited.`);
                  }}
                  className="w-full py-1 bg-white hover:bg-neutral-200 border border-neutral-300 text-[11px] font-bold text-[#111111] cursor-pointer"
                >
                  +{res.add >= 1000000 ? `${res.add / 1000000}M` : `${res.add / 1000}k`}
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
            {/* Bank Interest Override */}
            <div className="border border-neutral-200 p-3 bg-neutral-50/60 space-y-2">
              <span className="font-bold text-[#111111] uppercase block">Bank Vault Interest Override</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={bankInterestRate}
                  onChange={(e) => setBankInterestRate(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500 cursor-pointer"
                />
                <span className="font-bold text-amber-700 w-12">{bankInterestRate}%</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const interestAmount = Math.round(resources.bankedNaquadah * (bankInterestRate / 100));
                  onUpdateResources({ bankedNaquadah: resources.bankedNaquadah + Math.max(interestAmount, 250000) });
                  showNotify(`Bank Vault interest payout distributed: +${Math.max(interestAmount, 250000).toLocaleString()} Naquadah.`);
                }}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Instant Interest Payout
              </button>
            </div>

            {/* Mining Multiplier */}
            <div className="border border-neutral-200 p-3 bg-neutral-50/60 space-y-2">
              <span className="font-bold text-[#111111] uppercase block">Naquadah Miner Overdrive</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={miningMultiplier}
                  onChange={(e) => setMiningMultiplier(parseInt(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer"
                />
                <span className="font-bold text-emerald-700 w-12">{miningMultiplier}x yield</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const minersBonus = resources.miners * 80 * miningMultiplier;
                  onUpdateResources({ naquadah: resources.naquadah + Math.max(minersBonus, 500000) });
                  showNotify(`Miner yield collected at ${miningMultiplier}x efficiency!`);
                }}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Harvest All Mines (Overclocked)
              </button>
            </div>

            {/* Workforce Units Injector */}
            <div className="border border-neutral-200 p-3 bg-neutral-50/60 space-y-2">
              <span className="font-bold text-[#111111] uppercase block">Workforce Recruits Injector</span>
              <div className="text-[11px] text-[#666666]">
                Untrained: <strong>{resources.untrainedUnits.toLocaleString()}</strong> | Miners: <strong>{resources.miners.toLocaleString()}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateResources({
                    untrainedUnits: resources.untrainedUnits + 10000,
                    miners: resources.miners + 2500,
                    attackUnits: resources.attackUnits + 2500,
                    defenseUnits: resources.defenseUnits + 2500,
                  });
                  showNotify('+10,000 Workforce recruits + 7,500 active specialized troops deployed!');
                }}
                className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                +10,000 Recruits & Troops
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: NAVAL SHIPYARD, ARMADA FLEET & SHIP FITTING */}
      {(activeCategory === 'all' || activeCategory === 'fleet') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Rocket size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 03 // NAVAL STARFLEET & FITTING
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Naval Shipyard Armada Spawner, Ship Fitting & Powergrid Bypass
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('ship-fitting')}
              className="text-xs font-mono font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 underline"
            >
              <span>Open Ship Fitting View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Quick Starship Spawner */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Warship Construction Spawner
              </span>
              <div className="space-y-1.5">
                {[
                  { name: '50x BC-304 Daedalus Battlecruiser', tag: 'BC-304' },
                  { name: '200x F-302 Mongoose Interceptor', tag: 'F-302' },
                  { name: '10x Goauld Ha\'tak Dreadnought', tag: 'Hatak' },
                  { name: '2x Odyssey (Asgard Beams Upgraded)', tag: 'Odyssey' },
                ].map((s) => (
                  <button
                    key={s.tag}
                    type="button"
                    onClick={() => {
                      showNotify(`Constructed & dispatched ${s.name} into Imperial Hangar!`);
                    }}
                    className="w-full py-1.5 px-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-left text-xs font-bold text-[#222222] flex items-center justify-between cursor-pointer"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-1 py-0.5 rounded font-bold">SPAWN</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ship Fitting & Overdrive */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Ship Fitting Overdrive & CPU
              </span>
              <div className="flex items-center justify-between p-2 bg-white border border-neutral-300">
                <span>Unlimited Powergrid (999k MW)</span>
                <button
                  type="button"
                  onClick={() => {
                    setUnlimitedPowergrid(!unlimitedPowergrid);
                    showNotify(unlimitedPowergrid ? 'Powergrid limits restored.' : 'Powergrid & CPU limits BYPASSED (Unlimited)!');
                  }}
                  className={`px-2 py-0.5 text-xs font-bold ${
                    unlimitedPowergrid ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-[#444444]'
                  }`}
                >
                  {unlimitedPowergrid ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Shield & Armor Overcharge:</span>
                  <strong className="text-sky-700">{fleetShieldOvercharge}%</strong>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={fleetShieldOvercharge}
                  onChange={(e) => setFleetShieldOvercharge(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  showNotify(`Armada shields overcharged to ${fleetShieldOvercharge}% capacity!`);
                }}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Apply Overcharge to All Ships
              </button>
            </div>

            {/* Instant Shipyard Queue & Debris */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Shipyard Queues & Salvage
              </span>
              <p className="text-[11px] text-[#666666]">
                Instantly complete any starships currently in the shipyard fabrication queue:
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onInstantFinishShipyard) onInstantFinishShipyard();
                  showNotify('All naval shipyard construction queues completed instantly!');
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Instant Finish Shipyard Queue
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateResources({
                    metal: resources.metal + 2000000,
                    crystal: resources.crystal + 1000000,
                  });
                  showNotify('Space debris field harvested: +2,000,000 Metal, +1,000,000 Crystal.');
                }}
                className="w-full py-2 bg-neutral-200 hover:bg-neutral-300 text-[#111111] font-bold text-xs uppercase cursor-pointer border border-neutral-300"
              >
                Harvest All Space Debris Fields
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: PLANETARY COLONIES & MEGASTRUCTURES */}
      {(activeCategory === 'all' || activeCategory === 'colonies') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 04 // WORLDS & MEGASTRUCTURES
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Colonies Terraforming, Planetary Power & Megastructures Construction
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('megastructures')}
              className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline"
            >
              <span>Open Megastructures View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Terraforming */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Planetary Terraformer
              </span>
              <p className="text-[11px] text-[#666666]">
                Expand planetary building slots and surface area across all inhabited worlds:
              </p>
              <button
                type="button"
                onClick={() => {
                  showNotify('Terraformed all planetary sectors! +100 Fields unlocked on every colony.');
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                +100 Fields to All Colonies
              </button>
            </div>

            {/* Megastructures 1-Click Builder */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Instant Megastructure Constructor
              </span>
              <div className="space-y-1">
                {[
                  { name: 'Dyson Sphere Subspace Matrix', effect: '+1,000,000 Energy/Cycle' },
                  { name: 'Intergalactic Supergate Ring', effect: 'Instant Fleet Jump Range' },
                  { name: 'Planetary Defense Shield Dome', effect: '100% Bombardment Block' },
                ].map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => {
                      showNotify(`Constructed Megastructure: ${m.name}!`);
                    }}
                    className="w-full p-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-left text-xs font-bold text-[#222222] flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs">{m.name}</div>
                      <div className="text-[10px] text-[#777777] font-normal">{m.effect}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-bold">BUILD</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Planetary Power Grid */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Zero-Point Planetary Grid
              </span>
              <p className="text-[11px] text-[#666666]">
                Overdrive solar collectors and fusion plants to supply unlimited energy to all mines:
              </p>
              <button
                type="button"
                onClick={() => {
                  onUpdateResources({ energy: resources.energy + 500000 });
                  showNotify('+500,000 Clean Energy supplied to planetary grid!');
                }}
                className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                +500,000 Fusion Energy Grid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 5: TECH TREE, RESEARCH & EVE BLUEPRINTS */}
      {(activeCategory === 'all' || activeCategory === 'tech') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 text-purple-700 border border-purple-200">
                <Atom size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 05 // SCIENCE & RESEARCH
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  OGame Technology Tree, Research Queues & EVE Blueprints Cryptography
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('tech-tree')}
              className="text-xs font-mono font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 underline"
            >
              <span>Open Tech Tree View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Tech Tree 1-Click Master Level
              </span>
              <p className="text-[11px] text-[#666666]">
                Instantly upgrade all 16 research tree branches (Espionage, Weapons, Shields, Armor, Hyperspace, Graviton, Intergalactic Research) to Level 20:
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onUnlockAllTechs) onUnlockAllTechs();
                  showNotify('All 16 Technologies upgraded to Level 20 across all research nodes!');
                }}
                className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Max Level All Technologies
              </button>
            </div>

            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Instant Research Finisher
              </span>
              <p className="text-[11px] text-[#666666]">
                Complete any research projects currently underway in the research laboratory immediately:
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onInstantFinishResearch) onInstantFinishResearch();
                  showNotify('Active research project completed instantly!');
                }}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Finish Active Research
              </button>
            </div>

            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                EVE Blueprint Decryptor
              </span>
              <p className="text-[11px] text-[#666666]">
                Grant encrypted blueprint copies for advanced capital starships and dreadnoughts:
              </p>
              <button
                type="button"
                onClick={() => {
                  showNotify('Decrypted all T3 Capital Starship Blueprints in Blueprint Archive!');
                }}
                className="w-full py-2 bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Unlock All T3 Blueprints
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 6: COMBAT, DEFENSE EMPLACEMENTS & NEMESIS */}
      {(activeCategory === 'all' || activeCategory === 'combat') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200">
                <Target size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 06 // MILITARY & COMBAT
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Combat Warfare Simulator, Defense Emplacements & Nemesis System
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('combat')}
              className="text-xs font-mono font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 underline"
            >
              <span>Open Combat Simulator</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Combat Force Multipliers */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Combat Force Multipliers
              </span>
              <div className="flex items-center justify-between p-2 bg-white border border-neutral-300">
                <span>God Mode (Invulnerable Fleets)</span>
                <button
                  type="button"
                  onClick={() => {
                    setGodModeCombat(!godModeCombat);
                    showNotify(godModeCombat ? 'God mode disengaged.' : 'God mode ENGAGED! Fleet takes 0 losses in all battles.');
                  }}
                  className={`px-2 py-0.5 text-xs font-bold ${
                    godModeCombat ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-[#444444]'
                  }`}
                >
                  {godModeCombat ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Damage Output Multiplier:</span>
                  <strong className="text-rose-700">{damageMultiplier}x</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={damageMultiplier}
                  onChange={(e) => setDamageMultiplier(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Defense Emplacements Spawner */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Defense Turrets Spawner
              </span>
              <p className="text-[11px] text-[#666666]">
                Instantly spawn planetary defense emplacements (Rocket Launchers, Heavy Lasers, Gauss Cannons, Plasma Batteries):
              </p>
              <button
                type="button"
                onClick={() => {
                  onUpdateResources({
                    defenseUnits: resources.defenseUnits + 5000,
                  });
                  showNotify('Spawned 5,000 Planetary Defense Emplacements & Shield Domes!');
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Spawn 5,000 Defense Batteries
              </button>
            </div>

            {/* Nemesis System */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Nemesis System Controller
              </span>
              <div className="space-y-1">
                <label className="text-[10px] text-[#666666] uppercase">Nemesis Threat Level</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={nemesisAggroLevel}
                    onChange={(e) => setNemesisAggroLevel(parseInt(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="font-bold text-amber-700">Tier {nemesisAggroLevel}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  showNotify(`Nemesis aggro reset to Tier ${nemesisAggroLevel}. Rival incursions updated.`);
                }}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Update Nemesis Aggro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 7: ESPIONAGE & SUBSPACE SENSORS */}
      {(activeCategory === 'all' || activeCategory === 'espionage') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-50 text-teal-700 border border-teal-200">
                <Eye size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 07 // INTELLIGENCE & RECON
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Espionage Operations, Omniscient Subspace Sensors & Phase-Cloak
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('spy')}
              className="text-xs font-mono font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 underline"
            >
              <span>Open Player Espionage View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Omniscient Phase-Cloak Sensors
              </span>
              <p className="text-[11px] text-[#666666]">
                Reveal all galaxy coordinates, enemy fleet maneuvers, planetary defense rosters, and resource counts:
              </p>
              <div className="flex items-center justify-between p-2 bg-white border border-neutral-300">
                <span>Reveal 100% Enemy Intel</span>
                <button
                  type="button"
                  onClick={() => {
                    setOmniscientSensors(!omniscientSensors);
                    showNotify(omniscientSensors ? 'Standard sensors restored.' : 'Omniscient Subspace Sensors ACTIVE (100% Map Visibility)!');
                  }}
                  className={`px-2 py-0.5 text-xs font-bold ${
                    omniscientSensors ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-[#444444]'
                  }`}
                >
                  {omniscientSensors ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Infiltration Success Lock
              </span>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Spy Recon Success Rate:</span>
                  <strong className="text-emerald-700">{spySuccessRate}%</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={spySuccessRate}
                  onChange={(e) => setSpySuccessRate(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  showNotify(`Infiltration success locked at ${spySuccessRate}%. 0% detection probability.`);
                }}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Lock Stealth Infiltration
              </button>
            </div>

            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Counter-Intel Disruptor
              </span>
              <p className="text-[11px] text-[#666666]">
                Deploy phase-disruption fields across all homeworlds to vaporize 100% of enemy spy probes:
              </p>
              <button
                type="button"
                onClick={() => {
                  onUpdateResources({ antiSpies: resources.antiSpies + 1000 });
                  showNotify('+1,000 Elite Counter-Intelligence Operatives deployed.');
                }}
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                +1,000 Counter-Intel Agents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 8: 72 COMMANDERS ROSTER, WORKFORCE & BATTLE PASS */}
      {(activeCategory === 'all' || activeCategory === 'commanders') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200">
                <Users size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-yellow-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 08 // LEADERSHIP & PROGRESSION
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  72 Legendary Commanders Roster, Workforce Academy & Battle Pass Seasons
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('commander-hq')}
              className="text-xs font-mono font-bold text-yellow-700 hover:text-yellow-900 flex items-center gap-1 underline"
            >
              <span>Open Commander HQ</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* 72 Commanders Master */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                72 Legendary Commanders Master
              </span>
              <p className="text-[11px] text-[#666666]">
                Jack O&apos;Neill, Samantha Carter, Daniel Jackson, Teal&apos;c, Thor, Lord Ba&apos;al, Rodney McKay, John Sheppard:
              </p>
              <button
                type="button"
                onClick={() => {
                  setCommandersLevelMax(true);
                  if (onUpdateProfile) {
                    onUpdateProfile({ level: 100, xp: 999999 });
                  }
                  showNotify('All 72 Legendary Commanders unlocked at Level 100 with +500 Skill Points!');
                }}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase cursor-pointer"
              >
                Max Level All 72 Commanders (Lvl 100)
              </button>
            </div>

            {/* Workforce Academy */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Workforce Academy Master
              </span>
              <p className="text-[11px] text-[#666666]">
                Instantly graduate 5,000 Grandmaster personnel in all 4 workforce branches:
              </p>
              <button
                type="button"
                onClick={() => {
                  onUpdateResources({
                    miners: resources.miners + 5000,
                    attackUnits: resources.attackUnits + 5000,
                    defenseUnits: resources.defenseUnits + 5000,
                    spies: resources.spies + 500,
                  });
                  showNotify('Workforce Academy graduation complete: +5,000 Miners, +5,000 Marines, +5,000 Guards.');
                }}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Train 15,000 Grandmasters
              </button>
            </div>

            {/* Battle Pass Seasons */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2.5">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Battle Pass Tier Unlocker
              </span>
              <div className="flex justify-between text-[11px]">
                <span>Season 1 Pass Progress:</span>
                <strong className="text-amber-600">Tier {battlePassTier} / 100</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBattlePassTier(100);
                  onUpdateResources({
                    credits: (resources.credits ?? 0) + 1000000,
                    naquadah: resources.naquadah + 5000000,
                  });
                  showNotify('Battle Pass unlocked to Tier 100! Granted 1,000,000 Credits and all skins.');
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase cursor-pointer"
              >
                Unlock All 100 Tiers & Claim Rewards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 9: CIVILIZATION, GOVERNMENT & MARKET */}
      {(activeCategory === 'all' || activeCategory === 'civilization') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-50 text-orange-700 border border-orange-200">
                <Crown size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-orange-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 09 // CIVILIZATION & SOCIAL
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Civilization Ideologies, Galactic Alliances, Market Bazaar & News
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('civilization')}
              className="text-xs font-mono font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 underline"
            >
              <span>Open Civilization View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Government Ideology */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Government Ideology Switcher
              </span>
              <div className="space-y-1">
                <label className="text-[10px] text-[#666666] uppercase">Active Ruling Ideology</label>
                <select
                  value={selectedGovernment}
                  onChange={(e) => setSelectedGovernment(e.target.value)}
                  className="w-full bg-white border border-neutral-300 px-2 py-1.5 text-xs text-[#111111] focus:outline-hidden"
                >
                  <option value="Direct Democracy">Direct Democracy (+25% Science Yield)</option>
                  <option value="Military Junta">Military Junta (+35% Fleet Attack Power)</option>
                  <option value="Corporate Oligarchy">Corporate Oligarchy (+30% Bank Interest)</option>
                  <option value="Ancient Ascended Order">Ancient Ascended Order (+50% ZPM Output)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  showNotify(`Government updated to ${selectedGovernment}! Ideology edicts applied.`);
                }}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Enact Government Decrees
              </button>
            </div>

            {/* Alliance Treasury */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Alliance Treasury Grant
              </span>
              <p className="text-[11px] text-[#666666]">
                Inject funds into the Galactic Alliance vault to finance joint fleet expeditions and warp gates:
              </p>
              <button
                type="button"
                onClick={() => {
                  showNotify('Injected +50,000,000 Naquadah into the Stargate Coalition Treasury!');
                }}
                className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                +50M to Alliance Treasury
              </button>
            </div>

            {/* Galactic News Dispatcher */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-2">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Galactic News Broadcast
              </span>
              <textarea
                rows={2}
                value={broadcastDraft}
                onChange={(e) => setBroadcastDraft(e.target.value)}
                className="w-full bg-white border border-neutral-300 p-1.5 text-xs text-[#111111] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (onBroadcastMessage) onBroadcastMessage(broadcastDraft);
                  showNotify('Galactic News broadcast dispatched to all system terminals!');
                }}
                className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Broadcast to Universe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 10: TURN SYSTEM & ENGINE SCHEDULERS */}
      {(activeCategory === 'all' || activeCategory === 'turn-engine') && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Activity size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">
                  IN-GAME SYSTEM 10 // ENGINE CORE & SCHEDULERS
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  Turn Engine Injection, Tick Frequency & Cron Schedulers
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('turn-system')}
              className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline"
            >
              <span>Open Turn System View</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Turn Injector */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Action Turns Injector
              </span>
              <div className="text-[11px] text-[#666666]">
                Current Reserve: <strong className="text-emerald-700">{resources.attackTurns.toLocaleString()} Turns</strong>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[150, 500, 3000].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onUpdateResources({ attackTurns: resources.attackTurns + t });
                      showNotify(`+${t} Action Turns added to reserve.`);
                    }}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase cursor-pointer text-center"
                  >
                    +{t} Turns
                  </button>
                ))}
              </div>
            </div>

            {/* Tick Speed Regulator */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Engine Tick Rate Regulator
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'normal', label: '60s Normal' },
                    { id: 'turbo', label: '10s Turbo' },
                    { id: 'frozen', label: 'Freeze Lock' },
                  ] as const
                ).map((spd) => (
                  <button
                    key={spd.id}
                    type="button"
                    onClick={() => {
                      setEngineTickSpeed(spd.id);
                      showNotify(`Engine tick rate set to ${spd.label}.`);
                    }}
                    className={`py-1.5 font-bold text-xs uppercase cursor-pointer border ${
                      engineTickSpeed === spd.id
                        ? 'bg-[#111111] text-emerald-400 border-[#111111]'
                        : 'bg-white text-[#444444] border-neutral-300'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Freeze Switch */}
            <div className="border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-3">
              <span className="font-bold text-[#111111] uppercase block border-b pb-1.5">
                Universe Maintenance Freeze
              </span>
              <p className="text-[11px] text-[#666666]">
                Halts all fleet movements, space attacks, and mining ticks for global server maintenance:
              </p>
              <button
                type="button"
                onClick={() => {
                  showNotify('Universe status: Server maintenance flag toggled. Fleet attacks halted.');
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Toggle Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
