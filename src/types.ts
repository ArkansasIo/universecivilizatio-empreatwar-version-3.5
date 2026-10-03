export type RaceId = 'asgard' | 'goauld' | 'replicator' | 'tauri' | 'tollan';

export interface Race {
  id: RaceId;
  name: string;
  bonusLabel: string;
  bonusPercent: number;
  bankName: string;
  attackModifier: number;
  defenseModifier: number;
  incomeModifier: number;
  covertModifier: number;
  description: string;
}

export interface GovernmentEdict {
  id: string;
  name: string;
  description: string;
  effect: string;
  cost: string;
  durationHours?: number;
}

export interface Government {
  id: string;
  name: string;
  description: string;
  economyModifier: number;
  researchModifier: number;
  militaryModifier: number;
  defenseModifier: number;
  colonyModifier: number;
  fleetModifier: number;
  icon?: string;
  tagline?: string;
  ideology?: string;
  strengths?: string[];
  weaknesses?: string[];
  specialPerk?: string;
  uniqueShipClass?: string;
  colorTheme?: string;
  reputationModifier?: number;
  gloryModifier?: number;
  subspaceSpeedModifier?: number;
  metalMineModifier?: number;
  crystalMineModifier?: number;
  deutMineModifier?: number;
  edicts?: GovernmentEdict[];
}

export type DefconLevel = 0 | 1 | 2 | 3 | 4;

export type TurnCapMode = 'standard_100' | 'daily_8640' | 'weekly_60480' | 'monthly_259200' | 'custom' | 'uncapped';

export type UserRole = 'admin' | 'user';

export interface PlayerResources {
  naquadah: number;
  bankedNaquadah: number;
  metal: number;
  crystal: number;
  deuterium: number;
  food?: number;
  maxFood?: number;
  water?: number;
  maxWater?: number;
  totalPopulation?: number;
  energy: number;
  maxEnergy: number;
  attackTurns: number;
  turnBank?: number;
  turnCapMode?: TurnCapMode;
  turnCap?: number;
  turnsPerMinute?: number;
  dailyTurnsGenerated?: number;
  dailyTurnsCap?: number;
  weeklyTurnsCap?: number;
  isUncapped?: boolean;
  untrainedUnits: number;
  miners: number;
  lifers: number;
  unitProduction: number;
  attackUnits: number;
  defenseUnits: number;
  spies: number;
  antiSpies: number;
  superUnits: number;
  darkMatter?: number;
  credits?: number;
  trinium?: number;
  gateTokens?: number; // Alpha Exploration Tokens
  dimensionalTokens?: number; // Delta Dimensional Anomaly Keys
  raidTokens?: number; // Omega Raid Beacons
}

export interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  empireName?: string;
  capitalName?: string;
  leaderTitle?: string;
  originSector?: string;
  role?: UserRole;
  isAdmin?: boolean;
  race: RaceId;
  governmentId: string;
  rankName: string;
  rankLevel: number;
  glory: number;
  reputation: number;
  defconLevel: DefconLevel;
  vacationUntil: string | null;
  ascended: boolean;
  lastTurnAt: string;
  avatarUrl?: string;
  title?: string;
  name?: string;
  level?: number;
  xp?: number;
  planetName?: string;
  turnCapMode?: TurnCapMode;
  customTurnCap?: number;
}

export interface TechSubStat {
  name: string;
  value: number | string;
  unit: string;
}

export interface TechStats {
  primaryStat: {
    name: string;
    value: number | string;
    unit: string;
  };
  subStats: TechSubStat[];
}

export interface Technology {
  id: string;
  key: string;
  name: string;
  category: 'offense' | 'defense' | 'covert' | 'anti-covert';
  subClass?: string;
  techType?: string;
  subType?: string;
  tier?: number;
  tierTitle?: string;
  baseCost: number;
  costGrowth: number;
  level: number;
  maxLevel?: number;
  description: string;
  stats?: TechStats;
  effectsSummary?: string;
  powerRating?: number;
  doctrineBonus?: string;
}

export type EquipmentCategory = 'weapon' | 'armor' | 'shield';

export interface WeaponType {
  id: string;
  name: string;
  category: 'Offense' | 'Defense';
  itemType: EquipmentCategory;
  subCategory: string;
  tier: number;
  power: number;
  attack: number;
  defense: number;
  price: number;
  crewReq?: number;
  upkeep?: number;
  mass?: string;
  range?: string;
  specSummary: string;
  doctrine?: string;
  description: string;
  maxDurability: number;
}

export interface PlayerWeapon {
  id: string;
  weaponTypeId: string;
  quantity: number;
  durability: number; // 0 to 100%
}

export interface TargetRealm {
  id: string;
  commanderName: string;
  race: string;
  rank: string;
  score: number;
  estimatedUnits: number;
  estimatedNaquadah: number;
  isProtected: boolean;
  defenseLevel: number;
  antiCovertLevel: number;
}

export interface BattleRecord {
  id: string;
  timestamp: string;
  targetId?: string;
  targetName: string;
  actionType?: 'attack' | 'raid';
  action?: 'attack' | 'raid';
  turnsSpent: number;
  attackerScore: number;
  defenderScore: number;
  victory: boolean;
  loot: number;
  attackerCasualties: number;
  defenderCasualties: number;
}

export interface CovertMissionRecord {
  id: string;
  timestamp: string;
  targetId?: string;
  targetName: string;
  missionType?: 'recon' | 'spy' | 'sabotage';
  type?: 'recon' | 'spy' | 'sabotage';
  agentsSent: number;
  success: boolean;
  detected: boolean;
  resultText: string;
  intel?: {
    attackUnits: number;
    defenseUnits: number;
    naquadah: number;
    spies?: number;
    antiSpies?: number;
  };
}

export interface MothershipModule {
  key: string;
  name: string;
  level: number;
  baseCost: number;
  benefit: string;
}

