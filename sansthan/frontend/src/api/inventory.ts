import { api, unwrap } from "@/lib/api";
import { statusLabel } from "@/lib/format";

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------
export interface InventoryPayload {
  sku: string;
  item_name: string;
  stock: number;
  min_threshold: number;
  unit?: string;
  dispatched_today?: number;
  open_purchase_orders?: number;
}

function mapInventoryItem(i: any) {
  return {
    sku: i.sku,
    _id: i.id,
    item: i.item_name,
    stock: i.stock,
    min: i.min_threshold,
    unit: i.unit,
    dispatched_today: i.dispatched_today,
    open_purchase_orders: i.open_purchase_orders,
    status: statusLabel(i.status),
    rawStatus: i.status as "ok" | "low" | "critical",
    updatedAt: i.updated_at,
  };
}

export async function getInventory(params?: { search?: string }) {
  const { data } = await api.get("/inventory/", { params });
  return unwrap<any>(data).map(mapInventoryItem);
}

export async function createInventoryItem(payload: InventoryPayload) {
  const { data } = await api.post("/inventory/", payload);
  return mapInventoryItem(data);
}

export async function updateInventoryItem(id: number, payload: Partial<InventoryPayload>) {
  const { data } = await api.patch(`/inventory/${id}/`, payload);
  return mapInventoryItem(data);
}

export async function deleteInventoryItem(id: number) {
  await api.delete(`/inventory/${id}/`);
}