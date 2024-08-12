# routes/custom_route.py
from flask import Blueprint, jsonify,request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os 
from config.logger import logger
from config.config import input_path
custom_route = Blueprint('custom_route', __name__)
import pandas as pd
from datetime import datetime



ALLOWED_EXTENSIONS = {'xlsx', 'xls','csv'}



if not os.path.exists(input_path):
    os.makedirs(input_path)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@custom_route.route('/uploads', methods=['POST'])
def upload_files():
    try:
        from generals.general import get_file_name_with_extension
        if 'files' not in request.files:
            return jsonify({"error": "No files part"}), 400
        files = request.files.getlist('files')
        file_paths = []
        for file in files:
            if file.filename == '':
                continue
            if file and allowed_file(file.filename):
                filename = file.filename
                file_path = os.path.join(input_path, filename)
                file.save(file_path)
                file_paths.append(get_file_name_with_extension(file_path))
        if not file_paths:
            logger.info("No files were uploaded or files type not allowed")
            return jsonify({"error": "No files were uploaded or files type not allowed"}), 400
        logger.info("File Uploaded successfully")
        return jsonify({"message": "Files uploaded successfully",'file_names' :file_paths}), 200
    except Exception as e:
        logger.error(f"Error at /upload  : {str(e)}")
        return jsonify({"error": str(e)}), 500



@custom_route.route('/getFiles', methods=['GET'])
def get_input_files():
    try:
        from config.logger import logger
        from config.config import input_path
        from generals.general import get_excel_files_with_size,categorize_files
        response =  get_excel_files_with_size(input_path,'Profile')
        response = categorize_files(response)
        return jsonify({"file_details": response}),200
    except Exception as e:
        logger.error(f"Error at /getFiles  : {str(e)}")
        return jsonify({"error": str(e)}), 500
    
    
@custom_route.route('/getFiles/<string:domain>/<string:file_name>', methods=['GET'])
def get_file_details(domain,file_name):
    try:
        from config.logger import logger
        from config.config import input_path,output_path
        from generals.general import get_file_name_without_extension,format_bytes,clean_and_convert_to_html,format_timedelta
        start_time = datetime.now()
        logger.info(f'Start At: {start_time}')
        from modules.data_summarizer import summary_generator
        input_file_path =  os.path.join(input_path,file_name)
        
        if input_file_path.endswith('.xlsx'):
            engine = 'openpyxl'
        elif input_file_path.endswith('.xls'):
            engine = 'xlrd'
        else:
            engine=""
        if input_file_path.endswith('.xlsx') or input_file_path.endswith('.xls') :
            df = pd.read_excel(input_file_path, engine=engine)
        else:
            df =  pd.read_csv(input_file_path)
        
        rows, columns = df.shape
        
        input_file_path = os.path.join(output_path,get_file_name_without_extension(file_name), f'{get_file_name_without_extension(file_name)}_analysis.xlsx')

        profile_summary =(summary_generator(domain,file_name,input_file_path,output_path))

        end_time = datetime.now()  
        logger.info(f'Ended At: {end_time}') 
        duration = end_time - start_time
        logger.info(f'Process Duration : {format_timedelta(duration)}') 
        
        return jsonify({"rows":rows,"columns":columns,"fileSize":format_bytes(os.path.getsize(input_file_path)),"profile_summary":profile_summary,"duration":format_timedelta(duration) }),200
    except Exception as e:
        logger.error(f"Error at /getFiles  : {str(e)}")
        return jsonify({"error": str(e)}), 500