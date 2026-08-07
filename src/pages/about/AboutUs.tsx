import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  Users,
  Target,
  Eye,
  Shield,
  ArrowRight,
  Scale,
  Globe,
  Lightbulb,
  Heart,
  Landmark,
} from "lucide-react";

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const aboutData = {
  hero: {
    eyebrow: "About FPI Zambia",
    title: "Building informed communities through",
    highlighted: "media freedom",
    description:
      "We empower journalists, strengthen democratic participation, advance media literacy and promote access to information across Zambia.",
    backgroundImage: "/images/hero-bg-2.jpg",
    ctaPrimary: { text: "Meet Our Team", link: "/team" },
    ctaSecondary: { text: "Partner With Us", link: "/contact" },
  },
  whoWeAre: {
    tag: "Who we are",
    title: "Strengthening independent media and democratic participation",
    paragraphs: [
      "Free Press Initiative Zambia (FPI Zambia) is committed to promoting media freedom, access to information, professional journalism, accountability and democratic governance.",
      "Through advocacy, capacity building, research and community engagement, we collaborate with journalists, civil society organizations and citizens to build a more informed, inclusive and democratic Zambia.",
    ],
    highlights: [
      "Media Freedom Advocacy",
      "Capacity Building",
      "Media Literacy",
      "Research & Innovation",
    ],
    image: "/images/activity-3.jpg",
    fullWidthImage: "/images/activity-4.jpg",
  },
  mvv: [
    {
      icon: Target,
      title: "Mission",
      description:
        "To strengthen media freedom, enhance professional journalism and empower citizens through information access and media literacy initiatives.",
    },
    {
      icon: Eye,
      title: "Vision",
      description:
        "A Zambia where independent media, informed citizens and democratic values contribute to inclusive and sustainable development.",
    },
    {
      icon: Shield,
      title: "Core values",
      description:
        "Integrity, accountability, professionalism, inclusiveness, transparency and respect for human rights.",
    },
  ],
  values: [
    { icon: Scale, title: "Integrity" },
    { icon: Globe, title: "Freedom" },
    { icon: Heart, title: "Inclusion" },
    { icon: Lightbulb, title: "Innovation" },
    { icon: Landmark, title: "Democracy" },
    { icon: Users, title: "Participation" },
  ],
  impact: {
    tag: "Our reach",
    title: "Our Impact",
    description:
      "Measuring our contribution to media freedom, media literacy and democratic participation.",
stats: [
  { number: "1,000+", label: "Citizens Reached" },
  { number: "300+", label: "Journalists Trained" },
  { number: "10", label: "MIL Hubs" },
  { number: "30+", label: "Strategic Partners" },
],
  },
  timeline: [
    { year: "2020", label: "Organization founded" },
    { year: "2021", label: "Media development programs" },
    { year: "2022", label: "National advocacy campaigns" },
    { year: "2023", label: "MIL Hub expansion" },
    { year: "2024", label: "Digital democracy initiatives" },
  ],
  gallery: [
    { src: "/images/activity-1.jpg", alt: "FPI activity 1" },
    { src: "/images/activity-2.jpg", alt: "FPI activity 2" },
    { src: "/images/activity-3.jpg", alt: "FPI activity 3" },
    { src: "/images/activity-4.jpg", alt: "FPI activity 4" },
  ],
  cta: {
    tag: "Get involved",
    title: "Join us in strengthening media freedom",
    description:
      "Partner with us to promote independent journalism, media literacy and democratic participation in Zambia.",
    button: { text: "Contact us", link: "/contact" },
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
// MAIN COMPONENT – REDESIGNED WITH BETTER SPACING & COLOR
// ============================================================
interface GalleryImage {
  src: string;
  alt: string;
}

/**
 * Pulls every image (main + gallery) off published activities and projects,
 * so "Our Work in Action" reflects what's actually been created in the CMS
 * instead of four fixed placeholder photos.
 */
function useFieldGalleryImages(): GalleryImage[] {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [activitiesRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/activities`),
          fetch(`${API_BASE_URL}/projects`),
        ]);

        const activities = activitiesRes.ok ? await activitiesRes.json() : [];
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        const collected: GalleryImage[] = [];

        (activities as any[])
          .filter((activity) => activity.published)
          .forEach((activity) => {
            if (activity.image) {
              collected.push({ src: getAssetUrl(activity.image), alt: activity.title });
            }
            (activity.images || []).forEach((url: string) => {
              collected.push({ src: getAssetUrl(url), alt: activity.title });
            });
          });

        (projects as any[])
          .filter((project) => project.published)
          .forEach((project) => {
            if (project.image) {
              collected.push({ src: getAssetUrl(project.image), alt: project.title });
            }
            (project.images || []).forEach((url: string) => {
              collected.push({ src: getAssetUrl(url), alt: project.title });
            });
          });

        setImages(collected);
      } catch (err) {
        console.error("Failed to load activity/project gallery images", err);
      }
    };

    load();
  }, []);

  return images;
}

const About = () => {
  const fieldImages = useFieldGalleryImages();
  const galleryImages = fieldImages.length > 0 ? fieldImages : aboutData.gallery;

  return (
    <div className="font-sans bg-gradient-to-b from-white to-gray-50">
      {/* ========== HERO SECTION (unchanged – fixed background) ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${aboutData.hero.backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9293A]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/15 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                {aboutData.hero.eyebrow}
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {aboutData.hero.title}{" "}
              <GradText>{aboutData.hero.highlighted}</GradText>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {aboutData.hero.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={aboutData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {aboutData.hero.ctaPrimary.text}
              </Link>
              <Link
                to={aboutData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {aboutData.hero.ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHO WE ARE – CARD LAYOUT WITH GAP ========== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <SectionBadge text={aboutData.whoWeAre.tag} />
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
                {aboutData.whoWeAre.title}
              </h2>
              {aboutData.whoWeAre.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
              <p className="text-gray-600 mb-4 leading-relaxed">
                Free Press Initiative (FPI) Zambia is a non-profit organisation committed to
                advancing media freedom, freedom of expression and access to information. We
                work with journalists, community media, schools and civil society to build a
                more informed, engaged and resilient society.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Through advocacy, media and information literacy, research and capacity
                building, we equip Zambians with the knowledge and skills to navigate today's
                complex information landscape and hold power to account.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {aboutData.whoWeAre.highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-[#C9293A] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="relative">
                {/* Accent card behind */}
                <div className="absolute -top-5 -right-5 w-full h-full rounded-3xl bg-gradient-to-br from-[#C9293A]/15 to-[#E8610A]/10 -z-10" />
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={aboutData.whoWeAre.image}
                    alt="FPI Zambia"
                    className="w-full h-[440px] object-cover"
                  />
                </div>
                {/* Floating stat badge */}
                <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#C9293A]/10 flex items-center justify-center">
                    <span className="text-[#C9293A] font-black text-lg">12</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">MIL Hubs</p>
                    <p className="text-xs text-gray-500">Across Zambia</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== MISSION / VISION / VALUES – COLORFUL CARDS ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A]">
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
            Who we are
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black mt-4">Mission, Vision & Values</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {aboutData.mvv.map((item, idx) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.title} delay={idx * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C9293A] to-[#E8610A] flex items-center justify-center text-white mb-5 shadow-md">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      {/* ========== WHAT WE STAND FOR (values) – GRID WITH GAPS ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A]">
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
            Our principles
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black mt-4">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {aboutData.values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <AnimatedSection key={value.title} delay={idx * 50}>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9293A]/10 to-[#E8610A]/10 flex items-center justify-center text-[#C9293A] mx-auto mb-3">
                    <Icon size={20} />
                  </div>
                  <div className="font-serif font-bold text-gray-800">{value.title}</div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      {/* ========== IMPACT SECTION (with background image) – cards with better spacing ========== */}
      <section className="relative overflow-hidden py-20 mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg-1.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/80 mb-4">
            <span className="block w-6 h-[2px] bg-[#E8610A]" />
            {aboutData.impact.tag}
            <span className="block w-6 h-[2px] bg-[#E8610A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-white mb-4">
            {aboutData.impact.title}
          </h2>
          <p className="text-white/75 max-w-2xl mx-auto mb-12">
            {aboutData.impact.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.impact.stats.map((stat) => (
              <AnimatedSection key={stat.label}>
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

      {/* ========== TIMELINE (improved styling, better spacing) ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A]">
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
            Our history
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black mt-4">Our Journey</h2>
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          {aboutData.timeline.map((item) => (
            <AnimatedSection key={item.year}>
              <div className="flex gap-4 items-start group">
                <div className="font-serif text-lg font-black text-[#C9293A] min-w-[80px] pt-1">
                  {item.year}
                </div>
                <div className="flex-1 p-4 bg-white rounded-xl border-l-4 border-l-[#C9293A] shadow-sm group-hover:shadow-md transition">
                  {item.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ========== GALLERY – GRID WITH GAPS, NO TOUCHING EDGES ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A]">
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
            In the field
            <span className="block w-6 h-[2px] bg-[#C9293A]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-black mt-4">Our Work in Action</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1.1}
          centeredSlides
          spaceBetween={24}
          loop={galleryImages.length > 1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1.5, centeredSlides: false },
            1024: { slidesPerView: 2.2, centeredSlides: false },
          }}
          className="about-gallery-swiper"
          style={{ paddingBottom: 40 }}
        >
          {galleryImages.map((img, idx) => (
            <SwiperSlide key={`${img.src}-${idx}`}>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style>{`
          .about-gallery-swiper .swiper-pagination-bullet {
            background: #C9293A;
            opacity: 0.35;
          }
          .about-gallery-swiper .swiper-pagination-bullet-active {
            opacity: 1;
          }
          .about-gallery-swiper .swiper-button-next,
          .about-gallery-swiper .swiper-button-prev {
            color: #C9293A;
          }
        `}</style>
      </div>

      {/* ========== CTA (unchanged structure, only spacing) ========== */}
      <div className="bg-gradient-to-r from-[#C9293A]/10 to-[#E8610A]/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A] mb-3">
                <span className="block w-6 h-[2px] bg-[#C9293A]" />
                {aboutData.cta.tag}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-2">
                {aboutData.cta.title}
              </h2>
              <p className="text-gray-600 max-w-md">{aboutData.cta.description}</p>
            </div>
            <Link
              to={aboutData.cta.button.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              {aboutData.cta.button.text}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;