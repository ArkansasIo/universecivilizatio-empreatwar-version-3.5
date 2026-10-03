import React, { useState, useMemo } from 'react';
import {
  Zap,
  Shield,
  Eye,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlayerResources, Technology } from '../../types';

interface TechnologyViewProps {
  resources: PlayerResources;
  technologies: Technology[];
  activeBranchFilter?: string;
  onUpgradeTech: (techId: string) => { success: boolean; message: string };
}

export const TechnologyView: React.FC<TechnologyViewProps> = ({
  resources,
  technologies,
  activeBranchFilter,
  onUpgradeTech,
}) => {
  const [filter, setFilter] = useState<string>(activeBranchFilter || 'all');
  const [selectedSubClass, setSelectedSubClass] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'tier-desc' | 'tier-asc' | 'level-desc' | 'cost-asc' | 'name-asc'>('tier-asc');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(24);

  React.useEffect(() => {
    if (activeBranchFilter) {
      setFilter(activeBranchFilter);
    }
  }, [activeBranchFilter]);

  // Reset display count on filter change
  React.useEffect(() => {
    setDisplayCount(24);
  }, [filter, selectedSubClass, selectedTier, searchQuery, sortBy]);

  // Aggregate stats
  const totalLevels = useMemo(() => {
    return technologies.reduce((acc, t) => acc + (t.level || 0), 0);
  }, [technologies]);

  const offenseLevels = useMemo(() => {
    return technologies.filter((t) => t.category === 'offense').reduce((acc, t) => acc + (t.level || 0), 0);
  }, [technologies]);

  const defenseLevels = useMemo(() => {
    return technologies.filter((t) => t.category === 'defense').reduce((acc, t) => acc + (t.level || 0), 0);
  }, [technologies]);

  const covertLevels = useMemo(() => {
    return technologies.filter((t) => t.category === 'covert').reduce((acc, t) => acc + (t.level || 0), 0);
  }, [technologies]);

  const antiCovertLevels = useMemo(() => {
    return technologies.filter((t) => t.category === 'anti-covert').reduce((acc, t) => acc + (t.level || 0), 0);
  }, [technologies]);

  // Get unique subclasses for current category
  const availableSubClasses = useMemo(() => {
    const list = technologies
      .filter((t) => filter === 'all' || t.category === filter)
      .map((t) => t.subClass)
      .filter((sc): sc is string => Boolean(sc));
    return ['all', ...Array.from(new Set(list))];
  }, [technologies, filter]);

  // Filtered and sorted technologies
  const filteredTechs = useMemo(() => {
    return technologies
      .filter((t) => {
        if (filter !== 'all' && t.category !== filter) return false;
        if (selectedSubClass !== 'all' && t.subClass !== selectedSubClass) return false;
        if (selectedTier !== 'all' && t.tier !== selectedTier) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = t.name.toLowerCase().includes(q);
          const matchSub = t.subClass?.toLowerCase().includes(q);
          const matchType = t.techType?.toLowerCase().includes(q);
          const matchSubType = t.subType?.toLowerCase().includes(q);
          const matchDesc = t.description.toLowerCase().includes(q);
          if (!matchName && !matchSub && !matchType && !matchSubType && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'tier-asc') return (a.tier || 1) - (b.tier || 1);
        if (sortBy === 'tier-desc') return (b.tier || 1) - (a.tier || 1);
        if (sortBy === 'level-desc') return b.level - a.level;
        if (sortBy === 'cost-asc') {
          const costA = Math.round(a.baseCost * Math.pow(a.costGrowth, a.level));
          const costB = Math.round(b.baseCost * Math.pow(b.costGrowth, b.level));
          return costA - costB;
        }
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [technologies, filter, selectedSubClass, selectedTier, searchQuery, sortBy]);

  const visibleTechs = useMemo(() => {
    return filteredTechs.slice(0, displayCount);
  }, [filteredTechs, displayCount]);

  const getUpgradeCost = (t: Technology) => {
    return Math.round(t.baseCost * Math.pow(t.costGrowth, t.level));
  };

  const handleUpgrade = (tech: Technology) => {
    const res = onUpgradeTech(tech.id);
    if (res.success) {
      sound.play('research');
      setNotice({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setNotice({ type: 'error', text: res.message });
    }
  };

  const handleBatchUpgrade = (tech: Technology, times: number) => {
    let successCount = 0;
    let lastMsg = '';
    for (let i = 0; i < times; i++) {
      const res = onUpgradeTech(tech.id);
      if (res.success) {
        successCount++;
        lastMsg = res.message;
      } else {
        if (successCount === 0) {
          sound.play('warning');
          setNotice({ type: 'error', text: res.message });
          return;
        }
        break;
      }
    }
    if (successCount > 0) {
      sound.play('research');
      setNotice({
        type: 'success',
        text: `Advanced ${tech.name} +${successCount} levels! (${lastMsg})`,
      });
    }
  };

  const getTierBadgeStyle = (tier: number = 1) => {
    switch (tier) {
      case 1:
      case 2:
        return 'bg-amber-900/10 text-amber-900 border-amber-800/30';
      case 3:
      case 4:
        return 'bg-slate-200 text-slate-800 border-slate-400';
      case 5:
      case 6:
        return 'bg-amber-100 text-amber-950 border-amber-500 font-bold';
      case 7:
      case 8:
        return 'bg-cyan-100 text-cyan-950 border-cyan-500 font-bold';
      case 9:
      case 10:
        return 'bg-purple-100 text-purple-950 border-purple-500 font-extrabold shadow-xs';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
  };

  return (
    <div id="technology-view" className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#dedede] bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              <span>SUPREME IMPERIAL SCIENTIFIC ARCHIVE · 360+ TECHNOLOGIES</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">
              Galactic Technology & Doctrine Mainframe
            </h2>
            <p className="text-xs text-[#666666] mt-1 max-w-3xl leading-relaxed">
              Research and master 90 technologies across 9 subclasses for each imperial discipline:
              Offensive Projectiles & Beams, Defensive Bastions & Shield Arrays, Covert Infiltration & ECM,
              and Counter-Espionage Sensor Networks. Every level compounds fleet combat potency across the cosmos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 border border-[#dedede] bg-[#fafafa] text-right">
              <span className="text-[10px] text-[#777777] font-bold uppercase tracking-wider block">Total Techs</span>
              <span className="text-lg font-mono font-bold text-[#111111]">{technologies.length}</span>
            </div>
            <div className="p-3 border border-[#dedede] bg-[#fafafa] text-right">
              <span className="text-[10px] text-[#777777] font-bold uppercase tracking-wider block">Levels Mastered</span>
              <span className="text-lg font-mono font-bold text-emerald-600">Lv {totalLevels}</span>
            </div>
          </div>
        </div>

        {/* 4 Multiplier Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#eeeeee]">
          <div className="p-2.5 bg-red-50/60 border border-red-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-red-900">
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-red-600" />
                <span>Offense</span>
              </span>
              <span className="font-mono">Lv {offenseLevels}</span>
            </div>
            <div className="text-base font-mono font-extrabold text-red-950 mt-1">
              ×{(1.0 + offenseLevels * 0.15).toFixed(2)}
            </div>
          </div>

          <div className="p-2.5 bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-blue-600" />
                <span>Defense</span>
              </span>
              <span className="font-mono">Lv {defenseLevels}</span>
            </div>
            <div className="text-base font-mono font-extrabold text-blue-950 mt-1">
              ×{(1.0 + defenseLevels * 0.15).toFixed(2)}
            </div>
          </div>

          <div className="p-2.5 bg-purple-50/60 border border-purple-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
              <span className="flex items-center gap-1">
                <Eye size={12} className="text-purple-600" />
                <span>Covert</span>
              </span>
              <span className="font-mono">Lv {covertLevels}</span>
            </div>
            <div className="text-base font-mono font-extrabold text-purple-950 mt-1">
              ×{(1.0 + covertLevels * 0.15).toFixed(2)}
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Anti-Covert</span>
              </span>
              <span className="font-mono">Lv {antiCovertLevels}</span>
            </div>
            <div className="text-base font-mono font-extrabold text-emerald-950 mt-1">
              ×{(1.0 + antiCovertLevels * 0.15).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center transition-all ${
            notice.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Discipline Tabs */}
      <div className="border border-[#dedede] bg-white">
        <div className="flex flex-wrap border-b border-[#dedede]">
          {[
            { id: 'all', label: 'All Technologies', count: technologies.length },
            {
              id: 'offense',
              label: 'Offensive Systems (90)',
              icon: <Zap size={14} className="text-red-500" />,
              count: technologies.filter((t) => t.category === 'offense').length,
            },
            {
              id: 'defense',
              label: 'Defensive Bastions (90)',
              icon: <Shield size={14} className="text-blue-500" />,
              count: technologies.filter((t) => t.category === 'defense').length,
            },
            {
              id: 'covert',
              label: 'Covert Infiltration (90)',
              icon: <Eye size={14} className="text-purple-500" />,
              count: technologies.filter((t) => t.category === 'covert').length,
            },
            {
              id: 'anti-covert',
              label: 'Counter-Espionage (90)',
              icon: <ShieldCheck size={14} className="text-emerald-500" />,
              count: technologies.filter((t) => t.category === 'anti-covert').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.play('click');
                setFilter(tab.id);
                setSelectedSubClass('all');
              }}
              className={`py-3 px-4 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                filter === tab.id
                  ? 'border-[#111111] text-[#111111] bg-neutral-50'
                  : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 bg-[#fafafa] border-b border-[#eeeeee] space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technologies by name, subclass, type, stats..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#dedede] focus:border-[#111111] outline-hidden font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider shrink-0">Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => {
                  sound.play('click');
                  setSelectedTier(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10));
                }}
                className="px-2.5 py-1.5 text-xs bg-white border border-[#dedede] focus:border-[#111111] outline-hidden font-mono cursor-pointer"
              >
                <option value="all">All Tiers (1 - 10)</option>
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tier {i + 1}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  sound.play('click');
                  setSortBy(e.target.value as any);
                }}
                className="px-2.5 py-1.5 text-xs bg-white border border-[#dedede] focus:border-[#111111] outline-hidden font-mono cursor-pointer"
              >
                <option value="tier-asc">Tier: 1 → 10</option>
                <option value="tier-desc">Tier: 10 → 1</option>
                <option value="level-desc">Level: High → Low</option>
                <option value="cost-asc">Cost: Low → High</option>
                <option value="name-asc">Name: A → Z</option>
              </select>
            </div>
          </div>

          {/* SubClass Filter Pills */}
          {availableSubClasses.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
              <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Layers size={11} />
                <span>SubClass:</span>
              </span>
              {availableSubClasses.map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => {
                    sound.play('click');
                    setSelectedSubClass(sc);
                  }}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-mono tracking-wide cursor-pointer transition-colors whitespace-nowrap border ${
                    selectedSubClass === sc
                      ? 'bg-[#111111] text-white border-[#111111] font-bold'
                      : 'bg-white text-[#555555] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  {sc === 'all' ? 'All SubClasses' : sc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-[#666666] font-mono px-1">
        <div>
          Showing <strong className="text-[#111111]">{visibleTechs.length}</strong> of{' '}
          <strong className="text-[#111111]">{filteredTechs.length}</strong> technologies matching criteria
        </div>
        {(selectedSubClass !== 'all' || selectedTier !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSubClass('all');
              setSelectedTier('all');
              setSearchQuery('');
            }}
            className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {visibleTechs.map((tech) => {
          const cost = getUpgradeCost(tech);
          const canAfford = resources.naquadah >= cost;
          const maxLevel = tech.maxLevel || 50;
          const isMaxed = tech.level >= maxLevel;

          return (
            <div
              key={tech.id}
              className="border border-[#dedede] bg-white p-5 flex flex-col justify-between hover:border-[#999999] transition-all shadow-2xs hover:shadow-xs group"
            >
              <div>
                {/* Top Badge Strip: SubClass + Tier */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {tech.subClass || tech.category}
                    </span>
                    {tech.tier && (
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border ${getTierBadgeStyle(
                          tech.tier
                        )}`}
                      >
                        T{tech.tier}
                      </span>
                    )}
                  </div>

                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold shrink-0">
                    Lv {tech.level} {isMaxed && '· MAX'}
                  </span>
                </div>

                {/* Tech Title */}
                <h3 className="text-base font-bold text-[#111111] group-hover:text-cyan-900 transition-colors">
                  {tech.name}
                </h3>

                {/* Type & SubType tags */}
                {(tech.techType || tech.subType) && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#777777] mt-0.5 mb-2">
                    {tech.techType && <span>{tech.techType}</span>}
                    {tech.techType && tech.subType && <span>•</span>}
                    {tech.subType && <span className="text-indigo-600">{tech.subType}</span>}
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-[#555555] mb-3 leading-relaxed min-h-[36px] line-clamp-2">
                  {tech.description}
                </p>

                {/* Primary Stat Highlight */}
                {tech.stats?.primaryStat && (
                  <div className="mb-3 p-2 bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#666666] font-semibold">{tech.stats.primaryStat.name}:</span>
                    <span className="font-extrabold text-[#111111]">
                      +{tech.stats.primaryStat.value} {tech.stats.primaryStat.unit}
                    </span>
                  </div>
                )}

                {/* Sub-Stats Grid */}
                {tech.stats?.subStats && tech.stats.subStats.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px] font-mono bg-white p-2 border border-[#eeeeee]">
                    {tech.stats.subStats.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between border-b border-neutral-100 pb-0.5">
                        <span className="text-[#777777] truncate pr-1">{st.name}:</span>
                        <span className="font-bold text-[#222222] shrink-0">
                          {st.value}
                          {st.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Multiplier Progress */}
                <div className="border border-[#eeeeee] bg-[#fafafa] p-2.5 text-xs space-y-1 mb-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#666666]">Combat Multiplier:</span>
                    <b className="font-mono text-[#111111]">×{(1 + tech.level * 0.15).toFixed(2)}</b>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#666666]">Next Level Multiplier:</span>
                    <b className="font-mono text-emerald-700">×{(1 + (tech.level + 1) * 0.15).toFixed(2)}</b>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="w-full bg-neutral-200 h-1.5 mt-2 rounded-xs overflow-hidden">
                    <div
                      className="bg-[#111111] h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (tech.level / maxLevel) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="pt-3 border-t border-[#eeeeee] flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#666666]">Upgrade Cost:</span>
                  <span className="font-mono font-bold text-[#111111]">
                    {cost.toLocaleString()} <span className="text-[10px] text-amber-700 font-normal">Naquadah</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpgrade(tech)}
                    disabled={!canAfford || isMaxed}
                    className="col-span-2 py-2 px-3 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1 shadow-2xs active:scale-[0.98]"
                  >
                    <span>Upgrade +1</span>
                    <ChevronRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBatchUpgrade(tech, 5)}
                    disabled={!canAfford || isMaxed}
                    title="Advance up to 5 levels in sequence if affordable"
                    className="py-2 px-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer text-center"
                  >
                    +5 Lvl
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {filteredTechs.length > displayCount && (
        <div className="p-6 bg-white border border-[#dedede] text-center space-y-2">
          <p className="text-xs text-[#666666] font-mono">
            Showing {visibleTechs.length} of {filteredTechs.length} available technologies
          </p>
          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setDisplayCount((prev) => prev + 48);
            }}
            className="px-6 py-2.5 bg-[#111111] hover:bg-[#333333] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
          >
            Load Next 48 Technologies ({filteredTechs.length - displayCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
