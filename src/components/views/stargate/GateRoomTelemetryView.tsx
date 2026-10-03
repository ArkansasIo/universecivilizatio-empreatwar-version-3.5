import React, { useState } from 'react';
import {
  Radio,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  Crosshair,
  Compass,
  History,
  Activity,
  Globe,
  Flame,
  Award,
  Terminal,
  RotateCcw,
  Sliders,
  DollarSign,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  GATE_ROOM_1000_DISPATCHES,
  GateRoomTelemetryDispatch,
  INITIAL_RING_TRANSPORTERS,
  RingTransporterSite,
  STARGATE_CHEVRON_RULES,
} from '../../../data/stargateTelemetryData';
import { PlayerResources } from '../../../types';
import { sound } from '../../../sound';

interface GateRoomTelemetryViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  onLogDebrief?: (log: string) => void;
}

export const GateRoomTelemetryView: React.FC<GateRoomTelemetryViewProps> = ({
  resources,
  onUpdateResources,
  onLogDebrief,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dispatches' | 'ring_transporter' | 'chevron_rules'>('dispatches');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedGalaxy, setSelectedGalaxy] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDispatch, setSelectedDispatch] = useState<GateRoomTelemetryDispatch>(GATE_ROOM_1000_DISPATCHES[0]);
  const [ringSites, setRingSites] = useState<RingTransporterSite[]>(INITIAL_RING_TRANSPORTERS);
  const [ringTransitOrigin, setRingTransitOrigin] = useState<string>('ring_sgc_gateroom');
  const [ringTransitDestination, setRingTransitDestination] = useState<string>('ring_hatak_mothership');
  const [isRingsActivating, setIsRingsActivating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const ITEMS_PER_PAGE = 12;

  // Filter 1000 dispatches
  const filteredDispatches = GATE_ROOM_1000_DISPATCHES.filter((d) => {
    if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && d.severity !== selectedSeverity) return false;
    if (selectedGalaxy !== 'ALL' && d.galaxy !== selectedGalaxy) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHead = d.headline.toLowerCase().includes(q);
      const matchLog = d.telemetryLog.toLowerCase().includes(q);
      const matchSource = d.sourceGate.toLowerCase().includes(q);
      const matchCode = d.code.toLowerCase().includes(q);
      if (!matchHead && !matchLog && !matchSource && !matchCode) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredDispatches.length / ITEMS_PER_PAGE);
  const currentDispatches = filteredDispatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Claim/Process Telemetry Dispatch Reward
  const handleProcessDispatch = (dispatch: GateRoomTelemetryDispatch) => {
    sound.play('confirm');
    onUpdateResources({
      naquadah: (resources.naquadah || 0) + dispatch.rewardNaquadah,
      crystal: (resources.crystal || 0) + dispatch.rewardCrystal,
      darkMatter: (resources.darkMatter || 0) + dispatch.rewardDarkMatter,
    });

    const msg = `Processed Gate Room Dispatch ${dispatch.code}: Transferred +${dispatch.rewardNaquadah.toLocaleString()} Naquadah, +${dispatch.rewardCrystal.toLocaleString()} Crystal${dispatch.rewardDarkMatter > 0 ? `, +${dispatch.rewardDarkMatter} Dark Matter` : ''} to planetary reserves!`;
    setFeedback({ type: 'success', text: msg });
    if (onLogDebrief) onLogDebrief(msg);
  };

  // Ring Transporter Transit Execution
  const handleActivateRingTransporter = () => {
    if (ringTransitOrigin === ringTransitDestination) {
      sound.play('warning');
      setFeedback({ type: 'error', text: 'Origin and destination transport ring platforms must be different!' });
      return;
    }

    const originSite = ringSites.find((s) => s.id === ringTransitOrigin) || ringSites[0];
    const destSite = ringSites.find((s) => s.id === ringTransitDestination) || ringSites[1];
    const cost = Math.max(originSite.transitCostCredits, destSite.transitCostCredits);

    if ((resources.credits || 0) < cost) {
      sound.play('warning');
      setFeedback({ type: 'error', text: `Insufficient credits to power ring matter-stream capacitors (Requires ${cost} Credits).` });
      return;
    }

    setIsRingsActivating(true);
    sound.play('stargate_lock');

    setTimeout(() => {
      setIsRingsActivating(false);
      onUpdateResources({
        credits: Math.max(0, (resources.credits || 0) - cost),
      });

      sound.play('success');
      const logMsg = `Ring Transporters Activated: Matter stream established between ${originSite.name} and ${destSite.name}! Elevation shift: ${Math.abs(originSite.elevationKm - destSite.elevationKm).toFixed(2)} km. Expedition personnel transferred successfully.`;
      setFeedback({ type: 'success', text: logMsg });
      if (onLogDebrief) onLogDebrief(logMsg);
    }, 1400);
  };

  return (
    <div id="gate-room-telemetry-view" className="space-y-6">
      {/* 1. Header Banner - Crisp White Background Theme */}
      <div className="border border-[#111111] bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono border border-[#111111] bg-amber-50 text-amber-900 font-bold uppercase">
                GATE ROOM TELEMETRY & RING TRANSPORTERS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono border border-sky-600 bg-sky-50 text-sky-800 font-bold">
                1,000 DISPATCH EVENTS ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#111111] tracking-tight mt-1">
              Subspace Dialing Rules & Matter Ring Transporters
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
              Execute 7, 8, and 9-chevron coordinates with authentic turn costs (1 Turn for local, 125 Turns for 8th Chevron galaxies,
              200 Turns for 9th Chevron cosmic boundaries), operate Ring Transporter matter streams, and process 1,000 telemetry dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1] text-center">
              <span className="text-[10px] text-[#64748b] uppercase block">Telemetry Logs</span>
              <b className="text-sm text-[#111111] font-bold">1,000 Events</b>
            </div>
            <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1] text-center">
              <span className="text-[10px] text-[#64748b] uppercase block">Ring Platforms</span>
              <b className="text-sm text-amber-700 font-bold">{ringSites.length} Active Nodes</b>
            </div>
          </div>
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div
            className={`mt-4 p-3 text-xs font-mono flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-[10px] uppercase font-bold cursor-pointer hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#e2e8f0]">
          <button
            onClick={() => {
              sound.play('click');
              setActiveSubTab('dispatches');
            }}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'dispatches'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#555555] border-[#dedede] hover:bg-neutral-100'
            }`}
          >
            <Radio size={14} className={activeSubTab === 'dispatches' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>01. Gate Room Telemetry Dispatches (1,000 Events)</span>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setActiveSubTab('ring_transporter');
            }}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'ring_transporter'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#555555] border-[#dedede] hover:bg-neutral-100'
            }`}
          >
            <Layers size={14} className={activeSubTab === 'ring_transporter' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>02. Ring Transporters & Matter-Stream Gantry</span>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setActiveSubTab('chevron_rules');
            }}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'chevron_rules'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#555555] border-[#dedede] hover:bg-neutral-100'
            }`}
          >
            <Sparkles size={14} className={activeSubTab === 'chevron_rules' ? 'text-amber-400' : 'text-[#777777]'} />
            <span>03. 7th, 8th & 9th Chevron Dialing Energy Matrix</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 1,000 GATE ROOM TELEMETRY DISPATCHES */}
      {activeSubTab === 'dispatches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Filter Controls and Dispatches List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filters Strip */}
            <div className="border border-[#111111] bg-white p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search size={14} className="text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Filter 1,000 dispatches by code, location, or anomaly..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs font-mono p-1 border border-[#cbd5e1] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-1 border border-[#cbd5e1] text-[11px] bg-white cursor-pointer font-mono"
                >
                  <option value="ALL">All Categories (7)</option>
                  <option value="WORMHOLE_ANOMALY">Wormhole Anomaly</option>
                  <option value="MALP_PROBE">MALP Probe Data</option>
                  <option value="SG_RECON_REPORT">SG Recon Report</option>
                  <option value="SECURITY_BREACH">Security Breach</option>
                  <option value="RESOURCE_SURGE">Resource Surge</option>
                  <option value="ANCIENT_RELIC">Ancient Relic</option>
                  <option value="ALIEN_DIPLOMACY">Alien Diplomacy</option>
                </select>

                <select
                  value={selectedSeverity}
                  onChange={(e) => {
                    setSelectedSeverity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-1 border border-[#cbd5e1] text-[11px] bg-white cursor-pointer font-mono"
                >
                  <option value="ALL">All Severities</option>
                  <option value="ROUTINE">Routine</option>
                  <option value="ELEVATED">Elevated</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="OMEGA">Omega Level</option>
                </select>

                <select
                  value={selectedGalaxy}
                  onChange={(e) => {
                    setSelectedGalaxy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-1 border border-[#cbd5e1] text-[11px] bg-white cursor-pointer font-mono"
                >
                  <option value="ALL">All Galaxies</option>
                  <option value="Milky Way">Milky Way</option>
                  <option value="Pegasus">Pegasus</option>
                  <option value="Ida">Ida</option>
                  <option value="Universe">Universe (Destiny)</option>
                </select>
              </div>
            </div>

            {/* Dispatches Stream */}
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {currentDispatches.map((dispatch) => {
                const isSelected = selectedDispatch.id === dispatch.id;
                const severityColors = {
                  ROUTINE: 'border-slate-300 text-slate-700 bg-slate-50',
                  ELEVATED: 'border-blue-300 text-blue-700 bg-blue-50',
                  CRITICAL: 'border-amber-400 text-amber-800 bg-amber-50',
                  OMEGA: 'border-red-400 text-red-800 bg-red-50',
                };

                return (
                  <div
                    key={dispatch.id}
                    onClick={() => setSelectedDispatch(dispatch)}
                    className={`p-3 border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-[#111111] ring-2 ring-[#111111] shadow-xs'
                        : 'border-[#e2e8f0] hover:border-[#111111]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase border ${severityColors[dispatch.severity]}`}>
                            {dispatch.severity}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#111111]">{dispatch.code}</span>
                          <span className="text-[10px] font-mono text-[#64748b]">[{dispatch.galaxy}] · Gate: {dispatch.sourceGate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#111111]">{dispatch.headline}</h4>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleProcessDispatch(dispatch)}
                          className="px-2.5 py-1 bg-[#111111] hover:bg-[#333333] text-white text-[11px] font-mono font-bold cursor-pointer transition-colors"
                        >
                          Process Telemetry
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="border border-[#111111] bg-white p-2.5 flex items-center justify-between font-mono text-xs">
              <span className="text-[#64748b]">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(filteredDispatches.length, currentPage * ITEMS_PER_PAGE)} of {filteredDispatches.length.toLocaleString()} events
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 border border-[#cbd5e1] hover:border-[#111111] disabled:opacity-40 cursor-pointer"
                >
                  ← Prev
                </button>
                <span className="px-2 font-bold text-[#111111]">
                  Page {currentPage} of {Math.max(1, totalPages)}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-2.5 py-1 border border-[#cbd5e1] hover:border-[#111111] disabled:opacity-40 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dispatch Detail Inspector */}
          <div className="border border-[#111111] bg-white p-5 space-y-4">
            <div className="border-b border-[#e2e8f0] pb-3">
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#111111] text-white uppercase">
                {selectedDispatch.category}
              </span>
              <h3 className="text-base font-black text-[#111111] mt-1">{selectedDispatch.code}</h3>
              <p className="text-xs font-mono text-[#64748b]">
                Target: {selectedDispatch.sourceGate} · Galaxy: {selectedDispatch.galaxy}
              </p>
            </div>

            <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] text-xs font-mono leading-relaxed space-y-2">
              <div className="font-bold text-[#111111]">{selectedDispatch.headline}</div>
              <p className="text-[#475569]">{selectedDispatch.telemetryLog}</p>
            </div>

            {/* Recoverable Assets Payload */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={13} /> SGC RECOVERABLE ASSETS
              </h4>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-2 border border-[#dedede] bg-white text-center">
                  <span className="text-[9px] text-[#64748b] block">NAQUADAH</span>
                  <b className="text-xs text-amber-700">+{selectedDispatch.rewardNaquadah.toLocaleString()}</b>
                </div>
                <div className="p-2 border border-[#dedede] bg-white text-center">
                  <span className="text-[9px] text-[#64748b] block">CRYSTAL</span>
                  <b className="text-xs text-sky-700">+{selectedDispatch.rewardCrystal.toLocaleString()}</b>
                </div>
                <div className="p-2 border border-[#dedede] bg-white text-center">
                  <span className="text-[9px] text-[#64748b] block">DARK MATTER</span>
                  <b className="text-xs text-purple-700">+{selectedDispatch.rewardDarkMatter} DM</b>
                </div>
              </div>
            </div>

            {selectedDispatch.threatDetails && (
              <div className="p-3 bg-red-50 border border-red-300 text-xs font-mono text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle size={14} /> Threat Advisory:
                </div>
                <div>{selectedDispatch.threatDetails}</div>
              </div>
            )}

            <button
              onClick={() => handleProcessDispatch(selectedDispatch)}
              className="w-full py-2.5 bg-[#111111] hover:bg-[#333333] text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
            >
              Transfer Telemetry Data & Claim Booty →
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RING TRANSPORTERS */}
      {activeSubTab === 'ring_transporter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-[#111111] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#111111]" />
              <h3 className="text-base font-bold text-[#111111]">Ring Transporters (Matter-Stream Relays)</h3>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed">
              Ring Transporters transfer expedition teams, tactical shock soldiers, and mined Naquadah crates between
              surface bunkers, subterranean silos, and orbital motherships via high-frequency matter-energy conversion streams.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1 font-mono">1. Select Origin Platform:</label>
                <select
                  value={ringTransitOrigin}
                  onChange={(e) => setRingTransitOrigin(e.target.value)}
                  className="w-full p-2 text-xs border border-[#cbd5e1] bg-white cursor-pointer font-mono"
                >
                  {ringSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.sector}) - Elevation: {site.elevationKm > 0 ? `+${site.elevationKm}` : site.elevationKm} km
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] block mb-1 font-mono">2. Select Destination Platform:</label>
                <select
                  value={ringTransitDestination}
                  onChange={(e) => setRingTransitDestination(e.target.value)}
                  className="w-full p-2 text-xs border border-[#cbd5e1] bg-white cursor-pointer font-mono"
                >
                  {ringSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.sector}) - Elevation: {site.elevationKm > 0 ? `+${site.elevationKm}` : site.elevationKm} km
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Capacitor Transit Power Cost:</span>
                  <b className="text-[#111111]">450 Credits</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Crystal Sensor Health:</span>
                  <b className="text-emerald-700">100% Operational</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Ring Matter Containment:</span>
                  <b className="text-blue-700">Zero Quantum Scattering</b>
                </div>
              </div>

              <button
                disabled={isRingsActivating}
                onClick={handleActivateRingTransporter}
                className="w-full py-3 bg-[#111111] hover:bg-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Zap size={14} className="text-amber-400" />
                <span>{isRingsActivating ? 'Rings Descending... Matter Stream Active' : 'Engage Ring Transporter Stream →'}</span>
              </button>
            </div>
          </div>

          {/* Active Ring Sites Grid */}
          <div className="border border-[#111111] bg-white p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Active Ring Nodes Catalog</h4>
            <div className="space-y-2">
              {ringSites.map((site) => (
                <div key={site.id} className="p-3 border border-[#cbd5e1] bg-[#f8fafc] text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111111]">{site.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#111111] text-white uppercase">{site.locationType}</span>
                  </div>
                  <div className="text-[11px] text-[#64748b]">{site.description}</div>
                  <div className="text-[10px] text-[#64748b] pt-1 flex items-center justify-between border-t border-[#e2e8f0]">
                    <span>Elevation: {site.elevationKm} km</span>
                    <span className="text-emerald-700 font-bold">Crystal Integrity: {site.crystalIntegrityPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CHEVRON DIALING RULES (7, 8 & 9 CHEVRONS) */}
      {activeSubTab === 'chevron_rules' && (
        <div className="space-y-4">
          <div className="border border-[#111111] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#111111]" />
              <h3 className="text-base font-bold text-[#111111]">Stargate Subspace Dialing Mechanics: 7th, 8th & 9th Chevrons</h3>
            </div>
            <p className="text-xs text-[#64748b]">
              The Ancient Stargate network utilizes chevron expansion coordinates depending on the dimensional distance to the target destination.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {Object.values(STARGATE_CHEVRON_RULES).map((rule) => {
                const badgeColors = {
                  7: 'border-emerald-500 bg-emerald-50 text-emerald-800',
                  8: 'border-blue-500 bg-blue-50 text-blue-800',
                  9: 'border-purple-500 bg-purple-50 text-purple-800',
                };

                return (
                  <div key={rule.chevronCount} className="p-4 border border-[#111111] bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-xs font-mono font-bold uppercase border ${badgeColors[rule.chevronCount as 7 | 8 | 9]}`}>
                        {rule.chevronCount} Chevrons
                      </span>
                      <span className="text-sm font-black font-mono text-[#111111]">
                        {rule.turnCost} {rule.turnCost === 1 ? 'Attack Turn' : 'Attack Turns'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#111111]">{rule.name}</h4>
                    <p className="text-xs text-[#475569] leading-relaxed">{rule.description}</p>

                    <div className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-mono space-y-1">
                      <div>• Power Req: <strong>{rule.powerDemandMw} MW</strong></div>
                      <div>• Energy Core: <strong>{rule.energySource}</strong></div>
                      <div>• Scope: <strong>{rule.targetScope}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
