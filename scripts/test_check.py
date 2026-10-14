import sys

import check
import pytest


def run(tmp_path, monkeypatch, capsys, text, name="page.md"):
    (tmp_path / name).write_text(text, encoding="utf-8")
    monkeypatch.setattr(sys, "argv", ["check.py", str(tmp_path)])
    code = check.main()
    return code, capsys.readouterr().out


@pytest.mark.parametrize(
    "line",
    [
        "registered since 2024",
        "and registered for",
        "the user's list",
        "TISS favourites",
        "favourites group",
        "suspended",
        "a clash here",
        "preregistered",
        "green tick",
        "hourglass since",
        "TISS hourglass",
        "deregistered",
        "see ~/Workspaces/x",
        "by lilfeelz",
        "path /Users/j/x",
        "LILFEELZ",
    ],
)
def test_privacy_hit(tmp_path, monkeypatch, capsys, line):
    code, out = run(tmp_path, monkeypatch, capsys, line + "\n")
    assert code == 1
    assert "privacy" in out


@pytest.mark.parametrize(
    "line", ["nothing personal", "registers", "a crash", "/users/lower", "Users"]
)
def test_privacy_miss(tmp_path, monkeypatch, capsys, line):
    code, _ = run(tmp_path, monkeypatch, capsys, line + "\n")
    assert code == 0


def test_privacy_inside_fence_still_fails(tmp_path, monkeypatch, capsys):
    code, _ = run(tmp_path, monkeypatch, capsys, "```\nlilfeelz\n```\n")
    assert code == 1


def test_broken_link_fails(tmp_path, monkeypatch, capsys):
    code, out = run(tmp_path, monkeypatch, capsys, "[x](missing.md)\n")
    assert code == 1
    assert "broken link: missing.md" in out


def test_valid_links_pass(tmp_path, monkeypatch, capsys):
    (tmp_path / "other.md").write_text("", encoding="utf-8")
    text = "[a](other.md) [b](other) [c](#anchor) [d](https://x.org) [e](/other.md#h)\n"
    code, _ = run(tmp_path, monkeypatch, capsys, text)
    assert code == 0


def test_broken_link_in_fence_is_ignored(tmp_path, monkeypatch, capsys):
    code, _ = run(tmp_path, monkeypatch, capsys, "```\n[x](missing.md)\n```\n")
    assert code == 0


def test_broken_link_after_fence_fails(tmp_path, monkeypatch, capsys):
    code, _ = run(tmp_path, monkeypatch, capsys, "```\ncode\n```\n[x](missing.md)\n")
    assert code == 1


def test_inner_fence_does_not_close_outer(tmp_path, monkeypatch, capsys):
    text = "````\n```\n[x](missing.md)\n````\n[y](missing.md)\n"
    code, out = run(tmp_path, monkeypatch, capsys, text)
    assert code == 1
    assert out.count("broken link") == 1
    assert "page.md:5" in out


def test_missing_source_only_warns(tmp_path, monkeypatch, capsys):
    course = tmp_path / "c"
    (course / "notes").mkdir(parents=True)
    (course / "refs").mkdir()
    (course / "refs" / "SOURCES.md").write_text("- S1 known\n", encoding="utf-8")
    (course / "notes" / "n.md").write_text("claim [S1] and [S2]\n", encoding="utf-8")
    monkeypatch.setattr(sys, "argv", ["check.py", str(tmp_path)])
    code = check.main()
    out = capsys.readouterr().out
    assert code == 0
    assert "warning" in out and "S2" in out and "S1 not" not in out


def test_clean_tree_exits_zero(tmp_path, monkeypatch, capsys):
    code, out = run(tmp_path, monkeypatch, capsys, "# Title\n\ntext\n")
    assert code == 0
    assert "0 errors" in out
