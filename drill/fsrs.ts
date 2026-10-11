export type Rating = 1 | 2 | 3 | 4
export enum State {
  New,
  Learning,
  Review,
  Relearning,
}

// Times are epoch milliseconds; due and lastReview are 0 for a card never reviewed.
export type Card = {
  due: number
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  reps: number
  lapses: number
  state: State
  lastReview: number
}

export const newCard = (): Card => ({
  due: 0,
  stability: 0,
  difficulty: 0,
  elapsedDays: 0,
  scheduledDays: 0,
  reps: 0,
  lapses: 0,
  state: State.New,
  lastReview: 0,
})

const MIN = 60_000
const DAY = 86_400_000

// FSRS with the default parameters, short-term scheduling and no fuzz, so a replay of the
// same reviews always gives the same schedule.
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
  1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
]
const RETENTION = 0.9
const MAX_INTERVAL = 36500
const DECAY = -0.5
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1

const forgettingCurve = (days: number, s: number) => Math.pow(1 + (FACTOR * days) / s, DECAY)
const clampD = (d: number) => Math.min(Math.max(d, 1), 10)
const initStability = (r: Rating) => Math.max(W[r - 1], 0.1)
const initDifficulty = (r: Rating) => clampD(W[4] - Math.exp(W[5] * (r - 1)) + 1)

const interval = (s: number) =>
  Math.max(
    Math.min(Math.round((s / FACTOR) * (Math.pow(RETENTION, 1 / DECAY) - 1)), MAX_INTERVAL),
    1,
  )

const nextDifficulty = (d: number, r: Rating) => {
  const next = d + ((10 - d) * (-W[6] * (r - 3))) / 9
  return clampD(W[7] * initDifficulty(4) + (1 - W[7]) * next)
}
const shortTermStability = (s: number, r: Rating) => s * Math.exp(W[17] * (r - 3 + W[18]))
const recallStability = (d: number, s: number, r: number, rating: Rating) =>
  s *
  (1 +
    Math.exp(W[8]) *
      (11 - d) *
      Math.pow(s, -W[9]) *
      (Math.exp((1 - r) * W[10]) - 1) *
      (rating === 2 ? W[15] : 1) *
      (rating === 4 ? W[16] : 1))
const forgetStability = (d: number, s: number, r: number) =>
  W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp((1 - r) * W[14])

export function next(last: Card, now: number, rating: Rating): Card {
  const elapsed =
    last.state !== State.New && last.lastReview ? Math.floor((now - last.lastReview) / DAY) : 0
  const c: Card = { ...last, lastReview: now, elapsedDays: elapsed, reps: last.reps + 1 }
  const days = (n: number) => {
    c.scheduledDays = n
    c.due = now + n * DAY
  }
  const minutes = (n: number) => {
    c.scheduledDays = 0
    c.due = now + n * MIN
  }

  if (last.state === State.New) {
    c.difficulty = initDifficulty(rating)
    c.stability = initStability(rating)
    if (rating === 4) {
      days(interval(c.stability))
      c.state = State.Review
    } else {
      minutes([0, 1, 5, 10][rating])
      c.state = State.Learning
    }
  } else if (last.state === State.Review) {
    const r = forgettingCurve(elapsed, last.stability)
    c.difficulty = nextDifficulty(last.difficulty, rating)
    c.stability =
      rating === 1
        ? Math.min(
            last.stability / Math.exp(W[17] * W[18]),
            forgetStability(last.difficulty, last.stability, r),
          )
        : recallStability(last.difficulty, last.stability, r, rating)
    if (rating === 1) {
      minutes(5)
      c.state = State.Relearning
      c.lapses++
    } else {
      // the hard, good and easy intervals are kept at least a day apart
      const at = (k: Rating) => interval(recallStability(last.difficulty, last.stability, r, k))
      const hard = Math.min(at(2), at(3))
      const good = Math.max(at(3), hard + 1)
      days(rating === 2 ? hard : rating === 3 ? good : Math.max(at(4), good + 1))
      c.state = State.Review
    }
  } else {
    c.difficulty = nextDifficulty(last.difficulty, rating)
    c.stability = shortTermStability(last.stability, rating)
    if (rating === 1) minutes(5)
    else if (rating === 2) minutes(10)
    else {
      const good = interval(shortTermStability(last.stability, 3))
      days(rating === 3 ? interval(c.stability) : Math.max(interval(c.stability), good + 1))
      c.state = State.Review
    }
  }
  return c
}
