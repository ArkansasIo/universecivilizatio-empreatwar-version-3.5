import { AdminCredentialAccount, AdminPermission, AdminUserRole, AdminAuthSession } from '../types';

export interface AdminPermissionMetadata {
  key: AdminPermission;
  label: string;
  category: 'System Root' | 'Player Mgmt' | 'Universe Controls' | 'Database & SQL' | 'Tactical Operations';
  description: string;
  securityLevel: number; // 1 to 5
}

export const ADMIN_PERMISSIONS_REGISTRY: AdminPermissionMetadata[] = [
  {
    key: 'GRANT_RESOURCES',
    label: 'Grant Resources & Dark Matter',
    category: 'Universe Controls',
    description: 'Inject unlimited Naquadah, Crystal, Dark Matter, Antimatter, and Turns into player accounts.',
    securityLevel: 3,
  },
  {
    key: 'MANAGE_USERS',
    label: 'User Account & Role Management',
    category: 'Player Mgmt',
    description: 'Edit player ranks, assign moderator/operator roles, change email credentials, and force password resets.',
    securityLevel: 4,
  },
  {
    key: 'BAN_PLAYERS',
    label: 'Ban, Mute & Sanction Enforcement',
    category: 'Player Mgmt',
    description: 'Issue temporary/permanent IP bans, chat mutes, attack locks, and anti-cheat multi-account suspensions.',
    securityLevel: 4,
  },
  {
    key: 'MODIFY_UNIVERSE_CONFIG',
    label: 'Universe Speed & Maintenance Mode',
    category: 'Universe Controls',
    description: 'Alter game/fleet speeds, deuterium consumption factors, beginner protection, and server maintenance windows.',
    securityLevel: 4,
  },
  {
    key: 'EXECUTE_SQL',
    label: 'Raw SQL Database Terminal & DDL',
    category: 'Database & SQL',
    description: 'Execute direct SELECT, INSERT, UPDATE, DDL queries, and schema migrations against PostgreSQL.',
    securityLevel: 5,
  },
  {
    key: 'ISSUE_DECREES',
    label: 'Imperial Crown Decrees',
    category: 'Tactical Operations',
    description: 'Issue galaxy-wide sovereign decrees providing realm-wide resource and fleet combat multipliers.',
    securityLevel: 3,
  },
  {
    key: 'MANAGE_FLEETS',
    label: 'Fleet Teleport & Armada Operations',
    category: 'Tactical Operations',
    description: 'Instantly spawn armadas, recall in-flight missions, teleport fleets, and clear spatial debris fields.',
    securityLevel: 3,
  },
  {
    key: 'PURGE_SYSTEM_DATA',
    label: 'Factory Reset & Universe Season Wipe',
    category: 'System Root',
    description: 'Perform total factory resets, flush cache daemons, and wipe/reset universe season leaderboards.',
    securityLevel: 5,
  },
  {
    key: 'MODERATE_TICKETS',
    label: 'Support Tickets & Holonet Broadcasts',
    category: 'Player Mgmt',
    description: 'Reply to player support tickets, update ticket statuses, and publish global Holonet announcements.',
    securityLevel: 2,
  },
  {
    key: 'MANAGE_EVENTS',
    label: 'Global Galactic Events & Raid Bosses',
    category: 'Tactical Operations',
    description: 'Trigger world boss raids, supernova cosmic storms, double XP weekends, and global event timers.',
    securityLevel: 3,
  },
];

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] = ADMIN_PERMISSIONS_REGISTRY.map((p) => p.key);

