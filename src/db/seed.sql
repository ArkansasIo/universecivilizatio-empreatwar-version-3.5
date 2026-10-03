-- ============================================================================
-- UNIVERSE CIVILIZATION & STARGATE WARFARE: INITIAL DATABASE SEED SCRIPT
-- ============================================================================

-- SEED USER PROFILE
INSERT INTO users_profile (id, username, commander_rank, rpg_level, rpg_xp, active_theme)
VALUES ('user_supreme_cmd_01', 'Grand Admiral', 'Fleet High Commander', 42, 185400, 'theme_white_default')
ON CONFLICT (id) DO NOTHING;

-- SEED IMPERIAL RESOURCES
INSERT INTO imperial_resources (user_id, turns, naquadah, crystal, trinium, neutronium, dark_matter, antimatter, energy, banked_naquadah)
VALUES ('user_supreme_cmd_01', 450, 2500000, 1200000, 800000, 350000, 150000, 50000, 450000, 1000000)
ON CONFLICT (user_id) DO NOTHING;

-- SEED WARSHIPS
INSERT INTO naval_shipyard (ship_id, user_id, ship_name, ship_class, tier_level, hull_hp, shield_hp, armor_hp, attack_power, powergrid_mw, cpu_tflops, quantity_owned)
VALUES 
('ship_bc_304', 'user_supreme_cmd_01', 'BC-304 Daedalus Class', 'Battlecruiser', 6, 450000, 350000, 200000, 85000, 1200, 850, 12),
('ship_f_302', 'user_supreme_cmd_01', 'F-302 Mongoose Interceptor', 'Light Fighter', 1, 15000, 8000, 5000, 4200, 150, 110, 150),
('ship_hatak', 'user_supreme_cmd_01', 'Goa''uld Ha''tak Mothership', 'Dreadnought', 9, 1200000, 950000, 600000, 220000, 3500, 2400, 5)
ON CONFLICT (ship_id) DO NOTHING;

-- SEED STARGATE RELICS
INSERT INTO stargate_relics_vault (relic_id, user_id, relic_name, origin_show_movie, rarity, socket_slot, is_socketed, quantity_owned, active_power_name)
VALUES
('relic_zpm_potentia', 'user_supreme_cmd_01', 'Zero-Point Module (Potentia)', 'SG-1 / Atlantis', 'Ascended Divine', 'energy', TRUE, 1, 'ZPM Subspace Surge'),
('relic_asgard_core', 'user_supreme_cmd_01', 'Asgard Computer Core', 'Stargate SG-1', 'Lantean Ancient', 'science', TRUE, 1, 'Asgard Temporal Dilation'),
('relic_dakara_wave', 'user_supreme_cmd_01', 'Dakara Molecular Wave Array', 'Stargate SG-1', 'Ascended Divine', 'defense', FALSE, 1, 'Dakara Disintegration Wave')
ON CONFLICT (relic_id) DO NOTHING;

-- SEED SYSTEM CONFIGS & THEMES
INSERT INTO system_configs (config_key, config_value)
VALUES
('default_theme', 'theme_white_default'),
('available_themes', 'theme_white_default,theme_navy_dark,theme_imperial_obsidian'),
('db_schema_version', '3.8.5')
ON CONFLICT (config_key) DO NOTHING;
