import asyncio
import json

from app.routers import subjects


def test_get_user_labs_filters_by_subject(monkeypatch):
    calls = {}

    monkeypatch.setattr(
        subjects,
        "check_auth",
        lambda authorization: {"user_id": 7, "username": "student"},
    )
    monkeypatch.setattr(
        subjects,
        "is_user_enrolled_in_subject",
        lambda username, subject_id: True,
    )

    def fake_get_student_tasks_with_status(user_id, subject_id=None):
        calls["user_id"] = user_id
        calls["subject_id"] = subject_id
        return [(1, "Lab 1", False)]

    monkeypatch.setattr(
        subjects,
        "get_student_tasks_with_status",
        fake_get_student_tasks_with_status,
    )

    response = asyncio.run(subjects.get_user_labs(subject_id=3, authorization="token"))

    assert response.status_code == 200
    assert calls == {"user_id": 7, "subject_id": 3}
    assert json.loads(response.body) == [[1, "Lab 1", False]]


def test_get_tasks_forbidden_when_user_is_not_enrolled(monkeypatch):
    monkeypatch.setattr(
        subjects,
        "check_auth",
        lambda authorization: {"user_id": 7, "username": "student"},
    )
    monkeypatch.setattr(
        subjects,
        "is_user_enrolled_in_subject",
        lambda username, subject_id: False,
    )

    response = asyncio.run(subjects.get_tasks(subject_id=9, authorization="token"))

    assert response.status_code == 403
    assert json.loads(response.body) == {"error": "User is not enrolled in the subject."}