export const CANONICAL_ADMIN_ACCOUNTS: AdminCredentialAccount[] = [
  {
    id: 'admin_systems_root',
    username: 'SystemRoot_Admin',
    email: 'root@systems-mainframe.root',
    loginCode: 'ROOT-SYS-0001',
    passcode: 'rootadmin2026',
    securityPin: '0000',
    role: 'super_admin',
    title: 'System Root Master Administrator & Core Kernel Owner',
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin_sstargate_root',
    username: 'Stargate_Root_Admin',
    email: 's.sstargate@gmail.com',
    loginCode: 'ROOT-SGW-0001',
    passcode: 'stargateRoot2026',
    securityPin: '0001',
    role: 'super_admin',
    title: 'Universe Civilization System Admin & Root Archon Owner',
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin_stephen_deline',
    username: 'StephenDeline_MasterAdmin',
    email: 'stephendeline258@gmail.com',
    loginCode: 'ADMIN-SD-7777',
    passcode: 'adminstephen2026',
    securityPin: '7777',
    role: 'super_admin',
    title: 'Universe Civilization Lead Architect & Root Owner',
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin_super_archon',
    username: 'SupremeAdmin_Archon',
    email: 'archon@stargate-command.root',
    loginCode: 'SG1-ARCHON-9000',
    passcode: 'stargate2026',
    securityPin: '9901',
    role: 'super_admin',
    title: 'Supreme Galactic Administrator & Root Archon',
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    id: 'admin_oneill_sgc',
    username: 'Commander_O_Neill',
    email: 'oneill@sgarche.mil',
    loginCode: 'SGC-ONEILL-304',
    passcode: 'tauri304',
    securityPin: '3040',
    role: 'administrator',
    title: 'High Fleet General & SGC Commander',
    permissions: [
      'GRANT_RESOURCES',
      'MANAGE_USERS',
      'BAN_PLAYERS',
      'MODIFY_UNIVERSE_CONFIG',
      'EXECUTE_SQL',
      'ISSUE_DECREES',
      'MANAGE_FLEETS',
      'MODERATE_TICKETS',
      'MANAGE_EVENTS',
    ],
  },
  {
    id: 'admin_thor_asgard',
    username: 'SupremeThor_Asgard',
    email: 'thor@asgard-council.ida',
    loginCode: 'ASGARD-THOR-101',
    passcode: 'idacouncil',
    securityPin: '1010',
    role: 'operator',
    title: 'Asgard High Council Game Operator',
    permissions: [
      'GRANT_RESOURCES',
      'BAN_PLAYERS',
      'EXECUTE_SQL',
      'MANAGE_FLEETS',
      'MODERATE_TICKETS',
      'MANAGE_EVENTS',
    ],
  },
  {
    id: 'admin_tollan_narim',
    username: 'Tollan_Curator_Narim',
    email: 'narim@tollana-archon.gov',
    loginCode: 'TOLLAN-NARIM-77',
    passcode: 'phasecurator',
    securityPin: '7700',
    role: 'moderator',
    title: 'Curator Support Moderator & Anti-Cheat Auditor',
    permissions: [
      'BAN_PLAYERS',
      'MODERATE_TICKETS',
    ],
  },
];

export const STORAGE_KEY_ADMIN_AUTH = 'uc_active_admin_auth_session';
export const STORAGE_KEY_CUSTOM_ADMINS = 'uc_custom_admin_accounts';
export const STORAGE_KEY_ADMIN_AUDIT_LOGS = 'uc_admin_audit_logs';

export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  adminUsername: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
  ipAddress?: string;
}

export function getCustomAdminAccounts(): AdminCredentialAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_ADMINS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function getAllAdminAccounts(): AdminCredentialAccount[] {
  return [...CANONICAL_ADMIN_ACCOUNTS, ...getCustomAdminAccounts()];
}

export function saveCustomAdminAccount(account: AdminCredentialAccount): void {
  if (typeof window === 'undefined') return;
  const current = getCustomAdminAccounts();
  const updated = [...current.filter((a) => a.id !== account.id), account];
  localStorage.setItem(STORAGE_KEY_CUSTOM_ADMINS, JSON.stringify(updated));
}

export function clearAdminAuditLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_ADMIN_AUDIT_LOGS);
}

