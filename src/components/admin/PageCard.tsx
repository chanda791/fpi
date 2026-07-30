import React from "react";

interface PageCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

const PageCard: React.FC<PageCardProps> = ({
  title,
  subtitle,
  children,
  className = "",
  footer,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100">

          {title && (
            <h2 className="text-xl font-bold text-[#081A3A]">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">
              {subtitle}
            </p>
          )}

        </div>
      )}

      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default PageCard;