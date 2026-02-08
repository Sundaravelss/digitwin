"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY_PHOTO = "digitwin-user-photo";
const STORAGE_KEY_AVATAR = "digitwin-generated-avatar";

type UserAvatarContextValue = {
  userPhotoUrl: string | null;
  generatedAvatarUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  setUserPhoto: (dataUrl: string) => void;
  generateAvatar: () => Promise<void>;
  clearAvatar: () => void;
};

const UserAvatarContext = createContext<UserAvatarContextValue | null>(null);

/** Resize image to maxSize to avoid localStorage quota issues */
function resizeImage(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

export function UserAvatarProvider({ children }: { children: React.ReactNode }) {
  const [userPhotoUrl, setUserPhotoUrlState] = useState<string | null>(null);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedPhoto = localStorage.getItem(STORAGE_KEY_PHOTO);
    const storedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR);
    if (storedPhoto) setUserPhotoUrlState(storedPhoto);
    if (storedAvatar) {
      // Validate the URL still works (FAL CDN URLs can expire)
      const img = new Image();
      img.onload = () => setGeneratedAvatarUrl(storedAvatar);
      img.onerror = () => {
        localStorage.removeItem(STORAGE_KEY_AVATAR);
      };
      img.src = storedAvatar;
    }
  }, []);

  const setUserPhoto = useCallback(async (dataUrl: string) => {
    const resized = await resizeImage(dataUrl, 512);
    setUserPhotoUrlState(resized);
    localStorage.setItem(STORAGE_KEY_PHOTO, resized);
    // Clear old generated avatar since photo changed
    setGeneratedAvatarUrl(null);
    localStorage.removeItem(STORAGE_KEY_AVATAR);
    setError(null);
  }, []);

  const generateAvatar = useCallback(async () => {
    if (!userPhotoUrl) return;
    setIsGenerating(true);
    setError(null);
    const toastId = toast.loading("Generating your 3D avatar...");
    try {
      // Convert data URL to Blob for FormData
      const resp = await fetch(userPhotoUrl);
      const blob = await resp.blob();
      const formData = new FormData();
      formData.append("image", blob, "photo.jpg");

      const res = await fetch("/api/avatar/generate", { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server error (${res.status})`);
      }
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedAvatarUrl(data.imageUrl);
        localStorage.setItem(STORAGE_KEY_AVATAR, data.imageUrl);
        toast.success("Avatar generated!", { id: toastId });
      } else {
        const msg = data.notes || "Generation returned no image";
        setError(msg);
        toast.error(msg, { id: toastId });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      toast.error(`Avatar generation failed: ${msg}`, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  }, [userPhotoUrl]);

  const clearAvatar = useCallback(() => {
    setUserPhotoUrlState(null);
    setGeneratedAvatarUrl(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY_PHOTO);
    localStorage.removeItem(STORAGE_KEY_AVATAR);
  }, []);

  return (
    <UserAvatarContext.Provider
      value={{ userPhotoUrl, generatedAvatarUrl, isGenerating, error, setUserPhoto, generateAvatar, clearAvatar }}
    >
      {children}
    </UserAvatarContext.Provider>
  );
}

export function useUserAvatar() {
  const ctx = useContext(UserAvatarContext);
  if (!ctx) throw new Error("useUserAvatar must be used within UserAvatarProvider");
  return ctx;
}
