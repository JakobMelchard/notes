# refs — 191.030 Introduction to Networking

[`SOURCES.md`](SOURCES.md) is the register: one entry `S1 … S35`, each with
title, URL, retrieval date, licence/access status and what it was used for. The
notes cite it as `[S<n>]`.

## What is here

| file | what it is |
|---|---|
| [`SOURCES.md`](SOURCES.md) | the source register (authoritative) |
| [`standards-map.md`](standards-map.md) | RFC section → our note → our code, for all 52 vendored RFCs |
| [`cnp3-map.md`](cnp3-map.md) | lecture topic → CNP3 section, and what to read where the book is thin |
| `rfc/` | **52 RFCs, vendored**, plain text, 4.1 MB |
| `book/` | **the CNP3 ebook, vendored** [S35], 413 pages, 7.3 MB, CC BY-SA 3.0, with `SHA256SUMS` |
| [`rfc/SHA256SUMS`](rfc/SHA256SUMS) | checksums of all 52, so a changed file is visible |
| [`fetch-sources.sh`](fetch-sources.sh) | re-fetches and verifies the RFCs; pulls the three cite-only papers into the git-ignored `vendor/` |
| `vendor/` | created by the script, **git-ignored**, never committed |

## Why this course vendors its sources and the others do not

This is the one course in the repo whose primary sources are free to
redistribute, so they are in the tree rather than behind a download script.

- **Post-2008 RFCs** (4271, 5681, 5737, 5952, 6164, 6298, 6598, 6793, 6891,
  6928, 7217, 7323, 7761, 8106, 8200, 8305, 8482, 8981, 9293, 9413) carry the
  IETF Trust boilerplate and are subject to BCP 78 and the Trust's Legal
  Provisions. [TLP 5.0 §3.c.i][S32] grants an unlimited right to "copy, publish,
  display and distribute IETF Contributions and IETF Documents **in full and
  without modification**". These files are unmodified.
- **1998–2008 RFCs** (2328, 3022 and their contemporaries) carry the Internet
  Society "Full Copyright Statement": the document "may be copied and furnished
  to others … in whole or in part, without restriction of any kind, provided
  that the above copyright notice and this paragraph are included on all such
  copies", with the proviso that the document itself may not be modified. The
  vendored files include the notice and are byte-identical to the RFC Editor's.
- **1988–1998 RFCs** (1034, 1035, 1071, 1112, 1122, 1143, 1191, 1624, 1918,
  2236, 2464, 2827, 3021, 3168, 3376, 4033–4035, 4193, 4271, 4291, 4760, 4861,
  4862) say "Distribution of this memo is unlimited" in their Status of This
  Memo.
- **Pre-1988 RFCs** (761, 768, 791, 792, 826, 854, 855) carry no copyright
  statement at all; they are DARPA-era documents published without one.

TLP 5.0 §2.c is the reason for splitting the list: documents published before
25 March 2015 stay under the policy in force when they were published, which is
what the three older classes above record.

**The one vendored book.** `book/CNP3-2021.pdf` is Olivier Bonaventure's
*Computer Networking: Principles, Protocols and Practice*, 3rd edition
(UCLouvain), under **CC BY-SA 3.0** [S35]. That licence permits distributing
the unmodified work with attribution and a licence notice; share-alike attaches
to adaptations, and a verbatim copy carried next to independent notes is not
one. The file is byte-identical to the upstream release asset. It is here
because the course publishes slides for lecture 1 and 2 only and names no
textbook [S1], [S36], and because the two books lecture 1 did name as
background reading are not free in full. Peterson and Davie 6th edition is free
to read at <https://book.systemsapproach.org> but is not vendored: it covers
neither DNSSEC nor Telnet, so it is a per-topic fallback rather than a second
base text, and `cnp3-map.md` names the rows where it wins.

So: **everything in `rfc/` is redistributable in full, unmodified, and is
unmodified.** Nothing else is vendored — the papers in S26–S29 are under ACM or
IEEE copyright with no redistribution notice, IEEE 802.1Q/802.3 (S30) are behind
a registration wall, and the registry and measurement data (S18–S23) are live
services that would be stale the moment they were copied.

Verify the vendored set at any time:

```sh
cd refs                              # from the course folder
./fetch-sources.sh --verify          # checksums only, no network
./fetch-sources.sh                   # re-fetch anything missing, then verify
./fetch-sources.sh --papers          # + the cite-only PDFs into ./vendor (git-ignored)
(cd rfc && shasum -a 256 -c SHA256SUMS)   # the same check by hand
(cd book && shasum -a 256 -c SHA256SUMS)  # the vendored ebook
```

Last verified 2026-10-18: 52 of 52 RFCs and the ebook `OK`, offline
(`--verify` does no fetch).

## What sourcing this course could *not* establish

Read this before the exam-focus note (no longer published).

191.030 is **new in 2026W** [S1]. Tobias Fiebig took up the Computer Networks
chair at TU Wien on **1 March 2026** [S5] and 191.030 is his only lecture here
[S4]. Consequently:

- TISS has **no 2025W or 2024W offering** of 191.030 — requesting either serves
  the 2026W page [S2].
- VoWi has **no page** for the course and none mentioning the lecturer [S7].
- TISS links **no TUWEL course** for 191.030 (re-read 2026-09-27), so there is
  no course-material page to cite either.
- The one TISS passage that named the exercise types (packet traces, topology
  derivation, TCP scenarios) was **stated on TISS until 2026-09-2x, removed by
  2026-09-27** [S1]. The five-exercise schedule and every date, exam and
  registration window are unchanged.
- **Update 2026-10-05:** the course site <https://internet.wien/teaching/introduction-to-networking/introduction-to-networking-2026/>
  now publishes slides (lecture 1 so far) [S36]. They are kept in the
  git-ignored `vendor/slides/`, not committed (no licence stated).
- No script, exercise sheet or past paper of his is public anywhere
  [S5]; TISS itself says "No lecture notes are available" [S1].
- The nearest TU Wien relative is 182.752 Computer Networks (Schmid/Siegl) at
  the same institute [S6] — a 3 ECTS German seminar with an oral exam over a
  student-written question catalogue. Useful as a topic list, useless as an exam
  model.

So the usual highest-value source of this pass — the lecturer's own material and
past papers — **does not exist**, and no amount of searching will produce it
before the first lecture. What replaces it is the standards: every mechanism the
notes describe is now traceable to a vendored RFC section, and the numbers the
RFCs print are reproduced by tests in
[`../src/py/test_rfc_vectors.py`](../src/py/test_rfc_vectors.py).

## Reading order

1. the exam-focus note (no longer published) — what is known and
   what is guessed about the examination, and how much weight to give each.
2. the notes index (no longer published) — the eleven topic notes in the
   order the TISS subject list gives them.
3. [`standards-map.md`](standards-map.md) when a note cites a section and you
   want the text: it says which file and which section.
4. [`cnp3-map.md`](cnp3-map.md) when a lecture topic has no slides and you want
   a readable account of it: it says which CNP3 section, and when to read
   something else instead.

[S32]: https://trustee.ietf.org/documents/trust-legal-provisions/tlp-5/
