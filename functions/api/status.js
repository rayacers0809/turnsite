const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

export async function onRequestGet(context) {
  const base = context.env?.FXSERVER_URL;

  if (!base) {
    return Response.json({
      online: false,
      error: "FXSERVER_URL 환경변수가 설정되지 않았습니다",
      playerCount: 0,
      maxPlayers: 0,
      players: []
    }, { headers: CORS });
  }

  try {
    const [playersRes, infoRes, dynamicRes] = await Promise.all([
      fetch(`${base}/players.json`),
      fetch(`${base}/info.json`),
      fetch(`${base}/dynamic.json`).catch(() => null)
    ]);

    if (!playersRes.ok) throw new Error("players.json " + playersRes.status);

    const players = await playersRes.json();
    const info = infoRes.ok ? await infoRes.json() : {};
    const dynamic = dynamicRes?.ok ? await dynamicRes.json() : {};
    const maxPlayers = Number(dynamic.sv_maxclients) || Number(info?.vars?.sv_maxClients) || 128;

    return Response.json({
      online: true,
      playerCount: Array.isArray(players) ? players.length : 0,
      maxPlayers,
      players: Array.isArray(players)
        ? players.map((p, i) => ({ id: p.id ?? i + 1, name: p.name || "Unknown", ping: p.ping ?? null }))
        : []
    }, { headers: CORS });

  } catch (e) {
    return Response.json({
      online: false,
      error: String(e.message || e),
      playerCount: 0,
      maxPlayers: 0,
      players: []
    }, { headers: CORS });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
