import hmac
from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, status

from core.config import Settings, get_settings


@dataclass(frozen=True)
class VerifiedUser:
    user_id: str
    user_email: str | None = None


def verify_internal_request(
    authorization: str | None = Header(default=None),
    x_user_id: str | None = Header(default=None),
    x_user_email: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> VerifiedUser:
    expected_token = settings.fastapi_internal_token.get_secret_value()

    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header.",
        )

    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format.",
        )

    received_token = authorization.removeprefix(prefix).strip()

    if not hmac.compare_digest(received_token, expected_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal service token.",
        )
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-User-Id header.",
        )
    return VerifiedUser(user_id=x_user_id, user_email=x_user_email)
