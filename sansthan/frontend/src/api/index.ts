import { api, unwrap } from "@/lib/api";
import { formatINR, statusLabel, formatTime, titleCase } from "@/lib/format";

export * from "./dashboard";
export * from "./inventory";
export * from "./duties";

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------
function mapBooking(b: any) {
  return {
    id: b.booking_code,
    _id: b.id,
    devotee: b.devotee_name,
    seva: b.seva_name,
    date: b.date,
    slot: b.slot,
    amount: formatINR(b.amount),
    amountRaw: Number(b.amount),
    channel: titleCase(b.channel),
    status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
    rawStatus: b.status as "pending" | "confirmed" | "completed" | "cancelled",
    paymentId: b.payment_id || "",
    billNumber: b.bill_number || "",
    // --- Booking QR ---
    encryptedQr: (b.encrypted_qr || "") as string,
    qrImage: (b.qr_image || null) as string | null,
    qrGeneratedAt: b.qr_generated_at as string | null,
    qrScannedAt: b.qr_scanned_at as string | null,
    isUsed: Boolean(b.is_used),
  };
}

export type Booking = ReturnType<typeof mapBooking>;

export async function getBookings() {
  const { data } = await api.get("/bookings/");
  return unwrap<any>(data).map(mapBooking);
}

export async function getBooking(id: number) {
  const { data } = await api.get(`/bookings/${id}/`);
  return mapBooking(data);
}

