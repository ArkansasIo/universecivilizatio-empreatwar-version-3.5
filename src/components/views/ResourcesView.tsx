import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Database,
  Layers,
  Zap,
  TrendingUp,
  CheckCircle2,
  Lock,
  Flame,
  Droplet,
  Sparkles,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerProfile, PlayerResources, Race, ResourceStorageUpgrades } from '../../types';
import { RACES } from '../../gameData';
import {
  calculateMaxStorageCapacity,
  calculateStorageEfficiencyBonus,
  calculateStorageUpgradeCost,
  DEFAULT_RESOURCE_STORAGE_STATE,
} from '../../utils/upgradeCalculations';

interface ResourcesViewProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  bankCapacity: number;
  storageUpgrades?: ResourceStorageUpgrades;
  onDeposit: (amount: number) => { success: boolean; message: string };
  onWithdraw: (amount: number) => { success: boolean; message: string };
  onUpgradeStorage?: (
    resourceType: 'metal' | 'crystal' | 'deuterium' | 'energy' | 'food' | 'water' | 'darkMatter'
  ) => void;
  onToggleAutoCompress?: () => void;
  onNavigate?: (route: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  profile,
  resources,
  bankCapacity,
  storageUpgrades = DEFAULT_RESOURCE_STORAGE_STATE,
  onDeposit,
  onWithdraw,
  onUpgradeStorage,
  onToggleAutoCompress,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'storages' | 'bank'>('storages');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentRace = RACES.find((r) => r.id === profile.race);
  const vaultName = currentRace?.bankName || 'Planetary Vault';
  const localStorageState = storageUpgrades || DEFAULT_RESOURCE_STORAGE_STATE;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(depositAmount, 10);
    if (isNaN(amt) || amt <= 0) return;

    const result = onDeposit(amt);
    if (result.success) {
      sound.play('confirm');
      setFeedback({ type: 'success', text: result.message });
      setDepositAmount('');
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount, 10);
    if (isNaN(amt) || amt <= 0) return;

    const result = onWithdraw(amt);
    if (result.success) {
      sound.play('confirm');
      setFeedback({ type: 'success', text: result.message });
      setWithdrawAmount('');
    } else {
      sound.play('warning');
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const fillDeposit = (fraction: number) => {
    const spaceLeft = Math.max(0, bankCapacity - resources.bankedNaquadah);
    const maxPoss = Math.min(resources.naquadah, spaceLeft);
    setDepositAmount(String(Math.floor(maxPoss * fraction)));
  };

  const fillWithdraw = (fraction: number) => {
    setWithdrawAmount(String(Math.floor(resources.bankedNaquadah * fraction)));
  };

  const capacityPct = Math.min(100, Math.round((resources.bankedNaquadah / bankCapacity) * 100));

  // Resource capacity cards setup
  const resourceStorageCards: Array<{
    type: 'metal' | 'crystal' | 'deuterium' | 'energy' | 'food' | 'water' | 'darkMatter';
    name: string;
    icon: string;
    currentAmount: number;
    level: number;
    unit: string;
    color: string;
  }> = [
    {
      type: 'metal',
      name: 'Metal Ore Silos & Smelters',
      icon: '🏗️',
      currentAmount: resources.metal || 0,
      level: localStorageState.metalSiloLevel,
      unit: 'Metal',
      color: 'bg-slate-600',
    },
    {
      type: 'crystal',
      name: 'Crystal Matrix Vaults',
      icon: '💎',
      currentAmount: resources.crystal || 0,
      level: localStorageState.crystalVaultLevel,
      unit: 'Crystal',
      color: 'bg-cyan-600',
    },
    {
      type: 'deuterium',
      name: 'Deuterium Cryo-Spheres',
      icon: '🧪',
      currentAmount: resources.deuterium || 0,
      level: localStorageState.deuteriumTankLevel,
      unit: 'Deut',
      color: 'bg-indigo-600',
    },
    {
      type: 'energy',
      name: 'Supercapacitor Battery Banks',
      icon: '⚡',
      currentAmount: resources.energy || 0,
      level: localStorageState.energyCapacitorLevel,
      unit: 'MW',
      color: 'bg-amber-500',
    },
    {
      type: 'food',
      name: 'Hydroponic Granaries',
      icon: '🌾',
      currentAmount: resources.food || 0,
      level: localStorageState.foodGranaryLevel,
      unit: 'Food',
      color: 'bg-emerald-600',
    },
    {
      type: 'water',
      name: 'Aquifer Cisterns & Reservoirs',
      icon: '💧',
      currentAmount: resources.water || 0,
      level: localStorageState.waterCisternLevel,
      unit: 'Water',
      color: 'bg-blue-600',
    },
    {
      type: 'darkMatter',
      name: 'Dark Matter Tachyon Stasis',
      icon: '🔮',
      currentAmount: resources.darkMatter || 0,
      level: localStorageState.darkMatterStasisLevel,
      unit: 'DM',
      color: 'bg-purple-600',
    },
  ];

  const handleUpgradeClick = (
    type: 'metal' | 'crystal' | 'deuterium' | 'energy' | 'food' | 'water' | 'darkMatter',
    level: number
  ) => {
    const cost = calculateStorageUpgradeCost(type, level);
    if (
      resources.metal < cost.metal ||
      resources.crystal < cost.crystal ||
      resources.deuterium < cost.deuterium ||
      resources.naquadah < cost.naquadah
    ) {
      sound.play('warning');
      setFeedback({
        type: 'error',
        text: `Insufficient resources to upgrade ${type} storage! Required: ${cost.metal.toLocaleString()} Metal, ${cost.crystal.toLocaleString()} Crystal, ${cost.deuterium.toLocaleString()} Deut, ${cost.naquadah.toLocaleString()} NQ.`,
      });
      return;
    }

    if (onUpgradeStorage) {
      onUpgradeStorage(type);
      sound.play('confirm');
      setFeedback({
        type: 'success',
        text: `Successfully upgraded ${type} storage facility to Tier ${level + 1}!`,
      });
    }
  };

  return (
    <div id="resources-view" className="space-y-6">
      {/* View Header */}
      <div className="border border-[#dedede] bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
              RESOURCE LOGISTICS · STRATEGIC STORAGE & VAULT CITADEL
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">Resource Storage & Capacity Systems</h2>
            <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
              Expand capacity caps across Metal, Crystal, Deuterium, Energy, Food, Water, and Dark Matter.
              Upgrade silos to gain production efficiency bonuses and avoid overflow waste.
            </p>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('bank-vault')}
              className="px-4 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-2"
            >
              Open Advanced Bank Citadel →
            </button>
          )}
        </div>

        {/* View Sub-Tabs */}
        <div className="flex gap-2 border-t border-[#eeeeee] pt-4 mt-5">
          <button
            type="button"
            onClick={() => setActiveTab('storages')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'storages'
                ? 'bg-[#111111] text-white'
                : 'bg-[#fafafa] text-[#555555] hover:bg-[#f0f0f0] border border-[#dedede]'
            }`}
          >
            <Database size={14} />
            Universal Resource Silos & Tanks (7)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'bank'
                ? 'bg-[#111111] text-white'
                : 'bg-[#fafafa] text-[#555555] hover:bg-[#f0f0f0] border border-[#dedede]'
            }`}
          >
            <ShieldCheck size={14} />
            Naquadah Planetary Vault ({vaultName})
          </button>
        </div>
      </div>

      {/* Notice Message */}
      {feedback && (
        <div
          className={`p-4 border flex items-center justify-between text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[#888888] hover:text-[#111111] ml-4 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: UNIVERSAL RESOURCE STORAGE SILOS */}
      {activeTab === 'storages' && (
        <div className="space-y-6">
          {/* Storage Compression Banner */}
          <div className="border border-[#dedede] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-[#777777] uppercase block">Automated Overflow Protection</span>
              <h4 className="font-bold text-sm text-[#111111]">
                High-Density Compression & Bullion Refining
              </h4>
              <p className="text-xs text-[#666666]">
                When silos reach 100% capacity, automated compressors convert 80% of excess mine yields into refined Imperial bank bullion.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleAutoCompress}
              className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider border cursor-pointer ${
                localStorageState.autoCompressOverflow
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-[#fafafa] text-[#555555] border-[#dedede]'
              }`}
            >
              {localStorageState.autoCompressOverflow ? '✓ COMPRESSION ACTIVE' : 'DISABLED'}
            </button>
          </div>

          {/* Grid of Resource Silos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceStorageCards.map((card) => {
              const maxCap = calculateMaxStorageCapacity(card.type, localStorageState);
              const efficiency = calculateStorageEfficiencyBonus(card.type, localStorageState);
              const cost = calculateStorageUpgradeCost(card.type, card.level);
              const fillPct = Math.min(100, Math.round((card.currentAmount / maxCap) * 100));

              return (
                <div key={card.type} className="border border-[#dedede] bg-white p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{card.icon}</span>
                      <div>
                        <span className="text-[10px] font-bold text-[#777777] uppercase block">
                          Tier {card.level} Storage Facility
                        </span>
                        <h4 className="font-bold text-sm text-[#111111]">{card.name}</h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold">
                      Lv. {card.level}
                    </span>
                  </div>

                  {/* Meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span>{card.currentAmount.toLocaleString()} {card.unit}</span>
                      <span>{fillPct}% ({maxCap.toLocaleString()} Cap)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#eeeeee] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          fillPct >= 95 ? 'bg-[#dc2626]' : fillPct >= 80 ? 'bg-amber-500' : 'bg-[#111111]'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 border border-emerald-200">
                    Passive Bonus: +{efficiency.toFixed(1)}% Extraction & Retention Efficiency
                  </div>

                  {/* Cost & Upgrade */}
                  <div className="border-t border-[#eeeeee] pt-3 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-[#777777] uppercase block">
                      Next Tier Cost:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-[#555555]">
                      <span>Metal: {cost.metal.toLocaleString()}</span>
                      <span>Crystal: {cost.crystal.toLocaleString()}</span>
                      <span>Deut: {cost.deuterium.toLocaleString()}</span>
                      <span>NQ: {cost.naquadah.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpgradeClick(card.type, card.level)}
                      className="w-full mt-2 py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
                    >
                      Upgrade to Tier {card.level + 1} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: NAQUADAH BANKING & VAULT */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          {/* Vault Status Card */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                  Protected Storage
                </span>
                <h3 className="text-lg font-bold text-[#111111] font-mono">
                  {resources.bankedNaquadah.toLocaleString()} / {bankCapacity.toLocaleString()} Naquadah
                </h3>
              </div>
              <span className="px-3 py-1 bg-[#fafafa] border border-[#dedede] text-xs font-mono font-bold text-[#111111]">
                {capacityPct}% Capacity
              </span>
            </div>

            <div className="w-full h-3 bg-[#eeeeee] mb-2">
              <div
                className={`h-full transition-all duration-300 ${
                  capacityPct >= 90 ? 'bg-[#dc2626]' : 'bg-[#111111]'
                }`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#777777]">
              <span>0 Naquadah</span>
              <span>Max Capacity: {bankCapacity.toLocaleString()}</span>
            </div>
          </div>

          {/* Deposit and Withdraw Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deposit */}
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
                <ArrowDownLeft size={18} className="text-[#111111]" />
                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                  Deposit to {vaultName}
                </h3>
              </div>
              <p className="text-xs text-[#666666]">
                Transfer liquid Naquadah from your active wallet into the secure vault.
              </p>

              <form onSubmit={handleDepositSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] mb-1">
                    Deposit Amount (Available: {resources.naquadah.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={resources.naquadah}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter Naquadah amount"
                    className="w-full border border-[#cccccc] px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillDeposit(0.25)}
                    className="flex-1 py-1.5 border border-[#dedede] text-[11px] text-[#555555] hover:border-[#111111] transition-colors cursor-pointer"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDeposit(0.5)}
                    className="flex-1 py-1.5 border border-[#dedede] text-[11px] text-[#555555] hover:border-[#111111] transition-colors cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDeposit(1.0)}
                    className="flex-1 py-1.5 border border-[#dedede] text-[11px] text-[#555555] hover:border-[#111111] transition-colors cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                <button
                  type="submit"
                  id="submit-deposit-btn"
                  disabled={resources.naquadah <= 0}
                  className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Transfer to Vault →
                </button>
              </form>
            </div>

            {/* Withdraw */}
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
                <ArrowUpRight size={18} className="text-[#111111]" />
                <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                  Withdraw from {vaultName}
                </h3>
              </div>
              <p className="text-xs text-[#666666]">
                Withdraw Naquadah into your active balance to fund military training, technologies, or weapons.
              </p>

              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] mb-1">
                    Withdraw Amount (Vault: {resources.bankedNaquadah.toLocaleString()})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={resources.bankedNaquadah}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter Naquadah amount"
                    className="w-full border border-[#cccccc] px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillWithdraw(0.25)}
                    className="flex-1 py-1.5 border border-[#dedede] text-[11px] text-[#555555] hover:border-[#111111] transition-colors cursor-pointer"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => fillWithdraw(0.5)}
                    className="flex-1 py-1.5 border border-[#dedede] text-[11px] text-[#555555] hover:border-[#111111] transition-colors cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => fillWithdraw(1.0)}
                    className="flex-1 py-1.5 border border-[#dedede] text-[11px] text-[#555555] hover:border-[#111111] transition-colors cursor-pointer"
                  >
                    Max
                  </button>
                </div>

                <button
                  type="submit"
                  id="submit-withdraw-btn"
                  disabled={resources.bankedNaquadah <= 0}
                  className="w-full py-2.5 border border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-[#f5f5f5] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Withdraw to Wallet →
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
