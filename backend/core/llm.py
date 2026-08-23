from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel

from core.config import Settings, get_settings


def create_chat_model(settings: Settings) -> BaseChatModel:
    return init_chat_model(
        model=settings.llm_model,
        temperature=settings.llm_temperature,
        request_timeout=settings.llm_timeout_seconds,
        api_key=settings.google_api_key,
    )


llm = create_chat_model(get_settings())
