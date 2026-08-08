// src/api/crowd-status.ts — FULL FILE
import { api, unwrap } from "@/lib/api";
import { timeAgo } from "@/lib/format";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CrowdLevel = "low" | "moderate" | "high";

export interface CrowdStatus {
  id: number;
  assignedArea: string;
  crowdLevel: CrowdLevel;
  approxVisitors: number;
  waitTime: number; // minutes
  updatedBy: string; // volunteer display name
  timestamp: string; // ISO datetime
  updatedAgo: string; // e.g. "2 minutes ago"
  isActive: boolean;
}

export interface CrowdStatusPayload {
  assigned_area: string;
  crowd_level: CrowdLevel;
  approx_visitors: number;
  wait_time: number;
  status?: boolean;
}

export interface CrowdThresholds {
  lowMax: number; // upper bound (inclusive) of "Low"
  moderateMax: number; // upper bound (inclusive) of "Moderate"; above this is "High"
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapCrowdStatus(c: any): CrowdStatus {
  return {
    id: c.id,
    assignedArea: c.assigned_area,
    crowdLevel: c.crowd_level,
    approxVisitors: c.approx_visitors,
    waitTime: c.wait_time,
    updatedBy: c.updated_by_name ?? c.updated_by?.name ?? c.updated_by ?? "—",
    timestamp: c.timestamp,
    updatedAgo: timeAgo(c.timestamp),
    isActive: Boolean(c.status),
  };
}

function mapThresholds(t: any): CrowdThresholds {
  return {
    lowMax: t.low_max,
    moderateMax: t.moderate_max,
  };
}

// ---------------------------------------------------------------------------
// Admin: crowd status CRUD
// ---------------------------------------------------------------------------

export async function getCrowdStatuses() {
  const { data } = await api.get("/admin/crowd-status/");
  return unwrap<any>(data).map(mapCrowdStatus);
}

export async function getCrowdStatusById(id: number) {
  const { data } = await api.get(`/admin/crowd-status/${id}/`);
  return mapCrowdStatus(data);
}

export async function updateCrowdStatus(id: number, payload: Partial<CrowdStatusPayload>) {
  const { data } = await api.put(`/admin/crowd-status/${id}/`, payload);
  return mapCrowdStatus(data);
}

export async function deleteCrowdStatus(id: number) {
  await api.delete(`/admin/crowd-status/${id}/`);
}

// ---------------------------------------------------------------------------
// Volunteer: update own assigned area
// ---------------------------------------------------------------------------

export async function submitCrowdStatus(payload: CrowdStatusPayload) {
  const { data } = await api.post("/crowd-status/", payload);
  return mapCrowdStatus(data);
}

export async function getMyAreaCrowdStatus() {
  const { data } = await api.get("/crowd-status/my-area/");
  return mapCrowdStatus(data);
}

// ---------------------------------------------------------------------------
// Configurable crowd-level thresholds (admin settings)
// ---------------------------------------------------------------------------

export async function getCrowdThresholds() {
  const { data } = await api.get("/admin/crowd-thresholds/");
  return mapThresholds(data);
}

export async function updateCrowdThresholds(payload: CrowdThresholds) {
  const { data } = await api.put("/admin/crowd-thresholds/", {
    low_max: payload.lowMax,
    moderate_max: payload.moderateMax,
  });
  return mapThresholds(data);
}