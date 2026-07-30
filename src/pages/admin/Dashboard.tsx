import { useEffect, useState } from "react";
import {
  CalendarDays,
  FolderKanban,
  FileText,
  Users,
  Newspaper,
  MapPinned,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import StatCard from "../../components/admin/StatCard";
import { API_BASE_URL } from "../../services/config";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activities: 0,
    projects: 0,
    reports: 0,
    news: 0,
    team: 0,
    hubs: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          activities,
          projects,
          reports,
          news,
          team,
          hubs,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/activities`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE_URL}/projects`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE_URL}/reports`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE_URL}/newsletters`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE_URL}/team`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE_URL}/hubs`).then((r) =>
            r.json()
          ),
        ]);

        setStats({
          activities: activities.length || 0,
          projects: projects.length || 0,
          reports: reports.length || 0,
          news: news.length || 0,
          team: team.length || 0,
          hubs: hubs.length || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, []);

  const overview = [
    { label: "Total Activities", value: stats.activities },
    { label: "Total Projects", value: stats.projects },
    { label: "Total Reports", value: stats.reports },
    { label: "Total News", value: stats.news },
    { label: "Total Team Members", value: stats.team },
    { label: "Total MIL Hubs", value: stats.hubs },
  ];

  const overviewTotal = overview.reduce((sum, item) => sum + item.value, 0);

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the FPI Zambia Content Management System"
      />

      <div
        className="fpi-editorial"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex items-center gap-3 mb-5 mt-2">
          <span className="h-px flex-1 bg-[#E4E1D8]" />
          <span className="text-[11px] tracking-[0.18em] uppercase text-[#8B8A83] font-medium">
            At a Glance
          </span>
          <span className="h-px flex-1 bg-[#E4E1D8]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          <StatCard
            title="Activities"
            value={stats.activities}
            subtitle="Published activities"
            icon={<CalendarDays size={30} />}
            color="#C9293A"
          />

          <StatCard
            title="Projects"
            value={stats.projects}
            subtitle="Current projects"
            icon={<FolderKanban size={30} />}
            color="#C9A227"
          />

          <StatCard
            title="Reports"
            value={stats.reports}
            subtitle="Available reports"
            icon={<FileText size={30} />}
            color="#0F766E"
          />

          <StatCard
            title="Newsletters"
            value={stats.news}
            subtitle="Published newsletters"
            icon={<Newspaper size={30} />}
            color="#2563EB"
          />

          <StatCard
            title="Team Members"
            value={stats.team}
            subtitle="Staff & Board"
            icon={<Users size={30} />}
            color="#7C3AED"
          />

          <StatCard
            title="MIL Hubs"
            value={stats.hubs}
            subtitle="Across Zambia"
            icon={<MapPinned size={30} />}
            color="#15803D"
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-10">

          <PageCard title="Quick Overview">

            <div className="text-[#1C1C1A]">

              <table className="w-full text-sm">
                <tbody>
                  {overview.map((item, index) => (
                    <tr
                      key={item.label}
                      className={
                        index !== overview.length - 1
                          ? "border-b border-[#E4E1D8]"
                          : ""
                      }
                    >
                      <td className="py-3 text-[#4A4944]">
                        {item.label}
                      </td>
                      <td
                        className="py-3 text-right font-semibold text-[#1C1C1A]"
                        style={{
                          fontFamily: "'Source Serif 4', serif",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-baseline mt-2 pt-3 border-t-2 border-[#1C1C1A]">
                <span className="text-[11px] tracking-[0.14em] uppercase text-[#8B8A83]">
                  Total Records
                </span>
                <span
                  className="text-lg font-bold text-[#C9293A]"
                  style={{
                    fontFamily: "'Source Serif 4', serif",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {overviewTotal}
                </span>
              </div>

            </div>

          </PageCard>

          <PageCard title="FPI Zambia CMS">

            <div className="text-[#3A3934] leading-7">

              <p
                className="text-[17px] text-[#1C1C1A] mb-4"
                style={{ fontFamily: "'Source Serif 4', serif" }}
              >
                Welcome to the Free Press Initiative Zambia
                Content Management System.
              </p>

              <p className="text-sm text-[#4A4944] mb-6">
                Use the menu on the left to manage Activities,
                Projects, Publications, Reports, News,
                Media &amp; Information Literacy Hubs,
                Team Members and Website Content.
              </p>

              <div className="h-px bg-[#E4E1D8] mb-5" />

              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15803D]" />
                </span>
                <span className="text-[11px] tracking-[0.14em] uppercase text-[#8B8A83]">
                  System Operational
                </span>
              </div>

            </div>

          </PageCard>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
      `}</style>
    </AdminLayout>
  );
};

export default Dashboard;