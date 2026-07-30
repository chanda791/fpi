import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { API_BASE_URL } from "../../services/config";

interface TeamMember {
  id: number;
  fullName: string;
  position: string;
  category?: string;
  biography?: string;
  responsibilities?: string[];
  image?: string;
  displayOrder: number;
  published: boolean;
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/team`)
      .then((res) => res.json())
      .then((data: TeamMember[]) => {
        setMembers(
          data
            .filter((m) => m.published)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const groups = members.reduce<Record<string, TeamMember[]>>((acc, member) => {
    const key = member.category || "Team";
    if (!acc[key]) acc[key] = [];
    acc[key].push(member);
    return acc;
  }, {});

  return (
    <div className="bg-white">
      {/* ══ HERO – full screen with fixed background ══ */}
      <div className="team-hero-fixed">
        <section className="relative flex items-center overflow-hidden bg-[#080C1A]">
          {/* Fixed background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("/images/hero-bg-1.jpg")`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Dark overlay – slightly lighter to show image */}
          <div className="absolute inset-0 bg-[#080C1A]/80" />

          {/* Decorative blurs – unchanged */}
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Content – unchanged */}
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">
                Our People
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
              Meet Our Team
            </h1>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              The people driving FPI Zambia's mission to strengthen media freedom,
              journalism and media literacy across the country.
            </p>
          </div>
        </section>
      </div>

      {/* TEAM – unchanged */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            null
          ) : members.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Team member profiles are being added. Check back soon.
              </p>
            </div>
          ) : (
            Object.entries(groups).map(([category, groupMembers]) => (
              <div key={category} className="mb-16 last:mb-0">
                <h2 className="font-serif text-2xl sm:text-3xl font-black mb-8 text-center sm:text-left">
                  {category}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                    >
                      <div className="h-64 bg-gray-100">
                        <img
                          src={member.image || "/images/activity-1.jpg"}
                          alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-bold">{member.fullName}</h3>
                        <p className="text-[#C9293A] text-sm font-semibold mb-3">
                          {member.position}
                        </p>

                        {member.biography && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-4">
                            {member.biography}
                          </p>
                        )}

                        {member.responsibilities && member.responsibilities.length > 0 && (
                          <ul className="text-gray-500 text-xs space-y-1 list-disc list-inside">
                            {member.responsibilities.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .team-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .team-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Team;