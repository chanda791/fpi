import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import BackButton from "../../components/BackButton";

interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  category?: string;
  status?: string;
  published: boolean;
}

interface Props {
  category: string;
  heading: string;
  intro: string;
  heroImage?: string;
}

const FlagshipProjectList = ({ category, heading, intro, heroImage }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data.filter((p) => p.category === category && p.published));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoaded(true));
  }, [category]);

  return (
    <div>
      {/* ══ HERO / INTRO — full viewport with fixed background ══ */}
      <div className="flagship-hero-fixed">
        <section className="relative flex items-center overflow-hidden bg-[#080C1A]">
          {/* Background image – fixed */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage || "/images/hero-bg-1.jpg"})`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C1A]/80 via-[#080C1A]/75 to-[#080C1A]/70" />

          {/* Decorative blurs – unchanged */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Content – unchanged */}
          <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">
                FPI Zambia Initiative
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight px-2">
              {heading}
            </h1>
            <p className="text-sm sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto px-2">
              {intro}
            </p>
          </div>
        </section>
      </div>

      {/* PROJECTS – unchanged */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back button */}
          <BackButton
            fallback="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C9293A] font-medium text-sm mb-8 transition"
          />

          {!loaded ? (
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
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-700 mb-3">
                Content Coming Soon
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Projects under this initiative are being prepared. Check back soon,
                or explore our other work in the meantime.
              </p>
              <Link
                to="/projects"
                className="inline-block mt-8 bg-[#C9293A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Explore Other Projects
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <img
                    src={project.image ? getAssetUrl(project.image) : "/images/activity-1.jpg"}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">
                    {project.status && (
                      <span className="inline-block bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                        {project.status}
                      </span>
                    )}

                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                      {project.description}
                    </p>

                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-[#C9293A] font-semibold text-sm hover:gap-3 transition-all"
                    >
                      Read More
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
        .flagship-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .flagship-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FlagshipProjectList;