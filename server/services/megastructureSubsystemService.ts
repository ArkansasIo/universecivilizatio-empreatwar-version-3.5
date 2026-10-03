import { MEGASTRUCTURES } from "@shared/config/megastructuresConfig";
import {
  getSubsystemCatalogForStructure,
  getSubsystemDefinition,
  calculateSubsystemUpgradeCost,
  calculateSubsystemBonus,
  computeSubsystemContribution,
  sumSubsystemContributions,
  formatSubsystemContribution,
  type MegastructureSubsystemDefinition,
  type MegastructureSubsystemContribution,
} from "@shared/config/megastructureSubsystemsConfig";
import type { MegaStructure } from "@shared/schema";
import { storage } from "../storage";

// ============================================================================
// HELPERS
// ============================================================================

function toNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveTemplate(structure: MegaStructure) {
  const details = (structure.details as any) || {};
  const templateId = typeof details.templateId === "string" ? details.templateId : undefined;

  if (templateId) {
    const byTemplate = MEGASTRUCTURES.find((template) => template.id === templateId);
    if (byTemplate) return byTemplate;
  }

  return MEGASTRUCTURES.find((template) => template.type === structure.structureType);
}

export function readSubsystemLevels(structure: MegaStructure): Record<string, number> {
  const details = (structure.details as any) || {};
  const raw = details.subsystems;

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const levels: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    const parsed = toNumber(value, 0);
    if (parsed > 0 && Number.isFinite(parsed)) levels[key] = Math.floor(parsed);
  }
  return levels;
}

export function getStructureTemplateId(structure: MegaStructure): string | null {
  const template = resolveTemplate(structure);
  return template ? template.id : null;
}

export function getStructureTypeLabel(structure: MegaStructure): string {
  return (structure.structureType || "megastructure").replace(/_/g, " ").replace(/-/g, " ");
}

function getStructureTier(structure: MegaStructure): number {
  const details = (structure.details as any) || {};
  const explicitTier = toNumber(details.tier, 0);
  if (explicitTier >= 1) return explicitTier;
  return toNumber(structure.level, 1) >= 1 ? 1 : 1;
}

function structureContextFor(structure: MegaStructure) {
  return {
    level: Math.max(1, toNumber(structure.level, 1)),
    tier: Math.max(1, getStructureTier(structure)),
    efficiency: toNumber(structure.efficiency, 100),
    power: toNumber(structure.power, 100000),
  };
}

// ============================================================================
// PRODUCTION GAME LOGIC
// ============================================================================

export function computeMegastructureProduction(
  structure: MegaStructure,
  levels?: Record<string, number>,
) {
  const subsystemLevels = levels || readSubsystemLevels(structure);
  const catalog = getSubsystemCatalogForStructure(structure.structureType, structure.structureClass);
  const context = structureContextFor(structure);

  const contributions = catalog.map((definition) => {
    const level = subsystemLevels[definition.id] || 0;
    return computeSubsystemContribution(definition, level, context);
  });
  const totals = sumSubsystemContributions(contributions);

  const baseProduction = ((structure.resourceProduction as any) || {}) as Record<string, number>;
  const metal = Math.max(0, Math.floor(toNumber(baseProduction.metal) + totals.metal));
  const crystal = Math.max(0, Math.floor(toNumber(baseProduction.crystal) + totals.crystal));
  const deuterium = Math.max(0, Math.floor(toNumber(baseProduction.deuterium) + totals.deuterium));
  const energy = Math.max(0, Math.floor(toNumber(baseProduction.energy) + totals.energy));

  const baseSubstats = ((structure.substats as any) || {}) as Record<string, number>;
  const researchMultiplier = Math.max(1, toNumber(baseSubstats.researchMultiplier, 1) + totals.research / 100);
  const baseDefense = Math.max(0, toNumber(structure.defense, 0) + totals.defense);
  const baseAttack = Math.max(0, toNumber(structure.attack, 0));
  const efficiency = Math.min(100, Math.max(0, toNumber(structure.efficiency, 100) + totals.efficiency));

  const baseStorage = ((structure.resourceStorage as any) || {}) as Record<string, number>;
  const storageBonus = Math.floor(totals.storage / Math.max(1, Object.keys(baseStorage).length || 1));

  return {
    resourceProduction: { metal, crystal, deuterium, energy },
    resourceStorage: {
      metal: Math.floor(toNumber(baseStorage.metal) + storageBonus),
      crystal: Math.floor(toNumber(baseStorage.crystal) + storageBonus),
      deuterium: Math.floor(toNumber(baseStorage.deuterium) + storageBonus),
      energy: Math.floor(toNumber(baseStorage.energy) + storageBonus),
    },
    substats: {
      ...baseSubstats,
      researchMultiplier,
      productionRate: Math.floor(toNumber(baseSubstats.productionRate, 1000) + totals.metal),
      efficiencyRating: Math.round(efficiency),
    },
    efficiency,
    attack: baseAttack,
    defense: baseDefense,
    damageOutput: Math.max(0, toNumber(structure.damageOutput, 0) + totals.defense),
    contributions: totals,
  };
}

