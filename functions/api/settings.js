import {
  onRequestOptions,
  json,
  rtdbGet,
  rtdbSet
} from "./_common.js";

export { onRequestOptions };

const DEFAULT = {
  discordUrl: "https://discord.gg/2026turn",
  connectUrl: "sv.dolp.kr"
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
    const settings = { ...DEFAULT, ...body };

    await rtdbSet(context, "settings/site", settings, "PUT");

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200);
  }
}
