import { useEffect, useState } from "react";
import {
  Eye, FileText, BookOpen, Users,
  ShieldCheck, Globe, Search, X,
} from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import DocumentPreviewModal from "../../components/DocumentPreviewModal";

// Helper components
const Pill = ({ label }: { label: string }) => (
  <span style={{
    display: "inline-block",
    background: "rgba(232,97,10,0.15)",
    color: "#E8610A",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "5px 14px",
    borderRadius: 999,
    border: "1px solid rgba(232,97,10,0.25)"
  }}>
    {label}
  </span>
);

const GradText = ({ children, size = "inherit" }: { children: React.ReactNode; size?: string }) => (
  <span style={{
    background: "linear-gradient(120deg,#F5A623,#E8610A)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: size,
  }}>
    {children}
  </span>
);

const LightSection = ({ children, py = 80, center = false }: { children: React.ReactNode; py?: number; center?: boolean }) => (
  <section style={{
    padding: `clamp(48px, ${py / 14}vw, ${py}px) 24px`,
    background: "#FDF8F5",
    textAlign: center ? "center" : "left",
  }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {children}
    </div>
  </section>
);

const BG = "/images/broc.jpg";

// SIMPLIFIED BgSection - Fixed background image, or a plain gradient panel
// when `photo` is false (used to break up sections that would otherwise all
// repeat the same hero photograph as you scroll down the page).
const BgSection = ({
  children,
  overlay = "rgba(10,4,0,0.72)",
  py = 80,
  center = false,
  id = "",
  className = "",
  photo = true,
}: {
  children: React.ReactNode;
  overlay?: string;
  py?: number;
  center?: boolean;
  id?: string;
  className?: string;
  photo?: boolean;
}) => (
  <section
    id={id}
    className={className}
    style={{
      position: "relative",
      padding: `clamp(48px, ${py / 14}vw, ${py}px) 24px`,
      textAlign: center ? "center" : "left",
      overflow: "hidden",
      minHeight: 340,
      display: "flex",
      alignItems: "center",
      width: "100%",
      background: photo ? "#080C1A" : overlay,
    }}
  >
    {photo && (
      <>
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: overlay,
            zIndex: 1,
          }}
        />
      </>
    )}

    <div
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  </section>
);

