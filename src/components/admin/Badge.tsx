interface BadgeProps {
  status?:
    | "published"
    | "draft"
    | "active"
    | "inactive"
    | "completed"
    | "pending"
    | string;
}

const Badge = ({ status = "draft" }: BadgeProps) => {
  const value = status.toLowerCase();

  const styles: Record<string, string> = {
    published:
      "bg-green-100 text-green-700 border-green-200",
    active:
      "bg-green-100 text-green-700 border-green-200",

    draft:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    pending:
      "bg-yellow-100 text-yellow-700 border-yellow-200",

    inactive:
      "bg-red-100 text-red-700 border-red-200",

    completed:
      "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[value] ||
        "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {value}
    </span>
  );
};

export default Badge;