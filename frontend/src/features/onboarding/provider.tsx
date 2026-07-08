"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { createStarterDraft, loadOnboardingDraft, saveOnboardingDraft } from "./storage";
import type { Appliance, OnboardingDraft, Room } from "./types";

type OnboardingState = {
  draft: OnboardingDraft;
};

type OnboardingAction =
  | { type: "hydrate"; draft: OnboardingDraft }
  | { type: "replace"; draft: OnboardingDraft }
  | { type: "update-home-field"; field: keyof OnboardingDraft; value: string }
  | { type: "add-room"; room: Room }
  | { type: "update-room"; roomId: string; room: Room }
  | { type: "delete-room"; roomId: string }
  | { type: "add-appliance"; roomId: string; appliance: Appliance }
  | { type: "update-appliance"; roomId: string; applianceId: string; appliance: Appliance }
  | { type: "delete-appliance"; roomId: string; applianceId: string };

type OnboardingContextValue = {
  draft: OnboardingDraft;
  hasHydrated: boolean;
  updateHomeField: (field: keyof OnboardingDraft, value: string) => void;
  replaceDraft: (draft: OnboardingDraft) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, room: Room) => void;
  deleteRoom: (roomId: string) => void;
  addAppliance: (roomId: string, appliance: Appliance) => void;
  updateAppliance: (roomId: string, applianceId: string, appliance: Appliance) => void;
  deleteAppliance: (roomId: string, applianceId: string) => void;
  resetDraft: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function reducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "hydrate":
    case "replace":
      return { draft: action.draft };
    case "update-home-field":
      return { draft: { ...state.draft, [action.field]: action.value } as OnboardingDraft };
    case "add-room":
      return { draft: { ...state.draft, rooms: [...state.draft.rooms, action.room] } };
    case "update-room":
      return {
        draft: {
          ...state.draft,
          rooms: state.draft.rooms.map((room) => (room.id === action.roomId ? action.room : room)),
        },
      };
    case "delete-room":
      return { draft: { ...state.draft, rooms: state.draft.rooms.filter((room) => room.id !== action.roomId) } };
    case "add-appliance":
      return {
        draft: {
          ...state.draft,
          rooms: state.draft.rooms.map((room) =>
            room.id === action.roomId ? { ...room, appliances: [...room.appliances, action.appliance] } : room
          ),
        },
      };
    case "update-appliance":
      return {
        draft: {
          ...state.draft,
          rooms: state.draft.rooms.map((room) =>
            room.id === action.roomId
              ? {
                  ...room,
                  appliances: room.appliances.map((appliance) => (appliance.id === action.applianceId ? action.appliance : appliance)),
                }
              : room
          ),
        },
      };
    case "delete-appliance":
      return {
        draft: {
          ...state.draft,
          rooms: state.draft.rooms.map((room) =>
            room.id === action.roomId
              ? { ...room, appliances: room.appliances.filter((appliance) => appliance.id !== action.applianceId) }
              : room
          ),
        },
      };
    default:
      return state;
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { draft: createStarterDraft() });
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const storedDraft = loadOnboardingDraft();
    if (storedDraft) {
      dispatch({ type: "hydrate", draft: storedDraft });
    }
    setTimeout(() => {
      setHasHydrated(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    saveOnboardingDraft(state.draft);
  }, [hasHydrated, state.draft]);

  const value = useMemo<OnboardingContextValue>(() => {
    return {
      draft: state.draft,
      hasHydrated,
      updateHomeField: (field, value) => dispatch({ type: "update-home-field", field, value }),
      replaceDraft: (draft) => dispatch({ type: "replace", draft }),
      addRoom: (room) => dispatch({ type: "add-room", room }),
      updateRoom: (roomId, room) => dispatch({ type: "update-room", roomId, room }),
      deleteRoom: (roomId) => dispatch({ type: "delete-room", roomId }),
      addAppliance: (roomId, appliance) => dispatch({ type: "add-appliance", roomId, appliance }),
      updateAppliance: (roomId, applianceId, appliance) => dispatch({ type: "update-appliance", roomId, applianceId, appliance }),
      deleteAppliance: (roomId, applianceId) => dispatch({ type: "delete-appliance", roomId, applianceId }),
      resetDraft: () => dispatch({ type: "replace", draft: createStarterDraft() }),
    };
  }, [hasHydrated, state.draft]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider.");
  }

  return context;
}
