import os
from pathlib import Path
from dotenv import load_dotenv

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Provider presets
PROVIDER_DEFAULTS = {
    "groq": {
        "base_url": "https://api.groq.com/openai/v1",
        "default_model": "llama-3.1-8b-instant",
        "models": [
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-20b",
            "openai/gpt-oss-120b",
        ]
    },
    "gemini": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai",
        "default_model": "gemini-2.0-flash",
        "models": [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
        ]
    },
    "openrouter": {
        "base_url": "https://openrouter.ai/api/v1",
        "default_model": "meta-llama/llama-3.2-3b-instruct:free",
        "models": [
            "meta-llama/llama-3.2-3b-instruct:free",
            "google/gemini-2.0-flash-exp:free",
            "deepseek/deepseek-r1:free",
            "qwen/qwen-2.5-72b-instruct:free",
            "mistralai/mistral-7b-instruct:free",
        ]
    },
    "mistral": {
        "base_url": "https://api.mistral.ai/v1",
        "default_model": "mistral-small-latest",
        "models": [
            "mistral-small-latest",
            "open-mistral-7b",
            "codestral-latest",
        ]
    },
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "default_model": "gpt-4o-mini",
        "models": [
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-3.5-turbo"
        ]
    },
    "custom": {
        "base_url": "http://localhost:11434/v1",
        "default_model": "llama3.2",
        "models": [
            "llama3.2",
            "deepseek-r1",
            "mistral",
            "qwen2.5"
        ]
    }
}

class Settings:
    PROJECT_NAME: str = "StartupAdvisor AI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/startupadvisor.db")
    
    # Universal AI Configuration
    _ai_provider: str = os.getenv("AI_PROVIDER", "groq").lower()
    _ai_api_key: str = os.getenv("AI_API_KEY", os.getenv("GROQ_API_KEY", ""))
    _ai_model: str = os.getenv("AI_MODEL", os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"))
    _ai_base_url: str = os.getenv("AI_BASE_URL", "")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Knowledge / RAG
    KNOWLEDGE_DIR: Path = BASE_DIR / "knowledge"

    @property
    def ai_provider(self) -> str:
        return self._ai_provider or "groq"

    @property
    def ai_api_key(self) -> str:
        return self._ai_api_key

    @property
    def ai_model(self) -> str:
        return self._ai_model or "llama-3.1-8b-instant"

    @property
    def ai_base_url(self) -> str:
        if self._ai_base_url:
            return self._ai_base_url
        preset = PROVIDER_DEFAULTS.get(self.ai_provider, {})
        return preset.get("base_url", "https://api.groq.com/openai/v1")

    # Backwards compatibility properties for Groq
    @property
    def groq_api_key(self) -> str:
        return self.ai_api_key

    @property
    def GROQ_MODEL(self) -> str:
        return self.ai_model

    @GROQ_MODEL.setter
    def GROQ_MODEL(self, val: str):
        self._ai_model = val

    def set_ai_config(self, provider: str, key: str, model: str = "", base_url: str = ""):
        self._ai_provider = (provider or "groq").lower().strip()
        self._ai_api_key = key.strip()
        if model and model.strip():
            self._ai_model = model.strip()
        elif not self._ai_model or self._ai_model == "allam-2-7b":
            preset = PROVIDER_DEFAULTS.get(self._ai_provider, {})
            self._ai_model = preset.get("default_model", "llama-3.1-8b-instant")
            
        if base_url:
            self._ai_base_url = base_url.strip()
        else:
            preset = PROVIDER_DEFAULTS.get(self._ai_provider, {})
            self._ai_base_url = preset.get("base_url", "")
            
        self._persist_env()

    def set_groq_api_key(self, key: str):
        self.set_ai_config(provider="groq", key=key)

    def set_groq_model(self, model: str):
        self._ai_model = model.strip()
        self._persist_env()

    def _persist_env(self):
        try:
            env_path = BASE_DIR / ".env"
            lines = []
            if env_path.exists():
                lines = env_path.read_text(encoding="utf-8").splitlines()
            
            keys_to_update = {
                "AI_PROVIDER": self.ai_provider,
                "AI_API_KEY": self.ai_api_key,
                "AI_MODEL": self.ai_model,
                "AI_BASE_URL": self.ai_base_url,
                "GROQ_API_KEY": self.ai_api_key if self.ai_provider == "groq" else os.getenv("GROQ_API_KEY", self.ai_api_key),
                "GROQ_MODEL": self.ai_model,
            }
            
            new_lines = []
            seen = set()
            for line in lines:
                matched = False
                for k, v in keys_to_update.items():
                    if line.startswith(f"{k}="):
                        new_lines.append(f"{k}={v}")
                        seen.add(k)
                        matched = True
                        break
                if not matched:
                    new_lines.append(line)
                    
            for k, v in keys_to_update.items():
                if k not in seen:
                    new_lines.append(f"{k}={v}")
                    
            env_path.write_text("\n".join(new_lines) + "\n", encoding="utf-8")
        except Exception as e:
            print(f"Error persisting .env: {e}")

    @property
    def is_ai_configured(self) -> bool:
        # Custom / local may not need a key, or key can be "ollama" / "none"
        if self.ai_provider == "custom":
            return bool(self.ai_base_url)
        return bool(self._ai_api_key and len(self._ai_api_key) > 6)

    @property
    def is_groq_configured(self) -> bool:
        return self.is_ai_configured

settings = Settings()
