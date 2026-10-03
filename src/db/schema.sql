-- ============================================================================
-- UNIVERSE CIVILIZATION & STARGATE WARFARE: MASTER SQL DATABASE SCHEMA DDL
-- Database Dialect: PostgreSQL / SQLite Compatible
-- ============================================================================

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS users_profile (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    commander_rank VARCHAR(50) DEFAULT 'Cadet Commander',
    rpg_level INT DEFAULT 1,
    rpg_xp BIGINT DEFAULT 0,
    active_theme VARCHAR(50) DEFAULT 'theme_white_default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. IMPERIAL RESOURCES & BANKING TABLE
CREATE TABLE IF NOT EXISTS imperial_resources (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users_profile(id) ON DELETE CASCADE,
    turns INT DEFAULT 100,
    naquadah BIGINT DEFAULT 100000,
    crystal BIGINT DEFAULT 50000,
    trinium BIGINT DEFAULT 25000,
    neutronium BIGINT DEFAULT 10000,
    dark_matter BIGINT DEFAULT 5000,
    antimatter BIGINT DEFAULT 1000,
    energy BIGINT DEFAULT 150000,
    banked_naquadah BIGINT DEFAULT 0,
    last_turn_tick TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. NAVAL SHIPYARD & WARSHIPS TABLE
CREATE TABLE IF NOT EXISTS naval_shipyard (
    ship_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users_profile(id) ON DELETE CASCADE,
    ship_name VARCHAR(120) NOT NULL,
    ship_class VARCHAR(80) NOT NULL,
    tier_level INT NOT NULL CHECK (tier_level BETWEEN 1 AND 13),
    hull_hp BIGINT NOT NULL,
    shield_hp BIGINT NOT NULL,
    armor_hp BIGINT NOT NULL,
    attack_power BIGINT NOT NULL,
    powergrid_mw INT NOT NULL,
    cpu_tflops INT NOT NULL,
    quantity_owned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. STARGATE RELICS & ARTIFACTS VAULT TABLE
CREATE TABLE IF NOT EXISTS stargate_relics_vault (
    relic_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users_profile(id) ON DELETE CASCADE,
    relic_name VARCHAR(120) NOT NULL,
    origin_show_movie VARCHAR(100) NOT NULL,
    rarity VARCHAR(40) NOT NULL,
    socket_slot VARCHAR(50),
    is_socketed BOOLEAN DEFAULT FALSE,
    quantity_owned INT DEFAULT 0,
    active_power_name VARCHAR(100)
);

-- 5. COLONIES & MINES TABLE
CREATE TABLE IF NOT EXISTS colonies_mines (
    colony_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users_profile(id) ON DELETE CASCADE,
    planet_name VARCHAR(100) NOT NULL,
    planet_type VARCHAR(50) NOT NULL,
    metal_mine_level INT DEFAULT 1,
    crystal_mine_level INT DEFAULT 1,
    deuterium_synthesizer_level INT DEFAULT 1,
    solar_plant_level INT DEFAULT 1,
    population_count BIGINT DEFAULT 100000,
    happiness_rating INT DEFAULT 85 CHECK (happiness_rating BETWEEN 0 AND 100)
);

-- 6. SYSTEM CONFIGS & THEMES TABLE
CREATE TABLE IF NOT EXISTS system_configs (
    config_key VARCHAR(80) PRIMARY KEY,
    config_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_shipyard_user ON naval_shipyard(user_id);
CREATE INDEX IF NOT EXISTS idx_relics_user ON stargate_relics_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_colonies_user ON colonies_mines(user_id);
