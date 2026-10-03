import {
  getSubsystemCatalogForStructure,
  getSubsystemDefinition,
  calculateSubsystemUpgradeCost,
  calculateSubsystemBonus,
  computeSubsystemContribution,
  SUBSYSTEM_EFFECT_LABELS,
  type MegastructureSubsystemDefinition,
  type MegastructureSubsystemEffect,
} from "@shared/config/megastructureSubsystemsConfig";

export type {
  MegastructureSubsystemDefinition,
  MegastructureSubsystemEffect,
} from "@shared/config/megastructureSubsystemsConfig";

export const EFFECT_META: Record<MegastructureSubsystemEffect, { label: string; icon: string; colorClass: string }> = {
  energy: { label: SUBSYSTEM_EFFECT_LABELS.energy, icon: "⚡", colorClass: "text-yellow-600" },
  metal: { label: SUBSYSTEM_EFFECT_LABELS.metal, icon: "⛏️", colorClass: "text-slate-600" },
  crystal: { label: SUBSYSTEM_EFFECT_LABELS.crystal, icon: "💎", colorClass: "text-sky-600" },
  deuterium: { label: SUBSYSTEM_EFFECT_LABELS.deuterium, icon: "🧪", colorClass: "text-indigo-600" },
  research: { label: SUBSYSTEM_EFFECT_LABELS.research, icon: "🔬", colorClass: "text-violet-600" },
  defense: { label: SUBSYSTEM_EFFECT_LABELS.defense, icon: "🛡️", colorClass: "text-rose-600" },
  efficiency: { label: SUBSYSTEM_EFFECT_LABELS.efficiency, icon: "⚙️", colorClass: "text-emerald-600" },
  capacity: { label: SUBSYSTEM_EFFECT_LABELS.capacity, icon: "👥", colorClass: "text-blue-600" },
  storage: { label: SUBSYSTEM_EFFECT_LABELS.storage, icon: "📦", colorClass: "text-amber-600" },
};

export interface MegastructureSubsystemView {
  id: string;
  name: string;
  description: string;
  function: string;
  subFunctions: string[];
  effect: MegastructureSubsystemEffect;
  effectLabel: string;
  category: string;
  icon: string;
  lore: string;
  maxLevel: number;
  level: number;
  maxed: boolean;
  bonus: number;
  nextBonus: number;
  bonusUnit: string;
  contributionLabel: string;
  contribution: Record<string, number>;
  cost: { metal: number; crystal: number; deuterium: number; energy: number };
  unlocked: boolean;
}

export interface MegastructureDetailResponse {
  success: boolean;
  structure: any;
  template: {
    id: string;
    name: string;
    type: string;
    class: string;
    subClass: string;
    description: string;
    lore: string;
    primaryFunction: string;
    secondaryFunctions: string[];
    size: string;
    maxLevel: number;
    maxTier: number;
    resourcesCost: Record<string, number>;
    maintenanceCost: Record<string, number>;
  } | null;
  subsystems: MegastructureSubsystemView[];
  production: {
    resourceProduction: Record<string, number>;
    resourceStorage: Record<string, number>;
    substats: Record<string, number>;
    efficiency: number;
    attack: number;
    defense: number;
    damageOutput: number;
    contributions: Record<string, number>;
    moduleBonuses?: Record<string, number>;
  };
  modules?: MegastructureModuleInfo;
  accrual?: MegastructureAccrual;
}

