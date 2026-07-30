import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, FileText } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Badge from "../../components/admin/Badge";
import EmptyState from "../../components/admin/EmptyState";
import Loading from "../../components/admin/Loading";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Input from "../../components/admin/Input";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

interface Report {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  published: boolean;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reports`);
        setReports(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(
    () =>
      reports.filter(r =>
        `${r.title} ${r.description ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [reports, search]
  );

  const handleDelete = async (id:number) => {
    if (!window.confirm("Delete this report?")) return;
    try{
      const res = await fetch(`${API_BASE_URL}/reports/${id}`,{method:"DELETE"});
      if(!res.ok) throw new Error();
      setReports(prev=>prev.filter(r=>r.id!==id));
    }catch{
      alert("Unable to delete report.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Reports"
        subtitle="Manage publications and reports"
      />

      <PageCard>

        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

          <div className="flex-1">
            <Input
              label="Search"
              name="search"
              value={search}
              placeholder="Search reports..."
              onChange={(e)=>setSearch(e.target.value)}
              icon={<Search size={18}/>}
            />
          </div>

          <Link to="/admin/reports/create">
            <PrimaryButton>
              <Plus size={18} className="mr-2"/>
              Add Report
            </PrimaryButton>
          </Link>

        </div>

        {loading ? (
          <Loading/>
        ) : filtered.length===0 ? (
          <EmptyState
            title="No Reports"
            description="Create your first report."
            buttonText="Create Report"
            buttonLink="/admin/reports/create"
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Report</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(report=>(
                  <tr key={report.id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                          <FileText className="text-[#C9293A]" size={22}/>
                        </div>
                        <span className="font-semibold">{report.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={report.published ? "published" : "draft"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <a
                          href={getAssetUrl(report.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-100"
                        >
                          <Eye size={18}/>
                        </a>
                        <Link to={`/admin/reports/${report.id}/edit`} className="p-2 rounded-lg bg-amber-100 text-amber-700"><Pencil size={18}/></Link>
                        <button onClick={()=>handleDelete(report.id)} className="p-2 rounded-lg bg-red-100 text-red-700"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </PageCard>
    </AdminLayout>
  );
};

export default Reports;
