# routes/custom_route.py
from flask import Blueprint, jsonify,request, redirect, url_for, send_from_directory
import os 
import json
from datetime import datetime
import pandas as pd

profiler_route = Blueprint('profiler_route', __name__)





@profiler_route.route('/', methods=['POST'])
def profiler_process():
    try:
        from generals.general import get_file_name_without_extension, get_file_name_with_extension,format_timedelta
        from modules.data_profiler import process_file
        from config.logger import logger
        from config.config import input_path,output_path
        start_time = datetime.now()
        logger.info(f'Start At: {start_time}')
        file_names = request.json['file_names']
        if len(file_names) == 0:
            return jsonify({"error":"File path is empty"}),400
        for file in file_names:
            file_name = get_file_name_without_extension(file)
            file_input_path = os.path.join(input_path,file)
            
            output_dir =os.path.join(output_path , get_file_name_without_extension(file_name),f'{file_name}_analysis.xlsx')
            # data_profile_details,pattern_df_details
            if os.path.exists(output_dir):
                logger.info("Profiler file exists")
                data_profile_details = pd.read_excel(output_dir, sheet_name="Profile").to_json(orient='records', date_format='iso')
                data_profile_details = json.loads(data_profile_details)
                pattern_df_details = pd.read_excel(output_dir, sheet_name="Pattern_Frequency").to_json(orient='records', date_format='iso')
                pattern_df_details = json.loads(pattern_df_details)
            else:
                data_profile,pattern_df,output_excel_path = process_file(file_name,file_input_path,output_path)
                data_profile_details = json.loads(data_profile)
                pattern_df_details = json.loads(pattern_df)
        
        end_time = datetime.now()  
        logger.info(f'Ended At: {end_time}') 
        duration = end_time - start_time
        logger.info(f'Process Duration : {format_timedelta(duration)}') 
        
        return  jsonify({"pattern_df":pattern_df_details,"data_profile_details":data_profile_details,"file_names":file_names,"duration":format_timedelta(duration)}),200
    

        
    except Exception as e:
        logger.error(f"Error at /profiler : {str(e)}")
        return jsonify({"error": str(e)}), 500

    