import { User, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  label?: string;
  description?: string;
  subDescription?: string;
  accept?: string;
  shape?: "square" | "circle";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagePreview,
  onImageChange,
  onRemoveImage,
  label = "Image",
  description = "Upload an image",
  subDescription = "JPG, PNG or GIF (Max 5MB)",
  accept = "image/*",
  shape = "square",
  size = "md",
  icon,
  required = false,
}) => {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-lg";
  const sizeClass = sizeClasses[size];

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-4">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className={`${sizeClass} object-cover ${shapeClasses} border-2 border-gray-200`}
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label
            className={`${sizeClass} flex flex-col items-center justify-center border-2 border-dashed border-gray-300 ${shapeClasses} cursor-pointer hover:border-primary transition-colors`}
          >
            {icon || (shape === "circle" ? <User className="w-8 h-8 text-gray-400" /> : <Upload className="w-8 h-8 text-gray-400" />)}
            {shape === "square" && <span className="text-xs text-gray-500 mt-1">Upload</span>}
            <input
              type="file"
              accept={accept}
              onChange={onImageChange}
              className="hidden"
              required={required && !imagePreview}
            />
          </label>
        )}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">{subDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
