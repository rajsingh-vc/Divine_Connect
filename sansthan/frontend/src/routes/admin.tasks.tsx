import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  ListTodo, Clock, CircleCheck, AlertTriangle, Plus, Search, Pencil, Eye, Trash2,
  Check, Play, ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge, SeverityBadge } from "@/components/admin/badges";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import { createTask, deleteTask, getTasks, getVolunteers, updateTask, type TaskPayload } from "@/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Sansthan Console" }] }),
  component: TasksPage,
});

type TaskRow = Awaited<ReturnType<typeof getTasks>>["rows"][number];

function TasksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<TaskRow | null>(null);
  const [viewing, setViewing] = useState<TaskRow | null>(null);
  const [deleting, setDeleting] = useState<TaskRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [startingId, setStartingId] = useState<number | null>(null);
  const [swapping, setSwapping] = useState<TaskRow | null>(null);
  const queryClient = useQueryClient();

  const q = useQuery({
    queryKey: ["tasks", page, search],
    queryFn: () => getTasks({ page, search }),
  });

  const allTasks = useQuery({ queryKey: ["tasks", "all-for-stats"], queryFn: () => getTasks({}) });
  const doneCount = allTasks.data?.rows.filter((t) => t.rawStatus === "done").length ?? 0;
  const inProgressCount = allTasks.data?.rows.filter((t) => t.rawStatus === "in_progress").length ?? 0;
  const overdueCount =
    allTasks.data?.rows.filter((t) => t.dueDate && t.rawStatus !== "done" && new Date(t.dueDate) < new Date()).length ?? 0;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteTask(deleting._id);
      toast.success(`${deleting.title} was removed.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error("Could not delete this task. Please try again.");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleToggleDone(row: TaskRow) {
    setTogglingId(row._id);
    try {
      const nextStatus = row.rawStatus === "done" ? "todo" : "done";
      await updateTask(row._id, { status: nextStatus });
      toast.success(
        nextStatus === "done" ? `${row.title} marked as completed.` : `${row.title} moved back to pending.`,
      );
      invalidate();
    } catch {
      toast.error("Could not update this task. Please try again.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleStart(row: TaskRow) {
    setStartingId(row._id);
    try {
      await updateTask(row._id, { status: "in_progress" });
      toast.success(`${row.title} started.`);
      invalidate();
    } catch {
      toast.error("Could not start this task. Please try again.");
    } finally {
      setStartingId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Tasks"
        subtitle="Assign, prioritize, and track operational to-dos across the team."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Tasks" value={String(allTasks.data?.count ?? "—")} icon={ListTodo} accent="amber" trend="flat" />
        <StatCard label="In Progress" value={String(inProgressCount)} icon={Clock} accent="sky" trend="flat" />
        <StatCard label="Completed" value={String(doneCount)} icon={CircleCheck} accent="emerald" trend="flat" />
        <StatCard label="Overdue" value={String(overdueCount)} icon={AlertTriangle} accent="rose" trend="flat" />
      </div>

      <div className="mt-6">
        <ChartCard
          title="All tasks"
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
                  placeholder="Search by title, ID, or assignee..."
                  className="rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" /> Add task
              </button>
            </div>
          }
        >
          <DataTable
            rows={q.data?.rows || []}
            empty={q.isLoading ? "Loading..." : "No tasks found."}
            columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "title", header: "Title" },
              { key: "assignee", header: "Assignee", render: (r) => r.assignee || "—" },
              { key: "dueDate", header: "Due", render: (r) => (r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "—") },
              { key: "time", header: "Time", render: (r) => r.timeDisplay || "—" },
              { key: "priority", header: "Priority", render: (r) => <SeverityBadge severity={r.priority} /> },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              {
                key: "act",
                header: "Actions",
                render: (r) => (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleDone(r)}
                      disabled={togglingId === r._id}
                      title={r.rawStatus === "done" ? "Mark as pending" : "Mark complete"}
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-50",
                        r.rawStatus === "done"
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-border text-transparent hover:border-emerald-400",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                    {r.rawStatus === "todo" && (
                      <button
                        onClick={() => handleStart(r)}
                        disabled={startingId === r._id}
                        className="text-muted-foreground hover:text-primary disabled:opacity-50"
                        title="Start task"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => setSwapping(r)} className="text-muted-foreground hover:text-primary" title="Swap / assign to volunteer">
                      <ArrowLeftRight className="h-4 w-4" />
                    </button>
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
        <TaskFormModal
          title="Add task"
          onClose={() => setAddOpen(false)}
          onSubmit={async (payload) => {
            await createTask(payload);
            toast.success(`${payload.title} was added.`);
            invalidate();
            setAddOpen(false);
          }}
        />
      )}

      {editing && (
        <TaskFormModal
          title="Edit task"
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (payload) => {
            await updateTask(editing._id, payload);
            toast.success(`${payload.title} was updated.`);
            invalidate();
            setEditing(null);
          }}
        />
      )}

      {viewing && <TaskViewModal task={viewing} onClose={() => setViewing(null)} />}

      {swapping && (
        <SwapModal
          task={swapping}
          onClose={() => setSwapping(null)}
          onSwap={async (volunteerName) => {
            await updateTask(swapping._id, { assignee: volunteerName });
            toast.success(`${swapping.title} reassigned to ${volunteerName}.`);
            invalidate();
            setSwapping(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this task?"
        description={`This will permanently remove ${deleting?.title ?? "this task"} (${deleting?.id ?? ""}) from the system. This action cannot be undone.`}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}

function TaskFormModal({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: TaskRow;
  onClose: () => void;
  onSubmit: (payload: TaskPayload) => Promise<void>;
}) {
  const [taskTitle, setTaskTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [assignee, setAssignee] = useState(initial?.assignee ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(initial?.priority ?? "medium");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: taskTitle,
        description,
        assignee,
        due_date: dueDate || null,
        time: time || null,
        priority,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this task.";
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
          <Field label="Title">
            <input required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assignee">
              <input value={assignee} onChange={(e) => setAssignee(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Due date">
              <input type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Time">
            <input type="time" value={time ?? ""} onChange={(e) => setTime(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Priority">
            <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className={inputCls}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          {!initial && (
            <p className="text-xs text-muted-foreground">
              New tasks start as <span className="font-medium text-foreground">Pending</span>. Use{" "}
              <span className="font-medium text-foreground">Start</span> and the checkbox on the list to move it along.
            </p>
          )}
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

function TaskViewModal({ task, onClose }: { task: TaskRow; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Task ID", task.id],
    ["Title", task.title],
    ["Description", task.description || "—"],
    ["Assignee", task.assignee || "—"],
    ["Due Date", task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"],
    ["Time", task.timeDisplay || "—"],
    ["Priority", task.priority],
    ["Status", task.status],
    ["Created", new Date(task.createdAt).toLocaleDateString()],
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Task details</h3>
        <dl className="mt-4 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
              <dt className="shrink-0 text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
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

function SwapModal({
  task,
  onClose,
  onSwap,
}: {
  task: TaskRow;
  onClose: () => void;
  onSwap: (volunteerName: string) => Promise<void>;
}) {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const volunteers = useQuery({ queryKey: ["volunteers", "for-swap"], queryFn: () => getVolunteers({}) });

  async function handleConfirm() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await onSwap(selected);
    } catch {
      setError("Could not reassign this task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Swap / assign task</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          "{task.title}" is currently with{" "}
          <span className="font-medium text-foreground">{task.assignee || "no one"}</span>. Choose who should take it.
        </p>

        <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
          {volunteers.isLoading && <p className="py-4 text-center text-sm text-muted-foreground">Loading volunteers...</p>}
          {volunteers.data?.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No volunteers found.</p>
          )}
          {volunteers.data?.map((v) => (
            <button
              key={v._id}
              type="button"
              onClick={() => setSelected(v.name)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                selected === v.name ? "border-primary bg-primary/5 font-semibold" : "border-border hover:bg-muted",
              )}
            >
              <span>{v.name}</span>
              {v.zone && <span className="text-xs text-muted-foreground">{v.zone}</span>}
            </button>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
            Cancel
          </button>
          <button
            disabled={!selected || saving}
            onClick={handleConfirm}
            className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
          >
            {saving ? "Assigning..." : "Assign"}
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