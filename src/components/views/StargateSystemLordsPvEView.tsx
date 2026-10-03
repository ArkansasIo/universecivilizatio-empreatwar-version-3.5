import React, { useState } from 'react';
import { 
  Crown, Swords, Shield, Skull, Flame, Sparkles, Zap, Award, 
  Radio, Target, Eye, RefreshCw, ChevronRight, CheckCircle2, AlertTriangle, 
  Database, Crosshair, Users, Globe 
} from 'lucide-react';
import { sound } from '../../sound';
import { STARGATE_SYSTEM_LORDS, SystemLordEntry } from '../../data/stargateSystemLordsData';
import { STARGATE_NPC_RACES } from '../../stargateNpcRacesData';
import { StargateNpcRace, PlayerProfile, PlayerResources } from '../../types';

interface StargateSystemLordsPvEViewProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  onUpdateResources: (updates: Partial<PlayerResources>) => void;
  onNavigate?: (route: string) => void;
}

interface BattleReport {
  id: string;
  opponentName: string;
  opponentTitle: string;
  victory: boolean;
  rounds: number;
  playerFleetDamagePercent: number;
  enemyFleetDamagePercent: number;
  lootNaquadah: number;
  lootTrinium: number;
  prestigeGained: number;
  combatLog: string[];
}

