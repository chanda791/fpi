import { ChangeEvent, useState } from "react";
import { UploadCloud, Link as LinkIcon } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

interface AudioUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
}

const AudioUpload = ({
  label = "Audio",
  value,
  onChange,
}: AudioUploadProps) => {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [uploading, setUploading] = useState(false);
  const [linkValue, setLinkValue] = useState(
    value && value.startsWith("http") && !value.includes(API_BASE_URL)
      ? value
      : ""
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token =
        localStorage.getItem("fpi_admin_token") ||
        sessionStorage.getItem("fpi_admin_token");

      const response = await fetch(`${API_BASE_URL}/media`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Upload failed");
      }

      const media = await response.json();
      onChange(media.url);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Audio upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const applyLink = () => {
    onChange(linkValue.trim());
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
            mode === "upload"
              ? "bg-white shadow text-[#C9293A]"
              : "text-slate-500"
          }`}
        >
          <UploadCloud size={15} />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
            mode === "link"
              ? "bg-white shadow text-[#C9293A]"
              : "text-slate-500"
          }`}
        >
          <LinkIcon size={15} />
          Paste Link
        </button>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <input
            type="file"
            accept="audio/mpeg,audio/mp3,.mp3"
            onChange={handleFileChange}
            className="block w-full text-sm border border-slate-200 rounded-lg p-3"
          />
          <p className="text-xs text-slate-400">MP3 files only.</p>
          {uploading && (
            <p className="text-sm text-slate-500">Uploading...</p>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://facebook.com/... or https://youtube.com/..."
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            onClick={applyLink}
            className="px-4 py-2.5 rounded-lg bg-[#C9293A] text-white text-sm font-semibold hover:bg-red-700 transition"
          >
            Use Link
          </button>
        </div>
      )}

      {value && (
        <div className="pt-2">
          <p className="text-xs text-slate-500 mb-2 break-all">
            Current: {value}
          </p>
          {value.includes(API_BASE_URL) ||
          value.startsWith("/uploads") ||
          value.match(/\.mp3($|\?)/i) ? (
            <audio controls src={getAssetUrl(value) || value} className="w-full" />
          ) : (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C9293A] underline"
            >
              Open external audio link
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
