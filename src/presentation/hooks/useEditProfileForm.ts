/**
 * useEditProfileForm Hook
 * Single Responsibility: Form state management for profile editing
 */

import { useState, useCallback } from "react";

export interface EditProfileFormState {
  displayName: string;
  email: string;
  photoURL: string | null;
}

export function useEditProfileForm(initialState: EditProfileFormState) {
  const [formState, setFormState] = useState<EditProfileFormState>(initialState);

  const setDisplayName = useCallback((name: string) => {
    setFormState((prev) => ({ ...prev, displayName: name }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setFormState((prev) => ({ ...prev, email }));
  }, []);

  const setPhotoURL = useCallback((photoURL: string | null) => {
    setFormState((prev) => ({ ...prev, photoURL }));
  }, []);

  const resetForm = useCallback((newState: EditProfileFormState) => {
    setFormState(newState);
  }, []);

  return {
    formState,
    setDisplayName,
    setEmail,
    setPhotoURL,
    resetForm,
  };
}

