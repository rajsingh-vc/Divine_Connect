import { useState } from "react";
import { Loader2, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import {
  createIncident,
  updateIncident,
  type IncidentCategory,
  type IncidentReport,
  type IncidentSeverity,
  type IncidentStatus,
} from "@/api/incidents";

const CATEGORY_OPTIONS: { value: IncidentCategory; label: string }[] = [
  { value: "medical", label: "Medical" },
  { value: "crowd", label: "Crowd" },
  { value: "security", label: "Security" },
  { value: "queue", label: "Queue" },
  { value: "volunteer_support", label: "Volunteer Support" },
];

const SEVERITY_OPTIONS: { value: IncidentSeverity; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const STATUS_OPTIONS: { value: IncidentStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

/**
 * Add / Edit modal for the Incident Log (Command Centre).
 * mode="create" -> POST /api/incidents/incidents/   (volunteer or admin)
 * mode="edit"   -> PATCH /api/incidents/incidents/{id}/  (owning volunteer or admin)
 *
 * `canManageStatus` is passed in by the page — true for admins, who may also
 * move an incident through Open -> In Progress -> Resolved -> Closed and
 * write the Admin Response. Volunteers editing their own report only see
 * the core fields (title/category/severity/description/location/photo) plus
 * a read-only view of the admin's response, once there is one.
 */
export function IncidentReportModal({
  mode,
  incident,
  canManageStatus,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  incident?: IncidentReport;
  canManageStatus: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(incident?.title ?? "");
  const [category, setCategory] = useState<IncidentCategory>(incident?.category ?? "crowd");
  const [severity, setSeverity] = useState<IncidentSeverity>(incident?.severity ?? "low");
  const [status, setStatus] = useState<IncidentStatus>(incident?.status ?? "open");
  const [description, setDescription] = useState(incident?.description ?? "");
  const [location, setLocation] = useState(incident?.location ?? "");
  const [resolutionNotes, setResolutionNotes] = useState(incident?.resolution_notes ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(incident?.image ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : incident?.image ?? "");
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError("Issue title and description are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "create") {
        await createIncident({
          title: title.trim(),
          category,
          severity,
          description: description.trim(),
          location: location.trim(),
          image,
        });
        toast.success("Incident reported.");
      } else if (incident) {
        await updateIncident(incident.id, {
          title: title.trim(),
          category,
          severity,
          description: description.trim(),
          location: location.trim(),
          ...(canManageStatus ? { status, resolution_notes: resolutionNotes.trim() } : {}),
          ...(image ? { image } : {}),
        });
        toast.success("Incident updated.");
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      const detail =
        (typeof data === "object" && data && (data.detail || Object.values(data)[0])) ||
        "Could not save this incident. Please try again.";
      setError(String(Array.isArray(detail) ? detail[0] : detail));
      toast.error("Failed to save incident report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-card p-5 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">
            {mode === "create" ? "Report Incident" : "Edit Incident Report"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Issue title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Queue overflow at Gate 3"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {SEVERITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What happened, where, and how many people affected..."
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Location / Zone (optional)
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Gate 3, Main Queue"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Photo (optional)
            </label>
            <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2 text-sm hover:bg-muted">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{image ? image.name : "Choose a photo"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {previewUrl && (
              <img src={previewUrl} alt="Incident preview" className="mt-2 h-32 w-full rounded-lg object-cover" />
            )}
          </div>

          {canManageStatus && mode === "edit" && (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IncidentStatus)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Admin-only free-text response. As soon as this is saved
                  non-empty, the incident flips from "Awaiting Response" to
                  "Responded" and the reporting volunteer is notified. */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin response
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={2}
                  placeholder="Reply to the volunteer who raised this — what's being done..."
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </>
          )}

          {/* Reporting volunteer / devotee sees the admin's reply here, read-only. */}
          {!canManageStatus && mode === "edit" && incident?.resolution_notes && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin response
              </label>
              <div className="mt-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                {incident.resolution_notes}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {mode === "create" ? "Submit report" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}