import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  selectedImage: File | null;
}

const ImageUpload = ({ onImageSelect, onImageClear, selectedImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleClear = () => {
    setPreview(null);
    onImageClear();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="w-full">
      {!preview ? (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-input hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="p-4 rounded-full bg-secondary">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Drop your image here</p>
              <p className="text-sm mt-1">or click to browse</p>
              <p className="text-xs mt-2">Supports JPG, PNG</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative group">
          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <img
              src={preview}
              alt="Uploaded potato"
              className="w-full h-64 object-contain bg-secondary/30"
            />
          </div>
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/80 text-background hover:bg-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            <span className="truncate">{selectedImage?.name}</span>
            <span className="ml-auto">{selectedImage && (selectedImage.size / 1024).toFixed(1)} KB</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
