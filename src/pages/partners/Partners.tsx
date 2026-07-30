import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  Users,
  Globe,
  ShieldCheck,
  Radio,
  Newspaper,
  MessagesSquare,
  GraduationCap,
  ArrowRight,
  X,
  ExternalLink,
  Heart,
} from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

interface Partner {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  category?: string;
  published: boolean;
}

const fallbackIcons = [Globe, ShieldCheck, Radio, Newspaper, MessagesSquare, GraduationCap];

interface Donor {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  tier?: string;
  published: boolean;
}

const DonorsSection = () => {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/donors`)
      .then((res) => res.json())
      .then((data: Donor[]) => setDonors(data.filter((d) => d.published)))
      .catch((err) => console.error(err));
  }, []);

  if (donors.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-[#C9293A] uppercase tracking-widest font-semibold text-sm">
            With Thanks
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4">
            Our Donors &amp; Supporters
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-xl bg-gray-50 border flex items-center justify-center overflow-hidden mb-4">
                {donor.logo ? (
                  <img src={getAssetUrl(donor.logo)} alt={donor.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <Heart className="w-8 h-8 text-[#C9293A]" />
                )}
              </div>
              <h3 className="font-bold text-sm">{donor.name}</h3>
              {donor.tier && (
                <span className="text-xs text-[#C9A84C] uppercase tracking-wide mt-1">
                  {donor.tier}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const stats = [
  { value: "20+", label: "Strategic Partners" },
  { value: "15+", label: "Joint Projects" },
  { value: "10", label: "Provinces Reached" },
  { value: "100%", label: "Commitment" },
];

const collaboration = [
  {
    icon: Handshake,
    title: "Collaboration",
    text: "Working together to strengthen journalism and civic engagement.",
  },
  {
    icon: Users,
    title: "Capacity Building",
    text: "Training journalists, educators and communities across Zambia.",
  },
  {
    icon: Globe,
    title: "National Impact",
    text: "Creating sustainable programmes that improve access to trusted information.",
  },
];

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Partner | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/partners`)
      .then((res) => res.json())
      .then((data: Partner[]) => setPartners(data.filter((p) => p.published)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="partners-hero-fixed">
        <section className="relative flex items-center overflow-hidden py-20 bg-[#080C1A]">
          {/* Fixed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-bg-3.jpg')",
              backgroundAttachment: "fixed",
            }}
          />
          {/* Gradient overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080C1A]/90 via-[#080C1A]/80 to-[#080C1A]/60" />

          {/* Decorative blurs – unchanged */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Content – unchanged */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">
                Strategic Partnerships
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              Our Partners
            </h1>

            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              Building stronger journalism, media freedom, media literacy and
              democratic participation through meaningful partnerships that
              create lasting impact across Zambia.
            </p>
          </div>
        </section>
      </div>

      {/* STATISTICS */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center p-5 sm:p-8 hover:-translate-y-1 border border-[#C9293A]/10"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#C9293A]">
                  {item.value}
                </h2>
                <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS GRID */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14">
            <span className="text-[#C9293A] font-semibold uppercase tracking-wider text-sm">
              Working Together
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4 mb-4 sm:mb-6">
              Our Strategic Partners
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-base sm:text-lg">
              Through collaboration with national and international
              organisations, FPI Zambia continues to strengthen independent
              journalism, media literacy and democratic participation.
            </p>
          </div>

          {loading ? (
            null
          ) : partners.length === 0 ? (
            <p className="text-center text-gray-500">
              Partner organisations will be listed here soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {partners.map((partner, index) => {
                const Icon = fallbackIcons[index % fallbackIcons.length];

                return (
                  <button
                    key={partner.id}
                    onClick={() => setSelected(partner)}
                    className="text-left bg-white rounded-3xl p-6 sm:p-8 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-[#C9293A]/20"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-5 sm:mb-6 overflow-hidden">
                      {partner.logo ? (
                        <img
                          src={getAssetUrl(partner.logo)}
                          alt={partner.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#C9293A] to-[#E8610A] flex items-center justify-center">
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      )}
                    </div>

                    <span className="block text-center text-xs sm:text-sm uppercase tracking-widest text-[#C9A84C] font-semibold mb-2 sm:mb-3">
                      {partner.category || "Strategic Partner"}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">
                      {partner.name}
                    </h3>

                    <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed line-clamp-3">
                      {partner.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PARTNER MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <div className="w-24 h-24 rounded-2xl bg-gray-50 border flex items-center justify-center overflow-hidden mb-5">
              {selected.logo ? (
                <img src={getAssetUrl(selected.logo)} alt={selected.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Handshake className="w-10 h-10 text-[#C9293A]" />
              )}
            </div>

            <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold">
              {selected.category || "Strategic Partner"}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black mt-1 mb-4">
              {selected.name}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {selected.description}
            </p>

            {selected.website && (
              <a
                href={selected.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 transition"
              >
                Visit Website <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* COLLABORATION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-14">
            <span className="text-[#C9293A] uppercase tracking-widest font-semibold text-sm">
              Collaboration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4">
              How We Work Together
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collaboration.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-[#080C1A] rounded-3xl p-8 sm:p-10 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#C9293A] to-[#E8610A] flex items-center justify-center mx-auto mb-6 sm:mb-8">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed sm:leading-8">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DONORS */}
      <DonorsSection />

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#080C1A] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="uppercase tracking-widest text-[#C9A84C] font-semibold text-sm">
            Join Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4 mb-4 sm:mb-6">
            Become A Strategic Partner
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed sm:leading-8 mb-8 sm:mb-10 max-w-2xl mx-auto">
            We welcome organisations committed to strengthening media freedom,
            promoting media literacy and advancing democratic participation
            throughout Zambia. Together we can create lasting impact for
            communities across the country.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            Partner With FPI Zambia
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .partners-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .partners-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default Partners;