import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Calendar, Image, BookOpen, HandHeart, Clock, Award, MapPin, Users, UserCheck } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../../services/config";
import BackButton from "../../../components/BackButton";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* Lightweight scroll-reveal wrapper — fades/slides a section in once it enters the viewport. */
const Reveal = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const HubDetail = () => {
  const { slug } = useParams();

  const [hub, setHub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`${API_BASE_URL}/hubs/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setHub(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen" />;
  }

  if (!hub || hub.message) {
    return <div className="pt-32 text-center text-xl">Hub not found</div>;
  }

  // Helper to get a fallback image
  const getImage = (img: string | undefined) => img || "/images/activity-1.jpg";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..900&family=Manrope:wght@400;500;600;700;800&display=swap');
        .hub-font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .hub-font-body { font-family: 'Manrope', sans-serif; }

        @keyframes hubFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hub-anim {
          opacity: 0;
          animation: hubFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .hub-anim, .reveal {
            animation: none;
            transition: none;
            opacity: 1;
            transform: none;
          }
        }

        .hub-hero-wrapper section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .hub-hero-wrapper section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>

      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="hub-hero-wrapper hub-font-body">
        <section className="relative min-h-screen flex items-center text-white overflow-hidden">
          {/* Fixed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${getImage(hub.image)})`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Gradient overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,12,26,0.70)] to-[rgba(8,12,26,0.85)]" />
          {/* Decorative accent glow */}
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#C9293A]/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-[#E8610A]/15 blur-[120px] rounded-full pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 w-full">

            <BackButton
              fallback="/mil/hubs"
              className="hub-anim inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition mb-6"
            />

            {/* Badge */}
            <div className="hub-anim inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-6" style={{ animationDelay: "0.05s" }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8610A]" />
              <span className="uppercase tracking-[0.22em] text-xs font-bold text-white/90">
                MIL Community Hub
              </span>
            </div>

            <h1
              className="hub-anim hub-font-display text-4xl md:text-6xl font-bold leading-tight"
              style={{ animationDelay: "0.15s" }}
            >
              {hub.name}
            </h1>

            {/* Meta row — real data, presented as icon-led facts instead of a bare list */}
            <div
              className="hub-anim flex flex-wrap items-center gap-x-6 gap-y-3 mt-6"
              style={{ animationDelay: "0.3s" }}
            >
              {hub.province?.name && (
                <span className="inline-flex items-center gap-2 text-blue-200 text-sm sm:text-base font-medium">
                  <MapPin size={16} className="text-[#E8610A]" /> {hub.province.name}
                </span>
              )}
              <span className="inline-flex items-center gap-2 text-white/85 text-sm sm:text-base font-medium">
                <Users size={16} className="text-[#E8610A]" /> {hub.participants || 0}+ participants
              </span>
              <span className="inline-flex items-center gap-2 text-white/85 text-sm sm:text-base font-medium">
                <UserCheck size={16} className="text-[#E8610A]" /> {hub.coordinator || "Coordinator not assigned"}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <section className="py-20 bg-gray-50 hub-font-body">
        <div className="max-w-7xl mx-auto px-4">

          {/* Coordinator & Description – unchanged content, restyled */}
          <Reveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
              <h2 className="hub-font-display text-xl font-semibold mb-3 text-gray-900">Hub Coordinator</h2>
              <div className="flex items-center gap-4">
                {hub.coordinatorImage ? (
                  <img
                    src={getAssetUrl(hub.coordinatorImage)}
                    alt={hub.coordinator || "Hub Coordinator"}
                    className="w-14 h-14 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#C9293A]/10 flex items-center justify-center shrink-0">
                    <UserCheck size={20} className="text-[#C9293A]" />
                  </div>
                )}
                <p className="text-gray-600">
                  {hub.coordinator || "Not Assigned"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="hub-font-display text-2xl font-bold mb-4 text-gray-900">About this Hub</h2>
              <p className="text-gray-600 leading-8">
                {hub.description ||
                  "This Media and Information Literacy Hub serves as a community learning space where citizens, youth, educators and media practitioners can access training, resources and opportunities for digital literacy and civic engagement."}
              </p>
            </div>
          </Reveal>

          {/* ══ Impact Snapshot — now filled with real, data-derived stats ══ */}
          <Reveal>
            <div className="bg-gradient-to-br from-[#080C1A] to-[#1a2240] text-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="hub-font-display text-2xl sm:text-3xl font-bold mb-8 text-center">Our Impact at a Glance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#E8610A]">{hub.participants || 0}+</div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Community Members</p>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#E8610A]">{hub.events?.length || 0}</div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Upcoming Activities</p>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#E8610A]">{hub.photos?.length || 0}</div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Moments Captured</p>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-[#E8610A]">{hub.province?.name ? 1 : 0}</div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    {hub.province?.name ? hub.province.name : "Province"}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ══ Events / Activities Section — unchanged condition, restyled ══ */}
          {hub.events && hub.events.length > 0 && (
            <Reveal>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <h2 className="hub-font-display text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                  <Calendar className="text-[#C9293A]" /> Upcoming Activities
                </h2>
                <div className="space-y-4">
                  {hub.events.map((event: any) => (
                    <div
                      key={event.id}
                      className="border-l-4 border-[#C9293A] pl-4 py-2 hover:bg-gray-50 transition rounded-r-lg"
                    >
                      <h4 className="font-bold text-lg">{event.title}</h4>
                      {event.eventDate && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} /> {new Date(event.eventDate).toLocaleDateString()}
                          {event.eventType && ` · ${event.eventType}`}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ══ Photo Gallery — slideshow ══ */}
          {hub.photos && hub.photos.length > 0 && (
            <Reveal>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <h2 className="hub-font-display text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                  <Image className="text-[#C9293A]" /> Photo Gallery
                </h2>
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                  style={{ paddingBottom: 44 }}
                >
                  {hub.photos.map((photo: any) => (
                    <SwiperSlide key={photo.id}>
                      <div className="overflow-hidden rounded-xl shadow-sm">
                        <img
                          src={getAssetUrl(photo.imageUrl)}
                          alt={photo.caption || hub.name}
                          className="w-full h-56 object-cover"
                        />
                        {photo.caption && (
                          <p className="text-sm text-gray-500 mt-2">{photo.caption}</p>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Reveal>
          )}

          {/* ══ Get Involved Section — unchanged, restyled ══ */}
          <Reveal>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="hub-font-display text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900">How to Get Involved</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-[#E8610A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-[#E8610A]" size={28} />
                  </div>
                  <h3 className="font-bold text-lg">1. Learn</h3>
                  <p className="text-gray-600 text-sm">Participate in our training sessions and workshops.</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#E8610A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HandHeart className="text-[#E8610A]" size={28} />
                  </div>
                  <h3 className="font-bold text-lg">2. Volunteer</h3>
                  <p className="text-gray-600 text-sm">Share your skills and help us grow the community.</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#E8610A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="text-[#E8610A]" size={28} />
                  </div>
                  <h3 className="font-bold text-lg">3. Advocate</h3>
                  <p className="text-gray-600 text-sm">Spread the word about media literacy in your network.</p>
                </div>
              </div>
              <div className="text-center mt-8">
                <a
                  href="/contact"
                  className="inline-block bg-[#C9293A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Contact Us to Join
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Final CTA – unchanged */}
        <section className="bg-[#080C1A] text-white py-24 mt-20">
          <Reveal className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="hub-font-display text-3xl sm:text-5xl font-bold mb-6">
              Join the Media & Information Literacy Network
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-8">
              MIL Hubs provide safe spaces for learning, collaboration, civic
              engagement and digital literacy across Zambia.
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#C9293A] px-8 py-4 rounded-xl font-semibold hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300"
            >
              Contact Us
            </a>
          </Reveal>
        </section>
      </section>
    </>
  );
};

export default HubDetail;