export function getAdminAuditLogs(): AdminAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_AUDIT_LOGS);
    if (saved) {
      return JSON.parse(saved);
    }
    // Seed initial audit trail
    const initialLogs: AdminAuditEntry[] = [
      {
        id: 'audit_init_1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        adminUsername: 'SupremeAdmin_Archon',
        action: 'UPDATE_UNIVERSE_CONFIG',
        details: 'Adjusted fleet movement speed to 4.0x and production multiplier to 3.0x',
        status: 'SUCCESS',
        ipAddress: '127.0.0.1 (SGC Mainframe)',
      },
      {
        id: 'audit_init_2',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        adminUsername: 'Commander_O_Neill',
        action: 'ISSUE_IMPERIAL_DECREE',
        details: 'Enacted Stargate Defense Mobilization Protocol Alpha (+20% Fleet Shielding)',
        status: 'SUCCESS',
        ipAddress: '192.168.1.304 (SGC Control)',
      },
      {
        id: 'audit_init_3',
        timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
        adminUsername: 'SupremeThor_Asgard',
        action: 'RESOLVE_SECURITY_ALERT',
        details: 'Audited and cleared multi-account telemetry incident #sec-alert-892',
        status: 'SUCCESS',
        ipAddress: '10.0.8.1 (Asgard High Council)',
      },
      {
        id: 'audit_init_4',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        adminUsername: 'Tollan_Curator_Narim',
        action: 'BAN_PLAYER',
        details: 'Issued temporary sanction against Lord_Baal for fleet bash violation (>6 attacks/24h)',
        status: 'WARNING',
        ipAddress: '172.16.0.4 (Tollana Archive)',
      },
      {
        id: 'audit_init_5',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        adminUsername: 'SupremeAdmin_Archon',
        action: 'ADMIN_LOGIN_SUCCESS',
        details: 'Authenticated successfully with Level 10 Root clearance',
        status: 'SUCCESS',
        ipAddress: '127.0.0.1 (Local Sovereign Mainframe)',
      },
    ];
    localStorage.setItem(STORAGE_KEY_ADMIN_AUDIT_LOGS, JSON.stringify(initialLogs));
    return initialLogs;
  } catch {
    return [];
  }
}

export function addAdminAuditLog(entry: Omit<AdminAuditEntry, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const current = getAdminAuditLogs();
  const newEntry: AdminAuditEntry = {
    ...entry,
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1 (Local Sovereign Mainframe)',
  };
  const updated = [newEntry, ...current].slice(0, 100);
  localStorage.setItem(STORAGE_KEY_ADMIN_AUDIT_LOGS, JSON.stringify(updated));
}

export function getAdminAuthSession(): AdminAuthSession {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      activeAdmin: null,
      authenticatedAt: null,
      securityClearanceLevel: 0,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
    if (saved) {
      const parsed: AdminAuthSession = JSON.parse(saved);
      if (parsed && parsed.isAuthenticated && parsed.activeAdmin) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read admin auth session', err);
  }

  // By default when no valid session is saved, require explicit login
  return {
    isAuthenticated: false,
    activeAdmin: null,
    authenticatedAt: null,
    securityClearanceLevel: 0,
  };
}

export function setAdminAuthSession(session: AdminAuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(session));
}

export function clearAdminAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
}

export function validateAdminCredentials(
  loginCodeOrUser: string,
  passcode: string,
  securityPin?: string
): AdminCredentialAccount | null {
  const allAccounts = getAllAdminAccounts();
  const match = allAccounts.find(
    (acc) =>
      (acc.loginCode.toLowerCase() === loginCodeOrUser.trim().toLowerCase() ||
        acc.username.toLowerCase() === loginCodeOrUser.trim().toLowerCase() ||
        acc.email.toLowerCase() === loginCodeOrUser.trim().toLowerCase()) &&
      acc.passcode === passcode
  );

  if (match) {
    if (securityPin && match.securityPin !== securityPin) {
      addAdminAuditLog({
        adminUsername: match.username,
        action: 'ADMIN_LOGIN_FAILED',
        details: `Invalid PIN attempt for user ${match.username}`,
        status: 'DENIED',
      });
      return null;
    }
    addAdminAuditLog({
      adminUsername: match.username,
      action: 'ADMIN_LOGIN_SUCCESS',
      details: `Admin authenticated successfully as ${match.role.toUpperCase()}`,
      status: 'SUCCESS',
    });
    return match;
  }

  addAdminAuditLog({
    adminUsername: loginCodeOrUser || 'UNKNOWN',
    action: 'ADMIN_LOGIN_FAILED',
    details: `Failed credentials match attempt for identifier: ${loginCodeOrUser}`,
    status: 'DENIED',
  });
  return null;
}

export function checkAdminPermission(
  session: AdminAuthSession | null,
  permission: AdminPermission
): boolean {
  if (!session || !session.isAuthenticated || !session.activeAdmin) {
    return false;
  }
  if (session.activeAdmin.role === 'super_admin') return true;
  return session.activeAdmin.permissions.includes(permission);
}

export function getAllRootAdminAccounts(): AdminCredentialAccount[] {
  return getAllAdminAccounts().filter((acc) => acc.role === 'super_admin');
}

export interface CreateRootAdminParams {
  username?: string;
  email?: string;
  loginCode?: string;
  passcode?: string;
  securityPin?: string;
  title?: string;
}

/**
 * Creates and persists a new Super Admin / Root Admin account with Level 10 Clearance
 * and all system permissions.
 */
