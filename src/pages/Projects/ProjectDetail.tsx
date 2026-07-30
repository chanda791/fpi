import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../services/config";
import Lightbox from "../../components/Lightbox";
import BackButton from "../../components/BackButton";
import {
  Calendar,
  Tag,
  Activity as ActivityIcon,
  ArrowRight,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string;
  images?: string[];
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProjectDetail = () => {
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-xl font-semibold text-gray-700">
          Project not found
        </p>
        <Link
          to="/"
          className="text-[#C9293A] font-semibold hover:underline"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  const heroImage = project.image || "/images/activity-1.jpg";
  const category = project.category || "Project";
  const status = project.status || "Active";
  const startDate = formatDate(project.startDate);
  const endDate = formatDate(project.endDate);

  return (
    <>
      {/* ══ HERO – full viewport with fixed background ══ */}
      <div className="project-hero-fixed">
        <section className="relative flex items-center overflow-hidden bg-[#080C1A]">
          {/* Background image – fixed */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Overlay – gradient with slightly lighter opacity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C1A] via-[#080C1A]/80 to-[#080C1A]/40" />
          {/* Decorative blur – unchanged */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white w-full">
            <BackButton
              fallback="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-6"
            />

            <div className="flex flex-wrap gap-3 mb-5">
              <span className="inline-block bg-[#C9293A] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide">
                {category}
              </span>
              <span className="inline-block bg-[#C9A84C] text-[#080C1A] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide">
                {status}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight max-w-4xl mb-5">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>
        </section>
      </div>

      {/* PROJECT DETAILS – unchanged */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">

            {/* INFO CARD */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm sticky top-24">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 font-serif">
                  Project Information
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Tag size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Category
                      </p>
                      <p className="font-semibold text-sm sm:text-base">{category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ActivityIcon size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Status
                      </p>
                      <p className="font-semibold text-sm sm:text-base">{status}</p>
                    </div>
                  </div>

                  {startDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          Start Date
                        </p>
                        <p className="font-semibold text-sm sm:text-base">{startDate}</p>
                      </div>
                    </div>
                  )}

                  {endDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-[#C9293A] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          End Date
                        </p>
                        <p className="font-semibold text-sm sm:text-base">{endDate}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Organisation
                    </p>
                    <p className="font-semibold text-sm sm:text-base">FPI Zambia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="order-1 lg:order-2 lg:col-span-2">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black mb-6">
                About This Project
              </h2>

              <div className="text-base sm:text-lg text-gray-700 leading-relaxed sm:leading-8 whitespace-pre-line">
                {project.content}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY – unchanged */}
      {project.images && project.images.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-center mb-10 sm:mb-12">
              Project Gallery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {project.images.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`${project.title} ${index + 1}`}
                  onClick={() => setLightboxIndex(index)}
                  className="h-64 sm:h-80 w-full object-cover rounded-2xl shadow-lg cursor-pointer hover:opacity-90 transition"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {project.images && (
        <Lightbox
          images={project.images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNavigate={setLightboxIndex}
        />
      )}

      {/* CTA – unchanged */}
      <section className="py-16 sm:py-24 bg-[#080C1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mb-6">
            Supporting Media Freedom &amp; Inclusion
          </h2>

          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Discover more initiatives that are creating positive change
            through media literacy, advocacy and citizen engagement.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            Explore More Projects
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .project-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .project-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProjectDetail;