import openai
from openai.error import OpenAIError
from config.config import open_ai_key,open_ai_model_name
from config.logger import logger
# Set your API key
openai.api_key = open_ai_key


def get_available_models():
    # Retrieve the list of available models
    models = []
    # Print the model IDs
    for model in openai.Model.list()['data']:
        models.append(model['id'])
    return models

def open_ai(prompt):
    try:
        # Create a completion request
        response = openai.Completion.create(
            engine=open_ai_model_name,
            prompt=prompt,
            max_tokens=50
        )

        # Print the generated text
        return response.choices[0].text.strip()

    except OpenAIError as e:
        logger.info("Error at open ai " + str(e))
        print(f"An error occurred: {e}")
