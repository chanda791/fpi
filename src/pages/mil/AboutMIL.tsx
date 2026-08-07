import { BookOpen, Globe, ShieldCheck, Users, } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// ─── tokens ───────────────────────────────────────────────────────────────────
const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'Inter', system-ui, sans-serif";
const RED   = "#C9293A";
const GOLD  = "#C9A84C";

// ─── pillar data ──────────────────────────────────────────────────────────────
const pillars = [
  {
    bg: RED,
    icon: <BookOpen size={20} color="#fff" />,
    title: "Critical thinking",
    body: "Developing skills to analyze and evaluate information critically.",
  },
  {
    bg: GOLD,
    icon: <ShieldCheck size={20} color="#fff" />,
    title: "Fact verification",
    body: "Identifying misinformation and verifying information sources.",
  },
  {
    bg: "#185FA5",
    icon: <Globe size={20} color="#fff" />,
    title: "Digital citizenship",
    body: "Promoting responsible and safe online participation.",
  },
  {
    bg: "#2d6a4f",
    icon: <Users size={20} color="#fff" />,
    title: "Community awareness",
    body: "Strengthening informed communities and civic participation.",
  },
];

// ─── reusable eyebrow ─────────────────────────────────────────────────────────
function Eyebrow({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: light ? "rgba(255,255,255,0.5)" : "#8c8275",
        marginBottom: "1.25rem",
      }}
    >
      <span style={{ display: "block", width: 20, height: 2, background: RED }} />
      {label}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
const AboutMIL = () => (
  <div style={{ fontFamily: SANS }}>

    {/* ── HERO (fixed background) ─────────────────────────────────────────── */}
    <section
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url("/images/note.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",   // static / fixed background
      }}
    >
      {/* dark gradient overlay (unchanged) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, rgba(8,12,30,0.93) 38%, rgba(8,12,30,0.50) 70%, transparent)",
        }}
      />

      {/* left red accent stripe (unchanged) */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, width: 5, height: "100%", background: RED }}
      />

      {/* text (unchanged) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 1.5rem",
        }}
      >
        <div style={{ maxWidth: 700, width: "100%" }}>
          <Eyebrow label="Media & Information Literacy" light />

          <h1
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "#ec0909",
              margin: "0 0 1.25rem",
              textAlign: "center",
            }}
          >
            Empowering citizens
            <br />
            with{" "}
            <em style={{ fontStyle: "italic", color: GOLD }}>critical skills</em>
            <br />
            for the digital age
          </h1>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 420,
              margin: "0 0 2rem",
              textAlign: "center",
            }}
          >
            Equipping communities to access, analyze, evaluate and create information
            responsibly in today's complex media landscape.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <Link
              to="/mil/radio-spots"
              style={{
                background: RED,
                color: "#fff",
                padding: "0.7rem 1.5rem",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Listen to our Radio spots
            </Link>

            <Link
              to="/mil/hubs"
              style={{
                background: RED,
                color: "#fff",
                padding: "0.7rem 1.5rem",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Explore MIL Hubs
            </Link>
            <Link
              to="/mil/brochure"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                padding: "0.7rem 1.5rem",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              View Brochure
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* WHAT IS MIL (unchanged) */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* IMAGE SIDE */}
          <div className="relative">
            <img
              src="/images/hub.jpeg"
              alt="MIL Training"
              className="w-full h-[550px] object-cover rounded-3xl shadow-2xl"
            />
            <img
              src="/images/activity-4.jpg"
              alt="MIL Activity"
              className="hidden md:block absolute -bottom-10 -right-10 w-64 h-44 object-cover rounded-2xl border-4 border-white shadow-xl"
            />
            <div className="absolute top-6 left-6 bg-[#C9293A] text-white px-6 py-4 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold">12+</h3>
              <p className="text-sm">Active MIL Hubs</p>
            </div>
          </div>
          {/* CONTENT SIDE */}
          <div>
            <span className="uppercase tracking-[0.15em] text-xs font-semibold text-[#C9293A]">
              About MIL
            </span>
            <h2 className="font-serif text-5xl font-black leading-tight mt-4 mb-6">
              What is Media &
              <br />
              <span className="italic text-[#C9293A]">Information Literacy?</span>
            </h2>
            <p className="text-gray-600 text-lg leading-8 mb-6">
              MIL equips people with the ability to find,
              evaluate, use and create information effectively
              in an increasingly digital world.
            </p>
            <p className="text-gray-600 text-lg leading-8 mb-8">
              It helps communities navigate misinformation,
              disinformation and digital challenges while
              promoting informed participation in society.
            </p>
            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 text-center">
                <h3 className="font-serif text-3xl font-black text-[#C9293A]">13+</h3>
                <p className="text-gray-500 text-sm">MIL Hubs</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 text-center">
                <h3 className="font-serif text-3xl font-black text-[#C9293A]">100+</h3>
                <p className="text-gray-500 text-sm">Sessions</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 text-center">
                <h3 className="font-serif text-3xl font-black text-[#C9293A]">4</h3>
                <p className="text-gray-500 text-sm">Provinces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── EXPLORE MORE (unchanged) ───────────────────────────────────────── */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.15em] text-xs font-semibold text-[#C9293A]">
            Explore More
          </span>
          <h2 className="font-serif text-5xl font-black mt-4">Resources & Opportunities</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {/* BROCHURE */}
          <Link
            to="/mil/brochure"
            className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src="/images/activity-1.jpg"
                alt="MIL Brochure"
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="uppercase text-xs tracking-[0.15em]">Publication</span>
                <h3 className="font-serif text-4xl font-black mt-2">MIL Brochure</h3>
                <p className="text-white/80 mt-2">Learn more about our initiatives</p>
              </div>
            </div>
          </Link>
          {/* HUBS */}
          <Link
            to="/mil/hubs"
            className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src="/images/activity-4.jpg"
                alt="MIL Hubs"
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="uppercase text-xs tracking-[0.15em]">Community Network</span>
                <h3 className="font-serif text-4xl font-black mt-2">MIL Hubs</h3>
                <p className="text-white/80 mt-2">Explore learning opportunities across Zambia</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* ───────────────── Featured Campaign ───────────────── */}
