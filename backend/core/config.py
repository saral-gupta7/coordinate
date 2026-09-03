from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent

ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    app_name: str = "Coordinate Backend"
    app_env: Literal["development", "test", "production"]

    fastapi_internal_token: SecretStr
    google_api_key: SecretStr
    database_url: SecretStr | None = None

    llm_model: str = Field(default="google_genai:gemini-3.1-flash-lite", min_length=1)
    llm_temperature: float = Field(default=0.3, ge=0.0, le=2.0)
    llm_timeout_seconds: float = Field(default=60.0, ge=1.0, le=300.0)

    embedding_model: str = Field(
        default="models/gemini-embedding-001", min_length=1
    )
    embedding_dimensions: int = Field(default=768, ge=128, le=3072)
    rag_chunk_size: int = Field(default=1200, ge=500, le=3000)
    rag_chunk_overlap: int = Field(default=180, ge=50, le=600)
    rag_retrieval_k: int = Field(default=5, ge=1, le=12)
    rag_similarity_threshold: float = Field(default=0.35, ge=-1.0, le=1.0)
    rag_max_file_size_mb: int = Field(default=8, ge=1, le=25)
    rag_max_pdf_pages: int = Field(default=100, ge=1, le=300)

    backend_cors_origins: str

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("fastapi_internal_token")
    @classmethod
    def validate_fastapi_internal_token(cls, value: SecretStr) -> SecretStr:
        raw_token = value.get_secret_value()

        if len(raw_token) < 32:
            raise ValueError("Token must be at least 32 characters long")

        return value

    @field_validator("google_api_key")
    @classmethod
    def validate_google_api_key(cls, value: SecretStr) -> SecretStr:
        raw_key = value.get_secret_value()

        if len(raw_key.strip()) == 0:
            raise ValueError("API key cannot be empty")

        return value

    @field_validator("backend_cors_origins")
    @classmethod
    def validate_backend_cors_origins(cls, value: str) -> str:
        cleaned_origins: list[str] = []

        for raw_origin in value.split(","):
            origin = raw_origin.strip()

            if origin:
                cleaned_origins.append(origin)

        if not cleaned_origins:
            raise ValueError("At least one CORS origin is required")

        if "*" in cleaned_origins:
            raise ValueError("Wildcard CORS origins are not allowed")

        return ",".join(cleaned_origins)

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_optional_database_url(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @model_validator(mode="after")
    def validate_rag_chunk_configuration(self) -> "Settings":
        if self.rag_chunk_overlap >= self.rag_chunk_size:
            raise ValueError("RAG chunk overlap must be smaller than chunk size")
        return self

    @property
    def cors_origins(self) -> tuple[str, ...]:
        return tuple(self.backend_cors_origins.split(","))

    @property
    def database_dsn(self) -> str | None:
        if self.database_url is None:
            return None
        return self.database_url.get_secret_value()


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
