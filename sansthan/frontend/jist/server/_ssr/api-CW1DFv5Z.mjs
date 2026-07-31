import { s as unwrap, t as api } from "./api-CK4IlaGP.mjs";
import { a as titleCase, n as formatTime, r as statusLabel, t as formatINR } from "./format-oajkEy3m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CW1DFv5Z.js
async function getBookings() {
	const { data } = await api.get("/bookings/");
	return unwrap(data).map((b) => ({
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
		rawStatus: b.status,
		paymentId: b.payment_id || "",
		billNumber: b.bill_number || ""
	}));
}
async function createBooking(payload) {
	const { data } = await api.post("/bookings/", payload);
	return data;
}
async function deleteBooking(id) {
	await api.delete(`/bookings/${id}/`);
}
function mapDevotee(d) {
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
		tierRaw: d.tier,
		createdAt: d.created_at
	};
}
async function getDevotees(params = {}) {
	const { data } = await api.get("/devotees/", { params });
	return {
		rows: unwrap(data).map(mapDevotee),
		count: data.count ?? unwrap(data).length
	};
}
async function createDevotee(payload) {
	const { data } = await api.post("/devotees/", payload);
	return mapDevotee(data);
}
async function updateDevotee(id, payload) {
	const { data } = await api.patch(`/devotees/${id}/`, payload);
	return mapDevotee(data);
}
async function deleteDevotee(id) {
	await api.delete(`/devotees/${id}/`);
}
async function getSevas() {
	const { data } = await api.get("/sevas/");
	return unwrap(data).map((s) => ({
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
		isActive: Boolean(s.is_active)
	}));
}
async function createSeva(payload) {
	const { data } = await api.post("/sevas/", payload);
	return data;
}
async function updateSeva(id, payload) {
	const { data } = await api.patch(`/sevas/${id}/`, payload);
	return data;
}
async function getDonationTrend() {
	const { data } = await api.get("/donations/trend/");
	return data;
}
function mapVolunteer(v) {
	return {
		id: v.volunteer_code,
		_id: v.id,
		name: v.name,
		email: v.email,
		phone: v.phone,
		volunteerType: v.volunteer_type,
		referenceVolunteerName: v.reference_volunteer_name,
		homeAddress: v.home_address,
		idProofType: v.id_proof_type,
		idProofTypeDisplay: v.id_proof_type_display,
		idProofNumber: v.id_proof_number,
		photo: v.photo,
		zone: v.zone,
		shift: v.shift,
		assignedSeva: v.assigned_seva,
		status: v.status === "active" ? "On duty" : statusLabel(v.status),
		rawStatus: v.status,
		hours: v.hours_logged,
		appliedAt: v.applied_at,
		rejectionReason: v.rejection_reason
	};
}
async function getVolunteers(params = {}) {
	const { data } = await api.get("/volunteers/", { params });
	return unwrap(data).map(mapVolunteer);
}
async function getVolunteersPage(params = {}) {
	const { data } = await api.get("/volunteers/", { params });
	return {
		rows: unwrap(data).map(mapVolunteer),
		count: data.count ?? unwrap(data).length
	};
}
async function createTemporaryVolunteer(payload) {
	const { data } = await api.post("/volunteers/temporary/", payload);
	return mapVolunteer(data);
}
async function createPermanentVolunteer(payload) {
	const form = new FormData();
	form.append("name", payload.name);
	form.append("email", payload.email);
	form.append("home_address", payload.home_address);
	form.append("phone", payload.phone);
	form.append("id_proof_type", payload.id_proof_type);
	form.append("id_proof_number", payload.id_proof_number);
	if (payload.photo) form.append("photo", payload.photo);
	const { data } = await api.post("/volunteers/permanent/", form, { headers: { "Content-Type": "multipart/form-data" } });
	return mapVolunteer(data);
}
async function updateVolunteer(id, payload, photo) {
	if (photo !== void 0) {
		const form = new FormData();
		Object.entries(payload).forEach(([k, v]) => {
			if (v !== void 0 && v !== null) form.append(k, String(v));
		});
		if (photo) form.append("photo", photo);
		const { data } = await api.patch(`/volunteers/${id}/`, form, { headers: { "Content-Type": "multipart/form-data" } });
		return mapVolunteer(data);
	}
	const { data } = await api.patch(`/volunteers/${id}/`, payload);
	return mapVolunteer(data);
}
async function deleteVolunteer(id) {
	await api.delete(`/volunteers/${id}/`);
}
async function approveVolunteer(id) {
	return (await api.post(`/volunteers/${id}/approve/`)).data;
}
async function rejectVolunteer(id, reason = "") {
	return (await api.post(`/volunteers/${id}/reject/`, { reason })).data;
}
async function reviewVolunteer(id, payload) {
	return (await api.post(`/volunteers/${id}/review/`, payload)).data;
}
async function getVolunteerStats() {
	return (await api.get("/volunteers/stats/")).data;
}
async function getVisitors() {
	const { data } = await api.get("/visitors/");
	return unwrap(data).map((v) => ({
		id: v.visitor_code,
		_id: v.id,
		name: v.name,
		checkIn: formatTime(v.check_in),
		zone: v.zone,
		party: v.party_size,
		status: statusLabel(v.status)
	}));
}
async function getEvents() {
	const { data } = await api.get("/events/");
	return unwrap(data).map((e) => ({
		id: e.event_code,
		_id: e.id,
		name: e.name,
		date: e.date,
		visitors: e.expected_visitors,
		status: statusLabel(e.status)
	}));
}
var TASK_STATUS_LABEL = {
	todo: "Pending",
	in_progress: "In Progress",
	done: "Completed",
	blocked: "Blocked"
};
function formatTaskTime(t) {
	if (!t) return "";
	const [h, m] = t.split(":").map(Number);
	const period = h >= 12 ? "PM" : "AM";
	return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}
