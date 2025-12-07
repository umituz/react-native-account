/**
 * useAccountSettings Types
 * Single Responsibility: Type definitions for account settings hook
 */

export interface UseAccountResult {
  loading?: boolean;
  error?: string | null;
  deleteAccount: (
    userId: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: { message: string };
  }>;
  clearError?: () => void;
}

export interface UseAccountSettingsConfig {
  useAuth: () => {
    user: { id: string } | null;
    isGuest: boolean;
    logout: () => Promise<void>;
  };
  useAccount: () => UseAccountResult;
  onLogoutSuccess?: () => void;
  onDeleteAccountSuccess?: () => void;
}

export interface UseAccountSettingsReturn {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}
