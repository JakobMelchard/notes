import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"

// A card is a fenced block in a Markdown file:
//
//   ```card id=tfml-hoeffding-1
//   front
//   ---
//   back
//   ```
export type Card = { id: string; front: string; back: string; path: string; line: number }

const OPEN = /^(`{3,}|~{3,})card(?:\s(.*))?$/
const ID = /(?:^|\s)id=([A-Za-z0-9._-]+)/

// Returns the cards of one file and a message for every malformed block.
export function parse(path: string, text: string): { cards: Card[]; errs: string[] } {
  const lines = text.split("\n")
  const cards: Card[] = []
  const errs: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const m = OPEN.exec(lines[i].trimEnd())
    if (!m) continue
    const fence = m[1]
    const start = i
    const body: string[] = []
    for (i++; i < lines.length; i++) {
      const l = lines[i].trimEnd()
      if (l.length >= fence.length && l.split(fence[0]).join("") === "") break
      body.push(lines[i])
    }
    const at = `${path}:${start + 1}`
    const id = ID.exec(m[2] ?? "")
    const sep = body.findIndex((l) => l.trim() === "---")
    if (i === lines.length) errs.push(`${at}: unclosed card fence`)
    else if (!id) errs.push(`${at}: card without id=`)
    else if (sep < 0) errs.push(`${at}: card without --- between front and back`)
    else {
      const front = body.slice(0, sep).join("\n").trim()
      const back = body
        .slice(sep + 1)
        .join("\n")
        .trim()
      cards.push({ id: id[1], front, back, path, line: start + 1 })
    }
  }
  return { cards, errs }
}

function* markdown(dir: string): Generator<string> {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : 1,
  )
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (!e.name.startsWith(".") && e.name !== "node_modules") yield* markdown(p)
    } else if (e.name.endsWith(".md")) yield p
  }
}

// Collects the cards of every .md file under root. A card whose id was already seen is
// reported and dropped.
export function scan(root: string): { cards: Card[]; errs: string[] } {
  const cards: Card[] = []
  const errs: string[] = []
  const seen = new Map<string, string>()
  for (const p of markdown(root)) {
    const r = parse(relative(root, p), readFileSync(p, "utf8"))
    errs.push(...r.errs)
    for (const c of r.cards) {
      const at = `${c.path}:${c.line}`
      const prev = seen.get(c.id)
      if (prev) errs.push(`${at}: duplicate id ${c.id} (first at ${prev})`)
      else {
        seen.set(c.id, at)
        cards.push(c)
      }
    }
  }
  return { cards, errs }
}
