// components/admin/devotee-registration-form.tsx
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Shared field/input styling, matching the Sevas console conventions ---
const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

/** +91-prefixed phone input, matching the "Mobile No." / "Whatsapp No." fields in the reference form. */
function PhoneInput({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <div className="mt-1 flex overflow-hidden rounded-lg border border-border bg-background focus-within:border-primary">
      <span className="flex items-center bg-muted px-3 text-sm font-medium text-muted-foreground">+91</span>
      <input
        type="tel"
        inputMode="numeric"
        maxLength={10}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
        className="w-full bg-transparent px-3 py-2 text-sm outline-none disabled:text-muted-foreground"
      />
    </div>
  );
}

export interface DevoteeFormPayload {
  mobile: string;
  whatsapp: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  pan: string;
  referredByVolunteerId: number | null;
  /** Only set by the VIP quick-add flow — number of guests this VIP is bringing. */
  guestCount?: number;
}

export interface VolunteerOption {
  id: number;
  label: string; // e.g. "vol_12 — Ramesh Iyer"
}

interface DevoteeRegistrationFormProps {
  /** Who is filling this in — controls whether the volunteer-reference field is shown/auto-filled. */
  mode: "devotee" | "volunteer";
  initial?: Partial<DevoteeFormPayload>;
  /** Called once mobile hits 10 digits — look up an existing devotee and return their saved details, or null if new. */
  onLookupMobile?: (mobile: string) => Promise<Partial<DevoteeFormPayload> | null>;
  /** Available volunteers for the reference field (mode === "volunteer" or a devotee manually crediting one). */
  volunteerOptions?: VolunteerOption[];
  /** If mode === "volunteer", the logged-in volunteer's id — pre-fills the reference field (still editable). */
  currentVolunteerId?: number | null;
  onSubmit: (payload: DevoteeFormPayload) => Promise<void>;
  onClose?: () => void;
}

export function DevoteeRegistrationForm({
  mode,
  initial,
  onLookupMobile,
  volunteerOptions = [],
  currentVolunteerId = null,
  onSubmit,
  onClose,
}: DevoteeRegistrationFormProps) {
  const [mobile, setMobile] = useState(initial?.mobile ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [middleName, setMiddleName] = useState(initial?.middleName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [pincode, setPincode] = useState(initial?.pincode ?? "");
  const [pan, setPan] = useState(initial?.pan ?? "");
  const [referredByVolunteerId, setReferredByVolunteerId] = useState<number | null>(
    initial?.referredByVolunteerId ?? (mode === "volunteer" ? currentVolunteerId : null),
  );
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [foundExisting, setFoundExisting] = useState(false);
  const [looking, setLooking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // "Existing Devotees can enter mobile number to fetch their address" — auto-lookup once 10 digits are entered.
  useEffect(() => {
    if (!onLookupMobile || mobile.length !== 10) {
      setFoundExisting(false);
      return;
    }
    let cancelled = false;
    setLooking(true);
    onLookupMobile(mobile)
      .then((found) => {
        if (cancelled || !found) return;
        setFoundExisting(true);
        setWhatsapp((v) => found.whatsapp ?? v);
        setFirstName((v) => found.firstName ?? v);
        setMiddleName((v) => found.middleName ?? v);
        setLastName((v) => found.lastName ?? v);
        setEmail((v) => found.email ?? v);
        setAddress((v) => found.address ?? v);
        setCity((v) => found.city ?? v);
        setPincode((v) => found.pincode ?? v);
        setPan((v) => found.pan ?? v);
      })
      .finally(() => !cancelled && setLooking(false));
    return () => {
      cancelled = true;
    };
  }, [mobile, onLookupMobile]);

  useEffect(() => {
    if (sameAsMobile) setWhatsapp(mobile);
  }, [sameAsMobile, mobile]);

  const filteredVolunteers = volunteerSearch
    ? volunteerOptions.filter((v) => v.label.toLowerCase().includes(volunteerSearch.toLowerCase()))
    : volunteerOptions;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        mobile,
        whatsapp,
        firstName,
        middleName,
        lastName,
        email,
        address,
        city,
        pincode,
        pan,
        referredByVolunteerId,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save these details.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-center font-serif text-2xl font-semibold text-primary underline decoration-2 underline-offset-4">
        Online Seva Booking
      </h2>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="text-primary">Please do not type initials for First Name, Middle Name and Last Name.</p>
        <p className="text-muted-foreground">
          Fields marked with <span className="text-rose-500">*</span> are compulsory.
        </p>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-rose-500">
        Existing devotees can enter their mobile number to fetch their saved details.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Mobile No. (10 digits)" required>
            <PhoneInput value={mobile} onChange={setMobile} placeholder="Enter Mobile No." />
            {looking && <p className="mt-1 text-[11px] text-muted-foreground">Checking existing devotees…</p>}
            {foundExisting && (
              <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3 w-3" /> Existing devotee found — details loaded, edit as needed.
              </p>
            )}
          </Field>
          <Field label="Whatsapp No." required>
            <PhoneInput
              value={whatsapp}
              onChange={setWhatsapp}
              disabled={sameAsMobile}
              placeholder="Enter Whatsapp No."
            />
            <label className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <input
                type="checkbox"
                checked={sameAsMobile}
                onChange={(e) => setSameAsMobile(e.target.checked)}
              />
              Same as Mobile Number
            </label>
          </Field>
          <Field label="First Name" required>
            <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter First Name" className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Middle Name">
            <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Enter Middle Name" className={inputCls} />
          </Field>
          <Field label="Last Name" required>
            <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter Last Name" className={inputCls} />
          </Field>
          <Field label="Email Id" required>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email Id" className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Field label="Full Address" required>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Complex Name / No., Road, Landmark, Locality, Area"
              className={inputCls}
            />
          </Field>
          <Field label="City" required>
            <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Pincode" required>
            <input
              required
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter Pincode"
              className={inputCls}
            />
          </Field>
          <Field label="PAN No. (enter PAN to avail 80G tax benefit)">
            <input
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              placeholder="Enter PAN No."
              maxLength={10}
              className={inputCls}
            />
          </Field>
        </div>

        {/* Volunteer reference — shown for volunteer-entered walk-ins, and available (optional) for
            devotee self-service too, in case they want to credit the volunteer who guided them. */}
        <div className="rounded-xl border border-dashed border-border p-3">
          <Field label={mode === "volunteer" ? "Referred by Volunteer" : "Referred by Volunteer (optional)"}>
            <input
              value={volunteerSearch}
              onChange={(e) => setVolunteerSearch(e.target.value)}
              placeholder="Search volunteer by name or ID…"
              className={inputCls}
            />
            {volunteerSearch && (
              <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-border">
                {filteredVolunteers.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setReferredByVolunteerId(v.id);
                      setVolunteerSearch(v.label);
                    }}
                    className={cn(
                      "block w-full px-3 py-1.5 text-left text-sm hover:bg-muted",
                      referredByVolunteerId === v.id && "bg-primary/10 font-medium",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
                {filteredVolunteers.length === 0 && (
                  <p className="px-3 py-1.5 text-xs text-muted-foreground">No matching volunteer.</p>
                )}
              </div>
            )}
          </Field>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="grid grid-cols-2 gap-2 pt-2">
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
              Cancel
            </button>
          )}
          <button
            disabled={saving}
            className={cn("rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50", !onClose && "col-span-2")}
          >
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
}