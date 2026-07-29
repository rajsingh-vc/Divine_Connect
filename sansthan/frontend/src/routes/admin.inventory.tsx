import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Boxes, AlertTriangle, PackageCheck, Truck } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { getInventory } from "@/api";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory & Prasad — Sansthan Console" }] }),
  component: () => {
    const q = useQuery({ queryKey: ["inventory"], queryFn: getInventory });
    return (
      <>
        <PageHeader eyebrow="Supply" title="Inventory & Prasad" subtitle="Stock levels, replenishment schedules and prasad distribution tracking." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total SKUs" value="128" icon={Boxes} accent="amber" trend="flat" />
          <StatCard label="Low Stock" value="9" change="review" icon={AlertTriangle} accent="rose" trend="flat" />
          <StatCard label="Dispatched Today" value="4,240" icon={PackageCheck} accent="emerald" />
          <StatCard label="Purchase Orders" value="12" change="open" icon={Truck} accent="sky" trend="flat" />
        </div>
        <div className="mt-6">
          <ChartCard title="Stock levels">
            <DataTable rows={q.data || []} columns={[
              { key: "sku", header: "SKU", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.sku}</span> },
              { key: "item", header: "Item" },
              { key: "stock", header: "Stock" },
              { key: "min", header: "Min" },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]} />
          </ChartCard>
        </div>
      </>
    );
  },
});