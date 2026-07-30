import { useEffect, useRef, useState } from "react";
import {
  Search,
  BookOpen,
  FileText,
  Newspaper,
  GraduationCap,
  Download,
  ArrowRight,
  Mail,
} from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const resourcesData = {
  hero: {
    eyebrow: "Knowledge Centre",
    title: "Resources",
    highlight: "Hub",
    description:
      "Access reports, newsletters, publications, media literacy resources and knowledge products supporting media freedom and democratic participation in Zambia.",
    backgroundImage: "/images/activity-1.jpg",
    ctaPrimary: { text: "Explore Resources", link: "#browse" },
    ctaSecondary: { text: "Latest Publications", link: "#latest" },
  },
  categories: {
    tag: "Knowledge Areas",
    title: "Browse Resources",
    items: [
      {
        title: "Reports",
        icon: FileText,
        description: "Research findings, studies and assessments.",
      },
      {
        title: "Newsletters",
        icon: Newspaper,
        description: "Latest updates and stories from FPI Zambia.",
      },
      {
        title: "Publications",
        icon: BookOpen,
        description: "Guides, manuals and knowledge products.",
      },
      {
        title: "Press Statements",
        icon: Newspaper,
        description: "Official statements and media releases.",
      },
      {
        title: "MIL Resources",
        icon: GraduationCap,
        description: "Media and Information Literacy materials.",
      },
      {
        title: "Toolkits",
        icon: Download,
        description: "Practical resources for training and advocacy.",
      },
    ],
  },
  featured: {
    tag: "Featured Resource",
    title: "Media Freedom Report 2025",
    description:
      "A comprehensive review of media freedom, journalism safety, digital rights and democratic participation trends in Zambia.",
    image: "/images/activity-1.jpg",
    buttons: [
      { text: "Read Report", link: "#" },
      { text: "Download PDF", link: "#" },
    ],
  },
  latest: {
    tag: "Latest Resources",
    title: "Latest Resources",
    items: [
      {
        type: "Report",
        title: "Media Freedom Report 2025",
        date: "June 2025",
        image: "/images/activity-1.jpg",
      },
      {
        type: "Newsletter",
        title: "FPI Newsletter - June Edition",
        date: "June 2025",
        image: "/images/activity-2.jpg",
      },
      {
        type: "Publication",
        title: "Digital Literacy Guide",
        date: "May 2025",
        image: "/images/activity-3.jpg",
      },
    ],
  },
  stats: {
    tag: "Our Impact",
    title: "Knowledge in Numbers",
    items: [
      { number: "50+", label: "Publications" },
      { number: "25+", label: "Reports" },
      { number: "13+", label: "MIL Hubs" },
      { number: "5000+", label: "Downloads" },
    ],
  },
  subscribe: {
    title: "Stay Updated",
    description:
      "Receive reports, publications, training opportunities and media freedom updates.",
    placeholder: "Enter your email address",
    buttonText: "Subscribe",
  },
  cta: {
    title: "Knowledge Drives Change",
    description:
      "Explore evidence-based resources that strengthen media freedom, literacy and democratic participation.",
    buttonText: "Explore Knowledge Centre",
    link: "#browse",
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
const SectionBadge = ({ text, icon, light = false }: { text: string; icon?: React.ReactNode; light?: boolean }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 ${
      light ? "bg-white/10" : "bg-[#C9293A]/10"
    }`}
  >
    {icon && (
      <span className={light ? "text-white" : "text-[#C9293A]"}>{icon}</span>
    )}
    <span
      className={`text-xs font-medium tracking-wide ${
        light ? "text-white" : "text-[#C9293A]"
      }`}
    >
      {text}
    </span>
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

// ============================================================
// MAIN COMPONENT
// ============================================================
const Resources = () => {
  const [liveResources, setLiveResources] = useState<any[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/resources`)
      .then((res) => res.json())
      .then((data: any[]) => setLiveResources(data.filter((r) => r.published)))
      .catch((err) => console.error(err));

    fetch(`${API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data: any[]) => {
        const published = Array.isArray(data) ? data.filter((r) => r.published) : [];
        // Reports are keyed by when they were written/posted (createdAt) --
        // the most recently posted one is treated as "the latest report".
        const sorted = published.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLatestReport(sorted[0] || null);
      })
      .catch((err) => console.error(err));
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
          style={{ backgroundImage: `url(${resourcesData.hero.backgroundImage})` }}
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
                {resourcesData.hero.eyebrow}
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {resourcesData.hero.title}{" "}
              <span className="gradient-highlight">{resourcesData.hero.highlight}</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              {resourcesData.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={resourcesData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {resourcesData.hero.ctaPrimary.text}
              </a>
              <a
                href={resourcesData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {resourcesData.hero.ctaSecondary.text}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SEARCH (no animation, but keep styling) ========== */}
      <section className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports, newsletters, publications..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C9293A]"
            />
          </div>
        </div>
      </section>

      {/* ========== RESOURCE CATEGORIES ========== */}
      <section id="browse" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <SectionBadge text={resourcesData.categories.tag} icon={<BookOpen size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {resourcesData.categories.title}
            </h2>
            <p className="text-gray-600">Explore knowledge products across different categories.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourcesData.categories.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={idx * 100}>
                  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-gray-100">
                    <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                      <Icon className="w-7 h-7 text-[#C9293A]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FEATURED RESOURCE ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-[#080c1a] rounded-2xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
              <div
                className="min-h-[400px] bg-cover bg-center"
                style={{ backgroundImage: `url(${resourcesData.featured.image})` }}
              ></div>
              <div className="p-8 lg:p-12 text-white flex flex-col justify-center">
                <span className="text-[#C9A84C] uppercase tracking-wider text-xs font-semibold mb-3">
                  {latestReport
                    ? `Latest Report — ${new Date(latestReport.createdAt).getFullYear()}`
                    : resourcesData.featured.tag}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
                  {latestReport ? latestReport.title : resourcesData.featured.title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                  {latestReport
                    ? latestReport.description || resourcesData.featured.description
                    : resourcesData.featured.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {latestReport ? (
                    <>
                      <a
                        href={getAssetUrl(latestReport.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-full text-sm font-semibold transition hover:-translate-y-1 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white shadow-lg"
                      >
                        Read Report
                      </a>
                      <a
                        href={getAssetUrl(latestReport.fileUrl)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-full text-sm font-semibold transition hover:-translate-y-1 border border-white/30 text-white hover:bg-white/10"
                      >
                        Download PDF
                      </a>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">No reports have been published yet.</p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== LATEST RESOURCES ========== */}
      <section id="latest" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <AnimatedSection>
              <SectionBadge text="Fresh Content" icon={<Newspaper size={14} />} />
              <h2 className="font-serif text-3xl md:text-4xl font-black">Latest Resources</h2>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <a href="/documents/resource.pdf" className="inline-flex items-center gap-2 text-[#C9293A] font-semibold text-sm hover:gap-3 transition">
                View All <ArrowRight size={14} />
              </a>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(liveResources.length > 0
              ? liveResources.map((r) => ({
                  title: r.title,
                  type: r.category || "Resource",
                  date: new Date(r.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long" }),
                  image: r.thumbnail ? getAssetUrl(r.thumbnail) : "/images/activity-1.jpg",
                  href: r.link || r.fileUrl || "#",
                }))
              : resourcesData.latest.items.map((item) => ({
                  title: item.title,
                  type: item.type,
                  date: item.date,
                  image: item.image,
                  href: "/documents/resource.pdf",
                }))
            ).map((item, idx) => (
              <AnimatedSection key={idx} delay={idx * 100}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <div className="p-6">
                    <span className="text-[#C9293A] text-xs font-semibold uppercase tracking-wide">
                      {item.type}
                    </span>
                    <h3 className="font-serif text-xl font-bold mt-2 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{item.date}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#C9293A] font-medium text-sm hover:gap-2 transition"
                    >
                      Open <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS (with static background) ========== */}
      <section className="relative py-20 md:py-28 bg-[#080c1a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/activity-1.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-[#080c1a]/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <SectionBadge text={resourcesData.stats.tag} light />
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white">
              {resourcesData.stats.title}
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {resourcesData.stats.items.map((stat, idx) => (
              <AnimatedSection key={stat.label} delay={idx * 100}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="font-serif text-4xl md:text-5xl font-black text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SUBSCRIBE ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Mail className="w-14 h-14 text-[#C9293A] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {resourcesData.subscribe.title}
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              {resourcesData.subscribe.description}
            </p>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder={resourcesData.subscribe.placeholder}
                className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9293A]"
              />
              <button className="bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition shadow-lg">
                {resourcesData.subscribe.buttonText}
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 md:py-28 bg-[#080c1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-5xl font-black mb-4">
              {resourcesData.cta.title}
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {resourcesData.cta.description}
            </p>
            <a
              href={resourcesData.cta.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {resourcesData.cta.buttonText}
              <ArrowRight size={18} />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Resources;