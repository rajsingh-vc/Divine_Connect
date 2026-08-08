import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Eye, Check, X as XIcon, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/chart-card";
import { DataTable } from "@/components/admin/data-table";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { StatusBadge } from "@/components/volunteers/status-badge";
import { CountdownTimer } from "@/components/volunteers/countdown-timer";
import {
  adminAction,
  deleteVolunteer,
  getVolunteerApprovalsPage,
  getVolunteerAuditLog,
  getVolunteerDetail,
  type VolunteerRow,
} from "@/api/volunteer-verification";
import { useVolunteerSocket } from "@/hooks/use-volunteer-socket";

export const Route = createFileRoute("/admin/volunteer-approvals")({
  head: () => ({ meta: [{ title: "Volunteer Approval Management — Sansthan Console" }] }),
  component: VolunteerApprovalsPage,
});

// Status tabs shown above the table. `value: undefined` maps to "All" (no
// status filter param sent to the backend, matching getVolunteerApprovalsPage's
// existing status_filter behavior).
const STATUS_TABS: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending_volunteer_approval" },
  { label: "Volunteer Approved", value: "volunteer_approved" },
  { label: "Volunteer Rejected", value: "volunteer_rejected" },
  { label: "Admin Approved", value: "admin_approved" },
  { label: "Admin Rejected", value: "admin_rejected" },
  { label: "Auto Rejected", value: "auto_rejected" },
];

// DRF returns errors in different shapes depending on where they came from:
// - {"detail": "..."} for permission/logic errors (e.g. our admin_action view)
// - {"field_name": ["message"]} for serializer validation errors
// This pulls a readable message out of either shape instead of falling back
// to a generic "Action failed." for validation errors.
function extractErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (!data) return "Action failed.";
  if (typeof data.detail === "string") return data.detail;
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const firstVal = data[firstKey];
    if (Array.isArray(firstVal)) return String(firstVal[0]);
    if (typeof firstVal === "string") return firstVal;
  }
  return "Action failed.";
}

// Small clickable thumbnail for a document field — opens the full-size
// image (served from MEDIA_URL via the absolute URL DRF's ImageField
// returns) in a new tab. Renders nothing if the doc wasn't uploaded.
function DocThumb({ label, url }: { label: string; url: string | null | undefined }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <img src={url} alt={label} className="h-24 w-full rounded-md border object-cover" />
      <p className="mt-1 text-center text-xs text-muted-foreground">{label}</p>
    </a>
  );
}

function VolunteerApprovalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<VolunteerRow | null>(null);
  // Backend now requires a reason on reject — this holds the id being
  // rejected while the small reason prompt below is open.
  const [rejecting, setRejecting] = useState<{ id: number; reason: string } | null>(null);
  // Volunteer pending delete confirmation — holds id + name so the confirm
  // dialog can show who's about to be permanently removed.
  const [deleting, setDeleting] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  useVolunteerSocket(); // live status updates, no manual refresh needed

  const list = useQuery({
    queryKey: ["volunteerApprovalsPage", status, search, page],
    queryFn: () => getVolunteerApprovalsPage({ status, search, page }),
  });

  const auditLog = useQuery({
    queryKey: ["volunteerAuditLog", viewing?.id],
    queryFn: () => getVolunteerAuditLog(viewing!.id),
    enabled: !!viewing,
  });

  // VolunteerRow (list serializer) doesn't include documents — only
  // VolunteerDetailSerializer does, via getVolunteerDetail(). Fetch it
  // separately when the drawer opens so we can render the uploaded docs.
  const detail = useQuery({
    queryKey: ["volunteerDetail", viewing?.id],
    queryFn: () => getVolunteerDetail(viewing!.id),
    enabled: !!viewing,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["volunteerApprovalsPage"] });
  }

  async function handleAction(id: number, action: "approve" | "reject", override = false, reason = "") {
    try {
      await adminAction(id, action, override, reason);
      toast.success(`Volunteer ${action}d.`);
      invalidate();
      setViewing(null);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    }
  }

  async function confirmReject() {
    if (!rejecting || !rejecting.reason.trim()) {
      toast.error("A reason is required to reject.");
      return;
    }
    await handleAction(rejecting.id, "reject", false, rejecting.reason.trim());
    setRejecting(null);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      // DELETE /api/volunteers/volunteers/{id}/ — backend cascades this to
      // the volunteer's Verification, VolunteerApproval, AuditLog, and
      // Notification rows too, so nothing is left orphaned in the DB.
      await deleteVolunteer(deleting.id);
      toast.success(`${deleting.name} deleted.`);
      invalidate();
      setDeleting(null);
      setViewing(null);
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Approval Management"
        subtitle="Review reference decisions and approve or reject new volunteer applications."
      />

      {/* Status tabs — switching tabs re-queries getVolunteerApprovalsPage with
          that status, so approving/rejecting a volunteer (which invalidates
          this query) moves them into the right tab immediately. */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`rounded-md px-3 py-1.5 text-sm ${
              status === tab.value ? "bg-primary text-white" : "border text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full rounded-md border py-2 pl-8 pr-3 text-sm"
            placeholder="Search name, phone, email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <DataTable
        loading={list.isLoading}
        columns={[
          { key: "name", header: "Volunteer Name" },
          { key: "phone", header: "Phone" },
          { key: "email", header: "Email" },
          { key: "reference_volunteer_name", header: "Reference Volunteer" },
          {
            key: "public_id",
            header: "Volunteer ID",
            render: (row: VolunteerRow) => row.public_id ?? "—",
          },
          {
            key: "status",
            header: "Admin Status",
            render: (row: VolunteerRow) => <StatusBadge status={row.status} />,
          },
          {
            key: "created_at",
            header: "Submitted Date",
            render: (row: VolunteerRow) => new Date(row.created_at).toLocaleDateString(),
          },
          {
          //   key: "time_remaining",
          //   header: "Time Remaining",
          //   render: (row: VolunteerRow) =>
          //     row.approval && row.approval.reference_status === "pending" ? (
          //       <CountdownTimer deadline={row.approval.deadline} />
          //     ) : (
          //       "—"
          //     ),
          // },
          // {
            key: "actions",
            header: "Actions",
            render: (row: VolunteerRow) => (
              <div className="flex items-center gap-2">
                <button onClick={() => setViewing(row)} className="rounded p-1 hover:bg-muted" title="View Details">
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAction(row.id, "approve")}
                  className="rounded p-1 text-green-600 hover:bg-green-50"
                  title="Approve"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRejecting({ id: row.id, reason: "" })}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  title="Reject"
                >
                  <XIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting({ id: row.id, name: row.name })}
                  className="rounded p-1 text-red-700 hover:bg-red-100"
                  title="Delete permanently"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
        rows={list.data?.rows ?? []}
      />

      <PaginationBar
        page={page}
        onPageChange={setPage}
        count={list.data?.count ?? 0}
        pageSize={20}
      />

      {/* Detail / audit-log drawer */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setViewing(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{viewing.name}</h2>
              <button onClick={() => setViewing(null)} className="text-sm text-muted-foreground">
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Code:</span> {viewing.volunteer_code}</p>
              <p><span className="font-medium">Volunteer ID:</span> {viewing.public_id ?? "Not yet assigned"}</p>
              <p><span className="font-medium">Phone:</span> {viewing.phone}</p>
              <p><span className="font-medium">Email:</span> {viewing.email}</p>
              <p><span className="font-medium">Reference:</span> {viewing.reference_volunteer_name || "—"}</p>
              <p><span className="font-medium">Reference comment:</span> {viewing.approval?.reference_comment || "—"}</p>
              <p className="flex items-center gap-2"><span className="font-medium">Status:</span> <StatusBadge status={viewing.status} /></p>
              {viewing.approval?.reference_status === "rejected" && (
                <p className="text-xs text-amber-600">
                  Reference rejected. Approving now requires an override.
                </p>
              )}
            </div>

            {/* Uploaded documents — fetched via getVolunteerDetail since the
                list serializer (VolunteerRow) doesn't include them. */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">Documents</h3>
              {detail.isLoading && <p className="text-xs text-muted-foreground">Loading documents…</p>}
              {detail.data && (
                <div className="grid grid-cols-3 gap-2">
                  <DocThumb label="Profile Photo" url={detail.data.profile_photo} />
                  <DocThumb label="Aadhaar Front" url={detail.data.verification?.aadhaar_front} />
                  <DocThumb label="Aadhaar Back" url={detail.data.verification?.aadhaar_back} />
                  <DocThumb label="PAN Front" url={detail.data.verification?.pan_front} />
                  <DocThumb label="PAN Back" url={detail.data.verification?.pan_back} />
                  <DocThumb label="License Front" url={detail.data.verification?.license_front} />
                  <DocThumb label="License Back" url={detail.data.verification?.license_back} />
                  <DocThumb label="Live Photo" url={detail.data.verification?.live_photo} />
                </div>
              )}
              {detail.data &&
                !detail.data.profile_photo &&
                !Object.values(detail.data.verification || {}).some((v) => typeof v === "string" && v) && (
                  <p className="text-xs text-muted-foreground">No documents uploaded.</p>
                )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  handleAction(viewing.id, "approve", viewing.approval?.reference_status === "rejected")
                }
                className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white"
              >
                Approve
              </button>
              <button
                onClick={() => setRejecting({ id: viewing.id, reason: "" })}
                className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white"
              >
                Reject
              </button>
            </div>

            <button
              onClick={() => setDeleting({ id: viewing.id, name: viewing.name })}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Permanently
            </button>

            <h3 className="mb-2 mt-6 text-sm font-semibold">Audit Log</h3>
            <div className="space-y-2 text-xs">
              {auditLog.data?.map((log) => (
                <div key={log.id} className="rounded border p-2">
                  <p className="font-medium">{log.action.replace(/_/g, " ")}</p>
                  <p className="text-muted-foreground">
                    {log.actor_name || "System"} · {new Date(log.created_at).toLocaleString()}
                  </p>
                  {log.detail && <p className="text-muted-foreground">{log.detail}</p>}
                </div>
              ))}
              {auditLog.data?.length === 0 && <p className="text-muted-foreground">No actions logged yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Reject-reason prompt — backend requires a non-empty reason on reject */}
      {rejecting && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40" onClick={() => setRejecting(null)}>
          <div className="w-full max-w-sm rounded-lg bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold">Reason for rejection</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Shown to the applicant and saved to the audit log — e.g. "Blurry document photo".
            </p>
            <textarea
              autoFocus
              rows={3}
              className="mt-3 w-full rounded-md border p-2 text-sm"
              placeholder="Reason…"
              value={rejecting.reason}
              onChange={(e) => setRejecting({ ...rejecting, reason: e.target.value })}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setRejecting(null)}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejecting.reason.trim()}
                className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation — permanent, cascades to Verification,
          VolunteerApproval, AuditLog, and Notification rows in the DB. */}
      {deleting && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40" onClick={() => !isDeleting && setDeleting(null)}>
          <div className="w-full max-w-sm rounded-lg bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-red-700">Delete {deleting.name}?</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              This permanently removes the volunteer, their documents, and their full history. This cannot be undone.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDeleting(null)}
                disabled={isDeleting}
                className="flex-1 rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-700 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}