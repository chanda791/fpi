import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, CalendarClock } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import Select from "../../components/admin/Select";
import PrimaryButton from "../../components/admin/PrimaryButton";
import SecondaryButton from "../../components/admin/SecondaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import { API_BASE_URL } from "../../services/config";
import { hubEventService, HubEvent } from "../../services/hubEventService";

interface Hub {
  id: number;
  name: string;
}

const empty = {
  title: "",
  description: "",
  eventType: "Community",
  eventDate: "",
  hubId: "",
};

const HubEvents = () => {
  const [items, setItems] = useState<HubEvent[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(empty);

  const load = async () => {
    try {
      const [events, hubList] = await Promise.all([
        hubEventService.getAll(),
        fetch(`${API_BASE_URL}/hubs`).then((res) => res.json()),
      ]);
      setItems(events);
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
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: HubEvent) => {
    setForm({
      title: item.title,
      description: item.description || "",
      eventType: item.eventType,
      eventDate: item.eventDate ? item.eventDate.slice(0, 10) : "",
      hubId: String(item.hubId),
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.hubId || !form.eventDate) {
      alert("Title, hub and date are required.");
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form, hubId: Number(form.hubId) };
      if (editingId) {
        await hubEventService.update(editingId, payload);
      } else {
        await hubEventService.create(payload);
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

  const remove = async (item: HubEvent) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await hubEventService.remove(item.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to delete.");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Hub Events"
        subtitle="Training sessions and community events held at MIL Hubs -- feeds the real 'Impact at a Glance' stats on the public MIL Hubs page"
      />

      <PageCard>
        <div className="flex justify-end mb-6">
          <PrimaryButton onClick={openNew}>
            <Plus size={18} className="mr-2" />
            Add Event
          </PrimaryButton>
        </div>

        {showForm && (
          <div className="mb-8 border rounded-2xl p-6 bg-slate-50 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold mb-5">{editingId ? "Edit Event" : "New Event"}</h3>

            <div className="space-y-5">
              <Input label="Title" name="title" value={form.title} onChange={(e) => update("title", e.target.value)} />

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

              <Select
                label="Event Type"
                name="eventType"
                value={form.eventType}
                onChange={(e) => update("eventType", e.target.value)}
              >
                <option value="Training">Training Session</option>
                <option value="Community">Community Event</option>
              </Select>

              <Input
                label="Event Date"
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
              />

              <TextArea label="Description" name="description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />

              <div className="flex gap-3 pt-2">
                <PrimaryButton onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save Event"}
                </PrimaryButton>
                <SecondaryButton onClick={() => setShowForm(false)}>Cancel</SecondaryButton>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState title="No Events Yet" description="Log the first hub training session or community event." />
        ) : (
          <div className="rounded-2xl border overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0 hover:bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <CalendarClock className="text-[#C9293A]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.title}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {item.hub?.name} &middot; {new Date(item.eventDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full shrink-0">{item.eventType}</span>
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

export default HubEvents;
