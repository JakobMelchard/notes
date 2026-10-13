import test from "node:test"
import assert from "node:assert/strict"
import { ago, decks, merge, pick, Progress, title } from "./review"

const t0 = Date.UTC(2026, 9, 2, 9)
const HOUR = 3_600_000
const DAY = 24 * HOUR

test("replay and queue", () => {
  const cards = [
    { id: "a", path: "" },
    { id: "b", path: "" },
    { id: "c", path: "" },
  ]
  const p = new Progress()
  assert.deepEqual([p.queue(cards, t0, 2).due.length, p.queue(cards, t0, 2).fresh.length], [0, 2])
  p.apply({ id: "a", rating: 3, at: t0 })
  // one new card started today leaves room for one more under a limit of 2
  assert.deepEqual(
    p.queue(cards, t0, 2).fresh.map((c) => c.id),
    ["b"],
  )
  const r = new Progress([{ id: "a", rating: 3, at: t0 }])
  assert.deepEqual(r.card("a"), p.card("a"))
  assert.deepEqual(
    r.queue(cards, r.card("a").due, 2).due.map((c) => c.id),
    ["a"],
  )
})

test("merge drops reviews present in both", () => {
  const e = (id: string, at: number) => ({ id, rating: 3 as const, at })
  assert.deepEqual(merge([e("a", 2), e("b", 1)], [e("a", 2), e("c", 3)]), [
    e("b", 1),
    e("a", 2),
    e("c", 3),
  ])
})

test("ago", () => {
  const want: [number, string][] = [
    [10_000, "1m"],
    [25 * 60_000, "25m"],
    [3 * HOUR, "3h"],
    [5 * DAY, "5d"],
    [90 * DAY, "3.0mo"],
    [59 * DAY + 1, "59d"],
    [60 * DAY, "2.0mo"],
  ]
  for (const [ms, s] of want) assert.equal(ago(ms), s)
})

test("title", () => {
  const want: Record<string, string> = {
    "introduction-to-cryptography": "Introduction to cryptography",
    "01-historical-ciphers.md": "01 Historical ciphers",
    stats: "Stats",
    "2024_ss": "2024 Ss",
    ünits: "Ünits",
    "research-topics-in-ml": "Research topics in ML",
    "asc-school-ii-hpc": "ASC school II HPC",
  }
  for (const [slug, s] of Object.entries(want)) assert.equal(title(slug), s)
})

test("decks", () => {
  const cards = [
    { id: "a", path: "courses/intro-crypto/notes/01-ciphers.md" },
    { id: "b", path: "courses/intro-crypto/notes/01-ciphers.md" },
    { id: "c", path: "courses/intro-crypto/notes/02-otp.md" },
    { id: "d", path: "courses/ml/notes/01-pac.md" },
    { id: "e", path: "index.md" },
  ]
  const p = new Progress([{ id: "a", rating: 1, at: t0 - HOUR }])
  const secs = decks(p, cards, t0, 20)
  assert.deepEqual(
    secs.map((s) => [s.in, s.label, s.cards, s.due, s.new]),
    [
      ["", "All", 5, 1, 4],
      ["courses/intro-crypto/", "Intro crypto", 3, 1, 2],
      ["courses/ml/", "ML", 1, 0, 1],
    ],
  )
  assert.deepEqual(
    secs.flatMap((s) => s.notes.map((n) => [n.in, n.label, n.cards, n.due, n.new])),
    [
      ["index.md", "Index", 1, 0, 1],
      ["courses/intro-crypto/notes/01-ciphers.md", "01 Ciphers", 2, 1, 1],
      ["courses/intro-crypto/notes/02-otp.md", "02 Otp", 1, 0, 1],
      ["courses/ml/notes/01-pac.md", "01 Pac", 1, 0, 1],
    ],
  )
  assert.equal(pick(secs, "courses/ml/"), secs[2])
  assert.equal(pick(secs, ""), secs[0])
  // a saved course that no longer has cards falls back to All
  assert.equal(pick(secs, "courses/gone/"), secs[0])
})
