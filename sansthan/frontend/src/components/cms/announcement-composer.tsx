import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Info, X, Loader2, Trash2 } from "lucide-react";
import { getAnnouncements, sendAnnouncement, deleteAnnouncement, type AnnouncementType } from "@/api/announcements";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AnnouncementComposer({ open, onClose }: Props) {
  const [type, setType] = useState<AnnouncementType>("important");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const history = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: sendAnnouncement,
    onSuccess: () => {
      toast.success("Announcement sent to all volunteers.");
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || err?.response?.data?.type?.[0] || "Failed to send announcement.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      toast.success("Announcement removed.");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: () => {
      toast.error("Failed to delete announcement.");
    },
  });

  if (!open) return null;

  function handleSend() {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    mutation.mutate({ type, title: title.trim(), description: description.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Notification Templates</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Send an announcement — it appears in every volunteer's notification bell.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("immediate")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                  type === "immediate" ? "border-red-500 bg-red-50 text-red-700" : "border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <AlertTriangle className="h-4 w-4" /> immediate
              </button>
              <button
                type="button"
                onClick={() => setType("important")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                  type === "important" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Info className="h-4 w-4" /> Important
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Title
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g. Temple closed for maintenance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Details volunteers need to know…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={mutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send to all volunteers
          </button>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recently sent</h3>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {history.data?.map((a) => (
              <div key={a.id} className="rounded-lg border p-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{a.title}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        a.type === "immediate" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {a.type}
                    </span>
                    <button
                      onClick={() => deleteMutation.mutate(a.id)}
                      disabled={deleteMutation.isPending}
                      className="text-muted-foreground hover:text-red-600 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(a.sent_at).toLocaleString()} {a.sent_by_name && `· ${a.sent_by_name}`}
                </p>
              </div>
            ))}
            {history.data?.length === 0 && <p className="text-xs text-muted-foreground">No announcements sent yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}