import { useAuth } from "@/lib/auth-context";

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = user?.user_type === "admin";
  const isVolunteer = user?.user_type === "volunteer";
  const isDevotee = user?.user_type === "devotee";

  return {
    isAdmin,
    isVolunteer,
    isDevotee,
    /** Full CRUD modules (Devotees, Sevas, Bookings, Donations, Visitors,
     * Inventory, Events, CMS, Reports, Communication, AI, Platform):
     * admin only. Everyone else views. */
    canManage: isAdmin,
    /** Incident Log / Emergency SOS: admin + volunteer can file & edit,
     * devotee is view-only. */
    canReportIncident: isAdmin || isVolunteer,
    /** Volunteer can edit their own incident/SOS record; admin can edit any. */
    canEditRecord: (ownerId?: number) =>
      isAdmin || (isVolunteer && ownerId === user?.id),
    /** Duties: admin has full CRUD (assign/edit/delete anyone's). */
    canAssignDuty: isAdmin,
    canActOnDuty: (assigneeId?: number) =>
      isAdmin || (isVolunteer && assigneeId === user?.id),
    /** Alias used by admin.duties.tsx / admin.tasks.tsx: admin can manage
     * every duty/task; volunteers/devotees never see the assign/edit/delete
     * controls (they get self-service actions on their own rows instead,
     * gated separately by canEditOwn). */
    canManageDuties: isAdmin,
    /** True when the logged-in volunteer's name matches the row's assignee
     * name — lets them accept/start/complete/swap that specific duty or
     * task. Devotees and non-matching volunteers get false. Admin doesn't
     * need this (canManageDuties already covers them). */
    canEditOwn: (assigneeName?: string | null) =>
      isVolunteer && !!assigneeName && assigneeName === user?.full_name,
  };
}