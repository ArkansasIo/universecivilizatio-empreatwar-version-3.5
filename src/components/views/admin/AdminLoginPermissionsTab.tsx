import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  User,
  CheckCircle2,
  X,
  Copy,
  Check,
  Plus,
  RefreshCw,
  LogOut,
  Sliders,
  Fingerprint,
  Link,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import {
  CANONICAL_ADMIN_ACCOUNTS,
  getAllAdminAccounts,
  getAllRootAdminAccounts,
  saveCustomAdminAccount,
  createRootAdminAccount,
  generateAdminUrlLogin,
  ADMIN_PERMISSIONS_REGISTRY,
  getAdminAuthSession,
  setAdminAuthSession,
  clearAdminAuthSession,
  validateAdminCredentials,
} from '../../../config/adminAuthConfig';
import { AdminAuthSession, AdminCredentialAccount, AdminPermission, AdminUserRole } from '../../../types';
import { RootAdminUrlLoginModal } from '../../modals/RootAdminUrlLoginModal';
import { sound } from '../../../sound';

interface AdminLoginPermissionsTabProps {
  currentSession: AdminAuthSession;
  onUpdateSession: (session: AdminAuthSession) => void;
}

export const AdminLoginPermissionsTab: React.FC<AdminLoginPermissionsTabProps> = ({
  currentSession,
  onUpdateSession,
}) => {
  const [adminAccountsList, setAdminAccountsList] = useState<AdminCredentialAccount[]>(
    getAllAdminAccounts()
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAccForDetail, setSelectedAccForDetail] = useState<AdminCredentialAccount>(
    CANONICAL_ADMIN_ACCOUNTS[0]
  );

  // New Custom Admin Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newLoginCode, setNewLoginCode] = useState<string>('');
  const [newPasscode, setNewPasscode] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [newRole, setNewRole] = useState<AdminUserRole>('operator');
  const [newPermissions, setNewPermissions] = useState<AdminPermission[]>([
    'GRANT_RESOURCES',
    'BAN_PLAYERS',
    'MODERATE_TICKETS',
  ]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sound.play('confirm');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQuickLoginAs = (acc: AdminCredentialAccount) => {
    sound.play('confirm');
    const clearanceLevel =
      acc.role === 'super_admin'
        ? 5
        : acc.role === 'administrator'
        ? 4
        : acc.role === 'operator'
        ? 3
        : 2;

    const newSess: AdminAuthSession = {
      isAuthenticated: true,
      activeAdmin: acc,
      authenticatedAt: new Date().toISOString(),
      securityClearanceLevel: clearanceLevel,
    };
    setAdminAuthSession(newSess);
    onUpdateSession(newSess);
  };

  const handleTogglePermissionForNewAccount = (permKey: AdminPermission) => {
    if (newPermissions.includes(permKey)) {
      setNewPermissions(newPermissions.filter((p) => p !== permKey));
    } else {
      setNewPermissions([...newPermissions, permKey]);
    }
  };

  const handleCreateCustomAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPasscode.trim()) return;

    const newAcc: AdminCredentialAccount = {
      id: `custom_admin_${Date.now()}`,
      username: newUsername.trim(),
      email: `${newUsername.trim().toLowerCase().replace(/\s+/g, '_')}@sovereign-matrix.root`,
      loginCode: newLoginCode.trim() || `SGC-ADMIN-${Math.floor(100 + Math.random() * 900)}`,
      passcode: newPasscode.trim(),
      securityPin: newPin.trim() || '1234',
      role: newRole,
      title: `Custom ${newRole.toUpperCase()} Account`,
      permissions: newPermissions,
      lastLoginAt: new Date().toISOString(),
    };

    saveCustomAdminAccount(newAcc);
    setAdminAccountsList([...adminAccountsList, newAcc]);
    setSelectedAccForDetail(newAcc);
    setNewUsername('');
    setNewLoginCode('');
    setNewPasscode('');
    setNewPin('');
    setShowAddForm(false);
    sound.play('confirm');
  };

  return (
    <div className="space-y-6" id="admin-login-permissions-tab">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest block w-max mb-1">
            SECURITY MATRIX & CREDENTIALS VAULT
          </span>
          <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Admin-Only Accounts Login Details & Permissions Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage canonical admin credentials, inspect security clearance levels, and verify granular role permission matrices.
          </p>
        </div>

        {/* Current Session Quick Card */}
        <div className="p-3 bg-slate-950 border border-slate-800 text-xs">
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Active Session</span>
          {currentSession.isAuthenticated && currentSession.activeAdmin ? (
            <div className="space-y-1 mt-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold uppercase">{currentSession.activeAdmin.username}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentSession.activeAdmin.role.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Clearance: Level {currentSession.securityClearanceLevel} Root Access
              </div>
            </div>
          ) : (
            <span className="text-red-400 font-bold uppercase block mt-1">No Active Session</span>
          )}
        </div>
      </div>

      {/* Root Administrator Master Credentials Showcase */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/60 text-white font-mono shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-600/30 border border-red-500 text-red-300 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                SYSTEM ROOT ADMIN MASTER ACCOUNT
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                CLEARANCE LEVEL 5 (MAXIMUM ROOT)
              </span>
            </div>
            <div>
              <h4 className="text-base font-black text-white uppercase flex items-center gap-2">
                <span>{CANONICAL_ADMIN_ACCOUNTS[0].username}</span>
                <span className="text-xs text-slate-400 font-normal">({CANONICAL_ADMIN_ACCOUNTS[0].email})</span>
              </h4>
              <p className="text-[11px] text-slate-300">{CANONICAL_ADMIN_ACCOUNTS[0].title}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <div>
                Login Code: <code className="text-sky-300 font-bold px-2 py-0.5 bg-slate-800 border border-slate-700">{CANONICAL_ADMIN_ACCOUNTS[0].loginCode}</code>
              </div>
              <div>
                Passcode: <code className="text-emerald-300 font-bold px-2 py-0.5 bg-slate-800 border border-slate-700">{CANONICAL_ADMIN_ACCOUNTS[0].passcode}</code>
              </div>
              <div>
                PIN: <code className="text-purple-300 font-bold px-2 py-0.5 bg-slate-800 border border-slate-700">{CANONICAL_ADMIN_ACCOUNTS[0].securityPin}</code>
              </div>
              <div className="text-[11px] text-amber-400/90 font-bold">
                Full 10/10 Galactic Permissions Granted
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(CANONICAL_ADMIN_ACCOUNTS[0].loginCode, 'root-code')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'root-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Code</span>
            </button>
            <button
              onClick={() => handleQuickLoginAs(CANONICAL_ADMIN_ACCOUNTS[0])}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Authenticate Root Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Root Admin URL Login & Access Generator Showcase Card */}
      <div className="p-5 border-2 border-amber-500/50 bg-[#0f172a] text-slate-100 font-mono space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider">
                1-CLICK URL AUTHENTICATION
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                ✓ URL QUERY & HASH FRAGMENT ENABLED
              </span>
            </div>
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2 mt-1">
              <Link className="w-4 h-4 text-amber-400" />
              <span>Root Admin URL Access & Instant Login Links</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Authenticate root admin accounts instantly via direct URL parameters, encrypted magic tokens, or auto-create root commands.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.play('click');
              setShowUrlModal(true);
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <Terminal size={14} />
            <span>Launch URL Terminal & Generator</span>
          </button>
        </div>

        {/* Quick URL Cards for Canonical Root Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Stargate Root Admin */}
          <div className="border border-slate-800 bg-slate-950/80 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold text-amber-300">Stargate_Root_Admin</span>
                <span className="text-[10px] text-slate-400">(s.sstargate@gmail.com)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                SUPER ADMIN
              </span>
            </div>
            <div className="p-2 bg-black border border-slate-800 text-[11px] text-slate-300 break-all select-all font-mono">
              {generateAdminUrlLogin(CANONICAL_ADMIN_ACCOUNTS[1] || CANONICAL_ADMIN_ACCOUNTS[0], { mode: 'direct', tab: 'crown' })}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    generateAdminUrlLogin(CANONICAL_ADMIN_ACCOUNTS[1] || CANONICAL_ADMIN_ACCOUNTS[0], { mode: 'direct', tab: 'crown' }),
                    'url-sgw-root'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'url-sgw-root' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedKey === 'url-sgw-root' ? 'Copied URL!' : 'Copy Direct URL'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLoginAs(CANONICAL_ADMIN_ACCOUNTS[1] || CANONICAL_ADMIN_ACCOUNTS[0])}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black uppercase cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          </div>

          {/* System Root Master */}
          <div className="border border-slate-800 bg-slate-950/80 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-300">SystemRoot_Admin</span>
                <span className="text-[10px] text-slate-400">(root@systems-mainframe.root)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                KERNEL ROOT
              </span>
            </div>
            <div className="p-2 bg-black border border-slate-800 text-[11px] text-slate-300 break-all select-all font-mono">
              {generateAdminUrlLogin(CANONICAL_ADMIN_ACCOUNTS[0], { mode: 'direct', tab: 'crown' })}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    generateAdminUrlLogin(CANONICAL_ADMIN_ACCOUNTS[0], { mode: 'direct', tab: 'crown' }),
                    'url-sys-root'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'url-sys-root' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedKey === 'url-sys-root' ? 'Copied URL!' : 'Copy Direct URL'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLoginAs(CANONICAL_ADMIN_ACCOUNTS[0])}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black uppercase cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Credentials Vault Table */}
      <div className="p-5 border border-[#dedede] bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee] pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#111111] font-mono uppercase flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600" />
              <span>1. Canonical Admin-Only Accounts Vault</span>
            </h3>
            <p className="text-xs text-[#666666] font-mono">
              Pre-configured admin accounts with login codes, passcodes, and assigned roles.
            </p>
          </div>

          <button
            onClick={() => {
              sound.play('click');
              setShowAddForm(!showAddForm);
            }}
            className="px-3 py-1.5 bg-[#111111] text-white hover:bg-black font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{showAddForm ? 'Cancel Form' : 'Add Custom Admin Account'}</span>
          </button>
        </div>

        {/* Custom Admin Account Creation Form */}
        {showAddForm && (
          <form onSubmit={handleCreateCustomAdminAccount} className="p-4 bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs space-y-4">
            <span className="font-bold text-amber-400 uppercase text-[11px] block border-b border-slate-800 pb-2">
              Create New Custom Admin Account
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Username *</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-slate-100 focus:border-sky-500 outline-none"
                  placeholder="e.g. Commander_Daniel"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Login Code</label>
                <input
                  type="text"
                  value={newLoginCode}
                  onChange={(e) => setNewLoginCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-slate-100 focus:border-sky-500 outline-none"
                  placeholder="e.g. SG1-DANIEL-102"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Passcode *</label>
                <input
                  type="text"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-slate-100 focus:border-sky-500 outline-none"
                  placeholder="e.g. secretPass2026"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Security PIN (4-Digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-slate-100 focus:border-sky-500 outline-none"
                  placeholder="e.g. 5501"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Assign Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminUserRole)}
                className="w-full md:w-64 bg-slate-950 border border-slate-700 p-2 text-slate-100 focus:border-sky-500 outline-none"
              >
                <option value="super_admin">super_admin (Level 5 Root)</option>
                <option value="administrator">administrator (Level 4 High Command)</option>
                <option value="operator">operator (Level 3 Game Operations)</option>
                <option value="moderator">moderator (Level 2 Moderation)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-2">Select Granted Permissions:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {ADMIN_PERMISSIONS_REGISTRY.map((perm) => {
                  const isChecked = newPermissions.includes(perm.key);
                  return (
                    <button
                      key={perm.key}
                      type="button"
                      onClick={() => handleTogglePermissionForNewAccount(perm.key)}
                      className={`p-2 border text-left text-[10px] transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-sky-950 border-sky-500 text-sky-200'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        {isChecked ? <CheckCircle2 size={12} className="text-emerald-400" /> : <X size={12} />}
                        <span>{perm.key}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase transition-all cursor-pointer"
            >
              Save & Provision Account
            </button>
          </form>
        )}

        {/* Credentials Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#111111] text-white text-[10px] uppercase">
                <th className="p-2.5 border border-[#333333]">Username & Title</th>
                <th className="p-2.5 border border-[#333333]">Role</th>
                <th className="p-2.5 border border-[#333333]">Login Code</th>
                <th className="p-2.5 border border-[#333333]">Passcode</th>
                <th className="p-2.5 border border-[#333333]">Security PIN</th>
                <th className="p-2.5 border border-[#333333]">Grants</th>
                <th className="p-2.5 border border-[#333333] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminAccountsList.map((acc, idx) => {
                const isActiveSessionAcc = currentSession.activeAdmin?.id === acc.id;
                return (
                  <tr
                    key={acc.id}
                    className={`${
                      isActiveSessionAcc ? 'bg-amber-500/10 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                    }`}
                  >
                    <td className="p-2.5 border border-[#eee] text-[#111111]">
                      <div className="font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>{acc.username}</span>
                        {isActiveSessionAcc && (
                          <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] uppercase font-bold">
                            LOGGED IN
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#666666]">{acc.title}</div>
                    </td>

                    <td className="p-2.5 border border-[#eee]">
                      <span className="px-2 py-0.5 bg-[#111111] text-amber-300 text-[10px] uppercase font-bold">
                        {acc.role}
                      </span>
                    </td>

                    <td className="p-2.5 border border-[#eee] text-sky-700 font-bold">
                      <code>{acc.loginCode}</code>
                    </td>

                    <td className="p-2.5 border border-[#eee] text-emerald-700 font-bold">
                      <code>{acc.passcode}</code>
                    </td>

                    <td className="p-2.5 border border-[#eee] text-purple-700 font-bold">
                      <code>{acc.securityPin}</code>
                    </td>

                    <td className="p-2.5 border border-[#eee] text-[#555555]">
                      <span className="font-bold text-[#111111]">{acc.permissions.length}</span> Permissions
                    </td>

                    <td className="p-2.5 border border-[#eee] text-right space-x-1">
                      <button
                        onClick={() => setSelectedAccForDetail(acc)}
                        className="px-2 py-1 bg-[#fafafa] border border-[#ccc] text-[#333333] hover:bg-[#111111] hover:text-white transition-all text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Inspect
                      </button>

                      <button
                        onClick={() => handleQuickLoginAs(acc)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Log In
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Account Detail & Permissions Inspector */}
      {selectedAccForDetail && (
        <div className="p-5 border border-[#dedede] bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-[#eee] pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#111111] font-mono uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>2. Granular Permissions Matrix for {selectedAccForDetail.username}</span>
              </h3>
              <p className="text-xs text-[#666666] font-mono">
                Role: <strong>{selectedAccForDetail.role.toUpperCase()}</strong> · Title: {selectedAccForDetail.title}
              </p>
            </div>

            <button
              onClick={() => handleCopy(JSON.stringify(selectedAccForDetail, null, 2), 'acc-json')}
              className="px-3 py-1.5 bg-[#fafafa] border border-[#ccc] font-mono text-xs font-bold uppercase hover:bg-[#111111] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'acc-json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'acc-json' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {ADMIN_PERMISSIONS_REGISTRY.map((perm) => {
              const hasPerm = selectedAccForDetail.permissions.includes(perm.key);
              return (
                <div
                  key={perm.key}
                  className={`p-3 border transition-all ${
                    hasPerm
                      ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400 line-through opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-xs">
                      {hasPerm ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{perm.label}</span>
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 bg-white border font-bold uppercase">
                      Lvl {perm.securityLevel}
                    </span>
                  </div>

                  <p className="text-[10px] leading-relaxed no-underline text-[#555555]">{perm.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Root Admin URL Login & Generator Modal */}
      <RootAdminUrlLoginModal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onAuthSuccess={(session, account) => {
          onUpdateSession(session);
          setShowUrlModal(false);
          sound.play('confirm');
        }}
      />
    </div>
  );
};
