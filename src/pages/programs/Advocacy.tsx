import { useEffect, useRef, useState } from "react";
import {
  Scale,
  Shield,
  Megaphone,
  Users,
  CheckCircle2,
  Calendar,
  FileText,
  Globe,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../../services/config";
import ProgramSections from "../../components/programs/ProgramSections";
import { useProgramContent } from "../../hooks/useProgramContent";

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const advocacyData = {
  hero: {
    title: "Strengthening Democratic Governance",
    subtitle:
      "Promoting media freedom, access to information, accountability and democratic participation through evidence-based advocacy and strategic partnerships.",
    // USING A RELIABLE FALLBACK IMAGE (CHANGE THIS TO YOUR OWN)
    backgroundImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600",
    ctaPrimary: { text: "Get Involved", link: "/contact" },
    ctaSecondary: { text: "Learn More", link: "/about" },
  },
  overview: {
    tag: "Who We Are",
    title: "Championing Press Freedom Since 2018",
    paragraphs: [
      "The Zambia Free Press Initiative (ZFPI) is a non-profit organization founded in July 2018 to promote excellence in journalism, press freedom and defend human rights. Since its establishment, the FPI has carried out activities covering all 10 provinces of Zambia, training journalists in investigative journalism, climate change reporting and balanced elections reporting that promotes peace.",
      "The organisation carries out advocacy and lobbying activities under its many projects to influence policy change and government decisions on key issues of press freedom, access to information, protection of human rights and media development.",
    ],
    image: "/images/advocacy.jpg",
  },
  pillars: {
    tag: "Our Focus Areas",
    title: "Advocacy Pillars",
    description:
      "Our work is built on four interconnected pillars that address the most pressing challenges to media freedom and democratic governance in Zambia.",
    items: [
      {
        icon: Shield,
        title: "Media Freedom",
        description:
          "Supporting independent journalism and freedom of expression. Advocating for repeal of laws that infringe on the practice of journalism.",
      },
      {
        icon: Scale,
        title: "Policy Reform",
        description:
          "Advocating for laws and policies that support democracy, including the Access to Information law and gender equity legislation.",
      },
      {
        icon: Megaphone,
        title: "Public Awareness",
        description:
          "Raising awareness on governance, civic participation, and digital rights through community forums and media campaigns.",
      },
      {
        icon: Users,
        title: "Stakeholder Engagement",
        description:
          "Bringing together citizens, media, civil society and government institutions to foster inclusive dialogue on democratic governance.",
      },
    ],
  },
  impact: {
    tag: "Our Reach",
    title: "Advocacy Impact",
    description:
      "Through strategic advocacy and community engagement, we've achieved measurable progress in advancing media freedom and democratic governance across Zambia.",
    stats: [
      { number: "10+", label: "Provinces Covered", subLabel: "Nationwide training and advocacy reach" },
      { number: "500+", label: "Journalists & Citizens", subLabel: "Trained on digital rights and media literacy" },
      { number: "30+", label: "Policy Dialogues & Forums", subLabel: "Held across Zambia" },
      { number: "4+", label: "Key Policy Wins", subLabel: "Legislative reforms achieved" },
    ],
  },
  campaigns: {
    tag: "Success Stories",
    title: "Key Advocacy Campaigns & Wins",
    description:
      "From influencing landmark legislation to empowering communities on digital rights, here are some of our notable achievements.",
    items: [
      {
        title: "Access to Information Law Enacted",
        date: "2024",
        color: "red",
        description:
          "After years of persistent advocacy, FPI played a key role in the enactment of the Access to Information law, a landmark achievement for transparency and accountability in Zambia.",
        extra:
          "The FPI continues to urge the government to promptly put into effect the newly passed law through a statutory instrument to uphold citizens' rights.",
      },
      {
        title: "Defamation of the President Offense Removed",
        date: "2023-2024",
        color: "gold",
        description:
          "FPI successfully advocated for the removal of the defamation of the President offence from the penal code, a significant victory for free expression and media freedom in Zambia.",
        extra:
          "The organisation continues to call for the repeal of laws that infringe on the practice of journalism.",
      },
      {
        title: "Cyber Laws Advocacy & Public Forums",
        date: "2024-2025",
        color: "red",
        description:
          "Through the Claim Your Space project, FPI hosted national consultative forums on cyber laws, bringing together young people, journalists, and civil society to reflect on digital safety and freedoms in Zambia.",
        extra:
          "FPI called on the government to withhold assent to the cyber bills, expressing deep concern over provisions that could restrict freedom of expression online.",
      },
      {
        title: "Gender Equity & Equality Commission",
        date: "Ongoing",
        color: "gold",
        description:
          "FPI is actively advocating for the establishment of the Gender Equity and Equality Commission, partnering with radio stations across Zambia to run programmes that educate citizens on gender equity and equality.",
        extra:
          "These programmes help in FPI's advocacy for the enactment of the ATI Bill and the establishment of the Commission.",
      },
    ],
  },
  partnerships: {
    tag: "Strategic Alliances",
    title: "Building Coalitions for Change",
    paragraphs: [
      "FPI recognizes that lasting change requires collective action. We work closely with a network of partners including civil society organizations, media houses, community radio stations, and international supporters.",
      "Our coalition partners include Chapter One Foundation, Bloggers of Zambia, Agents of Change Foundation, Disability Rights Watch, and the Danish Minorities Centre for Human Rights & Development. Together, we amplify our advocacy impact and ensure inclusive participation across all our initiatives.",
    ],
    partners: [
      { name: "MISA Zambia", project: "Kudziwa Project", icon: BookOpen },
      { name: "WANIFRA", project: "Media Freedom Committee", icon: Globe },
      { name: "Young Women in Action", project: "Claim Your Space", icon: Users },
      { name: "The Carter Center", project: "Human Rights Project", icon: Shield },
    ],
  },
  cta: {
    title: "Join the Movement for a Free and Open Zambia",
    button1: { text: "Get Involved", link: "/contact", icon: Users },
    button2: { text: "Explore Our Programs", link: "/programs", icon: Megaphone },
  },
};

// ============================================================
// CUSTOM HOOK FOR SCROLL ANIMATION
// ============================================================
function useFadeUp(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}ms, transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}ms`,
    } as React.CSSProperties,
  };
}

// ============================================================
// SECTION COMPONENTS
// ============================================================
const SectionBadge = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 bg-[#C9293A]/10 rounded-full px-4 py-1.5 mb-6">
    {icon && <span className="text-[#C9293A]">{icon}</span>}
    <span className="text-xs font-medium text-[#C9293A] tracking-wide">{text}</span>
  </div>
);

const AnimatedSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const { ref, style } = useFadeUp(delay);
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

const GradText = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      background: "linear-gradient(120deg, #E8610A, #F5A623)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontStyle: "italic",
    }}
  >
    {children}
  </span>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
const Advocacy = () => {
  const cms = useProgramContent("advocacy");

  const heroImage = cms?.heroImage
    ? getAssetUrl(cms.heroImage)
    : advocacyData.hero.backgroundImage;
  const heroSubtitle = cms?.intro || cms?.subtitle || advocacyData.hero.subtitle;
  const heroTitle = cms?.title;

  return (
    <>
      {/* ========== HERO SECTION – FIXED BACKGROUND WITH VISIBLE IMAGE ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image layer (strong guarantee it shows) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundColor: "#1a1a2e",
          }}
        ></div>

        {/* Semi-transparent dark overlay (reduced opacity for better image visibility) */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* Accent glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9293A]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/15 blur-3xl rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                Advocacy
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              {heroTitle || (
                <>
                  Strengthening <GradText>Democratic</GradText> Governance
                </>
              )}
            </h1>

            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={advocacyData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {advocacyData.hero.ctaPrimary.text}
              </Link>
              <Link
                to={advocacyData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {advocacyData.hero.ctaSecondary.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CMS CONTENT SECTIONS ========== */}
      <ProgramSections sections={cms?.sections} />

      {/* ========== OVERVIEW SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <SectionBadge text={advocacyData.overview.tag} icon={<Globe size={14} />} />
              <h2 className="font-serif text-3xl md:text-4xl font-black mb-6">
                {advocacyData.overview.title}
              </h2>
              {advocacyData.overview.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className="relative">
                <img
                  src={advocacyData.overview.image}
                  alt="Advocacy overview"
                  className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800";
                  }}
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white p-5 rounded-2xl shadow-xl">
                  <p className="text-3xl font-black">10+</p>
                  <p className="text-xs opacity-90">Provinces Reached</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== PILLARS SECTION ========== */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={advocacyData.pillars.tag} icon={<Scale size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {advocacyData.pillars.title}
            </h2>
            <p className="text-gray-600">{advocacyData.pillars.description}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advocacyData.pillars.items.map((pillar, idx) => (
              <AnimatedSection key={pillar.title} delay={idx * 100}>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                  <pillar.icon className="w-12 h-12 text-[#C9293A] mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-gray-600">{pillar.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== IMPACT SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={advocacyData.impact.tag} icon={<CheckCircle2 size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {advocacyData.impact.title}
            </h2>
            <p className="text-gray-600">{advocacyData.impact.description}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {advocacyData.impact.stats.map((stat, idx) => (
              <AnimatedSection key={stat.label} delay={idx * 100}>
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <div className="font-serif text-4xl md:text-5xl font-black text-[#C9293A] mb-2">
                    {stat.number}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.subLabel}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CAMPAIGNS SECTION ========== */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <SectionBadge text={advocacyData.campaigns.tag} icon={<FileText size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {advocacyData.campaigns.title}
            </h2>
            <p className="text-gray-600">{advocacyData.campaigns.description}</p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            {advocacyData.campaigns.items.map((campaign, idx) => (
              <AnimatedSection key={campaign.title} delay={idx * 100}>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full">
                  <div
                    className={`h-2 ${
                      campaign.color === "red" ? "bg-[#C9293A]" : "bg-[#C9A84C]"
                    }`}
                  ></div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Calendar
                        size={14}
                        className={campaign.color === "red" ? "text-[#C9293A]" : "text-[#C9A84C]"}
                      />
                      <span
                        className={campaign.color === "red" ? "text-[#C9293A]" : "text-[#C9A84C]"}
                      >
                        {campaign.date}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold mb-3">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{campaign.description}</p>
                    <p className="text-gray-600 text-sm">{campaign.extra}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARTNERSHIPS SECTION ========== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <SectionBadge text={advocacyData.partnerships.tag} icon={<Users size={14} />} />
              <h2 className="font-serif text-3xl md:text-4xl font-black mb-6">
                {advocacyData.partnerships.title}
              </h2>
              {advocacyData.partnerships.paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-600 mb-4 leading-relaxed">
                  {p}
                </p>
              ))}
            </AnimatedSection>

            <div className="grid grid-cols-2 gap-6">
              {advocacyData.partnerships.partners.map((partner, idx) => (
                <AnimatedSection key={partner.name} delay={idx * 100}>
                  <div className="bg-gray-50 p-6 rounded-xl text-center h-full transition-all duration-300 hover:shadow-md">
                    <partner.icon size={32} className="text-[#C9293A] mx-auto mb-3" />
                    <p className="font-medium">{partner.name}</p>
                    <p className="text-sm text-gray-500">{partner.project}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <section className="py-20 md:py-28 bg-[#080c1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-6 text-white">
              {advocacyData.cta.title.split(" ").map((word, i) =>
                word === "Free" ? (
                  <span key={i}>
                    <span className="text-[#C9A84C]">Free</span>{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a journalist, civil society actor, student, or concerned citizen —
              your voice matters. Partner with FPI Zambia to strengthen democratic governance and
              protect media freedom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={advocacyData.cta.button1.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {advocacyData.cta.button1.text}
                <advocacyData.cta.button1.icon size={18} />
              </Link>
              <Link
                to={advocacyData.cta.button2.link}
                className="inline-flex items-center gap-2 border border-[#C9293A] text-[#C9293A] px-8 py-3 rounded-full font-semibold hover:bg-[#C9293A]/10 hover:-translate-y-1 transition-all duration-300"
              >
                {advocacyData.cta.button2.text}
                <advocacyData.cta.button2.icon size={18} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Advocacy;