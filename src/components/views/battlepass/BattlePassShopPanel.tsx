import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Shield,
  Zap,
  Gift,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  Award,
  Crown,
  Star,
  Package,
  Eye,
  Palette,
  Check,
  Flame,
  Layers,
  Crosshair,
  Filter,
  Search,
  ArrowUpRight,
  TrendingUp,
  X,
  Rocket,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  BattlePassState,
  BattlePassShopItem,
  PlayerResources,
  CosmeticRewardDetails,
  ResourceBonusDetails,
} from '../../../types';

interface BattlePassShopPanelProps {
  passState: BattlePassState;
  onUpdatePassState: (updates: Partial<BattlePassState>) => void;
  shopItems: BattlePassShopItem[];
  onUpdateShopItems: (items: BattlePassShopItem[]) => void;
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  cosmeticsLocker: CosmeticRewardDetails[];
  onUnlockCosmetic: (cosmetic: CosmeticRewardDetails) => void;
  onToggleEquipCosmetic: (cosmeticId: string) => void;
  onShowNotification: (type: 'success' | 'warning', text: string) => void;
}

export const BattlePassShopPanel: React.FC<BattlePassShopPanelProps> = ({
  passState,
  onUpdatePassState,
  shopItems,
  onUpdateShopItems,
  resources,
  onUpdateResources,
  cosmeticsLocker,
  onUnlockCosmetic,
  onToggleEquipCosmetic,
  onShowNotification,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'unit_skin' | 'resource_bundle'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'rare' | 'epic' | 'legendary' | 'mythic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectItem, setInspectItem] = useState<BattlePassShopItem | null>(null);
  const [dailyPointsClaimed, setDailyPointsClaimed] = useState(false);

  const pointsBalance = passState.battlePassPoints ?? 0;

  // Handle purchasing an item from the Battle Pass Shop
  const handlePurchaseItem = (item: BattlePassShopItem) => {
    if (pointsBalance < item.pricePoints) {
      sound.play('warning');
      onShowNotification(
        'warning',
        `Insufficient Battle Pass Points! You have ${pointsBalance.toLocaleString()} BP, need ${item.pricePoints.toLocaleString()} BP.`
      );
      return;
    }

    // Deduct points
    const newPoints = pointsBalance - item.pricePoints;
    onUpdatePassState({ battlePassPoints: newPoints });

    // Handle Unit Skin purchase
    if (item.category === 'unit_skin') {
      // Mark as purchased in shop
      const updatedShop = shopItems.map((si) =>
        si.id === item.id ? { ...si, purchased: true } : si
      );
      onUpdateShopItems(updatedShop);

      // Unlock into cosmetic locker
      if (item.cosmeticDetails) {
        onUnlockCosmetic({
          ...item.cosmeticDetails,
          equipped: true, // auto-equip newly purchased skin
        });
      }

      sound.play('confirm');
      onShowNotification(
        'success',
        `Unlocked exclusive unit skin: ${item.name}! Equipped to your active fleet roster.`
      );
    }

    // Handle Resource Bundle purchase
    if (item.category === 'resource_bundle') {
      const updatedShop = shopItems.map((si) =>
        si.id === item.id
          ? { ...si, purchaseCount: (si.purchaseCount || 0) + 1 }
          : si
      );
      onUpdateShopItems(updatedShop);

      // Apply resources
      if (item.resourceBonus) {
        const bonus = item.resourceBonus;
        const updates: Partial<PlayerResources> = {};
        if (bonus.naquadah) updates.naquadah = (resources.naquadah || 0) + bonus.naquadah;
        if (bonus.metal) updates.metal = (resources.metal || 0) + bonus.metal;
        if (bonus.crystal) updates.crystal = (resources.crystal || 0) + bonus.crystal;
        if (bonus.deuterium) updates.deuterium = (resources.deuterium || 0) + bonus.deuterium;
        if (bonus.energy) updates.energy = (resources.energy || 0) + bonus.energy;
        if (bonus.darkMatter) updates.darkMatter = (resources.darkMatter || 0) + bonus.darkMatter;
        if (bonus.attackTurns) updates.attackTurns = (resources.attackTurns || 0) + bonus.attackTurns;
        if (bonus.attackUnits) updates.attackUnits = (resources.attackUnits || 0) + bonus.attackUnits;

        onUpdateResources(updates);
      }

      sound.play('confirm');
      onShowNotification(
        'success',
        `Requisitioned ${item.name}! Dispatched directly to sovereign planetary stockpiles.`
      );
    }
  };

  // Claim Daily Battle Pass Points bonus
  const handleClaimDailyPoints = () => {
    if (dailyPointsClaimed) return;
    const bonus = 200;
    onUpdatePassState({ battlePassPoints: pointsBalance + bonus });
    setDailyPointsClaimed(true);
    sound.play('confirm');
    onShowNotification('success', `Claimed daily stipend: +${bonus} Battle Pass Points!`);
  };

  // Run Tactical War Drill to earn test points
  const handleWarDrillPoints = () => {
    const bonus = 250;
    onUpdatePassState({ battlePassPoints: pointsBalance + bonus });
    sound.play('confirm');
    onShowNotification(
      'success',
      `Completed Tactical Readiness Fleet Drill! Commendation awarded: +${bonus} Battle Pass Points.`
    );
  };

  // Convert 1000 XP to 100 BP Points
  const handleConvertXpToPoints = () => {
    if (passState.currentXp < 1000) {
      sound.play('warning');
      onShowNotification('warning', 'Need at least 1,000 seasonal XP to convert into Battle Pass Points.');
      return;
    }
    onUpdatePassState({
      currentXp: passState.currentXp - 1000,
      battlePassPoints: pointsBalance + 100,
    });
    sound.play('confirm');
    onShowNotification('success', 'Converted 1,000 Seasonal XP into +100 Battle Pass Points!');
  };

  // Filter items
  const filteredItems = shopItems.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTarget = item.unitTarget?.toLowerCase().includes(q);
      const matchBonus = item.bonusEffect?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTarget && !matchBonus) return false;
    }
    return true;
  });

  const skinCount = shopItems.filter((i) => i.category === 'unit_skin').length;
  const bundleCount = shopItems.filter((i) => i.category === 'resource_bundle').length;

  // Helper for rarity styling
  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return {
          border: 'border-fuchsia-400',
          bg: 'bg-fuchsia-50',
          text: 'text-fuchsia-800',
          tag: 'bg-fuchsia-900 text-fuchsia-100',
        };
      case 'legendary':
        return {
          border: 'border-amber-400',
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          tag: 'bg-amber-900 text-amber-100',
        };
      case 'epic':
        return {
          border: 'border-purple-400',
          bg: 'bg-purple-50',
          text: 'text-purple-800',
          tag: 'bg-purple-900 text-purple-100',
        };
      default:
        return {
          border: 'border-blue-300',
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          tag: 'bg-blue-900 text-blue-100',
        };
    }
  };

  return (
    <div id="battle-pass-shop-panel" className="space-y-6">
      {/* ============================================================ */}
      {/* 1. TOP CURRENCY VAULT & BATTLE PASS POINTS HUD */}
      {/* ============================================================ */}
      <div className="border border-[#dedede] bg-white p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Balance Display */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm text-white shrink-0 border border-amber-300">
              <Star size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider font-mono">
                  SEASON 1 BATTLE PASS TOKEN VAULT
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-900 font-bold uppercase rounded font-mono">
                  Active Season Currency
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-[#111111] font-mono tracking-tight">
                  {pointsBalance.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-amber-600 uppercase font-mono">
                  BP Points
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">
                Earned via tier advancements, daily directives, and combat fleet commendations.
              </p>
            </div>
          </div>

          {/* Quick Action Stipends */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="bp-claim-daily-points-btn"
              type="button"
              disabled={dailyPointsClaimed}
              onClick={handleClaimDailyPoints}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono border transition-all flex items-center gap-2 cursor-pointer ${
                dailyPointsClaimed
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                  : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-sm'
              }`}
            >
              <Gift size={14} />
              <span>{dailyPointsClaimed ? 'Daily Claimed' : 'Daily Stipend (+200 BP)'}</span>
            </button>

            <button
              id="bp-drill-points-btn"
              type="button"
              onClick={handleWarDrillPoints}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono border border-[#111111] bg-[#111111] text-white hover:bg-[#222222] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Crosshair size={14} className="text-amber-400" />
              <span>War Drill (+250 BP)</span>
            </button>

            <button
              id="bp-convert-xp-btn"
              type="button"
              onClick={handleConvertXpToPoints}
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider font-mono border border-[#dedede] bg-neutral-50 text-[#444444] hover:bg-white hover:border-[#111111] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Convert 1,000 Seasonal XP into 100 Battle Pass Points"
            >
              <TrendingUp size={13} className="text-emerald-600" />
              <span>Convert 1k XP (100 BP)</span>
            </button>
          </div>
        </div>

        {/* Earning Guide Strip */}
        <div className="mt-4 pt-3 border-t border-[#eeeeee] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#666666] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Directives: <strong>+150–300 BP</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
            <span>Tier Rewards: <strong>+100 BP</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>Daily Logins: <strong>+200 BP</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
            <span>Combat Milestones: <strong>+250 BP</strong></span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. FILTER & SEARCH CONTROLS */}
      {/* ============================================================ */}
      <div className="border border-[#dedede] bg-white p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              id="filter-cat-all"
              type="button"
              onClick={() => {
                sound.play('click');
                setCategoryFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase font-mono tracking-wider transition-colors cursor-pointer border ${
                categoryFilter === 'all'
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-neutral-50 text-[#555555] border-[#dedede] hover:bg-neutral-100'
              }`}
            >
              All Items ({shopItems.length})
            </button>
            <button
              id="filter-cat-skins"
              type="button"
              onClick={() => {
                sound.play('click');
                setCategoryFilter('unit_skin');
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase font-mono tracking-wider transition-colors cursor-pointer border flex items-center gap-1.5 ${
                categoryFilter === 'unit_skin'
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-neutral-50 text-[#555555] border-[#dedede] hover:bg-neutral-100'
              }`}
            >
              <Palette size={13} className={categoryFilter === 'unit_skin' ? 'text-amber-400' : 'text-[#777777]'} />
              <span>Cosmetic Unit Skins ({skinCount})</span>
            </button>
            <button
              id="filter-cat-bundles"
              type="button"
              onClick={() => {
                sound.play('click');
                setCategoryFilter('resource_bundle');
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase font-mono tracking-wider transition-colors cursor-pointer border flex items-center gap-1.5 ${
                categoryFilter === 'resource_bundle'
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-neutral-50 text-[#555555] border-[#dedede] hover:bg-neutral-100'
              }`}
            >
              <Package size={13} className={categoryFilter === 'resource_bundle' ? 'text-amber-400' : 'text-[#777777]'} />
              <span>Starting Resource Bundles ({bundleCount})</span>
            </button>
          </div>

          {/* Rarity & Search */}
          <div className="flex items-center gap-2">
            <select
              id="bp-shop-rarity-select"
              aria-label="Filter shop items by rarity"
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as any)}
              className="text-xs font-mono border border-[#dedede] bg-white px-2.5 py-1.5 text-[#333333] focus:outline-none focus:border-[#111111]"
            >
              <option value="all">All Rarities</option>
              <option value="rare">Rare Tier</option>
              <option value="epic">Epic Tier</option>
              <option value="legendary">Legendary Tier</option>
              <option value="mythic">Mythic Tier</option>
            </select>

            <div className="relative">
              <input
                id="bp-shop-search-input"
                type="text"
                placeholder="Search skins or resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs font-mono border border-[#dedede] pl-7 pr-3 py-1.5 text-[#222222] placeholder-[#888888] focus:outline-none focus:border-[#111111] w-48"
              />
              <Search size={12} className="absolute left-2.5 top-2.5 text-[#888888]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-xs text-[#888888] hover:text-[#111111]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ITEM CARDS GRID */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const rarity = getRarityBadge(item.rarity);
          const isOwnedCosmetic =
            item.category === 'unit_skin' &&
            (item.purchased || cosmeticsLocker.some((c) => c.id === item.cosmeticDetails?.id));
          const isEquippedCosmetic =
            item.category === 'unit_skin' &&
            cosmeticsLocker.some((c) => c.id === item.cosmeticDetails?.id && c.equipped);
          const canAfford = pointsBalance >= item.pricePoints;

          return (
            <div
              key={item.id}
              id={`shop-item-${item.id}`}
              className={`border bg-white flex flex-col justify-between transition-all hover:shadow-md ${rarity.border}`}
            >
              {/* Card Header & Badge */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-neutral-50 border border-neutral-200 rounded">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${rarity.tag}`}>
                          {item.rarity}
                        </span>
                        <span className="text-[10px] text-[#777777] font-mono uppercase font-semibold">
                          {item.category === 'unit_skin' ? 'Unit Skin' : 'Resource Bundle'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#111111] leading-snug mt-0.5">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Target Unit Badge if skin */}
                {item.unitTarget && (
                  <div className="text-[10px] font-mono text-[#555555] bg-neutral-50 px-2.5 py-1 border border-neutral-200 flex items-center gap-1.5">
                    <Rocket size={11} className="text-sky-600" />
                    <span>Unit: <strong>{item.unitTarget}</strong></span>
                  </div>
                )}

                {/* Color Swatch Preview for skins */}
                {item.category === 'unit_skin' && item.previewColor && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#666666]">
                      <span>Hull Coating & Energy Glow:</span>
                      <button
                        type="button"
                        onClick={() => setInspectItem(item)}
                        className="text-sky-600 hover:text-sky-800 font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Eye size={11} />
                        <span>Inspect Model</span>
                      </button>
                    </div>
                    <div
                      className="h-6 w-full rounded border border-neutral-300 relative overflow-hidden flex items-center px-2 shadow-inner"
                      style={{
                        background: `linear-gradient(90deg, ${item.previewColor} 0%, ${item.accentColor || '#38bdf8'} 100%)`,
                      }}
                    >
                      <span className="text-[9px] font-mono font-bold text-white drop-shadow">
                        ACTIVE CHROMATIC REFRACTION
                      </span>
                    </div>
                  </div>
                )}

                {/* Resource Bundle Grid breakdown */}
                {item.category === 'resource_bundle' && item.resourceBonus && (
                  <div className="bg-[#fafafa] border border-neutral-200 p-2.5 rounded space-y-1.5">
                    <span className="text-[10px] font-bold text-[#666666] uppercase font-mono block">
                      Guaranteed Manifest Contents:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                      {item.resourceBonus.naquadah && (
                        <div className="text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200 rounded">
                          +{item.resourceBonus.naquadah.toLocaleString()} Naq
                        </div>
                      )}
                      {item.resourceBonus.metal && (
                        <div className="text-slate-800 bg-slate-100 px-1.5 py-0.5 border border-slate-300 rounded">
                          +{item.resourceBonus.metal.toLocaleString()} Metal
                        </div>
                      )}
                      {item.resourceBonus.crystal && (
                        <div className="text-sky-800 bg-sky-50 px-1.5 py-0.5 border border-sky-200 rounded">
                          +{item.resourceBonus.crystal.toLocaleString()} Crystal
                        </div>
                      )}
                      {item.resourceBonus.deuterium && (
                        <div className="text-cyan-800 bg-cyan-50 px-1.5 py-0.5 border border-cyan-200 rounded">
                          +{item.resourceBonus.deuterium.toLocaleString()} Deut
                        </div>
                      )}
                      {item.resourceBonus.energy && (
                        <div className="text-yellow-800 bg-yellow-50 px-1.5 py-0.5 border border-yellow-200 rounded">
                          +{item.resourceBonus.energy.toLocaleString()} Energy
                        </div>
                      )}
                      {item.resourceBonus.darkMatter && (
                        <div className="text-purple-800 bg-purple-50 px-1.5 py-0.5 border border-purple-200 rounded">
                          +{item.resourceBonus.darkMatter.toLocaleString()} DM
                        </div>
                      )}
                      {item.resourceBonus.attackTurns && (
                        <div className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded">
                          +{item.resourceBonus.attackTurns} Turns
                        </div>
                      )}
                      {item.resourceBonus.attackUnits && (
                        <div className="text-red-800 bg-red-50 px-1.5 py-0.5 border border-red-200 rounded">
                          +{item.resourceBonus.attackUnits} Troops
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Lore / Description */}
                <p className="text-xs text-[#555555] leading-relaxed">
                  {item.description}
                </p>

                {/* Bonus effect tag */}
                {item.bonusEffect && (
                  <div className="text-[11px] font-mono text-[#222222] bg-neutral-100 px-2 py-1 border-l-2 border-amber-500">
                    <span className="font-bold">Perk:</span> {item.bonusEffect}
                  </div>
                )}
              </div>

              {/* Card Footer & Action */}
              <div className="p-4 pt-3 border-t border-[#eeeeee] bg-neutral-50/50 flex items-center justify-between gap-3">
                {/* Price Display */}
                <div className="font-mono">
                  <span className="text-[9px] uppercase text-[#777777] block font-bold">Cost</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold text-sm text-[#111111]">
                      {item.pricePoints.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">BP</span>
                  </div>
                </div>

                {/* Action Button */}
                {isOwnedCosmetic ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200 rounded flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>OWNED</span>
                    </span>
                    <button
                      id={`equip-btn-${item.id}`}
                      type="button"
                      onClick={() => {
                        if (item.cosmeticDetails) {
                          onToggleEquipCosmetic(item.cosmeticDetails.id);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-bold uppercase font-mono tracking-wider border cursor-pointer transition-colors ${
                        isEquippedCosmetic
                          ? 'bg-neutral-800 text-white border-neutral-800 hover:bg-neutral-900'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-800'
                      }`}
                    >
                      {isEquippedCosmetic ? 'Equipped' : 'Equip'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {item.purchaseCount !== undefined && item.purchaseCount > 0 && (
                      <span className="text-[10px] font-mono text-[#777777] bg-neutral-100 px-1.5 py-0.5 rounded">
                        x{item.purchaseCount}
                      </span>
                    )}
                    <button
                      id={`buy-btn-${item.id}`}
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handlePurchaseItem(item)}
                      className={`px-3.5 py-2 text-xs font-bold uppercase font-mono tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                        canAfford
                          ? 'bg-[#111111] text-white border-[#111111] hover:bg-[#252525] shadow-sm'
                          : 'bg-neutral-200 text-neutral-500 border-neutral-300 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag size={13} className={canAfford ? 'text-amber-400' : ''} />
                      <span>{canAfford ? 'Redeem' : 'Need BP'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="border border-[#dedede] bg-white p-12 text-center space-y-3">
          <Package size={36} className="text-[#888888] mx-auto opacity-50" />
          <h4 className="font-bold text-sm text-[#111111] uppercase font-mono">
            No matching items found
          </h4>
          <p className="text-xs text-[#666666]">
            Try adjusting your search criteria or category filter options.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              setRarityFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold font-mono text-[#111111] underline hover:no-underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. COSMETIC SKIN INSPECT MODAL */}
      {/* ============================================================ */}
      {inspectItem && inspectItem.category === 'unit_skin' && (
        <div
          id="cosmetic-skin-inspect-modal"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="bg-white border border-[#111111] max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setInspectItem(null)}
              className="absolute top-4 right-4 text-[#777777] hover:text-[#111111] text-lg font-bold cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded">
                  {inspectItem.rarity.toUpperCase()} COSMETIC
                </span>
                <span className="text-[10px] font-mono text-[#777777]">
                  {inspectItem.unitTarget}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#111111] mt-1 flex items-center gap-2">
                <span>{inspectItem.icon}</span>
                <span>{inspectItem.name}</span>
              </h3>
            </div>

            {/* Holographic Ship Display Box */}
            <div
              className="h-44 w-full rounded border border-neutral-300 relative flex flex-col items-center justify-center text-center p-4 overflow-hidden shadow-inner"
              style={{
                background: `radial-gradient(circle at center, ${inspectItem.previewColor} 0%, #09090b 100%)`,
              }}
            >
              {/* Accent Particle Glow */}
              <div
                className="absolute inset-0 opacity-40 blur-xl pointer-events-none"
                style={{ backgroundColor: inspectItem.accentColor || '#38bdf8' }}
              />

              <div className="relative z-10 space-y-2">
                <span className="text-5xl drop-shadow-lg">{inspectItem.icon}</span>
                <div className="font-mono text-xs text-white font-bold tracking-wider uppercase">
                  {inspectItem.unitTarget}
                </div>
                <div
                  className="text-[11px] font-mono font-semibold px-3 py-1 rounded inline-block border"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderColor: inspectItem.accentColor || '#38bdf8',
                    color: inspectItem.accentColor || '#38bdf8',
                  }}
                >
                  Active Livery: {inspectItem.name}
                </div>
              </div>
            </div>

            {/* Tactical & Lore Information */}
            <div className="space-y-2 font-mono text-xs text-[#444444]">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#777777] block">
                  Material Composition & Specifications:
                </span>
                <p className="text-xs text-[#222222] leading-relaxed">
                  {inspectItem.description}
                </p>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded">
                <strong>Visual Buff:</strong> {inspectItem.bonusEffect}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <div className="font-mono">
                <span className="text-[10px] text-[#777777] block">PRICE</span>
                <span className="font-bold text-base text-[#111111]">
                  {inspectItem.pricePoints.toLocaleString()} BP Points
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectItem(null)}
                  className="px-3.5 py-2 text-xs font-mono font-bold uppercase border border-[#dedede] bg-white text-[#444444] hover:bg-neutral-50 cursor-pointer"
                >
                  Close
                </button>

                {inspectItem.purchased ||
                cosmeticsLocker.some((c) => c.id === inspectItem.cosmeticDetails?.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (inspectItem.cosmeticDetails) {
                        onToggleEquipCosmetic(inspectItem.cosmeticDetails.id);
                      }
                    }}
                    className="px-4 py-2 text-xs font-mono font-bold uppercase border border-[#111111] bg-[#111111] text-white hover:bg-[#252525] cursor-pointer"
                  >
                    Toggle Active Loadout
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={pointsBalance < inspectItem.pricePoints}
                    onClick={() => {
                      handlePurchaseItem(inspectItem);
                      setInspectItem(null);
                    }}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase border cursor-pointer ${
                      pointsBalance >= inspectItem.pricePoints
                        ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600 shadow-sm'
                        : 'bg-neutral-200 border-neutral-300 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Purchase Skin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
