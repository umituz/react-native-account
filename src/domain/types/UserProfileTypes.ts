/**
 * User Profile Domain Types
 * Core types for user profile management
 * Generic types that work for all apps - no app-specific fields
 */

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  language?: string;
  notifications?: boolean;
  [key: string]: any; // Allow apps to add custom preferences
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  preferences?: UserPreferences;
  metadata?: Record<string, any>; // Generic metadata for app-specific data
}

export interface UserProfileConfig {
  /**
   * Default user preferences
   */
  defaultPreferences?: Partial<UserPreferences>;

  /**
   * Firestore collection name for user profiles
   * Default: "users"
   */
  collectionName?: string;

  /**
   * Default metadata for new profiles
   */
  defaultMetadata?: Record<string, any>;

  /**
   * Callback when profile is loaded
   */
  onProfileLoaded?: (profile: UserProfile) => void;

  /**
   * Callback when profile is created
   */
  onProfileCreated?: (profile: UserProfile) => void;

  /**
   * Callback when profile is updated
   */
  onProfileUpdated?: (profile: UserProfile) => void;
}

