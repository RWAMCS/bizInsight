// Service Worker Sederhana untuk memenuhi kriteria installasi PWA
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

// Penting: Browser butuh event fetch agar tombol install muncul
self.addEventListener('fetch', (event) => {
  // Kita biarkan request lewat secara normal (network first)
  event.respondWith(fetch(event.request));
});