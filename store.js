/* Reto 60 Store — Mercado Pago + cloud inventory */
(function(){
 const INV_KEY='reto60_inventory_v1',ACTIVE_TIME_KEY='reto60_time10_active',FOX_EQUIPPED_KEY='reto60_fox_equipped';
 const PRODUCTS=[{id:'time10',icon:'⏳',name:'+10 SEGUNDOS',kind:'POTENCIADOR',price:'USD 0.90',desc:'Obtén 10 segundos extra en tu próxima partida.',cls:'boost'},{id:'fox',icon:'🦊',name:'ZORRO R60',kind:'MASCOTA',price:'USD 2.99',desc:'Multiplica tus puntos x2 durante 10 segundos, una vez por partida.',cls:'fox'}];
 const R60_PRODUCTS=[{id:'special',icon:'🎟️',name:'Entrada especial',price:50,desc:'Acceso a retos y eventos especiales de Reto 60.'},{id:'streak',icon:'🔥',name:'Protector de racha',price:80,desc:'Protege tu racha durante un día si no puedes jugar.'},{id:'badge',icon:'👑',name:'Insignia exclusiva',price:120,desc:'Una insignia coleccionable para lucir en tu perfil.'}];
 const readInv=()=>{try{return {...{time10:0,fox:0,special:0,streak:0,badge:0},...JSON.parse(localStorage.getItem(INV_KEY)||'{}')}}catch(e){return {time10:0,fox:0,special:0,streak:0,badge:0}}};
 const writeInv=v=>{localStorage.setItem(INV_KEY,JSON.stringify(v));window.dispatchEvent(new CustomEvent('r60inventorychange',{detail:v}));return v};
 const count=id=>Math.max(0,Number(readInv()[id]||0));
 const add=(id,n=1)=>{const v=readInv();v[id]=Math.max(0,Number(v[id]||0)+Number(n||0));writeInv(v);return v[id]};
 const isTimeActive=()=>localStorage.getItem(ACTIVE_TIME_KEY)==='1';
 const activateTime=()=>{if(count('time10')<1)return false;localStorage.setItem(ACTIVE_TIME_KEY,'1');return true};
 const deactivateTime=()=>localStorage.removeItem(ACTIVE_TIME_KEY);
 const consumeTime=()=>{if(!isTimeActive()||count('time10')<1){deactivateTime();return false}const v=readInv();v.time10=Math.max(0,v.time10-1);writeInv(v);deactivateTime();if(window.reto60Cloud)window.reto60Cloud('consume_time10').then(syncInventory);return true};
 const isFoxEquipped=()=>localStorage.getItem(FOX_EQUIPPED_KEY)==='1'&&count('fox')>0;
 const equipFox=()=>{if(count('fox')<1)return false;localStorage.setItem(FOX_EQUIPPED_KEY,'1');if(window.reto60Cloud)window.reto60Cloud('set_fox_equipped',{equipped:true});return true};
 const unequipFox=()=>{localStorage.removeItem(FOX_EQUIPPED_KEY);if(window.reto60Cloud)window.reto60Cloud('set_fox_equipped',{equipped:false})};
 async function syncInventory(){if(!window.reto60Cloud)return false;const r=await window.reto60Cloud('get_inventory');if(!r.ok)return false;const v=readInv();v.time10=0;v.fox=0;(r.inventory||[]).forEach(x=>{if(x.item_id==='time10'||x.item_id==='fox')v[x.item_id]=Number(x.quantity||0);if(x.item_id==='fox'){if(x.equipped)localStorage.setItem(FOX_EQUIPPED_KEY,'1');else localStorage.removeItem(FOX_EQUIPPED_KEY)}});if(v.time10<1)deactivateTime();writeInv(v);return true}
 function close(){document.getElementById('r60Store')?.remove();document.getElementById('r60StoreCss')?.remove()}
 function open(){alert('Tienda R60 disponible en Preview.');}
 function install(){if(document.getElementById('r60StoreButton'))return true;const home=document.getElementById('home');if(!home)return false;const b=document.createElement('button');b.id='r60StoreButton';b.textContent='🛒 TIENDA · MASCOTAS Y POTENCIADORES';b.onclick=open;home.appendChild(b);return true}
 window.R60Store={open,close,install,products:PRODUCTS,r60Products:R60_PRODUCTS,inventory:readInv,count,add,syncInventory,isTimeActive,activateTime,deactivateTime,consumeTime,isFoxEquipped,equipFox,unequipFox};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();