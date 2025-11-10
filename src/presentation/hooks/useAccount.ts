/**
 * useAccount Hook
 * React hook for account management operations
 */

import { useState, useCallback } from "react";
import { getAccountService } from "../../infrastructure/services/AccountService";
import type { DeleteAccountResult } from "../../domain/types/AccountTypes";

export interface UseAccountResult {
  /** Loading state */
  loading: boolean;

  /** Error message */
  error: string | null;

  /** Delete account function */
  deleteAccount: (userId: string, password: string) => Promise<DeleteAccountResult>;

  /** Clear error */
  clearError: () => void;
}

/**
 * Hook for account management operations
 *
 * @example
 * ```typescript
 * const { deleteAccount, loading, error } = useAccount();
 *
 * const handleDelete = async () => {
 *   const result = await deleteAccount(userId, password);
 *   if (result.success) {
 *     // Account deleted successfully
 *   }
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    deleteAccount,
    clearError,
  };
}