export interface BookingPayload {
  devotee: number;
  seva: number;
  date: string;
  slot: string;
  amount: number;
  channel: "web" | "mobile" | "counter" | "whatsapp";
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

export async function createBooking(payload: BookingPayload) {
  const { data } = await api.post("/bookings/", payload);
  return mapBooking(data);
}

export async function deleteBooking(id: number) {
  await api.delete(`/bookings/${id}/`);
}

// ---------------------------------------------------------------------------
// Meal Bookings — same Booking QR mechanics as Seva Bookings, separate
// endpoint/model (bookings.MealBooking) since a meal booking isn't tied
// to a Seva.
// ---------------------------------------------------------------------------
function mapMealBooking(m: any) {
  return {
    id: m.booking_code,
    _id: m.id,
    devotee: m.devotee_name,
    mealName: m.meal_name,
    mealDate: m.meal_date,
    mealTime: m.meal_time,
    amount: m.amount != null ? formatINR(m.amount) : "",
    amountRaw: m.amount != null ? Number(m.amount) : null,
    status: m.status.charAt(0).toUpperCase() + m.status.slice(1),
    rawStatus: m.status as "pending" | "confirmed" | "completed" | "cancelled",
    // --- Booking QR ---
    encryptedQr: (m.encrypted_qr || "") as string,
    qrImage: (m.qr_image || null) as string | null,
    qrGeneratedAt: m.qr_generated_at as string | null,
    qrScannedAt: m.qr_scanned_at as string | null,
    isUsed: Boolean(m.is_used),
  };
}

export type MealBooking = ReturnType<typeof mapMealBooking>;

export async function getMealBookings() {
  const { data } = await api.get("/bookings/meal-bookings/");
  return unwrap<any>(data).map(mapMealBooking);
}

export async function getMealBooking(id: number) {
  const { data } = await api.get(`/bookings/meal-bookings/${id}/`);
  return mapMealBooking(data);
}

export interface MealBookingPayload {
  devotee: number;
  meal_name: string;
  meal_date: string;
  meal_time: string;
  amount?: number;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

export async function createMealBooking(payload: MealBookingPayload) {
  const { data } = await api.post("/bookings/meal-bookings/", payload);
  return mapMealBooking(data);
}

export async function deleteMealBooking(id: number) {
  await api.delete(`/bookings/meal-bookings/${id}/`);
}

// ---------------------------------------------------------------------------
// Booking QR scan — Volunteer scans a Seva/Meal Booking QR (Flutter or the
// admin console's own scan-test screen). Separate from the devotee
// Entry/Meal Attendance QR system in crowd_status.
// ---------------------------------------------------------------------------
export interface ScanBookingQRResult {
  status: "success" | "failed";
  message?: string;
  type?: "SEVA" | "MEAL";
  bookingReference?: string;
  devoteeName?: string;
  sevaName?: string;
  mealName?: string;
  date?: string;
  time?: string;
}

export async function scanBookingQR(encryptedData: string): Promise<ScanBookingQRResult> {
  try {
    const { data } = await api.post("/bookings/scan-booking-qr/", { encrypted_data: encryptedData });
    return {
      status: "success",
      type: data.type,
      bookingReference: data.booking_reference,
      devoteeName: data.devotee_name,
      sevaName: data.seva_name,
      mealName: data.meal_name,
      date: data.date,
      time: data.time,
    };
  } catch (err: any) {
    const data = err?.response?.data;
    return { status: "failed", message: data?.message || "Could not verify this QR." };
  }
}

// ---------------------------------------------------------------------------
// Devotees
// ---------------------------------------------------------------------------
export interface DevoteePayload {
  name: string;
  mobile: string;
  city: string;
  visits: number;
  total_donated: number;
  tier: "member" | "vip";
  email?: string;
}

function mapDevotee(d: any) {
  return {
    id: d.devotee_code,
    _id: d.id,
    name: d.name,
    email: d.email,
    mobile: d.mobile,
    city: d.city,
    visits: d.visits,
    donatedRaw: Number(d.total_donated),
    donated: formatINR(d.total_donated),
    tier: d.tier === "vip" ? "VIP" : "Member",
    tierRaw: d.tier as "member" | "vip",
    guestCount: (d.guest_count ?? null) as number | null,
    createdAt: d.created_at,
  };
}

export async function getDevotees(params: { page?: number; search?: string; tier?: string } = {}) {
  const { data } = await api.get("/devotees/", { params });
  return { rows: unwrap<any>(data).map(mapDevotee), count: data.count ?? unwrap(data).length };
}

export async function getDevotee(id: number) {
  const { data } = await api.get(`/devotees/${id}/`);
  return mapDevotee(data);
}

export async function createDevotee(payload: DevoteePayload) {
  const { data } = await api.post("/devotees/", payload);
  return mapDevotee(data);
}

export async function updateDevotee(id: number, payload: Partial<DevoteePayload>) {
  const { data } = await api.patch(`/devotees/${id}/`, payload);
  return mapDevotee(data);
}

export async function deleteDevotee(id: number) {
  await api.delete(`/devotees/${id}/`);
}

// ---------------------------------------------------------------------------
// Devotee self-service registration
// ---------------------------------------------------------------------------
export interface DevoteeRegistrationPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  pan?: string;
  referredByVolunteerId?: number | null;
  guestCount?: number;
}

function mapDevoteeRegistration(d: any) {
  return {
    id: d.id,
    devoteeCode: d.devotee_code,
    fullName: d.full_name,
    firstName: d.first_name,
    middleName: d.middle_name,
    lastName: d.last_name,
    mobile: d.mobile,
    whatsapp: d.whatsapp,
    email: d.email,
    address: d.address,
    city: d.city,
    pincode: d.pincode,
    pan: d.pan_number,
    referredByVolunteerId: d.referred_by_volunteer as number | null,
    referredByVolunteerCode: d.referred_by_volunteer_code as string | null,
    referredByVolunteerName: d.referred_by_volunteer_name as string | null,
    tier: d.tier as "member" | "vip" | undefined,
    guestCount: (d.guest_count ?? null) as number | null,
  };
}

function toRegistrationApiPayload(payload: DevoteeRegistrationPayload) {
  return {
    first_name: payload.firstName,
    middle_name: payload.middleName || "",
    last_name: payload.lastName,
    mobile: payload.mobile,
    whatsapp: payload.whatsapp,
    email: payload.email,
    address: payload.address,
    city: payload.city,
    pincode: payload.pincode,
    pan_number: payload.pan || "",
    referred_by_volunteer: payload.referredByVolunteerId ?? null,
    guest_count: payload.guestCount ?? null,
  };
}

export async function lookupDevoteeByMobile(mobile: string) {
  const { data } = await api.get("/devotees/lookup/", { params: { mobile } });
  return data ? mapDevoteeRegistration(data) : null;
}

export async function registerDevotee(payload: DevoteeRegistrationPayload, opts?: { isVip?: boolean }) {
  const body = { ...toRegistrationApiPayload(payload), ...(opts?.isVip ? { is_vip: true } : {}) };
  const { data } = await api.post("/devotees/register/", body);
  return mapDevoteeRegistration(data);
}

// ---------------------------------------------------------------------------
// Sevas
// ---------------------------------------------------------------------------
export async function getSevas() {
  const { data } = await api.get("/sevas/");
  return unwrap<any>(data).map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    price: formatINR(s.price),
    priceRaw: Number(s.price),
    duration: `${s.duration_minutes} min`,
    durationMinutesRaw: s.duration_minutes,
    slots: s.slots_per_day,
    capacity: s.capacity,
    priest: s.priest,
    desc: s.description,
    isActive: Boolean(s.is_active),
    isPopular: Boolean(s.is_popular),
    startDate: s.start_date as string | null,   // NEW, required for bookable sevas
    startTime: s.start_time as string | null,
    endDate: s.end_date as string | null,        // NEW
    endTime: s.end_time as string | null,
    isLive: Boolean(s.is_live),                  // NEW — backend-computed, never trust client
    isBookable: Boolean(s.is_bookable),           // NEW
  }));
}

