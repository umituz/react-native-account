/**
 * useAccount Hook
 * React hook for account management operations
 */

import { useState, useCallback } from "react";
import { getAccountService } from "../../infrastructure/services/AccountService";
import type { DeleteAccountResult } from "../../domain/types/AccountTypes";

export interface LogoutOptions {
  /** App identifier for storage cleanup */
  appId: string;
  /** Storage keys to clear */
  storageKeys?: string[];
  /** Clear all storage for this app */
  clearAllStorage?: boolean;
  /** Custom callbacks */
  callbacks?: {
    onBeforeCleanup?: () => Promise<void> | void;
    onAfterCleanup?: () => Promise<void> | void;
    onCleanupError?: (error: Error) => Promise<void> | void;
  };
}

export interface LogoutResult {
  success: boolean;
  errors: Error[];
  clearedKeys: string[];
}

export interface UseAccountResult {
  /** Loading state */
  loading: boolean;

  /** Error message */
  error: string | null;

  /** Delete account function */
  deleteAccount: (userId: string, password: string) => Promise<DeleteAccountResult>;

  /** Logout function (signs out from auth + cleans storage) */
  logout: (options: LogoutOptions) => Promise<LogoutResult>;

  /** Clear error */
  clearError: () => void;
}

/**
 * Hook for account management operations
 *
 * @example
 * ```typescript
 * const { deleteAccount, logout, loading, error } = useAccount();
 *
 * // Delete account
 * const handleDelete = async () => {
 *   const result = await deleteAccount(userId, password);
 *   if (result.success) {
 *     // Account deleted successfully
 *   }
 * };
 *
 * // Logout
 * const handleLogout = async () => {
 *   const result = await logout({
 *     appId: 'myapp',
 *     storageKeys: ['decks', 'sessions'],
 *   });
 * };
 * ```
 */
export function useAccount(): UseAccountResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useCallback(
    async (userId: string, password: string): Promise<DeleteAccountResult> => {
      const service = getAccountService();
      if (!service) {
        const errorResult: DeleteAccountResult = {
          success: false,
          error: {
            message: "Account service is not initialized",
            code: "NOT_INITIALIZED",
          },
        };
        setError(errorResult.error!.message);
        return errorResult;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await service.deleteAccount(userId, password);

        if (!result.success && result.error) {
          setError(result.error.message);
        }

        return result;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to delete account";
        setError(errorMessage);
        return {
          success: false,
          error: { message: errorMessage },
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(
    async (options: LogoutOptions): Promise<LogoutResult> => {
      setLoading(true);
      setError(null);

      const result: LogoutResult = {
        success: true,
        errors: [],
        clearedKeys: [],
      };

      try {
        // Step 1: Sign out from auth (if available)
        try {
          // Try to import and use auth service
          const { getAuthService } = await import("@umituz/react-native-auth");
          const authService = getAuthService();
          if (authService) {
            await authService.signOut();
          }
        } catch (authError) {
          // Auth service not available - continue with storage cleanup
          result.errors.push(
            authError instanceof Error
              ? authError
              : new Error("Auth service not available")
          );
        }

        // Step 2: Clean storage (if logout service available)
        try {
          const { logoutService } = await import("@umituz/react-native-logout");
          const logoutResult = await logoutService.logout({
            appId: options.appId,
            storageKeys: options.storageKeys,
            clearAllStorage: options.clearAllStorage,
            callbacks: options.callbacks,
          });
          result.clearedKeys = logoutResult.clearedKeys;
          result.errors.push(...logoutResult.errors);
        } catch (logoutError) {
          // Logout service not available - continue
          result.errors.push(
            logoutError instanceof Error
              ? logoutError
              : new Error("Logout service not available")
          );
        }

        result.success = result.errors.length === 0;
      } catch (err: any) {
        result.success = false;
        result.errors.push(
          err instanceof Error ? err : new Error("Logout failed")
        );
        const errorMessage = err.message || "Failed to logout";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }

      return result;
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    deleteAccount,
    logout,
    clearError,
  };
}

