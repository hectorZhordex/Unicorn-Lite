"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  uploads: string[];
}

interface AuthStore {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addUpload: (artworkId: string) => void;
}

// Passwords stored separately (not in User object)
interface PasswordStore {
  [email: string]: string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      login: (email, password) => {
        const passwords: PasswordStore = JSON.parse(
          localStorage.getItem("blueorbit_passwords") || "{}"
        );
        const user = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return { success: false, error: "No account found with this email." };
        if (passwords[email.toLowerCase()] !== password) return { success: false, error: "Incorrect password." };
        set({ currentUser: user });
        return { success: true };
      },

      register: (name, email, password) => {
        const existing = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existing) return { success: false, error: "An account with this email already exists." };
        if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

        const newUser: User = {
          id: Math.random().toString(36).substring(2) + Date.now().toString(36),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          createdAt: new Date().toISOString(),
          uploads: [],
        };

        const passwords: PasswordStore = JSON.parse(
          localStorage.getItem("blueorbit_passwords") || "{}"
        );
        passwords[email.toLowerCase()] = password;
        localStorage.setItem("blueorbit_passwords", JSON.stringify(passwords));

        set((state) => ({ users: [...state.users, newUser], currentUser: newUser }));
        return { success: true };
      },

      logout: () => set({ currentUser: null }),

      addUpload: (artworkId) => {
        set((state) => {
          if (!state.currentUser) return state;
          const updated = { ...state.currentUser, uploads: [...state.currentUser.uploads, artworkId] };
          return {
            currentUser: updated,
            users: state.users.map((u) => (u.id === updated.id ? updated : u)),
          };
        });
      },
    }),
    { name: "blueorbit-auth" }
  )
);
