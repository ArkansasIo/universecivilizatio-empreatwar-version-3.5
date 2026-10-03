-- ============================================================================
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 24, 2026 at 06:50 AM
-- Server version: 10.11.6-MariaDB / MySQL 8.0.36
-- PHP Version: 8.2.18
--
-- Universe Civilization & Stargate Warfare: Galactic MMORPG
-- Database: `stargate_universe_db`
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, phpMyAdmin 4.9+
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stargate_universe_db`
--
CREATE DATABASE IF NOT EXISTS `stargate_universe_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `stargate_universe_db`;

-- --------------------------------------------------------

--
-- Table structure for table `game_config`
--

CREATE TABLE IF NOT EXISTS `game_config` (
  `config_key` varchar(80) NOT NULL,
  `config_value` text NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'general',
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`config_key`),
  KEY `idx_config_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Core global game engine configuration';

--
-- Dumping data for table `game_config`
--

INSERT INTO `game_config` (`config_key`, `config_value`, `category`, `description`) VALUES
('server_name', 'Stargate Warfare: Milky Way & Pegasus Sovereign Universe', 'general', 'Public server designation'),
('game_version', '4.5.0-MMORPG-EXPANSION', 'general', 'Master engine semantic release'),
('turn_tick_rate_seconds', '60', 'gameplay', 'Seconds per game engine turn calculation'),
('turns_per_tick', '1', 'gameplay', 'Number of turns awarded per engine tick'),
('max_turns_stored', '3000', 'gameplay', 'Maximum turn reserve before capping'),
('miner_naquadah_yield', '80', 'economy', 'Refined Naquadah produced per miner per turn'),
('bank_interest_rate_pct', '2.5', 'economy', 'Interest added to banked reserves per galactic cycle'),
('maintenance_mode', '0', 'server', '1 = maintenance lockdown, 0 = public universe active'),
('motd', 'Welcome to Stargate Warfare Sovereign Universe. System Lords are mobilizing fleets in Sector 7.', 'general', 'Message of the day broadcast'),
('registration_open', '1', 'auth', 'Allow new commander enlistments'),
('initial_naquadah', '100000', 'starting_stats', 'Starting liquid Naquadah for recruits'),
('initial_crystal', '50000', 'starting_stats', 'Starting Crystal reserves'),
('initial_trinium', '25000', 'starting_stats', 'Starting Trinium alloy stock'),
('initial_turns', '150', 'starting_stats', 'Starting action turns pool')
ON DUPLICATE KEY UPDATE `config_value`=VALUES(`config_value`);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(64) NOT NULL,
  `username` varchar(64) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `commander_rank` varchar(64) NOT NULL DEFAULT 'Cadet Commander',
  `faction` enum('Tauri','Goauld','Asgard','Wraith','Ori','Ancient') NOT NULL DEFAULT 'Tauri',
  `rpg_level` int(11) NOT NULL DEFAULT 1,
  `rpg_xp` bigint(20) NOT NULL DEFAULT 0,
  `credits` bigint(20) NOT NULL DEFAULT 10000,
  `avatar_url` varchar(255) DEFAULT '/avatars/cadet.png',
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_banned` tinyint(1) NOT NULL DEFAULT 0,
  `ban_reason` varchar(255) DEFAULT NULL,
  `active_theme` varchar(40) NOT NULL DEFAULT 'theme_white_default',
  `last_ip` varchar(45) DEFAULT NULL,
  `last_active_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `idx_faction` (`faction`),
  KEY `idx_level` (`rpg_level`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Commander identity and player credentials';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `commander_rank`, `faction`, `rpg_level`, `rpg_xp`, `credits`, `is_admin`, `is_banned`, `active_theme`, `created_at`) VALUES
('user_supreme_cmd_01', 'Grand Admiral', 'admiral@stargatecommand.mil', '$2y$12$e8Y6YtqPq6U92gY9jH4.6eXwL9H7c4gD8A2uP5fE3vJ7aQ1wR9mOe', 'Fleet High Commander', 'Tauri', 45, 245000, 1500000, 1, 0, 'theme_white_default', '2026-01-01 00:00:00'),
('user_cadet_02', 'Colonel ONeill', 'oneill@stargatecommand.mil', '$2y$12$a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6a', 'Brigadier General', 'Tauri', 28, 112000, 420000, 0, 0, 'theme_white_default', '2026-02-15 12:30:00'),
('user_systemlord_03', 'Lord Ba''al', 'baal@systemlords.net', '$2y$12$z9Y8x7W6v5U4t3S2r1Q0p9O8n7M6l5K4j3I2h1G0f9E8d7C6b5A4z', 'System Lord Overlord', 'Goauld', 40, 198000, 980000, 0, 0, 'theme_imperial_obsidian', '2026-03-01 08:15:00')
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`);

