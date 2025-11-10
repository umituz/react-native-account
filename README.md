# @umituz/react-native-account

Account management for React Native apps - Delete account, update profile, manage user data.

## Features

- ✅ **Delete Account**: Complete account deletion with Firebase Auth
- ✅ **Reauthentication**: Secure password verification before deletion
- ✅ **App-Specific Callbacks**: Flexible data deletion via callbacks
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **DDD Architecture**: Clean, maintainable code structure
- ✅ **React Hook**: Easy integration with `useAccount()`
- ✅ **Error Handling**: Comprehensive error types and messages

## Installation

```bash
npm install @umituz/react-native-account
```

## Peer Dependencies

```json
{
  "firebase": ">=11.0.0",
  "react": ">=18.2.0",
  "react-native": ">=0.74.0"
}
```

## Usage

### 1. Initialize the Service

```typescript
import { initializeAccountService } from '@umituz/react-native-account';
import { getFirebaseAuth } from '@/domains/firebase';

// Initialize in your app startup (e.g., App.tsx or appInitializer.ts)
const auth = getFirebaseAuth();

initializeAccountService(auth, {
  // Delete all user data from your database
  onDeleteUserData: async (userId: string) => {
    // Delete user profiles, content, etc. from Firestore/Supabase
    await userRepository.delete(userId);
    await userContentRepository.deleteAll(userId);
  },

  // Clear all local storage data
  onClearLocalStorage: async () => {
    await AsyncStorage.removeItem('user_data');
    await AsyncStorage.removeItem('user_preferences');
  },

  // Optional: Analytics, cleanup, etc.
  onAccountDeleted: async (userId: string) => {
    await analyticsService.logAccountDeleted();
  },

  // Optional: Error tracking
  onDeleteError: async (error: Error, context: string) => {
    await crashlyticsService.logError(error, context);
  },
});
```

### 2. Use the Hook

```typescript
import { useAccount } from '@umituz/react-native-account';

function DeleteAccountScreen() {
  const { deleteAccount, loading, error } = useAccount();
  const [password, setPassword] = useState('');

  const handleDelete = async () => {
    const result = await deleteAccount(userId, password);

    if (result.success) {
      // Account deleted successfully
      navigation.replace('Welcome');
    } else if (result.requiresReauth) {
      // Show password error
      Alert.alert('Error', result.error?.message || 'Incorrect password');
    } else {
      // Show general error
      Alert.alert('Error', result.error?.message || 'Failed to delete account');
    }
  };

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password to confirm"
        secureTextEntry
      />
      <Button
        title="Delete Account"
        onPress={handleDelete}
        disabled={loading || !password}
      />
      {error && <Text>{error}</Text>}
    </View>
  );
}
```

## API Reference

### `initializeAccountService(auth, config)`

Initialize the account service with Firebase Auth and configuration.

**Parameters:**
- `auth` (Auth): Firebase Auth instance
- `config` (DeleteAccountConfig): Configuration callbacks

**Returns:** `AccountService`

### `useAccount()`

React hook for account management operations.

**Returns:** `UseAccountResult`
- `loading` (boolean): Loading state
- `error` (string | null): Error message
- `deleteAccount` (function): Delete account function
- `clearError` (function): Clear error function

### `deleteAccount(userId, password)`

Delete user account and all associated data.

**Parameters:**
- `userId` (string): User ID to delete
- `password` (string): User password for reauthentication

**Returns:** `Promise<DeleteAccountResult>`

```typescript
interface DeleteAccountResult {
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
  requiresReauth?: boolean;
}
```

## Error Handling

The package provides comprehensive error types:

- `AccountNotInitializedError`: Service not initialized
- `AccountAuthRequiredError`: User not authenticated
- `AccountReauthRequiredError`: Reauthentication required
- `AccountDeletionError`: Account deletion failed
- `AccountWrongPasswordError`: Incorrect password

## Architecture

This package follows Domain-Driven Design (DDD) principles:

```
src/
├── domain/           # Business logic (errors, types)
├── application/      # Ports (interfaces)
├── infrastructure/   # Services implementation
└── presentation/     # React hooks
```

## License

MIT

## Author

Ümit UZ <umit@umituz.com>

