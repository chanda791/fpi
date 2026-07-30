import { ChangeEvent, useId, useState } from "react";
import { ImagePlus } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
}

const ImageUpload = ({
  label = "Featured Image",
  value,
  onChange,
}: ImageUploadProps) => {
  const inputId = useId();
  const [preview, setPreview] = useState(getAssetUrl(value) || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token =
        localStorage.getItem("fpi_admin_token") ||
        sessionStorage.getItem("fpi_admin_token");

      const response = await fetch(
        `${API_BASE_URL}/media`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const media = await response.json();

      setPreview(getAssetUrl(media.url));

      onChange(media.url);

    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-3">

      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <label
        htmlFor={inputId}
        className="cursor-pointer block"
      >
        <div className="border-2 border-dashed border-slate-300 hover:border-[#C9293A] rounded-2xl bg-slate-50 overflow-hidden transition">

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-slate-500">

              <ImagePlus
                size={48}
                className="text-[#C9293A] mb-4"
              />

              <p className="font-semibold">
                Click to upload image
              </p>

              <p className="text-sm mt-2">
                JPG, PNG or WEBP
              </p>

            </div>
          )}

        </div>
      </label>

      {uploading && (
        <p className="text-sm text-blue-600">
          Uploading image...
        </p>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

    </div>
  );
};

export default ImageUpload;