export interface SevaPayload {
  name: string;
  category: string;
  price: number;
  duration_minutes: number;
  slots_per_day: number;
  capacity: number;
  priest?: string;
  description?: string;
  is_active?: boolean;
  is_popular?: boolean;
  start_date: string | null;   // REQUIRED for bookable sevas, "YYYY-MM-DD"
  start_time: string | null;   // REQUIRED, "HH:MM"
  end_date: string | null;     // REQUIRED, "YYYY-MM-DD"
  end_time: string | null;     // REQUIRED, "HH:MM"
}

export async function createSeva(payload: SevaPayload) {
  const { data } = await api.post("/sevas/", payload);
  return data;
}

export async function updateSeva(id: number, payload: Partial<SevaPayload>) {
  const { data } = await api.patch(`/sevas/${id}/`, payload);
  return data;
}

// ---------------------------------------------------------------------------
// Live Seva — GET /api/sevas/live/  (Sec.5/6/7/18). Poll this, don't compute
// LIVE on the frontend; the backend is the source of truth.
// ---------------------------------------------------------------------------
export interface LiveSeva {
  id: number;
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: "LIVE" | "UPCOMING";
}

export async function getLiveSevas(includeUpcoming = false): Promise<LiveSeva[]> {
  const { data } = await api.get("/sevas/live/", {
    params: includeUpcoming ? { include_upcoming: "true" } : {},
  });
  return (data.results as any[]).map((s) => ({
    id: s.id,
    name: s.name,
    startDate: s.start_date,
    startTime: s.start_time,
    endDate: s.end_date,
    endTime: s.end_time,
    status: s.status,
  }));
}

