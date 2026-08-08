import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  ClipboardList, Clock, CircleCheck, HelpCircle, Plus, Pencil, Trash2,
  Check, Play, ArrowLeftRight, X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  assignDuty, deleteDuty, getDuties, updateDuty, acceptDuty, startDuty, completeDuty,
  requestDutyHelp, getSwapCandidates, respondToSwap,
  type Duty, type DutyAssignPayload, type SwapCandidate,
} from "@/api/duties";
import { getVolunteers } from "@/api";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/lib/permissions";
import { useAuth } from "@/lib/auth-context";
import { MealSection } from "@/components/volunteers/meal-section";

export const Route = createFileRoute("/admin/duties")({
  head: () => ({ meta: [{ title: "Duties — Sansthan Console" }] }),
  component: DutiesPage,
});

const STATUS_LABEL: Record<Duty["status"], string> = {
  assigned: "Pending",
  accepted: "Accepted",
  in_progress: "In Progress",
  completed: "Completed",
  help_requested: "Help Requested",
  swap_requested: "Swap Requested",
};

function DutiesPage() {
  const { isVolunteer, canManageDuties, canEditOwn } = usePermissions();
  const { user } = useAuth();

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Duty | null>(null);
  const [deleting, setDeleting] = useState<Duty | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);
  const [helpRequestFor, setHelpRequestFor] = useState<Duty | null>(null);
  const queryClient = useQueryClient();

  const q = useQuery({ queryKey: ["allDuties"], queryFn: () => getDuties() });

  const volunteers = useQuery({
    queryKey: ["volunteersForDuties"],
    queryFn: () => getVolunteers({ is_volunteer: "true" }),
    enabled: canManageDuties,
  });

  const allDuties = q.data ?? [];
  // Volunteers see duties assigned to them, plus any duty someone has asked
  // to swap onto them (so they can accept/decline it even before it's "theirs").
  const duties = isVolunteer
    ? allDuties.filter(
        (d) => d.volunteer_name === user?.full_name || d.swap_requested_with_name === user?.full_name,
      )
    : allDuties;

  const pendingCount = duties.filter((d) => d.status === "assigned" || d.status === "accepted" || d.status === "in_progress").length;
  const doneCount = duties.filter((d) => d.status === "completed").length;
  const helpCount = duties.filter((d) => d.status === "help_requested" || d.status === "swap_requested").length;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["allDuties"] });
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteDuty(deleting.id);
      toast.success(`${deleting.title} was removed.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error("Could not delete this duty. Please try again.");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleAccept(duty: Duty) {
    setActingId(duty.id);
    try {
      await acceptDuty(duty.id);
      toast.success(`${duty.title} accepted.`);
      invalidate();
    } catch {
      toast.error("Could not accept this duty. Please try again.");
    } finally {
      setActingId(null);
    }
  }

  async function handleStart(duty: Duty) {
    setActingId(duty.id);
    try {
      await startDuty(duty.id);
      toast.success(`${duty.title} started.`);
      invalidate();
    } catch {
      toast.error("Could not start this duty. Please try again.");
    } finally {
      setActingId(null);
    }
  }

  async function handleComplete(duty: Duty) {
    setActingId(duty.id);
    try {
      await completeDuty(duty.id);
      toast.success(`${duty.title} marked complete.`);
      invalidate();
    } catch {
      toast.error("Could not complete this duty. Please try again.");
    } finally {
      setActingId(null);
    }
  }

  async function handleSwapResponse(duty: Duty, action: "accept" | "decline") {
    setActingId(duty.id);
    try {
      await respondToSwap(duty.id, action);
      toast.success(action === "accept" ? `You've taken over "${duty.title}".` : `Swap request for "${duty.title}" declined.`);
      invalidate();
    } catch {
      toast.error("Could not respond to this swap request. Please try again.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title={isVolunteer ? "My Duties" : "Duties"}
        subtitle={
          isVolunteer
            ? "Today's duties assigned to you — accept, start, and complete as you go."
            : "Assign today's duties to volunteers — they're notified instantly, and you're notified when they complete or need help."
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={isVolunteer ? "My Duties" : "Total Duties"} value={String(duties.length)} icon={ClipboardList} accent="amber" trend="flat" />
        <StatCard label="Pending" value={String(pendingCount)} icon={Clock} accent="sky" trend="flat" />
        <StatCard label="Completed" value={String(doneCount)} icon={CircleCheck} accent="emerald" trend="flat" />
        <StatCard label="Help Requested" value={String(helpCount)} icon={HelpCircle} accent="rose" trend="flat" />
      </div>

      <div className="mt-6">
        <ChartCard
          title={isVolunteer ? "Today's duties" : "All duties"}
          action={
            canManageDuties ? (
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" /> Assign duty
              </button>
            ) : undefined
          }
        >
          <DataTable
            rows={duties}
            empty={q.isLoading ? "Loading..." : isVolunteer ? "No duties assigned to you yet." : "No duties assigned yet."}
            columns={[
              { key: "duty_code", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.duty_code}</span> },
              { key: "title", header: "Title" },
              { key: "volunteer_name", header: "Volunteer" },
              { key: "duty_date", header: "Date", render: (r) => new Date(r.duty_date).toLocaleDateString() },
              { key: "priority", header: "Priority", render: (r) => <span className="text-xs capitalize">{r.priority}</span> },
              {
                key: "status",
                header: "Status",
                render: (r) => (
                  <div className="flex flex-col gap-0.5">
                    <StatusBadge status={STATUS_LABEL[r.status]} />
                    {r.status === "swap_requested" && r.swap_requested_with_name && (
                      <span className="text-[10px] text-muted-foreground">→ {r.swap_requested_with_name}</span>
                    )}
                  </div>
                ),
              },
              {
                key: "act",
                header: "Actions",
                render: (r) => {
                  const isMine = r.volunteer_name === user?.full_name;
                  const isSwapTarget = r.status === "swap_requested" && r.swap_requested_with_name === user?.full_name;

                  return (
                    <div className="flex items-center gap-3">
                      {/* Volunteer responding to an incoming swap request */}
                      {isVolunteer && isSwapTarget && (
                        <>
                          <button
                            onClick={() => handleSwapResponse(r, "accept")}
                            disabled={actingId === r.id}
                            className="text-muted-foreground hover:text-emerald-600 disabled:opacity-50"
                            title="Accept swap"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSwapResponse(r, "decline")}
                            disabled={actingId === r.id}
                            className="text-muted-foreground hover:text-rose-600 disabled:opacity-50"
                            title="Decline swap"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Volunteer self-service on their own duty */}
                      {canEditOwn(r.volunteer_name) && !canManageDuties && isMine && (
                        <>
                          {r.status === "assigned" && (
                            <button
                              onClick={() => handleAccept(r)}
                              disabled={actingId === r.id}
                              className="text-muted-foreground hover:text-primary disabled:opacity-50"
                              title="Accept duty"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {r.status === "accepted" && (
                            <button
                              onClick={() => handleStart(r)}
                              disabled={actingId === r.id}
                              className="text-muted-foreground hover:text-primary disabled:opacity-50"
                              title="Start duty"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {r.status === "in_progress" && (
                            <button
                              onClick={() => handleComplete(r)}
                              disabled={actingId === r.id}
                              className="text-muted-foreground hover:text-emerald-600 disabled:opacity-50"
                              title="Mark complete"
                            >
                              <CircleCheck className="h-4 w-4" />
                            </button>
                          )}
                          {(r.status === "assigned" || r.status === "accepted" || r.status === "in_progress") && (
                            <button
                              onClick={() => setHelpRequestFor(r)}
                              disabled={actingId === r.id}
                              className="text-muted-foreground hover:text-rose-600 disabled:opacity-50"
                              title="Request help / swap"
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}

                      {/* Admin full CRUD */}
                      {canManageDuties && (
                        <>
                          <button onClick={() => setEditing(r)} className="text-muted-foreground hover:text-primary" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleting(r)} className="text-muted-foreground hover:text-rose-600" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                },
              },
            ]}
          />
        </ChartCard>
      </div>

      <MealSection />

      {addOpen && canManageDuties && (
        <DutyFormModal
          title="Assign duty"
          volunteers={volunteers.data ?? []}
          onClose={() => setAddOpen(false)}
          onSubmit={async (payload) => {
            const created = await assignDuty(payload);
            toast.success(`"${payload.title}" assigned to ${created.length} volunteer(s). They've been notified.`);
            invalidate();
            setAddOpen(false);
          }}
        />
      )}

      {editing && canManageDuties && (
        <DutyFormModal
          title="Edit duty"
          initial={editing}
          volunteers={volunteers.data ?? []}
          onClose={() => setEditing(null)}
          onSubmit={async (payload) => {
            await updateDuty(editing.id, {
              volunteer: payload.volunteer_ids[0],
              title: payload.title,
              instructions: payload.instructions,
              location: payload.location,
              duty_date: payload.duty_date,
              time: payload.time,
              priority: payload.priority,
            });
            toast.success(`${payload.title} was updated.`);
            invalidate();
            setEditing(null);
          }}
        />
      )}

      {helpRequestFor && (
        <HelpRequestModal
          duty={helpRequestFor}
          onClose={() => setHelpRequestFor(null)}
          onSubmitted={() => {
            invalidate();
            setHelpRequestFor(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this duty?"
        description={`This will permanently remove "${deleting?.title ?? "this duty"}" (${deleting?.duty_code ?? ""}). This action cannot be undone.`}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}

function HelpRequestModal({
  duty,
  onClose,
  onSubmitted,
}: {
  duty: Duty;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [mode, setMode] = useState<"help" | "swap">("help");
  const [note, setNote] = useState("");
  const [swapWith, setSwapWith] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const candidates = useQuery({
    queryKey: ["swapCandidates", duty.id],
    queryFn: () => getSwapCandidates(duty.id),
    enabled: mode === "swap",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "swap" && !swapWith) {
      toast.error("Select a volunteer to swap with.");
      return;
    }
    setSaving(true);
    try {
      await requestDutyHelp(duty.id, note, mode === "swap" ? swapWith : undefined);
      toast.success(
        mode === "swap" ? "Swap request sent — they'll need to accept it." : "Help requested — admins have been notified.",
      );
      onSubmitted();
    } catch {
      toast.error("Could not send this request. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold">Need help with "{duty.title}"?</h3>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("help")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              mode === "help" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            Just need help
          </button>
          <button
            type="button"
            onClick={() => setMode("swap")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              mode === "swap" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            Swap with someone
          </button>
        </div>

        {mode === "swap" && (
          <div className="mt-3">
            <label className="block text-xs font-medium text-muted-foreground">Swap with</label>
            <div className="mt-1 max-h-48 overflow-y-auto rounded-lg border border-border">
              {candidates.isLoading && <p className="p-3 text-sm text-muted-foreground">Loading volunteers...</p>}
              {candidates.data?.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground">No eligible volunteers found.</p>
              )}
              {candidates.data?.map((v: SwapCandidate) => (
                <label
                  key={v.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 border-b border-border px-3 py-2 text-sm last:border-0 hover:bg-muted/60",
                    swapWith === v.id && "bg-primary/5",
                  )}
                >
                  <input
                    type="radio"
                    name="swapWith"
                    checked={swapWith === v.id}
                    onChange={() => setSwapWith(v.id)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{v.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{v.volunteer_code}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <label className="mt-3 block text-xs font-medium text-muted-foreground">Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
          placeholder={mode === "swap" ? "Why you'd like to swap..." : "What kind of help do you need..."}
        />

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-1.5 text-sm">
            Cancel
          </button>
          <button disabled={saving} className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background disabled:opacity-50">
            {saving ? "Sending..." : mode === "swap" ? "Send swap request" : "Request help"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DutyFormModal({
  title,
  initial,
  volunteers,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: Duty;
  volunteers: { _id: number; name: string; email?: string }[];
  onClose: () => void;
  onSubmit: (payload: DutyAssignPayload) => Promise<void>;
}) {
  const [form, setForm] = useState({
    volunteer_ids: initial ? [initial.volunteer] : ([] as number[]),
    title: initial?.title ?? "",
    instructions: initial?.instructions ?? "",
    location: initial?.location ?? "",
    duty_date: initial?.duty_date ?? new Date().toISOString().slice(0, 10),
    time: initial?.time ?? "",
    priority: initial?.priority ?? "normal",
  });
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredVolunteers = volunteers.filter((v) =>
    v.name.toLowerCase().includes(volunteerSearch.toLowerCase()),
  );

  function toggleVolunteer(id: number) {
    setForm((f) => {
      const isEditing = !!initial;
      if (isEditing) {
        return { ...f, volunteer_ids: [id] };
      }
      const already = f.volunteer_ids.includes(id);
      return {
        ...f,
        volunteer_ids: already ? f.volunteer_ids.filter((v) => v !== id) : [...f.volunteer_ids, id],
      };
    });
  }

  function selectAllFiltered() {
    setForm((f) => {
      const ids = new Set(f.volunteer_ids);
      filteredVolunteers.forEach((v) => ids.add(v._id));
      return { ...f, volunteer_ids: Array.from(ids) };
    });
  }

  function clearSelection() {
    setForm((f) => ({ ...f, volunteer_ids: [] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.volunteer_ids.length === 0) {
      toast.error("Select at least one volunteer.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ ...form, time: form.time || null } as DutyAssignPayload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-background p-5 shadow-xl">
        <h3 className="font-bold">{title}</h3>

        <div className="mt-4 flex items-center justify-between">
          <label className="block text-xs font-medium text-muted-foreground">
            Volunteer{!initial && "(s)"}
            {form.volunteer_ids.length > 0 && (
              <span className="ml-1.5 text-primary">({form.volunteer_ids.length} selected)</span>
            )}
          </label>
          {!initial && (
            <div className="flex gap-2 text-xs">
              <button type="button" onClick={selectAllFiltered} className="text-primary hover:underline">
                Select all
              </button>
              <button type="button" onClick={clearSelection} className="text-muted-foreground hover:underline">
                Clear
              </button>
            </div>
          )}
        </div>

        <input
          value={volunteerSearch}
          onChange={(e) => setVolunteerSearch(e.target.value)}
          placeholder="Search volunteers..."
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-primary"
        />

        <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-border">
          {filteredVolunteers.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No approved volunteers found.</p>
          )}
          {filteredVolunteers.map((v) => {
            const checked = form.volunteer_ids.includes(v._id);
            return (
              <label
                key={v._id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 border-b border-border px-3 py-2 text-sm last:border-0 hover:bg-muted/60",
                  checked && "bg-primary/5",
                )}
              >
                <input
                  type={initial ? "radio" : "checkbox"}
                  name="volunteer"
                  checked={checked}
                  onChange={() => toggleVolunteer(v._id)}
                  className="h-4 w-4 accent-primary"
                />
                <span>{v.name}</span>
                {v.email && <span className="ml-auto text-xs text-muted-foreground">{v.email}</span>}
              </label>
            );
          })}
        </div>

        <label className="mt-3 block text-xs font-medium text-muted-foreground">Title</label>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
          placeholder="e.g. Gate check-in & briefing"
          required
        />

        <label className="mt-3 block text-xs font-medium text-muted-foreground">Instructions</label>
        <textarea
          value={form.instructions}
          onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
          rows={2}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as any }))}
              className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Date</label>
            <input
              type="date"
              value={form.duty_date}
              onChange={(e) => setForm((f) => ({ ...f, duty_date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-1.5 text-sm">
            Cancel
          </button>
          <button disabled={saving} className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}