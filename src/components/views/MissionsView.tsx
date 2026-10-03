import React, { useState } from 'react';
import { Target, Trophy, Flame, Compass, CheckCircle2, Clock, Gift, ShieldAlert, Zap, ChevronRight, Sparkles } from 'lucide-react';
import { sound } from '../../sound';
import { PlayerProfile, PlayerResources } from '../../types';
import { DailyMissionsPanel } from './missions/DailyMissionsPanel';

interface MissionsViewProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
  onNavigate: (route: string) => void;
  defaultTab?: 'missions' | 'campaign' | 'events' | 'achievements';
}

interface CampaignMission {
  id: string;
  chapter: number;
  title: string;
  briefing: string;
  objective: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  rewardLabel: string;
  rewardMetal: number;
  rewardCrystal: number;
  rewardDeut: number;
  rewardXp: number;
}

interface GalacticEvent {
  id: string;
  title: string;
  type: 'bonus' | 'crisis' | 'anomaly';
  description: string;
  timeLeftMinutes: number;
  multiplierLabel: string;
  icon: string;
}

interface GameAchievement {
  id: string;
  category: 'Military' | 'Economy' | 'Science' | 'Stargate' | 'Empire';
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardTitle: string;
  rewardGlory: number;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  profile,
  resources,
  onUpdateResources,
  onUpdateProfile,
  onNavigate,
  defaultTab = 'missions',
}) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'campaign' | 'events' | 'achievements'>(defaultTab);

  const [campaignMissions, setCampaignMissions] = useState<CampaignMission[]>([
    {
      id: 'camp_1',
      chapter: 1,
      title: 'Echoes of the Ancients: Stargate Calibration',
      briefing: 'Subspace telemetry reveals a dormant Stargate network in Sector Alpha-9. Power up the dialing iris and establish connection.',
      objective: 'Accumulate 50,000 Naquadah & Build 10 Scouts',
      progress: 50000,
      maxProgress: 50000,
      isCompleted: true,
      rewardLabel: '+100,000 Metal, +50,000 Crystal, +500 Glory',
      rewardMetal: 100000,
      rewardCrystal: 50000,
      rewardDeut: 25000,
      rewardXp: 500,
    },
    {
      id: 'camp_2',
      chapter: 2,
      title: 'The System Lord Incursion',
      briefing: 'Lord Apophis has deployed Ha\'tak battlecruisers near the Dakara sanctuary. Prepare strike wings for orbital interception.',
      objective: 'Construct 25 Battleships or 150 Cruisers',
      progress: 18,
      maxProgress: 25,
      isCompleted: false,
      rewardLabel: '+250,000 Metal, +150,000 Deuterium, +1,200 Glory',
      rewardMetal: 250000,
      rewardCrystal: 100000,
      rewardDeut: 150000,
      rewardXp: 1200,
    },
    {
      id: 'camp_3',
      chapter: 3,
      title: 'Dyson Swarm Genesis',
      briefing: 'Initiate construction of solar collectors around the home star to achieve Type II civilization status.',
      objective: 'Begin Megastructure Stage 1',
      progress: 0,
      maxProgress: 1,
      isCompleted: false,
      rewardLabel: '+500,000 All Resources & Ancient Relic Weapon',
      rewardMetal: 500000,
      rewardCrystal: 500000,
      rewardDeut: 250000,
      rewardXp: 3000,
    },
  ]);

  const [activeEvents] = useState<GalacticEvent[]>([
    {
      id: 'event_happy_hour',
      title: '🌟 Stellar Alignment: Happy Hour 2x Production',
      type: 'bonus',
      description: 'Cosmic radiation surges boost all metal and crystal mine outputs by +100%.',
      timeLeftMinutes: 42,
      multiplierLabel: '2.0x Resource Yields',
      icon: '⚡',
    },
    {
      id: 'event_pirate_surge',
      title: '☠ Orion Cartel Incursion in Sector Gamma',
      type: 'crisis',
      description: 'Hostile pirate raiding fleets are ambushing lone cargo freighters. High combat bounties active.',
      timeLeftMinutes: 88,
      multiplierLabel: '+50% Debris Field Salvage',
      icon: '⚔',
    },
    {
      id: 'event_precursor_signal',
      title: '🔮 Precursor Signal Transmission',
      type: 'anomaly',
      description: 'Unidentified gravitational anomaly detected near black hole accretion disk.',
      timeLeftMinutes: 115,
      multiplierLabel: '+30% Research Science Pts',
      icon: '🌀',
    },
  ]);

  const [achievements, setAchievements] = useState<GameAchievement[]>([
    {
      id: 'ach_first_blood',
      category: 'Military',
      title: 'First Strike Commander',
      description: 'Successfully execute an orbital assault against a rival realm.',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rewardTitle: 'Vanguard',
      rewardGlory: 250,
    },
    {
      id: 'ach_billionaire',
      category: 'Economy',
      title: 'Galactic Tycoon',
      description: 'Accumulate over 1,000,000 naquadah in the imperial vault.',
      progress: Math.min(1000000, resources.bankedNaquadah),
      maxProgress: 1000000,
      unlocked: resources.bankedNaquadah >= 1000000,
      rewardTitle: 'Magnate',
      rewardGlory: 500,
    },
    {
      id: 'ach_armada_admiral',
      category: 'Military',
      title: 'Armada Grand Admiral',
      description: 'Build an armada of at least 500 combat warships.',
      progress: 320,
      maxProgress: 500,
      unlocked: false,
      rewardTitle: 'Fleet Marshal',
      rewardGlory: 1000,
    },
    {
      id: 'ach_stargate_master',
      category: 'Stargate',
      title: 'Master of the Ninth Chevron',
      description: 'Dial 10 different ancient Stargate coordinates across realms.',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      rewardTitle: 'Gatekeeper',
      rewardGlory: 750,
    },
    {
      id: 'ach_megastructure',
      category: 'Empire',
      title: 'Architect of the Cosmos',
      description: 'Complete at least one Megastructure project stage.',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rewardTitle: 'Grand Architect',
      rewardGlory: 1500,
    },
  ]);

  const handleClaimMission = (missionId: string) => {
    const m = campaignMissions.find((x) => x.id === missionId);
    if (!m || !m.isCompleted) return;
    sound.play('confirm');
    onUpdateResources({
      metal: resources.metal + m.rewardMetal,
      crystal: resources.crystal + m.rewardCrystal,
      deuterium: resources.deuterium + m.rewardDeut,
    });
    onUpdateProfile({
      glory: profile.glory + m.rewardXp,
    });
    alert(`Reward claimed! Received ${m.rewardLabel}`);
  };

  return (
    <div className="space-y-6" id="missions-root">
      {/* Header */}
      <div className="p-6 bg-white border border-[#dedede] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#777777] uppercase tracking-wider mb-1">
            <Target className="w-4 h-4 text-[#111111]" />
            <span>DAILY MISSIONS, CAMPAIGNS, EVENTS & ACHIEVEMENTS · DYNAMIC ACTIVITY REWARDS</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">Galactic Missions & Directives</h1>
          <p className="text-xs text-[#555555] mt-1">
            Execute daily sector directives for scaled dynamic resources and minor glory points, embark on story campaigns, and conquer galactic events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#fafafa] p-3 border border-[#dedede] text-right">
            <span className="text-[10px] font-mono text-[#777] uppercase block">Empire Glory</span>
            <strong className="text-base font-bold text-amber-600 font-mono">{profile.glory.toLocaleString()} XP</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#dedede] bg-white px-4 pt-2 gap-2 overflow-x-auto">
        <button
          id="tab-btn-missions"
          type="button"
          onClick={() => { sound.play('click'); setActiveTab('missions'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'missions' ? 'border-[#111111] text-[#111111] bg-neutral-50 font-black' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Missions (Daily & Dynamic Rewards)</span>
          <span className="px-1.5 py-0.2 bg-amber-400 text-black text-[9px] font-extrabold uppercase">
            New
          </span>
        </button>

        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveTab('campaign'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'campaign' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Story Campaign & Operations (Feature 28)
        </button>
        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveTab('events'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'events' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Active Galactic Events (Feature 29)
        </button>
        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveTab('achievements'); }}
          className={`px-4 py-2.5 text-xs font-bold uppercase transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'achievements' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'
          }`}
        >
          Achievement Ledger (Feature 30)
        </button>
      </div>

      {/* Tab: Daily Missions (Dynamic Activity Rewards) */}
      {activeTab === 'missions' && (
        <DailyMissionsPanel
          profile={profile}
          resources={resources}
          onUpdateResources={onUpdateResources}
          onUpdateProfile={onUpdateProfile}
          onNavigate={onNavigate}
        />
      )}

      {/* Tab: Story Campaign */}
      {activeTab === 'campaign' && (
        <div className="space-y-4">
          {campaignMissions.map((m) => (
            <div key={m.id} className="p-5 bg-white border border-[#dedede] flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-mono font-bold uppercase">
                    Chapter {m.chapter}
                  </span>
                  <h3 className="text-base font-bold text-[#111111]">{m.title}</h3>
                </div>
                <p className="text-xs text-[#555]">{m.briefing}</p>
                <div className="text-xs font-mono text-[#333]">
                  <strong>Objective:</strong> {m.objective}
                </div>
                <div className="w-full bg-[#eee] h-2 max-w-md">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${Math.min(100, (m.progress / m.maxProgress) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-[#777]">
                  Progress: {m.progress.toLocaleString()} / {m.maxProgress.toLocaleString()} ({Math.round((m.progress / m.maxProgress) * 100)}%)
                </span>
              </div>

              <div className="flex flex-col justify-center items-end gap-2 min-w-[220px]">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#777] uppercase block">Mission Rewards</span>
                  <strong className="text-xs text-emerald-700 font-bold block">{m.rewardLabel}</strong>
                </div>
                {m.isCompleted ? (
                  <button
                    onClick={() => handleClaimMission(m.id)}
                    className="w-full py-2 bg-emerald-600 text-white text-xs font-bold uppercase hover:bg-emerald-700 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" /> Claim Reward
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('shipyard')}
                    className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Go To Shipyard <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Galactic Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeEvents.map((evt) => (
            <div key={evt.id} className="p-5 bg-white border border-[#dedede] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{evt.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111]">{evt.title}</h3>
                    <span className="text-[10px] font-mono text-amber-600 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Ends in {evt.timeLeftMinutes} minutes
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#555] mb-3">{evt.description}</p>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-800 mb-4">
                  Active Bonus: {evt.multiplierLabel}
                </div>
              </div>
              <button
                onClick={() => onNavigate('universe')}
                className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333] cursor-pointer"
              >
                Scan Event Sector
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="p-6 bg-white border border-[#dedede] space-y-4">
            <h2 className="text-base font-bold text-[#111111]">Imperial Achievement Hall</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 border transition-colors ${
                    ach.unlocked ? 'border-emerald-500 bg-emerald-50/40' : 'border-[#dedede] bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-4 h-4 ${ach.unlocked ? 'text-amber-500' : 'text-[#888]'}`} />
                      <h3 className="text-xs font-bold text-[#111111]">{ach.title}</h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#777] uppercase">{ach.category}</span>
                  </div>
                  <p className="text-xs text-[#555] mb-2">{ach.description}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#eee]">
                    <span>Title: <strong className="text-[#111111] font-bold">«{ach.rewardTitle}»</strong></span>
                    <span className="text-amber-600 font-bold">+{ach.rewardGlory} Glory</span>
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
