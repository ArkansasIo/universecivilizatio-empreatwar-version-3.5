import { DATABASE_CONFIG } from '../config/databaseConfig';

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  sqlExecuted: string;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private isConnected: boolean = true;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getDatabaseConfig() {
    return DATABASE_CONFIG;
  }

  public async executeSql(sql: string): Promise<SqlQueryResult> {
    const startTime = performance.now();
    const cleanSql = sql.trim().toLowerCase();

    // Mock SQL Execution Engine for In-Browser Testing & Real-time Console
    let columns: string[] = [];
    let rows: Record<string, any>[] = [];

    if (cleanSql.startsWith('select') && cleanSql.includes('users_profile')) {
      columns = ['id', 'username', 'commander_rank', 'rpg_level', 'active_theme'];
      rows = [
        {
          id: 'user_supreme_cmd_01',
          username: 'Grand Admiral',
          commander_rank: 'Fleet High Commander',
          rpg_level: 42,
          active_theme: 'theme_white_default',
        },
      ];
    } else if (cleanSql.startsWith('select') && cleanSql.includes('imperial_resources')) {
      columns = ['user_id', 'turns', 'naquadah', 'crystal', 'trinium', 'banked_naquadah'];
      rows = [
        {
          user_id: 'user_supreme_cmd_01',
          turns: 450,
          naquadah: 2500000,
          crystal: 1200000,
          trinium: 800000,
          banked_naquadah: 1000000,
        },
      ];
    } else if (cleanSql.startsWith('select') && cleanSql.includes('naval_shipyard')) {
      columns = ['ship_id', 'ship_name', 'ship_class', 'tier_level', 'attack_power', 'quantity_owned'];
      rows = [
        {
          ship_id: 'ship_bc_304',
          ship_name: 'BC-304 Daedalus Class',
          ship_class: 'Battlecruiser',
          tier_level: 6,
          attack_power: 85000,
          quantity_owned: 12,
        },
        {
          ship_id: 'ship_f_302',
          ship_name: 'F-302 Mongoose Interceptor',
          ship_class: 'Light Fighter',
          tier_level: 1,
          attack_power: 4200,
          quantity_owned: 150,
        },
        {
          ship_id: 'ship_hatak',
          ship_name: "Goa'uld Ha'tak Mothership",
          ship_class: 'Dreadnought',
          tier_level: 9,
          attack_power: 220000,
          quantity_owned: 5,
        },
      ];
    } else if (cleanSql.startsWith('select') && cleanSql.includes('stargate_relics_vault')) {
      columns = ['relic_id', 'relic_name', 'origin_show_movie', 'rarity', 'is_socketed', 'quantity_owned'];
      rows = [
        {
          relic_id: 'relic_zpm_potentia',
          relic_name: 'Zero-Point Module (Potentia)',
          origin_show_movie: 'SG-1 / Atlantis',
          rarity: 'Ascended Divine',
          is_socketed: true,
          quantity_owned: 1,
        },
        {
          relic_id: 'relic_asgard_core',
          relic_name: 'Asgard Computer Core',
          origin_show_movie: 'Stargate SG-1',
          rarity: 'Lantean Ancient',
          is_socketed: true,
          quantity_owned: 1,
        },
        {
          relic_id: 'relic_dakara_wave',
          relic_name: 'Dakara Molecular Wave Array',
          origin_show_movie: 'Stargate SG-1',
          rarity: 'Ascended Divine',
          is_socketed: false,
          quantity_owned: 1,
        },
      ];
    } else {
      // Generic OK response for INSERT, UPDATE, CREATE TABLE, ALTER TABLE, etc.
      columns = ['status', 'message', 'affected_rows'];
      rows = [
        {
          status: 'SUCCESS',
          message: 'SQL Statement executed successfully.',
          affected_rows: 1,
        },
      ];
    }

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: Math.max(0.12, executionTimeMs),
      sqlExecuted: sql,
    };
  }

  public getTables(): string[] {
    return DATABASE_CONFIG.tables;
  }
}

export const dbManager = DatabaseManager.getInstance();
