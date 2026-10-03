import { CronJob, CronConfig, CronExecutionLog } from './types';

export const INITIAL_CRON_JOBS: CronJob[] = [
  {
    id: 'turn_cron',
    name: 'Turn Settlement & Resource Yield',
    description:
      'Advances the empire production cycle. Increments player attack turns, calculates net Naquadah income from mines and workers, deducts military upkeep, and yields untrained civilian population from recruitment stations.',
    schedule: '*/1 * * * * (Every 60s in Fast Mode / 30m standard)',
    intervalSeconds: 60,
    enabled: true,
    lastRunAt: new Date(Date.now() - 45000).toISOString(),
    nextRunAt: new Date(Date.now() + 15000).toISOString(),
    runCount: 142,
    lastExecutionMs: 14,
    status: 'idle',
    lastResultSummary: '+1 Attack Turn, +1,250 Naquadah, +15 Civilian recruits',
    commandSnippet: 'php /var/www/mmo/cron/turn.php >> /var/log/mmo/turn.log 2>&1',
  },
  {
    id: 'daily_cron',
    name: 'Midnight Settlement & Bank Vault Interest',
    description:
      'Executes at 00:00 UTC. Accrues 2% compound interest on all banked Naquadah reserves, recalculates galactic ladder leaderboards, audits empire glory ratings, and checks colonial population growth.',
    schedule: '0 0 * * * (Daily at 00:00 UTC)',
    intervalSeconds: 86400,
    enabled: true,
    lastRunAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    nextRunAt: new Date(Date.now() + 3600000 * 18).toISOString(),
    runCount: 18,
    lastExecutionMs: 38,
    status: 'idle',
    lastResultSummary: '+2% Bank vault yield accrued, Ladder rankings verified',
    commandSnippet: 'php /var/www/mmo/cron/daily_settlement.php >> /var/log/mmo/daily.log 2>&1',
  },
  {
    id: 'market_cron',
    name: 'Galactic Commerce & Mercenary Guild Fluctuation',
    description:
      'Simulates market supply and demand dynamics. Shifts raw commodity exchange rates for Trinium, Deuterium, and Naquadah, and rotates available elite mercenary combat units in the guild.',
    schedule: '*/5 * * * * (Every 5 minutes)',
    intervalSeconds: 300,
    enabled: true,
    lastRunAt: new Date(Date.now() - 120000).toISOString(),
    nextRunAt: new Date(Date.now() + 180000).toISOString(),
    runCount: 48,
    lastExecutionMs: 18,
    status: 'idle',
    lastResultSummary: 'Commodity exchange rates recalibrated (±4.2%)',
    commandSnippet: 'php /var/www/mmo/cron/market_fluctuation.php >> /var/log/mmo/market.log 2>&1',
  },
  {
    id: 'target_regen_cron',
    name: 'NPC Enemy Realms Fleet Replenishment',
    description:
      'Restores defensive divisions and replenishes pillageable Naquadah vaults across rival NPC empires (Lord Apophis, Baal Syndicate, Replicator Swarms, and Rogue Fleets) after player raids.',
    schedule: '*/3 * * * * (Every 3 minutes)',
    intervalSeconds: 180,
    enabled: true,
    lastRunAt: new Date(Date.now() - 90000).toISOString(),
    nextRunAt: new Date(Date.now() + 90000).toISOString(),
    runCount: 65,
    lastExecutionMs: 22,
    status: 'idle',
    lastResultSummary: 'NPC garrison casualties reinforced, treasuries replenished',
    commandSnippet: 'php /var/www/mmo/cron/npc_regeneration.php >> /var/log/mmo/npc.log 2>&1',
  },
  {
    id: 'events_cron',
    name: 'Galactic Anomalies & Deep Space Phenomena',
    description:
      'Triggers random deep space environmental occurrences, including solar radiation storms, stargate wormhole resonance surges, and ancient cache discoveries.',
    schedule: '*/10 * * * * (Every 10 minutes)',
    intervalSeconds: 600,
    enabled: true,
    lastRunAt: new Date(Date.now() - 400000).toISOString(),
    nextRunAt: new Date(Date.now() + 200000).toISOString(),
    runCount: 24,
    lastExecutionMs: 9,
    status: 'idle',
    lastResultSummary: 'Deep space sensor sweep complete, no catastrophic anomalies detected',
    commandSnippet: 'php /var/www/mmo/cron/galaxy_events.php >> /var/log/mmo/events.log 2>&1',
  },
];

export const INITIAL_CRON_LOGS: CronExecutionLog[] = [
  {
    id: 'log-1',
    jobId: 'turn_cron',
    jobName: 'Turn Settlement & Resource Yield',
    timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
    durationMs: 14,
    status: 'success',
    message: 'Turn cycle executed successfully.',
    details: {
      turnsAdded: 1,
      incomeAdded: 1450,
      unitsAdded: 15,
      upkeepDeducted: 120,
    },
  },
  {
    id: 'log-2',
    jobId: 'target_regen_cron',
    jobName: 'NPC Enemy Realms Fleet Replenishment',
    timestamp: new Date(Date.now() - 90000).toLocaleTimeString(),
    durationMs: 22,
    status: 'success',
    message: 'Reinforced garrisons across 4 rival star systems.',
    details: {
      targetsRegenerated: 4,
    },
  },
  {
    id: 'log-3',
    jobId: 'market_cron',
    jobName: 'Galactic Commerce & Mercenary Guild Fluctuation',
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
    durationMs: 18,
    status: 'success',
    message: 'Exchange index updated. Trinium value +3.1%, Naquadah -1.4%.',
    details: {
      marketFluctuation: 'Trinium +3.1%, Deuterium +1.8%, Naquadah -1.4%',
    },
  },
];

export const DEFAULT_CRON_CONFIG: CronConfig = {
  autoTickEnabled: true,
  tickIntervalSeconds: 60,
  offlineCatchup: true,
  soundOnTick: false,
};
