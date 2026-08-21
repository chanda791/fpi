import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../services/config";
import { WhatsAppIcon, buildWhatsAppLink } from "../WhatsAppButton";

const SERIF = "'Playfair Display', Georgia, serif";
const SANS  = "'Inter', system-ui, sans-serif";
const INK   = "#080c1a";
const RED   = "#C9293A";
const GOLD  = "#C9A84C";

const quickLinks = [
  { label: "About Us",  to: "/about"    },
  { label: "Our Team",  to: "/team"     },
  { label: "Partners",  to: "/partners" },
  { label: "Contact",   to: "/contact"  },
];

const programs = [
  { label: "Advocacy",          to: "/programs/advocacy"          },
  { label: "Media Literacy",    to: "/programs/media-literacy"    },
  { label: "Research",          to: "/programs/research"          },
  { label: "Capacity Building", to: "/programs/capacity-building" },
];

const contactItems = [
  { icon: <MapPin size={14} />,  text: "Location Unit 2, Makishi Road, Rhodes Park, Lusaka, ZM"     },
  { icon: <Phone size={14} />,   text: "+260 954 723 936"   },
  { icon: <Mail  size={14} />,   text: "prog@fpizambia.org" },
];


// ─── animation hook (unchanged) ──────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
    } as React.CSSProperties,
  };
}

// ─── nav link (unchanged) ────────────────────────────────────────────────────
function NavLink({ to, label }: { to: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      style={{
        fontSize: 13,
        color: hovered ? "#fff" : "rgba(255,255,255,0.42)",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 0",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "color .2s, transform .2s",
        fontFamily: SANS,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          width: hovered ? 20 : 14,
          height: 1,
          background: RED,
          flexShrink: 0,
          display: "block",
          transition: "width .2s",
        }}
      />
      {label}
    </Link>
  );
}

