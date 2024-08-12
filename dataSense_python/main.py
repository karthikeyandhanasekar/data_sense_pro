from flask import Flask
from flask_cors import CORS
from routes.upload.upload import custom_route
from routes.profiler_routes.profiler_routes import profiler_route
from routes.query_generator_route.query_generator_route import query_generator_route
from routes.download.download import download_route
from routes.compare_query_route.compare_query_route import compare_query_route
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes


app.register_blueprint(custom_route, url_prefix='/')
app.register_blueprint(profiler_route, url_prefix='/profiler')
app.register_blueprint(query_generator_route, url_prefix='/query')
app.register_blueprint(download_route, url_prefix='/download')
app.register_blueprint(compare_query_route, url_prefix='/compare')





@app.route('/')
def home():
    return "Hello, Flask with CORS!"

if __name__ == '__main__':
    app.run(debug=False)
