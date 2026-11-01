/* FX layer. Everything here only runs in the ugly skin and never under reduced motion.
   Nothing autoplays audio. Nothing covers the contact buttons for long. */
(function () {
  'use strict';
  var R = document.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ugly = function () { return R.getAttribute('data-theme') === 'ugly'; };
  var $ = function (s) { return document.querySelector(s); };
  function fx(cls, html, tag) { var e = document.createElement(tag || 'div'); e.className = 'fx ' + cls; e.innerHTML = html; document.body.appendChild(e); return e; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  if (RM) return;

  // 1. Pink pony stampede. 1–3 ponies, every ~25 s, each carrying an industry buzzword.
  var PONY_TXT = ['RTP 96%', 'GGR', 'KYC', 'B2B', 'bonus buy', 'volatility: HIGH', 'tier-1', 'Q4', 'NDA', 'we\'ll check internally'];
  function stampede() {
    if (!ugly() || document.hidden || document.querySelectorAll('.pony').length > 4) return;
    var n = 1 + (Math.random() * 3 | 0);
    for (var i = 0; i < n; i++) {
      var p = fx('pony', '<span>🐎</span><small>' + PONY_TXT[Math.random() * PONY_TXT.length | 0] + '</small>');
      p.style.setProperty('--t', rnd(4, 7).toFixed(1) + 's');
      p.style.bottom = rnd(10, 60).toFixed(0) + 'vh';
      p.style.animationDelay = (i * 0.5) + 's';
      p.addEventListener('animationend', function (e) { if (e.animationName === 'gallop') e.currentTarget.remove(); });
    }
  }
  setTimeout(stampede, 6000);
  setInterval(stampede, 25000);

  // 2. Chippy. Bottom-left, hides itself while the contact section is on screen.
  var LINES = [
    'It looks like you are trying to find a game provider. Would you like help?',
    'It looks like you are an aggregator. Would you like to "check internally"?',
    'It looks like you are from compliance. KYC check: we scanned your lanyard. Verified.',
    'It looks like you are an affiliate. The revshare is 0% of €0. Interested?',
    'It looks like you are still here. Respect.'
  ];
  var chippy = $('#chippy'), ctxt = $('#chippy-txt'), li = 0;
  if (chippy && !get('chippy-gone')) {
    var showChippy = function () { if (!ugly()) return; ctxt.textContent = LINES[li]; chippy.hidden = false; setTimeout(function () { chippy.hidden = true; }, 30000); };
    setTimeout(showChippy, 9000);
    chippy.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-yes')) { chippy.hidden = true; $('#contact').scrollIntoView({ behavior: 'smooth' }); }
      else if (b.hasAttribute('data-no')) { li = (li + 1) % LINES.length; ctxt.textContent = LINES[li]; }
      else { chippy.hidden = true; set('chippy-gone', '1'); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (x) { chippy.style.visibility = x.isIntersecting ? 'hidden' : ''; }); }, { threshold: 0.1 })
        .observe($('#contact'));
    }
  }

  // 5/6. Win95 dialog, opened by the RAM button and by the "×" of the demo window.
  var dlg = $('#win-dialog');
  function openDialog(title, text, details) {
    if (!dlg || !ugly()) return;
    $('#wd-title').textContent = title; $('#wd-text').textContent = text; $('#wd-details').textContent = details || '';
    dlg.classList.remove('open'); dlg.hidden = false;
  }
  if (dlg) {
    dlg.addEventListener('click', function (e) {
      var b = e.target.closest('button, a'); if (!b) return;
      if (b.hasAttribute('data-details')) dlg.classList.toggle('open');
      else dlg.hidden = true;
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dlg.hidden = true; });
    var x = $('#demo-close');
    if (x) x.addEventListener('click', function () {
      openDialog('paperhands.exe', 'This program has performed an illegal operation and will be shut down. Just kidding. It is a crash game, crashing is the feature.', 'Error 0x0000PAPER: diamond hands not found\nModule: TASTE.DLL (missing)\nSuggested fix: play again');
    });
  }
  var ram = $('#ram-btn'), ramFill = $('#ram-fill'), ramMsg = $('#ram-msg');
  if (ram) ram.addEventListener('click', function () {
    if (ram.disabled) return;
    ram.disabled = true; var pct = 0;
    var iv = setInterval(function () {
      pct += 4 + Math.random() * 9; if (pct > 100) pct = 100;
      ramFill.style.width = pct + '%'; ramMsg.textContent = 'Downloading RAM… ' + (pct | 0) + '% (' + (pct * 0.64 | 0) + ' of 64 MB)';
      if (pct >= 100) { clearInterval(iv); ramMsg.textContent = 'RAM installed. Your phone is now 1996.'; ram.textContent = 'Download 64 MB more RAM'; ram.disabled = false; ramFill.style.width = '0'; }
    }, 180);
  });

  // 7. Slot machine. Spins, always lands on 🧻🧻🧻.
  var slot = $('#slot');
  if (slot) {
    var reels = slot.querySelectorAll('.reel span'), msg = slot.querySelector('.msg'), pull = slot.querySelector('.pull'), spins = 0;
    var SYM = ['🍒', '💎', '7️⃣', '🍋', '🔔', '💰', '🐸', '🚀'];
    var MSGS = ['JACKPOT: paper hands. Again.', 'Three paper hands. The machine knows you.', 'It is always 🧻. That is the game.', 'Rigged? Yes. Towards 🧻.'];
    pull.addEventListener('click', function () {
      if (pull.disabled) return; pull.disabled = true; msg.textContent = '';
      reels.forEach(function (r) { r.parentNode.classList.add('spin'); });
      var tick = setInterval(function () { reels.forEach(function (r) { if (r.parentNode.classList.contains('spin')) r.textContent = SYM[Math.random() * SYM.length | 0]; }); }, 90);
      [700, 1200, 1700].forEach(function (t, i) {
        setTimeout(function () { reels[i].parentNode.classList.remove('spin'); reels[i].textContent = '🧻'; if (i === 2) { clearInterval(tick); msg.textContent = MSGS[spins++ % MSGS.length]; pull.disabled = false; } }, t);
      });
    });
  }

  // 8. "You've got mail!" toast when a contact button is tapped.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('#contact .btn, #popup .btn'); if (!a || !ugly()) return;
    var t = fx('toast', '📬 You\'ve got mail! (well, I will)'); setTimeout(function () { t.remove(); }, 2400);
  });

  // 9. Konami code → cheat mode: money rain + a line.
  var KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], pos = 0;
  document.addEventListener('keydown', function (e) {
    pos = (e.keyCode === KONAMI[pos]) ? pos + 1 : 0;
    if (pos === KONAMI.length) { pos = 0; moneyRain(60); openDialog('CHEAT ENABLED', 'RTP set to 420%.* Infinite diamond hands.', '* Not really. The math does not have a cheat code. That is the point.'); }
  });
  function moneyRain(n) {
    if (!ugly()) return;
    var E = ['💸', '🧻', '💎', '🚀', '📉'];
    for (var i = 0; i < n; i++) (function (i) {
      setTimeout(function () {
        var d = fx('rain', E[Math.random() * E.length | 0]);
        d.style.left = rnd(0, 100) + 'vw'; d.style.setProperty('--t', rnd(1.8, 3.2).toFixed(1) + 's');
        d.addEventListener('animationend', function () { d.remove(); });
      }, i * 40);
    })(i);
  }
  // #cheat-btn now uses the bouncing dollars (section 20)

  // 10. Screen check. Phones in portrait pass.
  var sc = $('#screencheck');
  if (sc) sc.textContent = (screen.width <= 800)
    ? 'Screen check: ' + screen.width + 'px wide. Congratulations, your monitor is correctly sized for this site.'
    : 'Screen check: your screen is ' + screen.width + 'px wide. This site is optimized for 800×600. Please downgrade.';
})();

