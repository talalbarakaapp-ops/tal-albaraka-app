importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:'AIzaSyAD1SHGOmty-T7w_1Zv-d3aMHXp9II1LVk',projectId:'tal-albraka',messagingSenderId:'416255070658',appId:'1:416255070658:web:2a1c6aaa4e425bd00d865b'});
const messaging=firebase.messaging();
const VIB=[300,120,300,120,600];
// رسائل data-only: نعرضها نحن بإعدادات قوية. لو أرسل السيرفر notification جاهزة فالمتصفح يعرضها بنفسه.
messaging.onBackgroundMessage(p=>{
  if(p.notification)return;
  const d=p.data||{};
  return self.registration.showNotification(d.title||'تال البركة',{
    body:d.body||'لديك تنبيه جديد',icon:'icon-192.png',badge:'icon-192.png',
    tag:d.tag||('tal-'+Date.now()),renotify:true,requireInteraction:true,
    vibrate:VIB,dir:'rtl',lang:'ar',silent:false,data:{url:d.url||'./'}
  }).then(()=>self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs.forEach(c=>c.postMessage({type:'tal-alert'}))));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const u=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if('focus' in c)return c.focus()}
    return self.clients.openWindow(u);
  }));
});
