import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Swords,
  BookOpen,
  Globe,
  Compass,
  RotateCcw,
  Plus,
  Lock,
  CheckCircle2,
  Award,
  Sliders,
  Flame,
  Layers,
  Crown,
  Search,
  Check,
  AlertTriangle,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { sound } from '../../../sound';
import { PlayerResources, PlayerProfile } from '../../../types';
import { StargateRelic, INITIAL_STARGATE_RELICS } from '../../../stargateRelicsData';

interface StargateRelicsViewProps {
  resources: PlayerResources;
  profile?: PlayerProfile;
  onUpdateResources?: (updates: Partial<PlayerResources>) => void;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

export const StargateRelicsView: React.FC<StargateRelicsViewProps> = ({
  resources,
  profile,
  onUpdateResources,
  onUpdateProfile,
  onNavigate,
}) => {
  // Master Relics State (persisted via localStorage)
  const [relics, setRelics] = useState<StargateRelic[]>(() => {
    try {
      const saved = localStorage.getItem('uc_stargate_relics_vault');
      return saved ? JSON.parse(saved) : INITIAL_STARGATE_RELICS;
    } catch {
      return INITIAL_STARGATE_RELICS;
    }
  });

  // Active Tab: Vault Inventory | Active Socketing | Fusion Lab | Lore Codex
  const [activeTab, setActiveTab] = useState<'sockets' | 'inventory' | 'fusion' | 'codex'>('sockets');

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'weapon' | 'energy' | 'defense' | 'science' | 'transcendent'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'Uncommon' | 'Rare' | 'Epic' | 'Lantean Ancient' | 'Ascended Divine'>('all');
  const [provenanceFilter, setProvenanceFilter] = useState<string>('all');

  // Selected Relic for Details Modal / Inspect
  const [inspectRelic, setInspectRelic] = useState<StargateRelic | null>(null);

  // Active Ability Cooldowns (stored in state / localStorage)
  const [abilityCooldowns, setAbilityCooldowns] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('uc_stargate_relic_cooldowns');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger' | 'info'; title: string; details: string } | null>(null);

  // Save relics changes to localStorage
  const saveRelics = (updated: StargateRelic[]) => {
    setRelics(updated);
    try {
      localStorage.setItem('uc_stargate_relics_vault', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save relics vault', e);
    }
  };

  // Calculate Total Passive Imperial Relic Bonuses
  const totalBonuses = relics
    .filter((r) => r.equippedSlot !== null && r.equippedSlot !== undefined)
    .reduce(
      (acc, r) => {
        acc.attack += r.passiveBonuses.attackBonusPct || 0;
        acc.defense += r.passiveBonuses.defenseBonusPct || 0;
        acc.energy += r.passiveBonuses.energyProductionPct || 0;
        acc.research += r.passiveBonuses.researchSpeedPct || 0;
        acc.warp += r.passiveBonuses.warpSpeedPct || 0;
        acc.happiness += r.passiveBonuses.happinessBonusPct || 0;
        acc.naquadah += r.passiveBonuses.naquadahHourlyBonus || 0;
        acc.darkMatter += r.passiveBonuses.darkMatterBonus || 0;
        return acc;
      },
      { attack: 0, defense: 0, energy: 0, research: 0, warp: 0, happiness: 0, naquadah: 0, darkMatter: 0 }
    );

  // Equip Relic to Slot
  const handleEquipRelic = (relicId: string, slot: StargateRelic['equippedSlot']) => {
    sound.play('confirm');
    const updated = relics.map((r) => {
      // If equipping this relic, assign slot
      if (r.id === relicId) {
        return { ...r, equippedSlot: slot };
      }
      // If another relic was in this slot, unequip it
      if (r.equippedSlot === slot && r.id !== relicId) {
        return { ...r, equippedSlot: null };
      }
      return r;
    });

    const target = relics.find((r) => r.id === relicId);
    saveRelics(updated);
    setFeedback({
      type: 'success',
      title: 'STARGATE RELIC SOCKETED',
      details: `${target?.name} successfully installed into Imperial ${slot?.toUpperCase()} Socket. Passive bonuses active!`,
    });
  };

  // Unequip Relic from Slot
  const handleUnequipRelic = (relicId: string) => {
    sound.play('click');
    const updated = relics.map((r) => (r.id === relicId ? { ...r, equippedSlot: null } : r));
    const target = relics.find((r) => r.id === relicId);
    saveRelics(updated);
    setFeedback({
      type: 'info',
      title: 'RELIC UNEQUIPPED',
      details: `${target?.name} returned to the Stargate Vault Storage.`,
    });
  };

  // Trigger Active Relic Power
  const handleActivateRelicPower = (relic: StargateRelic) => {
    if (!relic.activeAbility) return;

    const cooldownKey = relic.id;
    const now = Date.now();
    const activeUntil = abilityCooldowns[cooldownKey] || 0;

    if (now < activeUntil) {
      sound.play('warning');
      const minsLeft = Math.ceil((activeUntil - now) / 60000);
      setFeedback({
        type: 'danger',
        title: 'RELIC COOLDOWN ACTIVE',
        details: `${relic.name}'s power matrix is recharging. Available in ${minsLeft} minutes.`,
      });
      return;
    }

    sound.play('confirm');

    // Set new cooldown
    const newCooldownMs = relic.activeAbility.cooldownHours * 3600 * 1000;
    const updatedCd = { ...abilityCooldowns, [cooldownKey]: now + newCooldownMs };
    setAbilityCooldowns(updatedCd);
    try {
      localStorage.setItem('uc_stargate_relic_cooldowns', JSON.stringify(updatedCd));
    } catch {}

    // Apply specific relic effect
    const effect = relic.activeAbility.effectType;
    if (effect === 'energy_surge') {
      if (onUpdateResources) {
        onUpdateResources({
          energy: (resources.energy || 0) + 100000,
          naquadah: (resources.naquadah || 0) + 50000,
        });
      }
      setFeedback({
        type: 'success',
        title: `ZPM SUBSPACE SURGE UNLEASHED!`,
        details: `Subspace vacuum energy infused into power grid! Granted +100,000 Energy Units and +50,000 Naquadah reserves.`,
      });
    } else if (effect === 'hazard_purge') {
      setFeedback({
        type: 'success',
        title: `DAKARA DISINTEGRATION WAVE DISPATCHED!`,
        details: `Molecular energy frequency swept through the Stargate network. Purged all toxic planetary hazards and quelled unrest!`,
      });
    } else if (effect === 'happiness_buff') {
      setFeedback({
        type: 'success',
        title: `ARK OF TRUTH REVELATION EMITTED!`,
        details: `Subspace revelation wave broadcast across all imperial worlds. Population happiness boosted to 100%!`,
      });
    } else if (effect === 'phase_cloak') {
      if (onUpdateResources) {
        onUpdateResources({
          attackTurns: (resources.attackTurns || 0) + 5,
        });
      }
      setFeedback({
        type: 'success',
        title: `TOLLAN PHASE SHIELD ENGAGED!`,
        details: `Fleet shifted into out-of-phase dimensional plane. Granted +5 Attack Turns and complete shield immunity!`,
      });
    } else if (effect === 'time_acceleration') {
      if (onUpdateResources) {
        onUpdateResources({
          attackTurns: (resources.attackTurns || 0) + 10,
        });
      }
      setFeedback({
        type: 'success',
        title: `ASGARD TEMPORAL DILATION ACTIVE!`,
        details: `Localized temporal warp field engaged. Construction queues accelerated and +10 Attack Turns granted!`,
      });
    } else if (effect === 'dimensional_salvage') {
      if (onUpdateResources) {
        onUpdateResources({
          darkMatter: (resources.darkMatter || 0) + 500,
          crystal: (resources.crystal || 0) + 100000,
        });
      }
      setFeedback({
        type: 'success',
        title: `PARALLEL DIMENSION SALVAGE COMPLETED!`,
        details: `Quantum Mirror opened an inter-dimensional rift. Recovered +500 Dark Matter and +100,000 Crystal!`,
      });
    }
  };

  // Perform Relic Fusion / Synthesis
  const handleFuseRelics = () => {
    const dakaraShard = relics.find((r) => r.id === 'relic_dakara_transmuter_shard');
    if (!dakaraShard || dakaraShard.quantityOwned < 3) {
      sound.play('warning');
      setFeedback({
        type: 'danger',
        title: 'INSUFFICIENT DAKARA SHARDS',
        details: 'Fusing relics requires at least 3 Dakara Transmuter Fragments. Obtain shards from Stargate Off-World Expeditions or System Lord Raids.',
      });
      return;
    }

    sound.play('confirm');

    // Deduct 3 shards
    const updated = relics.map((r) => {
      if (r.id === 'relic_dakara_transmuter_shard') {
        return { ...r, quantityOwned: r.quantityOwned - 3 };
      }
      return r;
    });

    // Unowned high tier relics list
    const unownedHighRelics = updated.filter(
      (r) => (r.rarity === 'Lantean Ancient' || r.rarity === 'Ascended Divine') && r.quantityOwned === 0
    );

    let newlyForgedName = 'Lantean Ancient Power Crystal';
    if (unownedHighRelics.length > 0) {
      const chosen = unownedHighRelics[Math.floor(Math.random() * unownedHighRelics.length)];
      newlyForgedName = chosen.name;
      const finalRelics = updated.map((r) => (r.id === chosen.id ? { ...r, quantityOwned: 1 } : r));
      saveRelics(finalRelics);
    } else {
      // If all owned, grant 1,000 Dark Matter
      if (onUpdateResources) {
        onUpdateResources({ darkMatter: (resources.darkMatter || 0) + 1000 });
      }
      saveRelics(updated);
    }

    setFeedback({
      type: 'success',
      title: 'DAKARA TRANSMUTATION FORGE SUCCESSFUL!',
      details: `3 Dakara Transmuter Fragments fused in the Ancient crucible! Unlocked: ${newlyForgedName}!`,
    });
  };

  // Filtered Inventory
  const filteredRelics = relics.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dropLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesRarity = rarityFilter === 'all' || r.rarity === rarityFilter;
    const matchesProvenance = provenanceFilter === 'all' || r.seriesProvenance === provenanceFilter;

    return matchesSearch && matchesCategory && matchesRarity && matchesProvenance;
  });

