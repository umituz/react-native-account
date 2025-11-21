/**
 * Account Deletion Handler
 * Single Responsibility: Handle account deletion flow
 */

import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type Auth,
} from "firebase/auth";
import type {
  DeleteAccountResult,
  DeleteAccountConfig,
} from "../../domain/types/AccountTypes";
import { AccountDeletionError } from "../../domain/errors/AccountError";

export class AccountDeletionHandler {
  /**
   * Reauthenticate user before deletion
   */
  async reauthenticate(
    auth: Auth,
    password: string,
    config: DeleteAccountConfig
  ): Promise<{ success: boolean; error?: { message: string; code: string } }> {
    if (!auth.currentUser?.email) {
      return {
        success: false,
        error: {
          message: "User email not found",
          code: "EMAIL_NOT_FOUND",
        },
      };
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      return { success: true };
    } catch (reauthError: any) {
      if (config.onDeleteError) {
        await config
          .onDeleteError(
            reauthError instanceof Error
              ? reauthError
              : new Error("Reauthentication failed"),
            "AccountDeletionHandler.reauthenticate"
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
      };
    }
  }

  /**
   * Delete user data from database
   */
  async deleteUserData(
    userId: string,
    config: DeleteAccountConfig
  ): Promise<void> {
    try {
      await config.onDeleteUserData(userId);
    } catch (dataError: any) {
      if (config.onDeleteError) {
        await config
          .onDeleteError(
            dataError instanceof Error
              ? dataError
              : new Error("Failed to delete user data"),
            "AccountDeletionHandler.deleteUserData"
          )
          .catch(() => {});
      }
      throw new AccountDeletionError(
        `Failed to delete user data: ${dataError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Clear local storage
   */
  async clearLocalStorage(config: DeleteAccountConfig): Promise<void> {
    try {
      await config.onClearLocalStorage();
    } catch (storageError: any) {
      if (config.onDeleteError) {
        await config
          .onDeleteError(
            storageError instanceof Error
              ? storageError
              : new Error("Failed to clear local storage"),
            "AccountDeletionHandler.clearLocalStorage"
          )
          .catch(() => {});
      }
      // Don't fail deletion if storage cleanup fails
    }
  }

  /**
   * Delete Firebase Auth account
   */
  async deleteAuthAccount(
    auth: Auth,
    config: DeleteAccountConfig
  ): Promise<void> {
    if (!auth.currentUser) {
      throw new AccountDeletionError("No authenticated user found");
    }

    try {
      await deleteUser(auth.currentUser);
    } catch (authDeleteError: any) {
      if (config.onDeleteError) {
        await config
          .onDeleteError(
            authDeleteError instanceof Error
              ? authDeleteError
              : new Error("Failed to delete auth account"),
            "AccountDeletionHandler.deleteAuthAccount"
          )
          .catch(() => {});
      }
      throw new AccountDeletionError(
        `Failed to delete auth account: ${authDeleteError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Execute account deletion flow
   */
  async executeDeletion(
    auth: Auth,
    userId: string,
    password: string,
    config: DeleteAccountConfig
  ): Promise<DeleteAccountResult> {
    // Step 0: Reauthenticate
    const reauthResult = await this.reauthenticate(auth, password, config);
    if (!reauthResult.success) {
      return {
        success: false,
        error: reauthResult.error!,
        requiresReauth: true,
      };
    }

    // Step 1: Delete user data
    await this.deleteUserData(userId, config);

    // Step 2: Clear local storage
    await this.clearLocalStorage(config);

    // Step 3: Delete auth account
    await this.deleteAuthAccount(auth, config);

    // Step 4: Call onAccountDeleted callback
    if (config.onAccountDeleted) {
      await config.onAccountDeleted(userId).catch(() => {
        // Silent fail - callback errors should not fail the deletion
      });
    }

    return { success: true };
  }
}

