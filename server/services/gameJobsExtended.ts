import { pool } from "../db";
import { registerCronJob, recordGameTick, cronLog, type CronJobResult } from "./cronService";
import { LIFE_SUPPORT_CONFIG } from "./lifeSupportService";

/**
 * gameJobsExtended
 * ---------------
 * Detailed cron coverage for every game system.
 *
 * Two kinds of jobs are registered here:
 *   1. RE-REGISTERED jobs — existing ids from gameJobs.ts whose handlers were
 *      no-op/stub counters. Re-registering overwrites the stored handler so the
 *      real logic below runs instead (interval/timing is kept identical).
 *   2. NEW jobs — systems that had no scheduler at all (bank, auction house,
 *      market matching, durability, life support, occupations, trials, raids,
 *      universe events, NPC factions, etc).
 */

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normCoords(coords: string): string {
  return (coords || "").replace(/[^\d:]/g, "");
}

async function creditResources(userId: string, metal: number, crystal: number, deuterium: number): Promise<boolean> {
  if (!userId) return false;
  const r = await pool.query("SELECT resources FROM player_states WHERE user_id = $1", [userId]);
  if (r.rows.length === 0) return false;
  const res = r.rows[0].resources || {};
  const next = {
    ...res,
    metal: Math.max(0, Math.floor((res.metal || 0) + metal)),
    crystal: Math.max(0, Math.floor((res.crystal || 0) + crystal)),
    deuterium: Math.max(0, Math.floor((res.deuterium || 0) + deuterium)),
  };
  await pool.query("UPDATE player_states SET resources = $2, last_resource_update = now() WHERE user_id = $1", [userId, JSON.stringify(next)]);
  return true;
}

function standingFromReputation(reputation: number): string {
  if (reputation >= 900) return "exalted";
  if (reputation >= 500) return "honored";
  if (reputation >= 100) return "friendly";
  if (reputation > -100) return "neutral";
  if (reputation > -500) return "unfriendly";
  return "hostile";
}

// ============================================================================
// REGISTRATION
// ============================================================================

export async function registerExtendedGameJobs(): Promise<void> {
  // ---------- Re-registered stub handlers (real logic) ----------
  await registerCronJob({
    id: "mission_processing",
    name: "Mission Processing Tick",
    description: "Processes outbound/returning fleet missions, credits transport cargo and returns fleets.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 8000,
    enabled: true,
    params: { maxMissionsPerBatch: 50 },
    handler: missionProcessingHandler,
  });

  await registerCronJob({
    id: "expedition_tick",
    name: "Expedition Processing",
    description: "Completes stale expeditions and credits encounter rewards.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 15000,
    enabled: true,
    params: { maxExpeditionsPerTick: 30, expeditionMaxAgeHours: 24 },
    handler: expeditionProcessingHandler,
  });

  await registerCronJob({
    id: "resource_trading_settlement",
    name: "Resource Trading Settlement",
    description: "Finalizes accepted trade offers and writes trade history records.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 20000,
    enabled: true,
    params: { maxTradesPerBatch: 100 },
    handler: resourceTradingSettlementHandler,
  });

  await registerCronJob({
    id: "merchant_stock_refresh",
    name: "Merchant Stock Refresh",
    description: "Restocks NPC vendors and applies market fluctuation to their inventory.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { itemsPerVendor: 10 },
    handler: merchantStockRefreshHandler,
  });

  await registerCronJob({
    id: "smithy_production",
    name: "Smithy Production Tick",
    description: "Completes crafting jobs in player smithies.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 6000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: smithyProductionHandler,
  });

  await registerCronJob({
    id: "blueprint_assembly",
    name: "Blueprint Assembly Tick",
    description: "Completes queued building/research/unit productions and applies them to the empire.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 7000,
    enabled: true,
    params: { maxPlayersPerTick: 75 },
    handler: blueprintAssemblyHandler,
  });

  await registerCronJob({
    id: "orbital_station_maintenance",
    name: "Orbital Station Maintenance",
    description: "Completes orbital station upgrades and maintains orbital defenses.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 12000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: orbitalStationMaintenanceHandler,
  });

  await registerCronJob({
    id: "moon_operations",
    name: "Moon Operations Tick",
    description: "Produces passive resources from owned moons and completes moon construction.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 25000,
    enabled: true,
    params: { maxPlayersPerTick: 40 },
    handler: moonOperationsHandler,
  });

  await registerCronJob({
    id: "spore_drive_cooldown",
    name: "Spore Drive Cooldown Management",
    description: "Ticks spore drive jump cooldowns and completes drive upgrades.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 30000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: sporeDriveCooldownHandler,
  });

  await registerCronJob({
    id: "raid_operations",
    name: "Raid Operations Processing",
    description: "Advances active player raids and credits completed raid rewards.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 20000,
    enabled: true,
    params: { maxRaidsPerTick: 25 },
    handler: raidOperationsHandler,
  });

  await registerCronJob({
    id: "raid_rewards_distribution",
    name: "Raid Rewards Distribution",
    description: "Distributes rewards from completed raids to participating team members.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxBatchSize: 50 },
    handler: raidRewardsDistributionHandler,
  });

  await registerCronJob({
    id: "mega_structure_operations",
    name: "Megastructure Operations",
    description: "Builds megastructures toward completion and produces resources from operational ones.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxStructuresPerTick: 20 },
    handler: megastructureOperationsHandler,
  });

  await registerCronJob({
    id: "government_progression",
    name: "Government Progression Tick",
    description: "Advances government research progress and awards empire experience.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 45000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: governmentProgressionHandler,
  });

  await registerCronJob({
    id: "civilization_effects",
    name: "Civilization Effects Update",
    description: "Produces resources from player colonies based on population and level.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 90000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: civilizationEffectsHandler,
  });

  await registerCronJob({
    id: "commander_experience",
    name: "Commander Experience & Leveling",
    description: "Awards passive commander XP and processes level-ups.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 30000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: commanderExperienceHandler,
  });

  await registerCronJob({
    id: "alliance_treasury",
    name: "Alliance Treasury Management",
    description: "Applies alliance treasury interest and resource growth.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { treasuryInterestRate: 0.001 },
    handler: allianceTreasuryHandler,
  });

  await registerCronJob({
    id: "alliance_tech_sharing",
    name: "Alliance Technology Sharing",
    description: "Recomputes shared research bonuses across alliance members.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 600000,
    enabled: true,
    params: {},
    handler: allianceTechSharingHandler,
  });

  await registerCronJob({
    id: "daily_missions_reset",
    name: "Daily Missions Reset",
    description: "Re-enables daily-frequency objectives in weekly mission progress.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: 86400000,
    enabled: true,
    params: { resetHour: 0 },
    handler: dailyMissionsResetHandler,
  });

  await registerCronJob({
    id: "weekly_missions_reset",
    name: "Weekly Missions Reset",
    description: "Rolls weekly mission progress into a fresh mission week.",
    jobType: "weekly",
    scheduleType: "weekly",
    intervalMs: 604800000,
    enabled: true,
    params: { resetDay: 0, resetHour: 0 },
    handler: weeklyMissionsResetHandler,
  });

  await registerCronJob({
    id: "season_pass_progression",
    name: "Season Pass Progression",
    description: "Awards passive season-pass XP to active players.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 180000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: seasonPassProgressionHandler,
  });

  await registerCronJob({
    id: "achievement_checker",
    name: "Achievement Progress Checker",
    description: "Marks achievements complete when their targets are reached.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 120000,
    enabled: true,
    params: { maxPlayersPerTick: 50 },
    handler: achievementCheckerHandler,
  });

  await registerCronJob({
    id: "monthly_reset",
    name: "Monthly Reset",
    description: "Resets monthly rankings, trial leaderboards, and combat ratings.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: 86400000,
    enabled: true,
    params: { resetDayOfMonth: 1, resetHour: 0 },
    handler: monthlyResetHandler,
  });

  await registerCronJob({
    id: "limited_event_processor",
    name: "Limited Event Processor",
    description: "Completes universe events whose duration has elapsed.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { maxEventsPerTick: 50 },
    handler: limitedEventProcessorHandler,
  });

  await registerCronJob({
    id: "leaderboard_update",
    name: "Leaderboard Update",
    description: "Recalculates player empire/fleet power and galaxy rankings.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 600000,
    enabled: true,
    params: { topPlayersCount: 1000 },
    handler: leaderboardUpdateHandler,
  });

  await registerCronJob({
    id: "inactive_player_warning",
    name: "Inactive Player Warning",
    description: "Tracks online status and manages vacation mode for inactive players.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: { inactiveDays: 7, warningDays: 3, deletionDays: 30 },
    handler: inactivePlayerWarningHandler,
  });

  await registerCronJob({
    id: "backup_critical_data",
    name: "Backup Critical Game Data",
    description: "Stores daily snapshots of critical game table sizes in system settings.",
    jobType: "daily",
    scheduleType: "daily",
    intervalMs: 86400000,
    enabled: true,
    params: { retentionDays: 30, backupHour: 3 },
    handler: backupCriticalDataHandler,
  });

  // ---------- NEW jobs for every remaining system ----------

  await registerCronJob({
    id: "bank_interest_payment",
    name: "Bank Interest Payment",
    description: "Applies daily interest to active bank accounts and logs transactions.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: {},
    handler: bankInterestHandler,
  });

  await registerCronJob({
    id: "auction_settlement",
    name: "Auction Settlement",
    description: "Settles expired auctions, awarding the highest bidder or closing them.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxBatchSize: 100 },
    handler: auctionSettlementHandler,
  });

  await registerCronJob({
    id: "market_order_matching",
    name: "Market Order Matching",
    description: "Matches active buy/sell market orders and transfers resources and credits.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxOrdersPerBatch: 200 },
    handler: marketOrderMatchingHandler,
  });

  await registerCronJob({
    id: "trade_offer_expiry",
    name: "Trade Offer Expiry",
    description: "Expires pending trade offers past their deadline.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: {},
    handler: tradeOfferExpiryHandler,
  });

  await registerCronJob({
    id: "friend_request_expiry",
    name: "Friend Request Expiry",
    description: "Expires pending friend requests past their deadline.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 21600000,
    enabled: true,
    params: {},
    handler: friendRequestExpiryHandler,
  });

  await registerCronJob({
    id: "npc_faction_reputation",
    name: "NPC Faction Reputation",
    description: "Slowly decays faction reputation toward neutral and updates standing.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: { decayPerTick: 1 },
    handler: npcFactionReputationHandler,
  });

  await registerCronJob({
    id: "resource_field_production",
    name: "Resource Field Production",
    description: "Produces resources from mined fields and regenerates depleted fields.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { maxFieldsPerTick: 100, depletionPerTick: 0.2 },
    handler: resourceFieldProductionHandler,
  });

  await registerCronJob({
    id: "starbase_production",
    name: "Starbase Production",
    description: "Produces resources from active starbases into owner storage.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxStarbasesPerTick: 100 },
    handler: starbaseProductionHandler,
  });

  await registerCronJob({
    id: "moon_base_mining",
    name: "Moon Base Mining",
    description: "Mines resources from active moon bases into owner reserves.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { maxBasesPerTick: 100 },
    handler: moonBaseMiningHandler,
  });

  await registerCronJob({
    id: "durability_decay",
    name: "Durability Decay",
    description: "Decays equipment, fleet, and building durability over time.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 1800000,
    enabled: true,
    params: {},
    handler: durabilityDecayHandler,
  });

  await registerCronJob({
    id: "element_buff_expiry",
    name: "Element Buff Expiry",
    description: "Deactivates element buffs past their expiration time.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: {},
    handler: elementBuffExpiryHandler,
  });

  await registerCronJob({
    id: "espionage_scan_cleanup",
    name: "Espionage Scan Cleanup",
    description: "Removes espionage scan records older than the retention window.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 86400000,
    enabled: true,
    params: { retentionDays: 7 },
    handler: espionageScanCleanupHandler,
  });

  await registerCronJob({
    id: "scan_cooldown_cleanup",
    name: "Scan Cooldown Cleanup",
    description: "Removes expired scan cooldown entries.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: {},
    handler: scanCooldownCleanupHandler,
  });

  await registerCronJob({
    id: "trial_leaderboard_sync",
    name: "Trial Leaderboard Sync",
    description: "Synchronizes trial best times and scores into the leaderboard.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 1800000,
    enabled: true,
    params: {},
    handler: trialLeaderboardSyncHandler,
  });

  await registerCronJob({
    id: "raid_finder_matchmaking",
    name: "Raid Finder Matchmaking",
    description: "Matches queued raid-finder players into raid groups.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: { minGroupSize: 6 },
    handler: raidFinderMatchmakingHandler,
  });

  await registerCronJob({
    id: "boss_encounter_resolution",
    name: "Boss Encounter Resolution",
    description: "Reconciles active boss encounters, resolving defeated or failed states.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: {},
    handler: bossEncounterResolutionHandler,
  });

  await registerCronJob({
    id: "universe_event_expiry",
    name: "Universe Event Expiry",
    description: "Completes universe events whose end time has passed.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 60000,
    enabled: true,
    params: {},
    handler: universeEventExpiryHandler,
  });

  await registerCronJob({
    id: "guild_upkeep",
    name: "Guild Upkeep",
    description: "Recounts guild members and grows guild influence.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: {},
    handler: guildUpkeepHandler,
  });

  await registerCronJob({
    id: "raid_expiry",
    name: "Raid Expiry",
    description: "Cancels raids that never completed within their time window.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 300000,
    enabled: true,
    params: { maxRaidHours: 24 },
    handler: raidExpiryHandler,
  });

  await registerCronJob({
    id: "empire_value_calc",
    name: "Empire Value Calculation",
    description: "Recalculates total empire values and ranks all players.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 1800000,
    enabled: true,
    params: { maxPlayersPerTick: 200 },
    handler: empireValueCalcHandler,
  });

  await registerCronJob({
    id: "combat_rating_decay",
    name: "Combat Rating Decay",
    description: "Decays combat ratings toward the neutral baseline of 1000.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 86400000,
    enabled: true,
    params: {},
    handler: combatRatingDecayHandler,
  });

  await registerCronJob({
    id: "weekly_mission_progress",
    name: "Weekly Mission Progress",
    description: "Recomputes weekly mission completion counts from mission state.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 86400000,
    enabled: true,
    params: {},
    handler: weeklyMissionProgressHandler,
  });

  await registerCronJob({
    id: "bounty_expiry",
    name: "Bounty Expiry",
    description: "Deactivates bounties older than the retention window.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 86400000,
    enabled: true,
    params: { maxBountyDays: 30 },
    handler: bountyExpiryHandler,
  });

  await registerCronJob({
    id: "celestial_marketplace_cleanup",
    name: "Celestial Marketplace Cleanup",
    description: "Cancels celestial listings that never sold.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 86400000,
    enabled: true,
    params: { maxListingDays: 30 },
    handler: celestialMarketplaceCleanupHandler,
  });

  await registerCronJob({
    id: "missile_silo_maintenance",
    name: "Missile Silo Maintenance",
    description: "Recalculates missile silo capacity and trims overflow ABM/IPM stock.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 600000,
    enabled: true,
    params: {},
    handler: missileSiloMaintenanceHandler,
  });

  await registerCronJob({
    id: "life_support_tick",
    name: "Life Support Tick",
    description: "Consumes food/water for population and recomputes oxygen/happiness.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 600000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: lifeSupportTickHandler,
  });

  await registerCronJob({
    id: "occupation_tribute",
    name: "Occupation Tribute",
    description: "Collects periodic tribute from occupied planets for the occupier.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: { maxPlayersPerTick: 100 },
    handler: occupationTributeHandler,
  });

  await registerCronJob({
    id: "relic_condition_decay",
    name: "Relic Condition Decay",
    description: "Slowly decays equipped relic condition over time.",
    jobType: "recurring",
    scheduleType: "interval",
    intervalMs: 3600000,
    enabled: true,
    params: { decayPerTick: 1 },
    handler: relicConditionDecayHandler,
  });

  cronLog(`Extended game jobs registered (${54} total additions/replacements)`, "cron", "success");
}

