'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { validateImage } from '@/lib/validations';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setError('');

    if (images.length + files.length > maxImages) {
      setError(`Cannot upload more than ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const validation = validateImage(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        return uploadImage(file);
      });

      const urls = await Promise.all(uploadPromises);
      const newImages = [...images, ...urls];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          style={{
            backgroundColor: 'rgb(var(--accent-primary))',
            color: 'white',
          }}
        >
          <Upload size={20} />
          Upload Images
        </button>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          style={{
            backgroundColor: 'rgb(var(--accent-secondary))',
            color: 'white',
          }}
        >
          <Camera size={20} />
          Take Photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="p-3 rounded-xl text-sm animate-slide-down"
          style={{
            backgroundColor: 'rgba(var(--accent-error), 0.1)',
            border: '1px solid rgb(var(--accent-error))',
            color: 'rgb(var(--accent-error))',
          }}
        >
          {error}
        </div>
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <div className="flex items-center gap-2" style={{ color: 'rgb(var(--text-secondary))' }}>
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Uploading images...</span>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in">
          {images.map((url, index) => (
            <div 
              key={index} 
              className="relative group rounded-xl overflow-hidden"
              style={{
                border: '2px solid rgb(var(--border-primary))',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-white"
                style={{
                  backgroundColor: 'rgb(var(--accent-error))',
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <p className="text-xs sm:text-sm" style={{ color: 'rgb(var(--text-tertiary))' }}>
        {images.length}/{maxImages} images uploaded
      </p>
    </div>
  );
}