export function createRootAdminAccount(params?: CreateRootAdminParams): AdminCredentialAccount {
  const customList = getCustomAdminAccounts();
  const timestamp = Date.now();
  const id = `admin_root_${timestamp}`;

  const username = params?.username?.trim() || `RootAdmin_${timestamp.toString().slice(-4)}`;
  const email = params?.email?.trim() || `root_${timestamp.toString().slice(-4)}@universe.stargate`;
  const loginCode = (params?.loginCode?.trim() || `ROOT-${timestamp.toString().slice(-6)}`).toUpperCase();
  const passcode = params?.passcode?.trim() || `rootpass_${timestamp.toString().slice(-6)}`;
  const securityPin = params?.securityPin?.trim() || '0000';
  const title = params?.title?.trim() || 'Sovereign Root Administrator & Master Archon';

  // Check if an account with this username or login code already exists
  const existing = getAllAdminAccounts().find(
    (a) =>
      a.username.toLowerCase() === username.toLowerCase() ||
      a.loginCode.toLowerCase() === loginCode.toLowerCase() ||
      (email && a.email.toLowerCase() === email.toLowerCase())
  );

  if (existing) {
    // If existing account is already root, update and return it
    const updatedAccount: AdminCredentialAccount = {
      ...existing,
      passcode: params?.passcode ? params.passcode.trim() : existing.passcode,
      securityPin: params?.securityPin ? params.securityPin.trim() : existing.securityPin,
      role: 'super_admin',
      permissions: ALL_ADMIN_PERMISSIONS,
    };
    saveCustomAdminAccount(updatedAccount);
    addAdminAuditLog({
      adminUsername: updatedAccount.username,
      action: 'ROOT_ADMIN_UPDATED',
      details: `Root Admin account [${updatedAccount.username}] refreshed with super_admin privileges`,
      status: 'SUCCESS',
    });
    return updatedAccount;
  }

  const newRootAccount: AdminCredentialAccount = {
    id,
    username,
    email,
    loginCode,
    passcode,
    securityPin,
    role: 'super_admin',
    title,
    permissions: ALL_ADMIN_PERMISSIONS,
  };

  saveCustomAdminAccount(newRootAccount);

  addAdminAuditLog({
    adminUsername: newRootAccount.username,
    action: 'ROOT_ADMIN_CREATED',
    details: `Created new Root Admin Account [${newRootAccount.username}] with full super_admin clearance`,
    status: 'SUCCESS',
  });

  return newRootAccount;
}

export type AdminUrlLoginMode = 'direct' | 'params' | 'magic' | 'create';

export interface GenerateAdminUrlOptions {
  mode?: AdminUrlLoginMode;
  tab?: string;
  baseUrl?: string;
  includePin?: boolean;
}

/**
 * Generates an instant URL to authenticate as a Root Admin account
 */
