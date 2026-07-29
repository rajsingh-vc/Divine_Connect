import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-context-D5WWK08x.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Receipt, I as LoaderCircle, T as Plus, a as User, nt as CircleCheck, p as Sparkles, t as X, u as TrendingUp, ut as CalendarCheck, x as Search } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as formatINR } from "./format-oajkEy3m.mjs";
import { A as verifyBillPayment, D as updateSeva, S as getVolunteers, a as createSeva, f as generateBill, m as getDevotees, v as getSevas } from "./api-DLk44LQ3.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as getDashboardStats } from "./dashboard-jXpg-CuC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.sevas-CguD8aXY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var scriptPromise = null;
function loadRazorpayScript() {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.Razorpay) return Promise.resolve();
	if (scriptPromise) return scriptPromise;
	scriptPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			scriptPromise = null;
			reject(/* @__PURE__ */ new Error("Could not load Razorpay checkout script"));
		};
		document.body.appendChild(script);
	});
	return scriptPromise;
}
async function openRazorpayCheckout(opts) {
	await loadRazorpayScript();
	new window.Razorpay({
		key: opts.key,
		amount: opts.amount,
		currency: opts.currency,
		order_id: opts.orderId,
		name: opts.name || "Sansthan",
		description: opts.description || "Seva payment",
		prefill: opts.prefill || {},
		theme: { color: "#b45309" },
		handler: (response) => {
			opts.onSuccess({
				razorpay_order_id: response.razorpay_order_id,
				razorpay_payment_id: response.razorpay_payment_id,
				razorpay_signature: response.razorpay_signature
			});
		},
		modal: { ondismiss: () => opts.onDismiss?.() }
	}).open();
}
/**
* Admin/Volunteer -> Sevas & Services -> pick a seva -> choose devotee
* (+ optional volunteer referral) -> Generate Bill -> Razorpay -> Invoice.
*/
function GenerateBillModal({ seva, onClose, onCompleted }) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [step, setStep] = (0, import_react.useState)("form");
	const [devoteeSearch, setDevoteeSearch] = (0, import_react.useState)("");
	const [devotee, setDevotee] = (0, import_react.useState)(null);
	const [volunteerSearch, setVolunteerSearch] = (0, import_react.useState)("");
	const [volunteer, setVolunteer] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)(String(seva.priceRaw));
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [bill, setBill] = (0, import_react.useState)(null);
	const devoteeQuery = useQuery({
		queryKey: [
			"devotees",
			"bill-search",
			devoteeSearch
		],
		queryFn: () => getDevotees({
			search: devoteeSearch,
			page: 1
		}),
		enabled: devoteeSearch.trim().length > 0 && !devotee
	});
	const volunteerQuery = useQuery({
		queryKey: [
			"volunteers",
			"bill-search",
			volunteerSearch
		],
		queryFn: () => getVolunteers({
			search: volunteerSearch,
			status: "active"
		}),
		enabled: volunteerSearch.trim().length > 0 && !volunteer
	});
	async function handleGenerate() {
		if (!devotee) {
			setError("Please select a devotee first.");
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			const { bill: createdBill, razorpay } = await generateBill({
				devotee: devotee._id,
				seva: seva.id,
				volunteer: volunteer?._id ?? null,
				amount: Number(amount) || seva.priceRaw
			});
			setBill(createdBill);
			setStep("paying");
			await openRazorpayCheckout({
				key: razorpay.key,
				amount: razorpay.amount,
				currency: razorpay.currency,
				orderId: razorpay.order_id,
				name: "Sansthan Sevas",
				description: `${seva.name} — ${devotee.name}`,
				prefill: {
					name: devotee.name,
					contact: devotee.mobile
				},
				onSuccess: async (response) => {
					try {
						const result = await verifyBillPayment(createdBill.id, response);
						if (result.verified && result.bill) {
							setBill(result.bill);
							setStep("invoice");
							toast.success(`Bill ${createdBill.billNumber} completed.`);
							queryClient.invalidateQueries({ queryKey: ["bookings"] });
							onCompleted?.(createdBill.billNumber);
						} else {
							setError(result.message || "Payment could not be verified.");
							setStep("form");
							toast.error("Payment verification failed.");
						}
					} catch {
						setError("Payment could not be verified. Please check the Bills list.");
						setStep("form");
					}
				},
				onDismiss: () => {
					if (step !== "invoice") setStep("form");
				}
			});
		} catch (err) {
			const data = err?.response?.data;
			setError(data?.error || data?.details || "Could not generate this bill. Please try again.");
			setStep("form");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md rounded-2xl bg-card p-5 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: step !== "invoice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-semibold",
						children: "Bill"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						seva.name,
						" · ",
						formatINR(Number(amount) || seva.priceRaw)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Devotee"
						}), devotee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: ["Volunteer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "normal-case font-normal text-muted-foreground/70",
								children: "(optional — brought this devotee in)"
							})]
						}), volunteer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: volunteer.name
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"(",
										volunteer.id,
										")"
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setVolunteer(null),
								className: "text-muted-foreground hover:text-rose-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: volunteerSearch,
									onChange: (e) => setVolunteerSearch(e.target.value),
									placeholder: "Search volunteer name or ID...",
									className: "w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
								}),
								volunteerSearch.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg",
									children: [
										volunteerQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "p-3 text-xs text-muted-foreground",
											children: "Searching..."
										}),
										volunteerQuery.data && volunteerQuery.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "p-3 text-xs text-muted-foreground",
											children: "No volunteers found."
										}),
										volunteerQuery.data?.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setVolunteer({
													_id: v._id,
													id: v.id,
													name: v.name
												});
												setVolunteerSearch("");
											},
											className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-muted-foreground" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: v.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: v.id
												})
											]
										}, v._id))
									]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Amount (₹)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							value: amount,
							onChange: (e) => setAmount(e.target.value),
							className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Created by ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: user?.full_name || "—"
								}),
								" · ",
								(/* @__PURE__ */ new Date()).toLocaleString("en-IN")
							]
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
						disabled: submitting || step === "paying" || !devotee,
						onClick: handleGenerate,
						className: "inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50",
						children: [submitting || step === "paying" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : null, step === "paying" ? "Waiting for payment..." : "Bill"]
					})]
				})
			] }) : bill && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceView, {
				bill,
				onClose,
				navigate
			})
		})
	});
}
function InvoiceView({ bill, onClose, navigate }) {
	const rows = [
		["Invoice", bill.invoiceNumber],
		["Bill No", bill.billNumber],
		["Devotee", `${bill.devoteeName} (${bill.devoteeCode})`],
		["Seva", bill.sevaName],
		["Amount", bill.amount],
		["Volunteer", bill.volunteerName ? `${bill.volunteerName} (${bill.volunteerCode})` : "—"],
		["Payment ID", bill.razorpayPaymentId || "—"],
		["Date", bill.paidAt ? new Date(bill.paidAt).toLocaleString("en-IN") : "—"]
	];
	function goToBookings() {
		onClose();
		navigate({ to: "/admin/bookings" });
	}
	(0, import_react.useEffect)(() => {
		const t = setTimeout(goToBookings, 2e3);
		return () => clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-10 w-10 text-emerald-600" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-serif text-lg font-semibold",
				children: "Bill Completed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Invoice saved · redirecting to Bookings..."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 divide-y divide-border text-left",
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
				onClick: goToBookings,
				className: "mt-5 w-full rounded-full bg-foreground py-2 text-xs font-semibold text-background",
				children: "View in Bookings"
			})
		]
	});
}
var TABS = [
	"All",
	"Grand Pooja",
	"Daily",
	"Special",
	"Charity"
];
var inputCls = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
		children: label
	}), children] });
}
/** Create/Edit form — shared by "New Seva" and the per-card "Edit" button.
*  Any authenticated console user (admin or volunteer) can use this; the
*  backend only requires authentication on the sevas endpoint, no role check. */
function SevaFormModal({ title, initial, onClose, onSubmit }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [category, setCategory] = (0, import_react.useState)(initial?.category ?? TABS[1]);
	const [price, setPrice] = (0, import_react.useState)(initial ? String(initial.priceRaw) : "");
	const [durationMinutes, setDurationMinutes] = (0, import_react.useState)(initial ? String(initial.durationMinutesRaw) : "30");
	const [slotsPerDay, setSlotsPerDay] = (0, import_react.useState)(initial ? String(initial.slots) : "1");
	const [capacity, setCapacity] = (0, import_react.useState)(initial ? String(initial.capacity) : "1");
	const [priest, setPriest] = (0, import_react.useState)(initial?.priest ?? "");
	const [description, setDescription] = (0, import_react.useState)(initial?.desc ?? "");
	const [isActive, setIsActive] = (0, import_react.useState)(initial?.isActive ?? true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			await onSubmit({
				name,
				category,
				price: Number(price) || 0,
				duration_minutes: Number(durationMinutes) || 30,
				slots_per_day: Number(slotsPerDay) || 1,
				capacity: Number(capacity) || 1,
				priest,
				description,
				is_active: isActive
			});
		} catch (err) {
			const data = err?.response?.data;
			const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
			const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this seva.";
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
					children: title
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
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: category,
								onChange: (e) => setCategory(e.target.value),
								className: inputCls,
								children: TABS.filter((t) => t !== "All").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t,
									children: t
								}, t))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Price (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								min: 0,
								step: "0.01",
								value: price,
								onChange: (e) => setPrice(e.target.value),
								className: inputCls
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Duration (min)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									value: durationMinutes,
									onChange: (e) => setDurationMinutes(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Slots/day",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									value: slotsPerDay,
									onChange: (e) => setSlotsPerDay(e.target.value),
									className: inputCls
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Capacity",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									value: capacity,
									onChange: (e) => setCapacity(e.target.value),
									className: inputCls
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Priest",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: priest,
							onChange: (e) => setPriest(e.target.value),
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
					initial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isActive,
							onChange: (e) => setIsActive(e.target.checked)
						}), "Active (visible for booking)"]
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
			})]
		})
	});
}
/** Read-only preview of a seva, close to what a devotee sees when booking. */
function SevaPreviewModal({ seva, onClose }) {
	const rows = [
		["Category", seva.category],
		["Price", seva.price],
		["Duration", seva.duration],
		["Slots/day", String(seva.slots)],
		["Capacity", String(seva.capacity)],
		["Priest", seva.priest || "—"],
		["Status", seva.isActive ? "Active" : "Inactive"]
	];
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
						children: seva.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				seva.desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: seva.desc
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
var SplitComponent = () => {
	const q = useQuery({
		queryKey: ["sevas"],
		queryFn: getSevas
	});
	const statsQ = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: getDashboardStats
	});
	const queryClient = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("All");
	const rows = (q.data || []).filter((s) => tab === "All" || s.category === tab);
	const [billingSeva, setBillingSeva] = (0, import_react.useState)(null);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [editingSeva, setEditingSeva] = (0, import_react.useState)(null);
	const [previewingSeva, setPreviewingSeva] = (0, import_react.useState)(null);
	const [completedSevas, setCompletedSevas] = (0, import_react.useState)({});
	function invalidate() {
		queryClient.invalidateQueries({ queryKey: ["sevas"] });
	}
	const totalSevas = q.data?.length ?? 0;
	const activeSevas = q.data?.filter((s) => s.isActive).length ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Catalogue",
			title: "Sevas & Religious Services",
			subtitle: "Manage the entire catalogue of religious offerings, pricing, priests and capacity.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFormOpen(true),
				className: "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New Seva"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Sevas",
					value: String(totalSevas),
					icon: Sparkles,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active",
					value: String(activeSevas),
					icon: CircleCheck,
					accent: "emerald",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Bookings Today",
					value: statsQ.data?.todaysBookings.value ?? "—",
					icon: CalendarCheck,
					accent: "sky"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Revenue (MTD)",
					value: statsQ.data?.revenueMTD.value ?? "—",
					icon: TrendingUp,
					accent: "emerald"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex flex-wrap gap-1 rounded-full border border-border bg-card p-1 w-fit",
			children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab(t),
				className: cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"),
				children: t
			}, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
			children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary",
							children: s.category
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-xl font-semibold text-primary",
								children: s.price
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "/booking"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-serif text-lg font-semibold text-foreground",
						children: s.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: s.desc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-2 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: s.duration
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Duration"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: s.slots
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Slots/day"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: s.capacity
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Capacity"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: ["Priest · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: s.priest
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingSeva(s),
							className: "rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted",
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPreviewingSeva(s),
							className: "rounded-full bg-foreground py-2 text-xs font-semibold text-background",
							children: "Preview"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setBillingSeva(s),
						className: "mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 py-2 text-xs font-semibold text-primary hover:bg-primary/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3.5 w-3.5" }), " Bill"]
					}),
					completedSevas[s.id] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }),
							" Bill Completed · ",
							completedSevas[s.id]
						]
					})
				]
			}, s.name))
		}),
		billingSeva && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateBillModal, {
			seva: billingSeva,
			onClose: () => setBillingSeva(null),
			onCompleted: (billNumber) => setCompletedSevas((prev) => ({
				...prev,
				[billingSeva.id]: billNumber
			}))
		}),
		formOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SevaFormModal, {
			title: "New Seva",
			onClose: () => setFormOpen(false),
			onSubmit: async (payload) => {
				await createSeva(payload);
				toast.success(`${payload.name} was added to the catalogue.`);
				invalidate();
				setFormOpen(false);
			}
		}),
		editingSeva && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SevaFormModal, {
			title: "Edit Seva",
			initial: editingSeva,
			onClose: () => setEditingSeva(null),
			onSubmit: async (payload) => {
				await updateSeva(editingSeva.id, payload);
				toast.success(`${payload.name} was updated.`);
				invalidate();
				setEditingSeva(null);
			}
		}),
		previewingSeva && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SevaPreviewModal, {
			seva: previewingSeva,
			onClose: () => setPreviewingSeva(null)
		})
	] });
};
//#endregion
export { SplitComponent as component };