export interface PlanetColony {
  id: string;
  name: string;
  coordinate: string;
  biome: string;
  level: number;
  incomeBonus: number;
  defenseBonus: number;
  maintenanceCost?: number;
  moonName?: string;
  jumpGateLevel: number;
  isHomeworld?: boolean;
  fieldsUsed?: number;
  fieldsMax?: number;
  temperature?: string;
  diameterKm?: number;
  hasMoon?: boolean;
  metalProductionRate?: number;
  crystalProductionRate?: number;
  deuteriumProductionRate?: number;
  naquadahProductionRate?: number;
  energyProductionRate?: number;
  specialization?: 'homeworld' | 'mining' | 'industrial' | 'research' | 'fortress' | 'trade';
  governor?: string;
  taxPolicy?: 'balanced' | 'extractive' | 'subsidized';
  facilities?: {
    roboticsFactory: number;
    shipyard: number;
    researchLab: number;
    allianceDepot: number;
    missileSilo: number;
    naniteFactory: number;
    terraformer: number;
  };
  mines?: {
    metalMine: number;
    crystalMine: number;
    deuteriumSynthesizer: number;
    solarPlant: number;
    fusionReactor: number;
    naquadahCoreTap: number;
  };
  defenses?: {
    rocketLauncher: number;
    lightLaser: number;
    heavyLaser: number;
    gaussCannon: number;
    ionCannon: number;
    plasmaTurret: number;
    smallShieldDome: boolean;
    largeShieldDome: boolean;
    antiBallisticMissiles: number;
    interplanetaryMissiles: number;
  };
  lunarBase?: {
    level: number;
    sensorPhalanxLevel: number;
    jumpGateLevel: number;
    moonFieldsUsed?: number;
    moonFieldsMax?: number;
  };
  foodStockpile?: number;
  foodCapacity?: number;
  foodProductionRate?: number;
  foodConsumptionRate?: number;
  waterStockpile?: number;
  waterCapacity?: number;
  waterProductionRate?: number;
  waterConsumptionRate?: number;
  population?: PlanetaryPopulation;
  lifeSupportFacilities?: PlanetaryLifeSupport;
  hazards?: PlanetaryHazard[];
  plunge?: ColonialPlungeStatus;
  buildingQueue?: PlanetaryBuildingQueueItem[];
}

export interface PlanetaryBuildingQueueItem {
  id: string;
  category: 'mines' | 'facilities' | 'lifeSupport' | 'defenses';
  facilityKey: string;
  name: string;
  targetLevel: number;
  progressPercent: number;
  timeRemainingSeconds: number;
  totalDurationSeconds: number;
  cost: {
    metal: number;
    crystal: number;
    deuterium: number;
    naquadah: number;
  };
  status: 'in_progress' | 'queued' | 'paused';
}

// ==========================================
// FOOD, WATER, POPULATION & HAZARD/PLUNGE TYPES
// ==========================================

export type PopulationLivingStandard =
  | 'utopian'
  | 'decent'
  | 'basic'
  | 'impoverished'
  | 'chemical_bliss';

export type PopulationRationingLevel =
  | 'abundant'
  | 'standard'
  | 'strict_rationing'
  | 'famine_starvation';

export interface PopulationStrataDistribution {
  farmers: number;
  hydrologists: number;
  miners: number;
  industrialWorkers: number;
  scientists: number;
  administrators: number;
  militaryRecruits: number;
}

export interface PlanetaryPopulation {
  total: number;
  growthRatePerHour: number;
  housingCapacity: number;
  happiness: number; // 0 - 100%
  unrest: number; // 0 - 100%
  strata: PopulationStrataDistribution;
  livingStandard: PopulationLivingStandard;
  rationingLevel: PopulationRationingLevel;
}

export interface PlanetaryLifeSupport {
  hydroponicsDomes: number;
  bioFarms: number;
  geneticCropLabs: number;
  deepAquiferPumps: number;
  moistureCondensers: number;
  desalinationPlants: number;
  subsurfaceCisterns: number;
  atmosphereScrubbers: number;
}

export type HazardType =
  | 'radiation_storm'
  | 'acid_rain'
  | 'tectonic_fault'
  | 'cryo_frost'
  | 'toxic_spore'
  | 'void_shear'
  | 'nanite_plague'
  | 'supervolcano'
  | 'solar_flare';

export type HazardSeverity = 'low' | 'moderate' | 'high' | 'cataclysmic';

export interface PlanetaryHazard {
  id: string;
  name: string;
  type: HazardType;
  severity: HazardSeverity;
  icon: string;
  effectDescription: string;
  habitabilityPenalty: number; // % reduction
  popGrowthPenalty: number; // % reduction
  waterContaminationPercent: number; // %
  foodSpoilagePercent?: number; // %
  isMitigated: boolean;
  mitigationProjectName?: string;
  mitigationCost?: {
    metal: number;
    crystal: number;
    deuterium: number;
    naquadah: number;
  };
}

export type PlungeStage =
  | 'stable'
  | 'stressed'
  | 'severe_crisis'
  | 'freefall'
  | 'total_collapse';

export type PlungeTrend = 'recovering' | 'stable' | 'deteriorating' | 'collapsing';

export interface PlungeIntervention {
  id: string;
  name: string;
  category: 'logistics' | 'martial' | 'welfare' | 'geoengineering' | 'evacuation';
  description: string;
  cost: {
    food?: number;
    water?: number;
    naquadah?: number;
    darkMatter?: number;
    credits?: number;
    metal?: number;
    energy?: number;
  };
  plungeReduction: number;
  happinessBonus: number;
  cooldownMinutes: number;
  lastUsedAt?: string;
}

export interface ColonialPlungeStatus {
  plungeIndex: number; // 0 - 100% (0 = prime prosperity, 100 = total collapse)
  stage: PlungeStage;
  trend: PlungeTrend;
  reasons: string[];
  activeCrises: string[];
  lastInterventionAt?: string;
  interventionsAvailable: PlungeIntervention[];
}

export interface MarketOrder {
  id: string;
  sellerName: string;
  resourceType: 'naquadah' | 'super-weapon' | 'energy-core';
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
}

export interface MercenaryContract {
  id: string;
  name: string;
  type: 'infantry' | 'heavy' | 'infiltrator';
  attackPower: number;
  defensePower: number;
  cost: number;
  upkeepPerTurn: number;
  available: number;
}

export interface RankingEntry {
  rank: number;
  commanderName: string;
  race: string;
  overallScore: number;
  attackScore: number;
  defenseScore: number;
  covertScore: number;
  mothershipScore: number;
  glory: number;
}

export type GuildRank =
  | 'master'
  | 'commander'
  | 'diplomat'
  | 'quartermaster'
  | 'veteran'
  | 'member'
  | 'initiate';

