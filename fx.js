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
  var cheat = $('#cheat-btn'); if (cheat) cheat.addEventListener('click', function () { moneyRain(40); });

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
  document.querySelectorAll('a[href*="TELEGRAM_HANDLE"]').forEach(function (a) {
    var li = a.closest('li'); if (li) li.hidden = true; else a.hidden = true;
  });
})();
