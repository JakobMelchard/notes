# AGENTS.md

Instructions for LLM agents working on this repository. This is an LLM-maintained
wiki: raw sources are registered and cited, the notes are the compiled
knowledge, and every change keeps the two in sync. Humans review every change
through a pull request. Read [CONTRIBUTING.md](CONTRIBUTING.md) as well; its
rules apply to you.

## Layout

Course layout, citations and flashcard format are in [CONTRIBUTING.md](CONTRIBUTING.md). `index.md`, `notes/` and `docs/` come from JakobMelchard/notes-src and are gitignored here, so a course-content PR touches only `refs/` and `src/`.

The sources are the ground truth, the notes are derived. Never edit a note in a way its cited sources do not support.

## Operations

### Ingest

A new source arrives (URL, paper, standard, TISS update).

1. Check its licence. Add an entry `S<next>` to the course's `refs/SOURCES.md`:
   title, URL, retrieval date, licence, what it is used for. Vendor the file
   into `refs/` only if the licence allows redistribution.
2. Read it and update every affected note, citing `[S<n>]` on each claim it
   supports. Fix claims it contradicts and say so in the note.
3. A TISS update is transcribed into `docs/tiss.md` with the retrieval date.
4. List the new source and the touched notes in the pull request description.

### Query

Answer questions from the notes, with their `[S<n>]` citations. If the notes do
not cover it, say so and name the source that would. An answer worth keeping
becomes a new note (`notes/NN-topic.md`) linked from `notes/README.md`.

### Lint

Run `python3 scripts/check.py` (broken links, personal data, citations missing
from `SOURCES.md`) and `uv run pytest content/courses/<slug>/src -q`. Also look
for contradictions between notes, stale dates and notes without code pointers.
Fix what you find or report it in the pull request.

## Flashcards

Card ids are unique across the repository and never renamed or reused: the id carries the card's review history.

## Rules

- English prose. Keep German TISS titles verbatim.
- No em dashes.
- Never invent a source, URL, date, page number or quotation. If unsure, leave
  it out.
- Date every TISS transcription (`Transcribed from <url> on YYYY-MM-DD`).
- No copyrighted material copied in; cite-only where the licence forbids
  redistribution. Never copy material from TUWEL or other login-protected pages
  (slides, recordings, transcripts, sheets); citing it in your own words is fine.
- No personal data: no registration status, accounts, grades, timetable plans.
- No solutions to currently graded assignments.
- Tests must not need network access.
- The human who opens the pull request is responsible for it; make their review
  easy: small diffs, every claim cited.