// ============================================================================
// RE-REGISTERED STUB HANDLERS (REAL LOGIC)
// ============================================================================

async function missionProcessingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let missionsProcessed = 0;
  let rewardsDistributed = 0;
  let errors = 0;

  try {
    const result = await pool.query(
      `SELECT id, user_id, type, status, target, origin, units, cargo, departure_time, arrival_time, return_time
       FROM missions
       WHERE processed = false AND status IN ('outbound', 'return')
       ORDER BY arrival_time ASC
       LIMIT $1`,
      [params.maxMissionsPerBatch || 50]
    );

    for (const mission of result.rows) {
      try {
        const now = Date.now();
        const arrival = mission.arrival_time ? new Date(mission.arrival_time).getTime() : Infinity;
        const returns = mission.return_time ? new Date(mission.return_time).getTime() : Infinity;

        if (mission.status === "outbound" && arrival <= now) {
          // Arrival: credit transport cargo to the destination empire.
          if (mission.type && mission.type.includes("transport") && mission.cargo) {
            const target = await pool.query(
              "SELECT user_id FROM player_states WHERE coordinates IN ($1, $2) LIMIT 1",
              [mission.target, "[" + (mission.target || "").replace(/[\[\]]/g, "") + "]"]
            );
            if (target.rows.length > 0) {
              const cargo = mission.cargo || {};
              const ok = await creditResources(target.rows[0].user_id, cargo.metal || 0, cargo.crystal || 0, cargo.deuterium || 0);
              if (ok) rewardsDistributed++;
            }
          }
          const travelMs = Math.max(0, arrival - (mission.departure_time ? new Date(mission.departure_time).getTime() : arrival));
          await pool.query(
            `UPDATE missions SET status = 'return', return_time = $2 WHERE id = $1`,
            [mission.id, new Date(now + travelMs)]
          );
          missionsProcessed++;
        } else if (mission.status === "return" && returns <= now) {
          // Return home: send fleet back and mark complete.
          const units = mission.units || {};
          if (Object.keys(units).length > 0) {
            const state = await pool.query("SELECT units FROM player_states WHERE user_id = $1", [mission.user_id]);
            if (state.rows.length > 0) {
              const playerUnits = state.rows[0].units || {};
              for (const [ship, count] of Object.entries(units)) {
                playerUnits[ship] = (playerUnits[ship] || 0) + toNumber(count);
              }
              await pool.query("UPDATE player_states SET units = $2, updated_at = now() WHERE user_id = $1", [mission.user_id, JSON.stringify(playerUnits)]);
            }
          }
          await pool.query(
            `UPDATE missions SET status = 'completed', processed = true WHERE id = $1`,
            [mission.id]
          );
          missionsProcessed++;
          rewardsDistributed++;
        }
      } catch (e) {
        errors++;
      }
    }

    await recordGameTick("mission_processing", { durationMs: Date.now() - startTime, playersProcessed: missionsProcessed, resourcesUpdated: rewardsDistributed, errors });
    return { success: true, recordsProcessed: missionsProcessed, recordsAffected: rewardsDistributed, metadata: { durationMs: Date.now() - startTime, errors } };
  } catch (error: any) {
    await recordGameTick("mission_processing", { durationMs: Date.now() - startTime, errors: 1 });
    return { success: false, message: error.message };
  }
}

