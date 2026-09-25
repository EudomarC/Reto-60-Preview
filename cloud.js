const RETO60_API_URL="https://grznkkkmehxclqkniobt.supabase.co/functions/v1/reto60-api";
const R60_IDENTITY_URL="https://grznkkkmehxclqkniobt.supabase.co/functions/v1/dynamic-worker";
const R60_GAME_ID="reto60";
function reto60GuestId(){let id=localStorage.getItem("reto60_guest_id");if(!id){id=crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==="x"?r:(r&3|8);return v.toString(16)});localStorage.setItem("reto60_guest_id",id)}return id;}
function isTelegramPlayer(){return !!(window.Telegram?.WebApp?.initData);}
async function reto60Cloud(action,payload={}){const initData=window.Telegram?.WebApp?.initData||"",headers={"Content-Type":"application/json"};if(initData)headers["x-telegram-init-data"]=initData;else headers["x-guest-id"]=reto60GuestId();try{const response=await fetch(RETO60_API_URL,{method:"POST",headers,body:JSON.stringify({action,game_id:R60_GAME_ID,...payload})}),data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||`HTTP_${response.status}`);return {ok:true,...data};}catch(error){console.warn("Reto 60 cloud:",error);return {ok:false,error:String(error?.message||error)};}}
async function reto60Identity(){const initData=window.Telegram?.WebApp?.initData||"",headers={"Content-Type":"application/json"};if(initData)headers["x-telegram-init-data"]=initData;else headers["x-guest-id"]=reto60GuestId();try{const response=await fetch(R60_IDENTITY_URL,{method:"POST",headers,body:JSON.stringify({action:"sync_identity"})}),data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||`HTTP_${response.status}`);return {ok:true,...data};}catch(error){console.warn("R60 identity:",error);return {ok:false,error:String(error?.message||error)};}}
function reto60NormalizeIdentity(r){if(!r?.player)return r;const accountId=r.r60_account_id||r.player.r60_account_id||null;const coins=Number(r.r60_coins??r.wallet?.coins??0)||0;return {...r,r60:{account_id:accountId,coins,game_id:R60_GAME_ID},player:{...r.player,r60_account_id:accountId,r60_coins:coins}};}
async function setCloudDisplayName(display_name){return reto60NormalizeIdentity(await reto60Cloud("set_display_name",{display_name}));}
async function recordCloudMatch({category,score,seed,mode}){return reto60Cloud("record_match",{category,score,seed,mode});}
async function getCloudLeaderboard(){return reto60Cloud("leaderboard");}
async function createCloudChallenge({opponent_id,category,seed,challenger_score=0}){return reto60Cloud("create_challenge",{opponent_id,category,seed,challenger_score});}
async function getPendingChallenges(){return reto60Cloud("pending_challenges");}
async function respondCloudChallenge(challenge_id,decision){return reto60Cloud("respond_challenge",{challenge_id,decision});}
async function completeCloudChallenge(challenge_id,score){return reto60Cloud("complete_challenge",{challenge_id,score});}
async function getDuelHistory(){return reto60Cloud("duel_history");}
