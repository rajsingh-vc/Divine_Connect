import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Camera, X, Check, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  applyAsVolunteer,
  registerVolunteer,
  getApprovedVolunteers,
  type VolunteerVerificationPayload,
  type VolunteerApplyResponse,
  type VolunteerDetail,
} from "@/api/volunteer-verification";

type Mode = "apply" | "register"; // devotee applying vs. approved volunteer referring someone new

interface Props {
  mode: Mode;
  onSuccess?: () => void;
}

type DocType = "aadhaar" | "pan" | "license";

const DOC_LABELS: Record<DocType, string> = {
  aadhaar: "Aadhaar Card",
  pan: "PAN Card",
  license: "Driving License",
};

const STEPS = ["Basic Details", "Identity Verification", "Reference", "Review"] as const;

/**
 * DRF validation errors (400s from missing/invalid fields) come back as
 * `{ field_name: ["message"] }`, NOT `{ detail: "..." }` — only permission/
 * auth/exception errors use `detail`. Pulling the first field error out here
 * means the toast actually says e.g. "pan_front: Upload a valid image..."
 * instead of the generic "Request failed with status code 400".
 */
function extractErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (!data) return err?.message || "Submission failed.";
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;
  const fieldError = Object.entries(data).find(
    ([, v]) => Array.isArray(v) && v.length && typeof v[0] === "string",
  ) as [string, string[]] | undefined;
  if (fieldError) return `${fieldError[0]}: ${fieldError[1][0]}`;
  return err?.message || "Submission failed.";
}

