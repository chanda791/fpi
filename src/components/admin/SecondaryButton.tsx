import React from "react";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        px-6
        py-3
        rounded-xl
        border
        border-gray-300
        bg-white
        hover:bg-gray-100
        text-gray-700
        font-semibold
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;