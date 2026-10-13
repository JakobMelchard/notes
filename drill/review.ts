import { Card as FsrsCard, newCard, next, Rating } from "./fsrs"

export type Entry = { id: string; rating: Rating; at: number }
export type Item = { id: string; path: string }

// The review log is the only state. Scheduling is replayed from it, so a card keeps its
// history while its text changes.
export class Progress {
  state = new Map<string, FsrsCard>()
  first = new Map<string, number>() // first review per card, for the daily new-card limit

  constructor(log: Entry[] = []) {
    for (const e of log) this.apply(e)
  }

  apply(e: Entry) {
    if (!this.state.has(e.id)) this.first.set(e.id, e.at)
    this.state.set(e.id, next(this.card(e.id), e.at, e.rating))
  }

  card(id: string): FsrsCard {
    return this.state.get(id) ?? newCard()
  }

  // Due reviews by due date, then new cards in order, up to the daily limit minus the new
  // cards already started today.
  queue<T extends Item>(cards: T[], now: number, newPerDay: number): { due: T[]; fresh: T[] } {
    const today = new Date(now).setHours(0, 0, 0, 0)
    let started = 0
    for (const t of this.first.values()) if (t >= today) started++
    const due: T[] = []
    const fresh: T[] = []
    for (const c of cards) {
      const st = this.state.get(c.id)
      if (!st) {
        if (started + fresh.length < newPerDay) fresh.push(c)
      } else if (st.due <= now) due.push(c)
    }
    due.sort((a, b) => this.card(a.id).due - this.card(b.id).due)
    return { due, fresh }
  }
}

export const isEntry = (e: any): e is Entry =>
  typeof e?.id === "string" && Number.isFinite(e.at) && [1, 2, 3, 4].includes(e.rating)

// Merges two logs, dropping reviews present in both.
export function merge(a: Entry[], b: Entry[]): Entry[] {
  const key = (e: Entry) => `${e.id}\n${e.at}\n${e.rating}`
  const all = new Map([...a, ...b].map((e) => [key(e), e]))
  return [...all.values()].sort((x, y) => x.at - y.at)
}

const HOUR = 3_600_000
const DAY = 24 * HOUR

// Compact interval for a rating button: 5m, 3h, 12d, 2.5mo.
export function ago(ms: number): string {
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / 60_000))}m`
  if (ms < DAY) return `${Math.round(ms / HOUR)}h`
  if (ms < 60 * DAY) return `${Math.round(ms / DAY)}d`
  return `${(ms / DAY / 30).toFixed(1)}mo`
}

const ACRONYMS = new Set(["ml", "ai", "hpc", "asc", "sql", "i", "ii", "iii"])

// "01-historical-ciphers.md" -> "01 Historical ciphers"
export function title(slug: string): string {
  const w = slug
    .replace(/\.md$/, "")
    .split(/[-_]/)
    .filter(Boolean)
    .map((s) => (ACRONYMS.has(s) ? s.toUpperCase() : s))
  const i = w.findIndex((s) => !/^\p{Nd}/u.test(s))
  if (i >= 0) w[i] = w[i][0].toUpperCase() + w[i].slice(1)
  return w.join(" ")
}

export type Deck = { in: string; label: string; cards: number; due: number; new: number }
export type Section = Deck & { notes: Deck[] }

// "courses/<course>/notes/<note>.md" belongs to the course deck courses/<course>/
const course = (path: string) =>
  path.split("/").length > 2 ? path.split("/").slice(0, 2).join("/") + "/" : ""

// All first, then one section per course, each with its notes. Every row carries its due
// and new counts.
export function decks(p: Progress, cards: Item[], now: number, newPerDay: number): Section[] {
  const row = (prefix: string, label: string): Deck => {
    const inDeck = cards.filter((c) => c.path.startsWith(prefix))
    const { due, fresh } = p.queue(inDeck, now, newPerDay)
    return { in: prefix, label, cards: inDeck.length, due: due.length, new: fresh.length }
  }
  const secs: Section[] = [{ ...row("", "All"), notes: [] }]
  const at = new Map<string, Section>([["", secs[0]]])
  const seen = new Set<string>()
  for (const c of cards) {
    if (seen.has(c.path)) continue
    seen.add(c.path)
    const key = course(c.path)
    let sec = at.get(key)
    if (!sec) {
      sec = { ...row(key, title(key.split("/")[1])), notes: [] }
      at.set(key, sec)
      secs.push(sec)
    }
    sec.notes.push(row(c.path, title(c.path.split("/").pop()!)))
  }
  return secs
}

// The section picked in the course dropdown, or All when the saved course is gone.
export const pick = (secs: Section[], want: string): Section =>
  secs.find((s) => s.in === want) ?? secs[0]
