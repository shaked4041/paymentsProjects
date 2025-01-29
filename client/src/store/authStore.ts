import { create } from 'zustand';
import { getCurrentUser, logout } from '../utils/reqs';
import { persist } from 'zustand/middleware';
import { AuthStore } from '../utils/types';


const customStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: string | null) => {
        set({ user, isAuthenticated: !!user });
      },
      logoutUser: async () => {
        await logout();
        set({ user: null, isAuthenticated: false });
      },
      fetchCurrentUser: async () => {
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
      setAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },
    }),
    {
      name: 'auth-storage',
      storage: customStorage, 
    }
  )
);
