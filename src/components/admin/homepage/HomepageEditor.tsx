import { useState } from "react";

import StatisticsEditor from "./StatisticsEditor";
import QuickAccessEditor from "./QuickAccessEditor";
import FeaturedProjectsEditor from "./FeaturedProjectsEditor";
import LatestActivitiesEditor from "./LatestActivitiesEditor";
import GalleryEditor from "./GalleryEditor";
import CTAEditor from "./CTAEditor";


const tabs = [
  { id: "statistics", label: "Statistics" },
  { id: "quick", label: "Quick Access" },
  { id: "projects", label: "Featured Projects" },
  { id: "activities", label: "Latest Activities" },
  { id: "gallery", label: "Gallery" },
  { id: "cta", label: "Call To Action" },
];

const HomepageEditor = () => {
  const [tab, setTab] = useState("statistics");

  return (
    <div className="space-y-8">

      <div className="flex flex-wrap gap-3">

        {tabs.map((item) => (

          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              tab === item.id
                ? "bg-red-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>

        ))}

      </div>


      {tab === "statistics" && <StatisticsEditor />}

      {tab === "quick" && <QuickAccessEditor />}

      {tab === "projects" && <FeaturedProjectsEditor />}

      {tab === "activities" && <LatestActivitiesEditor />}

      {tab === "gallery" && <GalleryEditor />}

      {tab === "cta" && <CTAEditor />}

    </div>
  );
};

export default HomepageEditor;