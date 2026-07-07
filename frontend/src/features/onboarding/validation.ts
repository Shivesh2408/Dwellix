import type { Appliance, HomeType, OnboardingDraft, Room } from "./types";

export type FieldErrors = Record<string, string>;

export function validateHomeDraft(draft: OnboardingDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (!draft.homeName.trim()) errors.homeName = "Home name is required.";
  if (!draft.homeType) errors.homeType = "Choose a home type.";
  if (!draft.address.trim()) errors.address = "Address is required.";
  if (!draft.city.trim()) errors.city = "City is required.";
  if (!draft.state.trim()) errors.state = "State is required.";
  if (!/^[1-9][0-9]{5}$/.test(draft.pincode.trim())) errors.pincode = "Enter a valid 6-digit pincode.";

  return errors;
}

export function validateRoom(room: Pick<Room, "name">): FieldErrors {
  const errors: FieldErrors = {};
  if (!room.name.trim()) errors.name = "Room name is required.";
  return errors;
}

export function validateAppliance(appliance: Pick<Appliance, "name" | "brand" | "model" | "purchaseDate" | "warrantyExpiry">): FieldErrors {
  const errors: FieldErrors = {};
  if (!appliance.name.trim()) errors.name = "Appliance name is required.";
  if (!appliance.brand.trim()) errors.brand = "Brand is required.";
  if (!appliance.model.trim()) errors.model = "Model is required.";
  if (!appliance.purchaseDate) errors.purchaseDate = "Purchase date is required.";
  if (!appliance.warrantyExpiry) errors.warrantyExpiry = "Warranty expiry is required.";
  return errors;
}

export function homeTypeLabel(homeType: HomeType) {
  switch (homeType) {
    case "APARTMENT":
      return "Apartment";
    case "VILLA":
      return "Villa";
    case "INDEPENDENT_HOUSE":
      return "Independent House";
    case "OFFICE":
      return "Office";
  }
}
