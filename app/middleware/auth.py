from http import HTTPStatus

from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.core.jwt_handler import decode_access_token


PUBLIC_PATHS = {
    "/docs",
    "/openapi.json",
    "/login",
    "/register",
    "/api/groups",
    "/health",
}


async def auth_middleware(request: Request, call_next):
    # Let CORS preflight and public routes through without auth
    if request.method == "OPTIONS" or request.url.path in PUBLIC_PATHS:
        return await call_next(request)

    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Not authenticated"},
        )

    token = auth_header[len("Bearer "):]
    decoded_token = decode_access_token(token)
    if isinstance(decoded_token, str):
        return JSONResponse(
            status_code=HTTPStatus.UNAUTHORIZED,
            content={"error": decoded_token},
        )

    request.state.user_id = decoded_token.get("user_id")

    response = await call_next(request)
    return response
