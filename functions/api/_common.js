// Turn City Cloudflare Pages Functions - Realtime Database helper
// Uses FIREBASE_DB_URL, e.g. https://turn2026-c6b9d-default-rtdb.firebaseio.com

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

export function json(data, status = 200) {
  return Response.json(data, { status, headers: CORS });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export function getDbBase(context) {
  const base = (
    context?.env?.FIREBASE_DB_URL ||
    globalThis.FIREBASE_DB_URL ||
    ""
  ).replace(/\/$/, "");

  if (!base) {
    throw new Error("FIREBASE_DB_URL 환경변수가 없습니다.");
  }

  return base;
}

export function dbUrl(context, path = "") {
  const cleanPath = String(path || "").replace(/^\/+|\/+$/g, "");
  return `${getDbBase(context)}/${cleanPath}.json`;
}

export async function rtdbGet(context, path) {
  const res = await fetch(dbUrl(context, path), { cache: "no-store" });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || text || `RTDB GET ${res.status}`);
  return data;
}

export async function rtdbSet(context, path, value, method = "PUT") {
  const res = await fetch(dbUrl(context, path), {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value)
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || text || `RTDB ${method} ${res.status}`);
  return data;
}

export async function rtdbDelete(context, path) {
  const res = await fetch(dbUrl(context, path), { method: "DELETE" });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || text || `RTDB DELETE ${res.status}`);
  return data;
}

export function objToArray(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).map(([id, value]) => ({ id, ...(value || {}) }));
}
