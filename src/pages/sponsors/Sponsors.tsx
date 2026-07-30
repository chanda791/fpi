
import { HeartHandshake, Users, Globe, ShieldCheck, ArrowRight } from "lucide-react";

const sponsors = [
  {
    name: "Media Development Fund",
    type: "Strategic Sponsor",
    description:
      "Supporting journalism training and media development initiatives.",
  },
  {
    name: "International Development Partner",
    type: "Development Partner",
    description:
      "Providing support for governance and civic engagement programs.",
  },
  {
    name: "Democracy Support Initiative",
    type: "Funding Partner",
    description:
      "Supporting media freedom and democratic participation projects.",
  },
  {
    name: "Research & Innovation Fund",
    type: "Research Sponsor",
    description:
      "Funding research, publications and media literacy activities.",
  },
  {
    name: "Strategic Development Partner",
    type: "Institutional Partner",
    description:
      "Contributing to institutional growth and sustainability.",
  },
  {
    name: "Community Impact Fund",
    type: "Community Sponsor",
    description:
      "Supporting local community engagement and outreach programs.",
  },
];

const impact = [
  { value: "15+", label: "Development Partners" },
  { value: "30+", label: "Projects Supported" },
  { value: "5,000+", label: "Citizens Reached" },
  { value: "100%", label: "Commitment" },
];

const areas = [
  { icon: <ShieldCheck className="w-8 h-8 text-white" />, title: "Media Freedom" },
  { icon: <Users className="w-8 h-8 text-white" />, title: "Capacity Building" },
  { icon: <Globe className="w-8 h-8 text-white" />, title: "Media Literacy" },
];

export default function Sponsors() {
  return (
    <>
      <section
        className="relative min-h-[70vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/images/sponsors.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#080C1A]/80" />
        <div className="relative z-10 max-w-4xl px-6 text-white">
          <span className="inline-block bg-[#C9293A] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Partnerships
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Sponsors & Supporters
          </h1>
          <p className="text-xl text-gray-200">
            Our work is made possible through the generous support of organisations
            committed to strengthening media freedom, democracy and Media &
            Information Literacy across Zambia.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6">
          {impact.map((item) => (
            <div key={item.label} className="rounded-2xl bg-gray-50 p-8 text-center shadow hover:shadow-xl transition">
              <h2 className="text-5xl font-bold text-[#C9293A]">{item.value}</h2>
              <p className="mt-3 text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">Our Sponsors</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              Together we deliver programmes that strengthen journalism, civic
              participation and media literacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="bg-white rounded-3xl p-8 shadow hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9293A] to-[#E8610A] flex items-center justify-center mx-auto mb-6">
                  <HeartHandshake className="w-10 h-10 text-white" />
                </div>
                <p className="text-center text-[#E8610A] font-semibold text-sm uppercase">{sponsor.type}</p>
                <h3 className="text-2xl font-bold text-center mt-2">{sponsor.name}</h3>
                <p className="text-gray-600 text-center mt-4">{sponsor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">Partnership Areas</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {areas.map((a) => (
              <div key={a.title} className="rounded-2xl bg-[#080C1A] p-8 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9293A] to-[#E8610A] flex items-center justify-center mx-auto mb-6">
                  {a.icon}
                </div>
                <h3 className="text-2xl font-bold">{a.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#080C1A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Become a Partner</h2>
          <p className="text-gray-300 text-lg mb-10">
            Join FPI Zambia in advancing independent journalism, media literacy
            and democratic participation.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#C9293A] hover:bg-red-700 transition px-8 py-4 rounded-xl font-semibold">
            Partner With Us
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </>
  );
}
