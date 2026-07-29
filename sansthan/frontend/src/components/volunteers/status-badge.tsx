import { cn } from "@/lib/utils";
import type { VolunteerStatus } from "@/api/volunteer-verification";

const STATUS_STYLES: Record<VolunteerStatus, { label: string; className: string }> = {
  pending_volunteer_approval: { label: "Pending Volunteer Approval", className: "bg-amber-100 text-amber-800" },
  volunteer_approved: { label: "Volunteer Approved", className: "bg-blue-100 text-blue-800" },
  volunteer_rejected: { label: "Volunteer Rejected", className: "bg-red-100 text-red-800" },
  admin_approved: { label: "Admin Approved", className: "bg-green-100 text-green-800" },
  admin_rejected: { label: "Admin Rejected", className: "bg-red-100 text-red-800" },
  auto_rejected: { label: "Auto Rejected", className: "bg-gray-200 text-gray-700" },
};

export function StatusBadge({ status }: { status: VolunteerStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", s.className)}>
      {s.label}
    </span>
  );
}