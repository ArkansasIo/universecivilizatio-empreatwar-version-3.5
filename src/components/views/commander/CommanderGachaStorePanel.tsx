import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Crown,
  Shield,
  Zap,
  Star,
  Users,
  Search,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  Crosshair,
  Flame,
  CheckCircle2,
  Lock,
  ArrowUpCircle,
  HelpCircle,
  RotateCcw,
  Eye,
  AlertCircle,
  Clock,
  Radio,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  ALL_72_COMMANDERS,
  CommanderData,
  CommanderRarity,
  CommanderRole,
  PlayerCommanderInstance,
  CommanderSlotAssignments,
  STORAGE_KEY_PLAYER_COMMANDERS,
  STORAGE_KEY_COMMANDER_GACHA_PITY,
  STORAGE_KEY_COMMANDER_ASSIGNMENTS,
  INITIAL_PLAYER_COMMANDERS,
  INITIAL_SLOT_ASSIGNMENTS,
} from '../../../commander72Data';
import { PlayerResources } from '../../../types';

interface CommanderGachaStorePanelProps {
  resources: PlayerResources;
  onUpdateResources: (updates: Partial<PlayerResources>) => void;
}

export const CommanderGachaStorePanel: React.FC<CommanderGachaStorePanelProps> = ({
  resources,
  onUpdateResources,
}) => {
  const [subTab, setSubTab] = useState<'summon' | 'roster' | 'archive' | 'slots'>('summon');

  // Load player's recruited commanders
  const [myCommanders, setMyCommanders] = useState<PlayerCommanderInstance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER_COMMANDERS);
      return saved ? JSON.parse(saved) : INITIAL_PLAYER_COMMANDERS;
    } catch {
      return INITIAL_PLAYER_COMMANDERS;
    }
  });

  // Pity counter for Gacha: guaranteed 4-star+ at 10 pulls, guaranteed Mythic at 50 pulls
  const [pityCounter, setPityCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMANDER_GACHA_PITY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Slot assignments
  const [slotAssignments, setSlotAssignments] = useState<CommanderSlotAssignments>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMANDER_ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_SLOT_ASSIGNMENTS;
    } catch {
      return INITIAL_SLOT_ASSIGNMENTS;
    }
  });

  // Selected commander for inspection
  const [selectedCommander, setSelectedCommander] = useState<CommanderData | null>(
    ALL_72_COMMANDERS[0]
  );
  const [selectedInstance, setSelectedInstance] = useState<PlayerCommanderInstance | null>(null);

  // Gacha Summon Result Animation State
  const [summonResults, setSummonResults] = useState<CommanderData[] | null>(null);
  const [isSummoning, setIsSummoning] = useState<boolean>(false);
  const [summonBanner, setSummonBanner] = useState<'standard' | 'mythic_focus'>('standard');

  // Filters for Archive & Roster
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rarityFilter, setRarityFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Save changes
  const saveCommanders = (newList: PlayerCommanderInstance[]) => {
    setMyCommanders(newList);
    localStorage.setItem(STORAGE_KEY_PLAYER_COMMANDERS, JSON.stringify(newList));
  };

  const savePity = (count: number) => {
    setPityCounter(count);
    localStorage.setItem(STORAGE_KEY_COMMANDER_GACHA_PITY, count.toString());
  };

  const saveAssignments = (slots: CommanderSlotAssignments) => {
    setSlotAssignments(slots);
    localStorage.setItem(STORAGE_KEY_COMMANDER_ASSIGNMENTS, JSON.stringify(slots));
  };

  // Perform Gacha Summon
  const handleSummon = (pullCount: 1 | 10) => {
    const costPerPull = summonBanner === 'mythic_focus' ? 600 : 400;
    const totalCost = costPerPull * pullCount;
    const currentDM = resources.darkMatter ?? 0;

    if (currentDM < totalCost) {
      sound.play('warning');
      alert(`Insufficient Dark Matter! Requires 🌌 ${totalCost.toLocaleString()} DM.`);
      return;
    }

    sound.play('confirm');
    setIsSummoning(true);
    onUpdateResources({ darkMatter: currentDM - totalCost });

    setTimeout(() => {
      let currentPity = pityCounter;
      const results: CommanderData[] = [];
      const newInstances: PlayerCommanderInstance[] = [...myCommanders];

      for (let i = 0; i < pullCount; i++) {
        currentPity += 1;
        let chosenRarity: CommanderRarity;

        // Pity rules
        if (currentPity >= 50) {
          chosenRarity = 'Mythic';
          currentPity = 0;
        } else if (currentPity % 10 === 0) {
          // Guaranteed Epic or Legendary
          chosenRarity = Math.random() < 0.35 ? 'Legendary' : 'Epic';
        } else {
          // Standard weights
          const roll = Math.random() * 100;
          if (summonBanner === 'mythic_focus') {
            if (roll < 3.5) chosenRarity = 'Mythic';
            else if (roll < 12.0) chosenRarity = 'Legendary';
            else if (roll < 32.0) chosenRarity = 'Epic';
            else if (roll < 65.0) chosenRarity = 'Rare';
            else chosenRarity = 'Common';
          } else {
            if (roll < 1.5) chosenRarity = 'Mythic';
            else if (roll < 8.0) chosenRarity = 'Legendary';
            else if (roll < 25.0) chosenRarity = 'Epic';
            else if (roll < 60.0) chosenRarity = 'Rare';
            else chosenRarity = 'Common';
          }
        }

        // Pick random commander of chosen rarity
        const candidates = ALL_72_COMMANDERS.filter((c) => c.rarity === chosenRarity);
        const picked = candidates[Math.floor(Math.random() * candidates.length)] || ALL_72_COMMANDERS[0];
        results.push(picked);

        // Check if player already has this commander
        const existing = newInstances.find((inst) => inst.commanderId === picked.id);
        if (existing) {
          // Duplicate turns into Stars / Experience
          existing.stars = Math.min(5, existing.stars + 1);
          existing.experience += 1000;
          if (existing.experience >= existing.nextLevelExp) {
            existing.level += 1;
            existing.nextLevelExp = Math.round(existing.nextLevelExp * 1.5);
          }
        } else {
          // New recruit
          newInstances.push({
            instanceId: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            commanderId: picked.id,
            level: 1,
            stars: 1,
            experience: 0,
            nextLevelExp: 1000,
            assignedSlot: null,
            awakened: false,
            hiredAt: new Date().toISOString(),
          });
        }
      }

      savePity(currentPity);
      saveCommanders(newInstances);
      setSummonResults(results);
      setIsSummoning(false);
      sound.play('success');
    }, 600);
  };

  // Level Up Commander with Naquadah / Deuterium
  const handleTrainCommander = (instance: PlayerCommanderInstance) => {
    const costNaquadah = instance.level * 25000;
    const costDeut = instance.level * 5000;

    if (resources.naquadah < costNaquadah || resources.deuterium < costDeut) {
      sound.play('warning');
      alert(`Training requires ${costNaquadah.toLocaleString()} Naquadah and ${costDeut.toLocaleString()} Deuterium.`);
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      naquadah: resources.naquadah - costNaquadah,
      deuterium: resources.deuterium - costDeut,
    });

    const updated = myCommanders.map((inst) => {
      if (inst.instanceId === instance.instanceId) {
        return {
          ...inst,
          level: inst.level + 1,
          experience: 0,
          nextLevelExp: Math.round(inst.nextLevelExp * 1.4),
        };
      }
      return inst;
    });

    saveCommanders(updated);
    setSelectedInstance(updated.find((i) => i.instanceId === instance.instanceId) || null);
  };

  // Awaken Commander (Unlocks 5-Star limit & signature supercharged substat)
  const handleAwakenCommander = (instance: PlayerCommanderInstance) => {
    const costDM = 500;
    const currentDM = resources.darkMatter ?? 0;

    if (currentDM < costDM) {
      sound.play('warning');
      alert(`Awakening requires 🌌 500 Dark Matter!`);
      return;
    }

    sound.play('success');
    onUpdateResources({ darkMatter: currentDM - costDM });

    const updated = myCommanders.map((inst) => {
      if (inst.instanceId === instance.instanceId) {
        return {
          ...inst,
          awakened: true,
          stars: Math.max(inst.stars, 5),
        };
      }
      return inst;
    });

    saveCommanders(updated);
    setSelectedInstance(updated.find((i) => i.instanceId === instance.instanceId) || null);
  };

  // Assign to Council Slot
  const handleAssignSlot = (instanceId: string, slot: keyof CommanderSlotAssignments) => {
    sound.play('confirm');
    const newSlots = { ...slotAssignments, [slot]: instanceId };
    saveAssignments(newSlots);

    // Update instance assigned status
    const updated = myCommanders.map((inst) => {
      if (inst.instanceId === instanceId) {
        return { ...inst, assignedSlot: slot };
      }
      if (inst.assignedSlot === slot && inst.instanceId !== instanceId) {
        return { ...inst, assignedSlot: null };
      }
      return inst;
    });
    saveCommanders(updated);
  };

  const getRarityBadge = (rarity: CommanderRarity) => {
    switch (rarity) {
      case 'Mythic':
        return 'bg-amber-500 text-black font-black border-amber-300 shadow-xs shadow-amber-500/50';
      case 'Legendary':
        return 'bg-purple-600 text-white font-bold border-purple-400';
      case 'Epic':
        return 'bg-blue-600 text-white font-bold border-blue-400';
      case 'Rare':
        return 'bg-emerald-600 text-white font-bold border-emerald-400';
      default:
        return 'bg-neutral-600 text-white font-bold border-neutral-400';
    }
  };

  // Filtered Archive / Roster
  const filteredCommanders = ALL_72_COMMANDERS.filter((cmdr) => {
    const matchesSearch =
      searchQuery === '' ||
      cmdr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmdr.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmdr.faction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRarity = rarityFilter === 'ALL' || cmdr.rarity === rarityFilter;
    const matchesRole = roleFilter === 'ALL' || cmdr.role === roleFilter;

    return matchesSearch && matchesRarity && matchesRole;
  });

  return (
    <div id="commander-gacha-store" className="space-y-6 font-mono">
      {/* Top Banner & Header */}
      <div className="border-2 border-[#111111] bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#111111] text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Crown size={12} />
                IMPERIAL HIGH COMMAND ROSTER · 72 SOVEREIGN COMMANDERS
              </span>
              <span className="text-[11px] text-[#666666]">
                Recruited: <strong>{myCommanders.length} / 72</strong>
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#111111] uppercase tracking-wide flex items-center gap-2">
              <span>Universe Civilization: Empire at War Commander Nexus</span>
            </h2>
            <p className="text-xs text-[#555555] mt-1 max-w-2xl leading-relaxed">
              Recruit legendary fleet admirals, deep-crust geologists, and quantum technocrats.
              Each commander features dedicated primary stats, 8 combat substats, signature auras, and slot synergies.
            </p>
          </div>

          {/* Quick Currencies & Pity */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-neutral-100 border border-[#dedede] text-right">
              <span className="text-[10px] text-[#888888] block uppercase">Dark Matter Balance</span>
              <div className="text-base font-bold text-[#111111] flex items-center justify-end gap-1">
                <span>🌌</span>
                <span>{(resources.darkMatter ?? 0).toLocaleString()} DM</span>
              </div>
            </div>
            <div className="p-3 bg-neutral-100 border border-[#dedede] text-right">
              <span className="text-[10px] text-[#888888] block uppercase">Mythic Pity Counter</span>
              <div className="text-base font-bold text-amber-600">
                {pityCounter} / 50 Pulls
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-[#dedede] bg-white text-xs font-bold uppercase tracking-wider overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setSubTab('summon');
          }}
          className={`px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            subTab === 'summon'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>Summon Gotcha Warp Gate</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setSubTab('roster');
          }}
          className={`px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            subTab === 'roster'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Users size={14} />
          <span>My Recruited Roster ({myCommanders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setSubTab('slots');
          }}
          className={`px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            subTab === 'slots'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Shield size={14} className="text-emerald-600" />
          <span>High Command Council Slots</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setSubTab('archive');
          }}
          className={`px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            subTab === 'archive'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Layers size={14} />
          <span>All 72 Commanders Archive</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: GOTCHA SUMMON GATES                                            */}
      {/* ========================================================================= */}
      {subTab === 'summon' && (
        <div className="space-y-6">
          {/* Banner Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banner 1: Standard Warp */}
            <div
              onClick={() => setSummonBanner('standard')}
              className={`p-6 border-2 cursor-pointer transition-all ${
                summonBanner === 'standard'
                  ? 'border-[#111111] bg-white shadow-md'
                  : 'border-[#dedede] bg-neutral-50 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] uppercase font-bold">
                  Standard Warp Gate
                </span>
                <span className="text-xs font-bold text-[#111111]">400 DM / Pull</span>
              </div>
              <h3 className="text-lg font-black text-[#111111] uppercase">Universal Sovereign Pool</h3>
              <p className="text-xs text-[#666666] mt-1">
                Equal probability across all 72 commanders. Guaranteed 4★+ every 10 pulls, guaranteed Mythic at 50 pulls.
              </p>
              <div className="mt-4 text-[11px] text-[#888888] space-y-0.5">
                <div>• Mythic: 1.5% | Legendary: 6.5% | Epic: 17.0%</div>
                <div>• Rare: 35.0% | Common: 40.0%</div>
              </div>
            </div>

            {/* Banner 2: Mythic Focused Warp */}
            <div
              onClick={() => setSummonBanner('mythic_focus')}
              className={`p-6 border-2 cursor-pointer transition-all ${
                summonBanner === 'mythic_focus'
                  ? 'border-amber-500 bg-amber-50/20 shadow-md'
                  : 'border-[#dedede] bg-neutral-50 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] uppercase font-bold">
                  Limited Rate-Up Gate
                </span>
                <span className="text-xs font-bold text-amber-700">600 DM / Pull</span>
              </div>
              <h3 className="text-lg font-black text-[#111111] uppercase flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-500" />
                <span>Ascended Mythics Rate-Up</span>
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                2.5x boosted chance to summon Supreme Thor, Archon Samantha Carter, and System Lord Ba'al!
              </p>
              <div className="mt-4 text-[11px] text-amber-800 space-y-0.5">
                <div>• Mythic: 3.5% (Boosted) | Legendary: 8.5% | Epic: 20.0%</div>
                <div>• Rare: 33.0% | Common: 35.0%</div>
              </div>
            </div>
          </div>

          {/* Summon Actions */}
          <div className="p-8 border border-[#dedede] bg-white text-center space-y-4 shadow-xs">
            <div className="max-w-md mx-auto space-y-2">
              <span className="text-4xl">🌌</span>
              <h3 className="text-lg font-extrabold uppercase text-[#111111]">
                Execute Subspace Warp Conduit
              </h3>
              <p className="text-xs text-[#666666]">
                Channel Dark Matter through the Stargate event horizon to bind veteran commanders to your sovereign realm.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                type="button"
                disabled={isSummoning}
                onClick={() => handleSummon(1)}
                className="px-6 py-3.5 bg-white border-2 border-[#111111] hover:bg-neutral-100 text-[#111111] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>Summon x1 ({summonBanner === 'mythic_focus' ? '600' : '400'} DM)</span>
              </button>

              <button
                type="button"
                disabled={isSummoning}
                onClick={() => handleSummon(10)}
                className="px-8 py-3.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Crown size={15} className="text-amber-400" />
                <span>Summon x10 ({summonBanner === 'mythic_focus' ? '6,000' : '4,000'} DM)</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-bold">10th 4★+ Guaranteed</span>
              </button>
            </div>

            {isSummoning && (
              <div className="pt-4 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 animate-pulse">
                <RotateCcw size={16} className="animate-spin" />
                <span>Opening Quantum Hyperspace Warp...</span>
              </div>
            )}
          </div>

          {/* Summon Results Modal / Panel */}
          {summonResults && (
            <div className="p-6 border-2 border-[#111111] bg-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#dedede] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <h3 className="text-sm font-extrabold uppercase text-[#111111]">
                    Warp Gate Summon Results ({summonResults.length} Recruited)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSummonResults(null)}
                  className="text-xs font-bold text-[#666666] hover:text-[#111111] cursor-pointer"
                >
                  ✕ Close Results
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {summonResults.map((cmdr, i) => (
                  <div
                    key={`${cmdr.id}_${i}`}
                    onClick={() => setSelectedCommander(cmdr)}
                    className="border border-[#dedede] p-3 bg-neutral-50 hover:border-black cursor-pointer space-y-2 text-center transition-transform hover:-translate-y-1"
                  >
                    <div className="text-3xl">{cmdr.avatar}</div>
                    <span className={`inline-block text-[9px] px-1.5 py-0.5 border uppercase ${getRarityBadge(cmdr.rarity)}`}>
                      {cmdr.rarity}
                    </span>
                    <h4 className="font-bold text-xs text-[#111111] truncate">{cmdr.name}</h4>
                    <p className="text-[10px] text-[#777777] truncate">{cmdr.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: MY RECRUITED ROSTER                                             */}
      {/* ========================================================================= */}
      {subTab === 'roster' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Commanders List */}
            <div className="lg:col-span-2 border border-[#dedede] bg-white p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#dedede] pb-3">
                <span className="text-xs font-bold text-[#111111] uppercase">
                  Commissioned Officers ({myCommanders.length})
                </span>
                <span className="text-[11px] text-[#777777]">
                  Select a commander to inspect stats, awaken, or assign
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto p-1">
                {myCommanders.map((inst) => {
                  const cmdr = ALL_72_COMMANDERS.find((c) => c.id === inst.commanderId) || ALL_72_COMMANDERS[0];
                  const isSelected = selectedInstance?.instanceId === inst.instanceId;

                  return (
                    <div
                      key={inst.instanceId}
                      onClick={() => {
                        setSelectedInstance(inst);
                        setSelectedCommander(cmdr);
                      }}
                      className={`p-3 border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#111111] bg-neutral-100'
                          : 'border-[#dedede] bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="text-3xl p-2 bg-neutral-100 border border-[#dedede] shrink-0">
                        {cmdr.avatar}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] px-1 py-0.2 border uppercase ${getRarityBadge(cmdr.rarity)}`}>
                            {cmdr.rarity}
                          </span>
                          <span className="text-[10px] font-bold text-amber-600 flex items-center">
                            {Array.from({ length: inst.stars }).map((_, s) => (
                              <Star key={s} size={10} className="fill-amber-400 text-amber-500" />
                            ))}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-[#111111] truncate">{cmdr.name}</h4>
                        <div className="text-[10px] text-[#666666] flex items-center justify-between">
                          <span>Lvl {inst.level}</span>
                          <span>{cmdr.role}</span>
                        </div>

                        {inst.assignedSlot && (
                          <div className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 border border-emerald-200 uppercase truncate">
                            Slot: {inst.assignedSlot.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Commander Detail & Training */}
            <div className="border border-[#dedede] bg-white p-5 space-y-4">
              {selectedCommander ? (
                <>
                  <div className="text-center space-y-2 pb-4 border-b border-[#dedede]">
                    <div className="text-5xl mx-auto">{selectedCommander.avatar}</div>
                    <span className={`inline-block text-[10px] px-2 py-0.5 border uppercase ${getRarityBadge(selectedCommander.rarity)}`}>
                      {selectedCommander.rarity} · {selectedCommander.role}
                    </span>
                    <h3 className="text-lg font-black text-[#111111]">{selectedCommander.name}</h3>
                    <p className="text-xs text-[#777777] italic">{selectedCommander.title}</p>
                  </div>

                  {/* Primary Stats */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase text-[#888888] block">Primary Fleet & Economic Multipliers</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-1.5 bg-neutral-50 border border-[#eee]">
                        <span>⚔️ Fleet Atk: </span>
                        <strong className="text-rose-600">+{selectedCommander.stats.fleetAttack}%</strong>
                      </div>
                      <div className="p-1.5 bg-neutral-50 border border-[#eee]">
                        <span>🛡️ Shield: </span>
                        <strong className="text-sky-600">+{selectedCommander.stats.fleetShield}%</strong>
                      </div>
                      <div className="p-1.5 bg-neutral-50 border border-[#eee]">
                        <span>⛏️ Metal Yield: </span>
                        <strong className="text-amber-600">+{selectedCommander.stats.productionMetal}%</strong>
                      </div>
                      <div className="p-1.5 bg-neutral-50 border border-[#eee]">
                        <span>💎 Crystal: </span>
                        <strong className="text-cyan-600">+{selectedCommander.stats.productionCrystal}%</strong>
                      </div>
                      <div className="p-1.5 bg-neutral-50 border border-[#eee]">
                        <span>🧪 Research: </span>
                        <strong className="text-purple-600">+{selectedCommander.stats.researchSpeed}%</strong>
                      </div>
                      <div className="p-1.5 bg-neutral-50 border border-[#eee]">
                        <span>🔭 Expedition: </span>
                        <strong className="text-emerald-600">+{selectedCommander.stats.expeditionBonus}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* 8 Substats */}
                  <div className="space-y-1 text-xs pt-2 border-t border-[#eee]">
                    <span className="text-[10px] font-bold uppercase text-[#888888] block">8 Combat & Field Substats</span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#444444] pt-1">
                      <div>Crit Rate: <strong>{selectedCommander.subStats.critChance}%</strong></div>
                      <div>Crit Dmg: <strong>{selectedCommander.subStats.critMultiplier}x</strong></div>
                      <div>Rapid Fire: <strong>+{selectedCommander.subStats.rapidFireBonus}%</strong></div>
                      <div>Shield Regen: <strong>+{selectedCommander.subStats.shieldRegenRate}%</strong></div>
                      <div>Fuel Saver: <strong>-{selectedCommander.subStats.fuelConsumptionReduction}%</strong></div>
                      <div>Storage Cap: <strong>+{selectedCommander.subStats.storageCapacityBonus}%</strong></div>
                      <div>Exped Reroll: <strong>+{selectedCommander.subStats.expeditionRerollLuck}%</strong></div>
                      <div>Stealth Pen: <strong>+{selectedCommander.subStats.stealthPenetration}%</strong></div>
                    </div>
                  </div>

                  {/* Signature Skill & Aura */}
                  <div className="p-3 bg-neutral-50 border border-[#dedede] space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase text-amber-600 block">
                      ⚡ Signature: {selectedCommander.signatureSkill}
                    </span>
                    <p className="text-[11px] text-[#555555]">{selectedCommander.signatureSkillDescription}</p>
                    <div className="text-[10px] text-emerald-700 font-bold pt-1">
                      Aura: {selectedCommander.passiveAura}
                    </div>
                  </div>

                  {/* Action Buttons for selected recruited instance */}
                  {selectedInstance && (
                    <div className="space-y-2 pt-2 border-t border-[#dedede]">
                      <button
                        type="button"
                        onClick={() => handleTrainCommander(selectedInstance)}
                        className="w-full py-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowUpCircle size={13} className="text-emerald-400" />
                        <span>Train Level Up ({(selectedInstance.level * 25000).toLocaleString()} Naq)</span>
                      </button>

                      {!selectedInstance.awakened && (
                        <button
                          type="button"
                          onClick={() => handleAwakenCommander(selectedInstance)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={13} />
                          <span>Awaken 5★ Awakening (500 DM)</span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-xs text-[#888888]">
                  Select a commander to view technical specs.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: COUNCIL SLOTS                                                   */}
      {/* ========================================================================= */}
      {subTab === 'slots' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6">
            <h3 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider mb-2">
              High Command Sovereign Council Slots
            </h3>
            <p className="text-xs text-[#555555] mb-6 max-w-2xl">
              Assign top commanders to 4 strategic seats. Active commanders apply 100% of their primary stats and passive auras empire-wide.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                [
                  { key: 'flagship', label: 'Flagship Armada Admiral', desc: 'Directs all space combat & fleet stats' },
                  { key: 'mining_director', label: 'Planetary Mining Director', desc: 'Maximizes metal, crystal & deut extractors' },
                  { key: 'chief_scientist', label: 'Chief Quantum Scientist', desc: 'Supercharges research & shipyard construction' },
                  { key: 'defense_marshal', label: 'Defense Provost Marshal', desc: 'Fortifies planetary shields & counter-intel' },
                ] as const
              ).map((slot) => {
                const assignedInstanceId = slotAssignments[slot.key];
                const assignedInst = myCommanders.find((i) => i.instanceId === assignedInstanceId);
                const assignedCmdr = assignedInst
                  ? ALL_72_COMMANDERS.find((c) => c.id === assignedInst.commanderId)
                  : null;

                return (
                  <div key={slot.key} className="border-2 border-[#111111] p-4 bg-neutral-50 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-600 block">
                        {slot.label}
                      </span>
                      <p className="text-[10px] text-[#777777] mt-0.5">{slot.desc}</p>
                    </div>

                    <div className="p-4 bg-white border border-[#dedede] text-center min-h-[140px] flex flex-col items-center justify-center space-y-2">
                      {assignedCmdr ? (
                        <>
                          <div className="text-3xl">{assignedCmdr.avatar}</div>
                          <h4 className="font-bold text-xs text-[#111111]">{assignedCmdr.name}</h4>
                          <span className={`text-[8px] px-1 py-0.2 border uppercase ${getRarityBadge(assignedCmdr.rarity)}`}>
                            {assignedCmdr.rarity} · Lvl {assignedInst?.level}
                          </span>
                          <div className="text-[9px] text-emerald-700 font-bold">
                            Active Aura Applied
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-[#888888] space-y-1">
                          <Lock size={20} className="mx-auto text-neutral-400" />
                          <span>Seat Vacant</span>
                        </div>
                      )}
                    </div>

                    {/* Slot Assignment Selector */}
                    <div>
                      <select
                        value={assignedInstanceId || ''}
                        onChange={(e) => handleAssignSlot(e.target.value, slot.key)}
                        className="w-full bg-white border border-[#dedede] p-1.5 text-xs text-[#111111] font-mono focus:outline-none"
                      >
                        <option value="">-- Assign Commander --</option>
                        {myCommanders.map((inst) => {
                          const cmdr = ALL_72_COMMANDERS.find((c) => c.id === inst.commanderId);
                          return (
                            <option key={inst.instanceId} value={inst.instanceId}>
                              {cmdr?.name} (Lvl {inst.level} - {cmdr?.rarity})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: ALL 72 COMMANDERS ARCHIVE                                      */}
      {/* ========================================================================= */}
      {subTab === 'archive' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 border border-[#dedede] bg-white space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-[#888888]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, role, faction..."
                  className="w-full bg-[#fafafa] border border-[#dedede] pl-8 pr-3 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#666666] shrink-0">Rarity:</span>
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                  className="w-full bg-[#fafafa] border border-[#dedede] px-2 py-1.5 text-xs text-[#111111] focus:outline-none"
                >
                  <option value="ALL">All Rarities</option>
                  <option value="Mythic">Mythic (6)</option>
                  <option value="Legendary">Legendary (12)</option>
                  <option value="Epic">Epic (18)</option>
                  <option value="Rare">Rare (18)</option>
                  <option value="Common">Common (18)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#666666] shrink-0">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-[#fafafa] border border-[#dedede] px-2 py-1.5 text-xs text-[#111111] focus:outline-none"
                >
                  <option value="ALL">All Specializations</option>
                  <option value="Fleet Admiral">Fleet Admiral</option>
                  <option value="High Geologist">High Geologist</option>
                  <option value="Quantum Technocrat">Quantum Technocrat</option>
                  <option value="Stargate Archon">Stargate Archon</option>
                  <option value="High Inquisitor">High Inquisitor</option>
                  <option value="Dreadnought Tactician">Dreadnought Tactician</option>
                </select>
              </div>
            </div>

            <div className="text-[11px] text-[#666666]">
              Showing <strong>{filteredCommanders.length}</strong> of 72 Imperial Sovereign Commanders
            </div>
          </div>

          {/* Grid of 72 Commanders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCommanders.map((cmdr) => {
              const isRecruited = myCommanders.some((inst) => inst.commanderId === cmdr.id);

              return (
                <div
                  key={cmdr.id}
                  onClick={() => setSelectedCommander(cmdr)}
                  className={`p-4 border-2 bg-white flex flex-col justify-between space-y-3 cursor-pointer transition-all hover:border-black hover:-translate-y-0.5 ${
                    isRecruited ? 'border-[#111111]' : 'border-[#dedede]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-3xl p-1 bg-neutral-50 border border-[#eee]">{cmdr.avatar}</span>
                      <div className="text-right">
                        <span className={`inline-block text-[8px] px-1.5 py-0.5 border uppercase ${getRarityBadge(cmdr.rarity)}`}>
                          {cmdr.rarity}
                        </span>
                        {isRecruited && (
                          <span className="block text-[8px] text-emerald-600 font-bold uppercase mt-0.5">
                            ✓ In Service
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-xs text-[#111111]">{cmdr.name}</h4>
                    <p className="text-[10px] text-[#777777]">{cmdr.role} · {cmdr.faction}</p>
                    <p className="text-[10px] text-[#555555] italic mt-1">{cmdr.title}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#eee] text-[10px]">
                    <div className="text-emerald-700 font-bold truncate">Aura: {cmdr.passiveAura}</div>
                    <div className="text-amber-700 font-bold truncate">Skill: {cmdr.signatureSkill}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
