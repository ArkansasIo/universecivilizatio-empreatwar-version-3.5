import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Sparkles,
  Server,
} from 'lucide-react';
import { sound } from '../../../sound';

interface AdminMaintenanceTabProps {
  onRecalculateHighscores: () => void;
  onPurgeInactives: () => void;
  onFlushCache: () => void;
  onResetUniverseSeason: () => void;
  onExportState: () => string;
  onImportState: (json: string) => boolean;
}

export const AdminMaintenanceTab: React.FC<AdminMaintenanceTabProps> = ({
  onRecalculateHighscores,
  onPurgeInactives,
  onFlushCache,
  onResetUniverseSeason,
  onExportState,
  onImportState,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRecalc = () => {
    sound.play('confirm');
    onRecalculateHighscores();
    showFeedback('Highscores & planetary building points recalculated successfully!');
  };

  const handlePurge = () => {
    sound.play('confirm');
    onPurgeInactives();
    showFeedback('Ghost and inactive accounts purged from galaxy coordinates.');
  };

  const handleFlush = () => {
    sound.play('confirm');
    onFlushCache();
    showFeedback('Universe Redis memory cache and spatial coordinates flushed!');
  };

  const handleResetSeason = () => {
    if (
      window.confirm(
        'WARNING: This will wipe all player fleets, defense grids, and mine levels for a brand new universe season. Continue?'
      )
    ) {
      sound.play('confirm');
      onResetUniverseSeason();
      showFeedback('Universe Season successfully reset to Day 0!');
    }
  };

  const handleExport = () => {
    sound.play('click');
    const data = onExportState();
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    showFeedback('Universe JSON backup copied to clipboard!');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    const ok = onImportState(importJson.trim());
    if (ok) {
      sound.play('confirm');
      showFeedback('Universe state snapshot restored successfully!');
      setImportJson('');
    } else {
      sound.play('warning');
      showFeedback('Error: Invalid JSON state snapshot payload.');
    }
  };

  return (
    <div id="admin-maintenance-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-extrabold uppercase">
              XNova Database & Server Maintenance
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">System Engine Maintenance</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Universe Database & Seasonal Tools</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Recalculate player rankings, purge inactive colonies, flush runtime coordinates, and
            create full JSON universe snapshot dumps.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 4 Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recalculate Highscores */}
        <div className="p-5 border border-[#dedede] bg-white space-y-3">
          <div className="flex items-center gap-2 text-indigo-700">
            <RefreshCw size={18} />
            <h4 className="font-bold text-sm text-[#111111] font-mono uppercase">
              Recalculate Highscores
            </h4>
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            Parses all active player structures, fleet counts, defense turrets, and research levels
            to re-compute the official Hall of Fame rank ladders.
          </p>
          <button
            type="button"
            onClick={handleRecalc}
            className="w-full py-2 bg-[#111111] hover:bg-indigo-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Run Rank Re-Index
          </button>
        </div>

        {/* Purge Ghost Inactives */}
        <div className="p-5 border border-[#dedede] bg-white space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <Trash2 size={18} />
            <h4 className="font-bold text-sm text-[#111111] font-mono uppercase">
              Purge Inactive Accounts
            </h4>
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            Deletes colonies and ghost accounts inactive for more than 45 days, releasing high-value
            galaxy coordinate slots for active commanders.
          </p>
          <button
            type="button"
            onClick={handlePurge}
            className="w-full py-2 bg-[#111111] hover:bg-amber-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Purge Ghost Inactives
          </button>
        </div>

        {/* Flush Coordinate Memory */}
        <div className="p-5 border border-[#dedede] bg-white space-y-3">
          <div className="flex items-center gap-2 text-sky-600">
            <Database size={18} />
            <h4 className="font-bold text-sm text-[#111111] font-mono uppercase">
              Flush Server Cache
            </h4>
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            Flushes cached galaxy views, debris matrices, and temporary session tokens to ensure
            real-time parity across all active clients.
          </p>
          <button
            type="button"
            onClick={handleFlush}
            className="w-full py-2 bg-[#111111] hover:bg-sky-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Flush Server Cache
          </button>
        </div>
      </div>

      {/* JSON Backup & Restore Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="p-5 border border-[#dedede] bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-emerald-600" />
            <h4 className="font-bold text-sm text-[#111111] font-mono uppercase">
              Universe State Snapshot Backup
            </h4>
          </div>
          <p className="text-xs text-[#555555]">
            Export complete state payload including players, bans, fleet missions, planets, tickets,
            and empire facilities as a JSON backup.
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            <Download size={14} />
            <span>{copied ? 'Copied Snapshot JSON!' : 'Copy Universe JSON to Clipboard'}</span>
          </button>
        </div>

        {/* Import */}
        <form onSubmit={handleImport} className="p-5 border border-[#dedede] bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-sky-600" />
            <h4 className="font-bold text-sm text-[#111111] font-mono uppercase">
              Restore Universe Snapshot
            </h4>
          </div>
          <textarea
            rows={3}
            placeholder="Paste JSON universe snapshot payload here..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full p-2 border border-[#cccccc] text-xs font-mono bg-[#fafafa]"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#111111] hover:bg-sky-600 text-white text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            <Upload size={14} />
            <span>Apply & Overwrite Universe State</span>
          </button>
        </form>
      </div>

      {/* Danger Zone: Season Reset */}
      <div className="p-5 border-2 border-red-600 bg-red-50/20 space-y-3">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle size={20} />
          <h4 className="font-bold text-sm font-mono uppercase">
            Universe Season Wipe & Fresh Start
          </h4>
        </div>
        <p className="text-xs text-[#555555] max-w-3xl leading-relaxed">
          Resets all planetary buildings, technology research queues, armada fleets, and debris
          fields back to Day 0 while preserving registered player accounts and Dark Matter vaults.
        </p>
        <button
          type="button"
          onClick={handleResetSeason}
          className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-2"
        >
          <Flame size={15} />
          <span>Wipe Universe & Begin Season 2</span>
        </button>
      </div>
    </div>
  );
};
