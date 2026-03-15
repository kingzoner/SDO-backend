from app.config.settings import get_settings

def init_config() -> dict:
    """
    Backward-compatible helper that returns settings as a plain dict.
    Environment variables override defaults defined in code/.env.
    """
    return get_settings().model_dump(mode="python")
