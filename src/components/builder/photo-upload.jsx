"use client";

/* eslint-disable @next/next/no-img-element -- photo is a local data URL */

import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PHOTO_CONFIG } from "@/constants/builder";
import { useBuilderStore } from "@/store/builderStore";

// Center-crops to a square and downsizes so the photo stays small enough to persist locally.
function resizeImage(file, size) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas
        .getContext("2d")
        .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image couldn't be read."));
    };
    img.src = url;
  });
}

export default function PhotoUpload() {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const photo = useBuilderStore((state) => state.personal.photo);
  const updatePersonal = useBuilderStore((state) => state.updatePersonal);

  async function handleFile(file) {
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
    } else if (file.size > PHOTO_CONFIG.maxSizeMB * 1024 * 1024) {
      setError(`Image must be ${PHOTO_CONFIG.maxSizeMB} MB or smaller.`);
    } else {
      try {
        updatePersonal("photo", await resizeImage(file, PHOTO_CONFIG.outputSize));
      } catch (err) {
        setError(err.message);
      }
    }
    inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={photo ? "Change photo" : "Upload photo"}
        className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors outline-none hover:border-brand/60 hover:text-brand focus-visible:ring-3 focus-visible:ring-brand/40"
      >
        {photo ? (
          <img src={photo} alt="Profile photo" className="size-full object-cover" />
        ) : (
          <Camera className="size-6" />
        )}
      </button>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            {photo ? "Change photo" : "Upload photo"}
          </Button>
          {photo && (
            <Button variant="ghost" size="sm" onClick={() => updatePersonal("photo", "")}>
              <Trash2 />
              Remove
            </Button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          JPG or PNG, up to {PHOTO_CONFIG.maxSizeMB} MB. A square, professional headshot works best.
        </p>
        {error && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
