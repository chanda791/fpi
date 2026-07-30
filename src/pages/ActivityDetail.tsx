import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { API_BASE_URL } from "../services/config";
import Lightbox from "../components/Lightbox";
import BackButton from "../components/BackButton";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Activity = {
  id: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  date?: string;
  location?: string;
  participants?: number;
  category?: string;
};

const ActivityDetail = () => {
  const { id } = useParams();

  const [activity, setActivity] =
    useState<Activity | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/activities/${id}`
        );

        const data = await res.json();

        setActivity(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading activity...
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Activity not found
      </div>
    );
  }

  const heroImage =
    activity.image || "/images/activity-1.jpg";

  const category =
    activity.category || "Activity";

  return (
    <>
      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="activity-hero-fixed">
        <section className="relative flex items-center py-20 sm:py-24 overflow-hidden bg-[#080C1A]">
          {/* Fixed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C1A] via-[#080C1A]/80 to-[#080C1A]/40" />

          {/* Decorative accent glows */}
          <div className="absolute top-0 right-0 w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-[#C9293A]/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] bg-[#C9A84C]/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <BackButton
              fallback="/"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-white/70 hover:text-white transition mb-6 sm:mb-8"
            />

            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 sm:px-5 sm:py-2 mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#E8610A]" />
              <span className="uppercase tracking-[0.18em] text-[10px] sm:text-xs font-bold text-white/90">
                {category}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5 sm:mb-6 max-w-4xl">
              {activity.title}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm sm:text-base">
              <span className="inline-flex items-center gap-2 text-white/85 font-medium">
                <Calendar size={16} className="text-[#C9A84C] shrink-0" />
                {activity.date || "Date TBA"}
              </span>
              <span className="inline-flex items-center gap-2 text-white/85 font-medium">
                <MapPin size={16} className="text-[#C9A84C] shrink-0" />
                {activity.location || "Location TBA"}
              </span>
              <span className="inline-flex items-center gap-2 text-white/85 font-medium">
                <Users size={16} className="text-[#C9A84C] shrink-0" />
                {activity.participants || 0} Participants
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* DETAILS – unchanged */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* INFO CARD */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-24">
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
                  Activity Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Tag size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Category</p>
                      <p className="font-semibold text-sm sm:text-base">{category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-sm sm:text-base">{activity.date || "TBA"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Location</p>
                      <p className="font-semibold text-sm sm:text-base">{activity.location || "TBA"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">Participants</p>
                      <p className="font-semibold text-sm sm:text-base">{activity.participants || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="order-1 lg:order-2 lg:col-span-2">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6">
                About This Activity
              </h2>
              <p className="text-base sm:text-lg leading-relaxed sm:leading-8 text-gray-700 whitespace-pre-line border-l-4 border-[#C9293A]/20 pl-4 sm:pl-6">
                {activity.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-center mb-8 sm:mb-12">
            Activity Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#C9293A]/10 flex items-center justify-center mx-auto mb-4">
                <Users size={20} className="text-[#C9293A]" />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C9293A]">
                {activity.participants || 0}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Participants Reached
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#C9293A]/10 flex items-center justify-center mx-auto mb-4">
                <MapPin size={20} className="text-[#C9293A]" />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C9293A]">
                1
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Community Engaged
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#C9293A]/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={20} className="text-[#C9293A]" />
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C9293A]">
                100%
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Commitment to Impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY – slideshow, since an activity can have many photos */}
      {activity.images && activity.images.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-center mb-8 sm:mb-12">
              Activity Gallery
            </h2>

            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1.1}
              centeredSlides
              spaceBetween={16}
              loop={activity.images.length > 1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, centeredSlides: false, spaceBetween: 20 },
                1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 24 },
              }}
              className="activity-gallery-swiper"
              style={{ paddingBottom: 40 }}
            >
              {activity.images.map((url, index) => (
                <SwiperSlide key={`${url}-${index}`}>
                  <img
                    src={url}
                    alt={`${activity.title} ${index + 1}`}
                    onClick={() => setLightboxIndex(index)}
                    className="h-56 sm:h-72 md:h-80 w-full object-cover rounded-xl sm:rounded-2xl shadow-lg cursor-pointer hover:opacity-90 transition"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <style>{`
              .activity-gallery-swiper .swiper-pagination-bullet {
                background: #C9293A;
                opacity: 0.35;
              }
              .activity-gallery-swiper .swiper-pagination-bullet-active {
                opacity: 1;
              }
              .activity-gallery-swiper .swiper-button-next,
              .activity-gallery-swiper .swiper-button-prev {
                color: #C9293A;
              }
            `}</style>
          </div>
        </section>
      )}

      {activity.images && (
        <Lightbox
          images={activity.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNavigate={setLightboxIndex}
        />
      )}

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#080C1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
            Explore More Activities
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Discover how FPI Zambia continues to
            promote media freedom, media literacy,
            journalism excellence and democratic
            participation across Zambia.
          </p>
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            View More Activities
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .activity-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .activity-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default ActivityDetail;