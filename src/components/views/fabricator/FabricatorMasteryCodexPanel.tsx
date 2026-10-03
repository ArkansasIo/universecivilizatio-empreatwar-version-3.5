import React, { useState } from 'react';
import {
  Database,
  Flame,
  Zap,
  Sparkles,
  Shield,
  Layers,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { TEMPERING_RECIPES, MASTERWORK_RANKS } from '../../../data/fabricatorMasteryData';

export const FabricatorMasteryCodexPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'tempering' | 'masterworking' | 'catalysts'>('tempering');

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="border border-[#dedede] bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3 mb-3">
          <Database size={16} className="text-purple-600" />
          <h2 className="text-base font-bold text-[#111111] uppercase tracking-wider">
            Fabrication Mastery, Tempering & Quantum Foundry Codex
          </h2>
        </div>
        <p className="text-xs text-[#555555] leading-relaxed">
          Comprehensive field manual for advanced planetary engineering. Masterworking and Tempering allow commanders
          to enhance structures, defense silos, resource mines, and power grids beyond standard factory limits.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 mt-4 text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => setActiveSection('tempering')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'tempering'
                ? 'border-[#111111] bg-[#111111] text-amber-300'
                : 'border-[#dedede] bg-neutral-50 text-[#666666] hover:bg-neutral-100'
            }`}
          >
            <Flame size={12} />
            <span>Tempering System & Manuals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('masterworking')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'masterworking'
                ? 'border-[#111111] bg-[#111111] text-cyan-300'
                : 'border-[#dedede] bg-neutral-50 text-[#666666] hover:bg-neutral-100'
            }`}
          >
            <Zap size={12} />
            <span>Masterworking 12-Rank Progression</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('catalysts')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'catalysts'
                ? 'border-[#111111] bg-[#111111] text-purple-300'
                : 'border-[#dedede] bg-neutral-50 text-[#666666] hover:bg-neutral-100'
            }`}
          >
            <Award size={12} />
            <span>Catalyst Materials & Resets</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TEMPERING MANUALS */}
      {activeSection === 'tempering' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Affix Slots</span>
              <strong className="text-sm font-bold text-[#111111] block mt-1">2 Tempered Slots</strong>
              <span className="text-[11px] text-[#666666] block mt-1">
                Each structure can hold 1 Primary and 1 Secondary Tempered Affix.
              </span>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Durability System</span>
              <strong className="text-sm font-bold text-amber-700 block mt-1">5 Temper Rerolls</strong>
              <span className="text-[11px] text-[#666666] block mt-1">
                Structures start with 5 rolls. Refillable anytime via Naquadah Scrolls of Restoration.
              </span>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Greater Tempers</span>
              <strong className="text-sm font-bold text-purple-700 block mt-1">25% Greater Chance</strong>
              <span className="text-[11px] text-[#666666] block mt-1">
                Rolling a Greater Temper boosts the affix value to +35% to +60% maximum potential.
              </span>
            </div>
          </div>

          <div className="border border-[#dedede] bg-white p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Tempering Manuals Directory (5 Disciplines)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {TEMPERING_RECIPES.map((recipe) => (
                <div key={recipe.id} className="p-4 border border-[#e0e0e0] bg-neutral-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{recipe.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#111111]">{recipe.name}</h4>
                      <span className="text-[10px] text-amber-800 uppercase font-bold">{recipe.category}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#555555]">{recipe.description}</p>

                  <div className="pt-2 border-t border-[#eeeeee] space-y-1">
                    <span className="text-[10px] text-[#888888] font-bold block">Affix Roll Ranges:</span>
                    {recipe.possibleAffixes.map((affix) => (
                      <div key={affix.name} className="flex justify-between items-center text-[10px]">
                        <span>• {affix.name}:</span>
                        <div className="flex gap-2 font-mono">
                          <span className="text-[#111111]">Std: +{affix.minRoll}-{affix.maxRoll}%</span>
                          <span className="text-purple-700 font-bold">Great: +{affix.greaterMinRoll}-{affix.greaterMaxRoll}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MASTERWORKING RANKS */}
      {activeSection === 'masterworking' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Progression Limit</span>
              <strong className="text-sm font-bold text-[#111111] block mt-1">12 Total Ranks</strong>
              <span className="text-[11px] text-[#666666] block mt-1">
                Every rank grants an additive +5% to all base and tempered statistics (+60% at Rank 12).
              </span>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Critical Milestones</span>
              <strong className="text-sm font-bold text-cyan-800 block mt-1">Ranks 4, 8, & 12</strong>
              <span className="text-[11px] text-[#666666] block mt-1">
                Triggers a +25% Critical Strike to a random stat or affix. Triple crits can reach +75%!
              </span>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] uppercase font-bold block">Reset Foundry</span>
              <strong className="text-sm font-bold text-rose-800 block mt-1">Full Refund Option</strong>
              <span className="text-[11px] text-[#666666] block mt-1">
                Wipe Masterworking to Rank 0 at any time to re-roll crits, without losing tempered affixes.
              </span>
            </div>
          </div>

          {/* 12 Rank Costs Table */}
          <div className="border border-[#dedede] bg-white p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              12-Rank Masterworking Progression & Catalyst Costs
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#eeeeee]">
                <thead>
                  <tr className="bg-neutral-100 border-b border-[#dddddd] text-[10px] uppercase text-[#666666]">
                    <th className="p-2">Rank</th>
                    <th className="p-2">Bonus</th>
                    <th className="p-2">Milestone Crit</th>
                    <th className="p-2">Catalyst Required</th>
                    <th className="p-2 text-right">Metal</th>
                    <th className="p-2 text-right">Crystal</th>
                    <th className="p-2 text-right">Naquadah</th>
                    <th className="p-2 text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee]">
                  {MASTERWORK_RANKS.map((r) => {
                    const isMilestone = r.rank === 4 || r.rank === 8 || r.rank === 12;
                    return (
                      <tr
                        key={r.rank}
                        className={isMilestone ? 'bg-amber-50/40 font-bold' : 'hover:bg-neutral-50'}
                      >
                        <td className="p-2 font-mono">Rank {r.rank}</td>
                        <td className="p-2 font-mono text-emerald-700">+{r.rank * 5}% General</td>
                        <td className="p-2">
                          {isMilestone ? (
                            <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-900 border border-purple-300 font-mono">
                              ★ +25% CRITICAL STRIKE
                            </span>
                          ) : (
                            <span className="text-[#888888] font-mono text-[10px]">Standard +5%</span>
                          )}
                        </td>
                        <td className="p-2 font-mono text-cyan-900">
                          {r.catalystAmount}x {r.catalystName}
                        </td>
                        <td className="p-2 text-right text-[#555555]">{r.metal.toLocaleString()}</td>
                        <td className="p-2 text-right text-[#555555]">{r.crystal.toLocaleString()}</td>
                        <td className="p-2 text-right text-purple-700 font-bold">{r.naquadah.toLocaleString()}</td>
                        <td className="p-2 text-right text-amber-800">{r.credits.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CATALYST MATERIALS & RESETS */}
      {activeSection === 'catalysts' && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
            Quantum Catalysts & Structural Alchemy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-cyan-200 bg-cyan-50/30 space-y-2">
              <span className="text-[10px] text-cyan-800 uppercase font-bold">Tier 1 Catalyst (Ranks 1-4)</span>
              <h4 className="font-bold text-sm text-[#111111]">Obducite Nanites</h4>
              <p className="text-[11px] text-[#555555]">
                Microscopic sub-atomic assemblers harvested from planetary mining deep-cores. Reconfigures lattice
                foundations and activates Milestone 1 at Rank 4.
              </p>
            </div>

            <div className="p-4 border border-amber-200 bg-amber-50/30 space-y-2">
              <span className="text-[10px] text-amber-800 uppercase font-bold">Tier 2 Catalyst (Ranks 5-8)</span>
              <h4 className="font-bold text-sm text-[#111111]">Ingolith Crystals</h4>
              <p className="text-[11px] text-[#555555]">
                Compressed crystalline matter synthesized in Tokamak fusion generators. Hardens internal conduits and
                authorizes Milestone 2 at Rank 8.
              </p>
            </div>

            <div className="p-4 border border-purple-200 bg-purple-50/30 space-y-2">
              <span className="text-[10px] text-purple-800 uppercase font-bold">Tier 3 Catalyst (Ranks 9-12)</span>
              <h4 className="font-bold text-sm text-[#111111]">Neathiron Cores</h4>
              <p className="text-[11px] text-[#555555]">
                Rare super-dense isotopic cores extracted from ancient precursor monoliths. Unlocks Apex Milestone 3
                at Rank 12 for god-roll triple critical strikes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
