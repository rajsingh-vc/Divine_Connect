import { o as __toESM } from "../_runtime.mjs";
import { s as unwrap, t as api } from "./api-gwD-5_E_.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { B as Info, I as LoaderCircle, K as FileText, V as Image, d as Trash2, j as Newspaper, l as TriangleAlert, pt as Bell, r as Video, t as X, tt as CircleQuestionMark, x as Search } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms-Coa0aF3g.js
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
								onClick: () => setType("urgent"),
								className: `flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${type === "urgent" ? "border-red-500 bg-red-50 text-red-700" : "border-border text-muted-foreground hover:bg-muted/50"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), " Urgent"]
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
											className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${a.type === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`,
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
function CmsDashboard() {
	const [tab, setTab] = (0, import_react.useState)("modules");
	const [composerOpen, setComposerOpen] = (0, import_react.useState)(false);
	const stats = [
		{
			label: "Hero Banner",
			value: 3,
			icon: Image
		},
		{
			label: "Temple Info",
			value: 12,
			icon: FileText
		},
		{
			label: "News & Blogs",
			value: 48,
			icon: Newspaper
		},
		{
			label: "Gallery",
			value: 1240,
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
			count: 12,
			icon: FileText,
			onManage: () => {}
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
			count: 1240,
			icon: Image,
			onManage: () => {}
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
			count: 24,
			icon: CircleQuestionMark,
			onManage: () => {}
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
			})
		]
	});
}
//#endregion
export { CmsDashboard as component };
