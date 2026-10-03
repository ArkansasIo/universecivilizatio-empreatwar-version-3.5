import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Shield,
  Gauge,
  Rocket,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { sound } from '../../../sound';
import { OGameUniverseConfig } from '../../../types';

interface AdminUniverseConfigTabProps {
  universeConfig: OGameUniverseConfig;
  onUpdateUniverseConfig: (updates: Partial<OGameUniverseConfig>) => void;
}

export const AdminUniverseConfigTab: React.FC<AdminUniverseConfigTabProps> = ({
  universeConfig,
  onUpdateUniverseConfig,
}) => {
  const [localConfig, setLocalConfig] = useState<OGameUniverseConfig>(universeConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUniverseConfig(localConfig);
    sound.play('confirm');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePreset = (preset: 'standard' | 'speed_10x' | 'hardcore_war' | 'hyper_eco') => {
    sound.play('click');
    if (preset === 'standard') {
      setLocalConfig((prev) => ({
        ...prev,
        gameSpeed: 1,
        fleetSpeed: 1,
        resourceSpeed: 1,
        defToDebrisPercent: 0,
        fleetToDebrisPercent: 30,
        moonChanceCapPercent: 20,
        energyMultiplier: 1.0,
      }));
    } else if (preset === 'speed_10x') {
      setLocalConfig((prev) => ({
        ...prev,
        gameSpeed: 10,
        fleetSpeed: 5,
        resourceSpeed: 10,
        defToDebrisPercent: 30,
        fleetToDebrisPercent: 70,
        moonChanceCapPercent: 20,
        energyMultiplier: 2.0,
      }));
    } else if (preset === 'hardcore_war') {
      setLocalConfig((prev) => ({
        ...prev,
        gameSpeed: 20,
        fleetSpeed: 10,
        resourceSpeed: 15,
        defToDebrisPercent: 70,
        fleetToDebrisPercent: 80,
        moonChanceCapPercent: 40,
        energyMultiplier: 3.0,
      }));
    } else if (preset === 'hyper_eco') {
      setLocalConfig((prev) => ({
        ...prev,
        gameSpeed: 50,
        fleetSpeed: 5,
        resourceSpeed: 100,
        defToDebrisPercent: 10,
        fleetToDebrisPercent: 50,
        moonChanceCapPercent: 30,
        energyMultiplier: 5.0,
      }));
    }
  };

  return (
    <div id="admin-universe-config-tab" className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#111111] bg-[#111111] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-400 text-[#111111] text-[10px] font-mono font-extrabold uppercase">
              2Moons & XNova Engine Core
            </span>
            <span className="text-xs font-mono text-[#aaaaaa]">Server Master Engine</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Universe Civilization: Empire at War Physics & Engine Rules</h3>
          <p className="text-xs text-[#cccccc] max-w-2xl mt-1">
            Configure global gameplay multipliers, fleet speeds, debris ratios, beginner protection,
            and server maintenance status for this realm.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePreset('standard')}
            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono border border-white/20 transition-colors cursor-pointer"
          >
            1x Classic
          </button>
          <button
            type="button"
            onClick={() => handlePreset('speed_10x')}
            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#111111] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            10x Standard
          </button>
          <button
            type="button"
            onClick={() => handlePreset('hardcore_war')}
            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            War Realm (70% Df)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('hyper_eco')}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Hyper Eco (100x)
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Universe Identifiers */}
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
            <Gauge size={18} className="text-amber-600" />
            <h4 className="font-bold text-sm text-[#111111]">1. Universe Identity & Status</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Universe / Realm Name
              </label>
              <input
                type="text"
                value={localConfig.universeName}
                onChange={(e) => setLocalConfig({ ...localConfig, universeName: e.target.value })}
                className="w-full p-2.5 border border-[#cccccc] bg-[#fafafa] text-sm font-mono focus:border-[#111111] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Server Maintenance Mode
              </label>
              <div className="flex items-center gap-3 h-10">
                <button
                  type="button"
                  onClick={() =>
                    setLocalConfig({ ...localConfig, maintenanceMode: !localConfig.maintenanceMode })
                  }
                  className={`px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer border ${
                    localConfig.maintenanceMode
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-[#f0f0f0] text-[#333333] border-[#cccccc] hover:bg-[#e4e4e4]'
                  }`}
                >
                  <Lock size={14} />
                  <span>
                    {localConfig.maintenanceMode ? 'MAINTENANCE LOCKDOWN (ON)' : 'SERVER ONLINE (OFF)'}
                  </span>
                </button>
                <span className="text-[11px] text-[#777777] font-mono">
                  {localConfig.maintenanceMode
                    ? 'Only Administrators can log in'
                    : 'Open to all players'}
                </span>
              </div>
            </div>

            {localConfig.maintenanceMode && (
              <div className="md:col-span-2">
                <label className="block text-xs font-mono font-bold text-red-700 mb-1">
                  Maintenance Notice Message (Shown to locked-out players)
                </label>
                <input
                  type="text"
                  value={localConfig.maintenanceNotice}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, maintenanceNotice: e.target.value })
                  }
                  className="w-full p-2.5 border border-red-300 bg-red-50/50 text-xs font-mono focus:border-red-600 outline-hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Global Multipliers */}
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
            <Sliders size={18} className="text-indigo-600" />
            <h4 className="font-bold text-sm text-[#111111]">
              2. Simulation Velocities & Multipliers
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Game Speed */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Game Speed</span>
                <span className="text-sm font-mono font-bold text-indigo-700">
                  {localConfig.gameSpeed}x
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={localConfig.gameSpeed}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, gameSpeed: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-[#777777]">Building & research tick rate</span>
            </div>

            {/* Fleet Speed */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Fleet Flying Speed</span>
                <span className="text-sm font-mono font-bold text-sky-700">
                  {localConfig.fleetSpeed}x
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={localConfig.fleetSpeed}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, fleetSpeed: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-sky-600"
              />
              <span className="text-[10px] text-[#777777]">Attack & transport flight time</span>
            </div>

            {/* Resource Speed */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Resource Production</span>
                <span className="text-sm font-mono font-bold text-emerald-700">
                  {localConfig.resourceSpeed}x
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="250"
                step="1"
                value={localConfig.resourceSpeed}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, resourceSpeed: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-emerald-600"
              />
              <span className="text-[10px] text-[#777777]">Mine output rate multiplier</span>
            </div>

            {/* Energy Factor */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Energy Multiplier</span>
                <span className="text-sm font-mono font-bold text-amber-700">
                  {localConfig.energyMultiplier}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={localConfig.energyMultiplier}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, energyMultiplier: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-amber-600"
              />
              <span className="text-[10px] text-[#777777]">Solar & Fusion power generation</span>
            </div>
          </div>
        </div>

        {/* Combat & Debris Field Mechanics */}
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
            <Rocket size={18} className="text-red-600" />
            <h4 className="font-bold text-sm text-[#111111]">
              3. Combat, Debris Fields & Lunar Generation
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Def to Debris */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Defense to Debris</span>
                <span className="text-sm font-mono font-bold text-red-700">
                  {localConfig.defToDebrisPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={localConfig.defToDebrisPercent}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, defToDebrisPercent: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-red-600"
              />
              <span className="text-[10px] text-[#777777]">0% = OGame Classic; 30-70% = War</span>
            </div>

            {/* Fleet to Debris */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Fleet to Debris</span>
                <span className="text-sm font-mono font-bold text-red-700">
                  {localConfig.fleetToDebrisPercent}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={localConfig.fleetToDebrisPercent}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, fleetToDebrisPercent: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-red-600"
              />
              <span className="text-[10px] text-[#777777]">30% default, 70% in high-debris realms</span>
            </div>

            {/* Moon Chance Cap */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Moon Creation Cap</span>
                <span className="text-sm font-mono font-bold text-purple-700">
                  {localConfig.moonChanceCapPercent}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={localConfig.moonChanceCapPercent}
                onChange={(e) =>
                  setLocalConfig({ ...localConfig, moonChanceCapPercent: Number(e.target.value) })
                }
                className="w-full cursor-pointer accent-purple-600"
              />
              <span className="text-[10px] text-[#777777]">Max % probability on battle loss</span>
            </div>

            {/* Deuterium Consumption */}
            <div className="p-3 border border-[#dedede] bg-[#fafafa]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-[#333333]">Deut Fuel Factor</span>
                <span className="text-sm font-mono font-bold text-cyan-700">
                  {localConfig.deutConsumptionFactor}x
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={localConfig.deutConsumptionFactor}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    deutConsumptionFactor: Number(e.target.value),
                  })
                }
                className="w-full cursor-pointer accent-cyan-600"
              />
              <span className="text-[10px] text-[#777777]">Fleet fuel burn during flight</span>
            </div>
          </div>
        </div>

        {/* Protection & Governance */}
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-3">
            <Shield size={18} className="text-emerald-600" />
            <h4 className="font-bold text-sm text-[#111111]">
              4. Beginner Protection & Rule Enforcement
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Noob Protection Points Cap
              </label>
              <input
                type="number"
                value={localConfig.beginnerProtectionPoints}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    beginnerProtectionPoints: Number(e.target.value),
                  })
                }
                className="w-full p-2 border border-[#cccccc] bg-[#fafafa] text-xs font-mono focus:border-[#111111] outline-hidden"
              />
              <span className="text-[10px] text-[#777777]">
                Players under this score are immune to high-tier raids
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Attack Ratio Limit (e.g. 1:5)
              </label>
              <input
                type="number"
                value={localConfig.beginnerProtectionRatio}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    beginnerProtectionRatio: Number(e.target.value),
                  })
                }
                className="w-full p-2 border border-[#cccccc] bg-[#fafafa] text-xs font-mono focus:border-[#111111] outline-hidden"
              />
              <span className="text-[10px] text-[#777777]">
                Targets must have at least 1/X of attacker points
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#555555] mb-1">
                Inactive Account Purge (Days)
              </label>
              <input
                type="number"
                value={localConfig.inactivePurgeDays}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    inactivePurgeDays: Number(e.target.value),
                  })
                }
                className="w-full p-2 border border-[#cccccc] bg-[#fafafa] text-xs font-mono focus:border-[#111111] outline-hidden"
              />
              <span className="text-[10px] text-[#777777]">
                Convert to ghost planets after N days of inactivity
              </span>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 bg-[#f7f7f7] border border-[#dedede]">
          <div className="flex items-center gap-2">
            {savedSuccess ? (
              <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                Universe physics parameters updated successfully!
              </span>
            ) : (
              <span className="text-xs text-[#777777] font-mono flex items-center gap-1.5">
                <Info size={14} />
                Changes apply instantly across all galaxy nodes.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#111111] hover:bg-emerald-600 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Apply Physics & Universe Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
