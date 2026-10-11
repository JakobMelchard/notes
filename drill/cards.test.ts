import test from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parse, scan } from "./cards"

test("parse", () => {
  const text = [
    "# note",
    "```card id=a-1",
    "What is $x_1$?",
    "---",
    "The *first* $x$.",
    "```",
    "````card id=b",
    "front with ``` inside",
    "---",
    "back",
    "````",
    "```card",
    "no id",
    "---",
    "x",
    "```",
    "```card id=c",
    "no separator",
    "```",
    "```python",
    "not a card",
    "```",
  ].join("\n")
  const { cards, errs } = parse("n.md", text)
  assert.equal(cards.length, 2)
  assert.deepEqual(cards[0], {
    id: "a-1",
    front: "What is $x_1$?",
    back: "The *first* $x$.",
    path: "n.md",
    line: 2,
  })
  assert.equal(cards[1].id, "b")
  assert.equal(cards[1].front, "front with ``` inside")
  assert.equal(errs.length, 2)
  assert.match(errs[0], /n\.md:12: card without id/)
  assert.match(errs[1], /n\.md:17: card without ---/)
})

test("parse reports an unclosed fence", () => {
  assert.match(parse("n.md", "```card id=a\nq\n---\na").errs[0], /n\.md:1: unclosed card fence/)
})

test("scan drops a duplicate id", () => {
  const dir = mkdtempSync(join(tmpdir(), "drill-"))
  for (const n of ["a.md", "b.md"]) writeFileSync(join(dir, n), "```card id=x\nq\n---\na\n```\n")
  const { cards, errs } = scan(dir)
  assert.equal(cards.length, 1)
  assert.equal(errs.length, 1)
  assert.match(errs[0], /duplicate id x \(first at /)
})
