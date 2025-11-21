/**
 * User Profile Service Implementation
 * Single Responsibility: User profile service initialization and coordination
 */

import type { Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";
import type {
  UserProfile,
  UserProfileConfig,
  UserPreferences,
} from "../../domain/types/UserProfileTypes";
import { AccountNotInitializedError } from "../../domain/errors/AccountError";
import { UserProfileRepository } from "./UserProfileRepository";

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "en",
  notifications: true,
};

export class UserProfileService {
  private firestore: Firestore | null = null;
  private config: UserProfileConfig | null = null;
  private repository: UserProfileRepository | null = null;

  /**
   * Initialize user profile service with Firestore and configuration
   */
  initialize(firestore: Firestore, config?: UserProfileConfig): void {
    if (!firestore) {
      throw new AccountNotInitializedError("Firestore instance is required");
    }
    this.firestore = firestore;
    this.config = config || {};
    this.repository = new UserProfileRepository(
      firestore,
      this.getCollectionName()
    );
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.firestore !== null && this.repository !== null;
  }

  private getRepository(): UserProfileRepository {
    if (!this.repository) {
      throw new AccountNotInitializedError(
        "User profile service is not initialized. Call initialize() first."
      );
    }
    return this.repository;
  }

  private getCollectionName(): string {
    return this.config?.collectionName || "users";
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      ...DEFAULT_PREFERENCES,
      ...this.config?.defaultPreferences,
    };
  }

  /**
   * Load user profile from Firestore
   */
  async loadUserProfile(user: User): Promise<UserProfile | null> {
    const repository = this.getRepository();
    const profile = await repository.loadUserProfile(
      user.uid,
      this.getDefaultPreferences()
    );

    if (profile) {
      // Merge with user data from auth
      const mergedProfile: UserProfile = {
        ...profile,
        email: profile.email || user.email || "",
        displayName: profile.displayName || user.displayName || "",
        photoURL: profile.photoURL || user.photoURL || null,
        metadata: profile.metadata || this.config?.defaultMetadata || {},
      };

      if (this.config?.onProfileLoaded) {
        this.config.onProfileLoaded(mergedProfile);
      }

      return mergedProfile;
    }

    return null;
  }

  /**
   * Create user profile in Firestore
   */
  async createUserProfile(
    user: User,
    displayName?: string
  ): Promise<UserProfile> {
    const repository = this.getRepository();

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: displayName || user.displayName || "",
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: this.getDefaultPreferences(),
      metadata: this.config?.defaultMetadata || {},
    };

    try {
      await repository.createUserProfile(profile);

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
    const repository = this.getRepository();
    await repository.updateUserProfile(userId, updates);
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    const repository = this.getRepository();
    await repository.updateLastLogin(userId);
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

