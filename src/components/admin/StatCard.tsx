import { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "#C9293A",
  subtitle,
}: StatCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300">

      {/* Background Accent */}
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-3 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {icon || <TrendingUp size={30} />}
        </div>

      </div>

    </div>
  );
};

export default StatCard;