import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage} from 'zustand/middleware';

type AuthStore = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      token: null,
      setToken: token => set({token}),
      clearToken: () => set({token: null}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
