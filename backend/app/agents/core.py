import os
import json
import re
import time
from typing import Dict, Any, Optional, List
import requests
from app.config import settings, PROVIDER_DEFAULTS

class UniversalAIClient:
    def __init__(self):
        self._cached_available_models: List[str] = []

    def get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "StartupAdvisor-AI/2.0"
        }
        api_key = settings.ai_api_key
        provider = settings.ai_provider

        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
            if provider == "gemini":
                headers["x-goog-api-key"] = api_key
            elif provider == "openrouter":
                headers["HTTP-Referer"] = "https://startupadvisor.ai"
                headers["X-Title"] = "StartupAdvisor AI"

        return headers

    def get_endpoint(self) -> str:
        base = settings.ai_base_url.rstrip("/")
        if base.endswith("/chat/completions"):
            return base
        return f"{base}/chat/completions"

    def list_available_models(self) -> List[str]:
        if self._cached_available_models:
            return self._cached_available_models

        provider = settings.ai_provider
        default_preset = PROVIDER_DEFAULTS.get(provider, {})
        preset_models = default_preset.get("models", ["llama-3.1-8b-instant"])

        if not settings.is_ai_configured:
            return preset_models

        try:
            base = settings.ai_base_url.rstrip("/")
            models_url = f"{base}/models"
            resp = requests.get(models_url, headers=self.get_headers(), timeout=5.0)
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("data", [])
                extracted = []
                for item in items:
                    mid = item.get("id")
                    if mid and not any(skip in mid.lower() for skip in ["whisper", "guard", "vision", "embed", "tts", "dall-e"]):
                        extracted.append(mid)
                if extracted:
                    self._cached_available_models = extracted[:15]
                    return self._cached_available_models
        except Exception as e:
            print(f"Error querying /models from {provider}: {e}")

        return preset_models

    def test_connection(self) -> Dict[str, Any]:
        if not settings.is_ai_configured:
            return {
                "success": False,
                "message": f"API Key is not configured for {settings.ai_provider.upper()}. Please enter your key.",
                "provider": settings.ai_provider,
                "model": settings.ai_model,
                "available_models": self.list_available_models(),
                "latency_ms": None
            }

        endpoint = self.get_endpoint()
        headers = self.get_headers()
        model = settings.ai_model

        # Reset cache on test
        self._cached_available_models = []
        available = self.list_available_models()

        if available and model not in available and model == "allam-2-7b":
            model = available[0]
            settings.set_ai_config(settings.ai_provider, settings.ai_api_key, model)

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a test agent. Respond only with JSON: {\"status\": \"ok\"}"},
                {"role": "user", "content": "ping"}
            ],
            "max_tokens": 40,
            "temperature": 0.1
        }

        # Try with json mode first, if fail retry without json constraint
        t0 = time.time()
        last_error = ""

        try:
            payload_json = dict(payload)
            payload_json["response_format"] = {"type": "json_object"}
            resp = requests.post(endpoint, headers=headers, json=payload_json, timeout=12.0)
            latency = int((time.time() - t0) * 1000)

            if resp.status_code == 200:
                return {
                    "success": True,
                    "message": f"Connected to {settings.ai_provider.upper()} using '{model}' ({latency}ms)",
                    "provider": settings.ai_provider,
                    "model": model,
                    "available_models": available,
                    "latency_ms": latency
                }
            else:
                last_error = resp.text
        except Exception as e:
            last_error = str(e)

        # Retry without response_format constraint
        try:
            resp = requests.post(endpoint, headers=headers, json=payload, timeout=12.0)
            latency = int((time.time() - t0) * 1000)
            if resp.status_code == 200:
                return {
                    "success": True,
                    "message": f"Connected to {settings.ai_provider.upper()} using '{model}' ({latency}ms)",
                    "provider": settings.ai_provider,
                    "model": model,
                    "available_models": available,
                    "latency_ms": latency
                }
            else:
                last_error = resp.text
        except Exception as e:
            last_error = str(e)

        # Helpful diagnostic message
        clean_err = last_error.strip()
        if "401" in clean_err or "invalid_api_key" in clean_err.lower() or "unauthorized" in clean_err.lower():
            msg = f"Invalid API Key for {settings.ai_provider.upper()}. Please verify your key."
        elif "429" in clean_err or "rate_limit" in clean_err.lower() or "quota" in clean_err.lower():
            msg = f"Rate limit / quota exceeded for {settings.ai_provider.upper()} model '{model}'. Try a different free model."
        elif "model_not_found" in clean_err.lower() or "does not exist" in clean_err.lower() or "not found" in clean_err.lower():
            msg = f"Model '{model}' is not available on this provider. Please select a valid model."
        else:
            msg = f"Connection error: {clean_err[:120]}"

        return {
            "success": False,
            "message": msg,
            "provider": settings.ai_provider,
            "model": model,
            "available_models": available,
            "latency_ms": None
        }

    def chat_json(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 700
    ) -> Optional[Dict[str, Any]]:
        if not settings.is_ai_configured:
            return None

        endpoint = self.get_endpoint()
        headers = self.get_headers()
        model = settings.ai_model

        full_system = (
            f"{system_prompt}\n\n"
            "CRITICAL INSTRUCTIONS FOR HIGH-SIGNAL OUTPUT:\n"
            "- Be direct, analytical, and eliminate all corporate filler.\n"
            "- Keep every bullet point under 15 words.\n"
            "- Focus strictly on decisive metrics, unit economics, and concrete founder action.\n"
            "- Total JSON response must be compact and under 400 words.\n"
            "- Return ONLY valid JSON. No markdown code blocks, no backticks, no comments."
        )

        base_body = {
            "model": model,
            "messages": [
                {"role": "system", "content": full_system},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        # Attempt 1: With JSON response format
        try:
            body_with_json = dict(base_body)
            body_with_json["response_format"] = {"type": "json_object"}
            resp = requests.post(endpoint, headers=headers, json=body_with_json, timeout=14.0)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                parsed = self._parse_json_safely(content)
                if parsed:
                    return parsed
        except Exception as e:
            print(f"Call attempt 1 failed on {model}: {e}")

        # Attempt 2: Standard mode (for models that reject response_format)
        try:
            resp = requests.post(endpoint, headers=headers, json=base_body, timeout=12.0)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                parsed = self._parse_json_safely(content)
                if parsed:
                    return parsed
        except Exception as e:
            print(f"Call attempt 2 failed on {model}: {e}")

        return None

    def _parse_json_safely(self, text: str) -> Optional[Dict[str, Any]]:
        if not text:
            return None

        cleaned = text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        start_idx = cleaned.find("{")
        end_idx = cleaned.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned = cleaned[start_idx:end_idx+1]

        # 1. Direct parse
        try:
            return json.loads(cleaned)
        except Exception:
            pass

        # 2. Syntax repairs
        try:
            repaired = re.sub(r',\s*([\]}])', r'\1', cleaned)
            repaired = re.sub(r':\s*\{\s*("[^"]*"\s*(?:,\s*"[^"]*"\s*)*)\}', r': [\1]', repaired)
            return json.loads(repaired)
        except Exception as e:
            print(f"JSON parsing error: {e}\nRaw preview: {cleaned[:120]}")
            return None

universal_ai_client = UniversalAIClient()
# Backward compatible alias for existing imports
groq_client = universal_ai_client
