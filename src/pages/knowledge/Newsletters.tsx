import { useEffect, useRef, useState } from "react";
import { Mail, Calendar, Download, FileText } from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import DocumentPreviewModal from "../../components/DocumentPreviewModal";
import { subscriberService } from "../../services/subscriberService";

interface Newsletter {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  image?: string;
  publishDate?: string;
  published: boolean;
  createdAt: string;
}

// ============================================================
// DATA CONFIGURATION – all content can be replaced from admin
// ============================================================
const newslettersData = {
  hero: {
    title: "Newsletters",
    subtitle:
      "Stay informed with the latest updates, achievements, research insights, and activities from FPI Zambia.",
    backgroundImage: "/images/news.jpg",
    ctaPrimary: { text: "Subscribe Now", link: "#subscribe" },
    ctaSecondary: { text: "Browse Archive", link: "#newsletter-list" },
  },
  intro: {
    tag: "Stay Connected",
    title: "Our Latest Newsletters",
    description:
      "Get monthly updates on media freedom, journalism training, advocacy campaigns, research publications, and community impact.",
  },
  subscribe: {
    tag: "Never Miss an Update",
    title: "Subscribe to Our Newsletter",
    description:
      "Receive monthly insights on media freedom, journalism development, research, events, and opportunities directly in your inbox.",
    buttonText: "Subscribe Now",
    placeholder: "Enter your email address",
  },
  cta: {
    title: "Stay Informed, Stay Engaged",
    subtitle:
      "Join a community of journalists, researchers, and advocates working for a free and informed Zambia.",
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
const Newsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subbing, setSubbing] = useState(false);

  const handleSubscribe = async () => {
    if (!subEmail.trim() || !subEmail.includes("@")) {
      setSubStatus("Please enter a valid email address.");
      return;
    }
    try {
      setSubbing(true);
      setSubStatus(null);
      const res = await subscriberService.subscribe(subEmail.trim());
      setSubStatus(res.message || "Subscribed. Thank you!");
      setSubEmail("");
    } catch (e) {
      console.error(e);
      setSubStatus("Something went wrong. Please try again.");
    } finally {
      setSubbing(false);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/newsletters`)
      .then((res) => res.json())
      .then((data: Newsletter[]) => {
        const published = data.filter((n) => n.published);
        published.sort(
          (a, b) =>
            new Date(b.publishDate || b.createdAt).getTime() -
            new Date(a.publishDate || a.createdAt).getTime()
        );
        setNewsletters(published);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-sans bg-gradient-to-b from-white to-gray-50">
      {/* ========== HERO SECTION – FIXED BACKGROUND ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${newslettersData.hero.backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9293A]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/15 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/80">
                Knowledge Hub
              </span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full"></span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              <GradText>Newsletters</GradText>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
              {newslettersData.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={newslettersData.hero.ctaPrimary.link}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                {newslettersData.hero.ctaPrimary.text}
              </a>
              <a
                href={newslettersData.hero.ctaSecondary.link}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                {newslettersData.hero.ctaSecondary.text}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== INTRO & STATS ========== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <SectionBadge text={newslettersData.intro.tag} icon={<Mail size={14} />} />
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {newslettersData.intro.title}
            </h2>
            <p className="text-gray-600 text-lg">{newslettersData.intro.description}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER LIST (cards with images) ========== */}
      <section id="newsletter-list" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A] mb-4">
              <span className="block w-6 h-[2px] bg-[#C9293A]" />
              Recent Issues
              <span className="block w-6 h-[2px] bg-[#C9293A]" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black">Browse Our Archive</h2>
          </div>

          {loading ? (
            null
          ) : newsletters.length === 0 ? (
            <p className="text-center text-gray-500">
              No newsletters have been added yet. Check back soon.
            </p>
          ) : (
            <div className="space-y-8">
              {newsletters.map((newsletter, idx) => (
                <AnimatedSection key={newsletter.id} delay={idx * 100}>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                      {newsletter.image ? (
                        <div className="md:w-1/4 min-h-[160px]">
                          <img
                            src={getAssetUrl(newsletter.image)}
                            alt={newsletter.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="md:w-1/4 bg-gradient-to-br from-[#C9293A]/10 to-[#E8610A]/10 flex items-center justify-center p-10">
                          <FileText className="w-16 h-16 text-[#C9293A]" />
                        </div>
                      )}
                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex items-center text-[#C9293A] text-sm mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(newsletter.publishDate || newsletter.createdAt).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <h3 className="font-serif text-xl md:text-2xl font-bold mb-4">
                          {newsletter.title}
                        </h3>
                        {newsletter.description && (
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {newsletter.description}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setPreviewNewsletter(newsletter)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-4 py-2 rounded-full text-sm font-semibold hover:-translate-y-1 transition-all duration-300 shadow-md"
                        >
                          <Download size={16} />
                          Review &amp; Download
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== SUBSCRIPTION SECTION ========== */}
      <section id="subscribe" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C9293A] mb-4">
              <span className="block w-6 h-[2px] bg-[#C9293A]" />
              {newslettersData.subscribe.tag}
              <span className="block w-6 h-[2px] bg-[#C9293A]" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4">
              {newslettersData.subscribe.title}
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              {newslettersData.subscribe.description}
            </p>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder={newslettersData.subscribe.placeholder}
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubscribe(); }}
                className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9293A] focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subbing}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-8 py-3 rounded-full font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg whitespace-nowrap disabled:opacity-60"
              >
                <Mail size={18} />
                {subbing ? "Subscribing..." : newslettersData.subscribe.buttonText}
              </button>
            </div>
            {subStatus && (
              <p className="text-[#C9293A] text-sm mt-4">{subStatus}</p>
            )}
            <p className="text-gray-400 text-xs mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== CALL TO ACTION ========== */}
      <section className="py-20 md:py-28 bg-[#080c1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              {newslettersData.cta.title}
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {newslettersData.cta.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {previewNewsletter && (
        <DocumentPreviewModal
          fileUrl={previewNewsletter.fileUrl}
          title={previewNewsletter.title}
          onClose={() => setPreviewNewsletter(null)}
        />
      )}
    </div>
  );
};

export default Newsletters;