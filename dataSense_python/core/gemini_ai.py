import os
import google.generativeai as genai
from config.config import gemini_ai_config, gemini_ai_model_name, gemini_api_key

genai.configure(api_key=gemini_api_key)

def gen_ai_chat(prompt: str) -> str:
    """
    Generate a response to a given prompt using the Gemini AI model.

    Args:
    prompt (str): The input prompt to generate a response for.

    Returns:
    str: The generated response from the Gemini AI model.

    Example:
    >>> gen_ai_chat("Hello, how are you?")
    "I'm doing well, thank you for asking!"

    Raises:
    Exception: If an error occurs during the API call, the error message is logged and returned.

    Notes:
    This function uses the Gemini AI model to generate a response to a given prompt.
    It configures the API key and model name using the config file.
    """

    try:
        from config.logger import logger
        model = genai.GenerativeModel(
            model_name=gemini_ai_model_name,
            generation_config=gemini_ai_config,
            # safety_settings = Adjust safety settings
            # See https://ai.google.dev/gemini-api/docs/safety-settings
        )
        chat_session = model.start_chat(history=[])
        # logger.info(f"prompt : {prompt}")
        response = chat_session.send_message(prompt)
        # close_session(chat_session)
        return response.text
    except Exception as e:
        logger.info(f"Error in gemini_ai_chat: {str(e)}")
        raise
    

def close_session(chat_session):
    """
    Close the current chat session.
    
    Parameters:
    - chat_session: The active chat session object to be closed.
    """
    try:
        chat_session.end_chat()  # Replace with the actual method to end the session.
        print("Chat session successfully closed.")
    except Exception as e:
        print(f"An error occurred while closing the session: {e}")