// src/api/qr-checkin.ts — FULL FILE
import { api, unwrap } from "@/lib/api";
import { timeAgo } from "@/lib/format";

// ---------------------------------------------------------------------------
// Shared result shape returned by scan-qr / verify-volunteer / manual-checkin
// ---------------------------------------------------------------------------

export interface ScanQRResult {
  status: "success" | "failed";
  message: string;
  devoteeName?: string;
  devoteeId?: number;
  bookingReference?: string;
  checkType?: "CHECK_IN" | "CHECK_OUT";
}

function mapScanResult(d: any): ScanQRResult {
  return {
    status: d.status,
    message: d.message,
    devoteeName: d.devotee_name,
    devoteeId: d.devotee_id,
    bookingReference: d.booking_reference,
    checkType: d.check_type,
  };
}

// ---------------------------------------------------------------------------
// Devotee QR — normal check-in/out flow
// POST /api/scan-qr/  { encrypted_data }
// ---------------------------------------------------------------------------

export async function scanDevoteeQR(encryptedData: string): Promise<ScanQRResult> {
  const { data } = await api.post("/scan-qr/", { encrypted_data: encryptedData });
  return mapScanResult(data);
}

// ---------------------------------------------------------------------------
// Volunteer fallback flow
// ---------------------------------------------------------------------------

export interface VerifyVolunteerResult {
  status: "success" | "error";
  message: string;
  volunteerToken: string;
}

/** POST /api/verify-volunteer/  { encrypted_data } — step 1 of fallback. */
export async function verifyVolunteerQR(encryptedData: string): Promise<VerifyVolunteerResult> {
  const { data } = await api.post("/verify-volunteer/", { encrypted_data: encryptedData });
  return {
    status: data.status,
    message: data.message,
    volunteerToken: data.volunteer_token,
  };
}

export interface DevoteeSearchResult {
  id: number;
  name: string;
  phone: string;
  devoteeCode: string;
}

/** GET /api/devotees/search/?q=... — step 2 of fallback. */
export async function searchDevotees(query: string): Promise<DevoteeSearchResult[]> {
  const { data } = await api.get("/devotees/search/", { params: { q: query } });
  return (data.results || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    devoteeCode: r.devotee_code,
  }));
}

/** POST /api/manual-checkin/ — step 3 of fallback. Re-verifies volunteer_token server-side. */
export async function manualCheckin(params: {
  volunteerToken: string;
  devoteeId?: number;
  bookingReference?: string;
  mobile?: string;
  name?: string;
  location?: string;
  remarks?: string;
}): Promise<ScanQRResult> {
  const { data } = await api.post("/manual-checkin/", {
    volunteer_token: params.volunteerToken,
    devotee_id: params.devoteeId,
    booking_reference: params.bookingReference,
    mobile: params.mobile,
    name: params.name,
    location: params.location,
    remarks: params.remarks,
  });
  return mapScanResult(data);
}

// ---------------------------------------------------------------------------
// Devotee's own QR (for display on their screen)
// GET /api/devotees/me/qr-data/
// ---------------------------------------------------------------------------

export interface DevoteeQRCard {
  label: string;
  purpose: string;
  qrData: string;
  qrImage: string; // data: URI, ready for <img src>
}

export interface MyDevoteeQRData {
  entryQr: DevoteeQRCard;
  mealQr: DevoteeQRCard;
}

export async function getMyDevoteeQR(): Promise<MyDevoteeQRData> {
  const { data } = await api.get("/devotees/me/qr-data/");
  return {
    entryQr: mapQRCard(data.entry_qr),
    mealQr: mapQRCard(data.meal_qr),
  };
}

function mapQRCard(c: any): DevoteeQRCard {
  return {
    label: c.label,
    purpose: c.purpose,
    qrData: c.qr_data,
    qrImage: c.qr_image,
  };
}

// ---------------------------------------------------------------------------
// Volunteer's own fallback-auth QR
// GET /api/volunteers/me/qr-data/
// ---------------------------------------------------------------------------

export interface MyVolunteerQRData {
  qrData: string;
  qrImage: string;
}

export async function getMyVolunteerQR(): Promise<MyVolunteerQRData> {
  const { data } = await api.get("/volunteers/me/qr-data/");
  return { qrData: data.qr_data, qrImage: data.qr_image };
}

// ---------------------------------------------------------------------------
// Attendance log (replaces the old EntryLog / EntryLogsTable data source)
// GET /api/attendance/?devotee_id=&date=&check_type=&scan_method=
// ---------------------------------------------------------------------------

export interface EntryLog {
  id: number;
  devoteeId: number;
  devoteeName: string;
  volunteerId: number | null;
  checkType: "CHECK_IN" | "CHECK_OUT";
  scanMethod: "QR" | "MANUAL";
  bookingReference: string;
  location: string;
  timestamp: string; // ISO
  timeAgo: string;
  status: "SUCCESS" | "FAILED";
  remarks: string;
}

function mapAttendance(a: any): EntryLog {
  return {
    id: a.id,
    devoteeId: a.devotee,
    devoteeName: a.devotee_name,
    volunteerId: a.volunteer ?? null,
    checkType: a.check_type,
    scanMethod: a.scan_method,
    bookingReference: a.booking_reference || "",
    location: a.location || "",
    timestamp: a.timestamp,
    timeAgo: timeAgo(a.timestamp),
    status: a.status,
    remarks: a.remarks || "",
  };
}

export async function getEntryLogs(params?: {
  devoteeId?: number;
  date?: string; // YYYY-MM-DD
  checkType?: string;
  scanMethod?: string;
}): Promise<EntryLog[]> {
  const { data } = await api.get("/attendance/", {
    params: {
      devotee_id: params?.devoteeId,
      date: params?.date,
      check_type: params?.checkType,
      scan_method: params?.scanMethod,
    },
  });
  return unwrap<any>(data).map(mapAttendance);
}