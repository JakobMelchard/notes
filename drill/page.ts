import { next, Rating } from "./fsrs"
import { ago, decks, Deck, Entry, isEntry, merge, pick, Progress } from "./review"

type Card = { id: string; front: string; back: string; path: string; line: number }

const NEW_PER_DAY = 20
const KEY = "drill-log"
const COURSE = "drill-course"
const LABELS = ["Again", "Hard", "Good", "Easy"]

const load = (): Entry[] => {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "[]")
    return Array.isArray(d) ? d.filter(isEntry) : []
  } catch {
    return []
  }
}
// Without storage (private mode) progress lasts until the page closes; export keeps it.
const save = (log: Entry[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(log))
  } catch {}
}

// Another tab may have saved since this page loaded, so fold its reviews in before saving.
const add = (more: Entry[]) => {
  log = merge(merge(load(), log), more)
  save(log)
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)
const counts = (d: Deck) =>
  `<span class="counts" title="${d.due} due, ${d.new} new"><span class="pill due${d.due ? "" : " zero"}">${d.due}</span><span class="pill new${d.new ? "" : " zero"}">${d.new}</span></span>`

let cards: Card[] = []
let log: Entry[] = load()
let want = ""
try {
  want = localStorage.getItem(COURSE) ?? ""
} catch {}
// Another tab picked a course: use it on the next render.
addEventListener("storage", (e) => {
  if (e.key === COURSE) want = e.newValue ?? ""
})

function list() {
  const p = new Progress(log)
  const row = (d: Deck, head = false) =>
    `<a class="deck${head ? " head" : ""}${d.due || d.new ? "" : " empty"}" href="#in=${encodeURIComponent(d.in)}"><span class="name">${esc(d.label)}</span>${counts(d)}</a>`
  const secs = decks(p, cards, Date.now(), NEW_PER_DAY)
  const sec = pick(secs, want)
  // All lists the courses, a course lists its notes.
  const rows = sec.in ? sec.notes : [...secs.slice(1), ...sec.notes]
  const opts = secs
    .map(
      (s) =>
        `<option value="${esc(s.in)}"${s === sec ? " selected" : ""}>${s.in ? esc(s.label) : "All courses"} (${s.cards})</option>`,
    )
    .join("")
  document.body.innerHTML = `<main class="decks"><header><h1>Decks</h1><span class="counts legend"><span class="pill due">due</span><span class="pill new">new</span></span></header><select id="course" aria-label="Course">${opts}</select><section>${row(sec, true)}${rows.map((n) => row(n)).join("")}</section><footer><button id="export">Export progress</button><label class="btn">Import progress<input id="import" type="file" accept="application/json" hidden></label></footer></main>`
  // A deck opened from here gets its own entry, so Android back returns to this list.
  document.querySelector("section")!.onclick = (e) => {
    const a = (e.target as Element).closest("a")
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    history.pushState("deck", "", a.href)
    route()
  }
  const select = document.getElementById("course") as HTMLSelectElement
  select.onchange = () => {
    want = select.value
    try {
      localStorage.setItem(COURSE, want)
    } catch {}
    list()
    document.getElementById("course")!.focus()
  }
  document.getElementById("export")!.onclick = () => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([JSON.stringify(log)], { type: "application/json" }))
    a.download = "drill-progress.json"
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const input = document.getElementById("import") as HTMLInputElement
  input.onchange = async () => {
    try {
      const d = JSON.parse(await input.files![0].text())
      if (!Array.isArray(d) || !d.every(isEntry)) throw new Error("invalid progress file")
      add(d)
    } catch {
      alert("Not a drill progress file.")
    }
    list()
  }
}

// Back to the list by going back when the deck came from it, so the history does not fill
// with decks that Android back then walks through.
const up = () =>
  document.querySelectorAll<HTMLAnchorElement>('a[href="#"]').forEach(
    (a) =>
      (a.onclick = (e) => {
        if (history.state !== "deck" || !a.hasAttribute("href")) return
        e.preventDefault()
        history.back()
        // a second tap before the list shows would go back past it
        a.removeAttribute("href")
      }),
  )

function review(prefix: string) {
  const now = Date.now()
  const p = new Progress(log)
  const inDeck = cards.filter((c) => c.path.startsWith(prefix))
  const { due, fresh } = p.queue(inDeck, now, NEW_PER_DAY)
  const top = `<header class="top"><a class="home" href="#" aria-label="Decks">‹<span>Decks</span></a><span class="name">${esc(prefix || "All")}</span>${counts({ in: prefix, label: "", cards: inDeck.length, due: due.length, new: fresh.length })}</header>`
  const c = [...due, ...fresh][0]
  if (!c) {
    document.body.innerHTML = `${top}<main class="review"><div class="done"><p class="big">Nothing due</p><p>This deck is done for now.</p><a class="btn" href="#">Back to decks</a></div></main>`
    up()
    return
  }
  const buttons = [1, 2, 3, 4]
    .map((r) => {
      const t = ago(next(p.card(c.id), now, r as Rating).due - now)
      return `<button class="r${r}" value="${r}"><span>${LABELS[r - 1]}</span><small>${t}</small></button>`
    })
    .join("")
  document.body.innerHTML = `${top}<main class="review"><article class="card" id="card"><div class="front">${c.front}</div><details id="ans"><summary class="bar"><span>Show answer</span></summary><div class="back">${c.back}</div></details><p class="src">${esc(c.path)}:${c.line}</p></article><div class="rate bar">${buttons}</div></main>`
  up()
  const ans = document.getElementById("ans") as HTMLDetailsElement
  document.getElementById("card")!.onclick = (e) => {
    if (!ans.open && !(e.target as Element).closest("a, summary") && !getSelection()?.toString())
      ans.open = true
  }
  document.querySelectorAll<HTMLButtonElement>(".rate button").forEach((b) => {
    b.onclick = () => {
      add([{ id: c.id, rating: Number(b.value) as Rating, at: Date.now() }])
      review(prefix)
    }
  })
}

const hashPrefix = () => {
  try {
    return location.hash.startsWith("#in=") ? decodeURIComponent(location.hash.slice(4)) : null
  } catch {
    return null
  }
}
const route = () => {
  const p = hashPrefix()
  if (p === null) list()
  else review(p)
}
addEventListener("hashchange", route)
// space shows the answer, 1 to 4 rate
addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const ans = document.getElementById("ans") as HTMLDetailsElement | null
  if (!ans) return
  if (e.key === " " && !ans.open) {
    e.preventDefault()
    ans.open = true
  } else if (ans.open && "1234".includes(e.key))
    document.querySelector<HTMLButtonElement>(`.rate button[value="${e.key}"]`)?.click()
})
navigator.serviceWorker?.register("sw.js").catch(() => {})
fetch("cards.json")
  .then((r) => r.json())
  .then((c: Card[]) => {
    cards = c
    route()
  })
  .catch(() => {
    document.body.textContent = "Could not load the cards."
  })