async function expeditionProcessingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let expeditionsProcessed = 0;
  let rewardsDistributed = 0;

  try {
    const maxAgeMs = (params.expeditionMaxAgeHours || 24) * 3600000;
    const result = await pool.query(
      `SELECT id, user_id, status, created_at FROM expeditions WHERE status = 'active' LIMIT $1`,
      [params.maxExpeditionsPerTick || 30]
    );

    for (const exp of result.rows) {
      const age = Date.now() - new Date(exp.created_at).getTime();
      if (age < maxAgeMs) continue;

      const encounters = await pool.query(
        `SELECT rewards FROM expedition_encounters WHERE expedition_id = $1`,
        [exp.id]
      );
      for (const enc of encounters.rows) {
        const rewards = enc.rewards || {};
        const ok = await creditResources(exp.user_id, rewards.metal || 0, rewards.crystal || 0, rewards.deuterium || 0);
        if (ok) rewardsDistributed++;
      }
      await pool.query(`UPDATE expeditions SET status = 'completed' WHERE id = $1`, [exp.id]);
      expeditionsProcessed++;
    }

    await recordGameTick("expedition", { durationMs: Date.now() - startTime, playersProcessed: expeditionsProcessed, resourcesUpdated: rewardsDistributed });
    return { success: true, recordsProcessed: expeditionsProcessed, recordsAffected: rewardsDistributed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function resourceTradingSettlementHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let tradesSettled = 0;

  try {
    const result = await pool.query(
      `SELECT id, sender_id, sender_name, receiver_id, receiver_name, offer_metal, offer_crystal, offer_deuterium, offer_items,
              request_metal, request_crystal, request_deuterium, request_items
       FROM trade_offers
       WHERE status = 'accepted' AND completed_at IS NULL
       LIMIT $1`,
      [params.maxTradesPerBatch || 100]
    );

    for (const offer of result.rows) {
      await pool.query(
        `UPDATE trade_offers SET status = 'completed', completed_at = now(), updated_at = now() WHERE id = $1`,
        [offer.id]
      );
      await pool.query(
        `INSERT INTO trade_history (trade_offer_id, sender_id, sender_name, receiver_id, receiver_name, sender_gave, receiver_gave, result)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed')`,
        [
          offer.id,
          offer.sender_id,
          offer.sender_name,
          offer.receiver_id,
          offer.receiver_name,
          JSON.stringify({ metal: offer.offer_metal, crystal: offer.offer_crystal, deuterium: offer.offer_deuterium, items: offer.offer_items || [] }),
          JSON.stringify({ metal: offer.request_metal, crystal: offer.request_crystal, deuterium: offer.request_deuterium, items: offer.request_items || [] }),
        ]
      );
      tradesSettled++;
    }

    await recordGameTick("trading_settlement", { durationMs: Date.now() - startTime, playersProcessed: tradesSettled });
    return { success: true, recordsAffected: tradesSettled, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function merchantStockRefreshHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let merchantsRefreshed = 0;

  try {
    const result = await pool.query(
      `SELECT id, vendor_id, restock_time, last_restock, inventory, specialty FROM npc_vendors`
    );
    const now = Date.now();
    const itemsPerVendor = params.itemsPerVendor || 10;

    for (const vendor of result.rows) {
      const restockMs = (vendor.restock_time || 86400) * 1000;
      const lastRestock = vendor.last_restock ? new Date(vendor.last_restock).getTime() : 0;
      if (now - lastRestock < restockMs) continue;

      const catalog = await pool.query(
        `SELECT id, name, entry_type, base_cost, base_time_seconds FROM ogame_catalog_entries ORDER BY random() LIMIT $1`,
        [itemsPerVendor]
      );
      const inventory = catalog.rows.map((entry: any) => ({
        id: entry.id,
        name: entry.name,
        entryType: entry.entry_type,
        stock: Math.floor(Math.random() * 20) + 5,
        price: (entry.base_cost && typeof entry.base_cost === "object" ? (entry.base_cost.metal || 0) + (entry.base_cost.crystal || 0) * 2 : 100),
        restockedAt: new Date().toISOString(),
      }));

      await pool.query(
        `UPDATE npc_vendors SET inventory = $2, last_restock = now(), updated_at = now() WHERE id = $1`,
        [vendor.id, JSON.stringify(inventory)]
      );
      merchantsRefreshed++;
    }

    await recordGameTick("merchant_refresh", { durationMs: Date.now() - startTime, playersProcessed: merchantsRefreshed });
    return { success: true, recordsAffected: merchantsRefreshed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function smithyProductionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let itemsCrafted = 0;

  try {
    const result = await pool.query(
      `SELECT id, smithy_state FROM player_states WHERE smithy_state IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const row of result.rows) {
      const smithyState = row.smithy_state || {};
      const queue: any[] = Array.isArray(smithyState.craftingQueue) ? smithyState.craftingQueue : [];
      const now = Date.now();
      const completed: any[] = [];
      const remaining: any[] = [];

      for (const item of queue) {
        const completeAt = item.completeAt || item.endTime ? new Date(item.completeAt || item.endTime).getTime() : 0;
        if (completeAt > 0 && completeAt <= now) {
          completed.push({ ...item, completedAt: new Date().toISOString() });
        } else {
          remaining.push(item);
        }
      }

      if (completed.length > 0) {
        smithyState.completedItems = [...(smithyState.completedItems || []), ...completed];
        smithyState.craftingQueue = remaining;
        await pool.query(
          `UPDATE player_states SET smithy_state = $2, updated_at = now() WHERE id = $1`,
          [row.id, JSON.stringify(smithyState)]
        );
        itemsCrafted += completed.length;
      }
    }

    await recordGameTick("smithy_production", { durationMs: Date.now() - startTime, playersProcessed: itemsCrafted });
    return { success: true, recordsAffected: itemsCrafted, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function blueprintAssemblyHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let blueprintsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, user_id, type, item_id, item_name, amount, end_time FROM queue_items WHERE end_time <= now() LIMIT $1`,
      [params.maxPlayersPerTick || 75]
    );

    for (const item of result.rows) {
      const state = await pool.query("SELECT buildings, research, units FROM player_states WHERE user_id = $1", [item.user_id]);
      if (state.rows.length === 0) {
        await pool.query("DELETE FROM queue_items WHERE id = $1", [item.id]);
        continue;
      }
      const row = state.rows[0];

      if (item.type === "building") {
        const buildings = row.buildings || {};
        buildings[item.item_id] = (buildings[item.item_id] || 0) + 1;
        await pool.query("UPDATE player_states SET buildings = $2, updated_at = now() WHERE user_id = $1", [item.user_id, JSON.stringify(buildings)]);
      } else if (item.type === "research") {
        const research = row.research || {};
        research[item.item_id] = (research[item.item_id] || 0) + 1;
        await pool.query("UPDATE player_states SET research = $2, updated_at = now() WHERE user_id = $1", [item.user_id, JSON.stringify(research)]);
      } else if (item.type === "unit") {
        const units = row.units || {};
        units[item.item_id] = (units[item.item_id] || 0) + (item.amount || 1);
        await pool.query("UPDATE player_states SET units = $2, updated_at = now() WHERE user_id = $1", [item.user_id, JSON.stringify(units)]);
      }

      await pool.query("DELETE FROM queue_items WHERE id = $1", [item.id]);
      blueprintsProcessed++;
    }

    await recordGameTick("blueprint_assembly", { durationMs: Date.now() - startTime, playersProcessed: blueprintsProcessed });
    return { success: true, recordsAffected: blueprintsProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function orbitalStationMaintenanceHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let stationsUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, orbital_stations FROM player_states WHERE orbital_stations IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const row of result.rows) {
      const stations: any[] = Array.isArray(row.orbital_stations) ? row.orbital_stations : [];
      const now = Date.now();
      let changed = false;

      for (const station of stations) {
        if (station.upgradeCompleteAt) {
          const completeAt = new Date(station.upgradeCompleteAt).getTime();
          if (completeAt <= now) {
            station.level = (station.level || 1) + 1;
            station.defenseLevel = (station.defenseLevel || 1) + 1;
            delete station.upgradeCompleteAt;
            changed = true;
          }
        }
      }

      if (changed) {
        await pool.query(
          `UPDATE player_states SET orbital_stations = $2, updated_at = now() WHERE id = $1`,
          [row.id, JSON.stringify(stations)]
        );
        stationsUpdated += stations.length;
      }
    }

    await recordGameTick("orbital_maintenance", { durationMs: Date.now() - startTime, playersProcessed: stationsUpdated });
    return { success: true, recordsAffected: stationsUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function moonOperationsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let moonsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, user_id, moons_data FROM player_states WHERE moons_data IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 40]
    );
    const now = Date.now();
    const elapsedHours = 25000 / 3600000;

    for (const row of result.rows) {
      const raw = row.moons_data || {};
      const isArray = Array.isArray(raw);
      const moons: any[] = isArray ? raw : Object.values(raw);
      if (moons.length === 0) continue;

      let changed = false;
      let totalMetal = 0;
      let totalCrystal = 0;
      let totalDeuterium = 0;

      for (const moon of moons) {
        const lastProd = moon.lastProduction ? new Date(moon.lastProduction).getTime() : now;
        if (now - lastProd < 25000) continue;
        const size = toNumber(moon.size, 5000);
        const output = Math.floor((size / 1000) * elapsedHours);
        totalMetal += output;
        totalCrystal += Math.floor(output * 0.5);
        totalDeuterium += Math.floor(output * 0.2);
        moon.lastProduction = new Date(now).toISOString();
        changed = true;
      }

      if (changed) {
        if (isArray) {
          await pool.query(
            `UPDATE player_states SET moons_data = $2, updated_at = now() WHERE id = $1`,
            [row.id, JSON.stringify(moons)]
          );
        } else {
          await pool.query(
            `UPDATE player_states SET moons_data = $2, updated_at = now() WHERE id = $1`,
            [row.id, JSON.stringify(raw)]
          );
        }
        await creditResources(row.user_id, totalMetal, totalCrystal, totalDeuterium);
        moonsProcessed += moons.length;
      }
    }

    await recordGameTick("moon_operations", { durationMs: Date.now() - startTime, playersProcessed: moonsProcessed });
    return { success: true, recordsAffected: moonsProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function sporeDriveCooldownHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let drivesUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, spore_drive_state FROM player_states WHERE spore_drive_state IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );
    const now = Date.now();

    for (const row of result.rows) {
      const state = row.spore_drive_state || {};
      let changed = false;

      if (state.cooldownRemaining && state.cooldownRemaining > 0) {
        state.cooldownRemaining = Math.max(0, state.cooldownRemaining - 30);
        changed = true;
      }

      if (state.upgradeCompleteAt) {
        const completeAt = new Date(state.upgradeCompleteAt).getTime();
        if (completeAt <= now) {
          state.level = (state.level || 1) + 1;
          delete state.upgradeCompleteAt;
          changed = true;
        }
      }

      if (changed) {
        await pool.query(
          `UPDATE player_states SET spore_drive_state = $2, updated_at = now() WHERE id = $1`,
          [row.id, JSON.stringify(state)]
        );
        drivesUpdated++;
      }
    }

    await recordGameTick("spore_drive", { durationMs: Date.now() - startTime, playersProcessed: drivesUpdated });
    return { success: true, recordsAffected: drivesUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function raidOperationsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let raidsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, active_raids FROM player_states WHERE jsonb_array_length(COALESCE(active_raids, '[]'::jsonb)) > 0 LIMIT $1`,
      [params.maxRaidsPerTick || 25]
    );
    const now = Date.now();

    for (const row of result.rows) {
      const raids: any[] = row.active_raids || [];
      let changed = false;
      let metal = 0;
      let crystal = 0;
      let deuterium = 0;

      for (const raid of raids) {
        if (raid.status === "completed" || raid.rewardsClaimed) continue;
        const endTime = raid.endTime || raid.arrivalTime;
        if (endTime && new Date(endTime).getTime() <= now) {
          raid.status = "completed";
          raid.rewardsClaimed = true;
          metal += toNumber(raid.rewards?.metal, 0);
          crystal += toNumber(raid.rewards?.crystal, 0);
          deuterium += toNumber(raid.rewards?.deuterium, 0);
          changed = true;
        }
      }

      if (changed) {
        await pool.query(
          `UPDATE player_states SET active_raids = $2, updated_at = now() WHERE id = $1`,
          [row.id, JSON.stringify(raids)]
        );
        await creditResources(row.user_id, metal, crystal, deuterium);
        raidsProcessed++;
      }
    }

    await recordGameTick("raid_operations", { durationMs: Date.now() - startTime, playersProcessed: raidsProcessed });
    return { success: true, recordsAffected: raidsProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function raidRewardsDistributionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let rewardsDistributed = 0;

  try {
    const result = await pool.query(
      `SELECT id, attacking_team_id, defending_team_id, result, rewards
       FROM raids
       WHERE status = 'completed' AND rewards IS NOT NULL AND rewards::text <> '{}'::text
       LIMIT $1`,
      [params.maxBatchSize || 50]
    );

    for (const raid of result.rows) {
      const rewards = raid.rewards || {};
      const winningTeamId = raid.result && String(raid.result).startsWith("attacker") ? raid.attacking_team_id : raid.defending_team_id;
      const team = await pool.query(`SELECT members FROM teams WHERE id = $1`, [winningTeamId]);
      if (team.rows.length === 0) {
        await pool.query(`UPDATE raids SET rewards = '{}'::jsonb WHERE id = $1`, [raid.id]);
        continue;
      }
      const members: any[] = team.rows[0].members || [];
      const perMember = Math.max(1, members.length);
      const shareMetal = Math.floor(toNumber(rewards.metal, 0) / perMember);
      const shareCrystal = Math.floor(toNumber(rewards.crystal, 0) / perMember);
      const shareDeuterium = Math.floor(toNumber(rewards.deuterium, 0) / perMember);

      for (const member of members) {
        const memberId = typeof member === "string" ? member : member.playerId || member.userId;
        if (!memberId) continue;
        await creditResources(memberId, shareMetal, shareCrystal, shareDeuterium);
        rewardsDistributed++;
      }

      await pool.query(`UPDATE raids SET rewards = '{}'::jsonb, ended_at = COALESCE(ended_at, now()) WHERE id = $1`, [raid.id]);
    }

    await recordGameTick("raid_rewards", { durationMs: Date.now() - startTime, playersProcessed: rewardsDistributed });
    return { success: true, recordsAffected: rewardsDistributed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function megastructureOperationsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let megastructuresProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, player_id, structure_type, level, completion_percent, is_operational, efficiency, substats
       FROM mega_structures LIMIT $1`,
      [params.maxStructuresPerTick || 20]
    );

    for (const ms of result.rows) {
      let next = null;
      if (!ms.is_operational) {
        const buildRate = Math.max(1, Math.floor(toNumber(ms.substats?.productionRate, 1000) / 1000));
        const newPercent = Math.min(100, toNumber(ms.completion_percent, 0) + buildRate);
        const operational = newPercent >= 100;
        next = { completion_percent: newPercent, is_operational: operational };
        if (operational) {
          await creditResources(ms.player_id, 0, 0, 0);
        }
      } else {
        const efficiency = toNumber(ms.efficiency, 1);
        const output = Math.floor(toNumber(ms.substats?.productionRate, 1000) * efficiency);
        const metal = Math.floor(output * 0.7);
        const crystal = Math.floor(output * 0.2);
        const deuterium = Math.floor(output * 0.1);
        await creditResources(ms.player_id, metal, crystal, deuterium);
      }

      if (next) {
        await pool.query(
          `UPDATE mega_structures SET completion_percent = $2, is_operational = $3 WHERE id = $1`,
          [ms.id, next.completion_percent, next.is_operational]
        );
      }
      megastructuresProcessed++;
    }

    await recordGameTick("megastructure", { durationMs: Date.now() - startTime, playersProcessed: megastructuresProcessed });
    return { success: true, recordsAffected: megastructuresProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function governmentProgressionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;
  let progressUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, government, empire_experience FROM player_states WHERE government IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      const government = row.government || {};
      const now = Date.now();
      const lastTick = government.lastProgressionTick ? new Date(government.lastProgressionTick).getTime() : now;
      const elapsedMinutes = Math.max(0, (now - lastTick) / 60000);
      if (elapsedMinutes < 1) continue;

      government.lastProgressionTick = new Date(now).toISOString();
      government.progressionPoints = (government.progressionPoints || 0) + Math.floor(elapsedMinutes);
      if (typeof government.researchProgress === "number") {
        government.researchProgress += Math.floor(elapsedMinutes * 0.1);
      } else if (government.researchProgress === undefined) {
        government.researchProgress = Math.floor(elapsedMinutes * 0.1);
      }

      await pool.query(
        `UPDATE player_states SET government = $2, empire_experience = empire_experience + $3, updated_at = now() WHERE id = $1`,
        [row.id, JSON.stringify(government), Math.floor(elapsedMinutes * 2)]
      );
      playersProcessed++;
      progressUpdated++;
    }

    await recordGameTick("government_progression", { durationMs: Date.now() - startTime, playersProcessed, progressUpdated });
    return { success: true, recordsProcessed: playersProcessed, recordsAffected: progressUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function civilizationEffectsHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, player_id, colony_level, population FROM player_colonies LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );
    const elapsedHours = 90000 / 3600000;

    for (const colony of result.rows) {
      const level = toNumber(colony.colony_level, 1);
      const pop = toNumber(colony.population, 1000);
      const metal = Math.floor((level * 50 + pop * 0.01) * elapsedHours);
      const crystal = Math.floor((level * 25 + pop * 0.005) * elapsedHours);
      await creditResources(colony.player_id, metal, crystal, 0);
      playersProcessed++;
    }

    await recordGameTick("civilization_effects", { durationMs: Date.now() - startTime, playersProcessed });
    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function commanderExperienceHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let commandersLeveled = 0;

  try {
    const result = await pool.query(
      `SELECT id, commander FROM player_states WHERE commander IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );
    const now = Date.now();

    for (const row of result.rows) {
      const commander = row.commander || {};
      const lastTick = commander.lastXpTick ? new Date(commander.lastXpTick).getTime() : now;
      const elapsedMinutes = Math.max(0, (now - lastTick) / 60000);
      if (elapsedMinutes < 1) continue;

      const gained = Math.floor(elapsedMinutes * (commander.xpRate || 5));
      const experience = (commander.experience || 0) + gained;
      const level = Math.max(1, Math.floor(experience / 100) + 1);

      commander.experience = experience;
      commander.level = level;
      commander.lastXpTick = new Date(now).toISOString();

      await pool.query(
        `UPDATE player_states SET commander = $2, updated_at = now() WHERE id = $1`,
        [row.id, JSON.stringify(commander)]
      );
      commandersLeveled++;
    }

    await recordGameTick("commander_experience", { durationMs: Date.now() - startTime, playersProcessed: commandersLeveled });
    return { success: true, recordsAffected: commandersLeveled, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function allianceTreasuryHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let treasuriesUpdated = 0;

  try {
    const result = await pool.query(`SELECT id, resources FROM alliances`);
    const rate = params.treasuryInterestRate || 0.001;

    for (const alliance of result.rows) {
      const resources = alliance.resources || {};
      const interest = (res: number) => Math.floor(res * rate);
      const next = {
        metal: (resources.metal || 0) + interest(resources.metal || 0),
        crystal: (resources.crystal || 0) + interest(resources.crystal || 0),
        deuterium: (resources.deuterium || 0) + interest(resources.deuterium || 0),
      };
      await pool.query(`UPDATE alliances SET resources = $2 WHERE id = $1`, [alliance.id, JSON.stringify(next)]);
      treasuriesUpdated++;
    }

    await recordGameTick("alliance_treasury", { durationMs: Date.now() - startTime, playersProcessed: treasuriesUpdated });
    return { success: true, recordsAffected: treasuriesUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function allianceTechSharingHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let alliancesUpdated = 0;

  try {
    const alliances = await pool.query(`SELECT id FROM alliances`);
    const maxTechPerAlliance = new Map<string, Record<string, number>>();
    const memberTech = new Map<string, Record<string, number>>();

    for (const alliance of alliances.rows) {
      const members = await pool.query(
        `SELECT user_id FROM alliance_members WHERE alliance_id = $1`,
        [alliance.id]
      );
      if (members.rows.length === 0) continue;

      const techTotals: Record<string, number> = {};
      for (const member of members.rows) {
        const state = await pool.query(
          `SELECT research FROM player_states WHERE user_id = $1`,
          [member.user_id]
        );
        if (state.rows.length === 0) continue;
        const research = state.rows[0].research || {};
        for (const [tech, level] of Object.entries(research)) {
          techTotals[tech] = Math.max(techTotals[tech] || 0, toNumber(level));
        }
        memberTech.set(member.user_id, research);
      }
      maxTechPerAlliance.set(alliance.id, techTotals);

      for (const member of members.rows) {
        const own = memberTech.get(member.user_id) || {};
        const shared: Record<string, number> = {};
        for (const [tech, level] of Object.entries(techTotals)) {
          shared[tech] = Math.max(toNumber(own[tech], 0), level - 1);
        }
        await pool.query(
          `UPDATE player_states SET research_bonuses = $2, updated_at = now() WHERE user_id = $1`,
          [member.user_id, JSON.stringify(shared)]
        );
      }
      alliancesUpdated++;
    }

    await recordGameTick("alliance_tech", { durationMs: Date.now() - startTime, playersProcessed: alliancesUpdated });
    return { success: true, recordsAffected: alliancesUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function dailyMissionsResetHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersAffected = 0;

  try {
    const result = await pool.query(
      `SELECT id, missions FROM weekly_mission_progress`
    );

    for (const row of result.rows) {
      const missions: any[] = Array.isArray(row.missions) ? row.missions : [];
      let changed = false;
      for (const mission of missions) {
        if ((mission.frequency === "daily" || mission.resetType === "daily") && mission.completed) {
          mission.completed = false;
          mission.progress = 0;
          changed = true;
        }
      }
      if (changed) {
        await pool.query(
          `UPDATE weekly_mission_progress SET missions = $2, updated_at = now() WHERE id = $1`,
          [row.id, JSON.stringify(missions)]
        );
        playersAffected++;
      }
    }

    await recordGameTick("daily_missions_reset", { durationMs: Date.now() - startTime, playersProcessed: playersAffected });
    return { success: true, recordsAffected: playersAffected, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function weeklyMissionsResetHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersAffected = 0;

  try {
    const now = new Date();
    const isoWeek = `${now.getFullYear()}-W${String(Math.ceil((now.getDate() + 6 - now.getDay()) / 7)).padStart(2, "0")}`;

    const result = await pool.query(`SELECT id, week_id FROM weekly_mission_progress`);
    for (const row of result.rows) {
      if (row.week_id !== isoWeek) {
        await pool.query(`DELETE FROM weekly_mission_progress WHERE id = $1`, [row.id]);
        playersAffected++;
      }
    }

    await recordGameTick("weekly_missions_reset", { durationMs: Date.now() - startTime, playersProcessed: playersAffected });
    return { success: true, recordsAffected: playersAffected, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function seasonPassProgressionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT pp.id AS profile_id, pp.user_id FROM player_profiles pp WHERE last_activity_at > now() - interval '1 day' LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      const amount = 25;
      await pool.query(
        `INSERT INTO xp_history (user_id, amount, source, category, page, action)
         VALUES ($1, $2, 'season_pass', 'season', 'season_pass', 'passive_xp')`,
        [row.user_id, amount]
      );
      await pool.query(
        `UPDATE player_profiles SET total_experience = total_experience + $2, updated_at = now() WHERE user_id = $1`,
        [row.user_id, amount]
      );
      playersProcessed++;
    }

    await recordGameTick("season_pass", { durationMs: Date.now() - startTime, playersProcessed });
    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function achievementCheckerHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersChecked = 0;
  let achievementsUnlocked = 0;

  try {
    const result = await pool.query(
      `SELECT id, progress, target, reward_xp, player_id FROM achievements WHERE is_completed = false LIMIT $1`,
      [params.maxPlayersPerTick || 50]
    );

    for (const achievement of result.rows) {
      if (toNumber(achievement.progress, 0) >= toNumber(achievement.target, 1)) {
        await pool.query(
          `UPDATE achievements SET is_completed = true, unlocked_at = now() WHERE id = $1`,
          [achievement.id]
        );
        if (toNumber(achievement.reward_xp, 0) > 0) {
          await pool.query(
            `INSERT INTO xp_history (user_id, amount, source, category, action)
             VALUES ($1, $2, 'achievement', 'achievements', 'unlock')`,
            [achievement.player_id, achievement.reward_xp]
          );
        }
        achievementsUnlocked++;
      }
      playersChecked++;
    }

    await recordGameTick("achievement_check", { durationMs: Date.now() - startTime, playersProcessed: playersChecked, recordsAffected: achievementsUnlocked });
    return { success: true, recordsProcessed: playersChecked, recordsAffected: achievementsUnlocked, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function monthlyResetHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersAffected = 0;

  try {
    await pool.query(`TRUNCATE TABLE trial_leaderboard`);
    const seeded = await pool.query(
      `INSERT INTO trial_leaderboard (user_id, trial_tier, best_time, best_wave, points)
       SELECT user_id, trial_tier, best_time, best_wave, total_points_earned FROM trials
       RETURNING id`
    );
    playersAffected += seeded.rowCount || 0;

    const reset = await pool.query(
      `UPDATE combat_stats SET combat_rating = 1000, raid_rating = 1000, updated_at = now() RETURNING id`
    );
    playersAffected += reset.rowCount || 0;

    await recordGameTick("monthly_reset", { durationMs: Date.now() - startTime, playersProcessed: playersAffected });
    return { success: true, recordsAffected: playersAffected, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function limitedEventProcessorHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let eventsProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, status, start_time, end_time, duration FROM universe_events WHERE status = 'active' LIMIT $1`,
      [params.maxEventsPerTick || 50]
    );

    for (const event of result.rows) {
      let endTime = event.end_time ? new Date(event.end_time).getTime() : null;
      if (!endTime && event.duration) {
        endTime = new Date(event.start_time).getTime() + event.duration * 60000;
      }
      if (endTime && endTime <= Date.now()) {
        await pool.query(`UPDATE universe_events SET status = 'completed' WHERE id = $1`, [event.id]);
        eventsProcessed++;
      }
    }

    await recordGameTick("limited_event", { durationMs: Date.now() - startTime, playersProcessed: eventsProcessed });
    return { success: true, recordsAffected: eventsProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function leaderboardUpdateHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let categoriesUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT ps.user_id, ps.empire_level, ps.resources, ps.units
       FROM player_states ps LIMIT $1`,
      [params.topPlayersCount || 1000]
    );

    for (const row of result.rows) {
      const resources = row.resources || {};
      const units = row.units || {};
      const fleetPower = Object.values(units).reduce((s: number, v) => s + toNumber(v), 0) * 10;
      const empirePower =
        toNumber(row.empire_level, 1) * 1000 +
        toNumber(resources.metal, 0) +
        toNumber(resources.crystal, 0) +
        toNumber(resources.deuterium, 0) +
        fleetPower;

      await pool.query(
        `UPDATE player_profiles SET empire_power = $2, fleet_power = $3, updated_at = now() WHERE user_id = $1`,
        [row.user_id, empirePower, fleetPower]
      );
    }

    await pool.query(
      `UPDATE player_profiles pp SET galaxy_rank = sub.rnk
       FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY empire_power DESC) AS rnk FROM player_profiles) sub
       WHERE pp.id = sub.id`
    );
    categoriesUpdated++;

    await recordGameTick("leaderboard", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: categoriesUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function inactivePlayerWarningHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let warningsSent = 0;

  try {
    const offlineWindow = params.offlineWindowMinutes || 5;
    const result = await pool.query(
      `UPDATE player_profiles SET is_online = false, updated_at = now()
       WHERE is_online = true AND last_activity_at < now() - ($1 || ' minutes')::interval
       RETURNING id`,
      [offlineWindow]
    );
    warningsSent = result.rowCount || 0;

    await recordGameTick("inactive_warnings", { durationMs: Date.now() - startTime, playersProcessed: warningsSent });
    return { success: true, recordsAffected: warningsSent, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function backupCriticalDataHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const counts = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM users) AS users,
         (SELECT COUNT(*)::int FROM player_states) AS players,
         (SELECT COUNT(*)::int FROM battles) AS battles,
         (SELECT COUNT(*)::int FROM missions) AS missions,
         (SELECT COUNT(*)::int FROM bank_accounts) AS banks,
         (SELECT COUNT(*)::int FROM trade_offers) AS trade_offers,
         (SELECT COUNT(*)::int FROM auction_listings) AS auctions`
    );
    const snapshot = {
      takenAt: new Date().toISOString(),
      counts: counts.rows[0] || {},
    };
    const key = `backup_snapshot:${new Date().toISOString().slice(0, 10)}`;
    await pool.query(
      `INSERT INTO system_settings (key, value, description, category)
       VALUES ($1, $2, 'Daily critical data snapshot', 'backup')
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, JSON.stringify(snapshot)]
    );

    await recordGameTick("backup", { durationMs: Date.now() - startTime, backupSize: JSON.stringify(snapshot).length });
    return { success: true, metadata: { durationMs: Date.now() - startTime, snapshotKey: key } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============================================================================
// NEW HANDLERS
// ============================================================================

async function bankInterestHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let accountsUpdated = 0;

  try {
    const result = await pool.query(
      `UPDATE bank_accounts ba
       SET account_balance = ba.account_balance + interest.amount,
           total_interest_earned = ba.total_interest_earned + interest.amount,
           last_interest_payment = now(),
           updated_at = now()
       FROM (
         SELECT id, GREATEST(1, floor(account_balance * interest_rate / 365)) AS amount
         FROM bank_accounts
         WHERE is_active = true AND account_balance > 0
       ) interest
       WHERE ba.id = interest.id
       RETURNING ba.user_id, ba.id, interest.amount`
    );

    for (const row of result.rows) {
      await pool.query(
        `INSERT INTO bank_transactions (user_id, account_id, transaction_type, amount, description, balance_after)
         VALUES ($1, $2, 'interest', $3, 'Daily interest payment', 0)`,
        [row.user_id, row.id, row.amount]
      );
      accountsUpdated++;
    }

    await recordGameTick("bank_interest", { durationMs: Date.now() - startTime, playersProcessed: accountsUpdated });
    return { success: true, recordsAffected: accountsUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function auctionSettlementHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let auctionsSettled = 0;

  try {
    const result = await pool.query(
      `SELECT id, current_bidder_id, current_bid FROM auction_listings
       WHERE status = 'active' AND expires_at < now() LIMIT $1`,
      [params.maxBatchSize || 100]
    );

    for (const auction of result.rows) {
      const status = auction.current_bidder_id ? "sold" : "expired";
      await pool.query(
        `UPDATE auction_listings SET status = $2, completed_at = now() WHERE id = $1`,
        [auction.id, status]
      );
      auctionsSettled++;
    }

    await recordGameTick("auction_settlement", { durationMs: Date.now() - startTime, playersProcessed: auctionsSettled });
    return { success: true, recordsAffected: auctionsSettled, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function marketOrderMatchingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let tradesMatched = 0;

  try {
    const result = await pool.query(
      `SELECT id, user_id, type, resource, amount, price_per_unit
       FROM market_orders WHERE status = 'active' ORDER BY created_at ASC LIMIT $1`,
      [params.maxOrdersPerBatch || 200]
    );
    const orders = result.rows;
    const byResource: Record<string, { buys: any[]; sells: any[] }> = {};

    for (const order of orders) {
      const bucket = (byResource[order.resource] = byResource[order.resource] || { buys: [], sells: [] });
      if (order.type === "buy") bucket.buys.push(order);
      else bucket.sells.push(order);
    }

    for (const bucket of Object.values(byResource)) {
      bucket.buys.sort((a, b) => b.price_per_unit - a.price_per_unit);
      bucket.sells.sort((a, b) => a.price_per_unit - b.price_per_unit);

      let bi = 0;
      let si = 0;
      while (bi < bucket.buys.length && si < bucket.sells.length) {
        const buy = bucket.buys[bi];
        const sell = bucket.sells[si];
        if (buy.price_per_unit < sell.price_per_unit) break;

        const tradeAmount = Math.min(buy.amount, sell.amount);
        const cost = Math.floor(tradeAmount * sell.price_per_unit);
        const resource = buy.resource;

        const buyer = await pool.query("SELECT resources FROM player_states WHERE user_id = $1", [buy.user_id]);
        const seller = await pool.query("SELECT resources FROM player_states WHERE user_id = $1", [sell.user_id]);
        if (buyer.rows.length === 0 || seller.rows.length === 0) break;

        const bRes = buyer.rows[0].resources || {};
        const sRes = seller.rows[0].resources || {};
        const buyerCredits = toNumber(bRes.credits, 0);
        if (buyerCredits < cost) { bi++; continue; }

        const bNext = { ...bRes, credits: buyerCredits - cost, [resource]: toNumber(bRes[resource], 0) + tradeAmount };
        const sNext = { ...sRes, credits: toNumber(sRes.credits, 0) + cost, [resource]: Math.max(0, toNumber(sRes[resource], 0) - tradeAmount) };
        await pool.query("UPDATE player_states SET resources = $2, last_resource_update = now() WHERE user_id = $1", [buy.user_id, JSON.stringify(bNext)]);
        await pool.query("UPDATE player_states SET resources = $2, last_resource_update = now() WHERE user_id = $1", [sell.user_id, JSON.stringify(sNext)]);

        const buyRemaining = buy.amount - tradeAmount;
        const sellRemaining = sell.amount - tradeAmount;
        if (buyRemaining <= 0) {
          await pool.query(`UPDATE market_orders SET status = 'completed', amount = 0, completed_at = now() WHERE id = $1`, [buy.id]);
          bi++;
        } else {
          await pool.query(`UPDATE market_orders SET amount = $2 WHERE id = $1`, [buy.id, buyRemaining]);
        }
        if (sellRemaining <= 0) {
          await pool.query(`UPDATE market_orders SET status = 'completed', amount = 0, completed_at = now() WHERE id = $1`, [sell.id]);
          si++;
        } else {
          await pool.query(`UPDATE market_orders SET amount = $2 WHERE id = $1`, [sell.id, sellRemaining]);
        }
        tradesMatched++;
      }
    }

    await recordGameTick("market_matching", { durationMs: Date.now() - startTime, playersProcessed: tradesMatched });
    return { success: true, recordsAffected: tradesMatched, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function tradeOfferExpiryHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE trade_offers SET status = 'expired', completed_at = now(), updated_at = now()
       WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at < now() RETURNING id`
    );

    await recordGameTick("trade_offer_expiry", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function friendRequestExpiryHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE friend_requests SET status = 'expired', responded_at = now()
       WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at < now() RETURNING id`
    );

    await recordGameTick("friend_request_expiry", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function npcFactionReputationHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  const decay = params.decayPerTick || 1;

  try {
    const result = await pool.query(
      `SELECT id, reputation FROM npc_factions WHERE reputation <> 0`
    );

    for (const row of result.rows) {
      const reputation = row.reputation > 0 ? Math.max(0, row.reputation - decay) : Math.min(0, row.reputation + decay);
      await pool.query(
        `UPDATE npc_factions SET reputation = $2, standing = $3, updated_at = now() WHERE id = $1`,
        [row.id, reputation, standingFromReputation(reputation)]
      );
    }

    await recordGameTick("npc_faction_reputation", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function resourceFieldProductionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let fieldsProcessed = 0;
  const elapsedHours = 300000 / 3600000;
  const depletionPerTick = params.depletionPerTick || 0.2;

  try {
    const result = await pool.query(
      `SELECT id, mined_by_player_id, metal_per_hour, crystal_per_hour, deuterium_per_hour, depletion_percent
       FROM resource_fields WHERE is_depleted = false AND mined_by_player_id IS NOT NULL LIMIT $1`,
      [params.maxFieldsPerTick || 100]
    );

    for (const field of result.rows) {
      const metal = Math.floor(toNumber(field.metal_per_hour, 0) * elapsedHours);
      const crystal = Math.floor(toNumber(field.crystal_per_hour, 0) * elapsedHours);
      const deuterium = Math.floor(toNumber(field.deuterium_per_hour, 0) * elapsedHours);
      await creditResources(field.mined_by_player_id, metal, crystal, deuterium);

      const depletion = toNumber(field.depletion_percent, 0) + depletionPerTick;
      await pool.query(
        `UPDATE resource_fields SET depletion_percent = $2,
           total_metal_extracted = total_metal_extracted + $3,
           total_crystal_extracted = total_crystal_extracted + $4,
           total_deuterium_extracted = total_deuterium_extracted + $5,
           is_depleted = ($2 >= 100),
           mined_by_player_id = CASE WHEN $2 >= 100 THEN NULL ELSE mined_by_player_id END
         WHERE id = $1`,
        [field.id, depletion, metal, crystal, deuterium]
      );
      fieldsProcessed++;
    }

    const regen = await pool.query(
      `UPDATE resource_fields SET depletion_percent = GREATEST(0, depletion_percent - 1),
         is_depleted = (depletion_percent - 1 > 0)
       WHERE is_depleted = true RETURNING id`
    );
    fieldsProcessed += regen.rowCount || 0;

    await recordGameTick("resource_field_production", { durationMs: Date.now() - startTime, playersProcessed: fieldsProcessed });
    return { success: true, recordsAffected: fieldsProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function starbaseProductionHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let starbasesProcessed = 0;
  const elapsedHours = 60000 / 3600000;

  try {
    const result = await pool.query(
      `SELECT id, player_id, metal_production_rate, crystal_production_rate, deuterium_production_rate,
              metal_storage, crystal_storage, deuterium_storage, last_resource_update
       FROM starbases WHERE is_active = true LIMIT $1`,
      [params.maxStarbasesPerTick || 100]
    );

    for (const base of result.rows) {
      const state = await pool.query("SELECT resources FROM player_states WHERE user_id = $1", [base.player_id]);
      if (state.rows.length === 0) continue;

      const resources = state.rows[0].resources || {};
      const metal = Math.floor(toNumber(base.metal_production_rate, 0) * elapsedHours);
      const crystal = Math.floor(toNumber(base.crystal_production_rate, 0) * elapsedHours);
      const deuterium = Math.floor(toNumber(base.deuterium_production_rate, 0) * elapsedHours);

      const metalStored = Math.min(toNumber(resources.metal, 0) + metal, toNumber(base.metal_storage, 10000));
      const crystalStored = Math.min(toNumber(resources.crystal, 0) + crystal, toNumber(base.crystal_storage, 10000));
      const deuteriumStored = Math.min(toNumber(resources.deuterium, 0) + deuterium, toNumber(base.deuterium_storage, 5000));

      await pool.query(
        `UPDATE player_states SET resources = $2, last_resource_update = now() WHERE user_id = $1`,
        [base.player_id, JSON.stringify({ ...resources, metal: metalStored, crystal: crystalStored, deuterium: deuteriumStored })]
      );
      await pool.query(`UPDATE starbases SET last_resource_update = now(), updated_at = now() WHERE id = $1`, [base.id]);
      starbasesProcessed++;
    }

    await recordGameTick("starbase_production", { durationMs: Date.now() - startTime, playersProcessed: starbasesProcessed });
    return { success: true, recordsAffected: starbasesProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function moonBaseMiningHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let basesProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, player_id, mining_capacity, active_mining_ops, metal_reserves, crystal_reserves, deuterium_reserves
       FROM moon_bases WHERE is_active = true LIMIT $1`,
      [params.maxBasesPerTick || 100]
    );

    for (const base of result.rows) {
      const capacity = toNumber(base.mining_capacity, 1000);
      const ops = Math.max(1, toNumber(base.active_mining_ops, 1));
      const mined = Math.floor(capacity * 0.01);

      await pool.query(
        `UPDATE moon_bases SET
           metal_reserves = LEAST(metal_reserves + $2, $2 * 10),
           crystal_reserves = LEAST(crystal_reserves + $3, $3 * 10),
           deuterium_reserves = LEAST(deuterium_reserves + $4, $4 * 10),
           total_mined = total_mined + $5,
           updated_at = now()
         WHERE id = $1`,
        [base.id, mined, Math.floor(mined * 0.5), Math.floor(mined * 0.2), mined + Math.floor(mined * 0.7)]
      );
      await creditResources(base.player_id, mined, Math.floor(mined * 0.5), Math.floor(mined * 0.2));
      basesProcessed++;
    }

    await recordGameTick("moon_base_mining", { durationMs: Date.now() - startTime, playersProcessed: basesProcessed });
    return { success: true, recordsAffected: basesProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function durabilityDecayHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let decayed = 0;

  try {
    const eq = await pool.query(
      `UPDATE equipment_durability SET
         current_durability = GREATEST(0, current_durability - degradation_rate),
         durability_percent = GREATEST(0, round((current_durability - degradation_rate) / NULLIF(max_durability, 0) * 100)),
         is_broken = (current_durability - degradation_rate <= 0),
         updated_at = now()
       WHERE is_broken = false RETURNING id`
    );
    decayed += eq.rowCount || 0;

    const fleet = await pool.query(
      `UPDATE fleet_durability SET
         current_durability = GREATEST(0, current_durability - 0.2),
         durability_percent = GREATEST(0, round((current_durability - 0.2) / NULLIF(max_durability, 0) * 100)),
         health_status = CASE WHEN (current_durability - 0.2) < 50 THEN 'damaged' ELSE 'optimal' END,
         updated_at = now()
       WHERE health_status = 'optimal' RETURNING id`
    );
    decayed += fleet.rowCount || 0;

    const building = await pool.query(
      `UPDATE building_durability SET
         current_durability = GREATEST(0, current_durability - 0.1),
         durability_percent = GREATEST(0, round((current_durability - 0.1) / NULLIF(max_durability, 0) * 100)),
         structural_integrity = CASE WHEN (current_durability - 0.1) < 40 THEN 'damaged' ELSE 'intact' END,
         updated_at = now()
       WHERE structural_integrity = 'intact' RETURNING id`
    );
    decayed += building.rowCount || 0;

    await recordGameTick("durability_decay", { durationMs: Date.now() - startTime, playersProcessed: decayed });
    return { success: true, recordsAffected: decayed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function elementBuffExpiryHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE element_buffs SET is_active = false
       WHERE is_active = true AND expires_at IS NOT NULL AND expires_at < now() RETURNING id`
    );

    await recordGameTick("element_buff_expiry", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function espionageScanCleanupHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const retentionDays = params.retentionDays || 7;
    const result = await pool.query(
      `DELETE FROM espionage_scans WHERE created_at < now() - ($1 || ' days')::interval RETURNING id`,
      [retentionDays]
    );

    await recordGameTick("espionage_scan_cleanup", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function scanCooldownCleanupHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `DELETE FROM scan_cooldowns WHERE cooldown_until < now() RETURNING id`
    );

    await recordGameTick("scan_cooldown_cleanup", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function trialLeaderboardSyncHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let synced = 0;

  try {
    const trials = await pool.query(
      `SELECT user_id, trial_tier, best_time, best_wave, total_points_earned FROM trials`
    );

    for (const trial of trials.rows) {
      const existing = await pool.query(
        `SELECT id FROM trial_leaderboard WHERE user_id = $1 AND trial_tier = $2`,
        [trial.user_id, trial.trial_tier]
      );
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE trial_leaderboard SET best_time = $3, best_wave = $4, points = $5, updated_at = now() WHERE id = $1`,
          [existing.rows[0].id, trial.best_time, trial.best_wave, trial.total_points_earned]
        );
      } else {
        await pool.query(
          `INSERT INTO trial_leaderboard (user_id, trial_tier, best_time, best_wave, points)
           VALUES ($1, $2, $3, $4, $5)`,
          [trial.user_id, trial.trial_tier, trial.best_time, trial.best_wave, trial.total_points_earned]
        );
      }
      synced++;
    }

    await recordGameTick("trial_leaderboard_sync", { durationMs: Date.now() - startTime, playersProcessed: synced });
    return { success: true, recordsAffected: synced, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function raidFinderMatchmakingHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let matched = 0;
  const minGroupSize = params.minGroupSize || 6;

  try {
    const queued = await pool.query(
      `SELECT id, player_id, looking_for_boss_id FROM raid_finder WHERE status = 'queued' ORDER BY queued_at ASC`
    );

    const groups = new Map<string, any[]>();
    for (const entry of queued.rows) {
      const boss = entry.looking_for_boss_id || "general";
      const list = groups.get(boss) || [];
      list.push(entry);
      groups.set(boss, list);
    }

    for (const [bossId, entries] of groups) {
      while (entries.length >= minGroupSize) {
        const batch = entries.splice(0, minGroupSize);
        const groupName = `Raid Group vs ${bossId === "general" ? "any boss" : bossId} (${new Date().toISOString().slice(0, 16)})`;
        const created = await pool.query(
          `INSERT INTO raid_groups (name, description, leader_id, members, min_members, max_members, status, target_boss_id)
           VALUES ($1, 'Auto-formed by raid finder', $2, $3, $4, 50, 'forming', $5) RETURNING id`,
          [groupName, batch[0].player_id, JSON.stringify(batch.map((b) => b.player_id)), minGroupSize, bossId === "general" ? null : bossId]
        );
        for (const entry of batch) {
          await pool.query(
            `UPDATE raid_finder SET status = 'matched' WHERE id = $1`,
            [entry.id]
          );
        }
        matched += batch.length;
      }
    }

    await recordGameTick("raid_finder_matchmaking", { durationMs: Date.now() - startTime, playersProcessed: matched });
    return { success: true, recordsAffected: matched, metadata: { durationMs: Date.now() - startTime, groupsFormed: matched > 0 ? 1 : 0 } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function bossEncounterResolutionHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let resolved = 0;

  try {
    const result = await pool.query(
      `SELECT id, current_health, participants FROM boss_encounters WHERE status = 'active'`
    );

    for (const encounter of result.rows) {
      const participantCount = Array.isArray(encounter.participants) ? encounter.participants.length : 0;
      const next: Record<string, any> = { participant_count: participantCount };
      if (encounter.current_health != null && encounter.current_health <= 0) {
        next.status = "defeated";
        next.completed_at = new Date();
      }
      await pool.query(
        `UPDATE boss_encounters SET participant_count = $2, status = COALESCE($3, status), completed_at = COALESCE($4, completed_at) WHERE id = $1`,
        [encounter.id, participantCount, next.status || null, next.completed_at || null]
      );
      resolved++;
    }

    await recordGameTick("boss_encounter_resolution", { durationMs: Date.now() - startTime, playersProcessed: resolved });
    return { success: true, recordsAffected: resolved, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function universeEventExpiryHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE universe_events SET status = 'completed'
       WHERE status = 'active' AND end_time IS NOT NULL AND end_time < now() RETURNING id`
    );

    await recordGameTick("universe_event_expiry", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function guildUpkeepHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let guildsUpdated = 0;

  try {
    const result = await pool.query(
      `UPDATE guilds g SET
         total_members = (SELECT COUNT(*)::int FROM guild_members gm WHERE gm.guild_id = g.id),
         influence = g.influence + GREATEST(1, g.level),
         updated_at = now()
       WHERE g.updated_at < now() - interval '1 hour' RETURNING id`
    );

    guildsUpdated = result.rowCount || 0;
    await recordGameTick("guild_upkeep", { durationMs: Date.now() - startTime, playersProcessed: guildsUpdated });
    return { success: true, recordsAffected: guildsUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function raidExpiryHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  const maxHours = params.maxRaidHours || 24;

  try {
    const result = await pool.query(
      `UPDATE raids SET status = 'completed', result = 'cancelled', ended_at = now()
       WHERE status IN ('preparing', 'active') AND started_at < now() - ($1 || ' hours')::interval RETURNING id`,
      [maxHours]
    );

    await recordGameTick("raid_expiry", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function empireValueCalcHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT ps.user_id, ps.resources, ps.buildings, ps.units,
              COALESCE(pc.silver + pc.gold * 10 + pc.platinum * 100, 0) AS currency_value
       FROM player_states ps
       LEFT JOIN player_currency pc ON pc.user_id = ps.user_id
       LIMIT $1`,
      [params.maxPlayersPerTick || 200]
    );

    for (const row of result.rows) {
      const resources = row.resources || {};
      const buildings = row.buildings || {};
      const units = row.units || {};

      const resourceValue =
        toNumber(resources.metal, 0) + toNumber(resources.crystal, 0) * 2 + toNumber(resources.deuterium, 0) * 3;
      const buildingValue = Object.values(buildings).reduce((s: number, v) => s + toNumber(v) * 500, 0);
      const fleetValue = Object.values(units).reduce((s: number, v) => s + toNumber(v) * 100, 0);
      const currencyValue = toNumber(row.currency_value, 0);
      const totalValue = resourceValue + buildingValue + fleetValue + currencyValue;

      const existing = await pool.query(`SELECT id FROM empire_values WHERE user_id = $1`, [row.user_id]);
      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE empire_values SET resource_value = $2, building_value = $3, fleet_value = $4,
             currency_value = $5, total_value = $6, last_calculated = now() WHERE user_id = $1`,
          [row.user_id, resourceValue, buildingValue, fleetValue, currencyValue, totalValue]
        );
      } else {
        await pool.query(
          `INSERT INTO empire_values (user_id, resource_value, building_value, fleet_value, currency_value, total_value)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [row.user_id, resourceValue, buildingValue, fleetValue, currencyValue, totalValue]
        );
      }
      playersProcessed++;
    }

    await pool.query(
      `UPDATE empire_values ev SET empire_rank = sub.rnk
       FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY total_value DESC) AS rnk FROM empire_values) sub
       WHERE ev.id = sub.id`
    );

    await recordGameTick("empire_value_calc", { durationMs: Date.now() - startTime, playersProcessed });
    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function combatRatingDecayHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE combat_stats SET
         combat_rating = CASE WHEN combat_rating > 1000 THEN combat_rating - 1 WHEN combat_rating < 1000 THEN combat_rating + 1 ELSE 1000 END,
         raid_rating = CASE WHEN raid_rating > 1000 THEN raid_rating - 1 WHEN raid_rating < 1000 THEN raid_rating + 1 ELSE 1000 END,
         updated_at = now()
       WHERE combat_rating <> 1000 OR raid_rating <> 1000 RETURNING id`
    );

    await recordGameTick("combat_rating_decay", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function weeklyMissionProgressHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();

  try {
    const result = await pool.query(
      `UPDATE weekly_mission_progress SET
         completed_count = COALESCE((SELECT COUNT(*)::int FROM jsonb_array_elements(COALESCE(missions, '[]'::jsonb)) m
                                    WHERE (m->>'completed')::boolean), 0),
         total_count = COALESCE((SELECT COUNT(*)::int FROM jsonb_array_elements(COALESCE(missions, '[]'::jsonb)) m), 0),
         updated_at = now()
       WHERE missions IS NOT NULL RETURNING id`
    );

    await recordGameTick("weekly_mission_progress", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function bountyExpiryHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  const maxDays = params.maxBountyDays || 30;

  try {
    const result = await pool.query(
      `UPDATE bounties SET active = false
       WHERE active = true AND created_at < now() - ($1 || ' days')::interval RETURNING id`,
      [maxDays]
    );

    await recordGameTick("bounty_expiry", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function celestialMarketplaceCleanupHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  const maxDays = params.maxListingDays || 30;

  try {
    const result = await pool.query(
      `UPDATE celestial_marketplace SET status = 'cancelled', updated_at = now()
       WHERE status = 'listed' AND listed_at < now() - ($1 || ' days')::interval RETURNING id`,
      [maxDays]
    );

    await recordGameTick("celestial_marketplace_cleanup", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function missileSiloMaintenanceHandler(_job: any, _params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let silosUpdated = 0;

  try {
    const result = await pool.query(
      `SELECT id, missile_silo FROM player_states WHERE missile_silo IS NOT NULL`
    );

    for (const row of result.rows) {
      const silo = row.missile_silo || {};
      const level = toNumber(silo.level, 0);
      if (level <= 0) continue;

      const abmCap = level * 10;
      const ipmCap = level * 20;
      let changed = false;
      if (toNumber(silo.abms, 0) > abmCap) { silo.abms = abmCap; changed = true; }
      if (toNumber(silo.ipms, 0) > ipmCap) { silo.ipms = ipmCap; changed = true; }

      if (changed) {
        await pool.query(`UPDATE player_states SET missile_silo = $2, updated_at = now() WHERE id = $1`, [row.id, JSON.stringify(silo)]);
        silosUpdated++;
      }
    }

    await recordGameTick("missile_silo_maintenance", { durationMs: Date.now() - startTime, playersProcessed: silosUpdated });
    return { success: true, recordsAffected: silosUpdated, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function lifeSupportTickHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let playersProcessed = 0;

  try {
    const result = await pool.query(
      `SELECT id, buildings FROM player_states WHERE buildings->'lifeSupportLevel' IS NOT NULL LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );
    const elapsedHours = 10 / 60; // 10 minute tick

    for (const row of result.rows) {
      const buildings = row.buildings || {};
      const level = toNumber(buildings.lifeSupportLevel, 1);
      const population =
        toNumber(buildings.workers, 0) + toNumber(buildings.civilians, 0) +
        toNumber(buildings.scientists, 0) + toNumber(buildings.soldiers, 0);
      if (population <= 0) continue;

      const foodConsumed = Math.max(1, Math.floor(population * LIFE_SUPPORT_CONFIG.baseFoodConsumptionPerPop * elapsedHours));
      const waterConsumed = Math.max(1, Math.floor(population * LIFE_SUPPORT_CONFIG.baseWaterConsumptionPerPop * elapsedHours));

      let foodStorage = Math.max(0, toNumber(buildings.foodStorage, 0) - foodConsumed);
      let waterStorage = Math.max(0, toNumber(buildings.waterStorage, 0) - waterConsumed);
      let happiness = toNumber(buildings.happiness, 100);
      if (foodStorage <= 0) happiness = Math.max(0, happiness + LIFE_SUPPORT_CONFIG.starvationHappinessPenalty);
      if (waterStorage <= 0) happiness = Math.max(0, happiness + LIFE_SUPPORT_CONFIG.dehydrationHappinessPenalty);

      const oxygenLevel = Math.min(
        LIFE_SUPPORT_CONFIG.maxOxygenLevel,
        level * LIFE_SUPPORT_CONFIG.baseOxygenPerSupportLevel * 100
      );
      if (oxygenLevel < LIFE_SUPPORT_CONFIG.minOxygenForGrowth) {
        happiness = Math.max(0, happiness + LIFE_SUPPORT_CONFIG.suffocationHappinessPenalty);
      }

      buildings.foodStorage = foodStorage;
      buildings.waterStorage = waterStorage;
      buildings.happiness = Math.round(happiness * 1000) / 1000;
      buildings.oxygenLevel = Math.round(oxygenLevel * 100) / 100;

      await pool.query(`UPDATE player_states SET buildings = $2, updated_at = now() WHERE id = $1`, [row.id, JSON.stringify(buildings)]);
      playersProcessed++;
    }

    await recordGameTick("life_support_tick", { durationMs: Date.now() - startTime, playersProcessed });
    return { success: true, recordsProcessed: playersProcessed, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function occupationTributeHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  let tributeCollected = 0;

  try {
    const result = await pool.query(
      `SELECT id, user_id, occupying FROM player_states
       WHERE jsonb_array_length(COALESCE(occupying, '[]'::jsonb)) > 0 LIMIT $1`,
      [params.maxPlayersPerTick || 100]
    );

    for (const row of result.rows) {
      const occupying: any[] = row.occupying || [];
      const now = Date.now();
      let changed = false;
      let totalMetal = 0;
      let totalCrystal = 0;
      let totalDeuterium = 0;

      for (const occ of occupying) {
        const lastCollection = occ.lastCollectedAt ? new Date(occ.lastCollectedAt).getTime() : now - 3600000;
        if (now - lastCollection < 3600000) continue;

        const defender = await pool.query("SELECT resources FROM player_states WHERE user_id = $1", [occ.occupiedBy]);
        if (defender.rows.length === 0) continue;
        const dRes = defender.rows[0].resources || {};
        const rate = toNumber(occ.tributeRate, 0.5);

        const metal = Math.floor((dRes.metal || 0) * rate * 0.1);
        const crystal = Math.floor((dRes.crystal || 0) * rate * 0.1);
        const deuterium = Math.floor((dRes.deuterium || 0) * rate * 0.1);

        await pool.query(
          `UPDATE player_states SET resources = $2, updated_at = now() WHERE user_id = $1`,
          [occ.occupiedBy, JSON.stringify({ ...dRes, metal: Math.max(0, (dRes.metal || 0) - metal), crystal: Math.max(0, (dRes.crystal || 0) - crystal), deuterium: Math.max(0, (dRes.deuterium || 0) - deuterium) })]
        );

        totalMetal += metal;
        totalCrystal += crystal;
        totalDeuterium += deuterium;
        occ.lastCollectedAt = new Date(now).toISOString();
        changed = true;
        tributeCollected++;
      }

      if (changed) {
        await pool.query(
          `UPDATE player_states SET occupying = $2, updated_at = now() WHERE user_id = $1`,
          [row.user_id, JSON.stringify(occupying)]
        );
        await creditResources(row.user_id, totalMetal, totalCrystal, totalDeuterium);
      }
    }

    await recordGameTick("occupation_tribute", { durationMs: Date.now() - startTime, playersProcessed: tributeCollected });
    return { success: true, recordsAffected: tributeCollected, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function relicConditionDecayHandler(_job: any, params: any): Promise<CronJobResult> {
  const startTime = Date.now();
  const decay = params.decayPerTick || 1;

  try {
    const result = await pool.query(
      `UPDATE relic_inventory SET condition = GREATEST(0, condition - $1)
       WHERE is_equipped = true AND condition > 0 RETURNING id`,
      [decay]
    );

    await recordGameTick("relic_condition_decay", { durationMs: Date.now() - startTime, playersProcessed: result.rowCount || 0 });
    return { success: true, recordsAffected: result.rowCount || 0, metadata: { durationMs: Date.now() - startTime } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
