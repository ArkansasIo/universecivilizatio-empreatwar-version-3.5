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
  Sliders,
  Compass,
} from 'lucide-react';
import { sound } from '../../sound';
import {
  StoreItem,
  BattlePassTier,
  BattlePassQuest,
  BattlePassState,
  BattlePassShopItem,
  PlayerResources,
  CosmeticRewardDetails,
  ResourceBonusDetails,
} from '../../types';
import {
  INITIAL_STORE_ITEMS,
  INITIAL_BATTLE_PASS_TIERS,
  INITIAL_BATTLE_PASS_QUESTS,
  INITIAL_BATTLE_PASS_STATE,
  INITIAL_COSMETICS_CATALOG,
  INITIAL_BATTLE_PASS_SHOP_ITEMS,
} from '../../storeBattlePassData';
import { BattlePassShopPanel } from './battlepass/BattlePassShopPanel';
import { CommanderGachaStorePanel } from './commander/CommanderGachaStorePanel';

interface StoreBattlePassViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  defaultTab?: 'store' | 'battlepass' | 'commander-gotcha';
}

export const StoreBattlePassView: React.FC<StoreBattlePassViewProps> = ({
  resources,
  onUpdateResources,
  defaultTab = 'battlepass',
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'battlepass' | 'commander-gotcha'>(defaultTab);
  const [bpSubTab, setBpSubTab] = useState<'track' | 'shop' | 'matrix' | 'wardrobe' | 'directives'>('track');
  const [storeCategory, setStoreCategory] = useState<'all' | 'officer' | 'booster' | 'relic' | 'cosmetic'>('all');

  // Local state with persistence
  const [storeItems, setStoreItems] = useState<StoreItem[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_store_items');
      return saved ? JSON.parse(saved) : INITIAL_STORE_ITEMS;
    } catch {
      return INITIAL_STORE_ITEMS;
    }
  });

  const [passState, setPassState] = useState<BattlePassState>(() => {
    try {
      const saved = localStorage.getItem('uc_state_bp_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.battlePassPoints === undefined) {
          parsed.battlePassPoints = 1250;
        }
        return parsed;
      }
      return INITIAL_BATTLE_PASS_STATE;
    } catch {
      return INITIAL_BATTLE_PASS_STATE;
    }
  });

  const [shopItems, setShopItems] = useState<BattlePassShopItem[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_bp_shop_items');
      return saved ? JSON.parse(saved) : INITIAL_BATTLE_PASS_SHOP_ITEMS;
    } catch {
      return INITIAL_BATTLE_PASS_SHOP_ITEMS;
    }
  });

  const handleUpdateShopItems = (items: BattlePassShopItem[]) => {
    setShopItems(items);
    localStorage.setItem('uc_state_bp_shop_items', JSON.stringify(items));
  };

  const [tiers, setTiers] = useState<BattlePassTier[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_bp_tiers');
      return saved ? JSON.parse(saved) : INITIAL_BATTLE_PASS_TIERS;
    } catch {
      return INITIAL_BATTLE_PASS_TIERS;
    }
  });

  const [quests, setQuests] = useState<BattlePassQuest[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_bp_quests');
      return saved ? JSON.parse(saved) : INITIAL_BATTLE_PASS_QUESTS;
    } catch {
      return INITIAL_BATTLE_PASS_QUESTS;
    }
  });

  // Cosmetic Locker state
  const [cosmeticsLocker, setCosmeticsLocker] = useState<CosmeticRewardDetails[]>(() => {
    try {
      const saved = localStorage.getItem('uc_state_bp_cosmetics');
      return saved ? JSON.parse(saved) : INITIAL_COSMETICS_CATALOG;
    } catch {
      return INITIAL_COSMETICS_CATALOG;
    }
  });

  const [selectedTierLevel, setSelectedTierLevel] = useState<number>(passState.currentLevel);
  const [selectedCosmeticInspect, setSelectedCosmeticInspect] = useState<CosmeticRewardDetails | null>(null);
  const [wardrobeCategory, setWardrobeCategory] = useState<'all' | 'skin' | 'avatar' | 'title' | 'engine_trail' | 'hologram'>('all');
  const [wardrobeRarity, setWardrobeRarity] = useState<'all' | 'rare' | 'epic' | 'legendary' | 'mythic'>('all');
  const [questFilter, setQuestFilter] = useState<'all' | 'daily' | 'weekly' | 'milestone'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(false);

  const darkMatterBalance = resources.darkMatter ?? 2500;

  const showNotification = (type: 'success' | 'warning', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 5000);
  };

  // Helper to apply resource bonuses cleanly
  const applyResourceBonus = (bonus?: ResourceBonusDetails, label = 'Reward') => {
    if (!bonus) return '';
    const updates: Partial<PlayerResources> = {};
    const summary: string[] = [];

    if (bonus.naquadah) {
      updates.naquadah = (resources.naquadah ?? 0) + bonus.naquadah;
      summary.push(`+${bonus.naquadah.toLocaleString()} Naq`);
    }
    if (bonus.metal) {
      updates.metal = (resources.metal ?? 0) + bonus.metal;
      summary.push(`+${bonus.metal.toLocaleString()} Metal`);
    }
    if (bonus.crystal) {
      updates.crystal = (resources.crystal ?? 0) + bonus.crystal;
      summary.push(`+${bonus.crystal.toLocaleString()} Crystal`);
    }
    if (bonus.deuterium) {
      updates.deuterium = (resources.deuterium ?? 0) + bonus.deuterium;
      summary.push(`+${bonus.deuterium.toLocaleString()} Deut`);
    }
    if (bonus.energy) {
      updates.energy = (resources.energy ?? 0) + bonus.energy;
      summary.push(`+${bonus.energy.toLocaleString()} Energy`);
    }
    if (bonus.attackTurns) {
      updates.attackTurns = (resources.attackTurns ?? 0) + bonus.attackTurns;
      summary.push(`+${bonus.attackTurns} Turns`);
    }
    if (bonus.darkMatter) {
      updates.darkMatter = darkMatterBalance + bonus.darkMatter;
      summary.push(`+${bonus.darkMatter} DM`);
    }
    if (bonus.attackUnits) {
      updates.attackUnits = (resources.attackUnits ?? 0) + bonus.attackUnits;
      summary.push(`+${bonus.attackUnits} Troops`);
    }

    if (Object.keys(updates).length > 0) {
      onUpdateResources(updates);
    }

    return summary.join(', ');
  };

  // Helper to unlock cosmetic
  const unlockCosmetic = (cosmetic?: CosmeticRewardDetails) => {
    if (!cosmetic) return;
    setCosmeticsLocker((prev) => {
      const exists = prev.some((c) => c.id === cosmetic.id);
      const updated = exists ? prev : [...prev, cosmetic];
      localStorage.setItem('uc_state_bp_cosmetics', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle Equip Cosmetic
  const handleToggleEquipCosmetic = (cosmeticId: string) => {
    const updated = cosmeticsLocker.map((c) => {
      if (c.id === cosmeticId) {
        return { ...c, equipped: !c.equipped };
      }
      // If equipping a title or avatar, unequip other items of the same type
      if (
        c.type === cosmeticsLocker.find((item) => item.id === cosmeticId)?.type &&
        (c.type === 'title' || c.type === 'avatar') &&
        !cosmeticsLocker.find((item) => item.id === cosmeticId)?.equipped
      ) {
        return { ...c, equipped: false };
      }
      return c;
    });

    setCosmeticsLocker(updated);
    localStorage.setItem('uc_state_bp_cosmetics', JSON.stringify(updated));
    sound.play('confirm');
    const target = updated.find((c) => c.id === cosmeticId);
    showNotification(
      'success',
      target?.equipped
        ? `Equipped ${target.name} (${target.type.toUpperCase()}) to Active Loadout!`
        : `Unequipped ${target?.name} from Active Loadout.`
    );
  };

  // Buy Item Handler in Store
  const handleBuyItem = (item: StoreItem) => {
    if (item.currency === 'darkMatter') {
      if (darkMatterBalance < item.price) {
        sound.play('warning');
        showNotification('warning', `Insufficient Dark Matter! Need ${item.price.toLocaleString()} DM.`);
        return;
      }
      const newDm = darkMatterBalance - item.price;
      onUpdateResources({ darkMatter: newDm });

      if (item.id === 'naquadah_warp_cache') {
        onUpdateResources({ naquadah: resources.naquadah + 500000 });
      } else if (item.id === 'energy_core_instant') {
        onUpdateResources({ energy: resources.energy + 10000 });
      }

      const updated = storeItems.map((si) => {
        if (si.id === item.id) {
          return {
            ...si,
            purchased: si.category === 'officer' || si.category === 'cosmetic' ? true : si.purchased,
            quantityOwned: (si.quantityOwned || 0) + 1,
          };
        }
        return si;
      });

      setStoreItems(updated);
      localStorage.setItem('uc_state_store_items', JSON.stringify(updated));
      sound.play('confirm');
      showNotification('success', `Acquired ${item.name}! Applied bonus: ${item.bonusEffect}`);
    }
  };

  // Claim Daily Free Gift
  const handleClaimDailyGift = () => {
    if (dailyClaimed) return;
    const bonusDm = 250;
    const bonusNaq = 100000;
    onUpdateResources({
      darkMatter: darkMatterBalance + bonusDm,
      naquadah: resources.naquadah + bonusNaq,
    });
    setDailyClaimed(true);
    sound.play('success');
    showNotification(
      'success',
      `Daily Stargate Supply Cache Claimed! Received +${bonusDm} Dark Matter & +${bonusNaq.toLocaleString()} Naquadah!`
    );
  };

  // Unlock Elite Battle Pass
  const handleUnlockElitePass = () => {
    const cost = 2000;
    if (darkMatterBalance < cost) {
      sound.play('warning');
      showNotification('warning', `Unlocking the Elite Conquest Pass requires 2,000 Dark Matter.`);
      return;
    }
    onUpdateResources({ darkMatter: darkMatterBalance - cost });
    const newPass = { ...passState, hasElitePass: true };
    setPassState(newPass);
    localStorage.setItem('uc_state_bp_state', JSON.stringify(newPass));
    sound.play('success');
    showNotification('success', 'Elite Battle Pass Activated! All VIP Track Rewards & Exclusive Cosmetics Unlocked!');
  };

  // Claim Tier Reward
  const handleClaimTier = (level: number, type: 'free' | 'elite') => {
    const tier = tiers.find((t) => t.level === level);
    if (!tier) return;

    if (passState.currentLevel < level) {
      sound.play('warning');
      showNotification('warning', `Battle Pass Tier ${level} not yet reached! Earn more Season Points.`);
      return;
    }

    if (type === 'elite' && !passState.hasElitePass) {
      sound.play('warning');
      showNotification('warning', 'Elite Pass required to claim VIP track rewards.');
      return;
    }

    const reward = type === 'free' ? tier.freeReward : tier.eliteReward;
    let bonusSummary = '';

    // Apply explicit resource bonuses if defined
    if (reward.resourceBonus) {
      bonusSummary = applyResourceBonus(reward.resourceBonus, reward.name);
    } else {
      // Legacy fallback
      if (reward.type === 'resource' || reward.type === 'currency') {
        if (reward.name.includes('Naquadah')) {
          onUpdateResources({ naquadah: resources.naquadah + reward.quantity });
        } else if (reward.name.includes('Metal')) {
          onUpdateResources({ metal: resources.metal + reward.quantity });
        }
      } else if (reward.type === 'darkMatter') {
        onUpdateResources({ darkMatter: darkMatterBalance + reward.quantity });
      } else if (reward.type === 'ship' || reward.type === 'titanShip') {
        onUpdateResources({ superUnits: (resources.superUnits || 0) + reward.quantity });
      }
    }

    // Unlock cosmetic if attached
    if (type === 'elite' && tier.eliteReward.cosmeticReward) {
      unlockCosmetic(tier.eliteReward.cosmeticReward);
    }

    const updatedTiers = tiers.map((t) => {
      if (t.level === level) {
        return {
          ...t,
          claimedFree: type === 'free' ? true : t.claimedFree,
          claimedElite: type === 'elite' ? true : t.claimedElite,
        };
      }
      return t;
    });

    setTiers(updatedTiers);
    localStorage.setItem('uc_state_bp_tiers', JSON.stringify(updatedTiers));
    sound.play('confirm');

    const cosmeticTag =
      type === 'elite' && tier.eliteReward.cosmeticReward
        ? ` + Unlocked [${tier.eliteReward.cosmeticReward.rarity.toUpperCase()}] ${tier.eliteReward.cosmeticReward.name}`
        : '';

    showNotification(
      'success',
      `Claimed Tier ${level} ${type === 'elite' ? 'VIP' : 'Free'} Reward: ${reward.name}! ${
        bonusSummary ? `(${bonusSummary})` : ''
      }${cosmeticTag}`
    );
  };

  // Claim All Available Rewards
  const handleClaimAll = () => {
    let claimedCount = 0;
    let cosmeticCount = 0;
    const claimedBonuses: ResourceBonusDetails = {
      naquadah: 0,
      metal: 0,
      crystal: 0,
      deuterium: 0,
      energy: 0,
      attackTurns: 0,
      darkMatter: 0,
      attackUnits: 0,
    };

    const updatedTiers = tiers.map((t) => {
      let cFree = t.claimedFree;
      let cElite = t.claimedElite;

      if (passState.currentLevel >= t.level && !cFree) {
        cFree = true;
        claimedCount++;
        if (t.freeReward.resourceBonus) {
          const b = t.freeReward.resourceBonus;
          claimedBonuses.naquadah! += b.naquadah || 0;
          claimedBonuses.metal! += b.metal || 0;
          claimedBonuses.crystal! += b.crystal || 0;
          claimedBonuses.deuterium! += b.deuterium || 0;
          claimedBonuses.energy! += b.energy || 0;
          claimedBonuses.attackTurns! += b.attackTurns || 0;
          claimedBonuses.attackUnits! += b.attackUnits || 0;
          claimedBonuses.darkMatter! += b.darkMatter || 0;
        } else if (t.freeReward.name.includes('Naquadah')) {
          claimedBonuses.naquadah! += t.freeReward.quantity;
        }
      }

      if (passState.currentLevel >= t.level && passState.hasElitePass && !cElite) {
        cElite = true;
        claimedCount++;
        if (t.eliteReward.resourceBonus) {
          const b = t.eliteReward.resourceBonus;
          claimedBonuses.naquadah! += b.naquadah || 0;
          claimedBonuses.metal! += b.metal || 0;
          claimedBonuses.crystal! += b.crystal || 0;
          claimedBonuses.deuterium! += b.deuterium || 0;
          claimedBonuses.energy! += b.energy || 0;
          claimedBonuses.attackTurns! += b.attackTurns || 0;
          claimedBonuses.attackUnits! += b.attackUnits || 0;
          claimedBonuses.darkMatter! += b.darkMatter || 0;
        } else if (t.eliteReward.type === 'darkMatter') {
          claimedBonuses.darkMatter! += t.eliteReward.quantity;
        }

        if (t.eliteReward.cosmeticReward) {
          unlockCosmetic(t.eliteReward.cosmeticReward);
          cosmeticCount++;
        }
      }

      return { ...t, claimedFree: cFree, claimedElite: cElite };
    });

    if (claimedCount === 0) {
      showNotification('warning', 'No uncollected rewards available right now.');
      return;
    }

    applyResourceBonus(claimedBonuses);
    setTiers(updatedTiers);
    localStorage.setItem('uc_state_bp_tiers', JSON.stringify(updatedTiers));
    sound.play('success');
    showNotification(
      'success',
      `Claimed ${claimedCount} track rewards in batch! Added resource bonuses and unlocked ${cosmeticCount} cosmetics.`
    );
  };

  // Accumulate Points / XP
  const handleAccumulatePoints = (amount: number, reason: string) => {
    let newXp = passState.currentXp + amount;
    let newLevel = passState.currentLevel;
    let newTotal = passState.totalXpEarned + amount;
    let leveledUp = false;

    while (newXp >= passState.xpToNextLevel && newLevel < 50) {
      newXp -= passState.xpToNextLevel;
      newLevel += 1;
      leveledUp = true;
    }

    const newPassState = {
      ...passState,
      currentLevel: newLevel,
      currentXp: newXp,
      totalXpEarned: newTotal,
    };

    setPassState(newPassState);
    localStorage.setItem('uc_state_bp_state', JSON.stringify(newPassState));

    if (leveledUp) {
      sound.play('research');
      setSelectedTierLevel(newLevel);
      showNotification(
        'success',
        `Tier Level Up! You advanced to Season Tier ${newLevel}! New cosmetic & resource rewards ready to unlock!`
      );
    } else {
      sound.play('confirm');
      showNotification(
        'success',
        `+${amount} Season Points accumulated from ${reason}! (${newXp}/${passState.xpToNextLevel} XP to Tier ${newLevel + 1})`
      );
    }
  };

  // Claim Quest XP
  const handleClaimQuest = (quest: BattlePassQuest) => {
    if (!quest.completed || quest.claimed) return;

    handleAccumulatePoints(quest.xpReward, quest.title);

    const updatedQuests = quests.map((q) => (q.id === quest.id ? { ...q, claimed: true } : q));
    setQuests(updatedQuests);
    localStorage.setItem('uc_state_bp_quests', JSON.stringify(updatedQuests));
  };

  const selectedTier = tiers.find((t) => t.level === selectedTierLevel) || tiers[0];

  const filteredStoreItems =
    storeCategory === 'all' ? storeItems : storeItems.filter((i) => i.category === storeCategory);

  const filteredQuests =
    questFilter === 'all' ? quests : quests.filter((q) => q.type === questFilter);

  const filteredCosmetics = cosmeticsLocker.filter((c) => {
    const matchCategory = wardrobeCategory === 'all' || c.type === wardrobeCategory;
    const matchRarity = wardrobeRarity === 'all' || c.rarity === wardrobeRarity;
    return matchCategory && matchRarity;
  });

  return (
    <div id="store-battlepass-view" className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#dedede] bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
            IMPERIAL COMMERCE & CONQUEST ARCHIVE
          </div>
          <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-3">
            <span>Galactic Store & Season Battle Pass</span>
            <span className="text-xs bg-[#111111] text-white px-2.5 py-0.5 font-mono uppercase">
              Season 1 Active
            </span>
          </h2>
          <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
            Acquire specialized fleet officers, resource overdrive stims, and unlock 50 tiers of elite warship
            skins, cosmetic badges, dark matter caches, and resource bonuses as you accumulate season points.
          </p>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center gap-4 bg-[#fafafa] border border-[#dedede] p-3 font-mono">
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#777777] block uppercase">Dark Matter Reserves</span>
            <span className="text-lg font-bold text-[#111111] flex items-center gap-1.5 justify-end">
              <span>🌌</span>
              <span>{darkMatterBalance.toLocaleString()} DM</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleClaimDailyGift}
            disabled={dailyClaimed}
            className={`px-3 py-2 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
              dailyClaimed
                ? 'bg-[#eeeeee] text-[#888888] cursor-not-allowed'
                : 'bg-[#111111] text-white hover:bg-[#333333]'
            }`}
          >
            <Gift size={13} />
            <span>{dailyClaimed ? 'Claimed Today' : 'Daily Cache (+250 DM)'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Notice */}
      {notification && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center ${
            notification.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
          }`}
        >
          <span>{notification.text}</span>
          <button type="button" onClick={() => setNotification(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Tab Switcher */}
      <div className="flex border-b border-[#dedede] gap-2">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('battlepass');
          }}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'battlepass'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Crown size={14} />
          <span>Conquest Battle Pass (Season 1)</span>
          <span className="ml-1 px-1.5 py-0.5 bg-[#111111] text-white text-[10px] font-mono">
            Tier {passState.currentLevel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('store');
          }}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'store'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <ShoppingBag size={14} />
          <span>In-Game Galactic Store</span>
        </button>

        <button
          type="button"
          id="tab-btn-commander-gotcha"
          onClick={() => {
            sound.play('click');
            setActiveTab('commander-gotcha');
          }}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === 'commander-gotcha'
              ? 'border-[#111111] text-[#111111] bg-white font-black'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>72 Commanders & Gotcha Warp Gate</span>
          <span className="ml-1 px-1.5 py-0.5 bg-amber-400 text-black text-[9px] font-bold uppercase">
            72 Officers
          </span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* BATTLE PASS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'battlepass' && (
        <div className="space-y-6">
          {/* Subtabs for Battle Pass */}
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[#dedede] bg-white p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  setBpSubTab('track');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bpSubTab === 'track' ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#555555] hover:bg-[#e5e5e5]'
                }`}
              >
                <Layers size={13} />
                <span>Tier Progression Track</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  setBpSubTab('wardrobe');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bpSubTab === 'wardrobe' ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#555555] hover:bg-[#e5e5e5]'
                }`}
              >
                <Palette size={13} />
                <span>Cosmetic Wardrobe & Armory ({cosmeticsLocker.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  setBpSubTab('matrix');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bpSubTab === 'matrix' ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#555555] hover:bg-[#e5e5e5]'
                }`}
              >
                <Sliders size={13} />
                <span>50-Tier Reward Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  setBpSubTab('directives');
                }}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  bpSubTab === 'directives' ? 'bg-[#111111] text-white' : 'bg-[#f5f5f5] text-[#555555] hover:bg-[#e5e5e5]'
                }`}
              >
                <Compass size={13} />
                <span>XP Directives & Quests</span>
              </button>
            </div>

            {/* Quick Points Boosters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#777777] uppercase hidden lg:inline-block">
                Accumulate Points:
              </span>
              <button
                type="button"
                onClick={() => handleAccumulatePoints(350, 'Scout Patrol Operations')}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-[#dedede] text-neutral-800 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                title="Simulate planetary patrol to earn XP"
              >
                <Flame size={12} className="text-amber-500" />
                <span>+350 XP</span>
              </button>
              <button
                type="button"
                onClick={() => handleAccumulatePoints(600, 'Fleet Battle Engagement')}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 border border-[#dedede] text-neutral-800 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                title="Simulate combat skirmish to earn XP"
              >
                <Crosshair size={12} className="text-rose-500" />
                <span>+600 XP</span>
              </button>
              <button
                type="button"
                onClick={() => handleAccumulatePoints(1000, 'Deep Rim Stargate Incursion')}
                className="px-2.5 py-1 bg-[#111111] hover:bg-[#333333] text-white text-[11px] font-bold cursor-pointer flex items-center gap-1"
                title="High-yield mission to earn XP"
              >
                <Sparkles size={12} className="text-amber-300" />
                <span>+1,000 XP</span>
              </button>
            </div>
          </div>

          {/* Season Pass Hero Card */}
          <div className="border border-[#dedede] bg-white p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                    {passState.seasonName}
                  </span>
                  <span className="text-xs text-[#777777] font-mono">
                    ⏳ {passState.daysRemaining} Days Remaining
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111111]">
                  Current Season Rank: Tier {passState.currentLevel} / 50
                </h3>
                <p className="text-xs text-[#666666] mt-1 max-w-xl">
                  Points accumulated: <strong className="text-[#111111]">{passState.totalXpEarned.toLocaleString()} Total XP</strong>.
                  Progressing through tiers unlocks valuable resource caches, heavy warships, and unique cosmetic skins & titles!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleClaimAll}
                  className="px-4 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Award size={14} />
                  <span>Claim All Available</span>
                </button>

                {!passState.hasElitePass ? (
                  <button
                    type="button"
                    onClick={handleUnlockElitePass}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Crown size={14} />
                    <span>Unlock VIP Elite Pass (2,000 DM)</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-amber-600" />
                    <span>VIP Elite Pass Activated ★</span>
                  </div>
                )}
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6 pt-4 border-t border-[#eeeeee]">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="font-bold text-[#111111]">
                  Tier {passState.currentLevel} Progress · Level {passState.currentLevel + 1} Threshold
                </span>
                <span className="text-[#666666]">
                  {passState.currentXp.toLocaleString()} / {passState.xpToNextLevel.toLocaleString()} XP
                  ({Math.round((passState.currentXp / passState.xpToNextLevel) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-[#eeeeee] overflow-hidden">
                <div
                  className="h-full bg-[#111111] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((passState.currentXp / passState.xpToNextLevel) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: VISUAL TIERED PROGRESSION TRACK */}
          {/* ============================================================ */}
          {bpSubTab === 'track' && (
            <div className="space-y-6">
              {/* Horizontal Scrollable Progression Track */}
              <div className="border border-[#dedede] bg-white p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                      INTERACTIVE CONQUEST TIMELINE
                    </span>
                    <h3 className="font-bold text-base text-[#111111]">
                      Tiered Progression Track (Tiers 1 - 50)
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-neutral-200 border border-neutral-400 inline-block" /> Free Track
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-amber-500 border border-amber-600 inline-block" /> VIP Elite Track
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-rose-500 inline-block rounded-full" /> Cosmetic Milestone
                    </span>
                  </div>
                </div>

                {/* Track Scroll Container */}
                <div className="overflow-x-auto pb-4 pt-2">
                  <div className="min-w-[1300px] flex items-center relative py-8 px-4">
                    {/* Connecting Baseline */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-[#e5e5e5] z-0" />

                    {/* Active Progress Fill */}
                    <div
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-1.5 bg-[#111111] z-0 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            2,
                            (passState.currentLevel / 50) * 100 +
                              ((passState.currentXp / passState.xpToNextLevel) * (100 / 50))
                          )
                        )}%`,
                      }}
                    />

                    {/* Tier Nodes */}
                    <div className="flex justify-between w-full relative z-10">
                      {tiers.map((tier) => {
                        const isReached = passState.currentLevel >= tier.level;
                        const isCurrent = passState.currentLevel === tier.level;
                        const isSelected = selectedTierLevel === tier.level;
                        const hasCosmetic = !!tier.eliteReward.cosmeticReward;
                        const isFullyClaimed = tier.claimedFree && (!passState.hasElitePass || tier.claimedElite);

                        return (
                          <div
                            key={tier.level}
                            onClick={() => {
                              sound.play('click');
                              setSelectedTierLevel(tier.level);
                            }}
                            className={`flex flex-col items-center cursor-pointer group transition-all ${
                              isSelected ? 'scale-105' : 'hover:scale-102'
                            }`}
                          >
                            {/* Top Box: Free Reward Indicator */}
                            <div
                              className={`mb-3 p-1.5 border text-center transition-all min-w-[70px] ${
                                tier.claimedFree
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : isReached
                                  ? 'bg-neutral-100 border-neutral-400 text-neutral-900 font-bold'
                                  : 'bg-white border-[#dedede] text-neutral-400'
                              }`}
                            >
                              <div className="text-base">{tier.freeReward.icon}</div>
                              <span className="text-[9px] block font-mono truncate max-w-[65px]">
                                {tier.claimedFree ? '✓ Claimed' : isReached ? 'Claim Free' : 'Free'}
                              </span>
                            </div>

                            {/* Node Center Circle */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 transition-all relative ${
                                isSelected
                                  ? 'ring-4 ring-neutral-900/30 scale-110'
                                  : ''
                              } ${
                                isFullyClaimed
                                  ? 'bg-emerald-600 border-emerald-700 text-white'
                                  : isCurrent
                                  ? 'bg-amber-500 border-black text-black animate-pulse shadow-md'
                                  : isReached
                                  ? 'bg-[#111111] border-[#111111] text-white'
                                  : 'bg-white border-[#dedede] text-[#888888]'
                              }`}
                            >
                              {tier.level}
                              {hasCosmetic && (
                                <span
                                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border border-white text-[8px] flex items-center justify-center text-white"
                                  title="Unlocks unique cosmetic reward!"
                                >
                                  ★
                                </span>
                              )}
                            </div>

                            {/* Bottom Box: VIP Elite Reward Indicator */}
                            <div
                              className={`mt-3 p-1.5 border text-center transition-all min-w-[70px] ${
                                tier.claimedElite
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : isReached && passState.hasElitePass
                                  ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                                  : hasCosmetic
                                  ? 'bg-amber-50/70 border-amber-300 text-amber-800'
                                  : 'bg-white border-[#dedede] text-neutral-400'
                              }`}
                            >
                              <div className="text-base">{tier.eliteReward.icon}</div>
                              <span className="text-[9px] block font-mono truncate max-w-[65px]">
                                {tier.claimedElite
                                  ? '✓ Claimed'
                                  : hasCosmetic
                                  ? '★ Cosmetic'
                                  : 'VIP Track'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Inspector Details Card */}
              {selectedTier && (
                <div className="border border-[#dedede] bg-white p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#111111] text-white text-xs font-mono font-bold">
                          TIER {selectedTier.level} REWARD DOSSIER
                        </span>
                        {passState.currentLevel >= selectedTier.level ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            UNLOCKED & REACHED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                            REQUIRES {selectedTier.requiredXp.toLocaleString()} XP
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-[#111111] mt-1">
                        Tier {selectedTier.level} Conquest Package
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span>Status:</span>
                      <strong className={passState.currentLevel >= selectedTier.level ? 'text-emerald-700' : 'text-neutral-500'}>
                        {passState.currentLevel >= selectedTier.level
                          ? 'Available to Claim'
                          : `${(selectedTier.requiredXp - passState.totalXpEarned).toLocaleString()} XP to unlock`}
                      </strong>
                    </div>
                  </div>

                  {/* Free vs. VIP Rewards Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Track Card */}
                    <div className="border border-[#dedede] p-5 bg-[#fafafa] space-y-4">
                      <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-neutral-400 inline-block" />
                          <span className="text-xs font-bold uppercase text-neutral-800">
                            Standard Free Track
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">All Commanders</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-3xl p-2 bg-white border border-[#dedede]">
                          {selectedTier.freeReward.icon}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-[#111111]">{selectedTier.freeReward.name}</h5>
                          <span className="text-xs text-[#666666]">
                            Type: {selectedTier.freeReward.type.toUpperCase()} · Qty: {selectedTier.freeReward.quantity.toLocaleString()}
                          </span>

                          {/* Resource Bonus Breakdown Tags */}
                          {selectedTier.freeReward.resourceBonus && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {Object.entries(selectedTier.freeReward.resourceBonus).map(([resKey, val]) => (
                                <span
                                  key={resKey}
                                  className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold"
                                >
                                  +{val?.toLocaleString()} {resKey.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleClaimTier(selectedTier.level, 'free')}
                          disabled={passState.currentLevel < selectedTier.level || selectedTier.claimedFree}
                          className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                            selectedTier.claimedFree
                              ? 'bg-emerald-600 text-white cursor-default'
                              : passState.currentLevel >= selectedTier.level
                              ? 'bg-[#111111] text-white hover:bg-[#333333]'
                              : 'bg-[#eeeeee] text-[#888888] cursor-not-allowed'
                          }`}
                        >
                          {selectedTier.claimedFree ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Free Reward Claimed</span>
                            </>
                          ) : passState.currentLevel >= selectedTier.level ? (
                            <>
                              <Award size={14} />
                              <span>Claim Free Reward →</span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} />
                              <span>Tier Locked</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* VIP Elite Track Card */}
                    <div className="border border-amber-300 p-5 bg-amber-50/40 space-y-4">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Crown size={14} className="text-amber-600" />
                          <span className="text-xs font-bold uppercase text-amber-950">
                            VIP Elite Pass Track
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-800 font-bold">
                          {passState.hasElitePass ? 'Pass Active ★' : 'Pass Required'}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-3xl p-2 bg-white border border-amber-200">
                          {selectedTier.eliteReward.icon}
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-sm text-amber-950">{selectedTier.eliteReward.name}</h5>
                          <span className="text-xs text-amber-800">
                            Type: {selectedTier.eliteReward.type.toUpperCase()}
                          </span>

                          {/* Resource Bonus Breakdown */}
                          {selectedTier.eliteReward.resourceBonus && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {Object.entries(selectedTier.eliteReward.resourceBonus).map(([resKey, val]) => (
                                <span
                                  key={resKey}
                                  className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold"
                                >
                                  +{val?.toLocaleString()} {resKey.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Cosmetic Reward Highlight */}
                          {selectedTier.eliteReward.cosmeticReward && (
                            <div className="mt-2 p-2.5 bg-white border border-amber-300 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-amber-500 text-black">
                                  {selectedTier.eliteReward.cosmeticReward.rarity.toUpperCase()} COSMETIC
                                </span>
                                <span className="text-xs font-mono text-neutral-500">
                                  {selectedTier.eliteReward.cosmeticReward.type.toUpperCase()}
                                </span>
                              </div>
                              <strong className="text-xs text-[#111111] block">
                                {selectedTier.eliteReward.cosmeticReward.name}
                              </strong>
                              <p className="text-[11px] text-[#666666] leading-relaxed">
                                {selectedTier.eliteReward.cosmeticReward.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleClaimTier(selectedTier.level, 'elite')}
                          disabled={
                            passState.currentLevel < selectedTier.level ||
                            !passState.hasElitePass ||
                            selectedTier.claimedElite
                          }
                          className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                            selectedTier.claimedElite
                              ? 'bg-emerald-600 text-white cursor-default'
                              : passState.currentLevel >= selectedTier.level && passState.hasElitePass
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-amber-100 text-amber-700/60 cursor-not-allowed'
                          }`}
                        >
                          {selectedTier.claimedElite ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>VIP Reward Claimed</span>
                            </>
                          ) : !passState.hasElitePass ? (
                            <>
                              <Lock size={14} />
                              <span>Elite Pass Required</span>
                            </>
                          ) : passState.currentLevel >= selectedTier.level ? (
                            <>
                              <Sparkles size={14} />
                              <span>Claim VIP Elite Reward →</span>
                            </>
                          ) : (
                            <>
                              <Lock size={14} />
                              <span>Tier Locked</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: COSMETIC WARDROBE & ARMORY */}
          {/* ============================================================ */}
          {bpSubTab === 'wardrobe' && (
            <div className="space-y-6">
              <div className="border border-[#dedede] bg-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-4 mb-4 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                      COMMANDER ARMORY & CUSTOMIZATION
                    </span>
                    <h3 className="font-bold text-base text-[#111111]">
                      Unlocked Cosmetic Skins, Titles & Engine Effects ({cosmeticsLocker.length})
                    </h3>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Equip unique prestige titles, hull coatings, and warp drive signatures unlocked through the Battle Pass.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(['all', 'skin', 'avatar', 'title', 'engine_trail', 'hologram'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setWardrobeCategory(cat)}
                        className={`px-2.5 py-1 text-xs font-bold uppercase transition-colors cursor-pointer ${
                          wardrobeCategory === cat
                            ? 'bg-[#111111] text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cosmetic Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCosmetics.map((cosmetic) => {
                    const rarityColors: Record<string, string> = {
                      rare: 'border-blue-300 bg-blue-50/30 text-blue-900',
                      epic: 'border-purple-300 bg-purple-50/30 text-purple-900',
                      legendary: 'border-amber-300 bg-amber-50/30 text-amber-900',
                      mythic: 'border-rose-300 bg-rose-50/30 text-rose-900',
                    };

                    return (
                      <div
                        key={cosmetic.id}
                        className={`border p-4 transition-all relative ${
                          cosmetic.equipped ? 'border-[#111111] ring-2 ring-neutral-900/20' : 'border-[#dedede]'
                        } bg-white hover:border-black space-y-3`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 flex items-center justify-center text-xl border"
                              style={{ backgroundColor: cosmetic.previewColor + '20', borderColor: cosmetic.previewColor }}
                            >
                              {cosmetic.icon}
                            </div>
                            <div>
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.5 border ${
                                  rarityColors[cosmetic.rarity] || 'border-neutral-300 bg-neutral-100 text-neutral-800'
                                }`}
                              >
                                {cosmetic.rarity}
                              </span>
                              <h4 className="font-bold text-sm text-[#111111] mt-0.5">{cosmetic.name}</h4>
                              <span className="text-[10px] text-neutral-500 font-mono uppercase block">
                                {cosmetic.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {cosmetic.equipped && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black uppercase">
                              EQUIPPED
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#666666] leading-relaxed">{cosmetic.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-[#eeeeee]">
                          <button
                            type="button"
                            onClick={() => setSelectedCosmeticInspect(cosmetic)}
                            className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleEquipCosmetic(cosmetic.id)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                              cosmetic.equipped
                                ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                                : 'bg-[#111111] text-white hover:bg-[#333333]'
                            }`}
                          >
                            {cosmetic.equipped ? (
                              <>
                                <Check size={12} />
                                <span>Unequip</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={12} />
                                <span>Equip Loadout</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cosmetic Preview Modal / Card */}
              {selectedCosmeticInspect && (
                <div className="p-6 border border-[#111111] bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                    <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                      HOLOGRAPHIC LOADOUT INSPECTOR
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCosmeticInspect(null)}
                      className="text-xs font-bold text-neutral-500 hover:text-black cursor-pointer"
                    >
                      ✕ Close Preview
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div
                      className="w-24 h-24 border-2 flex items-center justify-center text-4xl shadow-inner"
                      style={{
                        backgroundColor: selectedCosmeticInspect.previewColor + '20',
                        borderColor: selectedCosmeticInspect.previewColor,
                      }}
                    >
                      {selectedCosmeticInspect.icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-black uppercase font-mono">
                          {selectedCosmeticInspect.rarity} {selectedCosmeticInspect.type.replace('_', ' ')}
                        </span>
                        {selectedCosmeticInspect.equipped && (
                          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold">
                            CURRENTLY EQUIPPED
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#111111]">{selectedCosmeticInspect.name}</h3>
                      <p className="text-xs text-[#666666] max-w-xl leading-relaxed">
                        {selectedCosmeticInspect.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: 50-TIER REWARD MATRIX */}
          {/* ============================================================ */}
          {bpSubTab === 'matrix' && (
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="border-b border-[#eeeeee] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                    Complete 50-Tier Conquest Reward Matrix
                  </h3>
                  <p className="text-xs text-[#777777] mt-0.5">
                    Click any tier to inspect exact resource increments and cosmetic assets.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#e5e5e5] inline-block" /> Free Track
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-amber-500 inline-block" /> VIP Elite Track
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tiers.map((tier) => {
                  const isUnlocked = passState.currentLevel >= tier.level;

                  return (
                    <div
                      key={tier.level}
                      className={`border p-4 transition-all ${
                        isUnlocked ? 'border-[#111111] bg-white shadow-xs' : 'border-[#dedede] bg-[#fafafa] opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2 mb-3">
                        <span className="text-xs font-black font-mono text-[#111111]">
                          TIER {tier.level}
                        </span>
                        <span className="text-[10px] text-[#888888] font-mono">
                          {tier.requiredXp.toLocaleString()} XP
                        </span>
                      </div>

                      {/* Free Track Item */}
                      <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee] mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tier.freeReward.icon}</span>
                          <div>
                            <span className="text-[9px] font-bold text-[#888888] block uppercase">Free Reward</span>
                            <span className="text-xs font-bold text-[#111111]">{tier.freeReward.name}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleClaimTier(tier.level, 'free')}
                          disabled={!isUnlocked || tier.claimedFree}
                          className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                            tier.claimedFree
                              ? 'bg-[#16a34a] text-white cursor-default'
                              : isUnlocked
                              ? 'bg-[#111111] text-white hover:bg-[#333333]'
                              : 'bg-[#eeeeee] text-[#aaaaaa] cursor-not-allowed'
                          }`}
                        >
                          {tier.claimedFree ? 'Claimed' : 'Claim'}
                        </button>
                      </div>

                      {/* Elite VIP Track Item */}
                      <div className="p-2.5 bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tier.eliteReward.icon}</span>
                          <div>
                            <span className="text-[9px] font-bold text-amber-800 block uppercase">VIP Reward</span>
                            <span className="text-xs font-bold text-amber-950">{tier.eliteReward.name}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleClaimTier(tier.level, 'elite')}
                          disabled={!isUnlocked || !passState.hasElitePass || tier.claimedElite}
                          className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                            tier.claimedElite
                              ? 'bg-[#16a34a] text-white cursor-default'
                              : isUnlocked && passState.hasElitePass
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-amber-100 text-amber-600/50 cursor-not-allowed'
                          }`}
                        >
                          {tier.claimedElite ? 'Claimed' : !passState.hasElitePass ? 'Locked' : 'Claim'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: DIRECTIVES & XP MISSIONS */}
          {/* ============================================================ */}
          {bpSubTab === 'directives' && (
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="border-b border-[#eeeeee] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                    Season Directives & XP Missions
                  </h3>
                  <p className="text-xs text-[#777777] mt-0.5">
                    Fulfill galactic commands to accelerate your Battle Pass level progression.
                  </p>
                </div>

                <div className="flex gap-2">
                  {(['all', 'daily', 'weekly', 'milestone'] as const).map((qf) => (
                    <button
                      key={qf}
                      type="button"
                      onClick={() => setQuestFilter(qf)}
                      className={`px-3 py-1 text-xs font-bold uppercase transition-colors cursor-pointer ${
                        questFilter === qf
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#f0f0f0] text-[#666666] hover:bg-[#e0e0e0]'
                      }`}
                    >
                      {qf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="border border-[#dedede] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafafa]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#111111] text-white">
                          {quest.type}
                        </span>
                        <h4 className="font-bold text-sm text-[#111111]">{quest.title}</h4>
                      </div>
                      <p className="text-xs text-[#666666]">{quest.description}</p>
                      <div className="text-[11px] font-mono text-[#444444]">
                        Progress: {quest.currentCount.toLocaleString()} / {quest.targetCount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-bold text-[#111111] font-mono">
                        +{quest.xpReward} XP
                      </span>
                      <button
                        type="button"
                        onClick={() => handleClaimQuest(quest)}
                        disabled={!quest.completed || quest.claimed}
                        className={`px-4 py-2 text-xs font-bold uppercase transition-colors cursor-pointer ${
                          quest.claimed
                            ? 'bg-[#16a34a] text-white cursor-default'
                            : quest.completed
                            ? 'bg-[#111111] text-white hover:bg-[#333333]'
                            : 'bg-[#dedede] text-[#888888] cursor-not-allowed'
                        }`}
                      >
                        {quest.claimed ? 'Collected' : quest.completed ? 'Claim XP →' : 'In Progress'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* STORE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {/* Subcategory Filter */}
          <div className="flex flex-wrap gap-2 items-center justify-between border border-[#dedede] bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#777777] uppercase mr-2">Department:</span>
              {(['all', 'officer', 'booster', 'relic', 'cosmetic'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setStoreCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                    storeCategory === cat
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#f5f5f5] text-[#555555] hover:bg-[#e5e5e5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-[#777777]">
              Showing {filteredStoreItems.length} Imperial Listings
            </div>
          </div>

          {/* Store Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStoreItems.map((item) => (
              <div
                key={item.id}
                className="border border-[#dedede] bg-white p-5 flex flex-col justify-between space-y-4 hover:border-black transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl p-2 bg-[#fafafa] border border-[#dedede]">{item.icon}</span>
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 bg-[#f0f0f0] text-[#555555]">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#111111]">{item.name}</h3>
                  <p className="text-xs text-[#666666] mt-1 leading-relaxed">{item.description}</p>

                  <div className="mt-3 p-2 bg-[#fafafa] border border-[#eeeeee] text-[11px] font-mono text-[#333333]">
                    <span className="font-bold text-[#111111]">Bonus:</span> {item.bonusEffect}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#eeeeee] flex items-center justify-between">
                  <div className="font-mono">
                    <span className="text-[10px] font-bold text-[#777777] block uppercase">Price</span>
                    <span className="text-sm font-bold text-[#111111] flex items-center gap-1">
                      <span>🌌</span>
                      <span>{item.price.toLocaleString()} DM</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBuyItem(item)}
                    disabled={darkMatterBalance < item.price || (item.purchased && item.category === 'officer')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      item.purchased && item.category === 'officer'
                        ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                        : darkMatterBalance < item.price
                        ? 'bg-[#eeeeee] text-[#888888] cursor-not-allowed'
                        : 'bg-[#111111] text-white hover:bg-[#333333]'
                    }`}
                  >
                    {item.purchased && item.category === 'officer' ? 'Commissioned' : 'Purchase'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 72 COMMANDERS & GOTCHA SYSTEM VIEW                          */}
      {/* ============================================================ */}
      {activeTab === 'commander-gotcha' && (
        <CommanderGachaStorePanel
          resources={resources}
          onUpdateResources={onUpdateResources}
        />
      )}
    </div>
  );
};
