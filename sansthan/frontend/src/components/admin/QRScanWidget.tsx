// src/components/admin/QRScanWidget.tsx — FULL FILE
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ScanLine, KeyRound, Search, Loader2, QrCode, Check, X, RefreshCw } from "lucide-react";
import {
  scanDevoteeQR,
  verifyVolunteerQR,
  searchDevotees,
  manualCheckin,
  getMyVolunteerQR,
  type DevoteeSearchResult,
  type ScanQRResult,
} from "@/api/qr-checkin";

type Mode = "scan" | "fallback";

/** BarcodeDetector is supported in Chrome/Edge/Android but not Safari or
 *  Firefox yet — feature-detect and fall back to a manual paste field
 *  everywhere else, rather than pulling in a new scanning library. */
function useBarcodeSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    setSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);
  return supported;
}

export function QRScanWidget() {
  const [mode, setMode] = useState<Mode>("scan");
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <QrCode className="h-4 w-4" /> QR Check-in
        </p>
        <div className="flex items-center gap-1 rounded-full bg-muted p-0.5 text-xs">
          <button
            onClick={() => setMode("scan")}
            className={`rounded-full px-2.5 py-1 font-semibold ${mode === "scan" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            Scan
          </button>
          <button
            onClick={() => setMode("fallback")}
            className={`rounded-full px-2.5 py-1 font-semibold ${mode === "fallback" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            Can't scan?
          </button>
        </div>
      </div>
      <div className="mt-4">{mode === "scan" ? <DevoteeScanPanel /> : <FallbackCheckinPanel />}</div>
    </div>
  );
}

function ResultBanner({ result }: { result: ScanQRResult }) {
  const ok = result.status === "success";
  return (
    <div
      className={`mt-3 rounded-lg border p-3 text-sm ${
        ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      <p className="font-semibold">{result.message}</p>
      {ok && result.devoteeName && (
        <p className="mt-1 text-xs">
          {result.devoteeName}
          {result.bookingReference ? ` · ${result.bookingReference}` : ""} · {result.checkType?.replace("_", " ")}
        </p>
      )}
    </div>
  );
}

/** Shows the raw encrypted string that was captured — either from the
 *  camera or pasted manually — so you can see exactly what's about to be
 *  sent before it's submitted. */
function CapturedQRPreview({ value }: { value: string }) {
  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/50 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Captured QR content</p>
      <p className="mt-1 break-all font-mono text-[11px] text-foreground">{value}</p>
    </div>
  );
}

function DevoteeScanPanel() {
  const supported = useBarcodeSupport();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const [captured, setCaptured] = useState<string | null>(null); // paused here until confirmed
  const [result, setResult] = useState<ScanQRResult | null>(null);

  async function submit(encrypted: string) {
    if (!encrypted || busy) return;
    setBusy(true);
    try {
      const res = await scanDevoteeQR(encrypted);
      setResult(res);
      if (res.status === "success") toast.success(res.message);
      else toast.error(res.message);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Could not process this QR code.";
      setResult({ status: "failed", message: msg });
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  function resetForNextScan() {
    setCaptured(null);
    setResult(null);
    setManualValue("");
  }

  // Detection runs on a fixed 1-second interval — not requestAnimationFrame,
  // which was firing ~60x/sec and made the camera feel like it was
  // constantly "refreshing" for no visible reason. Once a code is found we
  // stop detecting and wait for you to confirm, rather than auto-submitting.
  useEffect(() => {
    if (!supported || !scanning || captured) return;
    // @ts-expect-error — BarcodeDetector isn't in the TS DOM lib yet
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        toast.error("Camera access was denied — use manual entry below instead.");
        setScanning(false);
      }
    }
    start();

    const intervalId = window.setInterval(async () => {
      if (cancelled || !videoRef.current) return;
      try {
        const codes = await detector.detect(videoRef.current);
        const value = codes?.[0]?.rawValue;
        if (value) setCaptured(value); // pause here — no auto-submit
      } catch {
        // detection hiccup on a single frame — safe to ignore and retry
      }
    }, 1000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [supported, scanning, captured]);

  return (
    <div>
      {supported === true && (
        <div>
          {scanning ? (
            <div className="overflow-hidden rounded-lg border border-border bg-black">
              <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />
            </div>
          ) : (
            <button
              onClick={() => {
                resetForNextScan();
                setScanning(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm font-semibold text-muted-foreground hover:bg-muted"
            >
              <ScanLine className="h-4 w-4" /> Start camera scan
            </button>
          )}
          {scanning && (
            <button
              onClick={() => setScanning(false)}
              className="mt-2 w-full rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted"
            >
              Stop scanning
            </button>
          )}
        </div>
      )}

      {supported === false && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          Live camera scanning isn't supported in this browser. Paste the scanned QR content below instead.
        </p>
      )}

      {!captured && (
        <div className="mt-3 flex gap-2">
          <input
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            placeholder="Paste encrypted QR content"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
          />
          <button
            disabled={!manualValue}
            onClick={() => setCaptured(manualValue)}
            className="rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:opacity-50"
          >
            Preview
          </button>
        </div>
      )}

      {/* Captured but not yet submitted — you see exactly what was read
          and choose whether to actually check it in. */}
      {captured && !result && (
        <div>
          <CapturedQRPreview value={captured} />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => submit(captured)}
              disabled={busy}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Confirm check-in
            </button>
            <button
              onClick={resetForNextScan}
              disabled={busy}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" /> Discard
            </button>
          </div>
        </div>
      )}

      {result && (
        <div>
          {captured && <CapturedQRPreview value={captured} />}
          <ResultBanner result={result} />
          <button
            onClick={resetForNextScan}
            className="mt-2 w-full rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted"
          >
            Scan next devotee
          </button>
        </div>
      )}
    </div>
  );
}

/** Shows the logged-in volunteer's own encrypted QR (GET /volunteers/me/qr-data/)
 *  so they have something to actually verify with in the fallback flow — this
 *  was previously fetched nowhere in the UI, so "Can't scan?" had no way to
 *  supply a volunteer QR at all. "Use this QR" autofills the verify step below
 *  without needing a second device to physically scan it back. */
function MyVolunteerQRPanel({ onUse }: { onUse: (token: string) => void }) {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["myVolunteerQR"],
    queryFn: getMyVolunteerQR,
  });

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">My Volunteer QR</p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-full border border-border p-1 hover:bg-muted disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && <div className="mt-2 h-32 w-32 animate-pulse rounded-lg bg-muted" />}
      {isError && <p className="mt-2 text-xs text-rose-600">Could not load your volunteer QR.</p>}

      {data && (
        <div className="mt-2 flex flex-col items-center">
          <img src={data.qrImage} alt="Your volunteer QR code" className="h-32 w-32 rounded-lg border border-border bg-white p-1" />
          <button
            onClick={() => onUse(data.qrData)}
            className="mt-2 w-full rounded-lg bg-foreground py-1.5 text-xs font-semibold text-background"
          >
            Use this QR
          </button>
        </div>
      )}
    </div>
  );
}

function FallbackCheckinPanel() {
  const [step, setStep] = useState<"verify" | "search" | "done">("verify");
  const [volunteerQrInput, setVolunteerQrInput] = useState("");
  const [volunteerToken, setVolunteerToken] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DevoteeSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [checkinBusy, setCheckinBusy] = useState(false);
  const [result, setResult] = useState<ScanQRResult | null>(null);

  async function handleVerify() {
    if (!volunteerQrInput) return;
    try {
      const res = await verifyVolunteerQR(volunteerQrInput);
      setVolunteerToken(res.volunteerToken);
      setStep("search");
      toast.success("Volunteer verified — search for the devotee.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not verify your QR.");
    }
  }

  async function handleSearch() {
    if (!query) return;
    setSearching(true);
    try {
      const res = await searchDevotees(query);
      setResults(res);
      if (res.length === 0) toast.error("No matching devotee found.");
    } finally {
      setSearching(false);
    }
  }

  async function handleCheckin(devoteeId: number) {
    if (!volunteerToken) return;
    setCheckinBusy(true);
    try {
      const res = await manualCheckin({ volunteerToken, devoteeId });
      setResult(res);
      setStep("done");
      if (res.status === "success") toast.success(res.message);
      else toast.error(res.message);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Manual check-in failed.";
      setResult({ status: "failed", message: msg });
      toast.error(msg);
    } finally {
      setCheckinBusy(false);
    }
  }

  function reset() {
    setStep("verify");
    setVolunteerQrInput("");
    setVolunteerToken(null);
    setQuery("");
    setResults([]);
    setResult(null);
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Use this only when a devotee's QR can't be scanned. Verify your own volunteer QR first.
      </p>

      {step === "verify" && (
        <div className="mt-3 space-y-3">
          <MyVolunteerQRPanel onUse={(token) => setVolunteerQrInput(token)} />
          <div className="flex gap-2">
            <input
              value={volunteerQrInput}
              onChange={(e) => setVolunteerQrInput(e.target.value)}
              placeholder="Paste your volunteer QR content"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={handleVerify}
              disabled={!volunteerQrInput}
              className="flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:opacity-50"
            >
              <KeyRound className="h-3.5 w-3.5" /> Verify
            </button>
          </div>
        </div>
      )}

      {step === "search" && (
        <div className="mt-3">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Devotee ID, mobile, or name"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !query}
              className="flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:opacity-50"
            >
              {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleCheckin(r.id)}
                disabled={checkinBusy}
                className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-xs hover:bg-muted disabled:opacity-50"
              >
                <span>
                  <span className="font-semibold">{r.name}</span> · {r.phone}
                </span>
                <span className="text-muted-foreground">{r.devoteeCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div>
          <ResultBanner result={result} />
          <button
            onClick={reset}
            className="mt-2 w-full rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted"
          >
            Check in another devotee
          </button>
        </div>
      )}
    </div>
  );
}