import {
  getModuleCatalogForStructure,
  getModuleDefinition,
  getModuleSlotsForStructure,
  MODULE_EFFECT_LABELS,
  type InstalledMegastructureModule,
  type MegastructureModuleView,
} from "@shared/config/megastructureModulesConfig";
import type { MegaStructure } from "@shared/schema";
import { storage } from "../storage";
import {
  computeMegastructureProduction,
  readSubsystemLevels,
} from "./megastructureSubsystemService";

// ============================================================================
// HELPERS
// ============================================================================

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function readInstalledModules(structure: MegaStructure): InstalledMegastructureModule[] {
  const details = (structure.details as any) || {};
  const raw = details.modules;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item: any) => item && typeof item.id === "string" && typeof item.instanceId === "string",
  );
}

function countInstalled(installed: InstalledMegastructureModule[], moduleId: string): number {
  return installed.filter((item) => item.id === moduleId).length;
}

function getStructureLevel(structure: MegaStructure): number {
  return Math.max(1, toNumber(structure.level, 1));
}

function getStructureTier(structure: MegaStructure): number {
  const details = (structure.details as any) || {};
  return Math.max(1, toNumber(details.tier, 1));
}

// ============================================================================
// MODULE BONUS MATH
// ============================================================================

export interface MegastructureModuleBonusSummary {
  energy: number;
  production: number;
  storage: number;
  research: number;
  defense: number;
  efficiency: number;
  construction: number;
}

export function sumModuleBonuses(installed: InstalledMegastructureModule[]): MegastructureModuleBonusSummary {
  const total: MegastructureModuleBonusSummary = {
    energy: 0,
    production: 0,
    storage: 0,
    research: 0,
    defense: 0,
    efficiency: 0,
    construction: 0,
  };
  for (const item of installed) {
    const definition = getModuleDefinition(item.id);
    if (!definition) continue;
    const value = toNumber(definition.effectValue);
    switch (definition.effect) {
      case "energy": total.energy += value; break;
      case "production": total.production += value; break;
      case "storage": total.storage += value; break;
      case "research": total.research += value; break;
      case "defense": total.defense += value; break;
      case "efficiency": total.efficiency += value; break;
      case "construction": total.construction += value; break;
    }
  }
  return total;
}

/**
 * Apply module bonuses on top of a computed production profile.
 */
export function applyModuleBonusesToProduction(
  production: ReturnType<typeof computeMegastructureProduction>,
  structure: MegaStructure,
  installed?: InstalledMegastructureModule[],
) {
  const modules = installed || readInstalledModules(structure);
  const bonuses = sumModuleBonuses(modules);

  const resourceProduction = { ...production.resourceProduction };
  const resourceStorage = { ...production.resourceStorage };
  const substats = { ...production.substats };
  let efficiency = production.efficiency;
  let defense = production.defense;

  const pct = (base: number, value: number) => Math.floor(base * (1 + value / 100));

  if (bonuses.energy > 0) {
    resourceProduction.energy = pct(resourceProduction.energy, bonuses.energy);
  }
  if (bonuses.production > 0) {
    resourceProduction.metal = pct(resourceProduction.metal, bonuses.production);
    resourceProduction.crystal = pct(resourceProduction.crystal, bonuses.production);
    resourceProduction.deuterium = pct(resourceProduction.deuterium, bonuses.production);
  }
  if (bonuses.storage > 0) {
    resourceStorage.metal = pct(resourceStorage.metal, bonuses.storage);
    resourceStorage.crystal = pct(resourceStorage.crystal, bonuses.storage);
    resourceStorage.deuterium = pct(resourceStorage.deuterium, bonuses.storage);
    resourceStorage.energy = pct(resourceStorage.energy, bonuses.storage);
  }
  if (bonuses.research > 0) {
    substats.researchMultiplier = Math.round(toNumber(substats.researchMultiplier, 1) + bonuses.research / 100);
  }
  if (bonuses.defense > 0) {
    defense = Math.floor(defense + bonuses.defense * 1000);
  }
  if (bonuses.efficiency > 0) {
    efficiency = Math.min(100, Math.max(0, efficiency + bonuses.efficiency));
  }

  return {
    ...production,
    resourceProduction,
    resourceStorage,
    substats,
    efficiency,
    defense,
    moduleBonuses: bonuses,
  };
}

// ============================================================================
// VIEWS
// ============================================================================

export function getModuleViewsForStructure(
  structure: MegaStructure,
): { views: MegastructureModuleView[]; slots: number; installedCount: number; installed: InstalledMegastructureModule[] } {
  const catalog = getModuleCatalogForStructure(structure.structureType, structure.structureClass);
  const installed = readInstalledModules(structure);
  const level = getStructureLevel(structure);
  const tier = getStructureTier(structure);
  const slots = getModuleSlotsForStructure(level, tier);

  const views: MegastructureModuleView[] = catalog.map((module) => {
    let locked = false;
    let lockReason: string | null = null;
    if (level < module.unlockLevel) {
      locked = true;
      lockReason = `Requires structure level ${module.unlockLevel}`;
    } else if (tier < module.unlockTier) {
      locked = true;
      lockReason = `Requires structure tier ${module.unlockTier}`;
    }

    return {
      id: module.id,
      name: module.name,
      description: module.description,
      function: module.function,
      subFunctions: module.subFunctions,
      effect: module.effect,
      effectValue: module.effectValue,
      effectLabel: MODULE_EFFECT_LABELS[module.effect],
      cost: module.cost,
      maxInstances: module.maxInstances,
      unlockLevel: module.unlockLevel,
      unlockTier: module.unlockTier,
      category: module.category,
      icon: module.icon,
      lore: module.lore,
      installed: countInstalled(installed, module.id),
      locked,
      lockReason,
    };
  });

  return { views, slots, installedCount: installed.length, installed };
}

