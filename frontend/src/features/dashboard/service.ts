import { apiClient } from "@/lib/api-client";

export type HomeType = "APARTMENT" | "VILLA" | "INDEPENDENT_HOUSE" | "OFFICE";

export interface OnboardingHomeResponse {
  id: string;
  userId: string;
  homeName: string;
  homeType: HomeType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  setupCompleted: boolean;
  setupCompletedAt: string | null;
}

export interface OnboardingApplianceResponse {
  id: string;
  roomId: string;
  name: string;
  brand: string;
  model: string;
  purchaseDate: string;
  warrantyExpiry: string;
  photoFileName: string | null;
  invoiceFileName: string | null;
  sortOrder: number;
}

export interface DashboardBookingResponse {
  id: string;
  applianceName: string;
  serviceName: string;
  date: string;
  status: string;
  technicianName: string;
}

export interface DashboardMaintenanceResponse {
  id: string;
  applianceName: string;
  taskName: string;
  date: string;
  status: string;
  actionLabel: string;
}

export interface DashboardActivityResponse {
  id: string;
  title: string;
  description: string;
  category: "WARRANTY" | "BOOKING" | "AI" | "INVOICE" | "MAINTENANCE";
  timestamp: string;
}

export interface DashboardRecommendationResponse {
  id: string;
  applianceName: string;
  recommendation: string;
  recommendedAction: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
}

export interface DashboardWarrantyAlertResponse {
  id: string;
  applianceName: string;
  brand: string;
  model: string;
  expiryDate: string;
  daysRemaining: number;
  status: "EXPIRING_SOON" | "EXPIRED" | "SAFE";
}

export interface DashboardNotificationResponse {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ALERT";
  read: boolean;
  createdAt: string;
}

export interface DashboardSummaryResponse {
  home: OnboardingHomeResponse | null;
  userName: string;
  roomsCount: number;
  appliancesCount: number;
  healthScore: number;
  healthRecommendation: string;
  upcomingBookings: DashboardBookingResponse[];
  upcomingMaintenance: DashboardMaintenanceResponse[];
  recentActivity: DashboardActivityResponse[];
  aiRecommendations: DashboardRecommendationResponse[];
  warrantyAlerts: DashboardWarrantyAlertResponse[];
  recentAppliances: OnboardingApplianceResponse[];
  notifications: DashboardNotificationResponse[];
}

export function getDashboardSummary() {
  return apiClient<DashboardSummaryResponse>("/api/v1/dashboard", { method: "GET" });
}
