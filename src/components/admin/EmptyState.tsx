import { FileSearch, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const EmptyState = ({
  title = "Nothing here yet",
  description = "There are currently no records to display.",
  buttonText = "Create New",
  buttonLink = "#",
}: EmptyStateProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 py-20 px-8 text-center">

      <div className="mx-auto w-24 h-24 rounded-full bg-[#C9293A]/10 flex items-center justify-center mb-8">
        <FileSearch
          size={42}
          className="text-[#C9293A]"
        />
      </div>

      <h2 className="text-3xl font-bold text-slate-800 mb-4">
        {title}
      </h2>

      <p className="text-slate-500 max-w-xl mx-auto leading-8 mb-10">
        {description}
      </p>

      <Link
        to={buttonLink}
        className="inline-flex items-center gap-2 bg-[#C9293A] hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
      >
        <Plus size={20} />
        {buttonText}
      </Link>

    </div>
  );
};

export default EmptyState;