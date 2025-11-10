/**
 * Account Service Port (Interface)
 * Defines the contract for account management operations
 */

import type { DeleteAccountResult, DeleteAccountConfig } from "../../domain/types/AccountTypes";

export interface IAccountService {
  /**
   * Initialize the account service with Firebase Auth and configuration
   */
  initialize(auth: any, config: DeleteAccountConfig): void;

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean;

  /**
   * Delete user account and all associated data
   * @param userId - User ID to delete
   * @param password - User password for reauthentication
   */
  deleteAccount(userId: string, password: string): Promise<DeleteAccountResult>;
}

