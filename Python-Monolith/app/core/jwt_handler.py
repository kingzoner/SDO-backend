import jwt
from datetime import datetime, timedelta
from typing import Optional, Union

from app.config.settings import get_settings


settings = get_settings()
SECRET_KEY = settings.jwt.secret_key
ALGORITHM = settings.jwt.algorithm
EXPIRES_IN = settings.jwt.expires_in  # D'¥?DæD¬¥? DD,DúD«D, ¥,D_D§DæD«Dø Dý ¥?DæD§¥ŸD«D'Dø¥.


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    D"DæD«Dæ¥?Dø¥+D,¥? JWT-¥,D_D§DæD«Dø.
    :param data: D"DøD«D«¥<Dæ, D§D_¥,D_¥?¥<Dæ Dñ¥ŸD'¥Ÿ¥, DúDø¥^D,¥,¥?D_DýDøD«¥< Dý ¥,D_D§DæD«Dæ.
    :param expires_delta: D'¥?DæD¬¥? DD,DúD«D, ¥,D_D§DæD«Dø (timedelta). D¥?D¯D, None, DñDæ¥?¥`¥,¥?¥? DúD«Dø¥ØDæD«D,Dæ D,Dú D§D_D«¥,D,D3Dø.
    :return: D­D3DæD«Dæ¥?D,¥?D_DýDøD«D«¥<D1 ¥,D_D§DæD«.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(seconds=int(EXPIRES_IN)))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Union[dict, str]:
    """
    D"DæD§D_D'D,¥?D_DýDøD«D,Dæ JWT-¥,D_D§DæD«Dø.
    :param token: D›D_D§DæD« D'D¯¥? D'DæD§D_D'D,¥?D_DýDøD«D,¥?.
    :return: D"DæD§D_D'D,¥?D_DýDøD«D«¥<Dæ D'DøD«D«¥<Dæ ¥,D_D§DæD«Dø D,D¯D, str, Dæ¥?D¯D, ¥,D_D§DæD« D«DæD'DæD1¥?¥,DýD,¥,DæD¯DæD«.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return "Token has expired."
    except jwt.InvalidTokenError:
        return "Invalid token."
