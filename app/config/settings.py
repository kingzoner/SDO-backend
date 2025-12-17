import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv
from pydantic import BaseModel, Field


load_dotenv()


def _as_list(value: str | None, default: List[str]) -> List[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


class DatabaseSettings(BaseModel):
    host: str = "db"
    port: int = 5432
    user: str = "root"
    password: str = "root"
    name: str = "postgres"


class AppSettings(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"])


class JWTSettings(BaseModel):
    secret_key: str = "secret_key"
    algorithm: str = "HS256"
    expires_in: int = 2592000


class Settings(BaseModel):
    database: DatabaseSettings
    app: AppSettings
    jwt: JWTSettings


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    database = DatabaseSettings(
        host=os.getenv("SDO_DATABASE__HOST", "db"),
        port=int(os.getenv("SDO_DATABASE__PORT", "5432")),
        user=os.getenv("SDO_DATABASE__USER", "root"),
        password=os.getenv("SDO_DATABASE__PASSWORD", "root"),
        name=os.getenv("SDO_DATABASE__NAME", "postgres"),
    )

    app = AppSettings(
        host=os.getenv("SDO_APP__HOST", "0.0.0.0"),
        port=int(os.getenv("SDO_APP__PORT", "8000")),
        cors_origins=_as_list(os.getenv("SDO_APP__CORS_ORIGINS"), ["http://localhost:5173"]),
    )

    jwt_cfg = JWTSettings(
        secret_key=os.getenv("SDO_JWT__SECRET_KEY", "secret_key"),
        algorithm=os.getenv("SDO_JWT__ALGORITHM", "HS256"),
        expires_in=int(os.getenv("SDO_JWT__EXPIRES_IN", "2592000")),
    )

    return Settings(database=database, app=app, jwt=jwt_cfg)
