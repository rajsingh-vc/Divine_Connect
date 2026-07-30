import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Plus, Ct as ArrowLeftRight, M as Play, P as Pencil, T as Search, U as ListTodo, f as Trash2, ft as Check, it as Clock, lt as CircleCheck, tt as Eye, u as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge, t as SeverityBadge } from "./badges-D8YuufmK.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-DgHLNp1f.mjs";
import { O as updateTask, S as getVolunteers, o as createTask, u as deleteTask, y as getTasks } from "./api-dA4NAI0U.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PaginationBar } from "./pagination-bar-CPhYdbuc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tasks-Y-Cl47Gz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TasksPage() {
	const [page, setPage] = (0, import_react.useState)(1);
	const [search, setSearch] = (0, import_react.useState)("");
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [deleteBusy, setDeleteBusy] = (0, import_react.useState)(false);
	const [togglingId, setTogglingId] = (0, import_react.useState)(null);
	const [startingId, setStartingId] = (0, import_react.useState)(null);
	const [swapping, setSwapping] = (0, import_react.useState)(null);
	const queryClient = useQueryClient();
	const q = useQuery({
		queryKey: [
			"tasks",
			page,
			search
		],
		queryFn: () => getTasks({
			page,
			search
		})
	});
	const allTasks = useQuery({
		queryKey: ["tasks", "all-for-stats"],
		queryFn: () => getTasks({})
	});
	const doneCount = allTasks.data?.rows.filter((t) => t.rawStatus === "done").length ?? 0;
	const inProgressCount = allTasks.data?.rows.filter((t) => t.rawStatus === "in_progress").length ?? 0;
	const overdueCount = allTasks.data?.rows.filter((t) => t.dueDate && t.rawStatus !== "done" && new Date(t.dueDate) < /* @__PURE__ */ new Date()).length ?? 0;
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["tasks"] });
	}
	async function handleDelete() {
		if (!deleting) return;
		setDeleteBusy(true);
		try {
			await deleteTask(deleting._id);
			toast.success(`${deleting.title} was removed.`);
			setDeleting(null);
			invalidate();
		} catch {
			toast.error("Could not delete this task. Please try again.");
		} finally {
			setDeleteBusy(false);
		}
	}
	async function handleToggleDone(row) {
		setTogglingId(row._id);
		try {
			const nextStatus = row.rawStatus === "done" ? "todo" : "done";
			await updateTask(row._id, { status: nextStatus });
			toast.success(nextStatus === "done" ? `${row.title} marked as completed.` : `${row.title} moved back to pending.`);
			invalidate();
		} catch {
			toast.error("Could not update this task. Please try again.");
		} finally {
			setTogglingId(null);
		}
	}
	async function handleStart(row) {
		setStartingId(row._id);
		try {
			await updateTask(row._id, { status: "in_progress" });
			toast.success(`${row.title} started.`);
			invalidate();
		} catch {
			toast.error("Could not start this task. Please try again.");
		} finally {
			setStartingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Operations",
			title: "Tasks",
			subtitle: "Assign, prioritize, and track operational to-dos across the team."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Tasks",
					value: String(allTasks.data?.count ?? "—"),
					icon: ListTodo,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "In Progress",
					value: String(inProgressCount),
					icon: Clock,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Completed",
					value: String(doneCount),
					icon: CircleCheck,
					accent: "emerald",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Overdue",
					value: String(overdueCount),
					icon: TriangleAlert,
					accent: "rose",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChartCard, {
				title: "All tasks",
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
							placeholder: "Search by title, ID, or assignee...",
							className: "rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setAddOpen(true),
						className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add task"]
					})]
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: q.data?.rows || [],
					empty: q.isLoading ? "Loading..." : "No tasks found.",
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
							key: "title",
							header: "Title"
						},
						{
							key: "assignee",
							header: "Assignee",
							render: (r) => r.assignee || "—"
						},
						{
							key: "dueDate",
							header: "Due",
							render: (r) => r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "—"
						},
						{
							key: "time",
							header: "Time",
							render: (r) => r.timeDisplay || "—"
						},
						{
							key: "priority",
							header: "Priority",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: r.priority })
						},
						{
							key: "status",
							header: "Status",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
						},
						{
							key: "act",
							header: "Actions",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleToggleDone(r),
										disabled: togglingId === r._id,
										title: r.rawStatus === "done" ? "Mark as pending" : "Mark complete",
										className: cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors disabled:opacity-50", r.rawStatus === "done" ? "border-emerald-500 bg-emerald-500 text-white" : "border-border text-transparent hover:border-emerald-400"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "h-3.5 w-3.5",
											strokeWidth: 3
										})
									}),
									r.rawStatus === "todo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleStart(r),
										disabled: startingId === r._id,
										className: "text-muted-foreground hover:text-primary disabled:opacity-50",
										title: "Start task",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSwapping(r),
										className: "text-muted-foreground hover:text-primary",
										title: "Swap / assign to volunteer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-4 w-4" })
									}),
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
		addOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskFormModal, {
			title: "Add task",
			onClose: () => setAddOpen(false),
			onSubmit: async (payload) => {
				await createTask(payload);
				toast.success(`${payload.title} was added.`);
				invalidate();
				setAddOpen(false);
			}
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskFormModal, {
			title: "Edit task",
			initial: editing,
			onClose: () => setEditing(null),
			onSubmit: async (payload) => {
				await updateTask(editing._id, payload);
				toast.success(`${payload.title} was updated.`);
				invalidate();
				setEditing(null);
			}
		}),
		viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskViewModal, {
			task: viewing,
			onClose: () => setViewing(null)
		}),
		swapping && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwapModal, {
			task: swapping,
			onClose: () => setSwapping(null),
			onSwap: async (volunteerName) => {
				await updateTask(swapping._id, { assignee: volunteerName });
				toast.success(`${swapping.title} reassigned to ${volunteerName}.`);
				invalidate();
				setSwapping(null);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleting,
			onOpenChange: (o) => !o && setDeleting(null),
			title: "Delete this task?",
			description: `This will permanently remove ${deleting?.title ?? "this task"} (${deleting?.id ?? ""}) from the system. This action cannot be undone.`,
			loading: deleteBusy,
			onConfirm: handleDelete
		})
	] });
}
function TaskFormModal({ title, initial, onClose, onSubmit }) {
	const [taskTitle, setTaskTitle] = (0, import_react.useState)(initial?.title ?? "");
	const [description, setDescription] = (0, import_react.useState)(initial?.description ?? "");
	const [assignee, setAssignee] = (0, import_react.useState)(initial?.assignee ?? "");
	const [dueDate, setDueDate] = (0, import_react.useState)(initial?.dueDate ?? "");
	const [time, setTime] = (0, import_react.useState)(initial?.time ?? "");
	const [priority, setPriority] = (0, import_react.useState)(initial?.priority ?? "medium");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			await onSubmit({
				title: taskTitle,
				description,
				assignee,
				due_date: dueDate || null,
				time: time || null,
				priority
			});
		} catch (err) {
			const data = err?.response?.data;
			const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
			const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this task.";
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
							label: "Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: taskTitle,
								onChange: (e) => setTaskTitle(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Assignee",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: assignee,
									onChange: (e) => setAssignee(e.target.value),
									className: inputCls
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Due date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: dueDate ?? "",
									onChange: (e) => setDueDate(e.target.value),
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Time",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "time",
								value: time ?? "",
								onChange: (e) => setTime(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Priority",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: priority,
								onChange: (e) => setPriority(e.target.value),
								className: inputCls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "low",
										children: "Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "medium",
										children: "Medium"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "high",
										children: "High"
									})
								]
							})
						}),
						!initial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"New tasks start as ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "Pending"
								}),
								". Use",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "Start"
								}),
								" and the checkbox on the list to move it along."
							]
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
function TaskViewModal({ task, onClose }) {
	const rows = [
		["Task ID", task.id],
		["Title", task.title],
		["Description", task.description || "—"],
		["Assignee", task.assignee || "—"],
		["Due Date", task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"],
		["Time", task.timeDisplay || "—"],
		["Priority", task.priority],
		["Status", task.status],
		["Created", new Date(task.createdAt).toLocaleDateString()]
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
					children: "Task details"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 divide-y divide-border",
					children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "shrink-0 text-muted-foreground",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right font-medium",
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
function SwapModal({ task, onClose, onSwap }) {
	const [selected, setSelected] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const volunteers = useQuery({
		queryKey: ["volunteers", "for-swap"],
		queryFn: () => getVolunteers({})
	});
	async function handleConfirm() {
		if (!selected) return;
		setSaving(true);
		setError(null);
		try {
			await onSwap(selected);
		} catch {
			setError("Could not reassign this task. Please try again.");
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
					children: "Swap / assign task"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"\"",
						task.title,
						"\" is currently with",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: task.assignee || "no one"
						}),
						". Choose who should take it."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 max-h-64 space-y-1 overflow-y-auto",
					children: [
						volunteers.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-4 text-center text-sm text-muted-foreground",
							children: "Loading volunteers..."
						}),
						volunteers.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-4 text-center text-sm text-muted-foreground",
							children: "No volunteers found."
						}),
						volunteers.data?.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelected(v.name),
							className: cn("flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors", selected === v.name ? "border-primary bg-primary/5 font-semibold" : "border-border hover:bg-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: v.name }), v.zone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: v.zone
							})]
						}, v._id))
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-rose-600",
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
						disabled: !selected || saving,
						onClick: handleConfirm,
						className: "rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50",
						children: saving ? "Assigning..." : "Assign"
					})]
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
export { TasksPage as component };
