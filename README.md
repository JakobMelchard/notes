# Public study wiki

Study notes, source registers and tested reference code for TU Wien master courses,
built from public sources only. Read it at <https://docs.melchard.org/notes/>.

Canonical repository: <https://codeberg.org/lilfeelz/notes>. This repository serves the
GitHub Pages build; site code and source registers are reviewed there.

## Preview

```sh
npm ci
scripts/notes.sh              # fetch the public content branch
npx quartz build --serve      # http://localhost:8080
```

## Checks

```sh
python3 scripts/check.py      # links, privacy, citations
npm test
uv sync
uv run pytest content/courses/<slug>/src -q
```

## Layout

| Path | Contents |
|---|---|
| `content/courses/<slug>/refs/`, `src/` | source register, vendored files, reference code |
| `content/courses/<slug>/index.md`, `notes/`, `docs/` | published course prose, generated into the content branch |
| `drill/` | flashcard review of the `card` blocks in the notes |
| `templates/course/` | skeleton for a new course |
| `scripts/` | `notes.sh`, `check.py` |

## Contributing

Corrections, new sources and new courses are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).
Prose corrections are applied upstream and published in the next build.

Licence: prose CC BY-SA 4.0, code MIT, see [LICENSE.md](LICENSE.md).
