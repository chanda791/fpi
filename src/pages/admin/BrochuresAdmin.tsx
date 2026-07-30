import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, FileText } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import FileUpload from "../../components/admin/FileUpload";
import ImageUpload from "../../components/admin/ImageUpload";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import Toggle from "../../components/admin/Toggle";

import { brochureService, Brochure } from "../../services/brochureService";

const empty = {
  title: "",
  description: "",
  fileUrl: "",
  thumbnail: "",
  displayOrder: 0,
  published: true,
};

const BrochuresAdmin = () => {
  const [items, setItems] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    try {
      setItems(await brochureService.getAll());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (field: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [field]: value }));

  const openNew = () => {
    setForm(empty);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: Brochure) => {
    setForm({
      title: item.title,
      description: item.description || "",
      fileUrl: item.fileUrl || "",
      thumbnail: item.thumbnail || "",
      displayOrder: item.displayOrder,
      published: item.published,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await brochureService.update(editingId, form);
      } else {
        await brochureService.create(form);
      }
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Brochure) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await brochureService.remove(item.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to delete.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Brochures"
        subtitle="Manage the downloadable brochures shown on the public Brochures hub"
      />

      <PageCard>
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={openNew}>
            <Plus size={18} className="mr-2" />
            Add Brochure
          </PrimaryButton>
        </div>

        {showForm && (
          <div className="mb-8 border rounded-2xl p-6 bg-slate-50 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-5">{editingId ? "Edit Brochure" : "New Brochure"}</h3>

            <div className="space-y-5">
              <Input label="Title" name="title" value={form.title} onChange={(e) => update("title", e.target.value)} />
              <TextArea label="Description" name="description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
              <FileUpload label="Brochure File (PDF)" value={form.fileUrl} onChange={(url) => update("fileUrl", url)} />
              <ImageUpload label="Thumbnail (optional)" value={form.thumbnail} onChange={(url) => update("thumbnail", url)} />
              <Input label="Display Order" name="displayOrder" type="number" value={form.displayOrder} onChange={(e) => update("displayOrder", Number(e.target.value))} />
              <Toggle checked={form.published} onChange={(c) => update("published", c)} label="Published" />

              <div className="flex gap-3 pt-2">
                <PrimaryButton onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Brochure"}</PrimaryButton>
                <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState title="No Brochures Yet" description="Add the first downloadable brochure." />
        ) : (
          <div className="rounded-2xl border overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0 hover:bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <FileText className="text-[#C9293A]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.title}</p>
                  <p className="text-sm text-slate-500 truncate">{item.description}</p>
                </div>
                {!item.published && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Draft</span>}
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-amber-100 text-amber-700"><Pencil size={16} /></button>
                <button onClick={() => remove(item)} className="p-2 rounded-lg bg-red-100 text-red-700"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </AdminLayout>
  );
};

export default BrochuresAdmin;
