import React, { useState } from 'react';
import {
  Disc,
  Radio,
  Shield,
  Zap,
  Sparkles,
  Layers,
  Rocket,
  Compass,
  History,
  CheckCircle2,
  Atom,
  Globe,
} from 'lucide-react';
import { sound } from '../../sound';
import {
  STARGATE_NETWORK,
  StargateAddress,
} from '../../stargateData';
import { PlayerResources, PlayerProfile } from '../../types';
import { StargateDialerPanel } from './stargate/StargateDialerPanel';
import { StargateAddressDirectory } from './stargate/StargateAddressDirectory';
import { SubspaceJumpGatePanel } from './stargate/SubspaceJumpGatePanel';
import { SupergateCrystalsPanel } from './stargate/SupergateCrystalsPanel';
import { StargateNpcRacesView } from './StargateNpcRacesView';
import { GateTokensSystemView } from './stargate/GateTokensSystemView';
import { GateRoomTelemetryView } from './stargate/GateRoomTelemetryView';

interface StargateNetworkViewProps {
  resources: PlayerResources;
  onUpdateResources: (res: Partial<PlayerResources>) => void;
  profile?: PlayerProfile;
  onUpdateProfile?: (updates: Partial<PlayerProfile>) => void;
  onNavigate?: (route: string) => void;
}

type TabType =
  | 'stargate-dhd'
  | 'telemetry-dispatches'
  | 'address-directory'
  | 'jump-gates'
  | 'supergate-crystals'
  | 'alien-races'
  | 'gate-tokens';

