import hmac
import os

from fastapi import Header, HTTPException, status
from dotenv import load_dotenv
from dataclasses import dataclass

load_dotenv()


@dataclass(frozen=True)
class VerifiedUser:
    user_id: str
    user_email: str | None = None


def get_internal_service_token() -> str:
    token = os.getenv("FASTAPI_INTERNAL_TOKEN", "local-dev-token")
    return token


def verify_internal_request(
    authorization: str | None = Header(default=None),
    x_user_id: str | None = Header(default=None),
    x_user_email: str | None = Header(default=None),
) -> VerifiedUser:
    expected_token = get_internal_service_token()

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