export async function fetchMegastructureDetail(structureId: string): Promise<MegastructureDetailResponse> {
  const res = await fetch(`/api/megastructures/${structureId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load megastructure detail");
  return res.json();
}

export async function upgradeMegastructureSubsystemApi(
  structureId: string,
  subsystemId: string,
): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/subsystems/${subsystemId}/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.reason || "Subsystem upgrade failed");
  }
  return data;
}

export async function recomputeMegastructureProductionApi(structureId: string): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/production/recompute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error("Production recompute failed");
  }
  return data;
}

export async function fetchDysonProgramSummary(): Promise<{ ownedCount: number; owned: Array<{ id: string; name: string; level: number; completionPercent: number; isOperational: boolean; coordinates: string }> }> {
  const res = await fetch("/api/megastructures/dyson", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load Dyson program");
  return res.json();
}

export function getDysonSubsystemCatalog(): MegastructureSubsystemDefinition[] {
  return getSubsystemCatalogForStructure("dyson-sphere", "infrastructure");
}

export function getSubsystemView(
  definition: MegastructureSubsystemDefinition,
  level: number,
  context?: Partial<{ level: number; tier: number; efficiency: number; power: number }>,
): MegastructureSubsystemView {
  const safeLevel = Math.max(0, Math.floor(level || 0));
  const cost = calculateSubsystemUpgradeCost(definition, safeLevel);
  const normalizedContext = {
    level: context?.level ?? 1,
    tier: context?.tier ?? 1,
    efficiency: context?.efficiency ?? 100,
    power: context?.power ?? 100000,
  };
  const contribution = computeSubsystemContribution(definition, safeLevel, normalizedContext);
  const effectLabel = SUBSYSTEM_EFFECT_LABELS[definition.effect];

  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    function: definition.function,
    subFunctions: definition.subFunctions,
    effect: definition.effect,
    effectLabel,
    category: definition.category,
    icon: definition.icon,
    lore: definition.lore,
    maxLevel: definition.maxLevel,
    level: safeLevel,
    maxed: safeLevel >= definition.maxLevel,
    bonus: calculateSubsystemBonus(definition, safeLevel),
    nextBonus: calculateSubsystemBonus(definition, safeLevel + 1),
    bonusUnit: definition.bonusUnit,
    contributionLabel: `${contribution[definition.effect].toLocaleString()}${definition.bonusUnit.includes("%") ? "%" : definition.bonusUnit}`,
    contribution: contribution as unknown as Record<string, number>,
    cost,
    unlocked: true,
  };
}

export { getSubsystemDefinition };

// ============================================================================
// MODULES / ACCRUAL / CONSTRUCTION
// ============================================================================

export type MegastructureModuleEffect =
  | 'energy'
  | 'production'
  | 'storage'
  | 'research'
  | 'defense'
  | 'efficiency'
  | 'construction';

export interface MegastructureModuleCost {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export interface MegastructureModuleView {
  id: string;
  name: string;
  description: string;
  function: string;
  subFunctions: string[];
  effect: MegastructureModuleEffect;
  effectValue: number;
  effectLabel: string;
  cost: MegastructureModuleCost;
  maxInstances: number;
  unlockLevel: number;
  unlockTier: number;
  category: string;
  icon: string;
  lore: string;
  installed: number;
  locked: boolean;
  lockReason: string | null;
}

export interface InstalledMegastructureModule {
  id: string;
  instanceId: string;
  installedAt: string;
}

export interface MegastructureModuleInfo {
  slots: number;
  installedCount: number;
  installed: InstalledMegastructureModule[];
  catalog: MegastructureModuleView[];
}

export interface MegastructureAccrual {
  elapsedHours: number;
  windowedHours: number;
  accrued: Record<string, number>;
  capped: Record<string, boolean>;
  pendingTotal: number;
  maintenance: MegastructureModuleCost;
}

export const MODULE_EFFECT_META: Record<MegastructureModuleEffect, { label: string; icon: string; colorClass: string }> = {
  energy: { label: "Energy Output", icon: "⚡", colorClass: "text-yellow-600" },
  production: { label: "Raw Resource Production", icon: "⛏️", colorClass: "text-slate-600" },
  storage: { label: "Resource Storage", icon: "📦", colorClass: "text-amber-600" },
  research: { label: "Research Speed", icon: "🔬", colorClass: "text-violet-600" },
  defense: { label: "Defense Rating", icon: "🛡️", colorClass: "text-rose-600" },
  efficiency: { label: "Operational Efficiency", icon: "⚙️", colorClass: "text-emerald-600" },
  construction: { label: "Construction Speed", icon: "🏗️", colorClass: "text-orange-600" },
};

export async function installMegastructureModuleApi(structureId: string, moduleId: string): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/modules/install`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ moduleId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.reason || "Module install failed");
  }
  return data;
}

export async function uninstallMegastructureModuleApi(structureId: string, moduleId: string): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/modules/${moduleId}/uninstall`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.reason || "Module uninstall failed");
  }
  return data;
}

export async function tickMegastructureResourcesApi(structureId: string): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/tick`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.reason || "Production accrual failed");
  }
  return data;
}

export async function upgradeMegastructureLevelApi(structureId: string, levels: number = 1): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/upgrade-level`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ levels }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.reason || "Level upgrade failed");
  }
  return data;
}

export async function upgradeMegastructureTierApi(structureId: string, tiers: number = 1): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/upgrade-tier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tiers }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.reason || "Tier upgrade failed");
  }
  return data;
}

export async function setMegastructureOperationalApi(structureId: string, isOperational: boolean): Promise<any> {
  const res = await fetch(`/api/megastructures/${structureId}/operational`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isOperational }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error("Operational state update failed");
  }
  return data;
}

export async function constructMegastructureApi(params: {
  templateId: string;
  name?: string;
  level?: number;
  tier?: number;
  coordinates?: string;
}): Promise<any> {
  const res = await fetch("/api/megastructures/construct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data?.message || data?.reason || "Construction failed");
  }
  return data;
}
