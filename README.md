# Public study wiki

Study notes, source registers, TISS transcriptions and tested reference code for TU Wien master courses (CSE, QIST), built from public sources only. Read it at https://docs.melchard.org/notes/.

```sh
npm ci
scripts/notes.sh              # import the Codeberg content branch
npx quartz build --serve      # preview at http://localhost:8080
npm run drill                 # flashcard page into public/drill/, after quartz build
python3 scripts/check.py      # links, privacy, citations
npm test
uv sync
uv run pytest content/courses/<slug>/src -q
```

| Path                                                 | Contents                                                                                                                                                                                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/courses/<slug>/refs/`, `src/`               | source register, vendored files, reference code                                                                                                                                                                   |
| `content/courses/<slug>/index.md`, `notes/`, `docs/` | generated from the private authoring vault into this repository’s [content branch](https://codeberg.org/lilfeelz/notes/src/branch/content); gitignored in the site checkout; report prose corrections as an issue |
| `drill/`                                             | flashcard review of the `card` blocks in the notes                                                                                                                                                                |
| `templates/course/`                                  | skeleton for a new course                                                                                                                                                                                         |
| `scripts/`                                           | `notes.sh`, `check.py`                                                                                                                                                                                            |

Contributing: [CONTRIBUTING.md](CONTRIBUTING.md), [AGENTS.md](AGENTS.md). Licence: prose CC BY-SA 4.0, code MIT, see [LICENSE.md](LICENSE.md).

## Ownership and publishing

Canonical public repository: https://codeberg.org/lilfeelz/notes. The main branch owns the site, reference code and source registers. The content branch owns only the generated public prose tree; its editable source is public/tu in the maintainer’s private Forgejo notes-src vault. Private notebooks and course artifacts are never imported.

GitHub JakobMelchard/notes is retained as the Pages build bridge and to preserve existing reviews during migration. Its deployment workflow fetches site code from Codeberg main, so the GitHub checkout is not another editable source. The legacy GitHub notes-src repository is no longer the authoring source. Prose changes are exported to Codeberg and then request a Pages build; site-code changes follow review before the bridge is updated. Public course URL slugs remain stable.