export interface GuildMember {
  id: string;
  name: string;
  rank: GuildRank;
  roleLabel: string;
  score: number;
  fleetPower: number;
  joinedDate: string;
  status: 'online' | 'in_combat' | 'in_hyperspace' | 'offline';
  donations: {
    naquadah: number;
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export interface GuildVault {
  naquadah: number;
  metal: number;
  crystal: number;
  deuterium: number;
  darkMatter: number;
}

export interface GuildPerk {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  bonusPercent: number;
  effectDescription: string;
  upgradeCost: {
    naquadah: number;
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

export interface GuildTreaty {
  id: string;
  targetGuildName: string;
  targetGuildTag: string;
  type: 'non_aggression' | 'mutual_defense' | 'trade_pact' | 'war';
  status: 'active' | 'pending' | 'broken';
  establishedDate: string;
  terms: string;
}

export interface Alliance {
  id: string;
  name: string;
  tag: string;
  leader: string;
  membersCount: number;
  treasury: number;
  isOpen: boolean;
  // Enhanced Guild properties
  description?: string;
  motd?: string;
  crestIcon?: string;
  maxMembers?: number;
  members?: GuildMember[];
  vault?: GuildVault;
  perks?: GuildPerk[];
  treaties?: GuildTreaty[];
  minScoreRequired?: number;
  joinPolicy?: 'open' | 'approval' | 'invite_only';
  createdAt?: string;
}

export type Guild = Alliance;

export interface PlayerFriend {
  id: string;
  commanderName: string;
  avatar: string;
  score: number;
  fleetPower: number;
  guildTag?: string;
  guildName?: string;
  homeworldCoordinate: string;
  status: 'online' | 'in_combat' | 'in_hyperspace' | 'offline';
  relationshipStatus: 'friend' | 'pending_incoming' | 'pending_outgoing' | 'blocked';
  isPinned?: boolean;
  lastActive: string;
  notes?: string;
}

export interface GameMessage {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  isUrgent?: boolean;
  attachedResources?: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    naquadah?: number;
    darkMatter?: number;
  };
  attachedCoordinates?: string;
  category?: 'direct' | 'guild' | 'system' | 'distress';
  replyToId?: string;
}

export type DirectMessage = GameMessage;

export interface TradeResourceBundle {
  metal?: number;
  crystal?: number;
  deuterium?: number;
  naquadah?: number;
  darkMatter?: number;
  itemName?: string;
  itemCategory?: string;
}

export interface PlayerTradeOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  targetPlayerId?: string;
  targetPlayerName?: string;
  offering: TradeResourceBundle;
  requesting: TradeResourceBundle;
  status: 'open' | 'completed' | 'cancelled' | 'expired';
  createdAt: string;
  expiresInHours: number;
  taxRatePercent: number;
  escrowSecured: boolean;
  note?: string;
}

export type CronJobId =
  | 'turn_cron'
  | 'daily_cron'
  | 'market_cron'
  | 'target_regen_cron'
  | 'events_cron';

export interface CronJob {
  id: CronJobId;
  name: string;
  description: string;
  schedule: string;
  intervalSeconds: number;
  enabled: boolean;
  lastRunAt: string | null;
  nextRunAt: string;
  runCount: number;
  lastExecutionMs: number;
  status: 'idle' | 'running' | 'success' | 'failed';
  lastResultSummary: string;
  commandSnippet: string;
}

export interface CronExecutionLog {
  id: string;
  jobId: CronJobId;
  jobName: string;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: {
    turnsAdded?: number;
    incomeAdded?: number;
    unitsAdded?: number;
    upkeepDeducted?: number;
    interestAccrued?: number;
    targetsRegenerated?: number;
    eventsFired?: string;
    marketFluctuation?: string;
    metalMined?: number;
    crystalMined?: number;
    deuteriumMined?: number;
    energyBalance?: number;
    creditsAdded?: number;
  };
}

export interface CronConfig {
  autoTickEnabled: boolean;
  tickIntervalSeconds: number;
  offlineCatchup: boolean;
  soundOnTick: boolean;
}

// ==========================================
// ADMIN CONTROL PANEL & CROWN SOVEREIGNTY TYPES
// ==========================================

export type DecreeCategory = 'economic' | 'military' | 'science' | 'expansion' | 'divine';

export interface ImperialDecree {
  id: string;
  title: string;
  codename: string;
  category: DecreeCategory;
  description: string;
  effectSummary: string;
  multiplier: number;
  active: boolean;
  costDarkMatter: number;
  icon: string;
  durationMinutes: number;
  activatedAt?: string | null;
}

export interface AdminWorldModifier {
  id: string;
  name: string;
  description: string;
  category: 'production' | 'combat' | 'speed' | 'economy';
  multiplier: number;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface AdminServerSettings {
  serverName: string;
  realmState: 'online' | 'maintenance' | 'event_surge' | 'peace_mode';
  godModeEnabled: boolean;
  instantBuildsEnabled: boolean;
  freeDarkMatterMode: boolean;
  pvpEnabled: boolean;
  globalBroadcastMessage: string;
  globalBroadcastActive: boolean;
  turnTickMultiplier: number;
}

// ==========================================
// COMPLETE OGAME CLONE ADMIN SYSTEM TYPES
// (2Moons, XNova, SuperNova, OGFleet specifications)
// ==========================================

export interface OGameUniverseConfig {
  universeName: string;
  gameSpeed: number; // 1x to 10000x
  fleetSpeed: number; // 1x to 100x
  resourceSpeed: number; // 1x to 1000x
  energyMultiplier: number;
  deutConsumptionFactor: number;
  storageCapacityFactor: number;
  defToDebrisPercent: number; // 0% to 100%
  fleetToDebrisPercent: number; // 30% to 100%
  moonChanceCapPercent: number; // 20% to 100%
  maxExpeditionsPerPlayer: number;
  beginnerProtectionPoints: number;
  beginnerProtectionRatio: number;
  inactivePurgeDays: number;
  maintenanceMode: boolean;
  maintenanceNotice: string;
  acsEnabled: boolean;
  rapidFireEnabled: boolean;
  debrisRecycleSpeed: number;
}

export type AdminUserRole = 'player' | 'moderator' | 'operator' | 'administrator' | 'super_admin';
export type AdminUserStatus = 'active' | 'vacation' | 'banned' | 'inactive';

export type AdminPermission =
  | 'GRANT_RESOURCES'
  | 'MANAGE_USERS'
  | 'BAN_PLAYERS'
  | 'MODIFY_UNIVERSE_CONFIG'
  | 'EXECUTE_SQL'
  | 'ISSUE_DECREES'
  | 'MANAGE_FLEETS'
  | 'PURGE_SYSTEM_DATA'
  | 'MODERATE_TICKETS'
  | 'MANAGE_EVENTS';

export interface AdminCredentialAccount {
  id: string;
  username: string;
  email: string;
  loginCode: string;
  passcode: string;
  securityPin: string;
  role: AdminUserRole;
  title: string;
  permissions: AdminPermission[];
  lastLoginAt?: string;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  activeAdmin: AdminCredentialAccount | null;
  authenticatedAt: string | null;
  securityClearanceLevel: number;
}

export interface OGameAccountPermissions {
  noobProtection: boolean;
  chatMuted: boolean;
  attackLock: boolean;
  tradeLock: boolean;
  multiAccountFlag: boolean;
  vacationMode: boolean;
  officerPrivileges: boolean;
  customBuildSpeedMult: number;
  customStorageMult: number;
  canBuildShips: boolean;
  canResearchTech: boolean;
  canSendExpeditions: boolean;
  canAccessMarket: boolean;
  canJoinAlliance: boolean;
  canBypassNoobProtection: boolean;
  canAccessStargate: boolean;
}

export interface AdminUserAccount {
  id: string;
  username: string;
  email: string;
  race: RaceId;
  allianceTag?: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  ipAddress: string;
  registeredAt: string;
  lastActiveAt: string;
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  darkMatter: number;
  naquadah: number;
  rankPoints: number;
  fleetUnits: number;
  planetsCount: number;
  homeCoords: string;
  vacationUntil?: string | null;
  banReason?: string | null;
  permissions?: AdminPermission[];
  accountPermissions?: OGameAccountPermissions;
}

export type AdminBanType = 'full_ban' | 'attack_lock' | 'chat_mute' | 'vacation_lock' | 'ip_ban';

export interface AdminBanRecord {
  id: string;
  userId: string;
  username: string;
  adminName: string;
  reason: string;
  banType: AdminBanType;
  ipAddress: string;
  issuedAt: string;
  expiresAt: string;
  isPermanent: boolean;
  active: boolean;
}

export interface AdminPlanetEntry {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  coordinates: string;
  planetClass: string;
  diameterKm: number;
  usedFields: number;
  maxFields: number;
  tempMin: number;
  tempMax: number;
  metalRate: number;
  crystalRate: number;
  deutRate: number;
  hasMoon: boolean;
  moonName?: string;
  moonDiameterKm?: number;
  lunarBaseLevel?: number;
  phalanxLevel?: number;
  jumpGateLevel?: number;
}

export type AdminMissionType =
  | 'attack'
  | 'transport'
  | 'deploy'
  | 'espionage'
  | 'colonize'
  | 'recycle'
  | 'destroy_moon'
  | 'expedition'
  | 'acs_attack';

export interface AdminFleetMission {
  id: string;
  missionType: AdminMissionType;
  ownerName: string;
  targetPlayerName: string;
  originCoords: string;
  targetCoords: string;
  fleetComposition: Record<string, number>;
  cargo: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  departureTime: string;
  arrivalTime: string;
  returnTime: string;
  status: 'flying_out' | 'holding' | 'returning' | 'completed' | 'teleported';
}

export interface AdminDebrisField {
  id: string;
  coordinates: string;
  metal: number;
  crystal: number;
  createdAt: string;
  spawnedByAdmin: boolean;
}

export interface AdminSupportTicketMessage {
  id: string;
  sender: string;
  senderRole: 'user' | 'admin';
  message: string;
  timestamp: string;
}

export interface AdminSupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  username: string;
  category: 'bug' | 'battle_loss' | 'dark_matter' | 'rule_violation' | 'ban_appeal' | 'general';
  subject: string;
  status: 'open' | 'in_progress' | 'awaiting_user' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedAdmin?: string;
  messages: AdminSupportTicketMessage[];
  internalNotes?: string;
}

export interface AdminSecurityAlert {
  id: string;
  timestamp: string;
  detectedAt?: string;
  severity: 'info' | 'warning' | 'critical' | 'violation';
  alertType: 'multi_account_ip' | 'fleet_bashing' | 'resource_pushing' | 'bot_activity' | 'rapid_auth_failure';
  sourceUser: string;
  targetUser?: string;
  involvedUsers?: string[];
  details: string;
  ipAddress: string;
  resolved: boolean;
}

export interface AdminGlobalEvent {
  id: string;
  name: string;
  title?: string;
  eventType: 'happy_hour' | 'debris_festival' | 'speed_rush' | 'solar_surge' | 'pirate_incursion' | 'peace_treaty';
  type?: string;
  multiplier?: number;
  description: string;
  multiplierDescription: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  endTime?: string;
  icon: string;
}


// ==========================================
// OGAME TECH TREE & EMPIRE EXPANSION TYPES
// ==========================================

export type OGameTechBranch =
  | 'economics'
  | 'science'
  | 'military'
  | 'advanced_science'
  | 'advanced_fleet'
  | 'endgame'
  | 'megastructures';

export type OGameTechCategory =
  | 'energy'
  | 'mining'
  | 'materials'
  | 'computing'
  | 'physics'
  | 'propulsion'
  | 'weapons'
  | 'shields'
  | 'armor'
  | 'espionage'
  | 'colonization'
  | 'fleet'
  | 'military'
  | 'economy'
  | 'diplomacy'
  | 'biology'
  | 'ai'
  | 'quantum'
  | 'dimensional'
  | 'megastructure';

export interface TechPrerequisite {
  type: 'tech' | 'facility' | 'shipyard';
  id: string;
  name: string;
  requiredLevel: number;
}

export interface TechEffect {
  type:
    | 'production_boost'
    | 'energy_boost'
    | 'speed_boost'
    | 'weapon_boost'
    | 'shield_boost'
    | 'armor_boost'
    | 'fleet_slot'
    | 'hangar_capacity'
    | 'expedition_slot'
    | 'research_speed';
  label: string;
  valuePerLevel: number;
  unit: '%' | '+' | 'slots';
}

export interface OGameTechnology {
  id: string;
  name: string;
  branch: OGameTechBranch;
  category: OGameTechCategory;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
  };
  costMultiplier: number;
  baseTimeSeconds: number;
  prerequisites: TechPrerequisite[];
  effects: TechEffect[];
  unlockTargets: string[]; // List of ships, buildings, defenses unlocked
  isUnique?: boolean;
}

export interface ResearchQueueItem {
  id: string;
  techId: string;
  techName: string;
  targetLevel: number;
  startedAt: number;
  durationSeconds: number;
  remainingSeconds: number;
  metalCost: number;
  crystalCost: number;
  deuteriumCost: number;
}

export type LabSpecialization =
  | 'physics'
  | 'engineering'
  | 'biology'
  | 'military'
  | 'computer'
  | 'propulsion'
  | 'energy'
  | 'quantum'
  | 'ai'
  | 'dimensional';

// Deep Research Systems & Intergalactic Research Network
export interface ScienceDoctrine {
  id: string;
  name: string;
  branch: string;
  icon: string;
  description: string;
  speedBonusPercent: number;
  bonusCategories: OGameTechCategory[];
  costPenaltyPercent?: number;
  breakthroughChanceBonus: number;
  unlockedAtLabLevel: number;
}

export interface ResearchSpecialistRoster {
  theorists: number;
  navalArchitects: number;
  industrialEngineers: number;
  cyberneticists: number;
  astroPhysicists: number;
}

export interface ResearchBreakthroughEvent {
  id: string;
  techId: string;
  techName: string;
  type: 'speed_surge' | 'free_level' | 'cost_refund' | 'prototype_blueprint';
  title: string;
  description: string;
  timestamp: number;
  rewardValue: string;
}

export interface IntergalacticLabNode {
  planetId: string;
  planetName: string;
  labLevel: number;
  networkContribution: number;
  status: 'online' | 'overclocked' | 'offline';
  specialization: LabSpecialization;
}

// Industrial Facilities & Factories
export type FacilityCategory = 'resource' | 'processing' | 'manufacturing' | 'infrastructure';

export interface OGameFacility {
  id: string;
  name: string;
  category: FacilityCategory;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  costMultiplier: number;
  energyConsumptionPerLevel: number;
  productionPerLevel?: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
  };
  bonusDescription: string;
  prerequisites: TechPrerequisite[];
  baseBuildTimeSeconds?: number;
}

