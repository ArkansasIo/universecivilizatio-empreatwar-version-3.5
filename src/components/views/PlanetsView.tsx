import React, { useState, useMemo } from 'react';
import {
  Globe,
  Shield,
  Zap,
  ArrowUpRight,
  Sparkles,
  Layers,
  Flame,
  Radio,
  Coins,
  Building,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Edit2,
  Check,
  X,
  RefreshCw,
  Rocket,
  Compass,
  Crosshair,
  User,
  Sliders,
  PieChart,
  Activity,
  Award,
  Plus,
  Minus,
  Wheat,
  Droplet,
  Users,
  AlertOctagon,
  TrendingDown,
  HeartPulse,
  Syringe,
  Filter,
  LifeBuoy,
  TrendingUp,
  Pickaxe,
} from 'lucide-react';
import { sound } from '../../sound';
import { PlanetColony, PlayerResources, PlanetaryHazard, PlanetaryLifeSupport, PopulationStrataDistribution } from '../../types';
import {
  calculateColonyMaintenance,
  getColonyMaintenanceDetails,
  getEmpireColonialSummary,
} from '../../utils/colonyCalculations';
import { PlanetDetailModal } from '../modals/PlanetDetailModal';

interface PlanetsViewProps {
  resources: PlayerResources;
  planets: PlanetColony[];
  onUpgradePlanet?: (planetId: string) => { success: boolean; message: string };
  onUpdatePlanets?: (planets: PlanetColony[]) => void;
  onUpdateResources?: (res: Partial<PlayerResources>) => void;
  onNavigate?: (route: string) => void;
  defaultPlanetId?: string;
  defaultSubTab?: 'overview' | 'life-support' | 'population' | 'hazards' | 'plunge' | 'mines' | 'facilities' | 'defenses' | 'moon' | 'governance' | 'all-worlds';
}

type SubMenuTab = 'overview' | 'life-support' | 'population' | 'hazards' | 'plunge' | 'mines' | 'facilities' | 'defenses' | 'moon' | 'governance' | 'all-worlds';

