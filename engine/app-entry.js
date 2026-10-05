// Keep the audio mixer alive while the game changes HTML scenes.
(function () {
  'use strict';
  if (window.parent !== window) return;
  // file:// documents have opaque origins in several browsers. The shared
  // iframe shell cannot reliably read its child scene there.
  if (location.protocol === 'file:') return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const view = page + location.search + location.hash;
  location.replace('./app.html?page=' + encodeURIComponent(view));
}());
