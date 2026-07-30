import { s as unwrap, t as api } from "./api-CK4IlaGP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/volunteer-verification-HAoHu1UC.js
function buildFormData(payload) {
	const form = new FormData();
	Object.entries(payload).forEach(([key, value]) => {
		if (value === void 0 || value === null || value === "") return;
		form.append(key, value);
	});
	return form;
}
function buildApplyFormData(payload, docType) {
	const form = new FormData();
	form.append("name", payload.name);
	form.append("email", payload.email);
	form.append("phone", payload.phone);
	const front = payload[`${docType}_front`];
	const back = payload[`${docType}_back`];
	const number = payload[`${docType}_number`];
	if (front) form.append("document_front", front);
	if (back) form.append("document_back", back);
	if (number) form.append("document_number", number);
	if (payload.live_photo) form.append("selfie", payload.live_photo);
	if (payload.reference_volunteer) form.append("reference_volunteer", String(payload.reference_volunteer));
	return form;
}
function mapVolunteerRow(v) {
	return {
		id: v.id,
		volunteer_code: v.volunteer_code,
		public_id: v.public_id,
		name: v.name,
		email: v.email,
		phone: v.phone,
		profile_photo: v.profile_photo,
		is_volunteer: v.is_volunteer,
		status: v.status,
		reference_volunteer: v.reference_volunteer,
		reference_volunteer_name: v.reference_volunteer_name,
		approval: v.approval,
		created_at: v.created_at
	};
}
async function deleteVolunteer(volunteerId) {
	await api.delete(`/volunteers/volunteers/${volunteerId}/`);
}
async function applyAsVolunteer(payload, docType) {
	const { data } = await api.post("/volunteers/volunteers/apply/", buildApplyFormData(payload, docType));
	return data;
}
async function registerVolunteer(payload) {
	if (!payload.reference_comment) throw new Error("Reference comment is required.");
	const { data } = await api.post("/volunteers/volunteers/register/", buildFormData(payload));
	return data;
}
async function getApprovedVolunteers(search = "") {
	const { data } = await api.get("/volunteers/volunteers/", { params: {
		status: "admin_approved",
		search: search || void 0
	} });
	return unwrap(data).map((v) => ({
		id: v.id,
		name: v.name,
		email: v.email,
		volunteer_code: v.volunteer_code
	}));
}
async function adminAction(volunteerId, action, override = false, reason = "") {
	const { data } = await api.post(`/volunteers/volunteers/${volunteerId}/admin-action/`, {
		action,
		override,
		reason
	});
	return data;
}
async function getVolunteerApprovalsPage(params = {}) {
	const { data } = await api.get("/volunteers/volunteers/", { params });
	return {
		rows: unwrap(data).map(mapVolunteerRow),
		count: data.count ?? unwrap(data).length
	};
}
async function getVolunteerDetail(id) {
	const { data } = await api.get(`/volunteers/volunteers/${id}/`);
	return data;
}
async function getVolunteerAuditLog(id) {
	const { data } = await api.get(`/volunteers/volunteers/${id}/audit-log/`);
	return data;
}
//#endregion
export { getVolunteerApprovalsPage as a, registerVolunteer as c, getApprovedVolunteers as i, applyAsVolunteer as n, getVolunteerAuditLog as o, deleteVolunteer as r, getVolunteerDetail as s, adminAction as t };