/* 11. Gravity mode + FIX IT. 12. BSOD on the third "Bring back the horror". */
(function () {
  'use strict';
  var R = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var page = document.querySelector('.page'), g = document.getElementById('gravity-btn'), fix = document.getElementById('fixit');
  if (g && fix && page) {
    g.addEventListener('click', function () {
      if (R.getAttribute('data-theme') !== 'ugly') return;
      page.querySelectorAll('.box, .hero > *, footer > *, .banner-ad, .ad-footnote').forEach(function (el) { el.style.setProperty('--r', ((Math.random() * 60) - 30).toFixed(0) + 'deg'); });
      page.classList.add('gravity');
      setTimeout(function () { fix.hidden = false; }, 1200);
    });
    fix.addEventListener('click', function () { page.classList.remove('gravity'); fix.hidden = true; });
  }
  var bsod = document.getElementById('bsod'), toggle = document.getElementById('theme-toggle'), backs = 0;
  if (bsod && toggle) {
    toggle.addEventListener('click', function () {
      // script.js has already flipped the theme by now (its listener was attached first)
      if (R.getAttribute('data-theme') === 'ugly' && ++backs === 3) { bsod.hidden = false; }
    });
    var off = function () { bsod.hidden = true; };
    bsod.addEventListener('click', off);
    document.addEventListener('keydown', function () { if (!bsod.hidden) off(); });
  }
})();

