import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion, Variants } from "framer-motion";
import { API_BASE_URL, getAssetUrl } from "../services/config";
import {
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  TrendingUp,
  Shield,
  BookOpen,
  Scale,
  FileText,
  Radio,
  Map,
  Video,
  Headphones,
  PlayCircle
} from "lucide-react";


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

type Activity = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  participants: number;
  category: string;
};

const useScrollReveal = () => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sr-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return ref;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid #E5E7EB",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
};

const formatActivityDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
};

const Eyebrow = ({ label, light = false }: { label: string; light?: boolean }) => (
  <div className={`inline-flex items-center gap-2 mb-3 ${light ? "text-blue-200" : "text-blue-700"}`}>
    <span className="block h-[2px] w-5 rounded-full bg-current" />
    <span className="text-[10px] font-bold tracking-[0.16em] uppercase">{label}</span>
    <span className="block h-[2px] w-5 rounded-full bg-current" />
  </div>
);

// ----- Animation variants -----
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// -----------------------------

const Home = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cmsQuickAccess, setCmsQuickAccess] = useState<
    { title: string; description: string; link: string }[]
  >([]);
  const [cmsStatistics, setCmsStatistics] = useState<
    { title: string; value: string }[]
  >([]);
  const [cmsFeaturedProjects, setCmsFeaturedProjects] = useState<
    { id: number; title: string; description: string; image?: string }[]
  >([]);
  const [cmsGalleryImages, setCmsGalleryImages] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [commentForm, setCommentForm] = useState({ name: "", role: "", message: "" });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentDone, setCommentDone] = useState(false);
  const [activitySettings, setActivitySettings] = useState<{
    count: number;
  }>({ count: 6 });

  const heroSlides = [
    {
      image: "/images/note.jpg",
      eyebrow: "FPI Zambia",
      title: "Promoting Free Press &",
      highlight: "Excellence in Journalism",
      subtitle: "Defending Human Rights",
      description: "Empowering journalists and defending media freedom across Zambia.",
      cta: "Learn More",
      link: "/about",
    },
    {
      image: "/images/image.png",
      eyebrow: "FPI Zambia",
      title: "Media and Information Literacy",
      description: "Building resilient communities through digital literacy.",
      cta: "Explore Programs",
      link: "/programs/media-literacy",
    },
    {
      image: "/images/note3.jpg",
      eyebrow: "FPI Zambia",
      title: "Advocacy & Policy",
      highlight: "Change the Narrative",
      subtitle: "Stronger Democracy",
      description: "Supporting legal reforms for media freedom and access to information.",
      cta: "Get Involved",
      link: "/contact",
    },
  ];

  const galleryFallbackImages = [
    "/images/KL8A0233-1-scaled.jpg",
    "/images/KL8A3439-1-scaled.jpg",
    "/images/KL8A3616-1-scaled.jpg",
    "/images/KL8A5724-1-scaled.jpg",
    "/images/KL8A5902-scaled.jpg",
    "/images/KL8A5974-scaled.jpg",
    "/images/KL8A7730-scaled.jpg",
    "/images/KL8A9564-scaled.jpg",
  ];

  const defaultQuickAccess = [
    {
      title: "Explore MIL Hubs",
      description: "Discover Media & Information Literacy hubs across Zambia.",
      icon: Map,
      color: "#2563EB",
      link: "/mil/hubs",
    },
    {
      title: "Radio Spots",
      description: "Listen to awareness campaigns and educational broadcasts.",
      icon: Radio,
      color: "#F59E0B",
      link: "/mil/radio-spots",
    },
    {
      title: "MIL Brochure",
      description: "Read and download our Media & Information Literacy brochure.",
      icon: BookOpen,
      color: "#EA580C",
      link: "/mil/brochure",
    },
  ];

  const quickAccessIcons = [Map, Radio, BookOpen, TrendingUp, Shield, FileText];
  const quickAccessColors = ["#2563EB", "#F59E0B", "#EA580C", "#2563EB", "#F59E0B", "#EA580C"];

  const quickAccess =
    cmsQuickAccess.length > 0
      ? cmsQuickAccess.map((item, index) => ({
          title: item.title,
          description: item.description,
          link: item.link || "/",
          icon: quickAccessIcons[index % quickAccessIcons.length],
          color: quickAccessColors[index % quickAccessColors.length],
        }))
      : defaultQuickAccess;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/activities`);
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchHomepageCms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/homepage`);
        if (!res.ok) return;

        const sections: { section: string; data: any }[] = await res.json();
        const byName: Record<string, any> = {};
        sections.forEach((s) => {
          byName[s.section] = s.data;
        });

        // Statistics
        if (Array.isArray(byName["statistics"]) && byName["statistics"].length > 0) {
          setCmsStatistics(byName["statistics"]);
        }

        // Quick Access
        if (Array.isArray(byName["quick-access"]) && byName["quick-access"].length > 0) {
          setCmsQuickAccess(byName["quick-access"]);
        }

        // Latest Activities settings
        if (byName["latest-activities"] && typeof byName["latest-activities"] === "object") {
          setActivitySettings({
            count: byName["latest-activities"].count || 6,
          });
        }

        // Featured Projects -- resolve selected IDs against real project data
        const featuredIds: number[] = Array.isArray(byName["featured-projects"])
          ? byName["featured-projects"]
          : [];

        if (featuredIds.length > 0) {
          const projectsRes = await fetch(`${API_BASE_URL}/projects`);
          if (projectsRes.ok) {
            const allProjects = await projectsRes.json();
            setCmsFeaturedProjects(
              allProjects.filter((p: any) => featuredIds.includes(p.id))
            );
          }
        }

        // Gallery -- resolve selected media IDs against real media URLs
        const galleryIds: number[] = Array.isArray(byName["gallery"])
          ? byName["gallery"]
          : [];

        if (galleryIds.length > 0) {
          const mediaRes = await fetch(`${API_BASE_URL}/media`);
          if (mediaRes.ok) {
            const allMedia = await mediaRes.json();
            const urls = allMedia
              .filter((m: any) => galleryIds.includes(m.id))
              .map((m: any) => m.url);
            setCmsGalleryImages(urls);
          }
        }
      } catch (err) {
        console.error("Failed to load homepage CMS content", err);
      }
    };

    fetchHomepageCms();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/testimonials`)
      .then((res) => res.json())
      .then((data: any[]) => setTestimonials(data))
      .catch((err) => console.error(err));
  }, []);

  const submitComment = async () => {
    if (!commentForm.name.trim() || !commentForm.message.trim()) {
      alert("Please fill in your name and comment.");
      return;
    }
    try {
      setCommentSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });
      if (!res.ok) throw new Error("Failed");
      setCommentDone(true);
      setCommentForm({ name: "", role: "", message: "" });
    } catch (e) {
      console.error(e);
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const focusAreas = [
    { icon: TrendingUp, title: "Media Development", description: "Strengthening independent journalism and promoting professional media standards across Zambia.", color: "#2563EB" },
    { icon: Shield, title: "Media Freedom", description: "Advocating for freedom of expression, access to information and press freedom.", color: "#EA580C" },
    { icon: BookOpen, title: "Media Literacy", description: "Empowering citizens with critical thinking skills to identify misinformation and disinformation.", color: "#F59E0B" },
    { icon: Scale, title: "Policy Advocacy", description: "Supporting legal and policy reforms that strengthen democracy, transparency and accountability.", color: "#2563EB" },
    { icon: FileText, title: "Research & Publications", description: "Producing reports, studies and publications that inform media development and governance.", color: "#EA580C" },
    { icon: Users, title: "Community Engagement", description: "Building partnerships between journalists, communities, civil society and public institutions.", color: "#F59E0B" },
  ];

  const recentActivities = activities.slice(0, activitySettings.count || 6);

  const welcomeRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const focusRef = useScrollReveal();
  const galleryRef = useScrollReveal();

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "linear-gradient(135deg, #F0F9FF 0%, #FFF7ED 100%)", color: "#1A1A2E" }}>
      <style>{`
        .sr-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .sr-section.sr-visible { opacity: 1; transform: translateY(0); }

        .hero-swiper .swiper-slide {
          position: absolute !important;
          top: 0; left: 0;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none;
          opacity: 0 !important;
          transition: opacity 0.9s ease !important;
        }
        .hero-swiper .swiper-slide-active {
          position: relative !important;
          opacity: 1 !important;
          pointer-events: auto;
          z-index: 1;
        }
        .hero-swiper .swiper-pagination { bottom: 20px !important; }
        .hero-swiper .swiper-pagination-bullet {
          width: 6px !important; height: 6px !important;
          border-radius: 99px !important;
          background: rgba(255,255,255,0.4) !important;
          opacity: 1 !important;
          transition: width 0.3s ease !important;
          margin: 0 4px !important;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 20px !important;
          background: #EA580C !important;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          width: 36px !important; height: 36px !important;
          border-radius: 999px !important;
          background: rgba(0,0,0,0.2) !important;
          backdrop-filter: blur(4px) !important;
          color: white !important;
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after { font-size: 12px !important; }
        @media (max-width: 640px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev { display: none !important; }
        }
        .act-swiper .swiper-pagination-bullet { background: #2563EB !important; opacity: 0.35 !important; }
        .act-swiper .swiper-pagination-bullet-active { opacity: 1 !important; }
        .act-swiper .swiper-button-next,
        .act-swiper .swiper-button-prev { color: #2563EB !important; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* -------- Quick Access Grid: 3 separated cards -------- */
        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .quick-access-grid {
            grid-template-columns: 1fr;
            max-width: 460px;
          }
        }
      `}</style>

      {/* ========== HERO CAROUSEL ========== */}
      <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: 500, overflow: "hidden", paddingBottom: 0 }}>     
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 10, background: "linear-gradient(90deg, #2563EB, #EA580C, #F59E0B, #EA580C, #2563EB)" }} />
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          loop
          className="hero-swiper"
          style={{ width: "100%", height: "100%" }}
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={slide.image} alt={slide.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(37,99,235,0.35) 0%, rgba(234,88,12,0.3) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.15), transparent)" }} />
                <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px" }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} style={{ marginBottom: 16 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.25)", color: "#FDE047", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#EA580C" }} />
                      {slide.eyebrow}
                    </span>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 900, lineHeight: 1.2, color: "#FFFFFF", margin: "0 0 6px", maxWidth: 700 }}>
                    {slide.title}
                  </motion.h1>
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} style={{ marginBottom: 10 }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)", fontWeight: 900, fontStyle: "italic", background: "linear-gradient(135deg, #FDE047, #FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
                      {slide.highlight}
                    </span>
                  </motion.div>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)", color: "rgba(255,255,255,0.9)", margin: "0 0 8px", fontWeight: 400 }}>
                    {slide.subtitle}
                  </motion.p>
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", maxWidth: 420, lineHeight: 1.6, margin: "0 0 24px" }}>
                    {slide.description}
                  </motion.p>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <Link to={slide.link} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #2563EB, #EA580C)", color: "#fff", fontWeight: 600, fontSize: 12, padding: "8px 20px", borderRadius: 999, textDecoration: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                      {slide.cta} <ArrowRight size={12} />
                    </Link>
                    <a href="#success-stories" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontWeight: 600, fontSize: 12, padding: "8px 20px", borderRadius: 999, textDecoration: "none" }}>
                      Success Stories
                    </a>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ========== QUICK ACCESS – redesigned two‑column, mobile‑stacked ========== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        style={{ padding: "0 24px", marginTop: "40px", position: "relative", zIndex: 5 }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="quick-access-grid"   // <-- new class for responsive grid
        >
          {quickAccess.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
                  transition: { type: "spring", stiffness: 300 },
                }}
                style={{
                  position: "relative",
                  padding: "28px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FAFBFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                {/* Coloured top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  }}
                />

                <Link
                  to={item.link}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: `${item.color}10`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: `1px solid ${item.color}20`,
                      }}
                    >
                      <Icon size={22} color={item.color} strokeWidth={1.8} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "#1A1A2E", letterSpacing: "-0.01em" }}>
                      {item.title}
                    </p>
                  </div>

                  <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.6, paddingRight: 4 }}>
                    {item.description}
                  </p>

                  <motion.span
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: item.color,
                      marginTop: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Explore <ArrowRight size={12} style={{ transition: "transform 0.2s" }} />
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ========== WELCOME SECTION ========== */}
      <motion.section
        ref={welcomeRef}
        className="sr-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        style={{ padding: "60px 20px 40px", textAlign: "center" }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Eyebrow label="Free Press Initiative Zambia" />
          <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.2, marginBottom: 12 }}>
            Advancing <span style={{ fontStyle: "italic", background: "linear-gradient(135deg,#2563EB,#EA580C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Free Press</span> & Journalism
          </h2>
          <p style={{ color: "#4B5563", fontSize: 14, lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
            FPI Zambia promotes media freedom and strengthens independent journalism across the country — building a more informed, transparent and accountable society.
          </p>
        </div>
      </motion.section>

      {/* ========== ABOUT FPI ========== */}
      <motion.section
        id="about"
        ref={aboutRef}
        className="sr-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        style={{ padding: "40px 20px 60px", background: "#fff" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, alignItems: "center" }}>
            <motion.div variants={cardVariants} style={{ position: "relative" }}>
              <img src="/images/activity-1.jpg" alt="FPI Zambia Training" style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
              <div style={{ position: "absolute", top: 16, left: 16, background: "linear-gradient(135deg,#2563EB,#EA580C)", color: "#fff", padding: "8px 14px", borderRadius: 14, textAlign: "center" }}>
                <div style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: 22 }}>10+</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.85)" }}>Years of impact</div>
              </div>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Eyebrow label="About FPI" />
              <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.3rem, 3vw, 1.8rem)", lineHeight: 1.2, marginBottom: 12 }}>Independent journalism,<br />democratic participation</h2>
              <p style={{ color: "#4B5563", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
                Free Press Initiative Zambia (FPI Zambia) is dedicated to promoting independent journalism, media freedom, media literacy and citizen participation in democratic governance.
              </p>
              <p style={{ color: "#4B5563", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                Through training, research, advocacy and community engagement, we empower journalists, civil society organizations and communities.
              </p>
              <Link to="/about" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#2563EB,#EA580C)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "8px 20px", borderRadius: 999, textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                Learn More About FPI <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ========== ACTIVITIES SECTION ========== */}
      <section style={{ padding: "50px 20px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Eyebrow label="Latest Initiatives" />
            <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", marginBottom: 6 }}>Recent Activities</h2>
            <p style={{ color: "#6B7280", fontSize: 13, maxWidth: 460, margin: "0 auto" }}>The latest from FPI Zambia's work across the country.</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <span
              style={{
                padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, border: "none",
                background: "linear-gradient(135deg,#2563EB,#EA580C)", color: "#fff", boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
              }}
            >
              📋 All
            </span>
          </div>
          {loading && (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #2563EB", borderRightColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            </div>
          )}
          {error && <div style={{ textAlign: "center", color: "#DC2626", padding: 20, fontSize: 13 }}>Error: {error}</div>}
          {!loading && !error && (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="act-swiper"
              style={{ paddingBottom: 50 }}
            >
              {recentActivities.map((activity) => (
                <SwiperSlide key={activity.id}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ position: "relative", height: 140 }}>
                      <img src={activity.image} alt={activity.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600"; }} />
                      <span style={{ position: "absolute", top: 8, left: 8, background: "linear-gradient(135deg,#2563EB,#EA580C)", color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>{activity.category}</span>
                    </div>
                    <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{activity.title}</h3>
                      <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, marginBottom: 12, flex: 1 }}>{activity.description.substring(0, 80)}...</p>
                      <div style={{ borderTop: "1px solid #F0F0F0", paddingTop: 10, marginTop: "auto" }}>
                        <div style={{ display: "flex", gap: 8, color: "#9CA3AF", fontSize: 10, marginBottom: 8 }}>
                          <span><Calendar size={10} /> {formatActivityDate(activity.date)}</span>
                          <span><MapPin size={10} /> {activity.location}</span>
                          <span><Users size={10} /> {activity.participants}</span>
                        </div>
                        <Link to={`/activities/${activity.id}`} style={{ color: "#2563EB", fontSize: 11, fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          Learn More <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      <section
        style={{
          padding: "80px 20px",
          background:
            "linear-gradient(135deg,#ffffff,#F8FAFC)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 50,
            }}
          >
            <Eyebrow label="Media Centre" />

            <h2
              style={{
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              Media Highlights
            </h2>

            <p
              style={{
                maxWidth: 650,
                margin: "0 auto",
                color: "#64748B",
                lineHeight: 1.8,
              }}
            >
              Explore our latest videos and radio programmes
              promoting media freedom and media literacy in
              Zambia.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(420px,1fr))",
              gap: 30,
            }}
          >
            {/* VIDEO */}

            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow:
                  "0 15px 40px rgba(0,0,0,.08)",
              }}
            >
              <img
                src="/images/youtube-logo.jpg"
                alt="YouTube"
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 30 }}>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 18,
                    color: "#DC2626",
                  }}
                >
                  <Video size={28} />

                  <strong>
                    Latest YouTube Video
                  </strong>

                </div>

                <h3
                  style={{
                    marginBottom: 12,
                  }}
                >
                  Building Media Literacy Across Zambia
                </h3>

                <p
                  style={{
                    color: "#64748B",
                    lineHeight: 1.7,
                    marginBottom: 25,
                  }}
                >
                  Watch our latest documentary,
                  interviews and community outreach
                  programmes.
                </p>

                <a
                  href="https://www.youtube.com/results?search_query=fpi+zambia"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#DC2626",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: 999,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  <PlayCircle size={18} />

                  Watch on YouTube

                </a>

              </div>

            </div>

            {/* RADIO */}

            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow:
                  "0 15px 40px rgba(0,0,0,.08)",
              }}
            >
              <img
                src="/images/radio1.jpg"
                alt="Radio"
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: 30 }}>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 18,
                    color: "#EA580C",
                  }}
                >
                  <Headphones size={28} />

                  <strong>
                    Radio Spotlight
                  </strong>

                </div>

                <h3>
                  Community Radio Awareness Campaigns
                </h3>

                <p
                  style={{
                    color: "#64748B",
                    margin: "18px 0",
                    lineHeight: 1.7,
                  }}
                >
                  Listen to FPI Zambia radio programmes
                  promoting media literacy and civic
                  participation.
                </p>

                <Link
                  to="/mil/radio-spots"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background:
                      "linear-gradient(135deg,#2563EB,#EA580C)",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: 999,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  <Headphones size={18} />

                  Listen Now

                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========== FOCUS AREAS ========== */}
      <motion.section
        ref={focusRef}
        className="sr-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        style={{ padding: "50px 20px", background: "#fff" }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow label="Our Work" />
          <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", marginBottom: 8 }}>Focus Areas</h2>
          <p style={{ color: "#6B7280", fontSize: 13, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
            FPI Zambia works to strengthen media freedom, media literacy, democratic governance and community participation.
          </p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}
          >
            {focusAreas.map((area, i) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ background: "linear-gradient(135deg, #F0F9FF, #FFF7ED)", borderRadius: 20, padding: 20, textAlign: "left", border: "1px solid #E2E8F0" }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 12, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${area.color}, #F59E0B)` }}>
                    <Icon size={18} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{area.title}</h3>
                  <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{area.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== STATISTICS (CMS) ========== */}
      {cmsStatistics.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          style={{ padding: "50px 20px", background: "#fff" }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 20,
              }}
            >
              {cmsStatistics.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: "24px 12px",
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #F0F9FF 0%, #FFF7ED 100%)",
                  }}
                >
                  <div style={{ fontFamily: "Georgia,serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#C9293A" }}>
                    {stat.value}
                  </div>
                  <p style={{ color: "#6B7280", fontSize: 13, marginTop: 6 }}>{stat.title}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ========== FEATURED PROJECTS (CMS) ========== */}
      {cmsFeaturedProjects.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
          style={{ padding: "50px 20px", background: "#F8FAFF" }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Eyebrow label="Featured" />
              <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", marginBottom: 6 }}>
                Featured Projects
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24,
              }}
            >
              {cmsFeaturedProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: 18,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                    display: "block",
                  }}
                >
                  <div style={{ height: 180, overflow: "hidden" }}>
                    <img
                      src={project.image || "/images/activity-1.jpg"}
                      alt={project.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
                      {project.title}
                    </h3>
                    <p style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.6 }}>
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ========== GALLERY ========== */}
      <motion.section
        ref={galleryRef}
        className="sr-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        style={{ padding: "50px 20px", background: "#F8FAFF" }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow label="Highlights" />
          <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", marginBottom: 6 }}>Photo Gallery</h2>
          <p style={{ color: "#6B7280", fontSize: 13, marginBottom: 32 }}>Highlights from FPI Zambia activities.</p>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1.15}
            spaceBetween={16}
            centeredSlides
            loop
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
            }}
            className="gallery-swiper"
            style={{ paddingBottom: 40 }}
          >
            {(cmsGalleryImages.length > 0
              ? cmsGalleryImages
              : galleryFallbackImages
            ).map((src, idx) => (
              <SwiperSlide key={idx}>
                <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "1 / 1" }}>
                  <img
                    src={src}
                    alt={`Gallery ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.section>

      {/* ========== TESTIMONIALS / COMMENTS ========== */}
      <section id="success-stories" style={{ padding: "60px 20px", background: "#fff", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Eyebrow label="Voices" />
            <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 800, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", marginBottom: 6 }}>
              What People Say
            </h2>
            <p style={{ color: "#6B7280", fontSize: 14 }}>
              Stories and reflections from the communities we work with.
            </p>
          </div>

          {testimonials.length > 0 && (
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={24}
              loop={testimonials.length > 1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              style={{ paddingBottom: 48, marginBottom: 40 }}
              breakpoints={{ 768: { slidesPerView: testimonials.length > 1 ? 2 : 1 } }}
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t.id}>
                  <div
                    style={{
                      background: "#F8FAFF",
                      borderRadius: 20,
                      padding: "32px 28px",
                      height: "100%",
                      border: "1px solid #EEF2FA",
                    }}
                  >
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", fontStyle: "italic", marginBottom: 24 }}>
                      "{t.message}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 52, height: 52, borderRadius: "50%",
                          overflow: "hidden", flexShrink: 0,
                          background: "linear-gradient(135deg,#C9293A,#E8610A)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 700, fontSize: 20,
                        }}
                      >
                        {t.photo ? (
                          <img src={getAssetUrl(t.photo)} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          t.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</p>
                        {t.role && <p style={{ color: "#9CA3AF", fontSize: 13 }}>{t.role}</p>}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Comment form */}
          <div
            style={{
              maxWidth: 620, margin: "0 auto",
              background: "#fff", border: "1px solid #EEF2FA",
              borderRadius: 20, padding: "32px 28px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
            }}
          >
            <h3 style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 20, marginBottom: 6, textAlign: "center" }}>
              Share Your Experience
            </h3>
            <p style={{ color: "#9CA3AF", fontSize: 13, textAlign: "center", marginBottom: 24 }}>
              Leave a comment about our work. Approved comments appear above.
            </p>

            {commentDone ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#059669", fontWeight: 600 }}>
                Thank you! Your comment has been submitted and will appear once approved.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Your role or community (optional)"
                  value={commentForm.role}
                  onChange={(e) => setCommentForm({ ...commentForm, role: e.target.value })}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Your comment"
                  rows={4}
                  value={commentForm.message}
                  onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                <button
                  onClick={submitComment}
                  disabled={commentSubmitting}
                  style={{
                    background: "linear-gradient(135deg,#C9293A,#E8610A)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    padding: "13px", borderRadius: 999, border: "none",
                    cursor: commentSubmitting ? "not-allowed" : "pointer",
                    opacity: commentSubmitting ? 0.7 : 1,
                  }}
                >
                  {commentSubmitting ? "Submitting..." : "Submit Comment"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;