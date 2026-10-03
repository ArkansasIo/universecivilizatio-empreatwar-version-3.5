import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Award,
  Layers,
  Flame,
  RefreshCw,
  Info,
  TrendingUp,
} from 'lucide-react';
import { StructureBlueprint } from '../../../data/structureBlueprintsData';
import {
  MASTERWORK_RANKS,
  StructureFabricatorEnhancement,
  calculateEnhancedStructureStats,
  MasterworkCritRecord,
} from '../../../data/fabricatorMasteryData';
import { PlayerResources } from '../../../types';
import { sound } from '../../../sound';

interface MasterworkingFoundryPanelProps {
  selectedBlueprint: StructureBlueprint;
  allBlueprints: StructureBlueprint[];
  onSelectBlueprint: (bp: StructureBlueprint) => void;
  enhancement?: StructureFabricatorEnhancement;
  onUpdateEnhancement: (enhancement: StructureFabricatorEnhancement) => void;
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onNavigateToTempering: () => void;
}

export const MasterworkingFoundryPanel: React.FC<MasterworkingFoundryPanelProps> = ({
  selectedBlueprint,
  allBlueprints,
  onSelectBlueprint,
  enhancement,
  onUpdateEnhancement,
  resources,
  onUpdateResources,
  onNavigateToTempering,
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'crit'; text: string } | null>(null);

  const currentEnhancement: StructureFabricatorEnhancement = enhancement || {
    blueprintId: selectedBlueprint.id,
    blueprintName: selectedBlueprint.name,
    category: selectedBlueprint.category,
    temperDurability: 5,
    maxTemperDurability: 5,
    temperedAffixes: [],
    masterworkRank: 0,
    masterworkCrits: [],
    totalPowerRating: 500,
    timesReset: 0,
    updatedAt: new Date().toLocaleDateString(),
  };

  const nextRankNumber = (currentEnhancement.masterworkRank || 0) + 1;
  const isMaxRank = currentEnhancement.masterworkRank >= 12;
  const nextRankConfig = MASTERWORK_RANKS.find((r) => r.rank === nextRankNumber) || MASTERWORK_RANKS[0];

  const enhancedStats = calculateEnhancedStructureStats(selectedBlueprint.stats, currentEnhancement);

  // Upgrade Masterwork Rank
  const handleUpgradeMasterwork = () => {
    if (isMaxRank) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: 'Structure has attained Apex Masterwork Rank 12. Maximum potential reached!',
      });
      return;
    }

    // Check resource requirements
    const hasEnough =
      (resources.metal || 0) >= nextRankConfig.metal &&
      (resources.crystal || 0) >= nextRankConfig.crystal &&
      (resources.deuterium || 0) >= nextRankConfig.deuterium &&
      (resources.naquadah || 0) >= nextRankConfig.naquadah &&
      (resources.credits || 0) >= nextRankConfig.credits;

    if (!hasEnough) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: `Insufficient resources to advance Masterwork to Rank ${nextRankNumber}. Check required materials.`,
      });
      return;
    }

    // Deduct resources
    onUpdateResources({
      metal: Math.max(0, (resources.metal || 0) - nextRankConfig.metal),
      crystal: Math.max(0, (resources.crystal || 0) - nextRankConfig.crystal),
      deuterium: Math.max(0, (resources.deuterium || 0) - nextRankConfig.deuterium),
      naquadah: Math.max(0, (resources.naquadah || 0) - nextRankConfig.naquadah),
      credits: Math.max(0, (resources.credits || 0) - nextRankConfig.credits),
    });

    setIsUpgrading(true);
    sound.play('click');

    setTimeout(() => {
      const newRank = currentEnhancement.masterworkRank + 1;
      const isMilestone = newRank === 4 || newRank === 8 || newRank === 12;

      let newCrits = [...currentEnhancement.masterworkCrits];
      let updatedAffixes = [...currentEnhancement.temperedAffixes];
      let critTargetName = '';

      if (isMilestone) {
        // Collect potential targets: tempered affixes or base stats
        const candidates: Array<{ name: string; statKey: string; isAffix: boolean; affixIndex?: number }> = [];

        // Add tempered affixes
        updatedAffixes.forEach((affix, index) => {
          candidates.push({
            name: affix.affixName,
            statKey: affix.statKey,
            isAffix: true,
            affixIndex: index,
          });
        });

        // Add base stats
        Object.keys(selectedBlueprint.stats).forEach((key) => {
          if (typeof selectedBlueprint.stats[key as keyof typeof selectedBlueprint.stats] === 'number') {
            candidates.push({
              name: key,
              statKey: key,
              isAffix: false,
            });
          }
        });

        if (candidates.length > 0) {
          // Select random candidate
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          critTargetName = chosen.name;

          if (chosen.isAffix && chosen.affixIndex !== undefined) {
            updatedAffixes[chosen.affixIndex] = {
              ...updatedAffixes[chosen.affixIndex],
              critHits: updatedAffixes[chosen.affixIndex].critHits + 1,
            };
          }

          const critRecord: MasterworkCritRecord = {
            rank: newRank as 4 | 8 | 12,
            targetName: chosen.name,
            statKey: chosen.statKey,
            bonusPct: 25,
          };
          newCrits.push(critRecord);
        }
      }

      const updated: StructureFabricatorEnhancement = {
        ...currentEnhancement,
        masterworkRank: newRank,
        temperedAffixes: updatedAffixes,
        masterworkCrits: newCrits,
        updatedAt: `Turn Cycle #${Math.floor(Math.random() * 900 + 100)}`,
      };

      const newStats = calculateEnhancedStructureStats(selectedBlueprint.stats, updated);
      updated.totalPowerRating = newStats.totalPowerRating;

      onUpdateEnhancement(updated);
      setIsUpgrading(false);

      if (isMilestone) {
        sound.play('success');
        setNotice({
          type: 'crit',
          text: `⚛️ MASTERWORK CRITICAL STRIKE! Rank ${newRank} milestone achieved: +25% bonus struck ${critTargetName}!`,
        });
      } else {
        sound.play('confirm');
        setNotice({
          type: 'success',
          text: `Masterwork advanced to Rank ${newRank}/12 (+5% all attributes). Overall boost: +${newRank * 5}%!`,
        });
      }
    }, 450);
  };

  // Reset Masterwork
  const handleResetMasterwork = () => {
    if (currentEnhancement.masterworkRank === 0) return;

    sound.play('warning');
    const resetAffixes = currentEnhancement.temperedAffixes.map((a) => ({
      ...a,
      critHits: 0,
    }));

    const updated: StructureFabricatorEnhancement = {
      ...currentEnhancement,
      masterworkRank: 0,
      masterworkCrits: [],
      temperedAffixes: resetAffixes,
      timesReset: currentEnhancement.timesReset + 1,
      updatedAt: `Reset Cycle #${Math.floor(Math.random() * 900 + 100)}`,
    };

    const newStats = calculateEnhancedStructureStats(selectedBlueprint.stats, updated);
    updated.totalPowerRating = newStats.totalPowerRating;

    onUpdateEnhancement(updated);
    setNotice({
      type: 'success',
      text: 'Masterwork Foundry reset to Rank 0. All critical strikes wiped; Tempered affixes preserved!',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Structure Telemetry Header */}
      <div className="border border-[#dedede] bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4 mb-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={12} className="text-cyan-600" />
              <span>QUANTUM MASTERWORKING FOUNDRY (12 RANKS)</span>
            </div>
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2 mt-0.5">
              <span>{selectedBlueprint.name}</span>
              <span className="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-950 font-bold border border-cyan-300 uppercase">
                Rank {currentEnhancement.masterworkRank} / 12
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#777777]">Select Structure:</span>
            <select
              value={selectedBlueprint.id}
              onChange={(e) => {
                const found = allBlueprints.find((b) => b.id === e.target.value);
                if (found) {
                  sound.play('click');
                  onSelectBlueprint(found);
                }
              }}
              className="text-xs font-bold border border-neutral-300 bg-white p-2 rounded outline-none focus:border-black cursor-pointer max-w-xs"
            >
              {allBlueprints.map((bp) => (
                <option key={bp.id} value={bp.id}>
                  {bp.name} (T{bp.tier})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 12 Rank Milestone Progression Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#666666]">
              Masterwork Progress: <strong>Rank {currentEnhancement.masterworkRank} / 12</strong> (+{currentEnhancement.masterworkRank * 5}% General Scaling)
            </span>
            <span className="text-cyan-800 font-bold">
              Milestones at Rank 4 (Cyan), Rank 8 (Amber), Rank 12 (Legendary)
            </span>
          </div>

          <div className="grid grid-cols-12 gap-1 sm:gap-2">
            {MASTERWORK_RANKS.map((r) => {
              const isAchieved = currentEnhancement.masterworkRank >= r.rank;
              const isMilestone = r.rank === 4 || r.rank === 8 || r.rank === 12;
              return (
                <div
                  key={r.rank}
                  className={`p-2 border text-center transition-all ${
                    isAchieved
                      ? isMilestone
                        ? r.rank === 12
                          ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-xs'
                          : r.rank === 8
                          ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-xs'
                          : 'border-cyan-600 bg-cyan-50 text-cyan-950 shadow-xs'
                        : 'border-[#111111] bg-neutral-900 text-white'
                      : 'border-[#e0e0e0] bg-neutral-50 text-[#888888]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block">R{r.rank}</span>
                  <span className="text-[9px] uppercase font-mono block">
                    {isMilestone ? 'CRIT ★' : '+5%'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`p-4 border text-xs font-semibold flex items-center justify-between shadow-2xs ${
            notice.type === 'crit'
              ? 'bg-purple-50 border-purple-400 text-purple-950'
              : notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'crit' ? (
              <Zap size={16} className="text-purple-700 shrink-0" />
            ) : notice.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-rose-700 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="font-bold text-neutral-500 hover:text-black cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Left = Actions & Upgrade, Right = Enhanced Stat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upgrade Matrix & Catalyst Requirements (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                <Award size={15} className="text-cyan-700" />
                <span>Next Rank Authorization</span>
              </h3>
              <span className="text-xs font-mono font-bold text-[#555555]">
                {isMaxRank ? 'MAXED' : `Rank ${nextRankNumber} / 12`}
              </span>
            </div>

            {!isMaxRank ? (
              <div className="space-y-4">
                <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#777777] uppercase font-bold">Required Catalyst</span>
                    <strong className="text-cyan-900 font-bold">
                      {nextRankConfig.catalystAmount}x {nextRankConfig.catalystName}
                    </strong>
                  </div>
                  <p className="text-[11px] text-[#666666]">
                    {nextRankNumber === 4 || nextRankNumber === 8 || nextRankNumber === 12
                      ? '⚡ MILESTONE RANK: Triggers a massive +25% Critical Strike to a random stat or affix!'
                      : 'Advances structure base statistics and tempered rolls by an additional +5% additive scaling.'}
                  </p>
                </div>

                {/* Resource Costs */}
                <div className="space-y-1.5 text-xs font-mono">
                  <span className="text-[10px] text-[#888888] uppercase font-bold block">Fabrication Materials:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 border bg-neutral-50 flex justify-between">
                      <span className="text-[#666666]">Metal:</span>
                      <strong className="text-[#111111]">{nextRankConfig.metal.toLocaleString()}</strong>
                    </div>
                    <div className="p-2 border bg-neutral-50 flex justify-between">
                      <span className="text-[#666666]">Crystal:</span>
                      <strong className="text-[#111111]">{nextRankConfig.crystal.toLocaleString()}</strong>
                    </div>
                    <div className="p-2 border bg-neutral-50 flex justify-between">
                      <span className="text-[#666666]">Deuterium:</span>
                      <strong className="text-[#111111]">{nextRankConfig.deuterium.toLocaleString()}</strong>
                    </div>
                    <div className="p-2 border bg-neutral-50 flex justify-between">
                      <span className="text-[#666666]">Naquadah:</span>
                      <strong className="text-purple-700">{nextRankConfig.naquadah.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="p-2 border bg-neutral-50 flex justify-between text-[11px]">
                    <span className="text-[#666666]">Treasury Credits:</span>
                    <strong className="text-amber-800">{nextRankConfig.credits.toLocaleString()} Cr</strong>
                  </div>
                </div>

                {/* Upgrade Button */}
                <button
                  type="button"
                  disabled={isUpgrading}
                  onClick={handleUpgradeMasterwork}
                  className="w-full py-3 bg-[#111111] hover:bg-[#333333] text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isUpgrading ? (
                    <>
                      <RotateCw size={14} className="animate-spin text-cyan-400" />
                      <span>Synthesizing Quantum Lattice...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="text-cyan-400" />
                      <span>Authorize Masterwork Rank {nextRankNumber}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-cyan-50 border border-cyan-300 text-cyan-950 text-xs text-center font-mono">
                <strong>👑 APEX MASTERWORK ACHIEVED</strong>
                <p className="mt-1 text-[11px]">
                  All 12 Ranks and 3 Critical Strikes active. Maximum structural power unleashed!
                </p>
              </div>
            )}

            {/* Critical Strike Records Display */}
            {currentEnhancement.masterworkCrits.length > 0 && (
              <div className="pt-3 border-t border-[#eeeeee] space-y-2">
                <span className="text-[10px] text-[#777777] uppercase font-bold block font-mono">
                  Masterwork Critical Strikes Active ({currentEnhancement.masterworkCrits.length}):
                </span>
                <div className="space-y-1.5">
                  {currentEnhancement.masterworkCrits.map((crit, idx) => (
                    <div
                      key={idx}
                      className="p-2 border border-purple-300 bg-purple-50/50 flex items-center justify-between text-xs font-mono"
                    >
                      <span className="font-bold text-purple-950 flex items-center gap-1.5">
                        <Zap size={12} className="text-purple-700" />
                        <span>Rank {crit.rank} Strike: {crit.targetName}</span>
                      </span>
                      <span className="px-1.5 py-0.2 bg-purple-700 text-white font-bold text-[10px]">
                        +{crit.bonusPct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Masterworking Option */}
            {currentEnhancement.masterworkRank > 0 && (
              <div className="pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={handleResetMasterwork}
                  className="w-full py-2 bg-neutral-100 hover:bg-rose-50 border border-neutral-300 hover:border-rose-400 text-neutral-700 hover:text-rose-900 text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  <span>Reset Masterwork to Rank 0 (Keep Tempers)</span>
                </button>
                <span className="text-[10px] text-[#888888] text-center block mt-1 font-mono">
                  Allows re-rolling Critical Strike distributions for optimal min-maxing.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Complete Attribute & Scaling Breakdown Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeeeee]">
              <div>
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={15} className="text-emerald-700" />
                  <span>Enhanced Structure Attribute Matrix</span>
                </h3>
                <span className="text-[11px] text-[#777777]">
                  Calculated with base stats, tempered rolls, and masterwork scaling
                </span>
              </div>
              <button
                type="button"
                onClick={onNavigateToTempering}
                className="text-xs font-mono font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Edit Tempers</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Stats Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border border-[#eeeeee]">
                <thead>
                  <tr className="bg-neutral-100 border-b border-[#dddddd] text-[10px] uppercase text-[#666666]">
                    <th className="p-2.5">Attribute Name</th>
                    <th className="p-2.5 text-right">Base</th>
                    <th className="p-2.5 text-right">Tempered</th>
                    <th className="p-2.5 text-right">Masterwork</th>
                    <th className="p-2.5 text-right">Effective Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee]">
                  {enhancedStats.statBreakdowns.map((stat) => (
                    <tr key={stat.label} className="hover:bg-neutral-50/50">
                      <td className="p-2.5 font-bold text-[#111111] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                        <span>{stat.label}</span>
                      </td>
                      <td className="p-2.5 text-right text-[#666666]">
                        {stat.baseValue > 0 ? `${stat.baseValue.toLocaleString()}${stat.unit}` : '—'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-amber-700">
                        {stat.temperedBonus > 0 ? `+${stat.temperedBonus.toLocaleString()}${stat.unit}` : '—'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-cyan-800">
                        {stat.masterworkBonus > 0 ? `+${stat.masterworkBonus.toLocaleString()}${stat.unit}` : '—'}
                      </td>
                      <td className="p-2.5 text-right font-bold text-[#111111] bg-neutral-50/80">
                        {stat.totalValue.toLocaleString()}{stat.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footnote */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#777777] uppercase font-bold block">Total Power Rating</span>
                <strong className="text-base font-bold text-cyan-900">
                  ⚡ {enhancedStats.totalPowerRating.toLocaleString()} Pts
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#777777] uppercase font-bold block">Overall Scaling Factor</span>
                <strong className="text-base font-bold text-emerald-700">
                  {enhancedStats.overallMultiplier}x Multiplier
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
