import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../services/config";

interface Activity {
  id: number;
  title: string;
  description: string;
  image?: string;
  date?: string;
  location?: string;
  participants?: number;
  category?: string;
  published: boolean;
}

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/activities`)
      .then((res) => res.json())
      .then((data: Activity[]) => {
        setActivities(data.filter((a) => a.published));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="activities-hero-fixed">
        <section className="relative flex items-center overflow-hidden bg-[#080C1A]">
          {/* Fixed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/images/hero-bg-1.jpg)",
              backgroundAttachment: "fixed",
            }}
          />
          {/* Gradient overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C1A]/80 via-[#080C1A]/75 to-[#080C1A]/70" />

          {/* Decorative blurs – unchanged */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Content – unchanged */}
          <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">
                Latest Initiatives
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight">
              Our Activities
            </h1>
            <p className="text-sm sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              Trainings, workshops, dialogues and community engagements through
              which FPI Zambia advances media freedom, media literacy and
              democratic participation across the country.
            </p>
          </div>
        </section>
      </div>

      {/* ══ ACTIVITIES GRID – unchanged ══ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-56 bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                No Activities Yet
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Check back soon for updates on our latest work across Zambia.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-56">
                    <img
                      src={activity.image ? getAssetUrl(activity.image) : "/images/activity-1.jpg"}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                    {activity.category && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                        {activity.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-3">{activity.title}</h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                      {activity.description}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-5">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} />
                        {activity.date || "TBA"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} />
                        {activity.location || "TBA"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={13} />
                        {activity.participants || 0}
                      </span>
                    </div>

                    <Link
                      to={`/activities/${activity.id}`}
                      className="inline-flex items-center gap-2 text-[#C9293A] font-semibold text-sm hover:gap-3 transition-all"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .activities-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .activities-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Activities;