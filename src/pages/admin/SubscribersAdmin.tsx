import { useEffect, useState } from "react";
import { Trash2, Mail, Send } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Input from "../../components/admin/Input";
import TextArea from "../../components/admin/TextArea";
import PrimaryButton from "../../components/admin/PrimaryButton";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import { subscriberService, Subscriber } from "../../services/subscriberService";

const SubscribersAdmin = () => {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      setItems(await subscriberService.getAll());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (s: Subscriber) => {
    if (!window.confirm(`Remove ${s.email}?`)) return;
    try {
      await subscriberService.remove(s.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to remove.");
    }
  };

  const broadcast = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Subject and message are both required.");
      return;
    }
    if (!window.confirm(`Send this to all ${items.length} subscriber(s)?`)) return;
    try {
      setSending(true);
      const res = await subscriberService.broadcast(subject, message);
      alert(res.message);
      setSubject("");
      setMessage("");
    } catch (e) {
      console.error(e);
      alert("Unable to send broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle="View subscribers and send them the latest news or activities"
      />

      <PageCard title="Send a Broadcast">
        <div className="space-y-5">
          <p className="text-sm text-slate-500">
            This emails every active subscriber. Requires SMTP to be configured in Settings.
          </p>
          <Input
            label="Subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. New Report: Media Freedom in Zambia 2026"
          />
          <TextArea
            label="Message"
            name="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your update here. You can paste a link to the new report, activity, or article."
          />
          <PrimaryButton onClick={broadcast} disabled={sending}>
            <Send size={16} className="mr-2" />
            {sending ? "Sending..." : `Send to ${items.length} Subscriber(s)`}
          </PrimaryButton>
        </div>
      </PageCard>

      <div className="mt-6">
        <PageCard title={`Subscribers (${items.length})`}>
          {loading ? (
            <Loading />
          ) : items.length === 0 ? (
            <EmptyState
              title="No Subscribers Yet"
              description="Emails collected from the website footer signup will appear here."
            />
          ) : (
            <div className="rounded-2xl border overflow-hidden">
              {items.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 px-6 py-3.5 border-b last:border-b-0 hover:bg-slate-50"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <Mail className="text-[#C9293A]" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.email}</p>
                    {s.name && <p className="text-xs text-slate-500 truncate">{s.name}</p>}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button onClick={() => remove(s)} className="p-2 rounded-lg bg-red-100 text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </PageCard>
      </div>
    </AdminLayout>
  );
};

export default SubscribersAdmin;
