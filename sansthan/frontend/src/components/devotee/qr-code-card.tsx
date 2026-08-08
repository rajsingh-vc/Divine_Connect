import { useQuery } from "@tanstack/react-query";
import { DoorOpen, DoorClosed, Loader2 } from "lucide-react";
import { getMyQRCode } from "@/api/devotee";

/**
 * Shows the logged-in devotee's personal QR code, to be scanned at the
 * temple's entry/exit gates. Drop this into whatever route your devotee
 * portal already uses for "My Account" / "My Pass".
 */
export function QRCodeCard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myQrCode"],
    queryFn: getMyQRCode,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading your QR code...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-rose-600">Could not load your QR code. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
      <div>
        <h3 className="font-serif text-lg font-semibold text-foreground">Your Entry Pass</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Show this at the gate for entry and exit scans. No need to screenshot it — it's always here when you log in.
        </p>
      </div>

      <img src={data.qrImage} alt="Your entry QR code" className="h-52 w-52 rounded-xl border border-border bg-white p-2" />

      <p className="font-mono text-xs text-muted-foreground">{data.qrCode}</p>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          data.isInside ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"
        }`}
      >
        {data.isInside ? <DoorOpen className="h-3.5 w-3.5" /> : <DoorClosed className="h-3.5 w-3.5" />}
        {data.isInside ? "Currently inside the temple" : "Not currently inside"}
      </span>
    </div>
  );
}