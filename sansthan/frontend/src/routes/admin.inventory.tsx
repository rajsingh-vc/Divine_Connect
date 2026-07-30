import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Boxes, AlertTriangle, PackageCheck, Truck, Pencil, Trash2, Plus, Search } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { InventoryItemModal, type InventoryItemRow } from "@/components/admin/inventory-item-modal";
import { getInventory, deleteInventoryItem } from "@/api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory & Prasad — Sansthan Console" }] }),
  component: () => {
    const { user } = useAuth();
    const isAdmin = user?.user_type === "admin";

    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const q = useQuery({ queryKey: ["inventory", search], queryFn: () => getInventory({ search }) });

    const items = q.data ?? [];

    const [modal, setModal] = useState<{ mode: "create" | "edit"; item?: InventoryItemRow } | null>(null);

    const refreshInventory = () => queryClient.invalidateQueries({ queryKey: ["inventory"] });

    const stats = useMemo(() => {
      const totalSkus = items.length;
      const lowStock = items.filter(
        (i: any) => i.rawStatus === "low" || i.rawStatus === "critical"
      ).length;
      const dispatchedToday = items.reduce(
        (sum: number, i: any) => sum + (i.dispatched_today ?? 0),
        0
      );
      const openPurchaseOrders = items.reduce(
        (sum: number, i: any) => sum + (i.open_purchase_orders ?? 0),
        0
      );
      return { totalSkus, lowStock, dispatchedToday, openPurchaseOrders };
    }, [items]);

    const deleteMutation = useMutation({
      mutationFn: (id: number) => deleteInventoryItem(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
    });

    const handleDelete = (row: any) => {
      if (!isAdmin) return;
      if (confirm(`Delete ${row.sku} — ${row.item}? This cannot be undone.`)) {
        deleteMutation.mutate(row._id);
      }
    };

    const handleEdit = (row: any) => {
      if (!isAdmin) return;
      setModal({ mode: "edit", item: row });
    };

    const columns = [
      {
        key: "sku",
        header: "SKU",
        render: (r: any) => <span className="font-mono text-xs text-muted-foreground">{r.sku}</span>,
      },
      { key: "item", header: "Item" },
      { key: "stock", header: "Stock" },
      { key: "min", header: "Min" },
      { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.rawStatus} /> },
      ...(isAdmin
        ? [
            {
              key: "actions",
              header: "Actions",
              render: (r: any) => (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(r)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Edit ${r.sku}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r)}
                    disabled={deleteMutation.isPending}
                    className="text-muted-foreground hover:text-rose-500 disabled:opacity-50"
                    aria-label={`Delete ${r.sku}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]
        : []),
    ];

    return (
      <>
        <PageHeader
          eyebrow="Supply"
          title="Inventory & Prasad"
          subtitle="Stock levels, replenishment schedules and prasad distribution tracking."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total SKUs"
            value={q.isLoading ? "…" : String(stats.totalSkus)}
            icon={Boxes}
            accent="amber"
            trend="flat"
          />
          <StatCard
            label="Low Stock"
            value={q.isLoading ? "…" : String(stats.lowStock)}
            change={stats.lowStock > 0 ? "review" : undefined}
            icon={AlertTriangle}
            accent="rose"
            trend="flat"
          />
          <StatCard
            label="Dispatched Today"
            value={q.isLoading ? "…" : stats.dispatchedToday.toLocaleString()}
            icon={PackageCheck}
            accent="emerald"
          />
          <StatCard
            label="Purchase Orders"
            value={q.isLoading ? "…" : String(stats.openPurchaseOrders)}
            change={stats.openPurchaseOrders > 0 ? "open" : undefined}
            icon={Truck}
            accent="sky"
            trend="flat"
          />
        </div>
        <div className="mt-6">
          <ChartCard
            title="Stock levels"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search SKU or item…"
                    className="w-56 rounded-full border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "create" })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                )}
              </div>
            }
          >
            {q.isError ? (
              <p className="text-sm text-rose-500">Failed to load inventory.</p>
            ) : (
              <DataTable rows={items} columns={columns} loading={q.isLoading} />
            )}
          </ChartCard>
        </div>

        {modal && (
          <InventoryItemModal
            mode={modal.mode}
            item={modal.item}
            onClose={() => setModal(null)}
            onSaved={refreshInventory}
          />
        )}
      </>
    );
  },
});