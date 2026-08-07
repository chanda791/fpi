import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  Download,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { API_BASE_URL } from "../../services/config";

interface Publication {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  image?: string;
  published: boolean;
  createdAt: string;
}

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const publicationsData = {
  hero: {
    eyebrow: "Knowledge Centre",
    title: "Publications",
    description:
      "Access guides, manuals, policy briefs, toolkits and educational resources developed by FPI Zambia.",
    backgroundImage: "/images/publications.jpg",
    ctaPrimary: { text: "Explore Archive", link: "#archive" },
    ctaSecondary: { text: "Latest Guides", link: "#latest" },
  },
  categories: {
    tag: "Resource Types",
    title: "Publication Categories",
    items: [
      {
        icon: FileText,
        title: "Policy Briefs",
        description: "Evidence-based recommendations and policy insights.",
      },
      {
        icon: GraduationCap,
        title: "MIL Guides",
        description: "Media & Information Literacy learning resources.",
      },
      {
        icon: Download,
        title: "Toolkits",
        description: "Practical implementation and training resources.",
      },
    ],
  },
  featured: {
    tag: "Featured Publication",
    title: "Media & Information Literacy Guide",
    description:
      "A practical handbook supporting media literacy, digital citizenship and critical thinking.",
    image: "/images/activity-1.jpg",
    buttonText: "Download Guide",
    link: "#",
  },
  archive: {
    tag: "Archive",
    title: "Publications Archive",
    items: [
      {
        title: "Media & Information Literacy Guide",
        category: "MIL Guide",
        date: "June 2025",
        image: "/images/activity-1.jpg",
      },
      {
        title: "Digital Literacy Toolkit",
        category: "Toolkit",
        date: "May 2025",
        image: "/images/activity-2.jpg",
      },
      {
        title: "Media Freedom Policy Brief",
        category: "Policy Brief",
        date: "April 2025",
        image: "/images/activity-3.jpg",
      },
    ],
  },
  cta: {
    title: "Knowledge for Change",
    description:
      "Explore our publications to strengthen media literacy, advocacy and democratic participation.",
    buttonText: "Explore All Publications",
    link: "#archive",
  },
};

// ============================================================
// CUSTOM HOOK FOR SCROLL ANIMATION
// ============================================================
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
    } as React.CSSProperties,
  };
}

// ============================================================
// SECTION COMPONENTS
// ============================================================
const SectionBadge = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 bg-[#C9293A]/10 rounded-full px-4 py-1.5 mb-6">
    {icon && <span className="text-[#C9293A]">{icon}</span>}
    <span className="text-xs font-medium text-[#C9293A] tracking-wide">{text}</span>
  </div>
);

const AnimatedSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, style } = useFadeUp(delay);
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

const GradText = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      background: "linear-gradient(120deg, #E8610A, #F5A623)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontStyle: "italic",
      textDecoration: "none",
    }}
  >
    {children}
  </span>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Publication | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/publications`)
      .then((res) => res.json())
      .then((data: Publication[]) => {
        setPublications(data.filter((p) => p.published));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans bg-gradient-to-b from-white to-gray-50">
      <style>{`
        .sr-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .sr-section.sr-visible { opacity: 1; transform: translateY(0); }
        .gradient-highlight {
          background: linear-gradient(120deg, #E8610A, #F5A623);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-style: italic;
          text-decoration: none !important;
          display: inline-block;
        }
      `}</style>

      {/* ========== HERO – FIXED BACKGROUND ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${publicationsData.hero.backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9293A]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/15 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                {publicationsData.hero.eyebrow}
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              <GradText>Publications</GradText>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              {publicationsData.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={publicationsData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {publicationsData.hero.ctaPrimary.text}
              </a>
              <a
                href={publicationsData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {publicationsData.hero.ctaSecondary.text}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge text={publicationsData.categories.tag} icon={<BookOpen size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {publicationsData.categories.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {publicationsData.categories.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={idx * 100}>
                  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100">
                    <Icon className="w-10 h-10 text-[#C9293A] mb-4" />
                    <h3 className="font-serif text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== ARCHIVE ========== */}
      <section id="archive" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <SectionBadge text={publicationsData.archive.tag} icon={<FileText size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black">
              {publicationsData.archive.title}
            </h2>
          </AnimatedSection>

          {loading ? (
            null
          ) : publications.length === 0 ? (
            <p className="text-center text-gray-500">
              No publications have been added yet. Check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {publications.map((item, idx) => (
                <AnimatedSection key={item.id} delay={idx * 100}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {item.image && (
                      <div className="h-44 bg-gray-100 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-[#C9293A] text-xs font-semibold uppercase tracking-wide">
                        Publication
                      </span>
                      <h3 className="font-serif text-xl font-bold mt-2 mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setSelected(item)}
                          className="inline-flex items-center gap-1 text-[#C9293A] font-medium text-sm hover:gap-2 transition"
                        >
                          View Details <ArrowRight size={12} />
                        </button>
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gray-500 font-medium text-sm hover:text-[#C9293A] transition"
                        >
                          Preview
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DETAIL MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl leading-none"
            >
              &times;
            </button>
            <span className="text-[#C9293A] text-xs font-semibold uppercase tracking-wide">
              Publication
            </span>
            <h3 className="font-serif text-2xl font-black mt-2 mb-2">{selected.title}</h3>
            <p className="text-gray-400 text-sm mb-5">
              {new Date(selected.createdAt).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {selected.description}
            </p>
            <a
              href={selected.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 transition"
            >
              Preview Document <ArrowRight size={15} />
            </a>
          </div>
        </div>
      )}

      {/* ========== CTA ========== */}
      <section className="py-20 md:py-28 bg-[#080c1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-5xl font-black mb-4">
              {publicationsData.cta.title}
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {publicationsData.cta.description}
            </p>
            <a
              href={publicationsData.cta.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {publicationsData.cta.buttonText}
              <ArrowRight size={18} />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Publications;