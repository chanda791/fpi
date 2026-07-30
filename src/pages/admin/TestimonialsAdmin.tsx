import { useEffect, useState } from "react";
import { Trash2, Check, Clock, Star } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import { getAssetUrl } from "../../services/config";
import { testimonialService, Testimonial } from "../../services/testimonialService";

const TestimonialsAdmin = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setItems(await testimonialService.getAll(true));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleApproval = async (t: Testimonial) => {
    try {
      await testimonialService.update(t.id, { approved: !t.approved });
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to update.");
    }
  };

  const remove = async (t: Testimonial) => {
    if (!window.confirm(`Delete comment from "${t.name}"?`)) return;
    try {
      await testimonialService.remove(t.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to delete.");
    }
  };

  const pending = items.filter((i) => !i.approved);
  const approved = items.filter((i) => i.approved);

  const Card = ({ t }: { t: Testimonial }) => (
    <div className="flex gap-4 px-6 py-4 border-b last:border-b-0 hover:bg-slate-50">
      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
        {t.photo ? (
          <img src={getAssetUrl(t.photo)} alt={t.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-400 font-bold">{t.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{t.name}</p>
          {t.role && <span className="text-xs text-slate-500">· {t.role}</span>}
        </div>
        <p className="text-sm text-slate-600 mt-1">{t.message}</p>
        <p className="text-xs text-slate-400 mt-1">
          {new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <div className="flex items-start gap-2">
        <button
          onClick={() => toggleApproval(t)}
          className={`p-2 rounded-lg ${t.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
          title={t.approved ? "Approved (click to unpublish)" : "Approve"}
        >
          {t.approved ? <Check size={16} /> : <Clock size={16} />}
        </button>
        <button onClick={() => remove(t)} className="p-2 rounded-lg bg-red-100 text-red-700">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <PageHeader title="Comments & Testimonials" subtitle="Approve, edit, or remove comments left by website visitors" />

      {loading ? (
        <PageCard><Loading /></PageCard>
      ) : items.length === 0 ? (
        <PageCard>
          <EmptyState title="No Comments Yet" description="Visitor comments submitted on the website will appear here for approval." />
        </PageCard>
      ) : (
        <>
          <PageCard title={`Pending Approval (${pending.length})`}>
            {pending.length === 0 ? (
              <p className="text-slate-500 text-sm px-2 py-4">Nothing waiting for approval.</p>
            ) : (
              <div className="rounded-2xl border overflow-hidden">
                {pending.map((t) => <Card key={t.id} t={t} />)}
              </div>
            )}
          </PageCard>

          <div className="mt-6">
            <PageCard title={`Published (${approved.length})`}>
              {approved.length === 0 ? (
                <p className="text-slate-500 text-sm px-2 py-4">No published comments yet.</p>
              ) : (
                <div className="rounded-2xl border overflow-hidden">
                  {approved.map((t) => <Card key={t.id} t={t} />)}
                </div>
              )}
            </PageCard>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default TestimonialsAdmin;
