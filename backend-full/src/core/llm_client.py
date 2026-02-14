import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from src.core.config import settings


logger = logging.getLogger(__name__)


class LLMClient(ABC):
    """
    Abstract base class for LLM clients to provide a consistent interface
    regardless of the underlying LLM provider.
    """

    @abstractmethod
    async def generate_completion(self, prompt: str, **kwargs) -> str:
        """
        Generate a completion based on the provided prompt.
        
        Args:
            prompt: The input prompt for the LLM
            **kwargs: Additional parameters for the LLM call
            
        Returns:
            The generated completion text
        """
        pass

    @abstractmethod
    async def generate_chat_completion(self, messages: list, **kwargs) -> str:
        """
        Generate a chat completion based on the provided messages.
        
        Args:
            messages: List of message dictionaries with role and content
            **kwargs: Additional parameters for the LLM call
            
        Returns:
            The generated completion text
        """
        pass


class OpenAILLMClient(LLMClient):
    """
    OpenAI implementation of the LLMClient interface.
    """

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.default_model = settings.DEFAULT_LLM_MODEL

    async def generate_completion(self, prompt: str, **kwargs) -> str:
        """
        Generate a completion using OpenAI's API.
        
        Args:
            prompt: The input prompt for the LLM
            **kwargs: Additional parameters for the LLM call (model, temperature, etc.)
            
        Returns:
            The generated completion text
        """
        try:
            # Use the model from kwargs or fall back to default
            model = kwargs.pop('model', self.default_model)
            
            response = await self.client.completions.create(
                model=model,
                prompt=prompt,
                **kwargs
            )
            
            # Log the token usage for cost tracking
            logger.info(f"OpenAI completion used {response.usage.total_tokens} tokens")
            
            return response.choices[0].text.strip()
        except Exception as e:
            logger.error(f"Error in OpenAI completion: {str(e)}")
            raise

    async def generate_chat_completion(self, messages: list, **kwargs) -> str:
        """
        Generate a chat completion using OpenAI's API.
        
        Args:
            messages: List of message dictionaries with role and content
            **kwargs: Additional parameters for the LLM call (model, temperature, etc.)
            
        Returns:
            The generated completion text
        """
        try:
            # Use the model from kwargs or fall back to default
            model = kwargs.pop('model', self.default_model)
            
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                **kwargs
            )
            
            # Log the token usage for cost tracking
            logger.info(f"OpenAI chat completion used {response.usage.total_tokens} tokens")
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Error in OpenAI chat completion: {str(e)}")
            raise


# Global instance of the LLM client
llm_client: Optional[LLMClient] = None


def get_llm_client() -> LLMClient:
    """
    Get the global LLM client instance, creating it if necessary.
    """
    global llm_client
    if llm_client is None:
        llm_client = OpenAILLMClient()
    return llm_client