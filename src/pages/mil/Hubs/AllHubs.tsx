import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../../services/config";

interface Hub {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coordinator?: string;
  location?: string;
  participants?: number;
  image?: string;
  province?: { name: string };
}

const AllHubs = () => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [hero, setHero] = useState<{ title?: string; subtitle?: string; image?: string }>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/hubs`)
      .then((res) => res.json())
      .then((data) => setHubs(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoaded(true));

    fetch(`${API_BASE_URL}/homepage/hubs-hero`)
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") setHero(data.data || data);
      })
      .catch(() => {});
  }, []);

  const provinces = useMemo(() => {
    const set = new Set(hubs.map((h) => h.province?.name).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [hubs]);

  const filtered =
    filter === "all" ? hubs : hubs.filter((h) => h.province?.name === filter);

  return (
    <div className="bg-white">
      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="allhubs-hero-wrapper">
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#080C1A]">
          {/* Background image – fixed while scrolling */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${hero.image ? getAssetUrl(hero.image) : "/images/KL8A3616-1-scaled.jpg"})`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-[#080C1A]/80" />

          {/* Decorative blurs – unchanged */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[520px] sm:h-[520px] bg-[#2563EB]/25 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] bg-[#E8610A]/20 blur-3xl rounded-full pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">
                Media & Information Literacy
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black mb-5">
              {hero.title || "Our MIL Hubs"}
            </h1>
            <p className="text-sm sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto px-2">
              {hero.subtitle || "Community hubs advancing media and information literacy across Zambia."}
            </p>
          </div>
        </section>
      </div>

      {/* FILTER + GRID – completely unchanged */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Province filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                filter === "all"
                  ? "bg-[#C9293A] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#C9293A]"
              }`}
            >
              All Hubs ({hubs.length})
            </button>
            {provinces.map((p) => {
              const count = hubs.filter((h) => h.province?.name === p).length;
              return (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    filter === p
                      ? "bg-[#C9293A] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#C9293A]"
                  }`}
                >
                  {p} ({count})
                </button>
              );
            })}
          </div>

          {!loaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-40 bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {hubs.length === 0
                  ? "Hubs will appear here once added in the admin panel."
                  : "No hubs in this province yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((hub) => (
                <Link
                  key={hub.id}
                  to={`/mil/hub/${hub.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                >
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img
                      src={hub.image ? getAssetUrl(hub.image) : "/images/activity-1.jpg"}
                      alt={hub.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {hub.province?.name && (
                      <span className="text-xs uppercase tracking-wide text-[#C9A84C] font-semibold">
                        {hub.province.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold mt-1 mb-2">{hub.name}</h3>
                    <p className="text-blue-600 text-sm flex items-center gap-1 mb-3">
                      <MapPin size={14} /> {hub.location || hub.name}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {hub.description || "Community Media & Information Literacy Hub"}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users size={14} /> {hub.participants || 0}
                      </span>
                      <span className="text-[#C9293A] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Hub <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hero‑only style: full viewport & fixed background */}
      <style>{`
        .allhubs-hero-wrapper section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .allhubs-hero-wrapper section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AllHubs;