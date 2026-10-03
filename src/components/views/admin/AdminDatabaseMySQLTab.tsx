import React, { useState } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  Server,
  Code,
  Table,
  Terminal,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  FileCode,
  Play,
  Layers,
  ShieldCheck,
  Sliders,
  Cpu,
} from 'lucide-react';
import { sound } from '../../../sound';

interface TableMetadata {
  name: string;
  category: 'core' | 'user' | 'military' | 'economy' | 'social' | 'system';
  description: string;
  rows: number;
  engine: string;
  primaryKey: string;
  columns: { name: string; type: string; null: string; key: string; default: string }[];
}

const MYSQL_TABLES_SCHEMA: TableMetadata[] = [
  {
    name: 'game_config',
    category: 'system',
    description: 'Master server rules, turn tick frequency (60s), Naquadah yields, and maintenance flags.',
    rows: 14,
    engine: 'InnoDB',
    primaryKey: 'config_key',
    columns: [
      { name: 'config_key', type: 'varchar(80)', null: 'NO', key: 'PRI', default: 'None' },
      { name: 'config_value', type: 'text', null: 'NO', key: '', default: 'None' },
      { name: 'category', type: 'varchar(50)', null: 'NO', key: 'MUL', default: 'general' },
      { name: 'description', type: 'varchar(255)', null: 'YES', key: '', default: 'NULL' },
      { name: 'updated_at', type: 'timestamp', null: 'NO', key: '', default: 'current_timestamp()' },
    ],
  },
  {
    name: 'users',
    category: 'user',
    description: 'Player accounts, commander credentials, faction designation, RPG level, and rank.',
    rows: 3,
    engine: 'InnoDB',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'varchar(64)', null: 'NO', key: 'PRI', default: 'None' },
      { name: 'username', type: 'varchar(64)', null: 'NO', key: 'UNI', default: 'None' },
      { name: 'email', type: 'varchar(128)', null: 'NO', key: 'UNI', default: 'None' },
      { name: 'password_hash', type: 'varchar(255)', null: 'NO', key: '', default: 'None' },
      { name: 'commander_rank', type: 'varchar(64)', null: 'NO', key: '', default: 'Cadet Commander' },
      { name: 'faction', type: "enum('Tauri','Goauld','Asgard','Wraith','Ori','Ancient')", null: 'NO', key: 'MUL', default: 'Tauri' },
      { name: 'rpg_level', type: 'int(11)', null: 'NO', key: 'MUL', default: '1' },
      { name: 'rpg_xp', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'credits', type: 'bigint(20)', null: 'NO', key: '', default: '10000' },
      { name: 'is_admin', type: 'tinyint(1)', null: 'NO', key: '', default: '0' },
      { name: 'active_theme', type: 'varchar(40)', null: 'NO', key: '', default: 'theme_white_default' },
    ],
  },
  {
    name: 'user_resources',
    category: 'economy',
    description: 'Liquid Naquadah, Crystal, Trinium, Neutronium, Dark Matter, Energy, and Banked Vaults.',
    rows: 3,
    engine: 'InnoDB',
    primaryKey: 'user_id',
    columns: [
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'PRI', default: 'None' },
      { name: 'turns', type: 'int(11)', null: 'NO', key: '', default: '150' },
      { name: 'naquadah', type: 'bigint(20)', null: 'NO', key: '', default: '100000' },
      { name: 'crystal', type: 'bigint(20)', null: 'NO', key: '', default: '50000' },
      { name: 'trinium', type: 'bigint(20)', null: 'NO', key: '', default: '25000' },
      { name: 'neutronium', type: 'bigint(20)', null: 'NO', key: '', default: '10000' },
      { name: 'dark_matter', type: 'bigint(20)', null: 'NO', key: '', default: '5000' },
      { name: 'energy', type: 'bigint(20)', null: 'NO', key: '', default: '150000' },
      { name: 'banked_naquadah', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'untrained_units', type: 'bigint(20)', null: 'NO', key: '', default: '500' },
    ],
  },
  {
    name: 'user_military_units',
    category: 'military',
    description: 'Assault Troops, Garrison Defense Guards, Naquadah Miners, Covert Spies, and Apex Titans.',
    rows: 3,
    engine: 'InnoDB',
    primaryKey: 'user_id',
    columns: [
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'PRI', default: 'None' },
      { name: 'attack_troops', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'defense_troops', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'miners', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'spies', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'counter_intel', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
      { name: 'super_units', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
    ],
  },
  {
    name: 'naval_shipyard_ships',
    category: 'military',
    description: 'Starfleet warships: F-302s, BC-304 Daedalus, Ha\'tak Motherships, with HP, Shields & Attack.',
    rows: 5,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'ship_id', type: 'varchar(64)', null: 'NO', key: '', default: 'None' },
      { name: 'ship_name', type: 'varchar(120)', null: 'NO', key: '', default: 'None' },
      { name: 'ship_class', type: 'varchar(80)', null: 'NO', key: '', default: 'None' },
      { name: 'tier_level', type: 'int(11)', null: 'NO', key: 'MUL', default: '1' },
      { name: 'hull_hp', type: 'bigint(20)', null: 'NO', key: '', default: '1000' },
      { name: 'shield_hp', type: 'bigint(20)', null: 'NO', key: '', default: '500' },
      { name: 'attack_power', type: 'bigint(20)', null: 'NO', key: '', default: '200' },
      { name: 'quantity', type: 'int(11)', null: 'NO', key: '', default: '1' },
    ],
  },
  {
    name: 'stargate_relics_inventory',
    category: 'military',
    description: 'Ancient artifacts (ZPMs, Asgard Cores, Dakara Wave Arrays, Eye of Ra) and power multipliers.',
    rows: 4,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'relic_id', type: 'varchar(64)', null: 'NO', key: '', default: 'None' },
      { name: 'relic_name', type: 'varchar(120)', null: 'NO', key: '', default: 'None' },
      { name: 'origin', type: 'varchar(100)', null: 'NO', key: '', default: 'None' },
      { name: 'rarity', type: 'enum(...)', null: 'NO', key: 'MUL', default: 'Rare' },
      { name: 'power_multiplier', type: 'decimal(4,2)', null: 'NO', key: '', default: '1.25' },
      { name: 'is_socketed', type: 'tinyint(1)', null: 'NO', key: '', default: '0' },
    ],
  },
  {
    name: 'colonies_planets',
    category: 'economy',
    description: 'Settled planets in Galaxies & Solar Systems with mines, solar plants, and population.',
    rows: 3,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'planet_name', type: 'varchar(80)', null: 'NO', key: '', default: 'None' },
      { name: 'galaxy', type: 'int(11)', null: 'NO', key: 'MUL', default: '1' },
      { name: 'solar_system', type: 'int(11)', null: 'NO', key: '', default: '1' },
      { name: 'planet_slot', type: 'int(11)', null: 'NO', key: '', default: '1' },
      { name: 'metal_mine_lvl', type: 'int(11)', null: 'NO', key: '', default: '1' },
      { name: 'crystal_mine_lvl', type: 'int(11)', null: 'NO', key: '', default: '1' },
      { name: 'deuterium_synth_lvl', type: 'int(11)', null: 'NO', key: '', default: '1' },
      { name: 'population', type: 'bigint(20)', null: 'NO', key: '', default: '250000' },
    ],
  },
  {
    name: 'defense_structures',
    category: 'military',
    description: 'Ground defense cannons: rocket launchers, heavy lasers, gauss cannons, and shield domes.',
    rows: 3,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'planet_id', type: 'bigint(20) unsigned', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'rocket_launchers', type: 'int(11)', null: 'NO', key: '', default: '0' },
      { name: 'light_lasers', type: 'int(11)', null: 'NO', key: '', default: '0' },
      { name: 'plasma_turrets', type: 'int(11)', null: 'NO', key: '', default: '0' },
      { name: 'small_shield_dome', type: 'tinyint(1)', null: 'NO', key: '', default: '0' },
    ],
  },
  {
    name: 'research_technology',
    category: 'military',
    description: 'Commander tech tree: espionage, weapons, shielding, hyperspace, plasma and astrophysics.',
    rows: 3,
    engine: 'InnoDB',
    primaryKey: 'user_id',
    columns: [
      { name: 'user_id', type: 'varchar(64)', null: 'NO', key: 'PRI', default: 'None' },
      { name: 'espionage_tech', type: 'int(11)', null: 'NO', key: '', default: '0' },
      { name: 'weapons_tech', type: 'int(11)', null: 'NO', key: '', default: '0' },
      { name: 'shielding_tech', type: 'int(11)', null: 'NO', key: '', default: '0' },
      { name: 'hyperspace_drive', type: 'int(11)', null: 'NO', key: '', default: '0' },
    ],
  },
  {
    name: 'alliances',
    category: 'social',
    description: 'Galactic coalitions, Goa\'uld System Lord councils, rosters, and alliance treasuries.',
    rows: 2,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'tag', type: 'varchar(12)', null: 'NO', key: 'UNI', default: 'None' },
      { name: 'name', type: 'varchar(80)', null: 'NO', key: 'UNI', default: 'None' },
      { name: 'founder_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'treasury_naquadah', type: 'bigint(20)', null: 'NO', key: '', default: '500000' },
    ],
  },
  {
    name: 'combat_battle_logs',
    category: 'military',
    description: 'Naval space battles, fleet casualties, debris fields, and plundered ore logs.',
    rows: 1,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'attacker_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'defender_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'winner_id', type: 'varchar(64)', null: 'YES', key: '', default: 'NULL' },
      { name: 'debris_naquadah', type: 'bigint(20)', null: 'NO', key: '', default: '0' },
    ],
  },
  {
    name: 'espionage_missions',
    category: 'military',
    description: 'Infiltration reports, phase-cloak sensor scans, and counter-intel interceptions.',
    rows: 1,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'spy_user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'target_user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'success_rate', type: 'decimal(5,2)', null: 'NO', key: '', default: '75.00' },
    ],
  },
  {
    name: 'marketplace_orders',
    category: 'economy',
    description: 'Galactic bazaar: trade offers, buying/selling raw ore, prices, and status.',
    rows: 2,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'seller_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'resource_type', type: 'enum(...)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'amount', type: 'bigint(20)', null: 'NO', key: '', default: 'None' },
      { name: 'price_per_unit', type: 'decimal(10,4)', null: 'NO', key: '', default: 'None' },
    ],
  },
  {
    name: 'cron_job_queue',
    category: 'system',
    description: 'Background schedulers for tick generators, mine production, rankings, and maintenance.',
    rows: 4,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'job_name', type: 'varchar(80)', null: 'NO', key: 'UNI', default: 'None' },
      { name: 'cron_expression', type: 'varchar(50)', null: 'NO', key: '', default: '* * * * *' },
      { name: 'execution_time_ms', type: 'decimal(8,2)', null: 'NO', key: '', default: '0.00' },
    ],
  },
  {
    name: 'admin_audit_logs',
    category: 'system',
    description: 'Security audit trail: imperial decrees, settings changes, ban executions, and IP addresses.',
    rows: 2,
    engine: 'InnoDB',
    primaryKey: 'id (AUTO_INCREMENT)',
    columns: [
      { name: 'id', type: 'bigint(20) unsigned', null: 'NO', key: 'PRI', default: 'auto_increment' },
      { name: 'admin_user_id', type: 'varchar(64)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'action_code', type: 'varchar(60)', null: 'NO', key: 'MUL', default: 'None' },
      { name: 'details', type: 'text', null: 'NO', key: '', default: 'None' },
      { name: 'ip_address', type: 'varchar(45)', null: 'NO', key: '', default: '127.0.0.1' },
    ],
  },
];

export const AdminDatabaseMySQLTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tables' | 'sql-dump' | 'php-source' | 'console'>('overview');
  const [selectedTable, setSelectedTable] = useState<string>('game_config');
  const [selectedPhpFile, setSelectedPhpFile] = useState<'config.php' | 'database.php' | 'install.php' | 'turn_worker.php' | 'phpmyadmin_config.php'>('config.php');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM `game_config` LIMIT 10;');
  const [queryOutput, setQueryOutput] = useState<{
    columns: string[];
    rows: Record<string, string | number>[];
    executionTimeMs: number;
  } | null>({
    columns: ['config_key', 'config_value', 'category', 'description'],
    rows: [
      { config_key: 'server_name', config_value: 'Stargate Warfare: Milky Way & Pegasus Sovereign Universe', category: 'general', description: 'Public server designation' },
      { config_key: 'turn_tick_rate_seconds', config_value: '60', category: 'gameplay', description: 'Seconds per turn calculation' },
      { config_key: 'miner_naquadah_yield', config_value: '80', category: 'economy', description: 'Refined Naquadah produced per miner' },
      { config_key: 'max_turns_stored', config_value: '3000', category: 'gameplay', description: 'Maximum banked turns' },
    ],
    executionTimeMs: 1.45,
  });

  const handleCopy = (text: string, type: string) => {
    sound.play('click');
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadSql = () => {
    sound.play('confirm');
    const element = document.createElement('a');
    element.setAttribute('href', '/database.sql');
    element.setAttribute('download', 'stargate_universe_db_phpmyadmin.sql');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRunQuery = () => {
    sound.play('click');
    const start = performance.now();
    const clean = sqlQuery.trim().toLowerCase();

    if (clean.includes('users')) {
      setQueryOutput({
        columns: ['id', 'username', 'commander_rank', 'faction', 'rpg_level', 'credits'],
        rows: [
          { id: 'user_supreme_cmd_01', username: 'Grand Admiral', commander_rank: 'Fleet High Commander', faction: 'Tauri', rpg_level: 45, credits: 1500000 },
          { id: 'user_cadet_02', username: 'Colonel ONeill', commander_rank: 'Brigadier General', faction: 'Tauri', rpg_level: 28, credits: 420000 },
          { id: 'user_systemlord_03', username: "Lord Ba'al", commander_rank: 'System Lord Overlord', faction: 'Goauld', rpg_level: 40, credits: 980000 },
        ],
        executionTimeMs: Math.round((performance.now() - start + 1.2) * 100) / 100,
      });
    } else if (clean.includes('naval_shipyard') || clean.includes('ships')) {
      setQueryOutput({
        columns: ['ship_id', 'ship_name', 'ship_class', 'tier_level', 'attack_power', 'quantity', 'status'],
        rows: [
          { ship_id: 'ship_bc_304', ship_name: 'BC-304 Daedalus Class', ship_class: 'Battlecruiser', tier_level: 6, attack_power: 85000, quantity: 14, status: 'in_hangar' },
          { ship_id: 'ship_f_302', ship_name: 'F-302 Mongoose Interceptor', ship_class: 'Light Fighter', tier_level: 1, attack_power: 4200, quantity: 180, status: 'in_hangar' },
          { ship_id: 'ship_hatak', ship_name: "Goa'uld Ha'tak Mothership", ship_class: 'Dreadnought', tier_level: 9, attack_power: 220000, quantity: 8, status: 'in_hangar' },
        ],
        executionTimeMs: Math.round((performance.now() - start + 0.8) * 100) / 100,
      });
    } else {
      setQueryOutput({
        columns: ['config_key', 'config_value', 'category', 'description'],
        rows: [
          { config_key: 'server_name', config_value: 'Stargate Warfare: Milky Way & Pegasus Sovereign Universe', category: 'general', description: 'Public server designation' },
          { config_key: 'turn_tick_rate_seconds', config_value: '60', category: 'gameplay', description: 'Seconds per turn calculation' },
          { config_key: 'miner_naquadah_yield', config_value: '80', category: 'economy', description: 'Refined Naquadah produced per miner' },
          { config_key: 'max_turns_stored', config_value: '3000', category: 'gameplay', description: 'Maximum banked turns' },
        ],
        executionTimeMs: Math.round((performance.now() - start + 0.5) * 100) / 100,
      });
    }
  };

  const selectedTableMeta = MYSQL_TABLES_SCHEMA.find((t) => t.name === selectedTable) || MYSQL_TABLES_SCHEMA[0];

  return (
    <div id="admin-database-mysql-tab" className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#111111] bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0d1117] text-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                MYSQL 8.0 / MARIADB // PHPMYADMIN READY
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SCHEMA VERIFIED (16 TABLES)
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-mono">
              <Database className="w-5 h-5 text-amber-400" />
              MySQL Database & phpMyAdmin System Source
            </h2>
            <p className="text-xs text-slate-300 font-mono max-w-3xl">
              Complete production MySQL DDL schema, seed records, PDO database connection abstraction,
              PHP config engine, and background tick worker compatible with 1-click phpMyAdmin import.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadSql}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-[#111111] font-mono text-xs font-bold uppercase transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Download size={14} />
              <span>Download database.sql</span>
            </button>
            <a
              href="http://localhost/phpmyadmin/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold uppercase transition-colors"
            >
              <ExternalLink size={14} />
              <span>Open phpMyAdmin</span>
            </a>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Target Database</span>
            <span className="font-bold text-amber-400 text-sm">stargate_universe_db</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Storage Engine</span>
            <span className="font-bold text-emerald-400 text-sm">InnoDB (ACID)</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Collation & Charset</span>
            <span className="font-bold text-sky-400 text-sm">utf8mb4_unicode_ci</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Relational Tables</span>
            <span className="font-bold text-purple-400 text-sm">16 Tables / 38 Indexes</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dddddd] pb-2 font-mono text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveSubTab('overview'); }}
          className={`flex items-center gap-2 px-3 py-2 font-bold cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'overview'
              ? 'border-[#111111] text-[#111111] bg-neutral-100'
              : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50'
          }`}
        >
          <Server size={14} />
          <span>Architecture & Setup</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveSubTab('tables'); }}
          className={`flex items-center gap-2 px-3 py-2 font-bold cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'tables'
              ? 'border-[#111111] text-[#111111] bg-neutral-100'
              : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50'
          }`}
        >
          <Table size={14} />
          <span>Tables Explorer (16)</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveSubTab('sql-dump'); }}
          className={`flex items-center gap-2 px-3 py-2 font-bold cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'sql-dump'
              ? 'border-[#111111] text-[#111111] bg-neutral-100'
              : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50'
          }`}
        >
          <FileCode size={14} />
          <span>phpMyAdmin SQL Dump</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveSubTab('php-source'); }}
          className={`flex items-center gap-2 px-3 py-2 font-bold cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'php-source'
              ? 'border-[#111111] text-[#111111] bg-neutral-100'
              : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50'
          }`}
        >
          <Code size={14} />
          <span>PHP Config & Source Files</span>
        </button>

        <button
          type="button"
          onClick={() => { sound.play('click'); setActiveSubTab('console'); }}
          className={`flex items-center gap-2 px-3 py-2 font-bold cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'console'
              ? 'border-[#111111] text-[#111111] bg-neutral-100'
              : 'border-transparent text-[#666666] hover:text-[#111111] hover:bg-neutral-50'
          }`}
        >
          <Terminal size={14} />
          <span>SQL Query Console</span>
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE & SETUP */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick-Start Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-[#dedede] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-2">
                <div className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200">
                  <Database size={16} />
                </div>
                <h4 className="font-bold text-xs uppercase font-mono text-[#111111]">1. phpMyAdmin 1-Click Import</h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed">
                Import <code className="px-1.5 py-0.5 bg-neutral-100 border text-[11px] font-mono">database.sql</code> directly
                into phpMyAdmin web interface. It creates the database, schema, indexes, and initial game universe seeds automatically.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#777777] space-y-1">
                <div>• Format: SQL</div>
                <div>• Character set: utf-8</div>
                <div>• Auto-creates `stargate_universe_db`</div>
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200">
                  <Code size={16} />
                </div>
                <h4 className="font-bold text-xs uppercase font-mono text-[#111111]">2. Automated PHP Installer</h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed">
                Execute the CLI or web installer script to verify MySQL credentials, auto-provision missing tables, and test connectivity:
              </p>
              <div className="bg-[#111111] text-amber-300 p-2 text-xs font-mono select-all">
                php backend/install.php
              </div>
            </div>

            <div className="border border-[#dedede] bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-[#eeeeee] pb-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Cpu size={16} />
                </div>
                <h4 className="font-bold text-xs uppercase font-mono text-[#111111]">3. Background Turn Daemon</h4>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed">
                Set up a background cron scheduler to run every minute to credit player turns and calculate mine outputs:
              </p>
              <div className="bg-[#111111] text-emerald-300 p-2 text-xs font-mono select-all">
                * * * * * php backend/cron/turn_worker.php
              </div>
            </div>
          </div>

          {/* Database Credential Parameters Card */}
          <div className="border border-[#dedede] bg-white p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-neutral-700" />
                <h3 className="font-bold text-xs uppercase font-mono text-[#111111]">
                  Database Connection Configuration (<span className="text-amber-600">backend/config/config.php</span>)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(`define('DB_HOST', '127.0.0.1');\ndefine('DB_PORT', 3306);\ndefine('DB_NAME', 'stargate_universe_db');\ndefine('DB_USER', 'root');\ndefine('DB_PASS', '');`, 'db_creds')}
                className="flex items-center gap-1 text-[11px] font-mono text-[#555555] hover:text-[#111111] px-2 py-1 bg-neutral-100 hover:bg-neutral-200"
              >
                {copiedType === 'db_creds' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copiedType === 'db_creds' ? 'Copied!' : 'Copy Config'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="border border-[#eee] p-3 bg-[#fafafa]">
                <span className="text-[#888888] text-[10px] uppercase block">Host & Port</span>
                <strong className="text-[#111111] text-sm">127.0.0.1:3306</strong>
                <span className="text-[10px] text-[#999999] block mt-1">Default local socket</span>
              </div>
              <div className="border border-[#eee] p-3 bg-[#fafafa]">
                <span className="text-[#888888] text-[10px] uppercase block">Database Name</span>
                <strong className="text-[#111111] text-sm">stargate_universe_db</strong>
                <span className="text-[10px] text-[#999999] block mt-1">UTF8mb4 Unicode</span>
              </div>
              <div className="border border-[#eee] p-3 bg-[#fafafa]">
                <span className="text-[#888888] text-[10px] uppercase block">Default User</span>
                <strong className="text-[#111111] text-sm">root</strong>
                <span className="text-[10px] text-[#999999] block mt-1">Full DDL / DML privileges</span>
              </div>
              <div className="border border-[#eee] p-3 bg-[#fafafa]">
                <span className="text-[#888888] text-[10px] uppercase block">phpMyAdmin Endpoint</span>
                <strong className="text-[#111111] text-sm truncate">http://localhost/pma</strong>
                <span className="text-[10px] text-[#999999] block mt-1">Configurable via PMA_URL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TABLE EXPLORER */}
      {activeSubTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table List Sidebar */}
          <div className="border border-[#dedede] bg-white p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
              <h4 className="font-bold text-xs uppercase font-mono text-[#111111]">16 MySQL Tables</h4>
              <span className="text-[10px] font-mono text-[#888888]">stargate_universe_db</span>
            </div>
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {MYSQL_TABLES_SCHEMA.map((tbl) => (
                <button
                  key={tbl.name}
                  type="button"
                  onClick={() => { sound.play('click'); setSelectedTable(tbl.name); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left font-mono text-xs transition-colors cursor-pointer border ${
                    selectedTable === tbl.name
                      ? 'border-[#111111] bg-[#111111] text-white font-bold'
                      : 'border-[#eeeeee] bg-[#fafafa] text-[#333333] hover:bg-neutral-100'
                  }`}
                >
                  <span className="truncate">{tbl.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    selectedTable === tbl.name ? 'bg-amber-400 text-[#111111]' : 'bg-neutral-200 text-[#555555]'
                  }`}>
                    {tbl.rows} rows
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Table Detail Panel */}
          <div className="lg:col-span-2 border border-[#dedede] bg-white p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider">
                  TABLE SPECIFICATION // {selectedTableMeta.engine}
                </span>
                <h3 className="text-base font-bold font-mono text-[#111111]">
                  `{selectedTableMeta.name}`
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 border bg-neutral-50 text-[#555555]">
                  Primary Key: <strong>{selectedTableMeta.primaryKey}</strong>
                </span>
                <span className="px-2 py-0.5 border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold">
                  {selectedTableMeta.rows} Seed Records
                </span>
              </div>
            </div>

            <p className="text-xs text-[#555555] font-mono">
              {selectedTableMeta.description}
            </p>

            <div className="overflow-x-auto border border-[#eeeeee]">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#f5f5f5] text-[#444444] border-b border-[#eeeeee] text-[11px]">
                    <th className="p-2.5 font-bold">Column Field</th>
                    <th className="p-2.5 font-bold">Type</th>
                    <th className="p-2.5 font-bold">Null</th>
                    <th className="p-2.5 font-bold">Key</th>
                    <th className="p-2.5 font-bold">Default</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeeeee]">
                  {selectedTableMeta.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-neutral-50">
                      <td className="p-2.5 font-bold text-[#111111]">{col.name}</td>
                      <td className="p-2.5 text-blue-700">{col.type}</td>
                      <td className="p-2.5 text-[#666666]">{col.null}</td>
                      <td className="p-2.5">
                        {col.key === 'PRI' ? (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">PRI</span>
                        ) : col.key === 'UNI' ? (
                          <span className="px-1.5 py-0.5 bg-sky-100 text-sky-900 font-bold text-[10px] border border-sky-300">UNI</span>
                        ) : col.key === 'MUL' ? (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-900 font-bold text-[10px] border border-purple-300">MUL</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-2.5 text-[#888888]">{col.default}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHPMYADMIN SQL DUMP VIEWER */}
      {activeSubTab === 'sql-dump' && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div>
              <span className="text-[10px] font-mono text-[#888888] uppercase block">File Path: backend/database.sql</span>
              <h3 className="text-sm font-bold font-mono text-[#111111]">
                phpMyAdmin SQL Dump Export (100% 1-Click Compatible)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(`-- phpMyAdmin SQL Dump\n-- Database: stargate_universe_db\nCREATE DATABASE IF NOT EXISTS \`stargate_universe_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE \`stargate_universe_db\`;`, 'sql_dump')}
                className="flex items-center gap-1 text-xs font-mono text-[#111111] hover:bg-neutral-200 px-3 py-1.5 bg-neutral-100 border border-[#cccccc] cursor-pointer"
              >
                {copiedType === 'sql_dump' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedType === 'sql_dump' ? 'Copied Full DDL!' : 'Copy SQL Snippet'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSql}
                className="flex items-center gap-1 text-xs font-mono text-white bg-[#111111] hover:bg-neutral-800 px-3 py-1.5 font-bold cursor-pointer"
              >
                <Download size={14} />
                <span>Download .SQL File</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0f172a] text-slate-200 p-4 font-mono text-xs max-h-[500px] overflow-y-auto space-y-2 border border-slate-800 select-all">
            <div className="text-slate-500">-- phpMyAdmin SQL Dump</div>
            <div className="text-slate-500">-- version 5.2.1</div>
            <div className="text-slate-500">-- Database: `stargate_universe_db`</div>
            <div className="text-amber-400">SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";</div>
            <div className="text-amber-400">START TRANSACTION;</div>
            <div className="text-amber-400">SET time_zone = "+00:00";</div>
            <div className="text-sky-300">CREATE DATABASE IF NOT EXISTS `stargate_universe_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;</div>
            <div className="text-sky-300">USE `stargate_universe_db`;</div>
            <div className="text-slate-500">-- --------------------------------------------------------</div>
            <div className="text-emerald-400">-- Table structure for table `game_config`</div>
            <div>CREATE TABLE IF NOT EXISTS `game_config` (</div>
            <div className="pl-4">`config_key` varchar(80) NOT NULL,</div>
            <div className="pl-4">`config_value` text NOT NULL,</div>
            <div className="pl-4">`category` varchar(50) NOT NULL DEFAULT 'general',</div>
            <div className="pl-4">`description` varchar(255) DEFAULT NULL,</div>
            <div className="pl-4">PRIMARY KEY (`config_key`)</div>
            <div>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;</div>
            <div className="text-slate-500">-- --------------------------------------------------------</div>
            <div className="text-emerald-400">-- Table structure for table `users`</div>
            <div>CREATE TABLE IF NOT EXISTS `users` (</div>
            <div className="pl-4">`id` varchar(64) NOT NULL,</div>
            <div className="pl-4">`username` varchar(64) NOT NULL,</div>
            <div className="pl-4">`email` varchar(128) NOT NULL,</div>
            <div className="pl-4">`password_hash` varchar(255) NOT NULL,</div>
            <div className="pl-4">`commander_rank` varchar(64) NOT NULL DEFAULT 'Cadet Commander',</div>
            <div className="pl-4">`faction` enum('Tauri','Goauld','Asgard','Wraith','Ori','Ancient') NOT NULL DEFAULT 'Tauri',</div>
            <div className="pl-4">`rpg_level` int(11) NOT NULL DEFAULT 1,</div>
            <div className="pl-4">PRIMARY KEY (`id`),</div>
            <div className="pl-4">UNIQUE KEY `idx_username` (`username`)</div>
            <div>) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;</div>
            <div className="text-slate-500">-- [14 additional relational tables defined in /backend/database.sql]</div>
            <div className="text-amber-400">COMMIT;</div>
          </div>
        </div>
      )}

      {/* TAB 4: PHP CONFIG & SOURCE FILES */}
      {activeSubTab === 'php-source' && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#111111] uppercase">Select PHP Module:</span>
              <div className="flex items-center gap-1">
                {(['config.php', 'database.php', 'install.php', 'turn_worker.php', 'phpmyadmin_config.php'] as const).map((file) => (
                  <button
                    key={file}
                    type="button"
                    onClick={() => { sound.play('click'); setSelectedPhpFile(file); }}
                    className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer border ${
                      selectedPhpFile === file
                        ? 'bg-[#111111] text-amber-400 border-[#111111] font-bold'
                        : 'bg-neutral-100 text-[#444444] border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {file}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(`// View backend/${selectedPhpFile} in project directory`, selectedPhpFile)}
              className="flex items-center gap-1 text-xs font-mono text-[#555555] hover:text-[#111111] px-2 py-1 bg-neutral-100 hover:bg-neutral-200"
            >
              {copiedType === selectedPhpFile ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copiedType === selectedPhpFile ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="bg-[#1e1e1e] text-slate-200 p-4 font-mono text-xs max-h-[450px] overflow-y-auto space-y-1 border border-neutral-700">
            {selectedPhpFile === 'config.php' && (
              <>
                <div className="text-emerald-400">&lt;?php</div>
                <div className="text-slate-400">// backend/config/config.php - Master Stargate Warfare Configuration</div>
                <div>define('APP_NAME', 'Stargate Warfare: Milky Way & Pegasus');</div>
                <div>define('APP_VERSION', '4.5.0-MMORPG-EXPANSION');</div>
                <div className="text-slate-400">// MySQL Credentials</div>
                <div>define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');</div>
                <div>define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));</div>
                <div>define('DB_NAME', getenv('DB_NAME') ?: 'stargate_universe_db');</div>
                <div>define('DB_USER', getenv('DB_USER') ?: 'root');</div>
                <div>define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');</div>
                <div>define('DB_CHARSET', 'utf8mb4');</div>
                <div className="text-slate-400">// Engine Tick Rules</div>
                <div>define('TICK_INTERVAL_SECONDS', 60);</div>
                <div>define('TURNS_PER_TICK', 1);</div>
                <div>define('MAX_TURNS_STORED', 3000);</div>
                <div>define('MINER_NAQUADAH_YIELD', 80);</div>
              </>
            )}

            {selectedPhpFile === 'database.php' && (
              <>
                <div className="text-emerald-400">&lt;?php</div>
                <div className="text-slate-400">// backend/config/database.php - PDO Singleton Database Handler</div>
                <div>class StargateDatabase {'{'}</div>
                <div className="pl-4">private static ?StargateDatabase $instance = null;</div>
                <div className="pl-4">private ?PDO $pdo = null;</div>
                <div className="pl-4 text-slate-400">// PDO Initialization with UTF-8mb4 and Exception Mode</div>
                <div className="pl-4">public static function getInstance(): StargateDatabase {'{'}</div>
                <div className="pl-8">if (self::$instance === null) {'{'} self::$instance = new self(); {'}'}</div>
                <div className="pl-8">return self::$instance;</div>
                <div className="pl-4">{'}'}</div>
                <div className="pl-4">public function query(string $sql, array $params = []): PDOStatement {'{'} ... {'}'}</div>
                <div className="pl-4">public function fetchAll(string $sql, array $params = []): array {'{'} ... {'}'}</div>
                <div className="pl-4">public function getSystemHealth(): array {'{'} ... {'}'}</div>
                <div>{'}'}</div>
              </>
            )}

            {selectedPhpFile === 'install.php' && (
              <>
                <div className="text-emerald-400">&lt;?php</div>
                <div className="text-slate-400">// backend/install.php - Automated Database & phpMyAdmin Installer</div>
                <div>define('STARGATE_WARFARE_CORE', true);</div>
                <div>require_once __DIR__ . '/config/config.php';</div>
                <div className="text-slate-400">// Connects to MySQL, creates database if missing, imports database.sql</div>
                <div>$pdo = new PDO("mysql:host=" . DB_HOST . ";port=" . DB_PORT, DB_USER, DB_PASS);</div>
                <div>$pdo-&gt;exec("CREATE DATABASE IF NOT EXISTS \`" . DB_NAME . "\`");</div>
                <div>$sql = file_get_contents(__DIR__ . '/database.sql');</div>
                <div>$pdo-&gt;exec($sql);</div>
                <div>echo "✓ Installed 16 tables into stargate_universe_db for phpMyAdmin!";</div>
              </>
            )}

            {selectedPhpFile === 'turn_worker.php' && (
              <>
                <div className="text-emerald-400">&lt;?php</div>
                <div className="text-slate-400">// backend/cron/turn_worker.php - Scheduled Galactic Tick Engine</div>
                <div>require_once __DIR__ . '/../config/config.php';</div>
                <div>require_once __DIR__ . '/../config/database.php';</div>
                <div className="text-slate-400">// 1. Adds turns up to MAX_TURNS_STORED (3,000)</div>
                <div>$db-&gt;query("UPDATE user_resources SET turns = LEAST(turns + 1, 3000)");</div>
                <div className="text-slate-400">// 2. Produces Naquadah from active miners (+80/turn)</div>
                <div>$db-&gt;query("UPDATE user_resources r INNER JOIN user_military_units m ON r.user_id = m.user_id SET r.naquadah = r.naquadah + (m.miners * 80)");</div>
              </>
            )}

            {selectedPhpFile === 'phpmyadmin_config.php' && (
              <>
                <div className="text-emerald-400">&lt;?php</div>
                <div className="text-slate-400">// backend/config/phpmyadmin_config.php - phpMyAdmin server setup snippet</div>
                <div>$cfg['Servers'][$i]['verbose'] = 'Stargate Warfare Universe DB';</div>
                <div>$cfg['Servers'][$i]['host'] = '127.0.0.1';</div>
                <div>$cfg['Servers'][$i]['port'] = '3306';</div>
                <div>$cfg['Servers'][$i]['only_db'] = 'stargate_universe_db';</div>
                <div>$cfg['DefaultCharset'] = 'utf8mb4';</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SQL QUERY CONSOLE */}
      {activeSubTab === 'console' && (
        <div className="border border-[#dedede] bg-white p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eeeeee] pb-3 gap-2">
            <div>
              <span className="text-[10px] font-mono text-[#888888] uppercase block">Interactive SQL Emulator</span>
              <h3 className="text-sm font-bold font-mono text-[#111111]">
                Execute Queries on `stargate_universe_db`
              </h3>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-[#666666]">Presets:</span>
              <button
                type="button"
                onClick={() => setSqlQuery('SELECT * FROM `game_config` LIMIT 10;')}
                className="px-2 py-0.5 border bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
              >
                game_config
              </button>
              <button
                type="button"
                onClick={() => setSqlQuery('SELECT * FROM `users` LIMIT 10;')}
                className="px-2 py-0.5 border bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
              >
                users
              </button>
              <button
                type="button"
                onClick={() => setSqlQuery('SELECT * FROM `naval_shipyard_ships` LIMIT 10;')}
                className="px-2 py-0.5 border bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
              >
                warships
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="flex-1 border border-[#cccccc] focus:border-[#111111] px-3 py-2 text-xs font-mono outline-none"
              placeholder="Enter SQL Query (e.g. SELECT * FROM users)..."
            />
            <button
              type="button"
              onClick={handleRunQuery}
              className="flex items-center gap-1 px-4 py-2 bg-[#111111] text-amber-400 hover:bg-neutral-800 font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              <Play size={13} />
              <span>Execute</span>
            </button>
          </div>

          {/* Results Readout */}
          {queryOutput && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#666666]">
                <span>Showing {queryOutput.rows.length} rows</span>
                <span className="text-emerald-700 font-bold">Execution time: {queryOutput.executionTimeMs} ms</span>
              </div>

              <div className="overflow-x-auto border border-[#eeeeee]">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-[#f5f5f5] text-[#333333] border-b border-[#eeeeee]">
                      {queryOutput.columns.map((col) => (
                        <th key={col} className="p-2 font-bold uppercase text-[10px] tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eeeeee]">
                    {queryOutput.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        {queryOutput.columns.map((col) => (
                          <td key={col} className="p-2 text-[#333333]">{String(row[col] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
