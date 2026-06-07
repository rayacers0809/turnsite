import {
  onRequestOptions,
  json,
  rtdbGet,
  rtdbSet,
  rtdbDelete,
  objToArray
} from "./_common.js";

export { onRequestOptions };

function cleanPatch(p) {
  const now = Math.floor(Date.now() / 1000);

  return {
    ver: p.ver || p.title || "패치노트",
    title: p.title || p.ver || "패치노트",
    date: p.date || new Date().toLocaleDateString("ko-KR"),
    tags: Array.isArray(p.tags) ? p.tags : [],
    blocks: Array.isArray(p.blocks) ? p.blocks : [],
    createdAt: p.createdAt || { seconds: now },
    updatedAt: { seconds: now }
  };
}

export async function onRequestGet(context) {
  try {
    const data = await rtdbGet(context, "patches");
    const patches = objToArray(data).sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );

    return json({ ok: true, patches });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e), patches: [] }, 200);
  }
}

export async function onRequestPost(context) {
  try {
    const body = cleanPatch(await context.request.json());
    const data = await rtdbSet(context, "patches", body, "POST");

    return json({ ok: true, id: data.name });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200);
  }
}

export async function onRequestPut(context) {
  try {
    const raw = await context.request.json();

    if (!raw.id) throw new Error("id 없음");

    const id = raw.id;
    delete raw.id;

    const body = cleanPatch(raw);
    await rtdbSet(context, `patches/${id}`, body, "PATCH");

    return json({ ok: true, id });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200);
  }
}

export async function onRequestDelete(context) {
  try {
    const id = new URL(context.request.url).searchParams.get("id");

    if (!id) throw new Error("id 없음");

    await rtdbDelete(context, `patches/${id}`);

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: String(e.message || e) }, 200);
  }
}
