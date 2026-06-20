"use client";

import { create } from "zustand";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

// ─── Public user shape (same fields as before so dashboard/navbar don't break) ─
export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  uploads: string[];
}

// Keep the old alias so any file that imports `User` from auth-store still works
export type { CurrentUser as User };

/** Map a raw Supabase User → our CurrentUser shape */
function mapUser(user: User): CurrentUser {
  return {
    id: user.id,
    name: (user.user_metadata?.name as string) || user.email?.split("@")[0] || "User",
    email: user.email ?? "",
    createdAt: user.created_at,
    uploads: [],
  };
}

// ─── Store interface ────────────────────────────────────────────────────────
interface AuthStore {
  currentUser: CurrentUser | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addUpload: (artworkId: string) => void;
}

// ─── Bootstrap Supabase session listener (runs once on client) ──────────────
// We do this outside the store so it starts the moment the module is imported.
if (typeof window !== "undefined") {
  // 1. Hydrate from existing session on page load
  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.setState({
      currentUser: session?.user ? mapUser(session.user) : null,
      authLoading: false,
    });
  });

  // 2. Keep store in sync with Supabase auth events (login, logout, token refresh…)
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      currentUser: session?.user ? mapUser(session.user) : null,
      authLoading: false,
    });
  });
}

// ─── Store ──────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthStore>()((set, get) => ({
  currentUser: null,
  authLoading: true,

  // ── Login ────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Friendly error messages
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success: false,
          error: "Your email is not verified yet. Please check your inbox and click the confirmation link.",
        };
      }
      if (
        error.message.toLowerCase().includes("invalid login") ||
        error.message.toLowerCase().includes("invalid credentials")
      ) {
        return { success: false, error: "Incorrect email or password." };
      }
      return { success: false, error: error.message };
    }

    if (data.user) {
      set({ currentUser: mapUser(data.user) });
    }
    return { success: true };
  },

  // ── Register ─────────────────────────────────────────────────────────────
  // NOTE: This only creates the Supabase account and triggers the verification
  // email. It does NOT log the user in — they must click the email link first.
  register: async (name, email, password) => {
    if (!name.trim()) return { success: false, error: "Please enter your name." };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim() },           // stored in user_metadata
        // emailRedirectTo is set automatically from your Supabase Site URL setting
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already exists")
      ) {
        return { success: false, error: "An account with this email already exists." };
      }
      return { success: false, error: error.message };
    }

    // Success — Supabase has sent the verification email automatically
    return { success: true };
  },

  // ── Logout ───────────────────────────────────────────────────────────────
  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null });
  },

  // ── addUpload (local only — tracks upload IDs in memory) ─────────────────
  addUpload: (artworkId) => {
    set((state) => {
      if (!state.currentUser) return state;
      return {
        currentUser: {
          ...state.currentUser,
          uploads: [...state.currentUser.uploads, artworkId],
        },
      };
    });
  },
}));
