import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import ProgramSections from "../../components/programs/ProgramSections";
import {
  FileText,
  Search,
  BarChart3,
  BookOpen,
  ArrowRight,
  Globe,
} from "lucide-react";

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const researchData = {
  hero: {
    title: "Research & Publications",
    subtitle:
      "Generating evidence, insights and knowledge that strengthen media development, democratic governance and informed public participation.",
    backgroundImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600",
    ctaPrimary: { text: "Explore Publications", link: "/knowledge/reports" },
    ctaSecondary: { text: "Contact Research Team", link: "/contact" },
  },
  overview: {
    tag: "Our Work",
    title: "Research That Drives Change",
    paragraphs: [
      "FPI Zambia conducts research and produces publications that contribute to evidence-based decision making within the media and governance sectors.",
      "Our studies, reports and policy briefs help stakeholders understand emerging challenges, opportunities and trends affecting media freedom, civic engagement and democratic development.",
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
  },
  researchAreas: {
    tag: "What We Do",
    title: "Research Areas",
    items: [
      {
        icon: Search,
        title: "Media Studies",
        description:
          "Research on media trends, journalism practices and information ecosystems.",
      },
      {
        icon: FileText,
        title: "Policy Briefs",
        description:
          "Evidence-based recommendations for policy makers and stakeholders.",
      },
      {
        icon: BarChart3,
        title: "Data Analysis",
        description:
          "Measuring trends and impact across media and governance sectors.",
      },
      {
        icon: BookOpen,
        title: "Publications",
        description:
          "Reports, studies, manuals and knowledge products for public use.",
      },
    ],
  },
  publications: {
    tag: "Knowledge Hub",
    title: "Featured Publications",
    items: [
      {
        title: "State of Media Freedom Report",
        description:
          "Annual assessment of media freedom and journalism conditions in Zambia.",
      },
      {
        title: "Digital Media Trends Study",
        description:
          "Exploring emerging technologies and digital transformation in media.",
      },
      {
        title: "Media Literacy Toolkit",
        description:
          "Resources for educators, journalists and community leaders.",
      },
    ],
  },
  cta: {
    title: "Access Our Latest Research",
    subtitle:
      "Explore our reports, policy briefs, and toolkits to stay informed about media freedom and governance in Zambia.",
    button: { text: "View All Publications", link: "/knowledge/reports" },
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
    }}
  >
    {children}
  </span>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
const Research = () => {
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/program-content/research`)
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error(err));
  }, []);

  const heroImage = cms?.heroImage ? getAssetUrl(cms.heroImage) : researchData.hero.backgroundImage;
  const heroSubtitle = cms?.intro || cms?.subtitle || researchData.hero.subtitle;
  const heroTitle = cms?.title;

  return (
    <div className="font-sans">
      {/* ========== HERO SECTION – FIXED BACKGROUND ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image layer (static) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* Red and gold accent glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9293A]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/15 blur-3xl rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl text-center mx-auto">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                Knowledge Hub
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {heroTitle || (
                <>
                  Research & <GradText>Publications</GradText>
                </>
              )}
            </h1>

            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={researchData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {researchData.hero.ctaPrimary.text}
              </Link>
              <Link
                to={researchData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {researchData.hero.ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CMS CONTENT SECTIONS ========== */}
      <ProgramSections sections={cms?.sections} />

      {/* ========== OVERVIEW SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <SectionBadge text={researchData.overview.tag} icon={<Globe size={14} />} />
              <h2 className="font-serif text-3xl md:text-4xl font-black mb-6">
                {researchData.overview.title}
              </h2>
              {researchData.overview.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <img
                src={researchData.overview.image}
                alt="Research"
                className="rounded-3xl shadow-2xl w-full h-[450px] object-cover"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== RESEARCH AREAS SECTION ========== */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={researchData.researchAreas.tag} icon={<BookOpen size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {researchData.researchAreas.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchData.researchAreas.items.map((area, idx) => {
              const Icon = area.icon;
              return (
                <AnimatedSection key={area.title} delay={idx * 100}>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                    <Icon className="w-12 h-12 text-[#C9293A] mb-4" />
                    <h3 className="font-serif text-xl font-bold mb-3">{area.title}</h3>
                    <p className="text-gray-600">{area.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FEATURED PUBLICATIONS SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={researchData.publications.tag} icon={<FileText size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {researchData.publications.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {researchData.publications.items.map((pub, idx) => (
              <AnimatedSection key={pub.title} delay={idx * 100}>
                <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <FileText className="w-10 h-10 text-[#C9293A] mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-3">{pub.title}</h3>
                  <p className="text-gray-600">{pub.description}</p>
                  <Link
                    to="/knowledge/reports"
                    className="inline-flex items-center gap-1 text-[#C9293A] font-medium text-sm mt-4 hover:gap-2 transition-all"
                  >
                    Read more <ArrowRight size={12} />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <section className="py-20 md:py-28 bg-[#080c1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4 text-white">
              Access Our <span className="text-[#C9A84C]">Latest Research</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {researchData.cta.subtitle}
            </p>
            <Link
              to={researchData.cta.button.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {researchData.cta.button.text}
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Research;