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

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useAccount } from "./presentation/hooks/useAccount";
export type { UseAccountResult } from "./presentation/hooks/useAccount";

