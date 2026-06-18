"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VerificationState {
  sessions: Record<string, {
    artworkId: string;
    stepsCompleted: number;
    requiredSteps: number;
    stepTimestamps: number[];
    unlocked: boolean;
  }>;
  startVerification: (artworkId: string, sessionKey: string) => void;
  completeStep: (sessionKey: string) => void;
  isUnlocked: (sessionKey: string) => boolean;
  getProgress: (sessionKey: string) => { completed: number; required: number };
  resetSession: (sessionKey: string) => void;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set, get) => ({
      sessions: {},

      startVerification: (artworkId, sessionKey) => {
        const existing = get().sessions[sessionKey];
        if (!existing) {
          set((state) => ({
            sessions: {
              ...state.sessions,
              [sessionKey]: {
                artworkId,
                stepsCompleted: 0,
                requiredSteps: 4,
                stepTimestamps: [],
                unlocked: false,
              },
            },
          }));
        }
      },

      completeStep: (sessionKey) => {
        set((state) => {
          const session = state.sessions[sessionKey];
          if (!session) return state;
          const newCompleted = session.stepsCompleted + 1;
          const unlocked = newCompleted >= session.requiredSteps;
          return {
            sessions: {
              ...state.sessions,
              [sessionKey]: {
                ...session,
                stepsCompleted: newCompleted,
                stepTimestamps: [...session.stepTimestamps, Date.now()],
                unlocked,
              },
            },
          };
        });
      },

      isUnlocked: (sessionKey) => {
        return get().sessions[sessionKey]?.unlocked ?? false;
      },

      getProgress: (sessionKey) => {
        const session = get().sessions[sessionKey];
        if (!session) return { completed: 0, required: 4 };
        return { completed: session.stepsCompleted, required: session.requiredSteps };
      },

      resetSession: (sessionKey) => {
        set((state) => {
          const sessions = { ...state.sessions };
          delete sessions[sessionKey];
          return { sessions };
        });
      },
    }),
    { name: "artflow-verification" }
  )
);
