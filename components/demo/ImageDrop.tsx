"use client";

import { useRef, useState } from "react";

export interface ImagePayload {
  data: string;
  mimeType: string;
}

export default function ImageDrop({
  label,
  hint,
  onImage,
}: {
  label: string;
  hint: string;
  onImage: (payload: ImagePayload | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, base64] = result.split(",");
      setPreview(result);
      onImage({ data: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    setPreview(null);
    onImage(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="mb-2 font-tag text-[11px] uppercase tracking-wide text-creamDim/70">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition ${
          dragOver ? "border-brass bg-brass/10" : "border-cream/20 hover:border-brass/50"
        }`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="absolute right-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 font-tag text-[10px] uppercase text-cream hover:bg-rust/80"
            >
              Remove
            </button>
          </>
        ) : (
          <div className="px-4 text-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              className="mx-auto mb-2 text-creamDim/50"
              aria-hidden="true"
            >
              <path
                d="M5 19V8a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="14" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <p className="text-xs text-creamDim/70">{hint}</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
