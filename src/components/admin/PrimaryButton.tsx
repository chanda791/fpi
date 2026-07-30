import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const PrimaryButton = ({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      className={`bg-[#C9293A] hover:bg-[#A61F2E] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;