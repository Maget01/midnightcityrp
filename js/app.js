async function loadStatus(){
 const els={state:document.querySelector('[data-status]'),players:document.querySelector('[data-players]'),ping:document.querySelector('[data-ping]'),discord:document.querySelector('[data-discord]')};
 try{const t=performance.now(); const res=await fetch('/api/status',{cache:'no-store'}); const data=await res.json(); const ping=Math.round(performance.now()-t);
  if(els.state) els.state.textContent=data.online?'Online':'Offline';
  if(els.players) els.players.textContent=data.online?`${data.players} / ${data.maxPlayers||128}`:'Nem elérhető';
  if(els.ping) els.ping.textContent=data.online?`${data.ping||ping} ms`:'-';
  if(els.discord) els.discord.textContent=data.discord?.members?`${data.discord.members} tag`:'Csatlakozz';
 }catch(e){ if(els.state) els.state.textContent='Nem elérhető'; if(els.players) els.players.textContent='Nem elérhető'; if(els.ping) els.ping.textContent='-'; }
}
loadStatus(); setInterval(loadStatus,30000);