export interface FactoryQueueItem {
  id: string;
  facilityId: string;
  facilityName: string;
  targetLevel: number;
  startedAt: number;
  durationSeconds: number;
  remainingSeconds: number;
  metalCost?: number;
  crystalCost?: number;
  deuteriumCost?: number;
}

// Shipyard & Ships
export type OGameShipCategory = 'civilian' | 'combat' | 'carrier' | 'specialized' | 'capital';

export interface OGameShip {
  id: string;
  name: string;
  category: OGameShipCategory;
  description: string;
  structure: number; // Hull HP
  shield: number;
  weaponPower: number;
  cargoCapacity: number;
  speed: number;
  fuelConsumption: number;
  cost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  buildTimeSeconds: number;
  hangarCapacity?: number; // For carriers
  prerequisites: TechPrerequisite[];
  rapidfireAgainst: Record<string, number>; // target ship ID -> shots per round
  quantity: number; // Player's built fleet inventory
}

export interface ShipyardQueueItem {
  id: string;
  shipId: string;
  shipName: string;
  quantity: number;
  completedQuantity: number;
  totalTimeSeconds: number;
  remainingSeconds: number;
  startedAt: number;
}

export type FleetFormationType =
  | 'standard'
  | 'line'
  | 'wedge'
  | 'defensive'
  | 'assault'
  | 'carrier';

