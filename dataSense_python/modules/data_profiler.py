import pandas as pd
import re
from collections import Counter
import os

global file_name, input_file_path, output_dir

special_character_regex = r"""[!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×÷‰†‡•‣′″‱†††‡′″‴‵‶‷‸‹›※‼‽‾⁂⁉⁎⁏⁐⁑⁒⁓⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞⸀⸁⸂⸃⸄⸅⸆⸇⸈⸉⸊⸋⸌⸍⸎⸏⸐⸑⸒⸓⸔⸕⸖⸗⸘⸙⸚⸛⸜⸝⸞⸟∂∆∇∈∉∋∏∑−∕∗∘∙√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿¢£¥¤ƒ₣₤₥₦₧₨₩₪₫€₭₮₱₲₳₴₵           ​ ‱ˆˇˈˉˊˋˌˍˎˏːˑ˒˓˔˕˖˗˘˙˚˛˝˞˟ˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼┽┾┿╀╁╂╃╄╅╆╇╈╉╊╋■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯▰▱▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◉◊○◌◍◎●◐◑◒◓◔◕◖◗←↑→↓↔↕↖↗↘↙↚↛↜↝↞↟↠↡↢↣↤↥↦↧↨↩↪↫↬↭↮↯↰↱↲↳↴↵↶↷↸↹↺↻↼↽↾↿⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪]"""

def store_unique_list(col, value, output_dir,file_name):
    try:
        from config.logger import logger
        from generals.general import create_directory,get_file_name_without_extension
        output_excel_path = create_directory(output_dir + get_file_name_without_extension(file_name) + "/unique")
        os.makedirs(output_excel_path, exist_ok=True)
        with pd.ExcelWriter(os.path.join(output_excel_path, f'{file_name}_{col}_unique.xlsx')) as writer:
            pd.DataFrame(value).to_excel(writer, sheet_name=col, index=False)
    except Exception as e:
        logger.info(f"Error at unique_store_list : {str(e)}")

def map_dtype_to_sql(dtype):
    try:
        from config.logger import logger
        if pd.api.types.is_integer_dtype(dtype):
            return 'INTEGER'
        elif pd.api.types.is_float_dtype(dtype):
            return 'DECIMAL'
        elif pd.api.types.is_bool_dtype(dtype):
            return 'BOOLEAN'
        elif pd.api.types.is_datetime64_any_dtype(dtype):
            return 'DATETIME'
        elif pd.api.types.is_object_dtype(dtype):
            return 'STRING'
        else:
            return 'STRING'
    except Exception as e:
        logger.info(f"Error at unique_store_list : {str(e)}")

def find_unique_occurrences(df, column_name, output_dir,file_name):
    try:
        from config.logger import logger
        value_counts = df[column_name].value_counts()
        unique_occurrences = value_counts[value_counts == 1]
        # store_unique_list(column_name, unique_occurrences.index.tolist(), output_dir,file_name)
        return len(unique_occurrences)
    except Exception as e:
        logger.info(f"Error at find_unique_occurrences : {str(e)}")

def find_duplicate_occurrences(df, column_name):
    try:
        from config.logger import logger
        value_counts = df[column_name].value_counts()
        duplicate_occurrences = value_counts[value_counts > 1]
        return len(duplicate_occurrences)
    except Exception as e:
        logger.info(f"Error at find_duplicate_occurrences : {str(e)}")

