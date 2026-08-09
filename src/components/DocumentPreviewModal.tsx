import { useEffect, useState } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";
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

  // Mobile browsers (iOS Safari especially) don't support the native
  // paginated PDF viewer inside an <iframe> -- it just renders a static
  // first page with no scroll/pagination, which reads as "only one page
  // exists". The same URL opened as the browser's own top-level document
  // works fine, so on small screens we skip the iframe and point people at
  // "Open Document" instead of showing a broken-looking preview.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

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
          ) : isMobile ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
              <FileText size={48} className="text-slate-400" />
              <p className="text-slate-600 max-w-xs">
                Document preview isn't supported inline on mobile browsers. Open it to view the full document.
              </p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C9293A] text-white px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                <ExternalLink size={16} /> Open Document
              </a>
            </div>
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
