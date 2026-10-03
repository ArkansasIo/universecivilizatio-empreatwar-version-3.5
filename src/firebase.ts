import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId || '(default)'
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
  }
})();
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function saveUserDataToFirestore(
  userId: string,
  profileData: any,
  resourcesData: any
) {
  // Use currently authenticated Firebase user ID if present to ensure rules authorization match
  const currentAuthUser = auth.currentUser;
  const targetUid = currentAuthUser ? currentAuthUser.uid : userId;
  if (!targetUid) return;

  // If there is no authenticated Firebase session, do not attempt to write to Firestore
  // because firestore rules require request.auth.uid == userId
  if (!currentAuthUser) {
    // Gracefully stored in localStorage, no error needed
    return;
  }

  try {
    const profileRef = doc(db, 'users', targetUid, 'profile', 'main');
    await setDoc(profileRef, {
      id: targetUid,
      username: profileData.username || 'Commander',
      email: currentAuthUser.email || profileData.email || `${targetUid}@stargate.command`,
      race: profileData.race || 'Tau\'ri',
      empireName: profileData.empireName || 'Imperial Sovereignty',
      capitalName: profileData.capitalName || 'Homeworld Alpha',
      leaderTitle: profileData.leaderTitle || 'Fleet Admiral',
      level: profileData.level || 1,
      rank: profileData.rank || 'Commander',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    const resourcesRef = doc(db, 'users', targetUid, 'resources', 'main');
    await setDoc(resourcesRef, {
      userId: targetUid,
      turns: resourcesData.turns ?? 100,
      naquadah: resourcesData.naquadah ?? 100000,
      crystal: resourcesData.crystal ?? 50000,
      trinium: resourcesData.trinium ?? 25000,
      energy: resourcesData.energy ?? 1000,
      bankedNaquadah: resourcesData.bankedNaquadah ?? 0,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    // Non-blocking in UI, logs Firestore error safely
    console.warn('Sync to Firestore deferred:', (error as any)?.message || error);
  }
}

export async function loadUserDataFromFirestore(userId: string) {
  if (!userId) return null;
  try {
    const profileRef = doc(db, 'users', userId, 'profile', 'main');
    const resourcesRef = doc(db, 'users', userId, 'resources', 'main');
    const [profileSnap, resourcesSnap] = await Promise.all([
      getDoc(profileRef),
      getDoc(resourcesRef),
    ]);

    return {
      profile: profileSnap.exists() ? profileSnap.data() : null,
      resources: resourcesSnap.exists() ? resourcesSnap.data() : null,
    };
  } catch (error) {
    console.warn('Load from Firestore deferred:', error);
    return null;
  }
}

/**
 * Persists an authorized admin root account document to the Firestore /admins collection
 */
export async function syncAdminToFirestore(adminData: {
  id: string;
  username: string;
  email: string;
  role: string;
  title: string;
  permissions: string[];
}) {
  const currentAuthUser = auth.currentUser;
  const adminDocId = currentAuthUser ? currentAuthUser.uid : adminData.id;
  try {
    const adminRef = doc(db, 'admins', adminDocId);
    await setDoc(
      adminRef,
      {
        id: adminDocId,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role,
        title: adminData.title,
        permissions: adminData.permissions,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Admin sync to Firestore deferred:', error);
  }
}

/**
 * Checks if a given user UID or email has verified root admin privileges in Firestore
 */
export async function verifyAdminStatusInFirestore(uid: string): Promise<boolean> {
  if (!uid) return false;
  try {
    const adminRef = doc(db, 'admins', uid);
    const snap = await getDoc(adminRef);
    return snap.exists();
  } catch {
    return false;
  }
}

