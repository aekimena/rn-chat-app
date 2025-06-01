import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage} from 'zustand/middleware';
import {User} from '../types';

type Usertore = {
  user: User | null;
  setUser: (value: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<Usertore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({user}),
      clearUser: () => set({user: null}),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
