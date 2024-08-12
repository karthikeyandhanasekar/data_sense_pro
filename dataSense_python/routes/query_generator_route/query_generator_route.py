# routes/custom_route.py
from flask import Blueprint, jsonify
import os 
from datetime import datetime
query_generator_route = Blueprint('query_generator_route', __name__)

@query_generator_route.route('/<string:domain>/<string:file_name>/<string:db_name>', methods=['GET'])
def generate_query(domain,file_name,db_name):
    try:
        from config.logger import logger
        from config.config import output_path
        from generals.general import get_file_name_without_extension
        from modules.query_generator import query_generator
        logger.info("summaring API")
        start_time = datetime.now()
        logger.info(f'Start At: {start_time}')
        input_file_path = os.path.join(output_path,get_file_name_without_extension(file_name), f'{get_file_name_without_extension(file_name)}_analysis.xlsx')
        logger.info(f"input path : {input_file_path}")
        query_details = {}
        sql_output_base_path = os.path.join(output_path,get_file_name_without_extension(file_name),'sql_queries')
        sql_file_path = os.path.join(sql_output_base_path,f"{get_file_name_without_extension(file_name)}_{db_name.lower()}.sql") 
        
        if os.path.exists(sql_file_path):
            logger.info(f"{db_name} sql file exists")
            with open(sql_file_path, 'r') as file:
                data = file.read()
                query_details[file_name] = []
                query_details[file_name].append({
                'title':f'{db_name}',
                # 'sql_file_path':sql_file_path,
                'query':data,
            })
            return jsonify({"query_details":query_details}),200
            
        
        if os.path.exists(input_file_path): 
            query_details = (query_generator(domain,file_name,input_file_path,output_path,db_name))
            return jsonify({"query_details":query_details}),200
        else:
            return jsonify({"message":"file not found"}),404
    except Exception as e:
        logger.error(f"Error at /query/ : {str(e)}")
        return jsonify({"error": str(e)}), 500  
    
    
@query_generator_route.route('/<string:file_name>', methods=['GET'])
def get_query_files(file_name):
    try:
        from config.logger import logger
        from config.config import output_path
        from generals.general import get_all_files,read_file_content,get_file_name_without_extension,get_file_name_without_extension
        
        sql_output_base_path = os.path.join(output_path,get_file_name_without_extension(file_name),'sql_queries')
        response={}
        
        for file in get_all_files(sql_output_base_path):
            response[get_file_name_without_extension(file)] = read_file_content(file)
        
        return jsonify({
            "query_files":response
        })
    except Exception as e:
        logger.error(f"Error at /query/ : {str(e)}")
        return jsonify({"error": str(e)}), 500  