export const PlanetsView: React.FC<PlanetsViewProps> = ({
  resources,
  planets,
  onUpgradePlanet,
  onUpdatePlanets,
  onUpdateResources,
  onNavigate,
  defaultPlanetId,
  defaultSubTab = 'overview',
}) => {
  const [activePlanetId, setActivePlanetId] = useState<string>(() => {
    if (defaultPlanetId && planets.some((p) => p.id === defaultPlanetId)) {
      return defaultPlanetId;
    }
    const saved = localStorage.getItem('uc_active_selected_planet_id');
    if (saved && planets.some((p) => p.id === saved)) {
      return saved;
    }
    const hw = planets.find((p) => p.isHomeworld) || planets[0];
    return hw ? hw.id : 'pl-homeworld';
  });

  const [activeTab, setActiveTab] = useState<SubMenuTab>(defaultSubTab);

  React.useEffect(() => {
    if (defaultSubTab) {
      setActiveTab(defaultSubTab);
    }
  }, [defaultSubTab]);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [customNameInput, setCustomNameInput] = useState<string>('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Active Selected Planet
  const activePlanet = useMemo(() => {
    return planets.find((p) => p.id === activePlanetId) || planets[0] || {
      id: 'pl-homeworld',
      name: 'Homeworld Earth (Tau\'ri Command)',
      coordinate: '1:204:8',
      biome: 'Temperate Continental',
      level: 5,
      incomeBonus: 35000,
      defenseBonus: 65000,
      moonName: 'Luna Prime',
      jumpGateLevel: 2,
      isHomeworld: true,
      fieldsUsed: 84,
      fieldsMax: 188,
      temperature: '+18°C',
      diameterKm: 12742,
      hasMoon: true,
    };
  }, [planets, activePlanetId]);

  const handleSelectPlanet = (id: string) => {
    sound.play('click');
    setActivePlanetId(id);
    localStorage.setItem('uc_active_selected_planet_id', id);
  };

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [modalPlanet, setModalPlanet] = useState<PlanetColony | null>(null);

  const handleOpenPlanetModal = (p?: PlanetColony) => {
    sound.play('click');
    setModalPlanet(p || activePlanet);
    setIsDetailModalOpen(true);
  };

  // Colony Maintenance & Expansion Analytics
  const activePlanetMaintenance = useMemo(() => {
    return getColonyMaintenanceDetails(activePlanet, planets.length);
  }, [activePlanet, planets.length]);

  const empireColonialSummary = useMemo(() => {
    return getEmpireColonialSummary(planets);
  }, [planets]);

  const handleUpgradeColonyTier = (planetId: string) => {
    if (onUpgradePlanet) {
      const res = onUpgradePlanet(planetId);
      if (res.success) {
        sound.play('confirm');
        setNotice({ type: 'success', text: res.message });
      } else {
        sound.play('warning');
        setNotice({ type: 'error', text: res.message });
      }
    }
  };

  const handleSavePlanetName = () => {
    if (!customNameInput.trim()) return;
    sound.play('confirm');
    if (onUpdatePlanets) {
      const updated = planets.map((p) => (p.id === activePlanet.id ? { ...p, name: customNameInput.trim() } : p));
      onUpdatePlanets(updated);
    }
    setEditingName(false);
    setNotice({ type: 'success', text: `World renamed to "${customNameInput.trim()}" successfully.` });
  };

  // Generic building upgrade handler
  const handleUpgradeFacilityOrMine = (
    category: 'mines' | 'facilities' | 'defenses' | 'lunarBase',
    key: string,
    metalCost: number,
    crystalCost: number,
    deutCost: number,
    nqCost: number
  ) => {
    if (
      resources.metal < metalCost ||
      resources.crystal < crystalCost ||
      resources.deuterium < deutCost ||
      resources.naquadah < nqCost
    ) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: `Insufficient resources! Upgrade requires ${metalCost ? `${metalCost.toLocaleString()} Metal ` : ''}${
          crystalCost ? `${crystalCost.toLocaleString()} Crystal ` : ''
        }${deutCost ? `${deutCost.toLocaleString()} Deut ` : ''}${nqCost ? `${nqCost.toLocaleString()} Naquadah` : ''}`,
      });
      return;
    }

    // Deduct resources
    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - metalCost,
        crystal: resources.crystal - crystalCost,
        deuterium: resources.deuterium - deutCost,
        naquadah: resources.naquadah - nqCost,
      });
    }

    // Update planet state
    if (onUpdatePlanets) {
      const updatedPlanets = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        const currentCat = (p as any)[category] || {};
        const currentLvl = currentCat[key] || 0;
        const updatedCat = {
          ...currentCat,
          [key]: currentLvl + 1,
        };

        const newFieldsUsed = (p.fieldsUsed || 40) + 1;
        return {
          ...p,
          [category]: updatedCat,
          fieldsUsed: Math.min(p.fieldsMax || 188, newFieldsUsed),
        };
      });
      onUpdatePlanets(updatedPlanets);
    }

    sound.play('research');
    setNotice({
      type: 'success',
      text: `Upgrade initiated on ${activePlanet.name}! [${key}] upgraded to next level.`,
    });
  };

  // Specialization Switcher
  const handleSetSpecialization = (spec: PlanetColony['specialization']) => {
    if (!onUpdatePlanets) return;
    sound.play('confirm');
    const updated = planets.map((p) => (p.id === activePlanet.id ? { ...p, specialization: spec } : p));
    onUpdatePlanets(updated);
    setNotice({ type: 'success', text: `Colonial doctrine updated to "${spec?.toUpperCase()}".` });
  };

  // Tax policy switcher
  const handleSetTaxPolicy = (tax: 'balanced' | 'extractive' | 'subsidized') => {
    if (!onUpdatePlanets) return;
    sound.play('confirm');
    const updated = planets.map((p) => (p.id === activePlanet.id ? { ...p, taxPolicy: tax } : p));
    onUpdatePlanets(updated);
    setNotice({ type: 'success', text: `Tax directive set to "${tax.toUpperCase()}".` });
  };

  // 1. Life Support Facility Upgrade Handler
  const handleUpgradeLifeSupport = (
    key: keyof PlanetaryLifeSupport,
    metalCost: number,
    crystalCost: number,
    deutCost: number,
    nqCost: number
  ) => {
    if (
      resources.metal < metalCost ||
      resources.crystal < crystalCost ||
      resources.deuterium < deutCost ||
      resources.naquadah < nqCost
    ) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: `Insufficient resources for life support upgrade! Requires ${metalCost ? `${metalCost.toLocaleString()} Metal ` : ''}${
          crystalCost ? `${crystalCost.toLocaleString()} Crystal ` : ''
        }${deutCost ? `${deutCost.toLocaleString()} Deut ` : ''}${nqCost ? `${nqCost.toLocaleString()} NQ` : ''}`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - metalCost,
        crystal: resources.crystal - crystalCost,
        deuterium: resources.deuterium - deutCost,
        naquadah: resources.naquadah - nqCost,
      });
    }

    if (onUpdatePlanets) {
      const updatedPlanets = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        const currentLifeSupport: PlanetaryLifeSupport = p.lifeSupportFacilities || {
          hydroponicsDomes: 4,
          bioFarms: 3,
          geneticCropLabs: 2,
          deepAquiferPumps: 3,
          moistureCondensers: 2,
          desalinationPlants: 2,
          subsurfaceCisterns: 2,
          atmosphereScrubbers: 2,
        };
        const currentLvl = currentLifeSupport[key] || 0;
        const newLvl = currentLvl + 1;
        const newFacilities = {
          ...currentLifeSupport,
          [key]: newLvl,
        };

        let newWaterCapacity = p.waterCapacity || 120000;
        if (key === 'subsurfaceCisterns') {
          newWaterCapacity += 30000;
        }

        const newFoodProd = Math.round(
          ((newFacilities.hydroponicsDomes * 28 + newFacilities.bioFarms * 42 + 30) * (1 + newFacilities.geneticCropLabs * 0.15)) * 360
        );
        const newWaterProd = Math.round(
          (newFacilities.deepAquiferPumps * 32 + newFacilities.moistureCondensers * 20 + newFacilities.desalinationPlants * 38 + 35) * 360
        );

        return {
          ...p,
          lifeSupportFacilities: newFacilities,
          waterCapacity: newWaterCapacity,
          foodProductionRate: newFoodProd,
          waterProductionRate: newWaterProd,
        };
      });
      onUpdatePlanets(updatedPlanets);
    }

    const prevVal = activePlanet.lifeSupportFacilities ? activePlanet.lifeSupportFacilities[key] : 0;
    sound.play('research');
    setNotice({
      type: 'success',
      text: `Life support upgraded! [${String(key)}] increased to Tier ${prevVal + 1}.`,
    });
  };

  // Adjust Strata Population Allocation
  const handleAdjustStrata = (strataKey: keyof PopulationStrataDistribution, delta: number) => {
    if (!onUpdatePlanets) return;
    const currentPop = activePlanet.population;
    if (!currentPop) return;

    const strata: PopulationStrataDistribution = {
      farmers: currentPop.strata?.farmers || 2500000,
      hydrologists: currentPop.strata?.hydrologists || 1500000,
      miners: currentPop.strata?.miners || 3500000,
      industrialWorkers: currentPop.strata?.industrialWorkers || 4000000,
      scientists: currentPop.strata?.scientists || 1200000,
      administrators: currentPop.strata?.administrators || 500000,
      militaryRecruits: currentPop.strata?.militaryRecruits || 1000000,
    };

    const currentVal = Number(strata[strataKey] || 0);
    const newVal = Math.max(0, currentVal + delta);
    const actualDelta = newVal - currentVal;
    if (actualDelta === 0) return;

    // Balance delta against other strata
    const strataKeys: (keyof PopulationStrataDistribution)[] = [
      'farmers',
      'hydrologists',
      'miners',
      'industrialWorkers',
      'scientists',
      'administrators',
      'militaryRecruits',
    ];
    const otherKeys = strataKeys.filter((k) => k !== strataKey);
    const totalOthers = otherKeys.reduce((sum, k) => sum + Number(strata[k] || 0), 0);

    if (totalOthers <= 0 && actualDelta > 0) {
      setNotice({ type: 'error', text: 'No available workforce in other strata to reassign.' });
      return;
    }

    sound.play('click');
    let remainingToDeduct = actualDelta;
    for (const key of otherKeys) {
      if (remainingToDeduct === 0) break;
      const share = Math.round((Number(strata[key]) / (totalOthers || 1)) * actualDelta);
      const deduct = actualDelta > 0 ? Math.min(Number(strata[key]), share || 1) : Math.max(0, share);
      strata[key] = Math.max(0, Number(strata[key]) - deduct);
      remainingToDeduct -= deduct;
    }
    strata[strataKey] = newVal;

    const updatedPlanets = planets.map((p) => {
      if (p.id !== activePlanet.id) return p;
      return {
        ...p,
        population: {
          ...currentPop,
          strata,
        },
      };
    });
    onUpdatePlanets(updatedPlanets);
    setNotice({
      type: 'info',
      text: `Workforce reallocated: [${String(strataKey).toUpperCase()}] adjusted to ${newVal.toLocaleString()} pops.`,
    });
  };

  // Preset Demographic Formulations
  const handleApplyStrataPreset = (preset: 'agrarian' | 'industrial' | 'science' | 'military' | 'balanced') => {
    if (!onUpdatePlanets || !activePlanet.population) return;
    sound.play('confirm');
    const total = activePlanet.population.total;
    let ratios: Record<keyof PopulationStrataDistribution, number>;

    if (preset === 'agrarian') {
      ratios = {
        farmers: 0.35,
        hydrologists: 0.22,
        miners: 0.15,
        industrialWorkers: 0.13,
        scientists: 0.05,
        administrators: 0.05,
        militaryRecruits: 0.05,
      };
    } else if (preset === 'industrial') {
      ratios = {
        farmers: 0.12,
        hydrologists: 0.08,
        miners: 0.35,
        industrialWorkers: 0.30,
        scientists: 0.07,
        administrators: 0.03,
        militaryRecruits: 0.05,
      };
    } else if (preset === 'science') {
      ratios = {
        farmers: 0.14,
        hydrologists: 0.10,
        miners: 0.14,
        industrialWorkers: 0.18,
        scientists: 0.32,
        administrators: 0.06,
        militaryRecruits: 0.06,
      };
    } else if (preset === 'military') {
      ratios = {
        farmers: 0.15,
        hydrologists: 0.10,
        miners: 0.18,
        industrialWorkers: 0.22,
        scientists: 0.05,
        administrators: 0.05,
        militaryRecruits: 0.25,
      };
    } else {
      // balanced
      ratios = {
        farmers: 0.18,
        hydrologists: 0.12,
        miners: 0.25,
        industrialWorkers: 0.25,
        scientists: 0.08,
        administrators: 0.05,
        militaryRecruits: 0.07,
      };
    }

    const newStrata: PopulationStrataDistribution = {
      farmers: Math.round(total * ratios.farmers),
      hydrologists: Math.round(total * ratios.hydrologists),
      miners: Math.round(total * ratios.miners),
      industrialWorkers: Math.round(total * ratios.industrialWorkers),
      scientists: Math.round(total * ratios.scientists),
      administrators: Math.round(total * ratios.administrators),
      militaryRecruits: Math.round(total * ratios.militaryRecruits),
    };

    const updatedPlanets = planets.map((p) => {
      if (p.id !== activePlanet.id) return p;
      return {
        ...p,
        population: {
          ...p.population!,
          strata: newStrata,
        },
      };
    });
    onUpdatePlanets(updatedPlanets);
    setNotice({
      type: 'success',
      text: `Strategic workforce preset "${preset.toUpperCase()}" applied to ${activePlanet.name}.`,
    });
  };

  // Emergency Food Aid Synth
  const handleEmergencyFoodAid = () => {
    const metalCost = 8000;
    const deutCost = 4000;
    const nqCost = 2500;
    if (resources.metal < metalCost || resources.deuterium < deutCost || resources.naquadah < nqCost) {
      sound.play('warning');
      setNotice({ type: 'error', text: 'Insufficient resources! Emergency Food Aid requires 8k Metal, 4k Deut, 2.5k NQ.' });
      return;
    }
    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - metalCost,
        deuterium: resources.deuterium - deutCost,
        naquadah: resources.naquadah - nqCost,
      });
    }
    if (onUpdatePlanets) {
      const updated = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        const current = p.foodStockpile ?? 25000;
        const cap = p.foodCapacity ?? 100000;
        return {
          ...p,
          foodStockpile: Math.min(cap, current + 8000),
        };
      });
      onUpdatePlanets(updated);
    }
    sound.play('confirm');
    setNotice({ type: 'success', text: `🌾 Emergency Hydroponic Synthesis: +8,000 kg nutrient food rations delivered to ${activePlanet.name}!` });
  };

  // Emergency Water Desalination Flush
  const handleEmergencyWaterFlush = () => {
    const metalCost = 7000;
    const deutCost = 3000;
    const nqCost = 2000;
    if (resources.metal < metalCost || resources.deuterium < deutCost || resources.naquadah < nqCost) {
      sound.play('warning');
      setNotice({ type: 'error', text: 'Insufficient resources! Emergency Water Flush requires 7k Metal, 3k Deut, 2k NQ.' });
      return;
    }
    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - metalCost,
        deuterium: resources.deuterium - deutCost,
        naquadah: resources.naquadah - nqCost,
      });
    }
    if (onUpdatePlanets) {
      const updated = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        const current = p.waterStockpile ?? 30000;
        const cap = p.waterCapacity ?? 120000;
        return {
          ...p,
          waterStockpile: Math.min(cap, current + 9000),
        };
      });
      onUpdatePlanets(updated);
    }
    sound.play('confirm');
    setNotice({ type: 'success', text: `💧 Aquifer Desalination Flush: +9,000 kL fresh water pumped into ${activePlanet.name} reservoirs!` });
  };

  // Expand Storage Granary / Cistern
  const handleExpandStorage = (type: 'food' | 'water') => {
    const metalCost = 15000;
    const crystalCost = 12000;
    const nqCost = 4000;
    if (resources.metal < metalCost || resources.crystal < crystalCost || resources.naquadah < nqCost) {
      sound.play('warning');
      setNotice({ type: 'error', text: `Insufficient resources! Storage expansion requires 15k Metal, 12k Crystal, 4k NQ.` });
      return;
    }
    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - metalCost,
        crystal: resources.crystal - crystalCost,
        naquadah: resources.naquadah - nqCost,
      });
    }
    if (onUpdatePlanets) {
      const updated = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        return {
          ...p,
          foodCapacity: type === 'food' ? (p.foodCapacity || 100000) + 30000 : p.foodCapacity,
          waterCapacity: type === 'water' ? (p.waterCapacity || 120000) + 35000 : p.waterCapacity,
        };
      });
      onUpdatePlanets(updated);
    }
    sound.play('research');
    setNotice({
      type: 'success',
      text: `${type === 'food' ? '🌾 Granary Vaults' : '💧 Subsurface Cisterns'} expanded on ${activePlanet.name}! Storage +${type === 'food' ? '30,000 kg' : '35,000 kL'}.`,
    });
  };

  // Welfare & Population Relief Directives
  const handlePlanetaryWelfare = (type: 'grain_ration' | 'water_relief' | 'healthcare') => {
    if (!onUpdatePlanets) return;
    const p = activePlanet;
    const pop = p.population;
    if (!pop) return;

    if (type === 'grain_ration') {
      if ((p.foodStockpile || 0) < 4000) {
        sound.play('warning');
        setNotice({ type: 'error', text: 'Insufficient food stockpile on this planet for relief distribution (needs 4,000 kg).' });
        return;
      }
      const updated = planets.map((pl) => (pl.id === p.id ? {
        ...pl,
        foodStockpile: (pl.foodStockpile || 0) - 4000,
        population: {
          ...pop,
          unrest: Math.max(0, pop.unrest - 14),
          happiness: Math.min(100, pop.happiness + 10),
        },
      } : pl));
      onUpdatePlanets(updated);
      sound.play('confirm');
      setNotice({ type: 'success', text: `🥖 Imperial Grain Relief distributed! Unrest reduced by -14%, Happiness +10%.` });
    } else if (type === 'water_relief') {
      if ((p.waterStockpile || 0) < 4500) {
        sound.play('warning');
        setNotice({ type: 'error', text: 'Insufficient water stockpile on this planet for drought relief (needs 4,500 kL).' });
        return;
      }
      const updated = planets.map((pl) => (pl.id === p.id ? {
        ...pl,
        waterStockpile: (pl.waterStockpile || 0) - 4500,
        population: {
          ...pop,
          unrest: Math.max(0, pop.unrest - 12),
          happiness: Math.min(100, pop.happiness + 8),
        },
      } : pl));
      onUpdatePlanets(updated);
      sound.play('confirm');
      setNotice({ type: 'success', text: `🚰 Aquifer Reserve Flush enacted! Unrest reduced by -12%, Happiness +8%.` });
    } else if (type === 'healthcare') {
      const nqCost = 8000;
      if (resources.naquadah < nqCost) {
        sound.play('warning');
        setNotice({ type: 'error', text: 'Insufficient Naquadah to sponsor Colonial Healthcare (requires 8,000 NQ).' });
        return;
      }
      if (onUpdateResources) {
        onUpdateResources({ naquadah: resources.naquadah - nqCost });
      }
      const updated = planets.map((pl) => (pl.id === p.id ? {
        ...pl,
        population: {
          ...pop,
          unrest: Math.max(0, pop.unrest - 8),
          happiness: Math.min(100, pop.happiness + 15),
          growthRatePerHour: (pop.growthRatePerHour || 15000) + 8000,
        },
      } : pl));
      onUpdatePlanets(updated);
      sound.play('confirm');
      setNotice({ type: 'success', text: `🏥 Medical & Genetic Healthcare Program enacted on ${p.name}! Happiness +15%, Growth +8,000/h.` });
    }
  };

  // 2. Population Rationing & Living Standard Directive
  const handleSetRationing = (level: 'abundant' | 'standard' | 'strict_rationing' | 'famine_starvation') => {
    if (!onUpdatePlanets) return;
    sound.play('confirm');
    const updated = planets.map((p) => {
      if (p.id !== activePlanet.id) return p;
      const pop = p.population || {
        total: 14200000,
        growthRatePerHour: 24500,
        housingCapacity: 20000000,
        happiness: 88,
        unrest: 12,
        strata: {
          farmers: 2500000,
          hydrologists: 1500000,
          miners: 3500000,
          industrialWorkers: 4000000,
          scientists: 1200000,
          administrators: 500000,
          militaryRecruits: 1000000,
        },
        livingStandard: 'utopian' as const,
        rationingLevel: 'abundant' as const,
      };
      const unrestDelta = level === 'famine_starvation' ? 30 : level === 'strict_rationing' ? 12 : level === 'standard' ? 0 : -8;
      const happinessDelta = level === 'famine_starvation' ? -35 : level === 'strict_rationing' ? -15 : level === 'standard' ? 0 : 10;
      return {
        ...p,
        population: {
          ...pop,
          rationingLevel: level,
          unrest: Math.max(0, Math.min(100, pop.unrest + unrestDelta)),
          happiness: Math.max(0, Math.min(100, pop.happiness + happinessDelta)),
        },
      };
    });
    onUpdatePlanets(updated);
    setNotice({ type: 'info', text: `Colonial rationing set to "${level.toUpperCase()}".` });
  };

  const handleSetLivingStandard = (standard: 'utopian' | 'decent' | 'basic' | 'impoverished' | 'chemical_bliss') => {
    if (!onUpdatePlanets) return;
    sound.play('confirm');
    const updated = planets.map((p) => {
      if (p.id !== activePlanet.id) return p;
      const pop = p.population || {
        total: 14200000,
        growthRatePerHour: 24500,
        housingCapacity: 20000000,
        happiness: 88,
        unrest: 12,
        strata: {
          farmers: 2500000,
          hydrologists: 1500000,
          miners: 3500000,
          industrialWorkers: 4000000,
          scientists: 1200000,
          administrators: 500000,
          militaryRecruits: 1000000,
        },
        livingStandard: 'utopian' as const,
        rationingLevel: 'abundant' as const,
      };
      return {
        ...p,
        population: {
          ...pop,
          livingStandard: standard,
        },
      };
    });
    onUpdatePlanets(updated);
    setNotice({ type: 'success', text: `Living standard policy modified to "${standard.toUpperCase()}".` });
  };

  const handleSetHomeworld = (planetId: string) => {
    if (!onUpdatePlanets) return;
    sound.play('confirm');
    const updated = planets.map((p) => ({
      ...p,
      isHomeworld: p.id === planetId,
    }));
    onUpdatePlanets(updated);
    const target = planets.find((p) => p.id === planetId);
    setNotice({
      type: 'success',
      text: `👑 Imperial Decree: ${target?.name || 'World'} [${target?.coordinate}] is now the Sovereign Homeworld capital!`,
    });
  };

  // 3. Hazard Mitigation Project Handler
  const handleMitigateHazard = (hazardId: string) => {
    const hazard = activePlanet.hazards?.find((h) => h.id === hazardId);
    if (!hazard) return;

    if (hazard.isMitigated) {
      setNotice({ type: 'info', text: `Hazard "${hazard.name}" is already mitigated!` });
      return;
    }

    const cost = hazard.mitigationCost || { metal: 15000, crystal: 10000, deuterium: 0, naquadah: 5000 };
    if (
      (cost.metal && resources.metal < cost.metal) ||
      (cost.crystal && resources.crystal < cost.crystal) ||
      (cost.deuterium && resources.deuterium < cost.deuterium) ||
      (cost.naquadah && resources.naquadah < cost.naquadah)
    ) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: `Insufficient resources to mitigate hazard! Requires ${cost.metal ? `${cost.metal.toLocaleString()} Metal ` : ''}${
          cost.crystal ? `${cost.crystal.toLocaleString()} Crystal ` : ''
        }${cost.deuterium ? `${cost.deuterium.toLocaleString()} Deut ` : ''}${cost.naquadah ? `${cost.naquadah.toLocaleString()} NQ` : ''}`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - (cost.metal || 0),
        crystal: resources.crystal - (cost.crystal || 0),
        deuterium: resources.deuterium - (cost.deuterium || 0),
        naquadah: resources.naquadah - (cost.naquadah || 0),
      });
    }

    if (onUpdatePlanets) {
      const updatedPlanets = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        const updatedHazards = (p.hazards || []).map((h) => (h.id === hazardId ? { ...h, isMitigated: true } : h));
        const plunge = p.plunge || {
          plungeIndex: 8,
          stage: 'stable' as const,
          trend: 'stable' as const,
          reasons: [],
          activeCrises: [],
          interventionsAvailable: [],
        };
        return {
          ...p,
          hazards: updatedHazards,
          plunge: {
            ...plunge,
            plungeIndex: Math.max(0, plunge.plungeIndex - 6),
          },
        };
      });
      onUpdatePlanets(updatedPlanets);
    }

    sound.play('research');
    setNotice({
      type: 'success',
      text: `Engineering teams have successfully neutralized hazard: "${hazard.name}"! Planetary plunge decreased.`,
    });
  };

  // 4. Colonial Plunge Crisis Intervention Handler
  const handleExecuteIntervention = (interventionId: string) => {
    let costM = 0;
    let costC = 0;
    let costD = 0;
    let costN = 0;
    let plungeDrop = 15;
    let successMessage = '';

    if (interventionId === 'emergency-relief') {
      costN = 25000;
      costM = 15000;
      plungeDrop = 18;
      successMessage = 'Orbital cargo transports dropped 50,000 tons of emergency rations and hydration purifiers!';
    } else if (interventionId === 'martial-law') {
      costN = 40000;
      costM = 30000;
      plungeDrop = 12;
      successMessage = 'Garrison divisions deployed to restore civil order. Curfew enacted across metropolitan sectors.';
    } else if (interventionId === 'subsidized-desal') {
      costN = 35000;
      costD = 20000;
      plungeDrop = 15;
      successMessage = 'Subsidies dispatched to deep aquifer desalinators. Fresh water flowing into residential networks.';
    } else if (interventionId === 'climate-shield') {
      costN = 60000;
      costC = 40000;
      costD = 25000;
      plungeDrop = 25;
      successMessage = 'Orbital planetary deflector array adjusted. Radiation blizzards dispersed from atmosphere!';
    }

    if (
      resources.metal < costM ||
      resources.crystal < costC ||
      resources.deuterium < costD ||
      resources.naquadah < costN
    ) {
      sound.play('warning');
      setNotice({
        type: 'error',
        text: `Insufficient treasury/materials for crisis intervention! Requires ${costM ? `${costM.toLocaleString()} Metal ` : ''}${
          costC ? `${costC.toLocaleString()} Crystal ` : ''
        }${costD ? `${costD.toLocaleString()} Deut ` : ''}${costN ? `${costN.toLocaleString()} NQ` : ''}`,
      });
      return;
    }

    if (onUpdateResources) {
      onUpdateResources({
        metal: resources.metal - costM,
        crystal: resources.crystal - costC,
        deuterium: resources.deuterium - costD,
        naquadah: resources.naquadah - costN,
      });
    }

    if (onUpdatePlanets) {
      const updatedPlanets = planets.map((p) => {
        if (p.id !== activePlanet.id) return p;
        const currentPlunge = p.plunge || {
          plungeIndex: 8,
          stage: 'stable' as const,
          trend: 'stable' as const,
          reasons: [],
          activeCrises: [],
          interventionsAvailable: [],
        };
        const newIndex = Math.max(0, currentPlunge.plungeIndex - plungeDrop);
        const newStage =
          newIndex > 80
            ? ('total_collapse' as const)
            : newIndex > 55
            ? ('freefall' as const)
            : newIndex > 30
            ? ('severe_crisis' as const)
            : newIndex > 15
            ? ('stressed' as const)
            : ('stable' as const);
        return {
          ...p,
          plunge: {
            ...currentPlunge,
            plungeIndex: newIndex,
            stage: newStage,
            trend: 'recovering' as const,
          },
        };
      });
      onUpdatePlanets(updatedPlanets);
    }

    sound.play('confirm');
    setNotice({
      type: 'success',
      text: `EMERGENCY INTERVENTION EXECUTED: ${successMessage} Plunge Index reduced by ${plungeDrop}%.`,
    });
  };

  return (
    <div id="planets-management-view" className="space-y-6">
      {/* 1. Header & World Selector Ribbon */}
      <div className="border border-[#dedede] bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4 mb-4">
          <div>
            <div className="text-[9px] font-bold text-[#777777] tracking-[2px] uppercase mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>COLONIAL COMMAND NEXUS · PLANETARY MENUS & SUB-SYSTEMS</span>
              {activePlanet.isHomeworld && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold">
                  👑 SOVEREIGN HOMEWORLD
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    className="px-2.5 py-1 text-lg font-bold border border-[#111111] bg-white"
                    placeholder="Enter planet name..."
                  />
                  <button
                    onClick={handleSavePlanetName}
                    className="p-1.5 bg-[#111111] text-white hover:bg-emerald-600 cursor-pointer"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="p-1.5 border border-[#dedede] hover:bg-neutral-100 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#111111]">{activePlanet.name}</h1>
                  <button
                    onClick={() => {
                      setCustomNameInput(activePlanet.name);
                      setEditingName(true);
                    }}
                    className="p-1 text-[#777777] hover:text-[#111111] cursor-pointer"
                    title="Rename World"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <span className="font-mono text-sm px-2.5 py-1 bg-[#111111] text-white font-bold">
                [{activePlanet.coordinate}]
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 max-w-2xl leading-relaxed">
              Biome: <strong>{activePlanet.biome}</strong> · Surface Temp: <strong>{activePlanet.temperature || '+18°C'}</strong> · Diameter: <strong>{(activePlanet.diameterKm || 12742).toLocaleString()} km</strong> · Attached Moon: <strong>{activePlanet.moonName || 'None'}</strong>
            </p>
          </div>

          {/* Quick World Switcher & Homeworld Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('planetary-invasion')}
              className="px-3.5 py-2 bg-[#111111] text-white hover:bg-cyan-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              title="Open the 1-999,999 Universe Civilization: Empire at War Stargate Dial & Colony Conquest Hub"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>1-999,999 Colony Conquest Hub</span>
            </button>

            <button
              onClick={() => handleOpenPlanetModal(activePlanet)}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Detailed modal view for selected planet: resource breakdowns, building queues, and workforce allocations"
            >
              <Activity className="w-4 h-4 text-cyan-200" />
              <span>Detailed Dossier & Queues</span>
            </button>

            {/* Homeworld Dropdown Menu */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#fafafa] border border-[#dedede] text-xs font-mono">
              <span className="text-[10px] font-bold text-[#777777] uppercase flex items-center gap-1">
                <span>👑 Homeworld:</span>
              </span>
              <select
                value={planets.find((p) => p.isHomeworld)?.id || activePlanet.id}
                onChange={(e) => {
                  const targetId = e.target.value;
                  handleSetHomeworld(targetId);
                  handleSelectPlanet(targetId);
                }}
                className="px-2 py-1 bg-white border border-[#cccccc] text-xs font-bold text-[#111111] cursor-pointer outline-none"
                title="Select or designate Sovereign Homeworld"
              >
                {planets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.coordinate}] {p.isHomeworld ? '★ (Capital)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick World Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#777777] uppercase hidden xl:inline">
                Worlds:
              </span>
              {planets.map((p) => {
                const isSelected = p.id === activePlanet.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPlanet(p.id)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                        : 'bg-[#fafafa] text-[#111111] border-[#dedede] hover:border-[#111111]'
                    }`}
                  >
                    {p.isHomeworld && <span>👑</span>}
                    <span>{p.name.split(' ')[0]}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-[#777777]'}`}>
                      [{p.coordinate}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Planet Quick Metric Gauge */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-0.5">
              Building Field Usage
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-[#111111]">
                {activePlanet.fieldsUsed || 84} / {activePlanet.fieldsMax || 188}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                {Math.round(((activePlanet.fieldsUsed || 84) / (activePlanet.fieldsMax || 188)) * 100)}%
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-0.5">
              Metal & Crystal Extraction
            </span>
            <div className="flex items-center justify-between font-mono font-bold text-sm text-[#111111]">
              <span>+{(activePlanet.metalProductionRate || 48500).toLocaleString()}/h</span>
              <span className="text-cyan-700 text-xs">+{(activePlanet.crystalProductionRate || 29400).toLocaleString()} Cryst</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-0.5">
              Deut & Naquadah Yield
            </span>
            <div className="flex items-center justify-between font-mono font-bold text-sm text-cyan-800">
              <span>+{(activePlanet.deuteriumProductionRate || 18200).toLocaleString()} Deut</span>
              <span className="text-amber-700 text-xs">+{(activePlanet.naquadahProductionRate || 35000).toLocaleString()} NQ</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-0.5">
              Colonial Maintenance Upkeep
            </span>
            <div className="flex items-center justify-between font-mono font-bold text-sm">
              <span className="text-rose-700">-{activePlanetMaintenance.totalMaintenanceCost.toLocaleString()} NQ</span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                +{activePlanetMaintenance.netIncome.toLocaleString()} Net ({activePlanetMaintenance.profitMarginPercent}%)
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#fafafa] border border-[#eeeeee]">
            <span className="text-[10px] text-[#777777] uppercase font-bold block mb-0.5">
              Colonial Directive
            </span>
            <span className="font-bold text-sm text-[#111111] uppercase block truncate">
              {activePlanet.specialization || 'Homeworld Command'}
            </span>
          </div>
        </div>
      </div>

      {notice && (
        <div
          className={`p-4 border text-xs font-semibold flex justify-between items-center ${
            notice.type === 'success'
              ? 'bg-[#fafafa] border-[#111111] text-[#111111] border-l-4'
              : notice.type === 'error'
              ? 'bg-[#fff5f5] border-[#dc2626] text-[#dc2626] border-l-4'
              : 'bg-[#f0f9ff] border-[#0284c7] text-[#0284c7] border-l-4'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 2. SUB-MENU NAVIGATION TABS */}
      <div className="flex border-b border-[#dedede] bg-white overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('overview');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Globe size={14} />
          <span>Overview & Biosphere</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('life-support');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'life-support'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Wheat size={14} className="text-emerald-600" />
          <span>Food & Water Systems</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('population');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'population'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Users size={14} className="text-indigo-600" />
          <span>Population & Rationing</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('hazards');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'hazards'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <AlertOctagon size={14} className="text-amber-600" />
          <span>Planetary Hazards</span>
          {(activePlanet.hazards?.filter((h) => !h.isMitigated).length || 0) > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-mono">
              {activePlanet.hazards?.filter((h) => !h.isMitigated).length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('plunge');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'plunge'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <TrendingDown size={14} className="text-rose-600" />
          <span>Colonial Plunge System</span>
          <span className="px-1.5 py-0.2 bg-neutral-200 text-[#111111] font-mono text-[9px]">
            {activePlanet.plunge?.plungeIndex ?? 8}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('mines');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'mines'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Flame size={14} />
          <span>Mines & Energy Grid</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('facilities');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'facilities'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Building size={14} />
          <span>Planetary Facilities</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('defenses');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'defenses'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Shield size={14} />
          <span>Defense Grid Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('moon');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'moon'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Radio size={14} />
          <span>Moon Base & Phalanx</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('governance');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'governance'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Sliders size={14} />
          <span>Governance & Doctrines</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.play('click');
            setActiveTab('all-worlds');
          }}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'all-worlds'
              ? 'border-[#111111] text-[#111111] bg-[#fafafa]'
              : 'border-transparent text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Layers size={14} />
          <span>All Empire Worlds</span>
        </button>

        {onNavigate && (
          <>
            <button
              type="button"
              onClick={() => {
                sound.play('click');
                onNavigate('aic-system');
              }}
              className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-amber-800 hover:text-amber-950 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 bg-amber-50/60"
            >
              <span>🏭 AIC Industry Complex →</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.play('click');
                onNavigate('power-grid');
              }}
              className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-blue-800 hover:text-blue-950 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 bg-blue-50/60"
            >
              <span>⚡ Power Grid Systems →</span>
            </button>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUB-MENU 1: OVERVIEW & BIOSPHERE DOSSIER */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Planetary Schematic Visual Card */}
            <div className="lg:col-span-6 border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                <h3 className="font-bold text-base text-[#111111] uppercase tracking-wider">
                  Planetary Astrometry & Geological Core
                </h3>
                <span className="font-mono text-xs text-[#777777]">Sector ID: {activePlanet.coordinate}</span>
              </div>

              {/* Graphical Biosphere Box */}
              <div className="p-6 bg-radial from-neutral-900 to-black text-white rounded-none border border-[#111111] relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[220px]">
                <div className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center text-4xl mb-3 bg-gradient-to-tr from-cyan-950 via-slate-900 to-blue-900">
                  {activePlanet.biome.includes('Continental') ? '🌍' : activePlanet.biome.includes('Desert') ? '🏜️' : activePlanet.biome.includes('Mountain') ? '🏔️' : '🪐'}
                </div>
                <h4 className="text-lg font-bold tracking-tight text-cyan-200">{activePlanet.name}</h4>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Coordinate [{activePlanet.coordinate}] · {activePlanet.biome}
                </p>
                {activePlanet.hasMoon && (
                  <div className="mt-3 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-mono text-cyan-300">
                    🌙 Attached Lunar Body: {activePlanet.moonName || 'Luna Prime'} (Gate Lv {activePlanet.jumpGateLevel || 1})
                  </div>
                )}
              </div>

              {/* Physical Parameters List */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 bg-[#fafafa] border border-[#eeeeee]">
                  <span className="text-[#666666]">Diameter:</span>
                  <strong className="text-[#111111]">{(activePlanet.diameterKm || 12742).toLocaleString()} km</strong>
                </div>
                <div className="flex justify-between p-2 bg-[#fafafa] border border-[#eeeeee]">
                  <span className="text-[#666666]">Surface Temperature:</span>
                  <strong className="text-[#111111]">{activePlanet.temperature || '+18°C'}</strong>
                </div>
                <div className="flex justify-between p-2 bg-[#fafafa] border border-[#eeeeee]">
                  <span className="text-[#666666]">Building Fields Capacity:</span>
                  <strong className="text-[#111111]">{activePlanet.fieldsUsed || 84} / {activePlanet.fieldsMax || 188} Plots</strong>
                </div>
                <div className="flex justify-between p-2 bg-[#fafafa] border border-[#eeeeee]">
                  <span className="text-[#666666]">Orbital Defense Rating:</span>
                  <strong className="text-emerald-700">+{activePlanet.defenseBonus?.toLocaleString() || '65,000'} pts</strong>
                </div>
              </div>
            </div>

            {/* Right: Production & Colonial Yield Breakdown */}
            <div className="lg:col-span-6 border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
                <h3 className="font-bold text-base text-[#111111] uppercase tracking-wider">
                  Hourly Production & Energy Output
                </h3>
                <span className="text-xs font-bold text-emerald-700 font-mono">100% Efficiency</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block">Titanium & Metal Extraction</span>
                    <span className="text-[11px] text-[#666666]">Metal Mine Level {activePlanet.mines?.metalMine || 24}</span>
                  </div>
                  <strong className="font-mono text-base text-[#111111]">
                    +{(activePlanet.metalProductionRate || 48500).toLocaleString()} / hr
                  </strong>
                </div>

                <div className="p-3.5 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block">Silicate Crystal Synthesis</span>
                    <span className="text-[11px] text-[#666666]">Crystal Synthesizer Level {activePlanet.mines?.crystalMine || 20}</span>
                  </div>
                  <strong className="font-mono text-base text-cyan-700">
                    +{(activePlanet.crystalProductionRate || 29400).toLocaleString()} / hr
                  </strong>
                </div>

                <div className="p-3.5 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block">Deuterium Heavy Water Synthesis</span>
                    <span className="text-[11px] text-[#666666]">Deuterium Centrifuge Level {activePlanet.mines?.deuteriumSynthesizer || 18}</span>
                  </div>
                  <strong className="font-mono text-base text-blue-700">
                    +{(activePlanet.deuteriumProductionRate || 18200).toLocaleString()} / hr
                  </strong>
                </div>

                <div className="p-3.5 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block">Deep Mantle Naquadah Core Tap</span>
                    <span className="text-[11px] text-[#666666]">Core Extractor Level {activePlanet.mines?.naquadahCoreTap || 16}</span>
                  </div>
                  <strong className="font-mono text-base text-amber-600">
                    +{(activePlanet.naquadahProductionRate || 35000).toLocaleString()} / hr
                  </strong>
                </div>

                <div className="p-3.5 bg-[#fafafa] border border-[#dedede] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#111111] block">Clean Power Grid Output</span>
                    <span className="text-[11px] text-[#666666]">Solar Plant & Fusion Reactor</span>
                  </div>
                  <strong className="font-mono text-base text-emerald-700">
                    +{(activePlanet.energyProductionRate || 850).toLocaleString()} MW
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('mines')}
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Manage Mines & Energy Grid →
                </button>
              </div>
            </div>
          </div>

          {/* Colony Maintenance & Expansion Command Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Colony Maintenance Ledger & Upkeep Breakdown */}
            <div className="lg:col-span-7 border border-[#dedede] bg-white p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#eeeeee] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    Fiscal Colonial Balance Sheet
                  </span>
                  <h3 className="font-bold text-base text-[#111111]">
                    Colony Maintenance & Logistical Upkeep
                  </h3>
                </div>
                <div className="px-3 py-1 bg-rose-50 border border-rose-200 text-xs font-mono font-bold text-rose-800">
                  Total Upkeep: -{activePlanetMaintenance.totalMaintenanceCost.toLocaleString()} NQ / turn
                </div>
              </div>

              <p className="text-xs text-[#666666] leading-relaxed">
                Higher colony tiers provide increased gross tribute and defense shielding, but require compounding logistical lines, atmospheric scrubber upkeep, and civil administration.
              </p>

              {/* 4 Pillars of Colony Maintenance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666] font-medium">Civil Administration (35%)</span>
                    <strong className="font-mono text-[#111111]">
                      -{activePlanetMaintenance.breakdownCategories.administration.toLocaleString()} NQ
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-[#eeeeee]">
                    <div className="h-full bg-[#111111]" style={{ width: '35%' }} />
                  </div>
                  <span className="text-[10px] text-[#888888] block">Municipal courts, colonial registries, public services</span>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666] font-medium">Interstellar Logistics (25%)</span>
                    <strong className="font-mono text-[#111111]">
                      -{activePlanetMaintenance.breakdownCategories.logistics.toLocaleString()} NQ
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-[#eeeeee]">
                    <div className="h-full bg-blue-600" style={{ width: '25%' }} />
                  </div>
                  <span className="text-[10px] text-[#888888] block">Deep-space freight convoys and hyperlane corridor patrols</span>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666] font-medium">Life Support Sustenance (20%)</span>
                    <strong className="font-mono text-[#111111]">
                      -{activePlanetMaintenance.breakdownCategories.lifeSupport.toLocaleString()} NQ
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-[#eeeeee]">
                    <div className="h-full bg-emerald-600" style={{ width: '20%' }} />
                  </div>
                  <span className="text-[10px] text-[#888888] block">Thermal dome sealing, hydroponic energy, water cycling</span>
                </div>

                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#666666] font-medium">Garrison Security (20%)</span>
                    <strong className="font-mono text-[#111111]">
                      -{activePlanetMaintenance.breakdownCategories.security.toLocaleString()} NQ
                    </strong>
                  </div>
                  <div className="w-full h-1.5 bg-[#eeeeee]">
                    <div className="h-full bg-amber-600" style={{ width: '20%' }} />
                  </div>
                  <span className="text-[10px] text-[#888888] block">Orbital shield dome energization & planetary security cadres</span>
                </div>
              </div>

              {/* Economic Summary Box */}
              <div className="p-3.5 bg-neutral-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
                    Net Planetary Fiscal Contribution
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <strong className="text-lg font-mono font-bold text-emerald-400">
                      +{activePlanetMaintenance.netIncome.toLocaleString()} Naquadah / turn
                    </strong>
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      {activePlanetMaintenance.profitMarginPercent}% Margin
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-neutral-300 space-y-0.5">
                  <div>Gross Tribute: +{activePlanetMaintenance.grossIncome.toLocaleString()} NQ</div>
                  <div>Maintenance: -{activePlanetMaintenance.totalMaintenanceCost.toLocaleString()} NQ</div>
                </div>
              </div>
            </div>

            {/* Right: Colony Tier Upgrade Station */}
            <div className="lg:col-span-5 border border-[#dedede] bg-white p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                      Colonial Development
                    </span>
                    <h3 className="font-bold text-base text-[#111111]">
                      Colony Tier Expansion
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-[#111111] text-white font-mono text-xs font-bold">
                    Tier {activePlanet.level}
                  </span>
                </div>

                <p className="text-xs text-[#666666] leading-relaxed">
                  Upgrading colony tier expands residential zones, builds heavy mining shafts, and fortifies orbital defense networks.
                </p>

                {/* Upgrade Preview Stats */}
                <div className="mt-4 p-3.5 bg-[#fafafa] border border-[#dedede] space-y-2 text-xs font-mono">
                  <div className="text-[10px] font-bold text-[#777777] uppercase border-b border-[#eeeeee] pb-1 font-sans">
                    Tier {activePlanet.level} → Tier {activePlanet.level + 1} Upgrade Projection:
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Gross Tribute Increase:</span>
                    <strong className="text-emerald-700 font-bold">+6,500 NQ / turn</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">New Projected Maintenance:</span>
                    <strong className="text-rose-700 font-bold">
                      -{calculateColonyMaintenance({ ...activePlanet, level: activePlanet.level + 1 }, planets.length).toLocaleString()} NQ / turn
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Net Profit Change:</span>
                    <strong className="text-[#111111] font-bold">
                      +{Math.max(1000, 6500 - (calculateColonyMaintenance({ ...activePlanet, level: activePlanet.level + 1 }, planets.length) - activePlanetMaintenance.totalMaintenanceCost)).toLocaleString()} NQ / turn
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Orbital Defense Rating:</span>
                    <strong className="text-blue-700 font-bold">+12,000 pts</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#eeeeee] space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#777777]">Expansion Cost:</span>
                  <strong className={`font-bold ${resources.naquadah >= ((activePlanet.level || 1) * 35000 + 20000) ? 'text-[#111111]' : 'text-rose-600'}`}>
                    {((activePlanet.level || 1) * 35000 + 20000).toLocaleString()} Naquadah
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgradeColonyTier(activePlanet.id)}
                  disabled={resources.naquadah < ((activePlanet.level || 1) * 35000 + 20000)}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    resources.naquadah >= ((activePlanet.level || 1) * 35000 + 20000)
                      ? 'bg-[#111111] text-white hover:bg-[#333333]'
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>Upgrade Colony to Tier {activePlanet.level + 1}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU: FOOD & WATER LIFE SUPPORT SYSTEMS */}
      {/* ========================================================================= */}
      {activeTab === 'life-support' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                  <Wheat className="text-emerald-600 w-5 h-5" />
                  <span>Atmospheric & Life Support Matrix · Food, Water & Biosphere Sustenance</span>
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Manage planetary agricultural domes, deep aquifer desalination grids, emergency rations, and water cisterns on {activePlanet.name}.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs">
                  <span className="text-[#777777] block text-[9px] uppercase">Planetary Food Stock:</span>
                  <strong className="text-emerald-700 font-bold">{(activePlanet.foodStockpile ?? 42000).toLocaleString()} kg</strong>
                  <span className="text-[10px] text-[#888888] block">/ {(activePlanet.foodCapacity ?? 100000).toLocaleString()} kg</span>
                </div>
                <div className="px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs">
                  <span className="text-[#777777] block text-[9px] uppercase">Aquifer Water Stock:</span>
                  <strong className="text-cyan-700 font-bold">{(activePlanet.waterStockpile ?? 58000).toLocaleString()} kL</strong>
                  <span className="text-[10px] text-[#888888] block">/ {(activePlanet.waterCapacity ?? 120000).toLocaleString()} kL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Life Support Status Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Food Balance Card */}
            <div className="border border-[#dedede] bg-white p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#777777] flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Food Reserves</span>
                </span>
                <span className={`text-[10px] font-mono font-bold ${
                  (activePlanet.foodProductionRate ?? 14200) >= (activePlanet.foodConsumptionRate ?? 8200)
                    ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200'
                    : 'text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200 animate-pulse'
                }`}>
                  {(activePlanet.foodProductionRate ?? 14200) >= (activePlanet.foodConsumptionRate ?? 8200)
                    ? `+${((activePlanet.foodProductionRate ?? 14200) - (activePlanet.foodConsumptionRate ?? 8200)).toLocaleString()}/h`
                    : `${((activePlanet.foodProductionRate ?? 14200) - (activePlanet.foodConsumptionRate ?? 8200)).toLocaleString()}/h DEFICIT`}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono mt-2">
                <strong className="text-base text-[#111111]">
                  {(activePlanet.foodStockpile ?? 42000).toLocaleString()} <span className="text-xs font-normal text-[#777]">kg</span>
                </strong>
                <span className="text-xs text-[#777777]">
                  {Math.round(((activePlanet.foodStockpile ?? 42000) / (activePlanet.foodCapacity ?? 100000)) * 100)}% Cap
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    ((activePlanet.foodStockpile ?? 42000) / (activePlanet.foodCapacity ?? 100000)) < 0.15 ? 'bg-rose-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.round(((activePlanet.foodStockpile ?? 42000) / (activePlanet.foodCapacity ?? 100000)) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#777777] font-mono mt-2 pt-1 border-t border-[#f0f0f0]">
                <span>Prod: +{(activePlanet.foodProductionRate ?? 14200).toLocaleString()}/h</span>
                <span>Cons: -{(activePlanet.foodConsumptionRate ?? 8200).toLocaleString()}/h</span>
              </div>
            </div>

            {/* Water Balance Card */}
            <div className="border border-[#dedede] bg-white p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#777777] flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Water Reserves</span>
                </span>
                <span className={`text-[10px] font-mono font-bold ${
                  (activePlanet.waterProductionRate ?? 18500) >= (activePlanet.waterConsumptionRate ?? 10000)
                    ? 'text-cyan-700 bg-cyan-50 px-1.5 py-0.5 border border-cyan-200'
                    : 'text-rose-700 bg-rose-50 px-1.5 py-0.5 border border-rose-200 animate-pulse'
                }`}>
                  {(activePlanet.waterProductionRate ?? 18500) >= (activePlanet.waterConsumptionRate ?? 10000)
                    ? `+${((activePlanet.waterProductionRate ?? 18500) - (activePlanet.waterConsumptionRate ?? 10000)).toLocaleString()}/h`
                    : `${((activePlanet.waterProductionRate ?? 18500) - (activePlanet.waterConsumptionRate ?? 10000)).toLocaleString()}/h DEFICIT`}
                </span>
              </div>
              <div className="flex justify-between items-baseline font-mono mt-2">
                <strong className="text-base text-[#111111]">
                  {(activePlanet.waterStockpile ?? 58000).toLocaleString()} <span className="text-xs font-normal text-[#777]">kL</span>
                </strong>
                <span className="text-xs text-[#777777]">
                  {Math.round(((activePlanet.waterStockpile ?? 58000) / (activePlanet.waterCapacity ?? 120000)) * 100)}% Cap
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    ((activePlanet.waterStockpile ?? 58000) / (activePlanet.waterCapacity ?? 120000)) < 0.15 ? 'bg-rose-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round(((activePlanet.waterStockpile ?? 58000) / (activePlanet.waterCapacity ?? 120000)) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#777777] font-mono mt-2 pt-1 border-t border-[#f0f0f0]">
                <span>Extr: +{(activePlanet.waterProductionRate ?? 18500).toLocaleString()}/h</span>
                <span>Cons: -{(activePlanet.waterConsumptionRate ?? 10000).toLocaleString()}/h</span>
              </div>
            </div>

            {/* Biosphere Sustenance */}
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] uppercase font-bold text-[#777777] block mb-1">Biosphere Sustenance</span>
              <div className="flex justify-between items-baseline font-mono mt-2">
                <strong className="text-base text-emerald-700">Optimal (98.6%)</strong>
                <span className="text-xs text-[#777777]">Safe Margin</span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2">
                <div className="h-full bg-emerald-500" style={{ width: '98%' }} />
              </div>
              <p className="text-[10px] text-[#777777] mt-2 pt-1 border-t border-[#f0f0f0]">
                Atmospheric scrubbers cycling planetary CO2 & humidity smoothly.
              </p>
            </div>

            {/* Famine/Drought Alert Status */}
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] uppercase font-bold text-[#777777] block mb-1">Emergency Vulnerability</span>
              <div className="flex justify-between items-baseline font-mono mt-2">
                <strong className={`text-base ${
                  (activePlanet.foodStockpile ?? 42000) < 5000 || (activePlanet.waterStockpile ?? 58000) < 5000
                    ? 'text-rose-600 animate-pulse'
                    : 'text-emerald-700'
                }`}>
                  {(activePlanet.foodStockpile ?? 42000) < 5000
                    ? '⚠️ FAMINE IMMINENT'
                    : (activePlanet.waterStockpile ?? 58000) < 5000
                    ? '⚠️ DROUGHT RISK'
                    : 'NOMINAL SECURE'}
                </strong>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2">
                <div
                  className={`h-full ${
                    (activePlanet.foodStockpile ?? 42000) < 5000 || (activePlanet.waterStockpile ?? 58000) < 5000
                      ? 'bg-rose-600'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-[10px] text-[#777777] mt-2 pt-1 border-t border-[#f0f0f0]">
                {((activePlanet.foodStockpile ?? 42000) < 5000 || (activePlanet.waterStockpile ?? 58000) < 5000)
                  ? 'Urgent! Trigger emergency food aid or water flush below.'
                  : 'Rations abundant. Population growing steadily without civil unrest.'}
              </p>
            </div>
          </div>

          {/* Emergency Aid & Storage Expansion Command Bar */}
          <div className="border border-[#dedede] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Emergency Resource Injections & Granary Storage Expansion</span>
              </h4>
              <span className="text-[11px] text-[#777777]">Instant colonial life-support relief</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <button
                type="button"
                onClick={handleEmergencyFoodAid}
                className="p-3 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>🌾 Rapid Food Synthesis</span>
                  <span className="font-mono text-[10px] bg-emerald-200 px-1 py-0.5 rounded">+8,000 kg</span>
                </div>
                <p className="text-[10px] text-emerald-700 mt-1">Instant nutrient ration injection into granaries.</p>
                <div className="text-[9px] font-mono text-emerald-800 mt-2 font-bold">Cost: 8k M | 4k Deut | 2.5k NQ</div>
              </button>

              <button
                type="button"
                onClick={handleEmergencyWaterFlush}
                className="p-3 border border-cyan-300 bg-cyan-50 hover:bg-cyan-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-cyan-900">
                  <span>💧 Aquifer Desal Flush</span>
                  <span className="font-mono text-[10px] bg-cyan-200 px-1 py-0.5 rounded">+9,000 kL</span>
                </div>
                <p className="text-[10px] text-cyan-700 mt-1">Rapid thermal aquifer pumping into reservoirs.</p>
                <div className="text-[9px] font-mono text-cyan-800 mt-2 font-bold">Cost: 7k M | 3k Deut | 2k NQ</div>
              </button>

              <button
                type="button"
                onClick={() => handleExpandStorage('food')}
                className="p-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>📦 Expand Granary Vaults</span>
                  <span className="font-mono text-[10px] bg-amber-200 px-1 py-0.5 rounded">+30,000 Cap</span>
                </div>
                <p className="text-[10px] text-amber-700 mt-1">Increases max food storage capacity permanently.</p>
                <div className="text-[9px] font-mono text-amber-800 mt-2 font-bold">Cost: 15k M | 12k C | 4k NQ</div>
              </button>

              <button
                type="button"
                onClick={() => handleExpandStorage('water')}
                className="p-3 border border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  <span>🚰 Expand Subsurface Cisterns</span>
                  <span className="font-mono text-[10px] bg-blue-200 px-1 py-0.5 rounded">+35,000 Cap</span>
                </div>
                <p className="text-[10px] text-blue-700 mt-1">Increases max water reservoir capacity permanently.</p>
                <div className="text-[9px] font-mono text-blue-800 mt-2 font-bold">Cost: 15k M | 12k C | 4k NQ</div>
              </button>
            </div>
          </div>

          {/* Life Support Facility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Hydroponics Domes */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                    <Wheat className="w-4 h-4 text-emerald-600" />
                    <span>Hydroponic Orbital Greenhouses</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-700 text-white font-mono text-xs font-bold">
                    Tier {activePlanet.lifeSupportFacilities?.hydroponicsDomes ?? 4}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Pressurized multi-tier aeroponic crops providing nutrient-rich carbohydrates and bio-engineered grains for colony pops.
                </p>
                <div className="mt-4 p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Food Output:</span>
                    <strong className="text-emerald-700 font-bold">
                      +{(((activePlanet.lifeSupportFacilities?.hydroponicsDomes ?? 4) * 850) + 1200).toLocaleString()} kg/h
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Power Consumption:</span>
                    <span className="text-amber-700">-{(activePlanet.lifeSupportFacilities?.hydroponicsDomes ?? 4) * 20} MW</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUpgradeLifeSupport('hydroponicsDomes', 15000, 10000, 4000, 5000)}
                className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Upgrade (+1 Tier) · 15k M | 10k C | 5k NQ
              </button>
            </div>

            {/* Deep Aquifer Pumps */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-cyan-600" />
                    <span>Deep Aquifer Pumps</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-cyan-700 text-white font-mono text-xs font-bold">
                    Tier {activePlanet.lifeSupportFacilities?.deepAquiferPumps ?? 3}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Thermal drilling rigs tapping into subsurface planetary aquifers to supply pure mineralized water for municipal reservoirs.
                </p>
                <div className="mt-4 p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Water Extraction:</span>
                    <strong className="text-cyan-700 font-bold">
                      +{(((activePlanet.lifeSupportFacilities?.deepAquiferPumps ?? 3) * 1100) + 1500).toLocaleString()} kL/h
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Aquifer Purity:</span>
                    <span className="text-emerald-700 font-bold">98.4%</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUpgradeLifeSupport('deepAquiferPumps', 18000, 12000, 5000, 6000)}
                className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-cyan-700 transition-colors cursor-pointer"
              >
                Upgrade (+1 Tier) · 18k M | 12k C | 6k NQ
              </button>
            </div>

            {/* Atmospheric Moisture Condensers */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Atmospheric Moisture Condensers</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-blue-700 text-white font-mono text-xs font-bold">
                    Tier {activePlanet.lifeSupportFacilities?.moistureCondensers ?? 2}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Ionized condensation pylons extracting humidity straight from the planetary troposphere even in arid biomes.
                </p>
                <div className="mt-4 p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Condenser Output:</span>
                    <strong className="text-blue-700 font-bold">
                      +{(((activePlanet.lifeSupportFacilities?.moistureCondensers ?? 2) * 650) + 800).toLocaleString()} kL/h
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Humidity Yield:</span>
                    <span className="text-[#111111]">62% Ambient</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUpgradeLifeSupport('moistureCondensers', 14000, 15000, 6000, 4500)}
                className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Upgrade (+1 Tier) · 14k M | 15k C | 4.5k NQ
              </button>
            </div>

            {/* Desalination Plants */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Coastal & Saline Desalination Grid</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-teal-700 text-white font-mono text-xs font-bold">
                    Tier {activePlanet.lifeSupportFacilities?.desalinationPlants ?? 2}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  High-pressure reverse osmosis membranes converting saline oceans and caustic runoff into potable drinking water.
                </p>
                <div className="mt-4 p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Desalination Rate:</span>
                    <strong className="text-teal-700 font-bold">
                      +{(((activePlanet.lifeSupportFacilities?.desalinationPlants ?? 2) * 1400) + 1000).toLocaleString()} kL/h
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Mineral Salts Byproduct:</span>
                    <span className="text-[#111111]">+150 kg Naq Flux</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUpgradeLifeSupport('desalinationPlants', 22000, 18000, 8000, 7500)}
                className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-teal-700 transition-colors cursor-pointer"
              >
                Upgrade (+1 Tier) · 22k M | 18k C | 7.5k NQ
              </button>
            </div>

            {/* Bio Farms & Synthesizers */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-purple-600" />
                    <span>Bio-Farms & Protein Synthesizers</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-purple-700 text-white font-mono text-xs font-bold">
                    Tier {activePlanet.lifeSupportFacilities?.bioFarms ?? 1}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Cellular vat synthesis transforming raw organic slurry and deuterium trace isotopes into dense protein rations.
                </p>
                <div className="mt-4 p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Synthesizer Yield:</span>
                    <strong className="text-purple-700 font-bold">
                      +{(((activePlanet.lifeSupportFacilities?.bioFarms ?? 1) * 2200) + 1800).toLocaleString()} kg/h
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Caloric Efficiency:</span>
                    <span className="text-emerald-700 font-bold">99.2% Pure Bio-Fuel</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUpgradeLifeSupport('bioFarms', 28000, 24000, 12000, 10000)}
                className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Upgrade (+1 Tier) · 28k M | 24k C | 10k NQ
              </button>
            </div>

            {/* Genetic Crop Engineering Labs */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-lime-600" />
                    <span>Genetic Crop Engineering Labs</span>
                  </h4>
                  <span className="px-2 py-0.5 bg-lime-700 text-white font-mono text-xs font-bold">
                    Tier {activePlanet.lifeSupportFacilities?.geneticCropLabs ?? 2}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  CRISPR bio-engineering facilities breeding ultra-hardy drought-resistant and fast-maturing hybrid grains.
                </p>
                <div className="mt-4 p-3 bg-[#fafafa] border border-[#eeeeee] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Planetary Food Multiplier:</span>
                    <strong className="text-lime-700 font-bold">
                      +{((activePlanet.lifeSupportFacilities?.geneticCropLabs ?? 2) * 15)}% Global Yield
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Blight Resistance:</span>
                    <span className="text-emerald-700 font-bold">99.8% Immune</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUpgradeLifeSupport('geneticCropLabs', 25000, 20000, 10000, 8000)}
                className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-lime-700 transition-colors cursor-pointer"
              >
                Upgrade (+1 Tier) · 25k M | 20k C | 8k NQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU: CITIZEN POPULATION & STRATA RATIONING */}
      {/* ========================================================================= */}
      {activeTab === 'population' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                  <Users className="text-indigo-600 w-5 h-5" />
                  <span>Citizen Demographics, Strata Allocation & Rationing Directives</span>
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Manage {activePlanet.name}'s population strata, reallocate workforce, distribute grain & water welfare, and balance civil unrest.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs">
                  <span className="text-[#777777] block text-[9px] uppercase">Dominion Population:</span>
                  <strong className="text-indigo-700 font-bold">{(activePlanet.population?.total ?? 14200000).toLocaleString()} Citizens</strong>
                </div>
                <div className="px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs">
                  <span className="text-[#777777] block text-[9px] uppercase">Net Growth Rate:</span>
                  <strong className="text-emerald-700 font-bold">+{(activePlanet.population?.growthRatePerHour ?? 24500).toLocaleString()}/h</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Demographic Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] uppercase font-bold text-[#777777] block mb-1">Housing Capacity</span>
              <div className="flex justify-between items-baseline font-mono">
                <strong className="text-base text-[#111111]">
                  {Math.round((activePlanet.population?.total ?? 14200000) / 1000000 * 10) / 10}M / {Math.round((activePlanet.population?.housingCapacity ?? 20000000) / 1000000)}M
                </strong>
                <span className="text-xs text-emerald-700 font-bold">
                  {Math.round(((activePlanet.population?.total ?? 14200000) / (activePlanet.population?.housingCapacity ?? 20000000)) * 100)}% Occupied
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2">
                <div className="h-full bg-indigo-600" style={{ width: `${Math.round(((activePlanet.population?.total ?? 14200000) / (activePlanet.population?.housingCapacity ?? 20000000)) * 100)}%` }} />
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] uppercase font-bold text-[#777777] block mb-1">Citizen Happiness</span>
              <div className="flex justify-between items-baseline font-mono">
                <strong className="text-base text-emerald-700">{activePlanet.population?.happiness ?? 88}%</strong>
                <span className="text-xs text-[#777777]">
                  {(activePlanet.population?.happiness ?? 88) >= 80 ? 'Utopian Morale' : (activePlanet.population?.happiness ?? 88) >= 50 ? 'Content Morale' : 'Discontent'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2">
                <div className="h-full bg-emerald-500" style={{ width: `${activePlanet.population?.happiness ?? 88}%` }} />
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] uppercase font-bold text-[#777777] block mb-1">Civil Unrest Index</span>
              <div className="flex justify-between items-baseline font-mono">
                <strong className={`text-base ${(activePlanet.population?.unrest ?? 12) > 30 ? 'text-rose-600 animate-pulse' : 'text-[#111111]'}`}>
                  {activePlanet.population?.unrest ?? 12}%
                </strong>
                <span className="text-xs text-emerald-700 font-bold">
                  {(activePlanet.population?.unrest ?? 12) <= 15 ? 'Safe Nominal' : (activePlanet.population?.unrest ?? 12) <= 40 ? 'Moderate Tension' : 'Critical Rioting'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2">
                <div
                  className={`h-full ${(activePlanet.population?.unrest ?? 12) > 30 ? 'bg-rose-500' : 'bg-amber-500'}`}
                  style={{ width: `${activePlanet.population?.unrest ?? 12}%` }}
                />
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-4">
              <span className="text-[10px] uppercase font-bold text-[#777777] block mb-1">Current Rationing Policy</span>
              <div className="flex justify-between items-baseline font-mono">
                <strong className="text-base text-[#111111] uppercase">{activePlanet.population?.rationingLevel ?? 'abundant'}</strong>
                <span className="text-xs text-emerald-700 font-bold">
                  {activePlanet.population?.rationingLevel === 'abundant' ? '+15% Growth' : activePlanet.population?.rationingLevel === 'standard' ? 'Standard' : '-50% Rationing'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#eeeeee] mt-2">
                <div className="h-full bg-emerald-600" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          {/* Strategic Census Presets */}
          <div className="border border-[#dedede] bg-white p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-[#eeeeee]">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                  Strategic Census & Workforce Directives
                </h4>
                <p className="text-[11px] text-[#666666]">
                  Reallocate planetary workforce across agriculture, hydration, mining, and research with one click.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#888888]">Direct Strata Presets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => handleApplyStrataPreset('agrarian')}
                className="p-2.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-xs text-emerald-900 flex items-center gap-1">
                  <span>🌾 Agrarian & Water</span>
                </div>
                <span className="text-[10px] text-emerald-700 block mt-0.5">35% Farm / 22% Water</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStrataPreset('industrial')}
                className="p-2.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-xs text-amber-900 flex items-center gap-1">
                  <span>⛏️ Mining & Heavy Ind</span>
                </div>
                <span className="text-[10px] text-amber-700 block mt-0.5">35% Ore / 30% Fab</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStrataPreset('science')}
                className="p-2.5 border border-purple-300 bg-purple-50 hover:bg-purple-100 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-xs text-purple-900 flex items-center gap-1">
                  <span>🔬 Science Nexus</span>
                </div>
                <span className="text-[10px] text-purple-700 block mt-0.5">32% Researchers</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStrataPreset('military')}
                className="p-2.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-xs text-rose-900 flex items-center gap-1">
                  <span>🛡️ Martial Draft</span>
                </div>
                <span className="text-[10px] text-rose-700 block mt-0.5">25% Recruits / 22% Fab</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStrataPreset('balanced')}
                className="p-2.5 border border-[#111111] bg-[#111111] text-white hover:bg-[#333333] text-left transition-colors cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>⚖️ Harmonic Census</span>
                </div>
                <span className="text-[10px] opacity-80 block mt-0.5">Proportional Balance</span>
              </button>
            </div>
          </div>

          {/* Strata Allocation Table & Living Standard Directives */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Strata Table */}
            <div className="lg:col-span-7 border border-[#dedede] bg-white p-6 space-y-4">
              <h4 className="font-bold text-sm text-[#111111] uppercase tracking-wider border-b border-[#eeeeee] pb-2 flex items-center justify-between">
                <span>Citizen Workforce & Demographics Strata</span>
                <span className="text-xs text-[#777777] font-mono">
                  Total: {(activePlanet.population?.total ?? 14200000).toLocaleString()} Pops
                </span>
              </h4>

              <div className="space-y-3">
                {/* 1. Farmers */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">🌾 Agricultural Farmers & Biosphere Workers</strong>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1 py-0.2">+Food Yield</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Hydroponic cultivators, bio-dome tenders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-800 text-right">
                      {(activePlanet.population?.strata?.farmers ?? 2500000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.farmers ?? 2500000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('farmers', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                        title="Reduce 50k"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('farmers', 50000)}
                        className="px-1.5 py-1 bg-emerald-700 text-white font-mono text-[10px] font-bold hover:bg-emerald-800 cursor-pointer"
                        title="Add 50k"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Hydrologists */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">💧 Hydrologists & Aquifer Engineers</strong>
                      <span className="text-[10px] text-cyan-700 font-bold bg-cyan-100 px-1 py-0.2">+Water Extr</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Desalination ops, water reclamation techs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-800 text-right">
                      {(activePlanet.population?.strata?.hydrologists ?? 1500000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.hydrologists ?? 1500000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('hydrologists', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                        title="Reduce 50k"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('hydrologists', 50000)}
                        className="px-1.5 py-1 bg-cyan-700 text-white font-mono text-[10px] font-bold hover:bg-cyan-800 cursor-pointer"
                        title="Add 50k"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Miners */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">⛏️ Ore Miners & Naquadah Extractors</strong>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1 py-0.2">+Metal / NQ</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Subsurface excavators, blast furnace crews</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-800 text-right">
                      {(activePlanet.population?.strata?.miners ?? 3500000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.miners ?? 3500000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('miners', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('miners', 50000)}
                        className="px-1.5 py-1 bg-amber-700 text-white font-mono text-[10px] font-bold hover:bg-amber-800 cursor-pointer"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Industrial Workers */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">🏭 Industrial Fabricators & Assembly Crews</strong>
                      <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-1 py-0.2">+Build Speed</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Factory techs, shipyard fitters, heavy foundries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-indigo-800 text-right">
                      {(activePlanet.population?.strata?.industrialWorkers ?? 4000000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.industrialWorkers ?? 4000000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('industrialWorkers', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('industrialWorkers', 50000)}
                        className="px-1.5 py-1 bg-indigo-700 text-white font-mono text-[10px] font-bold hover:bg-indigo-800 cursor-pointer"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Scientists */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">🔬 Scientists & Warp Technicians</strong>
                      <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1 py-0.2">+Research</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Lab researchers, sensor analysts, hyperspace physics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-purple-800 text-right">
                      {(activePlanet.population?.strata?.scientists ?? 1200000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.scientists ?? 1200000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('scientists', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('scientists', 50000)}
                        className="px-1.5 py-1 bg-purple-700 text-white font-mono text-[10px] font-bold hover:bg-purple-800 cursor-pointer"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. Administrators */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">👑 Planetary Administrators & Magistrates</strong>
                      <span className="text-[10px] text-neutral-700 font-bold bg-neutral-200 px-1 py-0.2">-Unrest</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Logistics coordination, municipal governance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#555555] text-right">
                      {(activePlanet.population?.strata?.administrators ?? 500000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.administrators ?? 500000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('administrators', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('administrators', 50000)}
                        className="px-1.5 py-1 bg-[#111111] text-white font-mono text-[10px] font-bold hover:bg-[#333] cursor-pointer"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>

                {/* 7. Military Recruits */}
                <div className="p-3 bg-[#fafafa] border border-[#eeeeee] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#111111]">🛡️ Garrison Troops & Military Recruits</strong>
                      <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-1 py-0.2">+Defense Pool</span>
                    </div>
                    <span className="text-[#777777] block text-[11px] mt-0.5">Planetary defense corps, planetary security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-rose-800 text-right">
                      {(activePlanet.population?.strata?.militaryRecruits ?? 1000000).toLocaleString()}{' '}
                      <span className="text-[10px] text-[#777]">
                        ({Math.round(((activePlanet.population?.strata?.militaryRecruits ?? 1000000) / (activePlanet.population?.total || 1)) * 100)}%)
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('militaryRecruits', -50000)}
                        className="px-1.5 py-1 bg-white border border-[#dedede] text-[#111] font-mono text-[10px] hover:bg-neutral-100 cursor-pointer"
                      >
                        -50k
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStrata('militaryRecruits', 50000)}
                        className="px-1.5 py-1 bg-rose-700 text-white font-mono text-[10px] font-bold hover:bg-rose-800 cursor-pointer"
                      >
                        +50k
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directives, Welfare & Rationing Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Planetary Welfare & Relief Directives */}
              <div className="border border-[#dedede] bg-white p-5 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] border-b border-[#eeeeee] pb-2 flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-indigo-600" />
                  <span>Colonial Welfare & Civil Relief Directives</span>
                </h4>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handlePlanetaryWelfare('grain_ration')}
                    className="w-full p-2.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>🥖 Emergency Grain Relief</span>
                      <span className="text-[10px] font-mono text-emerald-700">-14% Unrest | +10% Hap</span>
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Distributes 4,000 kg food stockpile to appease citizens.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlanetaryWelfare('water_relief')}
                    className="w-full p-2.5 border border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-900">
                      <span>🚰 Aquifer Drought Relief</span>
                      <span className="text-[10px] font-mono text-cyan-700">-12% Unrest | +8% Hap</span>
                    </div>
                    <p className="text-[10px] text-cyan-700 mt-0.5">Distributes 4,500 kL water to quench arid settlements.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlanetaryWelfare('healthcare')}
                    className="w-full p-2.5 border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                      <span>🏥 Public Genetic Healthcare</span>
                      <span className="text-[10px] font-mono text-indigo-700">+15% Hap | +8k Pop/h</span>
                    </div>
                    <p className="text-[10px] text-indigo-700 mt-0.5">Vaccination & bio-clinics (Cost: 8,000 NQ).</p>
                  </button>
                </div>
              </div>

              {/* Living Standards & Rationing Protocol */}
              <div className="border border-[#dedede] bg-white p-5 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#111111] border-b border-[#eeeeee] pb-2">
                  Living Standards & Caloric Policy
                </h4>

                <div>
                  <span className="text-xs font-bold text-[#777777] uppercase block mb-2">Living Standard Protocol:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['utopian', 'decent', 'basic', 'impoverished', 'chemical_bliss'] as const).map((std) => {
                      const isSelected = (activePlanet.population?.livingStandard ?? 'utopian') === std;
                      return (
                        <button
                          key={std}
                          type="button"
                          onClick={() => handleSetLivingStandard(std)}
                          className={`p-2.5 text-left border text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#111111] bg-[#111111] text-white font-bold'
                              : 'border-[#dedede] bg-[#fafafa] text-[#111111] hover:border-[#111111]'
                          }`}
                        >
                          <div className="uppercase text-[10px]">{std.replace('_', ' ')}</div>
                          <span className="text-[9px] opacity-80 block mt-0.5">
                            {std === 'utopian'
                              ? '+15% Morale, +20% Growth'
                              : std === 'decent'
                              ? 'Balanced upkeep'
                              : std === 'basic'
                              ? '-30% Upkeep, -10% Morale'
                              : std === 'chemical_bliss'
                              ? 'Zero Unrest, +60% Morale'
                              : 'Minimal upkeep'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-[#777777] uppercase block mb-2">Food & Caloric Rationing:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['abundant', 'standard', 'strict_rationing', 'famine_starvation'] as const).map((rat) => {
                      const isSelected = (activePlanet.population?.rationingLevel ?? 'abundant') === rat;
                      return (
                        <button
                          key={rat}
                          type="button"
                          onClick={() => handleSetRationing(rat)}
                          className={`p-2.5 text-left border text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-emerald-700 bg-emerald-700 text-white font-bold'
                              : 'border-[#dedede] bg-[#fafafa] text-[#111111] hover:border-emerald-700'
                          }`}
                        >
                          <div className="uppercase text-[10px]">{rat.replace('_', ' ')}</div>
                          <span className="text-[9px] opacity-80 block mt-0.5">
                            {rat === 'abundant'
                              ? '3,500 kcal (+25% Growth)'
                              : rat === 'standard'
                              ? '2,200 kcal (Normal)'
                              : rat === 'strict_rationing'
                              ? '1,400 kcal (-40% Food)'
                              : '800 kcal (Starvation Risk)'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU: PLANETARY HAZARDS & ENVIRONMENTAL DISASTERS */}
      {/* ========================================================================= */}
      {activeTab === 'hazards' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                  <AlertOctagon className="text-amber-600 w-5 h-5" />
                  <span>Planetary Hazards & Environmental Cataclysms Matrix</span>
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Active seismic fissures, solar radiation squalls, smog inversions, and biospheric anomalies on {activePlanet.name}.
                </p>
              </div>
              <div className="px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs">
                <span className="text-[#777777] block text-[9px] uppercase">Active Hazards:</span>
                <strong className="text-amber-700">
                  {activePlanet.hazards?.filter((h) => !h.isMitigated).length || 0} Unmitigated Threats
                </strong>
              </div>
            </div>
          </div>

          {/* Hazards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(activePlanet.hazards || [
              {
                id: 'hz-volcanic',
                name: 'Tectonic Rift Fissures & Magma Venting',
                type: 'supervolcano' as const,
                severity: 'moderate' as const,
                icon: '🌋',
                effectDescription: 'Tectonic shaking destabilizes surface farms and reduces building plots by 4.',
                habitabilityPenalty: 8,
                popGrowthPenalty: 12,
                waterContaminationPercent: 5,
                isMitigated: false,
                mitigationCost: { metal: 20000, crystal: 10000, deuterium: 0, naquadah: 5000 },
              },
              {
                id: 'hz-smog',
                name: 'Toxic Spore Inversion Layer',
                type: 'toxic_spore' as const,
                severity: 'low' as const,
                icon: '☣️',
                effectDescription: 'Atmospheric pollutants trap particulate spores in urban metro domes.',
                habitabilityPenalty: 5,
                popGrowthPenalty: 8,
                waterContaminationPercent: 8,
                isMitigated: false,
                mitigationCost: { metal: 12000, crystal: 15000, deuterium: 5000, naquadah: 0 },
              }
            ]).map((hazard) => {
              const isMitigated = hazard.isMitigated;
              const cost = hazard.mitigationCost || { metal: 15000, crystal: 10000, deuterium: 0, naquadah: 5000 };
              return (
                <div
                  key={hazard.id}
                  className={`border p-5 flex flex-col justify-between transition-all ${
                    isMitigated
                      ? 'bg-neutral-50/60 border-[#dedede] opacity-80'
                      : 'bg-white border-amber-300 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{hazard.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-[#111111]">{hazard.name}</h4>
                          <span className="text-[10px] font-mono text-[#777777] uppercase">Hazard Type: {hazard.type}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 font-mono text-xs font-bold uppercase ${
                          isMitigated
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : hazard.severity === 'cataclysmic' || hazard.severity === 'high'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {isMitigated ? 'Neutralized' : `${hazard.severity} Severity`}
                      </span>
                    </div>

                    <p className="text-xs text-[#666666] leading-relaxed mb-4">
                      {hazard.effectDescription}
                    </p>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#fafafa] border border-[#eeeeee] text-xs font-mono text-center">
                      <div>
                        <span className="text-[9px] text-[#777777] block">Habitability</span>
                        <strong className={isMitigated ? 'text-neutral-400' : 'text-rose-600'}>
                          -{hazard.habitabilityPenalty}%
                        </strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#777777] block">Pop Growth</span>
                        <strong className={isMitigated ? 'text-neutral-400' : 'text-amber-700'}>
                          -{hazard.popGrowthPenalty}%
                        </strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#777777] block">Water Contam.</span>
                        <strong className={isMitigated ? 'text-neutral-400' : 'text-blue-700'}>
                          +{hazard.waterContaminationPercent}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eeeeee]">
                    {isMitigated ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                        <CheckCircle2 size={15} />
                        <span>Hazard neutralized by planetary engineering core</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMitigateHazard(hazard.id)}
                        className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-amber-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Shield size={13} />
                        <span>
                          Deploy Engineering Scrubbers ({cost.metal ? `${(cost.metal / 1000)}k M ` : ''}
                          {cost.crystal ? `${(cost.crystal / 1000)}k C ` : ''}
                          {cost.naquadah ? `${(cost.naquadah / 1000)}k NQ` : ''})
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU: COLONIAL PLUNGE SYSTEM & CRISIS INTERVENTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'plunge' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
                  <TrendingDown className="text-rose-600 w-5 h-5" />
                  <span>Colonial Plunge System · Planetary Fragility & Crisis Interventions</span>
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Monitor {activePlanet.name}'s plunge index. Societal collapse occurs if food, water, hazards, or unrest cross fatal thresholds.
                </p>
              </div>
              <div className="px-3 py-1.5 bg-white border border-[#dedede] font-mono text-xs">
                <span className="text-[#777777] block text-[9px] uppercase">Plunge Stage:</span>
                <strong className="text-emerald-700 uppercase font-bold">
                  {activePlanet.plunge?.stage ?? 'stable'}
                </strong>
              </div>
            </div>
          </div>

          {/* Plunge Status Main Gauge */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#eeeeee] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  Colonial Plunge Index Gauge (0% Nominal → 100% Total Collapse)
                </span>
                <h4 className="text-2xl font-black font-mono text-[#111111] mt-0.5">
                  {activePlanet.plunge?.plungeIndex ?? 8}% · <span className="text-emerald-700 text-lg">STABLE & RECOVERING</span>
                </h4>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                  Trend: {activePlanet.plunge?.trend ?? 'stable'}
                </span>
                <span className="px-2.5 py-1 bg-[#fafafa] border border-[#dedede] text-[#111111]">
                  Interventions Ready: 4
                </span>
              </div>
            </div>

            {/* Visual Plunge Bar */}
            <div className="space-y-1">
              <div className="w-full h-4 bg-[#eeeeee] overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, 100 - (activePlanet.plunge?.plungeIndex ?? 8)))}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${activePlanet.plunge?.plungeIndex ?? 8}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#777777]">
                <span>0% Utopian Abundance</span>
                <span>25% Minor Friction</span>
                <span>50% Severe Stress</span>
                <span>75% Civil Breakdown</span>
                <span>100% Total Planetary Plunge</span>
              </div>
            </div>

            {/* Plunge Root Vectors Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3">
              <div className="p-3 bg-[#fafafa] border border-[#eeeeee] text-xs font-mono">
                <span className="text-[#777777] block text-[9px] uppercase">1. Food Stock Sufficiency</span>
                <strong className="text-emerald-700 font-bold">+0% Plunge Risk</strong>
                <span className="block text-[10px] text-[#555555] mt-0.5">42,000 kg surplus</span>
              </div>
              <div className="p-3 bg-[#fafafa] border border-[#eeeeee] text-xs font-mono">
                <span className="text-[#777777] block text-[9px] uppercase">2. Aquifer & Water Supply</span>
                <strong className="text-emerald-700 font-bold">+0% Plunge Risk</strong>
                <span className="block text-[10px] text-[#555555] mt-0.5">58,000 kL reserve</span>
              </div>
              <div className="p-3 bg-[#fafafa] border border-[#eeeeee] text-xs font-mono">
                <span className="text-[#777777] block text-[9px] uppercase">3. Unmitigated Hazards</span>
                <strong className="text-amber-700 font-bold">+5% Plunge Friction</strong>
                <span className="block text-[10px] text-[#555555] mt-0.5">Tectonic vents active</span>
              </div>
              <div className="p-3 bg-[#fafafa] border border-[#eeeeee] text-xs font-mono">
                <span className="text-[#777777] block text-[9px] uppercase">4. Civil Unrest & Labor</span>
                <strong className="text-emerald-700 font-bold">+3% Plunge Baseline</strong>
                <span className="block text-[10px] text-[#555555] mt-0.5">12% citizen unrest</span>
              </div>
            </div>
          </div>

          {/* Emergency Crisis Interventions Menu */}
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h4 className="font-bold text-sm text-[#111111] uppercase tracking-wider border-b border-[#eeeeee] pb-2 flex items-center justify-between">
              <span>Emergency Colonial Interventions (Plunge Reducers)</span>
              <span className="text-xs font-mono text-[#777777]">Authorized Command Directives</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emergency Relief */}
              <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <strong className="text-xs text-[#111111] font-bold uppercase">
                      🍞 Emergency Food & Medical Air-Drop
                    </strong>
                    <span className="text-xs font-mono font-bold text-emerald-700">-18% Plunge</span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Dispatch orbital cargo transports loaded with protein paste and anti-toxins into metropolitan plazas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteIntervention('emergency-relief')}
                  className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Execute Relief · 15k Metal | 25k Naquadah
                </button>
              </div>

              {/* Martial Law Curfew */}
              <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <strong className="text-xs text-[#111111] font-bold uppercase">
                      🛡️ Garrison Martial Law & Curfew
                    </strong>
                    <span className="text-xs font-mono font-bold text-amber-700">-12% Plunge</span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Deploy security battalions and patrol gunships to quell riots, enforce rationing, and secure utility hubs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteIntervention('martial-law')}
                  className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  Enact Curfew · 30k Metal | 40k Naquadah
                </button>
              </div>

              {/* Subsidized Desal */}
              <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <strong className="text-xs text-[#111111] font-bold uppercase">
                      💧 Subsidized Aquifer Flash-Purification
                    </strong>
                    <span className="text-xs font-mono font-bold text-cyan-700">-15% Plunge</span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Overdrive subterranean desalination filters to flush saline reservoirs with purified deuterium water.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteIntervention('subsidized-desal')}
                  className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-cyan-700 transition-colors cursor-pointer"
                >
                  Subsidize Pumps · 20k Deut | 35k Naquadah
                </button>
              </div>

              {/* Climate Shield */}
              <div className="p-4 bg-[#fafafa] border border-[#dedede] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <strong className="text-xs text-[#111111] font-bold uppercase">
                      🌌 Planetary Deflector Array Climate Shield
                    </strong>
                    <span className="text-xs font-mono font-bold text-purple-700">-25% Plunge</span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Calibrate orbital defense satellites to ionize the upper ozone, dispersing solar storms and acid smog.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteIntervention('climate-shield')}
                  className="mt-4 w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Deploy Shield · 40k Crystal | 25k Deut | 60k NQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 2: MINES & ENERGY GRID */}
      {/* ========================================================================= */}
      {activeTab === 'mines' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <h3 className="font-bold text-lg text-[#111111]">
              Planetary Mines & Subterranean Extraction Complex
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Extract raw minerals from {activePlanet.name}'s geological crust. Upgrade mines to accelerate hourly production rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Metal Mine */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Titanium Metal Mine</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.mines?.metalMine || 24}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Deep crust excavators harvesting heavy titanium and structural alloys for drydocks and armor plating.
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                  <div className="flex justify-between">
                    <span>Hourly Yield:</span>
                    <strong className="text-[#111111]">+{((activePlanet.mines?.metalMine || 24) * 2000).toLocaleString()} Metal/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Consumption:</span>
                    <strong className="text-amber-700">-{(activePlanet.mines?.metalMine || 24) * 25} MW</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">
                  Cost: 15k Metal · 6k Cryst
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('mines', 'metalMine', 15000, 6000, 0, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Level {(activePlanet.mines?.metalMine || 24) + 1}
                </button>
              </div>
            </div>

            {/* Crystal Synthesizer */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Crystal Synthesizer</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.mines?.crystalMine || 20}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Quartz refining and silicate crystal fabrication plants providing optical circuits and laser prisms.
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                  <div className="flex justify-between">
                    <span>Hourly Yield:</span>
                    <strong className="text-cyan-700">+{((activePlanet.mines?.crystalMine || 20) * 1400).toLocaleString()} Crystal/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Consumption:</span>
                    <strong className="text-amber-700">-{(activePlanet.mines?.crystalMine || 20) * 30} MW</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">
                  Cost: 20k Metal · 12k Cryst
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('mines', 'crystalMine', 20000, 12000, 0, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Level {(activePlanet.mines?.crystalMine || 20) + 1}
                </button>
              </div>
            </div>

            {/* Deuterium Synthesizer */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Deuterium Centrifuge</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.mines?.deuteriumSynthesizer || 18}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Heavy isotope water centrifuges isolating deuterium for hyperdrives, fusion engines, and stargates.
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                  <div className="flex justify-between">
                    <span>Hourly Yield:</span>
                    <strong className="text-blue-700">+{((activePlanet.mines?.deuteriumSynthesizer || 18) * 1000).toLocaleString()} Deut/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Consumption:</span>
                    <strong className="text-amber-700">-{(activePlanet.mines?.deuteriumSynthesizer || 18) * 45} MW</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">
                  Cost: 25k Metal · 15k Cryst · 5k Deut
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('mines', 'deuteriumSynthesizer', 25000, 15000, 5000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Level {(activePlanet.mines?.deuteriumSynthesizer || 18) + 1}
                </button>
              </div>
            </div>

            {/* Naquadah Core Tap */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Naquadah Core Tap</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.mines?.naquadahCoreTap || 16}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Ultra-deep boreholes tapping directly into primordial naquadah veins in the lower mantle.
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                  <div className="flex justify-between">
                    <span>Hourly Yield:</span>
                    <strong className="text-amber-600">+{((activePlanet.mines?.naquadahCoreTap || 16) * 2200).toLocaleString()} NQ/h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Consumption:</span>
                    <strong className="text-amber-700">-{(activePlanet.mines?.naquadahCoreTap || 16) * 40} MW</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">
                  Cost: 35k Metal · 20k Cryst · 10k NQ
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('mines', 'naquadahCoreTap', 35000, 20000, 0, 10000)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Level {(activePlanet.mines?.naquadahCoreTap || 16) + 1}
                </button>
              </div>
            </div>

            {/* Solar Power Plant */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Solar Power Plant</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.mines?.solarPlant || 22}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  High-efficiency photovoltaic collectors capturing solar radiation across the planetary surface.
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                  <div className="flex justify-between">
                    <span>Clean Power Generated:</span>
                    <strong className="text-emerald-700">+{((activePlanet.mines?.solarPlant || 22) * 55).toLocaleString()} MW</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">
                  Cost: 10k Metal · 5k Cryst
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('mines', 'solarPlant', 10000, 5000, 0, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Level {(activePlanet.mines?.solarPlant || 22) + 1}
                </button>
              </div>
            </div>

            {/* Fusion Reactor */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Deuterium Fusion Reactor</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.mines?.fusionReactor || 12}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Advanced tokamak fusion chamber consuming deuterium isotopes to deliver massive base-load power.
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-[#555555]">
                  <div className="flex justify-between">
                    <span>Power Generated:</span>
                    <strong className="text-emerald-700">+{((activePlanet.mines?.fusionReactor || 12) * 85).toLocaleString()} MW</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Deuterium Fuel Rate:</span>
                    <strong className="text-amber-700">-{(activePlanet.mines?.fusionReactor || 12) * 20} Deut/h</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">
                  Cost: 20k Metal · 15k Cryst · 8k Deut
                </div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('mines', 'fusionReactor', 20000, 15000, 8000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Level {(activePlanet.mines?.fusionReactor || 12) + 1}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 3: PLANETARY FACILITIES */}
      {/* ========================================================================= */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <h3 className="font-bold text-lg text-[#111111]">
              Planetary Industrial & Scientific Facilities
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Construct high-tech manufacturing plants, drydocks, and laboratories on {activePlanet.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Robotics Factory */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Robotics Factory</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.facilities?.roboticsFactory || 8}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Automated construction droids accelerating building construction speeds by -10% per level.
                </p>
                <div className="mt-3 text-xs font-mono text-emerald-700">
                  Speed Bonus: -{((activePlanet.facilities?.roboticsFactory || 8) * 10)}% Build Time
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">Cost: 20k Metal · 12k Cryst</div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('facilities', 'roboticsFactory', 20000, 12000, 0, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Lv {(activePlanet.facilities?.roboticsFactory || 8) + 1}
                </button>
              </div>
            </div>

            {/* Shipyard */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Orbital Shipyard</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.facilities?.shipyard || 10}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Orbital drydocks producing light corvettes, battlecruisers, and planetary defense turrets.
                </p>
                <div className="mt-3 text-xs font-mono text-cyan-700">
                  Unlocks: Battlecruisers, Bombers & Destroyers
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">Cost: 30k Metal · 20k Cryst · 5k Deut</div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('facilities', 'shipyard', 30000, 20000, 5000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Lv {(activePlanet.facilities?.shipyard || 10) + 1}
                </button>
              </div>
            </div>

            {/* Research Lab */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Research Laboratory</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.facilities?.researchLab || 12}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  High-energy physics and subspace quantum labs contributing to empire-wide scientific research.
                </p>
                <div className="mt-3 text-xs font-mono text-purple-700">
                  Tech Speed: +{((activePlanet.facilities?.researchLab || 12) * 8)}% Research Efficiency
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">Cost: 25k Metal · 35k Cryst · 10k Deut</div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('facilities', 'researchLab', 25000, 35000, 10000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Lv {(activePlanet.facilities?.researchLab || 12) + 1}
                </button>
              </div>
            </div>

            {/* Nanite Factory */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Nanite Factory</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.facilities?.naniteFactory || 4}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Microscopic self-replicating nanite assemblers that halve building and fleet construction times per level.
                </p>
                <div className="mt-3 text-xs font-mono text-emerald-700">
                  Nanite Halving: 2^{activePlanet.facilities?.naniteFactory || 4}x Speed Multiplier
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">Cost: 80k Metal · 50k Cryst · 30k Deut</div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('facilities', 'naniteFactory', 80000, 50000, 30000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Lv {(activePlanet.facilities?.naniteFactory || 4) + 1}
                </button>
              </div>
            </div>

            {/* Terraformer */}
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Planetary Terraformer</h4>
                  <span className="px-2 py-0.5 bg-[#111111] text-white font-mono text-xs font-bold">
                    Lv {activePlanet.facilities?.terraformer || 2}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Atmosphere processors expanding usable land and adding +5 maximum building fields per level.
                </p>
                <div className="mt-3 text-xs font-mono text-blue-700">
                  Fields Added: +{((activePlanet.facilities?.terraformer || 2) * 5)} Usable Plots
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <div className="text-[11px] font-mono text-[#777777] mb-2">Cost: 50k Metal · 60k Cryst · 40k Deut</div>
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('facilities', 'terraformer', 50000, 60000, 40000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Upgrade to Lv {(activePlanet.facilities?.terraformer || 2) + 1}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 4: PLANETARY DEFENSE GRID */}
      {/* ========================================================================= */}
      {activeTab === 'defenses' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <h3 className="font-bold text-lg text-[#111111]">
              Planetary Defense Grid & Orbital Artillery
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Construct hardened surface batteries and energy domes on {activePlanet.name} to repel hostile fleet raids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Rocket Launchers</h4>
                  <span className="font-mono text-sm font-bold text-[#111111]">
                    {(activePlanet.defenses?.rocketLauncher || 850).toLocaleString()} Active
                  </span>
                </div>
                <p className="text-xs text-[#666666]">Light surface-to-orbit kinetic missile pods.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('defenses', 'rocketLauncher', 2000, 0, 0, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] cursor-pointer"
                >
                  Build +100 Pods (20k Metal)
                </button>
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Light & Heavy Lasers</h4>
                  <span className="font-mono text-sm font-bold text-cyan-700">
                    {(activePlanet.defenses?.lightLaser || 420).toLocaleString()} / {(activePlanet.defenses?.heavyLaser || 180).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-[#666666]">Coherent high-frequency beam arrays melting ship hull armor.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('defenses', 'lightLaser', 4000, 2000, 0, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] cursor-pointer"
                >
                  Build +50 Lasers (20k Met / 10k Cryst)
                </button>
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2.5 mb-3">
                  <h4 className="font-bold text-sm text-[#111111]">Gauss & Plasma Turrets</h4>
                  <span className="font-mono text-sm font-bold text-rose-700">
                    {(activePlanet.defenses?.gaussCannon || 65).toLocaleString()} / {(activePlanet.defenses?.plasmaTurret || 18).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-[#666666]">Super-heavy capital ship killer batteries.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('defenses', 'plasmaTurret', 25000, 15000, 5000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] cursor-pointer"
                >
                  Build +5 Plasma Turrets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 5: MOON BASE & SENSOR PHALANX */}
      {/* ========================================================================= */}
      {activeTab === 'moon' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <h3 className="font-bold text-lg text-[#111111]">
              Attached Lunar Outpost: {activePlanet.moonName || 'Luna Prime'}
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Manage lunar bases, scan hostile fleet trajectories across star systems with the Sensor Phalanx, and initiate instant Jump Gate teleports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#dedede] bg-white p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Infrastructure</span>
                <h4 className="font-bold text-base text-[#111111]">Lunar Base</h4>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                  Provides pressurized underground habitation tunnels and adds +3 building fields on the moon per level.
                </p>
                <div className="mt-3 font-mono text-xs text-[#111111]">
                  Current Level: <strong>Lv {activePlanet.lunarBase?.level || 4}</strong> ({activePlanet.lunarBase?.moonFieldsUsed || 12}/{activePlanet.lunarBase?.moonFieldsMax || 25} Fields)
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('lunarBase', 'level', 30000, 40000, 20000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] cursor-pointer"
                >
                  Upgrade Lunar Base (30k Met / 40k Cryst / 20k Deut)
                </button>
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Deep Recon</span>
                <h4 className="font-bold text-base text-[#111111]">Sensor Phalanx</h4>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                  High-powered subspace radar scanning enemy systems to reveal fleet compositions, mission types, and arrival timers.
                </p>
                <div className="mt-3 font-mono text-xs text-cyan-700">
                  Scan Range: <strong>{Math.pow(activePlanet.lunarBase?.sensorPhalanxLevel || 5, 2) - 1} Solar Systems</strong>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => handleUpgradeFacilityOrMine('lunarBase', 'sensorPhalanxLevel', 40000, 60000, 30000, 0)}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] cursor-pointer"
                >
                  Upgrade Phalanx (Lv {(activePlanet.lunarBase?.sensorPhalanxLevel || 5) + 1})
                </button>
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Instant Fleet FTL</span>
                <h4 className="font-bold text-base text-[#111111]">Inter-Lunar Jump Gate</h4>
                <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                  Instantly teleports entire battle fleets between any owned moon bases with zero travel time or deuterium cost.
                </p>
                <div className="mt-3 font-mono text-xs text-emerald-700">
                  Status: <strong>Ready (Gate Lv {activePlanet.lunarBase?.jumpGateLevel || 2})</strong>
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => {
                    sound.play('warp_pulse');
                    setNotice({ type: 'success', text: 'Jump Gate ready! Fleet teleportation link calibrated.' });
                  }}
                  className="w-full py-2 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] cursor-pointer"
                >
                  Engage Jump Gate Teleport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 6: GOVERNANCE & SPECIALIZATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="border border-[#dedede] bg-white p-6 space-y-4">
            <h3 className="font-bold text-base text-[#111111] uppercase tracking-wider">
              Colonial Specialization & Governance Directives
            </h3>
            <p className="text-xs text-[#666666]">
              Designate colonial purpose to receive specialized resource extraction and fleet defense buffs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { id: 'homeworld', label: 'Homeworld Command', desc: '+25% All Resources, Capital Defense Nexus' },
                { id: 'mining', label: 'Heavy Mining Colony', desc: '+40% Metal & Naquadah Extraction Rate' },
                { id: 'industrial', label: 'Shipyard Forge World', desc: '-30% Fleet & Building Construction Time' },
                { id: 'research', label: 'Deep Science Enclave', desc: '+35% Research Speed & Lab Efficiency' },
                { id: 'fortress', label: 'Orbital Fortress Bastion', desc: '+50% Defense Rating & Shield HP' },
                { id: 'trade', label: 'Free Trade Port', desc: '+30% Plunder & Market Exchange Profit' },
              ].map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => handleSetSpecialization(spec.id as any)}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    activePlanet.specialization === spec.id
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#fafafa] border-[#dedede] hover:border-[#111111]'
                  }`}
                >
                  <strong className="text-xs font-bold block">{spec.label}</strong>
                  <span className={`text-[11px] mt-1 block ${activePlanet.specialization === spec.id ? 'text-neutral-300' : 'text-[#666666]'}`}>
                    {spec.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Tax Directives */}
            <div className="pt-4 border-t border-[#eeeeee]">
              <span className="text-xs font-bold text-[#111111] uppercase block mb-2">
                Planetary Tax Directives:
              </span>
              <div className="flex gap-3">
                {[
                  { id: 'balanced', label: 'Standard Balanced (100% Tribute)' },
                  { id: 'extractive', label: 'Heavy Extractive (+30% Yield, -10% Growth)' },
                  { id: 'subsidized', label: 'Subsidized Colony (+35% Growth, -30% Tax)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSetTaxPolicy(t.id as any)}
                    className={`px-4 py-2 text-xs font-bold border cursor-pointer ${
                      (activePlanet.taxPolicy || 'balanced') === t.id
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-[#dedede] hover:border-[#111111]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 7: ALL EMPIRE WORLDS COMPARISON MATRIX & COLONIAL LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'all-worlds' && (
        <div className="space-y-6">
          {/* Empire Colonial Summary Banner */}
          <div className="border border-[#dedede] bg-[#fafafa] p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider block">
                  Imperial Colonial Administration · Expansion Efficiency
                </span>
                <h3 className="text-xl font-bold text-[#111111] mt-0.5">
                  Colonial Ledger & Maintenance Trade-off
                </h3>
                <p className="text-xs text-[#666666] mt-1 max-w-xl">
                  Balancing colony tier expansion with maintenance overhead is crucial. As you expand more worlds and raise their tiers, logistical strain increases.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full lg:w-auto">
                <div className="p-3 bg-white border border-[#dedede]">
                  <span className="text-[10px] text-[#777777] uppercase font-bold block">Empire Worlds</span>
                  <strong className="text-sm font-mono text-[#111111] block mt-0.5">{planets.length} Worlds ({empireColonialSummary.totalColonyLevels} Tiers)</strong>
                </div>

                <div className="p-3 bg-white border border-[#dedede]">
                  <span className="text-[10px] text-[#777777] uppercase font-bold block">Gross Tribute</span>
                  <strong className="text-sm font-mono text-emerald-700 block mt-0.5">+{empireColonialSummary.totalGrossIncome.toLocaleString()} NQ</strong>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200">
                  <span className="text-[10px] text-rose-800 uppercase font-bold block">Total Maintenance</span>
                  <strong className="text-sm font-mono text-rose-700 block mt-0.5">-{empireColonialSummary.totalMaintenanceCost.toLocaleString()} NQ</strong>
                </div>

                <div className="p-3 bg-white border border-[#dedede]">
                  <span className="text-[10px] text-[#777777] uppercase font-bold block">Net Dominion Yield</span>
                  <strong className="text-sm font-mono text-[#111111] block mt-0.5">+{empireColonialSummary.netColonialIncome.toLocaleString()} NQ</strong>
                </div>
              </div>
            </div>

            {/* Efficiency rating bar */}
            <div className="mt-4 pt-4 border-t border-[#dedede] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111111] uppercase">Efficiency Rating:</span>
                <span className={`px-2 py-0.5 font-mono font-bold text-[11px] ${
                  empireColonialSummary.expansionEfficiencyRating === 'Optimal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : empireColonialSummary.expansionEfficiencyRating === 'Sustainable'
                    ? 'bg-blue-100 text-blue-800'
                    : empireColonialSummary.expansionEfficiencyRating === 'Strained'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {empireColonialSummary.expansionEfficiencyRating} ({empireColonialSummary.expansionEfficiencyPercent}% Retention)
                </span>
                <span className="text-[#666666] hidden md:inline">· {empireColonialSummary.expansionRecommendation}</span>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('income')}
                  className="text-xs font-bold text-[#111111] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Coins size={12} />
                  <span>View Global Income Breakdown →</span>
                </button>
              )}
            </div>
          </div>

          {/* Registry List */}
          <div className="border border-[#dedede] bg-white overflow-hidden">
            <div className="px-6 py-4 bg-[#fafafa] border-b border-[#dedede] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                  Imperial Dominion Registry
                </span>
                <h3 className="text-base font-bold text-[#111111]">
                  All Owned Worlds ({planets.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('universe')}
                className="px-3.5 py-1.5 bg-[#111111] text-white text-xs font-bold uppercase hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Rocket size={12} />
                <span>Colonize New World (Universe Map)</span>
              </button>
            </div>

            <div className="divide-y divide-[#dedede]">
              {planets.map((planet) => {
                const isSelected = planet.id === activePlanet.id;
                const pDetails = getColonyMaintenanceDetails(planet, planets.length);
                const upgradeCost = (planet.level || 1) * 35000 + 20000;
                const canAffordUpgrade = resources.naquadah >= upgradeCost;

                return (
                  <div
                    key={planet.id}
                    className={`p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors ${
                      isSelected ? 'bg-neutral-50 border-l-4 border-[#111111]' : 'hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {planet.isHomeworld && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold font-mono">
                            👑 Homeworld
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-[#111111]">{planet.name}</h4>
                        <span className="font-mono text-xs px-2 py-0.5 bg-[#111111] text-white font-bold">
                          [{planet.coordinate}]
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-neutral-200 text-[#111111] font-mono font-bold">
                          Tier {planet.level}
                        </span>
                        <span className="text-xs text-[#777777] capitalize font-mono">
                          {planet.specialization || 'homeworld'} · {planet.taxPolicy || 'balanced'} tax
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#555555]">
                        <span>Biome: <strong>{planet.biome}</strong></span>
                        <span>Fields: <strong>{planet.fieldsUsed || 60}/{planet.fieldsMax || 180}</strong></span>
                        <span className="text-emerald-700">Gross Tribute: <strong>+{pDetails.grossIncome.toLocaleString()} NQ</strong></span>
                        <span className="text-rose-700">Maintenance: <strong>-{pDetails.totalMaintenanceCost.toLocaleString()} NQ</strong></span>
                        <span className="text-[#111111] font-bold">Net Yield: <strong>+{pDetails.netIncome.toLocaleString()} NQ ({pDetails.profitMarginPercent}%)</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpgradeColonyTier(planet.id)}
                        disabled={!canAffordUpgrade}
                        className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 ${
                          canAffordUpgrade
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        }`}
                        title={`Upgrade cost: ${upgradeCost.toLocaleString()} Naquadah`}
                      >
                        <TrendingUp size={12} />
                        <span>Upgrade Tier {planet.level + 1} ({upgradeCost.toLocaleString()} NQ)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPlanetModal(planet)}
                        className="px-3 py-1.5 bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-850 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Activity size={12} />
                        <span>Dossier & Queues</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSelectPlanet(planet.id);
                          setActiveTab('overview');
                        }}
                        className="px-3.5 py-1.5 bg-[#111111] text-white text-xs font-bold hover:bg-[#333333] transition-colors cursor-pointer"
                      >
                        Manage World →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED PLANET MODAL VIEW */}
      {modalPlanet && (
        <PlanetDetailModal
          planet={modalPlanet}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          resources={resources}
          onUpdateResources={onUpdateResources}
          onUpdatePlanet={(updated) => {
            if (onUpdatePlanets) {
              onUpdatePlanets(planets.map((p) => (p.id === updated.id ? updated : p)));
            }
            setModalPlanet(updated);
          }}
          planetsCount={planets.length}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
