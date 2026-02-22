"""
Stub implementation of emergentintegrations.llm.chat
Uses NVIDIA NIM API for LLM responses via OpenAI-compatible endpoint.
"""
import os
import logging

logger = logging.getLogger(__name__)


class UserMessage:
    """Represents a user message to send to the LLM."""
    def __init__(self, text: str):
        self.text = text


class LlmChat:
    """
    LLM Chat class that uses NVIDIA NIM API.
    Uses OpenAI-compatible endpoint at integrate.api.nvidia.com.
    """
    def __init__(self, api_key: str = None, session_id: str = None, system_message: str = ""):
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message

    def with_model(self, provider: str, model: str):
        """Always uses NVIDIA NIM regardless of input."""
        return self

    async def send_message(self, message: UserMessage) -> str:
        """Send a message and get a response using NVIDIA NIM."""
        try:
            import openai

            api_key = os.environ.get("NVIDIA_API_KEY", self.api_key or "")
            logger.info(f"Calling NVIDIA NIM API...")

            client = openai.AsyncOpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=api_key,
                timeout=120.0,
            )

            response = await client.chat.completions.create(
                model="meta/llama-3.1-8b-instruct",
                messages=[
                    {"role": "system", "content": self.system_message},
                    {"role": "user", "content": message.text}
                ],
                max_tokens=400,
                temperature=0.7,
            )

            result = response.choices[0].message.content
            logger.info(f"NVIDIA NIM response received successfully")
            return result

        except Exception as e:
            logger.error(f"NVIDIA NIM LLM call failed: {type(e).__name__}: {e}")
            return (
                "I appreciate you reaching out. While I'm having a temporary connection issue, "
                "I want you to know that your feelings are valid and important. "
                "Please try again in a moment, or if you need immediate support, "
                "reach out to the KIRAN Mental Health Helpline at 1800-599-0019."
            )
