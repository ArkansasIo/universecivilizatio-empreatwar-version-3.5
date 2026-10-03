import React, { useState } from 'react';
import { Shield, AlertTriangle, Crosshair, Award } from 'lucide-react';
import { sound } from '../../sound';
import { DefconLevel, PlayerProfile, PlayerResources } from '../../types';
import { RACES } from '../../gameData';

interface MilitaryScoresViewProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  onSetDefcon: (level: DefconLevel) => { success: boolean; message: string };
  strikePower: number;
  defensePower: number;
  covertRating: number;
}

export const MilitaryScoresView: React.FC<MilitaryScoresViewProps> = ({
  profile,
  resources,
  onSetDefcon,
  strikePower,
  defensePower,
  covertRating,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<DefconLevel>(profile.defconLevel);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentRace = RACES.find((r) => r.id === profile.race);

  const defconInfo = [
    { level: 0, name: 'DefCon 0: Peaceful Stance', cost: 0, income: '100%', protection: 'Baseline (1.0x)' },
    { level: 1, name: 'DefCon 1: Guarded Watch', cost: 5000, income: '90% (-10%)', protection: '+10% Covert Defense' },
    { level: 2, name: 'DefCon 2: Heightened Alert', cost: 10000, income: '80% (-20%)', protection: '+20% Covert Defense' },
    { level: 3, name: 'DefCon 3: High Readiness', cost: 15000, income: '60% (-40%)', protection: '+40% Covert Defense' },
    { level: 4, name: 'DefCon 4: Maximum War Alert', cost: 20000, income: '30% (-70%)', protection: '+70% Covert Defense' },
  ];

  const handleApplyDefcon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onSetDefcon(selectedLevel);
    if (res.success) {
      sound.play('confirm');
      setNotice({ type: 'success', text: res.message });
    } else {
      sound.play('warning');
      setNotice({ type: 'error', text: res.message });
    }
  };

  const overallScore = Math.round((strikePower + defensePower + covertRating * 10 + 175000) / 4);

  return (
    <div id="military-scores-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          STRATEGIC READINESS · FLEET & ARSENAL
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">Military Scores & DefCon</h2>
        <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
          Monitor your realm's offensive combat readiness, defensive fortification value, and covert
          security ratings. Adjust DefCon defense postures to safeguard against enemy spies.
        </p>
      </div>

      {notice && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center ${
            notice.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="font-bold ml-3">
            ✕
          </button>
        </div>
      )}

      {/* Military Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[#dedede] bg-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <Crosshair size={18} className="text-[#111111]" />
            <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
              Strike Power
            </span>
          </div>
          <strong className="block text-3xl font-mono font-bold text-[#111111] my-1">
            {strikePower.toLocaleString()}
          </strong>
          <small className="text-xs text-[#666666]">
            {resources.attackUnits.toLocaleString()} attack troops + weapons & race bonus
          </small>
        </div>

        <div className="border border-[#dedede] bg-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-[#111111]" />
            <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
              Defense Rating
            </span>
          </div>
          <strong className="block text-3xl font-mono font-bold text-[#111111] my-1">
            {defensePower.toLocaleString()}
          </strong>
          <small className="text-xs text-[#666666]">
            {resources.defenseUnits.toLocaleString()} defense troops + shield arrays
          </small>
        </div>

        <div className="border border-[#dedede] bg-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <Award size={18} className="text-[#111111]" />
            <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
              Covert Index
            </span>
          </div>
          <strong className="block text-3xl font-mono font-bold text-[#111111] my-1">
            {covertRating.toLocaleString()}
          </strong>
          <small className="text-xs text-[#666666]">
            {resources.spies.toLocaleString()} spies & {resources.antiSpies.toLocaleString()} counter-agents
          </small>
        </div>
      </div>

      {/* DefCon Alert System Form */}
      <div className="border border-[#dedede] bg-white p-6">
        <div className="border-b border-[#eeeeee] pb-4 mb-5">
          <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase">
            DEFCON DEFENSIVE POSTURE
          </div>
          <h3 className="text-base font-bold text-[#111111] mt-0.5">
            Current Alert Level: DefCon {profile.defconLevel}
          </h3>
          <p className="text-xs text-[#666666] mt-1">
            Raising DefCon heightens internal security scans and foils espionage attempts, but redirects
            civilians into military watch and reduces turn income.
          </p>
        </div>

        <form onSubmit={handleApplyDefcon} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {defconInfo.map((item) => (
              <label
                key={item.level}
                className={`border p-3.5 cursor-pointer transition-colors block text-xs ${
                  selectedLevel === item.level
                    ? 'border-[#111111] bg-[#f9f9f9]'
                    : 'border-[#dedede] hover:border-[#888888]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="radio"
                    name="defcon_choice"
                    value={item.level}
                    checked={selectedLevel === item.level}
                    onChange={() => setSelectedLevel(item.level as DefconLevel)}
                    className="accent-[#111111]"
                  />
                  <span className="font-mono text-[10px] text-[#888888]">
                    {item.cost > 0 ? `${item.cost.toLocaleString()} NQ` : 'Free'}
                  </span>
                </div>
                <strong className="block text-xs font-bold text-[#111111] mb-1">
                  {item.name.split(':')[0]}
                </strong>
                <span className="block text-[11px] text-[#666666]">{item.protection}</span>
                <span className="block text-[10px] text-[#888888] mt-1">Income: {item.income}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#666666]">
              Upgrade cost:{' '}
              <b className="font-mono text-[#111111]">
                {(selectedLevel * 5000).toLocaleString()} Naquadah
              </b>
            </span>
            <button
              type="submit"
              id="set-defcon-btn"
              className="px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
            >
              Update DefCon Status →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