// ─── stat badge (unchanged) ──────────────────────────────────────────────────
function StatBadge({ num, label, delay }: { num: string; label: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const anim = useFadeUp(delay);
  return (
    <div
      ref={anim.ref}
      style={{
        ...anim.style,
        textAlign: "center",
        padding: "1rem .75rem",
        background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        borderRadius: 6,
        transform: `${anim.style.transform} ${hovered ? "translateY(-2px)" : ""}`,
        transition: `${anim.style.transition}, background .2s`,
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontFamily: SERIF, fontSize: "1.1rem", fontWeight: 900, color: RED, lineHeight: 1 }}>
        {num}
      </div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 3, lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  );
}

// ─── FOOTER (fully responsive) ───────────────────────────────────────────────
const Footer = () => {
  const col1 = useFadeUp(100);
  const col2 = useFadeUp(200);
  const col3 = useFadeUp(300);
  const col4 = useFadeUp(400);
  const col5 = useFadeUp(500);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [subBtnHovered, setSubBtnHovered] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subbing, setSubbing] = useState(false);
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [phone, setPhone] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => setPhone(data?.phone))
      .catch((err) => console.error(err));
  }, []);

  const handleSubscribe = async () => {
    if (!subEmail.trim() || !subEmail.includes("@")) {
      setSubStatus("Please enter a valid email address.");
      return;
    }
    try {
      setSubbing(true);
      setSubStatus(null);
      const res = await fetch(`${API_BASE_URL}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      });
      const data = await res.json().catch(() => ({}));
      setSubStatus(data.message || "Subscribed. Thank you!");
      setSubEmail("");
    } catch (e) {
      console.error(e);
      setSubStatus("Something went wrong. Please try again.");
    } finally {
      setSubbing(false);
    }
  };

  return (
    <footer style={{ background: INK, color: "#fff", fontFamily: SANS, overflow: "hidden" }}>
      {/* animated top bar (unchanged) */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${RED}, ${GOLD}, ${RED}, ${GOLD})`,
          backgroundSize: "300% 100%",
          animation: "gradientShift 4s ease infinite",
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ─── RESPONSIVE OVERRIDES (mobile) ──────────────────────────────── */
        @media (max-width: 768px) {
          .footer-newsletter-grid {
            grid-template-columns: 1fr !important;
            gap: 1.8rem !important;
          }
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            border-bottom: none !important;
          }
          .footer-brand-col {
            border-right: none !important;
            border-bottom: 0.5px solid rgba(255,255,255,0.07) !important;
          }
          .footer-quick-col, .footer-programs-col {
            border-right: none !important;
            border-bottom: 0.5px solid rgba(255,255,255,0.07) !important;
          }
          .footer-cta-col {
            border-bottom: none !important;
          }
          .footer-stat-row {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .footer-copyright {
            flex-direction: column !important;
            text-align: center !important;
            padding: 1rem 1.5rem !important;
          }
          .footer-newsletter {
            padding: 1.8rem !important;
          }
          .footer-column-padding {
            padding: 1.8rem !important;
          }
          .footer-newsletter-input-group {
            flex-direction: column !important;
          }
          .footer-newsletter-input {
            width: 100% !important;
          }
          .footer-newsletter-button {
            width: 100% !important;
          }
        }
      `}</style>

      {/* ── NEWSLETTER SECTION (responsive) ───────────────────────────────── */}
      <section className="footer-newsletter" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)", padding: "2.5rem" }}>
        <div className="footer-newsletter-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div ref={col1.ref} style={col1.style}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginBottom: "0.9rem" }}>
              <span style={{ width: 18, height: 1.5, background: RED, display: "block" }} />
              Stay informed
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "1.5rem", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 0.6rem" }}>
              Supporting media freedom &amp;{" "}
              <em style={{ fontStyle: "italic", color: GOLD }}>democratic participation</em>
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.42)", margin: 0 }}>
              Subscribe for updates on media freedom, journalism training, research publications, and opportunities.
            </p>
          </div>

          <div ref={col2.ref} style={{ ...col2.style, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div className="footer-newsletter-input-group" style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="footer-newsletter-input"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubscribe(); }}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.14)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  padding: "0.65rem 1rem",
                  outline: "none",
                  fontFamily: SANS,
                  transition: "border-color .2s, background .2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,41,58,0.8)"; e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              />
              <button
                className="footer-newsletter-button"
                style={{
                  background: subBtnHovered ? "#b02030" : RED,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.65rem 1.25rem",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: SANS,
                  flexShrink: 0,
                  transform: subBtnHovered ? "translateY(-1px)" : "translateY(0)",
                  transition: "background .2s, transform .15s",
                }}
                onMouseEnter={() => setSubBtnHovered(true)}
                onMouseLeave={() => setSubBtnHovered(false)}
                onClick={handleSubscribe}
                disabled={subbing}
              >
                {subbing ? "..." : "Subscribe"}
              </button>
            </div>
            {subStatus ? (
              <p style={{ fontSize: 12, color: "#4ADE80", margin: 0, paddingLeft: 2 }}>
                {subStatus}
              </p>
            ) : (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", margin: 0, paddingLeft: 2 }}>
                No spam. Unsubscribe anytime.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN COLUMNS (responsive grid) ────────────────────────────────── */}
      <section className="footer-main-grid" style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1.3fr", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>

        {/* BRAND COLUMN */}
        <div ref={col2.ref} className="footer-brand-col footer-column-padding" style={{ ...col2.style, padding: "2.5rem", borderRight: "0.5px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2rem" }}>
          <div>
            <img src="/logo.png" alt="FPI Zambia" style={{ height: 50, width: "auto", display: "block", marginBottom: "1.25rem" }} />
            <p style={{ fontSize: 13, lineHeight: 1.85, color: "rgba(255,255,255,0.4)", margin: "0 0 1.5rem", maxWidth: 210 }}>
              Promoting media freedom, strengthening journalism and advancing democratic participation throughout Zambia.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {[{ w: 28, o: 1 }, { w: 8, o: 0.4 }, { w: 4, o: 0.18 }].map((seg, i) => (
                <div key={i} style={{ width: seg.w, height: 1.5, background: RED, opacity: seg.o }} />
              ))}
            </div>
          </div>

          <div className="footer-stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {contactItems.map((item) => (
              <div
                key={item.text}
                style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.38)", padding: "3px 0", cursor: "default", transition: "color .2s, transform .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                <span style={{ color: GOLD, display: "flex", flexShrink: 0, transition: "transform .2s" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div ref={col3.ref} className="footer-quick-col footer-column-padding" style={{ ...col3.style, padding: "2.5rem", borderRight: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: SERIF, fontSize: "0.95rem", fontWeight: 700, color: "#fff", margin: "0 0 1.25rem" }}>Quick links</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {quickLinks.map((l) => <NavLink key={l.to} {...l} />)}
          </div>
        </div>

        {/* PROGRAMS */}
        <div ref={col4.ref} className="footer-programs-col footer-column-padding" style={{ ...col4.style, padding: "2.5rem", borderRight: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: SERIF, fontSize: "0.95rem", fontWeight: 700, color: "#fff", margin: "0 0 1.25rem" }}>Programs</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {programs.map((l) => <NavLink key={l.to} {...l} />)}
          </div>
        </div>

        {/* CTA PANEL */}
        <div
          ref={col5.ref}
          className="footer-cta-col footer-column-padding"
          style={{
            ...col5.style,
            padding: "2.5rem",
            background: ctaHovered ? "rgba(201,41,58,0.13)" : "rgba(201,41,58,0.07)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.5rem",
            transition: `background .3s, ${col5.style.transition}`,
          }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: "0.9rem" }}>
              Get involved
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: "1.1rem", fontWeight: 900, lineHeight: 1.2, color: "#fff", margin: "0 0 0.75rem" }}>
              Partner with us in building a free press
            </h3>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Work with FPI Zambia to promote independent journalism and democratic participation across Zambia.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link
              to="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: btnHovered ? 12 : 8,
                background: btnHovered ? "#b02030" : RED,
                color: "#fff",
                padding: "0.65rem 1.25rem",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                width: "fit-content",
                transform: btnHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "background .2s, transform .2s, gap .2s",
              }}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              Contact us <ArrowRight size={13} />
            </Link>

            {phone && (
              <a
                href={buildWhatsAppLink(phone, "Hello! I'd like to know more about FPI Zambia.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: whatsappHovered ? 12 : 8,
                  background: whatsappHovered ? "#1ebc59" : "#25D366",
                  color: "#fff",
                  padding: "0.65rem 1.25rem",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  width: "fit-content",
                  transform: whatsappHovered ? "translateY(-2px)" : "translateY(0)",
                  transition: "background .2s, transform .2s, gap .2s",
                }}
                onMouseEnter={() => setWhatsappHovered(true)}
                onMouseLeave={() => setWhatsappHovered(false)}
              >
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── COPYRIGHT (responsive) ───────────────────────────────────────── */}
      <section className="footer-copyright" style={{ padding: "1.1rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", margin: 0 }}>
          © {new Date().getFullYear()} FPI Zambia. All Rights Reserved.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
          Developed by Clevic <ArrowRight size={12} />
        </div>
      </section>
    </footer>
  );
};

export default Footer;