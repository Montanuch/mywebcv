# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single static page: an ugly-on-purpose business card for a game provider at SiGMA Central Europe
(Rome, 2–5 Nov 2026). No build step, no package manager, no dependencies, no tests. Five files do
everything: `index.html`, `ugly.css`, `normal.css`, `fx.css`, plus `script.js` and `fx.js`.

The joke is the architecture: the page ships **two complete skins over one DOM**. `ugly` (default) is
a 1998 GeoCities pastiche; `normal` is the same markup done properly, revealed by the corner button.

## Commands

```sh
python3 -m http.server 8080          # local preview → http://localhost:8080
node --check fx.js                   # syntax check (the only "test" that exists)
git push origin main                 # deploy: GitHub Pages serves main
```

There is no linter, no test runner, and no CI. Verification is by eye.

Headless screenshot, when a visual change needs checking without a device:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --virtual-time-budget=4000 --screenshot=out.png http://localhost:8080/
```

Note: `--window-size` is **not** honoured by this Chrome build — the layout viewport came out 500px
wide regardless of the flag, so screenshots get cropped, not reflowed. To check a phone width, load
the page in an `<iframe>` of a fixed pixel width from a scratch page and screenshot that instead.

## Deploy

**Live: <https://montanuch.github.io/mywebcv/>, served by GitHub Pages from `main`.** A push to `main`
is a deploy; Pages takes 1–3 minutes to pick it up.

Two traps that follow from this:

- **`_headers` does nothing in production.** It is a Cloudflare Pages feature. `curl -I` against the
  live site returns `server: GitHub.com` and none of the CSP / X-Frame-Options / Permissions-Policy
  directives in that file. Treat the CSP as documentation of intent, not as an active control — if a
  change relies on the CSP for safety, it is unprotected today.
- **The deploy section of `README.md` is stale.** It describes `npx wrangler pages deploy` to
  Cloudflare Pages, which is not how this site is published. The table higher up in the same README
  is correct (GitHub Pages, no custom domain, decided 2026-11-02).

### Git history

`main` and the old `origin/main` had **no common ancestor** (the repo history was recreated at some
point: identical commit messages, different hashes). That was resolved on 2026-11-02 by
force-pushing local `main`; the pre-force remote tip is kept in the local branch
`backup-origin-main` (`112d09b`). Never merge that branch — it would reintroduce two roots and
duplicate every commit. Delete it once it is clearly not needed.

## Architecture

### The two-skin system

`document.documentElement` carries `data-theme="ugly" | "normal"`, persisted in `localStorage.theme`
by `script.js:17-29`. Both stylesheets are always linked; every rule in them is namespaced
`:root[data-theme="ugly"] …` / `:root[data-theme="normal"] …`. There is no third state and no
unprefixed styling layer, so **a new element is invisible-by-default in whichever skin you forget**.

Practical consequence: any markup you add needs a rule in *both* `ugly.css` and `normal.css`, or a
deliberate decision that it belongs to one skin only.

### The FX layer

`fx.css` + `fx.js` hold the decorations (ponies, goldfish, Clippy, BSOD, slot machine, bouncing
dollars…). Two class conventions carry the contract, both defined at `fx.css:6-10`:

- `.fx` — fixed-position overlay decoration. `pointer-events: none` unless it also has `.ui`.
- `.fx-inline` — decoration that sits in the document flow.

Both are `display: none !important` when `:root` is not `ugly`, **and** under
`prefers-reduced-motion: reduce`. So marking something `.fx-inline` is how you say "this is noise,
not content" — it then disappears correctly in the normal skin and for motion-sensitive visitors
without any extra code.

`fx.js` is a flat list of numbered IIFEs (1–23), each self-contained and each re-checking
`prefers-reduced-motion` itself. The numbers correspond to the `/* ---- N. ... */` section headers in
`fx.css`. Keep that numbering in sync when adding an effect; append rather than renumber.

`script.js` is the non-decorative half: theme toggle, dial-up splash, the lazy `<iframe>` that loads
the real game only on click (`script.js:48-62`), the popup, the counter, the WebAudio theme song.
It must keep working under reduced motion — unlike `fx.js`, it has no early `return`.

### Reduced-motion contract

`ugly.css:227-232` kills every animation in the ugly skin with `animation: none !important`. New
effects must therefore be **animation-only**: an element whose readable/usable state depends on a
mid-animation frame will break. Concretely, the base (unanimated) state of anything you style has to
be the correct, legible one — see the CTA at `ugly.css:386-452`, which falls back to a plain large
yellow Win95 button.

### z-index budget

`36–41` fx decorations · `45` Win95 dialog · `48` the "eyes hurting?" strip · `50` theme toggle ·
`60` cursor trail · `100` popup · `200` dial-up splash. The theme toggle at 50 must stay above all
decoration — it is the only way out of the ugly skin.

### Storage keys

`localStorage.theme`; `sessionStorage` `splash-seen`, `popup-seen`, `tired-seen`. All reads and
writes are wrapped in try/catch because the page is opened from QR codes in private windows.

## Hard rules

- **The WhatsApp number must never exist in this repo as readable text.** It lives in
  `data-wa` as reversed-then-base64 digits and the `wa.me` URL is assembled on click
  (`fx.js:345-360`). This defeats scrapers and code search, not devtools. Do not "simplify" it into
  an `href`.
- **Placeholders hide themselves.** Links still holding `LINKEDIN_URL` / `WHATSAPP_NUMBER` get their
  `<li>` hidden at `fx.js:177-179`, so an unfinished contact never ships as a dead button.
- **The game `<iframe>` loads on click only** (`script.js:48-62`) — the page must stay cheap on a
  conference phone on hotel wifi.
- Nothing autoplays audio; the theme song is user-initiated (`script.js:97-126`).
- Content lives in `index.html` only. The editable bits are listed in the comment at
  `index.html:27-33`.

## Register

Copy is deadpan, lowercase-ish, self-deprecating, written for iGaming people who have seen a
thousand booths — jokes land as throwaway asides, never as explained jokes. The page says outright
that it is ugly on purpose (`index.html:244-248`); that honesty is load-bearing, so keep any new
disclaimer plain. The one serious, unironic section is the partnership/math brief link and the
responsible-gaming line.

---

Found an OpenAI Codex config at `~/.codex/config.toml`. Reply `/import` to scan and list what is
importable from it (MCP servers, slash commands, subagents, skills, instructions); the scan prints a
digest, then `/import --yes=<digest>` applies the user-level items.
