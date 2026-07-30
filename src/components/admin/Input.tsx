import React from "react";

interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  helperText,
  error,
  icon,
  className = "",
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

        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full
            rounded-lg
            border
            ${error ? "border-red-500" : "border-gray-300"}
            bg-white
            ${icon ? "pl-10" : "pl-3.5"}
            pr-3.5
            py-2.5
            text-sm
            text-gray-800
            placeholder:text-gray-400
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

export default Input;