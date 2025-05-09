// Import Workbox (https://developers.google.com/web/tools/workbox/)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

/*
  Precache Manifest
  Change revision as soon as file content changed
*/
self.__WB_MANIFEST = [
  {
    revision: '1',
    url: 'framework7/framework7-bundle.min.css'
  },
  {
    revision: '1',
    url: 'framework7/framework7-bundle.min.js'
  },
  {
    revision: '1',
    url: 'css/app.css'
  },
  {
    revision: '1',
    url: 'css/icons.css'
  },
  {
    revision: '1',
    url: 'js/routes.js'
  },
  {
    revision: '1',
    url: 'js/store.js'
  },
  {
    revision: '1',
    url: 'js/app.js'
  },
  // Fonts
  {
    revision: '1',
    url: 'fonts/Framework7Icons-Regular.woff2'
  },
  {
    revision: '1',
    url: 'fonts/Framework7Icons-Regular.woff'
  },
  {
    revision: '1',
    url: 'fonts/material-icons.woff2'
  },
  {
    revision: '1',
    url: 'fonts/material-icons.woff'
  },
  // HTML
  {
    revision: '1',
    url: './index.html'
  },
];

/*
  Enable precaching
  It is better to comment next line during development
*/
//workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);