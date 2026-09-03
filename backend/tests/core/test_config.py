from pathlib import Path

import pytest
from pydantic import ValidationError

from core.config import Settings

VALID_SETTINGS = {
    "fastapi_internal_token": "test-token-that-is-at-least-32-characters",
    "google_api_key": "test-google-key",
    "backend_cors_origins": "http://localhost:3000",
}


def test_valid_environment_is_accepted() -> None:
    settings = Settings(app_env="test", _env_file=None, **VALID_SETTINGS)

    assert settings.app_env == "test"
    assert settings.app_name == "Coordinate Backend"
    assert settings.embedding_dimensions == 768
    assert settings.rag_chunk_overlap < settings.rag_chunk_size


def test_unsupported_environment_is_rejected() -> None:
    with pytest.raises(ValidationError):
        Settings(app_env="staging", _env_file=None, **VALID_SETTINGS)


def test_invalid_rag_chunk_configuration_is_rejected() -> None:
    with pytest.raises(ValidationError, match="overlap must be smaller"):
        Settings(
            app_env="test",
            rag_chunk_size=500,
            rag_chunk_overlap=500,
            _env_file=None,
            **VALID_SETTINGS,
        )


def test_missing_environment_is_rejected(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("APP_ENV", raising=False)

    with pytest.raises(ValidationError):
        Settings(_env_file=None, **VALID_SETTINGS)


def test_environment_is_loaded_from_dotenv(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.delenv("APP_ENV", raising=False)
    env_file = tmp_path / ".env"
    env_file.write_text(
        "\n".join(
            [
                "APP_ENV=test",
                f"FASTAPI_INTERNAL_TOKEN={VALID_SETTINGS['fastapi_internal_token']}",
                f"GOOGLE_API_KEY={VALID_SETTINGS['google_api_key']}",
                f"BACKEND_CORS_ORIGINS={VALID_SETTINGS['backend_cors_origins']}",
            ]
        ),
        encoding="utf-8",
    )

    settings = Settings(_env_file=env_file)

    assert settings.app_env == "test"
