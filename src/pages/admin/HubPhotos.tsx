import { useEffect, useState } from "react";
import { Plus, Trash2, X, Image as ImageIcon } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import ImageUpload from "../../components/admin/ImageUpload";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import { API_BASE_URL, getAssetUrl } from "../../services/config";
import { hubPhotoService, HubPhoto } from "../../services/hubPhotoService";

interface Hub {
  id: number;
  name: string;
}

const empty = {
  imageUrl: "",
  caption: "",
  hubId: "",
};

const HubPhotos = () => {
  const [items, setItems] = useState<HubPhoto[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const [photos, hubList] = await Promise.all([
        hubPhotoService.getAll(),
        fetch(`${API_BASE_URL}/hubs`).then((res) => res.json()),
      ]);
      setItems(photos);
      setHubs(Array.isArray(hubList) ? hubList : []);
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
    setShowForm(true);
  };

  const save = async () => {
    if (!form.imageUrl || !form.hubId) {
      alert("An image and a hub are required.");
      return;
    }
    try {
      setSaving(true);
      await hubPhotoService.create({ ...form, hubId: Number(form.hubId) });
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: HubPhoto) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await hubPhotoService.remove(item.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to delete.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Hub Photos"
        subtitle="Photo gallery shown as a slideshow on each MIL Hub's public page"
      />

      <PageCard>
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={openNew}>
            <Plus size={18} className="mr-2" />
            Add Photo
          </PrimaryButton>
        </div>

        {showForm && (
          <div className="mb-8 border rounded-2xl p-6 bg-slate-50 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-5">New Photo</h3>

            <div className="space-y-5">
              <Select
                label="Hub"
                name="hubId"
                value={form.hubId}
                onChange={(e) => update("hubId", e.target.value)}
                required
              >
                {hubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>{hub.name}</option>
                ))}
              </Select>

              <ImageUpload
                label="Photo"
                value={form.imageUrl}
                onChange={(url) => update("imageUrl", url)}
                onUploadingChange={setUploading}
              />

              <Input
                label="Caption (optional)"
                name="caption"
                value={form.caption}
                onChange={(e) => update("caption", e.target.value)}
              />

              <div className="flex gap-3 pt-2">
                <PrimaryButton onClick={save} disabled={saving || uploading}>
                  {saving ? "Saving..." : uploading ? "Waiting for upload..." : "Save Photo"}
                </PrimaryButton>
                <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState title="No Photos Yet" description="Add the first hub gallery photo." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border overflow-hidden bg-white">
                <div className="h-40 bg-slate-100">
                  <img
                    src={getAssetUrl(item.imageUrl)}
                    alt={item.caption || item.hub?.name || "Hub photo"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate flex items-center gap-2">
                      <ImageIcon size={14} className="text-[#C9293A] shrink-0" />
                      {item.hub?.name || "Unknown hub"}
                    </p>
                    {item.caption && (
                      <p className="text-sm text-slate-500 truncate">{item.caption}</p>
                    )}
                  </div>
                  <button onClick={() => remove(item)} className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </AdminLayout>
  );
};

export default HubPhotos;
