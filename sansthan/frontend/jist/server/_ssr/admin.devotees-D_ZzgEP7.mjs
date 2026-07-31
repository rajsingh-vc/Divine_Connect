import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Plus, P as Pencil, T as Search, f as Trash2, i as Users, n as Wallet, p as Star, s as UserCheck, tt as Eye } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge } from "./badges-D8YuufmK.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-DgHLNp1f.mjs";
import { T as updateDevotee, l as deleteDevotee, m as getDevotees, r as createDevotee } from "./api-CW1DFv5Z.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PaginationBar } from "./pagination-bar-CPhYdbuc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.devotees-D_ZzgEP7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DevoteesPage() {
	const [page, setPage] = (0, import_react.useState)(1);
	const [search, setSearch] = (0, import_react.useState)("");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [deleteBusy, setDeleteBusy] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const q = useQuery({
		queryKey: [
			"devotees",
			page,
			search
		],
		queryFn: () => getDevotees({
			page,
			search
		})
	});
	const allDevotees = useQuery({
		queryKey: ["devotees", "all-for-stats"],
		queryFn: () => getDevotees({})
	});
	const vipStats = useQuery({
		queryKey: ["devotees", "vip-count"],
		queryFn: () => getDevotees({ tier: "vip" })
	});
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["devotees"] });
	}
	async function handleDelete() {
		if (!deleting) return;
		setDeleteBusy(true);
		try {
			await deleteDevotee(deleting._id);
			toast.success(`${deleting.name} was removed.`);
			setDeleting(null);
			invalidate();
		} catch {
			toast.error("Could not delete this devotee. Please try again.");
		} finally {
			setDeleteBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Operations",
			title: "Devotee Management",
			subtitle: "Search, profile, visit history, donations, and bookings for every devotee."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Devotees",
					value: String(allDevotees.data?.count ?? "—"),
					icon: Users,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "VIP Devotees",
					value: String(vipStats.data?.count ?? "—"),
					icon: Star,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Visits",
					value: String(allDevotees.data?.rows.reduce((s, d) => s + d.visits, 0) ?? "—"),
					icon: UserCheck,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Donated",
					value: allDevotees.data ? `₹${allDevotees.data.rows.reduce((s, d) => s + d.donatedRaw, 0).toLocaleString("en-IN")}` : "—",
					icon: Wallet,
					accent: "emerald",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChartCard, {
				title: "All devotees",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative hidden sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => {
								setSearch(e.target.value);
								setPage(1);
							},
							placeholder: "Search by name or ID...",
							className: "rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setAddOpen(true),
						className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add devotee"]
					})]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: q.data?.rows || [],
					empty: q.isLoading ? "Loading..." : "No devotees found.",
					columns: [
						{
							key: "id",
							header: "ID",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: r.id
							})
						},
						{
							key: "name",
							header: "Name"
						},
						{
							key: "mobile",
							header: "Mobile"
						},
						{
							key: "city",
							header: "City"
						},
						{
							key: "visits",
							header: "Visits"
						},
						{
							key: "donated",
							header: "Donated",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: r.donated
							})
						},
						{
							key: "tier",
							header: "Tier",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.tier })
						},
						{
							key: "act",
							header: "Actions",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setViewing(r),
										className: "text-muted-foreground hover:text-primary",
										title: "View",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setEditing(r),
										className: "text-muted-foreground hover:text-primary",
										title: "Edit",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setDeleting(r),
										className: "text-muted-foreground hover:text-rose-600",
										title: "Delete",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							})
						}
					]
				}), q.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
					page,
					pageSize: 20,
					count: q.data.count,
					onPageChange: setPage
				})]
			})
		}),
		addOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevoteeFormModal, {
			title: "Add devotee",
			onClose: () => setAddOpen(false),
			onSubmit: async (payload) => {
				await createDevotee(payload);
				toast.success(`${payload.name} was added to the devotee list.`);
				invalidate();
				setAddOpen(false);
			}
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevoteeFormModal, {
			title: "Edit devotee",
			initial: editing,
			onClose: () => setEditing(null),
			onSubmit: async (payload) => {
				await updateDevotee(editing._id, payload);
				toast.success(`${payload.name} was updated.`);
				invalidate();
				setEditing(null);
			}
		}),
		viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevoteeViewModal, {
			devotee: viewing,
			onClose: () => setViewing(null)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleting,
			onOpenChange: (o) => !o && setDeleting(null),
			title: "Delete this devotee?",
			description: `This will permanently remove ${deleting?.name ?? "this devotee"} (${deleting?.id ?? ""}) from the system. This action cannot be undone.`,
			loading: deleteBusy,
			onConfirm: handleDelete
		})
	] });
}
function DevoteeFormModal({ title, initial, onClose, onSubmit }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [mobile, setMobile] = (0, import_react.useState)(initial?.mobile ?? "");
	const [city, setCity] = (0, import_react.useState)(initial?.city ?? "");
	const [visits, setVisits] = (0, import_react.useState)(String(initial?.visits ?? 0));
	const [donated, setDonated] = (0, import_react.useState)(String(initial?.donatedRaw ?? 0));
	const [tier, setTier] = (0, import_react.useState)(initial?.tierRaw ?? "member");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			await onSubmit({
				name,
				mobile,
				city,
				visits: Number(visits) || 0,
				total_donated: Number(donated) || 0,
				tier
			});
		} catch (err) {
			const data = err?.response?.data;
			const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
			const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this devotee.";
			setError(msg);
			toast.error(msg);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-card p-5 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-semibold",
					children: title
				}),
				initial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"ID: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: initial.id
						}),
						" (auto-generated)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mobile",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: mobile,
								onChange: (e) => setMobile(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: city,
								onChange: (e) => setCity(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Visits",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									required: true,
									value: visits,
									onChange: (e) => setVisits(e.target.value),
									className: inputCls
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Donated (₹)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									required: true,
									value: donated,
									onChange: (e) => setDonated(e.target.value),
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tier",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: tier,
								onChange: (e) => setTier(e.target.value),
								className: inputCls,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "member",
									children: "Member"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "vip",
									children: "VIP"
								})]
							})
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-rose-600",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onClose,
								className: "rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: saving,
								className: "rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50",
								children: saving ? "Saving..." : "Save"
							})]
						})
					]
				})
			]
		})
	});
}
function DevoteeViewModal({ devotee, onClose }) {
	const rows = [
		["Devotee ID", devotee.id],
		["Name", devotee.name],
		["Email", devotee.email || "—"],
		["Mobile", devotee.mobile || "—"],
		["City", devotee.city || "—"],
		["Visits", String(devotee.visits)],
		["Total Donated", devotee.donated],
		["Tier", devotee.tier],
		["Member Since", new Date(devotee.createdAt).toLocaleDateString()]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-card p-5 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-semibold",
					children: "Devotee details"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 divide-y divide-border",
					children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: value
						})]
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "mt-5 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted",
					children: "Close"
				})
			]
		})
	});
}
var inputCls = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
		children: label
	}), children] });
}
//#endregion
export { DevoteesPage as component };
