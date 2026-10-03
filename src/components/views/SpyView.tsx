import React, { useState } from 'react';
import { Eye, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { sound } from '../../sound';
import { CovertMissionRecord, PlayerProfile, PlayerResources, TargetRealm } from '../../types';

interface SpyViewProps {
  profile: PlayerProfile;
  resources: PlayerResources;
  targets: TargetRealm[];
  defaultMode?: 'recon' | 'sabotage';
  onExecuteMission: (
    targetId: string,
    type: 'recon' | 'spy' | 'sabotage',
    agents: number
  ) => { success: boolean; message: string; mission?: CovertMissionRecord };
  onNavigate: (route: string) => void;
}

export const SpyView: React.FC<SpyViewProps> = ({
  profile,
  resources,
  targets,
  defaultMode = 'recon',
  onExecuteMission,
  onNavigate,
}) => {
  const [missionType, setMissionType] = useState<'recon' | 'spy' | 'sabotage'>(defaultMode);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targets[0]?.id || '');
  const [agentsToSend, setAgentsToSend] = useState<number>(Math.min(25, Math.max(1, resources.spies)));
  const [lastMission, setLastMission] = useState<CovertMissionRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTarget = targets.find((t) => t.id === selectedTargetId);

  const handleLaunchMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;

    if (resources.spies < agentsToSend) {
      sound.play('warning');
      setErrorMsg('Insufficient covert agents available.');
      return;
    }

    const result = onExecuteMission(selectedTarget.id, missionType, agentsToSend);
    if (result.success && result.mission) {
      if (result.mission.success) {
        sound.play('success');
      } else {
        sound.play('warning');
      }
      setLastMission(result.mission);
      setErrorMsg(null);
    } else {
      sound.play('warning');
      setErrorMsg(result.message);
    }
  };

  return (
    <div id="spy-view" className="space-y-6">
      <div className="border border-[#dedede] bg-white p-6">
        <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1">
          INTELLIGENCE BUREAU · COVERT OPERATIONS
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">
          {missionType === 'sabotage' ? 'Covert Sabotage Operations' : 'Espionage & Reconnaissance'}
        </h2>
        <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
          Deploy covert agents through secondary stargates to bypass outer defenses. Gather detailed
          defense telemetry or sabotage enemy infrastructure before a major orbital assault.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#fff5f5] border border-[#dc2626] border-l-4 text-[#dc2626] text-xs font-semibold flex justify-between items-center">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Mission Outcome Banner */}
      {lastMission && (
        <div className="border-2 border-[#111111] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
            <div className="flex items-center gap-2">
              {lastMission.success ? (
                <CheckCircle2 size={20} className="text-[#111111]" />
              ) : (
                <ShieldAlert size={20} className="text-[#dc2626]" />
              )}
              <h3 className="font-bold text-base text-[#111111] uppercase tracking-wide">
                Mission Report: {lastMission.success ? 'Infiltration Succeeded' : 'Operation Intercepted'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setLastMission(null)}
              className="text-xs font-bold text-[#888888] hover:text-[#111111]"
            >
              Dismiss ✕
            </button>
          </div>

          <div className="text-xs space-y-2">
            <p className="text-[#111111] font-semibold">{lastMission.resultText}</p>
            {lastMission.intel && (
              <div className="grid grid-cols-3 gap-3 bg-[#fafafa] border border-[#dedede] p-4 mt-2">
                <div>
                  <span className="block text-[10px] text-[#777777] uppercase font-bold">
                    Target Defense Troops
                  </span>
                  <strong className="block text-sm font-mono text-[#111111]">
                    {lastMission.intel.defenseUnits.toLocaleString()} units
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] text-[#777777] uppercase font-bold">
                    Target Strike Troops
                  </span>
                  <strong className="block text-sm font-mono text-[#111111]">
                    {lastMission.intel.attackUnits.toLocaleString()} units
                  </strong>
                </div>
                <div>
                  <span className="block text-[10px] text-[#777777] uppercase font-bold">
                    Unprotected Naquadah
                  </span>
                  <strong className="block text-sm font-mono text-[#111111]">
                    {lastMission.intel.naquadah.toLocaleString()} NQ
                  </strong>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs pt-2">
            <span className="text-[#666666]">
              Agents deployed: <b className="text-[#111111] font-mono">{lastMission.agentsSent}</b> ·{' '}
              {lastMission.detected ? 'Enemy alert triggered' : 'Undetected departure'}
            </span>
            <button
              type="button"
              onClick={() => {
                sound.play('click');
                onNavigate('enemy-intelligence');
              }}
              className="font-bold text-[#111111] hover:underline"
            >
              Open Intelligence Archives →
            </button>
          </div>
        </div>
      )}

      {/* Grid: Target List and Mission Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 border border-[#dedede] bg-white p-6">
          <div className="border-b border-[#eeeeee] pb-4 mb-4">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
              Select Reconnaissance Target
            </h3>
          </div>

          <div className="divide-y divide-[#eeeeee] text-xs">
            {targets.map((tgt) => {
              const isSelected = selectedTargetId === tgt.id;
              return (
                <div
                  key={tgt.id}
                  onClick={() => {
                    sound.play('click');
                    setSelectedTargetId(tgt.id);
                  }}
                  className={`py-3.5 px-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#f5f5f5] border-l-4 border-[#111111]' : 'hover:bg-[#fafafa]'
                  }`}
                >
                  <div>
                    <strong className="block text-sm text-[#111111]">{tgt.commanderName}</strong>
                    <small className="text-[#777777]">
                      {tgt.race} · Counter-Intel Level {tgt.antiCovertLevel}
                    </small>
                  </div>
                  <span className="font-mono text-xs text-[#555555]">
                    Est. Score: {tgt.score.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 border border-[#dedede] bg-white p-6 space-y-5">
          <div className="border-b border-[#eeeeee] pb-3">
            <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
              Covert Mission Parameters
            </h3>
            <span className="text-xs text-[#777777] block mt-0.5">
              Target: <b className="text-[#111111]">{selectedTarget?.commanderName}</b>
            </span>
          </div>

          <form onSubmit={handleLaunchMission} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-2">
                Mission Directive
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMissionType('recon')}
                  className={`py-2 text-[11px] font-bold uppercase transition-colors border ${
                    missionType === 'recon'
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#555555] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  Recon
                </button>
                <button
                  type="button"
                  onClick={() => setMissionType('spy')}
                  className={`py-2 text-[11px] font-bold uppercase transition-colors border ${
                    missionType === 'spy'
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#555555] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  Infiltrate
                </button>
                <button
                  type="button"
                  onClick={() => setMissionType('sabotage')}
                  className={`py-2 text-[11px] font-bold uppercase transition-colors border ${
                    missionType === 'sabotage'
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#555555] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  Sabotage
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                  Agents to Dispatch
                </label>
                <span className="font-mono text-xs font-bold text-[#111111]">
                  {agentsToSend} Agents ({resources.spies} ready)
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.max(1, resources.spies)}
                value={agentsToSend}
                onChange={(e) => setAgentsToSend(parseInt(e.target.value, 10))}
                className="w-full accent-[#111111]"
              />
              <div className="flex justify-between text-[10px] text-[#888888] mt-1">
                <span>1 Agent</span>
                <span>Max {resources.spies} Agents</span>
              </div>
            </div>

            <div className="border border-[#eeeeee] bg-[#fafafa] p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#666666]">Covert Race Modifier:</span>
                <b className="font-mono text-[#111111]">
                  {profile.race === 'replicator' ? '+25% (Replicator)' : '1.0x'}
                </b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Estimated Stealth Rating:</span>
                <b className="font-mono text-[#111111]">{agentsToSend * 18} pts</b>
              </div>
            </div>

            <button
              type="submit"
              id="launch-covert-btn"
              disabled={resources.spies < 1 || selectedTarget?.isProtected}
              className="w-full py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye size={15} />
              <span>Infiltrate Stargate Network →</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
