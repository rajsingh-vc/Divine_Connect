import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { getLiveDarshanStatus } from "@/api/dashboard";

export const Route = createFileRoute("/live-darshan")({
  head: () => ({ meta: [{ title: "Live Ganpati Darshan" }] }),
  component: LiveDarshanPage,
});

function toEmbed(data: { liveUrl?: string; embedUrl?: string | null }): { kind: "iframe" | "video"; src: string } | null {
  if (data.embedUrl) return { kind: "iframe", src: `${data.embedUrl}?autoplay=1` };
  const url = data.liveUrl;
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.pathname.startsWith("/live/") ? u.pathname.split("/live/")[1] : u.searchParams.get("v");
      if (id) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}?autoplay=1` };
    }
    if (host === "youtu.be") {
      return { kind: "iframe", src: `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1` };
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return { kind: "iframe", src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
  } catch {
    /* fall through to generic stream handling */
  }
  return { kind: "video", src: url };
}

function LiveDarshanPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["liveDarshanStatus"],
    queryFn: getLiveDarshanStatus,
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="font-serif text-base font-semibold">{data?.title || "Live Ganpati Darshan"}</p>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="shrink-0 rounded-full bg-white/10 p-2 hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        {isLoading ? (
          <p className="text-white/70">Loading stream...</p>
        ) : !data?.isLive || !data.liveUrl ? (
          <p className="text-white/70">The live stream has ended.</p>
        ) : (
          (() => {
            const embed = toEmbed(data);
            if (!embed) return <p className="text-white/70">The live stream has ended.</p>;
            return embed.kind === "iframe" ? (
              <iframe
                src={embed.src}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Live Ganpati Darshan"
              />
            ) : (
              <video src={embed.src} className="h-full w-full" controls autoPlay playsInline />
            );
          })()
        )}
      </div>
    </div>
  );
}