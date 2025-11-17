/**
 * User Profile Service Implementation
 * Firebase-based user profile and quota management
 */

import type { Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type {
  UserProfile,
  UserProfileConfig,
  UserPreferences,
} from "../../domain/types/UserProfileTypes";
import { AccountNotInitializedError } from "../../domain/errors/AccountError";

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "en",
  notifications: true,
};

export class UserProfileService {
  private firestore: Firestore | null = null;
  private config: UserProfileConfig | null = null;

  /**
   * Initialize user profile service with Firestore and configuration
   */
  initialize(firestore: Firestore, config?: UserProfileConfig): void {
    if (!firestore) {
      throw new AccountNotInitializedError("Firestore instance is required");
    }
    this.firestore = firestore;
    this.config = config || {};
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.firestore !== null;
  }

  private getFirestore(): Firestore {
    if (!this.firestore) {
      throw new AccountNotInitializedError(
        "User profile service is not initialized. Call initialize() first."
      );
    }
    return this.firestore;
  }

  private getCollectionName(): string {
    return this.config?.collectionName || "users";
  }

  /**
   * Load user profile from Firestore
   */
  async loadUserProfile(user: User): Promise<UserProfile | null> {
    const db = this.getFirestore();
    const collectionName = this.getCollectionName();

    try {
      const userRef = doc(db, collectionName, user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const profile: UserProfile = {
          uid: data.uid || user.uid,
          email: data.email || user.email || "",
          displayName: data.displayName || user.displayName || "",
          photoURL: data.photoURL || user.photoURL || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          preferences: data.preferences || {
            ...DEFAULT_PREFERENCES,
            ...this.config?.defaultPreferences,
          },
          metadata: data.metadata || this.config?.defaultMetadata || {},
        };

        if (this.config?.onProfileLoaded) {
          this.config.onProfileLoaded(profile);
        }

        return profile;
      }

      return null;
    } catch (error) {
      // Silent fail - profile loading is not critical
      return null;
    }
  }

  /**
   * Create user profile in Firestore
   */
  async createUserProfile(
    user: User,
    displayName?: string
  ): Promise<UserProfile> {
    const db = this.getFirestore();
    const collectionName = this.getCollectionName();

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName || user.displayName || "",
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...this.config?.defaultPreferences,
      },
      metadata: this.config?.defaultMetadata || {},
    };

    try {
      const userRef = doc(db, collectionName, user.uid);
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });

      if (this.config?.onProfileCreated) {
        this.config.onProfileCreated(profile);
      }

      return profile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile in Firestore
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    const db = this.getFirestore();
    const collectionName = this.getCollectionName();

    try {
      const userRef = doc(db, collectionName, userId);
      await updateDoc(userRef, updates);

      // Callback is handled by the store/hook
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    const db = this.getFirestore();
    const collectionName = this.getCollectionName();

    try {
      const userRef = doc(db, collectionName, userId);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      // Silent fail - not critical
    }
  }

}

/**
 * Singleton instance
 */
let userProfileServiceInstance: UserProfileService | null = null;

/**
 * Initialize user profile service
 */
export function initializeUserProfileService(
  firestore: Firestore,
  config?: UserProfileConfig
): UserProfileService {
  if (!userProfileServiceInstance) {
    userProfileServiceInstance = new UserProfileService();
  }
  userProfileServiceInstance.initialize(firestore, config);
  return userProfileServiceInstance;
}

/**
 * Get user profile service instance
 */
export function getUserProfileService(): UserProfileService | null {
  if (!userProfileServiceInstance || !userProfileServiceInstance.isInitialized()) {
    return null;
  }
  return userProfileServiceInstance;
}

/**
 * Reset user profile service (useful for testing)
 */
export function resetUserProfileService(): void {
  userProfileServiceInstance = null;
}

