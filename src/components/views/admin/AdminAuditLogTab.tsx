import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Download,
  Clock,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { sound } from '../../../sound';
import {
  getAdminAuditLogs,
  clearAdminAuditLogs,
  addAdminAuditLog,
  AdminAuditEntry,
} from '../../../config/adminAuthConfig';

interface AdminAuditLogTabProps {
  currentAdminName: string;
}

export const AdminAuditLogTab: React.FC<AdminAuditLogTabProps> = ({ currentAdminName }) => {
  const [logs, setLogs] = useState<AdminAuditEntry[]>(() => getAdminAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAdmin, setFilterAdmin] = useState('ALL');
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Manual test log simulation state
  const [simAction, setSimAction] = useState('MODIFY_UNIVERSE_CONFIG');
  const [simDetails, setSimDetails] = useState('');
  const [simStatus, setSimStatus] = useState<'SUCCESS' | 'WARNING' | 'DENIED'>('SUCCESS');

  const refreshLogs = () => {
    sound.play('click');
    setLogs(getAdminAuditLogs());
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you wish to clear all admin audit trail logs? This action is irreversible.')) {
      sound.play('warning');
      clearAdminAuditLogs();
      setLogs([]);
    }
  };

  const handleExportLogs = () => {
    sound.play('confirm');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `admin_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSimulateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simAction.trim()) return;

    addAdminAuditLog({
      adminUsername: currentAdminName || 'SupremeAdmin_Archon',
      action: simAction.trim().toUpperCase(),
      details: simDetails.trim() || `Manual administrative action recorded by ${currentAdminName}`,
      status: simStatus,
    });

    sound.play('confirm');
    setLogs(getAdminAuditLogs());
    setShowSimulateModal(false);
    setSimDetails('');
  };

  // Distinct lists for filters
  const uniqueAdmins = Array.from(new Set(logs.map((l) => l.adminUsername))).filter(Boolean);
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action))).filter(Boolean);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
    const matchesAdmin = filterAdmin === 'ALL' || log.adminUsername === filterAdmin;

    return matchesSearch && matchesAction && matchesStatus && matchesAdmin;
  });

  const getStatusBadge = (status: AdminAuditEntry['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-700" />
            <span>SUCCESS</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase flex items-center gap-1">
            <AlertTriangle size={11} className="text-amber-700" />
            <span>WARNING</span>
          </span>
        );
      case 'DENIED':
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold uppercase flex items-center gap-1">
            <XCircle size={11} className="text-red-700" />
            <span>DENIED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'text-purple-700 bg-purple-50 border-purple-200';
    if (action.includes('BAN') || action.includes('PURGE')) return 'text-red-700 bg-red-50 border-red-200';
    if (action.includes('GRANT') || action.includes('RESOURCE')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (action.includes('CONFIG') || action.includes('UPDATE')) return 'text-sky-700 bg-sky-50 border-sky-200';
    if (action.includes('DECREE') || action.includes('CROWN')) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <div id="admin-audit-log-tab" className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="border border-[#dedede] bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#111111] text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <FileText size={12} />
                ADMINISTRATIVE AUDIT ENGINE
              </span>
              <span className="text-[11px] text-[#666666]">
                Executor Context: <strong className="text-[#111111]">{currentAdminName}</strong>
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#111111] uppercase tracking-wide flex items-center gap-2">
              <span>Admin Actions Audit Log</span>
            </h2>
            <p className="text-xs text-[#555555] mt-1 max-w-2xl leading-relaxed">
              Comprehensive tamper-evident record of all administrative commands, sanctions, resource allocations,
              decree promulgations, and security verifications executed by users with admin status.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshLogs}
              className="px-3 py-2 bg-white border border-[#dedede] hover:border-[#111111] text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh log table"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleExportLogs}
              className="px-3 py-2 bg-white border border-[#dedede] hover:border-[#111111] text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export logs as JSON"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSimulateModal(true)}
              className="px-3 py-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Record a custom administrative action"
            >
              <Terminal size={13} className="text-amber-400" />
              <span>Record Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 border border-[#dedede] bg-white">
          <span className="text-[10px] text-[#888888] uppercase block">Total Logged Actions</span>
          <strong className="text-lg text-[#111111] font-bold">{logs.length}</strong>
        </div>
        <div className="p-3 border border-[#dedede] bg-white">
          <span className="text-[10px] text-[#888888] uppercase block">Successful Executions</span>
          <strong className="text-lg text-emerald-700 font-bold">
            {logs.filter((l) => l.status === 'SUCCESS').length}
          </strong>
        </div>
        <div className="p-3 border border-[#dedede] bg-white">
          <span className="text-[10px] text-[#888888] uppercase block">Sanctions & Warnings</span>
          <strong className="text-lg text-amber-600 font-bold">
            {logs.filter((l) => l.status === 'WARNING').length}
          </strong>
        </div>
        <div className="p-3 border border-[#dedede] bg-white">
          <span className="text-[10px] text-[#888888] uppercase block">Denied / Failed</span>
          <strong className="text-lg text-red-600 font-bold">
            {logs.filter((l) => l.status === 'DENIED').length}
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border border-[#dedede] bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#888888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search action, admin, details..."
              className="w-full bg-[#fafafa] border border-[#dedede] pl-8 pr-3 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#666666] shrink-0">Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#dedede] px-2 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value="ALL">All Action Types</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Executor Admin Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#666666] shrink-0">Executor:</span>
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#dedede] px-2 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value="ALL">All Admin Executors</option>
              {uniqueAdmins.map((adm) => (
                <option key={adm} value={adm}>
                  {adm}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#666666] shrink-0">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#dedede] px-2 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="DENIED">Denied</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0] text-[11px] text-[#666666]">
          <span>
            Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> audit records
          </span>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={handleClearLogs}
              className="text-red-600 hover:text-red-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} />
              <span>Purge Audit History</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Audit Records Table */}
      <div className="border border-[#dedede] bg-white overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#888888] space-y-2">
            <FileText size={32} className="mx-auto text-neutral-300" />
            <p className="font-bold text-[#444444]">No administrative audit entries found.</p>
            <p className="text-[11px]">Adjust your search query or trigger an administrative action to view logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111111] text-white text-[10px] uppercase tracking-wider">
                  <th className="p-3 border-r border-neutral-800">Timestamp</th>
                  <th className="p-3 border-r border-neutral-800">Executor (Admin)</th>
                  <th className="p-3 border-r border-neutral-800">Action Name</th>
                  <th className="p-3 border-r border-neutral-800">Operation Details</th>
                  <th className="p-3 border-r border-neutral-800">Host / IP</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeee]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fafafa] transition-colors">
                    {/* Timestamp */}
                    <td className="p-3 text-[#666666] text-[11px] whitespace-nowrap font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[#888888]" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Executor */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-[#555555]" />
                        <span className="font-bold text-[#111111]">{log.adminUsername}</span>
                      </div>
                    </td>

                    {/* Action Name */}
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Operation Details */}
                    <td className="p-3 text-[#333333] text-[11px] max-w-md leading-relaxed">
                      {log.details}
                    </td>

                    {/* Host/IP */}
                    <td className="p-3 text-[#777777] text-[10px] whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1 (SGC Local)'}
                    </td>

                    {/* Status */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="inline-flex justify-center">
                        {getStatusBadge(log.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Action Recording Modal */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#111111] max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#eee] pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-[#111111]" />
                <h3 className="text-sm font-extrabold uppercase text-[#111111]">
                  Record Administrative Action
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="text-[#888888] hover:text-[#111111] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateLog} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#333333] uppercase mb-1">
                  Executor
                </label>
                <input
                  type="text"
                  disabled
                  value={currentAdminName}
                  className="w-full bg-[#f5f5f5] border border-[#dedede] p-2 text-xs font-bold text-[#555555]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#333333] uppercase mb-1">
                  Action Name
                </label>
                <select
                  value={simAction}
                  onChange={(e) => setSimAction(e.target.value)}
                  className="w-full bg-white border border-[#dedede] p-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  <option value="MODIFY_UNIVERSE_CONFIG">MODIFY_UNIVERSE_CONFIG</option>
                  <option value="ISSUE_IMPERIAL_DECREE">ISSUE_IMPERIAL_DECREE</option>
                  <option value="GRANT_RESOURCES">GRANT_RESOURCES</option>
                  <option value="SPAWN_FLEET_ARMADA">SPAWN_FLEET_ARMADA</option>
                  <option value="BAN_PLAYER">BAN_PLAYER</option>
                  <option value="UNBAN_PLAYER">UNBAN_PLAYER</option>
                  <option value="EXECUTE_SQL_MAINTENANCE">EXECUTE_SQL_MAINTENANCE</option>
                  <option value="TRIGGER_CRON_MANUAL">TRIGGER_CRON_MANUAL</option>
                  <option value="RESOLVE_SECURITY_ALERT">RESOLVE_SECURITY_ALERT</option>
                  <option value="RELOAD_SYSTEM_CACHE">RELOAD_SYSTEM_CACHE</option>
                  <option value="TELEPORT_FLEET_MISSION">TELEPORT_FLEET_MISSION</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#333333] uppercase mb-1">
                  Operation Details & Parameters
                </label>
                <textarea
                  rows={3}
                  value={simDetails}
                  onChange={(e) => setSimDetails(e.target.value)}
                  placeholder="e.g. Granted 1,000,000 Naquadah and 500,000 Crystal to player Commander_O_Neill..."
                  className="w-full bg-white border border-[#dedede] p-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#333333] uppercase mb-1">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  {(['SUCCESS', 'WARNING', 'DENIED'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="simStatus"
                        value={st}
                        checked={simStatus === st}
                        onChange={() => setSimStatus(st)}
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 border border-[#dedede] text-[#666666] hover:bg-[#f5f5f5] text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Commit Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
