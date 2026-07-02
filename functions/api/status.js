export async function onRequest() {
  const ip = '5.189.145.179:32300';
  const joinCode = 'pga8o6y';
  const invite = 'brA5VHSntq';
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'cache-control': 'no-store'
  };

  const status = { online: true, players: 0, maxPlayers: 10, discord: null };

  // Elsodleges: direkt FiveM endpoint
  try {
    const dynamicRes = await fetch(`http://${ip}/dynamic.json`, {
      headers: { 'user-agent': 'MidnightCityRP-Status' },
      cf: { cacheTtl: 5 }
    });
    if (dynamicRes.ok) {
      const dyn = await dynamicRes.json();
      status.online = true;
      status.players = Number(dyn.clients) || 0;
      status.maxPlayers = Number(dyn.sv_maxclients || dyn.clients_max) || 10;
    }
  } catch (e) {}

  // Masodlagos: cfx.re szerverlista API
  try {
    const cfxRes = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${joinCode}`, {
      headers: { 'user-agent': 'MidnightCityRP-Status' },
      cf: { cacheTtl: 10 }
    });
    if (cfxRes.ok) {
      const cfx = await cfxRes.json();
      const data = cfx.Data || cfx.data || {};
      status.online = true;
      status.players = Number(data.clients ?? status.players) || 0;
      status.maxPlayers = Number(data.sv_maxclients ?? data.maxClients ?? status.maxPlayers) || 10;
    }
  } catch (e) {}

  // Discord invite counts, widget nelkul
  try {
    const d = await fetch(`https://discord.com/api/v10/invites/${invite}?with_counts=true`, {
      headers: { 'user-agent': 'MidnightCityRP-Status' },
      cf: { cacheTtl: 60 }
    });
    if (d.ok) {
      const j = await d.json();
      status.discord = {
        members: j.approximate_member_count || null,
        online: j.approximate_presence_count || null
      };
    }
  } catch (e) {}

  return new Response(JSON.stringify(status), { headers });
}
