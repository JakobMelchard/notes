// Serves the drill page offline. Network first, so a deploy shows up on the next load; the
// cache answers only when the network fails.
const CACHE = "drill"
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self))

sw.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(["./", "page.js", "style.css", "katex/katex.min.css", "cards.json"])),
  )
})

sw.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        // a 404 or 5xx (say mid-deploy) falls back to the cached copy too
        if (!r.ok) return caches.match(e.request).then((c) => c ?? r)
        const copy = r.clone()
        e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy)))
        return r
      })
      .catch(() => caches.match(e.request).then((r) => r ?? Response.error())),
  )
})