// ============================================================================
// DETAIL
// ============================================================================

export async function getMegastructureDetailForPlayer(userId: string, structureId: string) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    return { success: false, reason: "NOT_FOUND", structure: null, subsystems: [] as unknown[] };
  }

  const template = resolveTemplate(structure);
  const catalog = getSubsystemCatalogForStructure(structure.structureType, structure.structureClass);
  const levels = readSubsystemLevels(structure);
  const context = structureContextFor(structure);
  const production = computeMegastructureProduction(structure, levels);

  const subsystems = catalog.map((definition) => {
    const level = levels[definition.id] || 0;
    const cost = calculateSubsystemUpgradeCost(definition, level);
    const contribution = computeSubsystemContribution(definition, level, context);
    return {
      id: definition.id,
      name: definition.name,
      description: definition.description,
      function: definition.function,
      subFunctions: definition.subFunctions,
      effect: definition.effect,
      effectLabel: definition.effect,
      category: definition.category,
      icon: definition.icon,
      lore: definition.lore,
      maxLevel: definition.maxLevel,
      level,
      maxed: level >= definition.maxLevel,
      bonus: calculateSubsystemBonus(definition, level),
      nextBonus: calculateSubsystemBonus(definition, level + 1),
      bonusUnit: definition.bonusUnit,
      contributionLabel: formatSubsystemContribution(definition, contribution[definition.effect]),
      contribution,
      cost,
      unlocked: true,
    };
  });

  return {
    success: true,
    structure,
    template: template
      ? {
          id: template.id,
          name: template.name,
          type: template.type,
          class: template.class,
          subClass: template.subClass,
          description: template.description,
          lore: template.lore,
          primaryFunction: template.primaryFunction,
          secondaryFunctions: template.secondaryFunctions,
          size: template.size,
          maxLevel: template.progressionConfig.levels.max,
          maxTier: template.progressionConfig.tiers.max,
          resourcesCost: template.resourcesCost,
          maintenanceCost: template.maintenanceCost,
        }
      : null,
    subsystems,
    production,
  };
}

// ============================================================================
// SUB-SYSTEM UPGRADE
// ============================================================================

