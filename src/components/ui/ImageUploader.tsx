import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api.ts';

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = '16:9',
  helperText = 'რეკომენდებულია JPG ან PNG, მაქსიმუმ 10MB',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    'auto': 'min-h-[160px]',
  };

  const handleFileProcess = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('გთხოვთ აირჩიოთ ფოტოს ფაილი (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('ფოტოს ზომა აღემატება 10MB-ს');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const url = await api.uploadImage(base64, file.name);
          onChange(url);
        } catch (uploadErr: any) {
          setError(uploadErr.message || 'ატვირთვა ვერ მოხერხდა');
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setError('ფაილის წაკითხვა ვერ მოხერხდა');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('მოულოდნელი შეცდომა');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div className="w-full space-y-2 text-left">
      {label && (
        <label className="block text-xs font-medium text-stone-700">
          {label}
        </label>
      )}

      {value ? (
        <div className={`relative w-full ${aspectClasses[aspectRatio]} rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group`}>
          <img
            src={value}
            alt="Uploaded preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-stone-800 text-xs font-medium rounded-lg shadow-sm backdrop-blur-sm transition-transform active:scale-95"
            >
              შეცვლა
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg shadow-sm backdrop-blur-sm transition-transform active:scale-95"
              title="წაშლა"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full ${aspectClasses[aspectRatio]} rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
            dragActive
              ? 'border-amber-700 bg-amber-50/50'
              : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
              <p className="text-xs text-stone-600 font-medium">ფოტო იტვირთება...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200 text-stone-600">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-stone-800">
                  დააჭირე ასატვირთად ან გადმოათრიე ფაილი
                </p>
                <p className="text-[11px] text-stone-500">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};
