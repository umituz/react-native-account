/**
 * Account Service Implementation
 * Firebase-based account management (delete account, update profile, etc.)
 */

import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type Auth,
} from "firebase/auth";
import type { IAccountService } from "../../application/ports/IAccountService";
import type {
  DeleteAccountResult,
  DeleteAccountConfig,
} from "../../domain/types/AccountTypes";
import {
  AccountNotInitializedError,
  AccountAuthRequiredError,
  AccountReauthRequiredError,
  AccountDeletionError,
  AccountWrongPasswordError,
} from "../../domain/errors/AccountError";

export class AccountService implements IAccountService {
  private auth: Auth | null = null;
  private config: DeleteAccountConfig | null = null;

  /**
   * Initialize account service with Firebase Auth and configuration
   */
  initialize(auth: Auth, config: DeleteAccountConfig): void {
    if (!auth) {
      throw new AccountNotInitializedError("Auth instance is required");
    }
    if (!config.onDeleteUserData || !config.onClearLocalStorage) {
      throw new AccountNotInitializedError(
        "onDeleteUserData and onClearLocalStorage callbacks are required"
      );
    }
    this.auth = auth;
    this.config = config;
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.auth !== null && this.config !== null;
  }

  private getAuth(): Auth {
    if (!this.auth) {
      throw new AccountNotInitializedError(
        "Account service is not initialized. Call initialize() first."
      );
    }
    return this.auth;
  }

  private getConfig(): DeleteAccountConfig {
    if (!this.config) {
      throw new AccountNotInitializedError(
        "Account service is not initialized. Call initialize() first."
      );
    }
    return this.config;
  }

  /**
   * Delete user account and all associated data
   */
  async deleteAccount(
    userId: string,
    password: string
  ): Promise<DeleteAccountResult> {
    const auth = this.getAuth();
    const config = this.getConfig();

    // Validate user is authenticated
    if (!auth.currentUser || auth.currentUser.uid !== userId) {
      return {
        success: false,
        error: { message: "User not authenticated", code: "AUTH_REQUIRED" },
      };
    }

    // Validate user has email (required for reauthentication)
    if (!auth.currentUser.email) {
      return {
        success: false,
        error: {
          message: "User email not found",
          code: "EMAIL_NOT_FOUND",
        },
        requiresReauth: true,
      };
    }

    try {
      // Step 0: Reauthenticate user (required by Firebase for sensitive operations)
      try {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      } catch (reauthError: any) {
        // Handle reauthentication errors
        if (config.onDeleteError) {
          await config
            .onDeleteError(
              reauthError instanceof Error
                ? reauthError
                : new Error("Reauthentication failed"),
              "AccountService.deleteAccount.reauthenticate"
            )
            .catch(() => {});
        }

        const isWrongPassword =
          reauthError.code === "auth/wrong-password" ||
          reauthError.code === "auth/invalid-credential";

        return {
          success: false,
          error: {
            message: isWrongPassword
              ? "Incorrect password. Please try again."
              : reauthError.message || "Reauthentication failed",
            code: reauthError.code || "REAUTH_FAILED",
          },
          requiresReauth: true,
        };
      }

      // Step 1: Delete all user data from database (app-specific callback)
      try {
        await config.onDeleteUserData(userId);
      } catch (dataError: any) {
        if (config.onDeleteError) {
          await config
            .onDeleteError(
              dataError instanceof Error
                ? dataError
                : new Error("Failed to delete user data"),
              "AccountService.deleteAccount.deleteUserData"
            )
            .catch(() => {});
        }
        throw new AccountDeletionError(
          `Failed to delete user data: ${dataError.message || "Unknown error"}`
        );
      }

      // Step 2: Clear local storage (app-specific callback)
      try {
        await config.onClearLocalStorage();
      } catch (storageError: any) {
        if (config.onDeleteError) {
          await config
            .onDeleteError(
              storageError instanceof Error
                ? storageError
                : new Error("Failed to clear local storage"),
              "AccountService.deleteAccount.clearLocalStorage"
            )
            .catch(() => {});
        }
        // Don't fail deletion if storage cleanup fails - continue to delete auth account
      }

      // Step 3: Delete Firebase Auth user account (must be last)
      try {
        await deleteUser(auth.currentUser);
      } catch (authDeleteError: any) {
        if (config.onDeleteError) {
          await config
            .onDeleteError(
              authDeleteError instanceof Error
                ? authDeleteError
                : new Error("Failed to delete auth account"),
              "AccountService.deleteAccount.deleteAuthAccount"
            )
            .catch(() => {});
        }
        throw new AccountDeletionError(
          `Failed to delete auth account: ${authDeleteError.message || "Unknown error"}`
        );
      }

      // Step 4: Call onAccountDeleted callback (optional)
      if (config.onAccountDeleted) {
        await config.onAccountDeleted(userId).catch(() => {
          // Silent fail - callback errors should not fail the deletion
        });
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      if (config.onDeleteError) {
        await config
          .onDeleteError(
            error instanceof Error
              ? error
              : new Error("Failed to delete account"),
            "AccountService.deleteAccount"
          )
          .catch(() => {});
      }

      return {
        success: false,
        error: {
          message: errorMessage,
          code: error.code || "DELETE_FAILED",
        },
      };
    }
  }
}

/**
 * Singleton instance
 */
let accountServiceInstance: AccountService | null = null;

/**
 * Initialize account service
 */
export function initializeAccountService(
  auth: any,
  config: DeleteAccountConfig
): AccountService {
  if (!accountServiceInstance) {
    accountServiceInstance = new AccountService();
  }
  accountServiceInstance.initialize(auth, config);
  return accountServiceInstance;
}

/**
 * Get account service instance
 */
export function getAccountService(): AccountService | null {
  if (!accountServiceInstance || !accountServiceInstance.isInitialized()) {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.warn(
        "Account service is not initialized. Call initializeAccountService() first."
      );
    }
    return null;
  }
  return accountServiceInstance;
}

/**
 * Reset account service (useful for testing)
 */
export function resetAccountService(): void {
  accountServiceInstance = null;
}

