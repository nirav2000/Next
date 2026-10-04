self.APPS_PWA_CONFIG={
  cacheName:'next-learning-shared-v1',
  cachePrefix:'next-learning-',
  defaultStrategy:'network-first',
  precache:['./','./index.html','./styles.css','./notes.css','./app.js','./notes.js','./firebase-config.js','./icon.svg','./manifest.webmanifest','./lessons/catalog.json','./lessons/french-quitter-20260926.json']
};
importScripts('https://nirav2000.github.io/Apps/pwa/v1/service-worker.js');
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws[0]?ws[0].focus():clients.openWindow('./')))});
