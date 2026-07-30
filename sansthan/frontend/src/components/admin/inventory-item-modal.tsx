import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { createInventoryItem, updateInventoryItem, type InventoryPayload } from "@/api";

export interface InventoryItemRow {
  _id: number;
  sku: string;
  item: string;
  stock: number;
  min: number;
  unit: string;
  dispatched_today?: number;
  open_purchase_orders?: number;
}

/**
 * Add / Edit modal for Inventory & Prasad items.
 * mode="create" -> POST /inventory/
 * mode="edit"   -> PATCH /inventory/{id}/
 * Both endpoints already exist in api/inventory.ts — this just wires the
 * UI up to them (the buttons on the page were previously non-functional).
 */
export function InventoryItemModal({
  mode,
  item,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  item?: InventoryItemRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [sku, setSku] = useState(item?.sku ?? "");
  const [itemName, setItemName] = useState(item?.item ?? "");
  const [stock, setStock] = useState(String(item?.stock ?? 0));
  const [minThreshold, setMinThreshold] = useState(String(item?.min ?? 0));
  const [unit, setUnit] = useState(item?.unit ?? "pcs");
  const [dispatchedToday, setDispatchedToday] = useState(String(item?.dispatched_today ?? 0));
  const [openPurchaseOrders, setOpenPurchaseOrders] = useState(String(item?.open_purchase_orders ?? 0));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!sku.trim() || !itemName.trim()) {
      setError("SKU and item name are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: InventoryPayload = {
        sku: sku.trim(),
        item_name: itemName.trim(),
        stock: Number(stock) || 0,
        min_threshold: Number(minThreshold) || 0,
        unit: unit.trim() || "pcs",
        dispatched_today: Number(dispatchedToday) || 0,
        open_purchase_orders: Number(openPurchaseOrders) || 0,
      };
      if (mode === "create") {
        await createInventoryItem(payload);
        toast.success(`${payload.item_name} added to inventory.`);
      } else if (item) {
        await updateInventoryItem(item._id, payload);
        toast.success(`${payload.item_name} updated.`);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      const detail =
        (typeof data === "object" && data && (data.detail || Object.values(data)[0])) ||
        "Could not save this item. Please try again.";
      setError(String(Array.isArray(detail) ? detail[0] : detail));
      toast.error("Failed to save inventory item.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">
            {mode === "create" ? "Add Prasad Item" : "Edit Prasad Item"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</label>
            <input
              autoFocus
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={mode === "edit"}
              placeholder="PRS-001"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item name</label>
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Laddoo Prasad (box)"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min threshold</label>
              <input
                type="number"
                min={0}
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="pcs"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dispatched today</label>
              <input
                type="number"
                min={0}
                value={dispatchedToday}
                onChange={(e) => setDispatchedToday(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Purchase orders</label>
              <input
                type="number"
                min={0}
                value={openPurchaseOrders}
                onChange={(e) => setOpenPurchaseOrders(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

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
            {mode === "create" ? "Add item" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}