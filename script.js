/* Ugly-on-purpose business card. No dependencies.
   1. Theme toggle (persisted in localStorage).
   2. Cursor star trail (ugly theme, pointer devices only).
   3. "1,000,000th visitor" popup, once per session, 4 s after load.
   4. Visitor counter that counts up like it means it.
   5. Theme song: 8-bit melody from WebAudio, user-initiated only. */
(function () {
  'use strict';
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // 1. Theme
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', theme === 'normal' ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'normal' ? '#fafaf7' : '#ff00ff');
  }
  var saved = get('theme');
  if (saved === 'normal' || saved === 'ugly') apply(saved);
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'ugly' ? 'normal' : 'ugly';
    apply(next);
    set('theme', next);
  });

  function isUgly() { return root.getAttribute('data-theme') === 'ugly'; }

  // 2. Cursor trail
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    var last = 0;
    var stars = ['⭐', '✨', '💫', '🌟'];
    document.addEventListener('mousemove', function (e) {
      if (!isUgly()) return;
      var now = Date.now();
      if (now - last < 40) return;
      last = now;
      var s = document.createElement('span');
      s.className = 'trail-star';
      s.textContent = stars[(Math.random() * stars.length) | 0];
      s.style.left = (e.clientX - 9) + 'px';
      s.style.top = (e.clientY - 9) + 'px';
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 800);
    }, { passive: true });
  }

  // 3. Popup
  var popup = document.getElementById('popup');
  if (popup && !sessionStorage.getItem('popup-seen')) {
    setTimeout(function () {
      if (!isUgly()) return;
      popup.hidden = false;
      try { sessionStorage.setItem('popup-seen', '1'); } catch (e) {}
    }, 4000);
    popup.addEventListener('click', function (e) {
      if (e.target === popup || e.target.hasAttribute('data-close')) popup.hidden = true;
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') popup.hidden = true; });
  }

  // 4. Counter: start at a believable number, tick a few times.
  var odo = document.getElementById('odometer');
  if (odo && !reduced) {
    var n = 1337 + ((Math.random() * 400) | 0);
    var ticks = 0;
    function render() {
      var str = String(n).padStart(6, '0');
      var cells = odo.children;
      for (var i = 0; i < cells.length; i++) cells[i].textContent = str[i];
    }
    render();
    var iv = setInterval(function () {
      n++; render();
      if (++ticks > 7) clearInterval(iv);
    }, 900);
  }

  // 5. Theme song (only on click, browsers block autoplay anyway)
  var song = document.getElementById('theme-song');
  if (song) {
    var playing = false;
    song.addEventListener('click', function () {
      if (playing) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      playing = true;
      song.textContent = '♪ playing… ♪';
      var ctx = new AC();
      // Nokia-ish ringtone, in Hz. 0 = rest.
      var notes = [659, 587, 370, 415, 0, 554, 494, 294, 330, 0, 494, 440, 277, 330, 0, 440];
      var t = ctx.currentTime;
      notes.forEach(function (f, i) {
        if (!f) return;
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = 'square';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.18 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 0.16);
        o.connect(g).connect(ctx.destination);
        o.start(t + i * 0.18);
        o.stop(t + i * 0.18 + 0.17);
      });
      setTimeout(function () { playing = false; song.textContent = '▶ play my theme song'; ctx.close(); }, notes.length * 180 + 200);
    });
  }
})();