  // Socket Slots Configuration
  const SOCKET_SLOTS: {
    slotKey: StargateRelic['equippedSlot'];
    label: string;
    icon: any;
    recommendedCategory: string;
    bgAccent: string;
  }[] = [
    { slotKey: 'offense', label: '1. Primary Offense Artifact', icon: Swords, recommendedCategory: 'Weapon & Solar Lenses', bgAccent: 'border-rose-300 bg-rose-50/40' },
    { slotKey: 'energy', label: '2. Zero-Point Energy Relic', icon: Zap, recommendedCategory: 'ZPMs & Neutrino Ions', bgAccent: 'border-amber-300 bg-amber-50/40' },
    { slotKey: 'defense', label: '3. Phase Shield & Defense Relic', icon: Shield, recommendedCategory: 'Molecular Arrays & Phase Cloaks', bgAccent: 'border-blue-300 bg-blue-50/40' },
    { slotKey: 'science', label: '4. Science & Tech Archive', icon: BookOpen, recommendedCategory: 'Ark of Truth & Asgard Cores', bgAccent: 'border-emerald-300 bg-emerald-50/40' },
    { slotKey: 'planetary', label: '5. Planetary & Biome Relic', icon: Globe, recommendedCategory: 'Dakara Waves & Nox Crystals', bgAccent: 'border-cyan-300 bg-cyan-50/40' },
    { slotKey: 'transcendent', label: '6. Ascended Transcendent Relic', icon: Crown, recommendedCategory: 'Ascended Divine Artifacts', bgAccent: 'border-purple-300 bg-purple-50/40' },
  ];

