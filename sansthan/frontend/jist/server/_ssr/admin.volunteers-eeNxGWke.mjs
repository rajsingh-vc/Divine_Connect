import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Plus, P as Pencil, T as Search, X as HandHeart, at as Clock3, c as Upload, f as Trash2, ht as Camera, i as Users, ot as ClipboardList, t as X, tt as Eye } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-DgHLNp1f.mjs";
import { C as rejectVolunteer, O as updateVolunteer, S as getVolunteersPage, b as getVolunteerStats, d as deleteVolunteer, i as createPermanentVolunteer, s as createTemporaryVolunteer, t as approveVolunteer, w as reviewVolunteer } from "./api-CW1DFv5Z.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PaginationBar } from "./pagination-bar-CPhYdbuc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.volunteers-eeNxGWke.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		key: "all",
		label: "All Volunteers",
		status: void 0
	},
	{
		key: "roster",
		label: "Roster",
		status: "active"
	},
	{
		key: "applications",
		label: "Applications",
		status: "pending"
	},
	{
		key: "review",
		label: "Review",
		status: "approved"
	},
	{
		key: "rejected",
		label: "Rejected",
		status: "rejected"
	}
];
function VolunteersPage() {
	const [tab, setTab] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [addType, setAddType] = (0, import_react.useState)(null);
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [deleteBusy, setDeleteBusy] = (0, import_react.useState)(false);
	const activeTab = TABS.find((t) => t.key === tab);
	const queryClient = useQueryClient();
	const stats = useQuery({
		queryKey: ["volunteerStats"],
		queryFn: getVolunteerStats
	});
	const list = useQuery({
		queryKey: [
			"volunteersPage",
			activeTab.status,
			search,
			page
		],
		queryFn: () => getVolunteersPage({
			status: activeTab.status,
			search,
			page
		})
	});
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["volunteersPage"] });
		queryClient.invalidateQueries({ queryKey: ["volunteerStats"] });
	}
	function switchTab(key) {
		setTab(key);
		setPage(1);
	}
	async function handleDelete() {
		if (!deleting) return;
		setDeleteBusy(true);
		try {
			await deleteVolunteer(deleting._id);
			toast.success(`${deleting.name} was removed.`);
			setDeleting(null);
			invalidate();
		} catch {
			toast.error("Could not delete this volunteer. Please try again.");
		} finally {
			setDeleteBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Operations",
			title: "Volunteer Management",
			subtitle: "Register temporary and permanent volunteers, review applications, and manage the active roster."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active Volunteers",
					value: String(stats.data?.active_volunteers ?? "—"),
					icon: Users,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "On Duty Now",
					value: String(stats.data?.on_duty_now ?? "—"),
					icon: HandHeart,
					accent: "emerald",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Permanent",
					value: String(stats.data?.permanent ?? "—"),
					icon: Clock3,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Temporary",
					value: String(stats.data?.temporary ?? "—"),
					icon: ClipboardList,
					accent: "rose",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 rounded-full border border-border bg-card p-1 w-fit overflow-x-auto",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => switchTab(t.key),
					className: cn("whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors", tab === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"),
					children: t.label
				}, t.key))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => {
								setSearch(e.target.value);
								setPage(1);
							},
							placeholder: "Search by name or volunteer ID...",
							className: "rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:border-primary w-56"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setAddType("temporary"),
						className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Temporary"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setAddType("permanent"),
						className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Permanent"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChartCard, {
				title: activeTab.label,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolunteerTable, {
					tab,
					rows: list.data?.rows || [],
					loading: list.isLoading,
					onView: setViewing,
					onEdit: setEditing,
					onDelete: setDeleting,
					onChange: invalidate
				}), list.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
					page,
					pageSize: 20,
					count: list.data.count,
					onPageChange: setPage
				})]
			})
		}),
		addType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddVolunteerModal, {
			type: addType,
			onClose: () => setAddType(null),
			onDone: () => {
				invalidate();
				setAddType(null);
			}
		}),
		viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolunteerViewModal, {
			volunteer: viewing,
			onClose: () => setViewing(null)
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolunteerEditModal, {
			volunteer: editing,
			onClose: () => setEditing(null),
			onDone: () => {
				invalidate();
				setEditing(null);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleting,
			onOpenChange: (o) => !o && setDeleting(null),
			title: "Delete this volunteer?",
			description: `This will permanently remove ${deleting?.name ?? "this volunteer"} (${deleting?.id ?? ""}) from the system. This action cannot be undone.`,
			loading: deleteBusy,
			onConfirm: handleDelete
		})
	] });
}
function VolunteerTable({ tab, rows, loading, onView, onEdit, onDelete, onChange }) {
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [reviewingId, setReviewingId] = (0, import_react.useState)(null);
	async function handleApprove(id) {
		setBusyId(id);
		try {
			await approveVolunteer(id);
			toast.success("Application approved — moved to Review.");
			onChange();
		} catch {
			toast.error("Could not approve this application.");
		} finally {
			setBusyId(null);
		}
	}
	async function handleReject(id) {
		setBusyId(id);
		try {
			await rejectVolunteer(id, "Did not meet criteria");
			toast.success("Application rejected.");
			onChange();
		} catch {
			toast.error("Could not reject this application.");
		} finally {
			setBusyId(null);
		}
	}
	const baseColumns = [
		{
			key: "id",
			header: "Volunteer ID",
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
			key: "email",
			header: "Email"
		},
		{
			key: "phone",
			header: "Phone"
		},
		{
			key: "volunteerType",
			header: "Type",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "capitalize",
				children: r.volunteerType
			})
		}
	];
	const rowActions = (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onView(r),
				className: "text-muted-foreground hover:text-primary",
				title: "View",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onEdit(r),
				className: "text-muted-foreground hover:text-primary",
				title: "Edit",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onDelete(r),
				className: "text-muted-foreground hover:text-rose-600",
				title: "Delete",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})
		]
	});
	if (tab === "applications") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		rows,
		loading,
		empty: loading ? "Loading..." : "No pending applications.",
		columns: [...baseColumns, {
			key: "act",
			header: "Actions",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busyId === r._id,
						onClick: () => handleApprove(r._id),
						className: "rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50",
						children: "Approve"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busyId === r._id,
						onClick: () => handleReject(r._id),
						className: "rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50",
						children: "Reject"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setReviewingId(r._id),
						className: "rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted",
						children: "Review"
					}),
					rowActions(r)
				]
			})
		}]
	}), reviewingId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewModal, {
		volunteerId: reviewingId,
		onClose: () => setReviewingId(null),
		onDone: onChange
	})] });
	if (tab === "review") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		rows,
		loading,
		empty: loading ? "Loading..." : "No volunteers awaiting review.",
		columns: [...baseColumns, {
			key: "act",
			header: "Actions",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setReviewingId(r._id),
					className: "rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background",
					children: "Finalize into roster"
				}), rowActions(r)]
			})
		}]
	}), reviewingId != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewModal, {
		volunteerId: reviewingId,
		onClose: () => setReviewingId(null),
		onDone: onChange
	})] });
	if (tab === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		rows,
		loading,
		empty: loading ? "Loading..." : "No rejected applications.",
		columns: [
			...baseColumns,
			{
				key: "rejectionReason",
				header: "Reason"
			},
			{
				key: "act",
				header: "Actions",
				render: rowActions
			}
		]
	});
	if (tab === "roster") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		rows,
		loading,
		empty: loading ? "Loading..." : "No active volunteers yet.",
		columns: [
			...baseColumns,
			{
				key: "assignedSeva",
				header: "Assigned Seva"
			},
			{
				key: "shift",
				header: "Shift"
			},
			{
				key: "act",
				header: "Actions",
				render: rowActions
			}
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		rows,
		loading,
		empty: loading ? "Loading..." : "No volunteers yet.",
		columns: [
			...baseColumns,
			{
				key: "status",
				header: "Status"
			},
			{
				key: "act",
				header: "Actions",
				render: rowActions
			}
		]
	});
}
function AddVolunteerModal({ type, onClose, onDone }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [referenceVolunteerName, setReferenceVolunteerName] = (0, import_react.useState)("");
	const [homeAddress, setHomeAddress] = (0, import_react.useState)("");
	const [idProofType, setIdProofType] = (0, import_react.useState)("aadhaar");
	const [idProofNumber, setIdProofNumber] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [photoPreview, setPhotoPreview] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const cameraInputRef = (0, import_react.useRef)(null);
	function onPhotoSelected(file) {
		setPhoto(file);
		setPhotoPreview(file ? URL.createObjectURL(file) : null);
	}
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			if (type === "temporary") {
				await createTemporaryVolunteer({
					name,
					phone,
					email,
					reference_volunteer_name: referenceVolunteerName
				});
				toast.success(`${name} was registered as a temporary volunteer.`);
			} else {
				await createPermanentVolunteer({
					name,
					email,
					home_address: homeAddress,
					phone,
					id_proof_type: idProofType,
					id_proof_number: idProofNumber,
					photo
				});
				toast.success(`${name} was registered as a permanent volunteer.`);
			}
			onDone();
		} catch (err) {
			const data = err?.response?.data;
			const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
			const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not register this volunteer.";
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-serif text-lg font-semibold capitalize",
					children: [
						"Add ",
						type,
						" volunteer"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: type === "temporary" ? "Requires an existing volunteer's name as a reference for verification." : "Full registration with identity verification for the permanent roster."
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
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: inputCls
							})
						}),
						type === "temporary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Reference Volunteer Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: referenceVolunteerName,
								onChange: (e) => setReferenceVolunteerName(e.target.value),
								placeholder: "Must match an existing volunteer",
								className: inputCls
							})
						}),
						type === "permanent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Home Address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: homeAddress,
									onChange: (e) => setHomeAddress(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Verification Type",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: idProofType,
										onChange: (e) => setIdProofType(e.target.value),
										className: inputCls,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "aadhaar",
												children: "Aadhaar Card"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "pan",
												children: "PAN Card"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "driving_licence",
												children: "Driving Licence"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Verification Number",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										value: idProofNumber,
										onChange: (e) => setIdProofNumber(e.target.value),
										className: inputCls
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Photo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-3",
								children: [
									photoPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: photoPreview,
											alt: "Preview",
											className: "h-16 w-16 rounded-lg object-cover border border-border"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => onPhotoSelected(null),
											className: "absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-rose-600 text-white",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-16 w-16 place-items-center rounded-lg border border-dashed border-border text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Upload photo"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => cameraInputRef.current?.click(),
											className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" }), " Take photo"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileInputRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => onPhotoSelected(e.target.files?.[0] ?? null)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: cameraInputRef,
										type: "file",
										accept: "image/*",
										capture: "user",
										className: "hidden",
										onChange: (e) => onPhotoSelected(e.target.files?.[0] ?? null)
									})
								]
							})] })
						] }),
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
								children: saving ? "Saving..." : "Register volunteer"
							})]
						})
					]
				})
			]
		})
	});
}
function VolunteerEditModal({ volunteer, onClose, onDone }) {
	const [name, setName] = (0, import_react.useState)(volunteer.name);
	const [email, setEmail] = (0, import_react.useState)(volunteer.email);
	const [phone, setPhone] = (0, import_react.useState)(volunteer.phone);
	const [homeAddress, setHomeAddress] = (0, import_react.useState)(volunteer.homeAddress || "");
	const [idProofType, setIdProofType] = (0, import_react.useState)(volunteer.idProofType || "aadhaar");
	const [idProofNumber, setIdProofNumber] = (0, import_react.useState)(volunteer.idProofNumber || "");
	const [zone, setZone] = (0, import_react.useState)(volunteer.zone || "");
	const [shift, setShift] = (0, import_react.useState)(volunteer.shift || "");
	const [assignedSeva, setAssignedSeva] = (0, import_react.useState)(volunteer.assignedSeva || "");
	const [photo, setPhoto] = (0, import_react.useState)(void 0);
	const [photoPreview, setPhotoPreview] = (0, import_react.useState)(volunteer.photo);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			const payload = {
				name,
				email,
				phone,
				zone,
				shift,
				assigned_seva: assignedSeva
			};
			if (volunteer.volunteerType === "permanent") {
				payload.home_address = homeAddress;
				payload.id_proof_type = idProofType;
				payload.id_proof_number = idProofNumber;
			}
			await updateVolunteer(volunteer._id, payload, photo);
			toast.success(`${name} was updated.`);
			onDone();
		} catch (err) {
			const data = err?.response?.data;
			const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
			const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not update this volunteer.";
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
					children: "Edit volunteer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						volunteer.id,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: volunteer.volunteerType
						})
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
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: inputCls
							})
						}),
						volunteer.volunteerType === "permanent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Home Address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: homeAddress,
									onChange: (e) => setHomeAddress(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Verification Type",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: idProofType,
										onChange: (e) => setIdProofType(e.target.value),
										className: inputCls,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "aadhaar",
												children: "Aadhaar Card"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "pan",
												children: "PAN Card"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "driving_licence",
												children: "Driving Licence"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Verification Number",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: idProofNumber,
										onChange: (e) => setIdProofNumber(e.target.value),
										className: inputCls
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Photo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-3",
								children: [
									photoPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photoPreview,
										alt: "Preview",
										className: "h-16 w-16 rounded-lg object-cover border border-border"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-16 w-16 place-items-center rounded-lg border border-dashed border-border text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => fileInputRef.current?.click(),
										className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), " Replace photo"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileInputRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => {
											const f = e.target.files?.[0] ?? null;
											setPhoto(f);
											setPhotoPreview(f ? URL.createObjectURL(f) : photoPreview);
										}
									})
								]
							})] })
						] }),
						volunteer.rawStatus === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Zone",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: zone,
										onChange: (e) => setZone(e.target.value),
										className: inputCls
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Shift",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: shift,
										onChange: (e) => setShift(e.target.value),
										className: inputCls
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Assigned Seva",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: assignedSeva,
										onChange: (e) => setAssignedSeva(e.target.value),
										className: inputCls
									})
								})
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
								children: saving ? "Saving..." : "Save changes"
							})]
						})
					]
				})
			]
		})
	});
}
function VolunteerViewModal({ volunteer, onClose }) {
	const rows = [
		["Volunteer ID", volunteer.id],
		["Name", volunteer.name],
		["Email", volunteer.email || "—"],
		["Phone", volunteer.phone || "—"],
		["Type", volunteer.volunteerType],
		["Status", volunteer.status]
	];
	if (volunteer.volunteerType === "temporary") rows.push(["Reference Volunteer", volunteer.referenceVolunteerName || "—"]);
	else rows.push(["Home Address", volunteer.homeAddress || "—"], ["Verification Type", volunteer.idProofTypeDisplay || "—"], ["Verification Number", volunteer.idProofNumber || "—"]);
	rows.push(["Zone", volunteer.zone || "—"], ["Shift", volunteer.shift || "—"], ["Assigned Seva", volunteer.assignedSeva || "—"], ["Hours Logged", String(volunteer.hours)], ["Applied", new Date(volunteer.appliedAt).toLocaleDateString()]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-card p-5 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [volunteer.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: volunteer.photo,
						alt: volunteer.name,
						className: "h-14 w-14 rounded-full object-cover border border-border"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary font-semibold",
						children: volunteer.name?.[0]?.toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-semibold",
						children: volunteer.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground capitalize",
						children: [volunteer.volunteerType, " volunteer"]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 divide-y divide-border",
					children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium capitalize text-right",
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
function ReviewModal({ volunteerId, onClose, onDone }) {
	const [assignedSeva, setAssignedSeva] = (0, import_react.useState)("");
	const [shift, setShift] = (0, import_react.useState)("");
	const [zone, setZone] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit() {
		setSaving(true);
		setError(null);
		try {
			await reviewVolunteer(volunteerId, {
				assigned_seva: assignedSeva,
				shift,
				zone
			});
			toast.success("Volunteer finalized into the roster.");
			onDone();
			onClose();
		} catch {
			const msg = "Could not finalize this volunteer. Please check the fields and try again.";
			setError(msg);
			toast.error(msg);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-semibold",
					children: "Finalize volunteer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Assign a seva, shift and zone to move this volunteer onto the active roster."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Assigned Seva",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: assignedSeva,
								onChange: (e) => setAssignedSeva(e.target.value),
								required: true,
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Shift",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: shift,
								onChange: (e) => setShift(e.target.value),
								required: true,
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Zone (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: zone,
								onChange: (e) => setZone(e.target.value),
								className: inputCls
							})
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
						onClick: onClose,
						className: "rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: saving || !assignedSeva || !shift,
						onClick: submit,
						className: "rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50",
						children: saving ? "Saving..." : "Finalize"
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
export { VolunteersPage as component };
