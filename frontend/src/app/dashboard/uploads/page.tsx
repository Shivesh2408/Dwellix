"use client";

import React, { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Check, FileText, Image as ImageIcon, ExternalLink, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface UploadedImage {
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export default function UploadsDemoPage() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleCopyUrl = async () => {
    if (!uploadedImage) return;
    try {
      await navigator.clipboard.writeText(uploadedImage.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDelete = async () => {
    if (!uploadedImage) return;
    setIsDeleting(true);
    setDeleteMessage("");

    try {
      await apiClient(`/api/v1/uploads/${uploadedImage.publicId}`, {
        method: "DELETE"
      });
      setUploadedImage(null);
      setDeleteMessage("Image successfully deleted from Cloudinary.");
      setTimeout(() => setDeleteMessage(""), 4000);
    } catch (err: any) {
      console.error("Delete error:", err);
      setDeleteMessage(err?.message ?? "Failed to delete image.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (bytes === undefined || bytes === null) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            Cloudinary Integration
          </span>
          <h1 className="text-xl md:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            Media Uploads
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Upload images to Cloudinary, inspect response metadata, and delete assets instantly.
          </p>
        </div>
      </div>

      {deleteMessage && (
        <div className={`p-4 rounded-2xl text-xs md:text-sm font-semibold ${
          deleteMessage.includes("success") 
            ? "bg-emerald-50 border border-emerald-100 text-emerald-800" 
            : "bg-rose-50 border border-rose-100 text-rose-800"
        }`}>
          {deleteMessage}
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-100/50">
        <ImageUpload
          onSuccess={(metadata) => {
            setUploadedImage(metadata);
            setDeleteMessage("");
          }}
          onFailure={(err) => {
            console.error("Upload failure callback:", err);
          }}
        />
      </div>

      {/* Showcase Grid */}
      {uploadedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Preview Panel */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-lg shadow-slate-100/30 flex flex-col items-center">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 w-full text-left">
              Image Preview
            </h3>
            <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 max-h-[320px] w-full flex items-center justify-center p-2">
              <img
                src={uploadedImage.imageUrl}
                alt="Cloudinary preview"
                className="max-h-[300px] w-auto object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Metadata Panel */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-lg shadow-slate-100/30 space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Cloudinary Asset Info
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                  Public ID
                </span>
                <span className="font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-800 break-all inline-block">
                  {uploadedImage.publicId}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                  Dimensions
                </span>
                <span className="font-bold text-slate-800">
                  {uploadedImage.width ?? "N/A"} x {uploadedImage.height ?? "N/A"} px
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                  Format
                </span>
                <span className="font-bold text-slate-800 uppercase">
                  {uploadedImage.format ?? "N/A"}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">
                  File Size
                </span>
                <span className="font-bold text-slate-800">
                  {formatBytes(uploadedImage.bytes)}
                </span>
              </div>

              {/* Copy URL Row */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">
                  Secure Delivery URL
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadedImage.imageUrl}
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono select-all overflow-x-auto outline-none text-slate-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="h-9 w-9 p-0 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <a
                    href={uploadedImage.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="rounded-xl border-rose-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs h-9 px-4 gap-1.5 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Asset</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
