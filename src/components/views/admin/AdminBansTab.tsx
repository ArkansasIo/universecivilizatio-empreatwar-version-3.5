import React, { useState } from 'react';
import {
  Ban,
  ShieldAlert,
  Clock,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Calendar,
  Globe,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminBanRecord, AdminBanType, AdminUserAccount } from '../../../types';

interface AdminBansTabProps {
  bans: AdminBanRecord[];
  users: AdminUserAccount[];
  currentAdminName: string;
  onBanUser: (ban: AdminBanRecord) => void;
  onUnbanUser: (banId: string) => void;
  prefillUser?: AdminUserAccount | null;
}

export const AdminBansTab: React.FC<AdminBansTabProps> = ({
  bans,
  users,
  currentAdminName,
  onBanUser,
  onUnbanUser,
  prefillUser,
}) => {
  const [showBanForm, setShowBanForm] = useState(!!prefillUser);
  const [targetUsername, setTargetUsername] = useState(prefillUser?.username || '');
  const [banReason, setBanReason] = useState('Multi-accounting and unauthorized fleet pushing');
  const [banType, setBanType] = useState<AdminBanType>('full_ban');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [isPermanent, setIsPermanent] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredBans = bans.filter((b) => {
    if (filterType === 'active') return b.active;
    if (filterType === 'permanent') return b.isPermanent;
    if (filterType === 'full_ban') return b.banType === 'full_ban';
    return true;
  });

  const handleCreateBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim()) return;

    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === targetUsername.trim().toLowerCase()
    );

    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + (isPermanent ? 3650 : durationDays));

    const newBan: AdminBanRecord = {
      id: `ban-${Date.now()}`,
      userId: matchedUser ? matchedUser.id : `user-manual-${Date.now()}`,
      username: targetUsername.trim(),
      adminName: currentAdminName || 'SuperAdmin_Archon',
      reason: banReason.trim(),
      banType,
      ipAddress: matchedUser ? matchedUser.ipAddress : '198.51.100.1',
      issuedAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      isPermanent,
      active: true,
    };

    onBanUser(newBan);
    sound.play('confirm');
    setShowBanForm(false);
    setTargetUsername('');
  };

  const getBanTypeBadge = (type: AdminBanType) => {
    switch (type) {
      case 'full_ban':
        return <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold uppercase">Full Account Ban</span>;
      case 'attack_lock':
        return <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-mono font-bold uppercase">Combat / Attack Lock</span>;
      case 'chat_mute':
        return <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-mono font-bold uppercase">Chat & Forum Mute</span>;
      case 'vacation_lock':
        return <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase">Forced Vacation Lock</span>;
      case 'ip_ban':
        return <span className="px-2 py-0.5 bg-purple-700 text-white text-[10px] font-mono font-bold uppercase">IP Subnet Ban</span>;
      default:
        return null;
    }
  };

  return (
    <div id="admin-bans-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-extrabold uppercase">
              OGame Disciplinary Court
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {bans.filter((b) => b.active).length} Active Sanctions
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Ban & Player Sanction Registry</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Enforce game integrity rules against multi-accounting, fleet bashing, bot scripting,
            and unapproved market pushing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setShowBanForm(!showBanForm);
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={14} />
          <span>{showBanForm ? 'Close Ban Form' : 'Issue New Sanction / Ban'}</span>
        </button>
      </div>

      {/* New Ban Form Modal/Panel */}
      {showBanForm && (
        <form
          onSubmit={handleCreateBan}
          className="border-2 border-red-600 bg-red-50/20 p-5 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-red-200 pb-2">
            <ShieldAlert size={18} className="text-red-600" />
            <h4 className="font-bold text-sm text-[#111111] font-mono uppercase">
              Issue Imperial Disciplinary Decree
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                Target Username
              </label>
              <input
                type="text"
                placeholder="Enter exact player username..."
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                required
                className="w-full p-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-red-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                Sanction Type
              </label>
              <select
                value={banType}
                onChange={(e) => setBanType(e.target.value as AdminBanType)}
                className="w-full p-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-red-600 outline-hidden"
              >
                <option value="full_ban">Full Account Lock (No Login)</option>
                <option value="attack_lock">Combat / Attack Lock (Fleet Bashing)</option>
                <option value="chat_mute">Chat & Message Channel Mute</option>
                <option value="vacation_lock">Force Permanent Vacation Shield</option>
                <option value="ip_ban">Full IP & Subnet Ban</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                Duration
              </label>
              <div className="flex items-center gap-2">
                <select
                  disabled={isPermanent}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full p-2 border border-[#cccccc] bg-white text-xs font-mono disabled:opacity-50"
                >
                  <option value={1}>1 Day (24 Hours)</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days (1 Week)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={90}>90 Days (Quarter)</option>
                </select>

                <label className="flex items-center gap-1 text-xs font-mono font-bold text-red-700 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPermanent}
                    onChange={(e) => setIsPermanent(e.target.checked)}
                    className="accent-red-600 cursor-pointer"
                  />
                  <span>Permanent</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-mono font-bold text-[#444444] mb-1">
                Official Ban Reason & Evidence Log
              </label>
              <textarea
                rows={2}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Cite specific rule violation (e.g., Rule 4.2 Multi-accounting, matched IP 198.51.100.44)..."
                required
                className="w-full p-2 border border-[#cccccc] bg-white text-xs font-mono focus:border-red-600 outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowBanForm(false)}
              className="px-4 py-2 border border-[#cccccc] bg-white text-xs font-mono hover:bg-[#f0f0f0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Ban size={14} />
              <span>Confirm & Enforce Sanction</span>
            </button>
          </div>
        </form>
      )}

      {/* Bans Table */}
      <div className="border border-[#dedede] bg-white space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#eeeeee]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#333333] uppercase">
              Filter Records:
            </span>
            <div className="flex gap-1">
              {['all', 'active', 'permanent', 'full_ban'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 text-xs font-mono uppercase transition-colors cursor-pointer border ${
                    filterType === f
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#fafafa] text-[#555555] border-[#dedede] hover:bg-[#eeeeee]'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-[#888888]">
            Showing {filteredBans.length} disciplinary records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#dddddd] bg-[#fafafa] text-[#666666]">
                <th className="p-3">Player Account</th>
                <th className="p-3">Sanction Type</th>
                <th className="p-3">Reason & Justification</th>
                <th className="p-3">Issued By</th>
                <th className="p-3">Duration / Expiry</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {filteredBans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#888888]">
                    No disciplinary records found under current filter.
                  </td>
                </tr>
              ) : (
                filteredBans.map((ban) => (
                  <tr
                    key={ban.id}
                    className={`hover:bg-[#fcfcfc] ${!ban.active ? 'opacity-50' : ''}`}
                  >
                    <td className="p-3 font-bold text-[#111111]">
                      <div className="flex items-center gap-1.5">
                        <UserX size={14} className="text-red-600" />
                        <span>{ban.username}</span>
                      </div>
                      <div className="text-[10px] text-[#888888] font-normal flex items-center gap-1 mt-0.5">
                        <Globe size={10} />
                        <span>{ban.ipAddress}</span>
                      </div>
                    </td>

                    <td className="p-3">{getBanTypeBadge(ban.banType)}</td>

                    <td className="p-3 max-w-xs text-[#444444] leading-relaxed">{ban.reason}</td>

                    <td className="p-3 font-mono text-indigo-700 font-bold">{ban.adminName}</td>

                    <td className="p-3">
                      {ban.isPermanent ? (
                        <span className="text-red-600 font-bold">PERMANENT</span>
                      ) : (
                        <div>
                          <div>Until {new Date(ban.expiresAt).toLocaleDateString()}</div>
                          <div className="text-[10px] text-[#888888]">
                            Issued {new Date(ban.issuedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {ban.active ? (
                        <button
                          type="button"
                          onClick={() => {
                            sound.play('confirm');
                            onUnbanUser(ban.id);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold flex items-center gap-1 ml-auto transition-colors cursor-pointer"
                        >
                          <Unlock size={12} />
                          <span>Lift Ban</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          Expired / Lifted
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
