/* Links of alteridemgames.com: where the short links /tg /yt /itch /dtf /reddit /demo lead, and the direct demo download.

   EDIT ONLY THE THREE LINES AND THE TABLE BELOW.
   - Steam page day: paste the store URL into STEAM. Every short link except /demo then leads to Steam, still with its
     utm_source (Steam's UTM report counts it). Nothing else has to change.
   - Direct demo download for Russia: paste the file link (Yandex Disk, later VK Play) into DEMO_DIRECT and the archive's
     SHA-256 into DEMO_SHA256. The link is used as is, without utm. Until DEMO_DIRECT is set, the pages hide every
     "download directly" link and /demo leads to the demo section of the Russian page. /demo never leads to Steam:
     the Steam demo may come weeks after the store page.
   - A new short link: add a row here and copy one of the folders (e.g. tg/) under the new name.

   Short-link pages load this script with data-go and are sent on at once. The main pages and the press kit load it
   with defer, only to show the direct-download links once DEMO_DIRECT is set. */

var STEAM = "";        // e.g. "https://store.steampowered.com/app/1234560/Before_She_Came_Home/"
var DEMO_DIRECT = "";  // e.g. "https://disk.yandex.ru/d/xxxxxxxx"
var DEMO_SHA256 = "";  // 64 hex characters: certutil -hashfile <zip> SHA256

var LINKS = {
  // name:  [ now (path on this site or a full URL),  after STEAM is set ]
  tg:     [ "ru/",                     STEAM ],                    // our Telegram channel (Russian)
  dtf:    [ "ru/",                     STEAM ],                    // the DTF devlog (Russian)
  yt:     [ "",                        STEAM ],                    // YouTube descriptions
  itch:   [ "",                        STEAM ],                    // the itch.io page
  reddit: [ "",                        STEAM ],                    // Reddit posts
  demo:   [ DEMO_DIRECT || "ru/#demo", DEMO_DIRECT || "ru/#demo" ] // "скачать демо напрямую" for Russia
};

(function () {
  var script = document.currentScript;

  if (script && script.hasAttribute("data-go")) {
    var parts = location.pathname.replace(/index\.html$/, "").split("/").filter(Boolean);
    var name = parts.length ? parts[parts.length - 1] : "";
    var link = LINKS[name] || ["", ""];
    var root = script.src.replace(/go\.js(\?.*)?$/, "");
    var url = new URL(link[1] || link[0], root);
    if (!DEMO_DIRECT || url.href !== new URL(DEMO_DIRECT, root).href) {
      new URLSearchParams(location.search).forEach(function (v, k) { url.searchParams.set(k, v); });
      if (name && !url.searchParams.has("utm_source")) url.searchParams.set("utm_source", name);
    }
    location.replace(url.href);
    return;
  }

  // Main pages: [data-direct] elements stay hidden until there is a direct link; then itch becomes the second button.
  if (!DEMO_DIRECT) return;
  function show() {
    document.querySelectorAll("[data-direct]").forEach(function (el) { el.hidden = false; });
    document.querySelectorAll("[data-itch-second]").forEach(function (el) { el.classList.add("ghost"); });
    if (DEMO_SHA256) document.querySelectorAll("[data-sha]").forEach(function (el) {
      el.textContent = DEMO_SHA256;
      el.parentNode.hidden = false;
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show();
})();