export const StargateSystemLordsPvEView: React.FC<StargateSystemLordsPvEViewProps> = ({
  profile,
  resources,
  onUpdateResources,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'system_lords' | 'pve_factions' | 'sarcophagus' | 'jaffa_rebellion'>('system_lords');
  const [selectedLord, setSelectedLord] = useState<SystemLordEntry>(STARGATE_SYSTEM_LORDS[0]);
  const PVE_ENEMY_IDS = [
    'npc_lucian_alliance',
    'npc_kull_warriors',
    'npc_aschen_confederation',
    'npc_genii_confederacy',
    'npc_urgo_entities',
    'npc_humanform_replicators',
    'npc_trust_rogue_nid',
    'npc_adria_ori_crusade',
    'npc_system_lord_council',
  ];

  const newEnemyFactions = STARGATE_NPC_RACES.filter((race) => PVE_ENEMY_IDS.includes(race.id));
  const [selectedFaction, setSelectedFaction] = useState<StargateNpcRace>(newEnemyFactions[0] || STARGATE_NPC_RACES[0]);
  const [isSimulatingBattle, setIsSimulatingBattle] = useState<boolean>(false);
  const [lastBattleReport, setLastBattleReport] = useState<BattleReport | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Sarcophagus Chamber State
  const [sarcophagusEnergy, setSarcophagusEnergy] = useState<number>(100);
  const [commanderHealthPercent, setCommanderHealthPercent] = useState<number>(65);

  // Jaffa Rebel Network State
  const [jaffaRebelLoyalty, setJaffaRebelLoyalty] = useState<number>(85);
  const [shieldSabotaged, setShieldSabotaged] = useState<boolean>(false);

  // Execute System Lord Battle
  const handleChallengeSystemLord = (lord: SystemLordEntry) => {
    sound.play('combat');
    setIsSimulatingBattle(true);
    setActionFeedback(`DIALING STARGATE TO ${lord.domainPlanet} [${lord.stargateAddress}]... Engaging ${lord.name}!`);

    setTimeout(() => {
      setIsSimulatingBattle(false);
      sound.play('success');

      // Calculate battle outcome based on player's stats vs Lord's fleet power
      const playerPower = ((profile.level || 1) * 10000) + (resources.naquadah > 100000 ? 300000 : 150000);
      const enemyPower = lord.fleetPower * (shieldSabotaged ? 0.6 : 1.0);
      const victory = playerPower >= enemyPower || Math.random() > 0.35;

      const naquadahReward = victory ? Math.round(lord.lootNaquadah * (shieldSabotaged ? 1.2 : 1.0)) : 50000;
      const triniumReward = victory ? Math.round(lord.lootTrinium * 0.8) : 25000;
      const prestige = victory ? 1200 : 200;

      if (victory) {
        onUpdateResources({
          naquadah: (resources.naquadah || 0) + naquadahReward,
          metal: (resources.metal || 0) + triniumReward,
        });
      }

      const report: BattleReport = {
        id: `battle_${Date.now()}`,
        opponentName: lord.name,
        opponentTitle: lord.title,
        victory,
        rounds: Math.floor(Math.random() * 4) + 3,
        playerFleetDamagePercent: victory ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 40) + 50,
        enemyFleetDamagePercent: victory ? 100 : Math.floor(Math.random() * 30) + 40,
        lootNaquadah: naquadahReward,
        lootTrinium: triniumReward,
        prestigeGained: prestige,
        combatLog: [
          `[Phase 1] Stargate vortex opened on ${lord.domainPlanet}. SGC Strike fleet jumped in alongside Jaffa Rebel Al'kesh bombers.`,
          shieldSabotaged 
            ? `[Phase 2] Jaffa Rebels successfully disabled ${lord.name}'s Ha'tak shield generators! Primary plasma cannons delivered direct hull impacts.` 
            : `[Phase 2] ${lord.name}'s ${lord.flagshipClass} brought shields to 100% and fired a full barrage of plasma bolts.`,
          `[Phase 3] ${lord.specialAbility} activated! Intense energy feedback registered across all sensor arrays.`,
          victory 
            ? `[VICTORY] ${lord.name}'s flagship was crippled! Imperial Jaffa retreated in disarray. Captured ${naquadahReward.toLocaleString()} Naquadah!`
            : `[TACTICAL RETREAT] ${lord.name}'s numerical superiority forced SGC forces back through the Stargate.`
        ],
      };

      setLastBattleReport(report);
      setShieldSabotaged(false); // Reset sabotage flag after battle
      setActionFeedback(victory ? `VICTORY! Defeated ${lord.name} at ${lord.domainPlanet}!` : `DEFEAT! ${lord.name} repelled your strike team.`);
    }, 1800);
  };

  // Execute Enemy Faction Battle
  const handleChallengeFaction = (faction: StargateNpcRace) => {
    sound.play('combat');
    setIsSimulatingBattle(true);
    setActionFeedback(`ENGAGING PVE RAID: ${faction.name} at ${faction.homeworld} [${faction.stargateAddress}]!`);

    setTimeout(() => {
      setIsSimulatingBattle(false);
      sound.play('success');

      const victory = Math.random() > 0.3;
      const naquadahReward = victory ? faction.resourceLoot.naquadah : 40000;
      const triniumReward = victory ? faction.resourceLoot.metalOrTrinium : 20000;

      if (victory) {
        onUpdateResources({
          naquadah: (resources.naquadah || 0) + naquadahReward,
          metal: (resources.metal || 0) + triniumReward,
        });
      }

      const report: BattleReport = {
        id: `battle_f_${Date.now()}`,
        opponentName: faction.name,
        opponentTitle: faction.designationOrTitle,
        victory,
        rounds: Math.floor(Math.random() * 5) + 2,
        playerFleetDamagePercent: victory ? 12 : 55,
        enemyFleetDamagePercent: victory ? 100 : 35,
        lootNaquadah: naquadahReward,
        lootTrinium: triniumReward,
        prestigeGained: victory ? 950 : 150,
        combatLog: [
          `[Phase 1] Entered Stargate orbit at ${faction.homeworld}. Detected ${faction.flagshipClass}.`,
          `[Phase 2] Enemy tactical trait: ${faction.tacticalTraits[0]}.`,
          victory 
            ? `[VICTORY] Eradicated ${faction.name} command node! Salvaged ${naquadahReward.toLocaleString()} Naquadah.` 
            : `[TACTICAL RETREAT] Heavy resistance from ${faction.factionLeader}'s defenders.`
        ]
      };

      setLastBattleReport(report);
      setActionFeedback(victory ? `PVE RAID SUCCESSFUL against ${faction.name}!` : `RAID FAILED against ${faction.name}.`);
    }, 1500);
  };

  // Demand Tribute
  const handleDemandTribute = (lord: SystemLordEntry) => {
    sound.play('click');
    if (resources.naquadah > 50000) {
      sound.play('success');
      const tribute = Math.round(lord.lootNaquadah * 0.25);
      onUpdateResources({ naquadah: (resources.naquadah || 0) + tribute });
      setActionFeedback(`TRIBUTE EXTRACTED! ${lord.name} reluctantly submitted ${tribute.toLocaleString()} Naquadah to prevent an all-out assault.`);
    } else {
      sound.play('warning');
      setActionFeedback(`TRIBUTE REFUSED! ${lord.name} laughed at your demand. "You lack the Naquadah reserves to intimidate the System Lords!"`);
    }
  };

  // Sarcophagus Healing
  const handleUseSarcophagus = () => {
    if (sarcophagusEnergy >= 25 && commanderHealthPercent < 100) {
      sound.play('research');
      setSarcophagusEnergy((prev) => Math.max(0, prev - 25));
      setCommanderHealthPercent(100);
      setActionFeedback('SARCOPHAGUS ACTIVATED! Sarcophagus sarcophagy rays restored Commander health and squad vitality to 100%!');
    } else if (commanderHealthPercent >= 100) {
      setActionFeedback('COMMANDER HEALTH FULL! No sarcophagus rejuvenation required.');
    } else {
      setActionFeedback('SARCOPHAGUS ENERGY DEPLETED! Re-charging sarcophagus Naquadah cells.');
    }
  };

  // Jaffa Rebellion Sabotage
  const handleInciteRebellion = () => {
    if (jaffaRebelLoyalty >= 30) {
      sound.play('confirm');
      setJaffaRebelLoyalty((prev) => Math.max(0, prev - 30));
      setShieldSabotaged(true);
      setActionFeedback(`JAFFA REBELLION INCITED! Teal'c and Bra'tac rebel cells planted explosive charges on ${selectedLord.name}'s Ha'tak shield generators! -40% Enemy Shield Power for next battle!`);
    } else {
      setActionFeedback('REBEL LOYALTY LOW! Wait for Teal\'c to rebuild Jaffa underground cells.');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 text-white font-sans max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-amber-500/40 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-400">
            <Crown className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
              Stargate System Lords & PvE Boss Crusade
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded font-mono">
                Canonical Lore 3.5
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Battle the Goa'uld System Lords, demand Naquadah tributes, utilize Sarcophagus technology, and lead PvE raids against 9 new Stargate Enemy NPC factions.
            </p>
          </div>
        </div>

        {/* Quick Resource & Health Readout */}
        <div className="flex items-center gap-3 bg-[#0a0f1d] border border-slate-800 p-3 rounded-lg font-mono text-xs shrink-0 relative z-10">
          <div className="text-center px-2 border-r border-slate-700">
            <span className="text-[10px] text-slate-400 block">SQUAD HEALTH</span>
            <span className="text-sm font-bold text-emerald-400">{commanderHealthPercent}%</span>
          </div>
          <div className="text-center px-2 border-r border-slate-700">
            <span className="text-[10px] text-slate-400 block">REBEL LOYALTY</span>
            <span className="text-sm font-bold text-cyan-400">{jaffaRebelLoyalty}%</span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] text-slate-400 block">SARCOPHAGUS</span>
            <span className="text-sm font-bold text-amber-400">{sarcophagusEnergy}%</span>
          </div>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="bg-[#0e1726] border border-cyan-500/40 p-3 rounded-lg text-xs font-mono text-cyan-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-slate-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('system_lords');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'system_lords'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-[#111827] text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-300" />
          <span>Goa'uld System Lords (Ra, Ba'al, Anubis)</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('pve_factions');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'pve_factions'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-[#111827] text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Swords className="w-4 h-4 text-red-300" />
          <span>9 New Stargate Enemy NPC Factions</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('sarcophagus');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'sarcophagus'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-[#111827] text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-emerald-300" />
          <span>Goa'uld Sarcophagus Rejuvenator</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setActiveTab('jaffa_rebellion');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'jaffa_rebellion'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'bg-[#111827] text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-300" />
          <span>Jaffa Rebellion Sabotage (Teal'c & Bra'tac)</span>
        </button>
      </div>

      {/* TAB 1: GOA'ULD SYSTEM LORDS */}
      {activeTab === 'system_lords' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: System Lords Roster (1 Col) */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              System Lords High Council
            </span>

            <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
              {STARGATE_SYSTEM_LORDS.map((lord) => {
                const isSelected = selectedLord.id === lord.id;
                return (
                  <button
                    key={lord.id}
                    onClick={() => {
                      sound.play('click');
                      setSelectedLord(lord);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1e293b] border-amber-500 shadow-xl'
                        : 'bg-[#0f172a] border-[#1e293b] hover:bg-[#162238]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lord.avatarEmoji}</span>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          {lord.name}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {lord.domainPlanet} • {lord.fleetPower.toLocaleString()} Power
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected System Lord War Room Dossier (2 Cols) */}
          <div className="lg:col-span-2 bg-[#0f172a] border border-amber-500/40 rounded-xl p-5 flex flex-col justify-between gap-5 shadow-2xl">
            <div>
              {/* Header Info */}
              <div className="border-b border-slate-800 pb-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl">{selectedLord.avatarEmoji}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {selectedLord.name}
                      </h2>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        {selectedLord.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#090d16] border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-mono text-amber-300">
                  Stargate Address: {selectedLord.stargateAddress}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-[#162238] border-l-4 border-amber-500 p-3 rounded text-xs font-serif italic text-amber-200 mb-4">
                "{selectedLord.quote}"
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs mb-4">
                <div className="bg-[#162238] p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">DOMAIN PLANET</span>
                  <span className="font-bold text-white">{selectedLord.domainPlanet}</span>
                </div>

                <div className="bg-[#162238] p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">FLAGSHIP CLASS</span>
                  <span className="font-bold text-cyan-300">{selectedLord.flagshipClass.split(' ')[0]}</span>
                </div>

                <div className="bg-[#162238] p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">JAFFA LEGION</span>
                  <span className="font-bold text-amber-400">{selectedLord.jaffaGuardType.split(' ')[0]}</span>
                </div>

                <div className="bg-[#162238] p-2.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">FLEET POWER</span>
                  <span className="font-bold text-red-400">{selectedLord.fleetPower.toLocaleString()}</span>
                </div>
              </div>

              {/* Special Ability */}
              <div className="bg-[#162238] p-3 rounded-lg border border-slate-800 flex flex-col gap-1 text-xs font-mono mb-4">
                <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Tactical Superweapon Ability:
                </span>
                <span className="text-slate-200">{selectedLord.specialAbility}</span>
              </div>
            </div>

            {/* Battle & Tribute Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-800 font-mono text-xs">
              <button
                disabled={isSimulatingBattle}
                onClick={() => handleChallengeSystemLord(selectedLord)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Swords className="w-4 h-4" />
                {isSimulatingBattle ? 'Engaging Fleet...' : `Engage ${selectedLord.name} in Battle`}
              </button>

              <button
                onClick={() => handleDemandTribute(selectedLord)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Demand Naquadah Tribute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 9 NEW STARGATE ENEMY NPC FACTIONS */}
      {activeTab === 'pve_factions' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              9 Canonical Enemy NPC Factions (PvE Raid Hub)
            </span>
            <span className="text-xs font-mono bg-red-950 text-red-300 px-2.5 py-0.5 rounded border border-red-800">
              SG-1 & Atlantis Lore Expanded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newEnemyFactions.map((faction) => (
              <div
                key={faction.id}
                className="bg-[#0f172a] border border-[#1e293b] hover:border-red-500/50 p-4 rounded-xl flex flex-col justify-between gap-3 transition shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{faction.avatarEmoji}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      Tier {faction.combatStats.technologicalTier}/10
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{faction.name}</h3>
                  <span className="text-xs text-red-400 font-mono block font-bold mb-1">
                    {faction.designationOrTitle}
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-3">
                    {faction.loreDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col gap-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Leader: {faction.factionLeader}</span>
                    <span className="text-amber-400 font-bold">{faction.fleetStrength.toLocaleString()} Pwr</span>
                  </div>

                  <button
                    disabled={isSimulatingBattle}
                    onClick={() => handleChallengeFaction(faction)}
                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <Crosshair className="w-4 h-4" />
                    Launch PvE Raid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOA'ULD SARCOPHAGUS REJUVENATOR */}
      {activeTab === 'sarcophagus' && (
        <div className="bg-[#0f172a] border border-emerald-500/40 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-400 shrink-0">
              <Flame className="w-12 h-12 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Goa'uld Sarcophagus Healing Chamber
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-1">
                Utilize ancient sarcophagus technology powered by Naquadah radiation to instantly restore wounded commanders, regenerate officer health, and cure toxic pathogens.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 bg-[#0a0f1d] p-5 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
            <div className="flex items-center justify-between w-48 text-slate-300">
              <span>Sarcophagus Energy:</span>
              <span className="font-bold text-emerald-400">{sarcophagusEnergy}%</span>
            </div>
            <div className="w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${sarcophagusEnergy}%` }} />
            </div>

            <button
              onClick={handleUseSarcophagus}
              className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              <RefreshCw className="w-4 h-4" />
              Rejuvenate Squad Health
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: JAFFA REBELLION SABOTAGE */}
      {activeTab === 'jaffa_rebellion' && (
        <div className="bg-[#0f172a] border border-cyan-500/40 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="p-5 bg-cyan-500/20 border border-cyan-500/50 rounded-2xl text-cyan-400 shrink-0">
              <Users className="w-12 h-12 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Jaffa Rebellion Sabotage Network (Teal'c & Master Bra'tac)
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-1">
                Incite free Jaffa rebellion cells to infiltrate System Lord Ha'tak motherships prior to battle. Successfully sabotaging shield generators reduces enemy defenses by 40%!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 bg-[#0a0f1d] p-5 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
            <div className="flex items-center justify-between w-48 text-slate-300">
              <span>Rebel Loyalty:</span>
              <span className="font-bold text-cyan-400">{jaffaRebelLoyalty}%</span>
            </div>
            <div className="w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${jaffaRebelLoyalty}%` }} />
            </div>

            <button
              onClick={handleInciteRebellion}
              className="w-full mt-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              <Zap className="w-4 h-4" />
              Sabotage System Lord Shields
            </button>
          </div>
        </div>
      )}

      {/* BATTLE REPORT MODAL */}
      {lastBattleReport && (
        <div className="bg-[#0f172a] border border-amber-500/50 rounded-xl p-5 font-mono text-xs flex flex-col gap-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-base text-white">COMBAT DEBRIEFING REPORT</span>
            </div>
            <span className={`font-bold px-3 py-1 rounded text-xs ${
              lastBattleReport.victory ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}>
              {lastBattleReport.victory ? 'VICTORY' : 'DEFEAT'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-300 bg-[#090d16] p-3 rounded-lg border border-slate-800">
            <div>Opponent: <span className="font-bold text-white">{lastBattleReport.opponentName}</span></div>
            <div>Rounds: <span className="font-bold text-cyan-400">{lastBattleReport.rounds}</span></div>
            <div>Naquadah Captured: <span className="font-bold text-amber-400">+{lastBattleReport.lootNaquadah.toLocaleString()}</span></div>
            <div>Trinium Captured: <span className="font-bold text-slate-200">+{lastBattleReport.lootTrinium.toLocaleString()}</span></div>
          </div>

          <div className="bg-[#050811] p-3 rounded-lg border border-slate-800 flex flex-col gap-1 text-slate-300">
            <span className="text-amber-400 font-bold uppercase">Tactical Engagement Log:</span>
            {lastBattleReport.combatLog.map((line, idx) => (
              <span key={idx} className="text-[11px] text-slate-300">{line}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
