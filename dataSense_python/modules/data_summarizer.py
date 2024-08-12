import json
import pandas as pd
import openpyxl
import os
 
# Function to save the summary report to a text file
def save_summary_to_txt(file_path, response):
    try:
        
        from config.logger import logger
        # Ensure the directory exists
        
        with open(file_path, 'w') as file:
            file.write(response + '\n')
            logger.info(f"Summary report successfully created at {file_path}")
    except IOError as e:
        logger.info(f"IOError saving {file_path}: {e}")
    except Exception as e:
        logger.info(f"Error saving {file_path}: {e}")
 
# Function to generate a summary prompt for the CSV file
def generate_summary_prompt(domain,column_details):
    return f"""
   Draft a detailed summary report in 2-3 paragraphs for only the below columns in {domain} domain.
    Styling:
        For paragraphs, justify the text alignment,decrease indent,remove bulleting and numbering, remove padding, add a line height of 1.5, and ensure text wrap.
        Ensure the report is responsive across different devices.
        
    {column_details}
    Provide an output in HTML format using the paragraph tag and add an inline style of line height 1.5, text-align: justify, text-wrap: wrap for each paragraph. Ensure the content is responsive across various devices    """
 
def summary_generator(domain,file_name, input_csv_path, output_path): 
    try:
        from config.logger import logger
        from core.gemini_ai import gen_ai_chat
        from generals.general import tabular_format
        from generals.general import create_directory, get_file_name_without_extension
         # Read the specific sheet from the Excel file
        df = pd.read_excel(input_csv_path,engine='openpyxl', sheet_name="Profile")
        # Convert dataframe to string representation for the prompt
        
        path = create_directory(os.path.join(output_path , get_file_name_without_extension(file_name), 'summary_reports'))
        file_path = os.path.join(path ,f"{get_file_name_without_extension(file_name)}_summary.html")
 
        if os.path.exists(file_path):
            logger.info("Summary file exists")
            with open(file_path, 'r') as file:
                data = file.read()
                return (data)
        logger.info("summary file not exists")
        # Generate the summary prompt
        prompt = generate_summary_prompt(domain,tabular_format(df))
        # Get the response from the AI chat
        response = (gen_ai_chat(prompt))
 
        # Save the summary report to a text file
        save_summary_to_txt(file_path, response)
       
        logger.info(f"Summary report has been created and saved at {output_path}")
        return response
    except Exception as e:
        logger.info(f"Error in summary_generator: {str(e)}")
        return False