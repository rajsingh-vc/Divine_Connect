import { useFaqItems } from "@/hooks/use-faq-items";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function FaqList() {
  const { items, isLoading, error } = useFaqItems();
  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading FAQs…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (items.length === 0) return <p className="text-sm text-muted-foreground">No FAQs available yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((f) => (
        <div key={f.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <button
            onClick={() => setOpenId(openId === f.id ? null : f.id)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="flex items-center gap-2 font-medium text-foreground">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              {f.question}
            </span>
            <span className="text-muted-foreground">{openId === f.id ? "−" : "+"}</span>
          </button>
          {openId === f.id && (
            <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}