import { o as __toESM } from "../_runtime.mjs";
import { s as unwrap, t as api } from "./api-CK4IlaGP.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-context-CAyad5oA.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { $ as FileText, A as Plus, E as Save, H as LoaderCircle, I as Newspaper, K as Info, M as Play, N as Phone, P as Pencil, R as MapPin, St as ArrowLeft, T as Search, Z as Globe, b as ShieldCheck, c as Upload, ct as CircleQuestionMark, f as Trash2, gt as Calendar, h as SquareCheckBig, ht as Camera, m as Square, q as Image, r as Video, t as X, u as TriangleAlert, xt as Bell, z as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms-31RbLdQS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function getAnnouncements() {
	const { data } = await api.get("/content/announcements/");
	return unwrap(data);
}
async function sendAnnouncement(payload) {
	const { data } = await api.post("/content/announcements/", payload);
	return data;
}
async function deleteAnnouncement(id) {
	await api.delete(`/content/announcements/${id}/`);
}
function AnnouncementComposer({ open, onClose }) {
	const [type, setType] = (0, import_react.useState)("important");
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const history = useQuery({
		queryKey: ["announcements"],
		queryFn: getAnnouncements,
		enabled: open
	});
	const mutation = useMutation({
		mutationFn: sendAnnouncement,
		onSuccess: () => {
			toast.success("Announcement sent to all volunteers.");
			setTitle("");
			setDescription("");
			queryClient.invalidateQueries({ queryKey: ["announcements"] });
		},
		onError: (err) => {
			toast.error(err?.response?.data?.detail || err?.response?.data?.type?.[0] || "Failed to send announcement.");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: deleteAnnouncement,
		onSuccess: () => {
			toast.success("Announcement removed.");
			queryClient.invalidateQueries({ queryKey: ["announcements"] });
		},
		onError: () => {
			toast.error("Failed to delete announcement.");
		}
	});
	if (!open) return null;
	function handleSend() {
		if (!title.trim() || !description.trim()) {
			toast.error("Title and description are required.");
			return;
		}
		mutation.mutate({
			type,
			title: title.trim(),
			description: description.trim()
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/40 px-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-2xl bg-background p-6 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-lg font-semibold",
						children: "Notification Templates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-muted-foreground",
					children: "Send an announcement — it appears in every volunteer's notification bell."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setType("immediate"),
								className: `flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${type === "immediate" ? "border-red-500 bg-red-50 text-red-700" : "border-border text-muted-foreground hover:bg-muted/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), " immediate"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setType("important"),
								className: `flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${type === "important" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-border text-muted-foreground hover:bg-muted/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }), " Important"]
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full rounded-lg border px-3 py-2 text-sm",
							placeholder: "e.g. Temple closed for maintenance",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							className: "w-full rounded-lg border px-3 py-2 text-sm",
							placeholder: "Details volunteers need to know…",
							value: description,
							onChange: (e) => setDescription(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSend,
							disabled: mutation.isPending,
							className: "flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-60",
							children: [mutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Send to all volunteers"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Recently sent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-48 space-y-2 overflow-y-auto",
						children: [history.data?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border p-2.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: a.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${a.type === "immediate" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`,
											children: a.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => deleteMutation.mutate(a.id),
											disabled: deleteMutation.isPending,
											className: "text-muted-foreground hover:text-red-600 disabled:opacity-50",
											title: "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: a.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										new Date(a.sent_at).toLocaleString(),
										" ",
										a.sent_by_name && `· ${a.sent_by_name}`
									]
								})
							]
						}, a.id)), history.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No announcements sent yet."
						})]
					})]
				})
			]
		})
	});
}
var initialData = {
	name: "GSB Seva Mandal",
	establishedYear: "1951",
	registration: "Registered under Bombay Public Trust Act, 1950",
	tagline: "Sri Ganeshotsav Celebrations & Our Allegiance to Sri Kashimath Samsthan",
	about: "GSB Seva Mandal is a non-profit organization renowned for its charitable and social activities, including educational and financial assistance to needy individuals based on merit. The Mandal has organized the Shree Ganeshotsav since 1955, growing from a 14-inch idol into one of the most recognized community celebrations affiliated with Shree Kashi Math Samsthan.",
	address: "Shree Guru Ganesh Prasad, Bhookailash Nagar, Near Sion Fort, Sion (E), Mumbai - 400 022.",
	phone: "022 24078147",
	altPhone: "022 24078226",
	email: "info@gsbsevamandal.org",
	website: "www.gsbsevamandal.org",
	profilePhoto: "/assets/gsb_seva_mandal-DmvpHHiS.png"
};
function TempleInfoPanel({ open, onClose }) {
	const { user } = useAuth();
	const isAdmin = user?.user_type === "admin";
	const [data, setData] = (0, import_react.useState)(initialData);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(initialData);
	if (!open) return null;
	const openEdit = () => {
		setDraft(data);
		setEditOpen(true);
	};
	const saveEdit = () => {
		setData(draft);
		setEditOpen(false);
	};
	const handlePhotoPick = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		setDraft((d) => ({
			...d,
			profilePhoto: url
		}));
	};
	const handleDelete = () => {
		setData({
			...initialData,
			name: "",
			about: "",
			profilePhoto: ""
		});
		setDeleteOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 grid place-items-center bg-black/40 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#faf6ee] p-6 shadow-xl sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-amber-600",
								children: "Content · Temple Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-serif text-3xl font-semibold text-foreground",
								children: "Temple Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-xl text-sm text-muted-foreground",
								children: "Public profile shown to devotees and volunteers on the trust's about page."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openEdit,
								className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), "Edit"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDeleteOpen(true),
								className: "inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onClose,
								className: "rounded-full p-2 hover:bg-muted/60",
								"aria-label": "Close",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 border-b border-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-white p-5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto grid h-40 w-40 place-items-center overflow-hidden rounded-full border-4 border-amber-100 bg-amber-50",
									children: data.profilePhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: data.profilePhoto,
										alt: data.name,
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif text-4xl font-semibold text-amber-600",
										children: data.name ? data.name.charAt(0) : "?"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-center font-serif text-lg font-semibold text-foreground",
									children: data.name || "Untitled"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-center text-xs text-muted-foreground",
									children: ["Est. ", data.establishedYear]
								}),
								!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center justify-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "View only"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-white p-6 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-serif text-lg font-semibold text-foreground",
									children: data.tagline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: data.registration
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm leading-relaxed text-foreground/80",
									children: data.about
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											icon: MapPin,
											label: "Address",
											value: data.address
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											icon: Calendar,
											label: "Established",
											value: data.establishedYear
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											icon: Phone,
											label: "Phone",
											value: `${data.phone} / ${data.altPhone}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											icon: Mail,
											label: "Email",
											value: data.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
											icon: Globe,
											label: "Website",
											value: data.website
										})
									]
								})
							]
						})]
					})
				]
			}),
			isAdmin && editOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-xl font-semibold text-foreground",
								children: "Edit Temple Info"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditOpen(false),
								className: "rounded-full p-1.5 hover:bg-muted/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-amber-100 bg-amber-50",
								children: draft.profilePhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: draft.profilePhoto,
									alt: "",
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6 text-amber-500" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" }),
									"Upload photo",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handlePhotoPick
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Name",
									value: draft.name,
									onChange: (v) => setDraft((d) => ({
										...d,
										name: v
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Established Year",
									value: draft.establishedYear,
									onChange: (v) => setDraft((d) => ({
										...d,
										establishedYear: v
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Registration",
									value: draft.registration,
									onChange: (v) => setDraft((d) => ({
										...d,
										registration: v
									})),
									full: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Tagline",
									value: draft.tagline,
									onChange: (v) => setDraft((d) => ({
										...d,
										tagline: v
									})),
									full: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "About",
									value: draft.about,
									onChange: (v) => setDraft((d) => ({
										...d,
										about: v
									})),
									textarea: true,
									full: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Address",
									value: draft.address,
									onChange: (v) => setDraft((d) => ({
										...d,
										address: v
									})),
									full: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone",
									value: draft.phone,
									onChange: (v) => setDraft((d) => ({
										...d,
										phone: v
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Alt Phone",
									value: draft.altPhone,
									onChange: (v) => setDraft((d) => ({
										...d,
										altPhone: v
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email",
									value: draft.email,
									onChange: (v) => setDraft((d) => ({
										...d,
										email: v
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Website",
									value: draft.website,
									onChange: (v) => setDraft((d) => ({
										...d,
										website: v
									}))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditOpen(false),
								className: "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: saveEdit,
								className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), "Save changes"]
							})]
						})
					]
				})
			}),
			isAdmin && deleteOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-lg font-semibold text-foreground",
							children: "Delete Temple Info?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "This clears the profile shown to devotees and volunteers. This can't be undone here — you'll need to re-enter details afterward."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleteOpen(false),
								className: "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleDelete,
								className: "rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700",
								children: "Delete"
							})]
						})
					]
				})
			})
		]
	});
}
function InfoRow({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-amber-600" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-foreground/80",
			children: value
		})] })]
	});
}
function Field({ label, value, onChange, textarea, full }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: full ? "sm:col-span-2" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), textarea ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (e) => onChange(e.target.value),
			rows: 4,
			className: "mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
		})]
	});
}
function mapItem(raw) {
	return {
		id: String(raw.id),
		type: raw.media_type ?? raw.type,
		url: raw.file ?? raw.url,
		thumbnail: raw.thumbnail,
		title: raw.title,
		description: raw.description ?? "",
		year: raw.year,
		uploadedBy: raw.uploaded_by_name ?? raw.uploaded_by,
		uploadedAt: raw.created_at ?? raw.uploaded_at
	};
}
async function fetchGalleryItems() {
	const { data } = await api.get("/content/gallery/");
	return (Array.isArray(data) ? data : data.results ?? []).map(mapItem);
}
async function uploadGalleryItem(payload) {
	const form = new FormData();
	form.append("file", payload.file);
	form.append("title", payload.title);
	form.append("description", payload.description);
	form.append("year", String(payload.year));
	form.append("media_type", payload.file.type.startsWith("video") ? "video" : "image");
	const { data } = await api.post("/content/gallery/", form, { headers: { "Content-Type": "multipart/form-data" } });
	return mapItem(data);
}
async function deleteGalleryItem(id) {
	await api.delete(`/content/gallery/${id}/`);
}
async function deleteGalleryItems(ids) {
	await Promise.all(ids.map((id) => deleteGalleryItem(id)));
}
function GalleryPanel({ open, onClose, items, isLoading, error, addItem, removeItems }) {
	const { user } = useAuth();
	const isAdmin = user?.user_type === "admin";
	const [selectedYear, setSelectedYear] = (0, import_react.useState)("all");
	const [activeItem, setActiveItem] = (0, import_react.useState)(null);
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [deleteMode, setDeleteMode] = (0, import_react.useState)(false);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const [uploadDraft, setUploadDraft] = (0, import_react.useState)({
		type: "image",
		title: "",
		description: "",
		year: (/* @__PURE__ */ new Date()).getFullYear(),
		file: null,
		previewUrl: ""
	});
	const years = (0, import_react.useMemo)(() => Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a), [items]);
	const filteredItems = (0, import_react.useMemo)(() => selectedYear === "all" ? items : items.filter((i) => i.year === selectedYear), [items, selectedYear]);
	if (!open) return null;
	const handleFilePick = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const previewUrl = URL.createObjectURL(file);
		const type = file.type.startsWith("video") ? "video" : "image";
		setUploadDraft((d) => ({
			...d,
			file,
			previewUrl,
			type
		}));
	};
	const handleUploadSave = async () => {
		if (!uploadDraft.file || !uploadDraft.title.trim()) return;
		setIsSaving(true);
		try {
			addItem(await uploadGalleryItem({
				file: uploadDraft.file,
				title: uploadDraft.title.trim(),
				description: uploadDraft.description.trim(),
				year: uploadDraft.year
			}));
			setUploadOpen(false);
			setUploadDraft({
				type: "image",
				title: "",
				description: "",
				year: (/* @__PURE__ */ new Date()).getFullYear(),
				file: null,
				previewUrl: ""
			});
		} catch {
			alert("Upload failed. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};
	const toggleSelect = (id) => {
		setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	};
	const handleBulkDelete = async () => {
		if (selectedIds.length === 0) return;
		if (!confirm(`Remove ${selectedIds.length} item(s) from the gallery? This can't be undone.`)) return;
		setIsDeleting(true);
		try {
			await deleteGalleryItems(selectedIds);
			removeItems(selectedIds);
			setSelectedIds([]);
			setDeleteMode(false);
		} catch {
			alert("Delete failed. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};
	const handleSingleDelete = async (id) => {
		if (!confirm("Remove this item from the gallery? This can't be undone.")) return;
		setIsDeleting(true);
		try {
			await deleteGalleryItems([id]);
			removeItems([id]);
			if (activeItem?.id === id) setActiveItem(null);
		} catch {
			alert("Delete failed. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 grid place-items-center bg-black/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-[#faf6ee] p-6 shadow-xl sm:p-8",
			children: [!activeItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.18em] text-amber-600",
							children: "Content · Gallery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-serif text-3xl font-semibold text-foreground",
							children: "Gallery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xl text-sm text-muted-foreground",
							children: "Photos and videos from past celebrations, organized by year."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							isAdmin && !deleteMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setUploadOpen(true),
								className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), "Upload"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDeleteMode(true),
								className: "inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete"]
							})] }),
							isAdmin && deleteMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [selectedIds.length, " selected"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleBulkDelete,
									disabled: selectedIds.length === 0 || isDeleting,
									className: "inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40",
									children: [isDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Remove selected"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setDeleteMode(false);
										setSelectedIds([]);
									},
									className: "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60",
									children: "Cancel"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onClose,
								className: "rounded-full p-2 hover:bg-muted/60",
								"aria-label": "Close",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 border-b border-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), "Year"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedYear("all"),
							className: `rounded-full px-3 py-1.5 text-sm font-medium transition ${selectedYear === "all" ? "bg-foreground text-background" : "border border-border hover:bg-muted/60"}`,
							children: "All"
						}),
						years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedYear(y),
							className: `rounded-full px-3 py-1.5 text-sm font-medium transition ${selectedYear === y ? "bg-foreground text-background" : "border border-border hover:bg-muted/60"}`,
							children: y
						}, y))
					]
				}),
				!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "View only"]
				}),
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading gallery…"]
				}),
				error && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600",
					children: error
				}),
				!isLoading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
					children: [filteredItems.map((item) => {
						const selected = selectedIds.includes(item.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => deleteMode ? toggleSelect(item.id) : setActiveItem(item),
							className: `group relative aspect-square overflow-hidden rounded-2xl border bg-white shadow-sm ${selected ? "border-red-400 ring-2 ring-red-200" : "border-border"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.type === "video" ? item.thumbnail ?? item.url : item.url,
									alt: item.title,
									className: "h-full w-full object-cover transition group-hover:scale-105"
								}),
								item.type === "video" && !deleteMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 grid place-items-center bg-black/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-9 w-9 place-items-center rounded-full bg-white/90",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 text-foreground" })
									})
								}),
								deleteMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-2 top-2 rounded-full bg-white/90 p-1",
									children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-red-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4 text-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line-clamp-1 text-xs font-medium text-white",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-white/70",
										children: item.year
									})]
								})
							]
						}, item.id);
					}), filteredItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground",
						children: "No media for this year yet."
					})]
				})
			] }), activeItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveItem(null),
					className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to gallery"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-full p-2 hover:bg-muted/60",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl border border-border bg-black shadow-sm",
					children: activeItem.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: activeItem.url,
						alt: activeItem.title,
						className: "max-h-[65vh] w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: activeItem.url,
						controls: true,
						className: "max-h-[65vh] w-full"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-white p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600",
							children: [
								activeItem.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-3.5 w-3.5" }),
								activeItem.type,
								" · ",
								activeItem.year
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-serif text-xl font-semibold text-foreground",
							children: activeItem.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-foreground/80",
							children: activeItem.description
						}),
						(activeItem.uploadedBy || activeItem.uploadedAt) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 border-t border-border pt-4 text-xs text-muted-foreground",
							children: [
								"Uploaded by ",
								activeItem.uploadedBy,
								" on ",
								activeItem.uploadedAt
							]
						}),
						isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleSingleDelete(activeItem.id),
							disabled: isDeleting,
							className: "mt-6 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50",
							children: [isDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Remove from gallery"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "View only"]
						})
					]
				})]
			})] })]
		}), isAdmin && uploadOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-xl font-semibold text-foreground",
							children: "Upload to Gallery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setUploadOpen(false),
							className: "rounded-full p-1.5 hover:bg-muted/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-8 text-center hover:bg-muted/40",
							children: [uploadDraft.previewUrl ? uploadDraft.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: uploadDraft.previewUrl,
								alt: "",
								className: "max-h-40 rounded-lg object-contain"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: uploadDraft.previewUrl,
								className: "max-h-40 rounded-lg",
								controls: true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-6 w-6 text-amber-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: "Choose a photo or video"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "JPG, PNG, or MP4"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*,video/*",
								className: "hidden",
								onChange: handleFilePick
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: uploadDraft.title,
									onChange: (e) => setUploadDraft((d) => ({
										...d,
										title: e.target.value
									})),
									className: "mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100",
									placeholder: "e.g. Ganeshotsav 2026 — Main Idol"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: uploadDraft.description,
									onChange: (e) => setUploadDraft((d) => ({
										...d,
										description: e.target.value
									})),
									rows: 3,
									className: "mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100",
									placeholder: "Describe what's happening in this photo or video"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Year"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: uploadDraft.year,
								onChange: (e) => setUploadDraft((d) => ({
									...d,
									year: Number(e.target.value)
								})),
								className: "mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setUploadOpen(false),
							className: "rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleUploadSave,
							disabled: !uploadDraft.file || !uploadDraft.title.trim() || isSaving,
							className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
							children: [isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), "Save to gallery"]
						})]
					})
				]
			})
		})]
	});
}
function FAQPanel({ open, onClose, items, isLoading, error, addItem, updateItem, removeItems }) {
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("");
	if (!open) return null;
	const resetForm = () => {
		setEditingId(null);
		setQuestion("");
		setAnswer("");
	};
	const handleSave = async () => {
		if (!question.trim() || !answer.trim()) return;
		if (editingId) await updateItem(editingId, {
			question,
			answer
		});
		else await addItem({
			question,
			answer,
			order: items.length,
			is_published: true
		});
		resetForm();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold",
						children: "FAQs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-red-600",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 rounded-xl border border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "w-full rounded-lg border border-border px-3 py-2 text-sm",
							placeholder: "Question",
							value: question,
							onChange: (e) => setQuestion(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "w-full rounded-lg border border-border px-3 py-2 text-sm",
							placeholder: "Answer",
							rows: 3,
							value: answer,
							onChange: (e) => setAnswer(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: resetForm,
								className: "rounded-full px-4 py-1.5 text-sm",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleSave,
								className: "flex items-center gap-1 rounded-full bg-foreground px-4 py-1.5 text-sm text-background",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
									" ",
									editingId ? "Update" : "Add FAQ"
								]
							})]
						})
					]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Loading…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-2",
					children: items.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: f.question
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: f.answer
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => updateItem(f.id, { is_published: !f.is_published }),
										className: `rounded-full px-2 py-1 text-xs ${f.is_published ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`,
										children: f.is_published ? "Published" : "Draft"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setEditingId(f.id);
											setQuestion(f.question);
											setAnswer(f.answer);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeItems([f.id]),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-red-500" })
									})
								]
							})]
						})
					}, f.id))
				})
			]
		})
	});
}
function useGalleryItems() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await fetchGalleryItems();
			setItems(data);
		} catch (e) {
			setError("Could not load gallery. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const addItem = (item) => setItems((prev) => [item, ...prev]);
	const removeItems = (ids) => setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
	return {
		items,
		isLoading,
		error,
		refresh,
		addItem,
		removeItems
	};
}
function useFaqItems() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const fetchItems = (0, import_react.useCallback)(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const res = await api.get("/content/faqs/", { params: { ordering: "order" } });
			setItems(unwrap(res.data));
		} catch (err) {
			setError("Failed to load FAQs.");
		} finally {
			setIsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchItems();
	}, [fetchItems]);
	return {
		items,
		isLoading,
		error,
		fetchItems,
		addItem: (0, import_react.useCallback)(async (payload) => {
			const { data } = await api.post("/content/faqs/", payload);
			setItems((prev) => [...prev, data].sort((a, b) => a.order - b.order));
			return data;
		}, []),
		updateItem: (0, import_react.useCallback)(async (id, payload) => {
			const { data } = await api.patch(`/content/faqs/${id}/`, payload);
			setItems((prev) => prev.map((it) => it.id === id ? data : it).sort((a, b) => a.order - b.order));
			return data;
		}, []),
		removeItems: (0, import_react.useCallback)(async (ids) => {
			await Promise.all(ids.map((id) => api.delete(`/content/faqs/${id}/`)));
			setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
		}, [])
	};
}
function CmsDashboard() {
	const [tab, setTab] = (0, import_react.useState)("modules");
	const [composerOpen, setComposerOpen] = (0, import_react.useState)(false);
	const [templeInfoOpen, setTempleInfoOpen] = (0, import_react.useState)(false);
	const [galleryOpen, setGalleryOpen] = (0, import_react.useState)(false);
	const [faqOpen, setFaqOpen] = (0, import_react.useState)(false);
	const { items: galleryItems, isLoading: galleryLoading, error: galleryError, addItem: addGalleryItem, removeItems: removeGalleryItems } = useGalleryItems();
	const { items: faqItems, isLoading: faqLoading, error: faqError, addItem: addFaqItem, updateItem: updateFaqItem, removeItems: removeFaqItems } = useFaqItems();
	const stats = [
		{
			label: "Hero Banner",
			value: 3,
			icon: Image
		},
		{
			label: "Temple Info",
			value: 1,
			icon: FileText
		},
		{
			label: "News & Blogs",
			value: 48,
			icon: Newspaper
		},
		{
			label: "Gallery",
			value: galleryItems.length,
			icon: Image
		}
	];
	const modules = [
		{
			key: "hero",
			label: "Hero Banner",
			count: 3,
			icon: Image,
			onManage: () => {}
		},
		{
			key: "temple-info",
			label: "Temple Info",
			count: 1,
			icon: FileText,
			onManage: () => setTempleInfoOpen(true)
		},
		{
			key: "news",
			label: "News & Blogs",
			count: 48,
			icon: Newspaper,
			onManage: () => {}
		},
		{
			key: "gallery",
			label: "Gallery",
			count: galleryItems.length,
			icon: Image,
			onManage: () => setGalleryOpen(true)
		},
		{
			key: "videos",
			label: "Videos",
			count: 82,
			icon: Video,
			onManage: () => {}
		},
		{
			key: "faqs",
			label: "FAQs",
			count: 1,
			icon: CircleQuestionMark,
			onManage: () => setFaqOpen(true)
		},
		{
			key: "seo",
			label: "SEO",
			count: 16,
			icon: Search,
			onManage: () => {}
		},
		{
			key: "notifications",
			label: "Notification Templates",
			count: 22,
			icon: Bell,
			onManage: () => setComposerOpen(true)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#faf6ee] px-8 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.18em] text-amber-600",
				children: "Content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-serif text-4xl font-semibold text-foreground",
				children: "Content Management System"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: "Manage everything a devotee sees — home, media, news, gallery, SEO, notification templates."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 border-b border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-white p-5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-full bg-amber-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4 text-amber-600" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-3xl font-semibold text-foreground",
						children: s.value.toLocaleString()
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 inline-flex rounded-full border border-border bg-white p-1",
				children: [
					"modules",
					"news",
					"seo"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/60"}`,
					children: t
				}, t))
			}),
			tab === "modules" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: modules.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-white p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-full bg-amber-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-5 w-5 text-amber-600" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-serif text-lg font-semibold text-foreground",
							children: m.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [m.count.toLocaleString(), " items"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: m.onManage,
							className: "mt-4 w-full rounded-full border border-border py-2 text-sm font-medium hover:bg-muted/60",
							children: "Manage"
						})
					]
				}, m.key))
			}),
			tab === "news" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground",
				children: "News & blogs management coming here."
			}),
			tab === "seo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground",
				children: "SEO settings coming here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementComposer, {
				open: composerOpen,
				onClose: () => setComposerOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TempleInfoPanel, {
				open: templeInfoOpen,
				onClose: () => setTempleInfoOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryPanel, {
				open: galleryOpen,
				onClose: () => setGalleryOpen(false),
				items: galleryItems,
				isLoading: galleryLoading,
				error: galleryError,
				addItem: addGalleryItem,
				removeItems: removeGalleryItems
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQPanel, {
				open: faqOpen,
				onClose: () => setFaqOpen(false),
				items: faqItems,
				isLoading: faqLoading,
				error: faqError,
				addItem: addFaqItem,
				updateItem: updateFaqItem,
				removeItems: removeFaqItems
			})
		]
	});
}
//#endregion
export { CmsDashboard as component };
