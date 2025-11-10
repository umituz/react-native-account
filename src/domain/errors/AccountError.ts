/**
 * Account Error Types
 * Domain-specific error classes for account operations
 */

export class AccountError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AccountError";
    Object.setPrototypeOf(this, AccountError.prototype);
  }
}

export class AccountNotInitializedError extends AccountError {
  constructor(message: string = "Account service is not initialized") {
    super(message, "ACCOUNT_NOT_INITIALIZED");
    this.name = "AccountNotInitializedError";
    Object.setPrototypeOf(this, AccountNotInitializedError.prototype);
  }
}

export class AccountAuthRequiredError extends AccountError {
  constructor(message: string = "User authentication required") {
    super(message, "ACCOUNT_AUTH_REQUIRED");
    this.name = "AccountAuthRequiredError";
    Object.setPrototypeOf(this, AccountAuthRequiredError.prototype);
  }
}

export class AccountReauthRequiredError extends AccountError {
  constructor(message: string = "Reauthentication required for this operation") {
    super(message, "ACCOUNT_REAUTH_REQUIRED");
    this.name = "AccountReauthRequiredError";
    Object.setPrototypeOf(this, AccountReauthRequiredError.prototype);
  }
}

export class AccountDeletionError extends AccountError {
  constructor(message: string = "Failed to delete account") {
    super(message, "ACCOUNT_DELETION_FAILED");
    this.name = "AccountDeletionError";
    Object.setPrototypeOf(this, AccountDeletionError.prototype);
  }
}

export class AccountWrongPasswordError extends AccountError {
  constructor(message: string = "Incorrect password") {
    super(message, "ACCOUNT_WRONG_PASSWORD");
    this.name = "AccountWrongPasswordError";
    Object.setPrototypeOf(this, AccountWrongPasswordError.prototype);
  }
}

