from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from http import HTTPStatus

from app.core.check_auth import check_auth

from app.db.student_methods import get_student_tasks_with_status
from app.db.task_methods import get_tasks_by_subject, get_user_solutions_by_task
from app.db.user_methods import get_user_subjects, is_user_enrolled_in_subject
from app.schemas.others import Error
from app.schemas.subject import SubjectInfo
from app.schemas.task import Task

router = APIRouter()


# return user subjects [[1, "Python", 5], [2, "C++", 7]] or "Subjects not found" | [id, name, grade]
@router.get("/subjects", response_model=list[SubjectInfo], summary="Получение всех предметов пользователя")
async def get_subjects(authorization: str = Header(...)) -> JSONResponse:
    check_data = check_auth(authorization)
    if isinstance(check_data, JSONResponse):
        return check_data

    user_subjects = get_user_subjects(check_data['username'])
    serialized_subjects = [subject.model_dump() for subject in user_subjects]

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content=serialized_subjects
    )


# return tasks of subject by subject_id
@router.get("/tasks/{subject_id}", response_model=list[Task], summary="Получение лабораторных работ предмета")
async def get_tasks(subject_id: int, authorization: str = Header(...)) -> JSONResponse:
    check_data = check_auth(authorization)
    if isinstance(check_data, JSONResponse):
        return check_data

    is_enrolled = is_user_enrolled_in_subject(check_data['username'], subject_id)
    if isinstance(is_enrolled, str):
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={"error": is_enrolled}
        )
    if not is_enrolled:
        return JSONResponse(
            status_code=HTTPStatus.FORBIDDEN,
            content={"error": "User is not enrolled in the subject."}
        )

    subject_tasks = get_tasks_by_subject(subject_id)
    if isinstance(subject_tasks, str):
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content=Error(message=subject_tasks).model_dump()
        )

    serialized_tasks = []
    for task in subject_tasks:
        user_solutions = get_user_solutions_by_task(check_data['user_id'], task.id)
        passed_solutions = [sol for sol in user_solutions if sol.status == "Success"]
        task.status = "Success" if passed_solutions else "Failed"
        serialized_tasks.append(task.model_dump())

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content=serialized_tasks
    )


@router.get("/labs")
async def get_user_labs(subject_id: int | None = None, authorization: str = Header(...)) -> JSONResponse:
    check_data = check_auth(authorization)
    if isinstance(check_data, JSONResponse):
        return check_data

    if subject_id is not None:
        is_enrolled = is_user_enrolled_in_subject(check_data['username'], subject_id)
        if isinstance(is_enrolled, str):
            return JSONResponse(
                status_code=HTTPStatus.NOT_FOUND,
                content={"error": is_enrolled}
            )
        if not is_enrolled:
            return JSONResponse(
                status_code=HTTPStatus.FORBIDDEN,
                content={"error": "User is not enrolled in the subject."}
            )

    user_labs = get_student_tasks_with_status(check_data['user_id'], subject_id)
    serialized_labs = [lab for lab in user_labs]

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content=serialized_labs
    )
