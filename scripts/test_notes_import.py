import os
import subprocess
from pathlib import Path

SCRIPT = Path(__file__).with_name("notes.sh")


def git(repo: Path, *args: str) -> None:
    subprocess.run(["git", "-C", str(repo), *args], check=True, capture_output=True)


def test_imports_content_branch_without_overwriting_reference_code(tmp_path: Path) -> None:
    source, site = tmp_path / "source", tmp_path / "site"
    source.mkdir()
    site.mkdir()
    git(source, "init", "-q", "-b", "content")
    git(source, "config", "user.name", "test")
    git(source, "config", "user.email", "test@example.invalid")
    git(source, "config", "core.hooksPath", os.devnull)
    git(source, "config", "commit.gpgsign", "false")
    files = {
        "index.md": "public index\n",
        "courses/demo/notes/topic.md": "public topic\n",
        "courses/demo/verified-cards.md": "public cards\n",
        "private.md": "must not enter site\n",
        "courses/demo/src/private.py": "must not overwrite reference code\n",
    }
    for name, text in files.items():
        p = source / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)
    git(source, "add", ".")
    git(source, "commit", "-qm", "fixture")
    implementation = site / "content/courses/demo/src/reference.py"
    implementation.parent.mkdir(parents=True)
    implementation.write_text("retained reference code\n")
    env = dict(os.environ, NOTES_URL=str(source))
    subprocess.run(["sh", str(SCRIPT)], cwd=site, env=env, check=True, capture_output=True)
    assert (site / "content/index.md").read_text() == "public index\n"
    assert (site / "content/courses/demo/verified-cards.md").read_text() == "public cards\n"
    assert implementation.read_text() == "retained reference code\n"
    assert not (site / "content/private.md").exists()
    assert not (site / "content/courses/demo/src/private.py").exists()
    assert (site / "content/courses/demo/notes/topic.md").read_text() == "public topic\n"
    (source / "courses/demo/notes/topic.md").unlink()
    git(source, "add", ".")
    git(source, "commit", "-qm", "remove exported note")
    subprocess.run(["sh", str(SCRIPT)], cwd=site, env=env, check=True, capture_output=True)
    assert not (site / "content/courses/demo/notes/topic.md").exists()
    assert implementation.read_text() == "retained reference code\n"
