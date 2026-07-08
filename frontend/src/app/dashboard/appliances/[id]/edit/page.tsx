"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Bot,
  Calendar,
  Layers,
  Wrench,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  ShieldCheck
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

    // Check size < 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image exceeds the maximum allowed size of 10MB.");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/uploads/image", {
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

    // Validation
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
    } catch (err: any) {
      console.error("Failed saving appliance:", err);
      setError(err?.message ?? "An error occurred while saving.");
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
    } catch (err: any) {
      console.error("Failed to delete:", err);
      setError(err?.message ?? "Error deleting appliance.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <span className="text-xs font-semibold">Loading editor specs...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 relative text-left">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button
          onClick={() => router.push(`/dashboard/appliances/${id}`)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel Editor</span>
        </button>

        <Button
          onClick={handleDelete}
          variant="outline"
          className="rounded-xl font-bold text-xs h-9 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Appliance</span>
        </Button>
      </div>

      {/* Edit Form */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
        <h1 className="text-lg md:text-xl font-heading font-extrabold text-slate-950 mb-6">
          Edit Appliance Profile
        </h1>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 animate-bounce" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-slate-700">
          {/* Photo Uploader */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Appliance Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0 relative shadow-inner">
                {photoUrl ? (
                  <img src={photoUrl} alt="Appliance" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-350" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div>
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
                  className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Change Image
                </label>
                <p className="text-[10px] text-slate-400 mt-1">Accepts JPG, JPEG, PNG, WEBP. Max 10MB.</p>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nickname / Display Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Appliance Name *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Living Room Split AC"
                className="h-10 rounded-xl text-xs border-slate-200"
              />
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Brand *
              </label>
              <Input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. LG"
                className="h-10 rounded-xl text-xs border-slate-200"
              />
            </div>

            {/* Model */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Model *
              </label>
              <Input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. LGS-3024"
                className="h-10 rounded-xl text-xs border-slate-200"
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Purchase Date *
              </label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="h-10 rounded-xl text-xs border-slate-200"
              />
            </div>

            {/* Warranty Expiry */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Warranty Expiration Date *
              </label>
              <Input
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
                className="h-10 rounded-xl text-xs border-slate-200"
              />
            </div>

            {/* Serial Number (Read-only/Deterministic preview) */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Serial Number
              </label>
              <Input
                type="text"
                value={serialNumber}
                disabled
                className="h-10 rounded-xl text-xs border-slate-100 bg-slate-50 font-mono text-slate-400"
              />
            </div>

            {/* Room Location Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Room Location *
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
              >
                <option value="">Select Room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/appliances/${id}`)}
              className="rounded-xl font-bold text-xs h-10 px-5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl font-bold text-xs h-10 px-6 bg-primary text-white hover:bg-primary/95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
