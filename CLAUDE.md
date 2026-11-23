# MorphPlayerSite

Static website for the three MorphPlayer apps (DaanishSuhood/MorphPlayer, MorphPlayerTV, MorphPlayerMobile), hosted
on Netlify from `public/`. Plain HTML, CSS and JavaScript: no build step, no frameworks, no web fonts, no analytics.

## Decisions to keep

- Download buttons resolve the latest release in the browser (`api.github.com/repos/<owner>/<repo>/releases/latest`,
  cached in sessionStorage for 30 minutes) and match assets by the regex in `data-asset`. Their `href` is the release
  page, so they still work without scripts. Never hard-code version numbers or asset names on the page.
- The CSP in `netlify.toml` is strict: no inline scripts or `style` attributes in HTML (JS setting `element.style` is
  fine), and `connect-src` only allows `api.github.com`. Add to it deliberately if something new is needed.
- Colours mirror the apps' themes and accents (`look.js`: TV/mobile `screen`/`raised`/`text`/`textDim`, the same 3:1
  `readable` rule). `look.js` loads in `<head>` so a saved choice applies before the page draws; `styles.css` has Dark
  and Light defaults for when scripts are off.
- Device drawings are inline SVG coloured by classes (`frame`, `screen`, `tile`, `video`, `bar`, `track` over video,
  `track-ui` on menu screens, `accent-fill`), so they follow the picked theme. There are no screenshots yet.
- Text must match what the apps do: check the app's README before describing a feature.

## Checking

`python -m http.server 8765 --directory public`, then headless Edge (`msedge --headless=new --screenshot`). Headless
Edge won't go narrower than about 500 px: to see phone width, screenshot a local page that holds the site in a
390 px iframe. `--blink-settings=preferredColorScheme=1` shows the Light default.

## Style

Plain, short sentences that explain why, as in the apps' READMEs. British spelling of "licence" and "colour".
