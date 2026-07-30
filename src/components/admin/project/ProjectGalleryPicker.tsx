import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import ImageUpload from "../ImageUpload";
import { getAssetUrl } from "../../../services/config";

interface ProjectGalleryPickerProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

const ProjectGalleryPicker = ({
  value,
  onChange,
}: ProjectGalleryPickerProps) => {
  const [adding, setAdding] = useState(false);

  const addImage = (url: string) => {
    if (url) {
      onChange([...value, url]);
    }
    setAdding(false);
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Gallery Images
      </label>
      <p className="text-sm text-slate-500">
        Add as many additional photos as you like. These appear in the
        "Project Gallery" section on the public project page.
      </p>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative rounded-xl overflow-hidden border border-slate-200 group"
            >
              <img
                src={getAssetUrl(url)}
                alt={`Gallery ${index + 1}`}
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="border border-dashed border-slate-300 rounded-xl p-4">
          <ImageUpload
            label="New Gallery Image"
            value=""
            onChange={addImage}
          />
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="mt-3 text-sm text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9293A] border border-[#C9293A]/30 hover:bg-[#C9293A]/5 rounded-xl px-4 py-2.5 transition"
        >
          <ImagePlus size={16} />
          Add Gallery Image
        </button>
      )}
    </div>
  );
};

export default ProjectGalleryPicker;
