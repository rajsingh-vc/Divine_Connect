import { useState } from "react";
import {
  Pencil, Trash2, MapPin, Phone, Mail, Globe,
  Calendar, ShieldCheck, Camera, X, Save,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // adjust path if your AuthProvider lives elsewhere

// 👇 Import the default temple image
import templeImage from "../../assests/gsb_seva_mandal.png";

interface TempleInfoData {
  name: string;
  establishedYear: string;
  registration: string;
  tagline: string;
  about: string;
  address: string;
  phone: string;
  altPhone: string;
  email: string;
  website: string;
  profilePhoto: string; // url
}

const initialData: TempleInfoData = {
  name: "GSB Seva Mandal",
  establishedYear: "1951",
  registration: "Registered under Bombay Public Trust Act, 1950",
  tagline: "Sri Ganeshotsav Celebrations & Our Allegiance to Sri Kashimath Samsthan",
  about:
    "GSB Seva Mandal is a non-profit organization renowned for its charitable and social activities, including educational and financial assistance to needy individuals based on merit. The Mandal has organized the Shree Ganeshotsav since 1955, growing from a 14-inch idol into one of the most recognized community celebrations affiliated with Shree Kashi Math Samsthan.",
  address: "Shree Guru Ganesh Prasad, Bhookailash Nagar, Near Sion Fort, Sion (E), Mumbai - 400 022.",
  phone: "022 24078147",
  altPhone: "022 24078226",
  email: "info@gsbsevamandal.org",
  website: "www.gsbsevamandal.org",
  profilePhoto: templeImage, // ✅ use the imported image
};

interface TempleInfoPanelProps {
  open: boolean;
  onClose: () => void;
}

export function TempleInfoPanel({ open, onClose }: TempleInfoPanelProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [data, setData] = useState<TempleInfoData>(initialData);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draft, setDraft] = useState<TempleInfoData>(initialData);

  if (!open) return null;

  const openEdit = () => {
    setDraft(data);
    setEditOpen(true);
  };

  const saveEdit = () => {
    setData(draft);
    setEditOpen(false);
  };

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft((d) => ({ ...d, profilePhoto: url }));
  };

  const handleDelete = () => {
    setData({ ...initialData, name: "", about: "", profilePhoto: "" });
    setDeleteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#faf6ee] p-6 shadow-xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Content · Temple Info</p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-foreground">Temple Info</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {/* Public profile shown to devotees and volunteers on the trust's about page. */}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={openEdit}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            )}
            <button onClick={onClose} className="rounded-full p-2 hover:bg-muted/60" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 border-b border-border" />

        {/* Profile card */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Photo */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mx-auto grid h-40 w-40 place-items-center overflow-hidden rounded-full border-4 border-amber-100 bg-amber-50">
              {data.profilePhoto ? (
                <img src={data.profilePhoto} alt={data.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-serif text-4xl font-semibold text-amber-600">
                  {data.name ? data.name.charAt(0) : "?"}
                </span>
              )}
            </div>
            <p className="mt-4 text-center font-serif text-lg font-semibold text-foreground">
              {data.name || "Untitled"}
            </p>
            <p className="text-center text-xs text-muted-foreground">Est. {data.establishedYear}</p>

            {!isAdmin && (
              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                View only
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <p className="font-serif text-lg font-semibold text-foreground">{data.tagline}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data.registration}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{data.about}</p>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
              <InfoRow icon={MapPin} label="Address" value={data.address} />
              <InfoRow icon={Calendar} label="Established" value={data.establishedYear} />
              <InfoRow icon={Phone} label="Phone" value={`${data.phone} / ${data.altPhone}`} />
              <InfoRow icon={Mail} label="Email" value={data.email} />
              <InfoRow icon={Globe} label="Website" value={data.website} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal — admin only */}
      {isAdmin && editOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-foreground">Edit Temple Info</h2>
              <button onClick={() => setEditOpen(false)} className="rounded-full p-1.5 hover:bg-muted/60">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Photo upload */}
            <div className="mt-5 flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-amber-100 bg-amber-50">
                {draft.profilePhoto ? (
                  <img src={draft.profilePhoto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-6 w-6 text-amber-500" />
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60">
                <Camera className="h-3.5 w-3.5" />
                Upload photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoPick} />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} />
              <Field
                label="Established Year"
                value={draft.establishedYear}
                onChange={(v) => setDraft((d) => ({ ...d, establishedYear: v }))}
              />
              <Field
                label="Registration"
                value={draft.registration}
                onChange={(v) => setDraft((d) => ({ ...d, registration: v }))}
                full
              />
              <Field
                label="Tagline"
                value={draft.tagline}
                onChange={(v) => setDraft((d) => ({ ...d, tagline: v }))}
                full
              />
              <Field
                label="About"
                value={draft.about}
                onChange={(v) => setDraft((d) => ({ ...d, about: v }))}
                textarea
                full
              />
              <Field
                label="Address"
                value={draft.address}
                onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
                full
              />
              <Field label="Phone" value={draft.phone} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} />
              <Field
                label="Alt Phone"
                value={draft.altPhone}
                onChange={(v) => setDraft((d) => ({ ...d, altPhone: v }))}
              />
              <Field label="Email" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} />
              <Field label="Website" value={draft.website} onChange={(v) => setDraft((d) => ({ ...d, website: v }))} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                <Save className="h-3.5 w-3.5" />
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm — admin only */}
      {isAdmin && deleteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-serif text-lg font-semibold text-foreground">Delete Temple Info?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This clears the profile shown to devotees and volunteers. This can't be undone here — you'll need to
              re-enter details afterward.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100">
        <Icon className="h-3.5 w-3.5 text-amber-600" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground/80">{value}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      )}
    </div>
  );
}