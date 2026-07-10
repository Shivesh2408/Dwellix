"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient, apiBaseUrl } from "@/lib/api-client";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Image as ImageIcon,
  AlertTriangle,
  ShieldCheck,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  roomName: string;
  roomId: string;
  purchaseDate: string;
  warrantyExpiry: string;
  photoFileName: string;
  warrantyStatus: string;
  healthScore: number;
  lastMaintenance: string;
}

interface Room {
  id: string;
  name: string;
}

export default function EditAppliancePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [appliance, setAppliance] = useState<Appliance | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [roomId, setRoomId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Load rooms
    apiClient<Room[]>("/api/v1/onboarding/rooms")
      .then((data) => setRooms(data))
      .catch((err) => console.error("Failed to load rooms:", err));

    // Load appliance
    apiClient<Appliance>(`/api/v1/appliances/${id}`)
      .then((data) => {
        setAppliance(data);
        setName(data.name);
        setBrand(data.brand);
        setModel(data.model);
        setPurchaseDate(data.purchaseDate);
        setWarrantyExpiry(data.warrantyExpiry);
        setRoomId(data.roomId);
        setPhotoUrl(data.photoFileName || "");
        setSerialNumber(`SN-DWX-${data.id.substring(0, 8).toUpperCase()}`);
      })
      .catch((err) => {
        console.error("Failed to load appliance:", err);
        setError("Appliance details could not be retrieved.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("Image exceeds the maximum allowed size of 10MB.");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/uploads/image`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("Image upload failed");
      const data = await response.json();
      setPhotoUrl(data.imageUrl);
      showToast("Appliance image updated successfully.");
    } catch (err) {
      console.error("Failed uploading image:", err);
      showToast("Could not upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !brand.trim() || !model.trim() || !purchaseDate || !warrantyExpiry || !roomId) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient(`/api/v1/onboarding/appliances/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          brand: brand.trim(),
          model: model.trim(),
          purchaseDate,
          warrantyExpiry,
          photoFileName: photoUrl,
          invoiceFileName: "",
          roomId
        })
      });
      showToast("Appliance profile updated successfully.");
      setTimeout(() => {
        router.push(`/dashboard/appliances/${id}`);
      }, 1000);
    } catch (err: unknown) {
      console.error("Failed saving appliance:", err);
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this appliance permanently?")) return;

    try {
      await apiClient(`/api/v1/onboarding/appliances/${id}`, {
        method: "DELETE"
      });
      showToast("Appliance deleted.");
      setTimeout(() => {
        router.push("/dashboard/appliances");
      }, 1000);
    } catch (err: unknown) {
      console.error("Failed to delete:", err);
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "Error deleting appliance.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10 min-h-screen bg-[#F8F9FB]">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-[600px] bg-slate-200 rounded-[32px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10 min-h-screen bg-[#F8F9FB] font-sans text-left pb-24">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-black text-white text-xs md:text-sm font-bold px-6 py-4 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.2)] z-50 flex items-center gap-3 border border-slate-800"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ECECEC] pb-8">
        <button
          onClick={() => router.push(`/dashboard/appliances/${id}`)}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111111] transition-colors font-bold cursor-pointer group w-max"
        >
          <div className="h-8 w-8 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span>Cancel Edit</span>
        </button>

        <Button
          onClick={handleDelete}
          variant="outline"
          className="rounded-xl font-bold text-sm h-11 px-5 border-[#ECECEC] text-rose-600 hover:bg-rose-50 hover:border-rose-200 cursor-pointer shadow-sm transition-all"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Profile
        </Button>
      </div>

      {/* Main Edit Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white border border-[#ECECEC] rounded-[32px] p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 rounded-[20px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight">
              Edit Configuration
            </h1>
            <p className="text-sm font-medium text-[#6B7280] mt-1">
              Update {appliance?.name}&apos;s device specifications and warranty.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-8 rounded-[20px] bg-rose-50 border border-rose-100 text-rose-800 text-sm font-bold flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Photo Uploader Section */}
          <div className="bg-[#F8F9FB] rounded-[24px] p-6 border border-[#ECECEC] flex flex-col md:flex-row items-center gap-8">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[24px] bg-white border border-[#ECECEC] overflow-hidden flex items-center justify-center shrink-0 relative shadow-inner">
              {photoUrl ? (
                <img src={photoUrl} alt="Appliance Preview" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-10 w-10 text-[#ECECEC]" />
              )}
              {uploadingImage && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-base font-extrabold text-[#111111] mb-2">Device Appearance</h3>
              <p className="text-sm text-[#6B7280] font-medium mb-6 max-w-sm">
                Upload a clear image of the device for AI visual diagnosis tracking. JPG, PNG, WEBP up to 10MB.
              </p>
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png, image/webp"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                id="image-file-input"
                className="hidden"
              />
              <label
                htmlFor="image-file-input"
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-white border border-[#ECECEC] hover:bg-slate-50 transition-all text-sm font-bold text-[#111111] cursor-pointer shadow-sm"
              >
                Upload New Image
              </label>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Device Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Device Name <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Living Room Split AC"
                className="h-14 rounded-[16px] text-base font-medium border-[#ECECEC] focus:ring-black focus:border-black bg-[#F8F9FB] px-4"
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Manufacturer Brand <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. LG"
                className="h-14 rounded-[16px] text-base font-medium border-[#ECECEC] focus:ring-black focus:border-black bg-[#F8F9FB] px-4"
              />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Model Number <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. LGS-3024"
                className="h-14 rounded-[16px] text-base font-medium border-[#ECECEC] focus:ring-black focus:border-black bg-[#F8F9FB] px-4"
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Date of Purchase <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="h-14 rounded-[16px] text-base font-medium border-[#ECECEC] focus:ring-black focus:border-black bg-[#F8F9FB] px-4"
              />
            </div>

            {/* Warranty Expiry */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Warranty Expiration <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="h-14 rounded-[16px] text-base font-medium border-[#ECECEC] focus:ring-black focus:border-black bg-[#F8F9FB] px-4"
              />
            </div>

            {/* Room Location */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Physical Location <span className="text-rose-500">*</span>
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full h-14 rounded-[16px] border border-[#ECECEC] bg-[#F8F9FB] text-base font-medium px-4 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-[#111111] appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a room...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Serial Number (Read-only) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                Serial Number (Read-Only)
              </label>
              <Input
                type="text"
                value={serialNumber}
                disabled
                className="h-14 rounded-[16px] text-base font-bold border-[#ECECEC] bg-[#F8F9FB] text-[#6B7280] font-mono opacity-70"
              />
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-[#ECECEC] mt-10">
            <Button
              type="button"
              onClick={() => router.push(`/dashboard/appliances/${id}`)}
              className="rounded-[16px] font-bold text-sm h-12 px-6 bg-white border border-[#ECECEC] text-[#111111] hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-[16px] font-bold text-sm h-12 px-8 bg-black hover:bg-black/90 text-white cursor-pointer flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-transform hover:scale-105"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
