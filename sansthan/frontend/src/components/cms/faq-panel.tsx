import { useState } from "react";
import { X, Plus, Trash2, Pencil, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // adjust path if needed
import type { FaqItem } from "@/hooks/use-faq-items";

interface FAQPanelProps {
  open: boolean;
  onClose: () => void;
  items: FaqItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (payload: Pick<FaqItem, "question" | "answer" | "order" | "is_published">) => Promise<FaqItem>;
  updateItem: (id: number, payload: Partial<FaqItem>) => Promise<FaqItem>;
  removeItems: (ids: number[]) => Promise<void>;
}

export function FAQPanel({ open, onClose, items, isLoading, error, addItem, updateItem, removeItems }: FAQPanelProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [editingId, setEditingId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
  };

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) return;
    if (editingId) {
      await updateItem(editingId, { question, answer });
    } else {
      await addItem({ question, answer, order: items.length, is_published: true });
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">FAQs</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {/* Add / edit form — admin only */}
        {isAdmin ? (
          <div className="mt-4 space-y-2 rounded-xl border border-border p-4">
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <textarea
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="Answer"
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              {editingId && (
                <button onClick={resetForm} className="rounded-full px-4 py-1.5 text-sm">Cancel</button>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-1 rounded-full bg-foreground px-4 py-1.5 text-sm text-background"
              >
                <Plus className="h-4 w-4" /> {editingId ? "Update" : "Add FAQ"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            View only
          </div>
        )}

        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="mt-4 space-y-2">
            {items.map((f) => (
              <div key={f.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{f.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.answer}</p>
                  </div>
                  {/* Publish toggle / edit / delete — admin only */}
                  {isAdmin && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => updateItem(f.id, { is_published: !f.is_published })}
                        className={`rounded-full px-2 py-1 text-xs ${f.is_published ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}
                      >
                        {f.is_published ? "Published" : "Draft"}
                      </button>
                      <button onClick={() => { setEditingId(f.id); setQuestion(f.question); setAnswer(f.answer); }}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeItems([f.id])}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}