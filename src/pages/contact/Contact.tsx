import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { API_BASE_URL } from "../../services/config";
import WhatsAppButton from "../../components/WhatsAppButton";

const FacebookIcon = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" width={p.size || 19} height={p.size || 19}><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>);
const TwitterIcon = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" width={p.size || 19} height={p.size || 19}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const InstagramIcon = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" width={p.size || 19} height={p.size || 19}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.36 2.67.95 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.12-1.38.66-.66 1.07-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.12-.66-.66-1.33-1.07-2.12-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>);
const YoutubeIcon = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" width={p.size || 19} height={p.size || 19}><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>);
const LinkedinIcon = (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" width={p.size || 19} height={p.size || 19}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z"/></svg>);

interface Settings {
  email?: string; phone?: string; address?: string;
  facebook?: string; twitter?: string; instagram?: string;
  youtube?: string; linkedin?: string;
}

// ─── Operating Hours helper ──────────────────────────────────────
const getOperatingStatus = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  // Working hours: Monday–Friday, 8:00 AM – 5:00 PM (480 – 1020 minutes)
  const OPEN = 480;   // 8:00 AM
  const CLOSE = 1020; // 5:00 PM

  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && currentMinutes >= OPEN && currentMinutes < CLOSE;

  return {
    isOpen,
    day,
    currentMinutes,
    statusText: isOpen ? "Open" : "Closed",
    statusColor: isOpen ? "text-green-500" : "text-red-500",
    bgColor: isOpen ? "bg-green-500" : "bg-red-500",
    hoursDisplay: "Mon–Fri, 8:00 AM – 5:00 PM",
  };
};

const Contact = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(getOperatingStatus());

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data || {}))
      .catch((err) => console.error(err));
  }, []);

  // Update operating status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getOperatingStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    try {
      setSending(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const socials = [
    { url: settings.facebook, Icon: FacebookIcon, label: "Facebook" },
    { url: settings.twitter, Icon: TwitterIcon, label: "Twitter / X" },
    { url: settings.instagram, Icon: InstagramIcon, label: "Instagram" },
    { url: settings.youtube, Icon: YoutubeIcon, label: "YouTube" },
    { url: settings.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
  ].filter((s) => s.url);

  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9293A] focus:border-[#C9293A] transition";

  return (
    <>
      {/* ══ HERO – full viewport with fixed background ══ */}
      <div className="contact-hero-fixed">
        <section className="relative flex items-center overflow-hidden bg-[#080C1A]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("/images/contact.jpg")`,
              backgroundAttachment: "fixed",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C1A]/80 via-[#080C1A]/75 to-[#080C1A]/70" />
          <div className="absolute top-0 right-0 w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] bg-[#C9293A]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-[#C9A84C]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 text-center text-white w-full">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-white/80">Get In Touch</span>
              <span className="block w-6 h-[2px] bg-[#E8610A] rounded-full" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black mb-6">Contact Us</h1>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              Have a question, a partnership idea, or want to learn more about our work? We'd love to hear from you.
            </p>
          </div>
        </section>
      </div>

      {/* ══ CONTACT FORM ══ */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* ── Reach Us card ── */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-black mb-6">Reach Us</h2>
                <div className="space-y-5">
                  {settings.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-[#C9293A]/10 flex items-center justify-center shrink-0"><Mail className="text-[#C9293A]" size={18} /></div>
                      <div><p className="text-xs text-gray-400 uppercase tracking-wide">Email</p><p className="text-gray-800 group-hover:text-[#C9293A] transition">{settings.email}</p></div>
                    </a>
                  )}
                  {settings.phone && (
                    <a href={`tel:${settings.phone}`} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-[#C9293A]/10 flex items-center justify-center shrink-0"><Phone className="text-[#C9293A]" size={18} /></div>
                      <div><p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p><p className="text-gray-800 group-hover:text-[#C9293A] transition">{settings.phone}</p></div>
                    </a>
                  )}
                  {settings.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#C9293A]/10 flex items-center justify-center shrink-0"><MapPin className="text-[#C9293A]" size={18} /></div>
                      <div><p className="text-xs text-gray-400 uppercase tracking-wide">Address</p><p className="text-gray-800">{settings.address}</p></div>
                    </div>
                  )}
                  {!settings.email && !settings.phone && !settings.address && (
                    <p className="text-gray-400 text-sm">Contact details will appear here once configured in the admin settings.</p>
                  )}
                </div>
              </div>

              {/* ── NEW: Operating Hours card ── */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="font-serif text-xl font-black mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-[#C9293A]" />
                  Operating Hours
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${status.bgColor} animate-pulse`} />
                  <span className={`text-lg font-bold ${status.statusColor}`}>
                    {status.statusText}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{status.hoursDisplay}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {status.isOpen
                    ? "We're available to assist you right now."
                    : "We're currently closed. Please reach out during working hours."}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    <span>Mon–Fri</span>
                    <span className="text-gray-300">|</span>
                    <span>8:00 AM – 5:00 PM</span>
                    <span className="text-gray-300">|</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                    <span>Weekends &amp; Public Holidays</span>
                  </p>
                </div>
              </div>

              {/* ── Social links ── */}
              {socials.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <h3 className="font-bold mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {socials.map(({ url, Icon, label }) => (
                      <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-[#C9293A] hover:text-white text-gray-600 flex items-center justify-center transition">
                        <Icon size={19} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Contact form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-black mb-6">Send Us A Message</h2>
                {done ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><Send className="text-green-600" size={24} /></div>
                    <p className="text-lg font-semibold text-gray-800">Message sent!</p>
                    <p className="text-gray-500 mt-1">Thank you for reaching out. We'll get back to you soon.</p>
                    <button onClick={() => setDone(false)} className="mt-6 text-[#C9293A] font-semibold text-sm">Send another message</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input className={inputCls} placeholder="Your name *" value={form.name} onChange={(e) => update("name", e.target.value)} />
                      <input className={inputCls} type="email" placeholder="Your email *" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    </div>
                    <input className={inputCls} placeholder="Subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
                    <textarea className={inputCls} rows={6} placeholder="Your message *" value={form.message} onChange={(e) => update("message", e.target.value)} style={{ resize: "vertical" }} />
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button onClick={submit} disabled={sending} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9293A] to-[#E8610A] text-white px-7 py-3 rounded-full font-semibold hover:-translate-y-0.5 transition disabled:opacity-70">
                      <Send size={16} />{sending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton phone={settings.phone} />

      {/* Hero styles */}
      <style>{`
        .contact-hero-fixed section {
          min-height: 100vh !important;
          height: 100vh !important;
        }
        @media (max-width: 480px) {
          .contact-hero-fixed section {
            min-height: 100vh !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default Contact;