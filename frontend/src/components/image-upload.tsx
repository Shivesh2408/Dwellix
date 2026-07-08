"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle, XCircle, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/api-client";

interface UploadMetadata {
  imageUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

interface ImageUploadProps {
  onSuccess?: (metadata: UploadMetadata) => void;
  onFailure?: (error: string) => void;
}

export function ImageUpload({ onSuccess, onFailure }: ImageUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);

  const startUpload = (file: File) => {
    fileRef.current = file;
    setErrorMsg("");
    setProgress(0);
    setStatus("uploading");

    // Local Preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Validate size client-side (10MB)
    if (file.size > 10 * 1024 * 1024) {
      const err = "File size exceeds limit of 10 MB";
      setStatus("error");
      setErrorMsg(err);
      onFailure?.(err);
      return;
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["jpg", "jpeg", "png", "webp"].includes(ext)) {
      const err = "Unsupported file format. Only JPG, JPEG, PNG, and WEBP allowed.";
      setStatus("error");
      setErrorMsg(err);
      onFailure?.(err);
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText) as UploadMetadata;
          setStatus("success");
          onSuccess?.(res);
        } catch (err) {
          setStatus("error");
          setErrorMsg("Failed to parse response");
          onFailure?.("Failed to parse response");
        }
      } else {
        let msg = "Upload failed";
        try {
          const res = JSON.parse(xhr.responseText);
          msg = res.error || msg;
        } catch (err) {
          msg = `Upload failed with status ${xhr.status}`;
        }
        setStatus("error");
        setErrorMsg(msg);
        onFailure?.(msg);
      }
    });

    xhr.addEventListener("error", () => {
      const err = "Network connection failed";
      setStatus("error");
      setErrorMsg(err);
      onFailure?.(err);
    });

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? "";
    xhr.open("POST", `${apiBaseUrl}/api/v1/uploads/image`);
    
    const token = getAccessToken();
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleRetry = () => {
    if (fileRef.current) {
      startUpload(fileRef.current);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : status === "success"
            ? "border-emerald-300 bg-emerald-50/10"
            : status === "error"
            ? "border-rose-300 bg-rose-50/10"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
        }`}
      >
        {status === "idle" && (
          <div className="text-center space-y-4 flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                Drag and drop image here, or browse
              </p>
              <p className="text-xs text-slate-400">
                Supports JPG, JPEG, PNG, WEBP up to 10MB
              </p>
            </div>
            <Button
              type="button"
              onClick={triggerBrowse}
              className="rounded-xl font-bold text-xs h-9 px-4 cursor-pointer"
            >
              Browse Files
            </Button>
          </div>
        )}

        {status === "uploading" && (
          <div className="w-full text-center space-y-5 flex flex-col items-center max-w-sm">
            {previewUrl && (
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Uploading preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Uploading image...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-4 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">Image Uploaded Successfully</p>
              <p className="text-xs text-slate-400">Processed and stored in Cloudinary Media Library</p>
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() => setStatus("idle")}
              className="rounded-xl font-bold text-xs h-9 px-4 cursor-pointer"
            >
              Upload Another
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <XCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-rose-900">Upload Failure</p>
              <p className="text-xs text-rose-600 max-w-xs">{errorMsg}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => setStatus("idle")}
                className="rounded-xl font-bold text-xs h-9 px-3 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRetry}
                className="rounded-xl font-bold text-xs h-9 px-3 gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
