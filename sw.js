self.APPS_PWA_CONFIG={
  cacheName:'next-learning-shared-v7',
  cachePrefix:'next-learning-',
  defaultStrategy:'network-first',
  precache:['./','./index.html','./styles.css','./notes.css','./app.js','./notes.js','./firebase-config.js','./icon.svg','./manifest.webmanifest','./lessons/catalog.json','./lessons/french-quitter-20260926.json','./lessons/french-animal-opinions-homework-20261005.json','./french.html','https://nirav2000.github.io/Apps/french-teaching/v1/index.js','https://nirav2000.github.io/Apps/french-teaching/v1/auth-context.js','https://nirav2000.github.io/Apps/french-teaching/v1/data.js','https://nirav2000.github.io/Apps/french-teaching/v1/phonics.js','https://nirav2000.github.io/Apps/french-teaching/v1/lexicon.js','https://nirav2000.github.io/Apps/french-teaching/v1/dictionary.js','https://nirav2000.github.io/Apps/french-teaching/v1/style.css','https://nirav2000.github.io/Apps/learning-evidence/v1/index.js','https://nirav2000.github.io/Apps/learning-evidence/v1/firestore-cloud.js']
};
importScripts('https://nirav2000.github.io/Apps/pwa/v1/service-worker.js');
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws[0]?ws[0].focus():clients.openWindow('./')))});
