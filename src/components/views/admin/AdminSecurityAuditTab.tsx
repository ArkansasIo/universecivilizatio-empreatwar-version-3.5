import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Crosshair,
  TrendingUp,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Ban,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminSecurityAlert } from '../../../types';
import { getAdminAuditLogs } from '../../../config/adminAuthConfig';

interface AdminSecurityAuditTabProps {
  alerts: AdminSecurityAlert[];
  onResolveAlert: (alertId: string) => void;
  onQuickBanUser: (username: string, reason: string) => void;
}

export const AdminSecurityAuditTab: React.FC<AdminSecurityAuditTabProps> = ({
  alerts,
  onResolveAlert,
  onQuickBanUser,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const auditLogs = getAdminAuditLogs();

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'unresolved') return !a.resolved;
    if (filterType === 'multi_ip') return a.alertType === 'multi_account_ip';
    if (filterType === 'bashing') return a.alertType === 'fleet_bashing';
    if (filterType === 'pushing') return a.alertType === 'resource_pushing';
    if (filterType === 'bot') return a.alertType === 'bot_activity';
    return true;
  });

  const getAlertBadge = (type: AdminSecurityAlert['alertType']) => {
    switch (type) {
      case 'multi_account_ip':
        return (
          <span className="px-2 py-0.5 bg-purple-700 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Globe size={10} />
            <span>Multi-Account IP Collision</span>
          </span>
        );
      case 'fleet_bashing':
        return (
          <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Crosshair size={10} />
            <span>Bash Rule (&gt;6 Attacks/24h)</span>
          </span>
        );
      case 'resource_pushing':
        return (
          <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <TrendingUp size={10} />
            <span>Illegal Fleet Pushing</span>
          </span>
        );
      case 'bot_activity':
        return (
          <span className="px-2 py-0.5 bg-cyan-700 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <ShieldAlert size={10} />
            <span>Sub-second Macro/Bot</span>
          </span>
        );
      case 'rapid_auth_failure':
        return (
          <span className="px-2 py-0.5 bg-rose-700 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1">
            <Lock size={10} />
            <span>Rapid Auth Failures</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="admin-security-audit-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-extrabold uppercase">
              2Moons Anti-Cheat Daemon
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {alerts.filter((a) => !a.resolved).length} Pending Security Flags
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Anti-Cheat & Multi-Account Inspector</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Autonomous server surveillance flags shared IP subnets, 24-hour fleet bashing limits,
            one-way low-to-high point resource pushing, and millisecond macro timing anomalies.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#dddddd] pb-3">
        <div className="flex gap-2">
          {['all', 'unresolved', 'multi_ip', 'bashing', 'pushing'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors cursor-pointer border ${
                filterType === f
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#555555] border-[#dedede] hover:bg-[#f0f0f0]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#888888]">
          {filteredAlerts.length} Flagged Incidents
        </span>
      </div>

      {/* Security Incident Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="border border-[#dedede] bg-white p-12 text-center text-xs font-mono text-[#888888]">
            No suspicious activities or anti-cheat flags recorded.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 border bg-white space-y-3 transition-colors ${
                alert.resolved
                  ? 'border-[#dedede] opacity-60'
                  : alert.severity === 'critical'
                  ? 'border-red-500 bg-red-50/10'
                  : 'border-amber-400 bg-amber-50/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getAlertBadge(alert.alertType)}
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 uppercase ${
                      alert.severity === 'critical'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-[#111111]'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#777777]">
                    Detected: {new Date(alert.detectedAt || alert.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.resolved ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          sound.play('confirm');
                          onResolveAlert(alert.id);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>Dismiss / Clear</span>
                      </button>

                      {alert.sourceUser && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.play('confirm');
                            onQuickBanUser(
                              alert.sourceUser,
                              `Automated security flag: ${alert.details}`
                            );
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Ban size={12} />
                          <span>Sanction {alert.sourceUser}</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>Resolved by Operator</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs font-mono text-[#222222] leading-relaxed">
                {alert.details}
              </div>

              {/* Suspect Accounts Tag Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#eeeeee]">
                <span className="text-[10px] font-mono uppercase text-[#888888] font-bold">
                  Involved Accounts:
                </span>
                {(alert.involvedUsers || [alert.sourceUser, alert.targetUser].filter(Boolean)).map((user) => (
                  <span
                    key={String(user)}
                    className="px-2 py-0.5 bg-[#f0f0f0] border border-[#cccccc] text-[#111111] text-xs font-mono font-bold"
                  >
                    {String(user)}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Admin Login & Authentication Audit Trail Section */}
      <div className="p-5 border border-[#dedede] bg-white space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#eee] pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-[#111111] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Accounts Login & Security Audit Trail</span>
            </h3>
            <p className="text-xs text-[#666666]">
              Real-time audit record of admin authentication attempts, password verifications, and PIN checks.
            </p>
          </div>
          <span className="px-2 py-0.5 bg-[#111111] text-amber-300 text-[10px] font-bold uppercase">
            {auditLogs.length} Events Logged
          </span>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-6 bg-[#fafafa] border border-[#eee] text-center text-xs text-[#888888]">
            No admin login events logged in the current session history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111111] text-white text-[10px] uppercase">
                  <th className="p-2.5 border border-[#333]">Timestamp</th>
                  <th className="p-2.5 border border-[#333]">Admin User</th>
                  <th className="p-2.5 border border-[#333]">Action</th>
                  <th className="p-2.5 border border-[#333]">Details</th>
                  <th className="p-2.5 border border-[#333]">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 border-b border-[#eee]">
                    <td className="p-2.5 border border-[#eee] text-[#666666] text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2.5 border border-[#eee] font-bold text-[#111111]">
                      {log.adminUsername}
                    </td>
                    <td className="p-2.5 border border-[#eee] font-bold text-sky-700 text-[11px]">
                      {log.action}
                    </td>
                    <td className="p-2.5 border border-[#eee] text-[#444444] text-[11px]">
                      {log.details}
                    </td>
                    <td className="p-2.5 border border-[#eee]">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
