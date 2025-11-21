/**
 * Account Service Implementation
 * Single Responsibility: Account service initialization and coordination
 */

import type { Auth } from "firebase/auth";
import type { IAccountService } from "../../application/ports/IAccountService";
import type {
  DeleteAccountResult,
  DeleteAccountConfig,
} from "../../domain/types/AccountTypes";
import { AccountNotInitializedError } from "../../domain/errors/AccountError";
import { AccountDeletionHandler } from "./AccountDeletionHandler";

export class AccountService implements IAccountService {
  private auth: Auth | null = null;
  private config: DeleteAccountConfig | null = null;
  private deletionHandler: AccountDeletionHandler;

  constructor() {
    this.deletionHandler = new AccountDeletionHandler();
  }

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

    try {
      return await this.deletionHandler.executeDeletion(
        auth,
        userId,
        password,
        config
      );
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

