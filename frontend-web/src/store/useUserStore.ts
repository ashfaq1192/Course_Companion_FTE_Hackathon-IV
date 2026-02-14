import { create } from 'zustand';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  accessibilitySettings: {
    fontSize: 'small' | 'normal' | 'large';
    contrast: 'normal' | 'high';
  };
}

interface UserState {
  user: any | null;
  preferences: UserPreferences;
  updateUser: (userData: any) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  preferences: {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    accessibilitySettings: {
      fontSize: 'normal',
      contrast: 'normal',
    },
  },
  updateUser: (userData) => set((state) => ({ ...state, user: userData })),
  updatePreferences: (prefs) =>
    set((state) => ({
      ...state,
      preferences: { ...state.preferences, ...prefs },
    })),
  reset: () => 
    set({
      user: null,
      preferences: {
        theme: 'light',
        language: 'en',
        notificationsEnabled: true,
        accessibilitySettings: {
          fontSize: 'normal',
          contrast: 'normal',
        },
      },
    }),
}));