export async function upgradeMegastructureSubsystemForPlayer(
  userId: string,
  structureId: string,
  subsystemId: string,
) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    return { success: false, reason: "STRUCTURE_NOT_FOUND" };
  }

  const definition = getSubsystemDefinition(subsystemId);
  if (!definition) {
    return { success: false, reason: "SUBSYSTEM_NOT_FOUND" };
  }

  const catalog = getSubsystemCatalogForStructure(structure.structureType, structure.structureClass);
  if (!catalog.some((item) => item.id === subsystemId)) {
    return { success: false, reason: "SUBSYSTEM_NOT_COMPATIBLE" };
  }

  const levels = readSubsystemLevels(structure);
  const currentLevel = levels[subsystemId] || 0;

  if (currentLevel >= definition.maxLevel) {
    return { success: false, reason: "MAX_LEVEL_REACHED" };
  }

  const cost = calculateSubsystemUpgradeCost(definition, currentLevel);
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
    metal < cost.metal ||
    crystal < cost.crystal ||
    deuterium < cost.deuterium ||
    energy < cost.energy
  ) {
    return {
      success: false,
      reason: "INSUFFICIENT_RESOURCES",
      required: cost,
      available: { metal, crystal, deuterium, energy },
    };
  }

  const nextLevel = currentLevel + 1;
  const nextLevels = { ...levels, [subsystemId]: nextLevel };

  await storage.updatePlayerState(userId, {
    resources: {
      ...resources,
      metal: Math.max(0, metal - cost.metal),
      crystal: Math.max(0, crystal - cost.crystal),
      deuterium: Math.max(0, deuterium - cost.deuterium),
      energy: Math.max(0, energy - cost.energy),
    },
  });

  const production = computeMegastructureProduction(structure, nextLevels);
  const details = (structure.details as any) || {};
  const updated = await storage.updateMegaStructure(structureId, {
    details: {
      ...details,
      subsystems: nextLevels,
      lastSubsystemUpgradeAt: new Date().toISOString(),
    },
    resourceProduction: production.resourceProduction,
    resourceStorage: production.resourceStorage,
    substats: production.substats,
    efficiency: production.efficiency,
    attack: production.attack,
    defense: production.defense,
    damageOutput: production.damageOutput,
  });

  return {
    success: true,
    subsystemId,
    definition: {
      id: definition.id,
      name: definition.name,
      effect: definition.effect,
      maxLevel: definition.maxLevel,
    },
    level: nextLevel,
    bonus: calculateSubsystemBonus(definition, nextLevel),
    cost,
    production: production.resourceProduction,
    structure: updated,
  };
}

export async function recomputeMegastructureProductionForPlayer(userId: string, structureId: string) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    return { success: false, reason: "STRUCTURE_NOT_FOUND" };
  }

  const production = computeMegastructureProduction(structure);
  const updated = await storage.updateMegaStructure(structureId, {
    resourceProduction: production.resourceProduction,
    resourceStorage: production.resourceStorage,
    substats: production.substats,
    efficiency: production.efficiency,
    attack: production.attack,
    defense: production.defense,
    damageOutput: production.damageOutput,
  });

  return { success: true, production: production.resourceProduction, structure: updated };
}

// ============================================================================
// DYSOn HUB AGGREGATE
// ============================================================================

// ============================================================================
// PRODUCTION ACCRUAL TICK
// ============================================================================

const RESOURCE_KEYS = ["metal", "crystal", "deuterium", "energy"] as const;

function resolveLastTickTime(structure: MegaStructure): number {
  const details = (structure.details as any) || {};
  const candidates = [
    typeof details.lastOperationalAt === "string" ? details.lastOperationalAt : undefined,
    structure.lastOperationalAt instanceof Date ? structure.lastOperationalAt.toISOString() : undefined,
    structure.constructedAt instanceof Date ? structure.constructedAt.toISOString() : undefined,
    structure.createdAt instanceof Date ? structure.createdAt.toISOString() : undefined,
  ].filter(Boolean);

  const last = candidates
    .map((value) => new Date(value as string).getTime())
    .filter((value) => Number.isFinite(value) && value > 0);

  return last.length ? Math.max(...last) : Date.now();
}

function resolveMaintenance(structure: MegaStructure) {
  const template = resolveTemplate(structure);
  if (template && template.maintenanceCost) return template.maintenanceCost;
  const subAttributes = ((structure.subAttributes as any) || {}) as Record<string, number>;
  const base = toNumber(subAttributes.maintenanceCost, 10000);
  return { metal: base, crystal: Math.floor(base / 2), deuterium: Math.floor(base / 5), energy: Math.floor(base * 2) };
}

/**
 * Compute how much production a structure has accrued since its last tick,
 * WITHOUT mutating the structure. Capped at a 14-day lookback window.
 */
export function getMegastructurePendingAccrual(structure: MegaStructure) {
  const now = Date.now();
  const lastTick = resolveLastTickTime(structure);
  const elapsedHours = Math.max(0, (now - lastTick) / 3_600_000);
  const windowedHours = Math.min(elapsedHours, 336);

  const production = computeMegastructureProduction(structure);
  const maintenance = resolveMaintenance(structure);
  const current = ((structure.currentResources as any) || {}) as Record<string, number>;
  const storageCaps = ((structure.resourceStorage as any) || {}) as Record<string, number>;

  const accrued: Record<string, number> = {};
  const capped: Record<string, boolean> = {};
  let pendingTotal = 0;

  for (const key of RESOURCE_KEYS) {
    const netPerHour = Math.max(0, toNumber(production.resourceProduction[key]) - toNumber(maintenance[key]));
    const gained = Math.floor(netPerHour * windowedHours);
    const cap = Math.max(0, toNumber(storageCaps[key]));
    const projected = toNumber(current[key]) + gained;
    const total = Math.min(projected, cap || projected);
    accrued[key] = Math.max(0, total - toNumber(current[key]));
    capped[key] = projected > cap && cap > 0;
    pendingTotal += accrued[key];
  }

  return {
    elapsedHours: Math.round(elapsedHours * 100) / 100,
    windowedHours,
    accrued,
    capped,
    pendingTotal,
    maintenance,
  };
}

/**
 * Run a single accrual tick for a player's megastructure: fold pending
 * production (minus maintenance) into currentResources, capped at storage.
 */
export async function tickMegastructureResourcesForPlayer(userId: string, structureId: string) {
  const structure = await storage.getMegaStructureById(structureId);
  if (!structure || structure.playerId !== userId) {
    return { success: false, reason: "STRUCTURE_NOT_FOUND" };
  }

  if (!structure.isOperational) {
    return { success: false, reason: "NOT_OPERATIONAL", message: "Structure must be operational to accrue production." };
  }

  const accrual = getMegastructurePendingAccrual(structure);
  const now = new Date();
  const current = ((structure.currentResources as any) || {}) as Record<string, number>;
  const storageCaps = ((structure.resourceStorage as any) || {}) as Record<string, number>;

  const nextResources: Record<string, number> = {};
  for (const key of RESOURCE_KEYS) {
    const cap = Math.max(0, toNumber(storageCaps[key]));
    const base = toNumber(current[key]);
    const value = base + toNumber(accrual.accrued[key]);
    nextResources[key] = cap > 0 ? Math.min(value, cap) : Math.max(0, value);
  }

  const details = (structure.details as any) || {};
  const updated = await storage.updateMegaStructure(structureId, {
    currentResources: nextResources,
    lastOperationalAt: now,
    details: {
      ...details,
      lastAccrualAt: now.toISOString(),
    },
  });

  return {
    success: true,
    elapsedHours: accrual.elapsedHours,
    accrued: accrual.accrued,
    maintenancePaid: accrual.maintenance,
    currentResources: nextResources,
    capped: accrual.capped,
    structure: updated,
  };
}

export async function getDysonProgramSummary(userId: string) {
  const structures = await storage.getPlayerMegaStructures(userId);
  const dyson = structures.filter((structure) => structure.structureType === "dyson-sphere");

  return {
    ownedCount: dyson.length,
    owned: dyson.map((structure) => ({
      id: structure.id,
      name: structure.name,
      level: structure.level,
      completionPercent: structure.completionPercent,
      isOperational: structure.isOperational,
      coordinates: structure.coordinates,
    })),
  };
}
