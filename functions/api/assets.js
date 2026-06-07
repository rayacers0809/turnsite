import {
  onRequestOptions,
  json,
  rtdbGet,
  rtdbSet
} from "./_common.js";

export { onRequestOptions };

const DEFAULT = {
  iconUrl: "",
  defaultThumbUrl: "",
  bgSlides: [],
  bgInterval: 6,
  bgVideoUrl: ""
};

export async function onRequestGet(context) {
  try {
    const data = await rtdbGet(context, "settings/assets");
    return json({ ...DEFAULT, ...(data || {}) });
  } catch (e) {
    return json(DEFAULT);
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const assets = {
      ...DEFAULT,
      ...body,
      bgSlides: Array.isArray(body.bgSlides) ? body.bgSlides : [],
      bgInterval: Number(body.bgInterval || 6)
    };

    await rtdbSet(context, "settings/assets", assets, "PUT");

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200);
  }
}
