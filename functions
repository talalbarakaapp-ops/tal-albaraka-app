const functions=require('firebase-functions/v1'),admin=require('firebase-admin');if(!admin.apps.length)admin.initializeApp();
const db=admin.database(),APP_URL='https://talalbarakaapp-ops.github.io/tal-albaraka-app/',R=functions.region('asia-southeast1').database.instance('tal-albraka-default-rtdb');
async function push(uid,title,body){const s=await db.ref('tokens/'+uid).get(),t=Object.keys(s.val()||{});if(!t.length)return;
 const r=await admin.messaging().sendEachForMulticast({tokens:t,notification:{title,body},android:{priority:'high'},
  webpush:{headers:{Urgency:'high',TTL:'86400'},notification:{icon:APP_URL+'icon-192.png',badge:APP_URL+'icon-192.png',dir:'rtl',lang:'ar',requireInteraction:true,renotify:true,tag:'tal-msg',vibrate:[300,120,300,120,600]},fcmOptions:{link:APP_URL}}});
 await Promise.all(r.responses.map((x,i)=>!x.success&&/not-registered|invalid-registration/.test(x.error?.code||'')?db.ref(`tokens/${uid}/${t[i]}`).remove():null))}
exports.msgNew=R.ref('/msgs/{uid}/{id}').onCreate(async(snap,ctx)=>{const m=snap.val();await push(ctx.params.uid,'📩 رسالة جديدة من '+(m.fn||'الإدارة'),String(m.t||'').slice(0,120))});
exports.msgReply=R.ref('/msgs/{uid}/{id}/rp').onCreate(async(snap,ctx)=>{const[m,e]=await Promise.all([db.ref(`msgs/${ctx.params.uid}/${ctx.params.id}`).get(),db.ref('emps/'+ctx.params.uid+'/n').get()]);const v=m.val();if(!v||!v.fu)return;await push(v.fu,'↩️ رد على رسالتك من '+(e.val()||'موظف'),String(snap.val()||'').slice(0,120))});
