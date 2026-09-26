/* Visual category picker for Friend Challenge - Preview */
(function(){
  function esc(v){const d=document.createElement('div');d.textContent=String(v||'');return d.innerHTML;}
  function close(){document.getElementById('r60FriendPicker')?.remove();}
  function open(){
    if(typeof categoryDefinitions==='undefined'||typeof getQuestionPool!=='function'||typeof startGame!=='function')return;
    close();
    const available=categoryDefinitions.filter(c=>getQuestionPool(c.id).length);
    const overlay=document.createElement('div');
    overlay.id='r60FriendPicker';
    overlay.style.cssText='position:fixed;inset:0;z-index:100004;background:rgba(3,6,18,.94);overflow:auto;padding:20px;font-family:Arial,sans-serif;color:white';
    overlay.innerHTML=`<div style="max-width:560px;margin:0 auto;padding:10px 0 32px"><button id="r60FriendBack" style="width:auto;border:0;border-radius:12px;padding:11px 15px;background:#252c58;color:white;font-weight:800">← VOLVER</button><div style="text-align:center;margin:14px 0 20px"><div style="font-size:42px">⚔️</div><h1 style="margin:8px 0;color:#ffb800">RETAR A UN AMIGO</h1><p style="color:#b8bdd2;margin:0">Elige una categoría. Ambos jugarán el mismo reto.</p></div><div id="r60FriendGrid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">${available.map(c=>`<button data-r60-category="${esc(c.id)}" style="min-height:112px;border:1px solid #303866;border-radius:18px;background:#111733;color:white;padding:14px;font-size:17px;font-weight:800;line-height:1.25">${esc(c.label)}<div style="font-size:12px;color:#9fa6c2;margin-top:8px;font-weight:500">${getQuestionPool(c.id).length} preguntas</div></button>`).join('')}</div><p style="text-align:center;color:#777f9f;font-size:12px;margin-top:18px">Selecciona una tarjeta para comenzar tu desafío.</p></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#r60FriendBack').onclick=close;
    overlay.querySelectorAll('[data-r60-category]').forEach(b=>b.onclick=()=>{const category=b.dataset.r60Category;close();startGame(category,{friendInvite:true,n:'tu amigo',s:createChallengeSeed()});});
  }
  function install(){window.startFriendChallenge=open;const b=document.getElementById('friendChallengeButton');if(b)b.onclick=open;}
  window.R60FriendChallengeUI={open,close,install};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,100));else setTimeout(install,100);
})();
