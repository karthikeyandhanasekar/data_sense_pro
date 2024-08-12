import os
import re
import pandas as pd
from datetime import timedelta
import getpass
import stat
import math
import html

def extract_create_table_query(response_text):
    # Use regular expressions to find the CREATE TABLE query
    pattern = re.compile(r"CREATE TABLE[\s\S]*?;\n", re.IGNORECASE)
    match = pattern.search(response_text)
    
    if match:
        create_table_query = match.group(0)
        return create_table_query.strip()
    else:
        return None

def extract_sql_queries(text):
    """
    Extracts SQL queries from a given text.

    Parameters:
    text (str): The text to extract SQL queries from.

    Returns:
    list: A list of extracted SQL queries.

    Example:
    >>> text = "CREATE TABLE users (id INT, name VARCHAR(255)); ALTER TABLE users ADD COLUMN email VARCHAR(255);"
    >>> extract_sql_queries(text)
    ['CREATE TABLE users (id INT, name VARCHAR(255));', 'ALTER TABLE users ADD COLUMN email VARCHAR(255);']
    """
    # Regular expression to match SQL queries (CREATE TABLE, ALTER TABLE, INSERT INTO)
    sql_pattern = re.compile(r"(--.*\n)?(CREATE TABLE.*?;|ALTER TABLE.*?;|INSERT INTO.*?;)", re.DOTALL)     
    # Find all matches
    matches = sql_pattern.findall(text)
    
    # Extract the full SQL statements from the matches
    sql_queries = [match[1].strip() for match in matches]
    
    return sql_queries

def get_file_name_without_extension(input_file_path):
    """
    Extracts the filename without the extension from the given file path.

    Parameters:
    input_file_path (str): The path to the input file.

    Returns:
    str: The filename without the extension.

    Example:
    >>> get_file_name_without_extension('/path/to/file.txt')
    'file'
    """
    try:
        from config.logger import logger
        return os.path.splitext(os.path.basename(input_file_path))[0]
    except Exception as e:
        logger.info(f"Error at getting file name for this path : {input_file_path}")
        logger.info(f"Error : {str(e)}")
        return False

def get_file_name_with_extension(file_path):
    return os.path.basename(file_path)


def format_timedelta(duration):
    """
    Formats a timedelta object into a string.

    Parameters:
    duration (timedelta): The timedelta object to format.

    Returns:
    str: A string representation of the timedelta object.

    Example:
    >>> duration = timedelta(hours=1, minutes=30, seconds=15)
    >>> format_timedelta(duration)
    '01:30:15'
    """
    total_seconds = int(duration.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"

def create_directory(path):
    """
    Creates a directory at the given path if it does not exist.

    Parameters:
    path (str): The path to the directory to create.

    Returns:
    str: The path to the created directory, or False if an error occurred.

    Example:
    >>> create_directory('/path/to/directory')
    '/path/to/directory'
    """
    try:
        from config.logger import logger
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)
            return path
        return path
    except Exception as e:
        logger.info(f"Error at creating directory : {str(e)}")
        return False

def is_column_empty(col):
    """
    Checks if a column is empty.

    Parameters:
    col (pd.Series): The column to check.

    Returns:
    bool: True if the column is empty, False otherwise.

    Example:
    >>> col = pd.Series([None, None, None])
    >>> is_column_empty(col)
    True
    """
    try:
        from config.logger import logger
        return col.isna().all()
    except Exception as e:
        logger.info(f"Error in checking if column is empty: {e}")
        return False

def get_permission_details(path):
    """
    Retrieves the permission details for the given path.

    Parameters:
    path (str): The path to retrieve permission details for.

    Returns:
    tuple: A tuple containing the current user and a dictionary of permission details.

    Example:
    >>> get_permission_details('/path/to/file')
    ('current_user', {'readable': True, 'writable': True, 'executable': False})
    """
    try:
        from config.logger import logger
        import os
        import stat
        import getpass
        mode = os.stat(path).st_mode
        current_user = getpass.getuser()
        permissions = {
            'readable': bool(mode & stat.S_IRUSR),
            'writable': bool(mode & stat.S_IWUSR),
            'executable': bool(mode & stat.S_IXUSR)
        }
        return current_user, permissions
    except Exception as e:
        logger.error(f"Error retrieving permissions for {path}: {str(e)}")
        return None
    

def parse_sql_query(query):
    """
    Parse the SQL query to extract columns and constraints.

    Parameters:
    query (str): SQL CREATE TABLE statement

    Returns:
    list: List of tuples containing column definitions (column name, data type, length/precision, constraints)
    """
    columns = []
    constraints = []
    
    lines = query.split("\n")
    for line in lines:
        line = line.strip().rstrip(',')
        if line.startswith("CREATE TABLE") or line.startswith(");"):
            continue
        elif line.startswith("CONSTRAINT"):
            constraints.append(line)
        else:
            parts = re.split(r'\s+', line, maxsplit=2)
            if len(parts) >= 2:
                column_name = parts[0]
                data_type = parts[1]
                constraints_line = parts[2] if len(parts) > 2 else ""
                
                # Extract length/precision if present
                length_match = re.search(r'\((.*?)\)', data_type)
                length = length_match.group(1) if length_match else ""
                data_type = re.sub(r'\(.*?\)', '', data_type)
                
                columns.append((column_name, data_type, length, constraints_line))
    
    return columns, constraints

