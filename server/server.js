/* ============================================================
   TURN CITY — 콘텐츠 저장 API (Railway 배포용)
   GET  /api/data       콘텐츠 조회 (공개)  → 사이트가 읽음
   POST /api/data       콘텐츠 저장 (토큰 필요) → 어드민이 저장
   저장소: FIREBASE_SERVICE_ACCOUNT 있으면 Firestore, 없으면 파일
   ============================================================ */
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "8mb" }));

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "change-me-please";
const ORIGIN = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: ORIGIN === "*" ? true : ORIGIN.split(",").map(s => s.trim()) }));

/* ---------- 저장소 ---------- */
let store;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  const admin = require("firebase-admin");
  const cred = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({ credential: admin.credential.cert(cred) });
  const ref = admin.firestore().collection("site").doc("content");
  store = {
    async get() { const d = await ref.get(); return d.exists ? d.data() : null; },
    async set(data) { await ref.set(data); }
  };
  console.log("[storage] Firestore");
} else {
  const fs = require("fs");
  const path = require("path");
  const file = process.env.DATA_FILE || path.join(__dirname, "content.json");
  store = {
    async get() { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; } },
    async set(data) { fs.writeFileSync(file, JSON.stringify(data)); }
  };
  console.log("[storage] file:", file, "(주의: Railway 재배포 시 초기화될 수 있음 — Firestore 또는 볼륨 권장)");
}

const SEED = { news: [], guides: { groups: [] } };

/* ---------- 라우트 ---------- */
app.get("/health", (_, res) => res.json({ ok: true }));

app.get("/api/data", async (_, res) => {
  try { res.json((await store.get()) || SEED); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/data", async (req, res) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: "unauthorized" });
  const { news, guides } = req.body || {};
  if (!Array.isArray(news) || !guides || !Array.isArray(guides.groups))
    return res.status(400).json({ error: "bad payload" });
  try { await store.set({ news, guides }); res.json({ ok: true, savedAt: new Date().toISOString() }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("TURN CITY content API → :" + PORT));