export interface FleetFormation {
  id: FleetFormationType;
  name: string;
  description: string;
  attackModifier: number;
  defenseModifier: number;
  speedModifier: number;
  flagshipProtection: number;
}

export interface FleetFormationPreset {
  id: string;
  name: string;
  description?: string;
  formation: FleetFormationType;
  composition: Record<string, number>; // shipId -> count
  createdAt: number;
  tags?: ('expedition' | 'attack' | 'defense' | 'custom')[];
}

// Planetary Defense Grid
export type OGameDefenseCategory = 'kinetic' | 'laser' | 'plasma' | 'missile' | 'shield';

export interface OGameDefense {
  id: string;
  name: string;
  category: OGameDefenseCategory;
  description: string;
  structure: number;
  shield: number;
  weaponPower: number;
  cost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  buildTimeSeconds: number;
  prerequisites: TechPrerequisite[];
  quantity: number;
  maxBuildable?: number; // e.g. for planetary shield domes: 1
}

export interface DefenseQueueItem {
  id: string;
  defenseId: string;
  defenseName: string;
  quantity: number;
  completedQuantity: number;
  totalTimeSeconds: number;
  remainingSeconds: number;
  startedAt: number;
}

// Deep Space Expeditions
export type ExpeditionMissionType =
  | 'exploration'
  | 'deep_space'
  | 'anomaly'
  | 'alien_contact'
  | 'relic_discovery'
  | 'derelict_salvage'
  | 'dimensional';

export interface ExpeditionFleetAssignment {
  shipId: string;
  shipName: string;
  quantity: number;
}

export interface ExpeditionMission {
  id: string;
  type: ExpeditionMissionType;
  name: string;
  targetSector: string;
  durationSeconds: number;
  remainingSeconds: number;
  startedAt: number;
  fleet: ExpeditionFleetAssignment[];
  status: 'en_route' | 'completed' | 'reported';
}

export interface ExpeditionLog {
  id: string;
  timestamp: string;
  sector: string;
  missionType: ExpeditionMissionType;
  status: 'triumph' | 'discovery' | 'peril' | 'hostile';
  narrative: string;
  loot?: {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    naquadah?: number;
    shipsFound?: { name: string; quantity: number }[];
    relicName?: string;
  };
}

// Megastructure Projects
export interface MegastructureStage {
  stageNumber: number;
  name: string;
  cost: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  durationSeconds: number;
  completed: boolean;
  effectDescription: string;
}

export interface MegastructureProject {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  currentStage: number; // 0 = not started, 1..totalStages
  totalStages: number;
  stages: MegastructureStage[];
  prerequisites: TechPrerequisite[];
  isConstructing: boolean;
  constructionRemainingSeconds: number;
  grandBenefit: string;
}

// ==========================================
// STORE & BATTLE PASS TYPES
// ==========================================

export type StoreCurrency = 'darkMatter' | 'credits' | 'naquadah';

export interface StoreItem {
  id: string;
  name: string;
  category: 'officer' | 'booster' | 'relic' | 'cosmetic' | 'crate';
  description: string;
  icon: string;
  price: number;
  currency: StoreCurrency;
  durationDays?: number;
  bonusEffect: string;
  purchased?: boolean;
  quantityOwned?: number;
}

export interface CosmeticRewardDetails {
  id: string;
  name: string;
  type: 'skin' | 'avatar' | 'title' | 'engine_trail' | 'hologram';
  rarity: 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  description: string;
  previewColor: string;
  equipped?: boolean;
}

export interface ResourceBonusDetails {
  naquadah?: number;
  metal?: number;
  crystal?: number;
  deuterium?: number;
  energy?: number;
  attackTurns?: number;
  darkMatter?: number;
  attackUnits?: number;
}

export interface BattlePassTier {
  level: number;
  requiredXp: number;
  freeReward: {
    name: string;
    type: 'resource' | 'ship' | 'currency' | 'speedup';
    quantity: number;
    icon: string;
    resourceBonus?: ResourceBonusDetails;
  };
  eliteReward: {
    name: string;
    type: 'darkMatter' | 'titanShip' | 'relic' | 'exclusiveTitle' | 'skin';
    quantity: number;
    icon: string;
    cosmeticReward?: CosmeticRewardDetails;
    resourceBonus?: ResourceBonusDetails;
  };
  claimedFree?: boolean;
  claimedElite?: boolean;
}

export interface BattlePassQuest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'milestone';
  targetCount: number;
  currentCount: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface BattlePassState {
  seasonNumber: number;
  seasonName: string;
  daysRemaining: number;
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  hasElitePass: boolean;
  totalXpEarned: number;
  battlePassPoints?: number;
}

