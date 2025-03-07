import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { id: number; name: string; role: string } | null;
  login: (token: string, user: { id: number; name: string; role: string }) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => {
        console.log("User Logged In:", user);
        set({ token, user });
      },
      logout: () => {
        console.log("User Logged Out");
        set({ token: null, user: null });
      },
      hasRole: (roles) => {
        const userRole = get().user?.role || "";
        console.log("Checking Role:", userRole);
        return roles.includes(userRole);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

