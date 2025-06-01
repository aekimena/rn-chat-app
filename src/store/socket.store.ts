import {create} from 'zustand';
import {io} from 'socket.io-client';
import {useAuthStore} from './authStore';
import {BASE_URL} from '../../keys.config';

type StoreState = {
  socket: any;
  connectSocket: () => void;
  disconnectSocket: () => void;
  isSocketConnected: () => boolean;
};

export const useSocketStore = create<StoreState>((set, get) => ({
  authUserId: null,
  socket: null,
  connectSocket: () => {
    if (get().socket && get().socket.connected == true) return;
    const token = useAuthStore.getState().token;

    const socket = io(BASE_URL, {
      auth: {
        token,
      },
    });
    socket.connect();
    set({socket: socket});
  },
  disconnectSocket: () => {
    if (get().socket && get().socket.connected == true) {
      get().socket.disconnect();
      set({socket: null});
    }
  },
  isSocketConnected: () => {
    if (get().socket && get().socket.connected == true) return true;
    return false;
  },
}));
