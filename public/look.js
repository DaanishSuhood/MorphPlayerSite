// The page's colours: MorphPlayer's own themes and accent colours (desktop Themes.cs, MorphPlayerTV and
// MorphPlayerMobile's Themes.kt), with the same 3:1 rule for an accent that would be hard to see. Loaded in <head>,
// so a theme picked on an earlier visit is in place before the page draws.
(function () {
  var themes = [
    // id, name, dark, screen, raised, text, textDim
    ["dark", "Dark", true, 0x101010, 0x262626, 0xE6E6E6, 0x9A9A9A],
    ["black", "Black", true, 0x000000, 0x171717, 0xE0E0E0, 0x8C8C8C],
    ["midnight", "Midnight", true, 0x0A1020, 0x1A2540, 0xE2E8F4, 0x8B98B8],
    ["forest", "Forest", true, 0x09130D, 0x1A2B20, 0xE2EDE5, 0x8AA394],
    ["plum", "Plum", true, 0x130B19, 0x291A35, 0xEDE4F2, 0xA391B0],
    ["light", "Light", false, 0xF3F3F3, 0xFFFFFF, 0x1A1A1A, 0x5C5C5C],
  ].map(function (t) {
    return { id: t[0], name: t[1], dark: t[2], screen: t[3], raised: t[4], text: t[5], dim: t[6] };
  });
  var accents = [
    ["Orange", "#FF8800"], ["Red", "#E5484D"], ["Pink", "#E8508F"], ["Purple", "#9B6CF0"],
    ["Blue", "#3B9DFF"], ["Teal", "#1DB8A6"], ["Green", "#3FBF5F"], ["Gold", "#E6B422"],
  ];

  function luminance(rgb) {
    function linear(c) { var s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }
    return 0.2126 * linear(rgb >> 16 & 255) + 0.7152 * linear(rgb >> 8 & 255) + 0.0722 * linear(rgb & 255);
  }
  function contrast(a, b) {
    var la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function mix(from, to, t) {
    function ch(s) { var a = from >> s & 255, b = to >> s & 255; return Math.round(a + (b - a) * t) << s; }
    return ch(16) | ch(8) | ch(0);
  }
  // The accent, moved toward white or black only as far as it takes to stand out from every background given.
  function readable(accent, backgrounds) {
    var toward = luminance(backgrounds[0]) < 0.5 ? 0xFFFFFF : 0x000000;
    var color = accent;
    for (var step = 1; step <= 20 && backgrounds.some(function (b) { return contrast(color, b) < 3; }); step++) {
      color = mix(accent, toward, step / 20);
    }
    return color;
  }
  function hex(rgb) { return "#" + (rgb & 0xFFFFFF).toString(16).padStart(6, "0"); }
  function rgba(rgb, alpha) { return "rgba(" + (rgb >> 16 & 255) + "," + (rgb >> 8 & 255) + "," + (rgb & 255) + "," + alpha + ")"; }

  var systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  /** The choice in force: a theme id or "system", and an accent hex. */
  var look = { theme: "system", accent: "#FF8800" };
  try {
    var saved = JSON.parse(localStorage.getItem("look") || "null");
    if (saved && typeof saved.theme === "string" && typeof saved.accent === "string") look = saved;
  } catch (e) { /* Private browsing or storage off: the defaults do. */ }

  function themeFor(id) {
    if (id === "system") id = systemDark && !systemDark.matches ? "light" : "dark";
    return themes.filter(function (t) { return t.id === id; })[0] || themes[0];
  }

  function apply() {
    var t = themeFor(look.theme);
    var chosen = parseInt(look.accent.slice(1), 16);
    if (isNaN(chosen)) chosen = 0xFF8800;
    var alt = mix(t.screen, t.raised, 0.45);
    var accent = readable(chosen, [t.screen, t.raised, alt]);
    var ink = t.dark ? 0xFFFFFF : 0x000000;
    var s = document.documentElement.style;
    s.setProperty("--bg", hex(t.screen));
    s.setProperty("--alt", hex(alt));
    s.setProperty("--raised", hex(t.raised));
    s.setProperty("--fg", hex(t.text));
    s.setProperty("--dim", hex(t.dim));
    s.setProperty("--line", rgba(ink, t.dark ? 0.14 : 0.16));
    s.setProperty("--frame", hex(t.dark ? mix(t.raised, 0xFFFFFF, 0.12) : 0x2A2A2A));
    s.setProperty("--accent", hex(accent));
    s.setProperty("--on-accent", contrast(accent, 0) >= contrast(accent, 0xFFFFFF) ? "#000" : "#fff");
    document.documentElement.style.colorScheme = t.dark ? "dark" : "light";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", hex(t.screen));
  }

  function set(theme, accent) {
    if (theme) look.theme = theme;
    if (accent) look.accent = accent;
    try { localStorage.setItem("look", JSON.stringify(look)); } catch (e) {}
    apply();
  }

  if (systemDark && systemDark.addEventListener) {
    systemDark.addEventListener("change", function () { if (look.theme === "system") apply(); });
  }
  apply();

  window.MorphLook = { themes: themes, accents: accents, current: function () { return look; }, set: set, hex: hex };
})();