export const StargateNetworkView: React.FC<StargateNetworkViewProps> = ({
  resources,
  onUpdateResources,
  profile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [gates, setGates] = useState<StargateAddress[]>(STARGATE_NETWORK);
  const [selectedGateId, setSelectedGateId] = useState<string>('sg_atlantis');
  const [activeWormhole, setActiveWormhole] = useState<string | null>('sg_atlantis');
  const [irisClosed, setIrisClosed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('stargate-dhd');
  const [feedback, setFeedback] = useState<string | null>(
    'Stargate network active: Connected to Atlantis City-Ship (Lantea) in the Pegasus galaxy.'
  );
  const [logs, setLogs] = useState<string[]>([
    'Subspace event horizon stabilized between Earth Alpha Site and Atlantis.',
    'Jump Gate Relay capacitors synchronized across 4 orbital moon bases.',
  ]);

  const activeGate = gates.find((g) => g.id === selectedGateId) || gates[0];

  const handleLogDebrief = (message: string) => {
    setFeedback(message);
    setLogs((prev) => [message, ...prev.slice(0, 7)]);
  };

  const handleEstablishWormhole = (target: StargateAddress) => {
    setActiveWormhole(target.id);
    setSelectedGateId(target.id);
    setGates((prev) =>
      prev.map((g) =>
        g.id === target.id
          ? { ...g, status: 'connected' }
          : g.status === 'connected'
          ? { ...g, status: 'offline' }
          : g
      )
    );
    handleLogDebrief(`Wormhole established with ${target.name}! Event horizon open and stable.`);
  };

  const handleDisconnectWormhole = () => {
    setActiveWormhole(null);
    setGates((prev) => prev.map((g) => ({ ...g, status: 'offline' })));
    handleLogDebrief('Iris closed. Event horizon collapsed. Stargate wormhole safely disengaged.');
  };

  const handleToggleIris = () => {
    setIrisClosed((prev) => {
      const next = !prev;
      handleLogDebrief(
        next
          ? 'Titanium-Trinium Iris closed! Incoming matter and energy blasts will be disintegrated on contact.'
          : 'Iris opened! Stargate event horizon clear for off-world travel and incoming personnel.'
      );
      return next;
    });
  };

  return (
    <div id="stargate-network-view" className="space-y-6">
      {/* Strategic Header */}
      <div className="border border-[#dedede] bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[9px] font-bold text-[#777777] tracking-[1.5px] uppercase mb-1 font-mono">
            ANCIENT ASTRIA PORTA & SUBSPACE FLEET RELAYS
          </div>
          <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-3">
            <span>Stargate & Interstellar Jump Gates</span>
            <span
              className={`text-xs px-2.5 py-0.5 font-mono uppercase font-bold border ${
                activeWormhole
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-300'
              }`}
            >
              {activeWormhole ? 'Event Horizon Active' : 'Stargate Idle'}
            </span>
          </h2>
          <p className="text-sm text-[#666666] mt-1 max-w-3xl leading-relaxed">
            Dial 7-to-9 chevron addresses through the Dial-Home Device (DHD), dispatch SG reconnaissance teams
            across four galaxies, execute zero-deuterium subspace Jump Gate fleet teleportations, and harness the Ori Supergate.
          </p>
        </div>

        {/* Global Metric Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 bg-[#fafafa] border border-[#dedede] text-right">
            <span className="text-[9px] text-[#777777] uppercase block font-bold">Wormhole Status</span>
            <strong className={`text-xs font-bold block ${activeWormhole ? 'text-sky-700' : 'text-neutral-500'}`}>
              {activeWormhole ? 'CONNECTED' : 'DISCONNECTED'}
            </strong>
          </div>
          <div className="p-3 bg-[#fafafa] border border-[#dedede] text-right">
            <span className="text-[9px] text-[#777777] uppercase block font-bold">Defense Barrier</span>
            <strong className={`text-xs font-bold block ${irisClosed ? 'text-amber-700' : 'text-emerald-700'}`}>
              {irisClosed ? 'IRIS CLOSED' : 'IRIS OPEN'}
            </strong>
          </div>
        </div>
      </div>

      {/* Live Feedback & Alert Notification */}
      {feedback && (
        <div
          id="stargate-feedback-banner"
          className="p-3.5 bg-white border border-[#111111] border-l-4 text-xs font-mono font-semibold flex justify-between items-center shadow-sm"
        >
          <div className="flex items-center gap-2 text-[#111111]">
            <Radio size={14} className="text-sky-600 animate-pulse shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs text-[#777777] hover:text-[#111111] font-bold cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#dedede] pb-3">
        {[
          {
            id: 'stargate-dhd',
            label: '1. Ancient Stargate & DHD Console',
            icon: Disc,
          },
          {
            id: 'telemetry-dispatches',
            label: '2. Gate Room Telemetry & Dispatches (1,000 Events & Rings)',
            icon: Radio,
          },
          {
            id: 'address-directory',
            label: '3. Off-World Address Book & SG Teams',
            icon: Compass,
          },
          {
            id: 'jump-gates',
            label: '4. Subspace Jump Gate Relay (Fleet Transit)',
            icon: Rocket,
          },
          {
            id: 'supergate-crystals',
            label: '5. Ori Supergate & Control Crystals',
            icon: Atom,
          },
          {
            id: 'alien-races',
            label: '6. 18 Stargate Alien Races Dossier',
            icon: Globe,
          },
          {
            id: 'gate-tokens',
            label: '7. Gate Tokens, Anomalies & Raids',
            icon: Sparkles,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => {
                sound.play('click');
                setActiveTab(tab.id as TabType);
              }}
              className={`py-2 px-3.5 text-xs font-bold uppercase tracking-wider font-mono border transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                  : 'bg-white text-[#555555] border-[#dedede] hover:border-[#111111] hover:text-[#111111]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-amber-400' : 'text-[#777777]'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Stargate & DHD Dialer Console */}
      {activeTab === 'stargate-dhd' && (
        <StargateDialerPanel
          activeGate={activeGate}
          activeWormhole={activeWormhole}
          irisClosed={irisClosed}
          onToggleIris={handleToggleIris}
          onEstablishWormhole={handleEstablishWormhole}
          onDisconnectWormhole={handleDisconnectWormhole}
          resources={resources}
          onUpdateResources={onUpdateResources}
        />
      )}

      {/* Tab 2: Gate Room Telemetry & Dispatches (1,000 Events & Rings) */}
      {activeTab === 'telemetry-dispatches' && (
        <GateRoomTelemetryView
          resources={resources}
          onUpdateResources={onUpdateResources}
          onLogDebrief={handleLogDebrief}
        />
      )}

      {/* Tab 3: Stargate Address Directory & SG Teams */}
      {activeTab === 'address-directory' && (
        <StargateAddressDirectory
          gates={gates}
          selectedGateId={selectedGateId}
          onSelectGate={(gate) => {
            setSelectedGateId(gate.id);
            setActiveTab('stargate-dhd');
          }}
          activeWormhole={activeWormhole}
          resources={resources}
          onUpdateResources={onUpdateResources}
          onLogDebrief={handleLogDebrief}
          onIncrementStargateCount={() => {
            // increment career stats if applicable
            if (profile && onUpdateProfile) {
              onUpdateProfile({});
            }
          }}
        />
      )}

      {/* Tab 3: Subspace Jump Gate Network (Fleet Relays) */}
      {activeTab === 'jump-gates' && (
        <SubspaceJumpGatePanel
          resources={resources}
          onUpdateResources={onUpdateResources}
          onLogDebrief={handleLogDebrief}
        />
      )}

      {/* Tab 4: Ori Supergate & Ancient Crystals */}
      {activeTab === 'supergate-crystals' && (
        <SupergateCrystalsPanel
          resources={resources}
          onUpdateResources={onUpdateResources}
          onLogDebrief={handleLogDebrief}
        />
      )}

      {/* Tab 5: 18 Stargate Alien Races Dossier */}
      {activeTab === 'alien-races' && (
        <StargateNpcRacesView
          playerProfile={profile || {
            id: 'p1',
            username: 'Commander',
            displayName: 'Commander',
            race: 'tauri',
            governmentId: 'sgc_treaty',
            rankName: 'Major General',
            rankLevel: 5,
            glory: 1000,
            reputation: 1000,
            defconLevel: 2,
            vacationUntil: null,
            ascended: false,
            lastTurnAt: new Date().toISOString(),
          }}
          resources={resources}
          onNavigate={onNavigate}
        />
      )}

      {/* Tab 6: Gate Tokens, Anomalies & Raids */}
      {activeTab === 'gate-tokens' && (
        <GateTokensSystemView
          resources={resources}
          onUpdateResources={onUpdateResources}
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onNavigate={onNavigate}
        />
      )}

      {/* Bottom Subspace Telemetry Transit Logs */}
      <div className="border border-[#dedede] bg-white p-5 space-y-2">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
          <div className="flex items-center gap-2">
            <History size={14} className="text-[#555555]" />
            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono">
              Galactic Gate Network Transit Telemetry Logs
            </h4>
          </div>
          <span className="text-[10px] text-[#777777] font-mono">Real-time Subspace Feed</span>
        </div>

        <div className="space-y-1 font-mono text-xs text-[#555555]">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 py-0.5">
              <span className="text-[10px] text-[#999999] shrink-0">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-[#333333]">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
