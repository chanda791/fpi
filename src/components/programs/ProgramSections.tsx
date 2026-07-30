import { useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";
import { getAssetUrl } from "../../services/config";

interface ProgramSection {
  heading?: string;
  body?: string;
  image?: string;
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
  const isLong = (section.body?.length || 0) > BODY_PREVIEW_THRESHOLD;

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
        {isLong && (
          <button
            type="button"
            onClick={onReadMore}
            className="inline-flex items-center gap-1 text-[#C9293A] font-semibold text-sm mt-4 hover:gap-2 transition-all self-start"
          >
            Read More
          </button>
        )}
      </div>
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
        </div>
      </div>
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
