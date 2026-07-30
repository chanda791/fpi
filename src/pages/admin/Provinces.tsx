import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Sparkles } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";

import { provinceService, Province } from "../../services/provinceService";

const STANDARD_PROVINCES = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
];

const Provinces = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const load = async () => {
    try {
      const data = await provinceService.getAll();
      setProvinces(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load provinces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProvince = async () => {
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await provinceService.create({ name: name.trim() });
      setName("");
      await load();
    } catch (error) {
      console.error(error);
      alert("Unable to add province.");
    } finally {
      setSubmitting(false);
    }
  };

  const seedStandardProvinces = async () => {
    if (seeding) return;

    try {
      setSeeding(true);

      const existingNames = new Set(
        provinces.map((p) => p.name.toLowerCase())
      );

      const missing = STANDARD_PROVINCES.filter(
        (p) => !existingNames.has(p.toLowerCase())
      );

      if (missing.length === 0) {
        alert("All 10 Zambian provinces already exist.");
        return;
      }

      for (const provinceName of missing) {
        await provinceService.create({ name: provinceName });
      }

      await load();
      alert(`Added ${missing.length} province(s).`);
    } catch (error) {
      console.error(error);
      alert("Unable to add standard provinces.");
    } finally {
      setSeeding(false);
    }
  };

  const startEditing = (province: Province) => {
    setEditingId(province.id);
    setEditingName(province.name);
  };

  const saveEdit = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      await provinceService.update(id, { name: editingName.trim() });
      setEditingId(null);
      await load();
    } catch (error) {
      console.error(error);
      alert("Unable to update province.");
    }
  };

  const deleteProvince = async (province: Province) => {
    if (
      !window.confirm(
        `Delete "${province.name}"? This may affect any MIL Hubs assigned to this province.`
      )
    )
      return;

    try {
      await provinceService.remove(province.id);
      await load();
    } catch (error) {
      console.error(error);
      alert(
        "Unable to delete province. It may still have hubs assigned to it."
      );
    }
  };

  return (
    <AdminLayout>

      <PageHeader
        title="Province Management"
        subtitle="Manage the provinces used by MIL Hubs and Activities"
      />

      <PageCard>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          <div className="flex-1">
            <Input
              label=""
              name="name"
              placeholder="Province name (e.g. Lusaka)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <PrimaryButton onClick={createProvince} disabled={submitting}>
              <Plus size={18} className="mr-2" />
              {submitting ? "Adding..." : "Add Province"}
            </PrimaryButton>

            <SecondaryButton onClick={seedStandardProvinces}>
              <Sparkles size={16} className="mr-2" />
              {seeding ? "Adding..." : "Add All 10 Zambian Provinces"}
            </SecondaryButton>
          </div>

        </div>

        {loading ? (
          <Loading />
        ) : provinces.length === 0 ? (
          <EmptyState
            title="No Provinces Yet"
            description="Add provinces above, or use 'Add All 10 Zambian Provinces' to get started instantly -- you'll need at least one before you can create a MIL Hub."
          />
        ) : (
          <div className="rounded-2xl border overflow-hidden">
            {provinces.map((province) => (
              <div
                key={province.id}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 hover:bg-slate-50"
              >
                {editingId === province.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm flex-1 mr-4"
                  />
                ) : (
                  <span className="font-medium">{province.name}</span>
                )}

                <div className="flex gap-2">
                  {editingId === province.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(province.id)}
                        className="p-2 rounded-lg bg-green-100 text-green-700"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(province)}
                        className="p-2 rounded-lg bg-amber-100 text-amber-700"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteProvince(province)}
                        className="p-2 rounded-lg bg-red-100 text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </PageCard>

    </AdminLayout>
  );
};

export default Provinces;
