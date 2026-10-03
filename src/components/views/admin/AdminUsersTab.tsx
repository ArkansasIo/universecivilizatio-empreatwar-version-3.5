import React, { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  DollarSign,
  Lock,
  Unlock,
  Ban,
  Clock,
  Sparkles,
  Zap,
  Globe,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  MessageSquareX,
  Swords,
  ShoppingBag,
  Eye,
  Crown,
  Settings2,
  CheckSquare,
  Square,
  Radio,
  Sliders,
  Award,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  AdminUserAccount,
  AdminUserRole,
  AdminUserStatus,
  OGameAccountPermissions,
} from '../../../types';

interface AdminUsersTabProps {
  users: AdminUserAccount[];
  onUpdateUser: (userId: string, updates: Partial<AdminUserAccount>) => void;
  onBanUserPrompt: (user: AdminUserAccount) => void;
}

const DEFAULT_ACCOUNT_PERMISSIONS: OGameAccountPermissions = {
  noobProtection: true,
  chatMuted: false,
  attackLock: false,
  tradeLock: false,
  multiAccountFlag: false,
  vacationMode: false,
  officerPrivileges: false,
  customBuildSpeedMult: 1.0,
  customStorageMult: 1.0,
  canBuildShips: true,
  canResearchTech: true,
  canSendExpeditions: true,
  canAccessMarket: true,
  canJoinAlliance: true,
  canBypassNoobProtection: false,
  canAccessStargate: true,
};

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateUser,
  onBanUserPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserAccount | null>(users[0] || null);
  const [editingResources, setEditingResources] = useState(false);
  const [editMetal, setEditMetal] = useState(0);
  const [editCrystal, setEditCrystal] = useState(0);
  const [editDeut, setEditDeut] = useState(0);
  const [editDarkMatter, setEditDarkMatter] = useState(0);
  const [editNaquadah, setEditNaquadah] = useState(0);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.homeCoords.includes(searchTerm) ||
      u.ipAddress.includes(searchTerm);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (u: AdminUserAccount) => {
    sound.play('click');
    setSelectedUser(u);
    setEditingResources(false);
  };

  const getEffectivePermissions = (u: AdminUserAccount): OGameAccountPermissions => {
    return u.accountPermissions
      ? { ...DEFAULT_ACCOUNT_PERMISSIONS, ...u.accountPermissions }
      : {
          ...DEFAULT_ACCOUNT_PERMISSIONS,
          noobProtection: u.role === 'player',
          officerPrivileges: u.role === 'administrator' || u.role === 'operator',
          canBypassNoobProtection: u.role === 'administrator' || u.role === 'operator',
        };
  };

  const handleToggleAccountPermissionFlag = (
    key: keyof OGameAccountPermissions,
    value: boolean | number
  ) => {
    if (!selectedUser) return;
    const currentPerms = getEffectivePermissions(selectedUser);
    const updatedPerms: OGameAccountPermissions = {
      ...currentPerms,
      [key]: value,
    };

    onUpdateUser(selectedUser.id, {
      accountPermissions: updatedPerms,
    });
    setSelectedUser({
      ...selectedUser,
      accountPermissions: updatedPerms,
    });
    sound.play('confirm');
  };

  const startEditResources = () => {
    if (!selectedUser) return;
    setEditMetal(selectedUser.metal);
    setEditCrystal(selectedUser.crystal);
    setEditDeut(selectedUser.deuterium);
    setEditDarkMatter(selectedUser.darkMatter);
    setEditNaquadah(selectedUser.naquadah);
    setEditingResources(true);
  };

  const saveEditResources = () => {
    if (!selectedUser) return;
    onUpdateUser(selectedUser.id, {
      metal: Number(editMetal),
      crystal: Number(editCrystal),
      deuterium: Number(editDeut),
      darkMatter: Number(editDarkMatter),
      naquadah: Number(editNaquadah),
    });
    setSelectedUser({
      ...selectedUser,
      metal: Number(editMetal),
      crystal: Number(editCrystal),
      deuterium: Number(editDeut),
      darkMatter: Number(editDarkMatter),
      naquadah: Number(editNaquadah),
    });
    setEditingResources(false);
    sound.play('confirm');
  };

  const handleRoleChange = (role: AdminUserRole) => {
    if (!selectedUser) return;
    const isStaff = role === 'administrator' || role === 'operator' || role === 'moderator';
    const currentPerms = getEffectivePermissions(selectedUser);
    const updatedPerms: OGameAccountPermissions = {
      ...currentPerms,
      officerPrivileges: isStaff ? true : currentPerms.officerPrivileges,
      canBypassNoobProtection: isStaff ? true : currentPerms.canBypassNoobProtection,
    };

    onUpdateUser(selectedUser.id, { role, accountPermissions: updatedPerms });
    setSelectedUser({ ...selectedUser, role, accountPermissions: updatedPerms });
    sound.play('confirm');
  };

  const handleToggleVacation = () => {
    if (!selectedUser) return;
    const newStatus: AdminUserStatus = selectedUser.status === 'vacation' ? 'active' : 'vacation';
    const currentPerms = getEffectivePermissions(selectedUser);
    const updatedPerms = { ...currentPerms, vacationMode: newStatus === 'vacation' };

    onUpdateUser(selectedUser.id, {
      status: newStatus,
      vacationUntil: newStatus === 'vacation' ? '2026-10-01T00:00:00Z' : null,
      accountPermissions: updatedPerms,
    });
    setSelectedUser({
      ...selectedUser,
      status: newStatus,
      vacationUntil: newStatus === 'vacation' ? '2026-10-01T00:00:00Z' : null,
      accountPermissions: updatedPerms,
    });
    sound.play('confirm');
  };

  const handleQuickGrant = (amount: number) => {
    if (!selectedUser) return;
    const updates = {
      metal: selectedUser.metal + amount,
      crystal: selectedUser.crystal + amount,
      deuterium: selectedUser.deuterium + Math.floor(amount / 2),
      darkMatter: selectedUser.darkMatter + 10000,
    };
    onUpdateUser(selectedUser.id, updates);
    setSelectedUser({ ...selectedUser, ...updates });
    sound.play('confirm');
  };

  const activePerms = selectedUser ? getEffectivePermissions(selectedUser) : DEFAULT_ACCOUNT_PERMISSIONS;

  return (
    <div id="admin-users-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-sky-400 text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              2Moons / OGame Account Core
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {users.length} Registered Universe Accounts
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Player Permissions & Account Inspector</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Configure OGame user permissions, administrative staff roles, newbie protection bypasses, vacation locks, chat mutes, fleet restrictions, and officer privileges.
          </p>
        </div>
      </div>

      {/* Main Grid: User List & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & User List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filters */}
          <div className="border border-[#dedede] bg-white p-3 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-[#888888]" />
              <input
                type="text"
                placeholder="Search username, email, IP, or coords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-mono border border-[#dedede] bg-[#fafafa] focus:border-[#111111] outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-1.5 text-xs font-mono border border-[#dedede] bg-[#fafafa]"
              >
                <option value="all">All Roles</option>
                <option value="player">Players</option>
                <option value="moderator">Moderators</option>
                <option value="operator">Game Operators</option>
                <option value="administrator">Super Admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 text-xs font-mono border border-[#dedede] bg-[#fafafa]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="vacation">Vacation</option>
                <option value="banned">Banned</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* User List */}
          <div className="border border-[#dedede] bg-white max-h-[600px] overflow-y-auto divide-y divide-[#eeeeee]">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#888888] font-mono">
                No player accounts found matching query.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                const p = getEffectivePermissions(u);
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#111111] text-white'
                        : 'hover:bg-[#f8f8f8] text-[#222222]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono">{u.username}</span>
                        {u.allianceTag && (
                          <span
                            className={`text-[10px] px-1 font-mono font-bold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-[#e5e5e5] text-[#444444]'
                            }`}
                          >
                            [{u.allianceTag}]
                          </span>
                        )}
                        <span
                          className={`text-[9px] px-1 py-0.2 font-mono font-bold uppercase ${
                            u.role === 'administrator'
                              ? 'bg-amber-500 text-[#111111]'
                              : u.role === 'operator'
                              ? 'bg-sky-500 text-white'
                              : u.role === 'moderator'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-700 text-zinc-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono opacity-70 mt-0.5 flex items-center gap-2">
                        <span>{u.homeCoords}</span>
                        <span>•</span>
                        <span>{u.rankPoints.toLocaleString()} pts</span>
                      </div>

                      {/* Permission Badges Summary */}
                      <div className="flex items-center gap-1.5 mt-1">
                        {p.chatMuted && (
                          <span className="text-[8px] bg-red-500/20 text-red-300 px-1 font-mono uppercase">
                            Muted
                          </span>
                        )}
                        {p.attackLock && (
                          <span className="text-[8px] bg-orange-500/20 text-orange-300 px-1 font-mono uppercase">
                            FleetLock
                          </span>
                        )}
                        {p.tradeLock && (
                          <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1 font-mono uppercase">
                            TradeLock
                          </span>
                        )}
                        {p.multiAccountFlag && (
                          <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 font-mono uppercase">
                            IP Watch
                          </span>
                        )}
                        {p.officerPrivileges && (
                          <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 font-mono uppercase">
                            Officer
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 uppercase ${
                          u.status === 'banned'
                            ? 'bg-red-600 text-white'
                            : u.status === 'vacation'
                            ? 'bg-blue-600 text-white'
                            : u.status === 'inactive'
                            ? 'bg-zinc-500 text-white'
                            : isSelected
                            ? 'text-emerald-400'
                            : 'text-emerald-600'
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: User Inspector & Permissions Matrix (7 cols) */}
        <div className="lg:col-span-7">
          {selectedUser ? (
            <div className="border border-[#dedede] bg-white p-5 space-y-6">
              {/* User Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#eeeeee] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold font-mono text-[#111111]">
                      {selectedUser.username}
                    </h4>
                    {selectedUser.allianceTag && (
                      <span className="px-2 py-0.5 bg-[#111111] text-white text-xs font-mono font-bold">
                        [{selectedUser.allianceTag}]
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-[#777777] mt-0.5">
                    User ID: {selectedUser.id} • Registered:{' '}
                    {new Date(selectedUser.registeredAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleVacation}
                    className={`px-3 py-1.5 text-xs font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                      selectedUser.status === 'vacation'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-[#333333] border-[#cccccc] hover:bg-[#f0f0f0]'
                    }`}
                  >
                    <Shield size={13} />
                    <span>{selectedUser.status === 'vacation' ? 'End Vacation' : 'Force Vacation'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBanUserPrompt(selectedUser)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Ban size={13} />
                    <span>Disciplinary Action</span>
                  </button>
                </div>
              </div>

              {/* IP & Account Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fafafa] p-3 border border-[#eeeeee]">
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">IP Address</div>
                  <div className="text-xs font-mono font-bold text-[#111111] flex items-center gap-1">
                    <Globe size={11} className="text-[#888888]" />
                    <span>{selectedUser.ipAddress}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Home Coords</div>
                  <div className="text-xs font-mono font-bold text-sky-700">
                    {selectedUser.homeCoords}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Colonies</div>
                  <div className="text-xs font-mono font-bold text-indigo-700">
                    {selectedUser.planetsCount} Planets
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-[#888888]">Fleet Units</div>
                  <div className="text-xs font-mono font-bold text-red-700">
                    {selectedUser.fleetUnits.toLocaleString()} Ships
                  </div>
                </div>
              </div>

              {/* Role & Staff Level Setter */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#444444] uppercase tracking-wider block flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-500" />
                  <span>Assign Administrative Staff Role (OGame Rank)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['player', 'moderator', 'operator', 'administrator'] as AdminUserRole[]).map(
                    (role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`py-2 px-3 text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                          selectedUser.role === role
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-[#444444] border-[#dedede] hover:bg-[#f4f4f4]'
                        }`}
                      >
                        {role}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* SECTION: OGAME USER PERMISSIONS & ACCOUNT PRIVILEGES */}
              <div className="p-4 border border-sky-300/80 bg-sky-50/30 space-y-4">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <div>
                    <h5 className="text-xs font-extrabold font-mono text-sky-900 uppercase flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-sky-700" />
                      <span>OGame Account Permissions & Restrictions</span>
                    </h5>
                    <p className="text-[10px] font-mono text-sky-700 mt-0.5">
                      Toggle specific game privileges, disciplinary locks, protection flags, and feature restrictions.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-700 text-white text-[9px] font-bold uppercase font-mono">
                    User ID: {selectedUser.id}
                  </span>
                </div>

                {/* Account Security & Disciplinary Flags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider block">
                    Account Status & Protection Toggles
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Noob Protection */}
                    <div
                      onClick={() =>
                        handleToggleAccountPermissionFlag(
                          'noobProtection',
                          !activePerms.noobProtection
                        )
                      }
                      className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span>Newbie Protection Flag</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Protects player from high-rank fleet attacks
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          activePerms.noobProtection
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {activePerms.noobProtection ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>

                    {/* Chat Muted */}
                    <div
                      onClick={() =>
                        handleToggleAccountPermissionFlag('chatMuted', !activePerms.chatMuted)
                      }
                      className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MessageSquareX className="w-3.5 h-3.5 text-red-600" />
                          <span>Global Chat Mute</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Silence player from Universe Chat
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          activePerms.chatMuted
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {activePerms.chatMuted ? 'MUTED' : 'CLEAR'}
                      </span>
                    </div>

                    {/* Attack Lock */}
                    <div
                      onClick={() =>
                        handleToggleAccountPermissionFlag('attackLock', !activePerms.attackLock)
                      }
                      className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Swords className="w-3.5 h-3.5 text-orange-600" />
                          <span>Fleet Mission Attack Lock</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Blocks launching hostile fleet missions
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          activePerms.attackLock
                            ? 'bg-orange-100 text-orange-800 border border-orange-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {activePerms.attackLock ? 'LOCKED' : 'ALLOWED'}
                      </span>
                    </div>

                    {/* Trade Lock */}
                    <div
                      onClick={() =>
                        handleToggleAccountPermissionFlag('tradeLock', !activePerms.tradeLock)
                      }
                      className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                          <span>Market & Trade Lock</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Blocks trading & alliance bank transfers
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          activePerms.tradeLock
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {activePerms.tradeLock ? 'LOCKED' : 'ALLOWED'}
                      </span>
                    </div>

                    {/* Multi-Account IP Flag */}
                    <div
                      onClick={() =>
                        handleToggleAccountPermissionFlag(
                          'multiAccountFlag',
                          !activePerms.multiAccountFlag
                        )
                      }
                      className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                          <span>Multi-Account IP Watch Flag</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Marks account under IP match investigation
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          activePerms.multiAccountFlag
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {activePerms.multiAccountFlag ? 'FLAGGED' : 'NORMAL'}
                      </span>
                    </div>

                    {/* Staff Officer Privileges */}
                    <div
                      onClick={() =>
                        handleToggleAccountPermissionFlag(
                          'officerPrivileges',
                          !activePerms.officerPrivileges
                        )
                      }
                      className="p-2.5 bg-white border border-slate-200 hover:border-sky-400 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Staff Officer Pass</span>
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Grants Commander & Geologist Perks
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          activePerms.officerPrivileges
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {activePerms.officerPrivileges ? 'GRANTED' : 'STANDARD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Granular Game Feature Access Matrix */}
                <div className="space-y-2 pt-2 border-t border-sky-200/60">
                  <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider block">
                    Granular Feature Access Permissions
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'canBuildShips', label: 'Shipyard Building' },
                      { key: 'canResearchTech', label: 'Research Lab' },
                      { key: 'canSendExpeditions', label: 'Deep Space Expedition' },
                      { key: 'canAccessMarket', label: 'Market & Trade' },
                      { key: 'canJoinAlliance', label: 'Alliance System' },
                      { key: 'canBypassNoobProtection', label: 'Noob Bypass' },
                      { key: 'canAccessStargate', label: 'Stargate Jump Network' },
                    ].map((item) => {
                      const permKey = item.key as keyof OGameAccountPermissions;
                      const isAllowed = Boolean(activePerms[permKey]);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleToggleAccountPermissionFlag(permKey, !isAllowed)}
                          className={`p-2 text-left font-mono border transition-all cursor-pointer ${
                            isAllowed
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-red-50 border-red-200 text-red-900'
                          }`}
                        >
                          <div className="text-[10px] font-bold flex items-center justify-between">
                            <span>{item.label}</span>
                            {isAllowed ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-[8px] uppercase font-bold text-slate-500 mt-0.5 block">
                            {isAllowed ? 'ALLOWED' : 'RESTRICTED'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Multiplier Boosters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-sky-200/60">
                  <div className="p-2.5 bg-white border border-slate-200 space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center justify-between">
                      <span>Custom Build Speed Multiplier</span>
                      <span className="text-sky-700">{activePerms.customBuildSpeedMult || 1.0}x</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="10.0"
                      step="0.5"
                      value={activePerms.customBuildSpeedMult || 1.0}
                      onChange={(e) =>
                        handleToggleAccountPermissionFlag(
                          'customBuildSpeedMult',
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center justify-between">
                      <span>Custom Storage Capacity Multiplier</span>
                      <span className="text-amber-700">{activePerms.customStorageMult || 1.0}x</span>
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="50.0"
                      step="1.0"
                      value={activePerms.customStorageMult || 1.0}
                      onChange={(e) =>
                        handleToggleAccountPermissionFlag(
                          'customStorageMult',
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Resource Balances & Live Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-[#444444] uppercase tracking-wider">
                    Planetary & Empire Balances
                  </label>
                  {!editingResources ? (
                    <button
                      type="button"
                      onClick={startEditResources}
                      className="text-xs font-mono font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit size={13} />
                      <span>Edit Balances</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={saveEditResources}
                        className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={13} />
                        <span>Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingResources(false)}
                        className="px-2.5 py-1 bg-[#eeeeee] text-[#333333] text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <X size={13} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {!editingResources ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                        Metal
                      </div>
                      <div className="text-sm font-mono font-bold text-[#111111]">
                        {selectedUser.metal.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                        Crystal
                      </div>
                      <div className="text-sm font-mono font-bold text-sky-700">
                        {selectedUser.crystal.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                        Deuterium
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-700">
                        {selectedUser.deuterium.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                        Dark Matter
                      </div>
                      <div className="text-sm font-mono font-bold text-purple-700">
                        {selectedUser.darkMatter.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                        Naquadah
                      </div>
                      <div className="text-sm font-mono font-bold text-amber-700">
                        {selectedUser.naquadah.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 border border-[#dedede] bg-[#fafafa]">
                      <div className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                        Rank Points
                      </div>
                      <div className="text-sm font-mono font-bold text-zinc-800">
                        {selectedUser.rankPoints.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-amber-50/50 border border-amber-300">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-[#555555]">Metal</label>
                      <input
                        type="number"
                        value={editMetal}
                        onChange={(e) => setEditMetal(Number(e.target.value))}
                        className="w-full p-1.5 border border-[#cccccc] bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-[#555555]">Crystal</label>
                      <input
                        type="number"
                        value={editCrystal}
                        onChange={(e) => setEditCrystal(Number(e.target.value))}
                        className="w-full p-1.5 border border-[#cccccc] bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-[#555555]">Deuterium</label>
                      <input
                        type="number"
                        value={editDeut}
                        onChange={(e) => setEditDeut(Number(e.target.value))}
                        className="w-full p-1.5 border border-[#cccccc] bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-[#555555]">Dark Matter</label>
                      <input
                        type="number"
                        value={editDarkMatter}
                        onChange={(e) => setEditDarkMatter(Number(e.target.value))}
                        className="w-full p-1.5 border border-[#cccccc] bg-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-[#555555]">Naquadah</label>
                      <input
                        type="number"
                        value={editNaquadah}
                        onChange={(e) => setEditNaquadah(Number(e.target.value))}
                        className="w-full p-1.5 border border-[#cccccc] bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Click Fast Injections */}
              <div className="space-y-2 pt-2 border-t border-[#eeeeee]">
                <label className="text-xs font-mono font-bold text-[#444444] uppercase tracking-wider block">
                  1-Click Direct Account Grants
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickGrant(1000000)}
                    className="px-3 py-1.5 bg-[#f0f0f0] hover:bg-[#111111] hover:text-white text-[#222222] text-xs font-mono font-bold border border-[#cccccc] transition-colors cursor-pointer"
                  >
                    +1M Res & 10k DM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickGrant(10000000)}
                    className="px-3 py-1.5 bg-[#f0f0f0] hover:bg-amber-500 hover:text-[#111111] text-[#222222] text-xs font-mono font-bold border border-[#cccccc] transition-colors cursor-pointer"
                  >
                    +10M Res & 10k DM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickGrant(50000000)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#111111] text-xs font-mono font-extrabold transition-colors cursor-pointer"
                  >
                    +50M Mega Injection
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-[#dedede] bg-white p-12 text-center text-xs text-[#888888] font-mono">
              Select a player account from the list to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