export interface BattlePassShopItem {
  id: string;
  name: string;
  category: 'unit_skin' | 'resource_bundle';
  description: string;
  pricePoints: number;
  icon: string;
  rarity: 'rare' | 'epic' | 'legendary' | 'mythic';
  unitTarget?: string;
  previewColor?: string;
  accentColor?: string;
  bonusEffect?: string;
  resourceBonus?: ResourceBonusDetails;
  cosmeticDetails?: CosmeticRewardDetails;
  purchased?: boolean;
  purchaseCount?: number;
}

// ==========================================
// ACCOUNT PROFILES & DOSSIER TYPES
// ==========================================

export interface CommanderProfileSlot {
  id: string;
  slotNumber: number;
  commanderName: string;
  title: string;
  race: RaceId;
  governmentId: string;
  level: number;
  avatarUrl: string;
  isActive: boolean;
  lastPlayed: string;
  planetsCount: number;
  fleetScore: number;
  darkMatter: number;
}

export interface CareerStats {
  totalBattles: number;
  victories: number;
  defeats: number;
  winRate: number;
  totalLootNaquadah: number;
  planetsColonized: number;
  moonsDiscovered: number;
  stargatesDialed: number;
  expeditionsCompleted: number;
  debrisRecycled: number;
  darkMatterEarned: number;
  ascensionsCount: number;
}

// ==========================================
// MMORPG OGAME SYSTEMS TYPES
// ==========================================

export interface OGameServer {
  id: string;
  name: string;
  type: 'classic' | 'war' | 'speed' | 'eco';
  speedMultiplier: number;
  fleetSpeedMultiplier: number;
  debrisFieldPercent: number; // 30%, 70%, 80%
  playersOnline: number;
  galaxiesCount: number;
  systemsPerGalaxy: number;
  acsEnabled: boolean;
  defensesToDebris: boolean;
  status: 'active' | 'recommended' | 'hardcore';
  description: string;
}

export interface SolarSystemSlot {
  slotNumber: number; // 1 - 15
  type: 'empty' | 'planet';
  planetName?: string;
  planetClass?: string;
  planetDiameterKm?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  playerName?: string;
  playerRank?: number;
  allianceTag?: string;
  playerStatus?: 'active' | 'inactive' | 'vacation' | 'strong' | 'noob';
  hasMoon?: boolean;
  moonName?: string;
  moonDiameterKm?: number;
  debrisField?: {
    metal: number;
    crystal: number;
  };
}

export interface ACSAttackGroup {
  id: string;
  missionName: string;
  targetCoord: string;
  leadCommander: string;
  members: string[];
  totalShips: number;
  arrivalSeconds: number;
  status: 'coordinating' | 'in_flight' | 'engaged';
}

export interface MissileSiloData {
  level: number;
  ipmCount: number; // Interplanetary Missiles
  abmCount: number; // Anti-Ballistic Missiles
  maxCapacity: number;
  rangeSystems: number;
}

// ==========================================
// HYPERSPACE & EXTENDED MOTHERSHIP TYPES
// ==========================================

export interface HyperspaceDriveTech {
  id: string;
  name: string;
  tier: number;
  speedMultiplier: number;
  fuelEfficiency: number;
  deuteriumCostPerHour: number;
  description: string;
  level: number;
}

export interface SubspaceJumpGate {
  id: string;
  name: string;
  originMoon: string;
  destinationMoon: string;
  chargePercentage: number;
  ready: boolean;
  cooldownSeconds: number;
}

export interface WormholeAnomaly {
  id: string;
  name: string;
  stability: 'stable' | 'fluctuating' | 'critical';
  destinationSector: string;
  dangerRating: 'low' | 'moderate' | 'extreme';
  rewardPotential: string;
  durationSeconds: number;
}

export interface MothershipTitanClass {
  id: string;
  name: string;
  hullType: 'dreadnought' | 'titan' | 'colossus' | 'world_eater' | 'leviathan';
  hullHp: number;
  shieldHp: number;
  firepower: number;
  energyCore: number;
  hangarSlots: number;
  flagshipBonus: string;
  description: string;
}

export interface MothershipTacticalAbility {
  id: string;
  name: string;
  energyCost: number;
  cooldownSeconds: number;
  remainingCooldown: number;
  icon: string;
  description: string;
  effectType: 'bombardment' | 'shield_overcharge' | 'warp_jump' | 'sensor_sweep' | 'fleet_aura';
}

// ==========================================
// PLANETARY & LUNAR A-Z AND SIZE 1-9 TYPES
// ==========================================

export type PlanetaryClassLetter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export interface PlanetaryClassAZ {
  letter: PlanetaryClassLetter;
  className: string;
  typeCategory: string;
  scientificDesignation: string;
  atmosphereComposition: string;
  surfaceComposition: string;
  temperatureRange: string;
  averageDiameterKm: number;
  sizeRating: number; // 1 to 9
  habitabilityScore: number; // 0 to 100
  metalMultiplier: number;
  crystalMultiplier: number;
  deuteriumMultiplier: number;
  energyMultiplier: number;
  description: string;
  subClasses: string[];
  subTypes: string[];
  colorHex: string;
}

export interface MoonClassAZ {
  classCode: string;
  className: string;
  originType: 'captured_asteroid' | 'collision_ejecta' | 'co_accretion' | 'ancient_construct';
  densityGcm3: number;
  surfaceGravityG: number;
  fieldsMax: number;
  lunarSizeRating: number; // 1 to 9
  specialFeature: string;
  phalanxEfficiency: number; // %
  jumpGateSynergy: number; // %
  description: string;
}

export interface PlanetarySizeScale {
  sizeLevel: number; // 1 to 9
  label: string;
  category: string;
  fieldsRange: string;
  diameterRangeKm: string;
  massComparison: string;
  defenseSlots: number;
  maxBuildingCapacity: number;
  tacticalAdvantage: string;
}

export interface InterstellarCelestialObject {
  id: string;
  name: string;
  category: 'star' | 'pulsar' | 'black_hole' | 'nebula' | 'dyson_swarm' | 'quasar' | 'asteroid_belt' | 'supergate';
  spectralClass?: string;
  luminosity: string;
  radiationIndex: string;
  resourceYield: string;
  tacticalEffect: string;
  coordinates: string;
  description: string;
}

export type StargateGalaxy = 'Milky Way' | 'Pegasus' | 'Ori Galaxy' | 'Destiny Cosmic Void' | 'Ida Galaxy';
export type NpcThreatLevel = 'Harmless / Pacifist' | 'Moderate / Cautious' | 'High / Aggressive' | 'Extinction Level / Cataclysmic';
export type NpcDiplomaticStatus = 'Hostile' | 'Neutral' | 'Alliance Partner' | 'Rogue / Marauder' | 'Ascended / Beyond Contact';