-- --------------------------------------------------------

--
-- Table structure for table `user_resources`
--

CREATE TABLE IF NOT EXISTS `user_resources` (
  `user_id` varchar(64) NOT NULL,
  `turns` int(11) NOT NULL DEFAULT 150,
  `naquadah` bigint(20) NOT NULL DEFAULT 100000,
  `crystal` bigint(20) NOT NULL DEFAULT 50000,
  `trinium` bigint(20) NOT NULL DEFAULT 25000,
  `neutronium` bigint(20) NOT NULL DEFAULT 10000,
  `dark_matter` bigint(20) NOT NULL DEFAULT 5000,
  `antimatter` bigint(20) NOT NULL DEFAULT 1000,
  `energy` bigint(20) NOT NULL DEFAULT 150000,
  `banked_naquadah` bigint(20) NOT NULL DEFAULT 0,
  `untrained_units` bigint(20) NOT NULL DEFAULT 500,
  `last_turn_tick` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_resources_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Planetary stockpiles, energy reserves and treasury';

--
-- Dumping data for table `user_resources`
--

INSERT INTO `user_resources` (`user_id`, `turns`, `naquadah`, `crystal`, `trinium`, `neutronium`, `dark_matter`, `antimatter`, `energy`, `banked_naquadah`, `untrained_units`) VALUES
('user_supreme_cmd_01', 480, 4850000, 2400000, 1600000, 750000, 320000, 85000, 950000, 2500000, 12500),
('user_cadet_02', 220, 650000, 310000, 180000, 45000, 12000, 2500, 280000, 350000, 2200),
('user_systemlord_03', 390, 3800000, 1900000, 1100000, 520000, 210000, 48000, 820000, 1800000, 9400)
ON DUPLICATE KEY UPDATE `turns`=VALUES(`turns`);

-- --------------------------------------------------------

--
-- Table structure for table `user_military_units`
--

CREATE TABLE IF NOT EXISTS `user_military_units` (
  `user_id` varchar(64) NOT NULL,
  `attack_troops` bigint(20) NOT NULL DEFAULT 0,
  `defense_troops` bigint(20) NOT NULL DEFAULT 0,
  `miners` bigint(20) NOT NULL DEFAULT 0,
  `spies` bigint(20) NOT NULL DEFAULT 0,
  `counter_intel` bigint(20) NOT NULL DEFAULT 0,
  `super_units` bigint(20) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_military_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ground forces, espionage agents, and mining workers';

--
-- Dumping data for table `user_military_units`
--

INSERT INTO `user_military_units` (`user_id`, `attack_troops`, `defense_troops`, `miners`, `spies`, `counter_intel`, `super_units`) VALUES
('user_supreme_cmd_01', 8500, 12400, 4500, 350, 420, 45),
('user_cadet_02', 1200, 2400, 850, 45, 60, 5),
('user_systemlord_03', 14200, 9800, 6200, 280, 310, 32)
ON DUPLICATE KEY UPDATE `attack_troops`=VALUES(`attack_troops`);

-- --------------------------------------------------------

--
-- Table structure for table `naval_shipyard_ships`
--

CREATE TABLE IF NOT EXISTS `naval_shipyard_ships` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `ship_id` varchar(64) NOT NULL,
  `ship_name` varchar(120) NOT NULL,
  `ship_class` varchar(80) NOT NULL,
  `tier_level` int(11) NOT NULL DEFAULT 1,
  `hull_hp` bigint(20) NOT NULL DEFAULT 1000,
  `shield_hp` bigint(20) NOT NULL DEFAULT 500,
  `armor_hp` bigint(20) NOT NULL DEFAULT 300,
  `attack_power` bigint(20) NOT NULL DEFAULT 200,
  `powergrid_mw` int(11) NOT NULL DEFAULT 50,
  `cpu_tflops` int(11) NOT NULL DEFAULT 30,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `status` enum('idle','in_hangar','on_mission','damaged','repairing') NOT NULL DEFAULT 'in_hangar',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_shipyard_user` (`user_id`),
  KEY `idx_ship_tier` (`tier_level`),
  CONSTRAINT `fk_shipyard_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Constructed armada warships and capital vessels';

--
-- Dumping data for table `naval_shipyard_ships`
--

INSERT INTO `naval_shipyard_ships` (`user_id`, `ship_id`, `ship_name`, `ship_class`, `tier_level`, `hull_hp`, `shield_hp`, `armor_hp`, `attack_power`, `powergrid_mw`, `cpu_tflops`, `quantity`, `status`) VALUES
('user_supreme_cmd_01', 'ship_f_302', 'F-302 Mongoose Interceptor', 'Light Fighter', 1, 15000, 8000, 5000, 4200, 150, 110, 180, 'in_hangar'),
('user_supreme_cmd_01', 'ship_bc_304', 'BC-304 Daedalus Class', 'Battlecruiser', 6, 450000, 350000, 200000, 85000, 1200, 850, 14, 'in_hangar'),
('user_supreme_cmd_01', 'ship_odyssey', 'Odyssey (Asgard Beams Upgraded)', 'Command Battlecruiser', 8, 950000, 800000, 420000, 195000, 2400, 1600, 2, 'in_hangar'),
('user_systemlord_03', 'ship_hatak', 'Goa''uld Ha''tak Mothership', 'Dreadnought', 9, 1200000, 950000, 600000, 220000, 3500, 2400, 8, 'in_hangar'),
('user_systemlord_03', 'ship_glider', 'Death Glider Squadron', 'Light Fighter', 1, 12000, 6000, 4000, 3800, 120, 90, 240, 'in_hangar');

-- --------------------------------------------------------

--
-- Table structure for table `stargate_relics_inventory`
--

CREATE TABLE IF NOT EXISTS `stargate_relics_inventory` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `relic_id` varchar(64) NOT NULL,
  `relic_name` varchar(120) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `rarity` enum('Common','Uncommon','Rare','Epic','Legendary','Lantean Ancient','Ascended Divine') NOT NULL DEFAULT 'Rare',
  `socket_slot` enum('energy','science','defense','offense','wormhole') NOT NULL DEFAULT 'energy',
  `is_socketed` tinyint(1) NOT NULL DEFAULT 0,
  `power_multiplier` decimal(4,2) NOT NULL DEFAULT 1.25,
  `active_buff_name` varchar(120) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `acquired_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_relic_user` (`user_id`),
  KEY `idx_relic_rarity` (`rarity`),
  CONSTRAINT `fk_relics_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ascended relics, Zero-Point Modules, and Ancient technology';

--
-- Dumping data for table `stargate_relics_inventory`
--

INSERT INTO `stargate_relics_inventory` (`user_id`, `relic_id`, `relic_name`, `origin`, `rarity`, `socket_slot`, `is_socketed`, `power_multiplier`, `active_buff_name`, `quantity`) VALUES
('user_supreme_cmd_01', 'relic_zpm_potentia', 'Zero-Point Module (Potentia)', 'SG-1 / Atlantis', 'Ascended Divine', 'energy', 1, 3.50, 'ZPM Subspace Zero-Point Surge', 1),
('user_supreme_cmd_01', 'relic_asgard_core', 'Asgard Computer Core', 'Stargate SG-1', 'Lantean Ancient', 'science', 1, 2.80, 'Temporal Dilation & Plasma Beam Tech', 1),
('user_supreme_cmd_01', 'relic_dakara_wave', 'Dakara Molecular Wave Array', 'Stargate SG-1', 'Ascended Divine', 'defense', 0, 4.00, 'Replicator Molecular Disintegration', 1),
('user_systemlord_03', 'relic_eye_of_ra', 'Eye of Ra Crystal Core', 'Goa''uld Empire', 'Legendary', 'offense', 1, 2.20, 'Solar Flare Superweapon Channel', 1);

-- --------------------------------------------------------

--
-- Table structure for table `colonies_planets`
--

CREATE TABLE IF NOT EXISTS `colonies_planets` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `planet_name` varchar(80) NOT NULL,
  `galaxy` int(11) NOT NULL DEFAULT 1,
  `solar_system` int(11) NOT NULL DEFAULT 1,
  `planet_slot` int(11) NOT NULL DEFAULT 1,
  `planet_type` enum('terran','desert','oceanic','volcanic','arctic','gas_giant','crystalline') NOT NULL DEFAULT 'terran',
  `fields_used` int(11) NOT NULL DEFAULT 15,
  `fields_max` int(11) NOT NULL DEFAULT 185,
  `metal_mine_lvl` int(11) NOT NULL DEFAULT 1,
  `crystal_mine_lvl` int(11) NOT NULL DEFAULT 1,
  `deuterium_synth_lvl` int(11) NOT NULL DEFAULT 1,
  `solar_plant_lvl` int(11) NOT NULL DEFAULT 1,
  `fusion_reactor_lvl` int(11) NOT NULL DEFAULT 0,
  `robot_factory_lvl` int(11) NOT NULL DEFAULT 1,
  `shipyard_lvl` int(11) NOT NULL DEFAULT 1,
  `research_lab_lvl` int(11) NOT NULL DEFAULT 1,
  `nanite_factory_lvl` int(11) NOT NULL DEFAULT 0,
  `terraformer_lvl` int(11) NOT NULL DEFAULT 0,
  `shield_dome_lvl` int(11) NOT NULL DEFAULT 1,
  `population` bigint(20) NOT NULL DEFAULT 250000,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_galaxy_coords` (`galaxy`,`solar_system`,`planet_slot`),
  KEY `idx_colony_user` (`user_id`),
  CONSTRAINT `fk_colonies_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Settled planetary worlds, star bases, and mining outposts';

--
-- Dumping data for table `colonies_planets`
--

INSERT INTO `colonies_planets` (`user_id`, `planet_name`, `galaxy`, `solar_system`, `planet_slot`, `planet_type`, `fields_used`, `fields_max`, `metal_mine_lvl`, `crystal_mine_lvl`, `deuterium_synth_lvl`, `solar_plant_lvl`, `robot_factory_lvl`, `shipyard_lvl`, `research_lab_lvl`, `population`) VALUES
('user_supreme_cmd_01', 'Terra Prime (Earth)', 1, 101, 3, 'terran', 74, 210, 28, 24, 22, 26, 12, 11, 14, 12500000),
('user_supreme_cmd_01', 'Alpha Site (P3X-984)', 1, 104, 7, 'desert', 42, 175, 18, 16, 14, 18, 8, 7, 9, 850000),
('user_systemlord_03', 'Delmak Outpost', 2, 45, 4, 'volcanic', 68, 195, 26, 22, 19, 24, 10, 12, 11, 4500000);

-- --------------------------------------------------------

--
-- Table structure for table `defense_structures`
--

CREATE TABLE IF NOT EXISTS `defense_structures` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `planet_id` bigint(20) UNSIGNED NOT NULL,
  `rocket_launchers` int(11) NOT NULL DEFAULT 0,
  `light_lasers` int(11) NOT NULL DEFAULT 0,
  `heavy_lasers` int(11) NOT NULL DEFAULT 0,
  `gauss_cannons` int(11) NOT NULL DEFAULT 0,
  `ion_turrets` int(11) NOT NULL DEFAULT 0,
  `plasma_turrets` int(11) NOT NULL DEFAULT 0,
  `small_shield_dome` tinyint(1) NOT NULL DEFAULT 0,
  `large_shield_dome` tinyint(1) NOT NULL DEFAULT 0,
  `anti_ballistic_missiles` int(11) NOT NULL DEFAULT 0,
  `interplanetary_missiles` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_defense_user` (`user_id`),
  KEY `idx_defense_planet` (`planet_id`),
  CONSTRAINT `fk_defense_planet` FOREIGN KEY (`planet_id`) REFERENCES `colonies_planets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_defense_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ground-to-space defensive emplacements and shield domes';

--
-- Dumping data for table `defense_structures`
--

INSERT INTO `defense_structures` (`user_id`, `planet_id`, `rocket_launchers`, `light_lasers`, `heavy_lasers`, `gauss_cannons`, `ion_turrets`, `plasma_turrets`, `small_shield_dome`, `large_shield_dome`, `anti_ballistic_missiles`) VALUES
('user_supreme_cmd_01', 1, 2500, 1200, 650, 180, 95, 45, 1, 1, 40),
('user_supreme_cmd_01', 2, 450, 220, 90, 25, 12, 4, 1, 0, 15),
('user_systemlord_03', 3, 3400, 1800, 920, 210, 110, 60, 1, 1, 50);

-- --------------------------------------------------------

--
-- Table structure for table `research_technology`
--

CREATE TABLE IF NOT EXISTS `research_technology` (
  `user_id` varchar(64) NOT NULL,
  `espionage_tech` int(11) NOT NULL DEFAULT 0,
  `computer_tech` int(11) NOT NULL DEFAULT 0,
  `weapons_tech` int(11) NOT NULL DEFAULT 0,
  `shielding_tech` int(11) NOT NULL DEFAULT 0,
  `armor_tech` int(11) NOT NULL DEFAULT 0,
  `energy_tech` int(11) NOT NULL DEFAULT 0,
  `hyperspace_tech` int(11) NOT NULL DEFAULT 0,
  `combustion_drive` int(11) NOT NULL DEFAULT 0,
  `impulse_drive` int(11) NOT NULL DEFAULT 0,
  `hyperspace_drive` int(11) NOT NULL DEFAULT 0,
  `laser_tech` int(11) NOT NULL DEFAULT 0,
  `ion_tech` int(11) NOT NULL DEFAULT 0,
  `plasma_tech` int(11) NOT NULL DEFAULT 0,
  `intergalactic_network` int(11) NOT NULL DEFAULT 0,
  `astrophysics` int(11) NOT NULL DEFAULT 0,
  `graviton_tech` int(11) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_research_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Galactic empire technological research tree levels';

--
-- Dumping data for table `research_technology`
--

INSERT INTO `research_technology` (`user_id`, `espionage_tech`, `computer_tech`, `weapons_tech`, `shielding_tech`, `armor_tech`, `energy_tech`, `hyperspace_tech`, `combustion_drive`, `impulse_drive`, `hyperspace_drive`, `laser_tech`, `ion_tech`, `plasma_tech`, `astrophysics`) VALUES
('user_supreme_cmd_01', 14, 16, 17, 16, 18, 15, 12, 14, 12, 10, 15, 12, 11, 9),
('user_cadet_02', 6, 8, 9, 8, 9, 7, 5, 8, 6, 4, 8, 5, 3, 4),
('user_systemlord_03', 15, 14, 18, 17, 16, 16, 11, 15, 11, 9, 14, 11, 10, 8)
ON DUPLICATE KEY UPDATE `espionage_tech`=VALUES(`espionage_tech`);

-- --------------------------------------------------------

--
-- Table structure for table `alliances`
--

CREATE TABLE IF NOT EXISTS `alliances` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tag` varchar(12) NOT NULL,
  `name` varchar(80) NOT NULL,
  `founder_id` varchar(64) NOT NULL,
  `description` text DEFAULT NULL,
  `announcement` text DEFAULT NULL,
  `open_recruitment` tinyint(1) NOT NULL DEFAULT 1,
  `member_count` int(11) NOT NULL DEFAULT 1,
  `treasury_naquadah` bigint(20) NOT NULL DEFAULT 500000,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_alliance_tag` (`tag`),
  UNIQUE KEY `idx_alliance_name` (`name`),
  KEY `idx_alliance_founder` (`founder_id`),
  CONSTRAINT `fk_alliance_founder` FOREIGN KEY (`founder_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Galactic federations, Goauld coalitions, and alliances';

--
-- Dumping data for table `alliances`
--

INSERT INTO `alliances` (`id`, `tag`, `name`, `founder_id`, `description`, `announcement`, `member_count`, `treasury_naquadah`) VALUES
(1, 'SGC', 'Stargate Command Defense Coalition', 'user_supreme_cmd_01', 'United human & free Jaffa coalition protecting the Milky Way galaxy from subjugation.', 'Priority 1: Guard Sector 12 Iris wormholes against System Lord incursions.', 2, 8500000),
(2, 'SYSLORD', 'Council of Goa''uld System Lords', 'user_systemlord_03', 'The true divine rulers of the stars. Unworthy beings shall bow before our motherships.', 'Tribute of Naquadah is due at the start of each galactic cycle.', 1, 14000000);

-- --------------------------------------------------------

--
-- Table structure for table `alliance_members`
--

CREATE TABLE IF NOT EXISTS `alliance_members` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `alliance_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `rank_title` varchar(60) NOT NULL DEFAULT 'Cadet Legionnaire',
  `can_invite` tinyint(1) NOT NULL DEFAULT 0,
  `can_kick` tinyint(1) NOT NULL DEFAULT 0,
  `can_diplomacy` tinyint(1) NOT NULL DEFAULT 0,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_alliance_user` (`user_id`),
  KEY `idx_member_alliance` (`alliance_id`),
  CONSTRAINT `fk_member_alliance` FOREIGN KEY (`alliance_id`) REFERENCES `alliances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_member_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Player membership and ranks in galactic alliances';

--
-- Dumping data for table `alliance_members`
--

INSERT INTO `alliance_members` (`alliance_id`, `user_id`, `rank_title`, `can_invite`, `can_kick`, `can_diplomacy`) VALUES
(1, 'user_supreme_cmd_01', 'Supreme Supreme Allied Commander', 1, 1, 1),
(1, 'user_cadet_02', 'Senior Division Commander', 1, 0, 1),
(2, 'user_systemlord_03', 'High System Lord Godhead', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `combat_battle_logs`
--

CREATE TABLE IF NOT EXISTS `combat_battle_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `attacker_id` varchar(64) NOT NULL,
  `defender_id` varchar(64) NOT NULL,
  `winner_id` varchar(64) DEFAULT NULL,
  `attacker_losses_value` bigint(20) NOT NULL DEFAULT 0,
  `defender_losses_value` bigint(20) NOT NULL DEFAULT 0,
  `debris_naquadah` bigint(20) NOT NULL DEFAULT 0,
  `debris_crystal` bigint(20) NOT NULL DEFAULT 0,
  `naquadah_plundered` bigint(20) NOT NULL DEFAULT 0,
  `battle_rounds` int(11) NOT NULL DEFAULT 3,
  `battle_log_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`battle_log_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_battle_attacker` (`attacker_id`),
  KEY `idx_battle_defender` (`defender_id`),
  KEY `idx_battle_created` (`created_at`),
  CONSTRAINT `fk_battle_attacker` FOREIGN KEY (`attacker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_battle_defender` FOREIGN KEY (`defender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Naval and planetary warfare battle reports';

--
-- Dumping data for table `combat_battle_logs`
--

INSERT INTO `combat_battle_logs` (`attacker_id`, `defender_id`, `winner_id`, `attacker_losses_value`, `defender_losses_value`, `debris_naquadah`, `debris_crystal`, `naquadah_plundered`, `battle_rounds`, `battle_log_json`) VALUES
('user_supreme_cmd_01', 'user_systemlord_03', 'user_supreme_cmd_01', 45000, 320000, 180000, 95000, 240000, 4, '{\"rounds\":4,\"attacker_survivors\":165,\"defender_survivors\":18,\"report\":\"Tau\\'ri Battlecruisers utilized Asgard beam cannons to breach Ha\\'tak shields in Round 3.\"}');

-- --------------------------------------------------------

--
-- Table structure for table `espionage_missions`
--

CREATE TABLE IF NOT EXISTS `espionage_missions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `spy_user_id` varchar(64) NOT NULL,
  `target_user_id` varchar(64) NOT NULL,
  `mission_type` enum('recon','sabotage_fleet','steal_naquadah','iris_infiltrate') NOT NULL DEFAULT 'recon',
  `spies_sent` int(11) NOT NULL DEFAULT 5,
  `success_rate` decimal(5,2) NOT NULL DEFAULT 75.00,
  `was_detected` tinyint(1) NOT NULL DEFAULT 0,
  `spies_lost` int(11) NOT NULL DEFAULT 0,
  `intel_data_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`intel_data_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_spy_user` (`spy_user_id`),
  KEY `idx_spy_target` (`target_user_id`),
  CONSTRAINT `fk_spy_target` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_spy_user` FOREIGN KEY (`spy_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Covert ops, phase-cloak infiltration, and counter-intel';

--
-- Dumping data for table `espionage_missions`
--

INSERT INTO `espionage_missions` (`spy_user_id`, `target_user_id`, `mission_type`, `spies_sent`, `success_rate`, `was_detected`, `spies_lost`, `intel_data_json`) VALUES
('user_supreme_cmd_01', 'user_systemlord_03', 'recon', 10, 88.50, 0, 0, '{\"naquadah\":3800000,\"crystal\":1900000,\"ships\":{\"hatak\":8,\"gliders\":240},\"defense\":{\"rocket_launchers\":3400}}');

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_orders`
--

CREATE TABLE IF NOT EXISTS `marketplace_orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `seller_id` varchar(64) NOT NULL,
  `resource_type` enum('naquadah','crystal','trinium','neutronium','dark_matter','antimatter') NOT NULL,
  `amount` bigint(20) NOT NULL,
  `price_per_unit` decimal(10,4) NOT NULL,
  `currency` varchar(20) NOT NULL DEFAULT 'credits',
  `status` enum('open','completed','cancelled','expired') NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_market_seller` (`seller_id`),
  KEY `idx_market_resource` (`resource_type`),
  KEY `idx_market_status` (`status`),
  CONSTRAINT `fk_market_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Intergalactic trade bazaar and raw ore exchange';

--
-- Dumping data for table `marketplace_orders`
--

INSERT INTO `marketplace_orders` (`seller_id`, `resource_type`, `amount`, `price_per_unit`, `currency`, `status`) VALUES
('user_supreme_cmd_01', 'trinium', 50000, 2.5000, 'credits', 'open'),
('user_systemlord_03', 'crystal', 100000, 1.8000, 'credits', 'open');

-- --------------------------------------------------------

--
-- Table structure for table `cron_job_queue`
--

CREATE TABLE IF NOT EXISTS `cron_job_queue` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `job_name` varchar(80) NOT NULL,
  `cron_expression` varchar(50) NOT NULL DEFAULT '* * * * *',
  `last_run_at` timestamp NULL DEFAULT NULL,
  `next_run_at` timestamp NULL DEFAULT NULL,
  `status` enum('idle','running','failed','disabled') NOT NULL DEFAULT 'idle',
  `execution_time_ms` decimal(8,2) NOT NULL DEFAULT 0.00,
  `log_output` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cron_name` (`job_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Background scheduler tasks (turn ticks, highscores, mine production)';

--
-- Dumping data for table `cron_job_queue`
--

INSERT INTO `cron_job_queue` (`job_name`, `cron_expression`, `last_run_at`, `next_run_at`, `status`, `execution_time_ms`, `log_output`) VALUES
('turn_tick_generator', '*/1 * * * *', '2026-09-24 06:45:00', '2026-09-24 06:46:00', 'idle', 14.20, 'Processed turns for 3 active commanders.'),
('mine_production_calculator', '*/1 * * * *', '2026-09-24 06:45:00', '2026-09-24 06:46:00', 'idle', 22.80, 'Calculated resource output across 3 colonies.'),
('rankings_recalculator', '*/10 * * * *', '2026-09-24 06:40:00', '2026-09-24 06:50:00', 'idle', 45.10, 'Highscores and fleet scores refreshed.'),
('espionage_cleanup_daemon', '0 * * * *', '2026-09-24 06:00:00', '2026-09-24 07:00:00', 'idle', 8.50, 'Expired spy reports archived.');

-- --------------------------------------------------------

--
-- Table structure for table `admin_audit_logs`
--

CREATE TABLE IF NOT EXISTS `admin_audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user_id` varchar(64) NOT NULL,
  `action_code` varchar(60) NOT NULL,
  `target_id` varchar(64) DEFAULT NULL,
  `details` text NOT NULL,
  `ip_address` varchar(45) NOT NULL DEFAULT '127.0.0.1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_audit_admin` (`admin_user_id`),
  KEY `idx_audit_action` (`action_code`),
  KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Security audit trail for administrator decrees and actions';

--
-- Dumping data for table `admin_audit_logs`
--

INSERT INTO `admin_audit_logs` (`admin_user_id`, `action_code`, `target_id`, `details`, `ip_address`) VALUES
('user_supreme_cmd_01', 'SYSTEM_INIT', 'GLOBAL', 'Database initialized and calibrated for phpMyAdmin.', '127.0.0.1'),
('user_supreme_cmd_01', 'CONFIG_UPDATE', 'game_config', 'Turn tick rate verified at 60 seconds.', '127.0.0.1');

-- --------------------------------------------------------

--
-- Final commit & restore environment
--
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
