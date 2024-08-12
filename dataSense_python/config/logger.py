import logging
from config.config import logPath
from datetime import datetime



"""
Configures a custom logger with a file handler and a console handler.

The logger will write logs to a file and print them to the console.
The log file name will include the current date and time.

Example:
    >>> from my_logger import logger
    >>> logger.info("This is an info message")
    2022-07-25 14:30:00,000 - my_logger - INFO - This is an info message
    >>> logger.error("This is an error message")
    2022-07-25 14:30:00,000 - my_logger - ERROR - This is an error message

:param logPath: The path to the log file directory
:return: A custom logger instance
"""

logger = logging.getLogger('data_profile_logger')


from generals.general import create_directory
logger_file_path = f"{create_directory(logPath)}/ai_profiler_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.log"

# Create a custom logger
logger = logging.getLogger('my_logger')
logger.setLevel(logging.INFO)

# Create handlers
file_handler = logging.FileHandler(logger_file_path)
console_handler = logging.StreamHandler()

# Set level for handlers
file_handler.setLevel(logging.INFO)
console_handler.setLevel(logging.INFO)

# Create a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Add handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(console_handler)