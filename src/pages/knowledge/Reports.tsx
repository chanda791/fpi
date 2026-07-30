import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { API_BASE_URL } from "../../services/config";

interface Report {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  published: boolean;
  createdAt: string;
}

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const reportsData = {
  hero: {
    eyebrow: "Knowledge Centre",
    title: "Reports & Publications",
    description:
      "Research reports, policy briefs, toolkits and publications produced by FPI Zambia.",
    backgroundImage: "/images/activity-1.jpg",
    ctaPrimary: { text: "Explore Reports", link: "#reports" },
    ctaSecondary: { text: "View All Publications", link: "#archive" },
  },
  intro: {
    tag: "Knowledge Resources",
    title: "Evidence for Change",
    description:
      "Our publications provide evidence, analysis and practical guidance to strengthen journalism, media literacy and democratic governance.",
    icon: BookOpen,
  },
  reports: {
    tag: "Our Reports",
    title: "Latest Reports & Publications",
    items: [
      {
        title: "State of Media Freedom Report 2025",
        category: "Research Report",
        date: "May 2025",
        description:
          "An assessment of media freedom, journalism practices and access to information in Zambia.",
        icon: FileText,
      },
      {
        title: "Media Literacy Toolkit",
        category: "Educational Resource",
        date: "March 2025",
        description:
          "A practical guide for educators, journalists and community leaders.",
        icon: FileText,
      },
      {
        title: "Digital Media Trends Study",
        category: "Research Publication",
        date: "January 2025",
        description:
          "Exploring digital transformation and emerging technologies in the media sector.",
        icon: FileText,
      },
    ],
  },
  cta: {
    title: "Stay Informed",
    description:
      "Subscribe to receive updates on new publications, research findings and media freedom reports.",
    buttonText: "Subscribe Now",
    link: "#",
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
const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data: Report[]) => {
        setReports(data.filter((r) => r.published));
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
          style={{ backgroundImage: `url(${reportsData.hero.backgroundImage})` }}
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
                {reportsData.hero.eyebrow}
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              <GradText>Reports & Publications</GradText>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              {reportsData.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={reportsData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {reportsData.hero.ctaPrimary.text}
              </a>
              <a
                href={reportsData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {reportsData.hero.ctaSecondary.text}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== INTRO SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 text-[#C9293A] mb-4">
              <span className="block w-6 h-[2px] bg-[#C9293A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase">{reportsData.intro.tag}</span>
              <span className="block w-6 h-[2px] bg-[#C9293A] rounded-full"></span>
            </div>
            <BookOpen className="w-14 h-14 text-[#C9293A] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-5xl font-black mb-4">
              {reportsData.intro.title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              {reportsData.intro.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== REPORTS CARDS ========== */}
      <section id="reports" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <SectionBadge text={reportsData.reports.tag} icon={<FileText size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black">
              {reportsData.reports.title}
            </h2>
          </AnimatedSection>

          {loading ? (
            null
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-500">
              No reports have been published yet. Check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reports.map((report, idx) => (
                <AnimatedSection key={report.id} delay={idx * 100}>
                  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100 flex flex-col">
                    <FileText className="w-12 h-12 text-[#C9293A] mb-4" />
                    <span className="text-[#C9293A] text-xs font-semibold uppercase tracking-wide">
                      Report
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-2 mb-3">
                      {report.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(report.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                    <p className="text-gray-600 text-sm mb-5 flex-grow">
                      {report.description}
                    </p>
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-1 transition w-fit shadow-md"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 md:py-28 bg-[#080c1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-5xl font-black mb-4">
              {reportsData.cta.title}
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {reportsData.cta.description}
            </p>
            <a
              href={reportsData.cta.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {reportsData.cta.buttonText}
              <ArrowRight size={18} />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Reports;