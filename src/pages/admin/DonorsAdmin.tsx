import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import ImageUpload from "../../components/admin/ImageUpload";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import Toggle from "../../components/admin/Toggle";
import { getAssetUrl } from "../../services/config";

import { donorService, Donor } from "../../services/donorService";

const empty = {
  name: "",
  description: "",
  logo: "",
  website: "",
  tier: "Supporter",
  displayOrder: 0,
  published: true,
};

const DonorsAdmin = () => {
  const [items, setItems] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    try {
      setItems(await donorService.getAll());
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

  const openEdit = (item: Donor) => {
    setForm({
      name: item.name,
      description: item.description || "",
      logo: item.logo || "",
      website: item.website || "",
      tier: item.tier || "Supporter",
      displayOrder: item.displayOrder,
      published: item.published,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await donorService.update(editingId, form);
      } else {
        await donorService.create(form);
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

  const remove = async (item: Donor) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await donorService.remove(item.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to delete.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Donors"
        subtitle="Manage the organisations shown on the public Donors page"
      />

      <PageCard>
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={openNew}>
            <Plus size={18} className="mr-2" />
            Add Donor
          </PrimaryButton>
        </div>

        {showForm && (
          <div className="mb-8 border rounded-2xl p-6 bg-slate-50 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-5">
              {editingId ? "Edit Donor" : "New Donor"}
            </h3>

            <div className="space-y-5">
              <Input label="Name" name="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              <TextArea label="Description" name="description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
              <Input label="Website (optional)" name="website" value={form.website} onChange={(e) => update("website", e.target.value)} />
              <Input label="Tier (e.g. Platinum, Gold, Supporter)" name="tier" value={form.tier} onChange={(e) => update("tier", e.target.value)} />
              <Input label="Display Order" name="displayOrder" type="number" value={form.displayOrder} onChange={(e) => update("displayOrder", Number(e.target.value))} />
              <ImageUpload label="Logo" value={form.logo} onChange={(url) => update("logo", url)} />
              <Toggle checked={form.published} onChange={(c) => update("published", c)} label="Published" />

              <div className="flex gap-3 pt-2">
                <PrimaryButton onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save Donor"}
                </PrimaryButton>
                <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState title="No Donors Yet" description="Add the first donor organisation." />
        ) : (
          <div className="rounded-2xl border overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0 hover:bg-slate-50">
                <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                  {item.logo ? (
                    <img src={getAssetUrl(item.logo)} alt={item.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">No logo</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.name}</p>
                  <p className="text-sm text-slate-500 truncate">{item.tier}</p>
                </div>
                {!item.published && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Draft</span>
                )}
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(item)} className="p-2 rounded-lg bg-red-100 text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </AdminLayout>
  );
};

export default DonorsAdmin;
