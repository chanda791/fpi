import {
  MapPin,
  Users,
  Laptop,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Original data — untouched ────────────────────────────────
const provinces = [
  { name: "Lusaka Province",     hubs: 7, path: "/mil/province/lusaka" },
  { name: "Copperbelt Province", hubs: 3, path: "/mil/province/copperbelt" },
  { name: "Southern Province",   hubs: 1, path: "/mil/province/southern" },
  { name: "Eastern Province",    hubs: 2, path: "/mil/province/eastern" },
];

const features = [
  {
    icon: <Laptop size={18} />,
    title: "Digital Skills",
    body: "Training communities on digital tools, online safety and responsible internet use.",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Learning Resources",
    body: "Access to educational materials, toolkits and media literacy resources.",
  },
  {
    icon: <Users size={18} />,
    title: "Community Engagement",
    body: "Encouraging dialogue and participation through local activities and workshops.",
  },
];

const stats = [
  { num: "13+",    label: "MIL Hubs" },
  { num: "5,000+", label: "Citizens Reached" },
  { num: "100+",   label: "Training Sessions" },
  { num: "50+",    label: "Community Events" },
];

// ─── Single background image (same as Brochure pattern) ──────
const BG = "/images/mil.jpg";

// ─── Section helpers (mirrors Brochure's BgSection / LightSection) ─

/** Dark — photo shows through with tinted overlay, parallax scroll */
const BgSection = ({
  children,
  overlay = "rgba(10,3,0,0.80)",
  py = 80,
  center = false,
  id = "",
}: {
  children: React.ReactNode;
  overlay?: string;
  py?: number;
  center?: boolean;
  id?: string;
}) => (
  <section
    id={id}
    style={{
      position: "relative",
      padding: `${py}px 24px`,
      textAlign: center ? "center" : "left",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    />
    <div style={{ position: "absolute", inset: 0, background: overlay }} />
    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
      {children}
    </div>
  </section>
);

/** Light — cream wash, image bleeds subtly at edges, parallax scroll */
const LightSection = ({
  children,
  py = 80,
  center = false,
  id = "",
}: {
  children: React.ReactNode;
  py?: number;
  center?: boolean;
  id?: string;
}) => (
  <section
    id={id}
    style={{
      position: "relative",
      padding: `${py}px 24px`,
      textAlign: center ? "center" : "left",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,248,240,0.93)",
      }}
    />
    <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
      {children}
    </div>
  </section>
);

// ─── Tiny shared UI bits ──────────────────────────────────────

const TopBar = () => (
  <div
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      height: 3,
      background: "linear-gradient(90deg,#C9293A,#E8610A,#F5A623,#E8610A,#C9293A)",
      zIndex: 10,
    }}
  />
);

const Pill = ({
  label,
  light = false,
}: {
  label: string;
  light?: boolean;
}) => (
  <p
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: light ? "rgba(245,166,35,0.9)" : "#E8610A",
      background: light ? "rgba(232,97,10,0.15)" : "rgba(232,97,10,0.10)",
      border: `1px solid ${light ? "rgba(232,97,10,0.35)" : "rgba(232,97,10,0.25)"}`,
      padding: "4px 14px",
      borderRadius: 999,
      margin: "0 0 12px",
    }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: light ? "#F5A623" : "#E8610A",
        display: "inline-block",
      }}
    />
    {label}
  </p>
);

const GradText = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      background: "linear-gradient(120deg,#E8610A,#F5A623)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontStyle: "italic",
    }}
  >
    {children}
  </span>
);

const Badge = ({ big, small }: { big: string; small: string }) => (
  <div
    style={{
      background: "linear-gradient(135deg,#C9293A,#E8610A)",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: 14,
      boxShadow: "0 4px 18px rgba(201,41,58,0.40)",
      textAlign: "center",
    }}
  >
    <div style={{ fontFamily: "Georgia,serif", fontWeight: 900, fontSize: 26 }}>{big}</div>
    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{small}</div>
  </div>
);