<section className="py-24 bg-[#0B1324]">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* LEFT CONTENT */}
      <div>

        <span className="uppercase tracking-[0.15em] text-xs font-semibold text-[#C9A84C]">
          Featured Campaign
        </span>

        <h2 className="font-serif text-5xl font-black text-white mt-4 mb-6 leading-tight">
          Building a
          <br />
          <span className="text-[#C9A84C]">
            Media Literate Zambia
          </span>
        </h2>

        <p className="text-white/70 text-lg leading-8 mb-8">
          Watch how FPI Zambia is empowering young people,
          journalists and communities with Media &
          Information Literacy skills through nationwide
          campaigns, training programmes and community
          engagement initiatives.
        </p>

        <div className="flex flex-wrap gap-4">

          <a
            href="https://www.youtube.com/results?search_query=fpi+zambia"
            target="_blank"
            rel="noreferrer"
            className="bg-[#C9293A] hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition"
          >
            ▶ Watch on YouTube
          </a>

          <Link
            to="/mil/radio-spots"
            className="border border-white/30 hover:bg-white hover:text-[#0B1324] text-white px-8 py-4 rounded-xl font-semibold transition"
          >
            🎙 Radio Spots
          </Link>

        </div>

      </div>

      {/* RIGHT IMAGE */}

      <div className="relative group">

        <img
          src="/images/activity-2.jpg"
          alt="MIL Campaign"
          className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
        />

        <div className="absolute inset-0 bg-black/40 rounded-3xl" />

        <a
          href="https://youtube.com/"
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-[#C9293A] hover:scale-110 transition flex items-center justify-center shadow-2xl">

            <span className="text-white text-5xl ml-2">
              ▶
            </span>

          </div>
        </a>

      </div>

    </div>

  </div>
</section>

    {/* ── FOCUS AREAS (unchanged) ───────────────────────────────────────── */}
    <section className="py-24 bg-[#f8f6f2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.15em] text-xs font-semibold text-[#C9293A]">
            Focus Areas
          </span>
          <h2 className="font-serif text-5xl font-black mt-4 mb-6">
            Building Media &
            Information Literacy
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 leading-8">
            Our work focuses on empowering citizens with the skills,
            knowledge and confidence needed to navigate today's
            information ecosystem.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* IMAGE */}
          <div className="relative">
            <img
              src="/images/mil.jpeg"
              alt="MIL Focus Areas"
              className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
            />
            <img
              src="/images/activity-4.jpg"
              alt="MIL Community"
              className="hidden md:block absolute -bottom-10 -right-10 w-64 h-44 object-cover rounded-2xl border-4 border-white shadow-xl"
            />
            <div className="absolute top-6 left-6 bg-[#C9293A] text-white px-6 py-4 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold">4</h3>
              <p className="text-sm">Core Focus Areas</p>
            </div>
          </div>
          {/* FEATURES */}
          <div className="space-y-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: pillar.bg }}
                  >
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-2">{pillar.title}</h3>
                    <p className="text-gray-600 leading-7">{pillar.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    {/* ======================= MIL IN ACTION ======================= */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-16">

      <span className="uppercase tracking-[0.15em] text-xs font-semibold text-[#C9293A]">
        Gallery
      </span>

      <h2 className="font-serif text-5xl font-black mt-4 mb-6">
        Media Literacy
        <span className="text-[#C9293A] italic">
          {" "}In Action
        </span>
      </h2>

      <p className="max-w-3xl mx-auto text-gray-600 leading-8">
        Explore moments from our community outreach,
        digital literacy campaigns, media training sessions,
        school engagements and public awareness programmes
        across Zambia.
      </p>

    </div>

    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1.15}
      spaceBetween={16}
      centeredSlides
      loop
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2, centeredSlides: false },
        1024: { slidesPerView: 3, centeredSlides: false },
      }}
      style={{ paddingBottom: 48 }}
    >
      {[
        "/images/activity-1.jpg",
        "/images/activity-2.jpg",
        "/images/activity-3.jpg",
        "/images/activity-4.jpg",
        "/images/note3.jpg",
        "/images/note.jpg",
      ].map((image, index) => (
        <SwiperSlide key={index}>
          <div className="overflow-hidden rounded-3xl group shadow-lg">
            <img
              src={image}
              alt="MIL Activity"
              className="w-full h-72 sm:h-80 object-cover transition duration-700 group-hover:scale-110"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

  </div>
</section>

    {/* ======================= CTA ======================= */}
<section className="py-24 bg-[#0B1324] text-white">

  <div className="max-w-5xl mx-auto text-center px-6">

    <span className="uppercase tracking-[0.15em] text-xs text-[#C9A84C] font-semibold">
      Join The Movement
    </span>

    <h2 className="font-serif text-5xl font-black mt-5 mb-6 leading-tight">
      Together We Can Build
      <br />
      <span className="text-[#C9A84C]">
        A Media Literate Zambia
      </span>
    </h2>

    <p className="text-white/70 text-lg leading-8 mb-10 max-w-3xl mx-auto">
      Whether you are a school, community organisation,
      media institution or development partner,
      we invite you to collaborate with FPI Zambia in
      promoting Media & Information Literacy.
    </p>

    <div className="flex justify-center gap-5 flex-wrap">

      <Link
        to="/contact"
        className="bg-[#C9293A] px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition"
      >
        Contact Us
      </Link>

      <Link
        to="/mil/hubs"
        className="border border-white/30 px-8 py-4 rounded-xl hover:bg-white hover:text-[#0B1324] transition"
      >
        Explore MIL Hubs
      </Link>

    </div>

  </div>

</section>

  </div>
);

export default AboutMIL;