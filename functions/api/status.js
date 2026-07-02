export async function onRequest() {
  const ip = '5.189.145.179:32300';
  const invite = 'brA5VHSntq';
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*' };
  const started = Date.now();
  let status = { online:false, players:0, maxPlayers:10, ping:null, discord:null };
  try {
    const [playersRes, dynamicRes] = await Promise.allSettled([
      fetch(`http://${ip}/players.json`, { cf: { cacheTtl: 5 } }),
      fetch(`http://${ip}/dynamic.json`, { cf: { cacheTtl: 5 } })
    ]);
    if (playersRes.status === 'fulfilled' && playersRes.value.ok) {
      const players = await playersRes.value.json();
      status.players = Array.isArray(players) ? players.length : 0;
      status.online = true;
    }
    if (dynamicRes.status === 'fulfilled' && dynamicRes.value.ok) {
      const dyn = await dynamicRes.value.json();
      status.maxPlayers = Number(dyn.sv_maxclients || dyn.clients_max || 10);
      status.players = Number(dyn.clients ?? status.players);
      status.online = true;
    }
    status.ping = Date.now() - started;
  } catch (e) {}
  try {
    const d = await fetch(`https://discord.com/api/v10/invites/${invite}?with_counts=true`, { cf: { cacheTtl: 60 } });
    if (d.ok) {
      const j = await d.json();
      status.discord = { members: j.approximate_member_count || null, online: j.approximate_presence_count || null };
    }
  } catch (e) {}
  return new Response(JSON.stringify(status), { headers });
}