/* 13. "Eyes hurting?" strip after 20 s, once per session. The punchline must be findable. */
(function () {
  var R = document.documentElement, bar = document.getElementById('tired');
  if (!bar) return;
  var seen = false; try { seen = !!sessionStorage.getItem('tired-seen'); } catch (e) {}
  if (seen) return;
  setTimeout(function () {
    if (R.getAttribute('data-theme') !== 'ugly') return;
    bar.hidden = false; try { sessionStorage.setItem('tired-seen', '1'); } catch (e) {}
  }, 20000);
  document.getElementById('tired-yes').addEventListener('click', function () { bar.hidden = true; document.getElementById('theme-toggle').click(); });
  document.getElementById('tired-no').addEventListener('click', function () { bar.hidden = true; });
})();

/* 14. MAKE IT WORSE reveals the second half. 15. Hide Telegram links until the handle is set. */
(function () {
  var b = document.getElementById('more-btn'), m = document.getElementById('more');
  if (b && m) b.addEventListener('click', function () { m.hidden = false; b.parentNode.hidden = true; m.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  document.querySelectorAll('a[href*="WHATSAPP_NUMBER"], a[href="LINKEDIN_URL"]').forEach(function (a) {
    var li = a.closest('li'); if (li) li.hidden = true; else a.hidden = true;
  });
})();

/* 16. PLAY THE GAME at the top loads the demo right away instead of only scrolling. */
(function () {
  var top = document.getElementById('play-top'), play = document.getElementById('play-inline');
  if (top && play) top.addEventListener('click', function () { if (!play.hidden) play.click(); });
})();

/* 17. Toilet paper. Desktop: a roll rides the cursor and unrolls a ribbon behind it.
       Phone: scrolling unrolls a strip down the right edge. 18. A cat walks the bottom edge and panics on DO NOT PRESS. */
(function () {
  var R = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ugly = function () { return R.getAttribute('data-theme') === 'ugly'; };
  var fine = matchMedia('(pointer: fine)').matches;

  if (fine) {
    var cv = document.createElement('canvas'); cv.id = 'paper-canvas'; cv.className = 'fx'; document.body.appendChild(cv);
    var roll = document.createElement('div'); roll.id = 'paper-roll'; roll.className = 'fx'; roll.textContent = '🧻'; document.body.appendChild(roll);
    var ctx = cv.getContext('2d'), pts = [], last = null, dist = 0, raf = 0;
    function size() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
    size(); addEventListener('resize', size);
    document.addEventListener('mousemove', function (e) {
      if (!ugly()) return;
      var p = { x: e.clientX, y: e.clientY, t: performance.now() };
      if (last) dist += Math.hypot(p.x - last.x, p.y - last.y);
      last = p; pts.push(p); if (pts.length > 220) pts.shift();
      roll.style.transform = 'translate(' + (p.x - 17) + 'px,' + (p.y - 17) + 'px) rotate(' + (dist * 2 % 360) + 'deg)';
      if (!raf) raf = requestAnimationFrame(draw);
    }, { passive: true });
    function draw() {
      raf = 0;
      var now = performance.now();
      while (pts.length && now - pts[0].t > 2600) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (pts.length < 2) { if (last && now - last.t < 2600) raf = requestAnimationFrame(draw); return; }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      // paper body, fading with age
      for (var i = 1; i < pts.length; i++) {
        var a = 1 - (now - pts[i].t) / 2600;
        ctx.strokeStyle = 'rgba(255,255,255,' + a + ')'; ctx.lineWidth = 24;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        ctx.strokeStyle = 'rgba(190,190,190,' + a + ')'; ctx.lineWidth = 26; ctx.globalCompositeOperation = 'destination-over';
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
      // perforation ticks
      ctx.strokeStyle = 'rgba(160,160,160,.8)'; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
      for (var j = 8; j < pts.length; j += 8) { var q = pts[j], o = pts[j - 1], dx = q.x - o.x, dy = q.y - o.y, L = Math.hypot(dx, dy) || 1; ctx.beginPath(); ctx.moveTo(q.x - dy / L * 11, q.y + dx / L * 11); ctx.lineTo(q.x + dy / L * 11, q.y - dx / L * 11); ctx.stroke(); }
      ctx.setLineDash([]);
      raf = requestAnimationFrame(draw);
    }
  } else {
    var strip = document.createElement('div'); strip.id = 'paper-strip'; strip.className = 'fx'; document.body.appendChild(strip);
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false; if (!ugly()) return;
        var max = R.scrollHeight - innerHeight, k = max > 0 ? scrollY / max : 0;
        strip.style.height = Math.max(0, k * (innerHeight - 90)) + 'px';
        strip.style.setProperty('--rot', (scrollY / 2 % 360) + 'deg');
      });
    }, { passive: true });
  }

  var cat = document.createElement('div'); cat.id = 'cat'; cat.className = 'fx'; cat.innerHTML = '<span>🐈</span>'; document.body.appendChild(cat);
  var g = document.getElementById('gravity-btn');
  if (g) g.addEventListener('click', function () { cat.classList.remove('scared'); void cat.offsetWidth; cat.classList.add('scared'); setTimeout(function () { cat.classList.remove('scared'); }, 1000); });
})();