function mapTask(t) {
	return {
		id: t.task_code,
		_id: t.id,
		title: t.title,
		description: t.description,
		assignee: t.assignee,
		dueDate: t.due_date,
		time: t.time,
		timeDisplay: formatTaskTime(t.time),
		priority: t.priority,
		status: TASK_STATUS_LABEL[t.status] ?? t.status,
		rawStatus: t.status,
		createdAt: t.created_at
	};
}
async function getTasks(params = {}) {
	const { data } = await api.get("/tasks/", { params });
	return {
		rows: unwrap(data).map(mapTask),
		count: data.count ?? unwrap(data).length
	};
}
async function createTask(payload) {
	const { data } = await api.post("/tasks/", payload);
	return mapTask(data);
}
async function updateTask(id, payload) {
	const { data } = await api.patch(`/tasks/${id}/`, payload);
	return mapTask(data);
}
async function deleteTask(id) {
	await api.delete(`/tasks/${id}/`);
}
function mapBill(b) {
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
		volunteerId: b.volunteer,
		volunteerName: b.volunteer_name,
		volunteerCode: b.volunteer_code,
		createdByName: b.created_by_name,
		paymentStatus: b.payment_status,
		razorpayOrderId: b.razorpay_order_id,
		razorpayPaymentId: b.razorpay_payment_id,
		createdAt: b.created_at,
		paidAt: b.paid_at
	};
}
/** Step 1 of the Generate Bill flow: creates the Bill + a matching Razorpay order. */
async function generateBill(payload) {
	const { data } = await api.post("/bills/generate/", payload);
	return {
		bill: mapBill(data.bill),
		razorpay: data.razorpay
	};
}
/** Step 2: verify the signature Razorpay checkout.js hands back, and save payment + invoice. */
async function verifyBillPayment(billId, payload) {
	const { data } = await api.post(`/bills/${billId}/verify/`, payload);
	return {
		verified: data.verified,
		bill: data.bill ? mapBill(data.bill) : null,
		message: data.message
	};
}
//#endregion
export { rejectVolunteer as C, updateTask as D, updateSeva as E, updateVolunteer as O, getVolunteersPage as S, updateDevotee as T, getSevas as _, createSeva as a, getVolunteerStats as b, deleteBooking as c, deleteVolunteer as d, generateBill as f, getEvents as g, getDonationTrend as h, createPermanentVolunteer as i, verifyBillPayment as k, deleteDevotee as l, getDevotees as m, createBooking as n, createTask as o, getBookings as p, createDevotee as r, createTemporaryVolunteer as s, approveVolunteer as t, deleteTask as u, getTasks as v, reviewVolunteer as w, getVolunteers as x, getVisitors as y };
