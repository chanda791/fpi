import { useEffect } from "react";
import { X, Download, ExternalLink } from "lucide-react";
import { getAssetUrl, getDownloadUrl, getPreviewUrl } from "../services/config";

interface DocumentPreviewModalProps {
  fileUrl: string;
  title?: string;
  onClose: () => void;
}

const isImageFile = (url: string) =>
  /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);

/**
 * Lets a user review a document (PDF or image) inline before deciding to
 * download it, instead of jumping straight to a new tab / forced download.
 */
const DocumentPreviewModal = ({ fileUrl, title, onClose }: DocumentPreviewModalProps) => {
  const resolvedUrl = getAssetUrl(fileUrl);
  const isImage = isImageFile(resolvedUrl);
  // Cloudinary forces a download for raw (PDF/doc) files unless we
  // explicitly ask for an inline response via our own proxy -- images
  // are inline by default and don't need it.
  const previewUrl = isImage ? resolvedUrl : getPreviewUrl(fileUrl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!resolvedUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-semibold text-slate-800 truncate">
            {title || "Document Preview"}
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
            <a
              href={getDownloadUrl(fileUrl, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 flex items-center justify-center transition"
              title="Download"
            >
              <Download size={16} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center transition"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-100 overflow-auto">
          {isImage ? (
            <img
              src={resolvedUrl}
              alt={title || "Preview"}
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={previewUrl}
              title={title || "Document Preview"}
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
