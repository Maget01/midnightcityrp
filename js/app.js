async function loadStatus(){
  const els={
    state:document.querySelector('[data-status]'),
    players:document.querySelector('[data-players]'),
    discord:document.querySelector('[data-discord]')
  };
  const fallback=()=>{
    if(els.state) els.state.textContent='Online';
    if(els.players) els.players.textContent='0 / 10';
    if(els.discord) els.discord.textContent='Csatlakozz';
  };
  try{
    const res=await fetch('/api/status',{cache:'no-store'});
    if(!res.ok) throw new Error('API hiba');
    const data=await res.json();
    const maxPlayers=Number(data.maxPlayers)||10;
    const players=Number(data.players)||0;
    if(els.state) els.state.textContent=data.online?'Online':'Online';
    if(els.players) els.players.textContent=`${players} / ${maxPlayers}`;
    if(els.discord) els.discord.textContent=data.discord?.members?`${data.discord.members} tag`:'Csatlakozz';
  }catch(e){
    fallback();
  }
}
loadStatus();
setInterval(loadStatus,30000);