export interface StargateNpcRace {
  id: string;
  name: string;
  designationOrTitle: string;
  canonicalSeries: 'Stargate SG-1' | 'Stargate Atlantis' | 'Stargate Universe' | 'The Ark of Truth';
  galaxy: StargateGalaxy;
  homeworld: string;
  stargateAddress: string;
  classification: 'Organic Humanoid' | 'Bio-Mechanical' | 'Synthetic / Nanite' | 'Parasitic Symbiote' | 'Higher Energy / Ascended' | 'Amphibious / Reptilian';
  threatLevel: NpcThreatLevel;
  diplomaticStatus: NpcDiplomaticStatus;
  factionLeader: string;
  flagshipClass: string;
  fleetStrength: number;
  tacticalTraits: string[];
  loreDescription: string;
  firstAppearanceEpisode: string;
  combatStats: {
    attackBonusPercent: number;
    shieldHarmonicsPercent: number;
    sensorStealthPercent: number;
    technologicalTier: number;
  };
  resourceLoot: {
    naquadah: number;
    metalOrTrinium: number;
    crystal: number;
    deuterium: number;
  };
  avatarEmoji: string;
  sigilColor: string;
}

// ==========================================
// AIC (AUTOMATED INDUSTRY COMPLEX) & POWER GRID
// ==========================================

export type AICMachineType =
  | 'harvester'
  | 'conveyor'
  | 'sprinkler'
  | 'smelter'
  | 'refinery'
  | 'assembler'
  | 'chemical_centrifuge';

export type AICConveyorTier = 'basic_belt' | 'mag_belt' | 'flux_tube' | 'quantum_shunt';

export interface AICProductionLine {
  id: string;
  name: string;
  type: AICMachineType;
  tier: number;
  status: 'running' | 'idle' | 'congested' | 'unpowered';
  inputResource: string;
  outputResource: string;
  ratePerMin: number;
  powerDrawMW: number;
  efficiencyPercent: number;
  sprinklerBoostActive: boolean;
  conveyorTier: AICConveyorTier;
  connectedTargetId?: string;
  description: string;
  upgradeCost: {
    credits?: number;
    metal?: number;
    crystal?: number;
    deuterium?: number;
    naquadah?: number;
  };
}

export interface AICRemoteMiningOutpost {
  id: string;
  sectorName: string;
  coordinates: string;
  resourceTarget: 'metal' | 'crystal' | 'deuterium' | 'naquadah' | 'rare_alloys';
  yieldPerHour: number;
  cargoDronesCount: number;
  freightHaulerStatus: 'in_transit' | 'loading' | 'unloading' | 'standby';
  powerRelayPylons: number;
  distanceKm: number;
  powerReceivedMW: number;
  requiredPowerMW: number;
  efficiencyPercent: number;
  status: 'active' | 'low_power' | 'congested' | 'maintenance';
}

export type AICManufacturedCategory = 'gear' | 'explosives' | 'healing' | 'ammunition';

export interface AICManufacturedItem {
  id: string;
  name: string;
  category: AICManufacturedCategory;
  tier: number;
  icon: string;
  description: string;
  craftingCost: {
    credits?: number;
    metal?: number;
    crystal?: number;
    deuterium?: number;
    naquadah?: number;
  };
  craftingTimeSec: number;
  stockQuantity: number;
  autoReplenishThreshold: number;
  autoCraftEnabled: boolean;
  combatEffect: string;
  sellValueCredits: number;
}

export interface AICCraftingQueueItem {
  id: string;
  itemId: string;
  itemName: string;
  category: AICManufacturedCategory;
  quantity: number;
  completedQuantity: number;
  durationSec: number;
  remainingSec: number;
  startedAt: number;
}

export type PowerSourceType = 'solar' | 'fusion' | 'antimatter' | 'geothermal' | 'zero_point' | 'dyson_collector';

export interface PowerGridSource {
  id: string;
  name: string;
  type: PowerSourceType;
  level: number;
  maxLevel: number;
  baseOutputMW: number;
  currentOutputMW: number;
  fuelConsumptionPerMin?: string;
  efficiencyPercent: number;
  status: 'online' | 'overclocked' | 'offline' | 'standby';
  icon: string;
  upgradeCost: {
    credits: number;
    metal: number;
    crystal: number;
    deuterium: number;
    naquadah: number;
  };
}

export type GridOverclockMode = 'normal' | 'overclock_125' | 'danger_150';

export interface PowerGridSettings {
  overclockMode: GridOverclockMode;
  loadSheddingPriority: ('life_support' | 'shields' | 'aic_factories' | 'research_labs' | 'habitats')[];
  batteryAutoDischargeThreshold: number; // e.g. 90%
  surgeProtectionEnabled: boolean;
  frequencyStabilizerActive: boolean;
  remoteRelayGridSync: boolean;
  emergencyBrownoutThreshold: number;
}

export interface PowerGridState {
  totalGenerationMW: number;
  totalDemandMW: number;
  batteryStorageMaxMWh: number;
  batteryStorageCurrentMWh: number;
  gridFrequencyHz: number; // Nominal 60.00 Hz
  gridStatus: 'optimal' | 'strained' | 'brownout' | 'blackout';
  sources: PowerGridSource[];
  settings: PowerGridSettings;
}

// ==========================================
// BANK, VAULT & FINANCIAL CITADEL UPGRADES
// ==========================================

export interface BankTransactionRecord {
  id: string;
  timestamp: string;
  type: 'deposit' | 'withdraw' | 'interest' | 'auto_sweep' | 'loan_borrow' | 'loan_repay' | 'upgrade' | 'dividend';
  amount: number;
  note: string;
  resultingBalance: number;
}

export interface BankLoanAccount {
  loanId: string;
  principal: number;
  remainingBalance: number;
  interestRatePerTurn: number; // e.g. 0.03 (3%)
  turnsRemaining: number;
  maxTurns: number;
  paymentPerTurn: number;
}

export interface BankVaultUpgradeState {
  vaultLevel: number; // General base vault tier
  titaniumReinforcementLevel: number; // Expands base capacity
  quantumEncryptionLevel: number; // Increases interest yield and security
  subspaceShuntLevel: number; // 100% anti-plunder shield and sensor scrambler
  stargateTerminalLevel: number; // Cross-world bank sync and fee reduction
  compoundInterestLevel: number; // Accelerates compounding curve
  autoSweepEnabled: boolean; // Auto-deposit surplus liquid reserves
  autoSweepThreshold: number; // Minimum liquid NQ to retain in active wallet
  reinvestRatePercent: number; // % of turn interest auto-deposited into vault (0-100)
  activeLoan: BankLoanAccount | null;
  totalInterestEarned: number;
  totalSweepsExecuted: number;
  transactions: BankTransactionRecord[];
}

