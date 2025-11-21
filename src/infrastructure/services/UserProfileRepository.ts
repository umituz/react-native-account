/**
 * User Profile Repository
 * Single Responsibility: Firestore operations for user profiles
 */

import type { Firestore } from "firebase/firestore";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type {
  UserProfile,
  UserPreferences,
} from "../../domain/types/UserProfileTypes";
import { AccountNotInitializedError } from "../../domain/errors/AccountError";

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "en",
  notifications: true,
};

export class UserProfileRepository {
  private firestore: Firestore | null = null;
  private collectionName: string;

  constructor(firestore: Firestore, collectionName: string) {
    if (!firestore) {
      throw new AccountNotInitializedError("Firestore instance is required");
    }
    this.firestore = firestore;
    this.collectionName = collectionName;
  }

  private getFirestore(): Firestore {
    if (!this.firestore) {
      throw new AccountNotInitializedError(
        "User profile repository is not initialized"
      );
    }
    return this.firestore;
  }

  /**
   * Load user profile from Firestore
   */
  async loadUserProfile(
    userId: string,
    defaultPreferences?: UserPreferences
  ): Promise<UserProfile | null> {
    const db = this.getFirestore();

    try {
      const userRef = doc(db, this.collectionName, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          uid: data.uid || userId,
          email: data.email || "",
          displayName: data.displayName || "",
          photoURL: data.photoURL || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          preferences: data.preferences || defaultPreferences || DEFAULT_PREFERENCES,
          metadata: data.metadata || {},
        };
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
    profile: UserProfile
  ): Promise<void> {
    const db = this.getFirestore();

    try {
      const userRef = doc(db, this.collectionName, profile.uid);
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
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

    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, updates);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    const db = this.getFirestore();

    try {
      const userRef = doc(db, this.collectionName, userId);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      // Silent fail - not critical
    }
  }
}

