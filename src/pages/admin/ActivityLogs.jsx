import { useEffect, useState, useCallback } from "react";
import { Search, History } from "lucide-react";
import { adminApi } from "../../lib/api.js";
import { formatDateTime } from "../../lib/format.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function AdminActivityLogs() {
  const { admin } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    adminApi
      .get("/activity-logs", { params: { search, page, limit: 20 } })
      .then(({ data }) => {
        setLogs(data.logs);
        setPagination(data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (admin?.role !== "super_admin") {
    return (
      <div className="rounded-lg bg-white p-10 shadow-sm">
        <EmptyState icon={History} title="Restricted" message="Only Super Admins can view activity logs." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Activity Logs" description="Track important admin actions across your store." />

      <div className="mb-4 flex items-center gap-2 rounded-md border border-cream-deep bg-white px-4 py-2.5">
        <Search size={15} className="text-ink-soft" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by admin or action..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-4">Admin</th>
              <th className="p-4">Action</th>
              <th className="p-4">Description</th>
              <th className="p-4">Date &amp; Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-ink-soft">Loading...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-ink-soft">No activity recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="border-b border-cream-deep last:border-0">
                  <td className="p-4 text-sm font-medium text-ink">{log.userName || "System"}</td>
                  <td className="p-4 text-sm text-gold">{log.action}</td>
                  <td className="p-4 text-sm text-ink-soft">{log.description}</td>
                  <td className="p-4 text-sm text-ink-soft">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
    </div>
  );
}
