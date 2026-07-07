export type HomeType = "APARTMENT" | "VILLA" | "INDEPENDENT_HOUSE" | "OFFICE";

export type Appliance = {
  id: string;
  name: string;
  brand: string;
  model: string;
  purchaseDate: string;
  warrantyExpiry: string;
  photoFileName?: string;
  invoiceFileName?: string;
};

export type Room = {
  id: string;
  name: string;
  notes: string;
  appliances: Appliance[];
};

export type OnboardingDraft = {
  homeName: string;
  homeType: HomeType | "";
  address: string;
  city: string;
  state: string;
  pincode: string;
  rooms: Room[];
};

export type OnboardingHomePayload = {
  homeName: string;
  homeType: HomeType;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type OnboardingAppliancePayload = {
  name: string;
  brand: string;
  model: string;
  purchaseDate: string;
  warrantyExpiry: string;
  photoFileName?: string;
  invoiceFileName?: string;
};

export type OnboardingRoomPayload = {
  name: string;
  notes?: string;
  appliances: OnboardingAppliancePayload[];
};

export type OnboardingCompletePayload = {
  home: OnboardingHomePayload;
  rooms: OnboardingRoomPayload[];
};

export type OnboardingSummaryResponse = {
  home: {
    id: string;
    homeName: string;
    homeType: HomeType;
    address: string;
    city: string;
    state: string;
    pincode: string;
    completed: boolean;
    completedAt: string | null;
  } | null;
  rooms: Array<{
    id: string;
    name: string;
    notes: string;
    appliances: Array<{
      id: string;
      name: string;
      brand: string;
      model: string;
      purchaseDate: string;
      warrantyExpiry: string;
      photoFileName?: string;
      invoiceFileName?: string;
    }>;
  }>;
};
