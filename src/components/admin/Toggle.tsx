interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Toggle = ({
  checked,
  onChange,
  label,
}: ToggleProps) => {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">

      <div>
        <p className="font-semibold text-slate-800">
          {label || "Status"}
        </p>

        <p className="text-sm text-slate-500">
          {checked ? "Published" : "Draft"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
          checked
            ? "bg-[#C9293A]"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-300 ${
            checked
              ? "translate-x-8"
              : "translate-x-1"
          }`}
        />
      </button>

    </div>
  );
};

export default Toggle;