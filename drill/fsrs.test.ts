import test from "node:test"
import assert from "node:assert/strict"
import { newCard, next, Rating } from "./fsrs"
import vectors from "./vectors.json"

// vectors.json holds the card after each review of a sequence, from the Go library the
// first version of drill used (go-fsrs v3.3.1, default parameters, fuzz off).
for (const seq of vectors) {
  test(`schedule: ${seq.name}`, () => {
    let card = newCard()
    for (const [i, s] of seq.steps.entries()) {
      card = next(card, s.at, s.rating as Rating)
      const at = `step ${i + 1}`
      assert.equal(card.due, s.due, at)
      assert.equal(card.state, s.state, at)
      assert.equal(card.reps, s.reps, at)
      assert.equal(card.lapses, s.lapses, at)
      assert.ok(Math.abs(card.stability - s.stability) < 1e-9, at)
      assert.ok(Math.abs(card.difficulty - s.difficulty) < 1e-9, at)
    }
  })
}