/* 19. Goldfish. A small school, both directions, bubbles now and then. The page is an aquarium now. */
(function () {
  var R = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ugly = function () { return R.getAttribute('data-theme') === 'ugly'; };
  var N = innerWidth < 600 ? 4 : 6, fish = [];
  for (var i = 0; i < N; i++) {
    var f = document.createElement('div'); f.className = 'fx fish' + (i % 2 ? ' back' : ''); f.innerHTML = '<span>🐟</span>';
    f.style.top = (8 + Math.random() * 78) + 'vh';
    f.style.setProperty('--t', (22 + Math.random() * 26).toFixed(0) + 's');
    f.style.setProperty('--d', (-Math.random() * 30).toFixed(0) + 's');
    f.style.setProperty('--s', (26 + Math.random() * 18).toFixed(0) + 'px');
    document.body.appendChild(f); fish.push(f);
  }
  // and the big ones: slow, huge, impossible to ignore
  var BIG = innerWidth < 600 ? 1 : 2;
  for (var k = 0; k < BIG; k++) {
    var g = document.createElement('div'); g.className = 'fx fish big' + (k % 2 ? ' back' : ''); g.innerHTML = '<span>🐟</span>';
    g.style.top = (20 + k * 35 + Math.random() * 15) + 'vh';
    g.style.setProperty('--t', (50 + Math.random() * 20).toFixed(0) + 's');
    g.style.setProperty('--d', (-10 - Math.random() * 30).toFixed(0) + 's');
    g.style.setProperty('--s', (innerWidth < 600 ? 110 : 150) + 'px');
    document.body.appendChild(g); fish.push(g);
  }
  setInterval(function () {
    if (!ugly() || document.hidden) return;
    var f = fish[Math.random() * fish.length | 0], r = f.getBoundingClientRect();
    if (r.width === 0) return;
    var b = document.createElement('div'); b.className = 'fx bubble-o'; b.textContent = Math.random() < 0.15 ? 'blub' : '○';
    b.style.left = (r.left + r.width / 2) + 'px'; b.style.top = r.top + 'px';
    document.body.appendChild(b); setTimeout(function () { b.remove(); }, 2500);
  }, 1800);
})();

