import { api, unwrap } from "@/lib/api";
import { formatINR, statusLabel, formatTime, titleCase } from "@/lib/format";

export * from "./dashboard";

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------
export async function getBookings() {
  const { data } = await api.get("/bookings/");
  return unwrap<any>(data).map((b) => ({
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
  }));
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
  return data;
}

export async function deleteBooking(id: number) {
  await api.delete(`/bookings/${id}/`);
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
// Donations
// ---------------------------------------------------------------------------
export async function getDonationTrend() {
  const { data } = await api.get("/donations/trend/");
  return data as { month: string; amount: number }[];
}

// ---------------------------------------------------------------------------
// Volunteers (list helpers used outside the dedicated Volunteers module page)
// ---------------------------------------------------------------------------
function mapVolunteer(v: any) {
  return {
    id: v.volunteer_code,
    _id: v.id,
    name: v.name,
    email: v.email,
    phone: v.phone,
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
  const { data } = await api.get("/volunteers/", { params });
  return unwrap<any>(data).map(mapVolunteer);
}

export async function getVolunteersPage(params: { page?: number; search?: string; status?: string } = {}) {
  const { data } = await api.get("/volunteers/", { params });
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
// Inventory
// ---------------------------------------------------------------------------
export async function getInventory() {
  const { data } = await api.get("/inventory/");
  return unwrap<any>(data).map((i) => ({
    sku: i.sku,
    _id: i.id,
    item: i.item_name,
    stock: i.stock,
    min: i.min_threshold,
    status: statusLabel(i.status),
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
// Bills — "Sevas & Services" > Generate Bill > Razorpay > Invoice flow
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

/** Step 1 of the Generate Bill flow: creates the Bill + a matching Razorpay order. */
export async function generateBill(payload: GenerateBillPayload) {
  const { data } = await api.post("/bills/generate/", payload);
  return {
    bill: mapBill(data.bill),
    razorpay: data.razorpay as { order_id: string; amount: number; currency: string; key: string },
  };
}

/** Step 2: verify the signature Razorpay checkout.js hands back, and save payment + invoice. */
export async function verifyBillPayment(
  billId: number,
  payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
) {
  const { data } = await api.post(`/bills/${billId}/verify/`, payload);
  return { verified: data.verified as boolean, bill: data.bill ? mapBill(data.bill) : null, message: data.message as string | undefined };
}