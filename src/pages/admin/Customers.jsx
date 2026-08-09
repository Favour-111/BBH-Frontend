import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { adminApi } from "../../lib/api.js";
import { formatNaira, formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    adminApi
      .get("/customers", { params: { search, page, limit: 10 } })
      .then(({ data }) => {
        setCustomers(data.customers);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div>
      <PageHeader title="Customers" description="View and manage your customer base." />

      <div className="mb-4 flex items-center gap-2 rounded-md border border-cream-deep bg-white px-4 py-2.5">
        <Search size={15} className="text-ink-soft" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-soft">Loading customers...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-soft">No customers found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-b border-cream-deep last:border-0 hover:bg-cream/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/50 text-sm font-medium text-gold">
                        {c.name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{c.name}</p>
                        <p className="text-xs text-ink-soft">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-ink-soft">{c.phone || " "}</td>
                  <td className="p-4 text-sm">{c.orderCount}</td>
                  <td className="p-4 text-sm font-medium">{formatNaira(c.totalSpent)}</td>
                  <td className="p-4 text-sm text-ink-soft">{formatDate(c.createdAt)}</td>
                  <td className="p-4">
                    <Badge tone={c.status === "active" ? "green" : "red"}>{c.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Link to={`/admin/customers/${c._id}`} className="text-ink-soft hover:text-gold">
                      <Eye size={15} />
                    </Link>
                  </td>
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
