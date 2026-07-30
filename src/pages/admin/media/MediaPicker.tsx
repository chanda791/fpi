import { useEffect, useState } from "react";
import { API_BASE_URL, getAssetUrl } from "../../../services/config";

interface MediaFile {
  id: number;
  originalName: string;
  url: string;
  mimeType: string;
}

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

const MediaPicker = ({ value, onChange }: Props) => {
  const [media, setMedia] = useState<MediaFile[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/media`)
      .then((r) => r.json())
      .then(setMedia);
  }, []);

  return (
    <div>

      <h3 className="font-semibold mb-4">
        Choose Image
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {media
          .filter((m) => m.mimeType.startsWith("image"))
          .map((item) => (

            <div
              key={item.id}
              onClick={() => onChange(item.url)}
              className={`cursor-pointer border rounded-xl overflow-hidden transition ${
                value === item.url
                  ? "border-red-600 ring-2 ring-red-300"
                  : "border-gray-200"
              }`}
            >

              <img
                src={getAssetUrl(item.url)}
                alt={item.originalName}
                className="h-36 w-full object-cover"
              />

              <div className="p-2 text-xs truncate">
                {item.originalName}
              </div>

            </div>

          ))}

      </div>

    </div>
  );
};

export default MediaPicker;