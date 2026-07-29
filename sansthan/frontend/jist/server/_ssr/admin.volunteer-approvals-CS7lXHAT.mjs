import { o as __toESM } from "../_runtime.mjs";
import { r as getAccessToken } from "./api-gwD-5_E_.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { J as Eye, at as Check, d as Trash2, t as X, x as Search } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./chart-card-Cwq4vD8L.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PaginationBar } from "./pagination-bar-CPhYdbuc.mjs";
import { a as getVolunteerApprovalsPage, o as getVolunteerAuditLog, r as deleteVolunteer, s as getVolunteerDetail, t as adminAction } from "./volunteer-verification-DVGD0VGT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.volunteer-approvals-CS7lXHAT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STYLES = {
	pending_volunteer_approval: {
		label: "Pending Volunteer Approval",
		className: "bg-amber-100 text-amber-800"
	},
	volunteer_approved: {
		label: "Volunteer Approved",
		className: "bg-blue-100 text-blue-800"
	},
	volunteer_rejected: {
		label: "Volunteer Rejected",
		className: "bg-red-100 text-red-800"
	},
	admin_approved: {
		label: "Admin Approved",
		className: "bg-green-100 text-green-800"
	},
	admin_rejected: {
		label: "Admin Rejected",
		className: "bg-red-100 text-red-800"
	},
	auto_rejected: {
		label: "Auto Rejected",
		className: "bg-gray-200 text-gray-700"
	}
};
function StatusBadge({ status }) {
	const s = STATUS_STYLES[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", s.className),
		children: s.label
	});
}
/**
* Opens a WebSocket to the Django Channels backend and keeps notification /
* volunteer-approval react-query caches fresh in real time, no page refresh
* needed. Reconnects automatically with backoff if the connection drops.
*/
function useVolunteerSocket() {
	const queryClient = useQueryClient();
	const retryRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		let socket = null;
		let closedByCleanup = false;
		let retryTimeout;
		function connect() {
			const token = getAccessToken();
			if (!token) return;
			const wsBase = "http://localhost:8000/api".replace(/\/api\/?$/, "").replace(/^http/, "ws");
			socket = new WebSocket(`${wsBase}/ws/volunteers/notifications/?token=${token}`);
			socket.onopen = () => {
				retryRef.current = 0;
			};
			socket.onmessage = (event) => {
				try {
					const payload = JSON.parse(event.data);
					queryClient.invalidateQueries({ queryKey: ["volunteerNotifications"] });
					queryClient.invalidateQueries({ queryKey: ["volunteerUnreadCount"] });
					if (payload.volunteer_id) {
						queryClient.invalidateQueries({ queryKey: ["volunteerApprovalsPage"] });
						queryClient.invalidateQueries({ queryKey: ["volunteerDetail", payload.volunteer_id] });
					}
				} catch {}
			};
			socket.onclose = () => {
				if (closedByCleanup) return;
				const delay = Math.min(1e3 * 2 ** retryRef.current, 15e3);
				retryRef.current += 1;
				retryTimeout = setTimeout(connect, delay);
			};
		}
		connect();
		return () => {
			closedByCleanup = true;
			clearTimeout(retryTimeout);
			socket?.close();
		};
	}, [queryClient]);
}
var STATUS_TABS = [
	{
		label: "All",
		value: void 0
	},
	{
		label: "Pending",
		value: "pending_volunteer_approval"
	},
	{
		label: "Volunteer Approved",
		value: "volunteer_approved"
	},
	{
		label: "Volunteer Rejected",
		value: "volunteer_rejected"
	},
	{
		label: "Admin Approved",
		value: "admin_approved"
	},
	{
		label: "Admin Rejected",
		value: "admin_rejected"
	},
	{
		label: "Auto Rejected",
		value: "auto_rejected"
	}
];
function extractErrorMessage(err) {
	const data = err?.response?.data;
	if (!data) return "Action failed.";
	if (typeof data.detail === "string") return data.detail;
	if (typeof data === "object") {
		const firstVal = data[Object.keys(data)[0]];
		if (Array.isArray(firstVal)) return String(firstVal[0]);
		if (typeof firstVal === "string") return firstVal;
	}
	return "Action failed.";
}
function DocThumb({ label, url }) {
	if (!url) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: url,
		target: "_blank",
		rel: "noopener noreferrer",
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: label,
			className: "h-24 w-full rounded-md border object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-center text-xs text-muted-foreground",
			children: label
		})]
	});
}
function VolunteerApprovalsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)(void 0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [rejecting, setRejecting] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	useVolunteerSocket();
	const list = useQuery({
		queryKey: [
			"volunteerApprovalsPage",
			status,
			search,
			page
		],
		queryFn: () => getVolunteerApprovalsPage({
			status,
			search,
			page
		})
	});
	const auditLog = useQuery({
		queryKey: ["volunteerAuditLog", viewing?.id],
		queryFn: () => getVolunteerAuditLog(viewing.id),
		enabled: !!viewing
	});
	const detail = useQuery({
		queryKey: ["volunteerDetail", viewing?.id],
		queryFn: () => getVolunteerDetail(viewing.id),
		enabled: !!viewing
	});
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["volunteerApprovalsPage"] });
	}
	async function handleAction(id, action, override = false, reason = "") {
		try {
			await adminAction(id, action, override, reason);
			toast.success(`Volunteer ${action}d.`);
			invalidate();
			setViewing(null);
		} catch (err) {
			toast.error(extractErrorMessage(err));
		}
	}
	async function confirmReject() {
		if (!rejecting || !rejecting.reason.trim()) {
			toast.error("A reason is required to reject.");
			return;
		}
		await handleAction(rejecting.id, "reject", false, rejecting.reason.trim());
		setRejecting(null);
	}
	async function confirmDelete() {
		if (!deleting) return;
		setIsDeleting(true);
		try {
			await deleteVolunteer(deleting.id);
			toast.success(`${deleting.name} deleted.`);
			invalidate();
			setDeleting(null);
			setViewing(null);
		} catch (err) {
			toast.error(extractErrorMessage(err));
		} finally {
			setIsDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Volunteer Approval Management",
				subtitle: "Review reference decisions and approve or reject new volunteer applications."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: STATUS_TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setStatus(tab.value);
						setPage(1);
					},
					className: `rounded-md px-3 py-1.5 text-sm ${status === tab.value ? "bg-primary text-white" : "border text-muted-foreground hover:bg-muted"}`,
					children: tab.label
				}, tab.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-md border py-2 pl-8 pr-3 text-sm",
						placeholder: "Search name, phone, email…",
						value: search,
						onChange: (e) => {
							setSearch(e.target.value);
							setPage(1);
						}
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				loading: list.isLoading,
				columns: [
					{
						key: "name",
						header: "Volunteer Name"
					},
					{
						key: "phone",
						header: "Phone"
					},
					{
						key: "email",
						header: "Email"
					},
					{
						key: "reference_volunteer_name",
						header: "Reference Volunteer"
					},
					{
						key: "reference_status",
						header: "Volunteer Approval Status",
						render: (row) => row.approval?.reference_status ?? "—"
					},
					{
						key: "public_id",
						header: "Volunteer ID",
						render: (row) => row.public_id ?? "—"
					},
					{
						key: "status",
						header: "Admin Status",
						render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })
					},
					{
						key: "created_at",
						header: "Submitted Date",
						render: (row) => new Date(row.created_at).toLocaleDateString()
					},
					{
						key: "actions",
						header: "Actions",
						render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setViewing(row),
									className: "rounded p-1 hover:bg-muted",
									title: "View Details",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleAction(row.id, "approve"),
									className: "rounded p-1 text-green-600 hover:bg-green-50",
									title: "Approve",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setRejecting({
										id: row.id,
										reason: ""
									}),
									className: "rounded p-1 text-red-600 hover:bg-red-50",
									title: "Reject",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDeleting({
										id: row.id,
										name: row.name
									}),
									className: "rounded p-1 text-red-700 hover:bg-red-100",
									title: "Delete permanently",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						})
					}
				],
				rows: list.data?.rows ?? []
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
				page,
				onPageChange: setPage,
				count: list.data?.count ?? 0,
				pageSize: 20
			}),
			viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex justify-end bg-black/40",
				onClick: () => setViewing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-full w-full max-w-md overflow-y-auto bg-background p-6",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: viewing.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewing(null),
								className: "text-sm text-muted-foreground",
								children: "Close"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Code:"
									}),
									" ",
									viewing.volunteer_code
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Volunteer ID:"
									}),
									" ",
									viewing.public_id ?? "Not yet assigned"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Phone:"
									}),
									" ",
									viewing.phone
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Email:"
									}),
									" ",
									viewing.email
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Reference:"
									}),
									" ",
									viewing.reference_volunteer_name || "—"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Reference comment:"
									}),
									" ",
									viewing.approval?.reference_comment || "—"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "Status:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: viewing.status })
									]
								}),
								viewing.approval?.reference_status === "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-amber-600",
									children: "Reference rejected. Approving now requires an override."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-2 text-sm font-semibold",
									children: "Documents"
								}),
								detail.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Loading documents…"
								}),
								detail.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "Profile Photo",
											url: detail.data.profile_photo
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "Aadhaar Front",
											url: detail.data.verification?.aadhaar_front
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "Aadhaar Back",
											url: detail.data.verification?.aadhaar_back
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "PAN Front",
											url: detail.data.verification?.pan_front
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "PAN Back",
											url: detail.data.verification?.pan_back
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "License Front",
											url: detail.data.verification?.license_front
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "License Back",
											url: detail.data.verification?.license_back
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocThumb, {
											label: "Live Photo",
											url: detail.data.verification?.live_photo
										})
									]
								}),
								detail.data && !detail.data.profile_photo && !Object.values(detail.data.verification || {}).some((v) => typeof v === "string" && v) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No documents uploaded."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleAction(viewing.id, "approve", viewing.approval?.reference_status === "rejected"),
								className: "flex-1 rounded-md bg-green-600 px-3 py-2 text-sm text-white",
								children: "Approve"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setRejecting({
									id: viewing.id,
									reason: ""
								}),
								className: "flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white",
								children: "Reject"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setDeleting({
								id: viewing.id,
								name: viewing.name
							}),
							className: "mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Delete Permanently"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 mt-6 text-sm font-semibold",
							children: "Audit Log"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-xs",
							children: [auditLog.data?.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: log.action.replace(/_/g, " ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: [
											log.actor_name || "System",
											" · ",
											new Date(log.created_at).toLocaleString()
										]
									}),
									log.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: log.detail
									})
								]
							}, log.id)), auditLog.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "No actions logged yet."
							})]
						})
					]
				})
			}),
			rejecting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] grid place-items-center bg-black/40",
				onClick: () => setRejecting(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-lg bg-background p-5 shadow-xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: "Reason for rejection"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Shown to the applicant and saved to the audit log — e.g. \"Blurry document photo\"."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							autoFocus: true,
							rows: 3,
							className: "mt-3 w-full rounded-md border p-2 text-sm",
							placeholder: "Reason…",
							value: rejecting.reason,
							onChange: (e) => setRejecting({
								...rejecting,
								reason: e.target.value
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setRejecting(null),
								className: "flex-1 rounded-md border px-3 py-2 text-sm",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: confirmReject,
								disabled: !rejecting.reason.trim(),
								className: "flex-1 rounded-md bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50",
								children: "Confirm Reject"
							})]
						})
					]
				})
			}),
			deleting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] grid place-items-center bg-black/40",
				onClick: () => !isDeleting && setDeleting(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-lg bg-background p-5 shadow-xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-semibold text-red-700",
							children: [
								"Delete ",
								deleting.name,
								"?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "This permanently removes the volunteer, their documents, and their full history. This cannot be undone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleting(null),
								disabled: isDeleting,
								className: "flex-1 rounded-md border px-3 py-2 text-sm disabled:opacity-50",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: confirmDelete,
								disabled: isDeleting,
								className: "flex-1 rounded-md bg-red-700 px-3 py-2 text-sm text-white disabled:opacity-50",
								children: isDeleting ? "Deleting…" : "Delete Permanently"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { VolunteerApprovalsPage as component };
