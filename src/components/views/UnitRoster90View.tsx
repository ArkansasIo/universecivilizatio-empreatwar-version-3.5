import React, { useState } from 'react';
import { Shield, Zap, Cpu, ArrowUpRight, CheckCircle2, Layers, Search } from 'lucide-react';
import { sound } from '../../sound';
import { UNITS_90_ROSTER, Unit90Definition } from '../../unitRoster90';
import { PlayerResources } from '../../types';

interface UnitRoster90ViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
}

export const UnitRoster90View: React.FC<UnitRoster90ViewProps> = ({
  resources,
  onUpdateResources,
}) => {
  const [units] = useState<Unit90Definition[]>(UNITS_90_ROSTER);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(units.map((u) => u.category)))];

  const filteredUnits = units.filter((u) => {
    const matchesCat = selectedCategory === 'All' || u.category === selectedCategory;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.subClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRecruit = (unit: Unit90Definition) => {
    if (
      resources.metal < unit.cost.metal ||
      resources.crystal < unit.cost.crystal ||
      resources.deuterium < unit.cost.deuterium
    ) {
      sound.play('warning');
      setFeedback(`Insufficient resources to recruit ${unit.name}.`);
      return;
    }

    sound.play('confirm');
    onUpdateResources({
      metal: resources.metal - unit.cost.metal,
      crystal: resources.crystal - unit.cost.crystal,
      deuterium: resources.deuterium - unit.cost.deuterium,
    });
    setFeedback(`Successfully recruited 1x ${unit.name} into your fleet roster!`);
  };

  return (
    <div id="unit-roster-90-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          MILITARY DOCTRINE · 90 CLASSES & SUB-CLASSES UNIT ROSTER
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">90-Class Unit & Fleet Roster Systems</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
          Command and construct from an extensive roster of 90 military, industrial, stealth, and precursor capital unit classifications with specialized combat stats.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-[#fafafa] border border-[#111111] border-l-4 text-xs font-semibold flex justify-between items-center">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="border border-[#dedede] bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.play('click');
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                selectedCategory === cat ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#fafafa] border-[#dedede] text-[#666666] hover:border-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <Search size={14} className="absolute left-3 top-3 text-[#777777]" />
          <input
            type="text"
            placeholder="Search 90 units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fafafa] border border-[#dedede] pl-9 pr-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((u) => (
          <div key={u.id} className="border border-[#dedede] bg-white p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#fafafa] border border-[#dedede] text-[#666666] uppercase">
                  {u.category}
                </span>
                <span className="font-mono text-xs font-bold text-[#111111]">
                  Tier {u.tier}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#111111]">{u.name}</h3>
              <span className="text-[11px] font-mono text-[#777777] block mt-0.5">{u.subClass}</span>
              <p className="text-xs text-[#666666] mt-2 leading-relaxed">{u.description}</p>

              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="bg-[#fafafa] p-2 border border-[#dedede]">
                  <span className="text-[9px] text-[#777777] block uppercase font-bold">Attack</span>
                  <strong className="text-rose-700 font-bold">{u.attack}</strong>
                </div>
                <div className="bg-[#fafafa] p-2 border border-[#dedede]">
                  <span className="text-[9px] text-[#777777] block uppercase font-bold">Defense</span>
                  <strong className="text-blue-700 font-bold">{u.defense}</strong>
                </div>
                <div className="bg-[#fafafa] p-2 border border-[#dedede]">
                  <span className="text-[9px] text-[#777777] block uppercase font-bold">Shield</span>
                  <strong className="text-amber-700 font-bold">{u.shield}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#eeeeee]">
              <div className="text-[11px] text-[#777777] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Metal:</span>
                  <strong className="text-[#111111]">{u.cost.metal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Crystal:</span>
                  <strong className="text-[#111111]">{u.cost.crystal.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Deuterium:</span>
                  <strong className="text-[#111111]">{u.cost.deuterium.toLocaleString()}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRecruit(u)}
                className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight size={14} />
                <span>Recruit Unit →</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
