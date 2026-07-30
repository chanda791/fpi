import { Link } from "react-router-dom";
import { Megaphone, BookOpen, GraduationCap, Search, ArrowRight } from "lucide-react";

const programs = [
  {
    title: "Advocacy",
    description:
      "Championing media freedom, freedom of expression, and access to information through evidence-based advocacy and policy engagement.",
    icon: Megaphone,
    link: "/programs/advocacy",
    color: "#C9293A",
  },
  {
    title: "Media & Information Literacy",
    description:
      "Equipping communities with the skills to access, critically evaluate, and responsibly use information across today's media landscape.",
    icon: BookOpen,
    link: "/programs/media-literacy",
    color: "#2563EB",
  },
  {
    title: "Capacity Building",
    description:
      "Strengthening the skills and resilience of journalists, media houses, and civil society through training and mentorship.",
    icon: GraduationCap,
    link: "/programs/capacity-building",
    color: "#E8610A",
  },
  {
    title: "Research",
    description:
      "Producing rigorous research and analysis that informs policy, practice, and public understanding of the media environment.",
    icon: Search,
    link: "/programs/research",
    color: "#C9A84C",
  },
];

const Programs = () => {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[380px] sm:min-h-[50vh] flex items-center overflow-hidden bg-[#080C1A]">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">
              What We Do
            </span>
            <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black mb-6">Our Programs</h1>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
            Four interconnected areas of work advancing media freedom and information
            literacy across Zambia.
          </p>
        </div>
      </section>

      {/* PROGRAMS GRID */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <Link
                  key={program.title}
                  to={program.link}
                  className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${program.color}15` }}
                  >
                    <Icon size={26} style={{ color: program.color }} />
                  </div>
                  <h2 className="font-serif text-2xl font-black mb-3">{program.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {program.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[#C9293A] font-semibold text-sm group-hover:gap-2 transition-all">
                    Explore {program.title} <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
