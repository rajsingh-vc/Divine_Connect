import { o as __toESM } from "../_runtime.mjs";
import { s as unwrap, t as api } from "./api-CK4IlaGP.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-context-CAyad5oA.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Plus, F as PackageCheck, H as LoaderCircle, P as Pencil, T as Search, f as Trash2, l as Truck, t as X, u as TriangleAlert, yt as Boxes } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge } from "./badges-D8YuufmK.mjs";
import { r as statusLabel } from "./format-oajkEy3m.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-DhW-aGRX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function mapInventoryItem(i) {
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
		rawStatus: i.status,
		updatedAt: i.updated_at
	};
}
async function getInventory(params) {
	const { data } = await api.get("/inventory/", { params });
	return unwrap(data).map(mapInventoryItem);
}
async function createInventoryItem(payload) {
	const { data } = await api.post("/inventory/", payload);
	return mapInventoryItem(data);
}
async function updateInventoryItem(id, payload) {
	const { data } = await api.patch(`/inventory/${id}/`, payload);
	return mapInventoryItem(data);
}
async function deleteInventoryItem(id) {
	await api.delete(`/inventory/${id}/`);
}
/**
* Add / Edit modal for Inventory & Prasad items.
* mode="create" -> POST /inventory/
* mode="edit"   -> PATCH /inventory/{id}/
* Both endpoints already exist in api/inventory.ts — this just wires the
* UI up to them (the buttons on the page were previously non-functional).
*/
function InventoryItemModal({ mode, item, onClose, onSaved }) {
	const [sku, setSku] = (0, import_react.useState)(item?.sku ?? "");
	const [itemName, setItemName] = (0, import_react.useState)(item?.item ?? "");
	const [stock, setStock] = (0, import_react.useState)(String(item?.stock ?? 0));
	const [minThreshold, setMinThreshold] = (0, import_react.useState)(String(item?.min ?? 0));
	const [unit, setUnit] = (0, import_react.useState)(item?.unit ?? "pcs");
	const [dispatchedToday, setDispatchedToday] = (0, import_react.useState)(String(item?.dispatched_today ?? 0));
	const [openPurchaseOrders, setOpenPurchaseOrders] = (0, import_react.useState)(String(item?.open_purchase_orders ?? 0));
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleSubmit() {
		if (!sku.trim() || !itemName.trim()) {
			setError("SKU and item name are required.");
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			const payload = {
				sku: sku.trim(),
				item_name: itemName.trim(),
				stock: Number(stock) || 0,
				min_threshold: Number(minThreshold) || 0,
				unit: unit.trim() || "pcs",
				dispatched_today: Number(dispatchedToday) || 0,
				open_purchase_orders: Number(openPurchaseOrders) || 0
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
		} catch (err) {
			const data = err?.response?.data;
			const detail = typeof data === "object" && data && (data.detail || Object.values(data)[0]) || "Could not save this item. Please try again.";
			setError(String(Array.isArray(detail) ? detail[0] : detail));
			toast.error("Failed to save inventory item.");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-card p-5 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-semibold",
						children: mode === "create" ? "Add Prasad Item" : "Edit Prasad Item"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "SKU"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: sku,
							onChange: (e) => setSku(e.target.value),
							disabled: mode === "edit",
							placeholder: "PRS-001",
							className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Item name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: itemName,
							onChange: (e) => setItemName(e.target.value),
							placeholder: "Laddoo Prasad (box)",
							className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Stock"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: stock,
								onChange: (e) => setStock(e.target.value),
								className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Min threshold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: minThreshold,
								onChange: (e) => setMinThreshold(e.target.value),
								className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Unit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: unit,
							onChange: (e) => setUnit(e.target.value),
							placeholder: "pcs",
							className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Dispatched today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: dispatchedToday,
								onChange: (e) => setDispatchedToday(e.target.value),
								className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Purchase orders"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								value: openPurchaseOrders,
								onChange: (e) => setOpenPurchaseOrders(e.target.value),
								className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
							})] })]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-rose-600",
							children: error
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: submitting,
						onClick: handleSubmit,
						className: "inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50",
						children: [submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : null, mode === "create" ? "Add item" : "Save changes"]
					})]
				})
			]
		})
	});
}
var SplitComponent = () => {
	const { user } = useAuth();
	const isAdmin = user?.user_type === "admin";
	const queryClient = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const q = useQuery({
		queryKey: ["inventory", search],
		queryFn: () => getInventory({ search })
	});
	const items = q.data ?? [];
	const [modal, setModal] = (0, import_react.useState)(null);
	const refreshInventory = () => queryClient.invalidateQueries({ queryKey: ["inventory"] });
	const stats = (0, import_react.useMemo)(() => {
		return {
			totalSkus: items.length,
			lowStock: items.filter((i) => i.rawStatus === "low" || i.rawStatus === "critical").length,
			dispatchedToday: items.reduce((sum, i) => sum + (i.dispatched_today ?? 0), 0),
			openPurchaseOrders: items.reduce((sum, i) => sum + (i.open_purchase_orders ?? 0), 0)
		};
	}, [items]);
	const deleteMutation = useMutation({
		mutationFn: (id) => deleteInventoryItem(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] })
	});
	const handleDelete = (row) => {
		if (!isAdmin) return;
		if (confirm(`Delete ${row.sku} — ${row.item}? This cannot be undone.`)) deleteMutation.mutate(row._id);
	};
	const handleEdit = (row) => {
		if (!isAdmin) return;
		setModal({
			mode: "edit",
			item: row
		});
	};
	const columns = [
		{
			key: "sku",
			header: "SKU",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted-foreground",
				children: r.sku
			})
		},
		{
			key: "item",
			header: "Item"
		},
		{
			key: "stock",
			header: "Stock"
		},
		{
			key: "min",
			header: "Min"
		},
		{
			key: "status",
			header: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.rawStatus })
		},
		...isAdmin ? [{
			key: "actions",
			header: "Actions",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => handleEdit(r),
					className: "text-muted-foreground hover:text-foreground",
					"aria-label": `Edit ${r.sku}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => handleDelete(r),
					disabled: deleteMutation.isPending,
					className: "text-muted-foreground hover:text-rose-500 disabled:opacity-50",
					"aria-label": `Delete ${r.sku}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
				})]
			})
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Supply",
			title: "Inventory & Prasad",
			subtitle: "Stock levels, replenishment schedules and prasad distribution tracking."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total SKUs",
					value: q.isLoading ? "…" : String(stats.totalSkus),
					icon: Boxes,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Low Stock",
					value: q.isLoading ? "…" : String(stats.lowStock),
					change: stats.lowStock > 0 ? "review" : void 0,
					icon: TriangleAlert,
					accent: "rose",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Dispatched Today",
					value: q.isLoading ? "…" : stats.dispatchedToday.toLocaleString(),
					icon: PackageCheck,
					accent: "emerald"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Purchase Orders",
					value: q.isLoading ? "…" : String(stats.openPurchaseOrders),
					change: stats.openPurchaseOrders > 0 ? "open" : void 0,
					icon: Truck,
					accent: "sky",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Stock levels",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search SKU or item…",
							className: "w-56 rounded-full border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
						})]
					}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setModal({ mode: "create" }),
						className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Add item"]
					})]
				}),
				children: q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-rose-500",
					children: "Failed to load inventory."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: items,
					columns,
					loading: q.isLoading
				})
			})
		}),
		modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryItemModal, {
			mode: modal.mode,
			item: modal.item,
			onClose: () => setModal(null),
			onSaved: refreshInventory
		})
	] });
};
//#endregion
export { SplitComponent as component };
