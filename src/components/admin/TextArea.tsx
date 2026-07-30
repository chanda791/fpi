import React from "react";

interface TextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
  required = false,
  disabled = false,
  helperText,
  error,
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

      <textarea
        id={name}
        name={name}
        rows={rows}
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
          px-3.5
          py-2.5
          text-sm
          text-gray-800
          placeholder:text-gray-400
          shadow-sm
          resize-none
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

export default TextArea;