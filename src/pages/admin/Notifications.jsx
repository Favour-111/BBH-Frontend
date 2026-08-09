import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { adminApi } from "../../lib/api.js";
import { timeAgo } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import clsx from "clsx";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.get("/notifications").then(({ data }) => setNotifications(data.notifications)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id) => {
    setActioningId(id);
    try {
      await adminApi.put(`/notifications/${id}/read`);
      load();
    } finally {
      setActioningId(null);
    }
  };

  const markAllRead = async () => {
    setMarkingAllRead(true);
    try {
      await adminApi.put("/notifications/read-all");
      toast.success("All notifications marked as read.");
      load();
    } finally {
      setMarkingAllRead(false);
    }
  };

  const remove = async (id) => {
    setActioningId(id);
    try {
      await adminApi.delete(`/notifications/${id}`);
      load();
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of orders, payments, reviews and enquiries."
        action={
          <Button variant="outline" size="sm" loading={markingAllRead} onClick={markAllRead}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : notifications.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Bell} title="No notifications" message="You're all caught up!" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {notifications.map((n) => (
            <div key={n._id} className={clsx("flex items-start gap-4 border-b border-cream-deep p-5 last:border-0", !n.read && "bg-gold/5")}>
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" style={{ visibility: n.read ? "hidden" : "visible" }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-ink-soft">{n.message}</p>
                <p className="mt-1 text-[11px] text-ink-soft/70">{timeAgo(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {!n.read && (
                  <button onClick={() => markRead(n._id)} disabled={actioningId === n._id} className="text-xs text-gold hover:underline disabled:opacity-50">
                    Mark read
                  </button>
                )}
                <button onClick={() => remove(n._id)} disabled={actioningId === n._id} className="text-ink-soft hover:text-red-600 disabled:opacity-50">
                  {actioningId === n._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
