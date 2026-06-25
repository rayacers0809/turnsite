const CFX_CODE = "xlzdevr";
const CFX_API = `https://servers-frontend.fivem.net/api/servers/single/${CFX_CODE}`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

export async function onRequestGet(context) {
  const fxserver = context.env?.FXSERVER_URL || "";

  // ── 방법 1: 직접 FXServer HTTP API (환경변수 있을 때)
  if (fxserver) {
    try {
      const [playersRes, infoRes, dynamicRes] = await Promise.all([
        fetch(`${fxserver}/players.json`),
        fetch(`${fxserver}/info.json`),
        fetch(`${fxserver}/dynamic.json`).catch(() => null)
      ]);

      if (!playersRes.ok) throw new Error("players.json " + playersRes.status);

      const players = await playersRes.json();
      const info = infoRes.ok ? await infoRes.json() : {};
      const dynamic = dynamicRes && dynamicRes.ok ? await dynamicRes.json() : {};
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
      // 직접 연결 실패 시 cfx API로 폴백
    }
  }

  // ── 방법 2: cfx.re API 프록시 (환경변수 없거나 직접 연결 실패 시)
  try {
    const res = await fetch(CFX_API, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error("cfx API " + res.status);

    const json = await res.json();
    const data = json?.Data || json?.data || json;
    const players = data?.players || [];
    const maxPlayers = Number(data?.sv_maxclients) || Number(data?.maxClients) || 0;

    return Response.json({
      online: players.length > 0 || data?.clients !== undefined,
      playerCount: players.length,
      maxPlayers,
      players: players.map((p, i) => ({
        id: p.id ?? i + 1,
        name: p.name || "Unknown",
        ping: p.ping ?? null
      }))
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