const Brochure = () => {
  const [brochures, setBrochures] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);
  const [previewContent, setPreviewContent] = useState<{ title: string; description?: string; image?: string; kind?: string } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/brochures`)
      .then((res) => res.json())
      .then((data: any[]) => setBrochures(data.filter((b) => b.published)))
      .catch((err) => console.error(err));

    fetch(`${API_BASE_URL}/publications`)
      .then((res) => res.json())
      .then((data: any[]) => setPublications(data.filter((p) => p.published)))
      .catch((err) => console.error(err));
  }, []);

  // Combined downloadable items for the featured section
  const featuredItems = [
    ...brochures.map((b) => ({
      title: b.title,
      description: b.description,
      image: b.thumbnail ? getAssetUrl(b.thumbnail) : "/images/brochure.jpg",
      file: getAssetUrl(b.fileUrl),
      kind: "Brochure",
    })),
    ...publications.map((p) => ({
      title: p.title,
      description: p.description,
      image: p.image ? getAssetUrl(p.image) : "/images/brochure.jpg",
      file: getAssetUrl(p.fileUrl),
      kind: "Publication",
    })),
  ];

  const primaryBrochure = brochures[0];
  const brochureUrl = primaryBrochure ? getAssetUrl(primaryBrochure.fileUrl) : "";

  const topics = [
    "Fact Checking", "Digital Citizenship", "Online Safety", "Critical Thinking",
    "Responsible Media Use", "Combating Misinformation", "Information Verification", "Media Awareness",
  ];

  const stats = [
    { value: "500+", label: "Learners Reached" },
    { value: "100+", label: "Workshops Conducted" },
    { value: "25+", label: "Schools Engaged" },
    { value: "10+", label: "Districts Reached" },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>

      {/* ══ HERO — RESOURCES FORMAT (FULL SCREEN + FIXED) ═══════ */}
      <div className="brochure-hero-fixed">
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "clamp(56px, 8vw, 90px) 24px",
            background: "#080C1A",
          }}
        >
          {/* Background image – fixed */}
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
          {/* Black tint + directional gradient */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.40)" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 45%, rgba(0,0,0,0.15) 100%)",
            }}
          />
          {/* Glow circles */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "rgba(201,41,58,0.20)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "rgba(201,168,76,0.15)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
          {/* Top colour bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg,#C9293A,#E8610A,#F5A623,#E8610A,#C9293A)",
              zIndex: 3,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 1200,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              {/* Eyebrow */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ display: "block", width: 24, height: 2, background: "#E8610A", borderRadius: 999 }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Media &amp; Information Literacy
                </span>
                <span style={{ display: "block", width: 24, height: 2, background: "#E8610A", borderRadius: 999 }} />
              </div>

              <h1
                style={{
                  fontFamily: "Georgia,serif",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  fontSize: "clamp(2.4rem,6vw,4.5rem)",
                  color: "#fff",
                  marginBottom: 16,
                }}
              >
                MIL <GradText size="inherit">Brochure</GradText>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "clamp(14px,1.8vw,18px)",
                  lineHeight: 1.7,
                  maxWidth: 620,
                  marginBottom: 32,
                }}
              >
                Discover FPI Zambia's Media and Information Literacy initiatives, educational
                resources, community programs and opportunities that help citizens navigate
                today's information landscape responsibly.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <button
                  type="button"
                  disabled={!brochureUrl}
                  onClick={() => brochureUrl && setPreviewDoc({ url: brochureUrl, title: "MIL Brochure" })}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(135deg,#C9293A,#E8610A)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 999,
                    boxShadow: "0 10px 24px rgba(201,41,58,0.35)",
                    cursor: brochureUrl ? "pointer" : "not-allowed",
                    opacity: brochureUrl ? 1 : 0.6,
                  }}
                >
                  <Eye size={16} /> View Brochure
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══ OVERVIEW ══════════════════════════════════════════════ */}
      <LightSection py={80}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 48,
          alignItems: "center"
        }}>
          {/* Text */}
          <div>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#C9293A,#E8610A)"
            }}>
              <FileText size={24} color="#fff" />
            </div>

            <Pill label="About the Brochure" />
            <h2 style={{
              fontFamily: "Georgia,serif",
              fontWeight: 900,
              fontSize: "clamp(1.4rem,3vw,2.2rem)",
              lineHeight: 1.15,
              color: "#1A0A00",
              margin: "8px 0 14px"
            }}>
              Media &amp; Information<br />Literacy Guide
            </h2>
            <p style={{
              color: "#6B3A2A",
              fontSize: 15,
              lineHeight: 1.75,
              marginBottom: 12
            }}>
              This brochure introduces our MIL programs, educational campaigns, learning
              resources and community engagement initiatives.
            </p>
            <p style={{
              color: "#6B3A2A",
              fontSize: 15,
              lineHeight: 1.75,
              marginBottom: 28
            }}>
              It serves as a practical guide for individuals, schools, journalists, community
              leaders and institutions seeking to strengthen their ability to access, evaluate
              and use information responsibly.
            </p>
            <button
              type="button"
              disabled={!brochureUrl}
              onClick={() => brochureUrl && setPreviewDoc({ url: brochureUrl, title: "MIL Brochure" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg,#C9293A,#E8610A)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                padding: "11px 24px",
                borderRadius: 999,
                border: "none",
                cursor: brochureUrl ? "pointer" : "not-allowed",
                opacity: brochureUrl ? 1 : 0.6,
                boxShadow: "0 4px 16px rgba(201,41,58,0.3)"
              }}
            >
              <Eye size={15} /> View Brochure
            </button>
          </div>

          {/* Mockup card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%",
              maxWidth: 300,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(201,41,58,0.25)",
              transform: "rotate(-3deg)",
              transition: "transform 0.4s ease",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "rotate(0deg)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "rotate(-3deg)"}
            >
              {/* Card header */}
              <div style={{
                background: "linear-gradient(135deg,#C9293A,#E8610A)",
                padding: "32px 28px",
                color: "#fff"
              }}>
                <p style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: 12
                }}>FPI Zambia</p>
                <h3 style={{
                  fontFamily: "Georgia,serif",
                  fontWeight: 900,
                  fontSize: 28,
                  lineHeight: 1.15,
                  margin: 0
                }}>
                  Media &<br />Information<br />Literacy
                </h3>
              </div>
              {/* Card body */}
              <div style={{
                background: "#fff",
                padding: "28px",
                textAlign: "center"
              }}>
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg,rgba(201,41,58,0.1),rgba(232,97,10,0.12))"
                }}>
                  <BookOpen size={32} color="#E8610A" />
                </div>
                <p style={{
                  color: "#6B3A2A",
                  fontSize: 13,
                  lineHeight: 1.65
                }}>
                  Building informed, critical and resilient communities through media literacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </LightSection>

      {/* ═════════════ FEATURED PUBLICATIONS ═════════════ */}
      <LightSection py={90} center>
        <Pill label="Featured Publications" />

        <h2 style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(2rem,4vw,3rem)",
          color: "#1A0A00",
          marginBottom: 20,
        }}>
          Explore Our Publications
        </h2>

        <p style={{
          maxWidth: 700,
          margin: "0 auto 60px",
          color: "#6B3A2A",
          lineHeight: 1.8,
        }}>
          Browse our collection of Media & Information Literacy
          publications, guides and educational resources developed
          to empower communities across Zambia.
        </p>

        {featuredItems.length === 0 ? (
          <p style={{
            maxWidth: 600,
            margin: "0 auto",
            color: "#6B3A2A",
            fontStyle: "italic"
          }}>
            Our publications and brochures will be available for download here soon.
            Please check back shortly.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 30,
          }}>
            {featuredItems.map((doc, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  overflow: "hidden",
                  boxShadow: "0 12px 35px rgba(0,0,0,.08)",
                  transition: ".35s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={doc.image}
                    alt={doc.title}
                    style={{
                      width: "100%",
                      height: 300,
                      objectFit: "cover",
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(201,41,58,0.92)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}>
                    {doc.kind}
                  </span>
                </div>

                <div style={{ padding: 25 }}>
                  <h3 style={{
                    fontFamily: "Georgia,serif",
                    fontWeight: 700,
                    marginBottom: 12,
                  }}>
                    {doc.title}
                  </h3>

                  <p style={{
                    color: "#6B3A2A",
                    fontSize: 14,
                    lineHeight: 1.7,
                    marginBottom: 22,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {doc.description ||
                      "Download this publication and explore practical Media & Information Literacy resources."}
                  </p>

                  <div style={{
                    display: "flex",
                    gap: 10,
                  }}>
                    <button
                      type="button"
                      disabled={!doc.file && !doc.description}
                      onClick={() =>
                        doc.file
                          ? setPreviewDoc({ url: doc.file, title: doc.title })
                          : doc.description &&
                            setPreviewContent({ title: doc.title, description: doc.description, image: doc.image, kind: doc.kind })
                      }
                      style={{
                        flex: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "12px",
                        background: "#E8610A",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: 700,
                        cursor: doc.file || doc.description ? "pointer" : "not-allowed",
                        opacity: doc.file || doc.description ? 1 : 0.5,
                      }}
                    >
                      <Eye size={15} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {featuredItems.length > 3 && (
          <div style={{ maxWidth: 800, margin: "60px auto 0", textAlign: "left" }}>
            <h3 style={{
              fontFamily: "Georgia,serif",
              fontWeight: 800,
              fontSize: 22,
              color: "#1A0A00",
              marginBottom: 20,
              textAlign: "center"
            }}>
              All Available Downloads
            </h3>
            <div style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0,0,0,.06)"
            }}>
              {featuredItems.map((doc, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={!doc.file && !doc.description}
                  onClick={() =>
                    doc.file
                      ? setPreviewDoc({ url: doc.file, title: doc.title })
                      : doc.description &&
                        setPreviewContent({ title: doc.title, description: doc.description, image: doc.image, kind: doc.kind })
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 22px",
                    borderBottom: i < featuredItems.length - 1 ? "1px solid #F1E9E4" : "none",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    color: "inherit",
                    cursor: doc.file || doc.description ? "pointer" : "not-allowed",
                    opacity: doc.file || doc.description ? 1 : 0.5,
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#FEF0E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <FileText size={18} color="#E8610A" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600,
                      fontSize: 15,
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>{doc.title}</p>
                    <span style={{ fontSize: 12, color: "#9A6B58" }}>{doc.kind}</span>
                  </div>
                  <span style={{ color: "#C9293A", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>View →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </LightSection>

      {/* ══ STATS ═════════════════════════════════════════════════ */}
      <BgSection
        overlay="linear-gradient(135deg,rgba(12,4,0,0.86) 0%,rgba(25,7,0,0.82) 100%)"
        py={64}
        center
      >
        <p style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 10
        }}>Our Impact</p>
        <h2 style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(1.5rem,3.5vw,2.5rem)",
          color: "#fff",
          margin: "0 0 40px"
        }}>
          FPI Zambia <GradText size="inherit">by the Numbers</GradText>
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              borderRadius: 20,
              padding: "28px 16px",
              textAlign: "center",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)"
            }}>
              <div style={{
                fontFamily: "Georgia,serif",
                fontWeight: 900,
                fontSize: "clamp(2rem,4vw,2.8rem)",
                background: "linear-gradient(120deg,#F5A623,#E8610A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>{s.value}</div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 6 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </BgSection>

      {/* ══ WHAT'S INSIDE ═════════════════════════════════════════ */}
      <LightSection py={80} center>
        <Pill label="Explore the Brochure" />
        <h2 style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(1.5rem,3.5vw,2.5rem)",
          color: "#1A0A00",
          margin: "8px 0 40px"
        }}>
          What's Inside?
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
          textAlign: "left"
        }}>
          {[
            { Icon: BookOpen, title: "Educational Resources", desc: "Access learning materials, guides and tools designed to strengthen media literacy skills." },
            { Icon: Users, title: "Community Programs", desc: "Learn about outreach activities, workshops, campaigns and public awareness initiatives." },
            { Icon: FileText, title: "Opportunities", desc: "Discover ways to collaborate, participate and support media literacy initiatives." },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} style={{
              borderRadius: 20,
              padding: 24,
              background: "linear-gradient(135deg,#FFF8F0,#FFF0E0)",
              border: "1px solid #FFE0C0",
              boxShadow: "0 3px 16px rgba(201,41,58,0.07)",
              transition: "transform .22s, box-shadow .22s"
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(201,41,58,0.16)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 3px 16px rgba(201,41,58,0.07)";
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 13,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#C9293A,#E8610A)"
              }}>
                <Icon size={22} color="#fff" />
              </div>
              <h3 style={{
                fontFamily: "Georgia,serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#1A0A00",
                margin: "0 0 8px"
              }}>{title}</h3>
              <p style={{ color: "#6B3A2A", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </LightSection>

      {/* ═════════════ TARGET AUDIENCE ═════════════ */}
      <LightSection py={80} center>
        <Pill label="Who Should Read It?" />

        <h2 style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(2rem,4vw,3rem)",
          marginBottom: 50,
        }}>
          Designed For Everyone
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 25,
        }}>
          {[
            {
              emoji: "🎓",
              title: "Students",
              text: "Learn critical thinking and responsible digital participation.",
            },
            {
              emoji: "📰",
              title: "Journalists",
              text: "Strengthen ethical reporting and fact-checking skills.",
            },
            {
              emoji: "🏫",
              title: "Schools",
              text: "Support Media & Information Literacy in classrooms.",
            },
            {
              emoji: "👨‍👩‍👧‍👦",
              title: "Communities",
              text: "Empower citizens to identify misinformation.",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                padding: 35,
                borderRadius: 24,
                boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              }}
            >
              <div style={{
                fontSize: 48,
                marginBottom: 18,
              }}>
                {item.emoji}
              </div>

              <h3 style={{
                fontFamily: "Georgia,serif",
                marginBottom: 12,
              }}>
                {item.title}
              </h3>

              <p style={{
                lineHeight: 1.8,
                color: "#6B3A2A",
              }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </LightSection>

      {/* ══ FEATURED TOPICS ═══════════════════════════════════════ */}
      <BgSection
        photo={false}
        overlay="linear-gradient(160deg,#0A0300 0%,#3A0D14 50%,#0A0300 100%)"
        py={80}
        center
      >
        <Pill label="Key Learning Areas" />
        <h2 style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(1.5rem,3.5vw,2.5rem)",
          color: "#fff",
          margin: "8px 0 32px"
        }}>
          Featured Topics
        </h2>

        {/* Topic pills */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          marginBottom: 48
        }}>
          {topics.map((t, i) => (
            <span key={i} style={{
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(232,97,10,0.18)",
              color: "#F5A623",
              border: "1px solid rgba(232,97,10,0.35)"
            }}>{t}</span>
          ))}
        </div>

        {/* Feature cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
          gap: 16,
          textAlign: "left"
        }}>
          {[
            { Icon: Search, title: "Fact Checking", desc: "Learn practical methods for verifying information and identifying misleading content." },
            { Icon: ShieldCheck, title: "Online Safety", desc: "Understand digital security, privacy and safe participation in online spaces." },
            { Icon: Globe, title: "Digital Citizenship", desc: "Develop responsible and ethical behaviours in the digital environment." },
          ].map(({ Icon, title, desc }, i) => (
            <div key={i} style={{
              borderRadius: 20,
              padding: 24,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              transition: "transform .22s, background .22s"
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(232,97,10,0.18)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)";
              }}
            >
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#C9293A,#E8610A)"
              }}>
                <Icon size={20} color="#fff" />
              </div>
              <h3 style={{
                fontFamily: "Georgia,serif",
                fontWeight: 700,
                fontSize: 16,
                color: "#fff",
                margin: "0 0 8px"
              }}>{title}</h3>
              <p style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 13,
                lineHeight: 1.7,
                margin: 0
              }}>{desc}</p>
            </div>
          ))}
        </div>
      </BgSection>

      {/* ═════════════ FINAL CTA ═════════════ */}
      <BgSection
        photo={false}
        overlay="linear-gradient(135deg,#1A0500 0%,#C9293A 100%)"
        py={110}
        center
      >
        <Pill label="Get Started" />

        <h2 style={{
          fontFamily: "Georgia,serif",
          fontWeight: 900,
          fontSize: "clamp(2rem,5vw,4rem)",
          color: "#fff",
          marginBottom: 20,
        }}>
          Ready to Strengthen
          <br />
          <GradText size="inherit">
            Media Literacy?
          </GradText>
        </h2>

        <p style={{
          maxWidth: 700,
          margin: "0 auto 40px",
          color: "rgba(255,255,255,.75)",
          lineHeight: 1.8,
        }}>
          Download the official FPI Zambia Media &
          Information Literacy Brochure and discover
          practical tools, educational resources and
          community programmes promoting informed
          citizenship.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
        }}>
          <button
            type="button"
            disabled={!brochureUrl}
            onClick={() => brochureUrl && setPreviewDoc({ url: brochureUrl, title: "MIL Brochure" })}
            style={{
              background: "#C9293A",
              padding: "16px 34px",
              borderRadius: 12,
              border: "none",
              fontWeight: 700,
              color: "#fff",
              cursor: brochureUrl ? "pointer" : "not-allowed",
              opacity: brochureUrl ? 1 : 0.6,
            }}
          >
            View Brochure
          </button>

          <a
            href="/mil/about"
            style={{
              border: "1px solid rgba(255,255,255,.3)",
              padding: "16px 34px",
              borderRadius: 12,
              textDecoration: "none",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Explore MIL
          </a>
        </div>
      </BgSection>

      {/* Hero‑only styles: full viewport & fixed background */}
      <style>{`
        .brochure-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .brochure-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>

      {previewDoc && (
        <DocumentPreviewModal
          fileUrl={previewDoc.url}
          title={previewDoc.title}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {previewContent && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewContent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {previewContent.image && (
              <img
                src={previewContent.image}
                alt={previewContent.title}
                className="w-full h-56 object-cover rounded-t-2xl"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  {previewContent.kind && (
                    <span className="text-[#C9293A] text-xs font-bold uppercase tracking-wide">
                      {previewContent.kind}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl font-black mt-1">{previewContent.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewContent(null)}
                  className="shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {previewContent.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brochure;