/* 20. Bouncing dollars. A tiny physics loop: gravity, floor and wall bounces, damping, spin.
       Emitted by the paper roll as it unrolls (cursor on desktop, scroll on phones) and by "Make it rain". */
(function () {
  var R = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ugly = function () { return R.getAttribute('data-theme') === 'ugly'; };
  var P = [], raf = 0, lastT = 0, MAX = 45, G = 2200, SYM = ['💵', '💵', '💵', '💸'];
  function emit(x, y, vx, vy) {
    if (!ugly() || P.length >= MAX) return;
    var el = document.createElement('div'); el.className = 'fx buck'; el.textContent = SYM[Math.random() * SYM.length | 0];
    document.body.appendChild(el);
    P.push({ el: el, x: x, y: y, vx: vx, vy: vy, r: Math.random() * 360, vr: (Math.random() - .5) * 720, b: 0, t: 0 });
    if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(step); }
  }
  function step(now) {
    var dt = Math.min(0.033, (now - lastT) / 1000); lastT = now;
    var W = innerWidth, H = innerHeight;
    for (var i = P.length - 1; i >= 0; i--) {
      var p = P[i];
      p.vy += G * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.t += dt;
      if (p.y > H - 28) { p.y = H - 28; p.vy = -p.vy * 0.62; p.vx *= 0.85; p.vr *= 0.7; p.b++; }
      if (p.x < 0) { p.x = 0; p.vx = -p.vx * 0.8; } else if (p.x > W - 26) { p.x = W - 26; p.vx = -p.vx * 0.8; }
      var fade = p.b >= 5 ? Math.max(0, 1 - (p.t - 0) * 0.02) : 1;
      if (p.b >= 7 || p.t > 9) { p.el.remove(); P.splice(i, 1); continue; }
      p.el.style.transform = 'translate3d(' + p.x + 'px,' + p.y + 'px,0) rotate(' + p.r + 'deg)';
      if (p.b >= 5) p.el.style.opacity = Math.max(0, 1 - (p.b - 4) / 3);
    }
    raf = P.length ? requestAnimationFrame(step) : 0;
  }
  // from the roll, desktop: one bill per ~90 px of cursor travel
  var acc = 0, lx = null, ly = null;
  document.addEventListener('mousemove', function (e) {
    if (lx !== null) acc += Math.hypot(e.clientX - lx, e.clientY - ly);
    lx = e.clientX; ly = e.clientY;
    if (acc > 90) { acc = 0; emit(e.clientX, e.clientY, (Math.random() - .5) * 400, -200 - Math.random() * 300); }
  }, { passive: true });
  // from the roll, phones: bills drop from the strip's end as you scroll
  var lastY = scrollY, sacc = 0;
  addEventListener('scroll', function () {
    sacc += Math.abs(scrollY - lastY); lastY = scrollY;
    if (sacc > 140) { sacc = 0; var strip = document.getElementById('paper-strip'); if (!strip) return;
      var y = parseFloat(strip.style.height || '0'); emit(innerWidth - 20, Math.min(y + 10, innerHeight - 100), -150 - Math.random() * 300, -100 - Math.random() * 200); }
  }, { passive: true });
  // Make it rain: replace the plain fall with the bouncy one
  var cheat = document.getElementById('cheat-btn');
  if (cheat) cheat.addEventListener('click', function () {
    for (var i = 0; i < 30; i++) (function (i) { setTimeout(function () { emit(Math.random() * innerWidth, -30, (Math.random() - .5) * 300, Math.random() * 200); }, i * 60); })(i);
  }, true);
  window.__emitBuck = emit;
})();

/* 21. Analytics beacon: do not load it while the token is still the placeholder. */
(function () {
  var b = document.querySelector('script[data-cf-beacon*="CF_BEACON_TOKEN"]');
  if (b) b.remove();
})();