const SectionDivider = ({ left, right }: { left: string; right: string }) => (
  <div
    style={{
      position: "relative",
      padding: "13px 24px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    />
    <div style={{ position: "absolute", inset: 0, background: "rgba(255,248,240,0.95)" }} />
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderTop: "1px solid #FFE0C0",
        borderBottom: "1px solid #FFE0C0",
        width: "100%",
        padding: "10px 0",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#A0522D",
        }}
      >
        {left}
      </span>
      <span style={{ color: "#F5C4A0" }}>—</span>
      <span
        style={{
          fontFamily: "Georgia,serif",
          fontWeight: 700,
          fontSize: 15,
          color: "#1A0A00",
        }}
      >
        {right}
      </span>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────
const Hubs = () => {
  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#1A0A00" }}>

      {/* ══ HERO (fixed background, animated content) ═══════════════ */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-animate {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .hero-delay-1 { animation-delay: 0.1s; }
        .hero-delay-2 { animation-delay: 0.2s; }
        .hero-delay-3 { animation-delay: 0.3s; }
      `}</style>

      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",  // Static / fixed background
        }}
      >
        <TopBar />

        {/* Dark gradient overlay – lighter than before for better image visibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(10,3,0,0.65) 0%, rgba(20,5,0,0.55) 55%, rgba(232,97,10,0.20) 100%)",
          }}
        />

        {/* Warm blush from bottom (subtle) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(232,97,10,0.20) 0%, transparent 60%)",
          }}
        />

        {/* Centered content with fade-in animations */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 760,
            marginTop: -40,
          }}
        >
          {/* Eyebrow line (animated) */}
          <div
            className="hero-animate hero-delay-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                borderRadius: 2,
                background: "#E8610A",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.80)",
              }}
            >
              Media &amp; Information Literacy
            </span>
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                borderRadius: 2,
                background: "#E8610A",
              }}
            />
          </div>

          <h1
            className="hero-animate hero-delay-2"
            style={{
              fontFamily: "Georgia,serif",
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              color: "#fff",
              lineHeight: 1.08,
              margin: "0 0 16px",
            }}
          >
            MIL <GradText>Hubs</GradText>
          </h1>

          <p
            className="hero-animate hero-delay-3"
            style={{
              fontSize: "clamp(14px, 1.8vw, 17px)",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.75,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Community-based learning spaces promoting Media &amp; Information
            Literacy across Zambia.
          </p>
        </div>
      </section>

      {/* ══ INTRO ═════════════════════════════════════════════ */}
      <LightSection py={80} id="intro">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Image side */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(201,41,58,0.18)",
              }}
            >
              <img
                src="/images/activity-1.jpg"
                alt="MIL Hubs Activity"
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* Floating second image */}
            <img
              src="/images/activity-2.jpg"
              alt="MIL Hubs Community"
              style={{
                position: "absolute",
                bottom: -32,
                right: -32,
                width: 190,
                height: 126,
                objectFit: "cover",
                borderRadius: 16,
                border: "4px solid #fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            />

            {/* Badge */}
            <div style={{ position: "absolute", top: 18, left: 18 }}>
              <Badge big="13+" small="Active MIL Hubs" />
            </div>
          </div>

          {/* Text side */}
          <div>
            <Pill label="Media & Information Literacy" />
            <h2
              style={{
                fontFamily: "Georgia,serif",
                fontWeight: 900,
                fontSize: "clamp(1.4rem,3vw,2.2rem)",
                lineHeight: 1.2,
                margin: "10px 0 16px",
              }}
            >
              Connecting Communities<br />
              Through <GradText>Knowledge</GradText>
            </h2>
            <p
              style={{
                color: "#6B3A2A",
                fontSize: 15,
                lineHeight: 1.75,
                marginBottom: 14,
              }}
            >
              MIL Hubs provide safe and inclusive spaces where citizens can learn
              about digital literacy, information verification, critical thinking
              and responsible participation in the digital world.
            </p>
            <p style={{ color: "#6B3A2A", fontSize: 15, lineHeight: 1.75 }}>
              Through community-based learning, citizens gain practical skills
              that empower them to engage responsibly with media, access
              information confidently and participate actively in democratic
              processes.
            </p>
          </div>
        </div>
      </LightSection>

      {/* ══ DIVIDER ═══════════════════════════════════════════ */}
      <SectionDivider left="What We Offer" right="Hub Features" />

      {/* ══ HUB FEATURES ══════════════════════════════════════ */}
      <LightSection py={80} id="features">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Text + cards */}
          <div>
            <Pill label="What We Offer" />
            <h2
              style={{
                fontFamily: "Georgia,serif",
                fontWeight: 900,
                fontSize: "clamp(1.4rem,3vw,2.2rem)",
                lineHeight: 1.2,
                margin: "10px 0 14px",
              }}
            >
              Empowering Communities<br />
              Through <GradText>Learning</GradText>
            </h2>
            <p
              style={{
                color: "#6B3A2A",
                fontSize: 15,
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              MIL Hubs provide practical learning opportunities that strengthen
              digital citizenship, media literacy and community participation
              across Zambia.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {features.map((f) => (
                <div
                  key={f.title}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    background: "#fff",
                    borderRadius: 18,
                    padding: 18,
                    border: "1px solid #FFE0C0",
                    boxShadow: "0 2px 12px rgba(201,41,58,0.07)",
                    transition: "box-shadow .2s, transform .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 8px 28px rgba(201,41,58,0.16)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 12px rgba(201,41,58,0.07)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg,#C9293A,#E8610A)",
                      color: "#fff",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "Georgia,serif",
                        fontWeight: 700,
                        fontSize: 15,
                        margin: "0 0 5px",
                        color: "#1A0A00",
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        color: "#6B3A2A",
                        fontSize: 13,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(201,41,58,0.18)",
              }}
            >
              <img
                src="/images/activity-3.jpg"
                alt="MIL Training"
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <img
              src="/images/activity-4.jpg"
              alt="MIL Activity"
              style={{
                position: "absolute",
                bottom: -32,
                left: -32,
                width: 190,
                height: 126,
                objectFit: "cover",
                borderRadius: 16,
                border: "4px solid #fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            />

            <div style={{ position: "absolute", top: 18, right: 18 }}>
              <Badge big="5,000+" small="Citizens Reached" />
            </div>
          </div>
        </div>
      </LightSection>

      {/* ══ DIVIDER ═══════════════════════════════════════════ */}
      <SectionDivider left="Where We Are" right="MIL Hub Provinces" />

      {/* ══ PROVINCES ═════════════════════════════════════════ */}
      <LightSection py={80} center id="provinces">
        <Pill label="Where We Are" />
        <h2
          style={{
            fontFamily: "Georgia,serif",
            fontWeight: 900,
            fontSize: "clamp(1.4rem,3vw,2.2rem)",
            margin: "10px 0 10px",
          }}
        >
          MIL Hub <GradText>Provinces</GradText>
        </h2>
        <p
          style={{
            color: "#6B3A2A",
            fontSize: 15,
            lineHeight: 1.75,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          Our MIL hubs are spread across Zambia, providing communities with
          access to learning, resources and engagement opportunities.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            textAlign: "left",
          }}
        >
          {provinces.map((province, index) => (
            <Link
              key={province.name}
              to={province.path}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "1px solid #FFE0C0",
                  boxShadow: "0 3px 16px rgba(201,41,58,0.08)",
                  transition: "transform .25s, box-shadow .25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-6px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 14px 36px rgba(201,41,58,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 3px 16px rgba(201,41,58,0.08)";
                }}
              >
                {/* Province image */}
                <div
                  style={{
                    position: "relative",
                    height: 200,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`/images/activity-${(index % 4) + 1}.jpg`}
                    alt={province.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform .5s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.transform =
                        "scale(1.08)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.transform =
                        "scale(1)")
                    }
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(10,3,0,0.72) 0%,transparent 55%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 14,
                      left: 16,
                      color: "#fff",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Georgia,serif",
                        fontWeight: 800,
                        fontSize: 18,
                        margin: "0 0 2px",
                      }}
                    >
                      {province.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.62)",
                        margin: 0,
                      }}
                    >
                      Explore local hubs
                    </p>
                  </div>
                </div>

                {/* Province footer */}
                <div
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#A0522D",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        margin: "0 0 2px",
                      }}
                    >
                      MIL Hubs
                    </p>
                    <div
                      style={{
                        fontFamily: "Georgia,serif",
                        fontWeight: 900,
                        fontSize: 28,
                        background:
                          "linear-gradient(135deg,#C9293A,#E8610A)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {province.hubs}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg,rgba(201,41,58,0.10),rgba(232,97,10,0.15))",
                    }}
                  >
                    <MapPin size={18} color="#E8610A" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </LightSection>

{/* ================= Featured Hub ================= */}

<LightSection py={80}>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
      gap: 50,
      alignItems: "center",
    }}
  >

    <div>

      <Pill label="Featured Hub" />

      <h2
        style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(2rem,3vw,3rem)",
          marginBottom: 18,
        }}
      >
        Lusaka
        <GradText> MIL Hub</GradText>
      </h2>

      <p
        style={{
          color:"#6B3A2A",
          lineHeight:1.8,
          marginBottom:20,
        }}
      >
        The Lusaka MIL Hub serves as a centre for
        media literacy training, digital safety,
        fact-checking workshops and youth
        engagement programmes.
      </p>

      <ul
        style={{
          lineHeight:2,
          color:"#6B3A2A",
          marginBottom:30,
        }}
      >
        <li>✔ Community Workshops</li>
        <li>✔ Digital Literacy</li>
        <li>✔ Fact Checking Sessions</li>
        <li>✔ Youth Media Clubs</li>
      </ul>

      <Link
        to="/mil/province/lusaka"
        style={{
          display:"inline-block",
          background:"#C9293A",
          color:"#fff",
          padding:"14px 28px",
          borderRadius:12,
          textDecoration:"none",
          fontWeight:700,
        }}
      >
        Explore Hub
      </Link>

    </div>

    <img
      src="/images/activity-3.jpg"
      alt="Featured Hub"
      style={{
        width:"100%",
        borderRadius:24,
        height:450,
        objectFit:"cover",
      }}
    />

  </div>

</LightSection>

<LightSection py={70} center>

<Pill label="Community Voices"/>

<h2
style={{
fontFamily:"Georgia,serif",
fontWeight:900,
fontSize:"2.5rem",
marginBottom:50,
}}
>

Success Stories

</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:30,
}}
>

<div
style={{
background:"#fff",
padding:30,
borderRadius:22,
boxShadow:"0 10px 25px rgba(0,0,0,.08)",
}}
>

<p
style={{
lineHeight:1.8,
color:"#6B3A2A",
}}
>

"Our community now verifies information before sharing it online."

</p>

<h4 style={{marginTop:20}}>
— Community Member
</h4>

</div>

<div
style={{
background:"#fff",
padding:30,
borderRadius:22,
boxShadow:"0 10px 25px rgba(0,0,0,.08)",
}}
>

<p
style={{
lineHeight:1.8,
color:"#6B3A2A",
}}
>

"MIL training has empowered young people to use digital platforms responsibly."

</p>

<h4 style={{marginTop:20}}>
— Youth Facilitator
</h4>

</div>

</div>

</LightSection>

      {/* ══ DIVIDER ═══════════════════════════════════════════ */}
      <SectionDivider left="Our Reach" right="Impact At A Glance" />

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <BgSection
        overlay="linear-gradient(135deg,rgba(10,3,0,0.87) 0%,rgba(25,7,0,0.83) 100%)"
        py={64}
        center
        id="stats"
      >
        {/* Top colour bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background:
              "linear-gradient(90deg,#C9293A,#E8610A,#F5A623,#E8610A,#C9293A)",
            zIndex: 2,
          }}
        />

        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.38)",
            marginBottom: 8,
          }}
        >
          Our Reach
        </p>
        <h2
          style={{
            fontFamily: "Georgia,serif",
            fontWeight: 900,
            fontSize: "clamp(1.4rem,3.5vw,2.4rem)",
            color: "#fff",
            margin: "0 0 36px",
          }}
        >
          Impact <GradText>At A Glance</GradText>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 16,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                borderRadius: 18,
                padding: "24px 12px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.11)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia,serif",
                  fontWeight: 900,
                  fontSize: "clamp(1.8rem,3.5vw,2.5rem)",
                  background: "linear-gradient(120deg,#F5A623,#E8610A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.num}
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.50)",
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </BgSection>

      <BgSection center py={100}>

<Pill
label="Join the Network"
light
/>

<h2
style={{
fontFamily:"Georgia,serif",
fontWeight:900,
fontSize:"3rem",
color:"#fff",
marginBottom:25,
}}
>

Start an
<GradText>
 MIL Hub
</GradText>

in Your Community

</h2>

<p
style={{
maxWidth:650,
margin:"0 auto",
color:"rgba(255,255,255,.75)",
lineHeight:1.8,
marginBottom:40,
}}
>

Partner with FPI Zambia to establish a Media & Information Literacy Hub that empowers your community with digital literacy, responsible media use and access to reliable information.

</p>

<Link
to="/contact"
style={{
background:"#C9293A",
color:"#fff",
padding:"18px 40px",
borderRadius:14,
fontWeight:700,
textDecoration:"none",
}}
>

Become a Partner

</Link>

</BgSection>

    </div>
  );
};

export default Hubs;