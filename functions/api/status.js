export async function onRequest() {
  const ip = '5.189.145.179:32300';
  const invite = 'brA5VHSntq';
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'cache-control': 'no-store'
  };
  const started = Date.now();
  const status = { online: false, players: 0, maxPlayers: 10, ping: null, discord: null };

  try {
    const dynamicRes = await fetch(`http://${ip}/dynamic.json`, { cf: { cacheTtl: 5 } });
    if (dynamicRes.ok) {
      const dyn = await dynamicRes.json();
      status.online = true;
      status.players = Number(dyn.clients) || 0;
      status.maxPlayers = Number(dyn.sv_maxclients || dyn.clients_max) || 10;
    }
  } catch (e) {}

  try {
    const playersRes = await fetch(`http://${ip}/players.json`, { cf: { cacheTtl: 5 } });
    if (playersRes.ok) {
      const players = await playersRes.json();
      if (Array.isArray(players)) status.players = players.length;
      status.online = true;
    }
  } catch (e) {}

  if (status.online) status.ping = Date.now() - started;

  try {
    const d = await fetch(`https://discord.com/api/v10/invites/${invite}?with_counts=true`, { cf: { cacheTtl: 60 } });
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