// Sec.11/12 — backend-generated Seva Booking receipt PDF, built entirely
// from trusted server data. Triggers a browser download.
export async function downloadBookingPdf(bookingId: number, bookingCode: string) {
  const { data } = await api.get(`/bookings/${bookingId}/pdf/`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `seva-booking-${bookingCode}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Donations
// ---------------------------------------------------------------------------
export async function getDonationTrend() {
  const { data } = await api.get("/donations/trend/");
  return data as { month: string; amount: number }[];
}

// ---------------------------------------------------------------------------
// Volunteers
// ---------------------------------------------------------------------------
function mapVolunteer(v: any) {
  return {
    id: v.volunteer_code,
    _id: v.id,
    name: v.name,
    email: v.email,
    phone: v.phone,
    isVolunteer: Boolean(v.is_volunteer),
    volunteerType: v.volunteer_type as "temporary" | "permanent",
    referenceVolunteerName: v.reference_volunteer_name,
    homeAddress: v.home_address,
    idProofType: v.id_proof_type,
    idProofTypeDisplay: v.id_proof_type_display,
    idProofNumber: v.id_proof_number,
    photo: v.photo as string | null,
    zone: v.zone,
    shift: v.shift,
    assignedSeva: v.assigned_seva,
    status: v.status === "active" ? "On duty" : statusLabel(v.status),
    rawStatus: v.status as "pending" | "approved" | "active" | "rejected",
    hours: v.hours_logged,
    appliedAt: v.applied_at,
    rejectionReason: v.rejection_reason,
  };
}

export async function getVolunteers(params: Record<string, string> = {}) {
  const { data } = await api.get("/volunteers/volunteers/", { params });
  return unwrap<any>(data).map(mapVolunteer);
}

export async function getVolunteersPage(params: { page?: number; search?: string; status?: string } = {}) {
  const { data } = await api.get("/volunteers/volunteers/", { params });
  return { rows: unwrap<any>(data).map(mapVolunteer), count: data.count ?? unwrap(data).length };
}

export async function getVolunteer(id: number) {
  const { data } = await api.get(`/volunteers/${id}/`);
  return mapVolunteer(data);
}

export interface TemporaryVolunteerPayload {
  name: string;
  phone: string;
  email: string;
  reference_volunteer_name: string;
}

export async function createTemporaryVolunteer(payload: TemporaryVolunteerPayload) {
  const { data } = await api.post("/volunteers/temporary/", payload);
  return mapVolunteer(data);
}

export interface PermanentVolunteerPayload {
  name: string;
  email: string;
  home_address: string;
  phone: string;
  id_proof_type: "aadhaar" | "pan" | "driving_licence";
  id_proof_number: string;
  photo?: File | null;
}

export async function createPermanentVolunteer(payload: PermanentVolunteerPayload) {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("email", payload.email);
  form.append("home_address", payload.home_address);
  form.append("phone", payload.phone);
  form.append("id_proof_type", payload.id_proof_type);
  form.append("id_proof_number", payload.id_proof_number);
  if (payload.photo) form.append("photo", payload.photo);
  const { data } = await api.post("/volunteers/permanent/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mapVolunteer(data);
}

export async function updateVolunteer(id: number, payload: Record<string, any>, photo?: File | null) {
  if (photo !== undefined) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, String(v));
    });
    if (photo) form.append("photo", photo);
    const { data } = await api.patch(`/volunteers/${id}/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return mapVolunteer(data);
  }
  const { data } = await api.patch(`/volunteers/${id}/`, payload);
  return mapVolunteer(data);
}

export async function deleteVolunteer(id: number) {
  await api.delete(`/volunteers/${id}/`);
}

export async function approveVolunteer(id: number) {
  return (await api.post(`/volunteers/${id}/approve/`)).data;
}

export async function rejectVolunteer(id: number, reason = "") {
  return (await api.post(`/volunteers/${id}/reject/`, { reason })).data;
}

export async function reviewVolunteer(id: number, payload: { assigned_seva: string; shift: string; zone?: string }) {
  return (await api.post(`/volunteers/${id}/review/`, payload)).data;
}

export async function getVolunteerStats() {
  return (await api.get("/volunteers/stats/")).data as {
    active_volunteers: number;
    on_duty_now: number;
    avg_hours_per_week: number;
    applicants: number;
    temporary: number;
    permanent: number;
  };
}

