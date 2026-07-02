async function loadStatus(){
 const els={
  state:document.querySelector('[data-status]'),
  players:document.querySelector('[data-players]'),
  ping:document.querySelector('[data-ping]'),
  discord:document.querySelector('[data-discord]')
 };
 try{
  const started=performance.now();
  const res=await fetch('/api/status',{cache:'no-store'});
  if(!res.ok) throw new Error('API hiba');
  const data=await res.json();
  const ping=Math.round(performance.now()-started);
  const maxPlayers=Number(data.maxPlayers)||10;
  const players=Number(data.players)||0;
  if(els.state) els.state.textContent=data.online?'Online':'Nem elérhető';
  if(els.players) els.players.textContent=data.online?`${players} / ${maxPlayers}`:`0 / ${maxPlayers}`;
  if(els.ping) els.ping.textContent=data.online?`${data.ping||ping} ms`:'-';
  if(els.discord) els.discord.textContent=data.discord?.members?`${data.discord.members} tag`:'Csatlakozz';
 }catch(e){
  if(els.state) els.state.textContent='Nem elérhető';
  if(els.players) els.players.textContent='0 / 10';
  if(els.ping) els.ping.textContent='-';
  if(els.discord) els.discord.textContent='Csatlakozz';
 }
}
loadStatus();
setInterval(loadStatus,30000);