// ==========================================
// UNIVERSAL RESOURCE STORAGE & SILO UPGRADES
// ==========================================

export interface ResourceStorageUpgrades {
  metalSiloLevel: number;
  crystalVaultLevel: number;
  deuteriumTankLevel: number;
  energyCapacitorLevel: number;
  foodGranaryLevel: number;
  waterCisternLevel: number;
  darkMatterStasisLevel: number;
  autoCompressOverflow: boolean;
  compressionTier: number; // Level 1-5 (converts overflow to refined bullion/credits)
}

// ==========================================
// MASTER IMPERIAL UPGRADE SYSTEMS FOR EVERYTHING
// ==========================================

export type ImperialUpgradeCategory =
  | 'banking'
  | 'storage'
  | 'industrial'
  | 'energy_grid'
  | 'defenses'
  | 'logistics'
  | 'science'
  | 'workforce';

export interface ImperialUpgradeDefinition {
  id: string;
  key: string;
  name: string;
  category: ImperialUpgradeCategory;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: {
    metal: number;
    crystal: number;
    deuterium: number;
    naquadah: number;
    energy?: number;
    credits?: number;
  };
  costGrowth: number;
  icon: string;
  currentBenefit: string;
  nextBenefit: string;
  multiplierPerLevel: number;
  unit: string;
  tier: number;
  prerequisites?: string[];
}

export interface MasterUpgradesState {
  bank: BankVaultUpgradeState;
  storage: ResourceStorageUpgrades;
  // Industrial & Facilities
  roboticAssemblyLevel: number;
  naniteFabricatorLevel: number;
  deepMantleCoreLevel: number;
  atmosphericTerraformerLevel: number;
  // Defense & Shields
  planetaryShieldOverchargeLevel: number;
  pointDefenseRadarLevel: number;
  orbitalDefenseStationLevel: number;
  antiBombardmentBunkerLevel: number;
  // Logistics & Transporters
  subspaceHyperlaneLevel: number;
  autoResourceBalancerLevel: number;
  quantumSmugglingBafflerLevel: number;
  // Science & Acceleration
  synchrotronColliderLevel: number;
  neuralTrainingOverclockerLevel: number;
  exoticMateriaTransmuterLevel: number;
  // Workforce Automation
  workerAugmentationLevel: number;
  automatedMiningDronesLevel: number;
  hydrologicalPurityGridLevel: number;
}

// ==========================================
// NEMESIS SYSTEM (DYNAMIC RIVAL WARLORDS)
// ==========================================

export type NemesisRankTier = 'overlord' | 'warlord' | 'captain' | 'enforcer';

export type NemesisTraitType = 'strength' | 'weakness' | 'personality';

export interface NemesisTrait {
  id: string;
  name: string;
  type: NemesisTraitType;
  description: string;
  effect: string;
  icon?: string;
}

export interface NemesisMemory {
  id: string;
  timestamp: string;
  eventType:
    | 'player_defeat'
    | 'player_victory'
    | 'scarred'
    | 'promoted'
    | 'demoted'
    | 'spied'
    | 'shamed'
    | 'ambush'
    | 'betrayal'
    | 'tribute';
  text: string;
  powerImpact: number;
}

export interface PowerStruggleEvent {
  id: string;
  type: 'duel' | 'mutiny' | 'recruitment' | 'ambush' | 'execution' | 'sector_raid';
  title: string;
  description: string;
  attackerId: string;
  defenderId?: string;
  location: string;
  roundsRemaining: number;
  reward: {
    naquadah: number;
    metal: number;
    glory: number;
    darkMatter: number;
  };
}

export interface NemesisRival {
  id: string;
  name: string;
  title: string;
  race: string;
  rankTier: NemesisRankTier;
  hierarchyPosition: number; // 1 (Overlord), 2-4 (Warlord), 5-8 (Captain), 9-12 (Enforcer)
  level: number;
  power: number;
  health: number; // 0 - 100
  maxHealth: number;
  avatar: string;
  color: string;
  strengths: NemesisTrait[];
  weaknesses: NemesisTrait[];
  personality: string;
  taunts: {
    greeting: string;
    defeatPlayer: string;
    retreat: string;
    death: string;
  };
  history: NemesisMemory[];
  cyberneticsScars: string[];
  vassalOfPlayer: boolean;
  bounty: {
    active: boolean;
    rewardNaquadah: number;
    rewardMetal: number;
    rewardGlory: number;
    rewardDarkMatter: number;
  };
  killsOnPlayer: number;
  deathsToPlayer: number;
  lastEncounterAt: string;
  superiorId?: string;
  bodyguardIds?: string[];
  sectorTerritory?: string;
  shipClass?: string;
  deranged?: boolean;
  grudgeLevel?: number; // 0 - 100
  vassalRole?: 'none' | 'bodyguard' | 'infiltrator' | 'raider' | 'tribute_collector';
  vassalTributeAccumulated?: {
    naquadah: number;
    metal: number;
    darkMatter: number;
  };
  sabotaged?: boolean;
  beaconPlanted?: boolean;
  fleetComposition?: {
    flagship: string;
    escorts: number;
    fighters: number;
  };
}

export interface VendettaMission {
  id: string;
  nemesisId: string;
  title: string;
  description: string;
  type: 'assassinate' | 'humiliate' | 'infiltrate' | 'vassalize' | 'ambush_counter';
  reward: {
    naquadah: number;
    metal: number;
    glory: number;
    darkMatter: number;
  };
  status: 'active' | 'completed' | 'failed';
  turnsRemaining: number;
}

// ==========================================
// EMPIRE HISTORY CHRONICLE & EVENT LOG
// ==========================================

export type EmpireHistoryCategory =
  | 'colony_establishment'
  | 'tech_breakthrough'
  | 'imperial_decree'
  | 'galactic_battle'
  | 'admin_directive'
  | 'ascension_milestone';

export type EmpireHistorySignificance = 'routine' | 'major' | 'epoch_defining';

export interface EmpireHistoryImpact {
  label: string;
  value: string;
}

export interface EmpireHistoryEvent {
  id: string;
  timestamp: string;
  stardate: string;
  title: string;
  category: EmpireHistoryCategory;
  significance: EmpireHistorySignificance;
  rulerName: string;
  rulerRole?: string;
  coordinates?: string;
  description: string;
  impacts: EmpireHistoryImpact[];
  tags: string[];
  isCustomAdminEntry?: boolean;
}






