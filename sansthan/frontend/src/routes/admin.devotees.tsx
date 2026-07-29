import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Users, Star, UserCheck, Wallet, Plus, Search, Pencil, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { createDevotee, deleteDevotee, getDevotees, updateDevotee, type DevoteePayload } from "@/api";

export const Route = createFileRoute("/admin/devotees")({
  head: () => ({ meta: [{ title: "Devotee Management — Sansthan Console" }] }),
  component: DevoteesPage,
});

type DevoteeRow = Awaited<ReturnType<typeof getDevotees>>["rows"][number];

function DevoteesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<DevoteeRow | null>(null);
  const [viewing, setViewing] = useState<DevoteeRow | null>(null);
  const [deleting, setDeleting] = useState<DevoteeRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: ["devotees", page, search],
    queryFn: () => getDevotees({ page, search }),
  });

  const allDevotees = useQuery({ queryKey: ["devotees", "all-for-stats"], queryFn: () => getDevotees({}) });
  const vipStats = useQuery({ queryKey: ["devotees", "vip-count"], queryFn: () => getDevotees({ tier: "vip" }) });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["devotees"] });
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteDevotee(deleting._id);
      toast.success(`${deleting.name} was removed.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error("Could not delete this devotee. Please try again.");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Devotee Management"
        subtitle="Search, profile, visit history, donations, and bookings for every devotee."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Devotees" value={String(allDevotees.data?.count ?? "—")} icon={Users} accent="amber" trend="flat" />
        <StatCard label="VIP Devotees" value={String(vipStats.data?.count ?? "—")} icon={Star} accent="amber" trend="flat" />
        <StatCard
          label="Total Visits"
          value={String(allDevotees.data?.rows.reduce((s, d) => s + d.visits, 0) ?? "—")}
          icon={UserCheck}
          accent="sky"
          trend="flat"
        />
        <StatCard
          label="Total Donated"
          value={
            allDevotees.data
              ? `₹${allDevotees.data.rows.reduce((s, d) => s + d.donatedRaw, 0).toLocaleString("en-IN")}`
              : "—"
          }
          icon={Wallet}
          accent="emerald"
          trend="flat"
        />
      </div>

      <div className="mt-6">
        <ChartCard
          title="All devotees"
          action={
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name or ID..."
                  className="rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" /> Add devotee
              </button>
            </div>
          }
        >
          <DataTable
            rows={q.data?.rows || []}
            empty={q.isLoading ? "Loading..." : "No devotees found."}
            columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "name", header: "Name" },
              { key: "mobile", header: "Mobile" },
              { key: "city", header: "City" },
              { key: "visits", header: "Visits" },
              { key: "donated", header: "Donated", render: (r) => <span className="font-semibold">{r.donated}</span> },
              { key: "tier", header: "Tier", render: (r) => <StatusBadge status={r.tier} /> },
              {
                key: "act",
                header: "Actions",
                render: (r) => (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewing(r)} className="text-muted-foreground hover:text-primary" title="View">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditing(r)} className="text-muted-foreground hover:text-primary" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleting(r)} className="text-muted-foreground hover:text-rose-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
          {q.data && <PaginationBar page={page} pageSize={20} count={q.data.count} onPageChange={setPage} />}
        </ChartCard>
      </div>

      {addOpen && (
        <DevoteeFormModal
          title="Add devotee"
          onClose={() => setAddOpen(false)}
          onSubmit={async (payload) => {
            await createDevotee(payload);
            toast.success(`${payload.name} was added to the devotee list.`);
            invalidate();
            setAddOpen(false);
          }}
        />
      )}

      {editing && (
        <DevoteeFormModal
          title="Edit devotee"
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (payload) => {
            await updateDevotee(editing._id, payload);
            toast.success(`${payload.name} was updated.`);
            invalidate();
            setEditing(null);
          }}
        />
      )}

      {viewing && <DevoteeViewModal devotee={viewing} onClose={() => setViewing(null)} />}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this devotee?"
        description={`This will permanently remove ${deleting?.name ?? "this devotee"} (${deleting?.id ?? ""}) from the system. This action cannot be undone.`}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}

function DevoteeFormModal({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: DevoteeRow;
  onClose: () => void;
  onSubmit: (payload: DevoteePayload) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [mobile, setMobile] = useState(initial?.mobile ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [visits, setVisits] = useState(String(initial?.visits ?? 0));
  const [donated, setDonated] = useState(String(initial?.donatedRaw ?? 0));
  const [tier, setTier] = useState<"member" | "vip">(initial?.tierRaw ?? "member");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name,
        mobile,
        city,
        visits: Number(visits) || 0,
        total_donated: Number(donated) || 0,
        tier,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this devotee.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">{title}</h3>
        {initial && (
          <p className="mt-1 text-xs text-muted-foreground">
            ID: <span className="font-mono">{initial.id}</span> (auto-generated)
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field label="Name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Mobile">
            <input required value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputCls} />
          </Field>
          <Field label="City">
            <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Visits">
              <input type="number" min={0} required value={visits} onChange={(e) => setVisits(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Donated (₹)">
              <input type="number" min={0} required value={donated} onChange={(e) => setDonated(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Tier">
            <select value={tier} onChange={(e) => setTier(e.target.value as "member" | "vip")} className={inputCls}>
              <option value="member">Member</option>
              <option value="vip">VIP</option>
            </select>
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
              Cancel
            </button>
            <button disabled={saving} className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DevoteeViewModal({ devotee, onClose }: { devotee: DevoteeRow; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Devotee ID", devotee.id],
    ["Name", devotee.name],
    ["Email", devotee.email || "—"],
    ["Mobile", devotee.mobile || "—"],
    ["City", devotee.city || "—"],
    ["Visits", String(devotee.visits)],
    ["Total Donated", devotee.donated],
    ["Tier", devotee.tier],
    ["Member Since", new Date(devotee.createdAt).toLocaleDateString()],
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Devotee details</h3>
        <dl className="mt-4 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <button onClick={onClose} className="mt-5 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
