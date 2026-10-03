import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Key,
  LogOut,
  Settings,
  Check,
  RefreshCw,
  Copy,
  AlertTriangle,
  FolderOpen,
  Sparkles,
  Download,
  Upload,
  Globe,
  Landmark,
  ShieldAlert,
  Lock,
  Mail,
  Bell,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sliders,
  Smartphone,
  CheckCircle2,
  Trash2,
  Zap,
  Users,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../../sound';
import { Government, PlayerProfile, Race } from '../../types';
import { GOVERNMENTS, RACES } from '../../gameData';
import {
  COMMANDER_AVATARS,
  COMMANDER_TITLES,
  INITIAL_PROFILE_SLOTS,
  INITIAL_CAREER_STATS,
} from '../../accountProfilesData';
import { DevelopmentCreditsView } from './DevelopmentCreditsView';

interface ProfileSystemViewProps {
  profile: PlayerProfile;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
  onChangeRace: (raceId: string) => { success: boolean; message: string };
  onChangeGovernment: (govId: string) => { success: boolean; message: string };
  onToggleVacation: () => { success: boolean; message: string };
  onAscend: () => { success: boolean; message: string };
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
  initialTab?: 'dossier' | 'slots' | 'heritage' | 'career' | 'security' | 'settings' | 'credits';
}

