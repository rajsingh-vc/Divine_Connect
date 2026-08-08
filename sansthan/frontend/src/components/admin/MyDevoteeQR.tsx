// src/components/admin/MyDevoteeQR.tsx — FULL FILE, replaces the previous version
import { useQuery } from "@tanstack/react-query";
import { QrCode, UtensilsCrossed, DoorOpen, RefreshCw } from "lucide-react";
import { getMyDevoteeQR, type DevoteeQRCard } from "@/api/qr-checkin";

// Both QR codes now ROTATE every REFRESH_SECONDS. The backend mints a fresh
// encrypted token (with its own `exp`) on every fetch of /api/devotees/me/qr/,
// and /api/scan-qr/ rejects a payload once its `exp` has passed. So:
//  - refetchInterval below must stay in sync with the backend's rotation window
//  - there's deliberately no "Save to device" button anymore — a saved image
//    would be stale within seconds and just cause failed scans at the gate.

const REFRESH_SECONDS = 10;

const ACCENT: Record<"entry" | "meal", { icon: string }> = {
  entry: {
    icon: "bg-emerald-50 text-emerald-700",
  },
  meal: {
    icon: "bg-amber-50 text-amber-700",
  },
};

function QRCard({
  card,
  kind,
  icon,
}: {
  card: DevoteeQRCard;
  kind: "entry" | "meal";
  icon: React.ReactNode;
}) {
  const accent = ACCENT[kind];
  return (
    <div className="flex w-full max-w-[420px] flex-col items-center rounded-2xl border border-border bg-background p-8">
      <div className="flex w-full items-center gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${accent.icon}`}>
          {icon}
        </span>
        <p className="font-serif text-xl font-semibold text-foreground">{card.label}</p>
      </div>

      <div className="mt-6 aspect-square w-full max-w-[360px] rounded-xl border border-border bg-white p-5">
        <img
          key={card.qrData}
          src={card.qrImage}
          alt={card.label}
          className="h-full w-full object-contain"
        />
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
        <RefreshCw className="h-3.5 w-3.5" /> Refreshes every {REFRESH_SECONDS}s — don't screenshot
      </span>

      <p className="mt-2 text-center text-sm text-muted-foreground">{card.purpose}</p>
    </div>
  );
}

export function MyDevoteeQR() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myDevoteeQR"],
    queryFn: getMyDevoteeQR,
    refetchInterval: REFRESH_SECONDS * 1000,
    refetchIntervalInBackground: false,
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div>
        <p className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
          <QrCode className="h-4 w-4" /> My QR
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Show either code to a volunteer at the gate or meal counter. Keep this screen open — the code refreshes on its own.
        </p>
      </div>

      {isLoading && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      )}

      {isError && (
        <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 py-6 text-center text-sm text-rose-700">
          Could not load your QR codes. Try reloading the page.
        </p>
      )}

      {data && (
        <div className="mt-6 flex flex-col items-center gap-6">
          <QRCard
            card={data.entryQr}
            kind="entry"
            icon={<DoorOpen className="h-4 w-4" />}
          />
          <QRCard
            card={data.mealQr}
            kind="meal"
            icon={<UtensilsCrossed className="h-4 w-4" />}
          />
        </div>
      )}
    </div>
  );
}