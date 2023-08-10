import { create } from 'zustand';
import { auth, ENABLE_AUTH } from '../lib/auth';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  initialize: async () => {
    try {
      const token = auth.getToken();
      const isAuthenticated = token?.length > 0;
      const user = isAuthenticated ? { token } : null;

      set({
        isAuthenticated,
        user,
        isLoading: false
      });
    } catch (err) {
      console.error(err);
      set({
        isLoading: false
      });
    }
  },

  signIn: (user) => {
    localStorage.setItem('token', user.token);
    set({
      isAuthenticated: true,
      user
    })
  },

  signOut: () => {
    localStorage.removeItem('token');
    set({
      isAuthenticated: false,
      user: null
    })
  }
}));

export default useAuthStore;