  return (
    <div id="stargate-relics-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-[#0d1527] via-[#16243d] to-[#0a1120] border-2 border-amber-500/40 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none font-mono text-9xl font-extrabold select-none">
          🏺
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                Stargate TV & Movie Relic Vault
              </span>
              <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold uppercase tracking-widest">
                22 Canonical Artifacts
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-white">
              <span>🏺 Imperial Stargate Relics & Artifact Citadel</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-1">
              Socket and harness legendary alien technology from SG-1, Atlantis, Universe, and The Ark of Truth. Empower your fleets with ZPM power cores, the Weapon of Dakara, the Sangreal, the Ark of Truth, and Asgard legacy computer matrices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('stargate-network')}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Globe className="w-4 h-4 text-cyan-200" />
              <span>Stargate Off-World Expeditions</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('stargate-system-lords')}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>System Lord Raids</span>
            </button>
          </div>
        </div>

        {/* Aggregate Imperial Passive Relic Bonuses Strip */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="bg-slate-900/60 p-2.5 border border-rose-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">FLEET ATTACK</span>
            <span className="text-rose-400 font-extrabold text-sm">+{totalBonuses.attack}%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 border border-blue-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">FLEET DEFENSE</span>
            <span className="text-blue-400 font-extrabold text-sm">+{totalBonuses.defense}%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 border border-amber-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">POWER OUTPUT</span>
            <span className="text-amber-400 font-extrabold text-sm">+{totalBonuses.energy}%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 border border-emerald-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">RESEARCH SPEED</span>
            <span className="text-emerald-400 font-extrabold text-sm">+{totalBonuses.research}%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 border border-cyan-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">WARP HYPERDRIVE</span>
            <span className="text-cyan-400 font-extrabold text-sm">+{totalBonuses.warp}%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 border border-purple-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">POP HAPPINESS</span>
            <span className="text-purple-400 font-extrabold text-sm">+{totalBonuses.happiness}%</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 border border-yellow-500/30">
            <span className="text-[10px] text-slate-400 block font-bold">HOURLY NAQUADAH</span>
            <span className="text-yellow-300 font-extrabold text-sm">+{totalBonuses.naquadah.toLocaleString()}/h</span>
          </div>
        </div>
      </div>

      {/* Feedback Alert Notice */}
      {feedback && (
        <div
          className={`p-4 border text-xs font-mono flex items-start justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedback.type === 'danger'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}
        >
          <div>
            <strong className="block font-bold text-sm uppercase">{feedback.title}</strong>
            <p className="mt-0.5">{feedback.details}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="px-2 py-0.5 border border-current text-[10px] uppercase font-bold hover:bg-black/10 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#dedede] bg-white px-2 pt-2 overflow-x-auto">
        {[
          { id: 'sockets', label: '1. Active Relic Sockets (6 Slots)', icon: Layers },
          { id: 'inventory', label: `2. Relic Vault Inventory (${relics.filter((r) => r.quantityOwned > 0).length}/${relics.length})`, icon: BookOpen },
          { id: 'fusion', label: '3. Dakara Transmutation Crucible', icon: Sparkles },
          { id: 'codex', label: '4. Stargate Show & Movie Lore Codex', icon: Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.play('click');
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
                  : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-[#f9f9f9]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE RELIC SOCKETS */}
      {/* ========================================================================= */}
      {activeTab === 'sockets' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-5">
            <h2 className="text-base font-bold text-[#111111] mb-1 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Imperial Relic Matrix Sockets</span>
            </h2>
            <p className="text-xs text-[#666666] mb-5">
              Socket owned artifacts into your 6 imperial slots to activate passive bonuses and trigger active relic powers during space battles and planetary administration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOCKET_SLOTS.map((slot) => {
                const Icon = slot.icon;
                const equippedRelic = relics.find((r) => r.equippedSlot === slot.slotKey);

                return (
                  <div
                    key={slot.slotKey}
                    className={`p-4 border-2 transition-all flex flex-col justify-between ${
                      equippedRelic ? slot.bgAccent : 'border-dashed border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-black/10 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-800" />
                          <span className="font-bold text-xs uppercase text-[#111]">{slot.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{slot.recommendedCategory}</span>
                      </div>

                      {equippedRelic ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{equippedRelic.icon}</span>
                            <div>
                              <h3 className="font-extrabold text-sm text-[#111]">{equippedRelic.name}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.5 bg-black/10 text-[9px] font-bold uppercase text-slate-700">
                                  {equippedRelic.rarity}
                                </span>
                                <span className="text-[10px] font-mono text-slate-600">{equippedRelic.seriesProvenance}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#555] line-clamp-2 leading-relaxed mt-2 italic">
                            "{equippedRelic.description}"
                          </p>

                          {/* Passive Bonuses */}
                          <div className="pt-2 border-t border-black/10 space-y-1 text-[11px] font-mono font-bold text-slate-800">
                            {equippedRelic.passiveBonuses.attackBonusPct && (
                              <div className="text-rose-700">+ {equippedRelic.passiveBonuses.attackBonusPct}% Fleet Attack Damage</div>
                            )}
                            {equippedRelic.passiveBonuses.defenseBonusPct && (
                              <div className="text-blue-700">+ {equippedRelic.passiveBonuses.defenseBonusPct}% Fleet Shield & Defense</div>
                            )}
                            {equippedRelic.passiveBonuses.energyProductionPct && (
                              <div className="text-amber-700">+ {equippedRelic.passiveBonuses.energyProductionPct}% Energy Reactor Output</div>
                            )}
                            {equippedRelic.passiveBonuses.researchSpeedPct && (
                              <div className="text-emerald-700">+ {equippedRelic.passiveBonuses.researchSpeedPct}% Science & Tech Speed</div>
                            )}
                            {equippedRelic.passiveBonuses.warpSpeedPct && (
                              <div className="text-cyan-700">+ {equippedRelic.passiveBonuses.warpSpeedPct}% Warp Speed</div>
                            )}
                            {equippedRelic.passiveBonuses.naquadahHourlyBonus && (
                              <div className="text-yellow-700">+ {equippedRelic.passiveBonuses.naquadahHourlyBonus.toLocaleString()} Naquadah / hour</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-slate-400">
                          <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <span className="font-bold text-xs block text-slate-600">SOCKET EMPTY</span>
                          <span className="text-[10px]">Select an artifact from inventory to install</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-black/10 flex items-center justify-between">
                      {equippedRelic ? (
                        <button
                          onClick={() => handleUnequipRelic(equippedRelic.id)}
                          className="w-full py-1.5 bg-slate-800 hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase cursor-pointer transition-colors"
                        >
                          Unequip Artifact
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTab('inventory');
                            setCategoryFilter('all');
                          }}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase cursor-pointer transition-colors"
                        >
                          Choose Artifact
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipped Relic Active Abilities Command Deck */}
          <div className="border border-[#dedede] bg-white p-5">
            <h2 className="text-base font-bold text-[#111111] mb-1 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Equipped Active Relic Powers</span>
            </h2>
            <p className="text-xs text-[#666666] mb-4">
              Trigger powerful active technological discharges from your currently socketed Stargate artifacts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relics
                .filter((r) => r.equippedSlot !== null && r.activeAbility)
                .map((relic) => {
                  const ability = relic.activeAbility!;
                  const now = Date.now();
                  const cdUntil = abilityCooldowns[relic.id] || 0;
                  const isReady = now >= cdUntil;
                  const minsRemaining = Math.max(0, Math.ceil((cdUntil - now) / 60000));

                  return (
                    <div key={relic.id} className="p-4 border border-[#dedede] bg-[#fdfdfd] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{relic.icon}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                              isReady ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {isReady ? 'READY' : `RECHARGING (${minsRemaining}m)`}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-xs text-[#111] uppercase font-mono">{ability.name}</h3>
                        <p className="text-[11px] text-[#666] mt-1 leading-relaxed">{ability.description}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[#eee] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#888]">Cooldown: {ability.cooldownHours}h</span>
                        <button
                          onClick={() => handleActivateRelicPower(relic)}
                          disabled={!isReady}
                          className="px-3 py-1.5 bg-amber-600 text-white font-mono text-xs font-bold uppercase hover:bg-amber-700 disabled:opacity-40 cursor-pointer"
                        >
                          Activate Power
                        </button>
                      </div>
                    </div>
                  );
                })}

              {relics.filter((r) => r.equippedSlot !== null && r.activeAbility).length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-300">
                  No active ability relics socketed. Equip the Zero-Point Module, Dakara Wave Array, Ark of Truth, or Asgard Core to unlock active powers!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RELIC VAULT INVENTORY */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="p-4 border border-[#dedede] bg-white space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Stargate Relics by name, lore, or drop location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-[#ccc] focus:border-[#111] outline-none"
                />
              </div>

              {/* Provenance Filter */}
              <select
                value={provenanceFilter}
                onChange={(e) => setProvenanceFilter(e.target.value)}
                className="px-3 py-2 border border-[#ccc] text-xs font-mono bg-white outline-none cursor-pointer"
              >
                <option value="all">All Stargate Media Series</option>
                <option value="SG-1">Stargate SG-1</option>
                <option value="Atlantis">Stargate Atlantis</option>
                <option value="Universe">Stargate Universe</option>
                <option value="The Ark of Truth">The Ark of Truth Movie</option>
                <option value="Original Movie">Original Stargate Movie</option>
              </select>

              {/* Rarity Filter */}
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as any)}
                className="px-3 py-2 border border-[#ccc] text-xs font-mono bg-white outline-none cursor-pointer"
              >
                <option value="all">All Rarity Tiers</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Lantean Ancient">Lantean Ancient</option>
                <option value="Ascended Divine">Ascended Divine</option>
              </select>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#eee]">
              <span className="text-xs font-bold text-[#666] mr-1">Category:</span>
              {[
                { id: 'all', label: 'All Artifacts' },
                { id: 'weapon', label: '⚔ Weapon & Lenses' },
                { id: 'energy', label: '⚡ Energy & ZPMs' },
                { id: 'defense', label: '🛡 Shields & Cloaks' },
                { id: 'science', label: '📜 Science Archives' },
                { id: 'transcendent', label: '✨ Transcendent Catalyst' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id as any)}
                  className={`px-3 py-1 text-xs font-mono border cursor-pointer transition-colors ${
                    categoryFilter === c.id ? 'bg-[#111] text-white border-[#111] font-bold' : 'bg-white text-[#333] border-[#ccc] hover:border-[#111]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Relic Vault Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRelics.map((relic) => {
              const isOwned = relic.quantityOwned > 0;
              const isEquipped = relic.equippedSlot !== null && relic.equippedSlot !== undefined;

              return (
                <div
                  key={relic.id}
                  className={`p-4 border-2 flex flex-col justify-between transition-all ${
                    isEquipped
                      ? 'border-amber-500 bg-amber-50/20 shadow-md'
                      : isOwned
                      ? 'border-[#dedede] bg-white'
                      : 'border-slate-200 bg-slate-100/60 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{relic.icon}</span>
                        <div>
                          <h3 className="font-extrabold text-xs text-[#111] leading-tight">{relic.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                                relic.rarity === 'Ascended Divine'
                                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                  : relic.rarity === 'Lantean Ancient'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-800 border border-slate-300'
                              }`}
                            >
                              {relic.rarity}
                            </span>
                            <span className="text-[10px] font-mono text-[#777]">{relic.seriesProvenance}</span>
                          </div>
                        </div>
                      </div>

                      {isEquipped && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                          SOCKETED ({relic.equippedSlot?.toUpperCase()})
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#555] leading-relaxed mb-3">{relic.description}</p>

                    {/* Passive Bonuses */}
                    <div className="p-2.5 bg-[#f8f8f8] border border-[#e8e8e8] space-y-1 text-[11px] font-mono text-[#222] mb-3">
                      <strong className="block text-[10px] text-[#777] uppercase font-sans mb-1">Vault Passive Stats:</strong>
                      {relic.passiveBonuses.attackBonusPct && <div>+ {relic.passiveBonuses.attackBonusPct}% Fleet Attack Damage</div>}
                      {relic.passiveBonuses.defenseBonusPct && <div>+ {relic.passiveBonuses.defenseBonusPct}% Fleet Shield & Defense</div>}
                      {relic.passiveBonuses.energyProductionPct && <div>+ {relic.passiveBonuses.energyProductionPct}% Energy Output</div>}
                      {relic.passiveBonuses.researchSpeedPct && <div>+ {relic.passiveBonuses.researchSpeedPct}% Research Speed</div>}
                      {relic.passiveBonuses.warpSpeedPct && <div>+ {relic.passiveBonuses.warpSpeedPct}% Hyperdrive Speed</div>}
                      {relic.passiveBonuses.naquadahHourlyBonus && <div>+ {relic.passiveBonuses.naquadahHourlyBonus.toLocaleString()} Naquadah / hour</div>}
                    </div>

                    {/* Drop Location provenance */}
                    <div className="text-[10px] font-mono text-[#777] flex items-center gap-1 mb-2">
                      <Globe className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>Drop: {relic.dropLocation}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#eee] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#666]">
                      Owned: <strong className="text-[#111]">{relic.quantityOwned}</strong>
                    </span>

                    {isOwned ? (
                      isEquipped ? (
                        <button
                          onClick={() => handleUnequipRelic(relic.id)}
                          className="px-3 py-1.5 bg-slate-800 text-white font-mono text-xs font-bold uppercase hover:bg-rose-700 cursor-pointer"
                        >
                          Unequip
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleEquipRelic(
                                relic.id,
                                relic.category === 'weapon'
                                  ? 'offense'
                                  : relic.category === 'energy'
                                  ? 'energy'
                                  : relic.category === 'defense'
                                  ? 'defense'
                                  : relic.category === 'science'
                                  ? 'science'
                                  : 'transcendent'
                              )
                            }
                            className="px-3 py-1.5 bg-blue-600 text-white font-mono text-xs font-bold uppercase hover:bg-blue-700 cursor-pointer"
                          >
                            Equip Socket
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => onNavigate && onNavigate('stargate-network')}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase hover:bg-slate-300 cursor-pointer flex items-center gap-1"
                      >
                        <span>Hunt Stargate</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DAKARA TRANSMUTATION CRUCIBLE */}
      {/* ========================================================================= */}
      {activeTab === 'fusion' && (
        <div className="border border-[#dedede] bg-white p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#eee] pb-4">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Ancient Transmutation Crucible</span>
              </span>
              <h2 className="text-lg font-bold text-[#111]">Dakara Relic Fusion Laboratory</h2>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 p-2 border border-purple-200 text-xs font-mono">
              <span className="text-purple-900 font-bold">Dakara Shards Owned:</span>
              <span className="font-extrabold text-purple-700 text-sm">
                {relics.find((r) => r.id === 'relic_dakara_transmuter_shard')?.quantityOwned || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-5 bg-gradient-to-br from-slate-900 to-purple-950 text-white border border-purple-800 space-y-3">
              <h3 className="font-bold text-sm text-purple-200 uppercase font-mono flex items-center gap-2">
                <span>✨ Transmutation Recipe</span>
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Combine 3 Dakara Transmuter Fragments inside the Ancient sub-atomic crucible to transmute a random missing Lantean Ancient or Ascended Divine Relic!
              </p>
              <ul className="text-xs font-mono space-y-1 text-purple-300 pt-2 border-t border-purple-800/60">
                <li>• Input: 3x Dakara Transmuter Fragments</li>
                <li>• Guaranteed Output: Lantean Ancient or Ascended Relic</li>
                <li>• Alternative Output (if all owned): +1,000 Dark Matter</li>
              </ul>

              <button
                onClick={handleFuseRelics}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Transmute Ancient Relic (Requires 3 Shards)</span>
              </button>
            </div>

            <div className="p-5 border border-[#dedede] bg-[#fafafa] space-y-3 text-xs">
              <h3 className="font-bold text-xs uppercase text-[#111] font-mono">Where to find Dakara Shards:</h3>
              <p className="text-[#666] leading-relaxed">
                Dakara Transmuter Fragments drop from successful Stargate Address exploration, System Lord PvE Raids, and Deep Space Expeditions.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2 bg-white border border-[#ccc]">
                  <span>1. Stargate Address Exploration</span>
                  <button
                    onClick={() => onNavigate && onNavigate('stargate-network')}
                    className="px-2 py-1 bg-cyan-600 text-white font-mono text-[10px] uppercase font-bold hover:bg-cyan-700 cursor-pointer"
                  >
                    Dial Gate
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-white border border-[#ccc]">
                  <span>2. Defeat Goa'uld System Lords</span>
                  <button
                    onClick={() => onNavigate && onNavigate('stargate-system-lords')}
                    className="px-2 py-1 bg-amber-600 text-white font-mono text-[10px] uppercase font-bold hover:bg-amber-700 cursor-pointer"
                  >
                    Raid System Lords
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STARGATE LORE CODEX */}
      {/* ========================================================================= */}
      {activeTab === 'codex' && (
        <div className="space-y-4">
          <div className="border border-[#dedede] bg-white p-5">
            <h2 className="text-base font-bold text-[#111111] mb-1 uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span>Stargate Television & Movie Provenance Codex</span>
            </h2>
            <p className="text-xs text-[#666666] mb-4">
              Historical documentation and lore records for all 22 artifacts from Stargate SG-1, Atlantis, Universe, and The Ark of Truth.
            </p>

            <div className="space-y-3">
              {relics.map((relic) => (
                <div key={relic.id} className="p-4 border border-[#dedede] bg-[#fcfcfc] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{relic.icon}</span>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#111]">{relic.name}</h3>
                        <span className="text-[10px] font-mono text-cyan-700 font-bold">{relic.seriesProvenance}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono text-[10px] font-bold uppercase self-start sm:self-auto border">
                      {relic.rarity} · {relic.category.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-[#444] leading-relaxed font-sans italic">"{relic.lore}"</p>

                  <div className="text-[11px] font-mono text-[#777] pt-1">
                    <strong>Primary Stargate Location:</strong> {relic.dropLocation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
