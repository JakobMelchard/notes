import shutil
import subprocess
from pathlib import Path

import pytest

CI = Path(__file__).parent / "ci"
NEEDS_MAKE = pytest.mark.skipif(
    shutil.which("make") is None or shutil.which("timeout") is None, reason="needs make and timeout"
)


def course(root: Path, name: str, rel: str, text: str) -> None:
    path = root / "content" / "courses" / name / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def run(script: str, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["bash", str(CI / script)], cwd=cwd, capture_output=True, text=True, check=False)


def test_shell_tests_pass_when_every_course_passes(tmp_path: Path) -> None:
    course(tmp_path, "a", "src/sh/test_ok.sh", "exit 0\n")
    assert run("course-shell-tests.sh", tmp_path).returncode == 0


def test_shell_tests_report_each_failure(tmp_path: Path) -> None:
    course(tmp_path, "a", "src/sh/test_ok.sh", "exit 0\n")
    course(tmp_path, "b", "src/sh/test_bad.sh", "exit 3\n")
    result = run("course-shell-tests.sh", tmp_path)
    assert result.returncode == 1
    assert "::error::content/courses/b/src/sh/test_bad.sh failed" in result.stdout


def test_shell_tests_without_courses_pass(tmp_path: Path) -> None:
    assert run("course-shell-tests.sh", tmp_path).returncode == 0


@NEEDS_MAKE
def test_make_skips_makefiles_without_a_test_target(tmp_path: Path) -> None:
    course(tmp_path, "a", "src/c/Makefile", "all:\n\tfalse\n")
    course(tmp_path, "b", "src/cpp/Makefile", "test:\n\ttrue\n")
    result = run("course-make.sh", tmp_path)
    assert result.returncode == 0
    assert "::group::content/courses/b/src/cpp/Makefile" in result.stdout
    assert "courses/a" not in result.stdout


@NEEDS_MAKE
def test_make_fails_when_a_test_target_fails(tmp_path: Path) -> None:
    course(tmp_path, "a", "src/c/Makefile", "test:\n\tfalse\n")
    result = run("course-make.sh", tmp_path)
    assert result.returncode == 1
    assert "::error::content/courses/a/src/c/Makefile failed or timed out" in result.stdout
