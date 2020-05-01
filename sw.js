
  // imports
  importScripts('js/sw-utils.js');

  const CACHE_STATIC = 'static-v2';
  const CACHE_DYNAMIC = 'dynamic-v1';
  const CACHE_INMUTABLE = 'inmutable-v1';

  // recursos minimos necesarios para que nuestra aplicacion funcione (corazon)
  const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
  ];

  // recursos que no hallamos creado nosotros y que nosotros no podemos cambiar
  const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
  ];

  // instalacion del SW
  self.addEventListener('install', e => {

    const cacheStatic = caches.open(CACHE_STATIC).then(cache => cache.addAll(APP_SHELL))
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache => cache.addAll(APP_SHELL_INMUTABLE))

    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );
  });


  // activacion del SW
  self.addEventListener('activate', e => {

    // comprobamos y borramos cache static
    const responseKeys = caches.keys().then(keys => {
      keys.forEach(key => {
        if(key.includes('static') && key !== CACHE_STATIC) caches.delete(key);
      });
    })

    e.waitUntil( responseKeys );
  });


  // estrategia del cache - CACHE WITH NETWORK FALLBACK
  self.addEventListener('fetch', e => {

    const cacheResponse = caches.match(e.request).then(resp => {
      if(resp) return resp;
      else return fetch(e.request).then(newResponse => actualizarCache(CACHE_DYNAMIC, e.request, newResponse));
    });

    e.respondWith( cacheResponse );

  });
