import os
"""
Configuration Variables for Input and Output File Paths
=====================================================

This module contains configuration variables for input and output file paths.

Attributes:
    inputPath (str): The directory path where input files are located.
    inputFiles (list): A list of file names to be processed.
    outputPath (str): The directory path where output files will be saved.
    logPath (str): The directory path where log files will be saved.
    gemini_api_key (str): The API key for Gemini AI model.
    gemini_ai_model_name (str): The name of the Gemini AI model.
    gemini_ai_config (dict): The configuration for the Gemini AI model.

Example:
    >>> inputPath = "/path/to/input/files"
    >>> inputFiles = ["file1.txt", "file2.txt", "file3.txt"]
    >>> outputPath = "/path/to/output/files"
    >>> logPath = "/path/to/log/files"
    >>> gemini_api_key = "your_api_key_here"
    >>> gemini_ai_model_name = "gemini-1.5-flash"
    >>> gemini_ai_config = {
    ...     "temperature": 1,
    ...     "top_p": 0.95,
    ...     "top_k": 64,
    ...     "max_output_tokens": 8192,
    ...     "response_mime_type": "text/plain",
    ... }

"""
input_path = os.path.join('assets','input')  #: Directory path for input files.
inputFiles = ['film-permits.csv']  #: List of file names to be processed.
output_path =  os.path.join('assets','output')  #: Directory path for output files.
logPath = "logs"  #: Directory path for log files.

# Gemini AI Configuration
gemini_api_key = ''  #: API key for Gemini AI model.
gemini_ai_model_name = ""  #: Name of the Gemini AI model.
gemini_ai_config = {  #: Configuration for the Gemini AI model.
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

open_ai_key=''
open_ai_model_name ="gpt-3.5-turbo"