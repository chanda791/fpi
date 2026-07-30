import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox = ({ images, index, onClose, onNavigate }: Props) => {
  const isOpen = index >= 0 && !!images[index];

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, index, images.length, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 20, right: 24, color: "#fff", background: "none", border: "none", cursor: "pointer" }}
        aria-label="Close"
      >
        <X size={32} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + images.length) % images.length); }}
            style={{ position: "absolute", left: 16, color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % images.length); }}
            style={{ position: "absolute", right: 16, color: "#fff", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "92vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      />

      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