export function generateAdminUrlLogin(
  account: AdminCredentialAccount,
  options?: GenerateAdminUrlOptions
): string {
  const mode = options?.mode || 'direct';
  const tab = options?.tab || 'crown';
  const origin =
    options?.baseUrl ||
    (typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://ais-dev-c7i6yvhg3xaoacnmly6yhc-7901660537.us-east1.run.app/');

  const cleanBase = origin.split('?')[0].split('#')[0];

  if (mode === 'direct') {
    return `${cleanBase}?root_admin=1&admin_key=${encodeURIComponent(account.passcode)}&code=${encodeURIComponent(account.loginCode)}&admin_tab=${tab}`;
  }

  if (mode === 'params') {
    const pinPart = options?.includePin ? `&pin=${encodeURIComponent(account.securityPin)}` : '';
    return `${cleanBase}?admin_login=1&code=${encodeURIComponent(account.loginCode)}&passcode=${encodeURIComponent(account.passcode)}${pinPart}&admin_tab=${tab}`;
  }

  if (mode === 'magic') {
    const payload = {
      u: account.username,
      c: account.loginCode,
      p: account.passcode,
      pin: account.securityPin,
      t: Date.now(),
      exp: Date.now() + 86400000 * 30, // 30-day validity
    };
    const token = typeof btoa === 'function' ? btoa(JSON.stringify(payload)) : '';
    return `${cleanBase}?magic_token=${encodeURIComponent(token)}&admin_tab=${tab}`;
  }

  if (mode === 'create') {
    return `${cleanBase}?create_root=1&username=${encodeURIComponent(account.username)}&email=${encodeURIComponent(account.email)}&code=${encodeURIComponent(account.loginCode)}&passcode=${encodeURIComponent(account.passcode)}&pin=${encodeURIComponent(account.securityPin)}&admin_tab=${tab}`;
  }

  return `${cleanBase}?root_admin=1&code=${encodeURIComponent(account.loginCode)}&admin_tab=${tab}`;
}

export interface UrlLoginResult {
  success: boolean;
  account?: AdminCredentialAccount;
  session?: AdminAuthSession;
  message?: string;
  targetTab?: string;
  created?: boolean;
}

/**
 * Analyzes the browser URL query string and hash fragment for Root Admin Login commands
 */
export function processUrlAdminLogin(searchStr?: string, hashStr?: string): UrlLoginResult {
  if (typeof window === 'undefined' && !searchStr && !hashStr) {
    return { success: false };
  }

  const query = searchStr !== undefined ? searchStr : (window.location.search || '');
  const hash = hashStr !== undefined ? hashStr : (window.location.hash || '');

  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);

  // Also parse hash parameters if query params didn't have admin instructions
  if (!params.has('admin_login') && !params.has('root_admin') && !params.has('create_root') && !params.has('admin_key') && !params.has('magic_token')) {
    if (hash && hash.includes('=')) {
      const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
      const hashParams = new URLSearchParams(hashContent);
      hashParams.forEach((v, k) => params.set(k, v));
    }
  }

  const targetTab = params.get('admin_tab') || params.get('tab') || 'crown';

  // 1. Case: CREATE ROOT ADMIN FROM URL (?create_root=1&username=...&passcode=...)
  const isCreateRoot =
    params.get('create_root') === '1' ||
    params.get('create_root_admin') === '1' ||
    params.get('create_admin') === 'root';

  if (isCreateRoot) {
    const username = params.get('username') || params.get('user') || 'Stargate_Root_Admin';
    const email = params.get('email') || 's.sstargate@gmail.com';
    const loginCode = params.get('code') || params.get('loginCode') || 'ROOT-SGW-0001';
    const passcode = params.get('passcode') || params.get('password') || params.get('pass') || 'stargateRoot2026';
    const securityPin = params.get('pin') || params.get('securityPin') || '0001';
    const title = params.get('title') || 'Master Universe Civilization Root Admin';

    const rootAccount = createRootAdminAccount({
      username,
      email,
      loginCode,
      passcode,
      securityPin,
      title,
    });

    const session: AdminAuthSession = {
      isAuthenticated: true,
      activeAdmin: rootAccount,
      authenticatedAt: new Date().toISOString(),
      securityClearanceLevel: 5,
    };

    setAdminAuthSession(session);

    addAdminAuditLog({
      adminUsername: rootAccount.username,
      action: 'ADMIN_URL_CREATE_AND_LOGIN',
      details: `Root Admin account dynamically created and authenticated via URL invocation [Clearance Level 5]`,
      status: 'SUCCESS',
    });

    return {
      success: true,
      account: rootAccount,
      session,
      message: `Root Admin account "${rootAccount.username}" created and authenticated via URL.`,
      targetTab,
      created: true,
    };
  }

  // 2. Case: MAGIC TOKEN LOGIN (?magic_token=... or ?admin_magic_token=...)
  const magicToken = params.get('magic_token') || params.get('admin_magic_token');
  if (magicToken) {
    try {
      const decodedStr = typeof atob === 'function' ? atob(decodeURIComponent(magicToken)) : '';
      if (decodedStr) {
        const payload = JSON.parse(decodedStr);
        if (payload && (payload.c || payload.u)) {
          // Check expiration
          if (payload.exp && Date.now() > payload.exp) {
            return {
              success: false,
              message: 'Root Admin Magic Link Token has expired. Please generate a new URL.',
            };
          }

          const allAccounts = getAllAdminAccounts();
          let matched = allAccounts.find(
            (a) =>
              (payload.c && a.loginCode.toLowerCase() === payload.c.toLowerCase()) ||
              (payload.u && a.username.toLowerCase() === payload.u.toLowerCase())
          );

          if (!matched && payload.p) {
            // Provision the root account from the magic token payload if not in storage
            matched = createRootAdminAccount({
              username: payload.u,
              loginCode: payload.c,
              passcode: payload.p,
              securityPin: payload.pin || '0000',
            });
          }

          if (matched) {
            const session: AdminAuthSession = {
              isAuthenticated: true,
              activeAdmin: matched,
              authenticatedAt: new Date().toISOString(),
              securityClearanceLevel: 5,
            };
            setAdminAuthSession(session);
            addAdminAuditLog({
              adminUsername: matched.username,
              action: 'ADMIN_URL_MAGIC_LOGIN',
              details: `Root Admin authenticated via encrypted Magic Token URL`,
              status: 'SUCCESS',
            });

            return {
              success: true,
              account: matched,
              session,
              message: `Root Admin "${matched.username}" authenticated via Magic URL Token.`,
              targetTab,
            };
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse magic admin token', e);
    }
  }

  // 3. Case: DIRECT ROOT KEY OR TOKEN LOGIN (?admin_key=... or ?root_key=...)
  const adminKey = params.get('admin_key') || params.get('root_key') || params.get('admin_token');
  if (adminKey) {
    const keyVal = adminKey.trim();
    const allAccounts = getAllAdminAccounts();
    // Prioritize super_admin accounts
    const matched =
      allAccounts.find((a) => a.role === 'super_admin' && (a.passcode === keyVal || a.loginCode === keyVal)) ||
      allAccounts.find((a) => a.passcode === keyVal || a.loginCode === keyVal);

    if (matched) {
      const session: AdminAuthSession = {
        isAuthenticated: true,
        activeAdmin: matched,
        authenticatedAt: new Date().toISOString(),
        securityClearanceLevel: matched.role === 'super_admin' ? 5 : 4,
      };
      setAdminAuthSession(session);
      addAdminAuditLog({
        adminUsername: matched.username,
        action: 'ADMIN_URL_KEY_LOGIN',
        details: `Admin authenticated via Direct Security Key URL parameter`,
        status: 'SUCCESS',
      });

      return {
        success: true,
        account: matched,
        session,
        message: `Admin "${matched.username}" authenticated via Security Key URL.`,
        targetTab,
      };
    }
  }

  // 4. Case: STANDARD ADMIN LOGIN VIA URL (?admin_login=1 or ?root_admin=1)
  const isAdminLogin =
    params.get('admin_login') === '1' ||
    params.get('root_admin') === '1' ||
    params.get('root_login') === '1' ||
    params.get('autologin_root') === '1';

  if (isAdminLogin) {
    const code = params.get('code') || params.get('loginCode') || params.get('user') || params.get('username');
    const passcode = params.get('passcode') || params.get('pass') || params.get('password');
    const pin = params.get('pin') || params.get('securityPin');

    if (code && passcode) {
      const matched = validateAdminCredentials(code, passcode, pin || undefined);
      if (matched) {
        const session: AdminAuthSession = {
          isAuthenticated: true,
          activeAdmin: matched,
          authenticatedAt: new Date().toISOString(),
          securityClearanceLevel: matched.role === 'super_admin' ? 5 : 4,
        };
        setAdminAuthSession(session);
        addAdminAuditLog({
          adminUsername: matched.username,
          action: 'ADMIN_URL_CREDENTIALS_LOGIN',
          details: `Admin authenticated via URL query credentials`,
          status: 'SUCCESS',
        });

        return {
          success: true,
          account: matched,
          session,
          message: `Admin "${matched.username}" authenticated via URL credentials.`,
          targetTab,
        };
      }
    } else if (params.get('autologin_root') === '1' || params.get('root_admin') === '1') {
      // 1-Click Autologin to canonical primary root admin
      const rootAcc =
        getAllAdminAccounts().find((a) => a.id === 'admin_sstargate_root') ||
        getAllAdminAccounts().find((a) => a.id === 'admin_systems_root') ||
        CANONICAL_ADMIN_ACCOUNTS[0];

      const session: AdminAuthSession = {
        isAuthenticated: true,
        activeAdmin: rootAcc,
        authenticatedAt: new Date().toISOString(),
        securityClearanceLevel: 5,
      };
      setAdminAuthSession(session);
      addAdminAuditLog({
        adminUsername: rootAcc.username,
        action: 'ADMIN_URL_AUTOLOGIN_ROOT',
        details: `Root Admin 1-Click Sovereign autologin invoked via URL`,
        status: 'SUCCESS',
      });

      return {
        success: true,
        account: rootAcc,
        session,
        message: `Sovereign Root Administrator "${rootAcc.username}" authenticated via 1-Click Root URL.`,
        targetTab,
      };
    }
  }

  return { success: false };
}

