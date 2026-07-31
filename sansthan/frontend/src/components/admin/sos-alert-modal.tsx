import { useState } from "react";
import { toast } from "sonner";
import { X, Flame, UserSearch, ShieldAlert, HeartPulse, HandHeart } from "lucide-react";
import {
  createSOSAlert,
  updateSOSAlert,
  captureLocation,
  type SOSAlert,
  type SOSAlertType,
  type SOSStatus,
} from "@/api/sos";

const ALERT_TYPES: { value: SOSAlertType; label: string; icon: typeof Flame; accent: string }[] = [
  { value: "fire", label: "Fire", icon: Flame, accent: "bg-rose-50 text-rose-600 border-rose-200" },
  { value: "lost_child_item", label: "Lost Child / Item", icon: UserSearch, accent: "bg-amber-50 text-amber-600 border-amber-200" },
  { value: "security", label: "Security", icon: ShieldAlert, accent: "bg-orange-50 text-orange-600 border-orange-200" },
  { value: "medical", label: "Medical", icon: HeartPulse, accent: "bg-sky-50 text-sky-600 border-sky-200" },
  { value: "volunteer_support", label: "Volunteer Support", icon: HandHeart, accent: "bg-violet-50 text-violet-600 border-violet-200" },
];

const STATUS_OPTIONS: { value: SOSStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

interface SOSAlertModalProps {
  mode: "create" | "edit";
  alert?: SOSAlert;
  initialAlertType?: SOSAlertType;
  canManageStatus: boolean; // isAdmin
  onClose: () => void;
  onSaved: () => void;
}

export function SOSAlertModal({
  mode,
  alert,
  initialAlertType,
  canManageStatus,
  onClose,
  onSaved,
}: SOSAlertModalProps) {
  const [alertType, setAlertType] = useState<SOSAlertType>(alert?.alert_type ?? initialAlertType ?? "medical");
  const [description, setDescription] = useState(alert?.description ?? "");
  const [location, setLocation] = useState(alert?.location ?? "");
  const [statusVal, setStatusVal] = useState<SOSStatus>(alert?.status ?? "open");
  const [resolutionNotes, setResolutionNotes] = useState(alert?.resolution_notes ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: alert?.latitude ?? null,
    longitude: alert?.longitude ?? null,
  });

  async function handleUseMyLocation() {
    setLocating(true);
    const { latitude, longitude } = await captureLocation();
    setLocating(false);
    if (latitude === null || longitude === null) {
      toast.error("Couldn't get your location — you can still type it in manually.");
      return;
    }
    setLocation((prev) => prev || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    setCoords({ latitude, longitude });
  }

  async function handleSubmit() {
    setBusy(true);
    try {
      if (mode === "create") {
        await createSOSAlert({
          alert_type: alertType,
          description,
          location,
          latitude: coords.latitude,
          longitude: coords.longitude,
          image,
        });
        toast.success("SOS alert sent to admins.");
      } else if (alert) {
        await updateSOSAlert(alert.id, {
          alert_type: alertType,
          description,
          location,
          latitude: coords.latitude,
          longitude: coords.longitude,
          image,
          ...(canManageStatus ? { status: statusVal, resolution_notes: resolutionNotes } : {}),
        });
        toast.success("SOS alert updated.");
      }
      onSaved();
      onClose();
    } catch {
      toast.error(mode === "create" ? "Could not send the SOS alert." : "Could not update the alert.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-background p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {mode === "create" ? "Raise Emergency SOS" : `Edit ${alert?.sos_code}`}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Emergency type</label>
            <div className="grid grid-cols-3 gap-2">
              {ALERT_TYPES.map(({ value, label, icon: Icon, accent }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAlertType(value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-[11px] font-medium transition ${
                    alertType === value ? accent : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Location <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gate 3, Main Hall"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="whitespace-nowrap rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50"
              >
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Description <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Any details that will help admins respond faster..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Photo <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full text-xs"
            />
          </div>

          {canManageStatus && mode === "edit" && (
            <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold text-foreground">Admin response</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as SOSStatus)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Response notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={2}
                  placeholder="What's being done about this..."
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={busy}
            className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background disabled:opacity-50"
          >
            {busy ? "Saving…" : mode === "create" ? "Send SOS" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}