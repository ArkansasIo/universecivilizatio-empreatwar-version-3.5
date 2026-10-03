export interface DatabaseConfiguration {
  dialect: 'sqlite' | 'postgresql';
  databaseName: string;
  connectionString: string;
  maxPoolConnections: number;
  idleTimeoutMs: number;
  migrationsPath: string;
  tables: string[];
}

export const DATABASE_CONFIG: DatabaseConfiguration = {
  dialect: 'postgresql',
  databaseName: 'universe_civilization_db',
  connectionString: 'postgresql://admin:stargate_secret@127.0.0.1:5432/universe_civilization_db',
  maxPoolConnections: 20,
  idleTimeoutMs: 30000,
  migrationsPath: './src/db/migrations',
  tables: [
    'users_profile',
    'imperial_resources',
    'naval_shipyard',
    'stargate_relics_vault',
    'colonies_mines',
    'system_configs',
    'audit_transactions_log',
  ],
};
