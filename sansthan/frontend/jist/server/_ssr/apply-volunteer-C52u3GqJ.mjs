import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-context-CAyad5oA.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as LoaderCircle, T as Search, c as Upload, ft as Check, ht as Camera, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as registerVolunteer, i as getApprovedVolunteers, n as applyAsVolunteer } from "./volunteer-verification-HAoHu1UC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apply-volunteer-C52u3GqJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOC_LABELS = {
	aadhaar: "Aadhaar Card",
	pan: "PAN Card",
	license: "Driving License"
};
var STEPS = [
	"Basic Details",
	"Identity Verification",
	"Reference",
	"Review"
];
/**
* DRF validation errors (400s from missing/invalid fields) come back as
* `{ field_name: ["message"] }`, NOT `{ detail: "..." }` — only permission/
* auth/exception errors use `detail`. Pulling the first field error out here
* means the toast actually says e.g. "pan_front: Upload a valid image..."
* instead of the generic "Request failed with status code 400".
*/
function extractErrorMessage(err) {
	const data = err?.response?.data;
	if (!data) return err?.message || "Submission failed.";
	if (typeof data === "string") return data;
	if (typeof data.detail === "string") return data.detail;
	const fieldError = Object.entries(data).find(([, v]) => Array.isArray(v) && v.length && typeof v[0] === "string");
	if (fieldError) return `${fieldError[0]}: ${fieldError[1][0]}`;
	return err?.message || "Submission failed.";
}
function FileDrop({ label, file, onChange }) {
	const [preview, setPreview] = (0, import_react.useState)(null);
	function handleFile(f) {
		onChange(f);
		if (f) setPreview(URL.createObjectURL(f));
		else setPreview(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs font-medium text-muted-foreground",
		children: label
	}), preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-32",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: preview,
			alt: label,
			className: "h-24 w-32 rounded-md border object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => handleFile(null),
			className: "absolute -right-2 -top-2 rounded-full bg-background p-0.5 shadow",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px]",
				children: "Upload"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => handleFile(e.target.files?.[0] ?? null)
			})
		]
	})] });
}
function VolunteerVerificationForm({ mode, onSuccess }) {
	const [step, setStep] = (0, import_react.useState)(0);
	const [docType, setDocType] = (0, import_react.useState)("aadhaar");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		aadhaar_number: "",
		pan_number: "",
		license_number: "",
		reference_comment: mode === "register" ? "I personally know this person and recommend them as a volunteer." : ""
	});
	const [livePreview, setLivePreview] = (0, import_react.useState)(null);
	const [referenceSearch, setReferenceSearch] = (0, import_react.useState)("");
	const referenceQuery = useQuery({
		queryKey: ["approved-volunteers", referenceSearch],
		queryFn: () => getApprovedVolunteers(referenceSearch),
		enabled: mode === "apply" && step === 2,
		staleTime: 3e4
	});
	const mutation = useMutation({
		mutationFn: () => mode === "apply" ? applyAsVolunteer(form, docType) : registerVolunteer(form),
		onSuccess: (data) => {
			toast.success(mode === "apply" ? data?.message ?? "Application submitted. Awaiting approval." : "Volunteer registered. Reference approval pending.");
			onSuccess?.();
		},
		onError: (err) => {
			toast.error(extractErrorMessage(err));
		}
	});
	function update(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	function canProceed() {
		if (step === 0) return form.name.trim() && form.email.trim() && form.phone.trim();
		if (step === 1) {
			if (docType === "aadhaar") return !!form.aadhaar_number;
			if (docType === "pan") return !!form.pan_number;
			return !!form.license_number;
		}
		if (step === 2) return mode === "apply" || !!form.reference_comment?.trim();
		return true;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex items-center gap-2",
				children: STEPS.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold", i < step ? "bg-primary text-primary-foreground" : i === step ? "border-2 border-primary text-primary" : "border text-muted-foreground"),
						children: i < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : i + 1
					}), i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-0.5 flex-1", i < step ? "bg-primary" : "bg-border") })]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm font-medium text-muted-foreground",
				children: STEPS[step]
			}),
			step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-sm font-medium",
						children: "Full Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-md border px-3 py-2 text-sm",
						value: form.name,
						onChange: (e) => update("name", e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-sm font-medium",
						children: "Email Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						className: "w-full rounded-md border px-3 py-2 text-sm",
						value: form.email,
						onChange: (e) => update("email", e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-sm font-medium",
						children: "Phone Number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-md border px-3 py-2 text-sm",
						value: form.phone,
						onChange: (e) => update("phone", e.target.value)
					})] })
				]
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-sm font-medium",
						children: "Verification Document"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "w-full rounded-md border px-3 py-2 text-sm",
						value: docType,
						onChange: (e) => setDocType(e.target.value),
						children: Object.keys(DOC_LABELS).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: key,
							children: DOC_LABELS[key]
						}, key))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mb-1 block text-sm font-medium",
						children: [DOC_LABELS[docType], " Number"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "w-full rounded-md border px-3 py-2 text-sm",
						value: form[`${docType}_number`],
						onChange: (e) => update(`${docType}_number`, e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDrop, {
						label: `${DOC_LABELS[docType]} Photo`,
						file: form[`${docType}_front`],
						onChange: (f) => update(`${docType}_front`, f)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-sm font-medium",
						children: "Live Photo (for identity verification)"
					}), livePreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-32",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: livePreview,
							className: "h-24 w-32 rounded-md border object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								update("live_photo", null);
								setLivePreview(null);
							},
							className: "absolute -right-2 -top-2 rounded-full bg-background p-0.5 shadow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px]",
								children: "Capture / Upload"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								capture: "user",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0] ?? null;
									update("live_photo", f);
									if (f) setLivePreview(URL.createObjectURL(f));
								}
							})
						]
					})] })
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: mode === "apply" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Reference Volunteer (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "You may optionally name an already-approved volunteer as your reference. If you leave this empty, your application goes straight to admin review."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "w-full rounded-md border pl-9 pr-3 py-2 text-sm",
								placeholder: "Search approved volunteers by name, email or phone",
								value: referenceSearch,
								onChange: (e) => setReferenceSearch(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-48 space-y-1 overflow-y-auto rounded-md border p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => update("reference_volunteer", null),
									className: cn("w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted/60", !form.reference_volunteer && "bg-muted font-medium"),
									children: "No reference — send straight to admin"
								}),
								referenceQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-2 py-1.5 text-xs text-muted-foreground",
									children: "Searching…"
								}),
								referenceQuery.data?.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => update("reference_volunteer", v.id),
									className: cn("w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted/60", form.reference_volunteer === v.id && "bg-muted font-medium"),
									children: [
										v.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["· ", v.volunteer_code]
										})
									]
								}, v.id)),
								referenceQuery.data?.length === 0 && !referenceQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-2 py-1.5 text-xs text-muted-foreground",
									children: "No approved volunteers found."
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border bg-muted/40 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Reference Volunteer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Auto-filled from your logged-in volunteer profile."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-sm font-medium",
					children: "Reason / Comment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "w-full rounded-md border px-3 py-2 text-sm",
					rows: 3,
					placeholder: "I personally know this person and recommend them as a volunteer.",
					value: form.reference_comment,
					onChange: (e) => update("reference_comment", e.target.value)
				})] })] })
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-md border p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Name:"
						}),
						" ",
						form.name
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Email:"
						}),
						" ",
						form.email
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Phone:"
						}),
						" ",
						form.phone
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Document:"
						}),
						" ",
						DOC_LABELS[docType]
					] }),
					mode === "apply" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Reference Volunteer:"
						}),
						" ",
						form.reference_volunteer ? referenceQuery.data?.find((v) => v.id === form.reference_volunteer)?.name ?? "Selected" : "None — sent straight to admin"
					] }),
					mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Reference comment:"
						}),
						" ",
						form.reference_comment
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: step === 0,
					onClick: () => setStep((s) => Math.max(0, s - 1)),
					className: "rounded-md border px-4 py-2 text-sm disabled:opacity-40",
					children: "Back"
				}), step < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !canProceed(),
					onClick: () => setStep((s) => Math.min(STEPS.length - 1, s + 1)),
					className: "rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-40",
					children: "Next"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: mutation.isPending,
					onClick: () => mutation.mutate(),
					className: "flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60",
					children: [mutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Submit"]
				})]
			})
		]
	});
}
function ApplyVolunteerPage() {
	const nav = useNavigate();
	const { user, isAuthenticated, isLoading } = useAuth();
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-xl font-semibold",
					children: "Sign in required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Please sign in with your devotee account to apply as a volunteer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
					children: "Sign in"
				})
			]
		})
	});
	if (user?.user_type !== "devotee") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-xl font-semibold",
				children: "Not available"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Volunteer applications can only be submitted from a devotee account."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl font-semibold",
					children: "Volunteer Verification"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Complete the steps below to submit your volunteer application."
				})]
			}), submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-lg font-semibold text-emerald-800",
						children: "Application submitted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-emerald-700",
						children: [
							"Your volunteer application is pending admin approval",
							" ",
							"(and reference approval, if you selected a reference volunteer). You'll get a notification once a decision is made, and you'll be able to sign up as a volunteer only after it's approved."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => nav({ to: "/admin" }),
						className: "mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: "Back to dashboard"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolunteerVerificationForm, {
					mode: "apply",
					onSuccess: () => setSubmitted(true)
				})
			})]
		})
	});
}
//#endregion
export { ApplyVolunteerPage as component };