// ---------------------------------------------------------------------------
// Visitors
// ---------------------------------------------------------------------------
export async function getVisitors() {
  const { data } = await api.get("/visitors/");
  return unwrap<any>(data).map((v) => ({
    id: v.visitor_code,
    _id: v.id,
    name: v.name,
    checkIn: formatTime(v.check_in),
    zone: v.zone,
    party: v.party_size,
    status: statusLabel(v.status),
  }));
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export async function getEvents() {
  const { data } = await api.get("/events/");
  return unwrap<any>(data).map((e) => ({
    id: e.event_code,
    _id: e.id,
    name: e.name,
    date: e.date,
    visitors: e.expected_visitors,
    status: statusLabel(e.status),
  }));
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export interface TaskPayload {
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string | null;
  time?: string | null;
  priority: "low" | "medium" | "high";
  status?: "todo" | "in_progress" | "done" | "blocked";
}

const TASK_STATUS_LABEL: Record<string, string> = {
  todo: "Pending",
  in_progress: "In Progress",
  done: "Completed",
  blocked: "Blocked",
};

function formatTaskTime(t: string | null | undefined) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function mapTask(t: any) {
  return {
    id: t.task_code,
    _id: t.id,
    title: t.title,
    description: t.description,
    assignee: t.assignee,
    dueDate: t.due_date,
    time: t.time as string | null,
    timeDisplay: formatTaskTime(t.time),
    priority: t.priority as "low" | "medium" | "high",
    status: TASK_STATUS_LABEL[t.status] ?? t.status,
    rawStatus: t.status as "todo" | "in_progress" | "done" | "blocked",
    createdAt: t.created_at,
  };
}

export async function getTasks(params: { page?: number; search?: string; status?: string; priority?: string } = {}) {
  const { data } = await api.get("/tasks/", { params });
  return { rows: unwrap<any>(data).map(mapTask), count: data.count ?? unwrap(data).length };
}

export async function createTask(payload: TaskPayload) {
  const { data } = await api.post("/tasks/", payload);
  return mapTask(data);
}

export async function updateTask(id: number, payload: Partial<TaskPayload>) {
  const { data } = await api.patch(`/tasks/${id}/`, payload);
  return mapTask(data);
}

export async function deleteTask(id: number) {
  await api.delete(`/tasks/${id}/`);
}

// ---------------------------------------------------------------------------
// Bills
// ---------------------------------------------------------------------------
export interface GenerateBillPayload {
  devotee: number;
  seva: number;
  volunteer?: number | null;
  amount?: number;
}

function mapBill(b: any) {
  return {
    id: b.id,
    billNumber: b.bill_number,
    invoiceNumber: b.invoice_number,
    devoteeId: b.devotee,
    devoteeName: b.devotee_name,
    devoteeCode: b.devotee_code,
    devoteeMobile: b.devotee_mobile,
    sevaId: b.seva,
    sevaName: b.seva_name,
    amount: formatINR(b.amount),
    amountRaw: Number(b.amount),
    volunteerId: b.volunteer as number | null,
    volunteerName: b.volunteer_name as string | null,
    volunteerCode: b.volunteer_code as string | null,
    createdByName: b.created_by_name as string | null,
    paymentStatus: b.payment_status as "pending" | "paid" | "failed",
    razorpayOrderId: b.razorpay_order_id as string,
    razorpayPaymentId: b.razorpay_payment_id as string,
    createdAt: b.created_at,
    paidAt: b.paid_at as string | null,
  };
}

export type Bill = ReturnType<typeof mapBill>;

export async function getBills(params: { page?: number; search?: string; payment_status?: string } = {}) {
  const { data } = await api.get("/bills/", { params });
  return { rows: unwrap<any>(data).map(mapBill), count: data.count ?? unwrap(data).length };
}

export async function generateBill(payload: GenerateBillPayload) {
  const { data } = await api.post("/bills/generate/", payload);
  return {
    bill: mapBill(data.bill),
    razorpay: data.razorpay as { order_id: string; amount: number; currency: string; key: string },
  };
}

export async function verifyBillPayment(
  billId: number,
  payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
) {
  const { data } = await api.post(`/bills/${billId}/verify/`, payload);
  return { verified: data.verified as boolean, bill: data.bill ? mapBill(data.bill) : null, message: data.message as string | undefined };
}