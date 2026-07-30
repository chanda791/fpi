import { ArrowLeft } from "lucide-react";
import { useGoBack } from "../hooks/useGoBack";

interface BackButtonProps {
  /** Route to navigate to when there's no real history to go back to. */
  fallback?: string;
  label?: string;
  className?: string;
  iconSize?: number;
}

const DEFAULT_CLASSES =
  "inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition";

const BackButton = ({
  fallback = "/",
  label = "Back",
  className = DEFAULT_CLASSES,
  iconSize = 16,
}: BackButtonProps) => {
  const goBack = useGoBack(fallback);

  return (
    <button type="button" onClick={goBack} className={className}>
      <ArrowLeft size={iconSize} />
      {label}
    </button>
  );
};

export default BackButton;