export const ProfileSystemView: React.FC<ProfileSystemViewProps> = ({
  profile,
  onUpdateProfile,
  onChangeRace,
  onChangeGovernment,
  onToggleVacation,
  onAscend,
  onLogout,
  onNavigate,
  initialTab,
}) => {
  // Navigation Sub-tabs for the Profile System
  const [activeTab, setActiveTab] = useState<'dossier' | 'slots' | 'heritage' | 'career' | 'security' | 'settings' | 'credits'>(
    initialTab || 'dossier'
  );

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Save Slots State
  const [profileSlots, setProfileSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('uc_state_commander_slots');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE_SLOTS;
    } catch {
      return INITIAL_PROFILE_SLOTS;
    }
  });

  // Career Stats State
  const [careerStats] = useState(() => {
    try {
      const saved = localStorage.getItem('uc_state_career_stats');
      return saved ? JSON.parse(saved) : INITIAL_CAREER_STATS;
    } catch {
      return INITIAL_CAREER_STATS;
    }
  });

  // Identity Form State
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarUrl || '👨‍✈️');
  const [selectedTitle, setSelectedTitle] = useState(profile.title || 'Fleet Commander');
  const [commanderName, setCommanderName] = useState(profile.name || profile.username || 'Commander Tanang');
  const [empireName, setEmpireName] = useState(profile.empireName || 'Terran Imperial Dominion');
  const [capitalName, setCapitalName] = useState(profile.capitalName || profile.planetName || 'Homeworld Earth');
  const [leaderTitle, setLeaderTitle] = useState(profile.leaderTitle || 'High Commander');
  const [originSector, setOriginSector] = useState(profile.originSector || 'Galaxy 1: Milky Way Core (01:104:04)');
  const [motto, setMotto] = useState(() => {
    return localStorage.getItem('uc_state_profile_motto') || 'Through the Event Horizon to Victory';
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Account Settings States
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const [accountEmail, setAccountEmail] = useState(() => {
    return profile.email || 'stephen@empire.stargate';
  });
  const [emailVerified, setEmailVerified] = useState(true);

  // Audio & Preferences Settings
  const [language, setLanguage] = useState('en');
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [ambientVolume, setAmbientVolume] = useState(80);
  const [chimeVolume, setChimeVolume] = useState(90);
  const [themeMode, setThemeMode] = useState<'obsidian' | 'slate' | 'emerald' | 'neon'>('obsidian');
  const [compactHud, setCompactHud] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [particleQuality, setParticleQuality] = useState<'high' | 'med' | 'low' | 'off'>('high');
  const [radarRefresh, setRadarRefresh] = useState<'5s' | '10s' | '30s' | 'manual'>('10s');

  // Notifications & Alerts
  const [alertAttackSirens, setAlertAttackSirens] = useState(true);
  const [alertEspionage, setAlertEspionage] = useState(true);
  const [alertCompletions, setAlertCompletions] = useState(true);
  const [alertTrade, setAlertTrade] = useState(false);
  const [alertEmailDigests, setAlertEmailDigests] = useState(true);

  // Privacy Controls
  const [combatLogVisibility, setCombatLogVisibility] = useState<'public' | 'alliance' | 'private'>('alliance');
  const [onlinePresence, setOnlinePresence] = useState<'online' | 'stealth'>('online');
  const [allowDms, setAllowDms] = useState<'all' | 'alliance' | 'none'>('all');

  // OAuth Account Connections
  const [linkedGoogle, setLinkedGoogle] = useState(true);
  const [linkedDiscord, setLinkedDiscord] = useState(true);
  const [linkedGithub, setLinkedGithub] = useState(true);
  const [linkedSteam, setLinkedSteam] = useState(false);

  // Wipe account modal
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipeConfirmInput, setWipeConfirmInput] = useState('');

  const showMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePasscodeChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasscode) {
      sound.play('warning');
      showMsg('Error: Please enter your current passcode.');
      return;
    }
    if (newPasscode.length < 6) {
      sound.play('warning');
      showMsg('Error: New passcode must be at least 6 characters long.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      sound.play('warning');
      showMsg('Error: New passcode and Confirmation do not match.');
      return;
    }

    sound.play('confirm');
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
    showMsg('Security Passcode updated successfully! Quantum encryption re-keyed.');
  };

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ email: accountEmail });
    sound.play('confirm');
    showMsg(`Subspace Contact Frequency updated to: ${accountEmail}`);
  };

  const handleSavePreferences = () => {
    sound.play('confirm');
    showMsg('Account Preferences & Display Settings saved successfully!');
  };

  const handleExecuteWipe = () => {
    if (wipeConfirmInput !== 'DELETE-EMPIRE') {
      sound.play('warning');
      showMsg('Error: Confirmation string must match "DELETE-EMPIRE" exactly.');
      return;
    }
    sound.play('warning');
    setShowWipeModal(false);
    localStorage.clear();
    showMsg('Empire state wiped! Re-initializing quantum core...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const currentRace = RACES.find((r) => r.id === profile.race);
  const currentGov = GOVERNMENTS.find((g) => g.id === profile.governmentId);

  // Save Profile Dossier Form
  const handleSaveDossier = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: commanderName,
      displayName: commanderName,
      username: commanderName,
      title: selectedTitle,
      avatarUrl: selectedAvatar,
      empireName,
      capitalName,
      leaderTitle,
      originSector,
      planetName: capitalName,
    });
    localStorage.setItem('uc_state_profile_motto', motto);
    sound.play('confirm');
    showMsg('Sovereign Profile credentials & insignia updated successfully!');
  };

  // Switch Save Slot
  const handleSwitchSlot = (slotId: string) => {
    const updated = profileSlots.map((s: any) => ({
      ...s,
      isActive: s.id === slotId,
    }));
    setProfileSlots(updated);
    localStorage.setItem('uc_state_commander_slots', JSON.stringify(updated));

    const active = updated.find((s: any) => s.id === slotId);
    if (active) {
      onUpdateProfile({
        name: active.commanderName,
        displayName: active.commanderName,
        username: active.commanderName,
        title: active.title,
        race: active.race,
        governmentId: active.governmentId,
        level: active.level,
        avatarUrl: active.avatarUrl,
      });
      setSelectedAvatar(active.avatarUrl);
      setSelectedTitle(active.title);
      setCommanderName(active.commanderName);
      sound.play('success');
      showMsg(`Loaded Save Profile Slot: ${active.commanderName} [${active.title}]!`);
    }
  };

  // Handle Race Change
  const handleSelectRace = (raceId: string) => {
    const res = onChangeRace(raceId);
    if (res.success) {
      sound.play('confirm');
      showMsg(res.message);
    } else {
      sound.play('warning');
      showMsg(res.message);
    }
  };

  // Handle Government Change
  const handleSelectGov = (govId: string) => {
    const res = onChangeGovernment(govId);
    if (res.success) {
      sound.play('confirm');
      showMsg(res.message);
    } else {
      sound.play('warning');
      showMsg(res.message);
    }
  };

  // Handle Vacation Mode
  const handleVacation = () => {
    const res = onToggleVacation();
    if (res.success) {
      sound.play('confirm');
      showMsg(res.message);
    }
  };

  // Handle Ascension
  const handleAscension = () => {
    const res = onAscend();
    if (res.success) {
      sound.play('success');
      showMsg(res.message);
    } else {
      sound.play('warning');
      showMsg(res.message);
    }
  };

  // Export Save State JSON
  const handleExportState = () => {
    const exportData = {
      profile,
      profileSlots,
      timestamp: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `universe_civilization_${profile.username}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sound.play('confirm');
    showMsg('Sovereign civilization backup successfully exported to disk.');
  };

  // Import Save State JSON
  const handleImportState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && parsed.profile) {
          onUpdateProfile(parsed.profile);
          if (parsed.profileSlots && Array.isArray(parsed.profileSlots)) {
            setProfileSlots(parsed.profileSlots);
            localStorage.setItem('uc_state_commander_slots', JSON.stringify(parsed.profileSlots));
          }
          sound.play('success');
          showMsg('Civilization backup successfully imported and restored!');
        } else {
          sound.play('warning');
          showMsg('Invalid backup file format: missing profile data.');
        }
      } catch {
        sound.play('warning');
        showMsg('Failed to parse JSON backup file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div id="profile-system-view" className="space-y-6">
      {/* 1. SOVEREIGN PROFILE HEADER */}
      <div className="border border-[#dedede] bg-white p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar, Sovereign Title & Identity */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#111111] bg-neutral-100 flex items-center justify-center text-3xl sm:text-4xl shadow-xs shrink-0">
              {profile.avatarUrl || '👨‍✈️'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase">
                  SOVEREIGN CITIZEN RECORD · REALM ID: UC-{profile.id?.slice(0, 8) || 'ALPHA-01'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold border border-amber-400 bg-amber-50 text-amber-800 uppercase">
                  {currentRace?.name || "Tau'ri"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#111111] mt-0.5 font-mono">
                {profile.displayName || profile.username}
              </h2>
              <div className="text-xs text-[#555555] font-mono mt-1 flex items-center gap-3">
                <span>Title: <strong className="text-[#111111]">{profile.title || 'Fleet Commander'}</strong></span>
                <span>•</span>
                <span>Constitution: <strong className="text-[#111111]">{currentGov?.name || 'Military Junta'}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Quick Realm Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-[#dedede] bg-[#fafafa] p-4 text-center sm:text-left">
            <div>
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Glory Rating</span>
              <strong className="text-lg font-bold font-mono text-[#111111]">
                {(profile.glory ?? 840).toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Reputation</span>
              <strong className="text-lg font-bold font-mono text-emerald-700">
                {(profile.reputation ?? 95).toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Status</span>
              <span className="text-xs font-mono font-bold text-emerald-600 block">
                {profile.vacationUntil ? 'Sanctuary Shield' : 'Active Realm'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 bg-[#111111] text-white text-xs font-mono flex items-center justify-between border-l-4 border-emerald-500 shadow-md">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button type="button" onClick={() => setNotification(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 2. NAVIGATION SUB-TABS */}
      <div className="flex border-b border-[#dedede] bg-white overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab('dossier')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'dossier'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <User size={14} />
          <span>Identity & Insignia</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'slots'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Users size={14} />
          <span>Multi-Account Profiles</span>
          <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 font-mono">
            {profileSlots.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('heritage')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'heritage'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Globe size={14} />
          <span>Civilization Heritage & Faction</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('career')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'career'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Award size={14} />
          <span>Lifetime Career Record</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'security'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Shield size={14} />
          <span>Security & Sanctuary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'settings'
              ? 'border-[#111111] text-[#111111] bg-neutral-50'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Settings size={14} />
          <span>Account Options & Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('credits')}
          className={`px-4 sm:px-6 py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'credits'
              ? 'border-[#111111] text-[#111111] bg-neutral-50 font-bold'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Award size={14} className="text-amber-500" />
          <span>🎬 Dev Credits</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IDENTITY & INSIGNIA */}
      {/* ========================================================================= */}
      {activeTab === 'dossier' && (
        <form onSubmit={handleSaveDossier} className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6 space-y-6">
            <h3 className="font-bold text-[#111111] text-base border-b border-[#eeeeee] pb-3">
              Player Identity Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Commander Call Sign / Display Name
                </label>
                <input
                  type="text"
                  value={commanderName}
                  onChange={(e) => setCommanderName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                  placeholder="Enter commander name..."
                  required
                />
              </div>

              {/* Title Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Sovereign Title
                </label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                >
                  {COMMANDER_TITLES.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Empire Designation */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Imperial Empire Designation
                </label>
                <input
                  type="text"
                  value={empireName}
                  onChange={(e) => setEmpireName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                  placeholder="e.g. Terran Imperial Dominion"
                  required
                />
              </div>

              {/* Capital Homeworld */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Capital Homeworld Name
                </label>
                <input
                  type="text"
                  value={capitalName}
                  onChange={(e) => setCapitalName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                  placeholder="e.g. Homeworld Earth"
                  required
                />
              </div>

              {/* Leader Honorific Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Leader Official Title / Honorific
                </label>
                <input
                  type="text"
                  value={leaderTitle}
                  onChange={(e) => setLeaderTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                  placeholder="e.g. High Commander"
                  required
                />
              </div>

              {/* Sector Coordinates */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Sector Coordinates & Deployment Quadrant
                </label>
                <input
                  type="text"
                  value={originSector}
                  onChange={(e) => setOriginSector(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm font-mono outline-hidden bg-[#fafafa]"
                  placeholder="e.g. Galaxy 1: Milky Way Core (01:104:04)"
                  required
                />
              </div>

              {/* Civilization Motto */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                  Empire Motto / Sovereign Manifesto
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#dedede] focus:border-[#111111] text-sm outline-hidden bg-[#fafafa]"
                  placeholder="Enter your empire's battle cry..."
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="pt-4 border-t border-[#eeeeee] space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#555555] block">
                Avatar Insignia Selection
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {COMMANDER_AVATARS.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.icon;
                  return (
                    <button
                      type="button"
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.icon)}
                      className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#111111] bg-neutral-100 ring-2 ring-[#111111]'
                          : 'border-[#dedede] bg-white hover:border-[#999999]'
                      }`}
                    >
                      <span className="text-3xl">{avatar.icon}</span>
                      <span className="text-[10px] font-bold text-[#111111] truncate w-full">
                        {avatar.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#eeeeee] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTI-ACCOUNT PROFILES & CHARACTER SLOTS */}
      {/* ========================================================================= */}
      {activeTab === 'slots' && (
        <div className="space-y-4">
          <div className="border border-[#dedede] bg-white p-4">
            <h3 className="font-bold text-[#111111] text-base">Multi-Account Profiles & Character Slots</h3>
            <p className="text-xs text-[#666666]">
              Switch seamlessly between alternate realm save slots, different races, and operational theaters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profileSlots.map((slot: any) => (
              <div
                key={slot.id}
                className={`border p-5 bg-white transition-all flex flex-col justify-between ${
                  slot.isActive ? 'border-[#111111] shadow-xs' : 'border-[#dedede]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-[#dedede] bg-neutral-100 flex items-center justify-center text-2xl">
                        {slot.avatarUrl}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
                          SLOT {slot.slotNumber} · {slot.race.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-sm text-[#111111]">{slot.commanderName}</h4>
                        <span className="text-[11px] text-[#555555]">{slot.title}</span>
                      </div>
                    </div>
                    {slot.isActive && (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white">
                        ACTIVE NOW
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-[#eeeeee] text-xs font-mono">
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">PLANETS</span>
                      <strong className="text-[#111111]">{slot.planetsCount} Worlds</strong>
                    </div>
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">FLEET SCORE</span>
                      <strong className="text-[#111111]">{slot.fleetScore.toLocaleString()}</strong>
                    </div>
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">LEVEL</span>
                      <strong className="text-[#111111]">Level {slot.level}</strong>
                    </div>
                    <div className="bg-[#fafafa] p-2 border border-[#eeeeee]">
                      <span className="text-[9px] text-[#888888] block">DARK MATTER</span>
                      <strong className="text-purple-700">{slot.darkMatter} DM</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchSlot(slot.id)}
                    disabled={slot.isActive}
                    className={`w-full py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      slot.isActive
                        ? 'bg-neutral-100 text-[#111111] border border-[#dedede] cursor-default'
                        : 'bg-[#111111] hover:bg-[#333333] text-white'
                    }`}
                  >
                    {slot.isActive ? 'Currently Active' : `Load Slot ${slot.slotNumber}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CIVILIZATION HERITAGE & FACTION */}
      {/* ========================================================================= */}
      {activeTab === 'heritage' && (
        <div className="space-y-6">
          {/* Race Selection */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div>
              <h3 className="font-bold text-[#111111] text-base">Civilization Species & Racial Heritage</h3>
              <p className="text-xs text-[#666666]">
                Your species defines unique racial economic, military, and defensive traits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RACES.map((race) => {
                const isSelected = profile.race === race.id;
                return (
                  <div
                    key={race.id}
                    className={`border p-4 bg-white transition-all flex flex-col justify-between ${
                      isSelected ? 'border-[#111111] ring-2 ring-[#111111]' : 'border-[#dedede]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-[#111111]">{race.name}</h4>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed mb-3">{race.description}</p>
                      <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 border border-emerald-200">
                        {race.bonusLabel}: +{race.bonusPercent}%
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eeeeee] mt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectRace(race.id)}
                        disabled={isSelected}
                        className={`w-full py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-[#111111] border border-[#dedede] cursor-default'
                            : 'bg-[#111111] hover:bg-[#333333] text-white'
                        }`}
                      >
                        {isSelected ? 'Active Species' : 'Adopt Heritage'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Government Selection */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div>
              <h3 className="font-bold text-[#111111] text-base">Supreme Government Constitution</h3>
              <p className="text-xs text-[#666666]">
                Establish the sovereign constitution governing your planetary systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GOVERNMENTS.map((gov) => {
                const isSelected = profile.governmentId === gov.id;
                return (
                  <div
                    key={gov.id}
                    className={`border p-4 bg-white transition-all flex flex-col justify-between ${
                      isSelected ? 'border-[#111111] ring-2 ring-[#111111]' : 'border-[#dedede]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{gov.icon || '🏛️'}</span>
                          <div>
                            <span className="text-[9px] font-bold uppercase text-[#888888] block">{gov.ideology || 'Government'}</span>
                            <h4 className="font-bold text-sm text-[#111111]">{gov.name}</h4>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-amber-400">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] leading-relaxed mb-2">{gov.description}</p>
                      {gov.specialPerk && (
                        <div className="p-2 bg-amber-50 border border-amber-200 text-[10px] text-amber-900 mb-2">
                          ⭐ <strong>Perk:</strong> {gov.specialPerk}
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-1 text-[10px] bg-neutral-50 p-1.5 border border-[#eee] text-center font-mono">
                        <span>Econ: <b>×{gov.economyModifier}</b></span>
                        <span>Labs: <b>×{gov.researchModifier}</b></span>
                        <span>Fleet: <b>×{gov.militaryModifier}</b></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eeeeee] mt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectGov(gov.id)}
                        disabled={isSelected}
                        className={`w-full py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-[#111111] border border-[#dedede] cursor-default'
                            : 'bg-[#111111] hover:bg-[#333333] text-white'
                        }`}
                      >
                        {isSelected ? 'Current Constitution' : 'Ratify Constitution'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LIFETIME CAREER RECORD */}
      {/* ========================================================================= */}
      {activeTab === 'career' && (
        <div className="space-y-4">
          <div className="border border-[#dedede] bg-white p-4">
            <h3 className="font-bold text-[#111111] text-base">Imperial Lifetime Galactic Record</h3>
            <p className="text-xs text-[#666666]">
              Comprehensive career metrics accumulated across all combat theaters, colonial expeditions, and galactic operations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Total Engagements</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.totalBattles}</strong>
              <small className="block text-[10px] text-[#888888]">Space & ground operations</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Combat Victories</span>
              <strong className="text-2xl font-bold font-mono text-emerald-700">{careerStats.victories}</strong>
              <small className="block text-[10px] text-emerald-600 font-bold">{careerStats.winRate}% Win Rate</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Naquadah Plundered</span>
              <strong className="text-2xl font-bold font-mono text-amber-700">
                {(careerStats.totalLootNaquadah / 1000000).toFixed(2)}M
              </strong>
              <small className="block text-[10px] text-[#888888]">From enemy vaults</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Stargates Dialed</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.stargatesDialed}</strong>
              <small className="block text-[10px] text-[#888888]">Wormhole traversals</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Worlds Colonized</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.planetsColonized}</strong>
              <small className="block text-[10px] text-[#888888]">Planetary domains</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Moons Discovered</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.moonsDiscovered}</strong>
              <small className="block text-[10px] text-[#888888]">Lunar phalanx bases</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Expeditions Completed</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">{careerStats.expeditionsCompleted}</strong>
              <small className="block text-[10px] text-[#888888]">Deep space missions</small>
            </div>
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] text-[#777777] font-bold uppercase block">Debris Recycled</span>
              <strong className="text-2xl font-bold font-mono text-[#111111]">
                {(careerStats.debrisRecycled / 1000).toLocaleString()}k
              </strong>
              <small className="block text-[10px] text-[#888888]">Raw salvage harvested</small>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SECURITY & SANCTUARY */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Vacation Mode Sanctuary */}
          <div className="border border-[#dedede] bg-white p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-[#111111] text-base">Sanctuary Shielding Protocol (Vacation Mode)</h3>
                <p className="text-xs text-[#666666] max-w-xl mt-1">
                  Protects all planetary colonies from incoming hostile raids and espionage probes. While sanctuary is active, production is paused.
                </p>
              </div>
              <button
                type="button"
                onClick={handleVacation}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  profile.vacationUntil
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-[#111111] text-white hover:bg-[#333333]'
                }`}
              >
                {profile.vacationUntil ? 'Deactivate Sanctuary' : 'Engage Sanctuary Mode'}
              </button>
            </div>
          </div>

          {/* Backup & Export */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-[#111111] text-base">Empire Backup & Data Management</h3>
            <p className="text-xs text-[#666666]">
              Export your civilization state and profile slots as a JSON file to transfer between devices, or restore a previous backup.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportState}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Export Civilization Backup (.json)</span>
              </button>

              <label className="flex items-center gap-2 px-4 py-2.5 border border-[#cccccc] bg-white text-[#111111] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer">
                <Upload size={14} />
                <span>Import Civilization Backup (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportState}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ACCOUNT OPTIONS & SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* 0. MULTI-ACCOUNT PROFILES & CHARACTER SLOTS IN ACCOUNT SETTINGS */}
          <div className="border border-[#dedede] bg-white p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#eeeeee] gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 border border-[#111111] bg-neutral-100 flex items-center justify-center shrink-0">
                  <Users size={18} className="text-[#111111]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] text-base">Multi-Account Profiles & Character Slots</h3>
                  <p className="text-xs text-[#666666]">
                    Manage and switch between alternate commander identities, save slots, and empire factions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.play('click');
                  setActiveTab('slots');
                }}
                className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs"
              >
                <span>Full Slot Matrix ({profileSlots.length})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Profile Slots Grid Inside Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileSlots.map((slot: any) => (
                <div
                  key={slot.id}
                  className={`border p-4 bg-white transition-all flex flex-col justify-between ${
                    slot.isActive
                      ? 'border-[#111111] ring-2 ring-[#111111] bg-neutral-50/50 shadow-xs'
                      : 'border-[#dedede] hover:border-[#999999]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 border border-[#dedede] bg-neutral-100 flex items-center justify-center text-xl shrink-0">
                          {slot.avatarUrl}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-[#777777] uppercase tracking-wider block font-mono">
                            SLOT {slot.slotNumber} · {slot.race?.toUpperCase() || "TAU'RI"}
                          </span>
                          <h4 className="font-bold text-sm text-[#111111] truncate">{slot.commanderName}</h4>
                          <span className="text-[10px] text-[#555555] block truncate">{slot.title}</span>
                        </div>
                      </div>
                      {slot.isActive ? (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white shrink-0 font-mono">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 shrink-0 font-mono">
                          Lv {slot.level}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 pt-2 border-t border-[#eeeeee] text-[11px] font-mono">
                      <div className="bg-[#fafafa] p-1.5 border border-[#eeeeee]">
                        <span className="text-[9px] text-[#888888] block">PLANETS</span>
                        <strong className="text-[#111111]">{slot.planetsCount} Worlds</strong>
                      </div>
                      <div className="bg-[#fafafa] p-1.5 border border-[#eeeeee]">
                        <span className="text-[9px] text-[#888888] block">FLEET SCORE</span>
                        <strong className="text-[#111111]">{slot.fleetScore.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchSlot(slot.id)}
                      disabled={slot.isActive}
                      className={`w-full py-1.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        slot.isActive
                          ? 'bg-neutral-200 text-[#777777] cursor-default'
                          : 'bg-[#111111] hover:bg-[#333333] text-white'
                      }`}
                    >
                      {slot.isActive ? '✓ Active Profile' : `Switch to Slot ${slot.slotNumber} →`}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Export/Import Profile Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#eeeeee] text-xs font-mono text-[#666666]">
              <span>Backup or transfer commander save slots to external devices:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportState}
                  className="px-3 py-1 bg-white hover:bg-neutral-100 border border-[#dedede] hover:border-[#111111] text-[#111111] font-semibold text-[11px] cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Download size={12} />
                  <span>Export Backup</span>
                </button>
                <label className="px-3 py-1 bg-white hover:bg-neutral-100 border border-[#dedede] hover:border-[#111111] text-[#111111] font-semibold text-[11px] cursor-pointer flex items-center gap-1 shadow-2xs">
                  <Upload size={12} />
                  <span>Import Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportState}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 1. PASSCODE & ACCOUNT CREDENTIALS */}
          <div className="border border-[#dedede] bg-white p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
              <Key size={18} className="text-[#111111]" />
              <h3 className="font-bold text-[#111111] text-base">Security Passcode & Access Credentials</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Change Passcode Form */}
              <form onSubmit={handlePasscodeChange} className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-[#111111] flex items-center gap-1.5">
                  <Lock size={14} /> Change Commander Passcode
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Current Passcode
                  </label>
                  <input
                    type="password"
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-[#dedede] p-2.5 text-xs font-mono focus:border-[#111111] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                      New Passcode
                    </label>
                    <input
                      type="password"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full border border-[#dedede] p-2.5 text-xs font-mono focus:border-[#111111] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                      Confirm Passcode
                    </label>
                    <input
                      type="password"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Re-enter passcode"
                      className="w-full border border-[#dedede] p-2.5 text-xs font-mono focus:border-[#111111] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePasscodeChange}
                  className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Update Security Passcode
                </button>
              </form>

              {/* Email & 2FA Settings */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase text-[#111111] flex items-center gap-1.5">
                  <Mail size={14} /> Subspace Frequency & Quantum 2FA
                </h4>

                <form onSubmit={handleEmailUpdate} className="space-y-3">
                  <label className="block text-[11px] font-bold text-[#555555] uppercase">
                    Contact Email Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      className="flex-1 border border-[#dedede] p-2.5 text-xs font-mono focus:border-[#111111] outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] cursor-pointer"
                    >
                      Save Email
                    </button>
                  </div>
                  {emailVerified && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-mono font-semibold">
                      <CheckCircle2 size={13} />
                      <span>Subspace Frequency Verified & Active</span>
                    </div>
                  )}
                </form>

                {/* 2FA Toggle */}
                <div className="pt-3 border-t border-[#eeeeee] flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-[#111111] uppercase">
                      Quantum Passkey 2FA
                    </strong>
                    <span className="text-[11px] text-[#777777]">
                      Requires secondary hardware key verification upon login
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      sound.play('click');
                      showMsg(`Quantum Passkey 2FA ${!twoFactorEnabled ? 'Enabled' : 'Disabled'}.`);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                      twoFactorEnabled ? 'bg-[#111111] text-white' : 'bg-[#eeeeee] text-[#666666]'
                    }`}
                  >
                    {twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {/* Linked Social & Identity Accounts */}
            <div className="pt-6 border-t border-[#eeeeee] space-y-4">
              <h4 className="text-xs font-bold uppercase text-[#111111] flex items-center gap-1.5">
                <Globe size={14} /> Linked External Identity Accounts
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Google */}
                <div className="p-3.5 border border-[#dedede] bg-[#fafafa] flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">Google Workspace</strong>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">Connected</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkedGoogle(!linkedGoogle);
                      sound.play('click');
                      showMsg(`Google Account ${!linkedGoogle ? 'Connected' : 'Disconnected'}.`);
                    }}
                    className={`text-[10px] font-bold uppercase px-2 py-1 cursor-pointer ${
                      linkedGoogle ? 'bg-[#111111] text-white' : 'border border-[#dedede] bg-white text-[#555555]'
                    }`}
                  >
                    {linkedGoogle ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* Discord */}
                <div className="p-3.5 border border-[#dedede] bg-[#fafafa] flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">Discord Stargate</strong>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">Connected</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkedDiscord(!linkedDiscord);
                      sound.play('click');
                      showMsg(`Discord ${!linkedDiscord ? 'Connected' : 'Disconnected'}.`);
                    }}
                    className={`text-[10px] font-bold uppercase px-2 py-1 cursor-pointer ${
                      linkedDiscord ? 'bg-[#111111] text-white' : 'border border-[#dedede] bg-white text-[#555555]'
                    }`}
                  >
                    {linkedDiscord ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* GitHub */}
                <div className="p-3.5 border border-[#dedede] bg-[#fafafa] flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">GitHub OAuth</strong>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">Linked</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkedGithub(!linkedGithub);
                      sound.play('click');
                      showMsg(`GitHub Account ${!linkedGithub ? 'Connected' : 'Disconnected'}.`);
                    }}
                    className={`text-[10px] font-bold uppercase px-2 py-1 cursor-pointer ${
                      linkedGithub ? 'bg-[#111111] text-white' : 'border border-[#dedede] bg-white text-[#555555]'
                    }`}
                  >
                    {linkedGithub ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* Steam */}
                <div className="p-3.5 border border-[#dedede] bg-[#fafafa] flex items-center justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-[#111111]">Steam Gaming Hub</strong>
                    <span className="text-[10px] text-[#888888] font-mono">Not Linked</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkedSteam(!linkedSteam);
                      sound.play('click');
                      showMsg(`Steam Account ${!linkedSteam ? 'Connected' : 'Disconnected'}.`);
                    }}
                    className={`text-[10px] font-bold uppercase px-2 py-1 cursor-pointer ${
                      linkedSteam ? 'bg-[#111111] text-white' : 'border border-[#dedede] bg-white text-[#555555]'
                    }`}
                  >
                    {linkedSteam ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AUDIO, PREFERENCES & DISPLAY OPTIONS */}
          <div className="border border-[#dedede] bg-white p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#111111]" />
                <h3 className="font-bold text-[#111111] text-base">Game Audio, Theme & Interface Options</h3>
              </div>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-4 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] cursor-pointer"
              >
                Save Preferences
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Language & Sound Sliders */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase text-[#111111] flex items-center gap-1.5">
                  <Volume2 size={14} /> Subspace Dialect & Audio FX Controls
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Galactic Subspace Language / Dialect
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-[#dedede] p-2.5 text-xs font-mono focus:border-[#111111] outline-none bg-white"
                  >
                    <option value="en">English (Terran Standard)</option>
                    <option value="lantean">Lantean (Ancient High Dialect)</option>
                    <option value="goauld">Goa'uld Imperial Runes</option>
                    <option value="fr">Français (Stargate France)</option>
                    <option value="de">Deutsch (Galaktischer Bund)</option>
                    <option value="es">Español (Dominio Estelar)</option>
                  </select>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-xs font-bold text-[#111111] uppercase">Master SFX Sound</strong>
                      <span className="text-[11px] text-[#777777]">Enable click chimes & weapon audio</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSfxEnabled(!sfxEnabled);
                        sound.play('click');
                      }}
                      className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                        sfxEnabled ? 'bg-[#111111] text-white' : 'bg-[#eeeeee] text-[#666666]'
                      }`}
                    >
                      {sfxEnabled ? 'Audio On' : 'Audio Muted'}
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase text-[#555555] mb-1">
                      <span>Ambient Cosmos Audio Volume</span>
                      <span className="font-mono">{ambientVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ambientVolume}
                      onChange={(e) => setAmbientVolume(Number(e.target.value))}
                      className="w-full accent-[#111111] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase text-[#555555] mb-1">
                      <span>Stargate Dialing Chime Volume</span>
                      <span className="font-mono">{chimeVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={chimeVolume}
                      onChange={(e) => setChimeVolume(Number(e.target.value))}
                      className="w-full accent-[#111111] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Theme & Canvas Settings */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase text-[#111111] flex items-center gap-1.5">
                  <Sparkles size={14} /> UI Theme Palette & Render Engine
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-2">
                    Terminal Visual Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setThemeMode('obsidian')}
                      className={`p-3 border text-left cursor-pointer transition-colors ${
                        themeMode === 'obsidian'
                          ? 'border-[#111111] bg-[#111111] text-white font-bold'
                          : 'border-[#dedede] bg-[#fafafa] text-[#333333] hover:border-[#111111]'
                      }`}
                    >
                      <strong className="block">Obsidian Dark</strong>
                      <small className="opacity-80 text-[10px]">High contrast terminal</small>
                    </button>

                    <button
                      type="button"
                      onClick={() => setThemeMode('slate')}
                      className={`p-3 border text-left cursor-pointer transition-colors ${
                        themeMode === 'slate'
                          ? 'border-[#111111] bg-[#111111] text-white font-bold'
                          : 'border-[#dedede] bg-[#fafafa] text-[#333333] hover:border-[#111111]'
                      }`}
                    >
                      <strong className="block">High Contrast Slate</strong>
                      <small className="opacity-80 text-[10px]">Clean white & black</small>
                    </button>

                    <button
                      type="button"
                      onClick={() => setThemeMode('emerald')}
                      className={`p-3 border text-left cursor-pointer transition-colors ${
                        themeMode === 'emerald'
                          ? 'border-emerald-700 bg-emerald-950 text-emerald-300 font-bold'
                          : 'border-[#dedede] bg-[#fafafa] text-[#333333] hover:border-[#111111]'
                      }`}
                    >
                      <strong className="block">Empire Emerald</strong>
                      <small className="opacity-80 text-[10px]">Retro sci-fi green</small>
                    </button>

                    <button
                      type="button"
                      onClick={() => setThemeMode('neon')}
                      className={`p-3 border text-left cursor-pointer transition-colors ${
                        themeMode === 'neon'
                          ? 'border-purple-600 bg-slate-950 text-purple-300 font-bold'
                          : 'border-[#dedede] bg-[#fafafa] text-[#333333] hover:border-[#111111]'
                      }`}
                    >
                      <strong className="block">Cyberpunk Neon</strong>
                      <small className="opacity-80 text-[10px]">Vibrant space glow</small>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-xs font-bold text-[#111111] uppercase">Compact HUD Top Bar</strong>
                      <span className="text-[11px] text-[#777777]">Minimize top resource counter size</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompactHud(!compactHud)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer ${
                        compactHud ? 'bg-[#111111] text-white' : 'bg-[#eeeeee] text-[#666666]'
                      }`}
                    >
                      {compactHud ? 'Compact' : 'Standard'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                        Particle Quality
                      </label>
                      <select
                        value={particleQuality}
                        onChange={(e: any) => setParticleQuality(e.target.value)}
                        className="w-full border border-[#dedede] p-2 text-xs font-mono bg-white outline-none"
                      >
                        <option value="high">Ultra High (60 FPS)</option>
                        <option value="med">Medium (30 FPS)</option>
                        <option value="low">Low FX</option>
                        <option value="off">Disabled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                        Galaxy Radar Refresh
                      </label>
                      <select
                        value={radarRefresh}
                        onChange={(e: any) => setRadarRefresh(e.target.value)}
                        className="w-full border border-[#dedede] p-2 text-xs font-mono bg-white outline-none"
                      >
                        <option value="5s">Fast (Every 5s)</option>
                        <option value="10s">Normal (Every 10s)</option>
                        <option value="30s">Slow (Every 30s)</option>
                        <option value="manual">Manual Refresh Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. NOTIFICATION SUBSCRIPTIONS & PRIVACY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Toggles */}
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
                <Bell size={18} className="text-[#111111]" />
                <h3 className="font-bold text-[#111111] text-base">Notification & Alert Subscriptions</h3>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 border border-[#dedede] bg-[#fafafa] cursor-pointer hover:bg-white">
                  <div>
                    <strong className="block text-[#111111]">Incoming Attack Alarm Siren</strong>
                    <span className="text-[11px] text-[#777777]">Play audio sirens when enemy fleets target planet</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertAttackSirens}
                    onChange={(e) => setAlertAttackSirens(e.target.checked)}
                    className="w-4 h-4 accent-[#111111] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-[#dedede] bg-[#fafafa] cursor-pointer hover:bg-white">
                  <div>
                    <strong className="block text-[#111111]">Espionage Probe Intrusion Warning</strong>
                    <span className="text-[11px] text-[#777777]">Notify when hostile probes scan your orbit</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertEspionage}
                    onChange={(e) => setAlertEspionage(e.target.checked)}
                    className="w-4 h-4 accent-[#111111] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-[#dedede] bg-[#fafafa] cursor-pointer hover:bg-white">
                  <div>
                    <strong className="block text-[#111111]">Shipyard & Research Queue Completion</strong>
                    <span className="text-[11px] text-[#777777]">Toast alert upon construction completion</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertCompletions}
                    onChange={(e) => setAlertCompletions(e.target.checked)}
                    className="w-4 h-4 accent-[#111111] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-[#dedede] bg-[#fafafa] cursor-pointer hover:bg-white">
                  <div>
                    <strong className="block text-[#111111]">Subspace Trade & Market Fulfillment</strong>
                    <span className="text-[11px] text-[#777777]">Alert when resource exchange orders fill</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertTrade}
                    onChange={(e) => setAlertTrade(e.target.checked)}
                    className="w-4 h-4 accent-[#111111] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Privacy & Visibility */}
            <div className="border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
                <ShieldAlert size={18} className="text-[#111111]" />
                <h3 className="font-bold text-[#111111] text-base">Privacy & Social Permissions</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Combat Log & Battle Visibility
                  </label>
                  <select
                    value={combatLogVisibility}
                    onChange={(e: any) => setCombatLogVisibility(e.target.value)}
                    className="w-full border border-[#dedede] p-2.5 text-xs font-mono bg-white outline-none"
                  >
                    <option value="public">Public to Entire Universe</option>
                    <option value="alliance">Alliance Members Only</option>
                    <option value="private">Private (Self Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Online Presence Status Broadcast
                  </label>
                  <select
                    value={onlinePresence}
                    onChange={(e: any) => setOnlinePresence(e.target.value)}
                    className="w-full border border-[#dedede] p-2.5 text-xs font-mono bg-white outline-none"
                  >
                    <option value="online">Broadcast Active Status (Visible)</option>
                    <option value="stealth">Covert Stealth Mode (Invisible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#555555] uppercase mb-1">
                    Direct Messages & Alliance Invites Filter
                  </label>
                  <select
                    value={allowDms}
                    onChange={(e: any) => setAllowDms(e.target.value)}
                    className="w-full border border-[#dedede] p-2.5 text-xs font-mono bg-white outline-none"
                  >
                    <option value="all">Allow Messages from All Commanders</option>
                    <option value="alliance">Allow Alliance Members Only</option>
                    <option value="none">Block All Direct Messages</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DANGER ZONE: ACCOUNT FACTORY WIPE */}
          <div className="border border-red-200 bg-red-50/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-red-900 uppercase flex items-center gap-2">
                  <Trash2 size={16} /> Danger Zone: Factory Reset & Empire State Wipe
                </h4>
                <p className="text-xs text-red-700 mt-1 max-w-2xl">
                  Permanently wipe all locally stored resources, planetary buildings, fleet armadas, and research tech trees.
                  This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWipeModal(true)}
                className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer shrink-0"
              >
                Wipe Empire State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: DEVELOPMENT TEAM CREDITS */}
      {/* ========================================================================= */}
      {activeTab === 'credits' && (
        <DevelopmentCreditsView onNavigate={onNavigate} />
      )}

      {/* Account Wipe Safety Modal */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-600 max-w-md w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider">
                Confirm Empire Factory Wipe
              </h3>
            </div>

            <p className="text-xs text-[#444444] leading-relaxed">
              You are about to completely reset <strong>{commanderName}</strong>! All planets, fleets, and storage silos will be wiped from local memory.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-red-800 uppercase mb-1">
                Type <span className="bg-red-100 text-red-900 px-1 py-0.5 font-bold">DELETE-EMPIRE</span> to confirm:
              </label>
              <input
                type="text"
                value={wipeConfirmInput}
                onChange={(e) => setWipeConfirmInput(e.target.value)}
                placeholder="DELETE-EMPIRE"
                className="w-full border border-red-300 p-2 text-xs font-mono uppercase focus:border-red-600 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#eeeeee]">
              <button
                type="button"
                onClick={() => setShowWipeModal(false)}
                className="px-4 py-2 text-xs font-bold uppercase border border-[#dedede] text-[#555555] hover:bg-[#f0f0f0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteWipe}
                className="px-5 py-2 text-xs font-bold uppercase bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Execute Wipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
