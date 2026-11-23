# MorphPlayerSite

The website for [MorphPlayer](https://github.com/DaanishSuhood/MorphPlayer) (Windows),
[MorphPlayerTV](https://github.com/DaanishSuhood/MorphPlayerTV) (Android TV) and
[MorphPlayerMobile](https://github.com/DaanishSuhood/MorphPlayerMobile) (Android phones and tablets): one static
page, hosted on Netlify at <https://morphplayer.netlify.app>. No build step, no frameworks, no web fonts, no analytics.

Last updated: 23 November 2026

---

## What's on it

| Section | Notes |
| --- | --- |
| Download cards | Each button looks up the app's latest GitHub release in the browser and links straight to its file (installer, portable zip or APK), with the version and date. Without scripts, or if GitHub can't be reached, the buttons open the release page instead |
| The same player everywhere | What the three apps share, with a theme and accent picker using the apps' own colours |
| Windows, Android TV, Phone | One section per app |
| Installing, Questions | Install steps for each platform, and common questions |

Nothing on the page needs updating for a new release. Edit the text when an app gains or loses a feature, and keep
it in step with that app's README.

## Files

| File | Purpose |
| --- | --- |
| `public/index.html` | The page, with its drawings of the three devices as inline SVG |
| `public/styles.css` | Layout and colours. Dark or Light by the system setting until a theme is picked |
| `public/look.js` | MorphPlayer's themes and accents (from the apps' `Themes`), applied before the page draws |
| `public/app.js` | The theme picker and the download buttons |
| `public/404.html` | The "not found" page |
| `public/favicon.svg`, `public/og.png` | The icon, and the picture shown when the link is shared |
| `tools/make_og.py` | Draws `og.png` (`python -I tools/make_og.py`, needs Pillow) |
| `netlify.toml` | Publishes `public/`; security headers, including a content security policy |

## Running it locally

```
python -m http.server 8000 --directory public
```

Then open <http://localhost:8000>.

## Hosting on Netlify

Either:

- **From GitHub** (updates itself on every push): in Netlify, **Add new site → Import an existing project**, pick
  this repository, and leave the build settings empty: `netlify.toml` says to publish `public/` with no build.
- **By hand**: drag the `public` folder onto <https://app.netlify.com/drop>. The headers in `netlify.toml` don't
  apply then.

The content security policy allows scripts, styles and images from the site itself, and connections only to
`api.github.com` (for the download buttons).

## Licence

MIT; see [LICENSE](LICENSE).
