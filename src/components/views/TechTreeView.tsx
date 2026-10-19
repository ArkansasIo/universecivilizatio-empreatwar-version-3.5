import React, { useState } from 'react';
import {
  OGameTechnology,
  OGameTechBranch,
  PlayerResources,
  ResearchQueueItem,
} from '../../types';
import { sound } from '../../sound';

interface TechTreeViewProps {
  technologies: OGameTechnology[];
  resources: PlayerResources;
  researchQueue: ResearchQueueItem[];
  onStartResearch: (techId: string) => void;
  onCancelResearch: (queueId: string) => void;
}

const BRANCHES: { id: OGameTechBranch | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Technologies', icon: '✦' },
  { id: 'economics', label: 'Economics & Mining', icon: '⛏' },
  { id: 'science', label: 'Core Science & Energy', icon: '⚡' },
  { id: 'military', label: 'Military & Defense', icon: '⚔' },
  { id: 'advanced_science', label: 'Advanced Science', icon: '⚛' },
  { id: 'advanced_fleet', label: 'Advanced Fleet', icon: '🚀' },
  { id: 'endgame', label: 'Endgame & Dimensional', icon: '🌌' },
  { id: 'megastructures', label: 'Megastructures', icon: '🪐' },
];

export const TechTreeView: React.FC<TechTreeViewProps> = ({
  technologies,
  resources,
  researchQueue,
  onStartResearch,
  onCancelResearch,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<OGameTechBranch | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<OGameTechnology | null>(technologies[0] || null);

  const filteredTechs = technologies.filter((tech) => {
    const matchesBranch = selectedBranch === 'all' || tech.branch === selectedBranch;
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const checkPrerequisitesMet = (tech: OGameTechnology): boolean => {
    return tech.prerequisites.every((req) => {
      if (req.type === 'tech') {
        const found = technologies.find((t) => t.id === req.id);
        return found && found.level >= req.requiredLevel;
      }
      return true; // Facilities checked in parent or assume met for basic tiers
    });
  };

  const getCostForNextLevel = (tech: OGameTechnology) => {
    const mult = Math.pow(tech.costMultiplier, tech.level);
    return {
      metal: Math.round(tech.baseCost.metal * mult),
      crystal: Math.round(tech.baseCost.crystal * mult),
      deuterium: Math.round(tech.baseCost.deuterium * mult),
      energy: Math.round(tech.baseCost.energy * mult),
    };
  };

  const canAfford = (tech: OGameTechnology): boolean => {
    const cost = getCostForNextLevel(tech);
    return (
      (resources.metal ?? 0) >= cost.metal &&
      (resources.crystal ?? 0) >= cost.crystal &&
      (resources.deuterium ?? 0) >= cost.deuterium &&
      (resources.energy ?? 0) >= cost.energy
    );
  };

  const isResearching = (techId: string) => {
    return researchQueue.some((q) => q.techId === techId);
  };

  const activeQueueItem = (techId: string) => {
    return researchQueue.find((q) => q.techId === techId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="border border-[#111111] bg-white p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-wider">MASTER TECHNOLOGY UNLOCK GRAPH</span>
              <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-[#f8fafc]">
                GAME SPEC v4.2
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 max-w-2xl">
              Hierarchical technology progression network. Technologies unlock prerequisite tiers for advanced
              combat vessels, orbital planetary defenses, nanite factories, and star-spanning megastructures.
            </p>
          </div>

          {/* Active Research Banner */}
          {researchQueue.length > 0 && (
            <div className="border border-[#111111] bg-[#f8fafc] p-3 min-w-[280px]">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                  ACTIVE RESEARCH
                </span>
                <span className="font-mono text-[#111111]">
                  {researchQueue[0].remainingSeconds}s remaining
                </span>
              </div>
              <div className="text-xs font-bold text-[#111111] truncate mb-2">
                {researchQueue[0].techName} (Lv {researchQueue[0].targetLevel})
              </div>
              <div className="w-full bg-[#e2e8f0] h-1.5 overflow-hidden mb-2">
                <div
                  className="bg-[#111111] h-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.min(
                        100,
                        ((researchQueue[0].durationSeconds - researchQueue[0].remainingSeconds) /
                          researchQueue[0].durationSeconds) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => onCancelResearch(researchQueue[0].id)}
                className="text-[11px] font-mono text-[#dc2626] hover:underline cursor-pointer"
              >
                Abort Research Project
              </button>
            </div>
          )}
        </div>

        {/* Branch Filter Tabs & Search */}
        <div className="mt-5 pt-4 border-t border-[#e2e8f0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  sound.play('click');
                  setSelectedBranch(b.id);
                }}
                className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 border ${
                  selectedBranch === b.id
                    ? 'border-[#111111] bg-[#111111] text-white font-bold'
                    : 'border-[#cccccc] hover:border-[#111111] bg-white text-[#111111]'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tech tree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-56 px-3 py-1.5 text-xs font-mono border border-[#cccccc] focus:border-[#111111] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Tech Grid & Detailed Tech Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tech Node Cards Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechs.map((tech) => {
              const prereqsMet = checkPrerequisitesMet(tech);
              const cost = getCostForNextLevel(tech);
              const affordable = canAfford(tech);
              const researching = isResearching(tech.id);
              const isSelected = selectedTech?.id === tech.id;

              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTech(tech)}
                  className={`border p-4 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#111111] bg-white ring-2 ring-[#111111]'
                      : 'border-[#cccccc] hover:border-[#111111] bg-white'
                  }`}
                >
                  {/* Status Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666] block">
                        {tech.branch.replace('_', ' ')} • {tech.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#111111] leading-tight mt-0.5">
                        {tech.name}
                      </h4>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold border border-[#111111] bg-[#f8fafc]">
                        Lv {tech.level} / {tech.maxLevel}
                      </span>
                      {researching && (
                        <span className="mt-1 text-[10px] font-mono text-[#22c55e] font-bold">
                          [RESEARCHING]
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#444444] line-clamp-2 mb-3">
                    {tech.description}
                  </p>

                  {/* Effects Preview */}
                  {tech.effects.length > 0 && (
                    <div className="mb-3 py-1.5 px-2 bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-mono text-[#111111]">
                      {tech.effects.map((ef, idx) => (
                        <div key={idx}>
                          +{ef.valuePerLevel * tech.level}
                          {ef.unit} {ef.label}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Prerequisites Preview */}
                  {tech.prerequisites.length > 0 && (
                    <div className="text-[10px] font-mono text-[#666666] mb-3 space-y-0.5">
                      <div className="font-semibold text-[#111111]">Prerequisites:</div>
                      {tech.prerequisites.map((pr, idx) => {
                        const found = technologies.find((t) => t.id === pr.id);
                        const met = found ? found.level >= pr.requiredLevel : false;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-1 ${
                              met ? 'text-[#22c55e]' : 'text-[#dc2626]'
                            }`}
                          >
                            <span>{met ? '✓' : '✗'}</span>
                            <span>
                              {pr.name} Lv {pr.requiredLevel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Cost & Action Bar */}
                  <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
                    <div className="font-mono text-[11px] text-[#444444] space-x-2">
                      <span>M: {cost.metal.toLocaleString()}</span>
                      <span>C: {cost.crystal.toLocaleString()}</span>
                      {cost.deuterium > 0 && <span>D: {cost.deuterium.toLocaleString()}</span>}
                    </div>

                    <button
                      type="button"
                      disabled={!prereqsMet || !affordable || researching || tech.level >= tech.maxLevel}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartResearch(tech.id);
                      }}
                      className={`px-3 py-1 text-xs font-mono font-semibold transition-colors cursor-pointer border ${
                        researching
                          ? 'border-[#cccccc] bg-[#f1f5f9] text-[#666666] cursor-not-allowed'
                          : tech.level >= tech.maxLevel
                          ? 'border-[#cccccc] bg-[#e2e8f0] text-[#888888] cursor-not-allowed'
                          : !prereqsMet
                          ? 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626] cursor-not-allowed'
                          : !affordable
                          ? 'border-[#cccccc] bg-[#f8fafc] text-[#888888] cursor-not-allowed'
                          : 'border-[#111111] bg-[#111111] text-white hover:bg-black'
                      }`}
                    >
                      {researching
                        ? 'Researching'
                        : tech.level >= tech.maxLevel
                        ? 'Max Level'
                        : !prereqsMet
                        ? 'Locked'
                        : !affordable
                        ? 'No Resources'
                        : 'Upgrade'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Selected Tech Dossier (4 cols) */}
        <div className="lg:col-span-4">
          {selectedTech ? (
            <div className="border border-[#111111] bg-white p-5 sticky top-6 space-y-4">
              <div className="border-b border-[#111111] pb-3">
                <span className="text-[10px] font-mono uppercase text-[#666666] block">
                  TECHNOLOGY DOSSIER
                </span>
                <h3 className="text-base font-bold text-[#111111]">{selectedTech.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 text-xs font-mono border border-[#111111] bg-[#f8fafc]">
                    Current Level: {selectedTech.level}
                  </span>
                  <span className="text-xs font-mono text-[#666666]">
                    Max Cap: {selectedTech.maxLevel}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[#111111] mb-1">Overview</h5>
                <p className="text-xs text-[#444444] leading-relaxed">
                  {selectedTech.description}
                </p>
              </div>

              {/* Unlock Chain Matrix */}
              {selectedTech.unlockTargets && selectedTech.unlockTargets.length > 0 && (
                <div className="border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <h5 className="text-xs font-bold text-[#111111] mb-2 flex items-center gap-1.5">
                    <span>⚡</span> UNLOCKS & ENABLES
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTech.unlockTargets.map((target, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-[11px] font-mono border border-[#cccccc] bg-white text-[#111111]"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Calculated Effects */}
              <div>
                <h5 className="text-xs font-bold text-[#111111] mb-2">Empirical Bonuses</h5>
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedTech.effects.map((ef, idx) => (
                    <div
                      key={idx}
                      className="p-2 border border-[#e2e8f0] bg-white flex items-center justify-between"
                    >
                      <span className="text-[#444444]">{ef.label}:</span>
                      <span className="font-bold text-[#111111]">
                        +{ef.valuePerLevel * (selectedTech.level || 1)}
                        {ef.unit}{' '}
                        <span className="text-[10px] text-[#666666]">
                          (+{ef.valuePerLevel}
                          {ef.unit}/lvl)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Next Level Cost Breakdown */}
              <div className="border-t border-[#e2e8f0] pt-4">
                <h5 className="text-xs font-bold text-[#111111] mb-2">
                  Upgrade to Level {selectedTech.level + 1}
                </h5>
                {(() => {
                  const cost = getCostForNextLevel(selectedTech);
                  const affordable = canAfford(selectedTech);
                  const prereqsMet = checkPrerequisitesMet(selectedTech);
                  const researching = isResearching(selectedTech.id);

                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div
                          className={`p-2 border ${
                            (resources.metal ?? 0) >= cost.metal
                              ? 'border-[#e2e8f0] bg-[#f8fafc]'
                              : 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626]'
                          }`}
                        >
                          <div className="text-[10px] text-[#666666]">Metal</div>
                          <div className="font-bold">{cost.metal.toLocaleString()}</div>
                        </div>

                        <div
                          className={`p-2 border ${
                            (resources.crystal ?? 0) >= cost.crystal
                              ? 'border-[#e2e8f0] bg-[#f8fafc]'
                              : 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626]'
                          }`}
                        >
                          <div className="text-[10px] text-[#666666]">Crystal</div>
                          <div className="font-bold">{cost.crystal.toLocaleString()}</div>
                        </div>

                        {cost.deuterium > 0 && (
                          <div
                            className={`p-2 border ${
                              (resources.deuterium ?? 0) >= cost.deuterium
                                ? 'border-[#e2e8f0] bg-[#f8fafc]'
                                : 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626]'
                            }`}
                          >
                            <div className="text-[10px] text-[#666666]">Deuterium</div>
                            <div className="font-bold">{cost.deuterium.toLocaleString()}</div>
                          </div>
                        )}

                        {cost.energy > 0 && (
                          <div
                            className={`p-2 border ${
                              (resources.energy ?? 0) >= cost.energy
                                ? 'border-[#e2e8f0] bg-[#f8fafc]'
                                : 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626]'
                            }`}
                          >
                            <div className="text-[10px] text-[#666666]">Energy Req</div>
                            <div className="font-bold">{cost.energy.toLocaleString()}</div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!prereqsMet || !affordable || researching || selectedTech.level >= selectedTech.maxLevel}
                        onClick={() => onStartResearch(selectedTech.id)}
                        className={`w-full py-2.5 text-xs font-mono font-bold transition-colors cursor-pointer border ${
                          researching
                            ? 'border-[#cccccc] bg-[#f1f5f9] text-[#666666] cursor-not-allowed'
                            : selectedTech.level >= selectedTech.maxLevel
                            ? 'border-[#cccccc] bg-[#e2e8f0] text-[#888888] cursor-not-allowed'
                            : !prereqsMet
                            ? 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626] cursor-not-allowed'
                            : !affordable
                            ? 'border-[#cccccc] bg-[#f8fafc] text-[#888888] cursor-not-allowed'
                            : 'border-[#111111] bg-[#111111] text-white hover:bg-black'
                        }`}
                      >
                        {researching
                          ? 'RESEARCH IN PROGRESS'
                          : selectedTech.level >= selectedTech.maxLevel
                          ? 'MAXIMUM LEVEL REACHED'
                          : !prereqsMet
                          ? 'PREREQUISITES NOT SATISFIED'
                          : !affordable
                          ? 'INSUFFICIENT RESOURCES'
                          : `INITIATE RESEARCH (LV ${selectedTech.level + 1})`}
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="border border-[#cccccc] bg-white p-6 text-center text-xs text-[#666666]">
              Select a technology node to inspect prerequisites and research options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
