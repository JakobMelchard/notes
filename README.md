# TU Wien study wiki

Study notes, source registers, TISS transcriptions and tested reference code for TU Wien master courses (CSE, QIST), built from public sources only. Read it at https://docs.melchard.org/notes/.

```sh
npm ci
scripts/notes.sh              # copy the notes in from JakobMelchard/notes-src
npx quartz build --serve      # preview at http://localhost:8080
npm run drill                 # flashcard page into public/drill/, after quartz build
python3 scripts/check.py      # links, privacy, citations
npm test
uv sync
uv run pytest content/courses/<slug>/src -q
```

| Path                                                 | Contents                                                                                                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/courses/<slug>/refs/`, `src/`               | source register, vendored files, reference code                                                                                                                            |
| `content/courses/<slug>/index.md`, `notes/`, `docs/` | from [JakobMelchard/notes-src](https://github.com/JakobMelchard/notes-src), which the maintainer's vault publishes to; gitignored here; report changes to them as an issue |
| `drill/`                                             | flashcard review of the `card` blocks in the notes                                                                                                                         |
| `templates/course/`                                  | skeleton for a new course                                                                                                                                                  |
| `scripts/`                                           | `notes.sh`, `check.py`                                                                                                                                                     |

Contributing: [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md). Licence: prose CC BY-SA 4.0, code MIT, see [LICENSE.md](LICENSE.md).
