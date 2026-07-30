import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import PageCard from "../../components/admin/PageCard";
import Loading from "../../components/admin/Loading";
import EmptyState from "../../components/admin/EmptyState";
import { contactService, ContactMessage } from "../../services/contactService";

const ContactMessagesAdmin = () => {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  const load = async () => {
    try {
      setItems(await contactService.getAll());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const open = async (m: ContactMessage) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.read) {
      try {
        await contactService.markRead(m.id, true);
        setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(`Delete message from ${m.name}?`)) return;
    try {
      await contactService.remove(m.id);
      await load();
    } catch (e) {
      console.error(e);
      alert("Unable to delete.");
    }
  };

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <AdminLayout>
      <PageHeader
        title="Contact Messages"
        subtitle={`Messages submitted through the website contact form${unreadCount ? ` · ${unreadCount} unread` : ""}`}
      />

      <PageCard>
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState title="No Messages Yet" description="Messages from the contact form will appear here." />
        ) : (
          <div className="rounded-2xl border overflow-hidden">
            {items.map((m) => (
              <div key={m.id} className="border-b last:border-b-0">
                <div
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 ${
                    m.read ? "" : "bg-red-50/40"
                  }`}
                  onClick={() => open(m)}
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {m.read ? (
                      <MailOpen className="text-slate-400" size={16} />
                    ) : (
                      <Mail className="text-[#C9293A]" size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${m.read ? "font-medium" : "font-bold"}`}>
                      {m.subject || "(No subject)"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(m.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(m);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-700 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {openId === m.id && (
                  <div className="px-6 pb-5 pt-1 bg-slate-50">
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {m.message}
                    </p>
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message")}`}
                      className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#C9293A]"
                    >
                      <Mail size={15} /> Reply by email
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </AdminLayout>
  );
};

export default ContactMessagesAdmin;
