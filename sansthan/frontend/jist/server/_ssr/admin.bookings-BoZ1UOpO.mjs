import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { G as Funnel, T as Plus, Y as Download, Z as Clock, a as User, d as Trash2, et as CircleX, nt as CircleCheck, t as X, ut as CalendarCheck, x as Search } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge } from "./badges-D8YuufmK.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-DgHLNp1f.mjs";
import { c as deleteBooking, m as getDevotees, n as createBooking, p as getBookings, v as getSevas } from "./api-DLk44LQ3.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as E } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.bookings-BoZ1UOpO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookingViewModal({ booking, onClose }) {
	const rows = [
		["Booking ID", booking.id],
		["Devotee", booking.devotee],
		["Seva", booking.seva],
		["Date", booking.date],
		["Slot", booking.slot],
		["Amount", booking.amount],
		["Channel", booking.channel],
		["Status", booking.status],
		...booking.billNumber ? [["Bill Number", booking.billNumber]] : [],
		...booking.paymentId ? [["Payment ID", booking.paymentId]] : []
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
					children: "Booking details"
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
var inputCls = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
		children: label
	}), children] });
}
/** "New Booking" — the seva dropdown is fed straight from getSevas(), so any
*  seva added on the Sevas & Services page (including brand new ones) shows
*  up here immediately, no separate wiring needed. */
function BookingFormModal({ sevas, onClose, onSubmit }) {
	const [devoteeSearch, setDevoteeSearch] = (0, import_react.useState)("");
	const [devotee, setDevotee] = (0, import_react.useState)(null);
	const [sevaId, setSevaId] = (0, import_react.useState)(sevas[0]?.id ?? "");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [slot, setSlot] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)(sevas[0] ? String(sevas[0].priceRaw) : "");
	const [channel, setChannel] = (0, import_react.useState)("counter");
	const [status, setStatus] = (0, import_react.useState)("pending");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const devoteeQuery = useQuery({
		queryKey: [
			"devotees",
			"booking-search",
			devoteeSearch
		],
		queryFn: () => getDevotees({
			search: devoteeSearch,
			page: 1
		}),
		enabled: devoteeSearch.trim().length > 0 && !devotee
	});
	const selectedSeva = (0, import_react.useMemo)(() => sevas.find((s) => s.id === sevaId) ?? null, [sevas, sevaId]);
	function handleSevaChange(id) {
		setSevaId(id);
		const s = sevas.find((x) => x.id === id);
		if (s) setAmount(String(s.priceRaw));
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!devotee) {
			setError("Please select a devotee first.");
			return;
		}
		if (!sevaId) {
			setError("Please select a seva.");
			return;
		}
		if (!slot.trim()) {
			setError("Please enter a slot (e.g. 7:00 AM).");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			await onSubmit({
				devotee: devotee._id,
				seva: Number(sevaId),
				date,
				slot,
				amount: Number(amount) || selectedSeva?.priceRaw || 0,
				channel,
				status
			});
		} catch (err) {
			const data = err?.response?.data;
			const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
			const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not create this booking.";
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-semibold",
					children: "New Booking"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Devotee",
						children: devotee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: devotee.name
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"(",
										devotee.id,
										")"
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDevotee(null),
								className: "text-muted-foreground hover:text-rose-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									value: devoteeSearch,
									onChange: (e) => setDevoteeSearch(e.target.value),
									placeholder: "Search by name, mobile or devotee ID...",
									className: "w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
								}),
								devoteeSearch.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg",
									children: [
										devoteeQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "p-3 text-xs text-muted-foreground",
											children: "Searching..."
										}),
										devoteeQuery.data && devoteeQuery.data.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "p-3 text-xs text-muted-foreground",
											children: "No devotees found."
										}),
										devoteeQuery.data?.rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setDevotee({
													_id: d._id,
													id: d.id,
													name: d.name,
													mobile: d.mobile
												});
												setDevoteeSearch("");
											},
											className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-muted-foreground" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: d.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: [
														d.id,
														" · ",
														d.mobile
													]
												})
											]
										}, d._id))
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Seva",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							required: true,
							value: sevaId,
							onChange: (e) => handleSevaChange(Number(e.target.value)),
							className: inputCls,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								disabled: true,
								children: "Select a seva..."
							}), sevas.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.id,
								children: [
									s.name,
									" — ",
									s.price
								]
							}, s.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value),
								className: inputCls
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Slot",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "e.g. 7:00 AM",
								value: slot,
								onChange: (e) => setSlot(e.target.value),
								className: inputCls
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								min: 1,
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								className: inputCls
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Channel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: channel,
								onChange: (e) => setChannel(e.target.value),
								className: inputCls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "counter",
										children: "Counter"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "web",
										children: "Web"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mobile",
										children: "Mobile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "whatsapp",
										children: "WhatsApp"
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: status,
							onChange: (e) => setStatus(e.target.value),
							className: inputCls,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pending",
									children: "Pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "confirmed",
									children: "Confirmed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "completed",
									children: "Completed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "cancelled",
									children: "Cancelled"
								})
							]
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
							children: saving ? "Saving..." : "Create Booking"
						})]
					})
				]
			})]
		})
	});
}
var SplitComponent = () => {
	const q = useQuery({
		queryKey: ["bookings"],
		queryFn: getBookings
	});
	const sevasQ = useQuery({
		queryKey: ["sevas"],
		queryFn: getSevas
	});
	const queryClient = useQueryClient();
	const [view, setView] = (0, import_react.useState)("List");
	const [viewing, setViewing] = (0, import_react.useState)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [deleteBusy, setDeleteBusy] = (0, import_react.useState)(false);
	const bookings = q.data || [];
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todaysCount = bookings.filter((b) => b.date === todayStr).length;
	const awaitingCount = bookings.filter((b) => b.rawStatus === "pending").length;
	const confirmedCount = bookings.filter((b) => b.rawStatus === "confirmed").length;
	const cancelledCount = bookings.filter((b) => b.rawStatus === "cancelled").length;
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["bookings"] });
	}
	async function handleDelete() {
		if (!deleting) return;
		setDeleteBusy(true);
		try {
			await deleteBooking(deleting._id);
			toast.success(`Booking ${deleting.id} removed.`);
			invalidate();
			setDeleting(null);
		} catch (err) {
			toast.error(err?.response?.data?.detail || "Could not remove this booking.");
		} finally {
			setDeleteBusy(false);
		}
	}
	function handleExportPdf() {
		if (bookings.length === 0) {
			toast.error("No bookings to export.");
			return;
		}
		const doc = new E();
		doc.setFontSize(14);
		doc.text("Booking Management — Sansthan", 14, 16);
		doc.setFontSize(9);
		doc.setTextColor(120);
		doc.text(`Generated ${(/* @__PURE__ */ new Date()).toLocaleString("en-IN")} · ${bookings.length} bookings`, 14, 22);
		autoTable(doc, {
			startY: 28,
			head: [[
				"ID",
				"Devotee",
				"Seva",
				"Date",
				"Slot",
				"Amount",
				"Channel",
				"Payment ID",
				"Status"
			]],
			body: bookings.map((b) => [
				b.id,
				b.devotee,
				b.seva,
				b.date,
				b.slot,
				b.amount,
				b.channel,
				b.paymentId || "—",
				b.status
			]),
			styles: {
				fontSize: 8,
				cellPadding: 3
			},
			headStyles: { fillColor: [
				180,
				83,
				9
			] },
			alternateRowStyles: { fillColor: [
				250,
				245,
				235
			] }
		});
		doc.save(`bookings-${todayStr}.pdf`);
		toast.success("Bookings exported as PDF.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Operations",
			title: "Booking Management",
			subtitle: "Approve, reschedule, cancel and manage the entire booking pipeline."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Today's Bookings",
					value: String(todaysCount),
					icon: CalendarCheck,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Awaiting Approval",
					value: String(awaitingCount),
					icon: Clock,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Confirmed",
					value: String(confirmedCount),
					icon: CircleCheck,
					accent: "emerald",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Cancelled",
					value: String(cancelledCount),
					icon: CircleX,
					accent: "rose",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex gap-1 rounded-full border border-border bg-card p-1 w-fit",
			children: [
				"List",
				"Calendar",
				"Day view"
			].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setView(v),
				className: cn("rounded-full px-4 py-1.5 text-sm font-medium", view === v ? "bg-foreground text-background" : "text-muted-foreground"),
				children: v
			}, v))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "All bookings",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative hidden sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Search...",
								className: "rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), " Filter"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleExportPdf,
							className: "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setAddOpen(true),
							className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New Booking"]
						})
					]
				}),
				children: view === "List" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: bookings,
					empty: q.isLoading ? "Loading..." : "No bookings found.",
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
							key: "devotee",
							header: "Devotee"
						},
						{
							key: "seva",
							header: "Seva"
						},
						{
							key: "date",
							header: "Date"
						},
						{
							key: "slot",
							header: "Slot"
						},
						{
							key: "amount",
							header: "Amount",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: r.amount
							})
						},
						{
							key: "channel",
							header: "Channel"
						},
						{
							key: "paymentId",
							header: "Payment ID",
							render: (r) => r.paymentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: r.paymentId
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "—"
							})
						},
						{
							key: "status",
							header: "Status",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
						},
						{
							key: "act",
							header: "",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewing(r),
								className: "text-xs font-semibold text-primary hover:underline",
								children: "View"
							})
						},
						{
							key: "remove",
							header: "",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleting(r),
								className: "inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline",
								title: "Remove booking",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						}
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [view, " coming soon"]
				})
			})
		}),
		viewing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingViewModal, {
			booking: viewing,
			onClose: () => setViewing(null)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleting,
			onOpenChange: (open) => !open && setDeleting(null),
			title: "Remove this booking?",
			description: deleting ? `This will permanently remove booking ${deleting.id} for ${deleting.devotee}. This cannot be undone.` : "",
			loading: deleteBusy,
			onConfirm: handleDelete
		}),
		addOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingFormModal, {
			sevas: sevasQ.data || [],
			onClose: () => setAddOpen(false),
			onSubmit: async (payload) => {
				await createBooking(payload);
				toast.success("Booking created.");
				invalidate();
				setAddOpen(false);
			}
		})
	] });
};
//#endregion
export { SplitComponent as component };
