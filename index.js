const functions=require('firebase-functions/v1'),admin=require('firebase-admin');admin.initializeApp();
const db=admin.database(),APP_URL='https://talalbarakaapp-ops.github.io/tal-albaraka-app/',
R=functions.region('asia-southeast1').database.instance('tal-albraka-default-rtdb'),
KIND={adv:['سلفة','adv'],lv:['إجازة','lv'],fx:['تصحيح حضور','aed']};
async function tokensOf(uids){const out=[];await Promise.all(uids.map(async u=>{const s=await db.ref('tokens/'+u).get();Object.keys(s.val()||{}).forEach(t=>out.push({u,t}))}));return out}
async function send(list,title,body){if(!list.length)return;
 const r=await admin.messaging().sendEachForMulticast({tokens:list.map(x=>x.t),notification:{title,body},android:{priority:'high'},webpush:{headers:{Urgency:'high',TTL:'86400'},notification:{icon:APP_URL+'icon-192.png',badge:APP_URL+'icon-192.png',dir:'rtl',lang:'ar'},fcmOptions:{link:APP_URL}}});
 await Promise.all(r.responses.map((x,i)=>!x.success&&/not-registered|invalid-registration/.test(x.error?.code||'')?db.ref(`tokens/${list[i].u}/${list[i].t}`).remove():null))}
async function managers(branch,perm){const[a,s]=await Promise.all([db.ref('admins').get(),db.ref('sups').get()]),A=a.val()||{},ids=Object.keys(A).filter(k=>A[k]===true);
 Object.entries(s.val()||{}).forEach(([k,x])=>{if(x.active!==false&&x.br?.[branch]&&x.p?.[perm])ids.push(k)});return ids}
for(const k of Object.keys(KIND)){
 exports[k+'New']=R.ref(`/${k}/{uid}/{id}`).onCreate(async(snap,ctx)=>{if(snap.val().s!=='pn')return;
  const e=(await db.ref('emps/'+ctx.params.uid).get()).val()||{};
  await send(await tokensOf(await managers(e.branch,KIND[k][1])),'طلب جديد',`${KIND[k][0]} من ${e.n||'موظف'}`)});
 exports[k+'Done']=R.ref(`/${k}/{uid}/{id}/s`).onUpdate(async(ch,ctx)=>{const a=ch.after.val();if(ch.before.val()!=='pn'||(a!=='ap'&&a!=='rj'))return;
  await send(await tokensOf([ctx.params.uid]),a==='ap'?'تمت الموافقة':'تم الرفض',`طلب ${KIND[k][0]} الخاص بك`)})}
