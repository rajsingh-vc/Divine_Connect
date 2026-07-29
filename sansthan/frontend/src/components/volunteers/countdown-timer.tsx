import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function format(seconds: number) {
  if (seconds <= 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export function CountdownTimer({ deadline }: { deadline: string }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, (new Date(deadline).getTime() - Date.now()) / 1000),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, (new Date(deadline).getTime() - Date.now()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const urgent = remaining > 0 && remaining < 3600; // under 1h left

  return (
    <span
      className={cn(
        "font-mono text-sm",
        remaining <= 0 ? "text-muted-foreground" : urgent ? "text-red-600 font-semibold" : "text-foreground",
      )}
    >
      {format(remaining)}
    </span>
  );
}