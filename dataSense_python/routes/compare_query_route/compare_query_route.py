# routes/custom_route.py
from flask import Blueprint, jsonify,request, redirect, url_for, send_from_directory
import os 
from datetime import datetime
compare_query_route = Blueprint('compare_query_route', __name__)



@compare_query_route.route('/', methods=['POST'])
def compare_query():
    try:
        from config.logger import logger
        from config.config import output_path
        from generals.general import create_directory,get_file_name_without_extension
        from core.gemini_ai import gen_ai_chat
        
        data =request.json
        
        prompt = f"""        
        Please generate a detailed HTML report comparing an automated SQL query and a manual SQL query for the `{data['engine']}` database. The report should include the following:

        ### Styling
        - Use basic formatting such as headings, lists, and tables to organize the report for clarity and readability.
        - Body <body> should be added with following style
            - color :"#000000"
            - background : transparent
            - page-break-before: always !important; 
            - page-break-after: always !important;
            -  line-height: 1.5
        - Heading (<h1>,<h2>,<h3>) should be styled with following style:
            - color :"#000000"
            - background : transparent
        - Code snippets (<pre>) should be clearly distinguishishable from regular text with the following style:
            - `white-space: pre-wrap`
            - `word-break: break-word`
            - `background: #0902c9`
            - `color: #ffffff`
            - `padding: 10px`
            - `border-radius: 5px`
            - `font-family: 'Courier New', Courier, monospace`
            - `overflow-x: auto`
            - `max-width: 100%`
            - Style warnings and issues with red font color.
            - Style recommendations with green font color.
            - Maintain a clean and simple overall style, focusing on clarity and readability.
        - Table (<table>)  should be clearly distinguishishable from regular text with the following style
            - margin: 0;
            - font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            - font-weight: 400;
            - font-size: 1rem;
            - line-height: 1.5;
            - letter-spacing: 0.00938em;
            - color: #000000;
            - background : transparent
            - border: 1px solid black;
            - border-collapse: collapse;
        - Table Cells (<th>,<tr>)  should be styled with following styles
            - border: 1px solid black;
            - border-collapse: collapse;
            - padding: 10px;
        - Table Row(<tr> ) should be styled   with following styles
            - color: #000000;
        - List <ul> should be styled with following styles
            - display: block;
            - list-style-type: disc;
            - margin-block-start: 1em;
            - margin-block-end: 1em;
            - margin-inline-start: 0px;
            - margin-inline-end: 0px;
            - padding-inline-start: 40px;
            - unicode-bidi: isolate;
        - List <li> should be styled with following styles
            - display: list-item;
            - text-align: -webkit-match-parent;
            - unicode-bidi: isolate;
            
        Content:
            - Automated Query : Add an automated Query given by user.
            - Manual Query : Add an manual Query given by user.
            - Column-Wise Comparison: Create a table comparing the columns in both queries. The table should have the following columns:
                - Column Name: The name of the column.
                - Automated Query - DataType: The data type of the column in the automated query.
                - Manual Query - DataType: The data type of the column in the manual query.
                - Automated Query - Length: The length of the column in the automated query.
                - Manual Query - Length: The length of the column in the manual query.
                - Automated Query - Constraint: Constraints applied to the column in the automated query.
                - Manual Query - Constraint: Constraints applied to the column in the manual query.
                - Changes: Differences or changes between the automated and manual queries for each column.
            - Warnings
                - List any potential issues or warnings found in the manual query. Use red font color for warnings.
            - Recommendations
                - Provide suggestions for improvements or corrections to the manual query. Use green font color for recommendations.
            - Issues
                - Describe any specific problems or issues found in the manual query. Use red font color for issues.
            - Corrected Manual Query
                Provide a revised version of the manual query based on the automated query.

        
        Details:
            - Engine: {data['engine']}
            - Automated Query: {data['autoMatedQuery']};
            - Manual Query: {data['manualQuery']}.
            - Format: The report should be in valid HTML format, including the <!DOCTYPE html> declaration. Style the report with basic formatting (headings, tables, code highlighting) to enhance readability.
        
        Final Report
            - Ensure the report is well-organized, easy to read, and follows the provided format for each section.
            - Include all the required details and ensure the comparison table accurately reflects differences between the queries.
        """
        response = gen_ai_chat(prompt)
                
        # Get the current date and time
        now = datetime.now()

        # Format the timestamp in a readable format (e.g., YYYYMMDD_HHMMSS)
        timestamp = now.strftime('%Y%m%d_%H%M%S')
        
        base_path = create_directory(os.path.join(output_path,get_file_name_without_extension(data['file_name']),'comparison_reports'))
        sql_output_base_path = (os.path.join(base_path,f"{get_file_name_without_extension(data['file_name'])}_query_comparison_report_{timestamp}.html"))

        print(sql_output_base_path)
        
        with open(sql_output_base_path, "w") as f:
            f.write(response)
            return jsonify({"is_comparison_success":True})
    
    except Exception as e:
        logger.error(f"Error at /query/ : {str(e)}")
        return jsonify({"error": str(e)}), 500 


    
    

@compare_query_route.route('/<string:directory>', methods=['GET'])
def get_query_files(directory):
    try:
        from config.logger import logger
        from generals.general import get_all_files,read_file_content,get_file_name_without_extension
        from config.config import output_path
        
        directory_path = os.path.join(output_path,get_file_name_without_extension(directory),'comparison_reports')
        response={}
        
        for file in get_all_files(directory_path):
            response[get_file_name_without_extension(file)] = read_file_content(file)
            
        
        return jsonify({
            "compare_files":response
        })
        
        
        
    except Exception as e:
        logger.error(f"Error at /query/ : {str(e)}")
        return jsonify({"error": str(e)}), 500
    
        
        