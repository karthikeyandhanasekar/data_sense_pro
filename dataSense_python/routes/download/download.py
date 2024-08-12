# routes/download_route.py
from flask import Blueprint, jsonify,send_file,send_from_directory
from openpyxl import load_workbook
from openpyxl.utils.exceptions import InvalidFileException

import os
download_route = Blueprint('download_route', __name__)




def is_file_corrupted(file_path):
    try:
        from config.logger import logger
        # Try to load the workbook to check for corruption
        load_workbook(file_path)
        return False
    except InvalidFileException as e:
        logger.info("Error at file corrupt ",str(e))
        
        return True



@download_route.route('/<string:file_name>', methods=['GET'])
def download_file(file_name):
    try:
        from config.logger import logger
        from config.logger import logger
        from config.config import output_path
        from generals.general import get_file_name_without_extension
        exact_file_name = f'{get_file_name_without_extension(file_name)}_analysis.xlsx'
        input_path = os.path.join(output_path, get_file_name_without_extension(file_name))
        input_file_path = os.path.join(input_path, exact_file_name)
        
        if os.path.exists(input_file_path):
            print(input_file_path)
            if is_file_corrupted(input_file_path):
                return jsonify({"error": "File is corrupted"}), 400
            # response = send_file(input_file_path, as_attachment=True)
            response = send_from_directory(input_path,exact_file_name)
            response.headers["Content-Disposition"] = f"attachment; filename={exact_file_name}"
            response.headers["Access-Control-Expose-Headers"] = "Content-Disposition"  # Expose the header
            return response
        else:
            logger.error(f"File {input_file_path} does not exist")
            return jsonify({"error": "File does not exist"}), 404
        
    except Exception as e:
        logger.error(f"Error at /download/ : {str(e)}")
        return jsonify({"error": str(e)}), 500

