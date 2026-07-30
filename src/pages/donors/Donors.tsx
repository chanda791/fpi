import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ExternalLink, X, ArrowRight } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

interface Donor {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  tier?: string;
  published: boolean;
}

const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Donor | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/donors`)
      .then((res) => res.json())
      .then((data: Donor[]) => setDonors(data.filter((d) => d.published)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="donors-hero-fixed">
        <section className="relative flex items-center overflow-hidden bg-[#080C1A]">
          {/* Fixed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("/images/hero-bg-2.jpg")`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Dark overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-[#080C1A]/80" />

          {/* Decorative blurs – unchanged */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Content – unchanged */}
          <div className="relative max-w-4xl mx-auto px-4 text-center text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">With Gratitude</span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black mb-6">Our Donors &amp; Supporters</h1>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              The organisations and individuals whose generous support makes FPI Zambia's work in media freedom and literacy possible.
            </p>
          </div>
        </section>
      </div>

      {/* DONORS GRID – unchanged */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            null
          ) : donors.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Our supporters will be listed here soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {donors.map((donor) => (
                <button
                  key={donor.id}
                  onClick={() => setSelected(donor)}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-xl bg-gray-50 border flex items-center justify-center overflow-hidden mb-4">
                    {donor.logo ? (
                      <img src={getAssetUrl(donor.logo)} alt={donor.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <Heart className="w-9 h-9 text-[#C9293A]" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm">{donor.name}</h3>
                  {donor.tier && <span className="text-xs text-[#C9A84C] uppercase tracking-wide mt-1">{donor.tier}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DONOR MODAL – unchanged */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"><X size={22} /></button>
            <div className="w-24 h-24 rounded-2xl bg-gray-50 border flex items-center justify-center overflow-hidden mb-5">
              {selected.logo ? (
                <img src={getAssetUrl(selected.logo)} alt={selected.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Heart className="w-10 h-10 text-[#C9293A]" />
              )}
            </div>
            {selected.tier && <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold">{selected.tier}</span>}
            <h3 className="font-serif text-2xl sm:text-3xl font-black mt-1 mb-4">{selected.name}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>
            {selected.website && (
              <a href={selected.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 transition">
                Visit Website <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* CTA – unchanged */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-black mb-5">Support Our Work</h2>
          <p className="text-gray-600 mb-8">Interested in partnering with or supporting FPI Zambia? We'd love to hear from you.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3.5 rounded-full font-semibold hover:-translate-y-1 transition">
            Get In Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .donors-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .donors-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default Donors;