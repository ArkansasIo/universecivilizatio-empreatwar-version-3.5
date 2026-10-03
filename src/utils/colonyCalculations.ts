import { PlanetColony } from '../types';

export interface ColonyMaintenanceBreakdown {
  baseCost: number;
  levelMultiplier: number;
  homeworldDiscount: number;
  logisticalStrain: number;
  specializationModifier: number;
  taxPolicyModifier: number;
  totalMaintenanceCost: number;
  grossIncome: number;
  netIncome: number;
  profitMarginPercent: number;
  isDeficit: boolean;
  breakdownCategories: {
    administration: number;
    logistics: number;
    lifeSupport: number;
    security: number;
  };
}

export interface EmpireColonialSummary {
  totalColonies: number;
  totalColonyLevels: number;
  totalGrossIncome: number;
  totalMaintenanceCost: number;
  netColonialIncome: number;
  averageMaintenancePerLevel: number;
  expansionEfficiencyRating: 'Optimal' | 'Sustainable' | 'Strained' | 'Over-Extended';
  expansionEfficiencyPercent: number;
  expansionRecommendation: string;
}

/**
 * Calculates the exact maintenance cost for a single planetary colony
 * based on its tier level, homeworld status, tax policy, specialization,
 * and overall empire scale.
 */
export function calculateColonyMaintenance(colony: PlanetColony, totalColonies: number = 3): number {
  const level = Math.max(1, colony.level || 1);
  
  // Base cost per level with scalable overhead for higher tiers
  const baseCost = level * 1800 + Math.round(Math.pow(level, 1.25) * 450);
  
  // Homeworld central command discount (-25%)
  const homeworldMult = colony.isHomeworld ? 0.75 : 1.0;
  
  // Logistical strain from multi-world expanse (8% per extra colony beyond 2)
  const logisticalStrain = 1.0 + Math.max(0, (totalColonies - 2) * 0.08);
  
  // Specialization modifier
  let specMult = 1.0;
  if (colony.specialization === 'mining') specMult = 0.90; // Local raw materials offset logistics
  else if (colony.specialization === 'industrial') specMult = 1.10; // Heavy machinery upkeep
  else if (colony.specialization === 'research') specMult = 1.15; // High-energy containment
  else if (colony.specialization === 'fortress') specMult = 1.20; // Garrison & shield load
  else if (colony.specialization === 'trade') specMult = 0.85; // Free trade commercial offsets
  
  // Tax policy modifier
  let taxMult = 1.0;
  if (colony.taxPolicy === 'subsidized') taxMult = 1.25; // Welfare subsidies increase state upkeep
  else if (colony.taxPolicy === 'extractive') taxMult = 0.85; // Austerity reduces public expenditure
  
  const finalCost = Math.round(baseCost * homeworldMult * logisticalStrain * specMult * taxMult);
  return Math.max(1200, finalCost);
}

/**
 * Generates an in-depth maintenance breakdown and economic projection for a colony.
 */
export function getColonyMaintenanceDetails(colony: PlanetColony, totalColonies: number = 3): ColonyMaintenanceBreakdown {
  const totalCost = calculateColonyMaintenance(colony, totalColonies);
  const gross = colony.incomeBonus || (colony.level * 10000 + 5000);
  const net = gross - totalCost;
  const margin = gross > 0 ? Math.round((net / gross) * 100) : 0;
  
  return {
    baseCost: (colony.level || 1) * 2500,
    levelMultiplier: colony.level || 1,
    homeworldDiscount: colony.isHomeworld ? 0.25 : 0,
    logisticalStrain: Math.max(0, (totalColonies - 2) * 0.08),
    specializationModifier: colony.specialization === 'mining' ? -0.10 : colony.specialization === 'trade' ? -0.15 : colony.specialization === 'fortress' ? 0.20 : colony.specialization === 'research' ? 0.15 : 0,
    taxPolicyModifier: colony.taxPolicy === 'subsidized' ? 0.25 : colony.taxPolicy === 'extractive' ? -0.15 : 0,
    totalMaintenanceCost: totalCost,
    grossIncome: gross,
    netIncome: net,
    profitMarginPercent: margin,
    isDeficit: net < 0,
    breakdownCategories: {
      administration: Math.round(totalCost * 0.35),
      logistics: Math.round(totalCost * 0.25),
      lifeSupport: Math.round(totalCost * 0.20),
      security: Math.round(totalCost * 0.20),
    },
  };
}

/**
 * Calculates empire-wide colonial maintenance, aggregate revenue, and expansion efficiency.
 */
export function getEmpireColonialSummary(planets: PlanetColony[]): EmpireColonialSummary {
  const totalColonies = planets.length;
  let totalGross = 0;
  let totalMaintenance = 0;
  let totalLevels = 0;

  planets.forEach((p) => {
    totalGross += p.incomeBonus || (p.level * 10000 + 5000);
    totalMaintenance += calculateColonyMaintenance(p, totalColonies);
    totalLevels += p.level || 1;
  });

  const netColonial = totalGross - totalMaintenance;
  const avgMaint = totalLevels > 0 ? Math.round(totalMaintenance / totalLevels) : 0;
  
  // Efficiency ratio: higher net income relative to gross income means higher efficiency
  const ratio = totalGross > 0 ? (netColonial / totalGross) : 0;
  const efficiencyPercent = Math.max(0, Math.min(100, Math.round(ratio * 100)));

  let rating: EmpireColonialSummary['expansionEfficiencyRating'] = 'Optimal';
  let recommendation = 'Your colonial holdings yield substantial net surpluses. Expansion capacity is healthy.';

  if (ratio < 0.25) {
    rating = 'Over-Extended';
    recommendation = 'CRITICAL OVER-EXPANSION: High colony levels are exhausting your treasury in logistical maintenance. Promote miners or adopt Extractive Tax Directives to prevent economic collapse.';
  } else if (ratio < 0.45) {
    rating = 'Strained';
    recommendation = 'Rapid expansion is generating substantial maintenance overhead. Focus on industrial workforce and mining infrastructure before upgrading further colony tiers.';
  } else if (ratio < 0.65) {
    rating = 'Sustainable';
    recommendation = 'Colonial maintenance is well-balanced against gross tribute. Maintain steady workforce growth to support additional world colonization.';
  }

  return {
    totalColonies,
    totalColonyLevels: totalLevels,
    totalGrossIncome: totalGross,
    totalMaintenanceCost: totalMaintenance,
    netColonialIncome: netColonial,
    averageMaintenancePerLevel: avgMaint,
    expansionEfficiencyRating: rating,
    expansionEfficiencyPercent: efficiencyPercent,
    expansionRecommendation: recommendation,
  };
}
