/**
 * Account Domain Types
 * Core types for account management operations
 */

export interface DeleteAccountResult {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
  requiresReauth?: boolean;
}

export interface DeleteAccountConfig {
  /**
   * Callback to delete user data from database
   * Must delete all user-related data (profiles, content, etc.)
   */
  onDeleteUserData: (userId: string) => Promise<void>;

  /**
   * Callback to clear local storage data
   * Must clear all app-specific local data
   */
  onClearLocalStorage: () => Promise<void>;

  /**
   * Optional: Callback after successful account deletion
   * Use for cleanup, analytics, etc.
   */
  onAccountDeleted?: (userId: string) => Promise<void>;

  /**
   * Optional: Callback when deletion fails
   * Use for error tracking, analytics, etc.
   */
  onDeleteError?: (error: Error, context: string) => Promise<void>;
}

