# mywebcv — ugly-on-purpose business card for SiGMA Central Europe, Rome, 2–5 Nov 2026

One static page, no build step, no dependencies.

| File | What |
|---|---|
| `index.html` | All content. Edit text here. All contacts filled in. Hosted on GitHub Pages: https://montanuch.github.io/mywebcv/ (decision 2026-11-02: no custom domain). |
| `ugly.css` | 1998 skin (default). Every rule is a deliberate cliché. |
| `normal.css` | Same HTML done properly. The punchline behind the corner button. |
| `script.js` | Theme toggle, cursor trail, popup, counter, theme song. |
| `_headers` | Cloudflare Pages security headers + CSP. |

Local preview: `python3 -m http.server 8080` then open http://localhost:8080

Deploy (Cloudflare Pages, direct upload):

```sh
npx wrangler login
npx wrangler pages project create sigma-card --production-branch main
npx wrangler pages deploy . --project-name sigma-card
```
