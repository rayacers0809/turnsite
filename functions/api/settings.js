import {
  onRequestOptions,
  json,
  rtdbGet,
  rtdbSet
} from "./_common.js";
export { onRequestOptions };

const DEFAULT = {
  discordUrl: "https://discord.gg/2026turn",
  connectUrl: "cfx.re/join/xlzdevr"
};

export async function onRequestGet(context) {
  try {
    const data = await rtdbGet(context, "settings/site");
    return json({ ...DEFAULT, ...(data || {}) });
  } catch (e) {
    return json(DEFAULT);
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    // 'connect ' prefix 자동 제거 후 저장
    if (body.connectUrl) {
      body.connectUrl = body.connectUrl.replace(/^connect\s+/i, "").trim();
    }
    const settings = { ...DEFAULT, ...body };
    await rtdbSet(context, "settings/site", settings, "PUT");
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200);
  }
}
