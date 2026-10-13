# TU Wien study wiki

Study notes, source registers, TISS transcriptions and tested reference code for
TU Wien master courses (Computational Science and Engineering, Quantum
Information Science and Technology), built from public sources only.

Read it at https://docs.melchard.org/tu/.

Each course lives in `content/courses/<slug>/` with `notes/`, `refs/`, `docs/`
and `src/`. `refs/` and `src/` live here; the Markdown (`index.md`, `notes/`, `docs/`) lives in
[JakobMelchard/notes](https://github.com/JakobMelchard/notes), which is published from the
author's notes vault, and `scripts/notes.sh` copies it into `content/`. Edit notes there, not
here. The site is built with [Quartz](https://quartz.jzhao.xyz/):

    npm ci
    scripts/notes.sh
    npx quartz build --serve

| path     | what                                                               |
| -------- | ------------------------------------------------------------------ |
| `drill/` | flashcard review of the `card` blocks in the notes, in the browser |

    npm run drill

writes it to `public/drill/`, served at https://docs.melchard.org/tu/drill/.

Contributions are welcome, by people and their LLM agents: see
[CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).

Licence: prose CC BY-SA 4.0, code MIT, see [LICENSE.md](LICENSE.md).
