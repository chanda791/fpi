import { useEffect, useRef, useState, type CSSProperties } from "react";
import { X, FileText, Images } from "lucide-react";
import { getAssetUrl } from "../../services/config";
import DocumentPreviewModal from "../DocumentPreviewModal";
import Lightbox from "../Lightbox";

interface ProgramSection {
  heading?: string;
  body?: string;
  image?: string;
  images?: string[];
  fileUrl?: string;
  fileName?: string;
}

interface ProgramSectionsProps {
  sections?: ProgramSection[];
}

const BODY_PREVIEW_THRESHOLD = 160;

function useFadeUp(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}ms, transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}ms`,
    } as CSSProperties,
  };
}

const ProgramSectionCard = ({
  section,
  index,
  onReadMore,
}: {
  section: ProgramSection;
  index: number;
  onReadMore: () => void;
}) => {
  const { ref, style } = useFadeUp((index % 3) * 100);
  const galleryCount = section.images?.length || 0;
  const isLong = (section.body?.length || 0) > BODY_PREVIEW_THRESHOLD;
  const hasMore = isLong || galleryCount > 0;
  const [previewing, setPreviewing] = useState(false);

  return (
    <div
      ref={ref}
      style={style}
      className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      {section.image && (
        <div className="relative h-56">
          <img
            src={getAssetUrl(section.image)}
            alt={section.heading || ""}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {String(index + 1).padStart(2, "0")}
          </span>
          {galleryCount > 0 && (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Images size={12} /> {galleryCount}
            </span>
          )}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {!section.image && (
          <span className="text-[#C9293A] text-xs font-bold tracking-[0.16em] uppercase mb-3">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {section.heading && (
          <h3 className="font-serif text-xl font-bold mb-3">{section.heading}</h3>
        )}
        {section.body && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 whitespace-pre-line">
            {section.body}
          </p>
        )}
        {hasMore && (
          <button
            type="button"
            onClick={onReadMore}
            className="inline-flex items-center gap-1 text-[#C9293A] font-semibold text-sm mt-4 hover:gap-2 transition-all self-start"
          >
            {isLong ? "Read More" : "View Gallery"}
          </button>
        )}
        {section.fileUrl && (
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="inline-flex items-center gap-2 text-[#C9293A] font-semibold text-sm mt-4 hover:gap-3 transition-all self-start"
          >
            <FileText size={16} />
            View Document
          </button>
        )}
      </div>

      {previewing && section.fileUrl && (
        <DocumentPreviewModal
          fileUrl={section.fileUrl}
          title={section.fileName || section.heading}
          onClose={() => setPreviewing(false)}
        />
      )}
    </div>
  );
};

const ProgramSectionModal = ({
  section,
  onClose,
}: {
  section: ProgramSection;
  onClose: () => void;
}) => {
  const [previewing, setPreviewing] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const galleryUrls = (section.images || []).map((url) => getAssetUrl(url));

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

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {section.image && (
          <img
            src={getAssetUrl(section.image)}
            alt={section.heading || ""}
            className="w-full h-56 sm:h-72 object-cover rounded-t-3xl"
          />
        )}
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            {section.heading && (
              <h3 className="font-serif text-2xl sm:text-3xl font-black">{section.heading}</h3>
            )}
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          {section.body && (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.body}</p>
          )}

          {galleryUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-6">
              {galleryUrls.map((url, i) => (
                <button
                  key={`${url}-${i}`}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="relative rounded-xl overflow-hidden aspect-square group"
                >
                  <img
                    src={url}
                    alt={`${section.heading || "Gallery"} ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </button>
              ))}
            </div>
          )}

          {section.fileUrl && (
            <button
              type="button"
              onClick={() => setPreviewing(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-5 py-2.5 rounded-full text-sm font-semibold mt-6 hover:-translate-y-0.5 transition"
            >
              <FileText size={16} />
              View Document
            </button>
          )}
        </div>
      </div>

      {previewing && section.fileUrl && (
        <DocumentPreviewModal
          fileUrl={section.fileUrl}
          title={section.fileName || section.heading}
          onClose={() => setPreviewing(false)}
        />
      )}

      {galleryUrls.length > 0 && (
        <Lightbox
          images={galleryUrls}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};

/**
 * Renders the admin-editable "sections" content blocks shared by every
 * program page (Advocacy, Media Literacy, Research, Capacity Building) as
 * a card grid, matching the look of the Activities listing / SheRise
 * project grid elsewhere on the site. Long bodies are clamped in the card
 * with a "Read More" that opens the full text in a popup.
 */
const ProgramSections = ({ sections }: ProgramSectionsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!sections || sections.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sections.map((section, index) => (
            <ProgramSectionCard
              key={index}
              section={section}
              index={index}
              onReadMore={() => setOpenIndex(index)}
            />
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <ProgramSectionModal
          section={sections[openIndex]}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
};

export default ProgramSections;