function FileDrop({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(f: File | null) {
    onChange(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {preview ? (
        <div className="relative w-32">
          <img src={preview} alt={label} className="h-24 w-32 rounded-md border object-cover" />
          <button
            type="button"
            onClick={() => handleFile(null)}
            className="absolute -right-2 -top-2 rounded-full bg-background p-0.5 shadow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted/50">
          <Upload className="h-5 w-5" />
          <span className="text-[11px]">Upload</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );
}

export function VolunteerVerificationForm({ mode, onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [docType, setDocType] = useState<DocType>("aadhaar");

  const [form, setForm] = useState<VolunteerVerificationPayload>({
    name: "",
    email: "",
    phone: "",
    aadhaar_number: "",
    pan_number: "",
    license_number: "",
    reference_comment: mode === "register" ? "I personally know this person and recommend them as a volunteer." : "",
  });

  const [livePreview, setLivePreview] = useState<string | null>(null);
  const [referenceSearch, setReferenceSearch] = useState("");

  // Devotee "apply" flow only: optional search of approved volunteers to
  // pick as a reference. Only fetched once the person reaches that step.
  const referenceQuery = useQuery({
    queryKey: ["approved-volunteers", referenceSearch],
    queryFn: () => getApprovedVolunteers(referenceSearch),
    enabled: mode === "apply" && step === 2,
    staleTime: 30_000,
  });

  const mutation = useMutation<VolunteerApplyResponse | VolunteerDetail, unknown, void>({
  mutationFn: () => (mode === "apply" ? applyAsVolunteer(form, docType) : registerVolunteer(form)),
  onSuccess: (data) => {
    toast.success(
      mode === "apply"
        ? (data as VolunteerApplyResponse)?.message ?? "Application submitted. Awaiting approval."
        : "Volunteer registered. Reference approval pending.",
    );
    onSuccess?.();
  },
  onError: (err: any) => {
    toast.error(extractErrorMessage(err));
  },
});

  function update<K extends keyof VolunteerVerificationPayload>(key: K, value: VolunteerVerificationPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function canProceed() {
    if (step === 0) return form.name.trim() && form.email.trim() && form.phone.trim();
    if (step === 1) {
      // Require at least one document number for the selected type.
      if (docType === "aadhaar") return !!form.aadhaar_number;
      if (docType === "pan") return !!form.pan_number;
      return !!form.license_number;
    }
    if (step === 2) return mode === "apply" || !!form.reference_comment?.trim();
    return true;
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                i < step ? "bg-primary text-primary-foreground" : i === step ? "border-2 border-primary text-primary" : "border text-muted-foreground",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>
      <p className="mb-4 text-sm font-medium text-muted-foreground">{STEPS[step]}</p>

      {/* Step 0: Basic details */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email Address</label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 1: Identity verification */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Verification Document</label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocType)}
            >
              {(Object.keys(DOC_LABELS) as DocType[]).map((key) => (
                <option key={key} value={key}>
                  {DOC_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">{DOC_LABELS[docType]} Number</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={form[`${docType}_number` as const] as string}
              onChange={(e) => update(`${docType}_number` as any, e.target.value)}
            />
          </div>

          <FileDrop
            label={`${DOC_LABELS[docType]} Photo`}
            file={form[`${docType}_front` as const] as File | null}
            onChange={(f) => update(`${docType}_front` as any, f)}
          />

          <div>
            <label className="mb-1 block text-sm font-medium">Live Photo (for identity verification)</label>
            {livePreview ? (
              <div className="relative w-32">
                <img src={livePreview} className="h-24 w-32 rounded-md border object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    update("live_photo", null);
                    setLivePreview(null);
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-background p-0.5 shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:bg-muted/50">
                <Camera className="h-5 w-5" />
                <span className="text-[11px]">Capture / Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    update("live_photo", f);
                    if (f) setLivePreview(URL.createObjectURL(f));
                  }}
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Reference (only for the "register a new volunteer" flow) */}
      {step === 2 && (
        <div className="space-y-4">
          {mode === "apply" ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Reference Volunteer (Optional)</p>
                <p className="text-xs text-muted-foreground">
                  You may optionally name an already-approved volunteer as your reference. If you leave
                  this empty, your application goes straight to admin review.
                </p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full rounded-md border pl-9 pr-3 py-2 text-sm"
                  placeholder="Search approved volunteers by name, email or phone"
                  value={referenceSearch}
                  onChange={(e) => setReferenceSearch(e.target.value)}
                />
              </div>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border p-1">
                <button
                  type="button"
                  onClick={() => update("reference_volunteer", null)}
                  className={cn(
                    "w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted/60",
                    !form.reference_volunteer && "bg-muted font-medium",
                  )}
                >
                  No reference — send straight to admin
                </button>
                {referenceQuery.isLoading && (
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">Searching…</p>
                )}
                {referenceQuery.data?.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => update("reference_volunteer", v.id)}
                    className={cn(
                      "w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted/60",
                      form.reference_volunteer === v.id && "bg-muted font-medium",
                    )}
                  >
                    {v.name} <span className="text-xs text-muted-foreground">· {v.volunteer_code}</span>
                  </button>
                ))}
                {referenceQuery.data?.length === 0 && !referenceQuery.isLoading && (
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">No approved volunteers found.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <p className="font-medium">Reference Volunteer</p>
                <p className="text-muted-foreground">Auto-filled from your logged-in volunteer profile.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Reason / Comment</label>
                <textarea
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  rows={3}
                  placeholder="I personally know this person and recommend them as a volunteer."
                  value={form.reference_comment}
                  onChange={(e) => update("reference_comment", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-2 rounded-md border p-4 text-sm">
          <p><span className="font-medium">Name:</span> {form.name}</p>
          <p><span className="font-medium">Email:</span> {form.email}</p>
          <p><span className="font-medium">Phone:</span> {form.phone}</p>
          <p><span className="font-medium">Document:</span> {DOC_LABELS[docType]}</p>
          {mode === "apply" && (
            <p>
              <span className="font-medium">Reference Volunteer:</span>{" "}
              {form.reference_volunteer
                ? referenceQuery.data?.find((v) => v.id === form.reference_volunteer)?.name ?? "Selected"
                : "None — sent straight to admin"}
            </p>
          )}
          {mode === "register" && (
            <p><span className="font-medium">Reference comment:</span> {form.reference_comment}</p>
          )}
        </div>
      )}

      {/* Nav */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-40"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit
          </button>
        )}
      </div>
    </div>
  );
}