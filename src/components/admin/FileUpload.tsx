import { ChangeEvent, useState } from "react";
import { FileText } from "lucide-react";
import { API_BASE_URL } from "../../services/config";

interface FileUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const FileUpload = ({
  label = "Upload File",
  value,
  onChange,
  onUploadingChange,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const setUploadingState = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingState(true);

      const formData = new FormData();
      formData.append("file", file);

      const token =
        localStorage.getItem("fpi_admin_token") ||
        sessionStorage.getItem("fpi_admin_token");

      const response = await fetch(
        `${API_BASE_URL}/media`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Upload failed");
      }

      const media = await response.json();

      onChange(media.url);

    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Upload failed.");
    } finally {
      setUploadingState(false);
    }
  };

  return (
    <div className="space-y-3">

      <label className="block font-semibold">
        {label}
      </label>

      <input
        type="file"
        onChange={handleChange}
        className="block w-full border rounded-lg p-3"
      />

      {uploading && (
        <p>Uploading...</p>
      )}

      {value && (
        <div className="flex items-center gap-2 text-blue-600">
          <FileText size={18} />
          <span>File uploaded</span>
        </div>
      )}

    </div>
  );
};

export default FileUpload;