def classify_constraints(data):
    """
    Classify constraints into Yes/No for various constraint types.

    Parameters:
    data (list): List of tuples containing column definitions and constraints

    Returns:
    DataFrame: DataFrame with classified constraints
    """
    # Create a DataFrame from the data
    df = pd.DataFrame(data, columns=["Column Name", "Data Type", "Length", "Constraints"])
    
    # Function to classify constraints with Yes/No
    def classify_constraints_yes_no(constraint):
        primary_key = 'Yes' if "PRIMARY KEY" in constraint else 'No'
        foreign_key = 'Yes' if "FOREIGN KEY" in constraint else 'No'
        not_null = 'Yes' if "NOT NULL" in constraint else 'No'
        unique = 'Yes' if "UNIQUE" in constraint else 'No'
        default = 'Yes' if "DEFAULT" in constraint else 'No'
        check = 'Yes' if "CHECK" in constraint else 'No'
        return pd.Series([primary_key, foreign_key, not_null, unique, default, check])

    # Apply classification function
    constraints_classified_yes_no = df["Constraints"].apply(classify_constraints_yes_no)

    # Rename the columns
    constraints_classified_yes_no.columns = ["Primary Key", "Foreign Key", "Not Null", "Unique", "Default", "Check"]

    # Replace NaN with 'No'
    constraints_classified_yes_no.fillna('No', inplace=True)

    # Combine with original DataFrame
    consolidated_df = pd.concat([df, constraints_classified_yes_no], axis=1)
    
    return consolidated_df


def consolidate_constraints(columns, constraints):
    """
    Consolidate table-level constraints into column definitions.

    Parameters:
    columns (list): List of tuples containing column definitions
    constraints (list): List of table-level constraints

    Returns:
    list: List of tuples containing consolidated column definitions
    """
    constraint_dict = {col[0]: col for col in columns}

    for constraint in constraints:
        match = re.search(r'\((.*?)\)', constraint)
        if match:
            cols_in_constraint = match.group(1).split(', ')
            for col in cols_in_constraint:
                col = col.strip()
                if col in constraint_dict:
                    constraint_dict[col] = (*constraint_dict[col][:-1], constraint_dict[col][-1] + " " + constraint)

    return list(constraint_dict.values())


def extract_html_content(text):
    # Extract HTML content using regex
    match = re.search(r'```html\n(.*?)```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    else:
        raise ValueError("No HTML content found in the provided text.")
    
    
def get_all_files(directory):
    # Get all file paths from the directory using os.walk
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            all_files.append(file_path)
    return all_files

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = file.read()
        return data
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None


# Function to categorize files based on domain extracted from file_name
def categorize_files(files_data):
    categorized_files = {}
    
    for file in files_data:
        # Extract domain (first word before the underscore)
        domain = file["file_name"].split("_")[0]
        
        # Add the file to the appropriate category
        if domain not in categorized_files:
            categorized_files[domain] = []
        categorized_files[domain].append(file)
    
    return categorized_files

def format_bytes(bytes):
    if bytes == 0:
        return "0 Bytes"
    k = 1024
    sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    i = int(math.floor(math.log(bytes) / math.log(k)))
    return f"{(bytes / math.pow(k, i)):.1f} {sizes[i]}"

def get_excel_files_with_size(directory,sheet_name):
    try:
        # Create a list to hold the file names and their sizes
        files_info = []
        # Walk through the directory
        for root, dirs, files in os.walk(directory):
            for file in files:
                # Check if the file is an Excel file
                if file.endswith('.xlsx') or file.endswith('.xls') or file.endswith(".csv"):
                    try:
                        file_path = os.path.join(root, file)

                        # Get the file size in bytes
                        file_size = os.path.getsize(file_path)

                        # Determine the appropriate engine based on the file extension
                        if file.endswith('.xlsx'):
                            engine = 'openpyxl'
                        elif file.endswith('.xls'):
                            engine = 'xlrd'
                        else:
                            engine=""  # Skip if it's not an Excel file
                        # Read the specific sheet of the Excel file
                        if file.endswith(".csv"):
                            df = pd.read_csv(file_path)
                        else:
                            df = pd.read_excel(file_path, engine=engine)
                        rows, columns = df.shape
                        # Append a tuple of (file name, file size, rows, columns) to the list
                        files_info.append({
                            'file_name' : file,
                            'rows':rows,
                            'columns':columns,
                            'file_size': format_bytes(file_size)
                            })
                    except Exception as e:
                        print(f"Error processing file {file_path}: {e}")

        return files_info
    except Exception as e:
        print(f"Error processing file {file}: {e}")

def clean_and_convert_to_html(summary):
    from html import escape

    """
    Convert a summary or text into an HTML format.

    Args:
    summary (str): The text summary to be converted into HTML.

    Returns:
    str: The HTML formatted string.
    """
    # Escape any special HTML characters to prevent XSS attacks
    escaped_summary = escape(summary)
    
    # Example of converting text to simple HTML
 # Example of converting text to simple HTML
    html_content = """
    <html>
    <head>
       <style>
           
        </style>
    </head>
    <body>
        <h1>Data Profile Summary</h1>
        <p>{}</p>
    </body>
    </html>
    """.format(escaped_summary.replace('\n', '<br/>'))

    return html_content

def format_timedelta(duration):
    """
    Formats a timedelta object into a string.

    Parameters:
    duration (timedelta): The timedelta object to format.

    Returns:
    str: A string representation of the timedelta object.

    Example:
    >>> duration = timedelta(hours=1, minutes=30, seconds=15)
    >>> format_timedelta(duration)
    '01:30:15'
    """
    total_seconds = int(duration.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"




def tabular_format(df):
    from tabulate import tabulate
    return tabulate(df, headers='keys', tablefmt='grid')
