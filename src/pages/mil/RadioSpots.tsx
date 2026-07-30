import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Radio,
  Play,
  Download,
  Calendar,
  Clock3,
  ArrowRight,
  Headphones,
  Mic2,
  Users,
  Shield,
} from "lucide-react";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

// Works out how a given link should be played:
//  - "audio"  -> a real audio file or uploaded file, use the <audio> player
//  - "embed"  -> a YouTube / Facebook / other page link, show an iframe
function resolveMedia(raw: string): { kind: "audio" | "embed"; src: string } {
  const url = raw.trim();

  // YouTube (watch, youtu.be, shorts)
  const yt =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (yt) {
    return { kind: "embed", src: `https://www.youtube.com/embed/${yt[1]}` };
  }

  // Facebook video/post
  if (/facebook\.com|fb\.watch/.test(url)) {
    return {
      kind: "embed",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
    };
  }

  // SoundCloud page link
  if (/soundcloud\.com/.test(url)) {
    return {
      kind: "embed",
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23e8610a`,
    };
  }

  // Direct audio file (uploaded or a real .mp3/.m4a/.wav link)
  return { kind: "audio", src: url.startsWith("http") ? url : getAssetUrl(url) };
}

interface RadioSpot {
  id: number;
  title: string;
  description: string;
  station: string;
  duration: string;
  image?: string;
  audioUrl?: string;
  published: boolean;
  featured: boolean;
  broadcastAt?: string;
}

export default function RadioSpots() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("All");
  const [spots, setSpots] = useState<RadioSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/radio-spots`)
      .then((res) => res.json())
      .then((data: RadioSpot[]) => {
        setSpots(data.filter((s) => s.published));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(
      spots
        .filter((s) => s.broadcastAt)
        .map((s) => new Date(s.broadcastAt as string).getFullYear().toString())
    );
    return Array.from(years).sort().reverse();
  }, [spots]);

  const filtered = useMemo(() => {
    return spots.filter((spot) => {
      const spotYear = spot.broadcastAt
        ? new Date(spot.broadcastAt).getFullYear().toString()
        : "";
      const matchYear = year === "All" || spotYear === year;
      const matchSearch =
        spot.title.toLowerCase().includes(search.toLowerCase()) ||
        spot.station.toLowerCase().includes(search.toLowerCase());
      return matchYear && matchSearch;
    });
  }, [search, year, spots]);

  const [selectedSpot, setSelectedSpot] = useState<RadioSpot | null>(null);

  const scrollToEpisodes = () => {
    document.getElementById("episodes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#F8F6F3", minHeight: "100vh" }}>
      {/* =============== HERO - WITH STATIC RADIO BACKGROUND =============== */}
      <section
        style={{
          // ⬇️ STATIC BACKGROUND IMAGE (Radio Studio Theme)
          // Replace the URL with your own image path
          backgroundImage: `linear-gradient(rgba(11, 26, 46, 0.82), rgba(26, 42, 64, 0.90)), url('https://images.unsplash.com/photo-1590602847861-fc75b43c0b9a?w=1200')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed", // 'fixed' = static/parallax effect. Use 'scroll' if you want it to move with the page.
          color: "#fff",
          padding: "80px 24px 70px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements (adds to the radio wave vibe) */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(201, 41, 58, 0.15)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(232, 97, 10, 0.1)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 50,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left content */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(201, 41, 58, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Radio size={20} color="#E8610A" />
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                FPI Zambia
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.8rem, 7vw, 4.2rem)",
                fontWeight: 900,
                fontFamily: "Georgia, serif",
                lineHeight: 1.05,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Radio Spots
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.75)",
                maxWidth: 520,
                marginBottom: 32,
              }}
            >
              Explore educational radio programmes developed by FPI Zambia to
              promote critical thinking, digital literacy and responsible media
              participation.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={scrollToEpisodes}
                style={{
                  padding: "14px 34px",
                  background: "#C9293A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 50,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#A8232E";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C9293A";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Latest Broadcast
                <ArrowRight size={18} />
              </button>

              <button
                style={{
                  padding: "14px 34px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 50,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                About MIL
              </button>
            </div>
          </div>

          {/* Right - Stats cards with glass effect */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {spots.length}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                Episodes
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                6
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                Partners
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                4
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                Topics
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                2026
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                Current
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave transition */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background: "#F8F6F3",
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          }}
        />
      </section>

      {/* =============== SEARCH & EPISODES =============== */}
      <section
        id="episodes"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 24px 80px",
        }}
      >
        {/* Search & filter row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 40,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: 260,
              maxWidth: 460,
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
              }}
            />
            <input
              placeholder="Search programmes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 20px 14px 46px",
                borderRadius: 12,
                border: "1px solid #E8E3DC",
                fontSize: "0.95rem",
                background: "#fff",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#C9293A";
                e.target.style.boxShadow = "0 0 0 3px rgba(201,41,58,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E8E3DC";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#999" }}>Year:</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                border: "1px solid #E8E3DC",
                background: "#fff",
                fontSize: "0.95rem",
                cursor: "pointer",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C9293A")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E3DC")}
            >
              <option>All</option>
              {availableYears.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Header with count */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 900,
              fontFamily: "Georgia, serif",
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            Latest Episodes
          </h2>
          <span style={{ fontSize: "0.9rem", color: "#999" }}>
            {filtered.length} programme{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
          }}
        >
          {filtered.map((spot) => (
            <div
              key={spot.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                border: "1px solid #EEEAE4",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 48px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#D5CFC6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#EEEAE4";
              }}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={spot.image || "/images/activity-1.jpg"}
                  alt={spot.title}
                  style={{
                    width: "100%",
                    height: 240,
                    objectFit: "cover",
                    transition: "transform 0.5s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "20px 24px 16px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Radio size={14} />
                    {spot.station}
                  </div>
                </div>
                {/* Year badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    padding: "4px 14px",
                    borderRadius: 50,
                    fontSize: "0.7rem",
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  {spot.broadcastAt ? new Date(spot.broadcastAt).getFullYear() : ""}
                </div>
              </div>

              <div style={{ padding: "22px 24px 26px" }}>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontFamily: "Georgia, serif",
                    color: "#1A1A1A",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {spot.title}
                </h3>

                <p
                  style={{
                    color: "#777",
                    lineHeight: 1.7,
                    marginBottom: 18,
                    fontSize: "0.92rem",
                  }}
                >
                  {spot.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    color: "#999",
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: "1px solid #F0EDE8",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={14} />
                    {spot.broadcastAt
                      ? new Date(spot.broadcastAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock3 size={14} />
                    {spot.duration}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setSelectedSpot(spot)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      background: "#C9293A",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#A8232E")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#C9293A")
                    }
                  >
                    <Play size={16} />
                    Listen
                  </button>

                  <button
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      background: "#F0EDE8",
                      color: "#1A1A1A",
                      border: "none",
                      borderRadius: 10,
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#E5E0D8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#F0EDE8")
                    }
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#999",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>📻</div>
            <h3 style={{ fontSize: "1.3rem", color: "#1A1A1A", marginBottom: 6 }}>
              No programmes found
            </h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}
      </section>

      {/* =============== PARTNERS =============== */}
      <section
        style={{
          background: "#fff",
          padding: "70px 24px",
          borderTop: "1px solid #EEEAE4",
          borderBottom: "1px solid #EEEAE4",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(201,41,58,0.06)",
                padding: "6px 18px 6px 14px",
                borderRadius: 50,
                marginBottom: 14,
              }}
            >
              <Mic2 size={16} color="#C9293A" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#C9293A",
                  letterSpacing: "1px",
                }}
              >
                PARTNERS
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontFamily: "Georgia, serif",
                fontWeight: 900,
                color: "#1A1A1A",
                marginBottom: 10,
              }}
            >
              Our Broadcast Partners
            </h2>
            <p
              style={{
                maxWidth: 560,
                margin: "0 auto",
                color: "#777",
                lineHeight: 1.7,
                fontSize: "1rem",
              }}
            >
              FPI Zambia works with community and national radio stations across
              Zambia to spread Media & Information Literacy.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
            }}
          >
            {[
              "ZNBC Radio 2",
              "Radio Phoenix",
              "Hot FM",
              "Breeze FM",
              "Flava FM",
              "Pan Africa Radio",
            ].map((station) => (
              <div
                key={station}
                style={{
                  background: "#F8F6F3",
                  borderRadius: 14,
                  padding: "24px 16px",
                  textAlign: "center",
                  border: "1px solid #EEEAE4",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F0EDE8";
                  e.currentTarget.style.borderColor = "#D5CFC6";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#F8F6F3";
                  e.currentTarget.style.borderColor = "#EEEAE4";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Radio
                  size={24}
                  color="#C9293A"
                  style={{ marginBottom: 10, opacity: 0.6 }}
                />
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  {station}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============== WHY RADIO =============== */}
      <section style={{ padding: "70px 24px", background: "#F8F6F3" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(232,97,10,0.06)",
                padding: "6px 18px 6px 14px",
                borderRadius: 50,
                marginBottom: 14,
              }}
            >
              <Headphones size={16} color="#E8610A" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#E8610A",
                  letterSpacing: "1px",
                }}
              >
                WHY RADIO
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontFamily: "Georgia, serif",
                fontWeight: 900,
                color: "#1A1A1A",
                marginBottom: 10,
              }}
            >
              Why Radio Matters
            </h2>
            <p
              style={{
                maxWidth: 560,
                margin: "0 auto",
                color: "#777",
                lineHeight: 1.7,
                fontSize: "1rem",
              }}
            >
              Radio remains one of the most powerful tools for education and
              awareness in Zambia.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 22,
            }}
          >
            {[
              {
                icon: Users,
                title: "Community Awareness",
                text: "Delivering trusted information to communities across Zambia.",
                color: "#C9293A",
              },
              {
                icon: Shield,
                title: "Digital Literacy",
                text: "Helping citizens safely navigate today's digital world.",
                color: "#0B2C57",
              },
              {
                icon: Search,
                title: "Fact Checking",
                text: "Encouraging people to verify information before sharing.",
                color: "#E8610A",
              },
              {
                icon: Radio,
                title: "Media Freedom",
                text: "Supporting responsible journalism and informed public dialogue.",
                color: "#C9293A",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "28px 24px",
                    border: "1px solid #EEEAE4",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = "#D5CFC6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#EEEAE4";
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `${item.color}12`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={20} color={item.color} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "1.15rem",
                      marginBottom: 8,
                      color: "#1A1A1A",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "#777",
                      lineHeight: 1.7,
                      fontSize: "0.92rem",
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =============== CTA =============== */}
      <section
        style={{
          background: "linear-gradient(145deg, #0B1A2E, #1A2A40)",
          color: "#fff",
          padding: "70px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontFamily: "Georgia, serif",
              fontWeight: 900,
              marginBottom: 14,
            }}
          >
            Partner With FPI Zambia
          </h2>

          <p
            style={{
              maxWidth: 540,
              margin: "0 auto 36px",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.65)",
              fontSize: "1.05rem",
            }}
          >
            Are you a community radio station or media organisation interested in
            promoting Media & Information Literacy? We'd love to collaborate.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                padding: "14px 40px",
                background: "#C9293A",
                color: "#fff",
                border: "none",
                borderRadius: 50,
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#A8232E";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C9293A";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Contact Us
            </button>

            <button
              style={{
                padding: "14px 40px",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 50,
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* =============== MODAL =============== */}
      {selectedSpot && (
        <div
          onClick={() => setSelectedSpot(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 20,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              maxWidth: 560,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.25s ease",
            }}
          >
            <img
              src={selectedSpot.image || "/images/activity-1.jpg"}
              alt={selectedSpot.title}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "26px 30px 30px" }}>
              <span
                style={{
                  background: "#C9293A",
                  color: "#fff",
                  padding: "3px 14px",
                  borderRadius: 50,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Radio Spot
              </span>

              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  marginTop: 14,
                  marginBottom: 6,
                  color: "#1A1A1A",
                }}
              >
                {selectedSpot.title}
              </h2>

              <p
                style={{
                  color: "#777",
                  lineHeight: 1.8,
                  marginBottom: 18,
                  fontSize: "0.95rem",
                }}
              >
                {selectedSpot.description}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  marginBottom: 22,
                  padding: "12px 18px",
                  background: "#F8F6F3",
                  borderRadius: 10,
                  fontSize: "0.85rem",
                  color: "#666",
                }}
              >
                <span>📻 {selectedSpot.station}</span>
                <span>
                  📅{" "}
                  {selectedSpot.broadcastAt
                    ? new Date(selectedSpot.broadcastAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
                <span>🕒 {selectedSpot.duration}</span>
              </div>

              {selectedSpot.audioUrl ? (
                (() => {
                  const media = resolveMedia(selectedSpot.audioUrl);
                  if (media.kind === "embed") {
                    return (
                      <div
                        style={{
                          marginBottom: 22,
                          position: "relative",
                          width: "100%",
                          paddingTop: "56.25%",
                          borderRadius: 10,
                          overflow: "hidden",
                          background: "#000",
                        }}
                      >
                        <iframe
                          title={selectedSpot.title}
                          src={media.src}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      </div>
                    );
                  }
                  return (
                    <div style={{ marginBottom: 22 }}>
                      <audio controls src={media.src} style={{ width: "100%" }} />
                    </div>
                  );
                })()
              ) : (
                <div
                  style={{
                    background: "#FFF6EF",
                    borderLeft: "4px solid #E8610A",
                    padding: "14px 18px",
                    borderRadius: 8,
                    marginBottom: 22,
                  }}
                >
                  <strong style={{ fontSize: "0.85rem" }}>
                    🎙 Audio Coming Soon
                  </strong>
                  <p
                    style={{
                      marginTop: 4,
                      color: "#777",
                      fontSize: "0.88rem",
                      marginBottom: 0,
                    }}
                  >
                    This programme is being prepared for publication.
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedSpot(null)}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  background: "#C9293A",
                  color: "#fff",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#A8232E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#C9293A")
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}
      </style>
    </div>
  );
}