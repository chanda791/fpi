import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../../services/config";
import ProgramSections from "../../components/programs/ProgramSections";
import { useProgramContent } from "../../hooks/useProgramContent";
import {
  GraduationCap,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  Globe,
  Images,
} from "lucide-react";

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const capacityData = {
  hero: {
    title: "Capacity Building",
    subtitle:
      "Strengthening the knowledge, skills and capabilities of journalists, media institutions and communities across Zambia.",
      backgroundImage: `url("/images/hero-bg-1.jpg")`,
      ctaPrimary: { text: "Explore Programs", link: "/programs" },
    ctaSecondary: { text: "Partner With Us", link: "/contact" },
  },
  intro: {
    tag: "Our Approach",
    title: "Building Skills for Sustainable Impact",
    paragraphs: [
      "FPI Zambia delivers practical training, mentorship and professional development opportunities designed to strengthen journalism, leadership and civic engagement.",
      "Our capacity-building initiatives empower individuals and institutions with tools, knowledge and confidence to create lasting positive change.",
    ],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
  },
  areas: {
    tag: "What We Do",
    title: "Capacity Building Areas",
    items: [
      {
        icon: GraduationCap,
        title: "Professional Training",
        description:
          "Journalism, media ethics, investigative reporting and digital media skills.",
      },
      {
        icon: Users,
        title: "Leadership Development",
        description:
          "Building leadership and management capacity within organizations and communities.",
      },
      {
        icon: Briefcase,
        title: "Institutional Support",
        description:
          "Strengthening systems, governance and operational effectiveness.",
      },
      {
        icon: Award,
        title: "Mentorship Programs",
        description:
          "Connecting experienced professionals with emerging leaders and journalists.",
      },
    ],
  },
  impact: {
    tag: "Our Reach",
    title: "Capacity Building Impact",
    stats: [
      { number: "500+", label: "Professionals Trained" },
      { number: "100+", label: "Workshops Conducted" },
      { number: "50+", label: "Partner Organizations" },
      { number: "20+", label: "Mentorship Programs" },
    ],
  },
  cta: {
    title: "Empower Through Capacity Building",
    subtitle:
      "Partner with FPI Zambia to strengthen journalism, leadership and civic engagement across the country.",
    button: { text: "Get Involved", link: "/contact" },
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
const CapacityBuilding = () => {
  const cms = useProgramContent("capacity-building");

  const heroImage = cms?.heroImage ? getAssetUrl(cms.heroImage) : capacityData.hero.backgroundImage;
  const heroSubtitle = cms?.intro || cms?.subtitle || capacityData.hero.subtitle;
  const heroTitle = cms?.title;

  return (
    <div className="font-sans bg-gradient-to-b from-white to-gray-50">
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
                Our Programs
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {heroTitle || (
                <>
                  Capacity <GradText>Building</GradText>
                </>
              )}
            </h1>

            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={capacityData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {capacityData.hero.ctaPrimary.text}
              </Link>
              <Link
                to={capacityData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {capacityData.hero.ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CMS CONTENT SECTIONS ========== */}
      <ProgramSections sections={cms?.sections} />

      {/* ========== INTRO SECTION ========== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <SectionBadge text={capacityData.intro.tag} icon={<Globe size={14} />} />
              <h2 className="font-serif text-3xl md:text-4xl font-black mb-6">
                {capacityData.intro.title}
              </h2>
              {capacityData.intro.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={capacityData.intro.image}
                  alt="Capacity Building"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== CAPACITY BUILDING AREAS – COLORFUL CARDS ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A]">
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
            {capacityData.areas.tag}
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black mt-4">{capacityData.areas.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capacityData.areas.items.map((area, idx) => {
            const Icon = area.icon;
            return (
              <AnimatedSection key={area.title} delay={idx * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9293A] to-[#E8610A] flex items-center justify-center text-white mb-5 shadow-md">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3">{area.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{area.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      {/* ========== IMPACT SECTION (with background image) – STATS CARDS ========== */}
      <section className="relative overflow-hidden py-20 mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg-1.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/80 mb-4">
            <span className="block w-6 h-[2px] bg-[#E8610A]" />
            {capacityData.impact.tag}
            <span className="block w-6 h-[2px] bg-[#E8610A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-12">
            {capacityData.impact.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capacityData.impact.stats.map((stat, idx) => (
              <AnimatedSection key={stat.label} delay={idx * 100}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition">
                  <div className="font-serif text-4xl md:text-5xl font-black text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <div className="bg-gradient-to-r from-[#C9293A]/10 to-[#E8610A]/10 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-black mb-4 text-gray-900">
            {capacityData.cta.title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            {capacityData.cta.subtitle}
          </p>
          <Link
            to={capacityData.cta.button.link}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            {capacityData.cta.button.text}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CapacityBuilding;