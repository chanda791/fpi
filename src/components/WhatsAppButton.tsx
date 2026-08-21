import { useEffect, useState } from "react";

export const WhatsAppIcon = ({ size = 26 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M17.47 14.38c-.29-.14-1.7-.84-1.96-.93-.26-.1-.46-.14-.65.14-.19.29-.75.93-.92 1.12-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.82 1.17 3.01.14.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.11.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33z" />
    <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.87.5 3.63 1.44 5.15L2 22l4.98-1.31A9.96 9.96 0 0012.02 22C17.54 22 22 17.52 22 12S17.54 2 12.02 2zm0 18.15c-1.68 0-3.29-.44-4.68-1.28l-.34-.2-3.05.8.82-2.99-.22-.31A8.14 8.14 0 013.85 12c0-4.5 3.66-8.16 8.17-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.15-8.16 8.15z" />
  </svg>
);

export function buildWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
}

// Floating action button, fixed to the viewport, that slides in from the
// right edge shortly after mount rather than just appearing.
const WhatsAppButton = ({
  phone,
  message = "Hello! I'd like to know more about FPI Zambia.",
}: WhatsAppButtonProps) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!phone) return null;

  return (
    <a
      href={buildWhatsAppLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: hovered ? 10 : 0,
        background: "#25D366",
        color: "#fff",
        borderRadius: 999,
        padding: 14,
        boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
        textDecoration: "none",
        transform: visible ? "translateX(0)" : "translateX(140px)",
        opacity: visible ? 1 : 0,
        transition: "transform .5s cubic-bezier(.34,1.56,.64,1), opacity .5s ease, gap .25s ease",
      }}
    >
      <WhatsAppIcon size={26} />
      <span
        style={{
          maxWidth: hovered ? 200 : 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontSize: 14,
          fontWeight: 600,
          transition: "max-width .25s ease",
        }}
      >
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
