import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  helperText,
  error,
  className = "",
  placeholder = "Select an option",
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>

      <label
        htmlFor={name}
        className="block text-sm font-semibold text-[#081A3A]"
      >
        {label}

        {required && (
          <span className="text-[#C9293A] ml-1">*</span>
        )}
      </label>

      <div className="relative">

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            appearance-none
            w-full
            rounded-lg
            border
            ${error ? "border-red-500" : "border-gray-300"}
            bg-white
            px-3.5
            py-2.5
            pr-12
            text-sm
            text-gray-800
            shadow-sm
            transition-all
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-[#C9293A]
            focus:border-[#C9293A]
            disabled:bg-gray-100
            disabled:cursor-not-allowed
          `}
        >
          <option value="">
            {placeholder}
          </option>

          {children}
        </select>

        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

      </div>

      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

    </div>
  );
};

export default Select;