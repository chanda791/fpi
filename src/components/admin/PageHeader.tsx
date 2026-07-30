import React from "react";
import { ChevronRight } from "lucide-react";
import BackButton from "../BackButton";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
  /** Route to return to. When set, renders a back arrow above the title. */
  backTo?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  backTo,
}) => {
  return (
    <div className="mb-10">

      {backTo && (
        <BackButton
          fallback={backTo}
          label="Back"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C9293A] transition mb-4"
        />
      )}

      {/* Breadcrumb */}

      {breadcrumbs.length > 0 && (
        <div className="flex items-center text-sm text-gray-500 mb-4">

          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>

              <span>{item.label}</span>

              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2" />
              )}

            </React.Fragment>
          ))}

        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-[#C9293A] text-xs font-bold uppercase tracking-wider mb-4">
            FPI Zambia CMS
          </span>

          <h1 className="text-4xl font-bold text-[#081A3A]">
            {title}
          </h1>

          {subtitle && (
            <p className="text-gray-500 text-lg mt-3 max-w-3xl">
              {subtitle}
            </p>
          )}

        </div>

        {action && (
          <div>
            {action}
          </div>
        )}

      </div>

      <div className="mt-8 border-b border-gray-200"></div>

    </div>
  );
};

export default PageHeader;