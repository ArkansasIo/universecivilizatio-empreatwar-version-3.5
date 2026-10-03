import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Shield,
  Pickaxe,
  Zap,
  Boxes,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Award,
  Plus,
  RefreshCw,
  Info,
} from 'lucide-react';
import { StructureBlueprint } from '../../../data/structureBlueprintsData';
import {
  TEMPERING_RECIPES,
  TemperingRecipe,
  TemperedAffix,
  StructureFabricatorEnhancement,
  rollTemperedAffix,
  calculateEnhancedStructureStats,
  TemperCategory,
} from '../../../data/fabricatorMasteryData';
import { PlayerResources } from '../../../types';
import { sound } from '../../../sound';

interface TemperingForgePanelProps {
  selectedBlueprint: StructureBlueprint;
  allBlueprints: StructureBlueprint[];
  onSelectBlueprint: (bp: StructureBlueprint) => void;
  enhancement?: StructureFabricatorEnhancement;
  onUpdateEnhancement: (enhancement: StructureFabricatorEnhancement) => void;
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onNavigateToMasterworking: () => void;
}

export const TemperingForgePanel: React.FC<TemperingForgePanelProps> = ({
  selectedBlueprint,
  allBlueprints,
  onSelectBlueprint,
  enhancement,
  onUpdateEnhancement,
  resources,
  onUpdateResources,
  onNavigateToMasterworking,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TemperCategory | 'All'>('All');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(TEMPERING_RECIPES[0].id);
  const [targetSlotIndex, setTargetSlotIndex] = useState<0 | 1>(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRolledAffix, setLastRolledAffix] = useState<TemperedAffix | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize or fetch enhancement
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

  const selectedRecipe = TEMPERING_RECIPES.find((r) => r.id === selectedRecipeId) || TEMPERING_RECIPES[0];
  const enhancedStats = calculateEnhancedStructureStats(selectedBlueprint.stats, currentEnhancement);

  const temperCosts = {
    metal: 35000,
    crystal: 20000,
    deuterium: 8000,
    naquadah: 250,
    credits: 50000,
  };

  const restoreCosts = {
    naquadah: 1500,
    credits: 200000,
  };

  // Perform Temper Roll
  const handleRollTemper = () => {
    // 1. Check Durability
    if (currentEnhancement.temperDurability <= 0) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: 'Zero Temper Durability remaining! Use a Naquadah Scroll of Restoration to replenish rolls.',
      });
      return;
    }

    // 2. Check Resources
    const hasEnough =
      (resources.metal || 0) >= temperCosts.metal &&
      (resources.crystal || 0) >= temperCosts.crystal &&
      (resources.deuterium || 0) >= temperCosts.deuterium &&
      (resources.naquadah || 0) >= temperCosts.naquadah &&
      (resources.credits || 0) >= temperCosts.credits;

    if (!hasEnough) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: 'Insufficient resources to engage Subspace Tempering Forge.',
      });
      return;
    }

    // Deduct resources
    onUpdateResources({
      metal: Math.max(0, (resources.metal || 0) - temperCosts.metal),
      crystal: Math.max(0, (resources.crystal || 0) - temperCosts.crystal),
      deuterium: Math.max(0, (resources.deuterium || 0) - temperCosts.deuterium),
      naquadah: Math.max(0, (resources.naquadah || 0) - temperCosts.naquadah),
      credits: Math.max(0, (resources.credits || 0) - temperCosts.credits),
    });

    setIsRolling(true);
    sound.play('click');

    setTimeout(() => {
      const newAffix = rollTemperedAffix(selectedRecipe);
      setLastRolledAffix(newAffix);

      const existingAffixes = [...currentEnhancement.temperedAffixes];
      existingAffixes[targetSlotIndex] = newAffix;

      const updated: StructureFabricatorEnhancement = {
        ...currentEnhancement,
        temperDurability: Math.max(0, currentEnhancement.temperDurability - 1),
        temperedAffixes: existingAffixes,
        updatedAt: `Turn Cycle #${Math.floor(Math.random() * 900 + 100)}`,
      };

      // Recalculate power
      const newStats = calculateEnhancedStructureStats(selectedBlueprint.stats, updated);
      updated.totalPowerRating = newStats.totalPowerRating;

      onUpdateEnhancement(updated);
      setIsRolling(false);

      if (newAffix.isGreater) {
        sound.play('success');
        setNotice({
          type: 'success',
          text: `🔥 GREATER TEMPER SUCCESS! Rolled maximum potential: ${newAffix.affixName} (+${newAffix.value}${newAffix.unit})!`,
        });
      } else {
        sound.play('confirm');
        setNotice({
          type: 'success',
          text: `Tempered ${newAffix.affixName} (+${newAffix.value}${newAffix.unit}) into Slot #${targetSlotIndex + 1}! (${updated.temperDurability} durability left)`,
        });
      }
    }, 400);
  };

  // Restore Durability
  const handleRestoreDurability = () => {
    if ((resources.naquadah || 0) < restoreCosts.naquadah || (resources.credits || 0) < restoreCosts.credits) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: `Insufficient resources to restore Temper Durability. Requires ${restoreCosts.naquadah} Naquadah and ${restoreCosts.credits.toLocaleString()} Credits.`,
      });
      return;
    }

    onUpdateResources({
      naquadah: Math.max(0, (resources.naquadah || 0) - restoreCosts.naquadah),
      credits: Math.max(0, (resources.credits || 0) - restoreCosts.credits),
    });

    const updated: StructureFabricatorEnhancement = {
      ...currentEnhancement,
      temperDurability: currentEnhancement.maxTemperDurability,
    };
    onUpdateEnhancement(updated);

    sound.play('confirm');
    setNotice({
      type: 'success',
      text: 'Scroll of Restoration applied! Temper Durability fully restored to 5/5.',
    });
  };

  const categories: (TemperCategory | 'All')[] = [
    'All',
    'Weaponry & Planetary Defense',
    'Resource Catalysis & Smelting',
    'Energy Grid & Zero-Point',
    'Structural Logistics & Compression',
    'Civic Empire & Science',
  ];

  const filteredRecipes = TEMPERING_RECIPES.filter((r) => {
    if (selectedCategoryFilter !== 'All' && r.category !== selectedCategoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Blueprint Selector & Forge Status Bar */}
      <div className="border border-[#dedede] bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4 mb-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] uppercase tracking-wider flex items-center gap-1.5">
              <Flame size={12} className="text-amber-500" />
              <span>ACTIVE STRUCTURE FORGING MATRIX</span>
            </div>
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2 mt-0.5">
              <span>{selectedBlueprint.name}</span>
              <span className="text-[10px] px-2 py-0.5 bg-neutral-900 text-amber-300 uppercase">
                Tier {selectedBlueprint.tier} {selectedBlueprint.category}
              </span>
              {currentEnhancement.masterworkRank > 0 && (
                <span className="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-950 font-bold border border-cyan-300">
                  MW RANK {currentEnhancement.masterworkRank}
                </span>
              )}
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
                  {bp.name} (T{bp.tier} · {bp.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Durability Bar & Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#777777] uppercase font-bold">Temper Durability</span>
              <span className="font-bold text-[#111111]">
                {currentEnhancement.temperDurability} / {currentEnhancement.maxTemperDurability} Rerolls
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {Array.from({ length: currentEnhancement.maxTemperDurability }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-xs transition-all ${
                    i < currentEnhancement.temperDurability
                      ? 'bg-amber-500 shadow-2xs'
                      : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>
            {currentEnhancement.temperDurability === 0 && (
              <button
                type="button"
                onClick={handleRestoreDurability}
                className="mt-2.5 w-full py-1 text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold uppercase transition-colors cursor-pointer"
              >
                + Restore Durability ({restoreCosts.naquadah} Naq)
              </button>
            )}
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] text-[#777777] uppercase font-bold block">Calculated Power Rating</span>
            <strong className="text-lg font-bold text-amber-600 block mt-0.5">
              ⚡ {enhancedStats.totalPowerRating.toLocaleString()} Pts
            </strong>
            <span className="text-[10px] text-[#555555]">
              Base Yield + Affix Multipliers
            </span>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Masterworking State</span>
              <strong className="text-sm font-bold text-[#111111] block mt-0.5">
                Rank {currentEnhancement.masterworkRank} / 12 ({enhancedStats.overallMultiplier}x Multiplier)
              </strong>
            </div>
            <button
              type="button"
              onClick={onNavigateToMasterworking}
              className="text-[10px] text-cyan-700 hover:text-cyan-900 font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>Go to Masterworking Foundry</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`p-4 border text-xs font-semibold flex items-center justify-between shadow-2xs ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
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

      {/* Main Forging Grid: Left = Active Slots, Right = Manuals & Recipes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2 Tempered Affix Slots & Action Forge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 border-b border-[#eee] pb-3">
              <Sparkles size={15} className="text-amber-600" />
              <span>Tempered Structure Slots (Max 2)</span>
            </h3>

            {/* Slot 1: Primary Temper */}
            <div
              onClick={() => setTargetSlotIndex(0)}
              className={`p-4 border-2 transition-all cursor-pointer ${
                targetSlotIndex === 0
                  ? 'border-[#111111] bg-amber-50/20 shadow-xs'
                  : 'border-[#dedede] bg-white hover:border-[#999999]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#777777] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${targetSlotIndex === 0 ? 'bg-amber-500' : 'bg-neutral-300'}`} />
                  <span>SLOT 1: PRIMARY TEMPER</span>
                </span>
                {targetSlotIndex === 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#111111] text-white font-bold uppercase font-mono">
                    TARGET SLOT
                  </span>
                )}
              </div>

              {currentEnhancement.temperedAffixes[0] ? (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-[#111111]">
                      {currentEnhancement.temperedAffixes[0].affixName}
                    </strong>
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 ${
                        currentEnhancement.temperedAffixes[0].isGreater
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      +{currentEnhancement.temperedAffixes[0].value}
                      {currentEnhancement.temperedAffixes[0].unit}
                      {currentEnhancement.temperedAffixes[0].isGreater && ' ★'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1 leading-snug">
                    {currentEnhancement.temperedAffixes[0].description}
                  </p>
                  {currentEnhancement.temperedAffixes[0].critHits > 0 && (
                    <div className="mt-2 text-[10px] text-cyan-800 font-mono font-bold bg-cyan-50 border border-cyan-200 px-2 py-0.5">
                      ⚡ MW Crit Hit ({currentEnhancement.temperedAffixes[0].critHits}x): +{currentEnhancement.temperedAffixes[0].critHits * 25}% Effective Scaling
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-[#888888] border border-dashed border-[#cccccc] bg-neutral-50/50">
                  <span>+ Empty Temper Slot · Select Recipe to Forge</span>
                </div>
              )}
            </div>

            {/* Slot 2: Secondary Temper */}
            <div
              onClick={() => setTargetSlotIndex(1)}
              className={`p-4 border-2 transition-all cursor-pointer ${
                targetSlotIndex === 1
                  ? 'border-[#111111] bg-amber-50/20 shadow-xs'
                  : 'border-[#dedede] bg-white hover:border-[#999999]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#777777] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${targetSlotIndex === 1 ? 'bg-amber-500' : 'bg-neutral-300'}`} />
                  <span>SLOT 2: SECONDARY TEMPER</span>
                </span>
                {targetSlotIndex === 1 && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#111111] text-white font-bold uppercase font-mono">
                    TARGET SLOT
                  </span>
                )}
              </div>

              {currentEnhancement.temperedAffixes[1] ? (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-[#111111]">
                      {currentEnhancement.temperedAffixes[1].affixName}
                    </strong>
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 ${
                        currentEnhancement.temperedAffixes[1].isGreater
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      +{currentEnhancement.temperedAffixes[1].value}
                      {currentEnhancement.temperedAffixes[1].unit}
                      {currentEnhancement.temperedAffixes[1].isGreater && ' ★'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1 leading-snug">
                    {currentEnhancement.temperedAffixes[1].description}
                  </p>
                  {currentEnhancement.temperedAffixes[1].critHits > 0 && (
                    <div className="mt-2 text-[10px] text-cyan-800 font-mono font-bold bg-cyan-50 border border-cyan-200 px-2 py-0.5">
                      ⚡ MW Crit Hit ({currentEnhancement.temperedAffixes[1].critHits}x): +{currentEnhancement.temperedAffixes[1].critHits * 25}% Effective Scaling
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-[#888888] border border-dashed border-[#cccccc] bg-neutral-50/50">
                  <span>+ Empty Temper Slot · Select Recipe to Forge</span>
                </div>
              )}
            </div>

            {/* Temper Action Button */}
            <div className="pt-2 border-t border-[#eeeeee] space-y-3">
              <div className="text-[11px] text-[#666666] flex justify-between">
                <span>Selected Target: Slot #{targetSlotIndex + 1}</span>
                <span>Cost: {temperCosts.naquadah} Naq · {temperCosts.credits.toLocaleString()} Cr</span>
              </div>

              <button
                type="button"
                disabled={isRolling || currentEnhancement.temperDurability <= 0}
                onClick={handleRollTemper}
                className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  currentEnhancement.temperDurability <= 0
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-[#111111] hover:bg-[#333333] text-amber-300'
                }`}
              >
                {isRolling ? (
                  <>
                    <RotateCw size={14} className="animate-spin text-amber-400" />
                    <span>Engaging Thermal Matrix...</span>
                  </>
                ) : (
                  <>
                    <Flame size={14} className="text-amber-400" />
                    <span>
                      Temper Slot #{targetSlotIndex + 1} ({currentEnhancement.temperDurability} rolls left)
                    </span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-[#888888] text-center font-mono">
                25% chance of rolling a <strong>Greater Temper</strong> (+35% to +50% bonus value)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recipe Manuals & Possible Rolls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#eeeeee] gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
                  <Pickaxe size={15} className="text-[#111111]" />
                  <span>Tempering Manuals Catalog</span>
                </h3>
                <span className="text-[11px] text-[#777777]">
                  Select a category manual to infuse into target slot
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2 py-1 uppercase transition-colors cursor-pointer shrink-0 ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#111111] text-white font-bold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat === 'All' ? 'All' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredRecipes.map((recipe) => {
                const isSelected = selectedRecipeId === recipe.id;
                return (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedRecipeId(recipe.id);
                    }}
                    className={`p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#111111] bg-neutral-50 ring-2 ring-[#111111]'
                        : 'border-[#dedede] bg-white hover:border-[#888888]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{recipe.icon}</span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#111111] truncate">{recipe.name}</h4>
                          <span className="text-[9px] text-[#777777] uppercase block font-mono">
                            {recipe.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#666666] line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#eeeeee] space-y-1 text-[10px] font-mono">
                      <span className="text-[#888888] font-bold block">Possible Rolls (1 selected):</span>
                      {recipe.possibleAffixes.map((affix) => (
                        <div key={affix.name} className="flex items-center justify-between text-[#333333]">
                          <span className="truncate pr-1">• {affix.name}</span>
                          <span className="font-bold text-amber-700 shrink-0">
                            +{affix.minRoll}-{affix.maxRoll}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