export function attachMegastructureModulesToDetail(
  detail: Record<string, any>,
  structure: MegaStructure,
): Record<string, any> {
  const moduleInfo = getModuleViewsForStructure(structure);
  const production = applyModuleBonusesToProduction(
    computeMegastructureProduction(structure, readSubsystemLevels(structure)),
    structure,
  );

  return {
    ...detail,
    production,
    modules: {
      slots: moduleInfo.slots,
      installedCount: moduleInfo.installedCount,
      installed: moduleInfo.installed,
      catalog: moduleInfo.views,
    },
  };
}

// ============================================================================
// INSTALL / UNINSTALL
// ============================================================================

export async function installMegastructureModuleForPlayer(
  userId: string,
  structureId: string,
  moduleId: string,
) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    return { success: false, reason: "STRUCTURE_NOT_FOUND" };
  }

  const definition = getModuleDefinition(moduleId);
  if (!definition) {
    return { success: false, reason: "MODULE_NOT_FOUND" };
  }

  const catalog = getModuleCatalogForStructure(structure.structureType, structure.structureClass);
  if (!catalog.some((item) => item.id === moduleId)) {
    return { success: false, reason: "MODULE_NOT_COMPATIBLE" };
  }

  const level = getStructureLevel(structure);
  const tier = getStructureTier(structure);

  if (level < definition.unlockLevel) {
    return { success: false, reason: "LEVEL_LOCKED", requiredLevel: definition.unlockLevel };
  }
  if (tier < definition.unlockTier) {
    return { success: false, reason: "TIER_LOCKED", requiredTier: definition.unlockTier };
  }

  const installed = readInstalledModules(structure);
  const installedOfThis = countInstalled(installed, moduleId);
  if (installedOfThis >= definition.maxInstances) {
    return { success: false, reason: "MAX_INSTANCES_REACHED", maxInstances: definition.maxInstances };
  }

  const slots = getModuleSlotsForStructure(level, tier);
  if (installed.length >= slots) {
    return {
      success: false,
      reason: "NO_FREE_SLOTS",
      slots,
      installedCount: installed.length,
    };
  }

  const playerState = await storage.getPlayerState(userId);
  if (!playerState) {
    return { success: false, reason: "PLAYER_STATE_NOT_FOUND" };
  }

  const resources = playerState.resources || {};
  const metal = toNumber((resources as any).metal);
  const crystal = toNumber((resources as any).crystal);
  const deuterium = toNumber((resources as any).deuterium);
  const energy = toNumber((resources as any).energy);

  if (
    metal < definition.cost.metal ||
    crystal < definition.cost.crystal ||
    deuterium < definition.cost.deuterium ||
    energy < definition.cost.energy
  ) {
    return {
      success: false,
      reason: "INSUFFICIENT_RESOURCES",
      required: definition.cost,
      available: { metal, crystal, deuterium, energy },
    };
  }

  const instance: InstalledMegastructureModule = {
    id: moduleId,
    instanceId: toUuid(),
    installedAt: new Date().toISOString(),
  };

  const nextModules = [...installed, instance];
  await storage.updatePlayerState(userId, {
    resources: {
      ...resources,
      metal: Math.max(0, metal - definition.cost.metal),
      crystal: Math.max(0, crystal - definition.cost.crystal),
      deuterium: Math.max(0, deuterium - definition.cost.deuterium),
      energy: Math.max(0, energy - definition.cost.energy),
    },
  });

  const details = (structure.details as any) || {};
  const production = applyModuleBonusesToProduction(
    computeMegastructureProduction(structure, readSubsystemLevels(structure)),
    structure,
    nextModules,
  );

  const updated = await storage.updateMegaStructure(structureId, {
    details: {
      ...details,
      modules: nextModules,
      lastModuleChangeAt: instance.installedAt,
    },
    resourceProduction: production.resourceProduction,
    resourceStorage: production.resourceStorage,
    substats: production.substats,
    efficiency: production.efficiency,
    defense: production.defense,
    damageOutput: production.damageOutput,
  });

  return {
    success: true,
    module: {
      id: definition.id,
      name: definition.name,
      instanceId: instance.instanceId,
      effect: definition.effect,
      effectValue: definition.effectValue,
    },
    moduleBonuses: production.moduleBonuses,
    production: production.resourceProduction,
    structure: updated,
  };
}

export async function uninstallMegastructureModuleForPlayer(
  userId: string,
  structureId: string,
  moduleId: string,
) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    return { success: false, reason: "STRUCTURE_NOT_FOUND" };
  }

  const installed = readInstalledModules(structure);
  if (!installed.some((item) => item.id === moduleId)) {
    return { success: false, reason: "MODULE_NOT_INSTALLED" };
  }

  const nextModules = installed.filter((item) => item.id !== moduleId);
  const details = (structure.details as any) || {};
  const production = applyModuleBonusesToProduction(
    computeMegastructureProduction(structure, readSubsystemLevels(structure)),
    structure,
    nextModules,
  );

  const updated = await storage.updateMegaStructure(structureId, {
    details: {
      ...details,
      modules: nextModules,
      lastModuleChangeAt: new Date().toISOString(),
    },
    resourceProduction: production.resourceProduction,
    resourceStorage: production.resourceStorage,
    substats: production.substats,
    efficiency: production.efficiency,
    defense: production.defense,
    damageOutput: production.damageOutput,
  });

  return {
    success: true,
    moduleId,
    moduleBonuses: production.moduleBonuses,
    production: production.resourceProduction,
    structure: updated,
  };
}
