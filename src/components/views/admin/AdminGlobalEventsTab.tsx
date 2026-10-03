import React from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Play,
  Pause,
  AlertCircle,
  DollarSign,
  Flame,
  Rocket,
} from 'lucide-react';
import { sound } from '../../../sound';
import { AdminGlobalEvent } from '../../../types';

interface AdminGlobalEventsTabProps {
  events: AdminGlobalEvent[];
  onToggleEvent: (eventId: string) => void;
}

export const AdminGlobalEventsTab: React.FC<AdminGlobalEventsTabProps> = ({
  events,
  onToggleEvent,
}) => {
  return (
    <div id="admin-global-events-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-400 text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              2Moons Galaxy Event Matrix
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">
              {events.filter((e) => e.active).length} Active Universe Events
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Global Universe Events & Happy Hours</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Instantly ignite server-wide Happy Hour Dark Matter boosts, Debris Field Harvesting
            Festivals, Subspace Speed Overdrives, and NPC Pirate Incursions.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => {
          return (
            <div
              key={event.id}
              className={`p-5 border bg-white space-y-4 transition-all ${
                event.active
                  ? 'border-amber-500 shadow-sm bg-gradient-to-br from-white to-amber-50/20'
                  : 'border-[#dedede] opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                        event.active
                          ? 'bg-amber-400 text-[#111111]'
                          : 'bg-[#eeeeee] text-[#777777]'
                      }`}
                    >
                      {(event.eventType || event.type || 'global_event').replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-mono font-bold text-[#111111]">
                      {event.multiplierDescription || `${event.multiplier || 2}x Multiplier`}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#111111]">{event.name || event.title}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.play('confirm');
                    onToggleEvent(event.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    event.active
                      ? 'bg-amber-500 hover:bg-amber-600 text-[#111111] border-amber-600'
                      : 'bg-white hover:bg-[#f0f0f0] text-[#333333] border-[#cccccc]'
                  }`}
                >
                  {event.active ? <Pause size={13} /> : <Play size={13} />}
                  <span>{event.active ? 'EVENT ACTIVE (STOP)' : 'ACTIVATE EVENT'}</span>
                </button>
              </div>

              <p className="text-xs text-[#555555] leading-relaxed">{event.description}</p>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#777777] pt-2 border-t border-[#eeeeee]">
                <span>Status: <strong>{event.active ? 'LIVE IN UNIVERSE' : 'STANDBY'}</strong></span>
                <span>Scheduled End: {event.endsAt || event.endTime || 'Ongoing Event'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
