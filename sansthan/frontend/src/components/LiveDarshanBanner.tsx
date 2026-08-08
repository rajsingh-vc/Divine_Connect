import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Radio, PlayCircle } from "lucide-react";
import { getLiveDarshanStatus } from "@/api/dashboard";

const POLL_MS = 30_000;

export function LiveDarshanBanner() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["liveDarshanStatus"],
    queryFn: getLiveDarshanStatus,
    refetchInterval: POLL_MS,
  });

  if (!data?.isLive) return null;

  return (
    <button
      onClick={() => navigate({ to: "/live-darshan" })}
      className="mb-4 flex w-full items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3.5 text-left text-white shadow-lg transition hover:brightness-105"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-2xl">🛕</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{data.title || "Live Ganpati Darshan"}</p>
          <p className="flex items-center gap-1 text-xs text-white/85">
            <PlayCircle className="h-3.5 w-3.5" /> Watch Live Darshan
          </p>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
        <Radio className="h-3 w-3 animate-pulse" /> Live
      </span>
    </button>
  );
}