const CFX_CODE = "xlzdevr";
const CFX_API = `https://servers-frontend.fivem.net/api/servers/single/${CFX_CODE}`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

export async function onRequestGet(context) {
  try {
    // cfx API에서 서버 정보 + 플레이어 목록 한번에 가져옴
    const res = await fetch(CFX_API, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) throw new Error("cfx API " + res.status);

    const json = await res.json();
    const data = json?.Data || json?.data || json;

    const players = (data?.players || []).map((p, i) => ({
      id: p.id ?? i + 1,
      name: p.name || "Unknown",
      ping: p.ping ?? null
    }));

    const maxPlayers = Number(data?.sv_maxclients) || Number(data?.maxClients) || 0;
    const online = data !== null && data !== undefined;

    return Response.json({
      online,
      playerCount: players.length,
      maxPlayers,
      players
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
