import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ShieldCheck,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import ProgramSections from "../../components/programs/ProgramSections";

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const mediaLiteracyData = {
  hero: {
    title: "Media & Information Literacy",
    subtitle:
      "Empowering citizens to critically access, analyze, evaluate and create information in an increasingly digital world.",
    backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600",
    ctaPrimary: { text: "Explore Programs", link: "/programs" },
    ctaSecondary: { text: "Learn More", link: "/about" },
  },
  intro: {
    tag: "Why It Matters",
    title: "Why Media Literacy Matters",
    paragraphs: [
      "In today's digital environment, citizens are exposed to large volumes of information from social media, websites, radio, television and online platforms.",
      "Media and Information Literacy helps people identify misinformation, understand media messages, verify information and participate responsibly in democratic processes.",
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
  },
  focusAreas: {
    tag: "Our Focus",
    title: "Key Focus Areas",
    items: [
      {
        icon: BookOpen,
        title: "Critical Thinking",
        description:
          "Teaching citizens how to evaluate information and news sources critically.",
      },
      {
        icon: ShieldCheck,
        title: "Fact Checking",
        description:
          "Promoting verification skills to combat misinformation and fake news.",
      },
      {
        icon: Users,
        title: "Community Awareness",
        description:
          "Building informed communities capable of responsible media consumption.",
      },
      {
        icon: Globe,
        title: "Digital Citizenship",
        description:
          "Encouraging safe and responsible online participation.",
      },
    ],
  },
  impact: {
    tag: "Our Reach",
    title: "Program Impact",
    stats: [
      { number: "100+", label: "Training Sessions" },
      { number: "5,000+", label: "Citizens Reached" },
      { number: "50+", label: "Communities Engaged" },
      { number: "25+", label: "Partner Organizations" },
    ],
  },
  cta: {
    title: "Join the Media Literacy Movement",
    subtitle:
      "Help us build a more informed and resilient Zambia. Partner with FPI to promote critical thinking and digital citizenship.",
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
const MediaLiteracy = () => {
  const [cms, setCms] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/program-content/media-literacy`)
      .then((res) => res.json())
      .then((data) => setCms(data))
      .catch((err) => console.error(err));
  }, []);

  const heroImage = cms?.heroImage ? getAssetUrl(cms.heroImage) : mediaLiteracyData.hero.backgroundImage;
  const heroSubtitle = cms?.intro || cms?.subtitle || mediaLiteracyData.hero.subtitle;
  const heroTitle = cms?.title;

  return (
    <>
      {/* ========== HERO SECTION – MATCHES OTHER PAGES ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image layer (static/fixed) */}
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
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                Media & Information Literacy
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {heroTitle || (
                <>
                  Media & <GradText>Information Literacy</GradText>
                </>
              )}
            </h1>

            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={mediaLiteracyData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {mediaLiteracyData.hero.ctaPrimary.text}
              </Link>
              <Link
                to={mediaLiteracyData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {mediaLiteracyData.hero.ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CMS CONTENT SECTIONS ========== */}
      <ProgramSections sections={cms?.sections} />

      {/* ========== INTRO SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <SectionBadge text={mediaLiteracyData.intro.tag} icon={<BookOpen size={14} />} />
              <h2 className="font-serif text-3xl md:text-4xl font-black mb-6">
                {mediaLiteracyData.intro.title}
              </h2>
              {mediaLiteracyData.intro.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <img
                src={mediaLiteracyData.intro.image}
                alt="Media Literacy"
                className="rounded-3xl shadow-2xl w-full h-[450px] object-cover"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== FOCUS AREAS SECTION ========== */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={mediaLiteracyData.focusAreas.tag} icon={<Globe size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {mediaLiteracyData.focusAreas.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mediaLiteracyData.focusAreas.items.map((area, idx) => {
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

      {/* ========== IMPACT SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={mediaLiteracyData.impact.tag} icon={<CheckCircle2 size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {mediaLiteracyData.impact.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {mediaLiteracyData.impact.stats.map((stat, idx) => (
              <AnimatedSection key={stat.label} delay={idx * 100}>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="font-serif text-4xl md:text-5xl font-black text-[#C9293A] mb-2">
                    {stat.number}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
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
              Join the <span className="text-[#C9A84C]">Media Literacy</span> Movement
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {mediaLiteracyData.cta.subtitle}
            </p>
            <Link
              to={mediaLiteracyData.cta.button.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              {mediaLiteracyData.cta.button.text}
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default MediaLiteracy;