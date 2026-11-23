// The theme and accent pickers, and the download buttons, which point straight at each app's latest release.
(function () {
  // ---------- Theme and accent pickers ----------

  function swatch(label, colors, selected, onPick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.setAttribute("role", "radio");
    b.setAttribute("aria-checked", selected ? "true" : "false");
    b.setAttribute("aria-label", label);
    b.title = label;
    b.style.background = colors.length > 1
      ? "linear-gradient(135deg, " + colors[0] + " 50%, " + colors[1] + " 50%)"
      : colors[0];
    b.addEventListener("click", onPick);
    return b;
  }

  function drawPickers() {
    var look = MorphLook.current();
    var themeRow = document.getElementById("theme-picker");
    var accentRow = document.getElementById("accent-picker");
    if (!themeRow || !accentRow) return;
    themeRow.textContent = "";
    accentRow.textContent = "";
    themeRow.appendChild(swatch("Match system", ["#101010", "#F3F3F3"], look.theme === "system", function () {
      MorphLook.set("system"); drawPickers();
    }));
    MorphLook.themes.forEach(function (t) {
      themeRow.appendChild(swatch(t.name, [MorphLook.hex(t.screen), MorphLook.hex(t.raised)], look.theme === t.id, function () {
        MorphLook.set(t.id); drawPickers();
      }));
    });
    MorphLook.accents.forEach(function (a) {
      accentRow.appendChild(swatch(a[0], [a[1]], look.accent.toUpperCase() === a[1], function () {
        MorphLook.set(null, a[1]); drawPickers();
      }));
    });
  }

  // ---------- Download buttons ----------

  var OWNER = "DaanishSuhood";
  var CACHE_MS = 30 * 60 * 1000; // GitHub allows 60 unsigned requests an hour; one look per half hour is plenty.

  function latestRelease(repo) {
    var key = "release:" + repo;
    try {
      var cached = JSON.parse(sessionStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.at < CACHE_MS) return Promise.resolve(cached.release);
    } catch (e) {}
    return fetch("https://api.github.com/repos/" + OWNER + "/" + repo + "/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (json) {
        var release = {
          version: String(json.tag_name || "").replace(/^v/i, ""),
          date: json.published_at,
          url: json.html_url,
          assets: (json.assets || []).map(function (a) { return { name: a.name, url: a.browser_download_url, size: a.size }; }),
        };
        try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), release: release })); } catch (e) {}
        return release;
      });
  }

  function megabytes(bytes) { return Math.round(bytes / 1048576) + " MB"; }

  function fillCard(card) {
    var repo = card.getAttribute("data-repo");
    latestRelease(repo).then(function (release) {
      card.querySelectorAll("a[data-asset]").forEach(function (link) {
        var pattern = new RegExp(link.getAttribute("data-asset"), "i");
        var asset = release.assets.filter(function (a) { return pattern.test(a.name); })[0];
        if (!asset) return; // the release page it already points to will do
        link.href = asset.url;
        link.title = asset.name + " · " + megabytes(asset.size);
      });
      var line = card.querySelector(".release");
      if (line && release.version) {
        var when = release.date ? new Date(release.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "";
        line.textContent = "";
        var a = document.createElement("a");
        a.href = release.url;
        a.textContent = "Version " + release.version;
        line.appendChild(a);
        if (when) line.appendChild(document.createTextNode(" · " + when));
      }
    }).catch(function () {
      // Offline or rate-limited: the buttons keep pointing at the release page.
    });
  }

  document.querySelectorAll(".card[data-repo]").forEach(fillCard);
  drawPickers();
})();
