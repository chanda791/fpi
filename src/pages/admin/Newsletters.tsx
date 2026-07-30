import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Mail, Eye, Pencil, Trash2 } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Badge from "../../components/admin/Badge";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Input from "../../components/admin/Input";
import { API_BASE_URL, getAssetUrl } from "../../services/config";

interface Newsletter {
  id: number;
  title: string;
  issue?: string;
  status?: string;
  published?: boolean;
  fileUrl: string;
}

const Newsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/newsletters`);
        if (res.ok) setNewsletters(await res.json());
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
      newsletters.filter((n) =>
        `${n.title} ${n.issue ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [newsletters, search]
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this newsletter?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/newsletters/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      setNewsletters((prev) => prev.filter((n) => n.id !== id));
    } catch {
      alert("Unable to delete newsletter.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Newsletters"
        subtitle="Manage FPI Zambia newsletters"
      />

      <PageCard>
        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">
          <div className="flex-1">
            <Input
              label="Search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search newsletters..."
              icon={<Search size={18} />}
            />
          </div>

          <Link to="/admin/newsletters/create">
            <PrimaryButton>
              <Plus size={18} className="mr-2" />
              Create Newsletter
            </PrimaryButton>
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Newsletters"
            description="Create your first newsletter."
            buttonText="Create Newsletter"
            buttonLink="/admin/newsletters/create"
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">Newsletter</th>
                  <th className="px-6 py-4 text-left">Issue</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                          <Mail className="text-[#C9293A]" size={20} />
                        </div>
                        <span className="font-semibold">{item.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{item.issue || "-"}</td>

                    <td className="px-6 py-4">
                      <Badge
                        status={
                          item.status ||
                          (item.published ? "published" : "draft")
                        }
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <a
                          href={getAssetUrl(item.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-100"
                        >
                          <Eye size={18} />
                        </a>

                        <Link
                          to={`/admin/newsletters/${item.id}/edit`}
                          className="p-2 rounded-lg bg-amber-100 text-amber-700"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
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

export default Newsletters;
