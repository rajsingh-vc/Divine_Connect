import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  HandHeart,
  Clock3,
  Users,
  ClipboardList,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { cn } from "@/lib/utils";
import {
  approveVolunteer,
  createPermanentVolunteer,
  createTemporaryVolunteer,
  deleteVolunteer,
  getVolunteerStats,
  getVolunteersPage,
  rejectVolunteer,
  reviewVolunteer,
  updateVolunteer,
} from "@/api";

export const Route = createFileRoute("/admin/volunteers")({
  head: () => ({ meta: [{ title: "Volunteer Management — Sansthan Console" }] }),
  component: VolunteersPage,
});

const TABS = [
  { key: "all", label: "All Volunteers", status: undefined },
  { key: "roster", label: "Roster", status: "active" },
  { key: "applications", label: "Applications", status: "pending" },
  { key: "review", label: "Review", status: "approved" },
  { key: "rejected", label: "Rejected", status: "rejected" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type VolunteerRow = Awaited<ReturnType<typeof getVolunteersPage>>["rows"][number];

function VolunteersPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [addType, setAddType] = useState<"temporary" | "permanent" | null>(null);
  const [viewing, setViewing] = useState<VolunteerRow | null>(null);
  const [editing, setEditing] = useState<VolunteerRow | null>(null);
  const [deleting, setDeleting] = useState<VolunteerRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const activeTab = TABS.find((t) => t.key === tab)!;
  const queryClient = useQueryClient();

  const stats = useQuery({ queryKey: ["volunteerStats"], queryFn: getVolunteerStats });
  const list = useQuery({
    queryKey: ["volunteersPage", activeTab.status, search, page],
    queryFn: () => getVolunteersPage({ status: activeTab.status, search, page }),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["volunteersPage"] });
    queryClient.invalidateQueries({ queryKey: ["volunteerStats"] });
  }

  function switchTab(key: TabKey) {
    setTab(key);
    setPage(1);
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteVolunteer(deleting._id);
      toast.success(`${deleting.name} was removed.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error("Could not delete this volunteer. Please try again.");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Volunteer Management"
        subtitle="Register temporary and permanent volunteers, review applications, and manage the active roster."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Volunteers" value={String(stats.data?.active_volunteers ?? "—")} icon={Users} accent="amber" trend="flat" />
        <StatCard label="On Duty Now" value={String(stats.data?.on_duty_now ?? "—")} icon={HandHeart} accent="emerald" trend="flat" />
        <StatCard label="Permanent" value={String(stats.data?.permanent ?? "—")} icon={Clock3} accent="sky" trend="flat" />
        <StatCard label="Temporary" value={String(stats.data?.temporary ?? "—")} icon={ClipboardList} accent="rose" trend="flat" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-border bg-card p-1 w-fit overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or volunteer ID..."
              className="rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary w-56"
            />
          </div>
          <button
            onClick={() => setAddType("temporary")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" /> Temporary
          </button>
          <button
            onClick={() => setAddType("permanent")}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
          >
            <Plus className="h-3.5 w-3.5" /> Permanent
          </button>
        </div>
      </div>

      <div className="mt-4">
        <ChartCard title={activeTab.label}>
          <VolunteerTable
            tab={tab}
            rows={list.data?.rows || []}
            loading={list.isLoading}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={setDeleting}
            onChange={invalidate}
          />
          {list.data && <PaginationBar page={page} pageSize={20} count={list.data.count} onPageChange={setPage} />}
        </ChartCard>
      </div>

      {addType && (
        <AddVolunteerModal
          type={addType}
          onClose={() => setAddType(null)}
          onDone={() => {
            invalidate();
            setAddType(null);
          }}
        />
      )}

      {viewing && <VolunteerViewModal volunteer={viewing} onClose={() => setViewing(null)} />}

      {editing && (
        <VolunteerEditModal
          volunteer={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            invalidate();
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this volunteer?"
        description={`This will permanently remove ${deleting?.name ?? "this volunteer"} (${deleting?.id ?? ""}) from the system. This action cannot be undone.`}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}

function VolunteerTable({
  tab,
  rows,
  loading,
  onView,
  onEdit,
  onDelete,
  onChange,
}: {
  tab: TabKey;
  rows: VolunteerRow[];
  loading: boolean;
  onView: (v: VolunteerRow) => void;
  onEdit: (v: VolunteerRow) => void;
  onDelete: (v: VolunteerRow) => void;
  onChange: () => void;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  async function handleApprove(id: number) {
    setBusyId(id);
    try {
      await approveVolunteer(id);
      toast.success("Application approved — moved to Review.");
      onChange();
    } catch {
      toast.error("Could not approve this application.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id: number) {
    setBusyId(id);
    try {
      await rejectVolunteer(id, "Did not meet criteria");
      toast.success("Application rejected.");
      onChange();
    } catch {
      toast.error("Could not reject this application.");
    } finally {
      setBusyId(null);
    }
  }

  const baseColumns = [
    { key: "id", header: "Volunteer ID", render: (r: VolunteerRow) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "volunteerType",
      header: "Type",
      render: (r: VolunteerRow) => <span className="capitalize">{r.volunteerType}</span>,
    },
  ];

  const rowActions = (r: VolunteerRow) => (
    <div className="flex items-center gap-3">
      <button onClick={() => onView(r)} className="text-muted-foreground hover:text-primary" title="View">
        <Eye className="h-4 w-4" />
      </button>
      <button onClick={() => onEdit(r)} className="text-muted-foreground hover:text-primary" title="Edit">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={() => onDelete(r)} className="text-muted-foreground hover:text-rose-600" title="Delete">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (tab === "applications") {
    return (
      <>
        <DataTable
          rows={rows}
          loading={loading}
          empty={loading ? "Loading..." : "No pending applications."}
          columns={[
            ...baseColumns,
            {
              key: "act",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={busyId === r._id}
                    onClick={() => handleApprove(r._id)}
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={busyId === r._id}
                    onClick={() => handleReject(r._id)}
                    className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button onClick={() => setReviewingId(r._id)} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">
                    Review
                  </button>
                  {rowActions(r)}
                </div>
              ),
            },
          ]}
        />
        {reviewingId != null && <ReviewModal volunteerId={reviewingId} onClose={() => setReviewingId(null)} onDone={onChange} />}
      </>
    );
  }

  if (tab === "review") {
    return (
      <>
        <DataTable
          rows={rows}
          loading={loading}
          empty={loading ? "Loading..." : "No volunteers awaiting review."}
          columns={[
            ...baseColumns,
            {
              key: "act",
              header: "Actions",
              render: (r) => (
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setReviewingId(r._id)} className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                    Finalize into roster
                  </button>
                  {rowActions(r)}
                </div>
              ),
            },
          ]}
        />
        {reviewingId != null && <ReviewModal volunteerId={reviewingId} onClose={() => setReviewingId(null)} onDone={onChange} />}
      </>
    );
  }

  if (tab === "rejected") {
    return (
      <DataTable
        rows={rows}
        loading={loading}
        empty={loading ? "Loading..." : "No rejected applications."}
        columns={[...baseColumns, { key: "rejectionReason", header: "Reason" }, { key: "act", header: "Actions", render: rowActions }]}
      />
    );
  }

  if (tab === "roster") {
    return (
      <DataTable
        rows={rows}
        loading={loading}
        empty={loading ? "Loading..." : "No active volunteers yet."}
        columns={[
          ...baseColumns,
          { key: "assignedSeva", header: "Assigned Seva" },
          { key: "shift", header: "Shift" },
          { key: "act", header: "Actions", render: rowActions },
        ]}
      />
    );
  }

  // "all" tab
  return (
    <DataTable
      rows={rows}
      loading={loading}
      empty={loading ? "Loading..." : "No volunteers yet."}
      columns={[
        ...baseColumns,
        { key: "status", header: "Status" },
        { key: "act", header: "Actions", render: rowActions },
      ]}
    />
  );
}

function AddVolunteerModal({
  type,
  onClose,
  onDone,
}: {
  type: "temporary" | "permanent";
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referenceVolunteerName, setReferenceVolunteerName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [idProofType, setIdProofType] = useState<"aadhaar" | "pan" | "driving_licence">("aadhaar");
  const [idProofNumber, setIdProofNumber] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function onPhotoSelected(file: File | null) {
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (type === "temporary") {
        await createTemporaryVolunteer({ name, phone, email, reference_volunteer_name: referenceVolunteerName });
        toast.success(`${name} was registered as a temporary volunteer.`);
      } else {
        await createPermanentVolunteer({
          name,
          email,
          home_address: homeAddress,
          phone,
          id_proof_type: idProofType,
          id_proof_number: idProofNumber,
          photo,
        });
        toast.success(`${name} was registered as a permanent volunteer.`);
      }
      onDone();
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not register this volunteer.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold capitalize">Add {type} volunteer</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {type === "temporary"
            ? "Requires an existing volunteer's name as a reference for verification."
            : "Full registration with identity verification for the permanent roster."}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field label="Name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          </Field>

          {type === "temporary" && (
            <Field label="Reference Volunteer Name">
              <input
                required
                value={referenceVolunteerName}
                onChange={(e) => setReferenceVolunteerName(e.target.value)}
                placeholder="Must match an existing volunteer"
                className={inputCls}
              />
            </Field>
          )}

          {type === "permanent" && (
            <>
              <Field label="Home Address">
                <input required value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Verification Type">
                  <select value={idProofType} onChange={(e) => setIdProofType(e.target.value as any)} className={inputCls}>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving_licence">Driving Licence</option>
                  </select>
                </Field>
                <Field label="Verification Number">
                  <input required value={idProofNumber} onChange={(e) => setIdProofNumber(e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photo</label>
                <div className="mt-1 flex items-center gap-3">
                  {photoPreview ? (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
                      <button
                        type="button"
                        onClick={() => onPhotoSelected(null)}
                        className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-rose-600 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
                      <Camera className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload photo
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
                    >
                      <Camera className="h-3.5 w-3.5" /> Take photo
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPhotoSelected(e.target.files?.[0] ?? null)}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => onPhotoSelected(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
              Cancel
            </button>
            <button disabled={saving} className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50">
              {saving ? "Saving..." : "Register volunteer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VolunteerEditModal({
  volunteer,
  onClose,
  onDone,
}: {
  volunteer: VolunteerRow;
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(volunteer.name);
  const [email, setEmail] = useState(volunteer.email);
  const [phone, setPhone] = useState(volunteer.phone);
  const [homeAddress, setHomeAddress] = useState(volunteer.homeAddress || "");
  const [idProofType, setIdProofType] = useState(volunteer.idProofType || "aadhaar");
  const [idProofNumber, setIdProofNumber] = useState(volunteer.idProofNumber || "");
  const [zone, setZone] = useState(volunteer.zone || "");
  const [shift, setShift] = useState(volunteer.shift || "");
  const [assignedSeva, setAssignedSeva] = useState(volunteer.assignedSeva || "");
  const [photo, setPhoto] = useState<File | null | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | null>(volunteer.photo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, any> = {
        name,
        email,
        phone,
        zone,
        shift,
        assigned_seva: assignedSeva,
      };
      if (volunteer.volunteerType === "permanent") {
        payload.home_address = homeAddress;
        payload.id_proof_type = idProofType;
        payload.id_proof_number = idProofNumber;
      }
      await updateVolunteer(volunteer._id, payload, photo);
      toast.success(`${name} was updated.`);
      onDone();
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not update this volunteer.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Edit volunteer</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {volunteer.id} · <span className="capitalize">{volunteer.volunteerType}</span>
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field label="Name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          </Field>

          {volunteer.volunteerType === "permanent" && (
            <>
              <Field label="Home Address">
                <input value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Verification Type">
                  <select value={idProofType} onChange={(e) => setIdProofType(e.target.value)} className={inputCls}>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving_licence">Driving Licence</option>
                  </select>
                </Field>
                <Field label="Verification Number">
                  <input value={idProofNumber} onChange={(e) => setIdProofNumber(e.target.value)} className={inputCls} />
                </Field>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photo</label>
                <div className="mt-1 flex items-center gap-3">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
                      <Camera className="h-5 w-5" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
                  >
                    <Upload className="h-3.5 w-3.5" /> Replace photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setPhoto(f);
                      setPhotoPreview(f ? URL.createObjectURL(f) : photoPreview);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {volunteer.rawStatus === "active" && (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Zone">
                <input value={zone} onChange={(e) => setZone(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Shift">
                <input value={shift} onChange={(e) => setShift(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Assigned Seva">
                <input value={assignedSeva} onChange={(e) => setAssignedSeva(e.target.value)} className={inputCls} />
              </Field>
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
              Cancel
            </button>
            <button disabled={saving} className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50">
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VolunteerViewModal({ volunteer, onClose }: { volunteer: VolunteerRow; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Volunteer ID", volunteer.id],
    ["Name", volunteer.name],
    ["Email", volunteer.email || "—"],
    ["Phone", volunteer.phone || "—"],
    ["Type", volunteer.volunteerType],
    ["Status", volunteer.status],
  ];
  if (volunteer.volunteerType === "temporary") {
    rows.push(["Reference Volunteer", volunteer.referenceVolunteerName || "—"]);
  } else {
    rows.push(
      ["Home Address", volunteer.homeAddress || "—"],
      ["Verification Type", volunteer.idProofTypeDisplay || "—"],
      ["Verification Number", volunteer.idProofNumber || "—"],
    );
  }
  rows.push(
    ["Zone", volunteer.zone || "—"],
    ["Shift", volunteer.shift || "—"],
    ["Assigned Seva", volunteer.assignedSeva || "—"],
    ["Hours Logged", String(volunteer.hours)],
    ["Applied", new Date(volunteer.appliedAt).toLocaleDateString()],
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          {volunteer.photo ? (
            <img src={volunteer.photo} alt={volunteer.name} className="h-14 w-14 rounded-full object-cover border border-border" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary font-semibold">
              {volunteer.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-serif text-lg font-semibold">{volunteer.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{volunteer.volunteerType} volunteer</p>
          </div>
        </div>
        <dl className="mt-4 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium capitalize text-right">{value}</dd>
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

function ReviewModal({ volunteerId, onClose, onDone }: { volunteerId: number; onClose: () => void; onDone: () => void }) {
  const [assignedSeva, setAssignedSeva] = useState("");
  const [shift, setShift] = useState("");
  const [zone, setZone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      await reviewVolunteer(volunteerId, { assigned_seva: assignedSeva, shift, zone });
      toast.success("Volunteer finalized into the roster.");
      onDone();
      onClose();
    } catch {
      const msg = "Could not finalize this volunteer. Please check the fields and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Finalize volunteer</h3>
        <p className="mt-1 text-xs text-muted-foreground">Assign a seva, shift and zone to move this volunteer onto the active roster.</p>
        <div className="mt-4 space-y-3">
          <Field label="Assigned Seva">
            <input value={assignedSeva} onChange={(e) => setAssignedSeva(e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Shift">
            <input value={shift} onChange={(e) => setShift(e.target.value)} required className={inputCls} />
          </Field>
          <Field label="Zone (optional)">
            <input value={zone} onChange={(e) => setZone(e.target.value)} className={inputCls} />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
            Cancel
          </button>
          <button
            disabled={saving || !assignedSeva || !shift}
            onClick={submit}
            className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
          >
            {saving ? "Saving..." : "Finalize"}
          </button>
        </div>
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