def profile_column(input_df, col, output_dir,file_name):
    try:
        from config.logger import logger
        col_profile = {}
        col_profile['Name'] = col.name
        col_profile['Documented Datatype'] = map_dtype_to_sql(col.dtype)
        col_profile['#Unique'] = find_unique_occurrences(input_df, col.name, output_dir,file_name)
        col_profile['%Unique'] = round((col_profile['#Unique'] / len(col)) * 100, 2)
        col_profile['#Non-Distinct'] = find_duplicate_occurrences(input_df, col.name)
        col_profile['%Non-Distinct'] = 100 - col_profile['%Unique']
        col_profile['#Null'] = col.isnull().sum()
        col_profile['%Null'] = round((col.isnull().sum() / len(col)) * 100, 2)
        col_profile['#NotNull'] = len(col) - col_profile['#Null']
        col_profile['%NotNull'] = 100 - col_profile['%Null']
        if pd.api.types.is_integer_dtype(col) or pd.api.types.is_float_dtype(col) or pd.api.types.is_datetime64_any_dtype(col):
            col_profile['Minimum Value'] = col.dropna().min()
            col_profile['Maximum Value'] = col.dropna().max()
        elif pd.api.types.is_object_dtype(col):
            col_non_null = col.dropna().astype(str)
            min_length = col_non_null.str.len().min()
            max_length = col_non_null.str.len().max()
            col_profile['Minimum Value'] = col_non_null[col_non_null.str.len() == min_length].iloc[0] if min_length else None
            col_profile['Maximum Value'] = col_non_null[col_non_null.str.len() == max_length].iloc[0] if max_length else None
            if min_length > 0 and  min_length == max_length  :
               sorted_order =  input_df[col.name].sort_values().tolist()
               col_profile['Minimum Value'] =  sorted_order[0]
               col_profile['Maximum Value'] = sorted_order[-1]
               
                
        col_profile['Minimum Length'] = col.astype(str).str.len().min()
        col_profile['Maximum Length'] = col.astype(str).str.len().max()
        col_profile['#Blank'] = (col.astype(str).str.strip() == '').sum() if len(col) > 0 else len(col)
        col_profile['%Blank'] = (col_profile['#Blank'] / len(col)) * 100 if len(col) > 0 else 100
        ordered_col_profile = {
            'Column': col_profile['Name'],
            'Datatype': col_profile['Documented Datatype'],
            'Minimum Length': col_profile['Minimum Length'],
            'Minimum Value': col_profile['Minimum Value'],
            'Maximum Length': col_profile['Maximum Length'],
            'Maximum Value': col_profile['Maximum Value'],
            '#Unique': col_profile['#Unique'],
            '%Unique': col_profile['%Unique'],
            '#Non-Distinct': col_profile['#Non-Distinct'],
            '%Non-Distinct': col_profile['%Non-Distinct'],
            '#Null': col_profile['#Null'],
            '%Null': col_profile['%Null'],
            '#NotNull': col_profile['#NotNull'],
            '%NotNull': col_profile['%NotNull'],
            '#Blank': col_profile['#Blank'],
            '%Blank': col_profile['%Blank']
        }
        return ordered_col_profile
    except Exception as e:
        logger.info(f"Error at profile_column : {str(e)}")

def analyze_patterns(col, col_name,file_name):
    try:
        from config.logger import logger
        if col.empty:
            return pd.DataFrame(columns=['Column', 'Pattern', 'Frequency'])
        patterns = col.dropna().astype(str).apply(lambda x: re.sub(r'[A-Za-z]', 'X', re.sub(r'\d', '9', re.sub(special_character_regex, 'S', x))))
        frequency = Counter(patterns)
        sorted_frequency = dict(frequency.most_common())
        pattern_df = pd.DataFrame(list(sorted_frequency.items()), columns=['Pattern', 'Frequency'])
        pattern_df['Column'] = col_name
        pattern_df = pattern_df[['Column', 'Pattern', 'Frequency']]
        return pattern_df
    except Exception as e:
        logger.info(f"Error at analyze_patterns : {str(e)}")

def is_column_empty(col):
    return col.isnull().all()

def process_file(file_name,input_file_path, output_dir):
    try:
        from generals.general import create_directory,get_file_name_without_extension
        from config.logger import logger    
        profile_results = []
        pattern_results = []
        input_df = pd.read_csv(os.path.join(input_file_path))
        rows, columns = input_df.shape
        logger.info(f"No of columns: {columns}")
        logger.info(f"No of rows: {rows}")
        for col_name in input_df.columns:
            try:
                profile_results.append(profile_column(input_df, input_df[col_name], output_dir,file_name))
                pattern_results.append(analyze_patterns(input_df[col_name], col_name,file_name))
            except Exception as e:
                logger.info(f"Error in processing column {col_name}: {e}")
                
        profile_df = pd.DataFrame(profile_results)
        pattern_df = pd.concat(pattern_results, ignore_index=True)
        output_dir = create_directory(os.path.join(output_dir , get_file_name_without_extension(file_name))) 
        output_file_path = os.path.join(output_dir , f'{file_name}_analysis.xlsx')
        with pd.ExcelWriter(output_file_path) as writer:
            profile_df.to_excel(writer, sheet_name='Profile', index=False)
            pattern_df.to_excel(writer, sheet_name='Pattern_Frequency', index=False)
        logger.info(f"Profilling  results have been saved to {output_file_path}")
        return  profile_df.to_json(orient='records', date_format='iso'),pattern_df.to_json(orient='records', date_format='iso'), output_file_path
    except Exception as e:
        logger.info(f"Error at process_file : {e}")
        return False
