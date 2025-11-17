/**
 * React Native Account - Public API
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This is the SINGLE SOURCE OF TRUTH for all Account operations.
 * ALL imports from the Account package MUST go through this file.
 *
 * Architecture:
 * - domain: Entities, value objects, errors (business logic)
 * - application: Ports (interfaces)
 * - infrastructure: Account service implementation
 * - presentation: Hooks (React integration)
 *
 * Usage:
 *   import { initializeAccountService, useAccount } from '@umituz/react-native-account';
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export {
  AccountError,
  AccountNotInitializedError,
  AccountAuthRequiredError,
  AccountReauthRequiredError,
  AccountDeletionError,
  AccountWrongPasswordError,
} from "./domain/errors/AccountError";

export type {
  DeleteAccountResult,
  DeleteAccountConfig,
} from "./domain/types/AccountTypes";

export type {
  UserProfile,
  UserProfileConfig,
  UserPreferences,
} from "./domain/types/UserProfileTypes";

// =============================================================================
// APPLICATION LAYER - Ports
// =============================================================================

export type { IAccountService } from "./application/ports/IAccountService";

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

export {
  AccountService,
  initializeAccountService,
  getAccountService,
  resetAccountService,
} from "./infrastructure/services/AccountService";

export {
  UserProfileService,
  initializeUserProfileService,
  getUserProfileService,
  resetUserProfileService,
} from "./infrastructure/services/UserProfileService";

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useAccount } from "./presentation/hooks/useAccount";
export type {
  UseAccountResult,
  LogoutOptions,
  LogoutResult,
} from "./presentation/hooks/useAccount";

